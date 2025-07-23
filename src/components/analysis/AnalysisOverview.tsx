
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DetailedAnalysisResponse } from '@/types/analysis';
import { DetailedResultCard } from './DetailedResultCard';
import { Clock, Globe, Shield, TrendingUp } from 'lucide-react';

interface AnalysisOverviewProps {
  data: DetailedAnalysisResponse;
}

export const AnalysisOverview = ({ data }: AnalysisOverviewProps) => {
  const formatProcessingTime = (seconds: number) => {
    return `${seconds.toFixed(1)}s`;
  };

  const getPrivacyScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary p-1.5 bg-primary/10 rounded-lg" />
              <div>
                <p className="text-2xl font-bold">{formatProcessingTime(data.processing_time)}</p>
                <p className="text-sm text-muted-foreground">Processing Time</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-blue-600 p-1.5 bg-blue-100 rounded-lg" />
              <div>
                <p className="text-2xl font-bold">{data.summary.platforms_analyzed.length}</p>
                <p className="text-sm text-muted-foreground">Platforms</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Shield className={`w-8 h-8 p-1.5 rounded-lg ${getPrivacyScoreColor(data.summary.privacy_score)} bg-current/10`} />
              <div>
                <p className={`text-2xl font-bold ${getPrivacyScoreColor(data.summary.privacy_score)}`}>
                  {data.summary.privacy_score.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Privacy Score</p>
              </div>
            </div>
            
            <div>
              <p className="text-2xl font-bold">{data.total_processed}</p>
              <p className="text-sm text-muted-foreground">Sources Analyzed</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-3">Platforms Analyzed</h4>
            <div className="flex flex-wrap gap-2">
              {data.summary.platforms_analyzed.map((platform) => (
                <Badge key={platform} variant="outline">
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-semibold mb-3">Most Common PII Types</h4>
            <div className="flex flex-wrap gap-2">
              {data.summary.most_common_pii_types.map((type) => (
                <Badge key={type} variant="secondary">
                  {type.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Detailed Source Analysis</h3>
        <div className="space-y-4">
          {data.results.map((result) => (
            <DetailedResultCard key={result.id} result={result} />
          ))}
        </div>
      </div>
    </div>
  );
};
