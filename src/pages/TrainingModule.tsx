import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, Calendar, Users, Award, FileText, Download,
  CheckCircle2, Clock, AlertTriangle, ShieldCheck, PieChart,
  Plus, Edit2, Trash2, Camera, UserSquare, BarChart, BookOpen, User, BookCheck
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TrainingModuleProps {
  onNavigate: (page: string, params?: any) => void;
}

export function TrainingModule({ onNavigate }: TrainingModuleProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'plan', label: 'Training Plan', icon: Calendar },
    { id: 'material', label: 'Materials', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: Users },
    { id: 'evaluation', label: 'Evaluation', icon: BookCheck },
    { id: 'certificate', label: 'Certificates', icon: Award },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

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
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'plan' && <PlanTab />}
            {activeTab === 'material' && <MaterialTab />}
            {activeTab === 'attendance' && <AttendanceTab />}
            {activeTab === 'evaluation' && <EvaluationTab />}
            {activeTab === 'certificate' && <CertificateTab />}
            {activeTab === 'history' && <HistoryTab />}
            {activeTab === 'compliance' && <ComplianceTab />}
            {activeTab === 'reports' && <ReportsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── MODULE TABS IMPLEMENTATION ──

function OverviewTab() {
  const stats = [
    { label: 'Total Trainings', value: 124, icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Completed', value: 98, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Pending', value: 26, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Participation', value: '92%', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

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
          <h3 className="font-bold text-text-1 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            Training Effectiveness Score
          </h3>
          <div className="flex items-center justify-center h-48">
             <div className="text-center">
                <div className="text-5xl font-black text-green-500">88%</div>
                <div className="text-sm text-text-3 mt-2">Overall Effectiveness</div>
             </div>
          </div>
        </div>

        <div className="bg-bg-2 border border-border-main rounded-2xl p-6">
          <h3 className="font-bold text-text-1 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            Upcoming Trainings
          </h3>
          <div className="space-y-3">
             <div className="p-3 bg-bg-1 border border-border-main rounded-xl flex justify-between items-center">
                <div>
                  <div className="font-semibold text-text-1 whitespace-nowrap">Fire Safety Drill</div>
                  <div className="text-xs text-text-3">Compliance Training • Operator Dept</div>
                </div>
                <div className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">Tomorrow, 10 AM</div>
             </div>
             <div className="p-3 bg-bg-1 border border-border-main rounded-xl flex justify-between items-center">
                <div>
                  <div className="font-semibold text-text-1 whitespace-nowrap">Advanced Sewing Techniques</div>
                  <div className="text-xs text-text-3">Technical Training • Sewing Dept</div>
                </div>
                <div className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">2 Days Later</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanTab() {
  return (
    <div className="p-6 h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
         <h2 className="text-lg font-bold text-text-1">Master Training Plan</h2>
         <div className="flex gap-2">
            <button className="btn btn-primary flex gap-2 items-center"><Plus className="w-4 h-4"/> Add Plan</button>
            <button className="btn btn-ghost flex gap-2 items-center"><Download className="w-4 h-4"/> Export PDF</button>
         </div>
       </div>

       <div className="overflow-x-auto border border-border-main rounded-xl">
         <table className="w-full text-left text-sm whitespace-nowrap">
           <thead className="bg-bg-2">
             <tr>
               <th className="p-3 text-text-3 font-semibold">Title</th>
               <th className="p-3 text-text-3 font-semibold">Type</th>
               <th className="p-3 text-text-3 font-semibold">Dept</th>
               <th className="p-3 text-text-3 font-semibold">Trainer</th>
               <th className="p-3 text-text-3 font-semibold">Date</th>
               <th className="p-3 text-text-3 font-semibold">Status</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-border-main">
             <tr>
               <td className="p-3 font-medium">Quality Check Refresher</td>
               <td className="p-3">Quality Training</td>
               <td className="p-3">Quality</td>
               <td className="p-3">John QC Manager</td>
               <td className="p-3">Oct 15, 2026</td>
               <td className="p-3"><span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-lg font-medium">Completed</span></td>
             </tr>
             <tr>
               <td className="p-3 font-medium">Chemical Handling SOP</td>
               <td className="p-3">Compliance Training</td>
               <td className="p-3">Washing</td>
               <td className="p-3">EHS Head</td>
               <td className="p-3">Oct 18, 2026</td>
               <td className="p-3"><span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-xs rounded-lg font-medium">Ongoing</span></td>
             </tr>
           </tbody>
         </table>
       </div>
    </div>
  );
}

function MaterialTab() {
  return (
    <div className="p-6 border-border-main">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-lg font-bold text-text-1">Training Materials & Documents</h2>
         <button className="btn btn-primary flex gap-2 items-center"><Plus className="w-4 h-4"/> Upload Material</button>
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
         <div className="border border-border-main p-4 rounded-xl flex gap-4 items-center hover:bg-bg-2 cursor-pointer transition">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
               <FileText className="w-6 h-6"/>
            </div>
            <div>
               <div className="font-semibold text-text-1">Needle Control SOP</div>
               <div className="text-xs text-text-3">v1.2 • PDF • 2MB</div>
            </div>
         </div>
       </div>
    </div>
  );
}

function AttendanceTab() {
  return (
    <div className="p-6">
       <div className="flex justify-between items-center mb-6">
         <h2 className="text-lg font-bold text-text-1">Attendance Tracker</h2>
         <div className="flex gap-2">
            <button className="btn btn-ghost flex gap-2 items-center"><Camera className="w-4 h-4"/> QR Scan Info</button>
            <button className="btn border border-border-main flex gap-2 items-center"><Users className="w-4 h-4"/> Bulk Mark</button>
            <button className="btn btn-ghost flex gap-2 items-center"><Download className="w-4 h-4"/> Export</button>
         </div>
       </div>
       <div className="p-10 border-2 border-dashed border-border-main rounded-xl text-center flex flex-col items-center">
            <Users className="w-10 h-10 text-text-3 mb-2"/>
            <p className="text-text-2 font-medium">Select a training plan to mark attendance.</p>
       </div>
    </div>
  );
}

function EvaluationTab() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-lg font-bold text-text-1">Training Effectiveness & Evaluation</h2>
       </div>
       <div className="p-10 border-2 border-dashed border-border-main rounded-xl text-center flex flex-col items-center">
            <BookCheck className="w-10 h-10 text-text-3 mb-2"/>
            <p className="text-text-2 font-medium">Select an employee and training to perform MCQ Test / Practical Assessment.</p>
       </div>
    </div>
  );
}

function CertificateTab() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-lg font-bold text-text-1">Certificates</h2>
         <button className="btn btn-primary flex gap-2 items-center"><Award className="w-4 h-4"/> Auto Generate Certificates</button>
       </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
         <div className="border border-border-main p-4 rounded-xl flex gap-4 items-center bg-bg-2 cursor-pointer transition">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
               <Award className="w-6 h-6"/>
            </div>
            <div>
               <div className="font-semibold text-text-1">Fahim • Fire Safety</div>
               <div className="text-xs text-text-3">ID: CERT-1029 • PDF</div>
            </div>
         </div>
       </div>
    </div>
  );
}

