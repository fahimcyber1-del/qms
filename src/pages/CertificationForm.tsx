import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Save, X, FileText, Calendar, Building, 
  User, ShieldCheck, Info, Plus, Trash2, Download, Eye, Award, Globe, 
  FileUp, AlertTriangle, CheckCircle2, Info as InfoIcon, Activity, Tag, Flag, Search
} from 'lucide-react';
import { CertificateRecord } from '../types';
import { checkCertificateStatus, saveCertificates, getCertificates } from '../utils/certificateUtils';
import { AttachmentList } from '../components/AttachmentList';

interface Props {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

// ── Sub-Components (Extracted to prevent re-renders) ──────────────────────

const Section = ({ title, icon: Icon, children, number, className = "" }: any) => (
  <div className={`bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-6 ${className}`}>
    <div className="flex items-center justify-between border-b border-border-main pb-4">
      <h3 className="text-lg font-bold text-text-1 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
          <Icon className="w-5 h-5" />
        </div>
        {number && <span className="opacity-40 font-mono text-sm mr-1">{number}.</span>}
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

export function CertificationForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};
  const isReadOnly = mode === 'view';

  const [formData, setFormData] = useState<Partial<CertificateRecord>>({
    id: initialData.id || `CERT-${Date.now()}`,
    name: initialData.name || '',
    type: initialData.type || 'Factory',
    number: initialData.number || '',
    issuedBy: initialData.issuedBy || '',
    issueDate: initialData.issueDate || new Date().toISOString().split('T')[0],
    expiryDate: initialData.expiryDate || '',
    status: initialData.status || 'Active',
    department: initialData.department || 'Quality',
    documentUrls: initialData.documentUrls || [],
    createdAt: initialData.createdAt || new Date().toISOString()
  });

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    try {
      const allCerts = getCertificates();
      const currentStatus = checkCertificateStatus(formData.expiryDate as string);
      
      const newCert: CertificateRecord = {
        ...(formData as CertificateRecord),
        status: currentStatus,
        createdAt: formData.createdAt || new Date().toISOString()
      };

      let updated;
      if (mode === 'edit') {
        updated = allCerts.map(c => c.id === formData.id ? newCert : c);
      } else {
        updated = [newCert, ...allCerts];
      }

      saveCertificates(updated);
      onNavigate('certification');
    } catch (error) {
      console.error('Error saving certificate:', error);
      alert('Failed to save record.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && !isReadOnly) {
      const files = Array.from(e.target.files) as File[];
      const newDocs: any[] = [];
      for (const file of files) {
        const data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newDocs.push({ name: file.name, data });
      }
      setFormData(prev => ({ ...prev, documentUrls: [...(prev.documentUrls || []), ...newDocs] }));
    }
  };

