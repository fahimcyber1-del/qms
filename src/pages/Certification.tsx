import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Download, FileDown, Eye, Edit2, 
  Trash2, Award, Calendar, Building, ShieldCheck, 
  ChevronRight, Filter, AlertTriangle, CheckCircle2, 
  MoreHorizontal, Trash, Package, Grid, List
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ExportModal } from '../components/ExportModal';
import { CertificateRecord } from '../types';
import { getCertificates, saveCertificates, checkCertificateStatus, getDaysUntilExpiry } from '../utils/certificateUtils';

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

import { Pagination } from '../components/Pagination';

export function Certification({ onNavigate }: Props) {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const loadedCerts = getCertificates();
    const updatedCerts = loadedCerts.map(cert => ({
      ...cert,
      status: checkCertificateStatus(cert.expiryDate)
    }));
    setCertificates(updatedCerts);
  }, []);

  const filteredCertificates = useMemo(() => {
    return certificates.filter(cert => {
      const matchesSearch = 
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cert.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuedBy.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'All' || cert.type === filterType;
      const matchesStatus = filterStatus === 'All' || cert.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [certificates, searchQuery, filterType, filterStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterStatus]);

  const paginatedCertificates = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCertificates.slice(startIndex, startIndex + pageSize);
  }, [filteredCertificates, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredCertificates.length / pageSize);

  const stats = useMemo(() => {
    return {
      total: certificates.length,
      active: certificates.filter(c => c.status === 'Active').length,
      expiring: certificates.filter(c => {
         const days = getDaysUntilExpiry(c.expiryDate);
         return days > 0 && days <= 30;
      }).length,
      expired: certificates.filter(c => c.status === 'Expired').length,
    };
  }, [certificates]);

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this certificate record?")) {
      const updated = certificates.filter(c => c.id !== id);
      setCertificates(updated);
      saveCertificates(updated);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.size} selected certificates?`)) {
      const updated = certificates.filter(c => !selectedIds.has(c.id));
      setCertificates(updated);
      saveCertificates(updated);
      setSelectedIds(new Set());
    }
  };

  const handleDownloadReport = async (cert: CertificateRecord) => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    await exportDetailToPDF({
      moduleName: 'Compliance Certificate Report',
      moduleId: 'certification',
      recordId: cert.number,
      fileName: `CERT_${cert.name.replace(/\s+/g, '_')}`,
      sections: [
        {
          title: 'Certificate Identity',
          fields: [
            { label: 'Certification Detail', value: cert.name },
            { label: 'Official Number',      value: cert.number },
            { label: 'Classification',       value: cert.type },
          ]
        },
        {
          title: 'Issuance & Coverage',
          fields: [
            { label: 'Issuing Authority',    value: cert.issuedBy },
            { label: 'Allocated Department', value: cert.department },
            { label: 'Release Date',         value: cert.issueDate },
            { label: 'Validity Period',      value: cert.expiryDate },
          ]
        },
        {
          title: 'Current Status',
          fields: [
            { label: 'System Status',        value: cert.status, fullWidth: true },
          ]
        }
      ],
      attachments: cert.documentUrls?.map((d: any) => typeof d === 'string' ? { name: 'Document', data: d } : d) || [],
    });
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCertificates.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredCertificates.map(c => c.id)));
  };

  return (
    <motion.div 
      className="p-4 md:p-8 space-y-8 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <Award className="w-8 h-8 text-accent" />
            Certification Vault
          </h1>
          <p className="text-text-2 text-base mt-2">Oversee Global Compliance, QA Certs, and Operational Licenses.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center gap-2 hover:bg-indigo-500/20" onClick={() => setIsExportModalOpen(true)}>
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button className="btn btn-primary flex items-center gap-2 shadow-lg shadow-accent/20 px-6" onClick={() => onNavigate('certification-form', { mode: 'create' })}>
            <Plus className="w-4 h-4" /> New Certification
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Vault Total', value: stats.total, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active Live', value: stats.active, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Warning Zone', value: stats.expiring, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Expired Files', value: stats.expired, icon: Trash2, color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow group">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-bold text-text-3 mb-1 uppercase tracking-wider">{stat.label}</div>
              <div className="text-3xl font-black text-text-1 tracking-tight">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 bg-bg-1 p-4 rounded-2xl border border-border-main shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-3" />
          <input 
            type="text" 
            placeholder="Quick search certification index..." 
            className="w-full bg-bg-2 border-border-main border rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-3"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-bg-2 p-1 rounded-xl border border-border-main">
             <button 
               onClick={() => setFilterStatus('All')}
               className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", filterStatus === 'All' ? 'bg-bg-1 text-accent shadow-sm' : 'text-text-3 hover:text-text-1')}
             >All</button>
             <button 
               onClick={() => setFilterStatus('Active')}
               className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", filterStatus === 'Active' ? 'bg-bg-1 text-emerald-500 shadow-sm' : 'text-text-3 hover:text-text-1')}
             >Active</button>
             <button 
               onClick={() => setFilterStatus('Expired')}
               className={cn("px-4 py-2 text-xs font-bold rounded-lg transition-all", filterStatus === 'Expired' ? 'bg-bg-1 text-red-500 shadow-sm' : 'text-text-3 hover:text-text-1')}
             >Expired</button>
          </div>
          
          <select 
            className="bg-bg-1 border border-border-main rounded-xl px-4 py-[10px] text-xs font-bold focus:ring-2 focus:ring-accent outline-none text-text-1 min-w-[140px] shadow-sm appearance-none cursor-pointer"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Factory">Factory Org</option>
            <option value="Compliance">Compliance</option>
            <option value="Machine">Mechanization</option>
            <option value="Testing">Lab Testing</option>
            <option value="Sustainability">Environmental</option>
          </select>
        </div>
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center justify-between bg-accent/10 border border-accent/20 p-4 rounded-2xl"
          >
            <div className="text-sm font-bold text-accent">
              {selectedIds.size} records selected
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleBulkDelete}
                className="btn bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-2 flex items-center gap-2 hover:bg-red-500/20"
              >
                <Trash className="w-4 h-4" /> Bulk Delete
              </button>
              <button onClick={() => setSelectedIds(new Set())} className="text-text-3 text-xs font-bold uppercase hover:text-text-1">Clear</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Table */}
      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/30 border-b border-border-main text-[10px] uppercase tracking-[0.1em] text-text-3 font-black">
                <th className="p-4 pl-6 w-12">
                   <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded accent-accent cursor-pointer"
                      checked={selectedIds.size === filteredCertificates.length && filteredCertificates.length > 0}
                      onChange={toggleSelectAll}
                   />
                </th>
                <th className="p-4">Certificate Entity</th>
                <th className="p-4">Authority</th>
                <th className="p-4">Dates</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Utility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {paginatedCertificates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-text-3">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                       <Award className="w-10 h-10" />
                       <p className="text-sm font-bold">No Records Identified</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedCertificates.map(cert => {
                const days = getDaysUntilExpiry(cert.expiryDate);
                return (
                  <tr key={cert.id} className="hover:bg-bg-2/40 transition-all group">
                    <td className="p-4 pl-6">
                       <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded accent-accent cursor-pointer"
                          checked={selectedIds.has(cert.id)}
                          onChange={() => toggleSelect(cert.id)}
                       />
                    </td>
                    <td className="p-4">
                      <div className="font-black text-text-1 text-sm uppercase tracking-tight">{cert.name}</div>
                      <div className="text-[10px] font-mono text-text-3 mt-0.5">{cert.number}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-text-2">
                        <Building className="w-3.5 h-3.5 opacity-50" />
                        {cert.issuedBy}
                      </div>
                      <div className="text-[10px] text-text-3 mt-0.5 uppercase tracking-tighter">{cert.department}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-bold text-text-2">{cert.expiryDate}</div>
                      {cert.status === 'Active' && days > 0 && days <= 30 && (
                        <div className="text-[10px] text-amber-500 font-black mt-0.5 uppercase">Expiring in {days} Days</div>
                      )}
                      {cert.status === 'Expired' && (
                        <div className="text-[10px] text-red-500 font-black mt-0.5 uppercase">Expired</div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${
                        cert.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                        cert.status === 'Expired' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => onNavigate('certification-form', { mode: 'view', data: cert })}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-emerald-500/10 hover:text-emerald-500 text-text-2 transition-all cursor-pointer"
                            title="View Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onNavigate('certification-form', { mode: 'edit', data: cert })}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-accent text-text-2 transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDownloadReport(cert)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-indigo-500/10 hover:text-indigo-500 text-text-2 transition-all cursor-pointer"
                            title="Download PDF"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(cert.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 text-text-2 transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                       <ChevronRight className="w-4 h-4 text-text-3 opacity-30 group-hover:hidden ml-auto" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={filteredCertificates.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </motion.div>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        data={filteredCertificates}
        title="Certification Index Report"
        columns={[
          { key: 'number', label: 'Cert No' },
          { key: 'name', label: 'Name' },
          { key: 'issuedBy', label: 'Authority' },
          { key: 'type', label: 'Type' },
          { key: 'issueDate', label: 'Issued' },
          { key: 'expiryDate', label: 'Expires' },
          { key: 'department', label: 'Dept' },
          { key: 'status', label: 'Status' },
        ]}
      />
    </motion.div>
  );
}
