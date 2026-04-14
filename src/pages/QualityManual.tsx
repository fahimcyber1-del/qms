import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Upload, Eye, FileDown, History, Trash2, FileText, X } from 'lucide-react';
import { QualityManualRecord, SOPAttachment } from '../types';
import { getManualRecords, saveManualRecords } from '../utils/manualUtils';

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

export function QualityManual() {
  const [manuals, setManuals] = useState<QualityManualRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedManual, setSelectedManual] = useState<QualityManualRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Cutting' as any, file: null as File | null });

  useEffect(() => { setManuals(getManualRecords()); }, []);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newManual: QualityManualRecord = {
        id: `MAN-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        file: { name: formData.file!.name, data: reader.result as string, type: formData.file!.type },
        version: 'V1.0',
        uploaderName: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        versionHistory: [],
        tags: []
      };
      
      const updated = [newManual, ...manuals];
      setManuals(updated);
      saveManualRecords(updated);
      setIsUploadModalOpen(false);
      setFormData({ title: '', description: '', category: 'Cutting', file: null });
    };
    reader.readAsDataURL(formData.file);
  };

  const filteredManuals = manuals.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="page active">
      <div className="sec-head">
        <div>
          <div className="sec-title">📗 Quality Manuals</div>
          <div className="sec-sub">Standardized Factory Quality Documentation</div>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
            <input type="text" placeholder="Search manuals..." className="form-control pl-9 w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" /> Upload Manual
          </button>
        </div>
      </div>

      <motion.div variants={itemVariants} className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Category</th>
              <th>Uploaded On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredManuals.map((m, idx) => (
              <tr key={m.id}>
                <td>{idx + 1}</td>
                <td className="font-medium">{m.title}</td>
                <td><span className="badge">{m.category}</span></td>
                <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedManual(m); setIsViewModalOpen(true); }} title="View"><Eye className="w-4 h-4" /></button>
                    <a href={m.file.data} download={m.file.name} className="btn btn-ghost btn-sm" title="Download"><FileDown className="w-4 h-4" /></a>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedManual(m); setIsHistoryModalOpen(true); }} title="Version History"><History className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="modal active">
          <div className="modal-content">
            <h3>Upload Quality Manual</h3>
            <form onSubmit={handleUpload} className="mt-4 space-y-4">
              <div><label className="text-xs text-text-2 mb-1 block">Title</label><input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
              <div><label className="text-xs text-text-2 mb-1 block">Description</label><textarea className="form-control" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required /></div>
              <div>
                <label className="text-xs text-text-2 mb-1 block">Category</label>
                <select className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                  {['Cutting', 'Sewing', 'Fusing', 'Washing', 'Finishing', 'Packing', 'Embroidery', 'Printing'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="text-xs text-text-2 mb-1 block">File (PDF, DOCX, Images)</label><input type="file" className="form-control" onChange={e => setFormData({...formData, file: e.target.files?.[0] || null})} required /></div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="btn btn-ghost" onClick={() => setIsUploadModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedManual && (
        <div className="modal active">
          <div className="modal-content h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3>{selectedManual.title}</h3>
              <button className="btn btn-ghost" onClick={() => setIsViewModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 border border-border-main rounded overflow-hidden">
              {selectedManual.file.type === 'application/pdf' ? (
                <iframe src={selectedManual.file.data} className="w-full h-full" title="Manual Viewer" />
              ) : (
                <div className="p-4 text-center">File type not supported for inline preview. Please <a href={selectedManual.file.data} download={selectedManual.file.name} className="text-blue-600 underline">download</a> to view.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryModalOpen && selectedManual && (
        <div className="modal active">
          <div className="modal-content">
            <h3>Version History - {selectedManual.title}</h3>
            <div className="mt-4 space-y-2">
              {selectedManual.versionHistory.length > 0 ? selectedManual.versionHistory.map((h, i) => (
                <div key={i} className="bg-bg-2 p-2 rounded text-xs border border-border-main">
                  <div><strong>{h.version}</strong> - {new Date(h.updatedAt).toLocaleDateString()}</div>
                  <div className="text-text-3">{h.changes}</div>
                </div>
              )) : <p className="text-text-3 text-sm">No previous versions.</p>}
            </div>
            <button className="btn btn-ghost mt-4 w-full" onClick={() => setIsHistoryModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
