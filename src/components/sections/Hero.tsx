import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Star, ArrowRight, Crown, Timer, PackageCheck } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { useI18n } from '@/i18n'
import { scrollToSection } from '@/lib/scrollToSection'
import { staggerContainer, staggerWord, EASE_LUXE } from '@/animations/variants'
import bottleSole from '@/assets/images/bottle-sole.svg'

function OrangeSlice({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden>
      <circle cx="40" cy="40" r="38" fill="#f59422" />
      <circle cx="40" cy="40" r="32" fill="#ffcf8a" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4
        return (
          <path
            key={i}
            d={`M40 40 L${40 + 29 * Math.cos(a - 0.32)} ${40 + 29 * Math.sin(a - 0.32)} A29 29 0 0 1 ${40 + 29 * Math.cos(a + 0.32)} ${40 + 29 * Math.sin(a + 0.32)} Z`}
            fill="#f7a63e"
          />
        )
      })}
      <circle cx="40" cy="40" r="4" fill="#ffcf8a" />
    </svg>
  )
}

function Blossom({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i * 2 * Math.PI) / 5 - Math.PI / 2
        return (
          <ellipse
            key={i}
            cx={30 + 13 * Math.cos(a)}
            cy={30 + 13 * Math.sin(a)}
            rx="10"
            ry="13"
            fill="#fff7ee"
            transform={`rotate(${(a * 180) / Math.PI + 90} ${30 + 13 * Math.cos(a)} ${30 + 13 * Math.sin(a)})`}
          />
        )
      })}
      <circle cx="30" cy="30" r="6" fill="#f5b73f" />
    </svg>
  )
}

export function Hero() {
  const { t } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        opacity: 0.25,
        y: -50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const headlineWords = t('hero.headline').split(' ')
  const trust = [
    { icon: Crown, label: t('trust.quality') },
    { icon: Timer, label: t('trust.lasting') },
    { icon: PackageCheck, label: t('trust.packaging') },
  ]

  return (
    <section id="hero" ref={sectionRef} className="relative pt-28 pb-4 md:pt-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div
          ref={contentRef}
          className="hero-panel relative overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgba(233,108,0,0.55)]"
        >
          <div className="relative z-10 grid grid-cols-1 items-center gap-8 px-7 pt-12 pb-8 md:grid-cols-2 md:px-14 md:pt-16 lg:min-h-135">
            {/* ── Left: copy ── */}
            <div className="max-w-xl">
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE_LUXE }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90"
              >
                <Star className="size-4 fill-white text-white" />
                {t('hero.exclusive')}
              </motion.span>

              <motion.h1
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="mt-4 font-display text-5xl leading-[1.08] font-medium text-white md:text-6xl lg:text-7xl"
              >
                {headlineWords.map((word, i) => (
                  <span key={`${word}-${i}`}>
                    {i > 0 && ' '}
                    <motion.span variants={staggerWord} className="inline-block">
                      {word}
                    </motion.span>
                  </span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.7, ease: EASE_LUXE }}
                className="mt-5 max-w-sm text-base leading-relaxed text-white/85 md:text-lg"
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.button
                type="button"
                onClick={() => scrollToSection('products')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.9, ease: EASE_LUXE }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-cocoa px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-shadow hover:shadow-xl"
              >
                {t('hero.cta.explore')}
                <ArrowRight className="size-4" />
              </motion.button>
            </div>

            {/* ── Right: bottle on podium with arch ── */}
            <div className="relative mx-auto flex h-85 w-full max-w-md items-end justify-center md:h-110">
              {/* arch */}
              <div
                aria-hidden
                className="absolute bottom-0 left-1/2 h-[92%] w-[78%] -translate-x-1/2 rounded-t-full bg-white/12"
              />
              {/* podium */}
              <div
                aria-hidden
                className="absolute bottom-2 left-1/2 -translate-x-1/2"
              >
                <div className="mx-auto h-5 w-56 rounded-[50%] bg-[#e9b475] shadow-md" />
                <div className="mx-auto -mt-1 h-5 w-48 rounded-[50%] bg-[#dfa257]" />
                <div className="mx-auto -mt-1 h-5 w-40 rounded-[50%] bg-[#d0913f]" />
              </div>
              {/* decorations */}
              <OrangeSlice className="absolute bottom-6 left-2 w-16 rotate-[-14deg] md:w-20" />
              <OrangeSlice className="absolute right-4 bottom-16 w-10 rotate-22" />
              <Blossom className="absolute bottom-24 left-12 w-9" />
              <Blossom className="absolute right-10 bottom-4 w-11" />
              {/* bottle */}
              <motion.img
                src={bottleSole}
                alt=""
                aria-hidden
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: [0, -10, 0] }}
                transition={{
                  opacity: { duration: 1.2, delay: 0.4, ease: EASE_LUXE },
                  y: {
                    duration: 5.5,
                    delay: 1.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
                className="relative bottom-6 h-[86%] w-auto drop-shadow-[0_30px_50px_rgba(120,55,0,0.45)]"
              />
            </div>
          </div>

          {/* ── Trust strip (mock's cream bottom row) ── */}
          <div className="relative z-10 border-t border-white/20 bg-cream/95">
            <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {trust.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-center gap-3 px-4 py-4"
                >
                  <item.icon className="size-5 text-primary" strokeWidth={1.5} />
                  <span className="text-xs font-semibold tracking-wide text-foreground/80">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
