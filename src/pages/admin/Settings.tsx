import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useUpdateSiteSettings } from '@/hooks/admin/useSiteSettingsMutation'
import type { SiteSettings } from '@/types/siteSettings'

const FIELDS: { key: keyof SiteSettings; label: string }[] = [
  { key: 'name', label: 'Site Name' },
  { key: 'phoneDisplay', label: 'Phone (display)' },
  { key: 'whatsappNumber', label: 'WhatsApp Number' },
  { key: 'instagram', label: 'Instagram Handle' },
  { key: 'instagramUrl', label: 'Instagram URL' },
  { key: 'tiktokUrl', label: 'TikTok URL' },
  { key: 'followers', label: 'Followers (display)' },
  { key: 'followersCount', label: 'Followers Count' },
  { key: 'posts', label: 'Posts (display)' },
  { key: 'workingHours', label: 'Working Hours' },
]

export default function AdminSettings() {
  const { data: settings, isLoading } = useSiteSettings()
  const updateMutation = useUpdateSiteSettings()
  const { register, handleSubmit, reset } = useForm<SiteSettings>()

  useEffect(() => {
    if (settings) reset(settings)
  }, [settings, reset])

  const onSubmit = (values: SiteSettings) => {
    updateMutation.mutate({
      ...values,
      followersCount: Number(values.followersCount),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-medium">Site Settings</h1>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <Card className="max-w-2xl">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {FIELDS.map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <Label htmlFor={`settings-${key}`}>{label}</Label>
                  <Input
                    id={`settings-${key}`}
                    type={key === 'followersCount' ? 'number' : 'text'}
                    {...register(key)}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <Button type="submit" disabled={updateMutation.isPending}>
                  Save Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
