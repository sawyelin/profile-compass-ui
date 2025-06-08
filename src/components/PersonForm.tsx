import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { NrcForm } from '@/components/NrcForm';
import { useLanguage } from '@/contexts/LanguageContext';

interface PersonFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export function PersonForm({ onSuccess, initialData }: PersonFormProps) {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    nameEn: initialData?.nameEn || '',
    nameMm: initialData?.nameMm || '',
    nrc: initialData?.nrc || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    gender: initialData?.gender || '',
    address: initialData?.address || '',
    addressEn: initialData?.addressEn || '',
    addressMm: initialData?.addressMm || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate ID automatically
    const personalId = `ID-${Date.now().toString().slice(-6)}`;
    
    console.log('Saving person:', { ...formData, personalId });
    
    toast({
      title: language === 'my' ? "ပုဂ္ဂိုလ်သိမ်းဆည်းပြီးပါပြီ" : "Person saved successfully",
      description: language === 'my' 
        ? `${formData.name} ကို ID: ${personalId} ဖြင့် စနစ်တွင်ထည့်သွင်းပြီးပါပြီ`
        : `${formData.name} has been added to the system with ID: ${personalId}`,
    });
    
    onSuccess();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNrcChange = (nrc: string) => {
    setFormData(prev => ({ ...prev, nrc }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Fields - Support both languages */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === 'my' ? 'ကိုယ်ရေးအချက်အလက်များ' : 'Personal Information'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {language === 'my' ? 'အမည် (အဓိက)' : 'Full Name (Primary)'} *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={language === 'my' ? 'အမည်ရိုက်ထည့်ပါ' : 'Enter full name'}
              required
            />
          </div>
          
          {language === 'my' && (
            <div className="space-y-2">
              <Label htmlFor="nameEn">အင်္ဂလိပ်အမည်</Label>
              <Input
                id="nameEn"
                value={formData.nameEn}
                onChange={(e) => handleChange('nameEn', e.target.value)}
                placeholder="Enter English name"
              />
            </div>
          )}
          
          {language === 'en' && (
            <div className="space-y-2">
              <Label htmlFor="nameMm">Myanmar Name</Label>
              <Input
                id="nameMm"
                value={formData.nameMm}
                onChange={(e) => handleChange('nameMm', e.target.value)}
                placeholder="မြန်မာအမည်ရိုက်ထည့်ပါ"
              />
            </div>
          )}
        </div>
      </div>

      {/* NRC Section */}
      <div className="space-y-4">
        <NrcForm 
          onNrcChange={handleNrcChange} 
          initialNrc={formData.nrc}
          showTitle={false}
        />
      </div>
      
      {/* Other Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">
            {language === 'my' ? 'မွေးသက္ကရာဇ်' : 'Date of Birth'}
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender">
            {language === 'my' ? 'ကျား/မ' : 'Gender'}
          </Label>
          <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder={
                language === 'my' ? 'ကျား/မ ရွေးချယ်ပါ' : 'Select gender'
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">
                {language === 'my' ? 'ကျား' : 'Male'}
              </SelectItem>
              <SelectItem value="female">
                {language === 'my' ? 'မ' : 'Female'}
              </SelectItem>
              <SelectItem value="other">
                {language === 'my' ? 'အခြား' : 'Other'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">
            {language === 'my' ? 'ဖုန်းနံပါတ်' : 'Phone Number'}
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder={language === 'my' ? '+၉၅ ၉ ၁၂၃ ၄၅၆ ၇၈၉' : '+95 9 123 456 789'}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">
            {language === 'my' ? 'အီးမေးလ်' : 'Email'}
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@example.com"
          />
        </div>
      </div>
      
      {/* Address Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {language === 'my' ? 'လိပ်စာအချက်အလက်များ' : 'Address Information'}
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="address">
            {language === 'my' ? 'လိပ်စာ (အဓိက)' : 'Address (Primary)'}
          </Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder={language === 'my' ? 'လိပ်စာအပြည့်အစုံရိုက်ထည့်ပါ' : 'Enter full address'}
            rows={3}
          />
        </div>
        
        {language === 'my' && (
          <div className="space-y-2">
            <Label htmlFor="addressEn">အင်္ဂလိပ်လိပ်စာ</Label>
            <Textarea
              id="addressEn"
              value={formData.addressEn}
              onChange={(e) => handleChange('addressEn', e.target.value)}
              placeholder="Enter English address"
              rows={3}
            />
          </div>
        )}
        
        {language === 'en' && (
          <div className="space-y-2">
            <Label htmlFor="addressMm">Myanmar Address</Label>
            <Textarea
              id="addressMm"
              value={formData.addressMm}
              onChange={(e) => handleChange('addressMm', e.target.value)}
              placeholder="မြန်မာလိပ်စာရိုက်ထည့်ပါ"
              rows={3}
            />
          </div>
        )}
      </div>
      
      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-accent">
          {language === 'my' ? 'ပုဂ္ဂိုလ်သိမ်းဆည်းရန်' : 'Save Person'}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          {language === 'my' ? 'ပယ်ဖျက်ရန်' : 'Cancel'}
        </Button>
      </div>
    </form>
  );
}
