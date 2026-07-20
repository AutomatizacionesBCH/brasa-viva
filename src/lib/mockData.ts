export type Category = 'Parrilla' | 'Acompañamientos' | 'Sándwiches' | 'Postres' | 'Bebidas';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  popular?: boolean;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'nuevo' | 'preparando' | 'listo' | 'en_camino' | 'entregado';

export interface Order {
  id: string;
  number: number;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  address: string;
  customer: string;
  phone: string;
  createdAt: Date;
  deliveryDriver?: string;
}

export type DriverStatus = 'disponible' | 'en_ruta' | 'volviendo';

export interface Driver {
  id: string;
  name: string;
  status: DriverStatus;
  avatar: string;
  deliveries: number;
  phone: string;
  vehicle: string;
}

export interface HourlySales {
  hour: string;
  orders: number;
  revenue: number;
}

export type RestaurantPlan = 'Básico' | 'Pro' | 'Enterprise';
export type RestaurantStatus = 'activo' | 'inactivo' | 'prueba';

export interface Restaurant {
  id: string;
  name: string;
  plan: RestaurantPlan;
  paymentDate: string;
  status: RestaurantStatus;
  monthlyRevenue: number;
  ordersToday: number;
  owner: string;
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Lomo vetado 300 g',
    description: 'Corte premium a las brasas, término a elección.',
    price: 12990,
    category: 'Parrilla',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80',
    popular: true,
  },
  {
    id: 'p2',
    name: 'Entraña',
    description: 'Jugosa, sellada al carbón de espino.',
    price: 13490,
    category: 'Parrilla',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80',
  },
  {
    id: 'p3',
    name: 'Punta de ganso',
    description: 'Con sal de mar y chimichurri de la casa.',
    price: 11590,
    category: 'Parrilla',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80',
  },
  {
    id: 'p4',
    name: 'Costillar de cerdo BBQ',
    description: 'Cocción lenta 4 h, barniz de miel-ají.',
    price: 10990,
    category: 'Parrilla',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
  },
  {
    id: 'p5',
    name: 'Pollo al carbón ½',
    description: 'Marinado 24 h en merkén y limón.',
    price: 8990,
    category: 'Parrilla',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&q=80',
  },
  {
    id: 'p6',
    name: 'Anticucho mixto',
    description: 'Vacuno, pollo y longaniza.',
    price: 6990,
    category: 'Parrilla',
    image: 'https://images.unsplash.com/photo-1626323109252-0adb3b46692b?w=400&q=80',
    popular: true,
  },
  {
    id: 'p7',
    name: 'Chorizo parrillero',
    description: 'Con pebre cuchareado.',
    price: 4590,
    category: 'Parrilla',
    image: 'https://images.unsplash.com/photo-1598401863352-3de5501f4890?w=400&q=80',
  },
  {
    id: 'p8',
    name: 'Parrillada familiar',
    description: 'Para 4: mix de cortes + agregados.',
    price: 28990,
    category: 'Parrilla',
    image: 'https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?w=400&q=80',
    popular: true,
  },
  {
    id: 'p9',
    name: 'Papas rústicas',
    description: 'Con alioli de merkén.',
    price: 3590,
    category: 'Acompañamientos',
    image: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=400&q=80',
  },
  {
    id: 'p10',
    name: 'Ensalada chilena',
    description: 'Tomate, cebolla, cilantro.',
    price: 3290,
    category: 'Acompañamientos',
    image: 'https://images.unsplash.com/photo-1560717845-968823efbee1?w=400&q=80',
  },
  {
    id: 'p11',
    name: 'Puré rústico',
    description: 'Con mantequilla de ajo asado.',
    price: 3490,
    category: 'Acompañamientos',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80',
  },
  {
    id: 'p12',
    name: 'Choclo a las brasas',
    description: 'Con queso rallado y merkén.',
    price: 3290,
    category: 'Acompañamientos',
    image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400&q=80',
  },
  {
    id: 'p13',
    name: 'Churrasco luco',
    description: 'Marraqueta, queso fundido.',
    price: 7990,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80',
    popular: true,
  },
  {
    id: 'p14',
    name: 'Mechada italiana',
    description: 'Palta, tomate, mayo casera.',
    price: 8290,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80',
  },
  {
    id: 'p15',
    name: 'Barros jarpa',
    description: 'Jamón y queso a la plancha.',
    price: 7590,
    category: 'Sándwiches',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',
  },
  {
    id: 'p16',
    name: 'Leche asada',
    description: 'Receta de la abuela, caramelo quemado.',
    price: 3990,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400&q=80',
    popular: true,
  },
  {
    id: 'p17',
    name: 'Küchen de nuez',
    description: 'Con crema batida.',
    price: 4290,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&q=80',
  },
  {
    id: 'p18',
    name: 'Limonada menta-jengibre',
    description: '500 ml, hecha al momento.',
    price: 3290,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400&q=80',
  },
  {
    id: 'p19',
    name: 'Jugo natural',
    description: 'Frutilla o mango.',
    price: 2990,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80',
  },
  {
    id: 'p20',
    name: 'Bebida lata',
    description: '350 ml.',
    price: 1890,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&q=80',
  },
];

const now = new Date();
const ago = (minutes: number) => new Date(now.getTime() - minutes * 60000);

