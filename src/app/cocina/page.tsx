'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Order, OrderStatus, formatCLP } from '@/lib/mockData';

const columns: { status: OrderStatus; label: string; color: string; bg: string; border: string }[] = [
  { status: 'nuevo', label: 'Nuevos', color: 'text-dorado', bg: 'bg-dorado/10', border: 'border-dorado/30' },
  { status: 'preparando', label: 'En preparación', color: 'text-brasa-light', bg: 'bg-brasa/10', border: 'border-brasa/30' },
  { status: 'listo', label: 'Listos', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
];

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  nuevo: 'preparando',
  preparando: 'listo',
};
const prevStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  preparando: 'nuevo',
  listo: 'preparando',
};

function useTimer() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(id);
  }, []);
}

function getElapsed(date: Date): { minutes: number; display: string } {
  const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (minutes < 60) return { minutes, display: `${minutes}m` };
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return { minutes, display: `${h}h ${m}m` };
}

function OrderCard({ order }: { order: Order }) {
  useTimer();
  const updateStatus = useStore((s) => s.updateOrderStatus);
  const { minutes, display } = getElapsed(order.createdAt);
  const isUrgent = minutes >= 15;
  const isWarning = minutes >= 10 && minutes < 15;

  return (
    <div className={`bg-[#24201D] border rounded-xl p-4 space-y-3 transition-all ${
      isUrgent ? 'border-red-500/50 shadow-lg shadow-red-500/10' : 'border-[#35302B]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-crema font-bold text-base">#{order.number}</span>
          <p className="text-[#B3A897] text-xs mt-0.5">{order.customer}</p>
        </div>
        <div className="text-right">
          <span
            className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
              isUrgent
                ? 'bg-red-500/20 text-red-400 animate-pulse'
                : isWarning
                ? 'bg-dorado/20 text-dorado'
                : 'bg-[#35302B] text-[#9B8D80]'
            }`}
          >
            {isUrgent && '🔴 '}{display}
          </span>
          <p className="text-[#AD9F8F] text-xs mt-1">
            {new Date(order.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1.5">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-dorado font-bold text-sm w-5">{item.quantity}×</span>
            <span className="text-[#E5DBD0] text-sm">{item.product.name}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#35302B]">
        <span className="text-[#9B8D80] text-xs font-medium">{formatCLP(order.total)}</span>
        <div className="flex gap-1.5">
          {prevStatus[order.status] && (
            <button
              onClick={() => updateStatus(order.id, prevStatus[order.status]!)}
              className="px-2.5 py-1 rounded-lg bg-[#35302B] hover:bg-[#4A4139] text-[#9B8D80] hover:text-crema text-xs transition-colors"
            >
              ← Volver
            </button>
          )}
          {nextStatus[order.status] && (
            <button
              onClick={() => updateStatus(order.id, nextStatus[order.status]!)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                nextStatus[order.status] === 'preparando'
                  ? 'bg-brasa hover:bg-brasa-light text-carbon'
                  : 'bg-sky-500 hover:bg-sky-400 text-carbon'
              }`}
            >
              {nextStatus[order.status] === 'preparando' ? 'Preparar →' : 'Listo ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CocinaPage() {
  const orders = useStore((s) => s.orders);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setLastUpdate(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const getByStatus = (status: OrderStatus) =>
    orders.filter((o) => o.status === status).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="flex flex-col h-screen bg-carbon overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#35302B] shrink-0">
        <div>
          <h1 className="font-display text-2xl text-crema tracking-wide">Cocina</h1>
          <p className="text-sm text-[#B3A897] mt-0.5">Pantalla de comandas en vivo</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#B3A897]">
              Actualizado{' '}
              <span className="text-dorado">
                {lastUpdate.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-[#B3A897]"><span className="w-2 h-2 rounded-full bg-[#AD9F8F] inline-block" /> &lt;10m</span>
            <span className="flex items-center gap-1 text-dorado"><span className="w-2 h-2 rounded-full bg-dorado inline-block" /> 10-15m</span>
            <span className="flex items-center gap-1 text-red-400"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> +15m</span>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="flex-1 grid grid-cols-3 gap-0 overflow-hidden divide-x divide-[#35302B]">
        {columns.map((col) => {
          const colOrders = getByStatus(col.status);
          return (
            <div key={col.status} className="flex flex-col overflow-hidden">
              {/* Column header */}
              <div className={`flex items-center justify-between px-4 py-3 border-b border-[#35302B] ${col.bg}`}>
                <span className={`font-semibold text-sm ${col.color}`}>{col.label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${col.border} ${col.color}`}>
                  {colOrders.length}
                </span>
              </div>
              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {colOrders.length === 0 ? (
                  <div className="text-center py-12 text-[#4A4139]">
                    <p className="text-3xl mb-2">✓</p>
                    <p className="text-xs">Sin pedidos</p>
                  </div>
                ) : (
                  colOrders.map((order) => <OrderCard key={order.id} order={order} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
