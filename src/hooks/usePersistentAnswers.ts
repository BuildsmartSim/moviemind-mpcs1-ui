import { useCallback, useEffect, useState } from 'react';
import type { RoundAnswerMap } from '../types/manifest';

export interface PersistedAnswers {
  selectedGate?: string;
  gates: Record<string, RoundAnswerMap>;
}

const STORAGE_KEY = 'mm.mpcs1.answers.v1';

const readStorage = (): PersistedAnswers => {
  if (typeof window === 'undefined') {
    return { gates: {} };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { gates: {} };
    const parsed = JSON.parse(raw) as PersistedAnswers;
    return { gates: {}, ...parsed };
  } catch (error) {
    console.warn('Failed to parse stored answers', error);
    return { gates: {} };
  }
};

export const usePersistentAnswers = () => {
  const [state, setState] = useState<PersistedAnswers>(() => readStorage());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to persist answers', error);
    }
  }, [state]);

  const selectGate = useCallback((gateId: string) => {
    setState((prev) => ({
      selectedGate: gateId,
      gates: {
        ...prev.gates,
        [gateId]: prev.gates[gateId] ?? {}
      }
    }));
  }, []);

  const setAnswer = useCallback((gateId: string, roundId: string, value: string | undefined) => {
    setState((prev) => {
      const gateAnswers = prev.gates[gateId] ?? {};
      const nextGateAnswers: RoundAnswerMap = {
        ...gateAnswers,
        [roundId]: value
      };
      return {
        ...prev,
        gates: {
          ...prev.gates,
          [gateId]: nextGateAnswers
        }
      };
    });
  }, []);

  const clear = useCallback(() => {
    setState({ selectedGate: undefined, gates: {} });
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    state,
    selectGate,
    setAnswer,
    clear
  };
};
