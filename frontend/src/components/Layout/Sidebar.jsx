import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PackageSearch,
  ClipboardCheck,
  CalendarClock,
  HandCoins,
  Truck,
  Wrench,
  FileBarChart2,
  PanelsTopLeft,
  BookOpen,
  GraduationCap,
  FileCog,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


const navItems = [

  { to: '/alumni', label: 'History Alumni', icon: GraduationCap, active: true, adminOnly: true },
  { to: '/data-pengurus', label: 'Data Pengurus', icon: Users, active: true, adminOnly: true },
  { to: '/pengaturan-kop-piket', label: 'Kop Surat Piket', icon: FileCog, active: true, adminOnly: true },
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    active: true,
  },
  {
    to: '/kelola-beranda',
    label: 'Kelola Beranda',
    icon: PanelsTopLeft,
    active: true,
    adminOnly: true,
  },
  {
    to: '/kelola-materi',
    label: 'Kelola Materi',
    icon: BookOpen,
    active: true,
    adminOnly: true,
  },
  {
    to: '/inventaris',
    label: 'Inventaris',
    icon: PackageSearch,
    active: true,
  },
  {
    to: '/unboxing',
    label: 'Unboxing & Pendataan',
    icon: ClipboardCheck,
    active: true,
  },
  {
    to: '/piket',
    label: 'Piket Mako',
    icon: CalendarClock,
    active: true,
    adminOnly: true,
  },
  {
    to: '/sewa',
    label: 'Ruang Sewa',
    icon: HandCoins,
    active: true,
  },
  {
    to: '/pengadaan',
    label: 'Pengadaan',
    icon: Truck,
    active: true,
  },
  {
    to: '/revitalisasi',
    label: 'Revitalisasi',
    icon: Wrench,
    active: true,
  },
  {
    to: '/laporan',
    label: 'Laporan',
    icon: FileBarChart2,
    active: true,
  },
];


export default function Sidebar({ mobileOpen = false, onNavigate = () => {}, onClose = () => {} }) {
  const { isAdmin } = useAuth();

  return (

    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 md:hidden"
        />
      )}
      <aside
        className={`${mobileOpen ? 'fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col' : 'hidden'} shrink-0 border-r border-emerald-950/20 bg-gradient-to-b from-[#174c43] to-[#123a39] text-emerald-50 md:relative md:z-auto md:flex md:w-64 md:flex-col`}
      >


      {/* BRAND */}

      <div
        className="
          flex
          h-16
          items-center
          gap-3
          border-b
          border-white/10
          px-5
        "
      >

        <img
          src="/logo-hw-unimus.png"
          alt="Logo HW UNIMUS"
          className="
            h-9
            w-9
            rounded-lg
            border
            border-white/60
            bg-white
            object-cover
            p-1
          "
        />


        <div className="leading-tight">

          <p
            className="
              text-sm
              font-bold
              tracking-tight
              text-white
            "
          >
            Bidang Logistik
          </p>


          <p
            className="
              text-[11px]
              text-emerald-100/70
            "
          >
            Mako HW UNIMUS
          </p>


        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup menu navigasi"
          className="ml-auto mr-4 rounded-lg p-2 text-emerald-50 hover:bg-white/10 md:hidden"
        >
          <X size={18} />
        </button>


      </div>





      {/* MENU */}

      <nav
        className="
          flex-1
          space-y-1
          overflow-y-auto
          px-3
          py-4
        "
      >

        {
          navItems.filter((item) => !item.adminOnly || isAdmin).map(
            ({
              to,
              label,
              icon: Icon,
              active,
            }) => (

              active ? (

                <NavLink
                  key={to}
                  to={to}
                  onClick={onNavigate}

                  className={({ isActive }) =>
                    `
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    transition

                    ${
                      isActive
                      ?
                      `
                      bg-emerald-700
                      text-white
                      shadow-sm
                      `
                      :
                      `
                      text-emerald-50/80
                      hover:bg-white/10
                      hover:text-white
                      `
                    }
                    `
                  }
                >

                  <Icon
                    size={18}
                    strokeWidth={2}
                  />

                  {label}

                </NavLink>


              )


              :

              (

                <div
                  key={to}
                  title="
                  Modul ini akan diaktifkan pada fase pengembangan berikutnya
                  "
                  className="
                    flex
                    cursor-not-allowed
                    items-center
                    justify-between
                    gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    text-emerald-100/45
                  "
                >

                  <span
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <Icon
                      size={18}
                      strokeWidth={2}
                    />

                    {label}

                  </span>


                  <span
                    className="
                      rounded-full
                      bg-white/10
                      px-1.5
                      py-0.5
                      text-[10px]
                      font-semibold
                      text-emerald-50/80
                    "
                  >
                    Segera
                  </span>


                </div>

              )

            )
          )
        }

      </nav>





      {/* FOOTER */}

      <div
        className="
          border-t
          border-white/10
          px-4
          py-4
          text-[11px]
          text-emerald-100/60
        "
      >
        Modul operasional aktif
      </div>


      </aside>
    </>

  );
}