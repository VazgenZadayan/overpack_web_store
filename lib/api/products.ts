import { formatPrice } from '@/utils/helpers';
import { fetcher } from './fetcher';
import type {
  IGetCategoriesResponse,
  IGetSubCategoriesResponse,
  IGetBrandsResponse,
  IGetProductListResponse,
  IGetSizesResponse,
  IProduct,
} from '@/shared/types/products';

export async function getCategories(): Promise<IGetCategoriesResponse> {
  return fetcher<IGetCategoriesResponse>('/category', {
    method: 'GET',
  });
}

export async function getSubCategories(
  categoryId: string
): Promise<IGetSubCategoriesResponse> {
  return fetcher<IGetSubCategoriesResponse>(
    `/category/subs?categoryId=${categoryId}`,
    {
      method: 'GET',
    }
  );
}

export async function getBrands(
  categoryId: string
): Promise<IGetBrandsResponse> {
  const data = await fetcher<IGetBrandsResponse>(
    `/category/brands?categoryId=${categoryId}`,
    {
      method: 'GET',
    }
  );
  
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
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
}): Promise<IGetSizesResponse> {
  const searchParams = new URLSearchParams();
  if (params.categoryId) searchParams.set('categoryId', params.categoryId);
  if (params.subCategoryId) searchParams.set('subCategoryId', params.subCategoryId);
  if (params.brandId) searchParams.set('brandId', params.brandId);

  return fetcher<IGetSizesResponse>(
    `/product/sizes?${searchParams.toString()}`,
    {
      method: 'GET',
    }
  );
}

export async function getProductList(params: {
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

  const data = await fetcher<IGetProductListResponse>(
    `/product/search?${searchParams.toString()}`,
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

export async function getProductById(id: number): Promise<IProduct> {
  const data = await fetcher<{ success: boolean; data: { product: IProduct } }>(
    `/product/${id}`,
    {
      method: 'GET',
    }
  );

  return {
    ...data.data.product,
    price: formatPrice(data.data.product.price),
  };
}

export async function getProductsByIds(ids: number[]): Promise<IGetProductListResponse> {
  const searchParams = new URLSearchParams();
  ids.forEach((id) => searchParams.append('ids', id.toString()));

  const data = await fetcher<IGetProductListResponse>(
    `/product/byIds?${searchParams.toString()}`,
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

