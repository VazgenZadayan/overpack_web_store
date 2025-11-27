export interface ICartItem {
  id: number;
  price: number;
  quantity: number;
  countInCart: number;
  image: string;
  size: number;
  createdAt: string;
  title: string;
  description: string;
}

export interface ICartState {
  items: ICartItem[];
}



