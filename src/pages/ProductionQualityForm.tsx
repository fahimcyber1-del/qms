import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Plus, Save, Activity, Calendar, User, AlertTriangle, Layers, X, Edit2, Trash2, Download } from 'lucide-react';
import { InspectionRecord, InspectionDefect } from '../types';
import { getProductionQualityRecords, saveProductionQualityRecords } from '../utils/qualityUtils';

interface ProductionQualityFormProps {
  params: {
    mode: 'create' | 'edit' | 'view';
    data?: any;
    recordType?: 'detailed' | 'quick';
  };
  onNavigate: (page: string, params?: any) => void;
}

export function ProductionQualityForm({ params, onNavigate }: ProductionQualityFormProps) {
  const { mode, data, recordType = 'detailed' } = params;
  const isReadOnly = mode === 'view';
  
  const [units, setUnits] = React.useState<string[]>([]);
  const [sections, setSections] = React.useState<string[]>([]);
  const [lines, setLines] = React.useState<string[]>([]);
  const [defectOptions, setDefectOptions] = React.useState<any[]>([]);

  React.useEffect(() => {
    const u = localStorage.getItem('garmentqms_config_units');
    const s = localStorage.getItem('garmentqms_config_sections');
    const l = localStorage.getItem('garmentqms_config_lines');
    const d = localStorage.getItem('garmentqms_defects');
    
    const loadedUnits = u ? JSON.parse(u) : ['Unit-1', 'Unit-2', 'Unit-3', 'Unit-4', 'Unit-5'];
    const loadedSections = s ? JSON.parse(s) : ['Sewing', 'Finishing', 'Cutting', 'Packing'];
    const loadedLines = l ? JSON.parse(l) : ['Line-1', 'Line-2', 'Line-3', 'Line-4', 'Line-5', 'Line-6', 'Line-7', 'Line-8', 'Line-9', 'Line-10'];

    setUnits(loadedUnits);
    setSections(loadedSections);
    setLines(loadedLines);
    if (d) setDefectOptions(JSON.parse(d));

    // If creating, initialize defaults from loaded config
    if (mode === 'create') {
      setFormData(prev => ({
        ...prev,
        unit: loadedUnits[0] || '',
        section: loadedSections[0] || '',
        lineNumber: loadedLines[0] || ''
      }));
    }
  }, [mode]);

  const [formData, setFormData] = useState<Partial<InspectionRecord>>(() => {
    if (data) return data;
    
    // Fetch KPI Targets
    let dhuTarget = 5;
    let rftTarget = 95;
    try {
      const kpis = JSON.parse(localStorage.getItem('garmentqms_kpis') || '[]');
      const dhuKpi = kpis.find((k: any) => k.kpiName === 'DHU');
      const rftKpi = kpis.find((k: any) => k.kpiName === 'RFT');
      if (dhuKpi) dhuTarget = dhuKpi.targetValue;
      if (rftKpi) rftTarget = rftKpi.targetValue;
    } catch(e) {}

    return {
      id: `PQ-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      factory: 'Main Factory', unit: '', section: '', floor: '',
      lineNumber: '', style: '', orderNumber: '', buyer: '',
      operatorId: '', qcInspector: '', dayTarget: 0, checkedQuantity: 0,
      goodsQuantity: 0, totalDefects: 0, standardRft: rftTarget, standardDhu: dhuTarget,
      standardPercentageDefective: 3, shift: 'Day', machineNumber: '', remark: '',
      source: recordType, topDefects: [{ name: '', count: 0 }, { name: '', count: 0 }, { name: '', count: 0 }],
      uid: 'user'
    };
  });

  const handleChange = (field: keyof InspectionRecord, value: any) => {
    if (isReadOnly) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // Simple CSV parse: Name, Count
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        const newDefects = [...(formData.topDefects || [])];
        
        let added = 0;
        lines.forEach((line, i) => {
          if (i === 0 && line.toLowerCase().includes('name')) return; // skip header
          const parts = line.split(',');
          if (parts.length >= 2) {
            newDefects.push({
              name: parts[0].trim(),
              count: parseInt(parts[1].trim()) || 0
            });
            added++;
          }
        });
        
        if (added > 0) {
          setFormData({ ...formData, topDefects: newDefects });
        }
      } catch (err) {
        console.error('Failed to parse defects CSV', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSave = () => {
    // Clean up top defects
    const cleanedData = {
      ...formData,
      topDefects: (formData.topDefects || []).filter((d: any) => d.name && d.name.trim() !== '')
    } as InspectionRecord;

    const records = getProductionQualityRecords();
    let updatedRecords;
    if (mode === 'edit' && data) {
      updatedRecords = records.map((r: any) => r.id === data.id ? cleanedData : r);
    } else {
      updatedRecords = [cleanedData, ...records];
    }

    saveProductionQualityRecords(updatedRecords);
    onNavigate('prod-quality');
  };

  const calculateRFT = () => {
    if ((formData.checkedQuantity || 0) === 0) return '0.0';
    return (((formData.goodsQuantity || 0) / (formData.checkedQuantity || 1)) * 100).toFixed(1);
  };

  const calculateDHU = () => {
    if ((formData.checkedQuantity || 0) === 0) return '0.0';
    return (((formData.totalDefects || 0) / (formData.checkedQuantity || 1)) * 100).toFixed(1);
  };

  const exportPDF = async () => {
    const {
      createDoc, drawPdfHeader, drawInfoGrid, drawSectionLabel, proTable, addPageFooters, drawSignatureRow
    } = await import('../utils/pdfExport');
    const r = formData as InspectionRecord;
    const doc = createDoc({ orientation: 'p', paperSize: 'a4' });
    let y = drawPdfHeader(doc, 'Production Quality Report', `Line: ${r.lineNumber} | ${r.date}`);

    y = drawInfoGrid(doc, y, [
      { label: 'Date',       value: r.date },
      { label: 'Shift',      value: r.shift || '—' },
      { label: 'Unit',       value: r.unit || '—' },
      { label: 'Section',    value: r.section || '—' },
      { label: 'Line No.',   value: r.lineNumber || '—' },
      { label: 'Buyer',      value: r.buyer || '—' },
      { label: 'Style',      value: r.style || '—' },
      { label: 'Order No.', value: r.orderNumber || '—' },
      { label: 'QC Inspector', value: r.qcInspector || '—' },
    ]);

    y = drawSectionLabel(doc, y, 'Inspection Results');
    y = proTable(doc, y,
      [['Metric', 'Value']],
      [
        ['Checked Quantity',  String(r.checkedQuantity)],
        ['Goods Passed',      String(r.goodsQuantity)],
        ['Total Defects',     String(r.totalDefects)],
        ['RFT %',            `${calculateRFT()}%`],
        ['DHU %',            `${calculateDHU()}%`],
      ],
      { columnStyles: { 0: { cellWidth: 80, fontStyle: 'bold' } } }
    ) + 6;

    if (r.topDefects && r.topDefects.length > 0) {
      y = drawSectionLabel(doc, y, 'Top Defects Found');
      y = proTable(doc, y,
        [['Defect Name', 'Count']],
        r.topDefects.filter(d => d.name).map(d => [d.name, String(d.count)]),
        { columnStyles: { 1: { cellWidth: 30, halign: 'center' } } }
      ) + 6;
    }

    if (r.remark) {
      y = drawSectionLabel(doc, y, 'Remarks / Notes');
      y = proTable(doc, y, [['Notes']], [[r.remark]]) + 6;
    }

    drawSignatureRow(doc, y, ['QC Inspector', 'Line Supervisor', 'QA Manager', 'Approved By']);
    addPageFooters(doc);
    doc.save(`Quality_${r.lineNumber}_${r.date}.pdf`);
  };

  const Field = ({ label, required = false, children }: any) => (
    <div className="space-y-2 w-full">
      <label className="text-sm font-bold text-text-2">{label} {required && <span className="text-red-500">*</span>}</label>
      {children}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 space-y-6">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button className="btn btn-ghost px-2 bg-bg-2 border border-border-main" onClick={() => onNavigate('prod-quality')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-text-1">
            {mode === 'create' ? `New Quality Inspection Record` : 
             mode === 'edit' ? `Edit Quality Record` : `Quality Record Details`}
          </h2>
        </div>
        {mode === 'view' ? (
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost border border-border-main" onClick={() => onNavigate('prod-quality-form', { mode: 'edit', data: formData })}>
              <Edit2 className="w-4 h-4 mr-2" /> Edit Record
            </button>
            <button className="btn btn-primary shadow-md" onClick={exportPDF}>
              <Download className="w-4 h-4 mr-2" /> Download Report
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost px-6" onClick={() => onNavigate('prod-quality')}>Cancel</button>
            <button className="btn btn-primary px-8 shadow-md" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> {mode === 'create' ? 'Save Record' : 'Update Record'}
            </button>
          </div>
        )}
      </div>

      {mode === 'view' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-bg-1 border border-border-main p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <div className="p-3 bg-blue-500/10 rounded-full mb-3"><Layers className="w-6 h-6 text-blue-500" /></div>
            <div className="text-sm font-medium text-text-2 mb-1">Checked Qty</div>
            <div className="text-4xl font-mono font-bold text-text-1">{formData.checkedQuantity}</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <div className="text-sm font-bold text-green-600 dark:text-green-400 mb-1">Right First Time (RFT)</div>
            <div className="text-4xl font-mono font-bold text-green-600 dark:text-green-400">{calculateRFT()}%</div>
            <div className="text-sm mt-2 text-green-700/70 font-medium">Passed: {formData.goodsQuantity}</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <div className="text-sm font-bold text-red-600 dark:text-red-400 mb-1">Defect per Hundred Units (DHU)</div>
            <div className="text-4xl font-mono font-bold text-red-600 dark:text-red-400">{calculateDHU()}%</div>
            <div className="text-sm mt-2 text-red-700/70 font-medium">Defects: {formData.totalDefects}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Basic Info Column */}
        <div className="space-y-6">
          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-text-1 border-b border-border-main pb-3">
              <Calendar className="w-5 h-5 text-accent" /> 1. Date & Location
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date" required>
                <input type="date" className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.date} disabled={isReadOnly} onChange={e => handleChange('date', e.target.value)} />
              </Field>
              <Field label="Shift">
                <select className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.shift} disabled={isReadOnly} onChange={e => handleChange('shift', e.target.value)}>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                </select>
              </Field>
              <Field label="Unit">
                <select className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.unit} disabled={isReadOnly} onChange={e => handleChange('unit', e.target.value)}>
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </Field>
              <Field label="Section">
                <select className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.section} disabled={isReadOnly} onChange={e => handleChange('section', e.target.value)}>
                  {sections.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Line Number" required>
                <select className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.lineNumber} disabled={isReadOnly} onChange={e => handleChange('lineNumber', e.target.value)}>
                  {lines.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-text-1 border-b border-border-main pb-3">
              <User className="w-5 h-5 text-purple-500" /> 2. Style & Personnel
            </h4>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Buyer">
                  <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.buyer} readOnly={isReadOnly} onChange={e => handleChange('buyer', e.target.value)} />
                </Field>
                <Field label="Style">
                  <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.style} readOnly={isReadOnly} onChange={e => handleChange('style', e.target.value)} />
                </Field>
                <Field label="Order No.">
                  <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.orderNumber} readOnly={isReadOnly} onChange={e => handleChange('orderNumber', e.target.value)} />
                </Field>
                <Field label="QC Inspector">
                  <input className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.qcInspector} readOnly={isReadOnly} onChange={e => handleChange('qcInspector', e.target.value)} />
                </Field>
              </div>
            </div>
          </div>

        {/* Results Info Column */}
        <div className="space-y-6">
          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-text-1 border-b border-border-main pb-3">
              <Activity className="w-5 h-5 text-blue-500" /> 3. Inspection Results
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Checked Qty" required>
                <input type="number" className="w-full bg-bg-2 border-none rounded-xl px-4 py-4 text-center font-mono text-xl focus:ring-2 focus:ring-accent outline-none text-text-1" value={formData.checkedQuantity} readOnly={isReadOnly} onChange={e => handleChange('checkedQuantity', Number(e.target.value))} />
              </Field>
              <Field label="Goods Qty">
                <input type="number" className="w-full bg-bg-2 border-none rounded-xl px-4 py-4 text-center font-mono text-xl focus:ring-2 focus:ring-green-500 text-green-500 outline-none" value={formData.goodsQuantity} readOnly={isReadOnly} onChange={e => handleChange('goodsQuantity', Number(e.target.value))} />
              </Field>
              <Field label="Total Defects">
                <input type="number" className="w-full bg-bg-2 border-none rounded-xl px-4 py-4 text-center font-mono text-xl focus:ring-2 focus:ring-red-500 text-red-500 outline-none" value={formData.totalDefects} readOnly={isReadOnly} onChange={e => handleChange('totalDefects', Number(e.target.value))} />
              </Field>
            </div>
            
            {!isReadOnly && (
              <div className="mt-6 p-5 bg-bg-2/50 rounded-xl border border-border-main flex divide-x divide-border-main text-center">
                <div className="flex-1 px-4">
                  <span className="text-xs font-bold text-text-3 uppercase tracking-wider block mb-1">RFT Forecast</span>
                  <span className="font-bold text-xl text-green-500">{calculateRFT()}%</span>
                </div>
                <div className="flex-1 px-4">
                  <span className="text-xs font-bold text-text-3 uppercase tracking-wider block mb-1">DHU Forecast</span>
                  <span className="font-bold text-xl text-red-500">{calculateDHU()}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-border-main pb-3">
              <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> 4. Detected Defects
              </h4>
              {!isReadOnly && (
                <div className="flex items-center gap-2">
                  <label className="btn btn-ghost border border-border-main cursor-pointer px-3 py-1.5 text-sm flex items-center gap-2">
                    <Download className="w-4 h-4" /> Upload CSV
                    <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <button type="button" onClick={() => setFormData({ ...formData, topDefects: [...(formData.topDefects || []), { name: '', count: 0 }] })} className="btn btn-primary px-3 py-1.5 text-sm flex items-center gap-2 shadow-sm">
                    <Plus className="w-4 h-4" /> Add Defect
                  </button>
                </div>
              )}
            </div>
            
            <datalist id="defect-options">
              {defectOptions.map((d: any) => (
                <option key={d.id || d.code} value={d.name}>{d.code} - {d.name}</option>
              ))}
            </datalist>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {(formData.topDefects || []).map((defect, idx) => (
                <div key={idx} className="flex gap-4 items-center group">
                  <div className="w-8 text-center text-text-3 font-mono text-sm">{idx + 1}.</div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      list="defect-options"
                      placeholder={`Select or type defect designation`} 
                      className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1"
                      value={defect.name}
                      readOnly={isReadOnly}
                      onChange={(e) => {
                        if (isReadOnly) return;
                        const newDefects = [...(formData.topDefects || [])];
                        newDefects[idx] = { ...newDefects[idx], name: e.target.value } as InspectionDefect;
                        setFormData({ ...formData, topDefects: newDefects });
                      }}
                    />
                  </div>
                  <div className="w-24">
                    <input 
                      type="number" 
                      placeholder="Qty" 
                      className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-red-500 outline-none text-red-500 text-center"
                      value={defect.count === 0 && !defect.name ? '' : defect.count || ''}
                      readOnly={isReadOnly}
                      onChange={(e) => {
                        if (isReadOnly) return;
                        const newDefects = [...(formData.topDefects || [])];
                        newDefects[idx] = { ...newDefects[idx], count: Number(e.target.value) } as InspectionDefect;
                        setFormData({ ...formData, topDefects: newDefects });
                      }}
                    />
                  </div>
                  {!isReadOnly && (
                    <button 
                      type="button" 
                      onClick={() => {
                        const newDefects = [...(formData.topDefects || [])];
                        newDefects.splice(idx, 1);
                        setFormData({ ...formData, topDefects: newDefects });
                      }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {(!formData.topDefects || formData.topDefects.length === 0) && (
                <div className="text-center p-4 text-text-3 text-sm border border-dashed border-border-main rounded-xl">
                  No defects logged. Add a defect or upload a CSV.
                </div>
              )}
            </div>
          </div>

          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <Field label="5. Remarks / Notes">
              <textarea 
                className="w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 min-h-[100px] resize-y" 
                placeholder="Include corrective actions taken, operator notes, etc..."
                value={formData.remark} 
                readOnly={isReadOnly}
                onChange={(e) => handleChange('remark', e.target.value)} 
              />
            </Field>
          </div>

        </div>
      </div>
    </motion.div>
  );
}



