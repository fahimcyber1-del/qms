import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3, Plus, Search, X, Edit3, Trash2, ArrowLeft,
  Target, Activity, AlertTriangle, ShieldAlert, Cpu, Download, Eye
} from 'lucide-react';
import { db } from '../db/db';
import {
  SmartKPI, calculateActualValue, getKpiColor, DEFAULT_KPIS
} from '../utils/kpiEngine';

interface Props { onNavigate?: (page: string, params?: any) => void; params?: any; }

export function KPIModule({ onNavigate }: Props) {
  const [kpis, setKpis] = useState<SmartKPI[]>([]);
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

  // Handlers
  const handleAdd = () => {
    if (onNavigate) onNavigate('kpi-form', { mode: 'create' });
  };

  const handleEdit = (record: SmartKPI) => {
    if (onNavigate) onNavigate('kpi-form', { mode: 'edit', data: record });
  };

  const handleView = (record: SmartKPI) => {
    if (onNavigate) onNavigate('kpi-form', { mode: 'view', data: record });
  };

  const exportSinglePDF = async (record: SmartKPI) => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    await exportDetailToPDF({
      moduleName: 'KPI Performance Report',
      moduleId: 'kpi',
      recordId: record.id || 'N/A',
      fileName: `KPI_${record.kpiName.replace(/\s+/g, '_')}`,
      fields: [
        { label: 'KPI Metric',     value: record.kpiName },
        { label: 'Category',       value: record.kpiCategory },
        { label: 'Source Module',   value: record.dataSourceModule },
        { label: 'Calculations',   value: record.autoDataFetch ? 'Automated Engine' : 'Manual Entry' },
        { label: 'Formula Matrix', value: record.kpiFormula || '—' },
        { label: 'Current Value',  value: String(record.currentValue ?? '0') },
        { label: 'Target Value',   value: String(record.targetValue) },
        { label: 'Warning Threshold', value: String(record.warningThreshold) },
        { label: 'Critical Threshold', value: String(record.criticalThreshold) },
        { label: 'Status',         value: record.status },
      ]
    });
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
          <button onClick={handleAdd} className="btn btn-primary flex items-center gap-2">
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
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleView(kpi)} className="p-1.5 text-text-3 hover:text-emerald-500 transition-colors" title="View Detail"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => exportSinglePDF(kpi)} className="p-1.5 text-text-3 hover:text-indigo-500 transition-colors" title="Download PDF"><Download className="w-4 h-4" /></button>
                        <button onClick={() => handleEdit(kpi)} className="p-1.5 text-text-3 hover:text-accent transition-colors" title="Edit"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={async () => { if(confirm('Delete this KPI rule?')) { await db.kpiRecords.delete(kpi.id!); loadData(); } }} className="p-1.5 text-text-3 hover:text-red-500 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </motion.div>
  );
}
