
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getNrcStates, 
  getNrcTownshipsByStateId, 
  getNrcTypes, 
  convertToMmNrc, 
  convertToEnNrc,
  splitNrc,
  pattern 
} from 'mm-nrc';
import type { NrcState, NrcTownship, NrcType } from 'mm-nrc';

interface NrcFormProps {
  onNrcChange?: (nrc: string) => void;
  initialNrc?: string;
  showTitle?: boolean;
}

export function NrcForm({ onNrcChange, initialNrc = '', showTitle = true }: NrcFormProps) {
  const { language, t } = useLanguage();
  const [states, setStates] = useState<NrcState[]>([]);
  const [townships, setTownships] = useState<NrcTownship[]>([]);
  const [nrcTypes, setNrcTypes] = useState<NrcType[]>([]);
  
  const [selectedStateId, setSelectedStateId] = useState('');
  const [selectedTownshipCode, setSelectedTownshipCode] = useState('');
  const [selectedNrcType, setSelectedNrcType] = useState('');
  const [nrcNumber, setNrcNumber] = useState('');
  const [fullNrc, setFullNrc] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Initialize data
  useEffect(() => {
    const allStates = getNrcStates();
    const allNrcTypes = getNrcTypes();
    
    // Filter out NAY PYI TAW (9*) as per documentation
    const filteredStates = allStates.filter(state => state.code !== 'NAYPYITAW');
    
    setStates(filteredStates);
    setNrcTypes(allNrcTypes);
  }, []);

  // Load townships when state changes
  useEffect(() => {
    if (selectedStateId) {
      let allTownships = getNrcTownshipsByStateId(selectedStateId);
      
      // Filter out duplicate OUKAMA entries as per documentation
      const seenOukama = new Set();
      allTownships = allTownships.filter(township => {
        if (township.short.en === 'OUKAMA') {
          if (seenOukama.has('OUKAMA')) {
            return false; // Skip duplicate OUKAMA
          }
          seenOukama.add('OUKAMA');
        }
        return true;
      });
      
      setTownships(allTownships);
      setSelectedTownshipCode(''); // Reset township when state changes
    } else {
      setTownships([]);
    }
  }, [selectedStateId]);

  // Build NRC string when components change
  useEffect(() => {
    if (selectedStateId && selectedTownshipCode && selectedNrcType && nrcNumber) {
      const selectedState = states.find(s => s.id === selectedStateId);
      const selectedTownship = townships.find(t => t.code === selectedTownshipCode);
      
      if (selectedState && selectedTownship) {
        // Use English format first, then convert if needed
        const stateNumber = selectedState.number.en;
        const townshipShort = selectedTownship.short.en;
        const nrcString = `${stateNumber}/${townshipShort}(${selectedNrcType})${nrcNumber}`;
        
        // Convert to appropriate language
        const finalNrc = language === 'my' ? convertToMmNrc(nrcString) : nrcString;
        setFullNrc(finalNrc);
        
        // Validate NRC
        const isValidNrc = pattern[language].test(finalNrc);
        setIsValid(isValidNrc);
        
        if (isValidNrc && onNrcChange) {
          onNrcChange(finalNrc);
        }
      }
    } else {
      setFullNrc('');
      setIsValid(false);
    }
  }, [selectedStateId, selectedTownshipCode, selectedNrcType, nrcNumber, language, states, townships, onNrcChange]);

  // Parse initial NRC if provided
  useEffect(() => {
    if (initialNrc && states.length > 0) {
      try {
        // Convert to English for parsing if it's in Myanmar
        const englishNrc = language === 'my' ? convertToEnNrc(initialNrc) : initialNrc;
        const parts = splitNrc(englishNrc);
        
        // Find matching state
        const matchedState = states.find(s => s.number.en === parts.stateNo);
        if (matchedState) {
          setSelectedStateId(matchedState.id);
          setSelectedTownshipCode(parts.townshipCode);
          setSelectedNrcType(parts.nrcType);
          setNrcNumber(parts.nrcNumber);
        }
      } catch (error) {
        console.log('Could not parse initial NRC:', error);
      }
    }
  }, [initialNrc, states, language]);

  const handleManualNrcInput = (value: string) => {
    setFullNrc(value);
    const isValidNrc = pattern[language].test(value);
    setIsValid(isValidNrc);
    
    if (isValidNrc && onNrcChange) {
      onNrcChange(value);
    }
  };

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle>
            {t('form.nrcInfo')}
          </CardTitle>
          <CardDescription>
            {language === 'my' 
              ? 'မှတ်ပုံတင်ကတ် နံပါတ်ကို ရွေးချယ်ပါ သို့မဟုတ် တိုက်ရိုက်ရိုက်ထည့်ပါ'
              : 'Select NRC components or enter directly'
            }
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        {/* Component-wise selection */}
        <div className="space-y-4">
          <h4 className="font-medium">
            {language === 'my' ? 'အစိတ်အပိုင်းများဖြင့် ရွေးချယ်ခြင်း' : 'Component Selection'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* State Selection */}
            <div className="space-y-2">
              <Label>
                {language === 'my' ? 'ပြည်နယ်/တိုင်းဒေသကြီး' : 'State/Region'}
              </Label>
              <Select value={selectedStateId} onValueChange={setSelectedStateId}>
                <SelectTrigger>
                  <SelectValue placeholder={
                    language === 'my' ? 'ပြည်နယ်ရွေးချယ်ပါ' : 'Select State'
                  } />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.number[language]} - {state.name[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Township Selection */}
            <div className="space-y-2">
              <Label>
                {language === 'my' ? 'မြို့နယ်' : 'Township'}
              </Label>
              <Select 
                value={selectedTownshipCode} 
                onValueChange={setSelectedTownshipCode}
                disabled={!selectedStateId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    language === 'my' ? 'မြို့နယ်ရွေးချယ်ပါ' : 'Select Township'
                  } />
                </SelectTrigger>
                <SelectContent>
                  {townships.map((township) => (
                    <SelectItem key={township.id} value={township.code}>
                      {township.short[language]} - {township.name[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* NRC Type Selection */}
            <div className="space-y-2">
              <Label>
                {language === 'my' ? 'မှတ်ပုံတင်အမျိုးအစား' : 'NRC Type'}
              </Label>
              <Select value={selectedNrcType} onValueChange={setSelectedNrcType}>
                <SelectTrigger>
                  <SelectValue placeholder={
                    language === 'my' ? 'အမျိုးအစားရွေးချယ်ပါ' : 'Select Type'
                  } />
                </SelectTrigger>
                <SelectContent>
                  {nrcTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      ({language === 'my' ? type.name[language] : type.id}) {type.name[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* NRC Number Input */}
            <div className="space-y-2">
              <Label>
                {language === 'my' ? 'မှတ်ပုံတင်နံပါတ်' : 'NRC Number'}
              </Label>
              <Input
                value={nrcNumber}
                onChange={(e) => setNrcNumber(e.target.value)}
                placeholder={language === 'my' ? '၁၂၃၄၅၆' : '123456'}
                maxLength={6}
              />
            </div>
          </div>
        </div>

        {/* Direct input */}
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium">
            {language === 'my' ? 'တိုက်ရိုက်ရိုက်ထည့်ခြင်း' : 'Direct Input'}
          </h4>
          <div className="space-y-2">
            <Label>
              {language === 'my' ? 'မှတ်ပုံတင်ကတ် နံပါတ်' : 'Full NRC Number'}
            </Label>
            <Input
              value={fullNrc}
              onChange={(e) => handleManualNrcInput(e.target.value)}
              placeholder={
                language === 'my' 
                  ? '၁၂/တမန(နိုင်)၁၂၃၄၅၆' 
                  : '12/TAMANA(N)123456'
              }
              className={`${isValid ? 'border-green-500' : fullNrc ? 'border-red-500' : ''}`}
            />
            {fullNrc && (
              <div className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                {isValid 
                  ? (language === 'my' ? '✓ မှန်ကန်သော ဖော်မတ်' : '✓ Valid format')
                  : (language === 'my' ? '✗ မှားယွင်းသော ဖော်မတ်' : '✗ Invalid format')
                }
              </div>
            )}
          </div>
        </div>

        {/* Language conversion buttons */}
        {fullNrc && isValid && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">
              {language === 'my' ? 'ဘာသာစကားပြောင်းလဲခြင်း' : 'Language Conversion'}
            </h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const converted = convertToEnNrc(fullNrc);
                  setFullNrc(converted);
                  if (onNrcChange) onNrcChange(converted);
                }}
              >
                {language === 'my' ? 'အင်္ဂလိပ်သို့' : 'To English'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const converted = convertToMmNrc(fullNrc);
                  setFullNrc(converted);
                  if (onNrcChange) onNrcChange(converted);
                }}
              >
                {language === 'my' ? 'မြန်မာသို့' : 'To Myanmar'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
