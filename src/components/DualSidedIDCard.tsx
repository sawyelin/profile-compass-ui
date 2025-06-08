
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, Verified, CheckCircle, Star, QrCode } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Person {
  name: string;
  personalId: string;
  nrc: string;
  photo: string;
  dateOfBirth: string;
}

interface DualSidedIDCardProps {
  person: Person;
  showBack?: boolean;
}

export function DualSidedIDCard({ person, showBack = false }: DualSidedIDCardProps) {
  const { t } = useLanguage();
  
  const generateQRCode = (text: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;
  };

  const generateOfficialEIDQR = () => {
    const eidData = {
      id: person.personalId,
      nrc: person.nrc,
      name: person.name,
      dob: person.dateOfBirth,
      issued: "2024-01-15",
      authority: "Myanmar Digital ID Authority",
      verification_url: "https://eid.gov.mm/verify"
    };
    return generateQRCode(JSON.stringify(eidData));
  };

  if (showBack) {
    return (
      <div 
        className="w-[400px] h-[250px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-2xl p-4 text-white relative overflow-hidden shadow-2xl border border-slate-700/50"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-24 h-24 border border-white/20 rounded-full transform translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 border border-white/20 rounded-full transform -translate-x-10 translate-y-10"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-0.5 bg-white/10 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>

        {/* Header - Centered and Compact */}
        <div className="text-center mb-3">
          <h4 className="text-sm font-bold tracking-wider text-blue-100">{t('card.backTitle')}</h4>
          <h3 className="text-lg font-black tracking-wide text-white">{t('card.backSubtitle')}</h3>
          <div className="w-20 h-0.5 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mt-1"></div>
        </div>

        {/* Main Content - Better Layout */}
        <div className="flex items-center justify-between gap-3 h-[140px]">
          {/* Left Side - QR Code */}
          <div className="flex flex-col items-center justify-center flex-shrink-0">
            <div className="p-1.5 bg-white rounded-lg shadow-lg mb-1">
              <img
                src={generateOfficialEIDQR()}
                alt="Official eID QR Code"
                className="w-14 h-14"
              />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-blue-200">{t('card.scanToVerify')}</p>
              <p className="text-[8px] text-blue-300">Digital Auth</p>
            </div>
          </div>

          {/* Center - Information Grid */}
          <div className="flex-1 space-y-2 px-2">
            {/* Verification Instructions */}
            <div className="bg-white/10 rounded-md p-2 backdrop-blur-sm">
              <h5 className="text-[10px] font-bold text-blue-100 mb-1 flex items-center gap-1">
                <QrCode className="h-2 w-2" />
                {t('card.verificationGuide')}
              </h5>
              <div className="text-[8px] text-blue-200 space-y-0.5 leading-tight">
                <p>• Scan QR using official eID app</p>
                <p>• Visit eid.gov.mm for verification</p>
                <p>• Check digital signature</p>
                <p>• Verify national database</p>
              </div>
            </div>

            {/* Card Information */}
            <div className="bg-white/10 rounded-md p-2 backdrop-blur-sm">
              <h5 className="text-[10px] font-bold text-blue-100 mb-1">{t('card.cardInformation')}</h5>
              <div className="text-[8px] space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-blue-200">{t('card.issue')}:</span>
                  <span className="font-medium">15 Jan 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">{t('card.expiry')}:</span>
                  <span className="font-medium">31 Dec 2029</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">{t('card.authority')}:</span>
                  <span className="font-medium">Digital ID Dept</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">{t('card.serial')}:</span>
                  <span className="font-medium font-mono">MID{person.personalId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed Position */}
        <div className="absolute bottom-2 left-4 right-4">
          <div className="flex justify-between items-center text-[8px] text-blue-200/90 border-t border-white/20 pt-1">
            <span className="font-medium">eid.gov.mm/verify</span>
            <div className="flex items-center gap-1">
              <Shield className="h-2 w-2 text-emerald-400" />
              <span className="font-bold">{t('card.secure')}</span>
            </div>
          </div>
        </div>

        {/* Security Badges - Fixed Position */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-600/90 px-1.5 py-0.5 rounded-full text-[8px] font-bold">
          <Shield className="h-2 w-2" />
          <span>{t('card.official')}</span>
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-1 bg-blue-600/90 px-1.5 py-0.5 rounded-full text-[8px] font-bold">
          <CheckCircle className="h-2 w-2" />
          <span>{t('card.authentic')}</span>
        </div>

        {/* Holographic effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
      </div>
    );
  }

  // Front side
  return (
    <div 
      className="w-[400px] h-[250px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl border border-slate-700/50"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 border border-white/20 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border border-white/20 rounded-full transform -translate-x-12 translate-y-12"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-1 bg-white/10 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>

      {/* Security Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-600/80 px-2 py-1 rounded-full text-xs font-medium">
        <Shield className="h-3 w-3" />
        <span>{t('card.secure')}</span>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-1 bg-blue-600/80 px-2 py-1 rounded-full text-xs font-medium">
        <Verified className="h-3 w-3" />
        <span>VERIFIED</span>
      </div>

      {/* Header */}
      <div className="text-center mb-4 pt-6">
        <h4 className="text-lg font-bold tracking-wider">{t('card.title')}</h4>
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
              {t('card.citizen')}
            </div>
            <div className="px-2 py-0.5 bg-blue-500/80 rounded text-xs font-semibold flex items-center gap-1">
              <Star className="h-3 w-3" />
              {t('card.active')}
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
          <p className="text-xs text-blue-200 font-medium">{t('card.scan')}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-3 left-6 right-6">
        <div className="flex justify-between items-center text-xs text-blue-200/80">
          <span>{t('card.serial')}: SC-{person.personalId}</span>
          <span>Exp: 12/2029</span>
        </div>
      </div>

      {/* Holographic effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
}
