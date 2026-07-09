import { Helmet } from 'react-helmet-async'
import { useI18n } from '@/i18n'
import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { Products } from '@/components/sections/Products'
import { BestSellers } from '@/components/sections/BestSellers'
import { Brands } from '@/components/sections/Brands'
import { About } from '@/components/sections/About'
import { Branches } from '@/components/sections/Branches'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  const { t } = useI18n()

  return (
    <>
      <Helmet>
        <title>PERZON GALLERY — {t('hero.headline')}</title>
        <meta name="description" content={t('hero.subtitle')} />
      </Helmet>
      <Hero />
      <Marquee />
      <Products />
      <BestSellers />
      <Brands />
      <About />
      <Branches />
      <Contact />
    </>
  )
}
