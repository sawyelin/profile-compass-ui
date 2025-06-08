import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Download, Printer, Search, Plus, Eye, FileText, CheckSquare } from 'lucide-react';
import { IDCardPreview } from '@/components/IDCardPreview';
import { generateCardPDF, printCard } from '@/utils/cardUtils';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const IDCards = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

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

  const handleCardSelection = (personId: string, checked: boolean) => {
    if (checked) {
      setSelectedCards([...selectedCards, personId]);
    } else {
      setSelectedCards(selectedCards.filter(id => id !== personId));
    }
  };

  const handleSelectAll = () => {
    if (selectedCards.length === filteredPeople.length) {
      setSelectedCards([]);
    } else {
      setSelectedCards(filteredPeople.map(person => person.id));
    }
  };

  const handleBulkDownloadPDF = async () => {
    if (selectedCards.length === 0) {
      toast({
        title: "No Cards Selected",
        description: "Please select cards to download.",
        variant: "destructive",
      });
      return;
    }

    let successCount = 0;
    for (const personId of selectedCards) {
      const person = people.find(p => p.id === personId);
      if (person) {
        // Create a temporary preview for each person
        setSelectedPerson(person);
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for render
        
        const success = await generateCardPDF('id-card-preview', `${person.name}-ID-Card`);
        if (success) successCount++;
      }
    }

    toast({
      title: "Bulk Download Complete",
      description: `Successfully downloaded ${successCount} of ${selectedCards.length} cards.`,
    });
  };

  const handleBulkPrint = () => {
    if (selectedCards.length === 0) {
      toast({
        title: "No Cards Selected",
        description: "Please select cards to print.",
        variant: "destructive",
      });
      return;
    }

    // For bulk printing, we'll open a single print window with all cards
    const selectedPeople = people.filter(person => selectedCards.includes(person.id));
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Could not open print window.",
        variant: "destructive",
      });
      return;
    }

    let cardsHtml = '';
    selectedPeople.forEach(person => {
      cardsHtml += `
        <div style="page-break-after: always; margin-bottom: 20px;">
          <div style="width: 400px; height: 250px; background: linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a); border-radius: 16px; padding: 24px; color: white; position: relative; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid rgba(71, 85, 105, 0.5);">
            <div style="text-align: center; margin-bottom: 16px; padding-top: 24px;">
              <h4 style="font-size: 18px; font-weight: bold; letter-spacing: 0.1em;">MYANMAR DIGITAL ID</h4>
              <div style="width: 64px; height: 2px; background: linear-gradient(to right, #60a5fa, #34d399); margin: 4px auto;"></div>
            </div>
            <div style="display: flex; align-items: center; gap: 16px; margin-top: 8px;">
              <div style="width: 80px; height: 80px; border: 2px solid rgba(255, 255, 255, 0.6); border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; color: #0f172a; font-weight: bold; font-size: 24px;">
                ${person.name.charAt(0)}
              </div>
              <div style="flex: 1;">
                <h5 style="font-weight: bold; font-size: 18px; letter-spacing: 0.05em;">${person.name}</h5>
                <div style="font-size: 14px; margin-top: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                    <span style="color: #bfdbfe; font-weight: 500;">ID:</span>
                    <span style="font-family: monospace;">${person.personalId}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                    <span style="color: #bfdbfe; font-weight: 500;">NRC:</span>
                    <span style="font-family: monospace; font-size: 12px;">${person.nrc}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #bfdbfe; font-weight: 500;">DOB:</span>
                    <span style="font-size: 12px;">${person.dateOfBirth}</span>
                  </div>
                </div>
              </div>
            </div>
            <div style="position: absolute; bottom: 12px; left: 24px; right: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: rgba(191, 219, 254, 0.8);">
                <span>Serial: SC-${person.personalId}</span>
                <span>Exp: 12/2029</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bulk ID Cards Print</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: system-ui, -apple-system, sans-serif;
              background: white;
            }
            @media print {
              body { margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          ${cardsHtml}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);

    toast({
      title: "Print Job Sent",
      description: `${selectedCards.length} cards sent to printer.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('idCards.title')}</h1>
            <p className="text-muted-foreground">
              {t('idCards.subtitle')}
            </p>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* People List */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('idCards.selectPerson')}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedCards.length === filteredPeople.length && filteredPeople.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">{t('idCards.selectAll')}</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  {t('idCards.selectPersonMessage')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('idCards.searchPlaceholder')}
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
                        <Checkbox
                          checked={selectedCards.includes(person.id)}
                          onCheckedChange={(checked) => handleCardSelection(person.id, checked as boolean)}
                          onClick={(e) => e.stopPropagation()}
                        />
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
                            {t(person.cardStatus === 'Generated' ? 'common.generated' : 'common.pending')}
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
                      {selectedPerson.cardStatus === 'Generated' ? t('idCards.regenerateCard') : t('idCards.generateCard')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Bulk Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('idCards.bulkActions')}</CardTitle>
                <CardDescription>
                  {t('idCards.bulkActions')} ({selectedCards.length} {t('idCards.selectAll')})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleBulkDownloadPDF}
                  disabled={selectedCards.length === 0}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {t('idCards.downloadPDF')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleBulkPrint}
                  disabled={selectedCards.length === 0}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  {t('idCards.printSelected')}
                </Button>
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('idCards.generateAll')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ID Card Preview */}
          <div className="space-y-6">
            {selectedPerson ? (
              <Card>
                <CardHeader>
                  <CardTitle>{t('preview.title')}</CardTitle>
                  <CardDescription>
                    {t('preview.subtitle')} {selectedPerson.name}
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
                  <p className="text-lg font-medium mb-2">{t('idCards.noPersonSelected')}</p>
                  <p className="text-muted-foreground">
                    {t('idCards.selectPersonMessage')}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>{t('idCards.cardStatistics')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">892</p>
                    <p className="text-sm text-muted-foreground">{t('idCards.cardsGenerated')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">123</p>
                    <p className="text-sm text-muted-foreground">{t('idCards.pendingCards')}</p>
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
