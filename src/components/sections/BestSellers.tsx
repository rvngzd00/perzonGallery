import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Section, SectionHeading } from '@/components/layout/Section'
import { useI18n } from '@/i18n'
import { useProducts } from '@/hooks/useProducts'
import { staggerContainer, viewportOnce } from '@/animations/variants'
import { ProductCard } from './ProductCard'

export function BestSellers() {
  const { t } = useI18n()
  const { data: products = [] } = useProducts()
  const bestSellers = products.filter((p) => p.bestSeller && p.rating === 5)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (bestSellers.length === 0) return null

  return (
    <Section id="bestsellers">
      <SectionHeading
        kicker={t('bestsellers.kicker')}
        title={t('bestsellers.title')}
        subtitle={t('bestsellers.subtitle')}
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
            {bestSellers.map((product) => (
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

      <div className="mt-10 flex gap-3">
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
    </Section>
  )
}
