import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useContactMessages } from '@/hooks/admin/useContactMessages'
import {
  useDeleteContactMessage,
  useMarkContactMessageRead,
} from '@/hooks/admin/useContactMessageMutations'
import type { ContactMessage } from '@/lib/api/contactMessages'

export default function AdminMessages() {
  const { data: messages, isLoading, isError } = useContactMessages()
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const markRead = useMarkContactMessageRead()
  const deleteMutation = useDeleteContactMessage()

  const openMessage = (message: ContactMessage) => {
    setSelected(message)
    if (!message.isRead) markRead.mutate(message.id)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-medium">Contact Messages</h1>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {isError && <p className="text-sm text-destructive">Failed to load messages.</p>}
      {!isLoading && messages?.length === 0 && (
        <p className="text-sm text-muted-foreground">No messages yet.</p>
      )}

      {messages && messages.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow
                key={message.id}
                className="cursor-pointer"
                onClick={() => openMessage(message)}
              >
                <TableCell>
                  <Badge variant={message.isRead ? 'outline' : 'default'}>
                    {message.isRead ? 'Read' : 'Unread'}
                  </Badge>
                </TableCell>
                <TableCell>{message.name}</TableCell>
                <TableCell>{message.phone}</TableCell>
                <TableCell className="max-w-72 truncate">{message.message}</TableCell>
                <TableCell>{new Date(message.createdAt).toLocaleDateString()}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                        <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(message.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{selected?.phone}</p>
          <p className="text-sm whitespace-pre-wrap">{selected?.message}</p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
