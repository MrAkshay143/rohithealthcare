import { createContext, useContext } from 'react';
import type { HomeBundleData } from '@/services/content';

export const ContentContext = createContext<Record<string, string>>({});

export function useContent() {
  return useContext(ContentContext);
}

export const HomeBundleContext = createContext<HomeBundleData | null>(null);

export function useHomeBundle() {
  return useContext(HomeBundleContext);
}
