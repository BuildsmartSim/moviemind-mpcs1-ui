import React from 'react';
import TopBar from './TopBar';

interface AppShellProps {
  children: React.ReactNode;
  progress?: React.ReactNode;
  onRestart: () => void;
  onHelp?: () => void;
}

const AppShell: React.FC<AppShellProps> = ({ children, progress, onRestart, onHelp }) => {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--mm-bg-0),var(--mm-bg-1))] text-[color:var(--mm-text-on-dark)]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-12 pt-6 md:px-8">
        <TopBar onRestart={onRestart} onHelp={onHelp} />
        {progress && <div className="mb-6">{progress}</div>}
        <main className="flex flex-1 flex-col">{children}</main>
        <div className="mt-10 text-xs text-[color:var(--mm-text-on-dark)]/40">Version prototype · MPCS-1</div>
      </div>
    </div>
  );
};

export default AppShell;
