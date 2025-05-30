
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, Edit, FileText, Calendar, User, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IDCardPreview } from '@/components/IDCardPreview';

const PersonProfile = () => {
  const { id } = useParams();

  // Mock data - in real app, fetch based on ID
  const person = {
    id: '1',
    name: 'John Doe',
    nrc: '12/MAKANA(N)123456',
    personalId: 'ID-001',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    phone: '+95 9 123 456 789',
    email: 'john.doe@email.com',
    address: '123 Main Street, Yangon, Myanmar',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    status: 'Active',
    documents: [
      { id: 1, type: 'NRC', name: 'National Registration Card', uploadDate: '2024-01-15', status: 'Verified' },
      { id: 2, type: 'License', name: 'Driving License', uploadDate: '2024-01-20', status: 'Pending' },
      { id: 3, type: 'Certificate', name: 'Education Certificate', uploadDate: '2024-02-01', status: 'Verified' },
    ]
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/people">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Person Profile</h1>
            <p className="text-muted-foreground">
              Detailed view and management
            </p>
          </div>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src={person.photo} alt={person.name} />
                <AvatarFallback className="text-4xl">{person.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold">{person.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant={person.status === 'Active' ? 'default' : 'secondary'}>
                      {person.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">ID: {person.personalId}</span>
                    <span className="text-sm text-muted-foreground">NRC: {person.nrc}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{person.gender}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{person.dateOfBirth}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{person.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{person.email}</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <span className="text-sm">{person.address}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Generate ID Card
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="idcard">ID Card Preview</TabsTrigger>
            <TabsTrigger value="history">Activity History</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
                <CardDescription>
                  All documents associated with this person
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {person.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {doc.type} • Uploaded {doc.uploadDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={doc.status === 'Verified' ? 'default' : 'secondary'}>
                          {doc.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="idcard">
            <IDCardPreview person={person} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
                <CardDescription>
                  Recent activities and changes for this person
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Profile created</p>
                      <p className="text-xs text-muted-foreground">January 15, 2024 at 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">NRC document uploaded</p>
                      <p className="text-xs text-muted-foreground">January 15, 2024 at 11:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">ID card generated</p>
                      <p className="text-xs text-muted-foreground">January 16, 2024 at 2:15 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PersonProfile;
