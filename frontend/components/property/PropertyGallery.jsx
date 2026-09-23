"use client";

import { useState, useMemo } from "react";
import { getImageUrl } from "@/lib/format";

export default function PropertyGallery({ mainImage, images = [], title }) {
  // Extract all gallery images from backend images list (supports 5-10+ images)
  const galleryList = useMemo(() => {
    if (Array.isArray(images) && images.length > 0) {
      const extracted = images
        .map((img) => {
          if (typeof img === "string") return getImageUrl(img);
          if (img && img.image_url) return getImageUrl(img.image_url);
          if (img && img.image) return getImageUrl(img.image);
          return null;
        })
        .filter(Boolean);

      if (extracted.length > 0) {
        return extracted;
      }
    }

    // Default fallback if no images array provided
    return [
      getImageUrl(mainImage) || "/images/first.jpg",
      "/images/fourth.png",
      "/images/fifth.png",
      "/images/six.png",
      "/images/seven.png",
    ];
  }, [images, mainImage]);

  const [activeImage, setActiveImage] = useState(galleryList[0]);
  const currentActive = galleryList.includes(activeImage) ? activeImage : galleryList[0];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
    setActiveImage(galleryList[index]);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    const nextIdx = (lightboxIndex + 1) % galleryList.length;
    setLightboxIndex(nextIdx);
    setActiveImage(galleryList[nextIdx]);
  };

  const prevImage = () => {
    const prevIdx = (lightboxIndex - 1 + galleryList.length) % galleryList.length;
    setLightboxIndex(prevIdx);
    setActiveImage(galleryList[prevIdx]);
  };

  return (
    <div className="space-y-3">
      {/* Featured Big Image */}
      <div className="relative h-[340px] sm:h-[460px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 group">
        <img
          src={currentActive}
          alt={title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-60" />

        <button
          onClick={() => handleOpenLightbox(galleryList.indexOf(currentActive))}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-slate-950/80 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-slate-900 cursor-pointer"
        >
          <span>🔍</span>
          <span>View All Photos ({galleryList.length})</span>
        </button>

        <span className="absolute top-4 left-4 rounded-full bg-emerald-600/90 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white shadow-md">
          ✓ Verified Photos ({galleryList.length})
        </span>
      </div>

      {/* Thumbnails Row (scrollable if > 5 images) */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
        {galleryList.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveImage(img);
              setLightboxIndex(idx);
            }}
            className={`relative flex-shrink-0 h-18 sm:h-24 w-24 sm:w-32 overflow-hidden rounded-2xl border-2 transition cursor-pointer ${
              currentActive === img
                ? "border-[#a98440] ring-2 ring-[#a98440]/30 scale-102"
                : "border-slate-200 opacity-75 hover:opacity-100"
            }`}
          >
            <img src={img} alt={`${title} preview ${idx + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-lg">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 text-lg cursor-pointer z-10"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Prev button */}
          {galleryList.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 text-2xl cursor-pointer z-10"
              aria-label="Previous image"
            >
              ‹
            </button>
          )}

          {/* Image & Caption */}
          <div className="flex flex-col items-center max-h-[85vh] max-w-4xl overflow-hidden rounded-3xl">
            <img
              src={galleryList[lightboxIndex]}
              alt={`${title} - Photo ${lightboxIndex + 1}`}
              className="max-h-[75vh] w-auto rounded-3xl object-contain shadow-2xl"
            />
            <p className="mt-3 text-sm text-slate-300 font-medium">
              Photo {lightboxIndex + 1} of {galleryList.length}
            </p>
          </div>

          {/* Next button */}
          {galleryList.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 text-2xl cursor-pointer z-10"
              aria-label="Next image"
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}
