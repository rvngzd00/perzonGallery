import { SITE } from '@/constants/site'
import type { CartPricingLine } from '@/hooks/useCartPricing'

export function buildWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function buildCartMessage(
  lines: CartPricingLine[],
  total: number,
  intro: string,
): string {
  const rows = lines.map((l) => {
    const size = l.item.sizeMl ? ` (${l.item.sizeMl} ml)` : ''
    return `• ${l.product.name}${size} — ${l.product.brand} × ${l.item.qty} = ${l.lineTotal} ₼`
  })
  return [intro, '', ...rows, '', `Cəmi / Итого: ${total} ₼`].join('\n')
}
