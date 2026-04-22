import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, Calendar, Users, Award, FileText, Download,
  CheckCircle2, Clock, AlertTriangle, ShieldCheck, PieChart,
  Plus, Edit2, Trash2, Camera, UserSquare, BarChart, BookOpen, User, BookCheck,
  Search, Filter, X, TrendingUp
} from 'lucide-react';
import { getTable } from '../db/db';
import { UniversalRecord } from '../types';
import { exportTableToPDF, exportDetailToPDF } from '../utils/pdfExportUtils';

interface TrainingModuleProps {
  onNavigate: (page: string, params?: any) => void;
}

export function TrainingModule({ onNavigate }: TrainingModuleProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [records, setRecords] = useState<UniversalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const all = await getTable('training').toArray();
      setRecords(all);
    } catch (error) {
      console.error('Failed to load training records:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'plan', label: 'Training Plan', icon: Calendar },
    { id: 'material', label: 'Materials', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: Users },
    { id: 'evaluation', label: 'Evaluation', icon: BookCheck },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  if (loading) {
    return <div className="p-8 text-center text-text-3">Loading training modules...</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-1 flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-accent" />
            Training Management
          </h1>
          <p className="text-text-3 text-sm mt-1">Manage employee training, materials, attendance, and compliance</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate('training-form', { mode: 'create' })}
            className="btn btn-primary flex items-center gap-2 shadow-lg shadow-accent/20"
          >
            <Plus className="w-4 h-4" />
            New Training
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm flex overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all whitespace-nowrap min-w-max border-b-2 ${
              activeTab === tab.id 
                ? 'text-accent border-accent bg-accent/5' 
                : 'text-text-3 border-transparent hover:text-text-1 hover:bg-bg-2'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-bg-1 border border-border-main rounded-2xl shadow-sm min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'overview' && <OverviewTab records={records} />}
            {activeTab === 'plan' && <PlanTab records={records} onNavigate={onNavigate} refresh={loadRecords} />}
            {activeTab === 'material' && <MaterialTab records={records} />}
            {activeTab === 'attendance' && <AttendanceTab records={records} />}
            {activeTab === 'evaluation' && <EvaluationTab records={records} />}
            {activeTab === 'compliance' && <ComplianceTab records={records} />}
            {activeTab === 'reports' && <ReportsTab records={records} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── MODULE TABS IMPLEMENTATION ──

function OverviewTab({ records }: { records: UniversalRecord[] }) {
  const completed = records.filter(r => r.status === 'Completed').length;
  const pending = records.filter(r => r.status === 'Open' || r.status === 'In Progress').length;
  
  const stats = [
    { label: 'Total Trainings', value: records.length, icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Avg Participants', value: records.length ? Math.round(records.reduce((acc, r) => acc + (Number(r.participantCount) || 0), 0) / records.length) : 0, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const upcomingTrainings = useMemo(() => {
    const now = new Date();
    return records
      .filter(r => r.status !== 'Completed' && new Date(r.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [records]);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-bg-2 border border-border-main rounded-2xl p-5 flex items-center gap-4">
            <div className={`p-3.5 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-text-3 mb-0.5">{stat.label}</div>
              <div className="text-2xl font-bold text-text-1 tracking-tight">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-2 border border-border-main rounded-2xl p-6">
          <h3 className="font-bold text-text-1 mb-4 flex items-center gap-2 text-base">
            <Award className="w-5 h-5 text-accent" />
            Training Summary
          </h3>
          <div className="space-y-4">
             {['Quality', 'Safety', 'Compliance', 'Technical'].map(type => {
               const count = records.filter(r => (r.trainingType || '').includes(type)).length;
               const percentage = records.length ? Math.round((count / records.length) * 100) : 0;
               return (
                 <div key={type} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-text-2 uppercase tracking-wider">
                      <span>{type}</span>
                      <span>{count} Records ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full bg-bg-1 rounded-full overflow-hidden">
                      <div className="h-full bg-accent transition-all duration-500" style={{ width: `${percentage}%` }} />
                    </div>
                 </div>
               );
             })}
          </div>
        </div>

        <div className="bg-bg-2 border border-border-main rounded-2xl p-6">
          <h3 className="font-bold text-text-1 mb-4 flex items-center gap-2 text-base">
            <Calendar className="w-5 h-5 text-accent" />
            Upcoming Trainings
          </h3>
          <div className="space-y-3">
             {upcomingTrainings.length === 0 ? (
               <div className="p-8 text-center bg-bg-1 border border-border-main border-dashed rounded-xl text-text-3 italic text-sm">
                 No upcoming trainings scheduled
               </div>
             ) : (
               upcomingTrainings.map(training => (
                 <div key={training.id} className="p-3 bg-bg-1 border border-border-main rounded-xl flex justify-between items-center group hover:border-accent/30 transition-all">
                    <div>
                      <div className="font-semibold text-text-1">{training.trainingTitle}</div>
                      <div className="text-[10px] text-text-3 uppercase tracking-wider font-bold mt-0.5">{training.trainingType} • {training.department}</div>
                    </div>
                    <div className="text-xs font-mono font-black text-accent bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20">
                      {new Date(training.date).toLocaleDateString()}
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Pagination } from '../components/Pagination';

function PlanTab({ records, onNavigate, refresh }: { records: UniversalRecord[], onNavigate: (page: string, params?: any) => void, refresh: () => void }) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const filtered = useMemo(() => {
    return records.filter(r => 
      (r.trainingTitle || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.trainingType || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.department || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [records, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filtered.slice(startIndex, startIndex + pageSize);
  }, [filtered, currentPage, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const handleExportPDF = async () => {
    const cols = ['ID', 'Title', 'Type', 'Dept', 'Trainer', 'Date', 'Status'];
    const rows = filtered.map(r => [
      r.id, r.trainingTitle, r.trainingType, r.department, r.trainer, 
      new Date(r.date).toLocaleDateString(), r.status
    ]);
    exportTableToPDF({
      moduleName: 'Master Training Plan',
      columns: cols,
      rows: rows,
      fileName: 'Master_Training_Plan'
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this training record?')) {
      await getTable('training').delete(id);
      refresh();
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
         <h2 className="text-lg font-bold text-text-1">Master Training Plan</h2>
         <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
              <input 
                type="text" 
                placeholder="Search plan..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-bg-2 border border-border-main rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
              />
            </div>
            <button className="btn btn-ghost border border-border-main flex gap-2 items-center text-xs font-bold" onClick={handleExportPDF}>
              <Download className="w-3.5 h-3.5"/> Export
            </button>
         </div>
       </div>

       <div className="overflow-x-auto border border-border-main rounded-2xl shadow-sm">
         <table className="w-full text-left text-sm whitespace-nowrap">
           <thead className="bg-bg-2 border-b border-border-main">
             <tr>
               <th className="p-4 text-text-3 font-bold uppercase tracking-wider text-[10px]">Title</th>
               <th className="p-4 text-text-3 font-bold uppercase tracking-wider text-[10px]">Type</th>
               <th className="p-4 text-text-3 font-bold uppercase tracking-wider text-[10px]">Dept</th>
               <th className="p-4 text-text-3 font-bold uppercase tracking-wider text-[10px]">Trainer</th>
               <th className="p-4 text-text-3 font-bold uppercase tracking-wider text-[10px]">Date</th>
               <th className="p-4 text-text-3 font-bold uppercase tracking-wider text-[10px]">Status</th>
               <th className="p-4 text-text-3 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-border-main bg-bg-1">
             {paginatedRecords.length === 0 ? (
               <tr>
                 <td colSpan={7} className="p-12 text-center text-text-3 italic">No training records found.</td>
               </tr>
             ) : (
               paginatedRecords.map(r => (
                 <tr key={r.id} className="hover:bg-bg-2/50 transition-colors group">
                   <td className="p-4">
                     <div className="font-bold text-text-1">{r.trainingTitle}</div>
                     <div className="text-[10px] text-text-3 font-mono mt-0.5">{r.id}</div>
                   </td>
                   <td className="p-4">
                     <span className="px-2.5 py-1 bg-accent/5 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest rounded-lg">
                       {r.trainingType}
                     </span>
                   </td>
                   <td className="p-4 text-text-2 font-medium">{r.department}</td>
                   <td className="p-4 text-text-2">{r.trainer}</td>
                   <td className="p-4 text-text-2 font-mono text-xs">{new Date(r.date).toLocaleDateString()}</td>
                   <td className="p-4">
                     <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                       r.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                       r.status === 'In Progress' ? 'bg-sky-500/10 text-sky-500 border-sky-500/20' :
                       'bg-amber-500/10 text-amber-500 border-amber-500/20'
                     }`}>
                       {r.status}
                     </span>
                   </td>
                   <td className="p-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onNavigate('training-form', { mode: 'edit', recordId: r.id })}
                          className="p-2 hover:bg-accent/10 text-text-3 hover:text-accent rounded-lg transition-colors" title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(r.id)}
                          className="p-2 hover:bg-rose-500/10 text-text-3 hover:text-rose-500 rounded-lg transition-colors" title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => exportDetailToPDF({
                            moduleName: 'Training Event',
                            moduleId: 'training',
                            recordId: r.id,
                            fields: [
                              { label: 'Title', value: r.trainingTitle },
                              { label: 'Type', value: r.trainingType },
                              { label: 'Dept', value: r.department },
                              { label: 'Trainer', value: r.trainer },
                              { label: 'Date', value: new Date(r.date).toLocaleDateString() },
                              { label: 'Venue', value: r.venue || '—' },
                              { label: 'Participants', value: r.participants || '—' }
                            ],
                            fileName: `Training_Event_${r.id}`
                          })}
                          className="p-2 hover:bg-accent/10 text-text-3 hover:text-accent rounded-lg transition-colors" title="PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                 </tr>
               ))
             )}
           </tbody>
         </table>
       </div>
       <Pagination 
         currentPage={currentPage}
         totalPages={totalPages}
         pageSize={pageSize}
         totalRecords={filtered.length}
         onPageChange={setCurrentPage}
         onPageSizeChange={setPageSize}
       />
    </div>
  );
}


