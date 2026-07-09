import { Link, useLocation } from 'react-router-dom'
import { Home, Store, Heart, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n'
import { useShop } from '@/context/ShopContext'
import { buildWhatsAppLink } from '@/lib/whatsapp'

/** Fixed bottom bar on mobile, mirroring the mock's app navigation. */
export function MobileBottomNav() {
  const { t } = useI18n()
  const { wishlist } = useShop()
  const { pathname } = useLocation()

  const itemCls = (active: boolean) =>
    cn(
      'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold transition-colors',
      active ? 'text-primary' : 'text-muted-foreground',
    )

  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 rounded-full border border-border bg-white/95 shadow-[0_10px_30px_-8px_rgba(42,23,8,0.25)] backdrop-blur-md md:hidden">
      <div className="flex items-stretch px-2">
        <Link to="/" className={itemCls(pathname === '/')}>
          <Home className="size-5" />
          {t('nav.home')}
        </Link>
        <Link
          to="/products"
          className={itemCls(pathname.startsWith('/products'))}
        >
          <Store className="size-5" />
          {t('nav.products')}
        </Link>
        <Link to="/wishlist" className={itemCls(pathname === '/wishlist')}>
          <span className="relative">
            <Heart className="size-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </span>
          {t('shop.wishlist')}
        </Link>
        <a
          href={buildWhatsAppLink(t('wa.general'))}
          target="_blank"
          rel="noreferrer"
          className={itemCls(false)}
        >
          <MessageCircle className="size-5" />
          {t('nav.whatsapp')}
        </a>
      </div>
    </nav>
  )
}
