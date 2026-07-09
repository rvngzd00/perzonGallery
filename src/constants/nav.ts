import type { TranslationKey } from '@/i18n'

export interface NavItem {
  labelKey: TranslationKey
  /** Section id on the home page */
  sectionId: string
  /** Standalone route, when one exists */
  route?: string
}

export const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.home', sectionId: 'hero' },
  { labelKey: 'nav.products', sectionId: 'products', route: '/products' },
  { labelKey: 'nav.brands', sectionId: 'brands' },
  { labelKey: 'nav.about', sectionId: 'about' },
  { labelKey: 'nav.branches', sectionId: 'branches' },
  { labelKey: 'nav.contact', sectionId: 'contact' },
]
