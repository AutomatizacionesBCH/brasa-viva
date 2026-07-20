import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../lib/store';
import type { Order } from '../lib/mockData';

// Snapshot del estado inicial real del store (orders/drivers/cart/isOpen/orderCounter)
// para poder resetear entre tests sin depender de mutaciones de un test anterior.
const initialState = useStore.getInitialState();

beforeEach(() => {
  useStore.setState(initialState, true);
});

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'test-order-1',
    number: 9999,
    items: [],
    status: 'nuevo',
    total: 15990,
    address: 'Calle de Prueba 123',
    customer: 'Cliente de Prueba',
    phone: '+56 9 5555 0999',
    createdAt: new Date(),
    ...overrides,
  };
}

describe('ciclo de vida del pedido', () => {
  it('avanza nuevo → preparando → listo → en_camino → entregado', () => {
    const pedido = makeOrder();
    useStore.getState().addOrder(pedido);

    const getPedido = () => useStore.getState().orders.find((o) => o.id === pedido.id);

    expect(getPedido()?.status).toBe('nuevo');

    useStore.getState().updateOrderStatus(pedido.id, 'preparando');
    expect(getPedido()?.status).toBe('preparando');

    useStore.getState().updateOrderStatus(pedido.id, 'listo');
    expect(getPedido()?.status).toBe('listo');

    // En la app real (src/app/delivery/page.tsx) el paso listo → en_camino
    // ocurre a través de assignDriver, no de updateOrderStatus.
    useStore.getState().assignDriver(pedido.id, 'd2'); // d2 = Valentina Muñoz, disponible
    expect(getPedido()?.status).toBe('en_camino');
    expect(getPedido()?.deliveryDriver).toBe('d2');

    useStore.getState().updateOrderStatus(pedido.id, 'entregado');
    expect(getPedido()?.status).toBe('entregado');
  });

  it('addOrder antepone el pedido nuevo a la lista (más reciente primero)', () => {
    const antesTotal = useStore.getState().orders.length;
    const pedido = makeOrder({ id: 'test-order-2' });

    useStore.getState().addOrder(pedido);

    const orders = useStore.getState().orders;
    expect(orders.length).toBe(antesTotal + 1);
    expect(orders[0].id).toBe('test-order-2');
  });
});

describe('asignación de repartidor (assignDriver)', () => {
  it('al asignar un repartidor disponible a un pedido listo: pedido pasa a en_camino y el repartidor a en_ruta', () => {
    // o4 viene de mockData con status 'listo'; d2 viene con status 'disponible'.
    const pedidoListo = useStore.getState().orders.find((o) => o.id === 'o4')!;
    expect(pedidoListo.status).toBe('listo');
    const repartidorDisponible = useStore.getState().drivers.find((d) => d.id === 'd2')!;
    expect(repartidorDisponible.status).toBe('disponible');

    useStore.getState().assignDriver('o4', 'd2');

    const pedidoActualizado = useStore.getState().orders.find((o) => o.id === 'o4');
    const repartidorActualizado = useStore.getState().drivers.find((d) => d.id === 'd2');

    expect(pedidoActualizado?.status).toBe('en_camino');
    expect(pedidoActualizado?.deliveryDriver).toBe('d2');
    expect(repartidorActualizado?.status).toBe('en_ruta');
  });

  it('no deja rastro en otros pedidos ni repartidores al asignar (solo toca al pedido y repartidor indicados)', () => {
    useStore.getState().assignDriver('o4', 'd2');

    const otroPedido = useStore.getState().orders.find((o) => o.id === 'o5');
    const otroRepartidor = useStore.getState().drivers.find((d) => d.id === 'd1');

    expect(otroPedido?.status).toBe('listo'); // o5 seguía 'listo' en los datos iniciales
    expect(otroRepartidor?.status).toBe('en_ruta'); // d1 seguía 'en_ruta' en los datos iniciales, sin cambios
  });

  it('documenta que el store no valida el estado del pedido/repartidor antes de asignar (la regla vive en la UI de delivery/page.tsx)', () => {
    // o1 viene con status 'nuevo' (no 'listo'). El store no lo bloquea: fuerza igual
    // el pedido a 'en_camino'. La UI de reparto solo filtra `readyOrders` (status === 'listo')
    // y solo permite elegir repartidores 'disponible' o 'volviendo' en el <select>,
    // pero assignDriver en sí mismo no repite esa validación.
    const pedidoNuevo = useStore.getState().orders.find((o) => o.id === 'o1')!;
    expect(pedidoNuevo.status).toBe('nuevo');

    useStore.getState().assignDriver('o1', 'd2');

    expect(useStore.getState().orders.find((o) => o.id === 'o1')?.status).toBe('en_camino');
  });
});

describe('otras reglas del store', () => {
  it('toggleOpen invierte isOpen (abierto/cerrado del restaurante)', () => {
    expect(useStore.getState().isOpen).toBe(true);
    useStore.getState().toggleOpen();
    expect(useStore.getState().isOpen).toBe(false);
    useStore.getState().toggleOpen();
    expect(useStore.getState().isOpen).toBe(true);
  });

  it('incrementOrderCounter suma 1 al contador de pedidos', () => {
    const inicial = useStore.getState().orderCounter;
    useStore.getState().incrementOrderCounter();
    expect(useStore.getState().orderCounter).toBe(inicial + 1);
  });

  it('updateDriverStatus cambia el estado de un repartidor de forma independiente', () => {
    useStore.getState().updateDriverStatus('d3', 'disponible');
    expect(useStore.getState().drivers.find((d) => d.id === 'd3')?.status).toBe('disponible');
  });
});
