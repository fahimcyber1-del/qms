import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ZAxis
} from 'recharts';
import {
  Download, FileText, BarChart3, TrendingUp, ShieldCheck, AlertCircle,
  Activity, Factory, Filter, RefreshCw, ChevronDown, CheckCircle2,
  Zap, Users, Target, Brain, ArrowUpRight, ArrowDownRight, Printer,
  Table, PieChart as PieIcon, FileSpreadsheet, Layers,
  ShieldAlert, Truck, BookOpen
} from 'lucide-react';
import { exportTableToPDF } from '../utils/pdfExportUtils';

const C = ['#2563eb','#7c3aed','#db2777','#ea580c','#059669','#0891b2','#d97706'];

const MONTHLY = [
  { m:'Oct 24', dhu:3.2, rft:94.5, audits:12, ncr:8, capa:5, compliance:98 },
  { m:'Nov 24', dhu:2.9, rft:95.8, audits:15, ncr:6, capa:7, compliance:97 },
  { m:'Dec 24', dhu:3.5, rft:93.2, audits:10, ncr:11, capa:4, compliance:95 },
  { m:'Jan 25', dhu:2.8, rft:96.1, audits:14, ncr:5, capa:9, compliance:99 },
  { m:'Feb 25', dhu:2.6, rft:97.4, audits:18, ncr:3, capa:11, compliance:98 },
  { m:'Mar 25', dhu:2.4, rft:98.2, audits:16, ncr:2, capa:8, compliance:100 },
];

const PIE_DATA = [
  { name:'Production', value:35 },
  { name:'Audit', value:20 },
  { name:'CAPA', value:15 },
  { name:'NCR', value:12 },
  { name:'Maintenance', value:10 },
  { name:'Other', value:8 },
];

const RADAR_DATA = [
  { s:'Compliance', v:120, t:140 },
  { s:'Efficiency', v:98, t:130 },
  { s:'Safety', v:110, t:130 },
  { s:'Quality', v:125, t:140 },
  { s:'Speed', v:85, t:110 },
  { s:'Reliability', v:95, t:120 },
];

const RISK_DATA = [
  { x: 1, y: 1, z: 200, name: 'Low Risk' },
  { x: 2, y: 2, z: 260, name: 'Med Risk' },
  { x: 3, y: 1, z: 400, name: 'Med-Low Risk' },
  { x: 4, y: 4, z: 280, name: 'High Risk' },
  { x: 5, y: 5, z: 500, name: 'Critical Risk' },
];

const SUPPLIER_DATA = [
  { m: 'Oct 24', quality: 92, delivery: 95 },
  { m: 'Nov 24', quality: 94, delivery: 91 },
  { m: 'Dec 24', quality: 91, delivery: 94 },
  { m: 'Jan 25', quality: 95, delivery: 97 },
  { m: 'Feb 25', quality: 96, delivery: 98 },
  { m: 'Mar 25', quality: 98, delivery: 96 },
];

const TRAINING_DATA = [
  { m: 'Oct 24', completed: 45, pending: 12 },
  { m: 'Nov 24', completed: 50, pending: 8 },
  { m: 'Dec 24', completed: 30, pending: 20 },
  { m: 'Jan 25', completed: 60, pending: 5 },
  { m: 'Feb 25', completed: 55, pending: 10 },
  { m: 'Mar 25', completed: 65, pending: 2 },
];

type ReportType = 'quality'|'dhu'|'audit'|'ncr'|'capa'|'compliance'|'production'|'risk'|'supplier'|'training';

const REPORT_TYPES: { id: ReportType; label: string; icon: any; color: string; desc: string }[] = [
  { id:'quality', label:'Quality Summary', icon:ShieldCheck, color:'text-blue-500', desc:'Overall quality KPIs & RFT trend' },
  { id:'dhu', label:'DHU Trend', icon:TrendingUp, color:'text-purple-500', desc:'Defects per 100 units over time' },
  { id:'audit', label:'Audit Status', icon:CheckCircle2, color:'text-green-500', desc:'Audit completion & compliance rates' },
  { id:'ncr', label:'NCR Intelligence', icon:AlertCircle, color:'text-red-500', desc:'Non-conformance root cause analysis' },
  { id:'capa', label:'CAPA Analysis', icon:Activity, color:'text-orange-500', desc:'Corrective action effectiveness' },
  { id:'compliance', label:'Compliance Matrix', icon:Target, color:'text-cyan-500', desc:'Department-wise compliance scores' },
  { id:'production', label:'Production Flow', icon:Factory, color:'text-amber-500', desc:'Planned vs actual output correlation' },
  { id:'risk', label:'Risk Matrix', icon:ShieldAlert, color:'text-rose-500', desc:'Severity vs Probability heatmap analysis' },
  { id:'supplier', label:'Supplier KPI', icon:Truck, color:'text-indigo-500', desc:'Quality and delivery performance tracking' },
  { id:'training', label:'Training Matrix', icon:BookOpen, color:'text-teal-500', desc:'Employee competency and completion rates' },
];

