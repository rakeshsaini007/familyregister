import React from 'react';
import { FamilyMember } from '../../types.ts';

interface Props {
  familyMembers: FamilyMember[];
  formatDisplayDate: (d: any) => string;
}

export const FamilyRegisterDocument: React.FC<Props> = ({ familyMembers, formatDisplayDate }) => (
  <div
    className="p-12 bg-white text-black text-[14px]"
    style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
  >
    <h1 className="text-center text-xl font-bold mb-6 uppercase tracking-wider">परिवार रजिस्टर की नकल</h1>

    <div className="mb-4">
      <div className="flex items-center">
        <div className="flex-1 p-2"><span className="font-bold">न्याय पंचायत का नाम -</span> पुष्वाड़ा</div>
        <div className="flex-1 p-2 text-center"><span className="font-bold">ग्राम पंचायत का नाम -</span> पुष्वाड़ा</div>
        <div className="flex-1 p-2 text-right"><span className="font-bold">गाँव का नाम -</span> पुष्वाड़ा</div>
      </div>

      <div className="flex items-center">
        <div className="w-[20%] p-2"><span className="font-bold">तहसील -</span> स्वार</div>
        <div className="w-[30%] p-2"><span className="font-bold">जिला -</span> रामपुर</div>
        <div className="w-[30%] p-2"><span className="font-bold">राज्य -</span> उत्तर प्रदेश</div>
        <div className="w-[20%] p-2 text-right"><span className="font-bold">पिन कोड -</span> 244924</div>
      </div>

      <div className="flex items-center">
        <div className="w-[25%] p-2">
          <p className="text-[10px] uppercase leading-none mb-1" style={{ color: '#6b7280' }}>फैमिली ID</p>
          <p className="font-bold">{familyMembers[0]['फैमिली ID'] || '-'}</p>
        </div>
        <div className="w-[35%] p-2 text-center">
          <p className="text-[10px] uppercase leading-none mb-1" style={{ color: '#6b7280' }}>परिवार के प्रमुख का नाम</p>
          <p className="font-bold">{familyMembers[0]['परिवार के प्रमुख का नाम']}</p>
        </div>
        <div className="w-[15%] p-2">
          <p className="text-[10px] uppercase leading-none mb-1" style={{ color: '#6b7280' }}>धर्म</p>
          <p>{familyMembers[0]['धर्म']}</p>
        </div>
        <div className="w-[25%] p-2 text-right">
          <p className="text-[10px] uppercase leading-none mb-1" style={{ color: '#6b7280' }}>जाति</p>
          <p>{familyMembers[0]['जाति']}</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="w-[30%] p-2">
          <p className="text-[10px] uppercase leading-none mb-1" style={{ color: '#6b7280' }}>राशन कार्ड का प्रकार</p>
          <p>{familyMembers[0]['राशन कार्ड का प्रकार']}</p>
        </div>
        <div className="w-[45%] p-2">
          <p className="text-[10px] uppercase leading-none mb-1" style={{ color: '#6b7280' }}>राशन कार्ड संख्या</p>
          <p className="font-bold font-mono">{familyMembers[0]['राशन कार्ड संख्या'] || '-'}</p>
        </div>
        <div className="w-[25%] p-2 text-center">
          <p className="text-[10px] uppercase leading-none mb-1" style={{ color: '#6b7280' }}>परिवार में कुल सदस्य</p>
          <p className="font-bold text-lg">{familyMembers.length}</p>
        </div>
      </div>
    </div>

    <h2 className="text-center font-bold my-6 py-1.5" style={{ backgroundColor: '#f3f4f6' }}>सदस्यों का विवरण</h2>

    <table className="w-full border-collapse border border-black text-center text-[12px]">
      <thead>
        <tr style={{ backgroundColor: '#f9fafb' }}>
          <th className="border border-black p-2 w-[5%]" style={{ verticalAlign: 'middle' }}>क्रम सं०</th>
          <th className="border border-black p-2 w-[18%]" style={{ verticalAlign: 'middle' }}>सदस्य का नाम</th>
          <th className="border border-black p-2 w-[18%]" style={{ verticalAlign: 'middle' }}>पिता / पति का नाम</th>
          <th className="border border-black p-2 w-[10%]" style={{ verticalAlign: 'middle' }}>लिंग (पु०/म०)</th>
          <th className="border border-black p-2 w-[12%]" style={{ verticalAlign: 'middle' }}>जन्मतिथि</th>
          <th className="border border-black p-2 w-[12%]" style={{ verticalAlign: 'middle' }}>आधार कार्ड संख्या</th>
          <th className="border border-black p-2 w-[10%]" style={{ verticalAlign: 'middle' }}>साक्षर/निरक्षर</th>
          <th className="border border-black p-2 w-[15%]" style={{ verticalAlign: 'middle' }}>व्यवसाय</th>
        </tr>
      </thead>
      <tbody>
        {familyMembers.map((m, i) => (
          <tr key={i}>
            <td className="border border-black p-2" style={{ verticalAlign: 'middle' }}>{i + 1}</td>
            <td className="border border-black p-2 font-bold" style={{ verticalAlign: 'middle' }}>{m['सदस्य का नाम']}</td>
            <td className="border border-black p-2" style={{ verticalAlign: 'middle' }}>{m['पिता / पति का नाम']}</td>
            <td className="border border-black p-2" style={{ verticalAlign: 'middle' }}>{m['लिंग (पु०/म०)']}</td>
            <td className="border border-black p-2" style={{ verticalAlign: 'middle' }}>{formatDisplayDate(m['जन्मतिथि'])}</td>
            <td className="border border-black p-2 font-mono font-bold" style={{ verticalAlign: 'middle' }}>{m['आधार कार्ड संख्या'] || '-'}</td>
            <td className="border border-black p-2" style={{ verticalAlign: 'middle' }}>{m['साक्षर/निरक्षर']}</td>
            <td className="border border-black p-2" style={{ verticalAlign: 'middle' }}>{m['व्यवसाय']}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="mt-16 flex justify-between items-end px-4 text-[13px]">
      <div>
        <p className="italic">नकल जारी करने का दिनांक: <span className="font-bold">{new Date().toLocaleDateString('hi-IN')}</span></p>
        <p className="mt-1">जारीकर्ता: <span className="font-bold">डिजिटल परिवार पंजी प्रणाली</span></p>
      </div>
      <div className="text-center">
        <div className="w-40 h-20 border-b border-black mb-2 flex items-center justify-center italic" style={{ color: '#d1d5db' }}>सील / हस्ताक्षर</div>
        <p className="font-bold uppercase tracking-widest">ग्राम विकास अधिकारी</p>
        <p className="text-[10px]">स्वार, रामपुर (उ०प्र०)</p>
      </div>
    </div>

    <div className="mt-12 text-center text-[8px] border-t pt-2" style={{ color: '#9ca3af', borderColor: '#e5e7eb' }}>
      यह एक कंप्यूटर जनित दस्तावेज है, इसमें किसी भौतिक हस्ताक्षर की आवश्यकता नहीं है।
    </div>
  </div>
);
