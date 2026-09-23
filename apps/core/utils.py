"""
apps/core/utils.py
─────────────────────────────────────────────
Shared utility functions used across all apps.
"""
import re
import math


def slugify_unique(title: str, model_class, instance_id=None) -> str:
    """
    Generate a unique slug from title.
    If slug already exists, append a number: my-property-2, my-property-3
    Handles edge cases like non-ASCII strings and concurrent collisions.
    """
    import uuid
    base_slug = re.sub(r"[^\w\s-]", "", (title or "").lower())
    base_slug = re.sub(r"[\s_-]+", "-", base_slug).strip("-")
    if not base_slug:
        base_slug = f"item-{uuid.uuid4().hex[:6]}"

    slug = base_slug
    counter = 2
    qs = model_class.objects.filter(slug=slug)
    if instance_id:
        qs = qs.exclude(id=instance_id)

    max_tries = 100
    while qs.exists() and counter <= max_tries:
        slug = f"{base_slug}-{counter}"
        counter += 1
        qs = model_class.objects.filter(slug=slug)
        if instance_id:
            qs = qs.exclude(id=instance_id)

    if qs.exists():
        slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"

    return slug


def calculate_read_time(content: str) -> int:
    """
    Estimate read time in minutes based on average 200 words/minute.
    Returns minimum 1 minute.
    """
    word_count = len(content.split())
    minutes = math.ceil(word_count / 200)
    return max(1, minutes)


def format_price_indian(price) -> str:
    """
    Format price in Indian format: Lac, Cr.
    e.g. 9152000 → '91.52 Lac', 41000000 → '4.1 Cr'
    """
    if price is None:
        return "Price on Request"

    price = float(price)
    if price >= 10_000_000:  # 1 Crore
        return f"₹{price / 10_000_000:.2f} Cr"
    elif price >= 100_000:   # 1 Lac
        return f"₹{price / 100_000:.2f} Lac"
    else:
        return f"₹{price:,.0f}"
