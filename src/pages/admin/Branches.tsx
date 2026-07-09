import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useBranches } from '@/hooks/useBranches'
import {
  useCreateBranch,
  useDeleteBranch,
  useUpdateBranch,
} from '@/hooks/admin/useBranchMutations'
import type { Branch } from '@/types/branch'

const schema = z.object({
  id: z.string().min(1).max(60),
  name: z.string().min(1),
  addressLine: z.string().min(1),
  workingHours: z.string().min(1),
  mapUrl: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

export default function AdminBranches() {
  const { data: branches, isLoading, isError } = useBranches()
  const [editing, setEditing] = useState<Branch | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const createMutation = useCreateBranch()
  const updateMutation = useUpdateBranch()
  const deleteMutation = useDeleteBranch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const openCreate = () => {
    setEditing(null)
    reset({ id: '', name: '', addressLine: '', workingHours: '', mapUrl: '' })
    setDialogOpen(true)
  }

  const openEdit = (branch: Branch) => {
    setEditing(branch)
    reset({ ...branch, mapUrl: branch.mapUrl ?? '' })
    setDialogOpen(true)
  }

  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      addressLine: values.addressLine,
      workingHours: values.workingHours,
      mapUrl: values.mapUrl || undefined,
    }
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, input })
    } else {
      await createMutation.mutateAsync({ id: values.id, ...input })
    }
    setDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-medium">Branches</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              New Branch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Branch' : 'New Branch'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="branch-id">ID (slug)</Label>
                <Input id="branch-id" disabled={!!editing} {...register('id')} />
                {errors.id && <p className="text-xs text-destructive">Required.</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="branch-name">Name</Label>
                <Input id="branch-name" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">Required.</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="branch-address">Address</Label>
                <Input id="branch-address" {...register('addressLine')} />
                {errors.addressLine && <p className="text-xs text-destructive">Required.</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="branch-hours">Working hours</Label>
                <Input id="branch-hours" {...register('workingHours')} />
                {errors.workingHours && <p className="text-xs text-destructive">Required.</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="branch-map">Map URL</Label>
                <Input id="branch-map" {...register('mapUrl')} />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {isError && <p className="text-sm text-destructive">Failed to load branches.</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches?.map((branch) => (
            <TableRow key={branch.id}>
              <TableCell>{branch.name}</TableCell>
              <TableCell>{branch.addressLine}</TableCell>
              <TableCell>{branch.workingHours}</TableCell>
              <TableCell className="flex justify-end gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => openEdit(branch)}>
                  <Pencil className="size-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{branch.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(branch.id)}>
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
    </div>
  )
}
