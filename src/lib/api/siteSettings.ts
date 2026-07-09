import { apiClient } from '@/lib/api/client'
import type { SiteSettings } from '@/types/siteSettings'

type SiteSettingsRecord = SiteSettings & { id: string }

const SETTINGS_ID = 'main'

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { id: _id, ...settings } = await apiClient.get<SiteSettingsRecord>(
    'siteSettings',
    SETTINGS_ID,
  )
  return settings
}

export async function updateSiteSettings(
  patch: Partial<SiteSettings>,
): Promise<void> {
  await apiClient.patch<SiteSettingsRecord>('siteSettings', SETTINGS_ID, patch)
}
