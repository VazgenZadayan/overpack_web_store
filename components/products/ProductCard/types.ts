export interface ProductCardProps {
  id: number;
  title: string;
  price: string;
  image: string;
  size: number;
  quantity: number;
  description: string;
  createdAt: string;
  onClick: () => void;
}

