import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Search, Plus, Users as FamilyIcon, Trees, History, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Family = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock family data
  const families = [
    {
      id: '1',
      familyName: 'Doe Family',
      headOfFamily: 'John Doe',
      members: 5,
      generations: 3,
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      location: 'Yangon, Myanmar',
      established: '1940',
      documents: 12
    },
    {
      id: '2',
      familyName: 'Smith Family',
      headOfFamily: 'Michael Smith',
      members: 8,
      generations: 4,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      location: 'Mandalay, Myanmar',
      established: '1935',
      documents: 18
    },
    {
      id: '3',
      familyName: 'Johnson Family',
      headOfFamily: 'Sarah Johnson',
      members: 6,
      generations: 3,
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face',
      location: 'Naypyidaw, Myanmar',
      established: '1950',
      documents: 9
    }
  ];

  const filteredFamilies = families.filter(family =>
    family.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.headOfFamily.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FamilyIcon className="h-8 w-8 text-primary" />
              Family Management
            </h1>
            <p className="text-muted-foreground">
              Manage family trees, relationships, and genealogy records
            </p>
          </div>
          <Button className="smart-button-primary">
            <Plus className="mr-2 h-4 w-4" />
            Create New Family
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="smart-glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">1,247</p>
                  <p className="text-sm text-muted-foreground">Total Families</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="smart-glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Trees className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">4,891</p>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="smart-glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <History className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">892</p>
                  <p className="text-sm text-muted-foreground">Family Events</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="smart-glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-2xl font-bold text-amber-600">2,341</p>
                  <p className="text-sm text-muted-foreground">Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="smart-glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search families by name, head of family, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Families Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFamilies.map((family) => (
            <Card key={family.id} className="smart-glass-card hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarImage src={family.photo} alt={family.headOfFamily} />
                    <AvatarFallback className="text-lg font-bold">
                      {family.familyName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                        {family.familyName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Head: {family.headOfFamily}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Est. {family.established} • {family.location}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {family.members} members
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {family.generations} generations
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {family.documents} docs
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/person/${family.id}`}>
                      <Trees className="mr-1 h-3 w-3" />
                      View Tree
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <History className="mr-1 h-3 w-3" />
                    History
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="smart-glass-card border-2 border-dashed border-primary/30">
            <CardContent className="text-center py-8">
              <Trees className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Build Family Tree</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create comprehensive family trees with multiple generations
              </p>
              <Button variant="outline">Start Building</Button>
            </CardContent>
          </Card>

          <Card className="smart-glass-card border-2 border-dashed border-green-500/30">
            <CardContent className="text-center py-8">
              <History className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">Record Family History</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Document important family events and milestones
              </p>
              <Button variant="outline">Add Events</Button>
            </CardContent>
          </Card>

          <Card className="smart-glass-card border-2 border-dashed border-purple-500/30">
            <CardContent className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-purple-600 mb-4" />
              <h3 className="font-semibold mb-2">Manage Documents</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Store and organize family documents and certificates
              </p>
              <Button variant="outline">Upload Files</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Family;
