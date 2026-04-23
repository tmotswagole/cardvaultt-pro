import React, { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import {
  FileText, Download, Calendar, Filter,
  BarChart3, PieChart, TrendingUp, ChevronRight,
  Printer, Mail, Clock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>('Inventory Snapshot');

  const reportCategories = [
    {
      name: 'Inventory Reports',
      items: ['Stock Snapshot', 'Ageing Analysis', 'Branch Reconciliation']
    },
    {
      name: 'Issuance Reports',
      items: ['Daily Issuance Summary', 'Monthly Trends', 'Issuance by Branch']
    },
    {
      name: 'Exception Reports',
      items: ['Near-Expiry Cards', 'Low Stock Alerts', 'Override Usage']
    }
  ];

  const mockChartData = [
    { name: 'Gaborone', value: 450 },
    { name: 'Francistown', value: 300 },
    { name: 'Maun', value: 200 },
    { name: 'Kasane', value: 120 },
    { name: 'Lobatse', value: 180 },
  ];

  return (
    <AppShell title="Reports & Analytics">
      <div className="flex h-[calc(100vh-140px)] gap-6">
        {/* Left Sidebar: Report List */}
        <div className="w-72 bg-white rounded-lg border border-ab-border shadow-sm flex flex-col">
          <div className="p-4 border-b border-ab-border bg-ab-surface">
            <h3 className="text-xs font-bold text-ab-muted uppercase tracking-widest">Report Catalogue</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
             {reportCategories.map((cat) => (
               <div key={cat.name} className="mb-4">
                 <p className="px-3 py-2 text-[10px] font-bold text-ab-red uppercase tracking-tighter">{cat.name}</p>
                 <div className="space-y-1">
                   {cat.items.map((item) => (
                     <button
                        key={item}
                        onClick={() => setSelectedReport(item)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group ${
                          selectedReport === item ? 'bg-ab-navy text-white' : 'text-ab-text hover:bg-ab-surface'
                        }`}
                     >
                       <span>{item}</span>
                       <ChevronRight size={14} className={selectedReport === item ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                     </button>
                   ))}
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Main Content: Report Configuration & Preview */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
           {selectedReport ? (
             <>
               {/* Config Panel */}
               <div className="bg-white p-6 rounded-lg border border-ab-border shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-ab-navy">{selectedReport}</h2>
                      <p className="text-sm text-ab-text-light">Generate and export {selectedReport.toLowerCase()} for all branches.</p>
                    </div>
                    <div className="flex gap-2">
                       <button className="btn-secondary flex items-center gap-2">
                          <Mail size={16} /> Schedule
                       </button>
                       <button className="btn-primary flex items-center gap-2">
                          <FileText size={16} /> Generate Report
                       </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-ab-muted uppercase mb-2">Date Range</label>
                      <button className="input-field flex items-center justify-between bg-white text-left">
                        <span>Last 30 Days</span>
                        <Calendar size={14} className="text-ab-muted" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ab-muted uppercase mb-2">Branch</label>
                      <select className="input-field">
                        <option>All Branches</option>
                        <option>Gaborone Main</option>
                        <option>Francistown</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ab-muted uppercase mb-2">Card Type</label>
                      <select className="input-field">
                        <option>All Types</option>
                        <option>Visa Debit</option>
                        <option>Mastercard Debit</option>
                      </select>
                    </div>
                  </div>
               </div>

               {/* Preview Area */}
               <div className="bg-white p-6 rounded-lg border border-ab-border shadow-sm flex-1 min-h-[400px] flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                     <h4 className="font-bold text-ab-navy uppercase text-xs tracking-widest">Live Preview Data</h4>
                     <div className="flex gap-2">
                        <button className="p-1.5 text-ab-muted hover:text-ab-navy border rounded hover:bg-ab-surface transition-colors"><Printer size={16} /></button>
                        <button className="p-1.5 text-ab-muted hover:text-ab-navy border rounded hover:bg-ab-surface transition-colors"><Download size={16} /></button>
                     </div>
                  </div>

                  <div className="h-64 w-full mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={mockChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF1F5" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} fontWeight={600} tick={{fill: '#8E96A8'}} />
                          <YAxis axisLine={false} tickLine={false} fontSize={11} fontWeight={600} tick={{fill: '#8E96A8'}} />
                          <Tooltip cursor={{fill: '#F7F8FA'}} contentStyle={{borderRadius: '8px', border: '1px solid #DDE1EA'}} />
                          <Bar dataKey="value" fill="#CC0001" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="overflow-x-auto border rounded-lg border-ab-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-ab-surface text-ab-navy text-[11px] uppercase font-bold border-b border-ab-border">
                        <tr>
                          <th className="px-4 py-3">Branch Name</th>
                          <th className="px-4 py-3">Opening Stock</th>
                          <th className="px-4 py-3">Issued</th>
                          <th className="px-4 py-3">Closing Stock</th>
                          <th className="px-4 py-3 text-right">Run Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ab-border">
                        {mockChartData.map((row, i) => (
                          <tr key={i} className="hover:bg-ab-surface transition-colors">
                            <td className="px-4 py-2.5 font-bold text-ab-navy">{row.name}</td>
                            <td className="px-4 py-2.5 font-mono">500</td>
                            <td className="px-4 py-2.5 font-mono text-ab-red">-{500 - row.value}</td>
                            <td className="px-4 py-2.5 font-mono font-bold text-ab-success">{row.value}</td>
                            <td className="px-4 py-2.5 text-right font-medium">12.5%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
             </>
           ) : (
             <div className="flex-1 bg-white rounded-lg border-2 border-dashed border-ab-border flex flex-col items-center justify-center p-12 text-center">
                <FileText size={64} className="text-ab-navy/10 mb-4" />
                <h3 className="text-lg font-bold text-ab-navy">No Report Selected</h3>
                <p className="text-ab-text-light text-sm max-w-xs mt-2">Choose a report from the catalogue on the left to configure and generate it.</p>
             </div>
           )}
        </div>

        {/* Recent Activity: Floating Panel */}
        <div className="w-64 space-y-4">
           <div className="bg-ab-navy text-white p-5 rounded-lg shadow-lg">
             <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
               <Clock size={16} className="text-ab-red" />
               <h4 className="text-xs font-bold uppercase tracking-widest">Recent Activity</h4>
             </div>
             <div className="space-y-4">
                {[
                  { name: 'Stock_Snapshot.pdf', time: '10m ago' },
                  { name: 'Issuance_Summary.xlsx', time: '2h ago' },
                  { name: 'Regulatory_Return.pdf', time: 'Yesterday' },
                ].map((r, i) => (
                  <div key={i} className="group cursor-pointer">
                    <p className="text-xs font-bold truncate group-hover:text-ab-red transition-colors">{r.name}</p>
                    <p className="text-[10px] text-white/50">{r.time}</p>
                  </div>
                ))}
             </div>
           </div>

           <div className="bg-ab-warning p-5 rounded-lg text-white">
             <TrendingUp size={24} className="mb-4 opacity-50" />
             <h4 className="text-sm font-bold leading-tight">Demand Forecast Ready</h4>
             <p className="text-[11px] opacity-80 mt-2">New monthly projections available based on Francistown issuance trend.</p>
             <button className="mt-4 text-[11px] font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 py-1 px-3 rounded block w-full text-center transition-all">View Insights</button>
           </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Reports;