  const handleDownloadReport = async () => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    await exportDetailToPDF({
      moduleName: 'Compliance Certificate Report',
      moduleId: 'certification',
      recordId: formData.number || 'N/A',
      fileName: `CERT_${(formData.name || 'Unnamed').replace(/\s+/g, '_')}`,
      fields: [
        { label: 'Certificate Name',   value: formData.name || '—' },
        { label: 'Cert Number',        value: formData.number || '—' },
        { label: 'Type',               value: formData.type || '—' },
        { label: 'Issuing Body',       value: formData.issuedBy || '—' },
        { label: 'Department',         value: formData.department || '—' },
        { label: 'Issue Date',         value: formData.issueDate || '—' },
        { label: 'Expiry Date',        value: formData.expiryDate || '—' },
        { label: 'Current Status',     value: formData.status || '—' },
      ],
      attachments: (formData.documentUrls || []).map((d: any) => typeof d === 'string' ? { name: 'Document', data: d } : d)
    });
  };

  const inputClass = "w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => onNavigate('certification')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Register New Certificate' : mode === 'edit' ? 'Update Certificate' : 'Compliance Intel'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isReadOnly ? (
             <>
               <button type="button" onClick={() => onNavigate('certification-form', { mode: 'edit', data: formData })} className="btn btn-ghost border border-border-main flex items-center gap-2">
                  <Trash2 className="w-4 h-4 rotate-45" /> Edit Record
               </button>
               <button type="button" onClick={handleDownloadReport} className="btn btn-primary shadow-lg shadow-accent/20">
                  <Download className="w-4 h-4 mr-2" /> Download Report
               </button>
             </>
          ) : (
            <>
              <button type="button" onClick={() => onNavigate('certification')} className="btn btn-ghost px-6">Cancel</button>
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
            <div className="p-4 bg-accent/10 text-accent rounded-2xl mb-4"><Award className="w-8 h-8" /></div>
            <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Authority</div>
            <div className="text-2xl font-black text-text-1 text-center truncate w-full">{formData.issuedBy || 'N/A'}</div>
          </div>
          <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm text-center">
            <div className="p-4 bg-purple-main/10 text-purple-main rounded-2xl mb-4"><Calendar className="w-8 h-8" /></div>
            <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Valid Until</div>
            <div className="text-2xl font-black text-text-1 font-mono">{formData.expiryDate || 'N/A'}</div>
          </div>
          <div className={`p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm border ${
            formData.status === 'Active' ? 'bg-green-500/10 border-green-500/20' : 'bg-rose-500/10 border-rose-500/20'
          }`}>
            <div className="p-4 bg-white/10 rounded-2xl mb-4">
              <ShieldCheck className={`w-8 h-8 ${formData.status === 'Active' ? 'text-green-600' : 'text-rose-600'}`} />
            </div>
            <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Validity Status</div>
            <div className={`text-2xl font-black uppercase ${formData.status === 'Active' ? 'text-green-600' : 'text-rose-600'}`}>
              {formData.status}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Section title="Certificate Details" icon={FileText} number="01">
            <Field label="Certificate Name" icon={Tag} required span2>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass}
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. ISO 9001:2015, BSCI, OEKO-TEX Standard 100"
              />
            </Field>
            <Field label="Document ID / Number" icon={Flag} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={`${inputClass} font-mono`}
                value={formData.number}
                onChange={e => setFormData(p => ({ ...p, number: e.target.value }))}
                placeholder="CERT-XXXX-2024"
              />
            </Field>
            <Field label="Certification Type" icon={Layers} required>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={formData.type}
                onChange={e => setFormData(p => ({ ...p, type: e.target.value as any }))}
              >
                <option value="Factory">Factory Compliance</option>
                <option value="Machine">Machine Calibration</option>
                <option value="Testing">Lab Testing</option>
                <option value="Compliance">Regulatory Compliance</option>
                <option value="Sustainability">Sustainability</option>
                <option value="Environmental">Environmental</option>
              </select>
            </Field>
          </Section>

          <Section title="Issuance & Authority" icon={Globe} number="02">
            <Field label="Issuing Authority / Body" icon={Building} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass}
                value={formData.issuedBy}
                onChange={e => setFormData(p => ({ ...p, issuedBy: e.target.value }))}
                placeholder="e.g. Intertek, SGS, TUV"
              />
            </Field>
            <Field label="Custodian Department" icon={User} required>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={formData.department}
                onChange={e => setFormData(p => ({ ...p, department: e.target.value as any }))}
              >
                <option value="Quality">Quality Assurance</option>
                <option value="Compliance">Compliance & Social</option>
                <option value="Lab">Testing Lab</option>
                <option value="Production">General Production</option>
              </select>
            </Field>
            <Field label="Issue Date" icon={Calendar} required>
              <input 
                type="date" required disabled={isReadOnly}
                className={inputClass}
                value={formData.issueDate}
                onChange={e => setFormData(p => ({ ...p, issueDate: e.target.value }))}
              />
            </Field>
            <Field label="Expiry Date" icon={Calendar} required>
               <div className="relative">
                  <input 
                    type="date" required disabled={isReadOnly}
                    className={`${inputClass} ${formData.status === 'Expired' ? '!border-rose-500/50 !bg-rose-500/5' : ''}`}
                    value={formData.expiryDate}
                    onChange={e => setFormData(p => ({ ...p, expiryDate: e.target.value }))}
                  />
                  {formData.status === 'Expired' && (
                    <AlertTriangle className="w-4 h-4 text-rose-500 absolute right-4 top-1/2 -translate-y-1/2" />
                  )}
               </div>
            </Field>
          </Section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Section title="Governance" icon={ShieldCheck} number="03" className="md:grid-cols-1">
             <div className="p-4 rounded-xl border border-border-main bg-bg-2 flex flex-col gap-2">
                <div className="text-[10px] font-black text-text-3 uppercase tracking-widest">Automatic Status Verification</div>
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${formData.status === 'Active' ? 'bg-green-500' : 'bg-rose-500 animate-pulse'}`} />
                   <span className={`text-sm font-black uppercase ${formData.status === 'Active' ? 'text-green-600' : 'text-rose-600'}`}>
                      {formData.status}
                   </span>
                </div>
             </div>
             <p className="text-[10px] text-text-3 font-medium px-2 italic">
                Status is automatically computed based on the Expiry Date. Certificates within 30 days of expiry will trigger alerts.
             </p>
          </Section>

          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
                <FileUp className="w-5 h-5 text-accent" />
                Digital Proof
              </h4>
              {!isReadOnly && (
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
                  <Plus className="w-4 h-4" /> Add Files
                  <input type="file" multiple accept=".pdf,image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              )}
            </div>
            
            {formData.documentUrls?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
                <InfoIcon className="w-12 h-12 mb-3" />
                <p className="text-sm font-bold uppercase tracking-widest">No evidence uploaded</p>
              </div>
            ) : (
              <AttachmentList
                attachments={formData.documentUrls || []}
                onRemove={!isReadOnly ? (i) => setFormData(p => ({ ...p, documentUrls: p.documentUrls?.filter((_, idx) => idx !== i) })) : undefined}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
