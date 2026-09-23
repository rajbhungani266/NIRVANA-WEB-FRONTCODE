"""
apps/core/tests.py
─────────────────────────────────────────────
Unit tests for:
  - validate_indian_mobile   (validators.py)
  - validate_positive_price  (validators.py)
  - validate_rera_number     (validators.py)
  - validate_meta_title      (validators.py)
  - validate_meta_description(validators.py)
  - validate_image_file      (validators.py)
  - validate_video_file      (validators.py)
  - validate_pdf_file        (validators.py)
  - calculate_read_time      (utils.py)
  - format_price_indian      (utils.py)
  - slugify_unique           (utils.py)
"""
import io

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from .validators import (
    validate_indian_mobile,
    validate_positive_price,
    validate_rera_number,
    validate_meta_title,
    validate_meta_description,
    validate_image_file,
    validate_video_file,
    validate_pdf_file,
)
from .utils import calculate_read_time, format_price_indian, slugify_unique


# ─── Mobile Validator ─────────────────────────────────────────────────────────

class IndianMobileValidatorTests(TestCase):

    # Valid formats
    def test_valid_10_digit_starting_9(self):
        validate_indian_mobile("9876543210")   # should not raise

    def test_valid_10_digit_starting_6(self):
        validate_indian_mobile("6543210987")

    def test_valid_10_digit_starting_7(self):
        validate_indian_mobile("7123456789")

    def test_valid_10_digit_starting_8(self):
        validate_indian_mobile("8000000001")

    def test_valid_with_plus91_prefix(self):
        validate_indian_mobile("+919876543210")

    def test_valid_with_91_prefix(self):
        validate_indian_mobile("919876543210")

    # Invalid formats
    def test_invalid_starts_with_0(self):
        with self.assertRaises(ValidationError):
            validate_indian_mobile("0876543210")

    def test_invalid_starts_with_1(self):
        with self.assertRaises(ValidationError):
            validate_indian_mobile("1234567890")

    def test_invalid_too_short(self):
        with self.assertRaises(ValidationError):
            validate_indian_mobile("98765")

    def test_invalid_too_long(self):
        with self.assertRaises(ValidationError):
            validate_indian_mobile("987654321099")

    def test_invalid_contains_letters(self):
        with self.assertRaises(ValidationError):
            validate_indian_mobile("9876ABCDE0")

    def test_invalid_empty_string(self):
        with self.assertRaises(ValidationError):
            validate_indian_mobile("")


# ─── Price Validator ──────────────────────────────────────────────────────────

class PriceValidatorTests(TestCase):

    def test_valid_positive_price(self):
        validate_positive_price(5000000)      # should not raise

    def test_valid_decimal_price(self):
        validate_positive_price(1234.50)

    def test_zero_price_raises(self):
        with self.assertRaises(ValidationError):
            validate_positive_price(0)

    def test_negative_price_raises(self):
        with self.assertRaises(ValidationError):
            validate_positive_price(-1000)

    def test_none_is_allowed(self):
        validate_positive_price(None)         # nullable field — should not raise


# ─── RERA Number Validator ────────────────────────────────────────────────────

class ReraNumberValidatorTests(TestCase):

    def test_valid_rera_number(self):
        validate_rera_number("PR/GJ/AHMEDABAD/01234/2024")   # should not raise

    def test_valid_minimum_length(self):
        validate_rera_number("PR/GJ/XXXX")   # exactly 10 chars

    def test_invalid_too_short(self):
        with self.assertRaises(ValidationError):
            validate_rera_number("SHORT")    # < 10 chars

    def test_empty_string_passes(self):
        validate_rera_number("")             # blank=True field, should not raise


# ─── SEO Meta Validators ──────────────────────────────────────────────────────

class MetaTitleValidatorTests(TestCase):

    def test_valid_title_under_70(self):
        validate_meta_title("Buy 3BHK in Ahmedabad")   # should not raise

    def test_exactly_70_chars_passes(self):
        validate_meta_title("A" * 70)

    def test_71_chars_raises(self):
        with self.assertRaises(ValidationError):
            validate_meta_title("A" * 71)

    def test_empty_string_passes(self):
        validate_meta_title("")   # optional field


class MetaDescriptionValidatorTests(TestCase):

    def test_valid_under_160(self):
        validate_meta_description("Good description " * 5)   # should not raise

    def test_exactly_160_chars_passes(self):
        validate_meta_description("A" * 160)

    def test_161_chars_raises(self):
        with self.assertRaises(ValidationError):
            validate_meta_description("A" * 161)

    def test_empty_string_passes(self):
        validate_meta_description("")


# ─── File Validators ──────────────────────────────────────────────────────────

