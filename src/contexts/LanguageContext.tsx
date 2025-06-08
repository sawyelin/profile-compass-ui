import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'my';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation object
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.people': 'People',
    'nav.documents': 'Documents',
    'nav.search': 'Search',
    'nav.idCards': 'ID Cards',
    'nav.family': 'Family',
    'nav.settings': 'Settings',
    
    // ID Cards Page
    'idCards.title': 'ID Cards',
    'idCards.subtitle': 'Generate and manage identity cards for registered people',
    'idCards.selectPerson': 'Select Person',
    'idCards.selectAll': 'Select All',
    'idCards.searchPlaceholder': 'Search people...',
    'idCards.bulkActions': 'Bulk Actions',
    'idCards.downloadPDF': 'Download Selected as PDF',
    'idCards.printSelected': 'Print Selected Cards',
    'idCards.generateAll': 'Generate Cards for All',
    'idCards.noPersonSelected': 'No person selected',
    'idCards.selectPersonMessage': 'Select a person from the list to preview their ID card',
    'idCards.cardStatistics': 'Card Statistics',
    'idCards.cardsGenerated': 'Cards Generated',
    'idCards.pendingCards': 'Pending Cards',
    'idCards.generateCard': 'Generate Card',
    'idCards.regenerateCard': 'Regenerate Card',
    
    // ID Card
    'card.title': 'MYANMAR DIGITAL ID',
    'card.backTitle': 'REPUBLIC OF THE UNION OF MYANMAR',
    'card.backSubtitle': 'DIGITAL IDENTITY CARD',
    'card.scanToVerify': 'SCAN TO VERIFY',
    'card.verificationGuide': 'VERIFICATION GUIDE',
    'card.cardInformation': 'CARD INFORMATION',
    'card.issue': 'Issue',
    'card.expiry': 'Expiry',
    'card.authority': 'Authority',
    'card.serial': 'Serial',
    'card.secure': 'SECURE',
    'card.official': 'OFFICIAL',
    'card.authentic': 'AUTHENTIC',
    'card.citizen': 'CITIZEN',
    'card.active': 'ACTIVE',
    'card.scan': 'SCAN',
    
    // Card Preview
    'preview.title': 'Professional ID Card',
    'preview.subtitle': 'Digital identity verification system',
    'preview.showFront': 'Show Front',
    'preview.showBack': 'Show Back',
    'preview.image': 'Image',
    'preview.pdf': 'PDF',
    'preview.print': 'Print',
    'preview.securityFeatures': 'Security Features',
    'preview.cardDetails': 'Card Details',
    'preview.digitalSignature': 'Digital Signature',
    'preview.qrVerification': 'QR Verification',
    'preview.encryption': 'Encryption',
    'preview.tamperProtection': 'Tamper Protection',
    'preview.valid': 'Valid',
    'preview.cardType': 'Card Type',
    'preview.digitalIdentity': 'Digital Identity',
    'preview.issueDate': 'Issue Date',
    'preview.validUntil': 'Valid Until',
    'preview.status': 'Status',
    'preview.currentSide': 'Current Side',
    'preview.frontSide': 'Front',
    'preview.backSide': 'Back (Myanmar eID)',
    
    // People Page
    'people.title': 'People',
    'people.subtitle': 'Manage all registered individuals in your system',
    'people.addNew': 'Add New Person',
    'people.searchPlaceholder': 'Search by name, NRC, or ID...',
    'people.filter': 'Filter',
    'people.nrcNumber': 'NRC Number',
    'people.documents': 'documents',
    'people.viewProfile': 'View Profile',
    'people.noResults': 'No people found matching your search.',
    
    // Common
    'common.generated': 'Generated',
    'common.pending': 'Pending',
    'common.active': 'Active',
    'common.download': 'Download',
    'common.print': 'Print',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
  my: {
    // Navigation
    'nav.dashboard': 'ဒက်ရှ်ဘုတ်',
    'nav.people': 'လူများ',
    'nav.documents': 'စာရွက်စာတမ်းများ',
    'nav.search': 'ရှာဖွေရန်',
    'nav.idCards': 'မှတ်ပုံတင်ကတ်များ',
    'nav.family': 'မိသားစု',
    'nav.settings': 'ဆက်တင်များ',
    
    // ID Cards Page
    'idCards.title': 'မှတ်ပုံတင်ကတ်များ',
    'idCards.subtitle': 'မှတ်ပုံတင်ခြင်းခံထားသောပုဂ္ဂိုလ်များအတွက် မှတ်ပုံတင်ကတ်များ ထုတ်လုပ်ခြင်းနှင့် စီမံခန့်ခွဲခြင်း',
    'idCards.selectPerson': 'ပုဂ္ဂိုလ်ရွေးချယ်ရန်',
    'idCards.selectAll': 'အားလုံးရွေးချယ်ရန်',
    'idCards.searchPlaceholder': 'လူများကို ရှာဖွေရန်...',
    'idCards.bulkActions': 'အစုလိုက် လုပ်ဆောင်ချက်များ',
    'idCards.downloadPDF': 'ရွေးချယ်ထားသောကတ်များကို PDF အဖြစ် ဒေါင်းလုဒ်လုပ်ရန်',
    'idCards.printSelected': 'ရွေးချယ်ထားသောကတ်များကို ပုံနှိပ်ရန်',
    'idCards.generateAll': 'အားလုံးအတွက် ကတ်များထုတ်လုပ်ရန်',
    'idCards.noPersonSelected': 'ပုဂ္ဂိုလ်တစ်ဦး ရွေးချယ်ထားခြင်းမရှိပါ',
    'idCards.selectPersonMessage': 'သူတို့၏မှတ်ပုံတင်ကတ်ကို ကြိုတင်ကြည့်ရှုရန်အတွက် စာရင်းမှ ပုဂ္ဂိုလ်တစ်ဦးကို ရွေးချယ်ပါ',
    'idCards.cardStatistics': 'ကတ် စာရင်းအင်းများ',
    'idCards.cardsGenerated': 'ထုတ်လုပ်ပြီးကတ်များ',
    'idCards.pendingCards': 'ဆိုင်းငံ့ထားသောကတ်များ',
    'idCards.generateCard': 'ကတ်ထုတ်လုပ်ရန်',
    'idCards.regenerateCard': 'ကတ်ပြန်လည်ထုတ်လုပ်ရန်',
    
    // ID Card
    'card.title': 'မြန်မာ ဒစ်ဂျစ်တယ် မှတ်ပုံတင်',
    'card.backTitle': 'ပြည်ထောင်စု သမ္မတ မြန်မာနိုင်ငံတော်',
    'card.backSubtitle': 'ဒစ်ဂျစ်တယ် မှတ်ပုံတင်ကတ်',
    'card.scanToVerify': 'အတည်ပြုရန် စကင်န်လုပ်ပါ',
    'card.verificationGuide': 'အတည်ပြုခြင်း လမ်းညွှန်',
    'card.cardInformation': 'ကတ် အချက်အလက်များ',
    'card.issue': 'ထုတ်ပေးသည့်ရက်',
    'card.expiry': 'သက်တမ်းကုန်သည့်ရက်',
    'card.authority': 'အာဏာပိုင်',
    'card.serial': 'စီရီရယ်',
    'card.secure': 'လုံခြုံသော',
    'card.official': 'တရားဝင်',
    'card.authentic': 'စစ်မှန်သော',
    'card.citizen': 'နိုင်ငံသား',
    'card.active': 'အသုံးပြုနိုင်သော',
    'card.scan': 'စကင်န်',
    
    // Card Preview
    'preview.title': 'ပရော်ဖက်ရှင်နယ် မှတ်ပုံတင်ကတ်',
    'preview.subtitle': 'ဒစ်ဂျစ်တယ် မှတ်ပုံတင် အတည်ပြုခြင်း စနစ်',
    'preview.showFront': 'အရှေ့ပိုင်း ပြရန်',
    'preview.showBack': 'နောက်ပိုင်း ပြရန်',
    'preview.image': 'ပုံ',
    'preview.pdf': 'PDF',
    'preview.print': 'ပုံနှိပ်ရန်',
    'preview.securityFeatures': 'လုံခြုံရေး ဝန်ဆောင်မှုများ',
    'preview.cardDetails': 'ကတ် အသေးစိတ်',
    'preview.digitalSignature': 'ဒစ်ဂျစ်တယ် လက်မှတ်',
    'preview.qrVerification': 'QR အတည်ပြုခြင်း',
    'preview.encryption': 'စာဝှက်ခြင်း',
    'preview.tamperProtection': 'ပျက်စီးခြင်းမှ ကာကွယ်ခြင်း',
    'preview.valid': 'တရားဝင်',
    'preview.cardType': 'ကတ်အမျိုးအစား',
    'preview.digitalIdentity': 'ဒစ်ဂျစ်တယ် မှတ်ပုံတင်',
    'preview.issueDate': 'ထုတ်ပေးသည့်ရက်စွဲ',
    'preview.validUntil': 'တရားဝင်သည့် နောက်ဆုံးရက်',
    'preview.status': 'အခြေအနေ',
    'preview.currentSide': 'လက်ရှိ ဘက်',
    'preview.frontSide': 'အရှေ့ပိုင်း',
    'preview.backSide': 'နောက်ပိုင်း (မြန်မာ eID)',
    
    // People Page
    'people.title': 'လူများ',
    'people.subtitle': 'သင့်စနစ်တွင် မှတ်ပုံတင်ထားသော ပုဂ္ဂိုလ်များအားလုံးကို စီမံခန့်ခွဲပါ',
    'people.addNew': 'လူသစ်ထည့်ရန်',
    'people.searchPlaceholder': 'နာမည်၊ မှတ်ပုံတင်၊ သို့မဟုတ် ID ဖြင့် ရှာဖွေရန်...',
    'people.filter': 'စစ်ထုတ်ရန်',
    'people.nrcNumber': 'မှတ်ပုံတင် နံပါတ်',
    'people.documents': 'စာရွက်စာတမ်းများ',
    'people.viewProfile': 'ပရိုဖိုင်ကြည့်ရန်',
    'people.noResults': 'သင့်ရှာဖွေမှုနှင့် ကိုက်ညီသောလူမရှိပါ။',
    
    // Common
    'common.generated': 'ထုတ်လုပ်ပြီး',
    'common.pending': 'ဆိုင်းငံ့ထား',
    'common.active': 'အသုံးပြုနိုင်သော',
    'common.download': 'ဒေါင်းလုဒ်',
    'common.print': 'ပုံနှိပ်ရန်',
    'common.cancel': 'ပယ်ဖျက်ရန်',
    'common.save': 'သိမ်းရန်',
    'common.edit': 'ပြင်ဆင်ရန်',
    'common.delete': 'ဖျက်ရန်',
    'common.search': 'ရှာဖွေရန်',
    'common.loading': 'လုပ်ဆောင်နေသည်...',
    'common.error': 'အမှား',
    'common.success': 'အောင်မြင်ခြင်း',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
