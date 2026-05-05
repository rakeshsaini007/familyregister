export const RATION_CARD_TYPES = ['APL', 'BPL', 'ANTYODAY', 'NA'];

export const RELIGIONS = ['हिन्दू', 'मुस्लिम', 'सिख', 'ईसाई'];

export const CASTES = [
  'सैनी',
  'मौर्य',
  'कश्यप',
  'जाटव',
  'वाल्मीकि',
  'तुर्क',
  'अंसारी',
  'धोबी',
  'मनिहार',
  'ढफाली',
  'सुलेमानी',
  'बढ़ई',
  'पठान',
  'शेख़',
  'तेली',
  'नाई',
  'मंसूरी धुने',
  'फ़कीर',
  'उस्मानी',
  'अलवी'
];

export const GENDERS = ['पु०', 'म०'];

export const DISABILITY_OPTIONS = ['No', 'Yes'];

export const DISABILITY_TYPES = [
  '1-लोकोमोटर दिव्यांगता',
  '2-कुष्ठरोग मुक्त व्यक्ति',
  '3-प्रमस्तिष्कीय पश्चाघात',
  '4-बौनापन',
  '5-बहुदुष्पोषण',
  '6-अम्ल आक्रमण पीड़ित',
  '7-अन्धता',
  '8-अल्प द्रष्टिदोष',
  '9-वाक् श्रवण दिव्यांगता',
  '10-वाक् भाषा दिव्यांगता',
  '11-बौद्धिक दिव्यांगता',
  '12-विशिष्ट अधिगम दिव्यांगता',
  '13-स्वलीनता',
  '14-मानसिक रुग्णता',
  '15-बहुस्क्लोरोसिस',
  '16-हीमोफिलिया',
  '17-थेल्सीमिया',
  '18-सिकल सेल रोग',
  '19-बहुदिव्यांगता',
  '20-Other'
];

export const OCCUPATIONS = [
  'नौकरी',
  'मजदूरी',
  'खेती',
  'गृहणी',
  'दुकानदारी',
  'पेंटर',
  'बाइक मिस्त्री',
  'राज मिस्त्री',
  'आपरेटर',
  'वैल्डर',
  'ड्राइवर',
  'सफाई कर्मी',
  'सहायिका',
  'रसोईया',
  'पुलिस',
  'आर्मी',
  'अध्ययनरत',
  'अध्यापक'
];

export const LITERACY_STATUS = ['साक्षर', 'निरक्षर'];

export const EDUCATION_LEVELS = [
  '5th',
  '8th',
  '10th',
  '12th',
  'स्नातक',
  'परास्नातक'
];

export const FIELD_LABELS: Record<string, string> = {
  serialNumber: 'क्रम संख्या',
  houseNumber: 'मकान नम्बर',
  headOfFamily: 'परिवार के प्रमुख का नाम',
  familyId: 'फैमिली ID',
  rationCardNumber: 'राशन कार्ड संख्या',
  rationCardType: 'राशन कार्ड का प्रकार',
  religion: 'धर्म',
  caste: 'जाति',
  memberName: 'सदस्य का नाम',
  fatherHusbandName: 'पिता / पति का नाम',
  gender: 'लिंग (पु०/म०)',
  dob: 'जन्मतिथि',
  age: 'उम्र',
  aadhaarNumber: 'आधार कार्ड संख्या',
  disability: 'दिव्यांगता',
  disabilityType: 'दिव्यांगता का प्रकार',
  occupation: 'व्यवसाय',
  literateStatus: 'साक्षर/निरक्षर',
  educationLevel: 'यदि साक्षर तो शैक्षिक स्तर',
  mobileNumber: 'मोबाइल नंबर',
  exitDate: 'सर्किल छोड़ देने या मृत्यु का दिनाँक',
  timestamp: 'Timestamp'
};

export const GAS_URL = import.meta.env.VITE_GAS_URL || 'https://script.google.com/macros/s/AKfycbxla8jkPANyatLx0HjOI5YYBhzPA3TBuI40gcZQaQ-PR7jp4TaZWknAqTe3Ddug-kZEoQ/exec';
