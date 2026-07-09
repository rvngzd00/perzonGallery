/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const WISH_KEY = 'perzon-wishlist'
const CART_KEY_LEGACY = 'perzon-cart'
const CART_KEY = 'perzon-cart-v2'

export interface CartItem {
  id: string
  sizeMl: number | null
  qty: number
}

interface ShopContextValue {
  wishlist: string[]
  isWished: (id: string) => boolean
  toggleWish: (id: string) => void
  cart: CartItem[]
  addToCart: (id: string, sizeMl: number | null, qty?: number) => void
  setQty: (id: string, sizeMl: number | null, qty: number) => void
  removeFromCart: (id: string, sizeMl: number | null) => void
  clearCart: () => void
  cartCount: number
  isCartOpen: boolean
  openCart: () => void
  setCartOpen: (open: boolean) => void
}

const ShopContext = createContext<ShopContextValue | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

/** v1 carts were `{id, qty}[]`; migrate them once into the v2 composite-key shape. */
function loadCart(): CartItem[] {
  const v2 = localStorage.getItem(CART_KEY)
  if (v2) {
    try {
      return JSON.parse(v2) as CartItem[]
    } catch {
      return []
    }
  }
  const legacy = load<{ id: string; qty: number }[]>(CART_KEY_LEGACY, [])
  return legacy.map((i) => ({ id: i.id, sizeMl: null, qty: i.qty }))
}

const sameLine = (a: CartItem, id: string, sizeMl: number | null) =>
  a.id === id && a.sizeMl === sizeMl

export function ShopProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>(() =>
    load<string[]>(WISH_KEY, []),
  )
  const [cart, setCart] = useState<CartItem[]>(loadCart)
  const [isCartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(WISH_KEY, JSON.stringify(wishlist))
  }, [wishlist])
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  const isWished = useCallback(
    (id: string) => wishlist.includes(id),
    [wishlist],
  )
  const toggleWish = useCallback((id: string) => {
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]))
  }, [])

  const addToCart = useCallback(
    (id: string, sizeMl: number | null, qty = 1) => {
      setCart((c) => {
        const existing = c.find((i) => sameLine(i, id, sizeMl))
        if (existing) {
          return c.map((i) =>
            sameLine(i, id, sizeMl) ? { ...i, qty: i.qty + qty } : i,
          )
        }
        return [...c, { id, sizeMl, qty }]
      })
    },
    [],
  )

  const setQty = useCallback((id: string, sizeMl: number | null, qty: number) => {
    setCart((c) =>
      qty <= 0
        ? c.filter((i) => !sameLine(i, id, sizeMl))
        : c.map((i) => (sameLine(i, id, sizeMl) ? { ...i, qty } : i)),
    )
  }, [])

  const removeFromCart = useCallback((id: string, sizeMl: number | null) => {
    setCart((c) => c.filter((i) => !sameLine(i, id, sizeMl)))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const openCart = useCallback(() => setCartOpen(true), [])

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.qty, 0),
    [cart],
  )

  const value = useMemo(
    () => ({
      wishlist,
      isWished,
      toggleWish,
      cart,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      cartCount,
      isCartOpen,
      openCart,
      setCartOpen,
    }),
    [
      wishlist,
      isWished,
      toggleWish,
      cart,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      cartCount,
      isCartOpen,
      openCart,
    ],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>')
  return ctx
}
