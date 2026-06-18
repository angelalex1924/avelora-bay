export type AllowedCountry = {
  code: string;
  flag: string;
};

export const ALLOWED_COUNTRIES: AllowedCountry[] = [
  { code: 'GR', flag: '/lang/gr.png' },
  { code: 'CY', flag: '/lang/cy.png' },
  { code: 'DE', flag: '/lang/de.png' },
];

export const ALLOWED_COUNTRY_CODES = ALLOWED_COUNTRIES.map((country) => country.code);

export function isAllowedCountry(country: string | null | undefined): boolean {
  if (!country) return true;
  return ALLOWED_COUNTRY_CODES.includes(country.toUpperCase());
}
