import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TestTube2, CheckCircle2, AlertCircle, Plus, Download, 
  Search, Filter, Calendar, Eye, Edit2, Trash2, FileText, 
  ChevronRight, Beaker, Clock, User, Building, X, Microscope
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

interface TestingRecord {
  id: string;
  testName: string;
  testType: string;
  sampleId: string;
  buyer: string;
  style: string;
  department: string;
  responsiblePerson: string;
  labName: string;
  date: string;
  status: string;
  createdAt: string;
}

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export function TestingManagement({ onNavigate }: Props) {
  const [records, setRecords] = useState<TestingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const load = async () => {
      const data = await getTable('testing').toArray();
      setRecords(data as any);
    };
    load();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = 
        r.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.sampleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.buyer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'All' || r.testType === filterType;
      const matchesStatus = filterStatus === 'All' || r.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [records, searchQuery, filterType, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      pass: records.filter(r => r.status === 'Pass').length,
      fail: records.filter(r => r.status === 'Fail').length,
      pending: records.filter(r => r.status === 'Pending').length
    };
  }, [records]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await getTable('testing').delete(id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Testing Records");
    XLSX.writeFile(wb, "Testing_Records_Report.xlsx");
  };

  const exportPDF = () => {
    exportTableToPDF({
      moduleName: 'Testing Management',
      columns: ['ID', 'Test Name', 'Sample ID', 'Type', 'Lab', 'Status'],
      rows: filteredRecords.map(r => [r.id, r.testName, r.sampleId, r.testType, r.labName, r.status]),
      fileName: 'Testing_Management_Report'
    });
  };

  const exportSinglePDF = async (record: TestingRecord) => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    await exportDetailToPDF({
      moduleName: 'Laboratory Test Certificate',
      moduleId: 'testing',
      recordId: record.id,
      fileName: `Test_${record.testName.replace(/\s+/g, '_')}`,
      fields: [
        { label: 'Test Report Name',   value: record.testName },
        { label: 'Sample ID',          value: record.sampleId },
        { label: 'Buyer / Brand',      value: record.buyer },
        { label: 'Style Number',       value: record.style },
        { label: 'Test Type',          value: record.testType },
        { label: 'Testing Laboratory', value: record.labName },
        { label: 'Assigned Dept',      value: record.department },
        { label: 'Responsible PIC',    value: record.responsiblePerson },
        { label: 'Test Date',          value: record.date },
        { label: 'Final Result',       value: record.status },
      ]
    });
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <TestTube2 className="w-8 h-8 text-accent" />
            Testing Management
          </h1>
          <p className="text-text-2 text-base mt-2">Fabric, Garment & Laboratory testing administration.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportExcel}>
            <Download className="w-4 h-4" /> Excel
          </button>
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportPDF}>
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => onNavigate('testing-management-form', { mode: 'create' })}>
            <Plus className="w-4 h-4" /> New Test
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Tests', value: stats.total, icon: Beaker, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Passed', value: stats.pass, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Failed', value: stats.fail, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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
            placeholder="Search tests, sample IDs, buyers..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="Fabric">Fabric Test</option>
          <option value="Garment">Garment Test</option>
          <option value="Chemical">Chemical Analysis</option>
          <option value="Safety">Safety Check</option>
        </select>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Pass">Pass</option>
          <option value="Fail">Fail</option>
          <option value="Pending">Pending</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/50 border-b border-border-main text-[10px] uppercase tracking-widest text-text-2 font-black">
                <th className="p-4 pl-6">Test Detail</th>
                <th className="p-4">Sample & Style</th>
                <th className="p-4">Lab / Auditor</th>
                <th className="p-4 text-center">Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredRecords.map(r => (
                <tr key={r.id} className="hover:bg-bg-2/60 transition-all duration-200 group">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-text-1 text-sm">{r.testName}</div>
                    <div className="text-[11px] text-text-3 mt-1 font-mono uppercase tracking-tight">{r.id} • {r.testType}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-text-1">ID: {r.sampleId}</span>
                      <span className="text-[11px] text-text-3 font-medium opacity-80 uppercase tracking-tight">{r.style || 'No Style'} • {r.buyer}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                        <Microscope className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-semibold text-text-1">{r.labName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-xs font-semibold text-text-2">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      r.status === 'Pass' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      r.status === 'Pending' || r.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-accent text-text-2" onClick={() => onNavigate('testing-management-form', { mode: 'view', data: r })}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-text-2" onClick={() => onNavigate('testing-management-form', { mode: 'edit', data: r })}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-indigo-500/10 hover:text-indigo-500 text-text-2" title="Download PDF" onClick={() => exportSinglePDF(r)}>
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 text-text-2" onClick={() => handleDelete(r.id)}>
                        <Trash2 className="w-4 h-4" />
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
