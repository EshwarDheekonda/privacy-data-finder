
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SearchResult } from '@/lib/api';

interface ResultsContextType {
  selectedResults: Set<string>;
  toggleResult: (id: string) => void;
  selectAll: (results: SearchResult[]) => void;
  deselectAll: () => void;
  isSelected: (id: string) => boolean;
  selectedCount: number;
  getSelectedResults: (allResults: SearchResult[]) => SearchResult[];
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

export const useResults = () => {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};

interface ResultsProviderProps {
  children: ReactNode;
}

export const ResultsProvider = ({ children }: ResultsProviderProps) => {
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());

  const toggleResult = (id: string) => {
    setSelectedResults(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = (results: SearchResult[]) => {
    setSelectedResults(new Set(results.map(r => r.id)));
  };

  const deselectAll = () => {
    setSelectedResults(new Set());
  };

  const isSelected = (id: string) => {
    return selectedResults.has(id);
  };

  const selectedCount = selectedResults.size;

  const getSelectedResults = (allResults: SearchResult[]): SearchResult[] => {
    return allResults.filter(result => selectedResults.has(result.id));
  };

  return (
    <ResultsContext.Provider
      value={{
        selectedResults,
        toggleResult,
        selectAll,
        deselectAll,
        isSelected,
        selectedCount,
        getSelectedResults,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};
