import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roleLabel = {
  admin_logistik: 'Admin Logistik',
  anggota_bidang: 'Anggota Bidang',
  ketua_pembina: 'Ketua / Pembina',
};

export default function Topbar({ title, subtitle, onMenuClick, mobileMenuOpen }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <header className="h-16 shrink-0 border-b border-emerald-100 bg-white/95 px-3 sm:px-6">
      <div className="flex h-full items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
            className="rounded-lg p-2 text-emerald-900 transition hover:bg-emerald-50 focus-ring md:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-base font-bold leading-tight text-slate-900 sm:text-lg">
              {title}
            </h1>
            {subtitle && (
              <p className="truncate text-[11px] text-slate-500 sm:text-xs">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-50 focus-ring sm:gap-3 sm:pr-3"
          >
            {user?.foto_url ? (
              <img
                src={user.foto_url}
                alt=""
                className="h-9 w-9 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <User size={17} />
              </span>
            )}
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold leading-tight text-slate-800">
                {user?.nama}
              </span>
              <span className="block text-[11px] leading-tight text-slate-500">
                {roleLabel[user?.role]}
                {user?.nama_bidang && ` · ${user.nama_bidang}`}
              </span>
            </span>
            <ChevronDown size={15} className="text-slate-400" />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg"
            >
              <Link
                to="/profile"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <User size={15} />
                Profil saya
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={15} />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
