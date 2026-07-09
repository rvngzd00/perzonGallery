import { motion } from 'framer-motion'
import { Section, SectionHeading } from '@/components/layout/Section'
import { useI18n } from '@/i18n'
import { useBrands } from '@/hooks/useBrands'
import { staggerContainer, viewportOnce } from '@/animations/variants'
import { BrandCard } from './BrandCard'

export function Brands() {
  const { t } = useI18n()
  const { data: brands = [] } = useBrands()

  return (
    <Section id="brands" className="bg-secondary">
      <SectionHeading
        kicker={t('brands.kicker')}
        title={t('brands.title')}
        subtitle={t('brands.subtitle')}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </motion.div>
    </Section>
  )
}
