import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Save, X, ShoppingBag, Building, User, Calendar, 
  Package, CheckCircle2, AlertCircle, Info, Paperclip, Plus, Trash2, FileText, 
  Truck, DollarSign, Tag, Info as InfoIcon, Download, Flag, Search, Activity, Layers
} from 'lucide-react';
import { getTable } from '../db/db';
import { AttachmentList } from '../components/AttachmentList';

interface Props {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

const STAGES = [
  'Fabric Receive', 'Sample', 'Accessories', 'Cutting', 
  'Sewing', 'Finishing', 'Inspection', 'Shipment'
];

// ── Sub-Components ────────────────────────────────────────────────────────

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

export function BuyerOrderSummaryForm({ onNavigate, params }: Props) {
  const mode = params?.mode || 'create';
  const initialData = params?.data || {};
  const isReadOnly = mode === 'view';

  const [formData, setFormData] = useState({
    id: initialData.id || `ORD-${Date.now()}`,
    orderNo: initialData.orderNo || initialData.orderNumber || '',
    buyer: initialData.buyer || '',
    styleNo: initialData.styleNo || initialData.style || '',
    qty: initialData.qty ?? initialData.quantity ?? 0,
    fobPrice: initialData.fobPrice || initialData.unitPrice || 0,
    cmPrice: initialData.cmPrice || 0,
    currency: initialData.currency || 'USD',
    shipDate: initialData.shipDate || initialData.deliveryDate || '',
    poDate: initialData.poDate || '',
    status: initialData.status || 'New',
    priority: initialData.priority || 'Medium',
    season: initialData.season || '',
    fabricsUsed: initialData.fabricsUsed || '',
    factoryLocation: initialData.factoryLocation || '',
    merchandiser: initialData.merchandiser || initialData.responsiblePerson || '',
    shipmentMode: initialData.shipmentMode || 'Sea',
    destinationPort: initialData.destinationPort || '',
    remarks: initialData.remarks || '',
    attachments: initialData.attachments || [],
    createdAt: initialData.createdAt || new Date().toISOString(),
    updatedAt: initialData.updatedAt || initialData.createdAt || new Date().toISOString(),
    trackingHistory: initialData.trackingHistory || [
      { 
        date: initialData.createdAt || new Date().toISOString(), 
        action: 'Order Initiated', 
        user: 'System Admin',
        notes: 'Initial record created'
      }
    ],
    productionStages: initialData.productionStages || STAGES.map(s => ({
      name: s,
      status: 'Pending',
      date: '',
      inputQty: 0,
      outputQty: 0
    }))
  });

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isReadOnly) return;

