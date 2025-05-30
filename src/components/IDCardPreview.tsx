
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, Shield, Verified } from 'lucide-react';
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
    return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Smart ID Card Preview</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Next-generation identity verification</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="smart-button-secondary">
            <Download className="mr-2 h-4 w-4" />
            Download HD
          </Button>
          <Button className="smart-button-primary">
            <Printer className="mr-2 h-4 w-4" />
            Print Card
          </Button>
        </div>
      </div>

      {/* Smart ID Card */}
      <div className="flex justify-center">
        <div className="w-[420px] h-[280px] smart-id-card rounded-3xl p-8 text-white relative overflow-hidden transform hover:scale-105 transition-all duration-500 animate-scale-in">
          {/* Holographic Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-6 right-6 w-24 h-24 border-2 border-white/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-20 h-20 border-2 border-white/20 rounded-full animate-float"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-white/10 rotate-45"></div>
          </div>

          {/* Security Features */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-300" />
            <span className="text-xs font-medium opacity-90">SECURE</span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Verified className="h-5 w-5 text-emerald-300" />
            <span className="text-xs font-medium opacity-90">VERIFIED</span>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="text-center mb-6">
              <h4 className="text-xl font-bold tracking-wide">SMART IDENTITY CARD</h4>
              <p className="text-xs opacity-80 tracking-widest">MYANMAR DIGITAL ID SYSTEM</p>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center gap-6">
              <Avatar className="h-24 w-24 border-3 border-white/60 shadow-xl">
                <AvatarImage src={person.photo} alt={person.name} />
                <AvatarFallback className="text-gray-800 text-lg font-bold">
                  {person.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <h5 className="font-bold text-xl tracking-wide">{person.name}</h5>
                <div className="space-y-1">
                  <p className="text-sm opacity-95 font-medium">ID: {person.personalId}</p>
                  <p className="text-sm opacity-95 font-medium">NRC: {person.nrc}</p>
                  <p className="text-xs opacity-80">DOB: {person.dateOfBirth}</p>
                </div>
                <div className="mt-3 px-3 py-1 bg-white/20 rounded-full inline-block">
                  <span className="text-xs font-semibold">CITIZEN</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-lg">
                  <img
                    src={generateQRCode(`${person.personalId}-${person.nrc}`)}
                    alt="QR Code"
                    className="w-16 h-16"
                  />
                </div>
                <p className="text-xs opacity-80 font-medium">SCAN TO VERIFY</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-white/20">
              <p className="text-xs opacity-70">Valid until: December 2029 • Serial: SC-{person.personalId}</p>
            </div>
          </div>

          {/* Microtext Security Feature */}
          <div className="absolute bottom-1 left-4 text-[6px] opacity-40 tracking-wider">
            SECURE•AUTHENTIC•VERIFIED•DIGITAL•IDENTITY•MANAGEMENT•SYSTEM
          </div>
        </div>
      </div>

      {/* Enhanced Card Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="smart-glass-card">
          <CardContent className="p-6">
            <h4 className="font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Security Features
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Holographic Security</span>
                <span className="font-medium text-emerald-600">✓ Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">QR Code Verification</span>
                <span className="font-medium text-emerald-600">✓ Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Digital Signature</span>
                <span className="font-medium text-emerald-600">✓ Valid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Anti-Counterfeiting</span>
                <span className="font-medium text-emerald-600">✓ Protected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="smart-glass-card">
          <CardContent className="p-6">
            <h4 className="font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Verified className="h-5 w-5 text-purple-600" />
              Card Information
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Card Type</span>
                <span className="font-medium">Smart Identity Card</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Issue Date</span>
                <span className="font-medium">January 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Expiry Date</span>
                <span className="font-medium">December 31, 2029</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className="font-medium text-emerald-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Active
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
