import type { GeoLocale } from '@/app/lib/geo/locale';

export type GeoCopy = {
  status: string;
  badge: string;
  headline: string;
  accent: string;
  description: string;
  detected: string;
  availableIn: string;
  contact: string;
  homeBtn: string;
  footer: string;
  infra: string;
  protected: string;
  mapCaption: string;
  homeNav: string;
  contactNav: string;
  switchLanguage: string;
};

const EN: GeoCopy = {
  status: 'Region',
  badge: 'UNAVAILABLE',
  headline: 'Avelora Bay is not available in your country',
  accent: 'Region-restricted access',
  description:
    'Due to shipping and regulatory requirements, our online store currently serves selected European regions only.',
  detected: 'Your location',
  availableIn: 'Available only in',
  contact: 'Contact AcronWeb',
  homeBtn: 'Acronweb.gr',
  footer: 'Powered and developed by',
  infra: 'ACRONWEB INFRASTRUCTURE',
  protected: 'Protected by',
  mapCaption: 'We serve selected regions across Europe',
  homeNav: 'HOME',
  contactNav: 'CONTACT',
  switchLanguage: 'Language',
};

export const GEO_MESSAGES: Record<GeoLocale, GeoCopy> = {
  en: EN,
  el: {
    status: 'Περιοχή',
    badge: 'ΜΗ ΔΙΑΘΕΣΙΜΟ',
    headline: 'Η Avelora Bay δεν είναι διαθέσιμη στη χώρα σας',
    accent: 'Περιορισμένη πρόσβαση ανά περιοχή',
    description:
      'Λόγω ρυθμίσεων αποστολής και νομικών απαιτήσεων, το ηλεκτρονικό μας κατάστημα λειτουργεί μόνο σε επιλεγμένες χώρες της Ευρώπης.',
    detected: 'Η τοποθεσία σας',
    availableIn: 'Διαθέσιμο μόνο σε',
    contact: 'Επικοινωνία AcronWeb',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'ΥΠΟΔΟΜΗ ACRONWEB',
    protected: 'Προστατεύεται από',
    mapCaption: 'Εξυπηρετούμε επιλεγμένες περιοχές της Ευρώπης',
    homeNav: 'ΑΡΧΙΚΗ',
    contactNav: 'ΕΠΙΚΟΙΝΩΝΙΑ',
    switchLanguage: 'Γλώσσα',
  },
  de: {
    status: 'Region',
    badge: 'NICHT VERFÜGBAR',
    headline: 'Avelora Bay ist in Ihrem Land nicht verfügbar',
    accent: 'Regional eingeschränkter Zugang',
    description:
      'Aufgrund von Versand- und regulatorischen Anforderungen bedient unser Online-Shop derzeit nur ausgewählte europäische Regionen.',
    detected: 'Ihr Standort',
    availableIn: 'Verfügbar nur in',
    contact: 'AcronWeb kontaktieren',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'ACRONWEB INFRASTRUKTUR',
    protected: 'Geschützt durch',
    mapCaption: 'Wir bedienen ausgewählte Regionen in Europa',
    homeNav: 'START',
    contactNav: 'KONTAKT',
    switchLanguage: 'Sprache',
  },
  es: {
    status: 'Región',
    badge: 'NO DISPONIBLE',
    headline: 'Avelora Bay no está disponible en su país',
    accent: 'Acceso restringido por región',
    description:
      'Debido a requisitos de envío y normativas, nuestra tienda online opera actualmente solo en regiones europeas seleccionadas.',
    detected: 'Su ubicación',
    availableIn: 'Disponible solo en',
    contact: 'Contactar AcronWeb',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'INFRAESTRUCTURA ACRONWEB',
    protected: 'Protegido por',
    mapCaption: 'Atendemos regiones seleccionadas de Europa',
    homeNav: 'INICIO',
    contactNav: 'CONTACTO',
    switchLanguage: 'Idioma',
  },
  fr: {
    status: 'Région',
    badge: 'INDISPONIBLE',
    headline: 'Avelora Bay n\'est pas disponible dans votre pays',
    accent: 'Accès restreint par région',
    description:
      'En raison des exigences d\'expédition et réglementaires, notre boutique en ligne dessert actuellement uniquement certaines régions européennes.',
    detected: 'Votre localisation',
    availableIn: 'Disponible uniquement en',
    contact: 'Contacter AcronWeb',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'INFRASTRUCTURE ACRONWEB',
    protected: 'Protégé par',
    mapCaption: 'Nous desservons des régions sélectionnées en Europe',
    homeNav: 'ACCUEIL',
    contactNav: 'CONTACT',
    switchLanguage: 'Langue',
  },
  it: {
    status: 'Regione',
    badge: 'NON DISPONIBILE',
    headline: 'Avelora Bay non è disponibile nel tuo paese',
    accent: 'Accesso limitato per regione',
    description:
      'A causa di requisiti di spedizione e normativi, il nostro negozio online serve attualmente solo regioni europee selezionate.',
    detected: 'La tua posizione',
    availableIn: 'Disponibile solo in',
    contact: 'Contatta AcronWeb',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'INFRASTRUTTURA ACRONWEB',
    protected: 'Protetto da',
    mapCaption: 'Serviamo regioni selezionate in Europa',
    homeNav: 'HOME',
    contactNav: 'CONTATTO',
    switchLanguage: 'Lingua',
  },
  pt: {
    status: 'Região',
    badge: 'INDISPONÍVEL',
    headline: 'Avelora Bay não está disponível no seu país',
    accent: 'Acesso restrito por região',
    description:
      'Devido a requisitos de envio e regulamentação, a nossa loja online opera atualmente apenas em regiões europeias selecionadas.',
    detected: 'A sua localização',
    availableIn: 'Disponível apenas em',
    contact: 'Contactar AcronWeb',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'INFRAESTRUTURA ACRONWEB',
    protected: 'Protegido por',
    mapCaption: 'Servimos regiões selecionadas na Europa',
    homeNav: 'INÍCIO',
    contactNav: 'CONTACTO',
    switchLanguage: 'Idioma',
  },
  nl: {
    status: 'Regio',
    badge: 'NIET BESCHIKBAAR',
    headline: 'Avelora Bay is niet beschikbaar in uw land',
    accent: 'Regio-beperkte toegang',
    description:
      'Vanwege verzend- en regelgevingsvereisten bedient onze webwinkel momenteel alleen geselecteerde Europese regio\'s.',
    detected: 'Uw locatie',
    availableIn: 'Alleen beschikbaar in',
    contact: 'Contact AcronWeb',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'ACRONWEB INFRASTRUCTUUR',
    protected: 'Beschermd door',
    mapCaption: 'Wij bedienen geselecteerde regio\'s in Europa',
    homeNav: 'HOME',
    contactNav: 'CONTACT',
    switchLanguage: 'Taal',
  },
  pl: {
    status: 'Region',
    badge: 'NIEDOSTĘPNE',
    headline: 'Avelora Bay nie jest dostępna w Twoim kraju',
    accent: 'Dostęp ograniczony regionalnie',
    description:
      'Ze względu na wymogi wysyłkowe i regulacyjne nasz sklep internetowy obsługuje obecnie tylko wybrane regiony Europy.',
    detected: 'Twoja lokalizacja',
    availableIn: 'Dostępne tylko w',
    contact: 'Kontakt AcronWeb',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'INFRASTRUKTURA ACRONWEB',
    protected: 'Chronione przez',
    mapCaption: 'Obsługujemy wybrane regiony Europy',
    homeNav: 'STRONA GŁÓWNA',
    contactNav: 'KONTAKT',
    switchLanguage: 'Język',
  },
  tr: {
    status: 'Bölge',
    badge: 'MEVCUT DEĞİL',
    headline: 'Avelora Bay ülkenizde kullanılamıyor',
    accent: 'Bölgeye göre kısıtlı erişim',
    description:
      'Nakliye ve düzenleyici gereksinimler nedeniyle çevrimiçi mağazamız şu anda yalnızca seçili Avrupa bölgelerine hizmet vermektedir.',
    detected: 'Konumunuz',
    availableIn: 'Yalnızca şu ülkelerde',
    contact: 'AcronWeb ile iletişim',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'ACRONWEB ALTYAPISI',
    protected: 'Koruyucu',
    mapCaption: 'Avrupa\'nın seçili bölgelerine hizmet veriyoruz',
    homeNav: 'ANA SAYFA',
    contactNav: 'İLETİŞİM',
    switchLanguage: 'Dil',
  },
  ro: {
    status: 'Regiune',
    badge: 'INDISPONIBIL',
    headline: 'Avelora Bay nu este disponibil în țara dvs.',
    accent: 'Acces restricționat pe regiune',
    description:
      'Din cauza cerințelor de livrare și reglementare, magazinul nostru online deservește în prezent doar regiuni europene selectate.',
    detected: 'Locația dvs.',
    availableIn: 'Disponibil doar în',
    contact: 'Contactați AcronWeb',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'INFRASTRUCTURĂ ACRONWEB',
    protected: 'Protejat de',
    mapCaption: 'Deservim regiuni selectate din Europa',
    homeNav: 'ACASĂ',
    contactNav: 'CONTACT',
    switchLanguage: 'Limbă',
  },
  bg: {
    status: 'Регион',
    badge: 'НЕ Е НАЛИЧНО',
    headline: 'Avelora Bay не е достъпна във вашата страна',
    accent: 'Ограничен достъп по регион',
    description:
      'Поради изисквания за доставка и регулации, нашият онлайн магазин обслужва само избрани европейски региони.',
    detected: 'Вашето местоположение',
    availableIn: 'Налично само в',
    contact: 'Свържете се с AcronWeb',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'ACRONWEB ИНФРАСТРУКТУРА',
    protected: 'Защитено от',
    mapCaption: 'Обслужваме избрани региони в Европа',
    homeNav: 'НАЧАЛО',
    contactNav: 'КОНТАКТ',
    switchLanguage: 'Език',
  },
  sv: {
    status: 'Region',
    badge: 'EJ TILLGÄNGLIG',
    headline: 'Avelora Bay är inte tillgänglig i ditt land',
    accent: 'Regionsbegränsad åtkomst',
    description:
      'På grund av frakt- och regelkrav betjänar vår webbutik för närvarande endast utvalda europeiska regioner.',
    detected: 'Din plats',
    availableIn: 'Tillgänglig endast i',
    contact: 'Kontakta AcronWeb',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'ACRONWEB INFRASTRUKTUR',
    protected: 'Skyddad av',
    mapCaption: 'Vi betjänar utvalda regioner i Europa',
    homeNav: 'HEM',
    contactNav: 'KONTAKT',
    switchLanguage: 'Språk',
  },
  no: {
    status: 'Region',
    badge: 'IKKE TILGJENGELIG',
    headline: 'Avelora Bay er ikke tilgjengelig i ditt land',
    accent: 'Regionbegrenset tilgang',
    description:
      'På grunn av frakt- og regulatoriske krav betjener nettbutikken vår for øyeblikket kun utvalgte europeiske regioner.',
    detected: 'Din plassering',
    availableIn: 'Kun tilgjengelig i',
    contact: 'Kontakt AcronWeb',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'ACRONWEB INFRASTRUKTUR',
    protected: 'Beskyttet av',
    mapCaption: 'Vi betjener utvalgte regioner i Europa',
    homeNav: 'HJEM',
    contactNav: 'KONTAKT',
    switchLanguage: 'Språk',
  },
  ru: {
    status: 'Регион',
    badge: 'НЕДОСТУПНО',
    headline: 'Avelora Bay недоступна в вашей стране',
    accent: 'Доступ ограничен по региону',
    description:
      'Из-за требований доставки и регулирования наш интернет-магазин обслуживает только выбранные регионы Европы.',
    detected: 'Ваше местоположение',
    availableIn: 'Доступно только в',
    contact: 'Связаться с AcronWeb',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'ИНФРАСТРУКТУРА ACRONWEB',
    protected: 'Защищено',
    mapCaption: 'Мы обслуживаем выбранные регионы Европы',
    homeNav: 'ГЛАВНАЯ',
    contactNav: 'КОНТАКТ',
    switchLanguage: 'Язык',
  },
  zh: {
    status: '地区',
    badge: '不可用',
    headline: 'Avelora Bay 在您的国家/地区不可用',
    accent: '按地区限制访问',
    description: '由于运输和监管要求，我们的在线商店目前仅服务于部分欧洲地区。',
    detected: '您的位置',
    availableIn: '仅在以下地区可用',
    contact: '联系 AcronWeb',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'ACRONWEB 基础设施',
    protected: '保护方',
    mapCaption: '我们服务于欧洲部分地区',
    homeNav: '首页',
    contactNav: '联系',
    switchLanguage: '语言',
  },
  ja: {
    status: '地域',
    badge: '利用不可',
    headline: 'Avelora Bay はお住まいの国ではご利用いただけません',
    accent: '地域制限アクセス',
    description:
      '配送および規制上の要件により、当オンラインストアは現在、欧州の特定地域のみでご利用いただけます。',
    detected: 'お客様の所在地',
    availableIn: '利用可能な地域',
    contact: 'AcronWeb に連絡',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'ACRONWEB インフラ',
    protected: '保護',
    mapCaption: '欧州の特定地域にサービスを提供しています',
    homeNav: 'ホーム',
    contactNav: 'お問い合わせ',
    switchLanguage: '言語',
  },
  ar: {
    status: 'المنطقة',
    badge: 'غير متاح',
    headline: 'Avelora Bay غير متاحة في بلدك',
    accent: 'وصول مقيد حسب المنطقة',
    description:
      'بسبب متطلبات الشحن والتنظيم، يخدم متجرنا الإلكتروني حاليًا مناطق أوروبية محددة فقط.',
    detected: 'موقعك',
    availableIn: 'متاح فقط في',
    contact: 'تواصل مع AcronWeb',
    homeBtn: 'Acronweb.gr',
    footer: 'Powered and developed by',
    infra: 'بنية ACRONWEB',
    protected: 'محمي بواسطة',
    mapCaption: 'نخدم مناطق مختارة في أوروبا',
    homeNav: 'الرئيسية',
    contactNav: 'اتصل',
    switchLanguage: 'اللغة',
  },
};

