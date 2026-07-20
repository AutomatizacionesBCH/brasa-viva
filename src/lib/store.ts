import { create } from 'zustand';
import { Order, OrderItem, OrderStatus, Product, Driver, DriverStatus, initialOrders, drivers as initialDrivers } from './mockData';

interface CartState {
  items: OrderItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignDriver: (orderId: string, driverId: string) => void;
  incrementOrderCounter: () => void;
}

interface DriverState {
  drivers: Driver[];
  updateDriverStatus: (driverId: string, status: DriverStatus) => void;
}

interface RestaurantState {
  isOpen: boolean;
  toggleOpen: () => void;
}

type AppStore = CartState & OrderState & DriverState & RestaurantState & {
  orderCounter: number;
};

export const useStore = create<AppStore>((set, get) => ({
  // Cart
  items: [],
  addItem: (product) => {
    const items = get().items;
    const existing = items.find((i) => i.product.id === product.id);
    if (existing) {
      set({ items: items.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
    } else {
      set({ items: [...items, { product, quantity: 1 }] });
    }
  },
  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.product.id !== productId) });
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set({ items: get().items.map((i) => i.product.id === productId ? { ...i, quantity } : i) });
  },
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  // Orders
  orderCounter: 1047,
  orders: initialOrders,
  addOrder: (order) => set({ orders: [order, ...get().orders] }),
  incrementOrderCounter: () => set({ orderCounter: get().orderCounter + 1 }),
  updateOrderStatus: (orderId, status) => {
    set({
      orders: get().orders.map((o) => o.id === orderId ? { ...o, status } : o),
    });
  },
  assignDriver: (orderId, driverId) => {
    set({
      orders: get().orders.map((o) => o.id === orderId ? { ...o, deliveryDriver: driverId, status: 'en_camino' } : o),
      drivers: get().drivers.map((d) => d.id === driverId ? { ...d, status: 'en_ruta' } : d),
    });
  },

  // Drivers
  drivers: initialDrivers,
  updateDriverStatus: (driverId, status) => {
    set({ drivers: get().drivers.map((d) => d.id === driverId ? { ...d, status } : d) });
  },

  // Restaurant
  isOpen: true,
  toggleOpen: () => set({ isOpen: !get().isOpen }),
}));
