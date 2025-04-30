export interface Stone {
  id: string;
  name: string;
  type: 'Yakut' | 'Safir' | 'Zümrüt' | 'Elmas' | 'İnci';
  carat: number;
  color: string;
  price: number;
  image: string;
  description: string;
  origin: string;
  clarity: string;
} 