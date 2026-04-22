import React, { useState, useMemo } from 'react';
import { ExportModal } from '../components/ExportModal';

import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, AlertCircle, Clock, CheckCircle2, Plus, Download, 
  Database, Eye, Edit2, Trash2, FileText, X, Save, Filter, Calendar, 
  Building, User, Users, Award, Search, ChevronRight, HelpCircle, Check, ArrowRight, RefreshCw
} from 'lucide-react';
import { CAPARecord } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

const MOCK_CAPAS: CAPARecord[] = [
  {
    id: 'CAPA-1001',
    auditId: 'AUD-1001',
    nc: 'Emergency exits partially blocked by fabric rolls in Line 4.',
    cause: 'Inefficient storage space and lack of floor marking adherence.',
    action: 'Immediate clearance of rolls; designated yellow marking repainted.',
    preventive: 'Bi-weekly aisle inspection and 5S awareness training for floor supervisors.',
    responsible: 'Rahim Ali',
    deadline: '2024-04-10',
    status: 'Open',
    description: 'Found during internal safety audit.',
    attachments: [],
    history: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'CAPA-1002',
    auditId: 'AUD-1022',
    nc: 'Inconsistent needle breakage logs in Sewing Unit-B.',
    cause: 'Lack of supervision during shift handover.',
    action: 'Retraining of all line chiefs on needle control procedure.',
    preventive: 'Mandatory digital log verification by floor manager before shift end.',
    responsible: 'Selina Begum',
    deadline: '2024-05-15',
    status: 'In Progress',
    description: 'Raised after internal quality review.',
    attachments: [],
    history: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'CAPA-1003',
    auditId: 'AUD-1045',
    nc: 'Chemical secondary containment leaking in Finishing section.',
    cause: 'Corrosion of the containment tray due to age.',
    action: 'Replacement of the tray with heavy-duty chemical resistant poly-tray.',
    preventive: 'Quarterly maintenance schedule for all chemical storage infrastructure.',
    responsible: 'Arif Khan',
    deadline: '2024-04-20',
    status: 'In Progress',
    description: 'Found during monthly safety inspection.',
    attachments: [],
    history: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'CAPA-1004',
    auditId: 'AUD-1060',
    nc: 'Incorrect labeling on AW26-Cotton-Tee bulk production.',
    cause: 'Operator error during manual packing process.',
    action: '100% rework of the affected batch; all labels verified.',
    preventive: 'Automated barcode verification implemented at the end of the line.',
    responsible: 'Fatima Zohra',
    deadline: '2024-04-30',
    status: 'Open',
    description: 'Customer complaint from buyer H&M.',
    attachments: [],
    history: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'CAPA-1005',
    auditId: 'AUD-1088',
    nc: 'Missing eye guards on several overlock machines in Unit-2.',
    cause: 'Maintenance team failed to re-install guards after servicing.',
    action: 'New guards installed; all machines in Unit-2 audited for safety features.',
    preventive: 'Machine release form now includes safety guard verification.',
    responsible: 'James Wilson',
    deadline: '2024-05-10',
    status: 'Pending',
    description: 'Raised during external health and safety audit.',
    attachments: [],
    history: [],
    createdAt: new Date().toISOString()
  }
];

interface CAPAProps {
  onNavigate: (page: string, params?: any) => void;
}

