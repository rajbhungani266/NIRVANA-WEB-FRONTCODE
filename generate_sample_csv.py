"""
generate_sample_csv.py
──────────────────────
50 properties cover karta hai:
  - 15 Residential (buy/rent)
  - 10 Commercial
  - 10 Weekend Homes (new_launch + SG Highway / Nalsarovar area)
  - 10 Gift City
  -  5 Plots

Run: python generate_sample_csv.py
Output: sample_50_properties.csv
"""

import csv
import random

HEADERS = [
    "title", "city", "locality", "listing_type", "property_type",
    "slug", "status", "price", "price_per_sqft", "developer_name",
    "total_area_sqft", "possession_date", "address", "rera_number",
    "is_rera_verified", "is_featured", "is_gift_city", "is_zero_brokerage",
    "is_exclusive", "roi_potential", "rental_yield", "description",
    "meta_title", "meta_description", "meta_keywords",
    "amenities", "highlights",
]

DEVELOPERS = [
    "Shivalik Group", "Safal Group", "Goyal & Co", "Adani Realty",
    "Aavkar Group", "Patel Corporation", "Sun Builders", "Sambhaav Group",
    "Narayan Infra", "Rajdeep Realty",
]

AHMEDABAD_LOCALITIES = [
    "Prahlad Nagar", "Satellite", "Bodakdev", "Vastrapur",
    "Thaltej", "Ambli", "South Bopal", "Shela",
]

WEEKENDHOUSE_LOCALITIES = [
    "Nalsarovar", "Nal Sarovar", "Shantigram", "Koba",
    "Bopal", "Shilaj", "Sanand", "Bavla",
]

GIFTCITY_LOCALITIES = [
    "Gift City", "Gandhinagar Sector 16", "Gift City Phase 1",
    "Gift City Phase 2",
]

COMMERCIAL_LOCALITIES = [
    "SG Highway", "Ashram Road", "CG Road", "Makarba",
    "Prahlad Nagar", "Prahladnagar Road",
]

PLOT_LOCALITIES = [
    "Bavla", "Sanand", "Dholka", "Dholera SIR", "Vavol",
]

AMENITIES_POOL = [
    "Swimming Pool", "Gymnasium", "Clubhouse", "Children Play Area",
    "Jogging Track", "24/7 Security", "Power Backup", "Amphitheater",
    "Co-working Space", "Rooftop Garden", "Tennis Court", "Indoor Games",
    "Multiplex", "Shopping Complex", "Guest Suites",
]

def pick_amenities(n=5):
    sample = random.sample(AMENITIES_POOL, n)
    return '["' + '","'.join(sample) + '"]'

def pick_highlights(*items):
    return '["' + '","'.join(items) + '"]'

rows = []

