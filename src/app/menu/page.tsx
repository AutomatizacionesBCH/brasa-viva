'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { products, Category, formatCLP, Product } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

const categories: Category[] = ['Parrilla', 'Acompañamientos', 'Sándwiches', 'Postres', 'Bebidas'];
const categoryEmoji: Record<Category, string> = {
  Parrilla: '🥩',
  Acompañamientos: '🍟',
  Sándwiches: '🥪',
  Postres: '🍰',
  Bebidas: '🥤',
};

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>('Todos');
  const [cartOpen, setCartOpen] = useState(false);
  const { items, addItem, updateQuantity, clearCart, total, count, addOrder, isOpen, orderCounter, incrementOrderCounter } = useStore();
  const router = useRouter();

  const filtered = activeCategory === 'Todos' ? products : products.filter((p) => p.category === activeCategory);
  const cartTotal = total();
  const cartCount = count();

  const handleOrder = () => {
    if (items.length === 0) return;
    const newOrder = {
      id: `o${Date.now()}`,
      number: orderCounter,
      items: [...items],
      status: 'nuevo' as const,
      total: cartTotal,
      address: 'Av. Los Aromos 1234, Depto 56, Barrio Centro',
      customer: 'Cliente Web',
      phone: '+56 9 5555 0100',
      createdAt: new Date(),
    };
    addOrder(newOrder);
    incrementOrderCounter();
    clearCart();
    setCartOpen(false);
    router.push('/cocina');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-carbon">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-carbon/95 backdrop-blur-sm border-b border-[#35302B] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl text-crema tracking-wide">Menú</h1>
              <p className="text-sm text-[#B3A897] mt-0.5">Parrilla Brasa Viva — Delivery y para llevar</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isOpen ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                }`}
              >
                {isOpen ? '● Abierto' : '● Cerrado'}
              </span>
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 bg-brasa hover:bg-brasa-light text-carbon font-semibold px-4 py-2 rounded-xl transition-all text-sm"
              >
                🛒 Carrito
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-crema text-carbon text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {(['Todos', ...categories] as (Category | 'Todos')[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-brasa text-carbon'
                    : 'bg-[#24201D] text-[#9B8D80] border border-[#35302B] hover:border-[#4A4139] hover:text-crema'
                }`}
              >
                {cat !== 'Todos' && categoryEmoji[cat as Category]}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={() => addItem(product)} />
          ))}
        </div>
      </div>

      {/* Cart sidebar overlay */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <CartSidebar
            items={items}
            total={cartTotal}
            onClose={() => setCartOpen(false)}
            onUpdate={updateQuantity}
            onOrder={handleOrder}
          />
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  const items = useStore((s) => s.items);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const cartItem = items.find((i) => i.product.id === product.id);

  return (
    <div className="bg-[#24201D] border border-[#35302B] rounded-2xl overflow-hidden hover:border-brasa/40 hover:shadow-lg hover:shadow-brasa/10 transition-all duration-200 group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        {product.popular && (
          <span className="absolute top-2 left-2 bg-brasa text-carbon text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Popular
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-crema text-sm leading-tight">{product.name}</h3>
            <p className="text-[#B3A897] text-xs mt-1 leading-relaxed line-clamp-2">{product.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-brasa-light font-bold text-base">{formatCLP(product.price)}</span>
          {cartItem ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                className="w-7 h-7 rounded-lg bg-[#35302B] hover:bg-[#4A4139] text-crema flex items-center justify-center font-bold text-sm transition-colors"
              >
                −
              </button>
              <span className="text-crema font-semibold text-sm w-4 text-center">{cartItem.quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                className="w-7 h-7 rounded-lg bg-brasa hover:bg-brasa-light text-carbon flex items-center justify-center font-bold text-sm transition-colors"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="px-3 py-1.5 bg-brasa/15 hover:bg-brasa text-brasa-light hover:text-carbon border border-brasa/30 hover:border-brasa rounded-lg text-xs font-semibold transition-all duration-150"
            >
              Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CartSidebar({
  items,
  total,
  onClose,
  onUpdate,
  onOrder,
}: {
  items: import('@/lib/mockData').OrderItem[];
  total: number;
  onClose: () => void;
  onUpdate: (id: string, qty: number) => void;
  onOrder: () => void;
}) {
  return (
    <div className="w-[380px] bg-[#15110F] border-l border-[#35302B] flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#35302B]">
        <h2 className="font-bold text-crema text-lg">Tu pedido</h2>
        <button onClick={onClose} className="text-[#B3A897] hover:text-crema transition-colors text-xl">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-16 text-[#5A4E44]">
            <div className="text-4xl mb-3">🛒</div>
            <p className="text-sm">Tu carrito está vacío</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3 bg-[#24201D] rounded-xl p-3 border border-[#35302B]">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                <Image src={item.product.image} alt={item.product.name} fill className="object-cover" unoptimized />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-crema truncate">{item.product.name}</p>
                <p className="text-xs text-brasa-light font-semibold mt-0.5">{formatCLP(item.product.price)}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onUpdate(item.product.id, item.quantity - 1)}
                  className="w-6 h-6 rounded-md bg-[#35302B] hover:bg-[#4A4139] text-crema text-xs flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-crema text-sm font-semibold w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdate(item.product.id, item.quantity + 1)}
                  className="w-6 h-6 rounded-md bg-brasa hover:bg-brasa-light text-carbon text-xs flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="px-5 py-4 border-t border-[#35302B] space-y-3">
          <div className="flex justify-between text-sm text-[#9B8D80]">
            <span>Subtotal</span>
            <span>{formatCLP(total)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#9B8D80]">
            <span>Delivery</span>
            <span className="text-emerald-400">Gratis</span>
          </div>
          <div className="flex justify-between font-bold text-crema">
            <span>Total</span>
            <span className="text-lg">{formatCLP(total)}</span>
          </div>
          <button
            onClick={onOrder}
            className="w-full bg-brasa hover:bg-brasa-light text-carbon font-bold py-3.5 rounded-xl text-sm transition-colors"
          >
            Hacer pedido →
          </button>
        </div>
      )}
    </div>
  );
}
