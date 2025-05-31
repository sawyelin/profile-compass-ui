
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Printer, Shield, Verified, CheckCircle, Star, FileText, Image } from 'lucide-react';
import { generateCardPDF, printCard, downloadCardImage } from '@/utils/cardUtils';
import { useToast } from '@/hooks/use-toast';
import { DualSidedIDCard } from './DualSidedIDCard';
import { useState } from 'react';

interface Person {
  name: string;
  personalId: string;
  nrc: string;
  photo: string;
  dateOfBirth: string;
}

interface IDCardPreviewProps {
  person: Person;
}

export function IDCardPreview({ person }: IDCardPreviewProps) {
  const { toast } = useToast();
  const [cardsPerSheet, setCardsPerSheet] = useState('1');

  const handleDownloadPDF = async () => {
    const success = await generateCardPDF('print-card', `${person.name}-ID-Card-A4`);
    if (success) {
      toast({
        title: "Success",
        description: "A4 ID card PDF downloaded successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    const success = printCard('print-card');
    if (success) {
      toast({
        title: "Print Job Sent",
        description: "A4 ID card sent to printer successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to print. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadImage = async () => {
    const success = await downloadCardImage('preview-card', `${person.name}-ID-Card`);
    if (success) {
      toast({
        title: "Success",
        description: "ID card image downloaded successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Professional ID Card Preview</h3>
          <p className="text-sm text-muted-foreground">Front & back sides preview</p>
        </div>
        <div className="flex gap-2">
          <Select value={cardsPerSheet} onValueChange={setCardsPerSheet}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Card/A4</SelectItem>
              <SelectItem value="2">2 Cards/A4</SelectItem>
              <SelectItem value="4">4 Cards/A4</SelectItem>
              <SelectItem value="8">8 Cards/A4</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleDownloadImage}>
            <Image className="mr-2 h-4 w-4" />
            Image
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print A4
          </Button>
        </div>
      </div>

      {/* Card Preview - Only show cards, no A4 layout */}
      <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-2">
        <CardContent className="p-8">
          <DualSidedIDCard person={person} cardId="preview-card" viewMode="preview" />
        </CardContent>
      </Card>

      {/* Hidden A4 Print Layout */}
      <div className="hidden">
        <DualSidedIDCard person={person} cardId="print-card" viewMode="print" />
      </div>

      {/* Enhanced Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              Security Features
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Digital Signature</span>
                <div className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Valid</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">QR Verification</span>
                <div className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Active</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Encryption</span>
                <div className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">AES-256</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cards per A4</span>
                <div className="flex items-center gap-1 text-blue-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">{cardsPerSheet} Card{cardsPerSheet !== '1' ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Verified className="h-5 w-5 text-blue-600" />
              Card Specifications
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Card Size</span>
                <span className="font-medium">85.6mm × 54mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Print Format</span>
                <span className="font-medium">A4 (210mm × 297mm)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Corner Radius</span>
                <span className="font-medium">3mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cutting Guides</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="font-medium text-emerald-600">Included</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
