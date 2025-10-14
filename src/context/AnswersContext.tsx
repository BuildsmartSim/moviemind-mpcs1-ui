import React, { createContext, useContext } from 'react';
import { usePersistentAnswers } from '../hooks/usePersistentAnswers';

interface AnswersContextValue extends ReturnType<typeof usePersistentAnswers> {}

const AnswersContext = createContext<AnswersContextValue | undefined>(undefined);

export const AnswersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = usePersistentAnswers();
  return <AnswersContext.Provider value={value}>{children}</AnswersContext.Provider>;
};

export const useAnswers = () => {
  const ctx = useContext(AnswersContext);
  if (!ctx) {
    throw new Error('useAnswers must be used within AnswersProvider');
  }
  return ctx;
};
