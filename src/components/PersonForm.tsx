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
      title: t('form.personSaved'),
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
    <div className="w-full max-w-4xl mx-auto max-h-[80vh] overflow-y-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields - Support both languages */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {t('form.personalInfo')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t('form.fullName')} *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder={t('form.enterFullName')}
                required
              />
            </div>
            
            {language === 'my' && (
              <div className="space-y-2">
                <Label htmlFor="nameEn">{t('form.englishName')}</Label>
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
                <Label htmlFor="nameMm">{t('form.myanmarName')}</Label>
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
              {t('form.dateOfBirth')}
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
              {t('form.gender')}
            </Label>
            <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('form.selectGender')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">
                  {t('form.male')}
                </SelectItem>
                <SelectItem value="female">
                  {t('form.female')}
                </SelectItem>
                <SelectItem value="other">
                  {t('form.other')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">
              {t('form.phone')}
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder={t('form.phonePlaceholder')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">
              {t('form.email')}
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
            {t('form.addressInfo')}
          </h3>
          
          <div className="space-y-2">
            <Label htmlFor="address">
              {t('form.address')}
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder={t('form.enterAddress')}
              rows={3}
            />
          </div>
          
          {language === 'my' && (
            <div className="space-y-2">
              <Label htmlFor="addressEn">{t('form.englishAddress')}</Label>
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
              <Label htmlFor="addressMm">{t('form.myanmarAddress')}</Label>
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
            {t('form.savePerson')}
          </Button>
          <Button type="button" variant="outline" onClick={onSuccess}>
            {t('common.cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
}
