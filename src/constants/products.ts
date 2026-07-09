export function discountPercent(p: {
  priceAzn: number
  oldPriceAzn?: number
}): number | null {
  if (!p.oldPriceAzn || p.oldPriceAzn <= p.priceAzn) return null
  return Math.round((1 - p.priceAzn / p.oldPriceAzn) * 100)
}
