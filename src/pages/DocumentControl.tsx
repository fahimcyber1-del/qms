import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Edit2, Trash2, FileText, Download, Filter, X, RotateCcw } from 'lucide-react';
import { DocumentControlRecord } from '../types';
import { ExportModal } from '../components/ExportModal';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

import { getDocuments } from '../utils/docUtils';

export function DocumentControl({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [companyName, setCompanyName] = useState(() => localStorage.getItem('companyName') || 'GarmentQMS Pro Factory');
  const [documents, setDocuments] = useState<DocumentControlRecord[]>(getDocuments());
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setCompanyName(localStorage.getItem('companyName') || 'GarmentQMS Pro Factory');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('garmentqms_doc_control', JSON.stringify(documents));
  }, [documents]);

  const categories = ['All', ...Array.from(new Set(documents.map(d => d.category || 'General')))];

  const handleNavigateToForm = (mode: 'add' | 'edit', doc?: DocumentControlRecord) => {
    onNavigate('doc-control-form', { mode, data: doc });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document record?')) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  const handleReset = () => {
    if (window.confirm('This will delete all your custom changes and restore the full list of 152+ documents. Continue?')) {
      localStorage.removeItem('garmentqms_doc_control');
      window.location.reload();
    }
  };

  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.serialNo.includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="page active p-6">
      <div className="sec-head">
        <div>
          <div className="sec-title">🗄️ Document Control System</div>
          <div className="sec-sub">{companyName} · ISO 9001:2015 Clause 7.5</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="form-control pl-9 w-64" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <select 
            className="form-control w-40"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button className="btn btn-ghost text-red-500" onClick={handleReset} title="Restore default 152 documents">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </button>
          <button className="btn btn-ghost" onClick={() => setIsExportModalOpen(true)}>
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <button className="btn btn-primary" onClick={() => handleNavigateToForm('add')}>
            <Plus className="w-4 h-4 mr-2" /> Add Document
          </button>
        </div>
      </div>

      <motion.div variants={itemVariants} className="card mt-6">
        <div className="tbl-wrap" style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
          <table className="sticky-header">
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Document Code</th>
                <th>Document Name</th>
                <th>Category</th>
                <th>Issue Date</th>
                <th>Version</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-bg-1/50 transition-colors">
                  <td className="font-mono text-sm">{doc.serialNo}</td>
                  <td className="font-bold text-primary-main">{doc.code}</td>
                  <td>{doc.name}</td>
                  <td><span className="badge badge-cyan">{doc.category || 'General'}</span></td>
                  <td>{doc.issueDate}</td>
                  <td><span className="badge badge-ghost">V{doc.version}</span></td>
                  <td>
                    <span className={`badge ${
                      doc.status === 'Active' ? 'badge-green' : 
                      doc.status === 'Obsolete' ? 'badge-red' : 'badge-amber'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button className="icon-btn hover:text-primary-main" onClick={() => handleNavigateToForm('edit', doc)}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="icon-btn hover:text-red-500" onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-text-3">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No documents found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-border-main text-xs text-text-3 flex justify-between">
          <span>Showing {filteredDocs.length} of {documents.length} documents</span>
          <span>Linked to ERP: {companyName}</span>
        </div>
      </motion.div>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        data={documents}
        dateKey="issueDate"
        extraFilters={[
          {
            key: 'category',
            label: 'Category',
            options: categories.filter(c => c !== 'All').map((c: string) => ({ label: c, value: c }))
          },
          {
            key: 'status',
            label: 'Status',
            options: [
              { label: 'Active', value: 'Active' },
              { label: 'Under Review', value: 'Under Review' },
              { label: 'Obsolete', value: 'Obsolete' }
            ]
          }
        ]}
        columns={[
          { key: 'serialNo', label: 'Serial No' },
          { key: 'code', label: 'Document Code' },
          { key: 'name', label: 'Document Name' },
          { key: 'category', label: 'Category' },
          { key: 'issueDate', label: 'Issue Date' },
          { key: 'version', label: 'Version' },
          { key: 'status', label: 'Status' }
        ]}
        title="Document Control Register"
      />
    </motion.div>
  );
}
