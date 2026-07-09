import { apiClient } from '@/lib/api/client'
import { fetchBrands } from '@/lib/api/brands'
import type {
  Product,
  ProductCategory,
  ProductGender,
  ProductMedia,
  ProductSizeVariant,
} from '@/types/product'

type ProductRecord = Omit<Product, 'brand'> & {
  brand?: string
  oldPriceAzn?: number | null
  marqueeOrder?: number | null
}

function mapRecord(row: ProductRecord, brandName?: string): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand ?? brandName ?? row.brandId,
    brandId: row.brandId,
    category: row.category as ProductCategory,
    gender: row.gender as ProductGender,
    priceAzn: Number(row.priceAzn),
    oldPriceAzn:
      row.oldPriceAzn != null ? Number(row.oldPriceAzn) : undefined,
    tone: row.tone,
    featured: row.featured,
    notes: row.notes ?? [],
    media: row.media ?? [],
    sizes: row.sizes ?? [],
    rating: Number(row.rating),
    bestSeller: row.bestSeller,
    marquee: row.marquee,
    marqueeOrder: row.marqueeOrder ?? undefined,
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const [products, brands] = await Promise.all([
    apiClient.get<ProductRecord[]>('products'),
    fetchBrands(),
  ])
  const brandMap = new Map(brands.map((brand) => [brand.id, brand.name]))
  return products.map((product) => mapRecord(product, brandMap.get(product.brandId)))
}

export async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const [product, brands] = await Promise.all([
      apiClient.get<ProductRecord>('products', id),
      fetchBrands(),
    ])
    return mapRecord(product, brands.find((brand) => brand.id === product.brandId)?.name)
  } catch (error) {
    if (error instanceof Error && error.message.includes('(404)')) return null
    throw error
  }
}

export interface ProductInput {
  id: string
  name: string
  brandId: string
  category: ProductCategory
  gender: ProductGender
  notes?: string[]
  priceAzn: number
  oldPriceAzn?: number | null
  tone?: string
  media?: ProductMedia[]
  sizes?: ProductSizeVariant[]
  rating?: number
  bestSeller?: boolean
  featured?: boolean
  marquee?: boolean
  marqueeOrder?: number | null
}

async function toRecord(input: ProductInput | Partial<Omit<ProductInput, 'id'>>) {
  const brand = input.brandId
    ? (await fetchBrands()).find((item) => item.id === input.brandId)
    : undefined

  return {
    ...input,
    ...(brand ? { brand: brand.name } : {}),
    tone: input.tone ?? 'from-[#f4e6d4] via-[#e2c9a8] to-[#c3a175]',
    notes: input.notes ?? [],
    media: input.media ?? [],
    sizes: input.sizes ?? [],
    rating: input.rating ?? 0,
    bestSeller: input.bestSeller ?? false,
    featured: input.featured ?? false,
    marquee: input.marquee ?? false,
    marqueeOrder: input.marqueeOrder ?? null,
  }
}

export async function createProduct(input: ProductInput): Promise<void> {
  await apiClient.post<ProductRecord>('products', await toRecord(input))
}

export async function updateProduct(
  id: string,
  input: Partial<Omit<ProductInput, 'id'>>,
): Promise<void> {
  await apiClient.patch<ProductRecord>('products', id, await toRecord(input))
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete('products', id)
}
