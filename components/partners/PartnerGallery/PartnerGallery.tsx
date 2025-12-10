'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog } from '@/shared/ui/Dialog/Dialog';
import styles from './PartnerGallery.module.css';

interface PartnerGalleryProps {
  images: string[];
  partnerName: string;
}

export const PartnerGallery: React.FC<PartnerGalleryProps> = ({
  images,
  partnerName,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    loop: false,
    skipSnaps: false,
    dragFree: false,
    watchDrag: true,
  });


  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const handleModalPrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleModalNext = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className={styles.galleryWrapper}>
        <div className={styles.embla} ref={emblaRef}>
          <div className={styles.emblaContainer}>
            {images.map((image, index) => (
              <div key={`${image}-${index}`} className={styles.emblaSlide}>
                <div
                  className={styles.imageWrapper}
                  onClick={() => handleImageClick(index)}
                >
                  <Image
                    src={image}
                    alt={`${partnerName} ${index + 1}`}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 80vw, 300px"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        className={styles.modalDialog}
        overlayClassName={styles.modalOverlay}
      >
        <div className={styles.modalContent}>
          <button
            className={styles.closeButton}
            onClick={() => setIsModalOpen(false)}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <div className={styles.modalImageWrapper}>
            <Image
              src={images[selectedIndex]}
              alt={`${partnerName} ${selectedIndex + 1}`}
              fill
              className={styles.modalImage}
              sizes="90vw"
              unoptimized
            />
          </div>
          {images.length > 1 && (
            <div className={styles.navigationBar}>
              <button
                className={styles.modalNavButton}
                onClick={handleModalPrev}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <div className={styles.imageCounter}>
                {selectedIndex + 1} / {images.length}
              </div>
              <button
                className={styles.modalNavButton}
                onClick={handleModalNext}
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