function MaterialTab({ records }: { records: UniversalRecord[] }) {
  const materials = useMemo(() => {
    return records.flatMap(r => (r.attachments || []).map(a => ({ ...a, trainingId: r.id, trainingTitle: r.trainingTitle })));
  }, [records]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 border-b border-border-main pb-4">
         <h2 className="text-lg font-bold text-text-1">Training Materials & Documents</h2>
         <span className="bg-bg-2 px-3 py-1 rounded-full text-xs font-bold text-text-3 border border-border-main">{materials.length} Files</span>
       </div>
       
       {materials.length === 0 ? (
         <div className="p-16 border-2 border-dashed border-border-main rounded-2xl text-center flex flex-col items-center opacity-50">
            <BookOpen className="w-12 h-12 text-text-3 mb-4"/>
            <p className="text-text-2 font-bold mb-1 uppercase tracking-widest text-xs">No materials found</p>
            <p className="text-text-3 text-sm">Upload materials through the Training Plan form.</p>
         </div>
       ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
           {materials.map((m, i) => (
             <div key={i} className="bg-bg-2 border border-border-main p-5 rounded-2xl flex gap-4 items-center hover:shadow-md hover:border-accent/30 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-xl">
                   <FileText className="w-6 h-6"/>
                </div>
                <div className="flex-1 overflow-hidden">
                   <div className="font-bold text-text-1 truncate">{m.name}</div>
                   <div className="text-[10px] text-text-3 font-bold uppercase tracking-wider mt-1 truncate">{m.trainingTitle}</div>
                   <div className="text-[10px] text-text-3 font-mono mt-1 opacity-60">{(m.size / 1024).toFixed(1)} KB • {m.type.split('/')[1]?.toUpperCase() || 'FILE'}</div>
                </div>
                <a href={m.data} download={m.name} className="p-2.5 bg-bg-1 border border-border-main text-text-2 hover:text-accent hover:border-accent hover:bg-accent/5 rounded-xl transition-all shadow-sm">
                   <Download className="w-4 h-4"/>
                </a>
             </div>
           ))}
         </div>
       )}
    </div>
  );
}

