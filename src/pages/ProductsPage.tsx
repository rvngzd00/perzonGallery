import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { ProductCard } from '@/components/sections/ProductCard'
import { staggerContainer, fadeUp } from '@/animations/variants'
import type { ProductCategory } from '@/types/product'

export default function ProductsPage() {
  const { t } = useI18n()
  const { data: products = [] } = useProducts()
  const { data: categories = [] } = useCategories()
  const [searchParams] = useSearchParams()

  const initialCategory =
    (searchParams.get('category') as ProductCategory | null) ?? 'all'
  const [category, setCategory] = useState<ProductCategory | 'all'>(
    categories.includes(initialCategory as ProductCategory)
      ? (initialCategory as ProductCategory)
      : 'all',
  )
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  // A marquee/chip click can re-navigate here with a new ?category=/?q=
  // while already mounted — keep the filter in sync with the URL.
  useEffect(() => {
    const cat = searchParams.get('category') as ProductCategory | null
    if (cat && categories.includes(cat)) setCategory(cat)
    const q = searchParams.get('q')
    if (q) setQuery(q)
  }, [searchParams, categories])

  useEffect(() => {
    const highlight = searchParams.get('highlight')
    if (!highlight) return
    const el = document.getElementById(`product-${highlight}`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add('ring-2', 'ring-primary')
    const timeout = setTimeout(
      () => el.classList.remove('ring-2', 'ring-primary'),
      2200,
    )
    return () => clearTimeout(timeout)
  }, [searchParams, products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      )
    })
  }, [products, category, query])

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-10">
      <Helmet>
        <title>
          {t('products.pageTitle')} — PERZON GALLERY
        </title>
        <meta name="description" content={t('products.pageSubtitle')} />
      </Helmet>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-8 max-w-2xl"
      >
        <h1 className="font-display text-4xl font-medium text-foreground md:text-6xl">
          {t('products.pageTitle')}
        </h1>
        <p className="mt-3 text-muted-foreground md:text-lg">
          {t('products.pageSubtitle')}
        </p>
      </motion.div>

      {/* Search bar */}
      <div className="relative mb-6 max-w-xl">
        <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('shop.search')}
          data-testid="catalog-search"
          className="h-12 w-full rounded-full border border-border bg-white pr-5 pl-11 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Filter chips */}
      <div className="mb-10 flex flex-wrap gap-2">
        {(['all', ...categories] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={cn(
              'rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300',
              category === c
                ? 'border-primary bg-primary text-white shadow-md'
                : 'border-border bg-white text-muted-foreground hover:border-primary/50 hover:text-foreground',
            )}
          >
            {c === 'all' ? t('products.all') : t(`category.${c}`)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          {t('products.empty')}
        </p>
      ) : (
        <motion.div
          key={`${category}-${query}`}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
