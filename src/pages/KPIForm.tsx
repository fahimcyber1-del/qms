import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, Cpu, Target, Activity, 
  BarChart3, AlertTriangle, ShieldAlert, Zap, FileText, Info, Download, Eye
} from 'lucide-react';
import { db } from '../db/db';
import { SmartKPI, calculateActualValue } from '../utils/kpiEngine';

interface Props {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

export function KPIForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};

  const [formData, setFormData] = useState<Partial<SmartKPI>>({
    id: initialData.id || `KPI-${crypto.randomUUID()}`,
    kpiName: initialData.kpiName || '',
    kpiCategory: initialData.kpiCategory || 'Production Quality',
    kpiFormula: initialData.kpiFormula || '',
    targetValue: initialData.targetValue || 0,
    warningThreshold: initialData.warningThreshold || 0,
    criticalThreshold: initialData.criticalThreshold || 0,
    dataSourceModule: initialData.dataSourceModule || 'Production Quality',
    calculationFrequency: initialData.calculationFrequency || 'Daily',
    autoDataFetch: initialData.autoDataFetch ?? true,
    status: initialData.status || 'Active',
    currentValue: initialData.currentValue || 0
  });

  const isReadOnly = mode === 'view';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      const payload = {
        ...formData,
        updatedAt: new Date().toISOString(),
        updatedBy: 'System Admin'
      };

      if (mode === 'create') {
        await db.kpiRecords.add({
          ...payload,
          createdAt: new Date().toISOString(),
          createdBy: 'System Admin',
          history: []
        } as any);
      } else {
        await db.kpiRecords.put(payload as any);
      }
      onNavigate('kpi');
    } catch (error) {
      console.error('Error saving KPI:', error);
      alert('Failed to save KPI configuration.');
    }
  };

  const exportPDF = async () => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    await exportDetailToPDF({
      moduleName: 'KPI Performance Report',
      moduleId: 'kpi',
      recordId: formData.id || 'N/A',
      fileName: `KPI_${(formData.kpiName || 'Unnamed').replace(/\s+/g, '_')}`,
      sections: [
        {
          title: '01. Metric Identification',
          fields: [
            { label: 'KPI Name',        value: formData.kpiName || '—' },
            { label: 'Category Group',  value: formData.kpiCategory || '—' },
            { label: 'Source Module',   value: formData.dataSourceModule || '—' },
          ]
        },
        {
          title: '02. Engine & Formula',
          fields: [
            { label: 'Calculation Formula', value: formData.kpiFormula || '—', fullWidth: true },
            { label: 'Processing Mode',     value: formData.autoDataFetch ? 'Autonomous Processing' : 'Manual Entry' },
            { label: 'Update Frequency',    value: formData.calculationFrequency || '—' },
          ]
        },
        {
          title: '03. Performance Bounds',
          fields: [
            { label: 'Optimal Target',      value: String(formData.targetValue) },
            { label: 'Warning Threshold',   value: String(formData.warningThreshold) },
            { label: 'Critical Alert',      value: String(formData.criticalThreshold) },
            { label: 'Current Performance', value: String(formData.currentValue ?? '0'), fullWidth: true },
          ]
        }
      ]
    });
  };

  const inputClass = "w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('kpi')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-accent" />
              {mode === 'create' ? 'Create KPI Rule' : mode === 'edit' ? 'Update KPI Rule' : 'KPI Specification'}
            </h2>
            <p className="text-text-3 text-[10px] font-mono mt-1 tracking-wider uppercase">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportPDF} className="btn bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-4 flex items-center gap-2 hover:bg-indigo-500/20">
            <Download className="w-4 h-4" /> Export Report
          </button>
          {!isReadOnly && (
            <button onClick={handleSave} className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Identification */}
          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-6">
            <h3 className="text-sm font-black text-text-1 uppercase tracking-widest flex items-center gap-2 border-b border-border-main pb-4">
              <Target className="w-4 h-4 text-accent" /> 01. Rule Identification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-text-2 uppercase">KPI Metric Name</label>
                <input 
                  type="text" disabled={isReadOnly}
                  className={inputClass}
                  value={formData.kpiName}
                  onChange={e => setFormData(p => ({ ...p, kpiName: e.target.value }))}
                  placeholder="e.g. DHU, First Pass Yield, Customer Satisfaction Rate"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-2 uppercase">Category</label>
                <select 
                  disabled={isReadOnly}
                  className={inputClass}
                  value={formData.kpiCategory}
                  onChange={e => setFormData(p => ({ ...p, kpiCategory: e.target.value as any }))}
                >
                  {['Production Quality', 'Inspection Quality', 'Audit Compliance', 'Customer Satisfaction', 'Custom'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-2 uppercase">Data Source Module</label>
                <select 
                  disabled={isReadOnly}
                  className={inputClass}
                  value={formData.dataSourceModule}
                  onChange={e => setFormData(p => ({ ...p, dataSourceModule: e.target.value }))}
                >
                  {['Inspection', 'Production Quality', 'Audit Management', 'Final Inspection', 'Customer Complaint', 'Manual Data'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Calculation Engine */}
          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-6">
            <h3 className="text-sm font-black text-text-1 uppercase tracking-widest flex items-center gap-2 border-b border-border-main pb-4">
              <Zap className="w-4 h-4 text-accent" /> 02. Engine Configuration
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-2 uppercase">Calculation Formula Matrix</label>
                <input 
                  type="text" disabled={isReadOnly}
                  className={`${inputClass} font-mono`}
                  value={formData.kpiFormula}
                  onChange={e => setFormData(p => ({ ...p, kpiFormula: e.target.value }))}
                  placeholder="(Value A / Value B) * 100"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                  <label className="text-xs font-bold text-text-2 uppercase">Calculation Frequency</label>
                  <select 
                    disabled={isReadOnly}
                    className={inputClass}
                    value={formData.calculationFrequency}
                    onChange={e => setFormData(p => ({ ...p, calculationFrequency: e.target.value as any }))}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-2 uppercase">Activation Status</label>
                  <select 
                    disabled={isReadOnly}
                    className={inputClass}
                    value={formData.status}
                    onChange={e => setFormData(p => ({ ...p, status: e.target.value as any }))}
                  >
                    <option value="Active">Active (Live in Dashboard)</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="bg-bg-2 p-5 rounded-2xl border border-border-main space-y-4">
                 <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      disabled={isReadOnly}
                      id="auto-fetch"
                      className="w-5 h-5 rounded-lg accent-accent cursor-pointer"
                      checked={!!formData.autoDataFetch}
                      onChange={e => setFormData(p => ({ ...p, autoDataFetch: e.target.checked }))}
                    />
                    <label htmlFor="auto-fetch" className="cursor-pointer">
                       <div className="text-sm font-black text-text-1">Enable Autonomous Data Fetching</div>
                       <div className="text-[11px] text-text-3">System will query live production databases to compute this metric.</div>
                    </label>
                 </div>

                 {!formData.autoDataFetch && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-2"
                    >
                      <label className="text-[10px] font-bold text-accent uppercase block mb-1.5 ml-1">Manual Actual Value Overwrite</label>
                      <div className="relative">
                        <Activity className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
                        <input 
                          type="number" disabled={isReadOnly}
                          className={`${inputClass} !pl-11 !border-accent/40 !bg-accent/5`}
                          value={formData.currentValue}
                          onChange={e => setFormData(p => ({ ...p, currentValue: Number(e.target.value) }))}
                          placeholder="0.00"
                        />
                      </div>
                    </motion.div>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls: Thresholds */}
        <div className="space-y-6">
          <div className="bg-bg-1 p-6 rounded-2xl border border-border-main shadow-sm space-y-6">
            <h3 className="text-sm font-black text-text-1 uppercase tracking-widest flex items-center gap-2 border-b border-border-main pb-4">
              <BarChart3 className="w-4 h-4 text-accent" /> Constraints
            </h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-2 uppercase flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Optimal Target
                </label>
                <input 
                  type="number" disabled={isReadOnly}
                  className={inputClass}
                  value={formData.targetValue}
                  onChange={e => setFormData(p => ({ ...p, targetValue: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-2 uppercase flex items-center gap-1.5 text-amber-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Warning Limit
                </label>
                <input 
                  type="number" disabled={isReadOnly}
                  className={`${inputClass} border-amber-500/20 focus:border-amber-500`}
                  value={formData.warningThreshold}
                  onChange={e => setFormData(p => ({ ...p, warningThreshold: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-2 uppercase flex items-center gap-1.5 text-red-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Critical Alert
                </label>
                <input 
                  type="number" disabled={isReadOnly}
                  className={`${inputClass} border-red-500/20 focus:border-red-500`}
                  value={formData.criticalThreshold}
                  onChange={e => setFormData(p => ({ ...p, criticalThreshold: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="p-4 bg-bg-2 rounded-xl border border-border-main flex items-start gap-3">
              <Info className="w-4 h-4 text-text-3 mt-0.5" />
              <p className="text-[11px] text-text-3 leading-relaxed">
                Thresholds determine the coloring on the dashboard radar charts. 
                Values beyond Critical will trigger real-time system alerts.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-2xl border border-indigo-500/20 shadow-sm space-y-4">
             <div className="flex items-center gap-2 text-indigo-500">
                <ShieldAlert className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-tight">Audit Trail</span>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase font-bold text-text-3 tracking-wider">
                   <span>Modified By</span>
                   <span className="text-indigo-500">System Admin</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold text-text-3 tracking-wider">
                   <span>Updated</span>
                   <span className="text-indigo-500">{new Date().toLocaleDateString()}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
