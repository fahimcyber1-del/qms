import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, Plus, FileText, History, Edit2, Trash2, Download, RefreshCw, 
  BookOpen, CheckCircle2, Clock, AlertTriangle, Filter, Eye, ChevronRight,
  Layers, ShieldCheck, AlertCircle
} from 'lucide-react';
import { ProcedureRecord, RevisionEntry, ProcedureSection } from '../types';
import { getProcedureRecords, saveProcedureRecords } from '../utils/procedureUtils';

export function ProcedureManagement({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [procedures, setProcedures] = useState<ProcedureRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDept, setActiveDept] = useState('');
  const [activeStatus, setActiveStatus] = useState('');

  useEffect(() => { 
    setProcedures(getProcedureRecords()); 
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this procedure?')) {
      const updated = procedures.filter(p => p.id !== id);
      setProcedures(updated);
      saveProcedureRecords(updated);
    }
  };

  const handleReset = () => {
    if (window.confirm('This will reset all procedure data to the default list. Any custom changes will be lost. Continue?')) {
      localStorage.removeItem('garmentqms_procedures');
      window.location.reload();
    }
  };

  const exportCSV = () => {
    const headers = ['Code', 'Title', 'Department', 'Category', 'ISO Clause', 'Version', 'Issue Date', 'Review Date', 'Status'];
    const rows = filtered.map(p => [
      p.code, `"${p.title}"`, p.dept, p.cat, p.clause, p.ver, p.issueDate, p.reviewDate, p.status
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `procedures_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = procedures.filter(p => {
    const matchesSearch = p.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.dept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = activeDept === '' || p.dept === activeDept;
    const matchesStatus = activeStatus === '' || p.status === activeStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const stats = {
    total: procedures.length,
    active: procedures.filter(p => p.status === 'Active').length,
    review: procedures.filter(p => p.status === 'Under Review').length,
    overdue: procedures.filter(p => {
      const days = Math.ceil((new Date(p.reviewDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return days < 0 && p.status !== 'Obsolete';
    }).length
  };

  const handleExportSinglePDF = async (proc: ProcedureRecord) => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    await exportDetailToPDF({
      moduleName: 'Documented Procedure Specification',
      moduleId: 'procedure',
      recordId: proc.code,
      fileName: `Proc_${proc.code}`,
      fields: [
        { label: 'Procedure Title',    value: proc.title },
        { label: 'Procedure Code',     value: proc.code },
        { label: 'Category',           value: proc.cat },
        { label: 'Department',         value: proc.dept },
        { label: 'ISO 9001 Clause',    value: proc.clause },
        { label: 'Current Version',    value: proc.ver },
        { label: 'Issue Date',         value: proc.issueDate },
        { label: 'Review Date',        value: proc.reviewDate },
        { label: 'Control Status',     value: proc.status },
      ]
    });
  };

  const departments = [...new Set(procedures.map(p => p.dept))].sort();

  const openForm = (mode: 'add' | 'edit' | 'view' | 'revision' | 'document', proc: ProcedureRecord | null = null) => {
    onNavigate('procedure-form', { mode, data: proc });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Under Review': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Draft': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Obsolete': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <motion.div 
      className="p-4 md:p-6 lg:p-8 space-y-6" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-1 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-accent" />
            Procedure Management
          </h1>
          <p className="text-text-3 text-sm mt-1">ISO 9001:2015 documented procedures & process control</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-bg-1 border border-border-main rounded-xl text-sm font-medium text-text-2 hover:border-accent hover:text-accent transition-all" onClick={handleReset}>
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-bg-1 border border-border-main rounded-xl text-sm font-medium text-text-2 hover:border-accent hover:text-accent transition-all" onClick={exportCSV}>
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-sm" onClick={() => openForm('add')}>
            <Plus className="w-4 h-4" /> New Procedure
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Procedures', value: stats.total, icon: Layers, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active', value: stats.active, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Under Review', value: stats.review, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Review Overdue', value: stats.overdue, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-bg-1 border border-border-main rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`p-3.5 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-text-3 mb-0.5">{stat.label}</div>
              <div className="text-2xl font-bold text-text-1 tracking-tight">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-bg-1 rounded-2xl border border-border-main p-4 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
            <input 
              type="text" 
              placeholder="Search by code, title, department..." 
              className="w-full pl-10 pr-4 py-2.5 bg-bg-2 border border-border-main rounded-xl text-sm text-text-1 placeholder:text-text-3 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <select 
            className="px-4 py-2.5 bg-bg-2 border border-border-main rounded-xl text-sm text-text-1 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all min-w-[160px]" 
            value={activeDept} 
            onChange={(e) => setActiveDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select 
            className="px-4 py-2.5 bg-bg-2 border border-border-main rounded-xl text-sm text-text-1 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all min-w-[150px]" 
            value={activeStatus} 
            onChange={(e) => setActiveStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {['Active','Under Review','Draft','Obsolete'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {(searchTerm || activeDept || activeStatus) && (
            <button 
              className="px-3 py-2 text-xs font-medium text-text-3 hover:text-accent transition-colors"
              onClick={() => { setSearchTerm(''); setActiveDept(''); setActiveStatus(''); }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-1 rounded-2xl border border-border-main shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-main bg-bg-2/50">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-text-3 uppercase tracking-wider">Code</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-text-3 uppercase tracking-wider">Procedure Title</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-text-3 uppercase tracking-wider">Dept</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-text-3 uppercase tracking-wider">Version</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-text-3 uppercase tracking-wider">Review Date</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-text-3 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-text-3 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-text-3">
                    <div className="flex flex-col items-center gap-3">
                      <BookOpen className="w-8 h-8 text-text-3/40" />
                      <p className="text-sm font-medium">No procedures match your filters.</p>
                      <p className="text-xs text-text-3/60">Try adjusting your search or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => {
                  const days = Math.ceil((new Date(p.reviewDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  const isOverdue = days < 0 && p.status !== 'Obsolete';
                  return (
                    <motion.tr 
                      key={p.id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b border-border-main last:border-0 hover:bg-accent/3 cursor-pointer transition-colors group"
                      onClick={() => openForm('document', p)}
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-accent text-xs">{p.code}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-text-1 group-hover:text-accent transition-colors">{p.title}</div>
                        <div className="text-[11px] text-text-3 mt-0.5">{p.cat}</div>
                      </td>
                      <td className="px-5 py-3.5 text-text-2">{p.dept}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-text-2 text-xs">{p.ver}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-text-2">{p.reviewDate}</span>
                          {isOverdue && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-md uppercase">Overdue</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${getStatusStyle(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 rounded-lg hover:bg-accent/10 text-text-3 hover:text-accent transition-all" title="View Document" onClick={() => openForm('document', p)}>
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-2 hover:bg-blue-500/10 text-text-3 hover:text-blue-500 rounded-lg transition-all" title="Edit" onClick={() => openForm('edit', p)}>
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-indigo-500/10 text-text-3 hover:text-indigo-500 rounded-lg transition-all" title="Download PDF" onClick={(e) => { e.stopPropagation(); handleExportSinglePDF(p); }}>
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg transition-all" title="Delete" onClick={() => handleDelete(p.id)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-border-main bg-bg-2/30 flex items-center justify-between">
            <span className="text-xs text-text-3">Showing {filtered.length} of {procedures.length} procedures</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
