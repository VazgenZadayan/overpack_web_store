import { API } from '@/lib/constants';
import { formatPrice } from '@/utils/helpers';
import type {
  IGetCategoriesResponse,
  IGetSubCategoriesResponse,
  IGetBrandsResponse,
  IGetProductListResponse,
  IGetSizesResponse,
  IProduct,
} from '@/shared/types/products';

async function fetchAPI<T>(
  url: string,
  language: string,
  options?: RequestInit
): Promise<T> {
  const token = typeof document !== 'undefined' 
    ? getCookie('token') 
    : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { token }),
  };

  const apiLanguage = language === 'hy' ? 'am' : language;
  headers['Accept-Language'] = apiLanguage;

  const response = await fetch(`${API}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export async function getCategories(language: string): Promise<IGetCategoriesResponse> {
  return fetchAPI<IGetCategoriesResponse>('category', language, {
    method: 'GET',
  });
}

export async function getSubCategories(
  language: string,
  categoryId: string
): Promise<IGetSubCategoriesResponse> {
  return fetchAPI<IGetSubCategoriesResponse>(
    `/category/subs?categoryId=${categoryId}`,
    language,
    {
      method: 'GET',
    }
  );
}

export async function getBrands(
  language: string,
  categoryId: string
): Promise<IGetBrandsResponse> {
  const data = await fetchAPI<IGetBrandsResponse>(
    `/category/brands?categoryId=${categoryId}`,
    language,
    {
      method: 'GET',
    }
  );
  
  // Apply serializer logic
  return {
    ...data,
    data: {
      brands: data.data.brands.map((brand) => ({
        ...brand,
        strength: brand.strength || 2,
      })),
    },
  };
}

export async function getSizes(params: {
  language: string;
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
}): Promise<IGetSizesResponse> {
  const searchParams = new URLSearchParams();
  if (params.categoryId) searchParams.set('categoryId', params.categoryId);
  if (params.subCategoryId) searchParams.set('subCategoryId', params.subCategoryId);
  if (params.brandId) searchParams.set('brandId', params.brandId);

  return fetchAPI<IGetSizesResponse>(
    `product/sizes?${searchParams.toString()}`,
    params.language,
    {
      method: 'GET',
    }
  );
}

export async function getProductList(params: {
  language: string;
  categoryId: string;
  subCategoryId?: string;
  brandId?: string;
  size?: number;
  search: string;
}): Promise<IGetProductListResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set('categoryId', params.categoryId);
  if (params.subCategoryId) searchParams.set('subCategoryId', params.subCategoryId);
  if (params.brandId) searchParams.set('brandId', params.brandId);
  if (params.size) searchParams.set('size', params.size.toString());
  searchParams.set('search', params.search);

  const data = await fetchAPI<IGetProductListResponse>(
    `product/search?${searchParams.toString()}`,
    params.language,
    {
      method: 'GET',
    }
  );

  return {
    ...data,
    data: {
      products: data.data.products.map((product) => ({
        ...product,
        price: formatPrice(product.price),
      })),
    },
  };
}

export async function getProductById(id: number, language: string): Promise<IProduct> {
  const data = await fetchAPI<{ success: boolean; data: { product: IProduct } }>(
    `product/${id}`,
    language,
    {
      method: 'GET',
    }
  );

  return {
    ...data.data.product,
    price: formatPrice(data.data.product.price),
  };
}

