import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n'
import { useShop } from '@/context/ShopContext'
import { useProduct } from '@/hooks/useProducts'
import { formatPrice } from '@/utils/formatPrice'
import { discountPercent } from '@/constants/products'
import { fadeUp } from '@/animations/variants'
import { ProductGallery } from '@/components/product/ProductGallery'
import { SizeSelector } from '@/components/product/SizeSelector'
import NotFound from '@/pages/NotFound'
import type { ProductSizeVariant } from '@/types/product'

export default function ProductDetail() {
  const { id } = useParams()
  const { t } = useI18n()
  const { isWished, toggleWish, addToCart, openCart } = useShop()
  const { data: product } = useProduct(id)
  const [qty, setQty] = useState(1)
  const [selectedSize, setSelectedSize] = useState<ProductSizeVariant | null>(
    null,
  )

  useEffect(() => {
    setSelectedSize(product?.sizes[0] ?? null)
    setQty(1)
  }, [product])

  if (!product) return <NotFound />

  const activePrice = selectedSize
    ? { priceAzn: selectedSize.priceAzn, oldPriceAzn: selectedSize.oldPriceAzn }
    : { priceAzn: product.priceAzn, oldPriceAzn: product.oldPriceAzn }
  const discount = discountPercent(activePrice)
  const wished = isWished(product.id)

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6 lg:px-10">
      <Helmet>
        <title>{product.name} — PERZON GALLERY</title>
        <meta
          name="description"
          content={`${product.name} — ${product.brand}. ${product.notes?.join(', ') ?? ''}`}
        />
      </Helmet>

      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/products"
          className="flex size-11 items-center justify-center rounded-full bg-white text-foreground shadow-md transition-colors hover:text-primary"
          aria-label={t('shop.back')}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <button
          type="button"
          aria-label={t('shop.wishlist')}
          aria-pressed={wished}
          data-testid="wish-toggle"
          onClick={() => toggleWish(product.id)}
          className={cn(
            'flex size-11 items-center justify-center rounded-full shadow-md transition-all duration-300',
            wished ? 'bg-primary text-white' : 'bg-cocoa text-white',
          )}
        >
          <Heart className={cn('size-5', wished && 'fill-current')} />
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <ProductGallery product={product} />

        {/* ── Info card ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="glass-card flex flex-col p-7 md:p-9"
        >
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            {product.brand}
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium text-foreground md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(`category.${product.category}`)}
          </p>

          {product.notes && (
            <div className="mt-5">
              <p className="text-xs font-semibold tracking-[0.15em] text-foreground/70 uppercase">
                {t('shop.notes')}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.notes.map((note) => (
                  <span
                    key={note}
                    className="rounded-full border border-border bg-white px-3 py-1 text-xs text-muted-foreground"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* price row */}
          <div className="mt-7 flex items-center gap-3">
            <span
              data-testid="detail-price"
              className="text-3xl font-bold text-foreground"
            >
              {formatPrice(activePrice.priceAzn)}
            </span>
            {discount && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white">
                -{discount}%
              </span>
            )}
            {activePrice.oldPriceAzn && (
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(activePrice.oldPriceAzn)}
              </span>
            )}
          </div>

          {product.sizes.length > 0 && (
            <div className="mt-6">
              <SizeSelector
                sizes={product.sizes}
                selected={selectedSize}
                onSelect={setSelectedSize}
              />
            </div>
          )}

          {/* qty + buy */}
          <div className="mt-auto flex flex-col gap-4 pt-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {t('shop.qty')}
              </span>
              <div className="flex items-center gap-1 rounded-full border border-border bg-white p-1">
                <button
                  type="button"
                  aria-label="−"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
                >
                  <Minus className="size-4" />
                </button>
                <span
                  data-testid="qty-value"
                  className="w-8 text-center text-base font-semibold text-foreground"
                >
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="+"
                  onClick={() => setQty((q) => q + 1)}
                  className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <motion.button
              type="button"
              data-testid="detail-add-to-cart"
              onClick={() => {
                addToCart(product.id, selectedSize?.ml ?? null, qty)
                openCart()
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-white shadow-[0_12px_30px_-8px_rgba(234,115,23,0.5)] transition-colors hover:bg-[#d05f08]"
            >
              <ShoppingBag className="size-5" />
              {t('shop.buyFor')} {formatPrice(activePrice.priceAzn * qty)}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
