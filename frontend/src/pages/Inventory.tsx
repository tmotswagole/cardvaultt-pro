import React, { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import {
  Search, Filter, Download, X, ChevronDown, Package,
  CreditCard, ArrowLeftRight, AlertTriangle, FileEdit, History as HistoryIcon
} from 'lucide-react';
import { StatusChip } from '../components/ui/cardvault/StatusChip';
import { ExpiryBadge } from '../components/ui/cardvault/ExpiryBadge';
import { RoleGuard } from '../components/ui/cardvault/RoleGuard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory', branchFilter],
    queryFn: async () => {
      const params = branchFilter !== 'All Branches' ? { branch_id: branchFilter } : {};
      const res = await api.get('/inventory/', { params });
      return res.data;
    }
  });

  const heatmapData = [
    { branch: 'Gaborone', green: 400, amber: 120, red: 40 },
    { branch: 'Francistown', green: 210, amber: 80, red: 10 },
    { branch: 'Maun', green: 150, amber: 40, red: 5 },
    { branch: 'Kasane', green: 90, amber: 20, red: 30 },
  ];

  return (
    <AppShell title="Inventory Management">
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-lg border border-ab-border shadow-sm flex flex-wrap items-center gap-4 sticky top-14 z-20">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ab-muted" size={18} />
            <input
              type="text"
              placeholder="Search by Batch ID or Serial Prefix..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              className="input-field w-40"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option>All Branches</option>
              <option value="GBR-001">Gaborone Main</option>
              <option value="FTW-001">Francistown</option>
              <option value="MAU-001">Maun</option>
              <option value="KAS-001">Kasane</option>
            </select>

            <button className="btn-secondary flex items-center gap-2">
              <Filter size={16} />
              Filters
            </button>

            <RoleGuard allowedRoles={['CARD_OPS', 'SYS_ADMIN', 'BR_MANAGER']}>
              <button className="btn-secondary flex items-center gap-2 text-ab-navy">
                <Download size={16} />
                Export CSV
              </button>
            </RoleGuard>
          </div>
        </div>

        {/* Ageing Heatmap Panel */}
        <div className="bg-white rounded-lg border border-ab-border shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-ab-border bg-ab-surface flex justify-between items-center">
             <h3 className="text-sm font-bold text-ab-navy">Stock Ageing Heatmap</h3>
             <button className="text-xs text-ab-muted hover:text-ab-navy"><ChevronDown size={16} /></button>
          </div>
          <div className="p-5 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={heatmapData} layout="vertical" barSize={20}>
                <XAxis type="number" hide />
                <YAxis dataKey="branch" type="category" axisLine={false} tickLine={false} width={100} fontSize={11} fontWeight={600} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="green" stackId="a" fill="#1A7A4A" radius={[0, 0, 0, 0]} />
                <Bar dataKey="amber" stackId="a" fill="#B45309" />
                <Bar dataKey="red" stackId="a" fill="#CC0001" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Main Inventory Table */}
        <div className="bg-white rounded-lg border border-ab-border shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-ab-navy text-white text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3">Batch ID</th>
                <th className="px-5 py-3">Card Type</th>
                <th className="px-5 py-3">Branch</th>
                <th className="px-5 py-3 text-right">Available</th>
                <th className="px-5 py-3">Expiry Band</th>
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
              ) : inventory?.map((batch: any) => (
                <React.Fragment key={batch.id}>
                  <tr
                    onClick={() => setExpandedRow(expandedRow === batch.id ? null : batch.id)}
                    className={`hover:bg-ab-navy-light/20 transition-colors cursor-pointer ${batch.quantity_available === 0 ? 'opacity-60' : ''}`}
                  >
                    <td className="px-5 py-3 font-mono text-ab-navy font-semibold">{batch.id}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {batch.network === 'VISA' ? <div className="w-6 h-4 bg-blue-800 rounded text-[8px] text-white flex items-center justify-center font-bold italic">VISA</div> : <div className="w-6 h-4 bg-red-600 rounded text-[8px] text-white flex items-center justify-center font-bold italic">MC</div>}
                        {batch.card_type.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ab-text-light">{batch.branch_id}</td>
                    <td className="px-5 py-3 text-right font-mono font-bold">{batch.quantity_available}</td>
                    <td className="px-5 py-3">
                      <ExpiryBadge expiryDate={batch.expiry_date} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusChip status={batch.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                       <button className="text-ab-muted hover:text-ab-red"><ChevronDown className={expandedRow === batch.id ? "rotate-180" : ""} size={16} /></button>
                    </td>
                  </tr>
                  {expandedRow === batch.id && (
                    <tr className="bg-ab-surface">
                      <td colSpan={7} className="px-8 py-6">
                        <div className="flex gap-12">
                          <div className="flex-1">
                            <h4 className="text-xs font-bold text-ab-navy uppercase mb-4 flex items-center gap-2">
                              <HistoryIcon size={14} /> Batch History Timeline
                            </h4>
                            <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-ab-border">
                              <div className="flex gap-4 relative">
                                <div className="w-4 h-4 rounded-full bg-ab-success border-2 border-white z-10"></div>
                                <div>
                                  <p className="text-xs font-bold text-ab-navy">Batch Received</p>
                                  <p className="text-[10px] text-ab-muted">2026-01-15 09:30 AM • System Admin</p>
                                  <p className="text-xs text-ab-text-light mt-1">Initial stock of 200 cards received from vendor.</p>
                                </div>
                              </div>
                              <div className="flex gap-4 relative">
                                <div className="w-4 h-4 rounded-full bg-ab-info border-2 border-white z-10"></div>
                                <div>
                                  <p className="text-xs font-bold text-ab-navy">Allocated to Vault</p>
                                  <p className="text-[10px] text-ab-muted">2026-01-15 10:15 AM • System Admin</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-64 space-y-4">
                            <div className="bg-white p-4 rounded border border-ab-border">
                               <p className="text-[10px] text-ab-muted font-bold uppercase mb-2">Detailed Metrics</p>
                               <div className="space-y-2">
                                 <div className="flex justify-between text-xs"><span>Total:</span> <span className="font-bold">{batch.quantity_total}</span></div>
                                 <div className="flex justify-between text-xs"><span>Issued:</span> <span className="font-bold">{batch.quantity_issued}</span></div>
                                 <div className="flex justify-between text-xs"><span>Reference:</span> <span className="font-mono text-[10px]">{batch.vendor_batch_ref}</span></div>
                               </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <RoleGuard allowedRoles={['TELLER', 'BR_MANAGER']}>
                                <button className="btn-primary w-full text-xs py-1.5 flex items-center justify-center gap-2">
                                  <CreditCard size={14} /> Issue Card
                                </button>
                              </RoleGuard>
                              <RoleGuard allowedRoles={['CARD_OPS', 'SYS_ADMIN']}>
                                <button className="btn-secondary w-full text-xs py-1.5 flex items-center justify-center gap-2">
                                  <FileEdit size={14} /> Edit Batch
                                </button>
                              </RoleGuard>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {inventory?.length === 0 && (
            <div className="p-12 text-center">
              <Package size={48} className="mx-auto text-ab-navy/20 mb-4" />
              <p className="text-ab-navy font-bold">No card stock matches your filters</p>
              <button onClick={() => setBranchFilter('All Branches')} className="text-ab-red text-sm font-semibold hover:underline mt-2">Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default Inventory;
