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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { useBrands } from '@/hooks/useBrands'
import { useProducts } from '@/hooks/useProducts'
import { useCreateBrand, useDeleteBrand, useUpdateBrand } from '@/hooks/admin/useBrandMutations'
import type { Brand } from '@/types/brand'

const schema = z.object({
  id: z.string().min(1).max(60),
  name: z.string().min(1),
  origin: z.string().min(1),
  tagline: z.string().optional(),
  flagshipProductId: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

export default function AdminBrands() {
  const { data: brands, isLoading, isError } = useBrands()
  const { data: products } = useProducts()
  const [editing, setEditing] = useState<Brand | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const createMutation = useCreateBrand()
  const updateMutation = useUpdateBrand()
  const deleteMutation = useDeleteBrand()

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  const openCreate = () => {
    setEditing(null)
    reset({ id: '', name: '', origin: '', tagline: '', flagshipProductId: '' })
    setDialogOpen(true)
  }

  const openEdit = (brand: Brand) => {
    setEditing(brand)
    reset({
      id: brand.id,
      name: brand.name,
      origin: brand.origin,
      tagline: brand.tagline ?? '',
      flagshipProductId: brand.flagshipProductId ?? '',
    })
    setDialogOpen(true)
  }

  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      origin: values.origin,
      tagline: values.tagline || undefined,
      flagshipProductId: values.flagshipProductId || undefined,
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
        <h1 className="font-heading text-2xl font-medium">Brands</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              New Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Brand' : 'New Brand'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="brand-id">ID (slug)</Label>
                <Input id="brand-id" disabled={!!editing} {...register('id')} />
                {errors.id && <p className="text-xs text-destructive">Required.</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="brand-name">Name</Label>
                <Input id="brand-name" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">Required.</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="brand-origin">Origin</Label>
                <Input id="brand-origin" {...register('origin')} />
                {errors.origin && <p className="text-xs text-destructive">Required.</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="brand-tagline">Tagline</Label>
                <Input id="brand-tagline" {...register('tagline')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Flagship product</Label>
                <Select
                  value={watch('flagshipProductId') || undefined}
                  onValueChange={(v) => setValue('flagshipProductId', v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {products?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
      {isError && <p className="text-sm text-destructive">Failed to load brands.</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Tagline</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands?.map((brand) => (
            <TableRow key={brand.id}>
              <TableCell>{brand.name}</TableCell>
              <TableCell>{brand.origin}</TableCell>
              <TableCell className="max-w-64 truncate">{brand.tagline}</TableCell>
              <TableCell className="flex justify-end gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => openEdit(brand)}>
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
                      <AlertDialogTitle>Delete "{brand.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This cannot be undone. Brands referenced by products cannot be
                        deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(brand.id)}>
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
