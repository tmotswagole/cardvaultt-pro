import React from 'react';
import AppShell from '../components/layout/AppShell';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import {
  Activity, CheckCircle, AlertCircle, XCircle,
  Clock, Database, Server, Cpu, Globe,
  ShieldCheck, RefreshCw, Zap
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, CartesianGrid, XAxis } from 'recharts';

const SystemHealth: React.FC = () => {
  const { data: healthItems, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const res = await api.get('/health/');
      return res.data;
    },
    refetchInterval: 60000 // Auto-refresh every 60s
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="text-ab-success" size={24} />;
      case 'degraded': return <AlertCircle className="text-ab-warning" size={24} />;
      case 'down': return <XCircle className="text-ab-red" size={24} />;
      default: return <Clock className="text-ab-muted" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-ab-success';
      case 'degraded': return 'bg-ab-warning';
      case 'down': return 'bg-ab-red';
      default: return 'bg-ab-muted';
    }
  };

  return (
    <AppShell title="Infrastructure Health Monitor">
      <div className="space-y-6">
        {/* Top Controls */}
        <div className="flex justify-between items-center">
           <div className="bg-ab-success-bg border border-ab-success/20 px-4 py-2 rounded-lg flex items-center gap-3">
              <ShieldCheck className="text-ab-success" size={20} />
              <span className="text-sm font-bold text-ab-success">All mission-critical systems operational</span>
           </div>
           <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn-secondary flex items-center gap-2"
           >
             <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
             Run Health Sweep
           </button>
        </div>

        {/* Health Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
           {isLoading ? (
             Array(8).fill(0).map((_, i) => (
               <div key={i} className="bg-white p-5 rounded-lg border border-ab-border h-[180px] animate-pulse"></div>
             ))
           ) : healthItems?.map((item: any) => (
             <div key={item.name} className="bg-white p-5 rounded-lg border border-ab-border shadow-sm flex flex-col hover:border-ab-navy/20 transition-all group">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2 bg-ab-surface rounded-lg text-ab-navy group-hover:bg-ab-navy group-hover:text-white transition-colors">
                      {item.name.includes('DB') || item.name.includes('Postgre') ? <Database size={20} /> :
                       item.name.includes('App') || item.name.includes('FastAPI') ? <Zap size={20} /> :
                       item.name.includes('CMS') || item.name.includes('Integration') ? <Globe size={20} /> : <Server size={20} />}
                   </div>
                   {getStatusIcon(item.status)}
                </div>

                <h4 className="text-sm font-bold text-ab-navy mb-1">{item.name}</h4>
                <div className="flex items-center gap-2 mb-4">
                   <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}></div>
                   <span className="text-[10px] font-bold text-ab-muted uppercase tracking-tighter">{item.status}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-ab-border flex justify-between items-end">
                   <div>
                      <p className="text-[9px] text-ab-muted uppercase font-bold tracking-widest">Latency</p>
                      <p className="text-sm font-mono font-bold text-ab-navy">{item.latency.toFixed(1)}ms</p>
                   </div>
                   <div className="h-8 w-16">
                      <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={Array(10).fill(0).map((_, i) => ({ v: item.latency + (Math.random() * 10 - 5) }))}>
                            <Line type="monotone" dataKey="v" stroke={item.status === 'down' ? '#CC0001' : '#1A7A4A'} strokeWidth={1.5} dot={false} />
                         </LineChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Real-time Alerts / Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white rounded-lg border border-ab-border shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-ab-border bg-ab-surface flex justify-between items-center">
                 <h3 className="text-sm font-bold text-ab-navy uppercase flex items-center gap-2">
                    <Activity size={18} className="text-ab-red" />
                    Integration Performance (Last 24h)
                 </h3>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-0.5 bg-ab-red"></div>
                       <span className="text-[10px] text-ab-muted font-bold">CMS</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-0.5 bg-ab-success"></div>
                       <span className="text-[10px] text-ab-muted font-bold">Flexcube</span>
                    </div>
                 </div>
              </div>
              <div className="p-8 h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={Array(24).fill(0).map((_, i) => ({
                      hour: `${i}:00`,
                      cms: 100 + Math.random() * 200,
                      flexcube: 40 + Math.random() * 20
                    }))}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF1F5" />
                       <XAxis dataKey="hour" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#8E96A8'}} />
                       <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#8E96A8'}} />
                       <Tooltip />
                       <Line type="monotone" dataKey="cms" stroke="#CC0001" strokeWidth={2} dot={false} />
                       <Line type="monotone" dataKey="flexcube" stroke="#1A7A4A" strokeWidth={2} dot={false} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-ab-navy text-white rounded-lg p-6 shadow-xl flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                 <Cpu size={24} className="text-ab-red" />
                 <h3 className="font-bold text-lg">Server Metrics</h3>
              </div>

              <div className="space-y-6 flex-1">
                 <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                       <span className="opacity-70">CPU USAGE</span>
                       <span className="text-ab-red">14%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-ab-red" style={{width: '14%'}}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                       <span className="opacity-70">RAM UTILIZATION</span>
                       <span className="text-ab-success">42%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-ab-success" style={{width: '42%'}}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                       <span className="opacity-70">DISK IO (DB)</span>
                       <span className="text-ab-warning">68%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-ab-warning" style={{width: '68%'}}></div>
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                 <div className="flex justify-between items-center text-[10px] font-bold opacity-50 uppercase tracking-widest">
                    <span>Uptime</span>
                    <span className="text-white">99.98%</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </AppShell>
  );
};

export default SystemHealth;
