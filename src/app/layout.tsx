import type { Metadata } from 'next';
import { Inter, Archivo_Black } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const archivo = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-archivo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Brasa Viva — Pedidos y Delivery',
  description:
    'Sistema de gestión y delivery de la parrilla Brasa Viva: menú, cocina, repartidores y panel en tiempo real.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${archivo.variable}`}>
      <body className="bg-carbon text-crema font-sans">
        <Sidebar />
        <main className="ml-[220px] min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
