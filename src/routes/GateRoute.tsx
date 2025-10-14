import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import FooterNav from '../components/FooterNav';
import GateFrame from '../components/GateFrame';
import ImageChoiceGrid from '../components/ImageChoiceGrid';
import ProgressRail from '../components/ProgressRail';
import TextRoundCard from '../components/TextRoundCard';
import { useAnswers } from '../context/AnswersContext';
import { useManifest } from '../context/ManifestContext';
import type { GateManifest, TextRoundData } from '../types/manifest';

const roundOrder = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'] as const;

type RoundKey = typeof roundOrder[number];

type RoundContent =
  | {
      type: 'image';
      images: { key: string; src: string; alt: string }[];
      value?: string;
      onChange: (next: string) => void;
    }
  | {
      type: 'text';
      data: TextRoundData;
      value?: string;
      onChange: (next: string) => void;
    };

const resolveTextData = (textData: TextRoundData | undefined, fallbackLabel: string): TextRoundData => {
  if (!textData) {
    return {
      roundLabel: fallbackLabel,
      vignette: ['No text available.'],
      options: [
        { id: 'A', text: 'Option A' },
        { id: 'B', text: 'Option B' },
        { id: 'C', text: 'Option C' }
      ]
    };
  }
  return {
    roundLabel: textData.roundLabel ?? fallbackLabel,
    vignette: textData.vignette,
    options: textData.options
  };
};

const GateRoute: React.FC = () => {
  const { gateId } = useParams();
  const navigate = useNavigate();
  const { manifest, loading, error } = useManifest();
  const { state, setAnswer, clear } = useAnswers();
  const [roundIndex, setRoundIndex] = useState(1);

  useEffect(() => {
    setRoundIndex(1);
  }, [gateId]);

  const gate: GateManifest | undefined = useMemo(
    () => manifest?.gates.find((entry) => entry.id === gateId),
    [manifest, gateId]
  );

  useEffect(() => {
    if (!loading && manifest && !gate) {
      navigate('/');
    }
  }, [gate, loading, manifest, navigate]);

  const currentRoundKey: RoundKey = roundOrder[roundIndex - 1] ?? 'R1';
  const answersForGate = gateId ? state.gates[gateId] ?? {} : {};
  const currentValue = answersForGate[currentRoundKey];

  const handleRestart = useCallback(() => {
    clear();
    navigate('/');
  }, [clear, navigate]);

  const handleHelp = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.alert('Support is coming soon.');
    }
  }, []);

  const handleBack = useCallback(() => {
    if (roundIndex === 1) {
      navigate('/');
      return;
    }
    setRoundIndex((prev) => Math.max(prev - 1, 1));
  }, [navigate, roundIndex]);

  const handleNext = useCallback(() => {
    if (roundIndex === roundOrder.length) {
      navigate('/results');
      return;
    }
    setRoundIndex((prev) => Math.min(prev + 1, roundOrder.length));
  }, [navigate, roundIndex]);

  const handleChange = useCallback(
    (value: string) => {
      if (!gateId) return;
      setAnswer(gateId, currentRoundKey, value);
    },
    [gateId, setAnswer, currentRoundKey]
  );

  const roundContent: RoundContent | undefined = useMemo(() => {
    if (!gate) return undefined;
    const { rounds } = gate;

    switch (currentRoundKey) {
      case 'R1':
      case 'R3':
      case 'R5': {
        let imagesSource = rounds[`${currentRoundKey}_images` as 'R1_images' | 'R3_images' | 'R5_images'];
        if (!Array.isArray(imagesSource)) {
          imagesSource = [...rounds.R1_images.slice(0, 2), ...rounds.R3_images.slice(0, 2)];
        }
        const images = imagesSource.map((src, index) => ({
          key: src,
          src,
          alt: `${gate.name} option ${index + 1}`
        }));
        return {
          type: 'image',
          images,
          value: currentValue,
          onChange: handleChange
        };
      }
      case 'R2':
      case 'R4':
      case 'R6': {
        const textData = resolveTextData(rounds[`${currentRoundKey}_text_card` as 'R2_text_card'], `${currentRoundKey}`);
        return {
          type: 'text',
          data: { ...textData },
          value: currentValue,
          onChange: handleChange
        };
      }
      default:
        return undefined;
    }
  }, [gate, currentRoundKey, currentValue, handleChange]);

  if (loading) {
    return (
      <AppShell onRestart={handleRestart} onHelp={handleHelp} progress={<ProgressRail gateIndex={1} roundIndex={roundIndex} />}>
        <div className="flex flex-1 items-center justify-center">
          <div className="rounded-2xl bg-white/5 px-6 py-4 text-sm text-white/70">Preparing gate…</div>
        </div>
      </AppShell>
    );
  }

  if (error || !gate || !manifest) {
    return (
      <AppShell onRestart={handleRestart} onHelp={handleHelp} progress={<ProgressRail gateIndex={1} roundIndex={roundIndex} />}>
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-md space-y-4 rounded-3xl bg-white/5 px-8 py-10 text-center shadow-mm-card">
            <h2 className="text-2xl font-semibold text-white">Gate not found</h2>
            <p className="text-sm text-white/70">We could not locate the selected gate. Try returning to the start.</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-full bg-[#E8E3D8] px-4 py-2 text-sm font-medium text-[#1C1C1C]"
            >
              Return
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const gateIndex = manifest.gates.findIndex((item) => item.id === gate.id) + 1 || 1;
  const canProceed = Boolean(currentValue);
  const nextLabel = roundIndex === roundOrder.length ? 'View Results' : 'Next';

  return (
    <AppShell onRestart={handleRestart} onHelp={handleHelp} progress={<ProgressRail gateIndex={gateIndex} roundIndex={roundIndex} />}>
      <GateFrame title={gate.name} quadrant={gate.quadrant}>
        {roundContent?.type === 'image' && (
          <ImageChoiceGrid images={roundContent.images} value={roundContent.value} onChange={roundContent.onChange} />
        )}
        {roundContent?.type === 'text' && (
          <TextRoundCard
            roundLabel={roundContent.data.roundLabel ?? `Round ${roundIndex}`}
            vignette={roundContent.data.vignette}
            options={roundContent.data.options}
            value={roundContent.value as string | undefined}
            onChange={(id) => roundContent.onChange(id)}
            backgroundSrc={manifest.shared.text_card || undefined}
          />
        )}
        <FooterNav
          onBack={handleBack}
          onNext={handleNext}
          canGoNext={canProceed}
          onReturnToStart={() => navigate('/')}
          nextLabel={nextLabel}
        />
      </GateFrame>
    </AppShell>
  );
};

export default GateRoute;
