
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnalysisResult, PIIDataItem } from '@/types/analysis';
import { useState, useMemo } from 'react';
import { Search, Filter, AlertTriangle, Shield, Eye, EyeOff } from 'lucide-react';

interface PIIDataSectionProps {
  results: AnalysisResult[];
}

export const PIIDataSection = ({ results }: PIIDataSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showValues, setShowValues] = useState(false);

  // Aggregate all PII data
  const allPIIData = useMemo(() => {
    const piiItems: (PIIDataItem & { source: string; platform: string })[] = [];
    
    results.forEach(result => {
      result.pii_data.forEach(pii => {
        piiItems.push({
          ...pii,
          source: result.source_url,
          platform: result.platform
        });
      });
    });
    
    return piiItems;
  }, [results]);

  // Filter PII data
  const filteredPIIData = useMemo(() => {
    return allPIIData.filter(pii => {
      const matchesSearch = searchTerm === '' || 
        pii.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pii.context.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pii.platform.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || pii.type === typeFilter;
      const matchesSeverity = severityFilter === 'all' || pii.severity === severityFilter;
      
      return matchesSearch && matchesType && matchesSeverity;
    });
  }, [allPIIData, searchTerm, typeFilter, severityFilter]);

  // Get unique types and severities for filters
  const uniqueTypes = [...new Set(allPIIData.map(pii => pii.type))];
  const uniqueSeverities = [...new Set(allPIIData.map(pii => pii.severity))];

  // Statistics
  const stats = useMemo(() => {
    const typeStats = uniqueTypes.map(type => ({
      type,
      count: allPIIData.filter(pii => pii.type === type).length
    }));

    const severityStats = uniqueSeverities.map(severity => ({
      severity,
      count: allPIIData.filter(pii => pii.severity === severity).length
    }));

    return { typeStats, severityStats };
  }, [allPIIData, uniqueTypes, uniqueSeverities]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const maskValue = (value: string, type: string) => {
    if (showValues) return value;
    
    switch (type) {
      case 'email':
        const [local, domain] = value.split('@');
        return `${local.slice(0, 2)}***@${domain}`;
      case 'phone':
        return value.replace(/\d(?=\d{4})/g, '*');
      case 'social_security':
        return '***-**-' + value.slice(-4);
      case 'credit_card':
        return '**** **** **** ' + value.slice(-4);
      default:
        return value.length > 10 ? value.slice(0, 3) + '***' + value.slice(-3) : '***';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">PII Types Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.typeStats.sort((a, b) => b.count - a.count).map(({ type, count }) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.severityStats.sort((a, b) => {
                const order = { critical: 4, high: 3, medium: 2, low: 1 };
                return (order[b.severity as keyof typeof order] || 0) - (order[a.severity as keyof typeof order] || 0);
              }).map(({ severity, count }) => (
                <div key={severity} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(severity)}
                    <span className="text-sm capitalize">{severity}</span>
                  </div>
                  <Badge className={getSeverityColor(severity)} variant="outline">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">PII Data Details</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowValues(!showValues)}
              className="flex items-center gap-2"
            >
              {showValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showValues ? 'Hide Values' : 'Show Values'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search PII data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                {uniqueSeverities.map(severity => (
                  <SelectItem key={severity} value={severity} className="capitalize">
                    {severity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PII Data List */}
          <div className="space-y-3">
            {filteredPIIData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No PII data matches the current filters.</p>
              </div>
            ) : (
              filteredPIIData.map((pii, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize">
                        {pii.type.replace('_', ' ')}
                      </Badge>
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {maskValue(pii.value, pii.type)}
                      </span>
                      <Badge className={getSeverityColor(pii.severity)} variant="outline">
                        {getSeverityIcon(pii.severity)}
                        <span className="ml-1 capitalize">{pii.severity}</span>
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Context:</strong> {pii.context}</p>
                      <p><strong>Location:</strong> {pii.location}</p>
                      <p><strong>Source:</strong> {pii.platform}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {Math.round(pii.confidence * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Confidence
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredPIIData.length > 0 && (
            <div className="mt-4 pt-4 border-t text-center text-sm text-muted-foreground">
              Showing {filteredPIIData.length} of {allPIIData.length} PII items
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