export function getGeoCopy(locale: GeoLocale): GeoCopy {
  return GEO_MESSAGES[locale] ?? EN;
}

type LocalizedNames = Partial<Record<GeoLocale, string>>;

export const COUNTRY_NAMES: Record<string, LocalizedNames> = {
  US: { en: 'United States', el: 'Ηνωμένες Πολιτείες', de: 'Vereinigte Staaten', es: 'Estados Unidos', fr: 'États-Unis' },
  GB: { en: 'United Kingdom', el: 'Ηνωμένο Βασίλειο', de: 'Vereinigtes Königreich', es: 'Reino Unido', fr: 'Royaume-Uni' },
  FR: { en: 'France', el: 'Γαλλία', de: 'Frankreich', es: 'Francia', fr: 'France' },
  IT: { en: 'Italy', el: 'Ιταλία', de: 'Italien', es: 'Italia', fr: 'Italie', it: 'Italia' },
  ES: { en: 'Spain', el: 'Ισπανία', de: 'Spanien', es: 'España', fr: 'Espagne' },
  TR: { en: 'Turkey', el: 'Τουρκία', de: 'Türkei', es: 'Turquía', fr: 'Turquie', tr: 'Türkiye' },
  NL: { en: 'Netherlands', el: 'Ολλανδία', de: 'Niederlande', es: 'Países Bajos', fr: 'Pays-Bas', nl: 'Nederland' },
  BE: { en: 'Belgium', el: 'Βέλγιο', de: 'Belgien', es: 'Bélgica', fr: 'Belgique' },
  AT: { en: 'Austria', el: 'Αυστρία', de: 'Österreich', es: 'Austria', fr: 'Autriche' },
  CH: { en: 'Switzerland', el: 'Ελβετία', de: 'Schweiz', es: 'Suiza', fr: 'Suisse' },
  PL: { en: 'Poland', el: 'Πολωνία', de: 'Polen', es: 'Polonia', fr: 'Pologne', pl: 'Polska' },
  RO: { en: 'Romania', el: 'Ρουμανία', de: 'Rumänien', es: 'Rumania', fr: 'Roumanie', ro: 'România' },
  BG: { en: 'Bulgaria', el: 'Βουλγαρία', de: 'Bulgarien', es: 'Bulgaria', fr: 'Bulgarie', bg: 'България' },
  SE: { en: 'Sweden', el: 'Σουηδία', de: 'Schweden', es: 'Suecia', fr: 'Suède', sv: 'Sverige' },
  NO: { en: 'Norway', el: 'Νορβηγία', de: 'Norwegen', es: 'Noruega', fr: 'Norvège', no: 'Norge' },
  PT: { en: 'Portugal', el: 'Πορτογαλία', de: 'Portugal', es: 'Portugal', fr: 'Portugal', pt: 'Portugal' },
  RU: { en: 'Russia', el: 'Ρωσία', de: 'Russland', es: 'Rusia', fr: 'Russie', ru: 'Россия' },
  CN: { en: 'China', el: 'Κίνα', de: 'China', es: 'China', fr: 'Chine', zh: '中国' },
  JP: { en: 'Japan', el: 'Ιαπωνία', de: 'Japan', es: 'Japón', fr: 'Japon', ja: '日本' },
  AU: { en: 'Australia', el: 'Αυστραλία', de: 'Australien', es: 'Australia', fr: 'Australie' },
  GR: { en: 'Greece', el: 'Ελλάδα', de: 'Griechenland', es: 'Grecia', fr: 'Grèce' },
  CY: { en: 'Cyprus', el: 'Κύπρος', de: 'Zypern', es: 'Chipre', fr: 'Chypre' },
  DE: { en: 'Germany', el: 'Γερμανία', de: 'Deutschland', es: 'Alemania', fr: 'Allemagne' },
};

