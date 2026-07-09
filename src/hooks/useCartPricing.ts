import { useMemo } from 'react'
import { useShop, type CartItem } from '@/context/ShopContext'
import { useProductsMap } from './useProductsMap'
import type { Product } from '@/types/product'

export interface CartPricingLine {
  item: CartItem
  product: Product
  unitPrice: number
  lineTotal: number
}

/**
 * Joins cart id/qty/size bookkeeping (ShopContext, synchronous/localStorage)
 * with live product data (async/cached) to derive line and cart totals.
 * Kept separate from ShopContext so the cart never flickers to 0 while
 * product data is loading.
 */
export function useCartPricing() {
  const { cart } = useShop()
  const productsMap = useProductsMap()

  const lines = useMemo<CartPricingLine[]>(() => {
    return cart.flatMap((item) => {
      const product = productsMap.get(item.id)
      if (!product) return []
      const variant = item.sizeMl
        ? product.sizes.find((s) => s.ml === item.sizeMl)
        : undefined
      const unitPrice = variant?.priceAzn ?? product.priceAzn
      return [{ item, product, unitPrice, lineTotal: unitPrice * item.qty }]
    })
  }, [cart, productsMap])

  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.lineTotal, 0),
    [lines],
  )

  return { lines, total }
}