function HistoryTab() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-lg font-bold text-text-1">Employee Training History</h2>
      </div>
      <div className="flex gap-4 mb-6">
         <input type="text" placeholder="Search by Employee..." className="flex-1 bg-bg-2 border border-border-main rounded-lg px-4 py-2 text-sm focus:outline-none"/>
         <button className="btn btn-primary px-6">Filter</button>
      </div>
      <div className="p-10 border border-border-main bg-bg-2 rounded-xl text-center flex flex-col items-center">
            <Clock className="w-10 h-10 opacity-30 mb-2"/>
            <p className="text-text-2 font-medium">Enter employee details to see history.</p>
       </div>
    </div>
  );
}


function ComplianceTab() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-lg font-bold text-text-1">Compliance Tracking</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="p-4 border border-border-main rounded-xl flex justify-between items-center bg-green-500/5">
            <div>
               <h3 className="font-bold text-green-600">Fire Safety Details</h3>
               <p className="text-xs text-text-3">ISO / Buyer Compliance Req.</p>
            </div>
            <div className="text-2xl font-black text-green-500">100%</div>
         </div>
         <div className="p-4 border border-border-main rounded-xl flex justify-between items-center bg-amber-500/5">
            <div>
               <h3 className="font-bold text-amber-600">Needle Control Trn.</h3>
               <p className="text-xs text-text-3">Buyer Compliance Req.</p>
            </div>
            <div className="text-2xl font-black text-amber-500">75%</div>
         </div>
      </div>
    </div>
  );
}

function ReportsTab() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-lg font-bold text-text-1">Professional Exports</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {['Training Report', 'Attendance Report', 'Effectiveness Report', 'Dept Summary'].map((item) => (
           <div key={item} className="p-4 border border-border-main rounded-xl hover:bg-bg-2 cursor-pointer transition flex flex-col gap-4">
              <FileText className="w-6 h-6 text-accent"/>
              <div className="font-semibold text-text-1">{item}</div>
              <div className="flex gap-2">
                 <button className="flex-1 py-1.5 text-xs bg-red-500/10 text-red-500 rounded font-bold">PDF</button>
                 <button className="flex-1 py-1.5 text-xs bg-green-500/10 text-green-500 rounded font-bold">Excel</button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
