import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n'
import { useShop } from '@/context/ShopContext'
import { formatPrice } from '@/utils/formatPrice'
import { discountPercent } from '@/constants/products'
import { fadeUp } from '@/animations/variants'
import type { Product } from '@/types/product'
import bottleSole from '@/assets/images/bottle-sole.svg'

export function ProductCard({ product }: { product: Product }) {
  const { t } = useI18n()
  const { isWished, toggleWish, addToCart } = useShop()
  const discount = discountPercent(product)
  const wished = isWished(product.id)

  return (
    <motion.article
      id={`product-${product.id}`}
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-cream shadow-[0_8px_24px_-12px_rgba(42,23,8,0.15)] transition-shadow duration-300"
    >
      {/* badges over the visual */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discount && (
          <span
            data-testid="discount-badge"
            className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-white"
          >
            -{discount}%
          </span>
        )}
        {product.bestSeller && (
          <span
            data-testid="bestseller-badge"
            className="rounded-full bg-cocoa px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase"
          >
            {t('products.bestseller')}
          </span>
        )}
      </div>
      <button
        type="button"
        aria-label={t('shop.wishlist')}
        aria-pressed={wished}
        data-testid="wish-toggle"
        onClick={() => toggleWish(product.id)}
        className={cn(
          'absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full transition-all duration-300',
          wished
            ? 'bg-primary text-white'
            : 'bg-white/85 text-foreground/60 hover:text-primary',
        )}
      >
        <Heart className={cn('size-4', wished && 'fill-current')} />
      </button>

      {/* product visual */}
      <Link
        to={`/products/${product.id}`}
        className={cn(
          'relative flex aspect-square items-end justify-center overflow-hidden bg-gradient-to-br',
          product.tone,
        )}
      >
        <img
          src={product.media.find((m) => m.type === 'image')?.url ?? bottleSole}
          alt={product.name}
          className="h-[82%] w-auto translate-y-2 drop-shadow-[0_18px_28px_rgba(90,45,0,0.3)] transition-transform duration-700 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-0.5 p-4">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
          {product.brand}
        </p>
        <Link
          to={`/products/${product.id}`}
          className="font-display text-lg leading-snug text-foreground transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        {product.notes && (
          <p className="text-xs text-muted-foreground">
            {product.notes.join(' · ')}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.priceAzn)}
            </span>
            {product.oldPriceAzn && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.oldPriceAzn)}
              </span>
            )}
          </div>
          <button
            type="button"
            data-testid="add-to-cart"
            aria-label={t('shop.addToCart')}
            onClick={() => addToCart(product.id, product.sizes[0]?.ml ?? null)}
            className="flex size-9 items-center justify-center rounded-full bg-primary text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-[#d05f08]"
          >
            <ShoppingBag className="size-4" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
