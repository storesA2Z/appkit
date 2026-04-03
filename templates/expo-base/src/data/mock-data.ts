export interface Product {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  collection: string;
}

export interface Category {
  id: string;
  title: string;
  image: string;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  productTitle: string;
}

export const products: Product[] = [
  {
    id: "p1",
    title: "Silk Blouse",
    price: 89.99,
    compareAtPrice: 120.0,
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400",
    rating: 4.5,
    reviewCount: 128,
    collection: "new-arrivals",
  },
  {
    id: "p2",
    title: "Tailored Blazer",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
    rating: 4.8,
    reviewCount: 87,
    collection: "new-arrivals",
  },
  {
    id: "p3",
    title: "Leather Crossbody Bag",
    price: 149.99,
    compareAtPrice: 180.0,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
    rating: 4.6,
    reviewCount: 215,
    collection: "new-arrivals",
  },
  {
    id: "p4",
    title: "Cashmere Sweater",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
    rating: 4.9,
    reviewCount: 64,
    collection: "new-arrivals",
  },
  {
    id: "p5",
    title: "Denim Jacket",
    price: 129.99,
    compareAtPrice: 160.0,
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400",
    rating: 4.3,
    reviewCount: 192,
    collection: "women-tops",
  },
  {
    id: "p6",
    title: "Midi Wrap Dress",
    price: 109.99,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
    rating: 4.7,
    reviewCount: 156,
    collection: "women-dresses",
  },
  {
    id: "p7",
    title: "Oxford Button-Down",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
    rating: 4.4,
    reviewCount: 203,
    collection: "men-shirts",
  },
  {
    id: "p8",
    title: "Slim Fit Chinos",
    price: 89.99,
    compareAtPrice: 110.0,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400",
    rating: 4.2,
    reviewCount: 178,
    collection: "men-pants",
  },
  {
    id: "p9",
    title: "Gold Chain Necklace",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
    rating: 4.6,
    reviewCount: 95,
    collection: "jewelry",
  },
  {
    id: "p10",
    title: "Classic Watch",
    price: 249.99,
    compareAtPrice: 320.0,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
    rating: 4.8,
    reviewCount: 312,
    collection: "watches",
  },
  {
    id: "p11",
    title: "Suede Ankle Boots",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
    rating: 4.5,
    reviewCount: 142,
    collection: "shoes",
  },
  {
    id: "p12",
    title: "Canvas Tote Bag",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400",
    rating: 4.1,
    reviewCount: 267,
    collection: "bags",
  },
];

export const categories: Category[] = [
  {
    id: "women",
    title: "Women",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200",
  },
  {
    id: "men",
    title: "Men",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  },
  {
    id: "accessories",
    title: "Accessories",
    image: "https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=200",
  },
  {
    id: "shoes",
    title: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
  },
  {
    id: "bags",
    title: "Bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200",
  },
];

export const collections: Collection[] = [
  {
    id: "new-arrivals",
    title: "New Arrivals",
    description: "The latest styles fresh off the runway",
    image: "https://images.unsplash.com/photo-1558171813-01eda6b4be21?w=400",
    productCount: 48,
  },
  {
    id: "women-tops",
    title: "Women's Tops",
    description: "Blouses, tees, and everything in between",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400",
    productCount: 35,
  },
  {
    id: "women-dresses",
    title: "Women's Dresses",
    description: "From casual to cocktail",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
    productCount: 28,
  },
  {
    id: "men-shirts",
    title: "Men's Shirts",
    description: "Casual and formal shirts for every occasion",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
    productCount: 42,
  },
  {
    id: "men-pants",
    title: "Men's Pants",
    description: "Chinos, jeans, and tailored trousers",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400",
    productCount: 31,
  },
  {
    id: "jewelry",
    title: "Jewelry",
    description: "Elegant pieces for every style",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
    productCount: 56,
  },
  {
    id: "watches",
    title: "Watches",
    description: "Timeless timepieces",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
    productCount: 19,
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    author: "Sarah M.",
    rating: 5,
    text: "Absolutely love the quality! The silk blouse feels luxurious and the fit is perfect.",
    date: "2026-03-28",
    productTitle: "Silk Blouse",
  },
  {
    id: "r2",
    author: "James T.",
    rating: 4,
    text: "Great blazer for the price. Fits well and looks sharp for both office and casual wear.",
    date: "2026-03-25",
    productTitle: "Tailored Blazer",
  },
  {
    id: "r3",
    author: "Emily R.",
    rating: 5,
    text: "This bag is stunning! The leather is soft and the size is perfect for everyday use.",
    date: "2026-03-22",
    productTitle: "Leather Crossbody Bag",
  },
  {
    id: "r4",
    author: "Michael K.",
    rating: 5,
    text: "Softest sweater I own. Worth every penny. Already ordered a second color.",
    date: "2026-03-20",
    productTitle: "Cashmere Sweater",
  },
  {
    id: "r5",
    author: "Lisa W.",
    rating: 4,
    text: "Beautiful dress that works for both office and dinner. The wrap style is very flattering.",
    date: "2026-03-18",
    productTitle: "Midi Wrap Dress",
  },
  {
    id: "r6",
    author: "David P.",
    rating: 5,
    text: "The watch exceeded my expectations. Classic design with modern reliability.",
    date: "2026-03-15",
    productTitle: "Classic Watch",
  },
];

export function getProductsByCollection(collectionId: string): Product[] {
  return products.filter((p) => p.collection === collectionId);
}

export function getProductsByIds(ids: string[]): Product[] {
  return products.filter((p) => ids.includes(p.id));
}

export function getCategoriesByIds(ids: string[]): Category[] {
  return categories.filter((c) => ids.includes(c.id));
}

export function getCollectionsByIds(ids: string[]): Collection[] {
  return collections.filter((c) => ids.includes(c.id));
}

export function getTopRatedProducts(limit: number): Product[] {
  return [...products].sort((a, b) => b.rating - a.rating).slice(0, limit);
}
