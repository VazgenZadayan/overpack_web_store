export interface ICategory {
  id: number;
  image: string;
  title: string;
  subCategories: number;
  brands: number;
}

export interface IBrand {
  id: number;
  image: string;
  title: string;
  description: string;
  strength: number;
}

export interface IProduct {
  id: number;
  brandId: string;
  image: string;
  price: string;
  size: number;
  createdAt: string;
  title: string;
  quantity: number;
  description: string;
}

export interface IGetCategoriesResponse {
  success: boolean;
  data: {
    categories: ICategory[];
  };
}

export interface IGetSubCategoriesResponse {
  success: boolean;
  data: {
    subCategories: ICategory[];
  };
}

export interface IGetBrandsResponse {
  success: boolean;
  data: {
    brands: IBrand[];
  };
}

export interface IGetProductListResponse {
  success: boolean;
  data: {
    products: IProduct[];
  };
}

export interface IGetSizesResponse {
  success: boolean;
  data: {
    sizes: number[];
  };
}