export function CAPA({ onNavigate }: CAPAProps) {
  const [capas, setCapas] = useState<CAPARecord[]>(() => {
    const stored = localStorage.getItem('garmentqms_capas');
    return stored ? JSON.parse(stored) : MOCK_CAPAS;
  });
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const filteredCapas = useMemo(() => {
    return capas.filter(c => {
      const matchesSearch = 
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.responsible.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.auditId?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      
      const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
      const matchesDate = (!startDate || c.deadline >= startDate) && (!endDate || c.deadline <= endDate);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [capas, searchQuery, filterStatus, startDate, endDate]);

  const stats = useMemo(() => {
    return {
      total: filteredCapas.length,
      open: filteredCapas.filter(c => c.status === 'Open').length,
      inProgress: filteredCapas.filter(c => c.status === 'In Progress').length,
      closed: filteredCapas.filter(c => c.status === 'Closed').length,
      overdue: filteredCapas.filter(c => c.status === 'Overdue').length
    };
  }, [filteredCapas]);

  const openCreate = () => onNavigate('capa-form', { mode: 'create' });
  const openView = (record: CAPARecord) => onNavigate('capa-form', { mode: 'view', data: record });
  const openEdit = (record: CAPARecord) => onNavigate('capa-form', { mode: 'edit', data: record });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this CAPA record?")) {
      const updated = capas.filter(c => c.id !== id);
      setCapas(updated);
      localStorage.setItem('garmentqms_capas', JSON.stringify(updated));
    }
  };

  const seedMockData = () => {
    const mockCapa: CAPARecord = {
      id: `CAPA-${Date.now()}`,
      auditId: `AUD-${Math.floor(Math.random() * 1000)}`,
      nc: 'Needle policy not followed - loose needles found on floor.',
      cause: 'Operators not returning broken needles immediately to the box.',
      action: 'Search and clear area immediately.',
      preventive: 'New needle exchange protocol and daily log verification.',
      responsible: 'John Doe',
      deadline: '2024-05-01',
      status: 'Open',
      description: 'Found during random floor check.',
      attachments: [],
      history: [],
      createdAt: new Date().toISOString()
    };
    const updated = [mockCapa, ...capas];
    setCapas(updated);
    localStorage.setItem('garmentqms_capas', JSON.stringify(updated));
  };

  const downloadIndividualPDF = async (capa: CAPARecord) => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');

    await exportDetailToPDF({
      moduleName: 'CAPA Compliance Report',
      moduleId: 'capa',
      recordId: capa.id,
      fileName: `${capa.id}_CAPA_Report`,
      layout: 'executive',
      fields: [
        { label: 'CAPA ID',         value: capa.id },
        { label: 'Source Audit',    value: capa.auditId || 'Manual Entry' },
        { label: 'Responsible',     value: capa.responsible },
        { label: 'Deadline',        value: capa.deadline },
        { label: 'Current Status',  value: capa.status },
        { label: 'Created On',      value: new Date(capa.createdAt).toLocaleDateString('en-GB') },
        { label: 'Issue Detail',    value: capa.nc },
        { label: 'Root Cause',      value: capa.cause || 'Analysis in progress...' },
        { label: 'Corrective Action', value: capa.action },
        { label: 'Preventive Plan',   value: capa.preventive },
        { label: 'Internal Notes',    value: capa.description || 'N/A' },
      ],
      comments: capa.history?.map(h => ({
        user: h.responsible || 'System',
        date: h.date,
        text: `${h.change} (Status: ${h.status})`
      })),
      attachments: capa.attachments
    });
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-purple-main" />
            CAPA Management
          </h1>
          <p className="text-text-2 text-base mt-2">Corrective and Preventive Action Tracking System.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2" onClick={seedMockData}>
            <Database className="w-4 h-4" /> Seed Log
          </button>
          <button className="btn btn-ghost flex items-center gap-2" onClick={() => setIsExportModalOpen(true)}>
            <Download className="w-4 h-4" /> Export All
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Raise CAPA
          </button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total RAIsed', value: stats.total, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Open Actions', value: stats.open, icon: HelpCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Closed / Verified', value: stats.closed, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
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
        <div className="relative flex-1 min-w-[300px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-2" />
          <input 
            type="text" 
            placeholder="Search by CAPA ID, NC Detail, or Responsible Person..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-purple-main outline-none transition-all text-text-1 placeholder:text-text-2 font-medium"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="w-full md:w-44 bg-bg-2 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-main outline-none text-text-1 font-bold" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
            <option value="Overdue">Overdue</option>
          </select>
          <div className="flex items-center gap-2 bg-bg-2 px-3 py-2 rounded-xl flex-1 md:flex-none border border-transparent focus-within:border-purple-500/30">
            <Calendar className="w-4 h-4 text-text-2" />
            <input type="date" className="bg-transparent border-none text-sm text-text-1 outline-none w-full md:w-auto" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span className="text-text-2 text-sm px-1">-</span>
            <input type="date" className="bg-transparent border-none text-sm text-text-1 outline-none w-full md:w-auto" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </motion.div>

      {/* Data Table */}
      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/70 border-b border-border-main text-[10px] uppercase tracking-widest text-text-3 font-black">
                <th className="p-4 pl-6">CAPA ID</th>
                <th className="p-4">NC & Root Cause</th>
                <th className="p-4">Owner</th>
                <th className="p-4 text-center">Deadline</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredCapas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-text-3">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <ShieldCheck className="w-12 h-12 opacity-10" />
                      <div className="text-base font-semibold">No Corrective Actions Logged</div>
                      <p className="text-sm mx-auto opacity-60">Try adjusting your filters or raise a new CAPA against an audit finding.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCapas.map(capa => (
                <tr 
                  key={capa.id} 
                  className="hover:bg-bg-2/60 transition-all duration-200 group relative" 
                >
                  <td className="p-4 pl-6">
                    <div className="font-mono font-black text-text-1 text-sm tracking-tight">{capa.id}</div>
                    <div className="text-[10px] text-text-3 font-bold mt-1 uppercase tracking-tighter">{capa.auditId || 'Manual Raise'}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-text-1 text-sm line-clamp-1 group-hover:line-clamp-none transition-all">{capa.nc}</div>
                    <div className="text-[11px] text-text-3 font-medium mt-1 italic flex items-center gap-2 opacity-80">
                      <HelpCircle className="w-3 h-3 text-purple-400" /> 
                      {capa.cause || 'Root cause analysis pending...'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-main/10 flex items-center justify-center text-[10px] font-black text-purple-main border border-purple-500/20">
                        {capa.responsible.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-xs font-bold text-text-1">{capa.responsible}</div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className={`text-xs font-black font-mono tracking-tighter ${
                      new Date(capa.deadline) < new Date() && capa.status !== 'Closed' ? 'text-red-500' : 'text-text-2'
                    }`}>
                      {capa.deadline}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm border ${
                      capa.status === 'Closed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      capa.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                      capa.status === 'Overdue' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {capa.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-purple-main/10 hover:text-purple-main text-text-2 transition-all cursor-pointer" 
                        title="View Details"
                        onClick={(e) => { e.stopPropagation(); openView(capa); }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-text-2 transition-all cursor-pointer" 
                        title="Edit CAPA"
                        onClick={(e) => { e.stopPropagation(); openEdit(capa); }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-green-500/10 hover:text-green-500 text-text-2 transition-all cursor-pointer" 
                        title="Download PDF"
                        onClick={(e) => { e.stopPropagation(); downloadIndividualPDF(capa); }}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                        <button 
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-accent text-text-2 transition-all cursor-pointer" 
                          title="Verify / Follow-up"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            onNavigate('follow-up'); 
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-border-main mx-1" />
                        <button 
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 text-text-2 transition-all cursor-pointer" 
                        title="Delete record"
                        onClick={(e) => { e.stopPropagation(); handleDelete(capa.id); }}
                      >
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
      </motion.div>

      {/* Export Modal UI */}
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        data={filteredCapas}
        title="CAPA Compliance Report"
        columns={[
          {key: 'id', label: 'CAPA ID'},
          {key: 'auditId', label: 'Source'},
          {key: 'nc', label: 'Issue'},
          {key: 'cause', label: 'Cause'},
          {key: 'action', label: 'Correction'},
          {key: 'preventive', label: 'Prevention'},
          {key: 'responsible', label: 'Owner'},
          {key: 'deadline', label: 'Deadline'},
          {key: 'status', label: 'Status'}
        ]}
      />
    </motion.div>
  );
}
