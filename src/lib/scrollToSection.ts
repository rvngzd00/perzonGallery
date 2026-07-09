import { getLenis } from '@/hooks/useLenis'

export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(el, { offset: -72 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
