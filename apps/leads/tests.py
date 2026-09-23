"""
apps/leads/tests.py
─────────────────────────────────────────────
Tests:
  - LeadCreateView (public)         : valid submit, invalid mobile, missing name
  - LeadAdminListView (JWT)         : list, filter by inquiry_type, search
  - LeadAdminDetailView (JWT)       : mark as contacted, delete
  - Auth guard                      : unauthenticated admin requests → 401
"""
from django.contrib.auth.models import User
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Lead


# ─── Helpers ──────────────────────────────────────────────────────────────────

def get_auth_header(user):
    """Return JWT Bearer token header dict for the given user."""
    refresh = RefreshToken.for_user(user)
    return {"HTTP_AUTHORIZATION": f"Bearer {str(refresh.access_token)}"}


VALID_LEAD = {
    "name":         "Rajesh Patel",
    "mobile":       "9876543210",
    "email":        "rajesh@test.com",
    "inquiry_type": "call_back",
    "message":      "Interested in 3BHK properties.",
}


# ─── Public Lead Submission ───────────────────────────────────────────────────

class LeadCreateTests(APITestCase):
    """Tests for POST /api/leads/"""

    def setUp(self):
        self.url = reverse("lead-create")

    # 1. Valid submission
    def test_valid_lead_creates_record(self):
        """Valid data → 201 + lead saved in DB."""
        response = self.client.post(self.url, VALID_LEAD, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertIn("lead_id", data)
        self.assertEqual(Lead.objects.count(), 1)
        lead = Lead.objects.first()
        self.assertEqual(lead.name, "Rajesh Patel")
        self.assertEqual(lead.mobile, "9876543210")

    # 2. Minimum required fields only
    def test_only_name_and_mobile_required(self):
        """Only name + mobile are required — all other fields optional."""
        response = self.client.post(
            self.url,
            {"name": "Suresh", "mobile": "8765432109"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Lead.objects.count(), 1)

    # 3. Missing name
    def test_missing_name_returns_400(self):
        """name is required — missing should return 400."""
        data = {**VALID_LEAD, "name": ""}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.json())

    # 4. Missing mobile
    def test_missing_mobile_returns_400(self):
        """mobile is required — missing should return 400."""
        data = {**VALID_LEAD, "mobile": ""}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("mobile", response.json())

    # 5. Invalid Indian mobile — too short
    def test_invalid_mobile_too_short_returns_400(self):
        """Mobile shorter than 10 digits should be rejected."""
        data = {**VALID_LEAD, "mobile": "98765"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("mobile", response.json())

    # 6. Invalid Indian mobile — starts with 0
    def test_invalid_mobile_starts_with_0_returns_400(self):
        """Mobile starting with 0 is not valid Indian format."""
        data = {**VALID_LEAD, "mobile": "0876543210"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # 7. Invalid inquiry type
    def test_invalid_inquiry_type_returns_400(self):
        """inquiry_type must be one of: call_back, site_visit, brochure, general."""
        data = {**VALID_LEAD, "inquiry_type": "WRONG"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # 8. Default inquiry_type is call_back
    def test_default_inquiry_type_is_call_back(self):
        """If inquiry_type not provided, it defaults to call_back."""
        data = {"name": "Anita", "mobile": "7654321098"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        lead = Lead.objects.first()
        self.assertEqual(lead.inquiry_type, "call_back")

    # 9. Mobile with +91 prefix is accepted
    def test_mobile_with_plus91_prefix_accepted(self):
        """Mobile in +919876543210 format should be accepted."""
        data = {**VALID_LEAD, "mobile": "+919876543210"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


# ─── Admin Lead List ──────────────────────────────────────────────────────────

class LeadAdminListTests(APITestCase):
    """Tests for GET /api/admin/leads/"""

    def setUp(self):
        self.admin = User.objects.create_superuser(
            username="admin", password="admin123", email="admin@test.com"
        )
        self.url = reverse("admin-lead-list")

        # Create sample leads
        Lead.objects.create(name="Lead 1", mobile="9000000001", inquiry_type="call_back")
        Lead.objects.create(name="Lead 2", mobile="9000000002", inquiry_type="site_visit")
        Lead.objects.create(name="Lead 3", mobile="9000000003", inquiry_type="brochure",
                            is_contacted=True)

    def _auth(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {str(RefreshToken.for_user(self.admin).access_token)}"
        )

    # 10. Admin can list leads
    def test_admin_can_list_leads(self):
        self._auth()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["pagination"]["count"], 3)

    # 11. Filter by inquiry_type
    def test_filter_by_inquiry_type(self):
        self._auth()
        response = self.client.get(self.url, {"inquiry_type": "call_back"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["pagination"]["count"], 1)

    # 12. Filter by is_contacted
    def test_filter_contacted(self):
        self._auth()
        response = self.client.get(self.url, {"is_contacted": "true"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["pagination"]["count"], 1)

    # 13. Search by name
    def test_search_by_name(self):
        self._auth()
        response = self.client.get(self.url, {"search": "Lead 2"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["pagination"]["count"], 1)

    # 14. Unauthenticated → 401
    def test_unauthenticated_returns_401(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


# ─── Admin Lead Detail (mark contacted / delete) ──────────────────────────────

class LeadAdminDetailTests(APITestCase):
    """Tests for GET/PATCH/DELETE /api/admin/leads/{id}/"""

    def setUp(self):
        self.admin = User.objects.create_superuser(
            username="admin2", password="admin123", email="admin2@test.com"
        )
        self.lead = Lead.objects.create(
            name="Priya Shah", mobile="9111111111", inquiry_type="general"
        )
        self.url = reverse("admin-lead-detail", kwargs={"pk": self.lead.pk})
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {str(RefreshToken.for_user(self.admin).access_token)}"
        )

    # 15. Mark as contacted
    def test_patch_mark_as_contacted(self):
        response = self.client.patch(self.url, {"is_contacted": True}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.lead.refresh_from_db()
        self.assertTrue(self.lead.is_contacted)

    # 16. Delete lead
    def test_delete_lead(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Lead.objects.count(), 0)

    # 17. GET lead detail
    def test_get_lead_detail(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["name"], "Priya Shah")
        self.assertEqual(data["mobile"], "9111111111")
