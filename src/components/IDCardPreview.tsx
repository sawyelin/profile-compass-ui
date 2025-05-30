
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const generateQRCode = (text: string) => {
    // Mock QR code - in real app, use a QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">ID Card Preview</h3>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* ID Card */}
      <div className="flex justify-center">
        <div className="w-96 h-64 id-card rounded-2xl p-6 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-accent to-primary"></div>
            <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white/20 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white/20 rounded-full"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="text-center mb-4">
              <h4 className="text-lg font-bold">IDENTITY CARD</h4>
              <p className="text-xs opacity-80">Myanmar Identity Management System</p>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-white/50">
                <AvatarImage src={person.photo} alt={person.name} />
                <AvatarFallback className="text-gray-800">{person.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <h5 className="font-bold text-lg">{person.name}</h5>
                <p className="text-sm opacity-90">ID: {person.personalId}</p>
                <p className="text-sm opacity-90">NRC: {person.nrc}</p>
                <p className="text-xs opacity-80">DOB: {person.dateOfBirth}</p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <img
                  src={generateQRCode(`${person.personalId}-${person.nrc}`)}
                  alt="QR Code"
                  className="w-16 h-16 bg-white rounded-lg p-1"
                />
                <p className="text-xs opacity-80">Scan QR</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-xs opacity-60">Valid until: December 2029</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Info */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4">Card Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Card Type</p>
              <p className="font-medium">Standard Identity Card</p>
            </div>
            <div>
              <p className="text-muted-foreground">Issue Date</p>
              <p className="font-medium">January 15, 2024</p>
            </div>
            <div>
              <p className="text-muted-foreground">Expiry Date</p>
              <p className="font-medium">December 31, 2029</p>
            </div>
            <div>
              <p className="text-muted-foreground">Card Status</p>
              <p className="font-medium text-green-600">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
