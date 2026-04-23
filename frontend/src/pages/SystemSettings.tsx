import React from 'react';
import AppShell from '../components/layout/AppShell';
import { Settings as SettingsIcon, Shield, Bell, Lock, Database, Globe } from 'lucide-react';

const SystemSettings: React.FC = () => {
  return (
    <AppShell title="System Configuration">
      <div className="max-w-4xl space-y-6">
        <div className="bg-white rounded-lg border border-ab-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-ab-border">
            <h3 className="font-bold text-ab-navy flex items-center gap-2">
              <SettingsIcon size={18} className="text-ab-red" />
              General Settings
            </h3>
          </div>
          <div className="p-6 space-y-6">
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-ab-muted uppercase">System Environment</label>
                  <p className="text-sm font-semibold text-ab-navy">Production (On-Premises)</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-ab-muted uppercase">Base Currency</label>
                  <p className="text-sm font-semibold text-ab-navy">Botswana Pula (BWP)</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-ab-border shadow-sm">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-ab-red-light text-ab-red rounded-lg"><Lock size={20} /></div>
               <h4 className="font-bold text-ab-navy">Security Policy</h4>
             </div>
             <p className="text-xs text-ab-text-light mb-4">Manage password complexity, session timeouts, and multi-factor authentication requirements.</p>
             <button className="text-xs font-bold text-ab-red hover:underline">Configure Security</button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-ab-border shadow-sm">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-ab-info-bg text-ab-info rounded-lg"><Globe size={20} /></div>
               <h4 className="font-bold text-ab-navy">Integration Gateway</h4>
             </div>
             <p className="text-xs text-ab-text-light mb-4">Manage connections to Oracle Flexcube, CMS, and SMS/Email notification providers.</p>
             <button className="text-xs font-bold text-ab-red hover:underline">Manage Integrations</button>
          </div>
        </div>

        <div className="bg-ab-navy text-white p-8 rounded-lg flex items-center justify-between">
           <div className="flex items-center gap-4">
             <Shield size={32} className="text-ab-red" />
             <div>
                <h4 className="text-lg font-bold">System Hardening Active</h4>
                <p className="text-sm opacity-70">CardVault Pro is operating under strict internal network policies.</p>
             </div>
           </div>
           <div className="text-[10px] font-mono opacity-50 text-right">
             LAST SECURITY SWEEP<br/>
             2026-04-23 18:00 CAT
           </div>
        </div>
      </div>
    </AppShell>
  );
};

export default SystemSettings;
