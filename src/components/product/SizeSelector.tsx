import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n'
import type { ProductSizeVariant } from '@/types/product'

interface SizeSelectorProps {
  sizes: ProductSizeVariant[]
  selected: ProductSizeVariant | null
  onSelect: (size: ProductSizeVariant) => void
}

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  const { t } = useI18n()
  if (sizes.length === 0) return null

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-muted-foreground">
        {t('products.size')}
      </p>
      <div className="flex flex-wrap gap-2" data-testid="size-selector">
        {sizes.map((size) => {
          const active = selected?.ml === size.ml
          return (
            <button
              key={size.ml}
              type="button"
              aria-pressed={active}
              data-testid="size-pill"
              onClick={() => onSelect(size)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300',
                active
                  ? 'border-primary bg-primary text-white shadow-md'
                  : 'border-border bg-white text-foreground hover:border-primary/50',
              )}
            >
              {size.ml} ml
            </button>
          )
        })}
      </div>
    </div>
  )
}