export const initialOrders: Order[] = [
  {
    id: 'o1',
    number: 1042,
    items: [
      { product: products[0], quantity: 2 },
      { product: products[8], quantity: 1 },
      { product: products[17], quantity: 2 },
    ],
    status: 'nuevo',
    total: 36150,
    address: 'Av. Los Aromos 1234, Depto 56, Barrio Centro',
    customer: 'Carolina P.',
    phone: '+56 9 5555 0201',
    createdAt: ago(5),
  },
  {
    id: 'o2',
    number: 1043,
    items: [
      { product: products[1], quantity: 1 },
      { product: products[2], quantity: 1 },
      { product: products[11], quantity: 2 },
    ],
    status: 'preparando',
    total: 31660,
    address: 'Pasaje El Espino 987, Barrio Norte',
    customer: 'Andrés M.',
    phone: '+56 9 5555 0202',
    createdAt: ago(12),
  },
  {
    id: 'o3',
    number: 1044,
    items: [
      { product: products[3], quantity: 2 },
      { product: products[10], quantity: 2 },
    ],
    status: 'preparando',
    total: 28960,
    address: 'Calle Los Canelos 456',
    customer: 'Fernanda S.',
    phone: '+56 9 5555 0203',
    createdAt: ago(18),
  },
  {
    id: 'o4',
    number: 1045,
    items: [
      { product: products[6], quantity: 1 },
      { product: products[15], quantity: 2 },
    ],
    status: 'listo',
    total: 12570,
    address: 'Av. Los Aromos 1234, Depto 56',
    customer: 'Carolina P.',
    phone: '+56 9 5555 0201',
    createdAt: ago(25),
  },
  {
    id: 'o5',
    number: 1046,
    items: [
      { product: products[1], quantity: 2 },
      { product: products[5], quantity: 1 },
      { product: products[8], quantity: 2 },
    ],
    status: 'listo',
    total: 41150,
    address: 'Pasaje El Espino 987',
    customer: 'Andrés M.',
    phone: '+56 9 5555 0202',
    createdAt: ago(22),
  },
  {
    id: 'o6',
    number: 1040,
    items: [
      { product: products[2], quantity: 1 },
      { product: products[4], quantity: 2 },
      { product: products[17], quantity: 1 },
    ],
    status: 'en_camino',
    total: 32860,
    address: 'Calle Los Canelos 456, Barrio Norte',
    customer: 'Fernanda S.',
    phone: '+56 9 5555 0203',
    createdAt: ago(40),
    deliveryDriver: 'd1',
  },
  {
    id: 'o7',
    number: 1039,
    items: [
      { product: products[3], quantity: 1 },
      { product: products[10], quantity: 1 },
    ],
    status: 'entregado',
    total: 14480,
    address: 'Av. Los Aromos 1234, Depto 56, Barrio Centro',
    customer: 'Carolina P.',
    phone: '+56 9 5555 0201',
    createdAt: ago(75),
    deliveryDriver: 'd2',
  },
  {
    id: 'o8',
    number: 1038,
    items: [
      { product: products[0], quantity: 3 },
      { product: products[6], quantity: 1 },
      { product: products[15], quantity: 1 },
    ],
    status: 'entregado',
    total: 47550,
    address: 'Pasaje El Espino 987',
    customer: 'Andrés M.',
    phone: '+56 9 5555 0202',
    createdAt: ago(95),
    deliveryDriver: 'd1',
  },
];

export const drivers: Driver[] = [
  {
    id: 'd1',
    name: 'Diego Fuentes',
    status: 'en_ruta',
    avatar: 'DF',
    deliveries: 12,
    phone: '+56 9 5555 0101',
    vehicle: 'moto',
  },
  {
    id: 'd2',
    name: 'Valentina Muñoz',
    status: 'disponible',
    avatar: 'VM',
    deliveries: 9,
    phone: '+56 9 5555 0102',
    vehicle: 'bicicleta',
  },
  {
    id: 'd3',
    name: 'Matías Contreras',
    status: 'volviendo',
    avatar: 'MC',
    deliveries: 7,
    phone: '+56 9 5555 0103',
    vehicle: 'auto',
  },
];

export const hourlySales: HourlySales[] = [
  { hour: '12:00', orders: 3, revenue: 45200 },
  { hour: '13:00', orders: 7, revenue: 98500 },
  { hour: '14:00', orders: 11, revenue: 154300 },
  { hour: '15:00', orders: 5, revenue: 67800 },
  { hour: '16:00', orders: 4, revenue: 52100 },
  { hour: '17:00', orders: 6, revenue: 83400 },
  { hour: '18:00', orders: 9, revenue: 127600 },
  { hour: '19:00', orders: 8, revenue: 112900 },
];

export const restaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Brasa Viva',
    plan: 'Pro',
    paymentDate: '2026-05-01',
    status: 'activo',
    monthlyRevenue: 89000,
    ordersToday: 48,
    owner: 'Francisca Ibáñez',
  },
  {
    id: 'r2',
    name: 'La Piazza Italiana',
    plan: 'Enterprise',
    paymentDate: '2026-05-03',
    status: 'activo',
    monthlyRevenue: 149000,
    ordersToday: 73,
    owner: 'Marco Rossi',
  },
  {
    id: 'r3',
    name: 'Burger Bros',
    plan: 'Básico',
    paymentDate: '2026-05-10',
    status: 'activo',
    monthlyRevenue: 49000,
    ordersToday: 31,
    owner: 'Felipe Araya',
  },
  {
    id: 'r4',
    name: 'Thai Garden',
    plan: 'Pro',
    paymentDate: '2026-04-28',
    status: 'prueba',
    monthlyRevenue: 0,
    ordersToday: 12,
    owner: 'Ana Surakul',
  },
];

export const formatCLP = (amount: number): string =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
