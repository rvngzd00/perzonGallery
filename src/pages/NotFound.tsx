import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n'

export default function NotFound() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <Helmet>
        <title>404 — PERZON GALLERY</title>
      </Helmet>
      <p className="font-display text-8xl text-warm">404</p>
      <h1 className="font-display text-3xl text-foreground md:text-4xl">
        {t('notfound.title')}
      </h1>
      <p className="max-w-md text-muted-foreground">{t('notfound.text')}</p>
      <Button asChild size="lg" className="rounded-full px-8">
        <Link to="/">{t('notfound.back')}</Link>
      </Button>
    </div>
  )
}
