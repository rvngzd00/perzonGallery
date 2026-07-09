import { useQuery } from '@tanstack/react-query'
import { fetchSiteSettings } from '@/lib/api/siteSettings'
import { SITE } from '@/constants/site'
import type { SiteSettings } from '@/types/siteSettings'

export function useSiteSettings() {
  return useQuery<SiteSettings>({
    queryKey: ['site-settings'],
    queryFn: fetchSiteSettings,
    initialData: SITE,
    initialDataUpdatedAt: 0,
  })
}