# ──────────────────────────────────────────────────────────────
# 1. RESIDENTIAL (15 rows) — mix of buy / rent
# ──────────────────────────────────────────────────────────────
residential_data = [
    # (title, locality, listing_type, bhk_hint, price, psf, area, possession, rera, dev_idx, featured, zero_brok, exclusive, roi, rental, desc_hint)
    ("Sky Residences 3BHK", "Prahlad Nagar", "buy",  "3BHK", 8500000,  7500, 25000, "2026-12-31", "PR/GJ/AHMD/12345/2024", 0, "true",  "true",  "false", "14.5", "5.6",  "Premium 3BHK near SG Highway"),
    ("Green Valley 2BHK",   "Satellite",     "buy",  "2BHK", 5500000,  6800, 18000, "2026-09-30", "PR/GJ/AHMD/23456/2024", 1, "false", "false", "false", "",     "",     "Affordable 2BHK in Satellite"),
    ("Sunflower Heights 4BHK","Bodakdev",    "buy",  "4BHK", 14000000, 9200, 35000, "2027-03-31", "PR/GJ/AHMD/34567/2024", 2, "true",  "false", "true",  "16.0", "",     "Luxury 4BHK in Bodakdev"),
    ("Maple Grove 2BHK",    "Vastrapur",     "rent", "2BHK", 35000,    "",   "",    "",           "",                       3, "false", "true",  "false", "",     "5.2",  "Fully furnished 2BHK for rent"),
    ("Crystal Tower 3BHK",  "Thaltej",       "buy",  "3BHK", 7800000,  8100, 22000, "2026-06-30", "PR/GJ/AHMD/45678/2024", 4, "true",  "false", "false", "13.0", "5.5",  "3BHK near Thaltej Metro"),
    ("Palm Springs 1BHK",   "Ambli",         "buy",  "1BHK", 3200000,  5900, 12000, "2026-03-31", "PR/GJ/AHMD/56789/2024", 5, "false", "true",  "false", "",     "",     "Budget 1BHK in Ambli"),
    ("Orchid Residency 3BHK","South Bopal",  "buy",  "3BHK", 6500000,  7200, 20000, "2027-06-30", "PR/GJ/AHMD/67890/2024", 6, "false", "false", "false", "",     "",     "3BHK in South Bopal"),
    ("Emerald Heights 4BHK","Bodakdev",      "buy",  "4BHK", 18000000, 9800, 42000, "2027-12-31", "PR/GJ/AHMD/78901/2024", 7, "true",  "false", "true",  "18.0", "6.0",  "Ultra-luxury 4BHK"),
    ("Blue Bells 2BHK",     "Shela",         "buy",  "2BHK", 4800000,  6500, 16000, "2026-06-30", "PR/GJ/AHMD/89012/2024", 8, "false", "true",  "false", "",     "",     "2BHK in growing Shela area"),
    ("Silver Oak 3BHK",     "Prahlad Nagar", "rent", "3BHK", 55000,    "",   "",    "",           "",                       9, "false", "false", "false", "",     "",     "Semi-furnished 3BHK on rent"),
    ("Lotus Enclave 2BHK",  "Satellite",     "buy",  "2BHK", 6200000,  7800, 19000, "2026-12-31", "PR/GJ/AHMD/90123/2024", 0, "false", "false", "false", "",     "",     "2BHK near satellite area"),
    ("Pinnacle Tower 5BHK", "Vastrapur",     "buy",  "5BHK", 28000000, 11000,52000, "2028-03-31", "PR/GJ/AHMD/01234/2024", 1, "true",  "false", "true",  "20.0", "",     "Penthouse-style 5BHK"),
    ("Harmony Homes 2BHK",  "Thaltej",       "buy",  "2BHK", 5200000,  7000, 17000, "2026-09-30", "PR/GJ/AHMD/11111/2024", 2, "false", "true",  "false", "",     "",     "Vastu-compliant 2BHK"),
    ("Royal Garden 3BHK",   "Ambli",         "rent", "3BHK", 45000,    "",   "",    "",           "",                       3, "false", "false", "false", "",     "4.8",  "3BHK garden-facing flat for rent"),
    ("Vista Homes 2BHK",    "South Bopal",   "buy",  "2BHK", 4500000,  6200, 15000, "2026-06-30", "PR/GJ/AHMD/22222/2024", 4, "false", "true",  "false", "",     "",     "Budget 2BHK in South Bopal"),
]

for r in residential_data:
    title, loc, ltype, bhk, price, psf, area, poss, rera, dev_i, feat, zero, excl, roi, ry, desc = r
    verified = "true" if rera else "false"
    rows.append({
        "title":           title,
        "city":            "Ahmedabad",
        "locality":        loc,
        "listing_type":    ltype,
        "property_type":   "residential",
        "slug":            "",
        "status":          "active",
        "price":           price,
        "price_per_sqft":  psf,
        "developer_name":  DEVELOPERS[dev_i],
        "total_area_sqft": area,
        "possession_date": poss,
        "address":         f"{loc}, Ahmedabad, Gujarat",
        "rera_number":     rera,
        "is_rera_verified":verified,
        "is_featured":     feat,
        "is_gift_city":    "false",
        "is_zero_brokerage":zero,
        "is_exclusive":    excl,
        "roi_potential":   roi,
        "rental_yield":    ry,
        "description":     desc + f". {bhk} apartment in {loc}, Ahmedabad with modern amenities.",
        "meta_title":      f"{title} - {bhk} in {loc} Ahmedabad",
        "meta_description":f"Buy/Rent {bhk} in {loc}. {desc[:80]}",
        "meta_keywords":   f"{bhk},{loc},Ahmedabad,buy,residential",
        "amenities":       pick_amenities(5),
        "highlights":      pick_highlights("RERA Verified", "Zero Brokerage") if verified == "true" else pick_highlights("Ready to Move"),
    })

