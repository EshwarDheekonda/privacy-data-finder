
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
