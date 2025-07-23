
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AnalysisResult } from '@/types/analysis';
import { 
  ChevronDown, 
  ChevronRight, 
  ExternalLink, 
  Shield, 
  Eye, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Globe
} from 'lucide-react';
import { useState } from 'react';

interface DetailedResultCardProps {
  result: AnalysisResult;
}

export const DetailedResultCard = ({ result }: DetailedResultCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Shield className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                {isOpen ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
                <div>
                  <CardTitle className="text-lg">{result.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {result.platform} • {result.content_type}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getRiskLevelColor(result.risk_level)}>
                  {getRiskIcon(result.risk_level)}
                  <span className="ml-1 capitalize">{result.risk_level} Risk</span>
                </Badge>
                
                <Badge variant="outline">
                  {result.pii_data.length} PII items
                </Badge>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(result.source_url, '_blank');
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{result.overall_risk_score.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Risk Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{result.pii_data.length}</p>
                  <p className="text-xs text-muted-foreground">PII Items</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{result.processing_time.toFixed(1)}s</p>
                  <p className="text-xs text-muted-foreground">Scan Time</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center">
                    {result.data_exposure.public ? (
                      <Eye className="w-6 h-6 text-orange-600" />
                    ) : (
                      <Shield className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {result.data_exposure.public ? 'Public' : 'Private'}
                  </p>
                </div>
              </div>

              {/* Content Summary */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Content Summary
                </h4>
                <p className="text-sm text-muted-foreground">{result.content_summary}</p>
              </div>

              {/* Key Findings */}
              {result.key_findings.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Key Findings</h4>
                  <ul className="space-y-1">
                    {result.key_findings.map((finding, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* PII Data Preview */}
              {result.pii_data.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">PII Data Found</h4>
                  <div className="grid gap-2">
                    {result.pii_data.slice(0, 3).map((pii, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="capitalize">
                            {pii.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm font-mono">{pii.value}</span>
                        </div>
                        <Badge className={getRiskLevelColor(pii.severity)} variant="outline">
                          {pii.confidence * 100}% confidence
                        </Badge>
                      </div>
                    ))}
                    {result.pii_data.length > 3 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        +{result.pii_data.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Privacy Concerns */}
              {result.privacy_concerns.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    Privacy Concerns
                  </h4>
                  <ul className="space-y-1">
                    {result.privacy_concerns.map((concern, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Analysis Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Analyzed:</span>
                    <span className="ml-2">{formatDate(result.analysis_timestamp)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Content Length:</span>
                    <span className="ml-2">{result.metadata.content_length.toLocaleString()} chars</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Images Found:</span>
                    <span className="ml-2">{result.metadata.images_found}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Links Found:</span>
                    <span className="ml-2">{result.metadata.links_found}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
