import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n'
import { useShop } from '@/context/ShopContext'
import { useCartPricing } from '@/hooks/useCartPricing'
import { formatPrice } from '@/utils/formatPrice'
import { buildWhatsAppLink, buildCartMessage } from '@/lib/whatsapp'
import { createOrder } from '@/lib/api/orders'
import bottleSole from '@/assets/images/bottle-sole.svg'

export function CartSheet({ triggerClassName }: { triggerClassName?: string }) {
  const { t } = useI18n()
  const { cartCount, setQty, removeFromCart, isCartOpen, setCartOpen } = useShop()
  const { lines, total } = useCartPricing()

  const checkoutHref = buildWhatsAppLink(
    buildCartMessage(lines, total, t('wa.cartIntro')),
  )

  const handleCheckoutClick = () => {
    // Fire-and-forget: persists a real order record alongside the WhatsApp
    // deep link, without blocking or delaying the redirect on failure.
    createOrder({ lines, total }).catch((err) => {
      console.error('Failed to persist order:', err)
    })
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={t('shop.cart')}
          data-testid="cart-trigger"
          className={cn(
            'relative flex size-10 items-center justify-center rounded-full bg-cocoa text-white shadow-md transition-transform hover:scale-105',
            triggerClassName,
          )}
        >
          <ShoppingBag className="size-4.5" />
          {cartCount > 0 && (
            <span
              data-testid="cart-count"
              className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white"
            >
              {cartCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col border-border bg-background sm:w-96">
        <SheetTitle className="px-4 pt-6 font-display text-2xl text-foreground">
          {t('shop.cart')}
        </SheetTitle>

        {lines.length === 0 ? (
          <p className="px-4 py-10 text-sm text-muted-foreground">
            {t('shop.cart.empty')}
          </p>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {lines.map(({ item, product, lineTotal }) => (
                <div
                  key={`${item.id}-${item.sizeMl ?? 'base'}`}
                  className="glass-card flex items-center gap-3 rounded-xl! p-3"
                >
                  <div
                    className={cn(
                      'flex size-16 shrink-0 items-end justify-center overflow-hidden rounded-lg bg-gradient-to-br',
                      product.tone,
                    )}
                  >
                    <img src={bottleSole} alt="" className="h-[80%] w-auto" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {product.name}
                      {item.sizeMl && (
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          ({item.sizeMl} ml)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.brand}
                    </p>
                    <p className="mt-1 text-sm font-bold text-foreground">
                      {formatPrice(lineTotal)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      aria-label="Remove"
                      onClick={() => removeFromCart(item.id, item.sizeMl)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    <div className="flex items-center gap-1 rounded-full border border-border bg-white p-0.5">
                      <button
                        type="button"
                        aria-label="−"
                        onClick={() =>
                          setQty(item.id, item.sizeMl, item.qty - 1)
                        }
                        className="flex size-6 items-center justify-center rounded-full text-foreground hover:bg-muted"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-semibold">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        aria-label="+"
                        onClick={() =>
                          setQty(item.id, item.sizeMl, item.qty + 1)
                        }
                        className="flex size-6 items-center justify-center rounded-full text-foreground hover:bg-muted"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-4 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t('shop.total')}
                </span>
                <span
                  data-testid="cart-total"
                  className="text-xl font-bold text-foreground"
                >
                  {formatPrice(total)}
                </span>
              </div>
              <a
                href={checkoutHref}
                target="_blank"
                rel="noreferrer"
                onClick={handleCheckoutClick}
                data-testid="cart-checkout"
                className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#d05f08]"
              >
                <ShoppingBag className="size-4" />
                {t('shop.checkout')}
              </a>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
