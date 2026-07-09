import { useQuery } from '@tanstack/react-query'
import { fetchContactMessages, type ContactMessage } from '@/lib/api/contactMessages'

export function useContactMessages() {
  return useQuery<ContactMessage[]>({
    queryKey: ['admin', 'contact-messages'],
    queryFn: fetchContactMessages,
  })
}
