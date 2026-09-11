import { Category, PageResponse, Product } from "@/types/catalog";

export const categories: Category[] = [
  { id: "c1", name: "Unitazlar", slug: "unitazlar", description: "Chidamli va zamonaviy keramika unitazlar", imageUrl: "/images/products/mtl13418p-mb.png", active: true, sortOrder: 1 },
  { id: "c2", name: "Rakovinalar", slug: "rakovinalar", description: "Polga o'rnatiladigan va stol usti keramika rakovinalar", imageUrl: "/images/products/mpb20108.png", active: true, sortOrder: 2 },
  { id: "c3", name: "Smesitellar", slug: "smesitellar", description: "Xrom qoplamali oshxona va vannaxona kranlari", imageUrl: "/images/products/mfa207002.png", active: true, sortOrder: 3 }
];

export const products: Product[] = [
  product({
    id: "p1",
    name: "Qora keramika rakovina",
    slug: "qora-keramika-rakovina-mpb20108b-1",
    model: "MPB20108B-1",
    category: categories[1],
    price: 1250000,
    color: "Black",
    material: "Keramika",
    image: "/images/products/mpb20108b-1.png",
    featured: true,
    dimensions: "43x45x85 sm",
    features: ["Sifatli keramika", "Zamonaviy dizayn", "Oson tozalanadi", "O'rnatish oson", "5 yil kafolat"]
  }),
  product({
    id: "p2",
    name: "Oq keramika rakovina",
    slug: "oq-keramika-rakovina-mpb20108",
    model: "MPB20108",
    category: categories[1],
    price: 1150000,
    color: "White",
    material: "Keramika",
    image: "/images/products/mpb20108.png",
    featured: true,
    dimensions: "43x43x85 sm",
    features: ["Sifatli keramika", "Zamonaviy dizayn", "Oson tozalanadi", "O'rnatish oson", "5 yil kafolat"]
  }),
  product({
    id: "p3",
    name: "Vertikal keramika rakovina",
    slug: "vertikal-keramika-rakovina-mpb20104",
    model: "MPB20104",
    category: categories[1],
    price: 1180000,
    color: "White",
    material: "Keramika",
    image: "/images/products/mpb20104.png",
    featured: false,
    dimensions: "45x45x85 sm",
    features: ["Sifatli keramika", "Zamonaviy dizayn", "Oson tozalanadi", "O'rnatish oson", "5 yil kafolat"]
  }),
  product({
    id: "p4",
    name: "Qora keramika unitaz",
    slug: "qora-keramika-unitaz-mtl13418p-mb",
    model: "MTL13418P-MB",
    category: categories[0],
    price: 1750000,
    color: "Black",
    material: "Keramika",
    image: "/images/products/mtl13418p-mb.png",
    featured: true,
    features: ["Sifatli keramika", "Zamonaviy dizayn", "Oson tozalanadi", "Chidamli va ishonchli", "Qulay foydalanish", "5 yil kafolat"]
  }),
  product({
    id: "p5",
    name: "Stol usti keramika rakovina",
    slug: "stol-usti-keramika-rakovina-mab10128-4",
    model: "MAB10128-4",
    category: categories[1],
    price: 980000,
    color: "White",
    material: "Keramika",
    image: "/images/products/mab10128-4.png",
    featured: false,
    features: ["Sifatli material", "Zanglamaydi", "Suvni tez chiqaradi", "O'rnatish oson", "Zamonaviy dizayn", "5 yil kafolat"]
  }),
  product({
    id: "p6",
    name: "Dushsiz xrom kran",
    slug: "dushsiz-xrom-kran-mfa207002",
    model: "MFA207002",
    category: categories[2],
    price: 640000,
    color: "Chrome",
    material: "Xrom qoplama",
    image: "/images/products/mfa207002.png",
    featured: false,
    features: ["Sifatli xrom qoplama", "Zanglamaydi", "Suv oqimini ishonchli boshqaradi", "O'rnatish oson", "5 yil kafolat"]
  })
];

type MockProductInput = {
  id: string;
  name: string;
  slug: string;
  model: string;
  category: Category;
  price: number;
  color: string;
  material: string;
  image: string;
  featured: boolean;
  dimensions?: string;
  features: string[];
};

function product(input: MockProductInput): Product {
  const featureAttributes = input.features.map((feature, index) => ({
    name: `Afzallik ${index + 1}`,
    value: feature,
    sortOrder: index + 4
  }));

  return {
    id: input.id,
    name: input.name,
    slug: input.slug,
    brand: "Mc PoLOO",
    model: input.model,
    price: input.price,
    mainImageUrl: input.image,
    status: "ACTIVE",
    featured: input.featured,
    newArrival: true,
    category: input.category,
    description: `${input.name} - Mc PoLOO katalogi uchun vaqtinchalik static ma'lumot. Real narx va ombor holati admin panel orqali yangilanadi.`,
    galleryImages: [{ url: input.image, alt: input.name, sortOrder: 1 }],
    attributes: [
      { name: "Material", value: input.material, sortOrder: 1 },
      { name: "Rang", value: input.color, sortOrder: 2 },
      ...(input.dimensions ? [{ name: "O'lcham", value: input.dimensions, sortOrder: 3 }] : []),
      ...featureAttributes
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function mockPage(params: URLSearchParams): PageResponse<Product> {
  const q = params.get("q")?.toLowerCase();
  const category = params.get("category");
  const color = params.get("color");
  const availability = params.get("availability");
  const brand = params.get("brand")?.toLowerCase();
  const min = Number(params.get("minPrice") || 0);
  const max = Number(params.get("maxPrice") || 0);
  const sort = params.get("sort");
  const page = Math.max(Number(params.get("page") || 0), 0);
  const size = Math.max(Number(params.get("size") || 12), 1);
  let data = products.filter((item) => {
    const visible = item.status !== "INACTIVE";
    const matchesQ = !q || [item.name, item.model, item.brand, item.category.name].some((value) => value.toLowerCase().includes(q));
    const matchesCategory = !category || item.category.slug === category;
    const matchesBrand = !brand || item.brand.toLowerCase() === brand;
    const matchesColor = !color || item.attributes.some((attr) => attr.name.toLowerCase().includes("rang") && attr.value.toLowerCase() === color.toLowerCase());
    const matchesAvailability = !availability
      || (availability === "in-stock" && item.status === "ACTIVE")
      || (availability === "out-of-stock" && item.status === "OUT_OF_STOCK");
    const matchesPrice = (!min || item.price >= min) && (!max || item.price <= max);
    return visible && matchesQ && matchesCategory && matchesBrand && matchesColor && matchesAvailability && matchesPrice;
  });
  if (sort === "price-asc") data = data.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") data = data.sort((a, b) => b.price - a.price);
  const totalElements = data.length;
  const totalPages = Math.max(Math.ceil(totalElements / size), 1);
  const content = data.slice(page * size, page * size + size);
  return { totalElements, totalPages, page, size, content };
}
