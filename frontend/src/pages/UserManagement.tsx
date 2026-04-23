import React, { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import {
  Users, UserPlus, Search, Edit3, Shield,
  UserMinus, CheckCircle, XCircle, MoreVertical, X,
  ShieldAlert, Mail, MapPin
} from 'lucide-react';
import { StatusChip } from '../components/ui/cardvault/StatusChip';
import { RoleGuard } from '../components/ui/cardvault/RoleGuard';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users/');
      return res.data;
    }
  });

  return (
    <AppShell title="System User Management">
      <div className="space-y-6">
        {/* Top Controls */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-ab-border shadow-sm">
           <div className="w-96 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ab-muted" size={18} />
              <input
                type="text"
                placeholder="Search staff by name or employee ID..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button onClick={() => setShowAddUser(true)} className="btn-primary flex items-center gap-2">
             <UserPlus size={18} /> Add New Staff Member
           </button>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-lg border border-ab-border shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-ab-navy text-white text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3">Employee ID</th>
                <th className="px-5 py-3">Full Name</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Branch</th>
                <th className="px-5 py-3">Last Login</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ab-border">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-5 py-4"><div className="h-4 bg-ab-surface rounded w-full"></div></td>
                  </tr>
                ))
              ) : users?.map((user: any) => (
                <tr key={user.id} className="hover:bg-ab-navy-light/20 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-ab-navy">{user.employee_id}</td>
                  <td className="px-5 py-3">
                     <div className="font-semibold text-ab-navy">{user.full_name}</div>
                     <div className="text-[10px] text-ab-muted">staff.email@accessbank.co.bw</div>
                  </td>
                  <td className="px-5 py-3">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      user.role === 'SYS_ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      user.role === 'CARD_OPS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      <Shield size={10} />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ab-text-light">{user.branch_id}</td>
                  <td className="px-5 py-3 text-xs text-ab-muted">
                    {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-5 py-3">
                    <StatusChip status={user.status.toLowerCase()} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-1.5 text-ab-muted hover:text-ab-navy transition-colors"><Edit3 size={16} /></button>
                       <button className="p-1.5 text-ab-muted hover:text-ab-red transition-colors"><UserMinus size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Drawer */}
      {showAddUser && (
        <>
          <div className="fixed inset-0 bg-ab-navy/40 backdrop-blur-sm z-40" onClick={() => setShowAddUser(false)}></div>
          <div className="fixed right-0 top-0 h-full w-[450px] bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-ab-border flex justify-between items-center bg-ab-surface-2">
              <h3 className="text-lg font-bold text-ab-navy">Provision New User</h3>
              <button onClick={() => setShowAddUser(false)} className="text-ab-muted hover:text-ab-red transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
               <div className="bg-ab-info-bg border border-ab-info/20 p-4 rounded-lg flex gap-3">
                 <ShieldAlert className="text-ab-info flex-shrink-0" size={20} />
                 <p className="text-xs text-ab-info font-medium leading-relaxed">
                   Users must exist in the Bank's Active Directory (LDAP) before being provisioned here. The Employee ID is the primary sync key.
                 </p>
               </div>

               <div className="space-y-4">
                 <div>
                   <label className="block text-xs font-bold text-ab-muted uppercase mb-2">Employee ID</label>
                   <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-ab-muted" size={16} />
                      <input type="text" className="input-field pl-10" placeholder="e.g. ACC-2026-99" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-ab-muted uppercase mb-2">Full Name</label>
                   <input type="text" className="input-field" placeholder="Firstname Lastname" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ab-muted uppercase mb-2">System Role</label>
                      <select className="input-field">
                        <option>TELLER</option>
                        <option>BR_MANAGER</option>
                        <option>CARD_OPS</option>
                        <option>AUDITOR</option>
                        <option>SYS_ADMIN</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ab-muted uppercase mb-2">Branch</label>
                      <select className="input-field">
                        <option>Gaborone Main</option>
                        <option>Francistown</option>
                        <option>Head Office</option>
                      </select>
                    </div>
                 </div>
               </div>

               <div className="pt-8 space-y-3">
                 <button className="btn-primary w-full h-11">Create System Access</button>
                 <button onClick={() => setShowAddUser(false)} className="btn-secondary w-full h-11">Cancel</button>
               </div>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
};

export default UserManagement;
