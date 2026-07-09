import { useMemo } from 'react'
import { useProducts } from './useProducts'
import type { Product } from '@/types/product'

export function useProductsMap(): Map<string, Product> {
  const { data: products = [] } = useProducts()
  return useMemo(() => new Map(products.map((p) => [p.id, p])), [products])
}
