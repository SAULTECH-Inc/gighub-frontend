import { EmployerData } from "../../../../utils/types";
import React, { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface MediaAndGalleryProps {
  user: EmployerData;
}

const MediaAndGallery: React.FC<MediaAndGalleryProps> = memo(({ user }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());

  const handleImageClick = useCallback((index: number) => {
    setSelectedImage(index);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedImage(null);
  }, []);

  const handlePrevImage = useCallback(() => {
    if (selectedImage !== null && user?.brandAndVisuals) {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : user.brandAndVisuals.length - 1);
    }
  }, [selectedImage, user?.brandAndVisuals]);

  const handleNextImage = useCallback(() => {
    if (selectedImage !== null && user?.brandAndVisuals) {
      setSelectedImage(selectedImage < user.brandAndVisuals.length - 1 ? selectedImage + 1 : 0);
    }
  }, [selectedImage, user?.brandAndVisuals]);

  const handleImageError = useCallback((index: number) => {
    setImageLoadErrors(prev => new Set(prev).add(index));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleCloseModal();
    if (e.key === "ArrowLeft") handlePrevImage();
    if (e.key === "ArrowRight") handleNextImage();
  }, [handleCloseModal, handlePrevImage, handleNextImage]);

  // Filter out images that failed to load and validate URLs
  const validImages = user?.brandAndVisuals?.filter((url, index) =>
    url &&
    typeof url === 'string' &&
    url.trim() !== '' &&
    !imageLoadErrors.has(index)
  ) || [];

  if (validImages.length === 0) {
    return null;
  }

  return (
    <>
      <div className="p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Media & Gallery</h2>
            <p className="text-sm text-slate-500">
              {validImages.length} {validImages.length === 1 ? 'photo' : 'photos'}
            </p>
          </div>

          {/* Optimized Gallery Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {validImages.map((url, index) => (
              <motion.div
                key={`${url}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                whileHover={{ scale: 1.02 }}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-all hover:shadow-md"
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={url}
                  alt={`Company media ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={() => handleImageError(index)}
                  onLoad={() => {
                    // Remove any existing error state if image loads successfully
                    if (imageLoadErrors.has(index)) {
                      setImageLoadErrors(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(index);
                        return newSet;
                      });
                    }
                  }}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-40">
                  <ZoomIn className="h-6 w-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Image Number Badge */}
                <div className="absolute bottom-2 right-2 rounded-md bg-black bg-opacity-60 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Optimized Lightbox Modal */}
      <AnimatePresence>
        {isModalOpen && selectedImage !== null && validImages[selectedImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
            onClick={handleCloseModal}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white transition-colors hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close gallery"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-3 text-white transition-colors hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-3 text-white transition-colors hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={validImages[selectedImage]}
                alt={`Company media ${selectedImage + 1}`}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                onError={() => handleCloseModal()} // Close modal if main image fails to load
              />

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black bg-opacity-60 px-4 py-2 text-sm font-medium text-white">
                {selectedImage + 1} of {validImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

MediaAndGallery.displayName = 'MediaAndGallery';

export default MediaAndGallery;