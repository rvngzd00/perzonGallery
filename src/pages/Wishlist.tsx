import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useI18n } from '@/i18n'
import { useShop } from '@/context/ShopContext'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/sections/ProductCard'
import { staggerContainer, fadeUp } from '@/animations/variants'

export default function Wishlist() {
  const { t } = useI18n()
  const { wishlist } = useShop()
  const { data: liveProducts = [] } = useProducts()
  const productMap = new Map(liveProducts.map((product) => [product.id, product]))
  const products = wishlist
    .map((id) => productMap.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-10">
      <Helmet>
        <title>
          {t('shop.wishlist')} — PERZON GALLERY
        </title>
      </Helmet>

      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-10 font-display text-4xl font-medium text-foreground md:text-6xl"
      >
        {t('shop.wishlist')}
      </motion.h1>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-cream text-primary shadow-md">
            <Heart className="size-7" />
          </span>
          <p className="max-w-sm text-muted-foreground">
            {t('shop.wishlist.empty')}
          </p>
          <Link
            to="/products"
            className="mt-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#d05f08]"
          >
            {t('products.viewAll')}
          </Link>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
