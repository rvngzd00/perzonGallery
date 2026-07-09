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
import { useCategoriesFull } from '@/hooks/admin/useCategoriesFull'
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/admin/useCategoryMutations'
import type { CategoryFull } from '@/lib/api/categories'
import type { ProductCategory } from '@/types/product'

const schema = z.object({
  id: z.string().min(1).max(40),
  name: z.string().min(1),
  sortOrder: z.coerce.number().int().min(0),
})
type FormInput = z.input<typeof schema>
type FormValues = z.output<typeof schema>

export default function AdminCategories() {
  const { data: categories, isLoading, isError } = useCategoriesFull()
  const [editing, setEditing] = useState<CategoryFull | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({ resolver: zodResolver(schema) })

  const openCreate = () => {
    setEditing(null)
    reset({ id: '', name: '', sortOrder: (categories?.length ?? 0) })
    setDialogOpen(true)
  }

  const openEdit = (category: CategoryFull) => {
    setEditing(category)
    reset(category)
    setDialogOpen(true)
  }

  const onSubmit = async (values: FormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        input: { name: values.name, sortOrder: values.sortOrder },
      })
    } else {
      await createMutation.mutateAsync({
        id: values.id as ProductCategory,
        name: values.name,
        sortOrder: values.sortOrder,
      })
    }
    setDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-medium">Categories</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Category' : 'New Category'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cat-id">ID (slug)</Label>
                <Input id="cat-id" disabled={!!editing} {...register('id')} />
                {errors.id && <p className="text-xs text-destructive">Required.</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cat-name">Name</Label>
                <Input id="cat-name" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">Required.</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cat-sort">Sort order</Label>
                <Input id="cat-sort" type="number" {...register('sortOrder')} />
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
      {isError && <p className="text-sm text-destructive">Failed to load categories.</p>}
      {!isLoading && categories?.length === 0 && (
        <p className="text-sm text-muted-foreground">No categories yet.</p>
      )}

      {categories && categories.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Sort order</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.sortOrder}</TableCell>
                <TableCell className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(category)}>
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
                        <AlertDialogTitle>Delete "{category.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This cannot be undone. Categories in use by products cannot be
                          deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(category.id)}
                        >
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
    </div>
  )
}
