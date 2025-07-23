
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AnalysisResult } from '@/types/analysis';
import { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Shield, 
  AlertTriangle, 
  Target, 
  BookOpen,
  ExternalLink,
  Zap
} from 'lucide-react';

interface RecommendationsSectionProps {
  globalRecommendations: string[];
  immediateActions: string[];
  results: AnalysisResult[];
}

export const RecommendationsSection = ({ 
  globalRecommendations, 
  immediateActions, 
  results 
}: RecommendationsSectionProps) => {
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const toggleActionCompletion = (action: string) => {
    const newCompleted = new Set(completedActions);
    if (newCompleted.has(action)) {
      newCompleted.delete(action);
    } else {
      newCompleted.add(action);
    }
    setCompletedActions(newCompleted);
  };

  // Get all unique recommendations from individual results
  const sourceSpecificRecommendations = results.flatMap(result => 
    result.recommendations.map(rec => ({
      recommendation: rec,
      source: result.title,
      platform: result.platform,
      riskLevel: result.risk_level
    }))
  );

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (level: string) => {
    switch (level) {
      case 'critical':
      case 'high':
        return <Zap className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      case 'low':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Immediate Actions */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Zap className="w-5 h-5" />
            Immediate Actions Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-orange-700 mb-4">
            These actions should be taken immediately to reduce your privacy risk exposure.
          </p>
          
          <div className="space-y-3">
            {immediateActions.map((action, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-background border border-orange-200 rounded-lg">
                <Checkbox
                  checked={completedActions.has(action)}
                  onCheckedChange={() => toggleActionCompletion(action)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className={`text-sm ${completedActions.has(action) ? 'line-through text-muted-foreground' : ''}`}>
                    {action}
                  </p>
                </div>
                <AlertTriangle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-orange-100 border-l-4 border-orange-500 rounded-r-lg">
            <p className="text-sm text-orange-800 font-medium">
              Progress: {completedActions.size} of {immediateActions.length} actions completed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Global Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            General Privacy Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Long-term strategies to improve your overall privacy posture and reduce future risks.
          </p>
          
          <div className="space-y-3">
            {globalRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Source-Specific Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Source-Specific Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Targeted recommendations for each platform and source where your information was found.
          </p>
          
          <div className="space-y-4">
            {sourceSpecificRecommendations.map((item, index) => (
              <div key={index} className={`p-4 border rounded-lg ${getRiskLevelColor(item.riskLevel)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(item.riskLevel)}
                    <Badge variant="outline" className="capitalize">
                      {item.platform}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {item.riskLevel} Priority
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-sm mb-2">{item.recommendation}</p>
                <p className="text-xs text-muted-foreground">
                  <strong>Source:</strong> {item.source}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Additional Privacy Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Privacy Tools</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-primary" />
                  <span>Privacy-focused browsers (Firefox, Brave)</span>
                </li>
                <li className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-primary" />
                  <span>VPN services for online anonymity</span>
                </li>
                <li className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-primary" />
                  <span>Password managers</span>
                </li>
                <li className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-primary" />
                  <span>Two-factor authentication apps</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Educational Resources</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-primary" />
                  <span>GDPR rights and regulations</span>
                </li>
                <li className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-primary" />
                  <span>Data broker opt-out guides</span>
                </li>
                <li className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-primary" />
                  <span>Social media privacy settings</span>
                </li>
                <li className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-primary" />
                  <span>Identity theft protection</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
