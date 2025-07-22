import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useResults } from '@/contexts/ResultsContext';
import { SearchResult, searchApi } from '@/lib/api';
import { Search, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FloatingExtractButtonProps {
  searchQuery: string;
  allResults: SearchResult[];
}

export const FloatingExtractButton = ({ searchQuery, allResults }: FloatingExtractButtonProps) => {
  const { selectedCount, getSelectedResults, deselectAll } = useResults();
  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtractDetails = async () => {
    if (selectedCount === 0) {
      toast({
        title: 'No Results Selected',
        description: 'Please select at least one result to extract details.',
        variant: 'destructive',
      });
      return;
    }

    setIsExtracting(true);

    try {
      // Get selected results and extract their URLs
      const selectedResults = getSelectedResults(allResults);
      const selectedUrls = selectedResults.map(result => result.source);

      console.log('Extracting details for:', {
        searchQuery,
        selectedCount: selectedResults.length,
        selectedUrls
      });

      await searchApi.extractDetails(searchQuery, selectedUrls);

      toast({
        title: 'Extraction Started',
        description: `Processing ${selectedCount} selected result${selectedCount > 1 ? 's' : ''} for detailed extraction.`,
      });

      // Optionally clear selection after successful extraction
      // deselectAll();

    } catch (error) {
      console.error('Extract details error:', error);
      toast({
        title: 'Extraction Failed',
        description: error instanceof Error ? error.message : 'Failed to start extraction process.',
        variant: 'destructive',
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleClearSelection = () => {
    deselectAll();
  };

  // Only show when there are selected results
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-scale-in">
      <div className="glass-card p-4 rounded-2xl shadow-2xl border backdrop-blur-lg bg-background/95">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="default" className="px-3 py-1 text-sm font-semibold">
            {selectedCount} selected
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}
            className="h-6 w-6 p-0 rounded-full hover:bg-muted"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        
        <Button 
          onClick={handleExtractDetails}
          disabled={isExtracting}
          size="lg"
          className="w-full flex items-center gap-3 px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover-scale"
        >
          <Search className="w-5 h-5" />
          {isExtracting ? 'Extracting...' : 'Extract Details'}
        </Button>
      </div>
    </div>
  );
};