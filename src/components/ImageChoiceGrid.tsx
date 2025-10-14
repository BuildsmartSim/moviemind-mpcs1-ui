import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface ImageChoice {
  key: string;
  src: string;
  alt: string;
}

interface ImageChoiceGridProps {
  images: ImageChoice[];
  value?: string;
  onChange: (key: string) => void;
}

const ImageChoiceGrid: React.FC<ImageChoiceGridProps> = ({ images, value, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const currentIndex = images.findIndex((image) => image.key === value);
    if (currentIndex >= 0) {
      setActiveIndex(currentIndex);
    }
  }, [images, value]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex = index;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          nextIndex = (index + 1) % images.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          nextIndex = (index - 1 + images.length) % images.length;
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = images.length - 1;
          break;
        case 'Enter':
        case ' ': {
          event.preventDefault();
          onChange(images[index].key);
          return;
        }
        default:
          break;
      }

      if (nextIndex !== index) {
        setActiveIndex(nextIndex);
        buttonsRef.current[nextIndex]?.focus();
      }
    },
    [images, onChange]
  );

  useEffect(() => {
    const buttonToFocus = buttonsRef.current[activeIndex];
    const active = document.activeElement;
    if (!buttonToFocus || !active) return;
    if (containerRef.current?.contains(active)) {
      if (active !== buttonToFocus) {
        buttonToFocus.focus({ preventScroll: true });
      }
    }
  }, [activeIndex]);

  const computedImages = useMemo(() => images, [images]);

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label="Select a visual gate"
      className="grid gap-4 md:grid-cols-2 md:gap-6"
    >
      {computedImages.map((image, index) => {
        const selected = value === image.key;
        return (
          <button
            key={image.key}
            ref={(node) => {
              buttonsRef.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected || index === activeIndex ? 0 : -1}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onClick={() => onChange(image.key)}
            className={clsx(
              'group relative overflow-hidden rounded-2xl bg-black/40 ring-offset-4 ring-offset-[color:var(--mm-bg-0)] transition-all duration-300 ease-mm-fade focus-visible:outline-none',
              selected
                ? 'ring-2 ring-[color:var(--mm-amber)] shadow-mm-amber-glow'
                : 'ring-0 hover:shadow-mm-amber-glow/60'
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
            />
            <span className="pointer-events-none absolute bottom-4 left-4 text-sm uppercase tracking-[0.3em] text-white/80">
              {image.key}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ImageChoiceGrid;
