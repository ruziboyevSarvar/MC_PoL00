export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  active: boolean;
  sortOrder: number;
};

export type ProductAttribute = {
  name: string;
  value: string;
  sortOrder: number;
};

export type ProductImage = {
  url: string;
  alt?: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  model: string;
  price: number;
  oldPrice?: number | null;
  description?: string | null;
  mainImageUrl: string;
  status: ProductStatus;
  featured: boolean;
  newArrival: boolean;
  category: Category;
  galleryImages: ProductImage[];
  attributes: ProductAttribute[];
  createdAt: string;
  updatedAt: string;
};

export type PageResponse<T> = {
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  content: T[];
};
