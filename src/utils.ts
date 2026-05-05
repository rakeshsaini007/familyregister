export const calculateAge = (dob: any): string => {
  if (!dob) return '';
  const dStr = dob.toString();
  let birthDate: Date;

  if (/^\d{2}-\d{2}-\d{4}$/.test(dStr)) {
    const [d, m, y] = dStr.split('-').map((n: string) => parseInt(n, 10));
    birthDate = new Date(y, m - 1, d);
  } else {
    birthDate = new Date(dStr);
  }

  if (isNaN(birthDate.getTime())) return '';

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age.toString() : '';
};

export const formatDisplayDate = (date: any): string => {
  if (!date) return '';
  const dStr = date.toString();

  if (/^\d{2}-\d{2}-\d{4}$/.test(dStr)) return dStr;

  const d = new Date(dStr);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return dStr;
};

export const getAgeNumber = (dob: any): number => {
  if (!dob) return 0;
  const ageStr = calculateAge(dob.toString());
  return ageStr ? parseInt(ageStr, 10) : 0;
};
