import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, CreditCard, ArrowLeftRight,
  FileText, History, Users, Settings, LogOut, Menu, X, Bell, ChevronDown, Activity, Building2
} from 'lucide-react';
import { useAuthStore, Role } from '../../store/authStore';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { RoleGuard } from '../ui/cardvault/RoleGuard';

interface AppShellProps {
  children: React.ReactNode;
  title: string;
}

const AppShell: React.FC<AppShellProps> = ({ children, title }) => {
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['TELLER', 'BR_MANAGER', 'CARD_OPS', 'SYS_ADMIN', 'AUDITOR'] },
    { name: 'Inventory', icon: Package, path: '/inventory', roles: ['TELLER', 'BR_MANAGER', 'CARD_OPS', 'SYS_ADMIN', 'AUDITOR'] },
    { name: 'Card Issuance', icon: CreditCard, path: '/issuance/new', roles: ['TELLER', 'BR_MANAGER', 'CARD_OPS', 'SYS_ADMIN'] },
    { name: 'Transfers', icon: ArrowLeftRight, path: '/transfers', roles: ['TELLER', 'BR_MANAGER', 'CARD_OPS', 'SYS_ADMIN', 'AUDITOR'] },
    { name: 'Reports', icon: FileText, path: '/reports', roles: ['BR_MANAGER', 'CARD_OPS', 'SYS_ADMIN', 'AUDITOR'] },
    { name: 'Audit Log', icon: History, path: '/audit', roles: ['BR_MANAGER', 'CARD_OPS', 'SYS_ADMIN', 'AUDITOR'] },
    { name: 'System Health', icon: Activity, path: '/admin/health', roles: ['SYS_ADMIN'] },
    { name: 'Users', icon: Users, path: '/admin/users', roles: ['SYS_ADMIN'] },
    { name: 'Settings', icon: Settings, path: '/admin/settings', roles: ['SYS_ADMIN'] },
  ];

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex bg-ab-surface">
      {/* Sidebar */}
      <aside
        className={`bg-ab-navy text-white transition-all duration-300 flex flex-col flex-shrink-0 ${
          collapsed ? 'w-16' : 'w-[240px]'
        }`}
      >
        <div className="h-14 flex items-center px-4 border-b border-white/10">
          <div className="bg-white rounded p-1 mr-3 flex-shrink-0">
             <div className="w-6 h-6 bg-ab-red flex items-center justify-center text-white font-bold text-lg">a</div>
          </div>
          {!collapsed && <span className="font-bold text-lg tracking-tight">CardVault <span className="text-ab-red">Pro</span></span>}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto" aria-label="Main navigation">
          {navItems.map((item) => (
            <RoleGuard key={item.name} allowedRoles={item.roles as Role[]}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 transition-colors relative group ${
                    isActive
                      ? 'text-ab-red bg-ab-navy-light/10 border-l-4 border-ab-red'
                      : 'text-white/70 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                  }`
                }
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && <span className="ml-3 font-medium text-sm">{item.name}</span>}
                {collapsed && (
                   <div className="absolute left-14 bg-ab-navy text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                     {item.name}
                   </div>
                )}
              </NavLink>
            </RoleGuard>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-ab-red flex items-center justify-center text-xs font-bold">
              {user.full_name.split(' ').map(n => n[0]).join('')}
            </div>
            {!collapsed && (
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-xs font-semibold truncate">{user.full_name}</p>
                <p className="text-[10px] text-white/50 truncate uppercase tracking-wider">{user.role.replace('_', ' ')}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={logout}
              className="mt-4 w-full flex items-center text-xs text-white/60 hover:text-white transition-colors"
            >
              <LogOut size={16} />
              <span className="ml-2">Sign Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 bg-white border-b border-ab-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 mr-4 text-ab-muted hover:text-ab-navy transition-colors rounded-md hover:bg-ab-surface"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-bold text-ab-navy">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-1 text-ab-muted hover:text-ab-navy relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-ab-red rounded-full border-2 border-white"></span>
              </button>
            </div>

            <RoleGuard allowedRoles={['CARD_OPS', 'SYS_ADMIN']}>
              <div className="flex items-center gap-2 border-l pl-4 ml-2 border-ab-border cursor-pointer hover:bg-ab-surface p-1 rounded transition-colors">
                 <Building2 size={16} className="text-ab-red" />
                 <span className="text-xs font-bold text-ab-navy">All Branches</span>
                 <ChevronDown size={14} className="text-ab-muted" />
              </div>
            </RoleGuard>
            <RoleGuard allowedRoles={['TELLER', 'BR_MANAGER', 'AUDITOR']}>
              <div className="flex items-center gap-2 border-l pl-4 ml-2 border-ab-border">
                 <span className="text-xs font-medium text-ab-muted">{user.branch_id}</span>
              </div>
            </RoleGuard>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
