import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, CheckCircle2, AlertCircle, Plus, Download, 
  Search, Filter, Calendar, Eye, Edit2, Trash2, FileText, 
  ChevronRight, Clock, User, Building, X, Hammer, Gauge, CheckSquare, Square
} from 'lucide-react';
import { getTable } from '../db/db';
import { openExportPreview } from '../utils/exportUtils';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

interface MaintRecord {
  id: string;
  equipmentName: string;
  equipmentId: string;
  maintenanceType: string;
  location: string;
  scheduledDate: string;
  completionDate: string;
  status: string;
  responsiblePerson: string;
  createdAt: string;
}

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export function EquipmentMaintenance({ onNavigate }: Props) {
  const [records, setRecords] = useState<MaintRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      const data = await getTable('equipmentMaintenance').toArray();
      setRecords(data as any);
    };
    load();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = 
        r.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.equipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'All' || r.maintenanceType === filterType;
      const matchesStatus = filterStatus === 'All' || r.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [records, searchQuery, filterType, filterStatus]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredRecords.length && filteredRecords.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRecords.map(r => r.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedIds.size} equipment maintenance records?`)) {
      const idsToDelete = Array.from(selectedIds);
      await Promise.all(idsToDelete.map(id => getTable('equipmentMaintenance').delete(id as string)));
      setRecords(records.filter(r => !selectedIds.has(r.id)));
      setSelectedIds(new Set());
    }
  };

  const handleGlobalExport = () => {
    openExportPreview({
      moduleName: 'Equipment Maintenance Register',
      moduleId: 'maint_global',
      fileName: 'Equipment_Maintenance_Log',
      columns: ['Equipment', 'Location', 'Schedule', 'Engineer', 'Status'],
      rows: filteredRecords.map(r => [
        `${r.equipmentName} (${r.equipmentId})`,
        r.location,
        new Date(r.scheduledDate).toLocaleDateString(),
        r.responsiblePerson,
        r.status
      ])
    });
  };

  const handleBulkExport = () => {
    const selectedRecords = filteredRecords.filter(r => selectedIds.has(r.id));
    openExportPreview({
      moduleName: 'Selected Maintenance Records',
      moduleId: 'maint_bulk',
      fileName: `Maintenance_Bulk_Export_${selectedIds.size}`,
      columns: ['Equipment', 'Location', 'Schedule', 'Engineer', 'Status'],
      rows: selectedRecords.map(r => [
        `${r.equipmentName} (${r.equipmentId})`,
        r.location,
        new Date(r.scheduledDate).toLocaleDateString(),
        r.responsiblePerson,
        r.status
      ])
    });
    setSelectedIds(new Set());
  };

  const stats = useMemo(() => {
    return {
      total: records.length,
      completed: records.filter(r => r.status === 'Completed').length,
      upcoming: records.filter(r => r.status === 'Scheduled').length,
      overdue: records.filter(r => r.status === 'Overdue').length
    };
  }, [records]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await getTable('equipmentMaintenance').delete(id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const exportExcel = () => {
    handleGlobalExport();
  };

  
  
  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <Wrench className="w-8 h-8 text-accent" />
            Equipment Maintenance
          </h1>
          <p className="text-text-2 text-base mt-2">Preventive and corrective maintenance schedules for machinery.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2 border border-border-main" onClick={handleGlobalExport}>
            <Download className="w-4 h-4" /> Global Export
          </button>
          
          <button className="btn btn-primary flex items-center gap-2" onClick={() => onNavigate('equipment-maintenance-form', { mode: 'create' })}>
            <Plus className="w-4 h-4" /> New Record
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Tasks', value: stats.total, icon: Hammer, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Scheduled', value: stats.upcoming, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
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
            placeholder="Search equipment, location, ID..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        {selectedIds.size > 0 ? (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-sm font-bold text-accent">{selectedIds.size} selected</span>
            <button onClick={handleBulkExport} className="btn btn-ghost flex items-center gap-2 border border-accent/30 text-accent hover:bg-accent/10">
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button onClick={handleBulkDelete} className="btn btn-ghost flex items-center gap-2 border border-red-500/30 text-red-500 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="btn btn-ghost px-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Preventive">Preventive</option>
              <option value="Corrective">Corrective</option>
              <option value="Predictive">Predictive</option>
              <option value="Emergency">Emergency</option>
            </select>
            <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/50 border-b border-border-main text-[10px] uppercase tracking-widest text-text-2 font-black">
                <th className="p-4 w-10 pl-6">
                  <button onClick={toggleSelectAll} className="text-text-3 hover:text-accent transition-colors">
                    {selectedIds.size === filteredRecords.length && filteredRecords.length > 0
                      ? <CheckSquare className="w-4 h-4 text-accent" />
                      : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="p-4">Equipment Detail</th>
                <th className="p-4">Location & Dept</th>
                <th className="p-4">Schedule</th>
                <th className="p-4 text-center">Maintenance Engineer</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredRecords.map(r => (
                <tr key={r.id} className="hover:bg-bg-2/60 transition-all duration-200 group">
                  <td className="p-4 pl-6" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(r.id)} className="text-text-3 hover:text-accent transition-colors">
                      {selectedIds.has(r.id) ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-text-1 text-sm">{r.equipmentName}</div>
                    <div className="text-[11px] text-text-3 mt-1 font-mono uppercase tracking-tight">{r.equipmentId} • {r.maintenanceType}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                       <span className="text-sm font-semibold text-text-1">{r.location}</span>
                       <span className="text-[10px] text-text-3 font-bold uppercase tracking-tighter opacity-70 mt-0.5">Floor A • Maintenance Dept</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-accent opacity-50" />
                      <span className="text-xs font-semibold text-text-2">{new Date(r.scheduledDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-[11px] font-bold text-text-2">{r.responsiblePerson}</span>
                       <span className="text-[9px] text-text-3 opacity-60 uppercase">Senior Tech</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      r.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      r.status === 'Overdue' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-accent text-text-2" onClick={() => onNavigate('equipment-maintenance-form', { mode: 'view', data: r })}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-text-2" onClick={() => onNavigate('equipment-maintenance-form', { mode: 'edit', data: r })}>
                        <Edit2 className="w-4 h-4" />
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
