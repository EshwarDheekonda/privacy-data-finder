
export interface PIIDataItem {
  type: 'email' | 'phone' | 'address' | 'social_security' | 'credit_card' | 'personal_info' | 'biometric' | 'financial' | 'health' | 'other';
  value: string;
  confidence: number;
  context: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface RiskFactorItem {
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: string;
  mitigation: string;
}

export interface AnalysisResult {
  id: string;
  source_url: string;
  source_type: 'webpage' | 'social_media' | 'document' | 'database';
  platform: string;
  title: string;
  content_type: string;
  analysis_timestamp: string;
  processing_time: number;
  status: 'completed' | 'failed' | 'partial';
  
  // PII Data found
  pii_data: PIIDataItem[];
  
  // Risk Assessment
  overall_risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: RiskFactorItem[];
  
  // Content Analysis
  content_summary: string;
  key_findings: string[];
  data_exposure: {
    public: boolean;
    indexed_by_search: boolean;
    social_sharing: boolean;
    archived: boolean;
  };
  
  // Privacy Assessment
  privacy_concerns: string[];
  recommendations: string[];
  
  // Metadata
  metadata: {
    page_title: string;
    description: string;
    last_modified: string;
    content_length: number;
    images_found: number;
    links_found: number;
  };
}

export interface DetailedAnalysisResponse {
  query: string;
  total_processed: number;
  analysis_timestamp: string;
  processing_time: number;
  results: AnalysisResult[];
  
  // Aggregated Insights
  summary: {
    total_pii_items: number;
    highest_risk_level: 'low' | 'medium' | 'high' | 'critical';
    most_common_pii_types: string[];
    platforms_analyzed: string[];
    privacy_score: number;
  };
  
  // Recommendations
  global_recommendations: string[];
  immediate_actions: string[];
}
