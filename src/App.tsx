import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import FadeTransition from './components/FadeTransition';
import { AnswersProvider } from './context/AnswersContext';
import { ManifestProvider } from './context/ManifestContext';
import EntryRoute from './routes/EntryRoute';
import GateRoute from './routes/GateRoute';
import ResultsRoute from './routes/ResultsRoute';

const AppRoutes: React.FC = () => {
  return (
    <FadeTransition>
      <Routes>
        <Route path="/" element={<EntryRoute />} />
        <Route path="/mpcs1/:gateId" element={<GateRoute />} />
        <Route path="/results" element={<ResultsRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </FadeTransition>
  );
};

const App: React.FC = () => {
  return (
    <ManifestProvider>
      <AnswersProvider>
        <AppRoutes />
      </AnswersProvider>
    </ManifestProvider>
  );
};

export default App;
