'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/menu', icon: '🥩', label: 'Menú' },
  { href: '/cocina', icon: '👨‍🍳', label: 'Cocina' },
  { href: '/delivery', icon: '🛵', label: 'Delivery' },
  { href: '/panel', icon: '📊', label: 'Panel' },
  { href: '/admin', icon: '⚙️', label: 'Admin SaaS' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] bg-[#15110F] border-r border-[#35302B] flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[#35302B]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brasa-light via-brasa to-brasa-dark flex items-center justify-center text-lg shadow-lg shadow-brasa/25">
            🔥
          </div>
          <div className="leading-none">
            <p className="font-display text-sm text-crema tracking-wide leading-none">BRASA VIVA</p>
            <p className="text-[10px] text-[#B3A897] uppercase tracking-[0.2em] mt-1">Parrilla &amp; Delivery</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group hover:bg-brasa/10 ${
                isActive
                  ? 'border-l-2 border-brasa bg-[#2B2622] pl-[10px]'
                  : 'border-l-2 border-transparent'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span
                className={`text-sm font-medium transition-colors ${
                  isActive ? 'text-brasa-light' : 'text-[#9B8D80] group-hover:text-crema'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#35302B]">
        <p className="text-[10px] text-[#5A4E44] text-center tracking-wide">Brasa Viva OS v1.0</p>
      </div>
    </aside>
  );
}
