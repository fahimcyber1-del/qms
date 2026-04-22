import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings2, CheckCircle2, AlertCircle, Plus, Download, 
  Search, Filter, Calendar, Eye, Edit2, Trash2, FileText, 
  ChevronRight, Wrench, Clock, User, Building, X, Microscope, Activity
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

interface CalibrationRecord {
  id: string;
  equipmentName: string;
  equipmentId: string;
  calibrationAgency: string;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  certificateNumber: string;
  status: string;
  department: string;
  responsiblePerson: string;
  createdAt: string;
}

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export function Calibration({ onNavigate }: Props) {
  const [records, setRecords] = useState<CalibrationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const load = async () => {
      const data = await getTable('calibration').toArray();
      setRecords(data as any);
    };
    load();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = 
        r.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.equipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = filterDept === 'All' || r.department === filterDept;
      const matchesStatus = filterStatus === 'All' || r.status === filterStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [records, searchQuery, filterDept, filterStatus]);

  const stats = useMemo(() => {
    const today = new Date();
    return {
      total: records.length,
      active: records.filter(r => r.status === 'Valid').length,
      expired: records.filter(r => new Date(r.nextCalibrationDate) < today || r.status === 'Expired').length,
      upcoming: records.filter(r => {
        const next = new Date(r.nextCalibrationDate);
        const diff = (next.getTime() - today.getTime()) / (1000 * 3600 * 24);
        return diff > 0 && diff <= 30;
      }).length
    };
  }, [records]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await getTable('calibration').delete(id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Calibration Records");
    XLSX.writeFile(wb, "Calibration_Masterlist.xlsx");
  };

  const exportPDF = () => {
    exportTableToPDF({
      moduleName: 'Calibration Management',
      columns: ['Equipment ID', 'Name', 'Last Cal', 'Next Cal', 'Cert #', 'Status'],
      rows: filteredRecords.map(r => [r.equipmentId, r.equipmentName, r.lastCalibrationDate, r.nextCalibrationDate, r.certificateNumber, r.status]),
      fileName: 'Calibration_Management_Report'
    });
  };

  const exportSinglePDF = async (record: CalibrationRecord) => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    const isValid = record.status === 'Valid';
    const today = new Date();
    const nextDue = record.nextCalibrationDate ? new Date(record.nextCalibrationDate) : null;
    const daysRemaining = nextDue ? Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
    const dueStatus = daysRemaining === null ? '—'
      : daysRemaining < 0 ? `OVERDUE by ${Math.abs(daysRemaining)} days`
      : daysRemaining <= 30 ? `DUE SOON — ${daysRemaining} days remaining`
      : `${daysRemaining} days remaining`;

    await exportDetailToPDF({
      moduleName: 'Equipment Calibration Certificate',
      moduleId: 'calibration',
      recordId: record.equipmentId,
      fileName: `CalibrationCert_${record.equipmentId}`,
      sections: [
        {
          title: '1. Instrument Identification',
          fields: [
            { label: 'Equipment Name', value: record.equipmentName },
            { label: 'Equipment Tag ID', value: record.equipmentId },
            { label: 'Custodian Department', value: record.department },
            { label: 'Responsible Custodian', value: record.responsiblePerson },
            { label: 'Integrity Status', value: record.status },
            { label: 'Days Until Next Due', value: dueStatus },
          ]
        },
        {
          title: '2. Calibration Details & Certificate',
          fields: [
            { label: 'Certificate Number', value: record.certificateNumber },
            { label: 'Calibration Agency / Lab', value: record.calibrationAgency },
            { label: 'Last Calibration Date', value: record.lastCalibrationDate },
            { label: 'Next Calibration Due', value: record.nextCalibrationDate },
            { label: 'ISO Reference', value: 'ISO 9001:2015 — Clause 7.1.5' },
          ]
        }
      ],
      summary: [
        `Calibration Result: ${record.status}`,
        isValid
          ? `Equipment is in calibrated service. Next due: ${record.nextCalibrationDate || 'N/A'}.`
          : `Equipment is ${record.status}. Immediate recalibration or withdrawal from service required.`
      ],
      signatureLabels: ['Calibration Technician', 'QA Approval', 'Custodian', 'Valid Until'],
      styleOverrides: { accentColor: isValid ? '#16a34a' : '#dc2626' }
    });
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <Settings2 className="w-8 h-8 text-accent" />
            Calibration Management
          </h1>
          <p className="text-text-2 text-base mt-2">Precision equipment tracking, calibration schedules, and certificate control.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportExcel}>
            <Download className="w-4 h-4" /> Excel
          </button>
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportPDF}>
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => onNavigate('calibration-form', { mode: 'create' })}>
            <Plus className="w-4 h-4" /> New Equipment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Devices', value: stats.total, icon: Settings2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active / Valid', value: stats.active, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Expired', value: stats.expired, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Due (30 Days)', value: stats.upcoming, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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
            placeholder="Search equipment, ID, certificate..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Valid">Valid</option>
          <option value="Expired">Expired</option>
          <option value="Out of Service">Out of Service</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/50 border-b border-border-main text-[10px] uppercase tracking-widest text-text-2 font-black">
                <th className="p-4 pl-6">Equipment Detail</th>
                <th className="p-4">Certificate & Agency</th>
                <th className="p-4 text-center">Calibration Cycle</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredRecords.map(r => (
                <tr key={r.id} className="hover:bg-bg-2/60 transition-all duration-200 group">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-text-1 text-sm">{r.equipmentName}</div>
                    <div className="text-[11px] text-text-3 mt-1 font-mono uppercase tracking-tight">{r.equipmentId} • {r.department}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-accent opacity-60" />
                        <span className="text-sm font-semibold text-text-1">{r.certificateNumber}</span>
                      </div>
                      <span className="text-[10px] text-text-3 font-bold uppercase tracking-tighter opacity-70 mt-0.5">{r.calibrationAgency}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col items-center gap-1 min-w-[140px]">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-text-2">
                         <span>{new Date(r.lastCalibrationDate).toLocaleDateString()}</span>
                         <ChevronRight className="w-3 h-3 opacity-30" />
                         <span className="text-accent">{new Date(r.nextCalibrationDate).toLocaleDateString()}</span>
                      </div>
                      <div className="w-full h-1 bg-bg-3 rounded-full mt-1 overflow-hidden relative">
                         <div className="absolute inset-0 bg-accent/20" />
                         {/* Progress bar logic for time remaining */}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      r.status === 'Valid' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-accent text-text-2" onClick={() => onNavigate('calibration-form', { mode: 'view', data: r })}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-text-2" onClick={() => onNavigate('calibration-form', { mode: 'edit', data: r })}>
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
      </motion.div>
    </motion.div>
  );
}
