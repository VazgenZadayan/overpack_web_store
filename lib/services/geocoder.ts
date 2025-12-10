import type { IAddressSuggestion } from '@/shared/types/address';

const ARMENIA_CENTER = '44.5,40.2';
const ARMENIA_SPAN = '2.0,2.0';

const LANGUAGE_MAP: Record<string, string> = {
  ru: 'ru_RU',
  en: 'en_US',
  hy: 'hy_AM',
};

interface ISuggestResult {
  title: {
    text: string;
  };
  subtitle?: {
    text: string;
  };
  uri?: string;
  distance?: {
    value: number;
  };
  tags?: string[];
}

interface ISuggestResponse {
  results?: ISuggestResult[];
}

interface IGeocodeResponse {
  response?: {
    GeoObjectCollection?: {
      featureMember?: Array<{
        GeoObject?: {
          Point?: {
            pos?: string;
          };
        };
      }>;
    };
  };
}

function getLocaleFromURL(): string {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);
  
  const possibleLocale = segments[0];
  if (possibleLocale === 'hy' || possibleLocale === 'ru') {
    return possibleLocale;
  }
  
  return 'en';
}

function getObjectType(item: ISuggestResult): string {
  if (item.tags && item.tags.length > 0) {
    return item.tags[0];
  }
  return 'house';
}

function formatAddress(item: ISuggestResult): {
  displayName: string;
  fullAddress: string;
  entrance?: string;
} {
  const displayName = item.title.text || '';
  const fullAddress = item.subtitle?.text || '';
  
  // Try to extract entrance from displayName or fullAddress
  const entranceMatch = displayName.match(/подъезд\s*(\d+)/i) || 
                       fullAddress.match(/подъезд\s*(\d+)/i);
  const entrance = entranceMatch ? entranceMatch[1] : undefined;

  return {
    displayName,
    fullAddress,
    entrance,
  };
}

export const geocoderService = {
  async searchAddress(query: string): Promise<IAddressSuggestion[]> {
    if (!query.trim() || query.length < 3) return [];

    try {
      const currentLanguage = getLocaleFromURL();
      const apiLanguage = LANGUAGE_MAP[currentLanguage] || 'en_US';

      const suggestApiKey = process.env.NEXT_PUBLIC_YANDEX_SUGGEST_API_KEY;
      const suggestBaseUrl = process.env.NEXT_PUBLIC_YANDEX_SUGGEST_BASE_URL || 'https://suggest-maps.yandex.ru/v1/suggest';

      if (!suggestApiKey) {
        console.error('Yandex Suggest API key is not configured');
        return [];
      }

      const response = await fetch(
        `${suggestBaseUrl}?apikey=${suggestApiKey}&text=${encodeURIComponent(query)}&lang=${apiLanguage}&results=10&highlight=1&print_address=1&attrs=uri&ll=${ARMENIA_CENTER}&spn=${ARMENIA_SPAN}&strict_bounds=1`,
      );

      if (!response.ok) {
        throw new Error('Suggest API request failed');
      }

      const data: ISuggestResponse = await response.json();

      if (!data.results) return [];

      const results = data.results.map((item, index) => {
        const objectType = getObjectType(item);
        const { displayName, fullAddress, entrance } = formatAddress(item);

        return {
          id: `${index}-${item.uri || item.title.text}`,
          displayName,
          fullAddress,
          entrance,
          coordinates: { latitude: 0, longitude: 0 },
          precision: 'exact',
          kind: objectType,
          icon: 'location-outline',
          uri: item.uri,
          distance: item.distance?.value,
        };
      });

      return results;
    } catch (error) {
      console.error('Geocoder search error:', error);
      return [];
    }
  },

  async getCoordinates(
    uri: string,
  ): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const currentLanguage = getLocaleFromURL();
      const apiLanguage = LANGUAGE_MAP[currentLanguage] || 'en_US';

      const geocoderApiKey = process.env.NEXT_PUBLIC_YANDEX_GEOCODER_API_KEY;
      const geocoderBaseUrl = process.env.NEXT_PUBLIC_YANDEX_GEOCODER_BASE_URL || 'https://geocode-maps.yandex.ru/1.x';

      if (!geocoderApiKey) {
        console.error('Yandex Geocoder API key is not configured');
        return null;
      }

      const response = await fetch(
        `${geocoderBaseUrl}?apikey=${geocoderApiKey}&format=json&uri=${encodeURIComponent(uri)}&results=1&lang=${apiLanguage}`,
      );

      if (!response.ok) return null;

      const data: IGeocodeResponse = await response.json();
      const geoObject =
        data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;

      if (geoObject?.Point?.pos) {
        const [longitude, latitude] = geoObject.Point.pos
          .split(' ')
          .map(Number);
        return { latitude, longitude };
      }

      return null;
    } catch (error) {
      console.error('Geocoder getCoordinates error:', error);
      return null;
    }
  },
};