function TipBox({ contentStyle }: any) {
  return (
    <div style={{ ...contentStyle, background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:12, padding:'8px 12px', fontSize:11, fontWeight:700 }} />
  );
}

function QualityChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={MONTHLY}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} />
        <Tooltip contentStyle={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:12 }} />
        <Legend />
        <Bar dataKey="rft" name="RFT %" fill={C[0]} radius={[6,6,0,0]} barSize={24} />
        <Line type="monotone" dataKey="compliance" name="Compliance %" stroke={C[4]} strokeWidth={3} dot={{ r:4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function DHUChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={MONTHLY}>
        <defs>
          <linearGradient id="dhuGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={C[1]} stopOpacity={0.3} />
            <stop offset="95%" stopColor={C[1]} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} />
        <Tooltip contentStyle={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:12 }} />
        <Area type="monotone" dataKey="dhu" name="DHU %" stroke={C[1]} fill="url(#dhuGrad)" strokeWidth={3} dot={{ r:5, fill:C[1] }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function AuditChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={MONTHLY}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} />
        <Tooltip contentStyle={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:12 }} />
        <Legend />
        <Bar dataKey="audits" name="Audits Conducted" fill={C[4]} radius={[6,6,0,0]} barSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function NCRChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={MONTHLY}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} />
        <Tooltip contentStyle={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:12 }} />
        <Legend />
        <Line type="monotone" dataKey="ncr" name="NCRs Raised" stroke={C[2]} strokeWidth={3} dot={{ r:5, fill:C[2] }} />
        <Line type="monotone" dataKey="capa" name="CAPAs Opened" stroke={C[3]} strokeWidth={3} strokeDasharray="5 5" dot={{ r:4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function CAPAChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={MONTHLY} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} />
        <YAxis type="category" dataKey="m" axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} />
        <Tooltip contentStyle={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:12 }} />
        <Legend />
        <Bar dataKey="capa" name="CAPA Count" fill={C[3]} radius={[0,6,6,0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ComplianceChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_DATA}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="s" tick={{ fill:'var(--text-2)', fontSize:11, fontWeight:700 }} />
        <PolarRadiusAxis angle={30} domain={[0,150]} tick={false} axisLine={false} />
        <Radar name="Actual" dataKey="v" stroke={C[5]} fill={C[5]} fillOpacity={0.35} strokeWidth={2.5} />
        <Radar name="Target" dataKey="t" stroke={C[0]} fill={C[0]} fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
        <Tooltip contentStyle={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:12 }} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}

function ProductionChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={[
        { m:'Oct 24', planned:12000, actual:11500 },
        { m:'Nov 24', planned:12500, actual:12200 },
        { m:'Dec 24', planned:11000, actual:10800 },
        { m:'Jan 25', planned:13000, actual:13100 },
        { m:'Feb 25', planned:12800, actual:12900 },
        { m:'Mar 25', planned:14000, actual:13950 },
      ]}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} />
        <Tooltip contentStyle={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:12 }} />
        <Legend />
        <Bar dataKey="planned" name="Planned Output" fill={C[0]} radius={[6,6,0,0]} barSize={20} opacity={0.6} />
        <Bar dataKey="actual" name="Actual Output" fill={C[1]} radius={[6,6,0,0]} barSize={20} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function PieBreakdown() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
          {PIE_DATA.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:12 }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

function RiskChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" dataKey="x" name="Probability" axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} domain={[0, 6]} />
        <YAxis type="number" dataKey="y" name="Severity" axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} domain={[0, 6]} />
        <ZAxis type="number" dataKey="z" range={[60, 400]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:12 }} />
        <Legend />
        <Scatter name="Risks" data={RISK_DATA} fill={C[3]} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function SupplierChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={SUPPLIER_DATA}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} domain={[80, 100]} />
        <Tooltip contentStyle={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:12 }} />
        <Legend />
        <Line type="monotone" dataKey="quality" name="Quality %" stroke={C[0]} strokeWidth={3} dot={{ r:4 }} />
        <Line type="monotone" dataKey="delivery" name="Delivery %" stroke={C[4]} strokeWidth={3} dot={{ r:4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function TrainingChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={TRAINING_DATA}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill:'var(--text-3)', fontSize:10, fontWeight:700 }} />
        <Tooltip contentStyle={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:12 }} />
        <Legend />
        <Bar dataKey="completed" name="Completed" stackId="a" fill={C[4]} radius={[0,0,0,0]} barSize={32} />
        <Bar dataKey="pending" name="Pending" stackId="a" fill={C[3]} radius={[6,6,0,0]} barSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}

const CHART_MAP: Record<ReportType, React.FC> = {
  quality: QualityChart,
  dhu: DHUChart,
  audit: AuditChart,
  ncr: NCRChart,
  capa: CAPAChart,
  compliance: ComplianceChart,
  production: ProductionChart,
  risk: RiskChart,
  supplier: SupplierChart,
  training: TrainingChart,
};

const STATS: Record<ReportType, { label:string; value:string; unit:string; up:boolean; trend:string }[]> = {
  quality: [
    { label:'Avg RFT', value:'95.9', unit:'%', up:true, trend:'+2.4%' },
    { label:'Quality Index', value:'96.8', unit:'%', up:true, trend:'+1.1%' },
    { label:'Avg Compliance', value:'97.8', unit:'%', up:true, trend:'+0.6%' },
    { label:'Defect Density', value:'2.4', unit:'%', up:true, trend:'-0.8%' },
  ],
  dhu: [
    { label:'Best DHU', value:'2.4', unit:'%', up:true, trend:'Mar 25' },
    { label:'Worst DHU', value:'3.5', unit:'%', up:false, trend:'Dec 24' },
    { label:'Avg DHU', value:'2.9', unit:'%', up:true, trend:'-0.3%' },
    { label:'Target DHU', value:'2.5', unit:'%', up:true, trend:'On Track' },
  ],
  audit: [
    { label:'Total Audits', value:'85', unit:'', up:true, trend:'+12%' },
    { label:'Avg/Month', value:'14.2', unit:'', up:true, trend:'+2' },
    { label:'Pass Rate', value:'98.8', unit:'%', up:true, trend:'+3%' },
    { label:'Open Findings', value:'4', unit:'', up:true, trend:'-8' },
  ],
  ncr: [
    { label:'Total NCRs', value:'35', unit:'', up:true, trend:'-22%' },
    { label:'Closure Rate', value:'91.4', unit:'%', up:true, trend:'+5%' },
    { label:'Avg Days', value:'4.2', unit:'d', up:false, trend:'+0.4d' },
    { label:'Open NCRs', value:'3', unit:'', up:true, trend:'-5' },
  ],
  capa: [
    { label:'CAPAs Opened', value:'44', unit:'', up:true, trend:'+8%' },
    { label:'Effectiveness', value:'88', unit:'%', up:true, trend:'+4%' },
    { label:'Avg Close', value:'6.1', unit:'d', up:true, trend:'-1.2d' },
    { label:'Recurring', value:'2', unit:'', up:true, trend:'-3' },
  ],
  compliance: [
    { label:'Compliance Score', value:'98.2', unit:'%', up:true, trend:'+1.8%' },
    { label:'ISO Readiness', value:'94', unit:'%', up:true, trend:'+6%' },
    { label:'Risk Level', value:'Low', unit:'', up:true, trend:'Stable' },
    { label:'Certifications', value:'7', unit:'', up:true, trend:'+1' },
  ],
  production: [
    { label:'Total Planned', value:'75.3K', unit:'', up:true, trend:'+5%' },
    { label:'Total Actual', value:'74.5K', unit:'', up:true, trend:'98.9%' },
    { label:'Efficiency', value:'98.9', unit:'%', up:true, trend:'+1.2%' },
    { label:'Shortfall', value:'0.8K', unit:'', up:true, trend:'-2.1K' },
  ],
  risk: [
    { label:'Critical Risks', value:'2', unit:'', up:true, trend:'-1' },
    { label:'High Risks', value:'4', unit:'', up:false, trend:'+2' },
    { label:'Mitigation Rate', value:'85', unit:'%', up:true, trend:'+5%' },
    { label:'Open Incidents', value:'1', unit:'', up:true, trend:'-3' },
  ],
  supplier: [
    { label:'Avg Quality', value:'94.3', unit:'%', up:true, trend:'+1.2%' },
    { label:'Avg Delivery', value:'95.2', unit:'%', up:true, trend:'+0.5%' },
    { label:'Top Tier', value:'12', unit:'', up:true, trend:'+2' },
    { label:'Underperforming', value:'1', unit:'', up:true, trend:'-2' },
  ],
  training: [
    { label:'Total Trained', value:'305', unit:'', up:true, trend:'+15' },
    { label:'Completion Rate', value:'84.3', unit:'%', up:true, trend:'+4.1%' },
    { label:'Pending', value:'57', unit:'', up:true, trend:'-12' },
    { label:'Avg Score', value:'92', unit:'%', up:true, trend:'+2%' },
  ],
};

