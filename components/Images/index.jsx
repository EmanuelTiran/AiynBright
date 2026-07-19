"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import style from "./style.module.css";

export default function Images({ carpet }) {
  const images = Array.isArray(
    carpet?.images,
  )
    ? carpet.images
    : [];

  const imageCount = images.length;

  const [
    currentImageIndex,
    setCurrentImageIndex,
  ] = useState(0);

  useEffect(() => {
    if (imageCount < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setCurrentImageIndex(
        (currentIndex) =>
          (currentIndex + 1) % imageCount,
      );
    }, 2000);

    return () =>
      window.clearInterval(interval);
  }, [imageCount]);

  if (imageCount === 0) {
    return null;
  }

  const safeImageIndex =
    currentImageIndex % imageCount;

  return (
    <div className={style.container}>
      <Image
        src={images[safeImageIndex]}
        alt={
          carpet?.title || "Gallery image"
        }
        width={600}
        height={400}
        className={style.img}
      />
    </div>
  );
}