import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ title, subtitle, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-dvh min-h-screen overflow-hidden bg-[#f2f7f4] text-slate-900">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onNavigate={() => setMobileMenuOpen(false)}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          title={title}
          subtitle={subtitle}
          mobileMenuOpen={mobileMenuOpen}
          onMenuClick={() => setMobileMenuOpen((open) => !open)}
        />
        <main className="relative min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-5 lg:p-6">
          <img
            src="/logo-hw-unimus.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none fixed left-1/2 top-1/2 z-0 w-[min(44vw,25rem)] -translate-x-1/2 -translate-y-1/2 opacity-[0.12] mix-blend-multiply md:left-[calc(50%+8rem)]"
          />
          <div className="relative z-10 min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
