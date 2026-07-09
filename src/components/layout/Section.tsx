import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp, viewportOnce } from '@/animations/variants'

interface SectionProps {
  id: string
  children: ReactNode
  className?: string
}

export function Section({ id, children, className }: SectionProps) {
  return (
    <section id={id} className={cn('section-pad relative', className)}>
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">{children}</div>
    </section>
  )
}

interface SectionHeadingProps {
  kicker: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn(
        'mb-14 max-w-2xl md:mb-20',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
      )}
    >
      <p className="mb-4 text-xs font-semibold tracking-[0.3em] text-warm uppercase">
        {kicker}
      </p>
      <h2 className="font-display text-4xl leading-tight font-medium text-foreground md:text-6xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
