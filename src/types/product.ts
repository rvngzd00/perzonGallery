export type ProductCategory =
  | 'original-arabic'
  | 'a-class'
  | 'mens'
  | 'womens'
  | 'unisex'
  | 'gift-sets'

export type ProductGender = 'men' | 'women' | 'unisex'

export type MediaType = 'image' | 'video'

export interface ProductMedia {
  type: MediaType
  url: string
  sortOrder: number
}

export interface ProductSizeVariant {
  ml: number
  priceAzn: number
  oldPriceAzn?: number
}

export interface Product {
  id: string
  name: string
  brand: string
  /** FK slug into brands — needed for admin brand-select and flagship lookups */
  brandId: string
  category: ProductCategory
  gender: ProductGender
  /** Base/default price, used when `sizes` is empty */
  priceAzn: number
  /** Pre-discount price; presence of this implies a discount badge */
  oldPriceAzn?: number
  /** Tailwind gradient classes used as the placeholder "bottle shot" */
  tone: string
  featured?: boolean
  notes?: string[]
  /** Real photos/videos; empty ⇒ fall back to `tone` + placeholder bottle art */
  media: ProductMedia[]
  /** ml/price variants; empty ⇒ no size-selector UI, use priceAzn/oldPriceAzn directly */
  sizes: ProductSizeVariant[]
  /** 0–5 */
  rating: number
  bestSeller: boolean
  /** Included in the homepage marquee */
  marquee: boolean
  marqueeOrder?: number
}
