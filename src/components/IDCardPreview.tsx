
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, Shield, Verified, CheckCircle, Star, FileText, Image, RotateCcw } from 'lucide-react';
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
  const [showBack, setShowBack] = useState(false);

  console.log('IDCardPreview rendering with person:', person);
  console.log('Current showBack state:', showBack);

  const handleDownloadPDF = async () => {
    console.log('Download PDF clicked');
    const success = await generateCardPDF('id-card-preview', `${person.name}-ID-Card`, true);
    if (success) {
      toast({
        title: "Success",
        description: "ID card PDF with both sides downloaded successfully!",
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
    console.log('Print clicked');
    const success = printCard('id-card-preview', true);
    if (success) {
      toast({
        title: "Print Job Sent",
        description: "ID card with both sides sent to printer successfully!",
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
    console.log('Download Image clicked');
    const success = await downloadCardImage('id-card-preview', `${person.name}-ID-Card`, true);
    if (success) {
      toast({
        title: "Success",
        description: "ID card image with both sides downloaded successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFlipCard = () => {
    console.log('Flip card clicked, current state:', showBack);
    setShowBack(!showBack);
    console.log('New state will be:', !showBack);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Professional ID Card</h3>
          <p className="text-sm text-muted-foreground">Digital identity verification system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleFlipCard} data-flip="true">
            <RotateCcw className="mr-2 h-4 w-4" />
            {showBack ? 'Show Front' : 'Show Back'}
          </Button>
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
            Print
          </Button>
        </div>
      </div>

      {/* Dual-Sided ID Card Preview */}
      <div className="flex justify-center">
        <div id="id-card-preview">
          <DualSidedIDCard person={person} showBack={showBack} />
        </div>
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
                <span className="text-muted-foreground">Tamper Protection</span>
                <div className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Enabled</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Verified className="h-5 w-5 text-blue-600" />
              Card Details
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Card Type</span>
                <span className="font-medium">Digital Identity</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issue Date</span>
                <span className="font-medium">Jan 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valid Until</span>
                <span className="font-medium">Dec 31, 2029</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-emerald-600">Active</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Side</span>
                <span className="font-medium">{showBack ? 'Back (Myanmar eID)' : 'Front'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
