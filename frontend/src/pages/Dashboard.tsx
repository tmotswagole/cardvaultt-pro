import React from 'react';
import AppShell from '../components/layout/AppShell';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import {
  TrendingUp, TrendingDown, Package, CreditCard,
  AlertTriangle, Clock, ChevronRight, ArrowLeftRight
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { StatusChip } from '../components/ui/cardvault/StatusChip';
import { useAuthStore } from '../store/authStore';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  const { data: kpis } = useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      const res = await api.get('/dashboard/kpis');
      return res.data;
    }
  });

  const { data: exceptions } = useQuery({
    queryKey: ['exceptions'],
    queryFn: async () => {
      const res = await api.get('/dashboard/exceptions');
      return res.data;
    }
  });

  return (
    <AppShell title="Operations Dashboard">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpis?.map((kpi: any) => (
            <div key={kpi.name} className="bg-white p-5 rounded-lg border border-ab-border shadow-sm flex flex-col h-[140px]" aria-label={`${kpi.name}: ${kpi.value}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-ab-muted uppercase tracking-wider">{kpi.name}</span>
                <div className={`flex items-center text-[11px] font-bold ${kpi.delta >= 0 ? 'text-ab-success' : 'text-ab-red'}`}>
                  {kpi.delta >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                  {Math.abs(kpi.delta)}%
                </div>
              </div>
              <div className="text-2xl font-bold text-ab-navy mb-auto">{kpi.value.toLocaleString()}</div>
              <div className="h-10 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kpi.trend.map((v: number, i: number) => ({ v, i }))}>
                    <Line type="monotone" dataKey="v" stroke={kpi.delta >= 0 ? '#1A7A4A' : '#CC0001'} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main Table Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg border border-ab-border shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-ab-border flex justify-between items-center">
                <h3 className="font-bold text-ab-navy flex items-center gap-2">
                  <Package size={18} className="text-ab-red" />
                  Branch Stock Overview
                </h3>
                <button className="text-xs text-ab-red font-semibold hover:underline">View Full Inventory</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-ab-navy text-white text-[11px] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-5 py-3">Branch</th>
                      <th className="px-5 py-3">Card Type</th>
                      <th className="px-5 py-3 text-right">In Stock</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ab-border">
                    {[
                      { branch: 'Gaborone Main', type: 'Visa Debit', stock: 147, status: 'IN_VAULT' },
                      { branch: 'Francistown', type: 'Mastercard Debit', stock: 20, status: 'ALLOCATED' },
                      { branch: 'Maun Branch', type: 'Visa Debit', stock: 85, status: 'IN_VAULT' },
                      { branch: 'Kasane Branch', type: 'Prepaid', stock: 5, status: 'EXPIRED' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-ab-navy-light/20 transition-colors group cursor-pointer">
                        <td className="px-5 py-3 font-medium text-ab-navy">{row.branch}</td>
                        <td className="px-5 py-3 text-ab-text-light">{row.type}</td>
                        <td className="px-5 py-3 text-right font-mono font-bold text-ab-navy">{row.stock}</td>
                        <td className="px-5 py-3">
                           <StatusChip status={row.status as any} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-ab-navy-light/20 p-6 rounded-lg border border-ab-navy-light flex items-center justify-between">
              <div>
                <h4 className="font-bold text-ab-navy mb-1">New Issuance Workflow</h4>
                <p className="text-sm text-ab-text-light">Start a new card issuance for a customer.</p>
              </div>
              <button className="btn-primary flex items-center gap-2">
                 <CreditCard size={18} />
                 Issue New Card
              </button>
            </div>
          </div>

          {/* Side Feed Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-ab-border shadow-sm overflow-hidden">
               <div className="px-5 py-4 border-b border-ab-border bg-ab-surface-2 flex items-center gap-2">
                 <AlertTriangle size={18} className="text-ab-red" />
                 <h3 className="font-bold text-ab-navy">Exception Feed</h3>
               </div>
               <div className="divide-y divide-ab-border">
                  {exceptions?.length === 0 ? (
                    <div className="p-8 text-center text-ab-muted text-sm">
                      No active exceptions
                    </div>
                  ) : exceptions?.map((ex: any) => (
                    <div key={ex.id} className="p-4 hover:bg-ab-surface transition-colors cursor-pointer group">
                      <div className="flex gap-3">
                        <div className={`mt-0.5 p-1.5 rounded-full ${ex.severity === 'RED' ? 'bg-ab-red-light text-ab-red' : 'bg-ab-warning-bg text-ab-warning'}`}>
                          {ex.severity === 'RED' ? <AlertTriangle size={14} /> : <Clock size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-ab-navy uppercase tracking-tight">{ex.type}</span>
                            <span className="text-[10px] text-ab-muted font-mono">2h ago</span>
                          </div>
                          <p className="text-xs text-ab-text-light line-clamp-2">{ex.description}</p>
                          <div className="mt-2 flex items-center text-[10px] text-ab-red font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                            Resolve <ChevronRight size={12} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded-lg border border-ab-border shadow-sm overflow-hidden">
               <div className="px-5 py-4 border-b border-ab-border bg-ab-surface-2 flex items-center gap-2">
                 <ArrowLeftRight size={18} className="text-ab-navy" />
                 <h3 className="font-bold text-ab-navy">Pending Approvals</h3>
               </div>
               <div className="p-5 space-y-4">
                  {[
                    { type: 'Transfer', ref: 'TRF-00123', from: 'HO', to: 'Maun' },
                    { type: 'Destruction', ref: 'DST-449', branch: 'Francistown' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-ab-surface p-3 rounded-md border border-ab-border">
                      <div>
                        <div className="text-[10px] font-bold text-ab-muted uppercase tracking-wider">{item.type}</div>
                        <div className="text-sm font-bold text-ab-navy">{item.ref}</div>
                      </div>
                      <button className="text-xs btn-primary px-3 py-1">Review</button>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
