export function formatPrice(value) {
  if (!value) return "Price on Request";

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return value;

  if (numberValue >= 10000000) {
    return `₹${(numberValue / 10000000).toFixed(2)} Cr`;
  }

  if (numberValue >= 100000) {
    return `₹${(numberValue / 100000).toFixed(2)} Lac`;
  }

  return `₹${numberValue.toLocaleString("en-IN")}`;
}


export function getImageUrl(image) {
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";

  if (!image) return "/images/ninth.png";

  if (image.startsWith("http")) return image;

  // Local Next.js public assets must be served directly
  if (image.startsWith("/images/")) return image;

  // Django media URLs from backend
  if (image.startsWith("/")) {
    return backendBaseUrl ? `${backendBaseUrl}${image}` : image;
  }

  return backendBaseUrl ? `${backendBaseUrl}/${image}` : `/${image}`;
}

export function getTypeLabel(property) {
  return (
    property.property_type ||
    property.commercial_type ||
    property.gift_property_type ||
    property.investment_type ||
    "Property"
  );
}

export function getWhatsAppUrl(property) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917984430082";
  const message = `Hello Nirvana Space, I am interested in ${property.title}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}