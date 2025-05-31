
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, Verified, CheckCircle, Star, QrCode, Building2, Phone, Mail, MapPin } from 'lucide-react';

interface Person {
  name: string;
  personalId: string;
  nrc: string;
  photo: string;
  dateOfBirth: string;
}

interface DualSidedIDCardProps {
  person: Person;
  cardId: string;
}

export function DualSidedIDCard({ person, cardId }: DualSidedIDCardProps) {
  const generateQRCode = (text: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(text)}`;
  };

  return (
    <div id={cardId} className="w-full max-w-4xl mx-auto bg-white p-8">
      {/* A4 Layout Container */}
      <div className="grid grid-cols-2 gap-8 min-h-[297mm]">
        
        {/* Front Side */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-center text-gray-800 mb-4">FRONT SIDE</h3>
          
          {/* Cut Guidelines */}
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-gray-400"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-gray-400"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-gray-400"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-gray-400"></div>
            
            {/* Front Card */}
            <div className="w-[85.6mm] h-[54mm] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-xl p-4 text-white relative overflow-hidden shadow-xl border border-slate-700/50">
              
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 border border-white/20 rounded-full transform translate-x-10 -translate-y-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border border-white/20 rounded-full transform -translate-x-8 translate-y-8"></div>
              </div>

              {/* Security Badges */}
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-600/90 px-1.5 py-0.5 rounded-full text-xs font-medium">
                <Shield className="h-2.5 w-2.5" />
                <span>SECURE</span>
              </div>

              <div className="absolute top-2 right-2 flex items-center gap-1 bg-blue-600/90 px-1.5 py-0.5 rounded-full text-xs font-medium">
                <Verified className="h-2.5 w-2.5" />
                <span>VERIFIED</span>
              </div>

              {/* Header */}
              <div className="text-center mb-3 pt-4">
                <h4 className="text-sm font-bold tracking-wider">MYANMAR DIGITAL ID</h4>
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mt-1"></div>
              </div>

              {/* Main Content */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white/60 shadow-lg">
                  <AvatarImage src={person.photo} alt={person.name} />
                  <AvatarFallback className="text-slate-800 text-sm font-bold bg-white">
                    {person.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <h5 className="font-bold text-sm tracking-wide">{person.name}</h5>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-blue-200 font-medium">ID:</span>
                      <span className="font-mono">{person.personalId}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-blue-200 font-medium">NRC:</span>
                      <span className="font-mono text-xs">{person.nrc}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-blue-200 font-medium">DOB:</span>
                      <span className="text-xs">{person.dateOfBirth}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1">
                    <div className="px-1.5 py-0.5 bg-emerald-500/80 rounded text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="h-2 w-2" />
                      CITIZEN
                    </div>
                    <div className="px-1.5 py-0.5 bg-blue-500/80 rounded text-xs font-semibold flex items-center gap-1">
                      <Star className="h-2 w-2" />
                      ACTIVE
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-2 left-4 right-4">
                <div className="flex justify-between items-center text-xs text-blue-200/80">
                  <span>Serial: SC-{person.personalId}</span>
                  <span>Exp: 12/2029</span>
                </div>
              </div>

              {/* Holographic effect */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-center text-gray-800 mb-4">BACK SIDE</h3>
          
          {/* Cut Guidelines */}
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-gray-400"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-gray-400"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-gray-400"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-gray-400"></div>
            
            {/* Back Card */}
            <div className="w-[85.6mm] h-[54mm] bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-xl p-4 text-white relative overflow-hidden shadow-xl border border-slate-600/50">
              
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-15">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-1 bg-white/10 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-1 bg-white/10 transform -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
              </div>

              {/* Header */}
              <div className="text-center mb-3">
                <h4 className="text-xs font-bold tracking-wider text-blue-200">REPUBLIC OF THE UNION OF MYANMAR</h4>
                <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto mt-1"></div>
              </div>

              {/* QR Code Section */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="p-1 bg-white rounded-lg shadow-md">
                    <img
                      src={generateQRCode(`${person.personalId}-${person.nrc}-${person.name}`)}
                      alt="QR Code"
                      className="w-16 h-16"
                    />
                  </div>
                  <p className="text-xs text-blue-200 font-medium mt-1">VERIFY</p>
                </div>

                <div className="flex-1 space-y-2">
                  {/* Contact Information */}
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      ISSUING AUTHORITY
                    </h5>
                    <p className="text-xs text-blue-100">Ministry of Immigration</p>
                    <p className="text-xs text-blue-100">& Population</p>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      CONTACT
                    </h5>
                    <p className="text-xs text-blue-100">+95-1-234-5678</p>
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      EMAIL
                    </h5>
                    <p className="text-xs text-blue-100">info@mip.gov.mm</p>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="absolute bottom-2 left-4 right-4">
                <div className="border-t border-white/20 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-300 font-medium">DIGITAL SIGNATURE</span>
                    <span className="text-blue-200">AES-256 ENCRYPTED</span>
                  </div>
                </div>
              </div>

              {/* Holographic effect */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-transparent via-white/3 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Cutting Instructions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
          ✂️ Cutting Instructions
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Cut along the corner guides (L-shaped marks)</li>
          <li>• Standard credit card size: 85.6mm × 54mm</li>
          <li>• Use a sharp craft knife for clean edges</li>
          <li>• Round corners with 3mm radius for professional finish</li>
        </ul>
      </div>
    </div>
  );
}
