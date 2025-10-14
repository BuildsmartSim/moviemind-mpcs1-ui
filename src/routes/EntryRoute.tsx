import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import FooterNav from '../components/FooterNav';
import GateFrame from '../components/GateFrame';
import ImageChoiceGrid from '../components/ImageChoiceGrid';
import ProgressRail from '../components/ProgressRail';
import { useAnswers } from '../context/AnswersContext';
import { useManifest } from '../context/ManifestContext';

const EntryRoute: React.FC = () => {
  const navigate = useNavigate();
  const { manifest, loading, error, refresh } = useManifest();
  const { state, selectGate, clear } = useAnswers();
  const [selection, setSelection] = useState<string | undefined>(state.selectedGate);

  const choices = useMemo(() => manifest?.entry_round ?? [], [manifest]);

  const handleNext = () => {
    if (!selection) return;
    selectGate(selection);
    navigate(`/mpcs1/${selection}`);
  };

  const handleRestart = () => {
    clear();
    setSelection(undefined);
    navigate('/');
  };

  const handleHelp = () => {
    if (typeof window !== 'undefined') {
      window.alert('Support is coming soon.');
    }
  };

  if (loading) {
    return (
      <AppShell onRestart={handleRestart} onHelp={handleHelp} progress={<ProgressRail gateIndex={1} roundIndex={1} />}>
        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-2xl bg-white/5 px-6 py-4 text-sm text-white/70">Loading manifest…</div>
        </div>
      </AppShell>
    );
  }

  if (error || !manifest) {
    return (
      <AppShell onRestart={handleRestart} onHelp={handleHelp} progress={<ProgressRail gateIndex={1} roundIndex={1} />}>
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-md space-y-4 rounded-3xl bg-white/5 px-8 py-10 text-center shadow-mm-card">
            <h2 className="text-2xl font-semibold text-white">Manifest unavailable</h2>
            <p className="text-sm text-white/70">We couldn't load the MPCS-1 experience. Please try again.</p>
            <button
              type="button"
              onClick={refresh}
              className="rounded-full bg-[#E8E3D8] px-4 py-2 text-sm font-medium text-[#1C1C1C]"
            >
              Retry
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell onRestart={handleRestart} onHelp={handleHelp} progress={<ProgressRail gateIndex={1} roundIndex={1} />}>
      <div className="flex flex-1 flex-col gap-10">
        <GateFrame title="Choose Your Mood Gate" quadrant="Neutral">
          <p className="text-base leading-7 text-[color:var(--mm-text-on-dark)]/70 md:max-w-2xl">
            Select the visual resonance that feels closest to your mood. This anchors the MPCS-1 run and carries through the
            upcoming rounds.
          </p>
          <ImageChoiceGrid
            images={choices.map((choice) => ({
              key: choice.gateId,
              src: choice.image,
              alt: `${choice.gateId} mood gate`
            }))}
            value={selection}
            onChange={setSelection}
          />
          <FooterNav
            onNext={handleNext}
            canGoNext={Boolean(selection)}
            onReturnToStart={handleRestart}
          />
        </GateFrame>
      </div>
    </AppShell>
  );
};

export default EntryRoute;
