'use client';

import { useState } from 'react';
import { restaurants as initialRestaurants, Restaurant, RestaurantPlan, formatCLP } from '@/lib/mockData';

const planColor: Record<RestaurantPlan, string> = {
  Básico: 'text-[#9B8D80] bg-[#35302B] border-[#4A4139]',
  Pro: 'text-brasa-light bg-brasa/10 border-brasa/30',
  Enterprise: 'text-dorado-light bg-dorado/10 border-dorado/30',
};
const statusColor: Record<string, string> = {
  activo: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  inactivo: 'text-red-400 bg-red-500/10 border-red-500/30',
  prueba: 'text-dorado-light bg-dorado/10 border-dorado/30',
};
const planPrice: Record<RestaurantPlan, number> = {
  Básico: 49000,
  Pro: 89000,
  Enterprise: 149000,
};

const sampleNames = ['Fuego Andino', 'La Picá del Tío', 'Brasas del Sur', 'Sabor Criollo', 'El Rincón Parrillero'];
const sampleOwners = ['Luis Vargas', 'María López', 'Pedro Salas', 'Carmen Torres', 'Juan Pérez'];

export default function AdminPage() {
  const [list, setList] = useState<Restaurant[]>(initialRestaurants);
  const [showModal, setShowModal] = useState(false);

  const mrr = list.filter((r) => r.status === 'activo').reduce((s, r) => s + planPrice[r.plan], 0);
  const active = list.filter((r) => r.status === 'activo').length;
  const ordersToday = list.reduce((s, r) => s + r.ordersToday, 0);
  const trialCount = list.filter((r) => r.status === 'prueba').length;

  const addRestaurant = () => {
    const plans: RestaurantPlan[] = ['Básico', 'Pro', 'Enterprise'];
    const idx = Math.floor(Math.random() * sampleNames.length);
    const newR: Restaurant = {
      id: `r${Date.now()}`,
      name: sampleNames[idx],
      plan: plans[Math.floor(Math.random() * plans.length)],
      paymentDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'prueba',
      monthlyRevenue: 0,
      ordersToday: Math.floor(Math.random() * 20),
      owner: sampleOwners[idx],
    };
    setList([newR, ...list]);
    setShowModal(false);
  };

  return (
    <div className="p-6 bg-carbon min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-crema tracking-wide">Admin SaaS</h1>
          <p className="text-sm text-[#B3A897] mt-0.5">Gestión de restaurantes suscritos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-brasa hover:bg-brasa-light text-carbon font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          + Nuevo restaurante
        </button>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="MRR" value={formatCLP(mrr)} sub="Ingresos recurrentes mensuales" icon="💳" color="text-brasa-light" />
        <KpiCard label="Activos" value={String(active)} sub={`${trialCount} en período de prueba`} icon="🏪" color="text-emerald-400" />
        <KpiCard label="Pedidos hoy" value={String(ordersToday)} sub="Todos los restaurantes" icon="📦" color="text-dorado" />
        <KpiCard label="Total clientes" value={String(list.length)} sub={`${list.filter((r) => r.status === 'inactivo').length} inactivos`} icon="👥" color="text-crema" />
      </div>

      {/* Plan breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {(['Básico', 'Pro', 'Enterprise'] as RestaurantPlan[]).map((plan) => {
          const count = list.filter((r) => r.plan === plan && r.status === 'activo').length;
          return (
            <div key={plan} className="bg-[#24201D] border border-[#35302B] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${planColor[plan]}`}>{plan}</span>
                <span className="text-[#B3A897] text-xs">{formatCLP(planPrice[plan])}/mes</span>
              </div>
              <p className="text-3xl font-bold text-crema">{count}</p>
              <p className="text-xs text-[#AD9F8F] mt-0.5">restaurantes activos</p>
              <p className="text-sm font-semibold text-brasa-light mt-2">{formatCLP(count * planPrice[plan])}</p>
            </div>
          );
        })}
      </div>

      {/* Restaurants table */}
      <div className="bg-[#24201D] border border-[#35302B] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#35302B] flex items-center justify-between">
          <h2 className="font-semibold text-crema">Restaurantes</h2>
          <span className="text-xs text-[#B3A897]">{list.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#35302B] text-xs text-[#AD9F8F] uppercase tracking-wide">
                <th className="px-5 py-3 text-left">Restaurante</th>
                <th className="px-5 py-3 text-left">Propietario</th>
                <th className="px-5 py-3 text-left">Plan</th>
                <th className="px-5 py-3 text-left">Estado</th>
                <th className="px-5 py-3 text-left">Prox. cobro</th>
                <th className="px-5 py-3 text-right">Pedidos hoy</th>
                <th className="px-5 py-3 text-right">MRR</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="border-b border-[#2B2622] hover:bg-[#2B2622] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#35302B] flex items-center justify-center text-sm text-crema">
                        {r.name[0]}
                      </div>
                      <span className="font-medium text-crema">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#9B8D80]">{r.owner}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${planColor[r.plan]}`}>{r.plan}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor[r.status]}`}>
                      {r.status === 'activo' ? 'Activo' : r.status === 'prueba' ? 'Prueba' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#B3A897] text-xs">{r.paymentDate}</td>
                  <td className="px-5 py-3 text-right text-crema font-medium">{r.ordersToday}</td>
                  <td className="px-5 py-3 text-right font-semibold text-brasa-light">
                    {r.status === 'activo' ? formatCLP(planPrice[r.plan]) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#24201D] border border-[#35302B] rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-bold text-crema">Nuevo restaurante</h3>
            <p className="text-sm text-[#B3A897]">
              Se creará un restaurante aleatorio en período de prueba de 14 días.
            </p>
            <div className="bg-[#15110F] border border-[#35302B] rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#B3A897]">Plan inicial</span>
                <span className="text-dorado font-medium">Prueba gratuita</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B3A897]">Duración</span>
                <span className="text-crema">14 días</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B3A897]">Cobro inicial</span>
                <span className="text-emerald-400">$0</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#4A4139] text-[#9B8D80] hover:text-crema text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addRestaurant}
                className="flex-1 bg-brasa hover:bg-brasa-light text-carbon font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, sub, icon, color }: { label: string; value: string; sub: string; icon: string; color: string }) {
  return (
    <div className="bg-[#24201D] border border-[#35302B] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#B3A897] text-sm">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`font-display text-2xl ${color}`}>{value}</p>
      <p className="text-xs text-[#AD9F8F] mt-1">{sub}</p>
    </div>
  );
}