export const ALLOWED_REGION_NAMES: Record<string, LocalizedNames> = {
  GR: { en: 'Greece', el: 'Ελλάδα', de: 'Griechenland', es: 'Grecia', fr: 'Grèce', it: 'Grecia', pt: 'Grécia', nl: 'Griekenland', pl: 'Grecja', tr: 'Yunanistan', ro: 'Grecia', bg: 'Гърция', ru: 'Греция', zh: '希腊', ja: 'ギリシャ', ar: 'اليونان' },
  CY: { en: 'Cyprus', el: 'Κύπρος', de: 'Zypern', es: 'Chipre', fr: 'Chypre', it: 'Cipro', pt: 'Chipre', nl: 'Cyprus', pl: 'Cypr', tr: 'Kıbrıs', ro: 'Cipru', bg: 'Кипър', ru: 'Кипр', zh: '塞浦路斯', ja: 'キプロス', ar: 'قبرص' },
  DE: { en: 'Germany', el: 'Γερμανία', de: 'Deutschland', es: 'Alemania', fr: 'Allemagne', it: 'Germania', pt: 'Alemanha', nl: 'Duitsland', pl: 'Niemcy', tr: 'Almanya', ro: 'Germania', bg: 'Германия', ru: 'Германия', zh: '德国', ja: 'ドイツ', ar: 'ألمانيا' },
};

export function getCountryLabel(countryCode: string, locale: GeoLocale): string {
  const names = COUNTRY_NAMES[countryCode];
  return names?.[locale] ?? names?.en ?? countryCode;
}

export function getAllowedRegionName(code: string, locale: GeoLocale): string {
  const names = ALLOWED_REGION_NAMES[code];
  return names?.[locale] ?? names?.en ?? code;
}
