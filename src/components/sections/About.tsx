import { motion } from 'framer-motion'
import { ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { InstagramIcon } from '@/components/icons'
import { Section, SectionHeading } from '@/components/layout/Section'
import { useI18n } from '@/i18n'
import { SITE } from '@/constants/site'
import { staggerContainer, fadeUp, viewportOnce } from '@/animations/variants'

export function About() {
  const { t } = useI18n()

  const points = [
    {
      icon: ShieldCheck,
      title: t('about.point1.title'),
      text: t('about.point1.text'),
    },
    {
      icon: Sparkles,
      title: t('about.point2.title'),
      text: t('about.point2.text'),
    },
    {
      icon: Truck,
      title: t('about.point3.title'),
      text: t('about.point3.text'),
    },
  ]

  return (
    <Section id="about">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            kicker={t('about.kicker')}
            title={t('about.title')}
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="-mt-8 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            <motion.p variants={fadeUp}>{t('about.p1')}</motion.p>
            <motion.p variants={fadeUp}>{t('about.p2')}</motion.p>
            <motion.a
              variants={fadeUp}
              href={SITE.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-primary transition-colors hover:text-foreground"
            >
              <InstagramIcon className="size-4" />@{SITE.instagram} ·{' '}
              {SITE.followers}
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-4"
        >
          {points.map((point) => (
            <motion.div
              key={point.title}
              variants={fadeUp}
              className="glass-card flex items-start gap-4 p-6"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/20 text-warm">
                <point.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-xl text-foreground">
                  {point.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {point.text}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
