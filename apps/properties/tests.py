"""
apps/properties/tests.py
─────────────────────────────────────────────
Tests for PropertyCSVImportView:
  - Valid CSV → all rows imported
  - Mixed CSV → valid rows imported, invalid rows reported
  - No file → 400 error
  - Wrong file type → 400 error
  - Empty CSV → 400 error
  - Sample CSV download → 200 with csv attachment
"""
import io
import csv

from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Property


# ─── Helper ───────────────────────────────────────────────────────────────────

def make_csv(rows, headers=None, filename="test.csv"):
    """Build a SimpleUploadedFile CSV from a list of dicts."""
    buffer = io.StringIO()
    if not headers and rows:
        headers = list(rows[0].keys())
    writer = csv.DictWriter(buffer, fieldnames=headers)
    writer.writeheader()
    writer.writerows(rows)
    content = buffer.getvalue().encode("utf-8")
    return SimpleUploadedFile(filename, content, content_type="text/csv")


VALID_ROW_1 = {
    "title": "Test Property Alpha",
    "city": "Ahmedabad",
    "locality": "Prahlad Nagar",
    "listing_type": "buy",
    "property_type": "residential",
    "status": "active",
    "price": "5000000",
    "price_per_sqft": "8500",
    "developer_name": "Test Builders",
    "total_area_sqft": "25000",
    "possession_date": "2026-06-30",
    "address": "SG Highway, Ahmedabad",
    "rera_number": "",
    "is_rera_verified": "false",
    "is_featured": "true",
    "is_gift_city": "false",
    "is_zero_brokerage": "false",
    "is_exclusive": "false",
    "roi_potential": "",
    "rental_yield": "",
    "description": "Test property description.",
    "meta_title": "",
    "meta_description": "",
    "meta_keywords": "",
    "amenities": '["Gym","Pool"]',
    "highlights": '["RERA Verified"]',
}

VALID_ROW_2 = {
    **VALID_ROW_1,
    "title": "Test Property Beta",
    "locality": "Satellite",
    "price": "7500000",
}

INVALID_ROW_BAD_TYPE = {
    **VALID_ROW_1,
    "title": "Bad Listing Type",
    "listing_type": "WRONG_VALUE",   # Not a valid choice
}

INVALID_ROW_NO_TITLE = {
    **VALID_ROW_1,
    "title": "",                      # Required field missing
}

INVALID_ROW_BAD_JSON = {
    **VALID_ROW_1,
    "title": "Bad Amenities Property",
    "amenities": "Gym Pool Clubhouse",  # Not valid JSON
}


# ─── Test Cases ───────────────────────────────────────────────────────────────