function AttendanceTab({ records }: { records: UniversalRecord[] }) {
  const completed = records.filter(r => r.status === 'Completed');

  return (
    <div className="p-6">
       <div className="flex justify-between items-center mb-6 border-b border-border-main pb-4">
         <h2 className="text-lg font-bold text-text-1">Attendance Tracker</h2>
         <div className="flex gap-2">
            <button className="btn btn-ghost border border-border-main text-xs font-bold uppercase tracking-widest px-4"><Camera className="w-3.5 h-3.5 mr-2"/> QR Connect</button>
         </div>
       </div>

       {completed.length === 0 ? (
         <div className="p-16 border-2 border-dashed border-border-main rounded-2xl text-center flex flex-col items-center opacity-50">
            <Users className="w-12 h-12 text-text-3 mb-4"/>
            <p className="text-text-2 font-bold mb-1 uppercase tracking-widest text-xs">No finished trainings</p>
            <p className="text-text-3 text-sm">Attendance logs appear here for completed sessions.</p>
         </div>
       ) : (
         <div className="space-y-4">
            {completed.map(r => (
              <div key={r.id} className="bg-bg-2 border border-border-main p-6 rounded-2xl h-full shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 text-accent rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-1">{r.trainingTitle}</h4>
                      <p className="text-xs text-text-3 font-bold uppercase tracking-wider">{new Date(r.date).toLocaleDateString()} • {r.venue || 'Central Room'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xl font-black text-accent">{r.participantCount || 0}</div>
                      <div className="text-[10px] text-text-3 font-bold uppercase tracking-widest">Marked</div>
                    </div>
                    <button className="btn-primary-ghost px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-accent/20">
                      <FileText className="w-3.5 h-3.5" /> View List
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border-main flex gap-2 overflow-x-auto whitespace-nowrap custom-scrollbar pb-2">
                  {(r.participants || '').split(',').slice(0, 10).map((p, i) => (
                    <span key={i} className="px-3 py-1 bg-bg-1 border border-border-main rounded-lg text-[10px] font-semibold text-text-2">{p.trim()}</span>
                  ))}
                  {r.participants && r.participants.split(',').length > 10 && <span className="px-3 py-1 text-[10px] font-bold text-text-3 italic">+{r.participants.split(',').length - 10} more</span>}
                </div>
              </div>
            ))}
         </div>
       )}
    </div>
  );
}

function EvaluationTab({ records }: { records: UniversalRecord[] }) {
  const needsEval = records.filter(r => r.status === 'Completed');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 border-b border-border-main pb-4">
         <h2 className="text-lg font-bold text-text-1">Training Effectiveness & Evaluation</h2>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-bg-2 border border-border-main p-6 rounded-2xl shadow-sm">
             <h4 className="font-bold text-text-1 mb-4 text-sm flex items-center gap-2">
               <BarChart className="w-4 h-4 text-accent" /> Avg Score Trend
             </h4>
             <div className="h-32 flex items-end gap-2 px-2">
                {[45, 65, 80, 75, 90].map((v, i) => (
                  <div key={i} className="flex-1 bg-accent/20 rounded-t-lg relative group transition-all hover:bg-accent/40" style={{ height: `${v}%` }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-accent opacity-0 group-hover:opacity-100 transition-opacity">{v}%</div>
                  </div>
                ))}
             </div>
             <div className="flex justify-between text-[10px] font-bold text-text-3 uppercase tracking-widest mt-2 px-1">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span>
             </div>
          </div>

          <div className="md:col-span-2 bg-bg-2 border border-border-main p-6 rounded-2xl shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-text-1 text-sm">Recent Assessments</h4>
                <button className="text-xs font-bold text-accent hover:underline uppercase tracking-widest">Detailed Matrix</button>
             </div>
             <div className="space-y-3">
                {needsEval.length === 0 ? (
                  <p className="text-center py-8 text-text-3 italic text-sm">No recent training sessions for evaluation.</p>
                ) : (
                  needsEval.slice(0, 3).map(r => (
                    <div key={r.id} className="bg-bg-1 p-3 rounded-xl flex justify-between items-center border border-border-main shadow-xs">
                       <div className="flex items-center gap-3">
                          <BookCheck className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-bold text-text-1">{r.trainingTitle}</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                            r.effectiveness === 'Excellent' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>{r.effectiveness || 'Good'}</span>
                          <button className="p-1 hover:bg-accent/10 text-accent rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5"/></button>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
       </div>
    </div>
  );
}

function ComplianceTab({ records }: { records: UniversalRecord[] }) {
  const safetyTrainings = records.filter(r => (r.trainingType || '').toLowerCase().includes('safety'));
  const safetyCount = safetyTrainings.length;
  const compliantSafety = safetyTrainings.filter(r => r.status === 'Completed').length;
  const safetyRate = safetyCount > 0 ? Math.round((compliantSafety / safetyCount) * 100) : 100;

  const qualityTrainings = records.filter(r => (r.trainingType || '').toLowerCase().includes('quality'));
  const qualityRate = qualityTrainings.length > 0 ? Math.round((qualityTrainings.filter(r => r.status === 'Completed').length / qualityTrainings.length) * 100) : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 border-b border-border-main pb-4">
         <h2 className="text-lg font-bold text-text-1">Compliance Tracking</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 border border-border-main rounded-2xl bg-emerald-500/5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-bold text-emerald-600 text-sm">Safety Training Rate</h3>
                  <p className="text-[10px] font-bold text-text-3 uppercase tracking-widest mt-1">ISO / Buyer Compliance</p>
               </div>
               <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="flex items-end gap-2">
               <div className="text-4xl font-black text-emerald-500">{safetyRate}%</div>
               <div className="text-[10px] font-bold text-emerald-600/70 mb-1">{safetyRate === 100 ? 'Target Met' : 'Action Required'}</div>
            </div>
            <div className="mt-4 pt-4 border-t border-emerald-500/10 text-[10px] text-text-2 font-medium">
               Completed: {compliantSafety} / {safetyCount}
            </div>
         </div>

         <div className="p-6 border border-border-main rounded-2xl bg-amber-500/5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-bold text-amber-600 text-sm">Quality Compliance</h3>
                  <p className="text-[10px] font-bold text-text-3 uppercase tracking-widest mt-1">SOP Adherence</p>
               </div>
               <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex items-end gap-2">
               <div className="text-4xl font-black text-amber-500">{qualityRate}%</div>
               <div className="text-[10px] font-bold text-amber-600/70 mb-1">{qualityRate > 80 ? 'Good' : 'Needs Review'}</div>
            </div>
            <div className="mt-4 pt-4 border-t border-amber-500/10 text-[10px] text-text-2 font-medium">
               Total {qualityTrainings.length} Quality Modules
            </div>
         </div>

         <div className="p-6 border border-border-main rounded-2xl bg-sky-500/5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-bold text-sky-600 text-sm">Overall Progress</h3>
                  <p className="text-[10px] font-bold text-text-3 uppercase tracking-widest mt-1">Annual Goal</p>
               </div>
               <TrendingUp className="w-6 h-6 text-sky-500" />
            </div>
            <div className="flex items-end gap-2">
               <div className="text-4xl font-black text-sky-500">{records.length ? Math.round((records.filter(r => r.status === 'Completed').length / records.length) * 100) : 0}%</div>
               <div className="text-[10px] font-bold text-sky-600/70 mb-1">Completion Rate</div>
            </div>
            <div className="mt-4 pt-4 border-t border-sky-500/10 text-[10px] text-text-2 font-medium">
               Total {records.length} records in system.
            </div>
         </div>
      </div>
    </div>
  );
}

function ReportsTab({ records }: { records: UniversalRecord[] }) {
  const handleExport = (type: string) => {
    const cols = ['ID', 'Title', 'Type', 'Dept', 'Trainer', 'Date', 'Status'];
    const rows = records.map(r => [
      r.id, r.trainingTitle, r.trainingType, r.department, r.trainer, 
      new Date(r.date).toLocaleDateString(), r.status
    ]);
    exportTableToPDF({
      moduleName: `Professional ${type}`,
      columns: cols,
      rows: rows,
      fileName: `Training_${type.replace(' ', '_')}`
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 border-b border-border-main pb-4">
         <h2 className="text-lg font-bold text-text-1">Professional Exports</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { name: 'Training Report', icon: FileText, color: 'text-accent' },
           { name: 'Attendance Report', icon: Users, color: 'text-purple-500' },
           { name: 'Effectiveness Report', icon: BarChart, color: 'text-emerald-500' },
           { name: 'Dept Summary', icon: PieChart, color: 'text-sky-500' }
         ].map((item) => (
           <div key={item.name} className="bg-bg-2 p-6 border border-border-main rounded-2xl hover:shadow-lg hover:border-accent/30 cursor-pointer transition-all flex flex-col items-center text-center gap-4 group">
              <div className={`p-4 rounded-2xl bg-bg-1 border border-border-main group-hover:scale-110 transition-transform ${item.color}`}>
                 <item.icon className="w-8 h-8"/>
              </div>
              <div className="font-bold text-text-1 text-sm uppercase tracking-wider">{item.name}</div>
              <div className="flex gap-2 w-full mt-2">
                 <button 
                  onClick={() => handleExport(item.name)}
                  className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                >
                  PDF
                </button>
                 <button className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                  Excel
                </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
