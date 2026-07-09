import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EASE_LUXE } from '@/animations/variants'
import type { Product } from '@/types/product'
import bottleSole from '@/assets/images/bottle-sole.svg'

/** Fallback single "podium" slide, used when a product has no real media yet. */
function PlaceholderSlide({ product }: { product: Product }) {
  return (
    <div
      className={cn(
        'relative flex aspect-square min-w-0 shrink-0 grow-0 basis-full items-end justify-center overflow-hidden bg-gradient-to-br',
        product.tone,
      )}
    >
      <div aria-hidden className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="mx-auto h-6 w-64 rounded-[50%] bg-white/45 shadow" />
        <div className="mx-auto -mt-1.5 h-6 w-52 rounded-[50%] bg-white/35" />
      </div>
      <motion.img
        src={bottleSole}
        alt={product.name}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative bottom-12 h-[72%] w-auto drop-shadow-[0_28px_44px_rgba(90,45,0,0.35)]"
      />
    </div>
  )
}

export function ProductGallery({ product }: { product: Product }) {
  const slides = [...product.media].sort((a, b) => a.sortOrder - b.sortOrder)
  const hasMedia = slides.length > 0

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const slideCount = hasMedia ? slides.length : 1

  const onSelect = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: EASE_LUXE }}
      className="relative overflow-hidden rounded-2xl shadow-[0_24px_60px_-24px_rgba(42,23,8,0.3)]"
    >
      <div
        ref={emblaRef}
        className="cursor-grab overflow-hidden active:cursor-grabbing"
        data-testid="product-gallery"
      >
        <div className="flex touch-pan-y select-none">
          {hasMedia ? (
            slides.map((media, i) => (
              <div
                key={i}
                className={cn(
                  'relative flex aspect-square min-w-0 shrink-0 grow-0 basis-full items-center justify-center overflow-hidden bg-gradient-to-br',
                  product.tone,
                )}
              >
                {media.type === 'video' ? (
                  <video
                    src={media.url}
                    controls
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={media.url}
                    alt={`${product.name} ${i + 1}`}
                    draggable={false}
                    className="h-[72%] w-auto drop-shadow-[0_28px_44px_rgba(90,45,0,0.35)]"
                  />
                )}
              </div>
            ))
          ) : (
            <PlaceholderSlide product={product} />
          )}
        </div>
      </div>

      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous"
            className="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-foreground shadow-md transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next"
            className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-foreground shadow-md transition-colors hover:text-primary"
          >
            <ArrowRight className="size-4" />
          </button>
        </>
      )}

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {Array.from({ length: slideCount }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            data-testid="gallery-dot"
            onClick={() => scrollTo(i)}
            className={cn(
              'size-2 rounded-full transition-colors',
              i === selectedIndex ? 'bg-primary' : 'bg-white/70',
            )}
          />
        ))}
      </div>
    </motion.div>
  )
}