class PropertyCSVImportTests(APITestCase):
    """Tests for POST /api/admin/properties/import/"""

    def setUp(self):
        """Create a superuser and get JWT token for authenticated requests."""
        self.user = User.objects.create_superuser(
            username="testadmin",
            password="testpass123",
            email="admin@test.com",
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}")
        self.import_url = reverse("admin-property-csv-import")
        self.sample_url = reverse("admin-property-csv-sample")

    # ── 1. All valid rows ─────────────────────────────────────────────────────
    def test_valid_csv_imports_all_rows(self):
        """All valid rows should be imported and count returned correctly."""
        response = self.client.post(
            self.import_url,
            {"file": make_csv([VALID_ROW_1, VALID_ROW_2])},
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertEqual(data["imported"], 2)
        self.assertEqual(data["failed"],   0)
        self.assertEqual(data["total"],    2)
        self.assertEqual(len(data["errors"]), 0)
        # Verify DB records created
        self.assertEqual(Property.objects.count(), 2)

    # ── 2. Mixed rows (partial success) ───────────────────────────────────────
    def test_mixed_csv_imports_valid_skips_invalid(self):
        """Valid rows should be saved; invalid rows reported without stopping import."""
        response = self.client.post(
            self.import_url,
            {"file": make_csv([VALID_ROW_1, INVALID_ROW_BAD_TYPE, VALID_ROW_2])},
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_207_MULTI_STATUS)
        data = response.json()
        self.assertEqual(data["imported"], 2)
        self.assertEqual(data["failed"],   1)
        self.assertEqual(data["total"],    3)
        self.assertEqual(Property.objects.count(), 2)

    # ── 3. All rows invalid ───────────────────────────────────────────────────
    def test_all_invalid_rows_returns_207(self):
        """If all rows fail, 0 imported with all errors listed."""
        response = self.client.post(
            self.import_url,
            {"file": make_csv([INVALID_ROW_BAD_TYPE, INVALID_ROW_NO_TITLE])},
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_207_MULTI_STATUS)
        data = response.json()
        self.assertEqual(data["imported"], 0)
        self.assertEqual(data["failed"],   2)
        self.assertEqual(Property.objects.count(), 0)

    # ── 4. Invalid JSON in amenities ──────────────────────────────────────────
    def test_invalid_json_field_reported_as_error(self):
        """Rows with invalid JSON in amenities should be reported as failed."""
        response = self.client.post(
            self.import_url,
            {"file": make_csv([INVALID_ROW_BAD_JSON])},
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_207_MULTI_STATUS)
        data = response.json()
        self.assertEqual(data["imported"], 0)
        self.assertEqual(data["failed"],   1)
        self.assertIn("amenities", data["errors"][0]["errors"])

    # ── 5. No file attached ───────────────────────────────────────────────────
    def test_missing_file_returns_400(self):
        """Request without a file should return 400."""
        response = self.client.post(self.import_url, {}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.json())

    # ── 6. Wrong file extension ───────────────────────────────────────────────
    def test_non_csv_file_returns_400(self):
        """Uploading a non-.csv file should return 400."""
        fake_file = SimpleUploadedFile("properties.xlsx", b"some text data", content_type="application/octet-stream")
        response = self.client.post(
            self.import_url,
            {"file": fake_file},
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.json())

    # ── 7. Empty CSV (header only) ────────────────────────────────────────────
    def test_empty_csv_returns_400(self):
        """A CSV with only headers and no data rows should return 400."""
        empty = SimpleUploadedFile("empty.csv", b"title,city,locality,listing_type,property_type\n", content_type="text/csv")
        response = self.client.post(
            self.import_url,
            {"file": empty},
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.json())

    # ── 8. Unauthenticated request ────────────────────────────────────────────
    def test_unauthenticated_request_returns_401(self):
        """Without a JWT token, request should be rejected."""
        self.client.credentials()   # Remove auth header
        response = self.client.post(
            self.import_url,
            {"file": make_csv([VALID_ROW_1])},
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ── 9. Duplicate slug handling ────────────────────────────────────────────
    def test_duplicate_title_row_handled_gracefully(self):
        """
        Same title imported twice — Property.save() auto-generates a unique slug
        (e.g. 'test-property-alpha-2'), so both rows should import successfully.
        """
        self.client.post(
            self.import_url,
            {"file": make_csv([VALID_ROW_1], filename="first.csv")},
            format="multipart",
        )
        response = self.client.post(
            self.import_url,
            {"file": make_csv([VALID_ROW_1], filename="second.csv")},
            format="multipart",
        )
        # Both should succeed since slug is auto-uniquified
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Property.objects.count(), 2)

    # ── 10. Sample CSV download ───────────────────────────────────────────────
    def test_sample_csv_download(self):
        """GET /import/sample/ should return a downloadable CSV file."""
        response = self.client.get(self.sample_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response["Content-Type"], "text/csv")
        self.assertIn("attachment", response["Content-Disposition"])
        self.assertIn("properties_sample.csv", response["Content-Disposition"])
        # Verify it's valid CSV with at least 2 rows (header + 1 sample row)
        content = response.content.decode("utf-8")
        reader  = csv.reader(io.StringIO(content))
        rows    = list(reader)
        self.assertGreaterEqual(len(rows), 2)
        self.assertIn("title", rows[0])
