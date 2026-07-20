'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Order, formatCLP } from '@/lib/mockData';

const driverStatusLabel: Record<string, string> = {
  disponible: 'Disponible',
  en_ruta: 'En ruta',
  volviendo: 'Volviendo',
};
const driverStatusColor: Record<string, string> = {
  disponible: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  en_ruta: 'text-brasa-light bg-brasa/10 border-brasa/30',
  volviendo: 'text-dorado-light bg-dorado/10 border-dorado/30',
};

const orderTrackSteps = ['Confirmado', 'En cocina', 'En camino', 'Entregado'];
const statusToStep: Record<string, number> = {
  nuevo: 1,
  preparando: 1,
  listo: 1,
  en_camino: 2,
  entregado: 3,
};

// SVG map delivery points
const deliveryPoints = [
  { id: 'o4', x: 180, y: 140, label: '#1045' },
  { id: 'o5', x: 310, y: 200, label: '#1046' },
  { id: 'o6', x: 240, y: 280, label: '#1040', active: true },
  { id: 'o7', x: 410, y: 160, label: '#1039', done: true },
];

export default function DeliveryPage() {
  const { orders, drivers, assignDriver } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>('');

  const readyOrders = orders.filter((o) => o.status === 'listo');
  const activeOrders = orders.filter((o) => o.status === 'en_camino');

  const handleAssign = (orderId: string) => {
    if (!selectedDriver) return;
    assignDriver(orderId, selectedDriver);
    setSelectedDriver('');
  };

  return (
    <div className="flex flex-col h-screen bg-carbon overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#35302B] shrink-0">
        <div>
          <h1 className="font-display text-2xl text-crema tracking-wide">Delivery</h1>
          <p className="text-sm text-[#B3A897] mt-0.5">Gestión de repartidores y entregas</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#24201D] border border-[#35302B] rounded-xl px-4 py-2 text-center">
            <p className="text-2xl font-bold text-brasa-light">{readyOrders.length}</p>
            <p className="text-xs text-[#B3A897]">Para despachar</p>
          </div>
          <div className="bg-[#24201D] border border-[#35302B] rounded-xl px-4 py-2 text-center">
            <p className="text-2xl font-bold text-brasa-light">{activeOrders.length}</p>
            <p className="text-xs text-[#B3A897]">En camino</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Orders ready to dispatch */}
        <div className="w-[320px] border-r border-[#35302B] flex flex-col overflow-hidden shrink-0">
          <div className="px-4 py-3 border-b border-[#35302B] bg-brasa/5">
            <h2 className="text-sm font-semibold text-brasa-light">Listos para despachar</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {readyOrders.length === 0 ? (
              <div className="text-center py-10 text-[#4A4139]">
                <p className="text-3xl mb-2">🛵</p>
                <p className="text-xs">No hay pedidos listos</p>
              </div>
            ) : (
              readyOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-[#24201D] border rounded-xl p-3 cursor-pointer transition-all ${
                    selectedOrder?.id === order.id
                      ? 'border-brasa/50 shadow-lg shadow-brasa/10'
                      : 'border-[#35302B] hover:border-[#4A4139]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-crema font-bold text-sm">#{order.number}</span>
                    <span className="text-[#B3A897] text-xs">
                      {new Date(order.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[#9B8D80] text-xs truncate mb-1">{order.customer}</p>
                  <p className="text-[#AD9F8F] text-xs truncate mb-2">📍 {order.address}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-brasa-light font-semibold text-sm">{formatCLP(order.total)}</span>
                    <span className="text-xs text-[#B3A897]">{order.items.length} items</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Assign panel */}
          {selectedOrder && (
            <div className="p-3 border-t border-[#35302B] bg-[#24201D] space-y-2">
              <p className="text-xs font-semibold text-crema">Asignar #{selectedOrder.number}</p>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full bg-carbon border border-[#4A4139] rounded-lg px-3 py-2 text-sm text-crema appearance-none cursor-pointer"
              >
                <option value="">Seleccionar repartidor</option>
                {drivers
                  .filter((d) => d.status === 'disponible' || d.status === 'volviendo')
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {driverStatusLabel[d.status]}
                    </option>
                  ))}
              </select>
              <button
                onClick={() => handleAssign(selectedOrder.id)}
                disabled={!selectedDriver}
                className="w-full bg-brasa hover:bg-brasa-light disabled:bg-[#35302B] disabled:text-[#AD9F8F] text-carbon font-semibold py-2 rounded-lg text-sm transition-colors"
              >
                Asignar y enviar
              </button>
            </div>
          )}
        </div>

        {/* Center: Map */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-[#35302B] bg-brasa/5">
            <h2 className="text-sm font-semibold text-brasa-light">Mapa de entregas</h2>
          </div>
          <div className="flex-1 p-4 flex items-center justify-center">
            <div className="relative w-full max-w-[600px] aspect-[4/3] bg-[#24201D] border border-[#35302B] rounded-2xl overflow-hidden">
              {/* SVG Map */}
              <svg viewBox="0 0 600 450" className="w-full h-full">
                {/* Background grid */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#35302B" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="600" height="450" fill="#24201D" />
                <rect width="600" height="450" fill="url(#grid)" />

                {/* Roads */}
                <line x1="0" y1="225" x2="600" y2="225" stroke="#3A322C" strokeWidth="8" />
                <line x1="300" y1="0" x2="300" y2="450" stroke="#3A322C" strokeWidth="8" />
                <line x1="0" y1="112" x2="600" y2="112" stroke="#2B2622" strokeWidth="4" />
                <line x1="0" y1="337" x2="600" y2="337" stroke="#2B2622" strokeWidth="4" />
                <line x1="150" y1="0" x2="150" y2="450" stroke="#2B2622" strokeWidth="4" />
                <line x1="450" y1="0" x2="450" y2="450" stroke="#2B2622" strokeWidth="4" />

                {/* Road labels */}
                <text x="290" y="220" fill="#4A4139" fontSize="9" textAnchor="end">Av. Los Aromos</text>
                <text x="295" y="108" fill="#3A322C" fontSize="8">Los Canelos</text>

                {/* Restaurant marker */}
                <circle cx="300" cy="225" r="18" fill="#EA580C" fillOpacity="0.2" stroke="#EA580C" strokeWidth="2" />
                <text x="300" y="230" fill="#EA580C" fontSize="14" textAnchor="middle">🔥</text>

                {/* Delivery points */}
                {deliveryPoints.map((pt) => (
                  <g key={pt.id}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="14"
                      fill={pt.done ? '#059669' : pt.active ? '#EA580C' : '#0EA5E9'}
                      fillOpacity={pt.done ? 0.4 : 0.2}
                      stroke={pt.done ? '#059669' : pt.active ? '#EA580C' : '#0EA5E9'}
                      strokeWidth="2"
                    />
                    <text x={pt.x} y={pt.y + 4} fill={pt.done ? '#34D399' : pt.active ? '#FDBA74' : '#38BDF8'} fontSize="10" textAnchor="middle">
                      {pt.label}
                    </text>
                    {pt.active && (
                      <circle cx={pt.x} cy={pt.y} r="20" fill="none" stroke="#EA580C" strokeWidth="1" opacity="0.5">
                        <animate attributeName="r" from="14" to="26" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                ))}

                {/* Route line */}
                <line x1="300" y1="225" x2="240" y2="280" stroke="#EA580C" strokeWidth="2" strokeDasharray="6,4" opacity="0.7" />
              </svg>

              {/* Legend */}
              <div className="absolute bottom-3 right-3 bg-[#15110F]/90 rounded-lg px-3 py-2 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-[#9B8D80]">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Listo
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#9B8D80]">
                  <span className="w-2.5 h-2.5 rounded-full bg-brasa inline-block" /> En camino
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#9B8D80]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Entregado
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Drivers + Tracker */}
        <div className="w-[280px] border-l border-[#35302B] flex flex-col overflow-hidden shrink-0">
          {/* Drivers */}
          <div className="px-4 py-3 border-b border-[#35302B] bg-brasa/5">
            <h2 className="text-sm font-semibold text-brasa-light">Repartidores</h2>
          </div>
          <div className="p-3 space-y-2 border-b border-[#35302B]">
            {drivers.map((driver) => (
              <div key={driver.id} className="flex items-center gap-3 bg-[#24201D] border border-[#35302B] rounded-xl p-3">
                <div className="w-9 h-9 rounded-full bg-[#35302B] flex items-center justify-center text-xs font-bold text-crema shrink-0">
                  {driver.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-crema truncate">{driver.name}</p>
                  <p className="text-xs text-[#AD9F8F]">{driver.deliveries} entregas hoy</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${driverStatusColor[driver.status]}`}>
                  {driverStatusLabel[driver.status]}
                </span>
              </div>
            ))}
          </div>

          {/* Tracker */}
          <div className="px-4 py-3 border-b border-[#35302B] bg-brasa/5">
            <h2 className="text-sm font-semibold text-brasa-light">Tracker activo</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {activeOrders.length === 0 ? (
              <div className="text-center py-8 text-[#4A4139]">
                <p className="text-2xl mb-2">📍</p>
                <p className="text-xs">Sin pedidos en camino</p>
              </div>
            ) : (
              activeOrders.map((order) => {
                const step = statusToStep[order.status] ?? 0;
                const driver = drivers.find((d) => d.id === order.deliveryDriver);
                return (
                  <div key={order.id} className="bg-[#24201D] border border-[#35302B] rounded-xl p-3 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-crema font-bold text-sm">#{order.number}</span>
                      <span className="text-xs text-brasa-light">{driver?.name ?? '—'}</span>
                    </div>
                    <p className="text-[#B3A897] text-xs truncate">📍 {order.address}</p>
                    {/* Steps */}
                    <div className="space-y-1.5">
                      {orderTrackSteps.map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 ${
                            i <= step ? 'bg-brasa text-carbon' : 'bg-[#35302B] text-[#AD9F8F]'
                          }`}>
                            {i <= step ? '✓' : i + 1}
                          </div>
                          <span className={`text-xs ${i <= step ? 'text-crema' : 'text-[#AD9F8F]'}`}>{s}</span>
                          {i === step && <span className="text-brasa-light text-[10px] ml-auto animate-pulse">← Aquí</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
