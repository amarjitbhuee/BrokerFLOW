
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  Handshake, 
  LogOut,
  BarChart3,
  Archive
} from 'lucide-react';
import { Profile } from '../types.ts';

interface LayoutProps {
  user: Profile;
}

const NavItem: React.FC<{ to: string, icon: React.ElementType, label: string }> = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-indigo-50 text-indigo-700' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`
    }
  >
    <Icon className="h-5 w-5" />
    {label}
  </NavLink>
);

const Layout: React.FC<LayoutProps> = ({ user }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">PropTrack</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/listings" icon={Home} label="Listings" />
          <NavItem to="/pendings" icon={Handshake} label="Pendings" />
          <NavItem to="/closed" icon={Archive} label="Closed" />
          <NavItem to="/finances" icon={BarChart3} label="Finances" />
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-semibold">
              {user.full_name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.full_name}</p>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{user.role}</p>
            </div>
          </div>
          <button className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="pl-64 flex-1">
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
           <h1 className="text-lg font-semibold text-slate-800">PropTrack Pro</h1>
           <div className="flex items-center gap-4">
             <button className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
               Support
             </button>
           </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
