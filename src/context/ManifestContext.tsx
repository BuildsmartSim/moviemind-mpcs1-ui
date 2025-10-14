import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { MPCS1Manifest } from '../types/manifest';

interface ManifestContextValue {
  manifest?: MPCS1Manifest;
  loading: boolean;
  error?: string;
  refresh: () => void;
}

const ManifestContext = createContext<ManifestContextValue | undefined>(undefined);

const MANIFEST_URL = '/data/mpcs1_manifest.json';

export const ManifestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manifest, setManifest] = useState<MPCS1Manifest>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(MANIFEST_URL)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to load manifest (${res.status})`);
        }
        return (await res.json()) as MPCS1Manifest;
      })
      .then((data) => {
        if (active) {
          setManifest(data);
          setError(undefined);
        }
      })
      .catch((err: Error) => {
        if (active) {
          setError(err.message);
          setManifest(undefined);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const value = useMemo(
    () => ({
      manifest,
      loading,
      error,
      refresh: () => setReloadKey((prev) => prev + 1)
    }),
    [manifest, loading, error]
  );

  return <ManifestContext.Provider value={value}>{children}</ManifestContext.Provider>;
};

export const useManifest = (): ManifestContextValue => {
  const ctx = useContext(ManifestContext);
  if (!ctx) {
    throw new Error('useManifest must be used within ManifestProvider');
  }
  return ctx;
};
