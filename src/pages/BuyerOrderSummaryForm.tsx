import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, ShoppingBag, Building, User, Calendar, 
  Package, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, Truck, DollarSign, Tag, Info as InfoIcon
} from 'lucide-react';
import { getTable } from '../db/db';

interface Props {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

export function BuyerOrderSummaryForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};

  const [formData, setFormData] = useState({
    id: initialData.id || `ORD-${Date.now()}`,
    orderNo: initialData.orderNo || '',
    buyer: initialData.buyer || '',
    styleNo: initialData.styleNo || '',
    qty: initialData.qty || 0,
    shipDate: initialData.shipDate || '',
    status: initialData.status || 'New',
    priority: initialData.priority || 'Medium',
    season: initialData.season || '',
    fabricsUsed: initialData.fabricsUsed || '',
    factoryLocation: initialData.factoryLocation || '',
    merchandiser: initialData.merchandiser || '',
    remarks: initialData.remarks || '',
    attachments: initialData.attachments || []
  });

  const isReadOnly = mode === 'view';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    try {
      if (mode === 'create') {
        await getTable('orderSummary').add({
          ...formData,
          createdAt: new Date().toISOString()
        });
      } else {
        await getTable('orderSummary').put(formData);
      }
      onNavigate('buyer-order-summary');
    } catch (error) {
      console.error('Error saving order record:', error);
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
          <button type="button" onClick={() => onNavigate('buyer-order-summary')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-1">
              {mode === 'create' ? 'Create Merchandising Order' : mode === 'edit' ? 'Update Order Lifecycle' : 'Order Specification'}
            </h2>
            <p className="text-text-3 text-sm font-medium mt-1 uppercase tracking-widest">{formData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onNavigate('buyer-order-summary')} className="btn btn-ghost px-6">
            {isReadOnly ? 'Close' : 'Cancel'}
          </button>
          {!isReadOnly && (
            <button type="submit" className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
              <Save className="w-4 h-4" /> Save Order
            </button>
          )}
        </div>
      </div>

      <Section title="Order Identification" icon={Tag} number="01">
        <Field label="Order / PO Number" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.orderNo} 
            onChange={e => setFormData(p => ({ ...p, orderNo: e.target.value }))}
            placeholder="e.g., PO-2026-X99"
          />
        </Field>
        <Field label="Buyer Name" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.buyer} 
            onChange={e => setFormData(p => ({ ...p, buyer: e.target.value }))}
            placeholder="e.g., Global Brands Ltd"
          />
        </Field>
        <Field label="Style Number / Description" required span2>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.styleNo} 
            onChange={e => setFormData(p => ({ ...p, styleNo: e.target.value }))}
            placeholder="e.g., Mens Slim Fit Denim - Dark Indigo"
          />
        </Field>
        <Field label="Target Season">
          <input 
            type="text" disabled={isReadOnly}
            className={inputClass} 
            value={formData.season} 
            onChange={e => setFormData(p => ({ ...p, season: e.target.value }))}
            placeholder="e.g., Fall/Winter 2026"
          />
        </Field>
        <Field label="Order Priority" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.priority} 
            onChange={e => setFormData(p => ({ ...p, priority: e.target.value }))}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Urgent / AOG</option>
          </select>
        </Field>
      </Section>

      <Section title="Production Details" icon={Package} number="02">
        <Field label="Total Order Quantity" required>
          <input 
            type="number" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.qty} 
            onChange={e => setFormData(p => ({ ...p, qty: Number(e.target.value) }))}
          />
        </Field>
        <Field label="Involved Fabrics & Trims" span2>
           <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[80px]`} 
            value={formData.fabricsUsed} 
            onChange={e => setFormData(p => ({ ...p, fabricsUsed: e.target.value }))}
            placeholder="List main materials (e.g., 12oz Denim, Copper Rivets)..."
          />
        </Field>
        <Field label="Production Factory / Unit">
          <input 
            type="text" disabled={isReadOnly}
            className={inputClass} 
            value={formData.factoryLocation} 
            onChange={e => setFormData(p => ({ ...p, factoryLocation: e.target.value }))}
          />
        </Field>
        <Field label="Lead Merchandiser" required>
          <input 
            type="text" required disabled={isReadOnly}
            className={inputClass} 
            value={formData.merchandiser} 
            onChange={e => setFormData(p => ({ ...p, merchandiser: e.target.value }))}
          />
        </Field>
      </Section>

      <Section title="Logistics & Status" icon={Truck} number="03">
        <Field label="Ex-Factory (Shipment) Date" required>
           <div className="relative">
             <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-text-3" />
             <input 
                type="date" required disabled={isReadOnly}
                className={`${inputClass} pl-11`} 
                value={formData.shipDate} 
                onChange={e => setFormData(p => ({ ...p, shipDate: e.target.value }))}
              />
           </div>
        </Field>
        <Field label="Overall Order Status" required>
          <select 
            disabled={isReadOnly}
            className={inputClass}
            value={formData.status} 
            onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
          >
            <option>New</option>
            <option>In Production</option>
            <option>In Washing</option>
            <option>In Packing</option>
            <option>Ready</option>
            <option>Shipped</option>
            <option>Cancelled</option>
          </select>
        </Field>
        <Field label="Detailed Remarks" span2>
          <textarea 
            disabled={isReadOnly}
            className={`${inputClass} min-h-[80px] bg-accent/5`} 
            value={formData.remarks} 
            onChange={e => setFormData(p => ({ ...p, remarks: e.target.value }))}
          />
        </Field>
      </Section>

      <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
            <Paperclip className="w-5 h-5 text-accent" />
            Order Specs & Tech Pack Section
          </h4>
          {!isReadOnly && (
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
              <Plus className="w-4 h-4" /> Attach Files
              <input type="file" multiple className="hidden" onChange={handleFileAttach} />
            </label>
          )}
        </div>
        
        {formData.attachments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
            <InfoIcon className="w-12 h-12 mb-3" />
            <p className="text-sm font-bold uppercase tracking-widest">No tech packs attached</p>
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
