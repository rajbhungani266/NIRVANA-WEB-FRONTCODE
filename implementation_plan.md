# Real Estate Backend — Django REST API Plan

## Overview
Aap ek **solo agent** hain jo apni listings public ko dikhana chahte hain (NirvanaSpace style). Backend sirf APIs provide karega — Next.js frontend already bana hua hai. SEO ke liye Blog bhi hoga.

---

## Folder Structure

```
Backend/
├── venv/                        ← already exists
├── manage.py
├── requirements.txt
├── .env                         ← secrets
├── config/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── properties/              ← listings, images, floor plans, BHK configs
│   ├── leads/                   ← inquiry forms (call back, site visit, brochure)
│   ├── blog/                    ← blog posts for SEO
│   └── core/                    ← JWT auth, pagination, validators, utils
└── media/                       ← uploaded images/brochures
```

---

## Apps & Models

### 1. `properties` App
**Property Model:**
| Field | Type | Notes |
|---|---|---|
| title | CharField | e.g. "The Sky Residences" |
| slug | AutoSlugField | SEO URL |
| listing_type | CharField | buy / rent / investment / plots |
| property_type | CharField | residential / commercial / new_launch / plot |
| status | CharField | active / sold_out / price_on_request |
| city | CharField | Ahmedabad / Gift City |
| locality | CharField | Sindhubhavan Road |
| address | TextField | Full address |
| rera_number | CharField | nullable |
| is_rera_verified | BooleanField | |
| price | DecimalField | nullable (for Price on Request) |
| price_per_sqft | DecimalField | nullable |
| developer_name | CharField | e.g. "Sobha Group" |
| possession_date | DateField | |
| roi_potential | DecimalField | 14% |
| rental_yield | DecimalField | 5.6% |
| is_featured | BooleanField | Featured Opportunities section |
| is_gift_city | BooleanField | Gift City filter |
| description | TextField | Full property description |
| amenities | JSONField | list of amenities |
| meta_title | CharField | SEO |
| meta_description | CharField | SEO |
| meta_keywords | CharField | SEO |
| brochure | FileField | PDF upload |
| created_at / updated_at | DateTimeField | |

**PropertyImage Model:** (multiple images per property)
- property (FK), image, alt_text, order

**BHKConfiguration Model:** (per BHK unit)
- property (FK), bhk_type (1BHK/2BHK/3BHK), area_sqft, super_builup_area, price, status

**FloorPlan Model:**
- property (FK), bhk_type, image, alt_text

### 2. `leads` App
**Lead Model:**
| Field | Notes |
|---|---|
| property (FK, nullable) | Which property (optional) |
| name | required |
| mobile | Indian phone (+91, 10-digit), required |
| email | optional |
| inquiry_type | call_back / site_visit / brochure / general |
| message | optional |
| is_contacted | Admin tracking |
| created_at | |

### 3. `blog` App
**BlogPost Model:**
| Field | Notes |
|---|---|
| title | |
| slug | SEO URL |
| content | Full HTML/Markdown |
| excerpt | Short summary |
| featured_image | |
| is_published | |
| published_at | |
| read_time | auto-calculated |
| tags | |
| meta_title | SEO |
| meta_description | SEO |
| meta_keywords | SEO |

---

## API Endpoints

### Properties
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/properties/` | ❌ | List with filters + pagination |
| GET | `/api/properties/{slug}/` | ❌ | Property detail |
| GET | `/api/properties/featured/` | ❌ | Featured listings |
| POST | `/api/admin/properties/` | ✅ JWT | Create listing |
| PATCH | `/api/admin/properties/{id}/` | ✅ JWT | Update listing |
| DELETE | `/api/admin/properties/{id}/` | ✅ JWT | Delete listing |
| POST | `/api/admin/properties/{id}/images/` | ✅ JWT | Upload images |

### Search (SEO Optimized)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/search/?q=&city=&locality=&listing_type=&property_type=&bhk=&min_price=&max_price=&possession_before=&is_rera_verified=&sort=` | Full-text search with all filters |

### Leads
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/leads/` | ❌ | Submit inquiry |
| GET | `/api/admin/leads/` | ✅ JWT | View all leads |
| PATCH | `/api/admin/leads/{id}/` | ✅ JWT | Mark as contacted |

### Blog
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/blog/` | ❌ | List posts (paginated) |
| GET | `/api/blog/{slug}/` | ❌ | Post detail |
| POST | `/api/admin/blog/` | ✅ JWT | Create post |
| PATCH | `/api/admin/blog/{id}/` | ✅ JWT | Update post |

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login/` | Get JWT access + refresh token |
| POST | `/api/auth/refresh/` | Refresh access token |

---

## Packages
```
django
djangorestframework
djangorestframework-simplejwt   ← JWT auth
django-cors-headers              ← Next.js ke liye
python-dotenv                    ← .env support
Pillow                           ← image upload
django-filter                    ← powerful filtering
```

## Validation Highlights
- Mobile: Indian 10-digit regex `^[6-9]\d{9}$`
- Price: must be positive
- Slug: auto-generated from title (unique)
- Images: file type & size check
- RERA number: format validation
- Pagination: default 12 per page (configurable)
- SEO fields: meta_description max 160 chars

## Verification Plan
- Test all endpoints via API
- Search filtering accuracy
- Image upload works
- Lead form validation (invalid mobile rejected)
- JWT protected admin routes return 401 without token
