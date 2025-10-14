import clsx from 'clsx';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { TextCardOptionId } from '../types/manifest';

interface TextCardOption {
  id: TextCardOptionId;
  text: string;
}

interface TextRoundCardProps {
  roundLabel: string;
  vignette: string[];
  options: TextCardOption[];
  value?: TextCardOptionId;
  onChange: (id: TextCardOptionId) => void;
  backgroundSrc?: string;
}

const DEFAULT_TEXT_CARD_BACKGROUND =
  "data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20640%20360'%3E%3Cdefs%3E%3ClinearGradient%20id%3D'g1'%20x1%3D'0%25'%20y1%3D'0%25'%20x2%3D'0%25'%20y2%3D'100%25'%3E%3Cstop%20offset%3D'0%25'%20stop-color%3D'%23F2EEE4'%2F%3E%3Cstop%20offset%3D'100%25'%20stop-color%3D'%23DFD7C9'%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D'640'%20height%3D'360'%20rx%3D'32'%20fill%3D'url(%23g1)'%2F%3E%3Crect%20x%3D'40'%20y%3D'40'%20width%3D'560'%20height%3D'280'%20rx%3D'24'%20fill%3D'%23FFFFFF'%20fill-opacity%3D'0.35'%2F%3E%3Crect%20x%3D'56'%20y%3D'56'%20width%3D'528'%20height%3D'248'%20rx%3D'20'%20fill%3D'%23FFFFFF'%20fill-opacity%3D'0.45'%2F%3E%3C%2Fsvg%3E";

const TextRoundCard: React.FC<TextRoundCardProps> = ({
  roundLabel,
  vignette,
  options,
  value,
  onChange,
  backgroundSrc = DEFAULT_TEXT_CARD_BACKGROUND
}) => {
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusIndex, setFocusIndex] = useState(0);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex = index;
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          nextIndex = (index - 1 + options.length) % options.length;
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          nextIndex = (index + 1) % options.length;
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = options.length - 1;
          break;
        case 'Enter':
        case ' ': {
          event.preventDefault();
          onChange(options[index].id);
          return;
        }
        default:
          break;
      }

      if (nextIndex !== index) {
        setFocusIndex(nextIndex);
        buttonsRef.current[nextIndex]?.focus();
      }
    },
    [options, onChange]
  );

  const renderVignette = useMemo(
    () =>
      vignette.map((line, idx) => (
        <p key={idx} className="text-base leading-7 text-[color:var(--mm-text-on-card)] md:text-lg md:leading-8">
          {line}
        </p>
      )),
    [vignette]
  );

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-cover bg-center text-[color:var(--mm-text-on-card)] shadow-mm-card"
      style={{ backgroundImage: `url(${backgroundSrc})` }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col gap-8 px-8 py-10 md:px-12 md:py-12">
        <header className="space-y-3">
          <p className="tracking-[0.2em] text-xs uppercase text-[color:var(--mm-text-on-card)]/70 md:text-sm">{roundLabel}</p>
          <div className="space-y-2">{renderVignette}</div>
        </header>
        <div role="radiogroup" aria-label="Choose a response" className="flex flex-col divide-y divide-[color:var(--mm-text-on-card)]/15">
          {options.map((option, index) => {
            const selected = option.id === value;
            return (
              <button
                key={option.id}
                ref={(node) => {
                  buttonsRef.current[index] = node;
                }}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected || index === focusIndex ? 0 : -1}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onClick={() => onChange(option.id)}
                className={clsx(
                  'flex w-full items-start gap-4 py-4 text-left transition duration-300',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--mm-amber)]',
                  selected
                    ? 'bg-white/70 text-[color:var(--mm-text-on-card)] shadow-mm-amber-glow'
                    : 'hover:bg-white/40'
                )}
              >
                <span className="mt-1 text-sm font-semibold tracking-[0.4em] text-[color:var(--mm-text-on-card)]/70">{option.id}</span>
                <span className="text-base leading-7 text-[color:var(--mm-text-on-card)]/90 md:text-lg">
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TextRoundCard;
