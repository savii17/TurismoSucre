import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import "./images.css";
import { getFallbackImage } from "../data/imageCatalog";
import type { ImageCategory, ImageSet } from "../types/images";

type Props = {
  imageSet?: ImageSet;
  category: ImageCategory;
  alt: string;
  className?: string;
  imageClassName?: string;
  objectFit?: "cover" | "contain";
  priority?: boolean;
  sizes?: string;
  style?: CSSProperties;
};

const categoryLabels: Record<ImageCategory, string> = {
  "tourist-place": "lugares turísticos",
  accommodation: "hospedajes",
  restaurant: "restaurantes",
  entertainment: "entretenimiento",
  event: "eventos",
  emergency: "servicios de emergencia",
};

export default function ImageWithFallback({ imageSet, category, alt, className, imageClassName, objectFit = "cover", priority = false, sizes, style }: Props) {
  const fallback = imageSet?.fallback ?? getFallbackImage(category);
  const sources = useMemo(() => {
    const ordered = [...(imageSet?.main ? [imageSet.main] : []), ...(imageSet?.gallery ?? [])]
      .sort((a, b) => a.order - b.order)
      .map((item) => item.src);
    return [...new Set([...ordered, fallback])];
  }, [fallback, imageSet]);
  const stateKey = `${category}|${sources.join("|")}`;
  const [errorState, setErrorState] = useState({ key: "", sourceIndex: 0, fallbackFailed: false });
  const stateMatches = errorState.key === stateKey;
  const sourceIndex = stateMatches ? errorState.sourceIndex : 0;
  const fallbackFailed = stateMatches && errorState.fallbackFailed;

  const onError = () => {
    setErrorState((current) => {
      const currentIndex = current.key === stateKey ? current.sourceIndex : 0;
      if (currentIndex < sources.length - 1) return { key: stateKey, sourceIndex: currentIndex + 1, fallbackFailed: false };
      return { key: stateKey, sourceIndex: currentIndex, fallbackFailed: true };
    });
  };

  if (fallbackFailed) {
    return <span className={`image-fallback image-fallback--${category}${className ? ` ${className}` : ""}`} role="img" aria-label={`Ilustración de ${categoryLabels[category]} de ${alt}`} style={style}><span>Sucre</span></span>;
  }

  return <span className={`image-frame image-frame--${category}${className ? ` ${className}` : ""}`} style={style}>
    <img
      key={`${sources[sourceIndex]}-${sourceIndex}`}
      className={imageClassName}
      src={sources[sourceIndex]}
      alt={sourceIndex === sources.length - 1 ? `Ilustración de ${categoryLabels[category]} de ${alt}` : alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      sizes={sizes}
      style={{ objectFit }}
      onError={onError}
    />
  </span>;
}
