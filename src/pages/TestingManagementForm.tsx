import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, TestTube2, Building, User, Calendar, 
  Beaker, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, 
  Microscope, Tag, ShoppingBag, Download, Activity, FlaskConical
} from 'lucide-react';
import { getTable } from '../db/db';
import { AttachmentList } from '../components/AttachmentList';

interface Props {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

const DEPARTMENTS = [
  'Quality', 'Production', 'Cutting', 'Sewing', 'Finishing',
  'Packing', 'Maintenance', 'HR', 'Compliance', 'IE',
  'Fabric Store', 'Washing', 'Embroidery', 'Lab', 'Admin', 'Management'
];

// ── Sub-Components ────────────────────────────────────────────────────────

const Section = ({ title, icon: Icon, children, number }: any) => (
  <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-6">
    <div className="flex items-center justify-between border-b border-border-main pb-4">
      <h3 className="text-lg font-bold text-text-1 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
          <Icon className="w-5 h-5" />
        </div>
        <span className="opacity-40 font-mono text-sm mr-1">{number}.</span>
        {title}
      </h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const Field = ({ label, required, children, span2, icon: Icon }: any) => (
  <div className={`space-y-2 ${span2 ? 'md:col-span-2' : ''}`}>
    <label className="text-xs font-bold text-text-2 uppercase tracking-wider flex items-center gap-2">
      {Icon && <Icon className="w-3.5 h-3.5 opacity-50" />}
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

export function TestingManagementForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};
  const isReadOnly = mode === 'view';

  const [formData, setFormData] = useState({
    id: initialData.id || `TST-${Date.now()}`,
    testName: initialData.testName || '',
    testType: initialData.testType || 'Fabric',
    sampleId: initialData.sampleId || '',
    buyer: initialData.buyer || '',
    style: initialData.style || '',
    department: initialData.department || 'Quality',
    responsiblePerson: initialData.responsiblePerson || '',
    labName: initialData.labName || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    status: initialData.status || 'Pending',
    testResult: initialData.testResult || '',
    expectedValue: initialData.expectedValue || '',
    actualValue: initialData.actualValue || '',
    remarks: initialData.remarks || '',
    attachments: initialData.attachments || []
  });

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    try {
      if (mode === 'create') {
        await getTable('testing').add({
          ...formData,
          createdAt: new Date().toISOString()
        });
      } else {
        await getTable('testing').put(formData);
      }
      onNavigate('testing-management');
    } catch (error) {
      console.error('Error saving test record:', error);
      alert('Failed to save record.');
    }
  };

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newAtts: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newAtts.push({ name: file.name, data, type: file.type });
    }
    
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAtts] }));
  };

  const exportPDF = async () => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    await exportDetailToPDF({
      moduleName: 'Laboratory Test Report',
      moduleId: 'testing',
      recordId: formData.id,
      fileName: `Test_${formData.id}`,
      fields: [
        { label: 'Test Name',      value: formData.testName },
        { label: 'Test Type',      value: formData.testType },
        { label: 'Sample ID',      value: formData.sampleId },
        { label: 'Lab Name',       value: formData.labName },
        { label: 'Buyer',          value: formData.buyer },
        { label: 'Style',          value: formData.style },
        { label: 'Expected Value', value: formData.expectedValue },
        { label: 'Actual Value',   value: formData.actualValue },
        { label: 'Result',         value: formData.testResult },
        { label: 'Status',         value: formData.status },
      ],
      summary: formData.remarks ? ['Remarks:', formData.remarks] : undefined
    });
  };

  const inputClass = "w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => onNavigate('testing-management')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Register New Test' : mode === 'edit' ? 'Update Test Record' : 'Test Specification'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isReadOnly ? (
             <>
               <button type="button" onClick={() => onNavigate('testing-management-form', { mode: 'edit', data: formData })} className="btn btn-ghost border border-border-main flex items-center gap-2">
                  <Trash2 className="w-4 h-4 rotate-45" /> Edit Test
               </button>
               <button type="button" onClick={exportPDF} className="btn btn-primary shadow-lg shadow-accent/20">
                  <Download className="w-4 h-4 mr-2" /> Download Report
               </button>
             </>
          ) : (
            <>
              <button type="button" onClick={() => onNavigate('testing-management')} className="btn btn-ghost px-6">Cancel</button>
              <button type="button" onClick={() => handleSave()} className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
                <Save className="w-4 h-4" /> Save Record
              </button>
            </>
          )}
        </div>
      </div>

      {isReadOnly && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm">
            <div className="p-4 bg-accent/10 rounded-2xl mb-4"><Microscope className="w-8 h-8 text-accent" /></div>
            <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Target Standard</div>
            <div className="text-2xl font-black text-text-1">{formData.expectedValue || 'Not Defined'}</div>
          </div>
          <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm text-center">
            <div className="p-4 bg-purple-main/10 text-purple-main rounded-2xl mb-4"><FlaskConical className="w-8 h-8" /></div>
            <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Observed Result</div>
            <div className="text-2xl font-black text-text-1">{formData.actualValue || 'Pending'}</div>
          </div>
          <div className={`p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm border ${
            formData.status === 'Pass' ? 'bg-green-500/10 border-green-500/20' : 
            formData.status === 'Fail' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-amber-500/10 border-amber-500/20'
          }`}>
            <div className="p-4 bg-white/10 rounded-2xl mb-4">
              <Activity className={`w-8 h-8 ${
                formData.status === 'Pass' ? 'text-green-600' : 
                formData.status === 'Fail' ? 'text-rose-600' : 'text-amber-600'
              }`} />
            </div>
            <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Test Verdict</div>
            <div className={`text-2xl font-black uppercase ${
              formData.status === 'Pass' ? 'text-green-600' : 
              formData.status === 'Fail' ? 'text-rose-600' : 'text-amber-600'
            }`}>
              {formData.status}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Section title="Sample & Identity" icon={Tag} number="01">
            <Field label="Test Name" icon={TestTube2} required span2>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.testName} 
                onChange={e => setFormData(p => ({ ...p, testName: e.target.value }))}
                placeholder="e.g., Fabric Shrinkage Test"
              />
            </Field>
            <Field label="Sample ID" icon={Tag} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.sampleId} 
                onChange={e => setFormData(p => ({ ...p, sampleId: e.target.value }))}
                placeholder="Lot/Ref No."
              />
            </Field>
            <Field label="Test Category" icon={Beaker} required>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={formData.testType} 
                onChange={e => setFormData(p => ({ ...p, testType: e.target.value }))}
              >
                <option>Fabric</option>
                <option>Garment</option>
                <option>Chemical</option>
                <option>Safety</option>
                <option>Color Fastness</option>
              </select>
            </Field>
            <Field label="Buyer / Customer" icon={ShoppingBag}>
              <input 
                type="text" disabled={isReadOnly}
                className={inputClass} 
                value={formData.buyer} 
                onChange={e => setFormData(p => ({ ...p, buyer: e.target.value }))}
              />
            </Field>
            <Field label="Style Reference" icon={FileText}>
              <input 
                type="text" disabled={isReadOnly}
                className={inputClass} 
                value={formData.style} 
                onChange={e => setFormData(p => ({ ...p, style: e.target.value }))}
              />
            </Field>
          </Section>

          <Section title="Testing Methodology" icon={Microscope} number="02">
            <Field label="Laboratory / Facility" icon={Building} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.labName} 
                onChange={e => setFormData(p => ({ ...p, labName: e.target.value }))}
                placeholder="e.g., ITS, SGS, or Internal Lab"
              />
            </Field>
            <Field label="Inspection Date" icon={Calendar} required>
              <input 
                type="date" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.date} 
                onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
              />
            </Field>
            <Field label="Expected Value / Standard" icon={CheckCircle2}>
              <input 
                type="text" disabled={isReadOnly}
                className={inputClass} 
                value={formData.expectedValue} 
                onChange={e => setFormData(p => ({ ...p, expectedValue: e.target.value }))}
                placeholder="e.g., < 2%"
              />
            </Field>
            <Field label="Actual Value Observed" icon={Activity}>
              <input 
                type="text" disabled={isReadOnly}
                className={inputClass} 
                value={formData.actualValue} 
                onChange={e => setFormData(p => ({ ...p, actualValue: e.target.value }))}
              />
            </Field>
            <Field label="Result Summary" icon={Info} span2>
              <textarea 
                disabled={isReadOnly}
                className={`${inputClass} min-h-[120px] resize-none`} 
                value={formData.testResult} 
                onChange={e => setFormData(p => ({ ...p, testResult: e.target.value }))}
                placeholder="Briefly describe the test outcome..."
              />
            </Field>
          </Section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Section title="Governance" icon={User} number="03" className="md:grid-cols-1">
            <Field label="Verdict Status" icon={AlertCircle} required>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={formData.status} 
                onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Pass</option>
                <option>Fail</option>
                <option>Re-test</option>
              </select>
            </Field>
            <Field label="Responsible Person" icon={User} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.responsiblePerson} 
                onChange={e => setFormData(p => ({ ...p, responsiblePerson: e.target.value }))}
              />
            </Field>
            <Field label="Department" icon={Building} required>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={formData.department} 
                onChange={e => setFormData(p => ({ ...p, department: e.target.value }))}
              >
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Technical Remarks" icon={FileText}>
              <textarea 
                disabled={isReadOnly}
                className={`${inputClass} min-h-[120px] resize-none`} 
                value={formData.remarks} 
                onChange={e => setFormData(p => ({ ...p, remarks: e.target.value }))}
              />
            </Field>
          </Section>

          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
                <Paperclip className="w-5 h-5 text-accent" />
                Lab Certificates
              </h4>
              {!isReadOnly && (
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
                  <Plus className="w-4 h-4" /> Upload
                  <input type="file" multiple className="hidden" onChange={handleFileAttach} />
                </label>
              )}
            </div>
            
            {formData.attachments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
                <Beaker className="w-12 h-12 mb-3" />
                <p className="text-sm font-bold uppercase tracking-widest">No reports attached</p>
              </div>
            ) : (
              <AttachmentList
                attachments={formData.attachments}
                onRemove={!isReadOnly ? (i) => setFormData(p => ({ ...p, attachments: p.attachments.filter((_, idx) => idx !== i) })) : undefined}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
