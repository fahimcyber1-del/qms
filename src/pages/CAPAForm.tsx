import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Check, X, Plus, Trash2, FileText, AlertCircle, Save, Building, User, Users, Award, ClipboardCheck, Clock, ShieldCheck, HelpCircle, Camera, Image } from 'lucide-react';
import { CAPARecord } from '../types';

interface CAPAFormProps {
  params: {
    mode: 'create' | 'edit' | 'view';
    data?: any;
    auditData?: {
      auditId: string;
      nc: string;
      department: string;
      auditor: string;
    };
  };
  onNavigate: (page: string, params?: any) => void;
}

export function CAPAForm({ params, onNavigate }: CAPAFormProps) {
  const { mode, data, auditData } = params;
  const isReadOnly = mode === 'view';

  const [formData, setFormData] = useState<CAPARecord>(data || {
    id: `CAPA-${Math.floor(Math.random() * 10000)}`,
    auditId: auditData?.auditId || '',
    nc: auditData?.nc || '',
    cause: '',
    action: '',
    preventive: '',
    responsible: '',
    deadline: '',
    status: 'Open',
    description: '',
    attachments: [],
    history: [],
    createdAt: new Date().toISOString()
  });
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image too large. Please select an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          attachments: [...(prev.attachments || []), base64String]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!formData.nc || !formData.responsible || !formData.deadline) {
      alert('Non-Conformity, Responsible, and Deadline are required fields.');
      return;
    }

    const stored = localStorage.getItem('garmentqms_capas');
    let capas = stored ? JSON.parse(stored) : [];

    const historyEntry = {
      date: new Date().toISOString(),
      change: mode === 'create' ? 'CAPA Raised' : 'CAPA Updated',
      responsible: formData.responsible,
      status: formData.status
    };

    const finalCapa = {
      ...formData,
      history: [...(formData.history || []), historyEntry],
      updatedAt: new Date().toISOString()
    };

    if (mode === 'edit' && data) {
      capas = capas.map((c: any) => c.id === data.id ? finalCapa : c);
    } else {
      capas = [finalCapa, ...capas];
    }

    localStorage.setItem('garmentqms_capas', JSON.stringify(capas));
    onNavigate('capa');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg-2"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border-main p-4 md:px-8 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors" onClick={() => onNavigate('capa')}>
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight">
              {mode === 'create' ? 'CAPA Initiation' : mode === 'edit' ? 'CAPA Modification' : 'CAPA Intelligence'}
              <span className="text-[10px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-full ml-2">CAPA / RCA</span>
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs font-bold text-gray-400 font-mono tracking-tighter">{formData.id}</span>
              <span className="text-[10px] text-gray-300">•</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                formData.status === 'Open' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                formData.status === 'Closed' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
              }`}>
                {formData.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          {!isReadOnly && (
            <button 
              className="btn bg-purple-600 hover:bg-purple-700 text-white border-none shadow-lg shadow-purple-200/50 flex items-center gap-2 px-6 h-11 transition-all hover:scale-105 active:scale-95" 
              onClick={handleSave}
            >
              <Save className="w-4 h-4" /> Save Record
            </button>
          )}
          <button className="btn btn-ghost h-11 px-4 hover:bg-red-50 hover:text-red-600 transition-colors" onClick={() => onNavigate('capa')}>
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="w-full mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Context & Metadata */}
          <div className="xl:col-span-4 space-y-8">
            <div className="bg-white rounded-2xl border border-border-main p-8 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Case Metadata</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Originating Audit ID</label>
                  <div className="relative">
                    <ClipboardCheck className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:opacity-50" 
                      value={formData.auditId} 
                      readOnly={isReadOnly || !!auditData}
                      onChange={(e) => setFormData({ ...formData, auditId: e.target.value })}
                      placeholder="e.g. AUD-1234"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Case Owner (Responsible)</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none transition-all" 
                      value={formData.responsible} 
                      readOnly={isReadOnly}
                      onChange={(e) => setFormData({ ...formData, responsible: e.target.value })} 
                      placeholder="Name of person in-charge"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification Deadline</label>
                    <input 
                      type="date" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none transition-all font-mono" 
                      value={formData.deadline} 
                      readOnly={isReadOnly}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Workflow State</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none transition-all" 
                      value={formData.status} 
                      disabled={isReadOnly}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Open">Open / Pending</option>
                      <option value="In Progress">In Execution</option>
                      <option value="Closed">Resolved / Verified</option>
                      <option value="Overdue">Overdue / Priority</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Non-Conformity Panel */}
            <div className="bg-red-50/50 rounded-2xl border border-red-100 p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-red-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-red-600 uppercase tracking-widest">Problem Statement</h3>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-red-400 uppercase tracking-widest">Critical Non-Conformity</label>
                <textarea 
                  className="w-full bg-white border border-red-100 rounded-xl px-4 py-4 text-sm font-bold text-red-700 focus:ring-2 focus:ring-red-500 outline-none transition-all min-h-[160px] shadow-inner resize-none" 
                  value={formData.nc} 
                  readOnly={isReadOnly || !!auditData}
                  onChange={(e) => setFormData({ ...formData, nc: e.target.value })}
                  placeholder="Describe the non-conformity in detail..."
                />
              </div>
              {auditData && (
                <div className="flex items-center gap-2 text-[10px] font-black text-red-400 bg-red-100/50 px-3 py-2 rounded-lg border border-red-100/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-500" /> Linked to Audit: {auditData.auditId}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Execution Plan */}
          <div className="xl:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl border border-border-main p-8 shadow-sm space-y-10">
              <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Root Cause & Resolution Plan</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Prevention of recurrence strategy</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* RCA section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-black">1</div>
                    <label className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-purple-600" /> Root Cause Analysis
                    </label>
                  </div>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all min-h-[160px] resize-none" 
                    value={formData.cause} 
                    readOnly={isReadOnly}
                    onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                    placeholder="Perform a 5-Why analysis to identify the fundamental cause of the NC..."
                  />
                  <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 border-dashed">
                    <p className="text-[10px] text-purple-700 italic font-medium leading-relaxed">
                      "Why did it happen? Why was that not detected? Why did the system allow it? Why was there no training? Why was the procedure not followed?"
                    </p>
                  </div>
                </div>

                {/* Immediate Action */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-black">2</div>
                    <label className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" /> Corrective Action
                    </label>
                  </div>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-all min-h-[160px] resize-none" 
                    value={formData.action} 
                    readOnly={isReadOnly}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                    placeholder="Immediate steps taken to contain the issue and correct the specific occurrence..."
                  />
                  <div className="p-4 bg-green-50/50 rounded-xl border border-green-100 border-dashed flex items-center gap-3">
                    <Clock className="w-4 h-4 text-green-600" />
                    <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest">Immediate Response Required</p>
                  </div>
                </div>

                {/* Preventive Action */}
                <div className="col-span-full space-y-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black">3</div>
                    <label className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" /> Strategic Prevention (Long-term)
                    </label>
                  </div>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[120px] resize-none shadow-sm" 
                    value={formData.preventive} 
                    readOnly={isReadOnly}
                    onChange={(e) => setFormData({ ...formData, preventive: e.target.value })}
                    placeholder="Systemic changes implemented to prevent recurrence across the organization (Process changes, automation, standard updates)..."
                  />
                </div>

                <div className="col-span-full space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Supporting Documentation & Evidence
                    </label>
                    {!isReadOnly && (
                      <div className="flex gap-2">
                        <input 
                          type="file" 
                          id="capa-file-upload" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <label 
                          htmlFor="capa-file-upload"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-purple-100 transition-colors border border-purple-100"
                        >
                          <Camera className="w-4 h-4" /> Add Image Evidence
                        </label>
                      </div>
                    )}
                  </div>
                  
                  <textarea 
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-gray-300 outline-none transition-all min-h-[80px] border-dashed" 
                    value={formData.description} 
                    readOnly={isReadOnly}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Additional context, witness statements, or reference documents..."
                  />

                  {/* Image Previews */}
                  {formData.attachments && formData.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-4 pt-2">
                      {formData.attachments.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <div className="w-32 h-32 rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                            <img 
                              src={img} 
                              alt={`Evidence ${idx + 1}`} 
                              className="w-full h-full object-cover"
                              onClick={() => window.open(img, '_blank')}
                            />
                          </div>
                          {!isReadOnly && (
                            <button 
                              onClick={() => removeImage(idx)}
                              className="absolute -top-2 -right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border-2 border-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* History Visualization */}
            {formData.history && formData.history.length > 0 && (
              <div className="bg-white rounded-2xl border border-border-main p-8 shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Audit Trail & Timeline</h3>
                </div>
                
                <div className="relative space-y-8 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  {formData.history.map((h, i) => (
                    <div key={i} className="relative pl-12">
                      <div className={`absolute left-0 top-1.5 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-transform hover:scale-110 z-10 ${
                        h.change.includes('Raised') ? 'bg-purple-500' : 'bg-blue-500'
                      }`}>
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 transition-shadow hover:shadow-md">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Event #{formData.history.length - i}</span>
                          <span className="text-[10px] font-bold text-gray-400 font-mono italic">{new Date(h.date).toLocaleString()}</span>
                        </div>
                        <h4 className="text-sm font-black text-gray-900 mb-1">{h.change}</h4>
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100/50">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                              <User className="w-3 h-3 text-gray-400" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500">{h.responsible || 'System'}</span>
                          </div>
                          <div className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                            h.status === 'Open' ? 'bg-amber-100 text-amber-700' : 
                            h.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {h.status || 'Active'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
