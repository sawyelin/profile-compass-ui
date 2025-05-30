
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search as SearchIcon, Filter, User, FileText, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        {
          type: 'person',
          id: '1',
          name: 'John Doe',
          nrc: '12/MAKANA(N)123456',
          personalId: 'ID-001',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          matchField: 'name'
        },
        {
          type: 'person',
          id: '2',
          name: 'Jane Smith',
          nrc: '12/MAKANA(N)789012',
          personalId: 'ID-002',
          photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
          matchField: 'nrc'
        },
        {
          type: 'document',
          id: '1',
          name: 'National Registration Card - John Doe',
          owner: 'John Doe',
          documentType: 'NRC',
          uploadDate: '2024-01-15'
        }
      ].filter(item => 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nrc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.personalId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900 px-1 rounded">$1</mark>');
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search</h1>
          <p className="text-muted-foreground">
            Find people, documents, and records across the system
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, NRC number, ID, or document type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 text-lg h-12"
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-gradient-to-r from-primary to-accent h-12 px-8"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
              <Button variant="outline" className="h-12">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Found {searchResults.length} results for "{searchQuery}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    {result.type === 'person' ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={result.photo} alt={result.name} />
                            <AvatarFallback>{result.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium" dangerouslySetInnerHTML={{
                              __html: highlightMatch(result.name, searchQuery)
                            }} />
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">
                                <User className="mr-1 h-3 w-3" />
                                Person
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                ID: <span dangerouslySetInnerHTML={{
                                  __html: highlightMatch(result.personalId, searchQuery)
                                }} />
                              </span>
                              <span className="text-sm text-muted-foreground">
                                NRC: <span dangerouslySetInnerHTML={{
                                  __html: highlightMatch(result.nrc, searchQuery)
                                }} />
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" asChild>
                          <Link to={`/person/${result.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium" dangerouslySetInnerHTML={{
                              __html: highlightMatch(result.name, searchQuery)
                            }} />
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">
                                <FileText className="mr-1 h-3 w-3" />
                                Document
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {result.documentType} • {result.owner} • {result.uploadDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          View Document
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Tips */}
        {searchResults.length === 0 && searchQuery && !isSearching && (
          <Card>
            <CardContent className="text-center py-12">
              <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No results found</p>
              <p className="text-muted-foreground">
                Try searching with different keywords or check your spelling
              </p>
            </CardContent>
          </Card>
        )}

        {!searchQuery && (
          <Card>
            <CardHeader>
              <CardTitle>Search Tips</CardTitle>
              <CardDescription>
                Get better results with these search techniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Search by:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Full name or partial name</li>
                    <li>• NRC number (complete or partial)</li>
                    <li>• Personal ID number</li>
                    <li>• Document type or name</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Examples:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• "John Doe"</li>
                    <li>• "12/MAKANA"</li>
                    <li>• "ID-001"</li>
                    <li>• "NRC certificate"</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Search;
