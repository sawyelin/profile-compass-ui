
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, Shield, Verified, CheckCircle, Star } from 'lucide-react';
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
          <h3 className="text-xl font-bold">Professional ID Card</h3>
          <p className="text-sm text-muted-foreground">Digital identity verification system</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Enhanced Professional ID Card */}
      <div className="flex justify-center">
        <div className="w-[400px] h-[250px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl border border-slate-700/50">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 border border-white/20 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 border border-white/20 rounded-full transform -translate-x-12 translate-y-12"></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-1 bg-white/10 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
          </div>

          {/* Security Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-600/80 px-2 py-1 rounded-full text-xs font-medium">
            <Shield className="h-3 w-3" />
            <span>SECURE</span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1 bg-blue-600/80 px-2 py-1 rounded-full text-xs font-medium">
            <Verified className="h-3 w-3" />
            <span>VERIFIED</span>
          </div>

          {/* Header */}
          <div className="text-center mb-4 pt-6">
            <h4 className="text-lg font-bold tracking-wider">MYANMAR DIGITAL ID</h4>
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mt-1"></div>
          </div>

          {/* Main Content */}
          <div className="flex items-center gap-4 mt-2">
            <Avatar className="h-20 w-20 border-2 border-white/60 shadow-lg">
              <AvatarImage src={person.photo} alt={person.name} />
              <AvatarFallback className="text-slate-800 text-lg font-bold bg-white">
                {person.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <h5 className="font-bold text-lg tracking-wide">{person.name}</h5>
              <div className="space-y-0.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-200 font-medium">ID:</span>
                  <span className="font-mono">{person.personalId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-200 font-medium">NRC:</span>
                  <span className="font-mono text-xs">{person.nrc}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-200 font-medium">DOB:</span>
                  <span className="text-xs">{person.dateOfBirth}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 mt-2">
                <div className="px-2 py-0.5 bg-emerald-500/80 rounded text-xs font-semibold flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  CITIZEN
                </div>
                <div className="px-2 py-0.5 bg-blue-500/80 rounded text-xs font-semibold flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  ACTIVE
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="p-1.5 bg-white rounded-lg shadow-md">
                <img
                  src={generateQRCode(`${person.personalId}-${person.nrc}`)}
                  alt="QR Code"
                  className="w-14 h-14"
                />
              </div>
              <p className="text-xs text-blue-200 font-medium">SCAN</p>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-3 left-6 right-6">
            <div className="flex justify-between items-center text-xs text-blue-200/80">
              <span>Serial: SC-{person.personalId}</span>
              <span>Exp: 12/2029</span>
            </div>
          </div>

          {/* Holographic effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
