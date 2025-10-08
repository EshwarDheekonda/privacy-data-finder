import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchResult } from '@/lib/api';
import { useResults } from '@/contexts/ResultsContext';
import { Calendar, ExternalLink, Globe, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  result: SearchResult;
}

const getRiskColor = (riskLevel: SearchResult['risk_level']) => {
  switch (riskLevel) {
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-muted-foreground bg-muted border-border';
  }
};

const getRiskIcon = (riskLevel: SearchResult['risk_level']) => {
  switch (riskLevel) {
    case 'low':
      return <Shield className="w-4 h-4" />;
    case 'medium':
    case 'high':
    case 'critical':
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Shield className="w-4 h-4" />;
  }
};

export const ResultCard = ({ result }: ResultCardProps) => {
  const { toggleResult, isSelected } = useResults();
  const selected = isSelected(result.id);

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      selected && "ring-2 ring-primary ring-offset-2"
    )}>
      <CardHeader className="px-4 sm:px-6 py-5 sm:py-4 pb-4 sm:pb-3">
        <div className="flex flex-col gap-3">
          {/* Mobile: Risk badge at top, Desktop: Risk badge on right */}
          <Badge className={cn(
            "text-sm py-2 px-3 font-medium self-start w-fit sm:hidden",
            getRiskColor(result.risk_level)
          )}>
            {getRiskIcon(result.risk_level)}
            <span className="ml-1 capitalize whitespace-nowrap">{result.risk_level}</span>
          </Badge>

          <div className="flex items-start gap-4 sm:gap-3 w-full">
            <div className="p-2 -m-2">
              <Checkbox
                checked={selected}
                onCheckedChange={() => toggleResult(result.id)}
                className="h-5 w-5 sm:h-4 sm:w-4 shrink-0"
              />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-snug sm:text-lg font-semibold break-words mb-3 sm:mb-2">
                {result.title || result.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 flex-wrap text-sm sm:text-sm leading-relaxed">
                <Globe className="w-4 h-4 shrink-0" />
                <span className="truncate">{result.source}</span>
              </CardDescription>
              {result.snippet && (
                <p className="text-sm text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">
                  {result.snippet}
                </p>
              )}
            </div>
            {/* Desktop: Risk badge on right */}
            <Badge className={cn(
              "text-sm px-3 py-1.5 font-medium shrink-0 hidden sm:flex",
              getRiskColor(result.risk_level)
            )}>
              {getRiskIcon(result.risk_level)}
              <span className="ml-1 capitalize whitespace-nowrap">{result.risk_level}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-5 sm:pb-4 space-y-5 sm:space-y-4">
        {/* Data Types */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2.5">Data Found</h4>
          <div className="flex flex-wrap gap-2 sm:gap-2">
            {result.data_types.map((type, index) => (
              <Badge key={index} variant="secondary" className="text-sm px-3 py-1.5 sm:text-xs sm:px-2 sm:py-1">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Risk Assessment Reasoning */}
        {result.reasoning && (
          <div className="p-4 sm:p-3 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Risk Assessment</h4>
            <p className="text-sm text-foreground leading-relaxed">{result.reasoning}</p>
          </div>
        )}

        {/* Found Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Found: {new Date(result.found_at).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 pt-2">
          <Button variant="outline" size="sm" className="w-full sm:flex-1 h-12 text-base sm:h-9 sm:text-sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Source
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto h-12 text-base sm:h-9 sm:text-sm">
            Report Issue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};