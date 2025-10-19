export interface Country {
  name: string;
  dial_code: string;
  code: string; // 'ID', 'US', etc.
  flag: string; // Emoji flag
}

// Data tiruan (bisa diganti dengan panggilan API sungguhan)
const countries: Country[] = [
  { name: "Indonesia", dial_code: "+62", code: "ID", flag: `https://flagcdn.com/h20/id.png` },
  { name: "United States", dial_code: "+1", code: "US", flag: `https://flagcdn.com/h20/us.png` },
  { name: "United Kingdom", dial_code: "+44", code: "GB", flag: `https://flagcdn.com/h20/gb.png` },
  { name: "Japan", dial_code: "+81", code: "JP", flag: `https://flagcdn.com/h20/jp.png` },
  { name: "Singapore", dial_code: "+65", code: "SG", flag: `https://flagcdn.com/h20/sg.png` },
  { name: "Malaysia", dial_code: "+60", code: "MY", flag: `https://flagcdn.com/h20/my.png` },
  { name: "Australia", dial_code: "+61", code: "AU", flag: `https://flagcdn.com/h20/au.png` },
  { name: "Palestine", dial_code: "+970", code: "PS", flag: `https://flagcdn.com/h20/ps.png` },
  { name: "Oman", dial_code: "+968", code: "OM", flag: `https://flagcdn.com/h20/om.png` },
  { name: "Poland", dial_code: "+48", code: "PL", flag: `https://flagcdn.com/h20/pl.png` },
];

// Fungsi untuk mengambil data (mensimulasikan API call)
export const getCountries = async (): Promise<Country[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(countries);
    }, 500); // Simulasi jeda jaringan
  });
};