# ──────────────────────────────────────────────────────────────
# 2. COMMERCIAL (10 rows)
# ──────────────────────────────────────────────────────────────
commercial_data = [
    ("SG Business Hub Office",    "SG Highway",       "buy",        3800000,  8500,  4500,  "2025-12-31", "PR/GJ/AHMD/33333/2024", 5),
    ("Ashram Road Showroom",      "Ashram Road",      "buy",        12000000, 9500,  12000, "2025-09-30", "PR/GJ/AHMD/44444/2024", 6),
    ("CG Road Premium Office",    "CG Road",          "rent",       95000,    "",    "",    "",           "",                       7),
    ("Makarba IT Park Office",    "Makarba",          "buy",        5500000,  7800,  7000,  "2026-03-31", "PR/GJ/AHMD/55555/2024", 8),
    ("Prahlad Nagar Retail Shop", "Prahlad Nagar",    "buy",        2800000,  15000, 1800,  "2025-06-30", "PR/GJ/AHMD/66666/2024", 9),
    ("SG Highway Warehouse",      "SG Highway",       "rent",       180000,   "",    "",    "",           "",                       0),
    ("Prahladnagar Office Tower", "Prahladnagar Road","investment",  9500000,  8200,  11000, "2026-06-30", "PR/GJ/AHMD/77777/2024", 1),
    ("CG Road Food Court Space",  "CG Road",          "rent",       75000,    "",    "",    "",           "",                       2),
    ("Makarba Co-working Space",  "Makarba",          "buy",        6200000,  9100,  6800,  "2026-09-30", "PR/GJ/AHMD/88888/2024", 3),
    ("Ashram Road Commercial Hub","Ashram Road",      "investment",  15000000, 10200, 18000, "2027-03-31", "PR/GJ/AHMD/99999/2024", 4),
]

for title, loc, ltype, price, psf, area, poss, rera, dev_i in commercial_data:
    verified = "true" if rera else "false"
    rows.append({
        "title":           title,
        "city":            "Ahmedabad",
        "locality":        loc,
        "listing_type":    ltype,
        "property_type":   "commercial",
        "slug":            "",
        "status":          "active",
        "price":           price,
        "price_per_sqft":  psf,
        "developer_name":  DEVELOPERS[dev_i],
        "total_area_sqft": area,
        "possession_date": poss,
        "address":         f"{loc}, Ahmedabad, Gujarat",
        "rera_number":     rera,
        "is_rera_verified":verified,
        "is_featured":     "true" if ltype == "investment" else "false",
        "is_gift_city":    "false",
        "is_zero_brokerage":"false",
        "is_exclusive":    "false",
        "roi_potential":   "12.5" if ltype == "investment" else "",
        "rental_yield":    "8.5" if ltype == "investment" else "",
        "description":     f"Prime {title} in {loc}, Ahmedabad. Ideal for businesses.",
        "meta_title":      f"{title} - Commercial Property {loc}",
        "meta_description":f"Commercial property in {loc} Ahmedabad. Suitable for office, retail.",
        "meta_keywords":   f"commercial,{loc},Ahmedabad,office,retail",
        "amenities":       pick_amenities(4),
        "highlights":      pick_highlights("RERA Verified", "High ROI") if verified == "true" else pick_highlights("Prime Location"),
    })

# ──────────────────────────────────────────────────────────────
# 3. WEEKEND HOMES / FARMHOUSES (10 rows) — new_launch + buy
# ──────────────────────────────────────────────────────────────
weekend_data = [
    ("Nalsarovar Lake View Villa",      "Nalsarovar",      15000000, 4500, 50000, "2027-06-30",  "PR/GJ/GAND/11111/2024", 5, "18.0", "7.5"),
    ("Shantigram Weekend Bungalow",     "Shantigram",      22000000, 5500, 65000, "2027-12-31",  "PR/GJ/GAND/22222/2024", 6, "20.0", "8.0"),
    ("Shilaj Farmhouse Estate",         "Shilaj",          18000000, 4800, 55000, "2027-09-30",  "PR/GJ/GAND/33333/2024", 7, "16.0", "6.5"),
    ("Sanand Eco Villa",                "Sanand",          9500000,  3500, 40000, "2027-03-31",  "",                       8, "",     ""),
    ("Bavla Nature Retreat Bungalow",   "Bavla",           7800000,  3200, 35000, "2026-12-31",  "",                       9, "",     ""),
    ("Nal Sarovar Luxury Farmhouse",    "Nal Sarovar",     28000000, 6000, 75000, "2028-03-31",  "PR/GJ/GAND/44444/2024", 0, "22.0", "9.0"),
    ("Koba Forest Retreat Villa",       "Koba",            12500000, 4200, 42000, "2027-06-30",  "PR/GJ/GAND/55555/2024", 1, "15.0", "6.0"),
    ("Bopal Weekend Home 4BHK",         "Bopal",           8500000,  5200, 28000, "2026-09-30",  "PR/GJ/AHMD/00001/2024", 2, "13.5", "5.8"),
    ("Sanand Green Hills Bungalow",     "Sanand",          11000000, 3800, 45000, "2027-12-31",  "",                       3, "",     ""),
    ("Bavla Countryside Estate 5BHK",  "Bavla",           16000000, 4600, 52000, "2028-06-30",  "PR/GJ/GAND/66666/2024", 4, "17.5", "7.0"),
]

