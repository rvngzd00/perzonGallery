import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateSiteSettings } from '@/lib/api/siteSettings'
import type { SiteSettings } from '@/types/siteSettings'

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (patch: Partial<SiteSettings>) => updateSiteSettings(patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] })
      toast.success('Settings saved')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}
