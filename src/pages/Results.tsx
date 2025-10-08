import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { ResultsProvider } from '@/contexts/ResultsContext';
import { ProtectedResults } from '@/components/ProtectedResults';
import { SearchResponse } from '@/lib/api';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ArrowLeft, Download, Share, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);

  useEffect(() => {
    // Get search response from navigation state
    const response = location.state?.searchResponse as SearchResponse;
    
    console.log('Results page received state:', {
      hasResponse: !!response,
      totalResults: response?.total_results,
      resultsCount: response?.results?.length
    });
    
    if (!response) {
      // If no search response, redirect to home
      toast({
        title: 'No Results Found',
        description: 'Please perform a search first.',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    setSearchResponse(response);
  }, [location.state, navigate]);

  const handleNewSearch = () => {
    navigate('/');
  };

  const handleExportAll = () => {
    if (!searchResponse) return;
    
    // Create CSV content
    const csvContent = [
      'Name,Source,Risk Level,Data Types,Found Date,Title,Snippet',
      ...(searchResponse.results || []).map(result => 
        `"${result.title || result.name}","${result.source}","${result.risk_level}","${(result.data_types || []).join('; ')}","${result.found_at}","${result.title || ''}","${result.snippet || ''}"`
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `privacy-assessment-${searchResponse.query}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: 'Results have been exported to CSV.',
    });
  };

  const handleShare = async () => {
    if (!searchResponse) return;

    const shareData = {
      title: `Privacy Assessment Results for ${searchResponse.query}`,
      text: `Found ${searchResponse.results?.length || 0} privacy-related results for ${searchResponse.query}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        toast({
          title: 'Link Copied',
          description: 'Results summary copied to clipboard.',
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

  if (!searchResponse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <ResultsProvider>
      <PageLayout>
        <PageHeader
          title="Privacy Assessment Results"
          leftActions={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewSearch}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">New Search</span>
            </Button>
          }
          rightActions={
            <>
              <Button variant="outline" size="sm" onClick={handleShare} className="w-full md:w-auto">
                <Share className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Share</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportAll} className="w-full md:w-auto">
                <Download className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Export All</span>
              </Button>
              <Button size="sm" onClick={handleNewSearch} className="w-full md:w-auto hidden md:flex">
                <RefreshCw className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">New Search</span>
              </Button>
            </>
          }
        />

        <div className="py-6 md:py-8">
          <ProtectedResults 
            searchQuery={searchResponse.query}
            resultsCount={searchResponse.results?.length}
          >
            <ResultsDisplay searchResponse={searchResponse} />
          </ProtectedResults>
        </div>
      </PageLayout>
    </ResultsProvider>
  );
};

export default Results;