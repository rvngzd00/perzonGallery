import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProduct } from '@/hooks/useProducts'
import { useBrands } from '@/hooks/useBrands'
import { useCategoriesFull } from '@/hooks/admin/useCategoriesFull'
import { useCreateProduct, useUpdateProduct } from '@/hooks/admin/useProductMutations'
import { uploadProductImage } from '@/lib/storage'
import type { ProductCategory, ProductGender } from '@/types/product'

const emptyToUndefined = (v: unknown) => (v === '' || v === undefined ? undefined : v)
const optionalNumber = (validator: z.ZodType<number, unknown>) =>
  z.preprocess(emptyToUndefined, validator.optional())

const mediaSchema = z.object({
  type: z.enum(['image', 'video']),
  url: z.string().min(1, 'Required'),
  sortOrder: z.coerce.number().int().min(0),
})

const sizeSchema = z.object({
  ml: z.coerce.number().int().positive(),
  priceAzn: z.coerce.number().min(0),
  oldPriceAzn: optionalNumber(z.coerce.number().min(0)),
})

const schema = z.object({
  id: z.string().min(1).max(80),
  name: z.string().min(1),
  brandId: z.string().min(1, 'Select a brand'),
  category: z.string().min(1, 'Select a category'),
  gender: z.enum(['men', 'women', 'unisex']),
  priceAzn: z.coerce.number().min(0),
  oldPriceAzn: optionalNumber(z.coerce.number().min(0)),
  tone: z.string().optional(),
  notes: z.string().optional(),
  rating: z.coerce.number().min(0).max(5),
  bestSeller: z.boolean(),
  featured: z.boolean(),
  marquee: z.boolean(),
  marqueeOrder: optionalNumber(z.coerce.number().int().min(0)),
  media: z.array(mediaSchema),
  sizes: z.array(sizeSchema),
})
type FormInput = z.input<typeof schema>
type FormValues = z.output<typeof schema>

const EMPTY_VALUES: FormInput = {
  id: '',
  name: '',
  brandId: '',
  category: '',
  gender: 'unisex',
  priceAzn: 0,
  oldPriceAzn: '',
  tone: 'from-[#f4e6d4] via-[#e2c9a8] to-[#c3a175]',
  notes: '',
  rating: 0,
  bestSeller: false,
  featured: false,
  marquee: false,
  marqueeOrder: '',
  media: [],
  sizes: [],
}

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(id)
  const { data: brands } = useBrands()
  const { data: categories } = useCategoriesFull()
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  })

  const mediaArray = useFieldArray({ control, name: 'media' })
  const sizesArray = useFieldArray({ control, name: 'sizes' })

  useEffect(() => {
    if (isEditing && product) {
      reset({
        id: product.id,
        name: product.name,
        brandId: product.brandId,
        category: product.category,
        gender: product.gender,
        priceAzn: product.priceAzn,
        oldPriceAzn: product.oldPriceAzn ?? '',
        tone: product.tone,
        notes: (product.notes ?? []).join(', '),
        rating: product.rating,
        bestSeller: product.bestSeller,
        featured: !!product.featured,
        marquee: product.marquee,
        marqueeOrder: product.marqueeOrder ?? '',
        media: product.media,
        sizes: product.sizes,
      })
    }
  }, [isEditing, product, reset])

  const handleFileUpload = async (index: number, file: File) => {
    setUploadingIndex(index)
    try {
      const url = await uploadProductImage(file)
      setValue(`media.${index}.url`, url)
      toast.success('Image uploaded')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploadingIndex(null)
    }
  }

  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      brandId: values.brandId,
      category: values.category as ProductCategory,
      gender: values.gender as ProductGender,
      priceAzn: values.priceAzn,
      oldPriceAzn: values.oldPriceAzn ?? null,
      tone: values.tone,
      notes: values.notes
        ? values.notes.split(',').map((n) => n.trim()).filter(Boolean)
        : [],
      rating: values.rating,
      bestSeller: values.bestSeller,
      featured: values.featured,
      marquee: values.marquee,
      marqueeOrder: values.marqueeOrder ?? null,
      media: values.media,
      sizes: values.sizes.map((s) => ({
        ml: s.ml,
        priceAzn: s.priceAzn,
        oldPriceAzn: s.oldPriceAzn,
      })),
    }

    if (isEditing && id) {
      await updateMutation.mutateAsync({ id, input })
    } else {
      await createMutation.mutateAsync({ id: values.id, ...input })
    }
    navigate('/admin/products')
  }

  if (isEditing && isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Link
        to="/admin/products"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Products
      </Link>

      <h1 className="font-heading text-2xl font-medium">
        {isEditing ? 'Edit Product' : 'New Product'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-id">ID (slug)</Label>
              <Input id="p-id" disabled={isEditing} {...register('id')} />
              {errors.id && <p className="text-xs text-destructive">Required.</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-name">Name</Label>
              <Input id="p-name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">Required.</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Brand</Label>
              <Controller
                control={control}
                name="brandId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands?.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.brandId && <p className="text-xs text-destructive">{errors.brandId.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Gender</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-rating">Rating (0–5)</Label>
              <Input id="p-rating" type="number" step="0.1" min={0} max={5} {...register('rating')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-price">Price (AZN)</Label>
              <Input id="p-price" type="number" step="0.01" {...register('priceAzn')} />
              {errors.priceAzn && <p className="text-xs text-destructive">Required.</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-old-price">Old price (AZN, optional)</Label>
              <Input id="p-old-price" type="number" step="0.01" {...register('oldPriceAzn')} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="p-tone">Tone (gradient classes)</Label>
              <Input id="p-tone" {...register('tone')} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <Label htmlFor="p-notes">Notes (comma-separated)</Label>
              <Textarea id="p-notes" rows={2} {...register('notes')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Flags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('bestSeller')} />
              Best seller
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('featured')} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('marquee')} />
              Marquee
            </label>
            {watch('marquee') && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="p-marquee-order">Marquee order</Label>
                <Input id="p-marquee-order" type="number" className="w-24" {...register('marqueeOrder')} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Size Variants</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {sizesArray.fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2">
                <div className="flex flex-col gap-1.5">
                  <Label>ml</Label>
                  <Input type="number" className="w-24" {...register(`sizes.${index}.ml`)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Price</Label>
                  <Input type="number" step="0.01" className="w-28" {...register(`sizes.${index}.priceAzn`)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Old price</Label>
                  <Input type="number" step="0.01" className="w-28" {...register(`sizes.${index}.oldPriceAzn`)} />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => sizesArray.remove(index)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => sizesArray.append({ ml: 50, priceAzn: 0, oldPriceAzn: '' })}
            >
              <Plus className="size-4" />
              Add size
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {mediaArray.fields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap items-end gap-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Type</Label>
                  <Controller
                    control={control}
                    name={`media.${index}.type`}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <Label>URL</Label>
                  <Input {...register(`media.${index}.url`)} placeholder="https://…" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Sort order</Label>
                  <Input type="number" className="w-24" {...register(`media.${index}.sortOrder`)} />
                </div>
                <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-input px-2.5 py-1.5 text-sm">
                  <Upload className="size-4" />
                  {uploadingIndex === index ? 'Uploading…' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(index, file)
                    }}
                  />
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => mediaArray.remove(index)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => mediaArray.append({ type: 'image', url: '', sortOrder: mediaArray.fields.length })}
            >
              <Plus className="size-4" />
              Add media
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
