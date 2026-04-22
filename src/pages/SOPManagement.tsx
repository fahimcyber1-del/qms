import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Edit, Trash2, FileText, FileDown, AlertTriangle, CheckCircle, Clock, BookOpen, CheckCircle2 } from 'lucide-react';
import { SOPRecord } from '../types';
import { getSOPRecords, saveSOPRecords } from '../utils/sopUtils';
import { ExportModal } from '../components/ExportModal';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function SOPManagement({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [records, setRecords] = useState<SOPRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDept, setActiveDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    setRecords(getSOPRecords());
  }, []);

  const handleNavigateToForm = (mode: 'create' | 'edit' | 'view', data?: any) => {
    onNavigate('sop-form', { mode, data });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this SOP record?')) {
      const updatedRecords = records.filter(r => r.id !== id);
      setRecords(updatedRecords);
      saveSOPRecords(updatedRecords);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const departments = ['All', 'Cutting', 'Sewing', 'Finishing', 'Packing', 'Quality', 'Maintenance', 'HR', 'Logistics', 'IE', 'CAD', 'Compliance'];
  const statuses = ['All', 'Draft', 'Approved', 'Obsolete'];

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      (activeDept === 'All' || r.department === activeDept) &&
      (filterStatus === 'All' || r.status === filterStatus) &&
      (r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       r.sopId.toLowerCase().includes(searchTerm.toLowerCase()) ||
       r.process.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [records, searchTerm, activeDept, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      approved: records.filter(r => r.status === 'Approved').length,
      obsolete: records.filter(r => r.status === 'Obsolete').length,
      drafts: records.filter(r => r.status === 'Draft').length,
    };
  }, [records]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeDept, filterStatus]);

  const handleDownloadPDF = async (sop: SOPRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');

    await exportDetailToPDF({
      moduleName: 'Standard Operating Procedure',
      moduleId: 'sop',
      recordId: sop.sopId,
      fileName: `${sop.sopId}_${sop.title.replace(/\s+/g, '_')}`,
      fields: [
        { label: 'SOP ID',         value: sop.sopId },
        { label: 'Title',          value: sop.title },
        { label: 'Department',     value: sop.department },
        { label: 'Process',        value: sop.process },
        { label: 'Version',        value: sop.version },
        { label: 'Status',         value: sop.status },
        { label: 'Effective Date', value: sop.effectiveDate },
        { label: 'Prepared By',    value: sop.createdBy || '—' },
        { label: 'Purpose & Scope', value: sop.purpose || '—' },
        { label: 'Procedure Steps', value: sop.procedureSteps || '—' },
      ],
      attachments: sop.attachments?.map(a => typeof a === 'string' ? { name: 'SOP Document', data: a } : a)
    });
  };


  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-accent" />
            SOP Management
          </h1>
          <p className="text-text-2 text-base mt-2">Standard Operating Procedures Library & Process documentation.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2" onClick={() => setIsExportModalOpen(true)}>
            <FileDown className="w-4 h-4" /> Export Excel
          </button>
          <button className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow" onClick={() => handleNavigateToForm('create')}>
            <Plus className="w-4 h-4" /> Add New SOP
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total SOPs', value: stats.total, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Drafts', value: stats.drafts, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Obsolete', value: stats.obsolete, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-2 mb-1">{stat.label}</div>
              <div className="text-3xl font-bold text-text-1 tracking-tight">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 bg-bg-1 p-3 rounded-2xl border border-border-main shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-2" />
          <input 
            type="text" 
            placeholder="Search SOPs by ID, Title, or Process..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="w-full md:w-40 bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={activeDept} onChange={(e) => setActiveDept(e.target.value)}>
            {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
          </select>
          <select className="w-full md:w-40 bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Data Table */}
      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-bg-2 text-text-2 font-medium uppercase text-[10px] tracking-wider border-b border-border-main">
                <th className="px-6 py-4">SOP Info</th>
                <th className="px-6 py-4">Department / Process</th>
                <th className="px-6 py-4">Status & Eff. Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main text-text-1">
              <AnimatePresence mode="wait">
                {paginatedRecords.length > 0 ? (
                  paginatedRecords.map(record => (
                    <motion.tr 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }} 
                      layout
                      key={record.id} 
                      className="hover:bg-bg-2/50 transition-colors group cursor-pointer"
                      onClick={() => handleNavigateToForm('view', record)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-text-1 tracking-tight group-hover:text-accent transition-colors">{record.title}</span>
                          <span className="text-xs text-text-3 font-medium mt-1">{record.sopId} • {record.version}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-text-1">{record.department}</span>
                          <span className="text-xs text-text-3 mt-1 truncate">{record.process}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <div className="flex items-center gap-2">
                             {record.status === 'Approved' && <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-green-500/10 text-green-500 border border-green-500/20">{record.status}</span>}
                             {record.status === 'Draft' && <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">{record.status}</span>}
                             {record.status === 'Obsolete' && <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-red-500/10 text-red-500 border border-red-500/20">{record.status}</span>}
                          </div>
                          <span className="text-xs font-semibold text-text-3"><Clock className="w-3 h-3 inline mr-1"/> {record.effectiveDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 bg-bg-2 text-text-2 hover:text-accent hover:bg-accent/10 rounded-lg transition-all" title="View Details" onClick={() => handleNavigateToForm('view', record)}>
                            <FileText className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-bg-2 text-text-2 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all" title="Edit" onClick={() => handleNavigateToForm('edit', record)}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-bg-2 text-text-2 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all" title="Download PDF" onClick={(e) => handleDownloadPDF(record, e)}>
                            <FileDown className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-bg-2 text-text-2 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Delete" onClick={() => handleDelete(record.id)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-3">
                      <Search className="w-10 h-10 mx-auto mb-4 opacity-20" />
                      <p className="font-semibold text-lg">No SOPs found</p>
                      <p className="text-sm">Try adjusting your status or department filters.</p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Pagination & Footer */}
        <div className="p-4 border-t border-border-main bg-bg-2/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-2 font-medium">
          <span>
            Showing {filteredRecords.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
          </span>
          
          <div className="flex items-center gap-2">
            <button 
              className="px-3 py-1.5 rounded-lg border border-border-main bg-bg-1 hover:bg-bg-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                
                return (
                  <button
                    key={pageNum}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${currentPage === pageNum ? 'bg-accent text-white shadow-md' : 'bg-bg-1 border border-border-main hover:bg-bg-2'}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button 
              className="px-3 py-1.5 rounded-lg border border-border-main bg-bg-1 hover:bg-bg-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        data={records}
        columns={[
          {key: 'sopId', label: 'SOP ID'},
          {key: 'title', label: 'Title'},
          {key: 'department', label: 'Department'},
          {key: 'process', label: 'Process'},
          {key: 'version', label: 'Version'},
          {key: 'status', label: 'Status'},
          {key: 'effectiveDate', label: 'Effective Date'}
        ]}
        title="SOP Register"
      />

    </motion.div>
  );
}
