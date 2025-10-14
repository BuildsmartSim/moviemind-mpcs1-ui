import clsx from 'clsx';
import React from 'react';

interface ProgressRailProps {
  gateIndex: number;
  roundIndex: number;
}

const TOTAL_GATES = 5;
const TOTAL_ROUNDS = 6;

const ProgressRail: React.FC<ProgressRailProps> = ({ gateIndex, roundIndex }) => {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 px-4 py-3 text-[color:var(--mm-text-on-dark)]/70 backdrop-blur"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
        <span>Gate</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: TOTAL_GATES }, (_, index) => {
            const active = index + 1 === gateIndex;
            const complete = index + 1 < gateIndex;
            return (
              <span
                key={`gate-${index}`}
                className={clsx(
                  'h-2 w-2 rounded-full transition-colors duration-300',
                  active
                    ? 'bg-[color:var(--mm-amber)] shadow-mm-amber-glow'
                    : complete
                    ? 'bg-white/40'
                    : 'bg-white/15'
                )}
              />
            );
          })}
        </div>
        <span className="font-medium text-[color:var(--mm-text-on-dark)]">{gateIndex}</span>
        <span className="text-[color:var(--mm-text-on-dark)]/50">/ {TOTAL_GATES}</span>
      </div>
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
        <span>Round</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: TOTAL_ROUNDS }, (_, index) => {
            const active = index + 1 === roundIndex;
            const complete = index + 1 < roundIndex;
            return (
              <span
                key={`round-${index}`}
                className={clsx(
                  'h-1.5 w-6 rounded-full transition-all duration-300',
                  active
                    ? 'bg-[color:var(--mm-teal)] shadow-mm-teal-glow'
                    : complete
                    ? 'bg-white/40'
                    : 'bg-white/15'
                )}
              />
            );
          })}
        </div>
        <span className="font-medium text-[color:var(--mm-text-on-dark)]">{roundIndex}</span>
        <span className="text-[color:var(--mm-text-on-dark)]/50">/ {TOTAL_ROUNDS}</span>
      </div>
    </div>
  );
};

export default ProgressRail;
