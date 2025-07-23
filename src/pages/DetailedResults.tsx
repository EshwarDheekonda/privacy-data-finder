
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DetailedAnalysisResponse } from '@/types/analysis';
import { AnalysisOverview } from '@/components/analysis/AnalysisOverview';
import { PIIDataSection } from '@/components/analysis/PIIDataSection';
import { RiskAssessmentSection } from '@/components/analysis/RiskAssessmentSection';
import { RecommendationsSection } from '@/components/analysis/RecommendationsSection';
import { DetailedResultCard } from '@/components/analysis/DetailedResultCard';
import { ArrowLeft, Download, Share, AlertTriangle, Shield, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DetailedResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<DetailedAnalysisResponse | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from the API
    // For now, we'll simulate the data structure
    const simulateAnalysisData = (): DetailedAnalysisResponse => {
      return {
        query: location.state?.query || 'John Doe',
        total_processed: 12,
        analysis_timestamp: new Date().toISOString(),
        processing_time: 45.2,
        results: [
          {
            id: 'analysis-1',
            source_url: 'https://linkedin.com/in/johndoe',
            source_type: 'social_media',
            platform: 'LinkedIn',
            title: 'John Doe - Software Engineer',
            content_type: 'profile',
            analysis_timestamp: new Date().toISOString(),
            processing_time: 3.2,
            status: 'completed',
            pii_data: [
              {
                type: 'email',
                value: 'john.doe@company.com',
                confidence: 0.95,
                context: 'Contact information in profile',
                location: 'Profile header',
                severity: 'medium'
              },
              {
                type: 'phone',
                value: '+1-555-0123',
                confidence: 0.88,
                context: 'Listed in contact section',
                location: 'Contact details',
                severity: 'high'
              }
            ],
            overall_risk_score: 7.2,
            risk_level: 'high',
            risk_factors: [
              {
                category: 'Public Exposure',
                description: 'Profile is publicly visible and indexed by search engines',
                severity: 'high',
                impact: 'Personal information easily discoverable',
                mitigation: 'Adjust privacy settings to limit public visibility'
              }
            ],
            content_summary: 'Professional LinkedIn profile with detailed work history and contact information.',
            key_findings: [
              'Direct contact information exposed',
              'Detailed employment history visible',
              'Professional connections accessible'
            ],
            data_exposure: {
              public: true,
              indexed_by_search: true,
              social_sharing: true,
              archived: false
            },
            privacy_concerns: [
              'Contact details publicly visible',
              'Professional network exposed'
            ],
            recommendations: [
              'Limit profile visibility to connections only',
              'Remove direct contact information',
              'Review connection privacy settings'
            ],
            metadata: {
              page_title: 'John Doe - LinkedIn Profile',
              description: 'Software Engineer at Tech Company',
              last_modified: '2024-01-15T10:30:00Z',
              content_length: 2450,
              images_found: 3,
              links_found: 12
            }
          }
        ],
        summary: {
          total_pii_items: 15,
          highest_risk_level: 'high',
          most_common_pii_types: ['email', 'phone', 'personal_info'],
          platforms_analyzed: ['LinkedIn', 'Facebook', 'Twitter'],
          privacy_score: 3.2
        },
        global_recommendations: [
          'Review and update privacy settings across all platforms',
          'Consider removing or limiting publicly visible contact information',
          'Enable two-factor authentication where available'
        ],
        immediate_actions: [
          'Update LinkedIn privacy settings',
          'Remove phone number from public profiles',
          'Review Google search results for your name'
        ]
      };
    };

    // Simulate API call delay
    setTimeout(() => {
      const data = simulateAnalysisData();
      setAnalysisData(data);
      setIsLoading(false);
    }, 1500);
  }, [location.state]);

  const handleExportReport = () => {
    if (!analysisData) return;
    
    toast({
      title: 'Report Generated',
      description: 'Detailed privacy assessment report has been downloaded.',
    });
  };

  const handleShareResults = async () => {
    try {
      const shareData = {
        title: `Privacy Assessment Results for ${analysisData?.query}`,
        text: `Comprehensive PII risk analysis completed`,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
        toast({
          title: 'Link Copied',
          description: 'Results link copied to clipboard.',
        });
      }
    } catch (error) {
      toast({
        title: 'Share Failed',
        description: 'Unable to share results.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <h3 className="text-xl font-semibold">Processing Analysis Results</h3>
              <p className="text-muted-foreground">
                Generating comprehensive privacy assessment report...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Analysis Data Found</h3>
            <p className="text-muted-foreground mb-6">
              Unable to load the detailed analysis results.
            </p>
            <Button onClick={() => navigate('/')}>
              Return to Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="glass-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/results')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Results
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-semibold">Detailed Privacy Analysis</h1>
                <p className="text-sm text-muted-foreground">
                  Analysis for "{analysisData.query}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Privacy Score: {analysisData.summary.privacy_score}/10
              </Badge>
              <Button variant="outline" onClick={handleShareResults}>
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleExportReport}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analysisData.total_processed}</p>
                    <p className="text-sm text-muted-foreground">Sources Analyzed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analysisData.summary.total_pii_items}</p>
                    <p className="text-sm text-muted-foreground">PII Items Found</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    analysisData.summary.highest_risk_level === 'critical' ? 'bg-red-100' :
                    analysisData.summary.highest_risk_level === 'high' ? 'bg-orange-100' :
                    analysisData.summary.highest_risk_level === 'medium' ? 'bg-yellow-100' :
                    'bg-green-100'
                  }`}>
                    <Shield className={`w-6 h-6 ${
                      analysisData.summary.highest_risk_level === 'critical' ? 'text-red-600' :
                      analysisData.summary.highest_risk_level === 'high' ? 'text-orange-600' :
                      analysisData.summary.highest_risk_level === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold capitalize">{analysisData.summary.highest_risk_level}</p>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analysisData.summary.privacy_score.toFixed(1)}/10</p>
                    <p className="text-sm text-muted-foreground">Privacy Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pii-data">PII Data</TabsTrigger>
              <TabsTrigger value="risk-assessment">Risk Assessment</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <AnalysisOverview data={analysisData} />
            </TabsContent>

            <TabsContent value="pii-data" className="mt-6">
              <PIIDataSection results={analysisData.results} />
            </TabsContent>

            <TabsContent value="risk-assessment" className="mt-6">
              <RiskAssessmentSection results={analysisData.results} />
            </TabsContent>

            <TabsContent value="recommendations" className="mt-6">
              <RecommendationsSection 
                globalRecommendations={analysisData.global_recommendations}
                immediateActions={analysisData.immediate_actions}
                results={analysisData.results}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DetailedResults;
