import { motion } from 'framer-motion'
import { MapPin, Clock, Phone } from 'lucide-react'
import { Section, SectionHeading } from '@/components/layout/Section'
import { useI18n } from '@/i18n'
import { BRANCHES } from '@/constants/branches'
import { SITE } from '@/constants/site'
import { staggerContainer, fadeUp, viewportOnce } from '@/animations/variants'

export function Branches() {
  const { t } = useI18n()

  return (
    <Section id="branches" className="bg-secondary">
      <SectionHeading
        kicker={t('branches.kicker')}
        title={t('branches.title')}
        subtitle={t('branches.subtitle')}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2"
      >
        {BRANCHES.map((branch) => (
          <motion.div
            key={branch.id}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="glass-card p-8"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-accent/20 text-warm">
              <MapPin className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-2xl text-foreground">
              {branch.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {branch.addressLine}
            </p>
            <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Clock className="size-4 text-warm" />
                {branch.workingHours}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-4 text-warm" />
                <a
                  href={`tel:+${SITE.whatsappNumber}`}
                  className="transition-colors hover:text-primary"
                >
                  {SITE.phoneDisplay}
                </a>
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
