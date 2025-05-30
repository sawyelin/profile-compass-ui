
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Search, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PersonForm } from '@/components/PersonForm';

const People = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Mock data
  const people = [
    {
      id: '1',
      name: 'John Doe',
      nrc: '12/MAKANA(N)123456',
      personalId: 'ID-001',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      status: 'Active',
      documentsCount: 5
    },
    {
      id: '2',
      name: 'Jane Smith',
      nrc: '12/MAKANA(N)789012',
      personalId: 'ID-002',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
      status: 'Active',
      documentsCount: 3
    },
    {
      id: '3',
      name: 'Mike Johnson',
      nrc: '12/MAKANA(N)345678',
      personalId: 'ID-003',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      status: 'Pending',
      documentsCount: 2
    },
  ];

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.nrc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.personalId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">People</h1>
            <p className="text-muted-foreground">
              Manage all registered individuals in your system
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Person
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Person</DialogTitle>
              </DialogHeader>
              <PersonForm onSuccess={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, NRC, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* People Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPeople.map((person) => (
            <Card key={person.id} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={person.photo} alt={person.name} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{person.name}</CardTitle>
                    <CardDescription>ID: {person.personalId}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">NRC Number</p>
                  <p className="text-sm text-muted-foreground">{person.nrc}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant={person.status === 'Active' ? 'default' : 'secondary'}>
                    {person.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {person.documentsCount} documents
                  </span>
                </div>
                
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/person/${person.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPeople.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No people found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default People;
