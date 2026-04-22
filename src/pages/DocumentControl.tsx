import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileLock2, CheckCircle2, AlertCircle, Plus, Download, 
  Search, Filter, Calendar, Eye, Edit2, Trash2, FileText, 
  ChevronRight, Lock, Clock, User, Building, X, History, FileCheck
} from 'lucide-react';
import { getTable } from '../db/db';
import * as XLSX from 'xlsx';
import { exportTableToPDF } from '../utils/pdfExportUtils';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

interface DocRecord {
  id: string;
  docTitle: string;
  docNumber: string;
  category: string;
  revision: string;
  status: string;
  department: string;
  responsiblePerson: string;
  releaseDate: string;
  createdAt: string;
}

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export function DocumentControl({ onNavigate }: Props) {
  const [records, setRecords] = useState<DocRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const load = async () => {
      let data = await getTable('documents').toArray();
      
      // Auto-seed if empty to populate the 100+ required documents
      if (data.length === 0) {
        const { MOCK_DOCS } = await import('../utils/docUtils');
        await getTable('documents').bulkAdd(MOCK_DOCS);
        data = await getTable('documents').toArray();
      }
      
      setRecords(data as any);
    };
    load();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = 
        r.docTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterCategory === 'All' || r.category === filterCategory;
      const matchesStatus = filterStatus === 'All' || r.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [records, searchQuery, filterCategory, filterStatus]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      active: records.filter(r => r.status === 'Published' || r.status === 'Active').length,
      draft: records.filter(r => r.status === 'Draft' || r.status === 'Under Review').length,
      superseded: records.filter(r => r.status === 'Superseded' || r.status === 'Obsolete').length
    };
  }, [records]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await getTable('documents').delete(id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Document Masterlist");
    XLSX.writeFile(wb, "Document_Control_Masterlist.xlsx");
  };

  const exportPDF = () => {
    exportTableToPDF({
      moduleName: 'Document Control System',
      columns: ['Doc #', 'Title', 'Category', 'Rev', 'Date', 'Status'],
      rows: filteredRecords.map(r => [r.docNumber, r.docTitle, r.category, r.revision, r.releaseDate, r.status]),
      fileName: 'Document_Control_Report'
    });
  };

  const exportSinglePDF = async (record: DocRecord) => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    await exportDetailToPDF({
      moduleName: 'Document Registration Record',
      moduleId: 'doc-control',
      recordId: record.docNumber,
      fileName: `Doc_${record.docNumber}`,
      fields: [
        { label: 'Document Title',     value: record.docTitle },
        { label: 'Document Number',    value: record.docNumber },
        { label: 'Category',           value: record.category },
        { label: 'Current Revision',   value: record.revision },
        { label: 'Department',         value: record.department },
        { label: 'Custodian Officer',  value: record.responsiblePerson },
        { label: 'Release Date',       value: record.releaseDate },
        { label: 'Control Status',     value: record.status },
      ]
    });
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <FileLock2 className="w-8 h-8 text-accent" />
            Document Control System
          </h1>
          <p className="text-text-2 text-base mt-2">Controlled master copies of SOPs, policies, and process documentation.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportExcel}>
            <Download className="w-4 h-4" /> Excel
          </button>
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportPDF}>
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => onNavigate('document-control-form', { mode: 'create' })}>
            <Plus className="w-4 h-4" /> New Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Dossiers', value: stats.total, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active / Published', value: stats.active, icon: FileCheck, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Drafts / Reviews', value: stats.draft, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Superseded', value: stats.superseded, icon: History, color: 'text-purple-main', bg: 'bg-purple-main/10' },
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

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 bg-bg-1 p-3 rounded-2xl border border-border-main shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-2" />
          <input 
            type="text" 
            placeholder="Search doc #, title, or department..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Cutting">Cutting</option>
          <option value="Sewing">Sewing</option>
          <option value="Finishing">Finishing</option>
          <option value="Audit">Audit</option>
          <option value="Training">Training</option>
          <option value="Maintenance">Maintenance</option>
          <option value="IE">IE Section</option>
          <option value="GPQ">GPQ Section</option>
          <option value="Safety">Safety</option>
          <option value="Supplier">Supplier</option>
          <option value="General">General</option>
        </select>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Published">Published / Active</option>
          <option value="Draft">Drafting</option>
          <option value="Archived">Archived</option>
          <option value="Obsolete">Superseded</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/50 border-b border-border-main text-[10px] uppercase tracking-widest text-text-2 font-black">
                <th className="p-4 pl-6">Doc Identification</th>
                <th className="p-4">Category & Department</th>
                <th className="p-4 text-center">Version / Rev</th>
                <th className="p-4 text-center">Release Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {paginatedRecords.map(r => (
                <tr key={r.id} className="hover:bg-bg-2/60 transition-all duration-200 group">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-text-1 text-sm">{r.docTitle}</div>
                    <div className="text-[11px] text-text-3 mt-1 font-mono uppercase tracking-tight">{r.docNumber}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                       <span className="text-sm font-semibold text-text-1">{r.category}</span>
                       <span className="text-[10px] text-text-3 font-bold uppercase tracking-tighter opacity-70 mt-0.5">{r.department}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center px-2 py-0.5 bg-bg-3 rounded-lg text-[10px] font-black text-text-2">
                       REV: {r.revision}
                    </div>
                  </td>
                  <td className="p-4 text-center text-xs font-semibold text-text-2 lowercase">
                    {new Date(r.releaseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      r.status === 'Published' || r.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      r.status === 'Draft' || r.status === 'Under Review' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                      'bg-purple-main/10 text-purple-main border-purple-main/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-accent text-text-2" onClick={() => onNavigate('document-control-form', { mode: 'view', data: r })}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-text-2" onClick={() => onNavigate('document-control-form', { mode: 'edit', data: r })}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-indigo-500/10 hover:text-indigo-500 text-text-2" title="Download PDF" onClick={() => exportSinglePDF(r)}>
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 text-text-2" onClick={() => handleDelete(r.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center ml-auto group-hover:hidden">
                      <ChevronRight className="w-4 h-4 text-text-3 opacity-30" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="bg-bg-2/50 border-t border-border-main p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-text-3 uppercase tracking-widest">
            Showing <span className="text-text-1">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-text-1">{Math.min(currentPage * itemsPerPage, filteredRecords.length)}</span> of <span className="text-text-1">{filteredRecords.length}</span> documents
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-xl bg-bg-1 border border-border-main hover:bg-bg-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                // Only show a few page numbers around current page
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                        currentPage === page 
                          ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                          : 'bg-bg-1 border border-border-main text-text-2 hover:bg-bg-3'
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="text-text-3 px-1">...</span>;
                }
                return null;
              })}
            </div>

            <button 
              className="p-2 rounded-xl bg-bg-1 border border-border-main hover:bg-bg-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