for title, loc, price, psf, area, poss, rera, dev_i, roi, ry in weekend_data:
    verified = "true" if rera else "false"
    rows.append({
        "title":           title,
        "city":            "Gandhinagar" if "Nal" in loc or "Shantigram" in loc or "Koba" in loc else "Ahmedabad",
        "locality":        loc,
        "listing_type":    "buy",
        "property_type":   "new_launch",
        "slug":            "",
        "status":          "active",
        "price":           price,
        "price_per_sqft":  psf,
        "developer_name":  DEVELOPERS[dev_i],
        "total_area_sqft": area,
        "possession_date": poss,
        "address":         f"{loc}, Gujarat",
        "rera_number":     rera,
        "is_rera_verified":verified,
        "is_featured":     "true" if roi else "false",
        "is_gift_city":    "false",
        "is_zero_brokerage":"false",
        "is_exclusive":    "true",
        "roi_potential":   roi,
        "rental_yield":    ry,
        "description":     f"Exclusive weekend home - {title}. Perfect getaway from city life near {loc}.",
        "meta_title":      f"{title} - Weekend Home near {loc}",
        "meta_description":f"Luxury weekend farmhouse/villa near {loc}. {title} - Book now.",
        "meta_keywords":   f"weekend home,farmhouse,villa,{loc},Gujarat",
        "amenities":       pick_amenities(6),
        "highlights":      pick_highlights("Exclusive Property", "RERA Verified", "Weekend Getaway") if verified == "true" else pick_highlights("Exclusive Property", "Weekend Getaway"),
    })

# ──────────────────────────────────────────────────────────────
# 4. GIFT CITY (10 rows)
# ──────────────────────────────────────────────────────────────
giftcity_data = [
    ("Gift City Sky Residences 3BHK",  "Gift City",          "buy",        12000000, 9500,  30000, "2026-12-31", "PR/GJ/GAND/77777/2024", 5, "18.0", "8.5"),
    ("Gift City Premium Apartment 2BHK","Gift City Phase 1",  "buy",        8500000,  8800,  22000, "2026-09-30", "PR/GJ/GAND/88888/2024", 6, "16.0", "7.5"),
    ("Gift City Office Tower",         "Gift City",          "investment", 25000000, 12000, 40000, "2027-03-31", "PR/GJ/GAND/99999/2024", 7, "20.0", "9.5"),
    ("Gift City Smart Home 2BHK",      "Gift City Phase 2",  "buy",        9200000,  9200,  24000, "2027-06-30", "PR/GJ/GAND/10001/2024", 8, "17.0", "8.0"),
    ("Gift City NRI Apartment 3BHK",   "Gift City",          "buy",        14500000, 10500, 35000, "2026-06-30", "PR/GJ/GAND/10002/2024", 9, "22.0", "10.0"),
    ("Gift City Commercial Space",     "Gift City Phase 1",  "investment", 18000000, 11000, 30000, "2026-12-31", "PR/GJ/GAND/10003/2024", 0, "19.0", "9.0"),
    ("Gift City Studio Apartment",     "Gift City Phase 2",  "buy",        5500000,  8500,  15000, "2027-12-31", "PR/GJ/GAND/10004/2024", 1, "15.0", "7.0"),
    ("Gift City Luxury Villa 4BHK",    "Gift City",          "buy",        32000000, 14000, 65000, "2028-03-31", "PR/GJ/GAND/10005/2024", 2, "24.0", "11.0"),
    ("Gift City IT Park Office",       "Gandhinagar Sector 16","investment",28000000, 12500, 48000, "2027-06-30", "PR/GJ/GAND/10006/2024", 3, "21.0", "9.8"),
    ("Gift City Serviced Apartment 1BHK","Gift City",        "rent",       85000,    "",    "",    "",           "",                       4, "",     "9.5"),
]

