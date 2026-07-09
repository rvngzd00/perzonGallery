import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '@/lib/api/categories'
import type { ProductCategory } from '@/types/product'

/** Matches the live table's seeded rows — used only as instant initial data. */
const FALLBACK_CATEGORIES: ProductCategory[] = [
  'original-arabic',
  'a-class',
  'mens',
  'womens',
  'unisex',
  'gift-sets',
]

export function useCategories() {
  return useQuery<ProductCategory[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    initialData: FALLBACK_CATEGORIES,
    initialDataUpdatedAt: 0,
  })
}
