"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./ImageCarousel.module.css";

const IMAGES = [
  "/images/image1.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
];

export default function ImageCarousel({
  children,
}) {
  const [
    currentImageIndex,
    setCurrentImageIndex,
  ] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentImageIndex(
        (currentIndex) =>
          (currentIndex + 1) %
          IMAGES.length,
      );
    }, 3000);

    return () =>
      window.clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className={styles.carousel}>
        {IMAGES.map(
          (imageSource, index) => (
            <div
              key={imageSource}
              className={`${styles.imageWrapper} ${
                index === currentImageIndex
                  ? styles.active
                  : ""
              }`}
              aria-hidden={
                index !== currentImageIndex
              }
            >
              <Image
                src={imageSource}
                alt=""
                fill
                sizes="100vw"
                style={{
                  objectFit: "cover",
                  zIndex: 1,
                }}
                priority={index === 0}
              />
            </div>
          ),
        )}

        <div
          className={styles.childrenWrapper}
        >
          {children}
        </div>
      </div>
    </div>
  );
}