import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void; 
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}


const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (product) =>
    set((state) => {
      if (!product.id) {
        console.error("Erro: Produto sem ID não pode ser adicionado ao carrinho!", product);
        return state;
      }
  
      const existingItem = state.items.find((item) => item.id === product.id);
  
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
  
      return { items: [...state.items, { ...product, quantity: 1 }] };
    }),
  
  

  removeFromCart: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

  updateQuantity: (id, quantity) => set((state) => ({
    items: quantity > 0
      ? state.items.map((item) => (item.id === id ? { ...item, quantity } : item))
      : state.items.filter((item) => item.id !== id)
  })),
  

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));

export default useCartStore;
