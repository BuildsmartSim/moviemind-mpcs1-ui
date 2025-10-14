import clsx from 'clsx';
import React from 'react';

interface FooterNavProps {
  onBack?: () => void;
  onNext?: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
  nextLabel?: string;
  onReturnToStart: () => void;
}

const FooterNav: React.FC<FooterNavProps> = ({
  onBack,
  onNext,
  canGoBack = true,
  canGoNext = true,
  nextLabel = 'Next',
  onReturnToStart
}) => {
  return (
    <footer className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack || !canGoBack}
          className={clsx(
            'rounded-2xl bg-white/10 px-6 py-3 text-sm font-medium uppercase tracking-[0.3em] text-white/70 transition-opacity',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--mm-teal)]',
            (!onBack || !canGoBack) && 'cursor-not-allowed opacity-40'
          )}
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!onNext || !canGoNext}
          className={clsx(
            'rounded-2xl bg-[#E8E3D8] px-6 py-3 text-sm font-medium uppercase tracking-[0.3em] text-[#1C1C1C] transition-opacity',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--mm-amber)]',
            (!onNext || !canGoNext) && 'cursor-not-allowed opacity-50'
          )}
        >
          {nextLabel}
        </button>
      </div>
      <button
        type="button"
        onClick={onReturnToStart}
        className="text-sm uppercase tracking-[0.3em] text-[color:var(--mm-text-on-dark)]/70 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--mm-teal)]"
      >
        Return to Start
      </button>
    </footer>
  );
};

export default FooterNav;
