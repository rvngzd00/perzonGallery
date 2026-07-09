import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n'
import { useProductsMap } from '@/hooks/useProductsMap'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'
import { fadeUp } from '@/animations/variants'
import type { Brand } from '@/types/brand'
import bottleSole from '@/assets/images/bottle-sole.svg'

export function BrandCard({ brand }: { brand: Brand }) {
  const { t } = useI18n()
  const isTouch = useIsTouchDevice()
  const productsMap = useProductsMap()
  const [revealed, setRevealed] = useState(false)

  const flagship = brand.flagshipProductId
    ? productsMap.get(brand.flagshipProductId)
    : undefined

  const handleTap = () => {
    if (isTouch && flagship) setRevealed((r) => !r)
  }

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      onMouseEnter={() => !isTouch && setRevealed(true)}
      onMouseLeave={() => !isTouch && setRevealed(false)}
      onClick={handleTap}
      data-testid="brand-card"
      className="glass-card relative flex flex-col items-center justify-center gap-2 overflow-hidden px-6 py-10 text-center"
    >
      <span className="font-display text-2xl text-foreground">
        {brand.name}
      </span>
      <span className="text-[10px] font-semibold tracking-[0.3em] text-primary uppercase">
        {brand.origin}
      </span>
      {brand.tagline && (
        <span className="text-xs text-muted-foreground italic">
          {brand.tagline}
        </span>
      )}

      <AnimatePresence>
        {revealed && flagship && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            data-testid="brand-flagship-reveal"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-cream/97 p-5"
          >
            <div
              className={cn(
                'flex size-16 items-end justify-center overflow-hidden rounded-full bg-gradient-to-br',
                flagship.tone,
              )}
            >
              <img
                src={flagship.media.find((m) => m.type === 'image')?.url ?? bottleSole}
                alt={flagship.name}
                className="h-[85%] w-auto"
              />
            </div>
            <p className="font-display text-base text-foreground">
              {flagship.name}
            </p>
            <Link
              to={`/products/${flagship.id}`}
              className="mt-1 flex items-center gap-1 text-xs font-semibold text-primary hover:text-foreground"
            >
              {t('brands.viewProduct')}
              <ArrowRight className="size-3" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
