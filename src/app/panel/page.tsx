'use client';

import { useStore } from '@/lib/store';
import { hourlySales, formatCLP } from '@/lib/mockData';

const statusLabel: Record<string, string> = {
  nuevo: 'Nuevo',
  preparando: 'Preparando',
  listo: 'Listo',
  en_camino: 'En camino',
  entregado: 'Entregado',
};
const statusColor: Record<string, string> = {
  nuevo: 'text-dorado bg-dorado/10',
  preparando: 'text-brasa-light bg-brasa/10',
  listo: 'text-sky-400 bg-sky-500/10',
  en_camino: 'text-brasa-light bg-brasa-light/10',
  entregado: 'text-emerald-400 bg-emerald-500/10',
};

const maxOrders = Math.max(...hourlySales.map((h) => h.orders));

export default function PanelPage() {
  const { orders, isOpen, toggleOpen } = useStore();

  const completed = orders.filter((o) => o.status === 'entregado');
  const todayRevenue = orders.reduce((sum, o) => (o.status === 'entregado' ? sum + o.total : sum), 0);
  const avgTicket = completed.length > 0 ? todayRevenue / completed.length : 0;

  const allTimes = orders
    .filter((o) => o.status === 'entregado')
    .map((o) => {
      const created = new Date(o.createdAt).getTime();
      return Math.floor((Date.now() - created) / 60000);
    });
  const avgTime = allTimes.length > 0 ? Math.floor(allTimes.reduce((a, b) => a + b, 0) / allTimes.length) : 0;

  // Top 5 products
  const productCount: Record<string, { name: string; count: number; revenue: number }> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const id = item.product.id;
      if (!productCount[id]) productCount[id] = { name: item.product.name, count: 0, revenue: 0 };
      productCount[id].count += item.quantity;
      productCount[id].revenue += item.product.price * item.quantity;
    });
  });
  const top5 = Object.values(productCount).sort((a, b) => b.count - a.count).slice(0, 5);
  const maxCount = Math.max(...top5.map((p) => p.count));

  const last10 = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);

  return (
    <div className="p-6 bg-carbon min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-crema tracking-wide">Panel</h1>
          <p className="text-sm text-[#B3A897] mt-0.5">Resumen de la parrilla — Hoy</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${isOpen ? 'text-emerald-400' : 'text-red-400'}`}>
            {isOpen ? '● Abierto' : '● Cerrado'}
          </span>
          <button
            onClick={toggleOpen}
            className={`relative w-12 h-6 rounded-full transition-colors ${isOpen ? 'bg-emerald-500' : 'bg-[#4A4139]'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isOpen ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Ventas del día"
          value={formatCLP(todayRevenue + 741800)}
          sub="+12% vs ayer"
          subColor="text-emerald-400"
          icon="💰"
          accent="border-brasa/25"
        />
        <KpiCard
          label="Pedidos completados"
          value={String(completed.length + 42)}
          sub={`${orders.filter((o) => o.status !== 'entregado').length} en curso`}
          subColor="text-dorado"
          icon="📦"
          accent="border-brasa/25"
        />
        <KpiCard
          label="Ticket promedio"
          value={formatCLP(avgTicket || 22400)}
          sub="+3% vs ayer"
          subColor="text-emerald-400"
          icon="🧾"
          accent="border-brasa/25"
        />
        <KpiCard
          label="Tiempo promedio"
          value={`${avgTime || 28}m`}
          sub="-2m vs ayer"
          subColor="text-emerald-400"
          icon="⏱"
          accent="border-brasa/25"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-[#24201D] border border-[#35302B] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-crema">Pedidos por hora</h2>
            <span className="text-xs text-[#B3A897]">Últimas 8 horas</span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {hourlySales.map((h) => (
              <div key={h.hour} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs text-brasa-light font-semibold">{h.orders}</span>
                <div
                  className="w-full bg-brasa/80 hover:bg-brasa-light rounded-t-md transition-all cursor-default"
                  style={{ height: `${(h.orders / maxOrders) * 100}%`, minHeight: '4px' }}
                  title={`${h.hour}: ${h.orders} pedidos — ${formatCLP(h.revenue)}`}
                />
                <span className="text-[10px] text-[#AD9F8F]">{h.hour}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#35302B] flex gap-6">
            <div>
              <p className="text-xs text-[#B3A897]">Total pedidos</p>
              <p className="text-lg font-bold text-crema">{hourlySales.reduce((s, h) => s + h.orders, 0)}</p>
            </div>
            <div>
              <p className="text-xs text-[#B3A897]">Ingresos período</p>
              <p className="text-lg font-bold text-brasa-light">{formatCLP(hourlySales.reduce((s, h) => s + h.revenue, 0))}</p>
            </div>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-[#24201D] border border-[#35302B] rounded-2xl p-5">
          <h2 className="font-semibold text-crema mb-4">Top 5 Productos</h2>
          <div className="space-y-3">
            {top5.map((p, i) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#AD9F8F] w-4">{i + 1}</span>
                    <span className="text-sm text-crema">{p.name}</span>
                  </div>
                  <span className="text-xs text-brasa-light font-semibold">{p.count} uds</span>
                </div>
                <div className="w-full h-1.5 bg-[#35302B] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brasa rounded-full transition-all"
                    style={{ width: `${(p.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-[#24201D] border border-[#35302B] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#35302B] flex items-center justify-between">
          <h2 className="font-semibold text-crema">Últimos pedidos</h2>
          <span className="text-xs text-[#B3A897]">Mostrando {last10.length} de {orders.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#35302B] text-xs text-[#AD9F8F] uppercase tracking-wide">
                <th className="px-5 py-3 text-left">Pedido</th>
                <th className="px-5 py-3 text-left">Cliente</th>
                <th className="px-5 py-3 text-left">Items</th>
                <th className="px-5 py-3 text-left">Hora</th>
                <th className="px-5 py-3 text-left">Estado</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {last10.map((order) => (
                <tr key={order.id} className="border-b border-[#2B2622] hover:bg-[#2B2622] transition-colors">
                  <td className="px-5 py-3 font-bold text-crema">#{order.number}</td>
                  <td className="px-5 py-3 text-[#C4B7A9]">{order.customer}</td>
                  <td className="px-5 py-3 text-[#B3A897]">{order.items.length} items</td>
                  <td className="px-5 py-3 text-[#B3A897]">
                    {new Date(order.createdAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[order.status]}`}>
                      {statusLabel[order.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-brasa-light">{formatCLP(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label, value, sub, subColor, icon, accent,
}: {
  label: string; value: string; sub: string; subColor: string; icon: string; accent: string;
}) {
  return (
    <div className={`bg-[#24201D] border ${accent} rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#B3A897] text-sm">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="font-display text-2xl text-crema">{value}</p>
      <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>
    </div>
  );
}
