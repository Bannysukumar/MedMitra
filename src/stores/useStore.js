import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (medicine, quantity = 1) => {
        const items = get().items
        const existing = items.find((i) => i.id === medicine.id)
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === medicine.id ? { ...i, quantity: i.quantity + quantity } : i
            ),
          })
        } else {
          set({ items: [...items, { ...medicine, quantity }] })
        }
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (code) => {
        const coupons = { MEDMITRA10: 10, SAVE20: 20, HEALTH15: 15 }
        const discount = coupons[code.toUpperCase()]
        if (discount) set({ coupon: { code: code.toUpperCase(), discount } })
        return !!discount
      },

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getDiscount: () => {
        const coupon = get().coupon
        if (!coupon) return 0
        return Math.round((get().getSubtotal() * coupon.discount) / 100)
      },

      getTotal: () => get().getSubtotal() - get().getDiscount(),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'medmitra-cart' }
  )
)

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (medicine) => {
        if (!get().items.find((i) => i.id === medicine.id)) {
          set({ items: [...get().items, medicine] })
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      isInWishlist: (id) => get().items.some((i) => i.id === id),
      toggle: (medicine) => {
        if (get().isInWishlist(medicine.id)) get().removeItem(medicine.id)
        else get().addItem(medicine)
      },
    }),
    { name: 'medmitra-wishlist' }
  )
)

export const useThemeStore = create(
  persist(
    (set) => ({
      darkMode: false,
      toggleTheme: () =>
        set((s) => {
          const next = !s.darkMode
          document.documentElement.classList.toggle('dark', next)
          return { darkMode: next }
        }),
      initTheme: () => {
        const stored = useThemeStore.getState().darkMode
        document.documentElement.classList.toggle('dark', stored)
      },
    }),
    { name: 'medmitra-theme' }
  )
)
