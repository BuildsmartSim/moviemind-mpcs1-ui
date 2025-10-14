import React from 'react';

interface TopBarProps {
  onRestart: () => void;
  onHelp?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onRestart, onHelp }) => {
  return (
    <header className="sticky top-0 z-40 mb-6 flex items-center justify-between bg-[color:var(--mm-bg-0)]/70 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="text-sm uppercase tracking-[0.5em] text-[color:var(--mm-text-on-dark)]/70">MOVIEMIND</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-[color:var(--mm-text-on-dark)]/70">
        <button
          type="button"
          onClick={() => onHelp?.()}
          className="rounded-full px-3 py-1 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--mm-teal)]"
        >
          Help
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full px-3 py-1 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--mm-amber)]"
        >
          Restart
        </button>
      </div>
    </header>
  );
};

export default TopBar;
