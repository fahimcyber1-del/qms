import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Check, X } from 'lucide-react';
import { DocumentControlRecord } from '../types';

interface DocumentControlFormProps {
  params: {
    mode: 'add' | 'edit';
    data?: DocumentControlRecord;
  };
  onNavigate: (page: string, params?: any) => void;
}

export function DocumentControlForm({ params, onNavigate }: DocumentControlFormProps) {
  const { mode, data } = params;
  const [formData, setFormData] = useState<Partial<DocumentControlRecord>>(data || {
    status: 'Active',
    issueDate: new Date().toISOString().split('T')[0],
    version: '01'
  });

  const handleSave = () => {
    if (!formData.name || !formData.code) {
      alert('Document name and code are required.');
      return;
    }

    const stored = localStorage.getItem('garmentqms_doc_control');
    let documents: DocumentControlRecord[] = stored ? JSON.parse(stored) : [];

    if (mode === 'edit' && data) {
      documents = documents.map(doc => doc.id === data.id ? { ...doc, ...formData } as DocumentControlRecord : doc);
    } else {
      const newDoc: DocumentControlRecord = {
        ...formData,
        id: Date.now().toString(),
        serialNo: (documents.length + 1).toString().padStart(3, '0')
      } as DocumentControlRecord;
      documents = [newDoc, ...documents];
    }

    localStorage.setItem('garmentqms_doc_control', JSON.stringify(documents));
    onNavigate('doc-control');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page active"
    >
      <div className="sec-head">
        <div className="flex items-center gap-4">
          <button className="btn btn-ghost p-2" onClick={() => onNavigate('doc-control')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="sec-title">{mode === 'add' ? 'Add New Document' : 'Edit Document'}</div>
            <div className="sec-sub">{formData.code} {formData.name}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={handleSave}>
            <Check className="w-4 h-4 mr-2" /> Save Document
          </button>
          <button className="btn btn-ghost" onClick={() => onNavigate('doc-control')}>
            <X className="w-4 h-4 mr-2" /> Cancel
          </button>
        </div>
      </div>

      <div className="w-full p-4 md:p-6 lg:p-8">
        <div className="card p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="fg">
              <label>Document Code</label>
              <input 
                className="form-control" 
                value={formData.code || ''} 
                onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
                placeholder="e.g. QMS-DOC-001"
              />
            </div>
            <div className="fg">
              <label>Version</label>
              <input 
                className="form-control" 
                value={formData.version || ''} 
                onChange={(e) => setFormData({ ...formData, version: e.target.value })} 
              />
            </div>
            <div className="fg md:col-span-2">
              <label>Document Name</label>
              <input 
                className="form-control" 
                value={formData.name || ''} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                placeholder="e.g. Quality Policy Manual"
              />
            </div>
            <div className="fg">
              <label>Category</label>
              <select 
                className="form-control" 
                value={formData.category || ''} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="Manual">Manual</option>
                <option value="Procedure">Procedure</option>
                <option value="Policy">Policy</option>
                <option value="Form">Form</option>
                <option value="Guideline">Guideline</option>
              </select>
            </div>
            <div className="fg">
              <label>Status</label>
              <select 
                className="form-control" 
                value={formData.status || ''} 
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="Active">Active</option>
                <option value="Obsolete">Obsolete</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            <div className="fg">
              <label>Issue Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={formData.issueDate || ''} 
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} 
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
