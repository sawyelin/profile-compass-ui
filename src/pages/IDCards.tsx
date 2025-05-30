
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Download, Printer, Search, Plus, Eye } from 'lucide-react';
import { IDCardPreview } from '@/components/IDCardPreview';

const IDCards = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<any>(null);

  const people = [
    {
      id: '1',
      name: 'John Doe',
      nrc: '12/MAKANA(N)123456',
      personalId: 'ID-001',
      dateOfBirth: '1990-05-15',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      cardStatus: 'Generated',
      lastGenerated: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      nrc: '12/MAKANA(N)789012',
      personalId: 'ID-002',
      dateOfBirth: '1988-03-22',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face',
      cardStatus: 'Pending',
      lastGenerated: null
    },
    {
      id: '3',
      name: 'Mike Johnson',
      nrc: '12/MAKANA(N)345678',
      personalId: 'ID-003',
      dateOfBirth: '1992-07-10',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      cardStatus: 'Generated',
      lastGenerated: '2024-02-01'
    },
  ];

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.nrc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.personalId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateCard = (person: any) => {
    setSelectedPerson(person);
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ID Cards</h1>
            <p className="text-muted-foreground">
              Generate and manage identity cards for registered people
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* People List */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Person</CardTitle>
                <CardDescription>
                  Choose a person to generate or view their ID card
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search people..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredPeople.map((person) => (
                    <div 
                      key={person.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                        selectedPerson?.id === person.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedPerson(person)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={person.photo} alt={person.name} />
                          <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{person.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {person.personalId} • {person.nrc}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={person.cardStatus === 'Generated' ? 'default' : 'secondary'}>
                            {person.cardStatus}
                          </Badge>
                          {person.lastGenerated && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {person.lastGenerated}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedPerson && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      onClick={() => generateCard(selectedPerson)}
                      className="flex-1 bg-gradient-to-r from-primary to-accent"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedPerson.cardStatus === 'Generated' ? 'Regenerate' : 'Generate'} Card
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Bulk Actions</CardTitle>
                <CardDescription>
                  Perform actions on multiple cards at once
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download All Cards
                </Button>
                <Button variant="outline" className="w-full">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Selected Cards
                </Button>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Cards for All
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ID Card Preview */}
          <div className="space-y-6">
            {selectedPerson ? (
              <Card>
                <CardHeader>
                  <CardTitle>ID Card Preview</CardTitle>
                  <CardDescription>
                    Preview and customize the ID card for {selectedPerson.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IDCardPreview person={selectedPerson} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No person selected</p>
                  <p className="text-muted-foreground">
                    Select a person from the list to preview their ID card
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Card Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">892</p>
                    <p className="text-sm text-muted-foreground">Cards Generated</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">123</p>
                    <p className="text-sm text-muted-foreground">Pending Cards</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IDCards;
