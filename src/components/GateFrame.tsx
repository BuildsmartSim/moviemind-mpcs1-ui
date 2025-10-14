import clsx from 'clsx';
import React from 'react';
import ParallaxLayer from './ParallaxLayer';
import type { Quadrant } from '../types/manifest';

interface GateFrameProps {
  title: string;
  quadrant: Quadrant;
  children: React.ReactNode;
}

const quadrantAccent = (quadrant: Quadrant) => {
  switch (quadrant) {
    case 'HV_HA':
      return 'from-[rgba(242,197,106,0.35)] via-transparent to-[rgba(72,224,210,0.35)]';
    case 'HV_LA':
      return 'from-[rgba(242,197,106,0.35)] via-transparent to-transparent';
    case 'LV_HA':
      return 'from-[rgba(72,224,210,0.35)] via-transparent to-transparent';
    case 'LV_LA':
      return 'from-transparent via-[rgba(232,227,216,0.08)] to-transparent';
    default:
      return 'from-transparent via-transparent to-transparent';
  }
};

const GateFrame: React.FC<GateFrameProps> = ({ title, quadrant, children }) => {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-[color:var(--mm-bg-1)]/60 px-6 py-10 shadow-mm-card md:px-12">
      <ParallaxLayer
        depth={10}
        className={clsx('bg-gradient-to-br opacity-70 blur-3xl', quadrantAccent(quadrant))}
      />
      <div className="relative z-10 flex flex-col gap-8">
        <header className="space-y-2" aria-live="polite">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mm-text-on-dark)]/60">{quadrant}</p>
          <h1 className="text-3xl font-semibold text-[color:var(--mm-text-on-dark)] md:text-4xl">{title}</h1>
        </header>
        <div className="flex flex-col gap-10">{children}</div>
      </div>
    </section>
  );
};

export default GateFrame;
