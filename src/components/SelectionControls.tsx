
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useResults } from '@/contexts/ResultsContext';
import { SearchResult, searchApi } from '@/lib/api';
import { CheckSquare, Square, Download, Share, Trash2, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SelectionControlsProps {
  results: SearchResult[];
  totalCount: number;
  searchQuery: string;
}

export const SelectionControls = ({ results, totalCount, searchQuery }: SelectionControlsProps) => {
  const { selectedCount, selectAll, deselectAll, getSelectedResults } = useResults();
  const [isExtracting, setIsExtracting] = useState(false);

  const handleSelectAll = () => {
    if (selectedCount === results.length) {
      deselectAll();
    } else {
      selectAll(results);
    }
  };

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
      const selectedResults = getSelectedResults(results);
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

  const isAllSelected = selectedCount === results.length && results.length > 0;

  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          disabled={results.length === 0}
          className="flex items-center gap-2"
        >
          {isAllSelected ? (
            <CheckSquare className="w-4 h-4" />
          ) : (
            <Square className="w-4 h-4" />
          )}
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-medium">
            {selectedCount} of {totalCount} selected
          </Badge>
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleExtractDetails}
            disabled={isExtracting}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {isExtracting ? 'Extracting...' : 'Extract Details'}
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Selected
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Share className="w-4 h-4" />
            Share Results
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4" />
            Remove Selected
          </Button>
        </div>
      )}
    </div>
  );
};
