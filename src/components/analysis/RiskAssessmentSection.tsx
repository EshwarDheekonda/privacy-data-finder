
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AnalysisResult } from '@/types/analysis';
import { useMemo } from 'react';
import { AlertTriangle, Shield, TrendingUp, Target, Globe, Lock } from 'lucide-react';

interface RiskAssessmentSectionProps {
  results: AnalysisResult[];
}

export const RiskAssessmentSection = ({ results }: RiskAssessmentSectionProps) => {
  // Calculate aggregated risk metrics
  const riskMetrics = useMemo(() => {
    const totalResults = results.length;
    const averageRiskScore = results.reduce((sum, result) => sum + result.overall_risk_score, 0) / totalResults;
    
    const riskDistribution = {
      critical: results.filter(r => r.risk_level === 'critical').length,
      high: results.filter(r => r.risk_level === 'high').length,
      medium: results.filter(r => r.risk_level === 'medium').length,
      low: results.filter(r => r.risk_level === 'low').length,
    };

    // Aggregate all risk factors
    const allRiskFactors = results.flatMap(result => result.risk_factors);
    const riskFactorsByCategory = allRiskFactors.reduce((acc, factor) => {
      if (!acc[factor.category]) {
        acc[factor.category] = [];
      }
      acc[factor.category].push(factor);
      return acc;
    }, {} as Record<string, typeof allRiskFactors>);

    // Calculate exposure metrics
    const exposureMetrics = {
      publicSources: results.filter(r => r.data_exposure.public).length,
      searchIndexed: results.filter(r => r.data_exposure.indexed_by_search).length,
      socialSharing: results.filter(r => r.data_exposure.social_sharing).length,
      archived: results.filter(r => r.data_exposure.archived).length,
    };

    return {
      averageRiskScore,
      riskDistribution,
      riskFactorsByCategory,
      exposureMetrics,
      totalResults
    };
  }, [results]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 8) return 'text-red-600';
    if (score >= 6) return 'text-orange-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 8) return 'bg-red-500';
    if (score >= 6) return 'bg-orange-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Overall Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Overall Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Average Risk Score</span>
                  <span className={`text-2xl font-bold ${getRiskScoreColor(riskMetrics.averageRiskScore)}`}>
                    {riskMetrics.averageRiskScore.toFixed(1)}/10
                  </span>
                </div>
                <Progress 
                  value={riskMetrics.averageRiskScore * 10} 
                  className="h-3"
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Risk Distribution</h4>
                {Object.entries(riskMetrics.riskDistribution).map(([level, count]) => (
                  <div key={level} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {level === 'critical' || level === 'high' ? (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      ) : (
                        <Shield className="w-4 h-4 text-green-600" />
                      )}
                      <span className="capitalize">{level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskLevelColor(level)} variant="outline">
                        {count}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ({Math.round((count / riskMetrics.totalResults) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Data Exposure Analysis
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Publicly Accessible</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {riskMetrics.exposureMetrics.publicSources}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({Math.round((riskMetrics.exposureMetrics.publicSources / riskMetrics.totalResults) * 100)}%)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Search Engine Indexed</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {riskMetrics.exposureMetrics.searchIndexed}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({Math.round((riskMetrics.exposureMetrics.searchIndexed / riskMetrics.totalResults) * 100)}%)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Social Media Sharing</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {riskMetrics.exposureMetrics.socialSharing}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({Math.round((riskMetrics.exposureMetrics.socialSharing / riskMetrics.totalResults) * 100)}%)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Archived/Cached</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {riskMetrics.exposureMetrics.archived}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({Math.round((riskMetrics.exposureMetrics.archived / riskMetrics.totalResults) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Risk Factor Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(riskMetrics.riskFactorsByCategory).map(([category, factors]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {category}
                  <Badge variant="secondary">{factors.length}</Badge>
                </h4>
                
                <div className="space-y-2">
                  {factors.slice(0, 3).map((factor, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getRiskLevelColor(factor.severity)} variant="outline">
                              {factor.severity}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{factor.description}</p>
                          <p className="text-xs text-muted-foreground">
                            <strong>Impact:</strong> {factor.impact}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-start gap-2">
                          <Lock className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-green-700">Recommended Mitigation:</p>
                            <p className="text-xs text-green-600">{factor.mitigation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {factors.length > 3 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      +{factors.length - 3} more risk factors in this category
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Source Risk Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Source-by-Source Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results
              .sort((a, b) => b.overall_risk_score - a.overall_risk_score)
              .map((result, index) => (
                <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium">{result.title}</span>
                      <Badge variant="outline">{result.platform}</Badge>
                      <Badge className={getRiskLevelColor(result.risk_level)} variant="outline">
                        {result.risk_level}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Risk Score</span>
                          <span className={`font-bold ${getRiskScoreColor(result.overall_risk_score)}`}>
                            {result.overall_risk_score.toFixed(1)}/10
                          </span>
                        </div>
                        <Progress 
                          value={result.overall_risk_score * 10} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="text-right text-sm text-muted-foreground">
                        <div>{result.pii_data.length} PII items</div>
                        <div>{result.risk_factors.length} risk factors</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
