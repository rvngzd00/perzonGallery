import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, Menu, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n'
import { useShop } from '@/context/ShopContext'
import { NAV_ITEMS, type NavItem } from '@/constants/nav'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { scrollToSection } from '@/lib/scrollToSection'
import { LanguageSwitcher } from './LanguageSwitcher'
import { CartSheet } from './CartSheet'

export function Navbar() {
  const { t } = useI18n()
  const { wishlist } = useShop()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goToSection = (sectionId: string) => {
    setMobileOpen(false)
    if (pathname !== '/') {
      navigate('/')
      // let the home page mount before scrolling
      setTimeout(() => scrollToSection(sectionId), 350)
    } else {
      scrollToSection(sectionId)
    }
  }

  const handleNavClick = (item: NavItem) => {
    setMobileOpen(false)
    if (item.route) {
      navigate(item.route)
      return
    }
    goToSection(item.sectionId)
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-border bg-background/85 shadow-sm backdrop-blur-xl'
          : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => goToSection('hero')}
          className="group flex items-center gap-2.5"
        >
          <img
            src="/Perzongallery.jpg"
            alt="PERZON GALLERY"
            className="size-9 rounded-full object-cover ring-1 ring-border md:size-10"
          />
          <motion.span
            whileHover={{ opacity: 0.75 }}
            transition={{ duration: 0.2 }}
            className="font-display text-base font-bold tracking-widest text-foreground sm:text-lg md:text-xl"
          >
            PERZON <span className="hidden text-primary sm:inline">GALLERY</span>
          </motion.span>
        </Link>

        {/* Desktop menu */}
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.sectionId}>
              <button
                type="button"
                onClick={() => handleNavClick(item)}
                className="text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-primary"
              >
                {t(item.labelKey)}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label={t('shop.wishlist')}
            className="relative hidden size-10 items-center justify-center rounded-full bg-white text-foreground shadow-md transition-transform hover:scale-105 hover:text-primary md:flex"
          >
            <Heart className="size-4.5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <CartSheet />

          <Button
            asChild
            className="hidden rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-md hover:bg-[#d05f08] lg:inline-flex"
          >
            <a
              href={buildWhatsAppLink(t('wa.general'))}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-4" />
              {t('nav.whatsapp')}
            </a>
          </Button>

          {/* Mobile menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Menu"
                  className="text-foreground"
                >
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-72 border-border bg-background"
              >
                <SheetTitle className="px-4 pt-6 font-display text-lg text-foreground">
                  PERZON <span className="text-primary">GALLERY</span>
                </SheetTitle>
                <ul className="mt-4 flex flex-col gap-1 px-2">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.sectionId}>
                      <button
                        type="button"
                        onClick={() => handleNavClick(item)}
                        className="w-full rounded-xl px-4 py-3 text-left text-base text-muted-foreground transition-colors hover:bg-cream hover:text-foreground"
                      >
                        {t(item.labelKey)}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 px-4">
                  <Button
                    asChild
                    className="w-full rounded-full bg-primary text-white hover:bg-[#d05f08]"
                  >
                    <a
                      href={buildWhatsAppLink(t('wa.general'))}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="size-4" />
                      {t('nav.whatsapp')}
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