    try {
      const now = new Date().toISOString();
      const updatedData = {
        ...formData,
        updatedAt: now
      };

      // Add tracking entry if status changed
      if (mode === 'edit' && formData.status !== initialData.status) {
        updatedData.trackingHistory = [
          ...formData.trackingHistory,
          {
            date: now,
            action: `Status changed to ${formData.status}`,
            user: 'System Admin', // Replace with actual user if available
            notes: `Status updated during manual edit`
          }
        ];
      }

      if (mode === 'create') {
        await getTable('orderSummary').add(updatedData);
      } else {
        await getTable('orderSummary').put(updatedData);
      }
      onNavigate('buyer-summary');
    } catch (error) {
      console.error('Error saving order record:', error);
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
      newAtts.push({ name: file.name, data });
    }
    
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAtts] }));
  };

  const exportPDF = async () => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    await exportDetailToPDF({
      moduleName: 'Buyer Order Specification',
      moduleId: 'merchandising',
      recordId: formData.orderNo,
      fileName: `Order_${formData.orderNo}`,
      fields: [
        { label: 'Order No',     value: formData.orderNo },
        { label: 'Buyer',        value: formData.buyer },
        { label: 'Style',        value: formData.styleNo },
        { label: 'Quantity',     value: String(formData.qty) },
        { label: 'FOB Price',    value: `${formData.fobPrice} ${formData.currency}` },
        { label: 'CM Price',     value: `${formData.cmPrice} ${formData.currency}` },
        { label: 'Ship Date',    value: formData.shipDate },
        { label: 'Status',       value: formData.status },
        { label: 'Merchandiser', value: formData.merchandiser },
      ],
      summary: formData.remarks ? ['Order Remarks:', formData.remarks] : undefined
    });
  };

  const baseInputClass = "bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const inputClass = `w-full ${baseInputClass}`;

  return (
    <div className="min-h-screen bg-bg-0">
      {/* ── Header ── */}
      <div className="sticky top-0 z-40 bg-bg-1/80 backdrop-blur-md border-b border-border-main p-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => onNavigate('buyer-summary')} className="w-10 h-10 rounded-xl bg-bg-1 border border-border-main flex items-center justify-center hover:bg-bg-2 transition-all shadow-sm">
            <ArrowLeft className="w-5 h-5 text-text-1" />
          </button>
          <div>
            <h1 className="text-xl font-black text-text-1 flex items-center gap-2 uppercase tracking-tight">
              {mode === 'create' ? 'Initiate Merchandising Order' : mode === 'edit' ? 'Update Order Lifecycle' : 'Order Specification'}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-mono font-bold text-text-3 tracking-tighter">{formData.id}</span>
              <span className="w-1 h-1 rounded-full bg-border-main"></span>
              <span className="text-[10px] font-black bg-accent text-white px-2.5 py-0.5 rounded-full uppercase">{formData.status}</span>
              {formData.updatedAt && (
                <>
                  <span className="w-1 h-1 rounded-full bg-border-main"></span>
                  <span className="text-[10px] font-bold text-text-3 uppercase">Updated: {new Date(formData.updatedAt).toLocaleString()}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isReadOnly ? (
             <>
               <button type="button" onClick={() => onNavigate('buyer-order-summary-form', { mode: 'edit', data: formData })} className="btn btn-ghost border border-border-main flex items-center gap-2">
                  <Trash2 className="w-4 h-4 rotate-45" /> Modify Record
               </button>
               <button type="button" onClick={exportPDF} className="btn btn-primary shadow-lg shadow-accent/20">
                  <Download className="w-4 h-4 mr-2" /> Download Specification
               </button>
             </>
          ) : (
            <>
              <button type="button" onClick={() => onNavigate('buyer-summary')} className="btn btn-ghost px-6">Cancel</button>
              <button type="button" onClick={() => handleSave()} className="btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20">
                <Save className="w-4 h-4" /> Save Order
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-8">
        {isReadOnly && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm">
              <div className="p-4 bg-accent/10 text-accent rounded-2xl mb-4"><Package className="w-8 h-8" /></div>
              <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Total Quantity</div>
              <div className="text-4xl font-black text-text-1 font-mono">{formData.qty.toLocaleString()}</div>
            </div>
            <div className="bg-bg-1 border border-border-main p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm text-center">
              <div className="p-4 bg-purple-main/10 text-purple-main rounded-2xl mb-4"><Calendar className="w-8 h-8" /></div>
              <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-2">Shipment Forecast</div>
              <div className="text-2xl font-black text-text-1 font-mono">{formData.shipDate || 'TBD'}</div>
            </div>
            <div className={`p-8 rounded-2xl flex flex-col items-center justify-center shadow-sm border ${
              formData.status === 'Shipped' || formData.status === 'Ready' ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'
            }`}>
              <div className="p-4 bg-white/10 rounded-2xl mb-4">
                <Activity className={`w-8 h-8 ${formData.status === 'Shipped' || formData.status === 'Ready' ? 'text-green-600' : 'text-amber-600'}`} />
              </div>
              <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Order Lifecycle</div>
              <div className={`text-2xl font-black uppercase ${formData.status === 'Shipped' || formData.status === 'Ready' ? 'text-green-600' : 'text-amber-600'}`}>
                {formData.status}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Section title="Order Identification" icon={Tag} number="01">
              <Field label="Order / PO Number" icon={Flag} required>
                <input 
                  type="text" required disabled={isReadOnly}
                  className={inputClass} 
                  value={formData.orderNo} 
                  onChange={e => setFormData(p => ({ ...p, orderNo: e.target.value }))}
                  placeholder="e.g., PO-2026-X99"
                />
            </Field>
            <Field label="PO Date" icon={Calendar} required>
               <input 
                  type="date" required disabled={isReadOnly}
                  className={inputClass} 
                  value={formData.poDate} 
                  onChange={e => setFormData(p => ({ ...p, poDate: e.target.value }))}
                />
            </Field>
            <Field label="Buyer Name" icon={User} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.buyer} 
                onChange={e => setFormData(p => ({ ...p, buyer: e.target.value }))}
                placeholder="e.g., Global Brands Ltd"
              />
            </Field>
            <Field label="Style Description" icon={Layers} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.styleNo} 
                onChange={e => setFormData(p => ({ ...p, styleNo: e.target.value }))}
                placeholder="e.g., Mens Slim Fit Denim"
              />
            </Field>
            <Field label="Target Season" icon={Calendar}>
              <input 
                type="text" disabled={isReadOnly}
                className={inputClass} 
                value={formData.season} 
                onChange={e => setFormData(p => ({ ...p, season: e.target.value }))}
                placeholder="e.g., Fall/Winter 2026"
              />
            </Field>
            <Field label="Order Priority" icon={Flag} required>
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

          <Section title="Commercials & Materials" icon={Package} number="02">
            <Field label="Order Quantity" icon={Package} required>
              <input 
                type="number" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.qty || ''} 
                onChange={e => setFormData(p => ({ ...p, qty: e.target.value === '' ? '' : Number(e.target.value) }))}
              />
            </Field>
            <Field label="FOB Price (Unit)" icon={DollarSign} span2>
              <div className="flex gap-2">
                <input 
                  type="number" step="0.01" disabled={isReadOnly}
                  className={`${baseInputClass} flex-1`} 
                  value={formData.fobPrice || ''} 
                  onChange={e => setFormData(p => ({ ...p, fobPrice: e.target.value === '' ? '' : Number(e.target.value) }))}
                />
                <select 
                  className={`${baseInputClass} w-32`} disabled={isReadOnly}
                  value={formData.currency}
                  onChange={e => setFormData(p => ({ ...p, currency: e.target.value }))}
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>BDT</option>
                </select>
              </div>
            </Field>
            <Field label="CM Price (Unit)" icon={DollarSign} span2>
              <input 
                type="number" step="0.01" disabled={isReadOnly}
                className={inputClass} 
                value={formData.cmPrice || ''} 
                onChange={e => setFormData(p => ({ ...p, cmPrice: e.target.value === '' ? '' : Number(e.target.value) }))}
                placeholder="0.00"
              />
            </Field>
            <Field label="Materials Specification" icon={FileText} span2>
               <textarea 
                disabled={isReadOnly}
                className={`${inputClass} min-h-[100px] resize-none`} 
                value={formData.fabricsUsed} 
                onChange={e => setFormData(p => ({ ...p, fabricsUsed: e.target.value }))}
                placeholder="List main materials (e.g., 12oz Denim, Copper Rivets)..."
              />
            </Field>
            <Field label="Production Unit" icon={Building}>
              <input 
                type="text" disabled={isReadOnly}
                className={inputClass} 
                value={formData.factoryLocation} 
                onChange={e => setFormData(p => ({ ...p, factoryLocation: e.target.value }))}
                placeholder="Factory Name / Section"
              />
            </Field>
            <Field label="Lead Merchandiser" icon={User} required>
              <input 
                type="text" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.merchandiser} 
                onChange={e => setFormData(p => ({ ...p, merchandiser: e.target.value }))}
              />
            </Field>
          </Section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Section title="Logistics" icon={Truck} number="03" className="md:grid-cols-1">
            <Field label="Ex-Factory Date" icon={Calendar} required>
               <input 
                type="date" required disabled={isReadOnly}
                className={inputClass} 
                value={formData.shipDate} 
                onChange={e => setFormData(p => ({ ...p, shipDate: e.target.value }))}
              />
            </Field>
            <Field label="Shipment Mode" icon={Truck}>
              <select 
                disabled={isReadOnly}
                className={inputClass}
                value={formData.shipmentMode} 
                onChange={e => setFormData(p => ({ ...p, shipmentMode: e.target.value }))}
              >
                <option>Sea</option>
                <option>Air</option>
                <option>Road</option>
                <option>Sea-Air</option>
              </select>
            </Field>
            <Field label="Destination Port" icon={Building}>
              <input 
                type="text" disabled={isReadOnly}
                className={inputClass} 
                value={formData.destinationPort} 
                onChange={e => setFormData(p => ({ ...p, destinationPort: e.target.value }))}
                placeholder="e.g., Port of Hamburg"
              />
            </Field>
            <Field label="Lifecycle Status" icon={Activity} required>
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
          </Section>

          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-lg flex items-center gap-2 text-text-1">
                <Paperclip className="w-5 h-5 text-accent" />
                Tech Pack & Docs
              </h4>
              {!isReadOnly && (
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-accent/20 transition-colors border border-accent/20">
                  <Plus className="w-4 h-4" /> Add Files
                  <input type="file" multiple className="hidden" onChange={handleFileAttach} />
                </label>
              )}
            </div>
            
            {formData.attachments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-bg-2 border-2 border-dashed border-border-main rounded-2xl opacity-40">
                <InfoIcon className="w-12 h-12 mb-3" />
                <p className="text-sm font-bold uppercase tracking-widest">No documents</p>
              </div>
            ) : (
              <AttachmentList
                attachments={formData.attachments}
                onRemove={!isReadOnly ? (i) => setFormData(p => ({ ...p, attachments: p.attachments.filter((_, idx) => idx !== i) })) : undefined}
              />
            )}
          </div>

          <Section title="Additional Notes" icon={Info} number="04" className="md:grid-cols-1">
             <Field label="Internal Remarks" icon={FileText} span2>
                <textarea 
                  disabled={isReadOnly}
                  className={`${inputClass} min-h-[100px] resize-none bg-accent/5`} 
                  value={formData.remarks} 
                  onChange={e => setFormData(p => ({ ...p, remarks: e.target.value }))}
                />
             </Field>
          </Section>

          {/* ── Production Stage Tracking ── */}
          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-6 lg:col-span-12">
            <div className="flex items-center justify-between border-b border-border-main pb-4">
              <h3 className="text-lg font-bold text-text-1 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-main/10 flex items-center justify-center text-purple-main">
                  <Activity className="w-5 h-5" />
                </div>
                Production Progress & Stage Tracking
              </h3>
            </div>
            
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[10px] font-black text-text-3 uppercase tracking-widest">
                    <th className="pb-2 px-4 w-[20%]">Stage Name</th>
                    <th className="pb-2 px-4 w-[15%]">Current Status</th>
                    <th className="pb-2 px-4 w-[15%]">Event Date</th>
                    <th className="pb-2 px-4 w-[15%] text-center">Input Qty</th>
                    <th className="pb-2 px-4 w-[15%] text-center">Output Qty</th>
                    <th className="pb-2 px-4 w-[15%] text-right pr-8">Balance</th>
                  </tr>
                </thead>
                <tbody className="">
                  {formData.productionStages.map((stage: any, idx: number) => (
                    <tr key={idx} className="bg-bg-2/30 hover:bg-bg-2/60 transition-all group">
                      <td className="py-3 px-4 rounded-l-xl border-y border-l border-border-main/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full shadow-sm ${
                            stage.status === 'Completed' ? 'bg-green-500' : 
                            stage.status === 'In Progress' || stage.status === 'Started' ? 'bg-amber-500 animate-pulse' : 
                            'bg-bg-3'
                          }`}></div>
                          <span className="text-xs font-black text-text-1 uppercase tracking-tight">{stage.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 border-y border-border-main/50">
                        <select 
                          disabled={isReadOnly}
                          className="w-full bg-bg-1 border border-border-main/50 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-accent outline-none text-text-2 shadow-sm"
                          value={stage.status}
                          onChange={e => {
                            const newStages = [...formData.productionStages];
                            newStages[idx].status = e.target.value;
                            setFormData(p => ({ ...p, productionStages: newStages }));
                          }}
                        >
                          <option>Pending</option>
                          <option>Started</option>
                          <option>In Progress</option>
                          <option>Delayed</option>
                          <option>Completed</option>
                          <option>Hold</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 border-y border-border-main/50">
                        <input 
                          type="date" disabled={isReadOnly}
                          className="w-full bg-bg-1 border border-border-main/50 rounded-lg px-3 py-1.5 text-[10px] font-bold focus:ring-2 focus:ring-accent outline-none text-text-2 shadow-sm"
                          value={stage.date}
                          onChange={e => {
                            const newStages = [...formData.productionStages];
                            newStages[idx].date = e.target.value;
                            setFormData(p => ({ ...p, productionStages: newStages }));
                          }}
                        />
                      </td>
                      <td className="py-3 px-4 border-y border-border-main/50">
                        <input 
                          type="number" disabled={isReadOnly}
                          className="w-full max-w-[100px] mx-auto block bg-bg-1 border border-border-main/50 rounded-lg px-3 py-1.5 text-xs font-mono font-bold focus:ring-2 focus:ring-accent outline-none text-text-1 text-center shadow-sm"
                          value={stage.inputQty || ''}
                          placeholder="0"
                          onChange={e => {
                            const newStages = [...formData.productionStages];
                            newStages[idx].inputQty = Number(e.target.value);
                            setFormData(p => ({ ...p, productionStages: newStages }));
                          }}
                        />
                      </td>
                      <td className="py-3 px-4 border-y border-border-main/50">
                        <input 
                          type="number" disabled={isReadOnly}
                          className="w-full max-w-[100px] mx-auto block bg-bg-1 border border-border-main/50 rounded-lg px-3 py-1.5 text-xs font-mono font-bold focus:ring-2 focus:ring-accent outline-none text-text-1 text-center shadow-sm"
                          value={stage.outputQty || ''}
                          placeholder="0"
                          onChange={e => {
                            const newStages = [...formData.productionStages];
                            newStages[idx].outputQty = Number(e.target.value);
                            setFormData(p => ({ ...p, productionStages: newStages }));
                          }}
                        />
                      </td>
                      <td className="py-3 px-4 rounded-r-xl border-y border-r border-border-main/50 pr-8">
                        <div className="text-right">
                          <span className={`text-xs font-mono font-black ${stage.inputQty - stage.outputQty > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                            {(stage.inputQty - stage.outputQty).toLocaleString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Tracking History Table ── */}
          <div className="bg-bg-1 p-6 md:p-8 rounded-2xl border border-border-main shadow-sm space-y-6 lg:col-span-12">
            <div className="flex items-center justify-between border-b border-border-main pb-4">
              <h3 className="text-lg font-bold text-text-1 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Activity className="w-5 h-5" />
                </div>
                Order Lifecycle Tracking
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-main">
                    <th className="py-4 px-4 text-[10px] font-black text-text-3 uppercase tracking-widest">Date & Time</th>
                    <th className="py-4 px-4 text-[10px] font-black text-text-3 uppercase tracking-widest">Action / Event</th>
                    <th className="py-4 px-4 text-[10px] font-black text-text-3 uppercase tracking-widest">User</th>
                    <th className="py-4 px-4 text-[10px] font-black text-text-3 uppercase tracking-widest">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                  {formData.trackingHistory.map((log: any, idx: number) => (
                    <tr key={idx} className="hover:bg-bg-2 transition-colors">
                      <td className="py-4 px-4">
                        <div className="text-sm font-bold text-text-1 font-mono">
                          {new Date(log.date).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] text-text-3 font-bold uppercase mt-0.5">
                          {new Date(log.date).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                          log.action.includes('Initiated') ? 'bg-blue-500/10 text-blue-600' : 
                          log.action.includes('Status changed') ? 'bg-amber-500/10 text-amber-600' :
                          'bg-bg-3 text-text-2'
                        }`}>
                          <Activity className="w-3 h-3" />
                          {log.action}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent border border-accent/20">
                            {log.user.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-text-2">{log.user}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-text-3 italic">{log.notes || '—'}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
