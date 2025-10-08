
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useResults } from '@/contexts/ResultsContext';
import { SearchResult } from '@/lib/api';
import { CheckSquare, Square, Download, Share, Trash2 } from 'lucide-react';

interface SelectionControlsProps {
  results: SearchResult[];
  totalCount: number;
}

export const SelectionControls = ({ results, totalCount }: SelectionControlsProps) => {
  const { selectedCount, selectAll, deselectAll } = useResults();

  const handleSelectAll = () => {
    if (selectedCount === results.length) {
      deselectAll();
    } else {
      selectAll(results);
    }
  };

  const isAllSelected = selectedCount === results.length && results.length > 0;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 sm:p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center gap-3 md:gap-4 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          disabled={results.length === 0}
          className="flex items-center gap-2 touch-target min-h-[44px] sm:min-h-0"
        >
          {isAllSelected ? (
            <CheckSquare className="w-4 h-4" />
          ) : (
            <Square className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{isAllSelected ? 'Deselect All' : 'Select All'}</span>
        </Button>

        <Badge variant="secondary" className="font-medium text-sm px-3 py-1.5">
          {selectedCount} of {totalCount}
        </Badge>
      </div>

      {selectedCount > 0 && (
        <div className="grid grid-cols-3 md:flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="flex items-center justify-center gap-2 touch-target min-h-[44px] sm:min-h-0">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center justify-center gap-2 touch-target min-h-[44px] sm:min-h-0">
            <Share className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center justify-center gap-2 text-destructive hover:text-destructive touch-target min-h-[44px] sm:min-h-0">
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Remove</span>
          </Button>
        </div>
      )}
    </div>
  );
};
