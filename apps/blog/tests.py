"""
apps/blog/tests.py
─────────────────────────────────────────────
Tests:
  - BlogPostListView  : only published, tag filter, search
  - BlogPostDetailView: published slug works, draft is 404
  - BlogAdminListCreateView: create post, list all (incl. drafts)
  - BlogAdminDetailView: update, delete, publish a draft
  - read_time auto-calculation
  - slug auto-generation
  - Auth guard: unauthenticated admin → 401
"""
from django.contrib.auth.models import User
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import BlogPost


# ─── Helpers ──────────────────────────────────────────────────────────────────

def make_post(title="Test Post", published=True, tags=""):
    """Create and return a BlogPost instance."""
    post = BlogPost.objects.create(
        title=title,
        content="This is the content of the blog post. " * 20,  # ~40 words
        is_published=published,
        tags=tags,
    )
    return post


def admin_token(user):
    return f"Bearer {str(RefreshToken.for_user(user).access_token)}"


# ─── Public Blog List ─────────────────────────────────────────────────────────

class BlogPostListTests(APITestCase):
    """Tests for GET /api/blog/"""

    def setUp(self):
        self.url = reverse("blog-list")
        self.published1 = make_post("Ahmedabad Investment Guide", tags="Ahmedabad,Investment")
        self.published2 = make_post("Gift City Complete Guide",   tags="Gift City,Investment")
        self.draft      = make_post("Unpublished Draft",          published=False)

    # 1. Only published posts visible
    def test_only_published_posts_returned(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["pagination"]["count"], 2)  # draft excluded

    # 2. Filter by tag
    def test_filter_by_tag(self):
        response = self.client.get(self.url, {"tag": "Gift City"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["pagination"]["count"], 1)

    # 3. Search by title
    def test_search_by_title(self):
        response = self.client.get(self.url, {"search": "Ahmedabad"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["pagination"]["count"], 1)

    # 4. Pagination present
    def test_response_has_pagination_keys(self):
        response = self.client.get(self.url)
        data = response.json()
        self.assertIn("pagination", data)
        self.assertIn("results",   data)
        pagination = data["pagination"]
        self.assertIn("count",       pagination)
        self.assertIn("total_pages", pagination)
        self.assertIn("current_page",pagination)
        self.assertIn("next",        pagination)
        self.assertIn("previous",    pagination)


# ─── Public Blog Detail ───────────────────────────────────────────────────────

class BlogPostDetailTests(APITestCase):
    """Tests for GET /api/blog/{slug}/"""

    def setUp(self):
        self.published = make_post("RERA Act Explained")
        self.draft     = make_post("Secret Draft Post", published=False)

    # 5. Published post accessible
    def test_published_post_returns_200(self):
        url = reverse("blog-detail", kwargs={"slug": self.published.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["title"], "RERA Act Explained")

    # 6. Draft post returns 404 (not found in public queryset)
    def test_draft_post_returns_404(self):
        url = reverse("blog-detail", kwargs={"slug": self.draft.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # 7. Non-existent slug returns 404
    def test_invalid_slug_returns_404(self):
        url = reverse("blog-detail", kwargs={"slug": "this-does-not-exist"})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # 8. Detail includes content field
    def test_detail_includes_content(self):
        url = reverse("blog-detail", kwargs={"slug": self.published.slug})
        response = self.client.get(url)
        data = response.json()
        self.assertIn("content", data)
        self.assertIn("meta_title", data)
        self.assertIn("meta_description", data)


# ─── Admin Blog Create / List ─────────────────────────────────────────────────

class BlogAdminCreateTests(APITestCase):
    """Tests for POST/GET /api/admin/blog/"""

    def setUp(self):
        self.admin = User.objects.create_superuser(
            username="blogadmin", password="admin123", email="blog@test.com"
        )
        self.url = reverse("admin-blog-list")
        self.client.credentials(HTTP_AUTHORIZATION=admin_token(self.admin))

        # Pre-create a published + a draft
        make_post("Published Post")
        make_post("Draft Post", published=False)

    # 9. Admin sees all posts (incl. drafts)
    def test_admin_list_includes_drafts(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["pagination"]["count"], 2)

    # 10. Create a new post
    def test_admin_can_create_post(self):
        payload = {
            "title":        "New Investment Blog Post",
            "content":      "Content here " * 50,
            "is_published": False,
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertEqual(data["title"], "New Investment Blog Post")
        # Slug auto-generated
        self.assertTrue(data["slug"])
        # Verify DB record has read_time calculated
        from .models import BlogPost
        post = BlogPost.objects.get(slug=data["slug"])
        self.assertGreaterEqual(post.read_time, 1)

    # 11. Title is required
    def test_missing_title_returns_400(self):
        response = self.client.post(
            self.url,
            {"content": "Some content", "is_published": False},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.json())

    # 12. Unauthenticated create → 401
    def test_unauthenticated_returns_401(self):
        self.client.credentials()
        response = self.client.post(
            self.url,
            {"title": "Hack", "content": "x"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


# ─── Admin Blog Update / Delete / Publish ────────────────────────────────────

class BlogAdminDetailTests(APITestCase):
    """Tests for PATCH/DELETE /api/admin/blog/{id}/"""

    def setUp(self):
        self.admin = User.objects.create_superuser(
            username="blogadmin2", password="admin123", email="blog2@test.com"
        )
        self.post  = make_post("Original Title", published=False)
        self.url   = reverse("admin-blog-detail", kwargs={"pk": self.post.pk})
        self.client.credentials(HTTP_AUTHORIZATION=admin_token(self.admin))

    # 13. Patch title
    def test_patch_title(self):
        response = self.client.patch(self.url, {"title": "Updated Title"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.post.refresh_from_db()
        self.assertEqual(self.post.title, "Updated Title")

    # 14. Publish a draft
    def test_publish_draft_post(self):
        self.assertFalse(self.post.is_published)
        response = self.client.patch(self.url, {"is_published": True}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.post.refresh_from_db()
        self.assertTrue(self.post.is_published)

    # 15. Delete a post
    def test_delete_post(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(BlogPost.objects.count(), 0)


# ─── Model Behaviour ──────────────────────────────────────────────────────────

class BlogPostModelTests(APITestCase):
    """Model-level: slug auto-generation, read_time calculation."""

    # 16. Slug auto-generated from title
    def test_slug_auto_generated(self):
        post = BlogPost.objects.create(
            title="How to Invest in Ahmedabad Real Estate",
            content="Content " * 10,
        )
        self.assertTrue(post.slug)
        self.assertIn("how-to-invest", post.slug)

    # 17. Duplicate title gets unique slug
    def test_duplicate_title_gets_unique_slug(self):
        post1 = BlogPost.objects.create(title="Same Title", content="Content " * 10)
        post2 = BlogPost.objects.create(title="Same Title", content="Content " * 10)
        self.assertNotEqual(post1.slug, post2.slug)

    # 18. read_time auto-calculated
    def test_read_time_calculated(self):
        # ~200 words → 1 minute read at 200 wpm
        content = "word " * 200
        post = BlogPost.objects.create(title="Read Time Test", content=content)
        self.assertGreaterEqual(post.read_time, 1)

    # 19. meta_title defaults to title (truncated to 70)
    def test_meta_title_defaults_to_title(self):
        post = BlogPost.objects.create(title="Short Title", content="Content " * 10)
        self.assertEqual(post.meta_title, "Short Title")

    # 20. tag_list property splits comma-separated tags
    def test_tag_list_property(self):
        post = BlogPost.objects.create(
            title="Tag Test", content="Content",
            tags="Ahmedabad, Investment, RERA"
        )
        self.assertEqual(post.tag_list, ["Ahmedabad", "Investment", "RERA"])
