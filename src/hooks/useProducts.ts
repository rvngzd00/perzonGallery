import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/lib/api/products'
import type { Product } from '@/types/product'

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    initialData: [],
    // Marks the placeholder as already-stale so the real fetch still runs on
    // mount despite the global `staleTime` (otherwise initialData would be
    // treated as fresh and the live query would never fire).
    initialDataUpdatedAt: 0,
  })
}

export function useProduct(id: string | undefined) {
  const { data: products, ...rest } = useProducts()
  const product = id ? products?.find((p) => p.id === id) : undefined
  return { data: product, ...rest }
}