def make_file(name, size_bytes=1024, content=b"data"):
    """Create a mock uploaded file."""
    content = content * (size_bytes // len(content) + 1)
    content = content[:size_bytes]
    return SimpleUploadedFile(name, content)


class ImageFileValidatorTests(TestCase):

    def test_valid_jpg(self):
        validate_image_file(make_file("photo.jpg"))   # should not raise

    def test_valid_jpeg(self):
        validate_image_file(make_file("photo.jpeg"))

    def test_valid_png(self):
        validate_image_file(make_file("photo.png"))

    def test_valid_webp(self):
        validate_image_file(make_file("photo.webp"))

    def test_invalid_gif_raises(self):
        with self.assertRaises(ValidationError):
            validate_image_file(make_file("photo.gif"))

    def test_invalid_pdf_as_image_raises(self):
        with self.assertRaises(ValidationError):
            validate_image_file(make_file("brochure.pdf"))

    def test_over_5mb_raises(self):
        big_file = make_file("big.jpg", size_bytes=6 * 1024 * 1024)   # 6 MB
        with self.assertRaises(ValidationError):
            validate_image_file(big_file)


class VideoFileValidatorTests(TestCase):

    def test_valid_mp4(self):
        validate_video_file(make_file("tour.mp4"))

    def test_valid_webm(self):
        validate_video_file(make_file("tour.webm"))

    def test_valid_mov(self):
        validate_video_file(make_file("tour.mov"))

    def test_invalid_avi_raises(self):
        with self.assertRaises(ValidationError):
            validate_video_file(make_file("tour.avi"))

    def test_invalid_mkv_raises(self):
        with self.assertRaises(ValidationError):
            validate_video_file(make_file("tour.mkv"))

    def test_over_200mb_raises(self):
        big_file = make_file("huge.mp4", size_bytes=201 * 1024 * 1024)
        with self.assertRaises(ValidationError):
            validate_video_file(big_file)


class PDFFileValidatorTests(TestCase):

    def test_valid_pdf(self):
        validate_pdf_file(make_file("brochure.pdf"))

    def test_invalid_doc_raises(self):
        with self.assertRaises(ValidationError):
            validate_pdf_file(make_file("brochure.docx"))

    def test_over_20mb_raises(self):
        big_file = make_file("huge.pdf", size_bytes=21 * 1024 * 1024)
        with self.assertRaises(ValidationError):
            validate_pdf_file(big_file)


# ─── Utils Tests ──────────────────────────────────────────────────────────────

class CalculateReadTimeTests(TestCase):

    def test_200_words_equals_1_minute(self):
        content = "word " * 200
        self.assertEqual(calculate_read_time(content), 1)

    def test_400_words_equals_2_minutes(self):
        content = "word " * 400
        self.assertEqual(calculate_read_time(content), 2)

    def test_empty_content_returns_1_minute(self):
        self.assertEqual(calculate_read_time(""), 1)

    def test_single_word_returns_1_minute(self):
        self.assertEqual(calculate_read_time("hello"), 1)

    def test_1000_words_returns_5_minutes(self):
        content = "word " * 1000
        self.assertEqual(calculate_read_time(content), 5)


class FormatPriceIndianTests(TestCase):

    def test_none_returns_price_on_request(self):
        self.assertEqual(format_price_indian(None), "Price on Request")

    def test_1_crore(self):
        result = format_price_indian(10_000_000)
        self.assertIn("Cr", result)

    def test_5_crore(self):
        result = format_price_indian(50_000_000)
        self.assertIn("Cr", result)
        self.assertIn("5.00", result)

    def test_50_lac(self):
        result = format_price_indian(5_000_000)
        self.assertIn("Lac", result)

    def test_under_1_lac(self):
        result = format_price_indian(50_000)
        self.assertIn("50,000", result)


class SlugifyUniqueTests(TestCase):

    def test_basic_slug(self):
        from apps.properties.models import Property
        slug = slugify_unique("Sky Residences", Property)
        self.assertEqual(slug, "sky-residences")

    def test_removes_special_characters(self):
        from apps.properties.models import Property
        slug = slugify_unique("The Ritz @ Ahmedabad!", Property)
        self.assertNotIn("@", slug)
        self.assertNotIn("!", slug)

    def test_unique_slug_with_counter(self):
        """Second call with same title should append -2."""
        from apps.properties.models import Property
        from apps.core.validators import validate_positive_price
        # Create a real property to force slug collision
        p = Property.objects.create(
            title="Unique Test",
            slug="unique-test",
            city="Ahmedabad",
            locality="SG Highway",
            listing_type="buy",
            property_type="residential",
        )
        slug2 = slugify_unique("Unique Test", Property)
        self.assertEqual(slug2, "unique-test-2")
