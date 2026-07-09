import { useLocation } from 'react-router-dom'
import { MessageCircle, Phone, Clock } from 'lucide-react'
import { InstagramIcon, TikTokIcon } from '@/components/icons'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n'
import { NAV_ITEMS } from '@/constants/nav'
import { useBranches } from '@/hooks/useBranches'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { scrollToSection } from '@/lib/scrollToSection'

export function Footer() {
  const { t } = useI18n()
  const { data: branches = [] } = useBranches()
  const { data: site } = useSiteSettings()
  const { pathname } = useLocation()
  const isProductDetail = /^\/products\/[^/]+$/.test(pathname)

  return (
    <footer className="rounded-t-2xl bg-cocoa text-[#f3e6d8]">
      <div
        className={cn(
          'mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 lg:px-10',
          isProductDetail ? 'md:grid-cols-2' : 'md:grid-cols-4',
        )}
      >
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/Perzongallery.jpg"
              alt="PERZON GALLERY"
              className="size-10 rounded-full object-cover ring-1 ring-white/20"
            />
            <h3 className="font-display text-xl font-bold tracking-widest">
              PERZON <span className="text-primary">GALLERY</span>
            </h3>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#c9b39e]">
            {t('footer.tagline')}
          </p>
          {site && (
            <p className="mt-4 text-sm text-[#c9b39e]">
              @{site.instagram} · {site.followers}
            </p>
          )}
        </div>

        {/* Explore */}
        {!isProductDetail && (
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase">
              {t('footer.explore')}
            </h4>
            <div className="mt-4 flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.sectionId}
                  type="button"
                  onClick={() => scrollToSection(item.sectionId)}
                  className="w-fit text-sm text-[#c9b39e] transition-colors duration-200 hover:text-primary"
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Connect */}
        <div>
          <h4 className="text-xs font-semibold tracking-[0.15em] uppercase">
            {t('footer.connect')}
          </h4>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            {site && (
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-fit items-center gap-2 text-[#c9b39e] transition-colors duration-200 hover:text-primary"
              >
                <InstagramIcon className="size-4" />
                Instagram
              </a>
            )}
            {site && (
              <a
                href={site.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-fit items-center gap-2 text-[#c9b39e] transition-colors duration-200 hover:text-primary"
              >
                <TikTokIcon className="size-4" />
                TikTok
              </a>
            )}
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="flex w-fit items-center gap-2 text-[#c9b39e] transition-colors duration-200 hover:text-primary"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Support / contact */}
        {!isProductDetail && site && (
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase">
              {t('footer.support')}
            </h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-[#c9b39e]">
              <a
                href={`tel:+${site.whatsappNumber}`}
                className="flex w-fit items-center gap-2 transition-colors hover:text-primary"
              >
                <Phone className="size-4 text-primary" />
                {site.phoneDisplay}
              </a>
              <p className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                {site.workingHours}
              </p>
              {branches.map((b) => (
                <p key={b.id}>
                  <span className="text-[#f3e6d8]">{b.name}</span>
                  <br />
                  {b.addressLine}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs font-semibold tracking-[0.15em] text-[#c9b39e] uppercase">
        © {new Date().getFullYear()} {site?.name ?? 'PERZON GALLERY'}.{' '}
        {t('footer.rights')}
      </div>
    </footer>
  )
}
