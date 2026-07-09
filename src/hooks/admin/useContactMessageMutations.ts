import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteContactMessage, markContactMessageRead } from '@/lib/api/contactMessages'

export function useMarkContactMessageRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => markContactMessageRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contact-messages'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteContactMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contact-messages'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Message deleted')
    },
    onError: (error: Error) => toast.error(error.message),
  })
}
