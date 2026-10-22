import { useState } from "react";
import ImageWithFallback from "./ImageWithFallback";
import type { ImageCategory, ImageSet } from "../types/images";

type Props = {
  imageSet: ImageSet;
  category: ImageCategory;
  alt: string;
};

export default function ImageGallery({ imageSet, category, alt }: Props) {
  const availableImages = [...(imageSet.main ? [imageSet.main] : []), ...imageSet.gallery].sort((a, b) => a.order - b.order);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeIndex = Math.min(selectedIndex, Math.max(availableImages.length - 1, 0));
  const selected = availableImages[activeIndex];
  const select = (delta: number) => setSelectedIndex((index) => (Math.min(index, availableImages.length - 1) + delta + availableImages.length) % availableImages.length);

  return <section className="image-gallery" aria-label={`Galería de ${alt}`}>
    <div className="image-gallery__stage">
      <ImageWithFallback
        imageSet={selected ? { ...imageSet, main: selected, gallery: [] } : { ...imageSet, main: undefined, gallery: [] }}
        category={category}
        alt={selected?.alt ?? alt}
        className="image-gallery__main"
        objectFit="contain"
        priority
      />
      {availableImages.length > 1 && <div className="image-gallery__controls">
        <button type="button" aria-label="Imagen anterior" onClick={() => select(-1)}>‹</button>
        <span>{activeIndex + 1} / {availableImages.length}</span>
        <button type="button" aria-label="Imagen siguiente" onClick={() => select(1)}>›</button>
      </div>}
    </div>
    {availableImages.length > 1 && <div className="image-gallery__thumbnails" role="tablist" aria-label="Seleccionar imagen">
      {availableImages.map((image, index) => <button key={`${image.src}-${index}`} type="button" role="tab" aria-selected={index === activeIndex} aria-label={`Mostrar imagen ${index + 1}: ${image.alt}`} className={index === activeIndex ? "is-selected" : ""} onClick={() => setSelectedIndex(index)}>
        <ImageWithFallback imageSet={{ ...imageSet, main: image, gallery: [] }} category={category} alt={image.alt} objectFit="cover" />
      </button>)}
    </div>}
  </section>;
}
