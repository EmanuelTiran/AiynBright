"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ImageCarousel.module.css'; // Import your CSS file

export default function ImageCarousel({ children }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [
        '/images/image1.jpg',
        '/images/image2.jpg',
        '/images/image3.jpg',
    ];

    useEffect(() => {
        const interval = setTimeout(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds
        return () => clearTimeout(interval);
    }, [currentImageIndex]);

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <div className={styles.carousel}>
                {images.map((imageSrc, index) => (
                    <div
                        key={index}
                        className={`${styles.imageWrapper} ${index === currentImageIndex ? styles.active : ''
                            }`}
                    >
                        <Image
                            src={imageSrc}
                            alt={`image-${index}`}
                            layout="fill"
                            objectFit="cover"
                            priority={index === currentImageIndex}
                            style={{ zIndex: 1 }} // Ensure image has a low z-index
                        />
                    </div>
                ))}
                {/* Center the children */}
                <div className={styles.childrenWrapper}>
                    {children}
                </div>
            </div>
        </div>
    );
}