const TABLE_DATA: Record<ReportType, { cols:string[]; rows:string[][] }> = {
  quality: {
    cols: ['Month','RFT %','Compliance %','DHU %','Status'],
    rows: MONTHLY.map(r => [r.m, r.rft+'%', r.compliance+'%', r.dhu+'%', r.rft >= 96 ? 'Excellent' : 'Good']),
  },
  dhu: {
    cols: ['Month','DHU %','Target','Variance','Rating'],
    rows: MONTHLY.map(r => [r.m, r.dhu+'%', '2.5%', ((r.dhu - 2.5).toFixed(1))+'%', r.dhu <= 2.5 ? '✓ On Target' : '⚠ Above Target']),
  },
  audit: {
    cols: ['Month','Audits','Pass Rate','Findings','Closed'],
    rows: MONTHLY.map(r => [r.m, String(r.audits), '98%', String(Math.floor(r.audits * 0.1)), String(Math.floor(r.audits * 0.09))]),
  },
  ncr: {
    cols: ['Month','NCRs Raised','CAPAs','Closure Rate','Avg Days'],
    rows: MONTHLY.map(r => [r.m, String(r.ncr), String(r.capa), '91%', '4.2']),
  },
  capa: {
    cols: ['Month','CAPAs','Closed','Effective','Recurring'],
    rows: MONTHLY.map(r => [r.m, String(r.capa), String(r.capa - 1), String(r.capa - 1)+'(88%)', '0']),
  },
  compliance: {
    cols: ['Month','Score','ISO Status','Risk Level','Notes'],
    rows: MONTHLY.map(r => [r.m, r.compliance+'%', r.compliance >= 98 ? 'Compliant' : 'Partial', 'Low', '-']),
  },
  production: {
    cols: ['Month','Planned','Actual','Efficiency','Shortfall'],
    rows: [
      ['Oct 24','12,000','11,500','95.8%','500'],
      ['Nov 24','12,500','12,200','97.6%','300'],
      ['Dec 24','11,000','10,800','98.2%','200'],
      ['Jan 25','13,000','13,100','100.8%','0'],
      ['Feb 25','12,800','12,900','100.8%','0'],
      ['Mar 25','14,000','13,950','99.6%','50'],
    ],
  },
  risk: {
    cols: ['Category','Probability','Severity','Risk Score','Status'],
    rows: RISK_DATA.map(r => [r.name, String(r.x), String(r.y), String(r.x * r.y), (r.x * r.y) > 15 ? 'High Attention' : 'Monitor']),
  },
  supplier: {
    cols: ['Month','Avg Quality','Avg Delivery','Overall KPI','Rating'],
    rows: SUPPLIER_DATA.map(r => [r.m, r.quality+'%', r.delivery+'%', ((r.quality + r.delivery)/2).toFixed(1)+'%', ((r.quality + r.delivery)/2) >= 95 ? 'A-Grade' : 'B-Grade']),
  },
  training: {
    cols: ['Month','Completed','Pending','Total Enrolled','Completion Rate'],
    rows: TRAINING_DATA.map(r => [r.m, String(r.completed), String(r.pending), String(r.completed + r.pending), ((r.completed / (r.completed + r.pending)) * 100).toFixed(1)+'%']),
  },
};

