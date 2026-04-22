import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users2, CheckCircle2, AlertCircle, Plus, Download, 
  Search, Filter, Calendar, Eye, Edit2, Trash2, FileText, 
  ChevronRight, Mic2, Clock, User, Building, X, MessageSquare, ClipboardList
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

interface MeetingRecord {
  id: string;
  meetingTitle: string;
  date: string;
  category: string;
  facilitator: string;
  location: string;
  status: string;
  actionItemsCount: number;
  createdAt: string;
}

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export function MeetingMinutes({ onNavigate }: Props) {
  const [records, setRecords] = useState<MeetingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    const load = async () => {
      const data = await getTable('meetingMinutes').toArray();
      setRecords(data as any);
    };
    load();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = 
        r.meetingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.facilitator.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterCategory === 'All' || r.category === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [records, searchQuery, filterCategory]);

  const stats = useMemo(() => {
    return {
      total: records.length,
      thisMonth: records.filter(r => {
        const d = new Date(r.date);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
      actionItems: records.reduce((acc, r) => acc + (r.actionItemsCount || 0), 0),
      managementReview: records.filter(r => r.category === 'Management Review').length
    };
  }, [records]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await getTable('meetingMinutes').delete(id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Meeting Minutes");
    XLSX.writeFile(wb, "Meeting_Minutes_Log.xlsx");
  };

  const exportPDF = () => {
    exportTableToPDF({
      moduleName: 'Meeting Minutes & Action Items',
      columns: ['Title', 'Date', 'Type', 'Facilitator', 'Actions', 'Status'],
      rows: filteredRecords.map(r => [r.meetingTitle, r.date, r.category, r.facilitator, r.actionItemsCount, r.status]),
      fileName: 'Meeting_Minutes_Report'
    });
  };

  const exportSinglePDF = async (record: MeetingRecord) => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    await exportDetailToPDF({
      moduleName: 'Minutes of Meeting (MOM)',
      moduleId: 'meeting-minutes',
      recordId: record.id,
      fileName: `MOM_${record.meetingTitle.replace(/\s+/g, '_')}`,
      fields: [
        { label: 'Meeting Title',      value: record.meetingTitle },
        { label: 'Meeting Category',   value: record.category },
        { label: 'Meeting Date',       value: record.date },
        { label: 'Facilitator / Chair', value: record.facilitator },
        { label: 'Meeting Location',   value: record.location },
        { label: 'Open Action Items',  value: String(record.actionItemsCount || 0) },
        { label: 'Session Status',     value: record.status },
      ]
    });
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <Users2 className="w-8 h-8 text-accent" />
            Meeting Minutes (MOM)
          </h1>
          <p className="text-text-2 text-base mt-2">Log formal quality meetings, management reviews, and follow-up action items.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportExcel}>
            <Download className="w-4 h-4" /> Excel
          </button>
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportPDF}>
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => onNavigate('meeting-minutes-form', { mode: 'create' })}>
            <Plus className="w-4 h-4" /> Record MOM
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Sessions', value: stats.total, icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Meetings this Month', value: stats.thisMonth, icon: Calendar, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Pending Action Items', value: stats.actionItems, icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'QMR Sessions', value: stats.managementReview, icon: Mic2, color: 'text-purple-main', bg: 'bg-purple-main/10' },
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
            placeholder="Search meeting titles, facilitator..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option>Management Review</option>
          <option>Production Meeting</option>
          <option>Quality Committee</option>
          <option>Safety/Compliance</option>
          <option>Internal Audit Sync</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/50 border-b border-border-main text-[10px] uppercase tracking-widest text-text-2 font-black">
                <th className="p-4 pl-6">Meeting Agenda</th>
                <th className="p-4">Type & Facilitator</th>
                <th className="p-4 text-center">Open Actions</th>
                <th className="p-4 text-center">Meeting Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredRecords.map(r => (
                <tr key={r.id} className="hover:bg-bg-2/60 transition-all duration-200 group">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-text-1 text-sm">{r.meetingTitle}</div>
                    <div className="text-[11px] text-text-3 mt-1 font-mono uppercase tracking-tight">{r.location}</div>
                  </td>
                  <td className="p-4 text-xs font-semibold text-text-2">
                    <div className="flex flex-col">
                       <span className="text-text-1">{r.category}</span>
                       <span className="text-[10px] opacity-70 italic font-medium">By: {r.facilitator}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black ${
                      (r.actionItemsCount || 0) > 0 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-bg-3 text-text-2'
                    }`}>
                       {r.actionItemsCount || 0} Actions
                    </div>
                  </td>
                  <td className="p-4 text-center text-xs font-semibold text-text-2">
                    {new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      r.status === 'Completed' || r.status === 'Signed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-accent text-text-2" onClick={() => onNavigate('meeting-minutes-form', { mode: 'view', data: r })}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-text-2" onClick={() => onNavigate('meeting-minutes-form', { mode: 'edit', data: r })}>
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
