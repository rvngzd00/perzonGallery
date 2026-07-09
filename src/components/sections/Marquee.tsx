import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useBrands } from '@/hooks/useBrands'
import type { Brand } from '@/types/brand'

function BrandWordmark({ brand }: { brand: Brand }) {
  return (
    <Link
      to={`/products?q=${encodeURIComponent(brand.name)}`}
      data-testid="marquee-chip"
      className="mx-8 flex shrink-0 items-center whitespace-nowrap"
    >
      <span className="font-display text-xl text-foreground/60 italic transition-colors duration-300 hover:text-primary md:text-2xl">
        {brand.name}
      </span>
      <span aria-hidden className="ml-8 h-6 w-px bg-border" />
    </Link>
  )
}

function MarqueeRow({
  brands,
  direction,
}: {
  brands: Brand[]
  direction: 'ltr' | 'rtl'
}) {
  const [paused, setPaused] = useState(false)
  if (brands.length === 0) return null

  return (
    <div
      className="marquee-row overflow-hidden"
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        className={cn(
          'marquee-track items-center',
          direction === 'ltr' ? 'marquee-track--ltr' : 'marquee-track--rtl',
        )}
        style={paused ? { animationPlayState: 'paused' } : undefined}
      >
        {[...brands, ...brands].map((brand, i) => (
          <BrandWordmark key={`${brand.id}-${i}`} brand={brand} />
        ))}
      </div>
    </div>
  )
}

/** "As seen from" brand wordmark strip below the Hero — no product imagery. */
export function Marquee() {
  const { data: brands = [] } = useBrands()
  if (brands.length === 0) return null

  const rowTop = brands.filter((_, i) => i % 2 === 0)
  const rowBottom = brands.filter((_, i) => i % 2 === 1)

  return (
    <div className="mx-auto max-w-7xl space-y-4 border-y border-border/60 px-0 py-10">
      <MarqueeRow brands={rowTop} direction="ltr" />
      <MarqueeRow brands={rowBottom} direction="rtl" />
    </div>
  )
}
