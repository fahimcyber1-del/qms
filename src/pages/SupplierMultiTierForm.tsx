import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, Network, Building, User, Calendar, 
  Factory, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, Phone, MapPin, BarChart3, ShieldCheck
} from 'lucide-react';
import { getTable } from '../db/db';

interface Props {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

export function SupplierMultiTierForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};

  const [formData, setFormData] = useState({
    id: initialData.id || `T2S-${Date.now()}`,
    supplierName: initialData.supplierName || '',
    process: initialData.process || 'Washing',
    location: initialData.location || '',
    contactPerson: initialData.contactPerson || '',
    phone: initialData.phone || '',
    email: initialData.email || '',
    status: initialData.status || 'Pending Approval',
    score: initialData.score || 0,
    source: initialData.source || 'Local',
    taxId: initialData.taxId || '',
    certifications: initialData.certifications || '',
    remarks: initialData.remarks || '',
    attachments: initialData.attachments || []
  });

  const isReadOnly = mode === 'view';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      if (mode === 'create') {
        await getTable('subSupplierManagement').add({
          ...formData,
          createdAt: new Date().toISOString()
        });
      } else {
        await getTable('subSupplierManagement').put(formData);
      }
      onNavigate('supplier-multi-tier');
    } catch (error) {
      console.error('Error saving supplier record:', error);
      alert('Failed to save record.');
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAtts = Array.from(files).map((f: any) => f.name);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAtts] }));
  };

  const Section = ({ title, icon: Icon, children, number }: any) => (
    <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border-main pb-4">
        <h3 className="text-lg font-bold text-text-1 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
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

  const Field = ({ label, required, children, span2 }: any) => (
    <div className={`space-y-2 ${span2 ? 'md:col-span-2' : ''}`}>
      <label className="text-sm font-bold text-text-2 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );

  const inputClass = "w-full bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <form className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto" onSubmit={handleSave}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => onNavigate('supplier-multi-tier')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Register Tier-2 Partner' : mode === 'edit' ? 'Update Supplier Profile' : 'Supplier Details'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onNavigate('supplier-multi-tier')} className="btn btn-ghost px-6">
            {isReadOnly ? 'Close' : 'Cancel'}
          </button>
          {!isReadOnly && (
            <button type="submit" className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
              <Save className="w-4 h-4" /> Save Profile
            </button>
          )}
        </div>
      </div>

      <Section title="Partner Information" icon={Factory} number="01">
        <Field label="Supplier / Factory Name" required span2>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.supplierName} 
            onChange={e => setFormData(p => ({ ...p, supplierName: e.target.value }))}
            placeholder="e.g., Dynamic Washing & Dying Ltd"
          />
        </Field>
        <Field label="Specialized Process" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.process} 
            onChange={e => setFormData(p => ({ ...p, process: e.target.value }))}
          >
            <option>Washing</option>
            <option>Printing</option>
            <option>Embroidery</option>
            <option>Fabric Mill</option>
            <option>Trim & Accessories</option>
            <option>Packaging</option>
            <option>Logistics</option>
          </select>
        </Field>
        <Field label="Source Origin" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.source} 
            onChange={e => setFormData(p => ({ ...p, source: e.target.value }))}
          >
            <option>Local</option>
            <option>Imported</option>
            <option>Group Company</option>
          </select>
        </Field>
        <Field label="Address / Location" required span2>
           <div className="relative">
             <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-3" />
             <input 
                type="text" required disabled={isReadOnly}
                className={`${inputClass} pl-11`} 
                value={formData.location} 
                onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
              />
           </div>
        </Field>
      </Section>

      <Section title="Compliance & Scoring" icon={BarChart3} number="02">
        <Field label="Performance Score (%)" required>
          <input 
            type="number" required disabled={isReadOnly}
            className={inputClass} 
            min="0" max="100"
            value={formData.score} 
            onChange={e => setFormData(p => ({ ...p, score: Number(e.target.value) }))}
          />
        </Field>
        <Field label="Relationship Status" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.status} 
            onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>Pending Approval</option>
            <option>Audit Required</option>
            <option>Blacklisted</option>
          </select>
        </Field>
        <Field label="Tax / Reg ID">
          <input 
            type="text" disabled={isReadOnly}
            className={inputClass} 
            value={formData.taxId} 
            onChange={e => setFormData(p => ({ ...p, taxId: e.target.value }))}
          />
        </Field>
        <Field label="Held Certifications (OEKO, GOTS, etc)" span2>
          <input 
            type="text" disabled={isReadOnly}
            className={inputClass} 
            value={formData.certifications} 
            onChange={e => setFormData(p => ({ ...p, certifications: e.target.value }))}
            placeholder="Comma separated list..."
          />
        </Field>
      </Section>

      <Section title="Communication" icon={User} number="03">
        <Field label="Primary Contact Person" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.contactPerson} 
            onChange={e => setFormData(p => ({ ...p, contactPerson: e.target.value }))}
          />
        </Field>
        <Field label="Contact Phone" required>
           <div className="relative">
             <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-3" />
             <input 
                type="text" required disabled={isReadOnly}
                className={`${inputClass} pl-11`} 
                value={formData.phone} 
                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
              />
           </div>
        </Field>
        <Field label="Email Address">
          <input 
            type="email" disabled={isReadOnly}
            className={inputClass} 
            value={formData.email} 
            onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
          />
        </Field>
        <Field label="Additional Remarks" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[100px]`} 
            value={formData.remarks} 
            onChange={e => setFormData(p => ({ ...p, remarks: e.target.value }))}
          />
        </Field>
      </Section>

      <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
            <Paperclip className="w-5 h-5 text-accent" />
            Supplier Audit Reports & Certs
          </h4>
          {!isReadOnly && (
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
              <Plus className="w-4 h-4" /> Upload Documents
              <input type="file" multiple className="hidden" onChange={handleFileAttach} />
            </label>
          )}
        </div>
        
        {formData.attachments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
            <ShieldCheck className="w-12 h-12 mb-3" />
            <p className="text-sm font-bold uppercase tracking-widest">No certifications attached</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {formData.attachments.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-bg-2 p-3 rounded-xl border border-border-main group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 bg-accent/10 rounded flex items-center justify-center text-accent">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-text-1 truncate">{file}</span>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={() => setFormData(p => ({ ...p, attachments: p.attachments.filter((_, idx) => idx !== i) }))} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
