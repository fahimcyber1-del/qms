import React, { useState, useMemo, useEffect } from 'react';
import { ExportModal } from '../components/ExportModal';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RefreshCw, Search, Plus, Clock, CheckCircle2, AlertCircle, 
  Eye, Edit2, Trash2, Download, Database, X, Save,
  AlertTriangle, FileText, FileDown, CheckCircle
} from 'lucide-react';
import { FollowUpRecord, CAPARecord } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export function FollowUpAudit() {
  const [capas, setCapas] = useState<CAPARecord[]>(() => {
    const stored = localStorage.getItem('garmentqms_capas');
    return stored ? JSON.parse(stored) : [];
  });

  const [followups, setFollowups] = useState<FollowUpRecord[]>(() => {
    const stored = localStorage.getItem('garmentqms_followup_audits');
    if (stored) return JSON.parse(stored);
    
    // Initial Seed if empty
    if (capas.length > 0) {
      return [{
        id: 'FUA-2024-001',
        capaId: capas[0].id,
        capaDescription: capas[0].nc,
        department: capas[0].department || 'Compliance',
        verificationDate: new Date().toISOString().split('T')[0],
        verifier: 'Senior Audit Executive',
        status: 'Verified',
        remarks: 'Direct observation confirms all fabric rolls are now stored within marked yellow lines. Aisles are 100% clear as per safety standards.',
        evidenceUrls: [],
        createdAt: new Date().toISOString()
      }];
    }
    return [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedFollowup, setSelectedFollowup] = useState<FollowUpRecord | null>(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Form State
  const [formData, setFormData] = useState<Partial<FollowUpRecord>>({
    capaId: '',
    status: 'Verified',
    verificationDate: new Date().toISOString().split('T')[0],
    verifier: 'Admin',
    remarks: '',
    evidenceUrls: []
  });

  useEffect(() => {
    localStorage.setItem('garmentqms_followup_audits', JSON.stringify(followups));
  }, [followups]);

  const filteredFollowups = useMemo(() => {
    return followups.filter(f => {
      const matchesSearch = 
        f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.capaId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.capaDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.verifier.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'All' || f.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [followups, searchQuery, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: followups.length,
      verified: followups.filter(f => f.status === 'Verified').length,
      partial: followups.filter(f => f.status === 'Partially Verified').length,
      failed: followups.filter(f => f.status === 'Not Verified').length
    };
  }, [followups]);

  const handleOpenModal = (f?: FollowUpRecord, view: boolean = false) => {
    if (f) {
      setFormData(f);
      setSelectedFollowup(f);
    } else {
      setFormData({
        capaId: '',
        status: 'Verified',
        verificationDate: new Date().toISOString().split('T')[0],
        verifier: 'Admin',
        remarks: '',
        evidenceUrls: []
      });
      setSelectedFollowup(null);
    }
    setViewOnly(view);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCapa = capas.find(c => c.id === formData.capaId);
    if (!targetCapa) {
      alert("Invalid CAPA ID Selected");
      return;
    }

    const newRecord: FollowUpRecord = {
      id: formData.id || `FUA-${Date.now()}`,
      capaId: formData.capaId!,
      capaDescription: targetCapa.nc,
      department: targetCapa.department || "Production",
      status: formData.status!,
      verificationDate: formData.verificationDate!,
      verifier: formData.verifier!,
      remarks: formData.remarks!,
      evidenceUrls: formData.evidenceUrls || [],
      createdAt: formData.createdAt || new Date().toISOString()
    };

    if (formData.id) {
      setFollowups(prev => prev.map(f => f.id === formData.id ? newRecord : f));
    } else {
      setFollowups(prev => [newRecord, ...prev]);
    }

    // Auto-update CAPA status if verified
    if (newRecord.status === 'Verified') {
      const updatedCapas = capas.map(c => c.id === newRecord.capaId ? { ...c, status: 'Closed' } : c);
      setCapas(updatedCapas);
      localStorage.setItem('garmentqms_capas', JSON.stringify(updatedCapas));
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (selectedFollowup) {
      setFollowups(prev => prev.filter(f => f.id !== selectedFollowup.id));
      setIsDeleteModalOpen(false);
      setSelectedFollowup(null);
    }
  };

  const downloadPDF = async (f: FollowUpRecord) => {
    const {
      createDoc, drawPdfHeader, drawInfoGrid, drawSectionLabel,
      proTable, embedAttachments, addPageFooters, drawSignatureRow
    } = await import('../utils/pdfExport');

    const doc = createDoc({ orientation: 'p', paperSize: 'a4' });
    let y = drawPdfHeader(doc, 'Follow-Up Audit Report', `Ref: ${f.id}`);

    y = drawInfoGrid(doc, y, [
      { label: 'Follow-Up ID',      value: f.id },
      { label: 'CAPA Reference',    value: f.capaId },
      { label: 'Department',        value: f.department },
      { label: 'Verification Date', value: f.verificationDate },
      { label: 'Lead Verifier',     value: f.verifier },
      { label: 'Outcome Status',    value: f.status },
    ]);

    y = drawSectionLabel(doc, y, 'Issue Description');
    y = proTable(doc, y, [['CAPA Finding']], [[f.capaDescription]]) + 6;

    y = drawSectionLabel(doc, y, 'Verification Observations');
    y = proTable(doc, y, [['Remarks']], [[f.remarks || '—']]) + 6;

    drawSignatureRow(doc, y, ['Lead Verifier', 'QA Manager', 'Authorized By']);

    if (f.evidenceUrls && f.evidenceUrls.length > 0) {
      await embedAttachments(doc, f.evidenceUrls, 'VERIFICATION EVIDENCE');
    }

    addPageFooters(doc);
    doc.save(`FollowUp_${f.id}.pdf`);
  };


  const seedMockData = () => {
    if (capas.length === 0) {
      alert("Please seed CAPA data first in the CAPA module.");
      return;
    }
    const mockRecord: FollowUpRecord = {
      id: `FUA-${Date.now()}`,
      capaId: capas[0].id,
      capaDescription: capas[0].nc,
      department: capas[0].department || 'Quality',
      verificationDate: new Date().toISOString().split('T')[0],
      verifier: 'Audit Lead',
      status: 'Verified',
      remarks: 'All corrective actions verified on site. Fabric rolls moved as per policy and 5S guidelines.',
      evidenceUrls: [],
      createdAt: new Date().toISOString()
    };
    setFollowups([mockRecord, ...followups]);

    const updatedCapas = capas.map(c => c.id === mockRecord.capaId ? { ...c, status: 'Closed' } : c);
    setCapas(updatedCapas);
    localStorage.setItem('garmentqms_capas', JSON.stringify(updatedCapas));
  };

  return (
    <div className="page active p-4 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="sec-head">
        <div>
          <div className="sec-title flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-accent animate-spin-slow" />
            Follow-Up Audit
          </div>
          <div className="sec-sub">Verification of Corrective Action (CAPA) Effectiveness</div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={seedMockData}><Database className="w-4 h-4 mr-2"/> Seed Data</button>
          <button className="btn btn-ghost" onClick={() => setIsExportModalOpen(true)}>⬇ Export List</button>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2" /> Add Record</button>
        </div>
      </div>

      {/* Metrics Section */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Verifications', value: stats.total, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Fully Verified', value: stats.verified, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Partial Success', value: stats.partial, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Not Verified', value: stats.failed, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl p-6 flex items-center gap-5 shadow-sm">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-2 mb-1 uppercase tracking-wider">{stat.label}</div>
              <div className="text-3xl font-bold text-text-1">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter and Search Section */}
      <div className="flex flex-wrap items-center gap-4 bg-bg-1 p-3 rounded-2xl border border-border-main shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-3" />
          <input 
            type="text" 
            placeholder="Search Follow-up ID, CAPA Ref, or Verifier..." 
            className="form-control pl-11 w-full" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <select className="form-control w-full md:w-56" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Verification Statuses</option>
          <option value="Verified">Verified</option>
          <option value="Partially Verified">Partially Verified</option>
          <option value="Not Verified">Not Verified</option>
          <option value="Needs Revisit">Needs Revisit</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="card shadow-glass">
        <div className="card-header"><div className="card-title">Verification Audit Index</div></div>
        <div className="tbl-wrap">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/70 border-b border-border-main text-[10px] uppercase tracking-widest text-text-3 font-black">
                <th className="p-4 pl-6">Record ID</th>
                <th className="p-4">CAPA Reference & Description</th>
                <th className="p-4">Verifier</th>
                <th className="p-4 text-center">Audit Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredFollowups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-text-3 font-mono opacity-50">
                    NO FOLLOW-UP RECORDS FOUND IN DATABASE
                  </td>
                </tr>
              ) : filteredFollowups.map(f => (
                <tr key={f.id} className="hover:bg-bg-2/40 transition-all duration-200 group">
                  <td className="p-4 pl-6 font-mono font-black text-text-1 text-sm">{f.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-accent text-xs mb-1 tracking-wider uppercase">{f.capaId}</div>
                    <div className="text-text-1 text-sm font-medium line-clamp-1 group-hover:line-clamp-none transition-all duration-300">{f.capaDescription}</div>
                  </td>
                  <td className="p-4 font-bold text-text-2 text-xs uppercase tracking-tight">{f.verifier}</td>
                  <td className="p-4 text-center text-xs font-black text-text-3 font-mono">{f.verificationDate}</td>
                  <td className="p-4 text-center">
                    <span className={`badge ${
                      f.status === 'Verified' ? 'badge-green' : 
                      f.status === 'Partially Verified' ? 'badge-amber' : 
                      'badge-red'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="btn btn-ghost btn-sm p-1.5" title="Details" onClick={() => handleOpenModal(f, true)}><Eye className="w-4 h-4" /></button>
                      <button className="btn btn-ghost btn-sm p-1.5" title="Edit" onClick={() => handleOpenModal(f, false)}><Edit2 className="w-4 h-4" /></button>
                      <button className="btn btn-ghost btn-sm p-1.5" title="Download ZIP" onClick={() => downloadPDF(f)}><FileDown className="w-4 h-4" /></button>
                      <button className="btn btn-ghost btn-sm p-1.5 text-red-500 hover:bg-red-500/10" title="Delete" onClick={() => { setSelectedFollowup(f); setIsDeleteModalOpen(true); }}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal active">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content bg-bg-1 border border-border-main shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6 border-b border-border-main pb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {selectedFollowup ? (viewOnly ? 'Verification Audit Details' : 'Edit Verification Record') : 'New Follow-up Verification'}
                  </h3>
                  <p className="text-xs text-text-3 mt-1 uppercase tracking-widest">Compliance verification workflow</p>
                </div>
                <button className="p-2 hover:bg-bg-2 rounded-lg transition-colors" onClick={() => setIsModalOpen(false)}><X className="w-5 h-5"/></button>
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-2 gap-6 p-1">
                <div className="col-span-2">
                  <label className="text-xs font-black text-text-3 mb-2 block uppercase tracking-widest">Select CAPA Reference</label>
                  <select 
                    className="form-control font-bold" 
                    value={formData.capaId} 
                    onChange={e => setFormData({...formData, capaId: e.target.value})}
                    required
                    disabled={viewOnly || !!selectedFollowup}
                  >
                    <option value="">Choose a CAPA finding to verify...</option>
                    {capas.filter(c => c.status !== 'Closed' || (selectedFollowup && selectedFollowup.capaId === c.id)).map(c => (
                      <option key={c.id} value={c.id}>{c.id} - {c.nc.substring(0, 70)}...</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="text-xs font-black text-text-3 mb-2 block uppercase tracking-widest">Outcome Status</label>
                  <select 
                    className="form-control" 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                    disabled={viewOnly}
                    required
                  >
                    <option value="Verified">Verified (Compliant)</option>
                    <option value="Partially Verified">Partially Verified</option>
                    <option value="Not Verified">Not Verified (Major Finding)</option>
                    <option value="Needs Revisit">Needs Revisit</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="text-xs font-black text-text-3 mb-2 block uppercase tracking-widest">Audited Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={formData.verificationDate} 
                    onChange={e => setFormData({...formData, verificationDate: e.target.value})}
                    disabled={viewOnly}
                    required 
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-black text-text-3 mb-2 block uppercase tracking-widest">Lead Verifier / Auditor</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.verifier} 
                    onChange={e => setFormData({...formData, verifier: e.target.value})}
                    disabled={viewOnly}
                    placeholder="Enter the name of person conducting the verification..."
                    required 
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-black text-text-3 mb-2 block uppercase tracking-widest">Verification Observations</label>
                  <textarea 
                    className="form-control min-h-[140px] text-sm" 
                    value={formData.remarks} 
                    onChange={e => setFormData({...formData, remarks: e.target.value})}
                    disabled={viewOnly}
                    placeholder="Describe specific evidence checked (e.g. photos, logs, physical inspection findings)..."
                    required 
                  />
                </div>

                <div className="col-span-2 flex justify-end gap-3 mt-6 pt-6 border-t border-border-main">
                  {viewOnly ? (
                    <>
                      <button type="button" className="btn btn-ghost" onClick={() => downloadPDF(selectedFollowup!)}><FileDown className="w-4 h-4 mr-2" /> PDF Report</button>
                      <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(false)}>Close</button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Discard</button>
                      <button type="submit" className="btn btn-primary flex items-center gap-2">
                        <Save className="w-4 h-4" /> Finalize Record
                      </button>
                    </>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="modal active">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="modal-content">
              <div className="text-center p-4">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold">Remove Verification?</h3>
                <p className="text-text-3 text-sm mt-2 font-medium">This follow-up audit record will be permanently deleted from the registry.</p>
              </div>
              <div className="flex justify-center gap-3 mt-6">
                <button className="btn btn-ghost px-8" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                <button className="btn btn-red px-8" onClick={confirmDelete}>Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        data={filteredFollowups} 
        title="Follow-up Audit Verification Data"
        columns={[
          { key: 'id', label: 'Follow-up ID' },
          { key: 'capaId', label: 'CAPA Reference' },
          { key: 'department', label: 'Dept' },
          { key: 'verificationDate', label: 'Audit Date' },
          { key: 'verifier', label: 'Auditor' },
          { key: 'status', label: 'Result Status' },
          { key: 'remarks', label: 'Verification Remarks' }
        ]}
      />
    </div>
  );
}
