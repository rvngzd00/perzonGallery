import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SectionHeading } from '@/components/layout/Section'
import { useI18n } from '@/i18n'
import { useProducts } from '@/hooks/useProducts'
import { staggerContainer, viewportOnce } from '@/animations/variants'
import { ProductCard } from './ProductCard'

export function Products() {
  const { t } = useI18n()
  const { data: products = [] } = useProducts()
  const featured = products.filter((p) => p.featured)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <Section id="products">
      <SectionHeading
        kicker={t('products.kicker')}
        title={t('products.title')}
        subtitle={t('products.subtitle')}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div
          ref={emblaRef}
          className="cursor-grab overflow-hidden active:cursor-grabbing"
        >
          <div className="-ml-6 flex touch-pan-y select-none">
            {featured.map((product) => (
              <div
                key={product.id}
                className="min-w-0 shrink-0 basis-[82%] pl-6 sm:basis-[46%] lg:basis-[31%]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="mt-10 flex items-center justify-between">
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            aria-label="Previous"
            className="rounded-full border-border bg-white text-foreground shadow-sm hover:bg-cream"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            aria-label="Next"
            className="rounded-full border-border bg-white text-foreground shadow-sm hover:bg-cream"
          >
            <ArrowRight className="size-4" />
          </Button>
        </div>
        <Button
          asChild
          variant="ghost"
          className="rounded-full text-primary hover:bg-cream hover:text-foreground"
        >
          <Link to="/products">
            {t('products.viewAll')}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </Section>
  )
}
