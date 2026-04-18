import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3, Plus, Search, X, Edit3, Trash2, ArrowLeft,
  Target, Activity, AlertTriangle, ShieldAlert, Cpu
} from 'lucide-react';
import { db } from '../db/db';
import {
  SmartKPI, calculateActualValue, getKpiColor, DEFAULT_KPIS
} from '../utils/kpiEngine';

interface Props { onNavigate?: (page: string, params?: any) => void; params?: any; }

export function KPIModule({ onNavigate }: Props) {
  const [kpis, setKpis] = useState<SmartKPI[]>([]);
  const [form, setForm] = useState<Partial<SmartKPI>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = React.useMemo(() => ({
    total: kpis.length,
    active: kpis.filter(k => k.status === 'Active').length,
    production: kpis.filter(k => k.kpiCategory === 'Production Quality').length,
    auto: kpis.filter(k => k.autoDataFetch).length
  }), [kpis]);

  const filteredKpis = React.useMemo(() => {
    return kpis.filter(k => 
      k.kpiName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      k.dataSourceModule.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [kpis, searchQuery]);

  // Initialize and Load
  const loadData = useCallback(async () => {
    let all = await db.kpiRecords.toArray() as any[];
    
    // Check for legacy shape, and wipe if found to do clean switchover to Smart KPIs
    const hasLegacy = all.length > 0 && all.some(k => k.warningThreshold === undefined);
    if (hasLegacy) {
      await db.kpiRecords.clear();
      all = [];
    }

    // Seed default smart KPIs if none exist
    if (all.length === 0) {
       for (const dk of DEFAULT_KPIS) {
         const newKpi = {
           id: `KPI-${crypto.randomUUID()}`,
           ...dk,
           createdAt: new Date().toISOString(), createdBy: 'System', updatedAt: new Date().toISOString(), updatedBy: 'System',
           history: []
         } as SmartKPI;
         await db.kpiRecords.add(newKpi as any);
       }
       all = await db.kpiRecords.toArray() as SmartKPI[];
    }

    // Auto-calculate current values
    const enriched = await Promise.all((all as SmartKPI[]).map(async k => {
      const calcVal = await calculateActualValue(k);
      return { ...k, currentValue: calcVal, trend: calcVal > k.targetValue ? 1 : calcVal < k.targetValue ? -1 : 0 };
    }));
    
    setKpis(enriched);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Handle Save
  const handleSave = async () => {
    if (isEditing && form.id) {
       await db.kpiRecords.put({ ...form as SmartKPI, updatedAt: new Date().toISOString() } as any);
    } else {
       await db.kpiRecords.add({
         ...form,
         id: `KPI-${crypto.randomUUID()}`,
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString()
       } as any);
    }
    await loadData();
    setForm({});
    setIsEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 space-y-8 min-h-full">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <Cpu className="w-8 h-8 text-accent" />
            KPI Management
          </h1>
          <p className="text-text-2 text-base mt-2">Configure Smart Engine Rules and Metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setForm({ autoDataFetch: true, kpiCategory: 'Production Quality', calculationFrequency: 'Daily', status: 'Active' }); setIsEditing(false); }} className="btn btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add KPI Rule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Metrics', value: stats.total, icon: BarChart3, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Active Live', value: stats.active, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Production KPIs', value: stats.production, icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Auto Calculated', value: stats.auto, icon: Cpu, color: 'text-purple-main', bg: 'bg-purple-main/10' },
        ].map((stat, idx) => (
          <motion.div key={idx} className="bg-bg-1 border border-border-main rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-2 mb-1">{stat.label}</div>
              <div className="text-3xl font-bold text-text-1 tracking-tight">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-bg-1 p-3 rounded-2xl border border-border-main shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-2" />
          <input 
            type="text" 
            placeholder="Search KPIs, modules..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      {/* ── KPI MANAGEMENT VIEW ── */}
      <div className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm p-0">
        {/* Configuration Grid */}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-main text-[10px] uppercase tracking-wider text-text-3 font-black">
                  <th className="pb-3 px-4">KPI Metric</th>
                  <th className="pb-3 px-4">Source Module</th>
                  <th className="pb-3 px-4 text-center">Actual Value</th>
                  <th className="pb-3 px-4">Target / Warn / Crit</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {filteredKpis.map(kpi => (
                  <tr key={kpi.id} className="hover:bg-bg-2/60 transition-all duration-200 group">
                    <td className="py-4 px-4 font-bold text-text-1">{kpi.kpiName}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {kpi.autoDataFetch ? <Activity className="w-3.5 h-3.5 text-green-500"/> : <ShieldAlert className="w-3.5 h-3.5 text-amber-500"/>}
                        {kpi.dataSourceModule}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-black text-[13px]">{kpi.currentValue ?? '-'}</td>
                    <td className="py-4 px-4 font-mono text-[11px]">{kpi.targetValue} / {kpi.warningThreshold} / {kpi.criticalThreshold}</td>
                    <td className="py-4 px-4"><span className={`px-2 py-1 rounded text-[10px] font-bold ${kpi.status === 'Active' ? 'bg-blue-500/10 text-blue-500' : 'bg-bg-3 text-text-3'}`}>{kpi.status}</span></td>
                    <td className="py-4 px-4 text-right">
                      <button onClick={() => { setForm(kpi); setIsEditing(true); }} className="p-1.5 text-text-3 hover:text-accent transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={async () => { await db.kpiRecords.delete(kpi.id!); loadData(); }} className="p-1.5 text-text-3 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Form Editor Overlay */}
          <AnimatePresence>
            {Object.keys(form).length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="p-6 border-t border-border-main bg-bg-2/30">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-black text-text-1">{isEditing ? 'Edit KPI Engine Rule' : 'New KPI Specification'}</h3>
                  <button onClick={() => setForm({})} className="p-1 text-text-3 hover:text-text-1"><X className="w-5 h-5"/></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                   <div>
                     <label className="text-[10px] font-bold text-text-3 uppercase block mb-1">KPI Name</label>
                     <input value={form.kpiName || ''} onChange={e => setForm({...form, kpiName: e.target.value})} className="w-full bg-bg-2 border border-border-main rounded-lg p-2.5 text-xs text-text-1 font-bold outline-none focus:border-accent" />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-text-3 uppercase block mb-1">Category</label>
                     <select value={form.kpiCategory || ''} onChange={e => setForm({...form, kpiCategory: e.target.value as any})} className="w-full bg-bg-2 border border-border-main rounded-lg p-2.5 text-xs text-text-1 outline-none focus:border-accent">
                        {['Production Quality', 'Inspection Quality', 'Audit Compliance', 'Customer Satisfaction', 'Custom'].map(c => <option key={c}>{c}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-text-3 uppercase block mb-1">Source Module</label>
                     <select value={form.dataSourceModule || ''} onChange={e => setForm({...form, dataSourceModule: e.target.value})} className="w-full bg-bg-2 border border-border-main rounded-lg p-2.5 text-xs text-text-1 outline-none focus:border-accent">
                        {['Inspection', 'Production Quality', 'Audit Management', 'Final Inspection', 'Customer Complaint', 'Manual Data'].map(c => <option key={c}>{c}</option>)}
                     </select>
                   </div>
                   <div className="lg:col-span-3">
                     <label className="text-[10px] font-bold text-text-3 uppercase block mb-1">Calculation Formula Matrix</label>
                     <input value={form.kpiFormula || ''} onChange={e => setForm({...form, kpiFormula: e.target.value})} className="w-full bg-bg-2 border border-border-main rounded-lg p-2.5 text-xs text-text-1 font-mono outline-none focus:border-accent" placeholder="(Value A / Value B) * 100" />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-text-3 uppercase block mb-1">Target Value</label>
                     <input type="number" value={form.targetValue ?? ''} onChange={e => setForm({...form, targetValue: Number(e.target.value)})} className="w-full bg-bg-2 border border-border-main rounded-lg p-2.5 text-xs text-text-1 font-bold outline-none focus:border-accent" />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-amber-500 uppercase block mb-1">Warning Threshold</label>
                     <input type="number" value={form.warningThreshold ?? ''} onChange={e => setForm({...form, warningThreshold: Number(e.target.value)})} className="w-full bg-bg-2 border border-amber-500/30 rounded-lg p-2.5 text-xs text-text-1 outline-none focus:border-amber-500" />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-red-500 uppercase block mb-1">Critical Threshold</label>
                     <input type="number" value={form.criticalThreshold ?? ''} onChange={e => setForm({...form, criticalThreshold: Number(e.target.value)})} className="w-full bg-bg-2 border border-red-500/30 rounded-lg p-2.5 text-xs text-text-1 outline-none focus:border-red-500" />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-text-3 uppercase block mb-1">KPI Status</label>
                     <select value={form.status || 'Active'} onChange={e => setForm({...form, status: e.target.value as any})} className="w-full bg-bg-2 border border-border-main rounded-lg p-2.5 text-xs text-text-1 font-bold outline-none focus:border-accent">
                        <option value="Active">Active (Live in Dashboard)</option>
                        <option value="Inactive">Inactive (Hidden)</option>
                     </select>
                   </div>
                   <div className="flex items-center gap-3 lg:col-span-3 bg-bg-2 p-3 rounded-xl border border-border-main">
                      <input type="checkbox" checked={!!form.autoDataFetch} onChange={e => setForm({...form, autoDataFetch: e.target.checked})} className="w-4 h-4 cursor-pointer accent-accent" />
                      <div>
                        <div className="text-xs font-bold text-text-1">Enable Auto Engine Calculation</div>
                        <div className="text-[10px] text-text-3">If checked, system will fetch live data from the chosen module instead of relying on manual entry.</div>
                      </div>
                   </div>
                   
                   <AnimatePresence>
                      {!form.autoDataFetch && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:col-span-3 bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl">
                          <label className="text-[10px] font-bold text-indigo-500 uppercase block mb-1">Manual Current Value</label>
                          <input type="number" value={form.currentValue ?? ''} onChange={e => setForm({...form, currentValue: Number(e.target.value)})} className="w-full max-w-sm bg-bg-1 border border-indigo-500/30 rounded-lg p-2.5 text-xs text-text-1 font-bold outline-none focus:border-indigo-500" placeholder="Enter captured value..." />
                          <p className="text-[10px] text-indigo-500/80 mt-1.5 font-medium">Since auto calculation is disabled, radar charts will use this manual value.</p>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
                <div className="flex justify-end gap-3">
                   <button onClick={() => setForm({})} className="px-5 py-2 rounded-lg text-xs font-bold bg-bg-2 border border-border-main text-text-2 hover:text-text-1">Cancel</button>
                   <button onClick={handleSave} className="px-5 py-2 rounded-lg text-xs font-bold bg-accent text-white shadow-lg shadow-accent/30 hover:opacity-90">Save Configuration</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </motion.div>
  );
}
