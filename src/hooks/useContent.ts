import { createContext, useContext } from 'react';

export const ContentContext = createContext<Record<string, string>>({});

export function useContent() {
  return useContext(ContentContext);
}