for title, loc, ltype, price, psf, area, poss, rera, dev_i, roi, ry in giftcity_data:
    verified = "true" if rera else "false"
    rows.append({
        "title":           title,
        "city":            "Gandhinagar",
        "locality":        loc,
        "listing_type":    ltype,
        "property_type":   "residential" if "Apartment" in title or "BHK" in title or "Studio" in title or "Villa" in title else "commercial",
        "slug":            "",
        "status":          "active",
        "price":           price,
        "price_per_sqft":  psf,
        "developer_name":  DEVELOPERS[dev_i],
        "total_area_sqft": area,
        "possession_date": poss,
        "address":         f"{loc}, Gandhinagar, Gujarat",
        "rera_number":     rera,
        "is_rera_verified":verified,
        "is_featured":     "true",
        "is_gift_city":    "true",
        "is_zero_brokerage":"false",
        "is_exclusive":    "true" if roi and float(roi or 0) >= 20 else "false",
        "roi_potential":   roi,
        "rental_yield":    ry,
        "description":     f"Premium {title} in Gift City, Gandhinagar. Special Economic Zone benefits.",
        "meta_title":      f"{title} - Gift City Gandhinagar Investment",
        "meta_description":f"Invest in {loc} Gift City. {title} - Best ROI property in Gandhinagar.",
        "meta_keywords":   f"Gift City,Gandhinagar,investment,{loc},SEZ",
        "amenities":       pick_amenities(6),
        "highlights":      pick_highlights("RERA Verified", "Gift City SEZ", "High ROI", "NRI Friendly"),
    })

# ──────────────────────────────────────────────────────────────
# 5. PLOTS (5 rows)
# ──────────────────────────────────────────────────────────────
plot_data = [
    ("Dholera SIR Residential Plot 1000sqft", "Dholera SIR", 2500000,  2500,  1000,  "2025-12-31", "",                       5, "25.0"),
    ("Sanand Industrial Plot 5000sqft",       "Sanand",      4500000,  900,   5000,  "2025-09-30", "",                       6, "18.0"),
    ("Vavol Residential Plot 2000sqft",       "Vavol",       3800000,  1900,  2000,  "2025-06-30", "PR/GJ/GAND/20001/2024", 7, "15.0"),
    ("Bavla NA Plot 3000sqft",                "Bavla",       2800000,  933,   3000,  "",           "",                       8, ""),
    ("Dholka Farm Plot 10000sqft",            "Dholka",      1800000,  180,   10000, "",           "",                       9, "20.0"),
]

for title, loc, price, psf, area, poss, rera, dev_i, roi in plot_data:
    verified = "true" if rera else "false"
    rows.append({
        "title":           title,
        "city":            "Ahmedabad",
        "locality":        loc,
        "listing_type":    "plots",
        "property_type":   "plot",
        "slug":            "",
        "status":          "active",
        "price":           price,
        "price_per_sqft":  psf,
        "developer_name":  DEVELOPERS[dev_i],
        "total_area_sqft": area,
        "possession_date": poss,
        "address":         f"{loc}, Gujarat",
        "rera_number":     rera,
        "is_rera_verified":verified,
        "is_featured":     "true" if roi else "false",
        "is_gift_city":    "false",
        "is_zero_brokerage":"false",
        "is_exclusive":    "false",
        "roi_potential":   roi,
        "rental_yield":    "",
        "description":     f"NA/Residential plot in {loc}. {title}. Excellent investment opportunity.",
        "meta_title":      f"{title} - Plot in {loc}",
        "meta_description":f"Buy plot in {loc}. {area} sq.ft {title}. Good investment.",
        "meta_keywords":   f"plot,{loc},Ahmedabad,NA plot,land",
        "amenities":       '["Road Access","Water Connection","Electricity"]',
        "highlights":      pick_highlights("RERA Verified", "High Appreciation") if verified == "true" else pick_highlights("High Appreciation Potential", "Clear Title"),
    })

# ──────────────────────────────────────────────────────────────
# Write CSV
# ──────────────────────────────────────────────────────────────
OUTPUT_FILE = "sample_50_properties.csv"

with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=HEADERS)
    writer.writeheader()
    writer.writerows(rows)

print(f"[OK] Generated {len(rows)} properties -> {OUTPUT_FILE}")
print(f"  Residential : {sum(1 for r in rows if r['property_type'] == 'residential')}")
print(f"  Commercial  : {sum(1 for r in rows if r['property_type'] == 'commercial')}")
print(f"  Weekend Home: {sum(1 for r in rows if r['property_type'] == 'new_launch')}")
print(f"  Gift City   : {sum(1 for r in rows if r['is_gift_city'] == 'true')}")
print(f"  Plots       : {sum(1 for r in rows if r['property_type'] == 'plot')}")
