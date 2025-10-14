import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import FooterNav from '../components/FooterNav';
import GateFrame from '../components/GateFrame';
import { useAnswers } from '../context/AnswersContext';
import { useManifest } from '../context/ManifestContext';

const ResultsRoute: React.FC = () => {
  const navigate = useNavigate();
  const { manifest } = useManifest();
  const { state, clear } = useAnswers();

  const summary = useMemo(() => {
    if (!manifest) return [] as Array<{ gate: string; rounds: Record<string, string | undefined> }>;
    return manifest.gates.map((gate) => ({
      gate: gate.name,
      rounds: state.gates[gate.id] ?? {}
    }));
  }, [manifest, state.gates]);

  const handleRestart = () => {
    clear();
    navigate('/');
  };

  const handleHelp = () => {
    if (typeof window !== 'undefined') {
      window.alert('Support is coming soon.');
    }
  };

  return (
    <AppShell onRestart={handleRestart} onHelp={handleHelp}>
      <GateFrame title="Prototype Results" quadrant="Neutral">
        <p className="text-base leading-7 text-[color:var(--mm-text-on-dark)]/70">
          Detailed scoring is still under construction. Here's a quick look at what you selected during the MPCS-1 run.
        </p>
        <div className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6 shadow-mm-card">
          {summary.length === 0 && <p className="text-sm text-white/60">No selections recorded yet.</p>}
          {summary.map((item) => (
            <div key={item.gate} className="space-y-2">
              <h3 className="text-sm uppercase tracking-[0.3em] text-white/80">{item.gate}</h3>
              <div className="grid gap-2 text-sm text-white/70 md:grid-cols-3">
                {Object.entries(item.rounds).map(([round, answer]) => (
                  <div key={`${item.gate}-${round}`} className="flex justify-between rounded-xl bg-black/30 px-4 py-2">
                    <span className="uppercase tracking-[0.2em] text-white/60">{round}</span>
                    <span className="font-medium text-white">{answer ?? '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <FooterNav
          onBack={() => navigate(-1)}
          onNext={handleRestart}
          nextLabel="Restart"
          onReturnToStart={handleRestart}
        />
      </GateFrame>
    </AppShell>
  );
};

export default ResultsRoute;
