import { apiClient } from '@/lib/api/client'

export interface CreateContactMessageInput {
  name: string
  phone: string
  message: string
}

export interface ContactMessage {
  id: string
  name: string
  phone: string
  message: string
  isRead: boolean
  createdAt: string
}

export async function createContactMessage(
  input: CreateContactMessageInput,
): Promise<void> {
  await apiClient.post<ContactMessage>('contactMessages', {
    id: crypto.randomUUID(),
    ...input,
    isRead: false,
    createdAt: new Date().toISOString(),
  })
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const messages = await apiClient.get<ContactMessage[]>('contactMessages')
  return [...messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function markContactMessageRead(id: string): Promise<void> {
  await apiClient.patch<ContactMessage>('contactMessages', id, { isRead: true })
}

export async function deleteContactMessage(id: string): Promise<void> {
  await apiClient.delete('contactMessages', id)
}
