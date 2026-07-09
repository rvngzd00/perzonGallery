import { Fragment } from 'react'
import { cn } from '@/lib/utils'
import { useI18n, type Locale } from '@/i18n'

const LOCALES: Locale[] = ['az', 'ru']

/** Stitch style: plain "AZ | RU" text toggle */
export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  return (
    <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase">
      {LOCALES.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && <span className="text-muted-foreground/50">|</span>}
          <button
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={locale === l}
            className={cn(
              'transition-colors duration-300',
              locale === l
                ? 'text-warm'
                : 'text-muted-foreground hover:text-warm',
            )}
          >
            {l}
          </button>
        </Fragment>
      ))}
    </div>
  )
}