export function ReportsAnalytics() {
  const [activeReport, setActiveReport] = useState<ReportType>('quality');
  const [downloading, setDownloading] = useState(false);

  const rp = REPORT_TYPES.find(r => r.id === activeReport)!;
  const ChartComp = CHART_MAP[activeReport];
  const stats = STATS[activeReport];
  const tableData = TABLE_DATA[activeReport];

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      await exportTableToPDF({
        moduleName: rp.label,
        fileName: `QMS_${rp.label.replace(/\s+/g,'_')}_Report_${new Date().toISOString().split('T')[0]}`,
        columns: tableData.cols,
        rows: tableData.rows,
        summary: stats.map(s => `${s.label}: ${s.value}${s.unit}  (${s.trend})`),
        orientation: 'landscape',
      });
    } catch (e) { console.error(e); }
    finally { setDownloading(false); }
  }, [activeReport, rp, tableData, stats]);

  return (
    <motion.div className="p-4 md:p-8 space-y-8 bg-bg-0 min-h-screen" initial={{ opacity:0 }} animate={{ opacity:1 }}>

      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20">
            <Brain className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-text-1 tracking-tight">Report Powerhouse</h1>
            <p className="text-text-2 font-medium text-sm mt-0.5">7 analytical report formats · PDF download · live charts</p>
          </div>
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-2xl font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/25 disabled:opacity-60"
        >
          {downloading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          {downloading ? 'Generating PDF…' : 'Download PDF Report'}
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10 gap-3">
        {REPORT_TYPES.map(r => {
          const Icon = r.icon;
          const active = r.id === activeReport;
          return (
            <button
              key={r.id}
              onClick={() => setActiveReport(r.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 group ${
                active
                  ? 'bg-accent/10 border-accent/40 shadow-lg shadow-accent/10'
                  : 'bg-bg-1 border-border-main hover:border-accent/30 hover:bg-bg-2'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${active ? 'text-accent' : r.color}`} />
              <div className={`text-xs font-black leading-tight ${active ? 'text-accent' : 'text-text-1'}`}>{r.label}</div>
              <div className="text-[10px] text-text-3 mt-0.5 font-medium leading-tight hidden lg:block">{r.desc}</div>
            </button>
          );
        })}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-bg-1 border border-border-main rounded-2xl p-5"
          >
            <div className="text-xs font-black text-text-3 uppercase tracking-widest mb-2">{s.label}</div>
            <div className="text-3xl font-black text-text-1">{s.value}<span className="text-sm text-text-3 ml-1">{s.unit}</span></div>
            <div className={`mt-2 flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full w-fit ${s.up ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {s.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div
          key={activeReport}
          initial={{ opacity:0, scale:0.98 }}
          animate={{ opacity:1, scale:1 }}
          className="lg:col-span-8 bg-bg-1 border border-border-main rounded-3xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-text-1 flex items-center gap-2">
                <rp.icon className={`w-5 h-5 ${rp.color}`} />
                {rp.label}
              </h3>
              <p className="text-xs text-text-3 font-bold mt-0.5">{rp.desc}</p>
            </div>
          </div>
          <ChartComp />
        </motion.div>

        <div className="lg:col-span-4 bg-bg-1 border border-border-main rounded-3xl p-6 shadow-sm flex flex-col">
          <h3 className="text-sm font-black text-text-1 flex items-center gap-2 mb-4">
            <PieIcon className="w-4 h-4 text-accent" /> Module Distribution
          </h3>
          <PieBreakdown />
          <div className="mt-auto pt-4 border-t border-border-main grid grid-cols-2 gap-2">
            {PIE_DATA.slice(0,4).map((d,i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-bold text-text-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: C[i] }} />
                {d.name}: {d.value}%
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <motion.div
        key={`tbl-${activeReport}`}
        initial={{ opacity:0, y:10 }}
        animate={{ opacity:1, y:0 }}
        className="bg-bg-1 border border-border-main rounded-3xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-border-main flex justify-between items-center">
          <div>
            <h3 className="text-lg font-black text-text-1 flex items-center gap-2">
              <Table className="w-5 h-5 text-accent" /> {rp.label} — Data Table
            </h3>
            <p className="text-xs text-text-3 font-bold mt-0.5">6 months · {tableData.rows.length} records</p>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black border border-accent/20 hover:bg-accent/20 transition-colors disabled:opacity-60"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export PDF
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-2/50 text-[10px] font-black uppercase tracking-widest text-text-3 border-b border-border-main">
                {tableData.cols.map((c,i) => <th key={i} className="px-6 py-4">{c}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {tableData.rows.map((row,ri) => (
                <tr key={ri} className="hover:bg-bg-2/40 transition-colors">
                  {row.map((cell,ci) => (
                    <td key={ci} className={`px-6 py-4 text-sm font-bold ${ci === 0 ? 'text-accent' : 'text-text-1'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </motion.div>
  );
}
