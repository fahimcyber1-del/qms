import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area
} from 'recharts';
import { 
  LineChart as LineChartIcon, BarChart3, PieChart as PieChartIcon, 
  Download, Calendar, Filter, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle2, Factory, Users, Target, ShieldCheck
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const COLORS = ['#00d4ff', '#00e676', '#ffaa00', '#ff3d5a', '#9d50bb', '#6e48aa'];

const MONTHLY_DATA = [
  { name: 'Oct 24', dhu: 3.2, rft: 94.5, audits: 12, compliance: 98 },
  { name: 'Nov 24', dhu: 2.9, rft: 95.8, audits: 15, compliance: 97 },
  { name: 'Dec 24', dhu: 3.5, rft: 93.2, audits: 10, compliance: 95 },
  { name: 'Jan 25', dhu: 2.8, rft: 96.1, audits: 14, compliance: 99 },
  { name: 'Feb 25', dhu: 2.6, rft: 97.4, audits: 18, compliance: 98 },
  { name: 'Mar 25', dhu: 2.4, rft: 98.2, audits: 16, compliance: 100 },
];

const MODULE_DISTRIBUTION = [
  { name: 'Production', value: 35 },
  { name: 'Audit', value: 20 },
  { name: 'CAPA', value: 15 },
  { name: 'Maintenance', value: 10 },
  { name: 'Certification', value: 12 },
  { name: 'Other', value: 8 },
];

export function ReportsAnalytics() {
  const [timeRange, setTimeRange] = useState('Last 6 Months');

  const exportGlobalPDF = () => {
    alert("Generating Comprehensive Analytics Report...");
    // Integration with pdfExportUtils would go here
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <LineChartIcon className="w-8 h-8 text-accent" />
            Reports & Intelligence
          </h1>
          <p className="text-text-2 text-base mt-2">Aggregate performance insights and cross-module quality intelligence.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-bg-1 p-1 rounded-xl border border-border-main">
            {['1M', '3M', '6M', '1Y'].map((t) => (
              <button 
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  timeRange === t ? 'bg-accent text-white shadow-lg' : 'text-text-3 hover:bg-bg-2'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="btn btn-primary flex items-center gap-2" onClick={exportGlobalPDF}>
            <Download className="w-4 h-4" /> Global Export
          </button>
        </div>
      </div>

      {/* High Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Overall Quality Index', value: '96.8', unit: '%', trend: '+2.4%', up: true, icon: ShieldCheck, color: 'text-green-500' },
          { label: 'Avg. DHU (Factory)', value: '2.4', unit: '%', trend: '-0.8%', up: true, icon: TrendingDown, color: 'text-blue-500' },
          { label: 'Audit Compliance', value: '100', unit: '%', trend: 'Stable', up: true, icon: CheckCircle2, color: 'text-purple-main' },
          { label: 'Pending Critical CAPAs', value: '03', unit: 'Items', trend: '+1', up: false, icon: AlertCircle, color: 'text-red-500' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${stat.color}`}>
              <stat.icon className="w-16 h-16" />
            </div>
            <div className="text-sm font-bold text-text-3 uppercase tracking-widest mb-2">{stat.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-text-1">{stat.value}</span>
              <span className="text-sm font-bold text-text-3">{stat.unit}</span>
            </div>
            <div className={`mt-4 flex items-center gap-1.5 text-xs font-black px-2 py-1 rounded-lg w-fit ${
              stat.up ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            }`}>
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-text-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Efficiency & RFT Trend
            </h3>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-tighter text-text-3">
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent" /> RFT %</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> DHU %</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_DATA}>
                <defs>
                  <linearGradient id="colorRft" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border-main" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-3)', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-3)', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-1)', border: '1px solid var(--border-main)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="rft" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorRft)" />
                <Line type="monotone" dataKey="dhu" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-text-1 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-purple-main" />
              Module Data Contribution
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-[300px]">
            <div className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MODULE_DISTRIBUTION}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {MODULE_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {MODULE_DISTRIBUTION.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2 text-text-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                    {item.name}
                  </div>
                  <span className="text-text-1">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-bg-1 border border-border-main rounded-2xl p-6 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text-1 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-500" />
                Audit Compliance by Department
              </h3>
           </div>
           <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border-main" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-3)', fontSize: 10, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-3)', fontSize: 10, fontWeight: 700}} />
                  <Tooltip />
                  <Bar dataKey="compliance" fill="var(--accent)" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-accent to-purple-main rounded-2xl p-8 text-white shadow-xl flex flex-col justify-between">
           <div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                 <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold leading-tight">ISO 9001:2015 Readiness Index</h3>
              <p className="mt-3 text-white/80 text-sm font-medium">Your current document system and module data integrity reflects a high level of compliance.</p>
           </div>
           
           <div className="mt-8 space-y-4">
              <div className="flex justify-between items-end">
                 <span className="text-xs font-black uppercase tracking-widest opacity-70">Compliance Health</span>
                 <span className="text-2xl font-black">98.4%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '98.4%' }}
                    className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                 />
              </div>
           </div>
        </motion.div>
      </div>

      {/* Data Table Preview */}
      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-main bg-bg-2/50">
           <h3 className="font-bold text-text-1">Aggregated Module Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-2/30 text-[10px] font-black uppercase tracking-widest text-text-3 border-b border-border-main">
                <th className="p-4 pl-6">Module Node</th>
                <th className="p-4">Total Records</th>
                <th className="p-4">Critical Issues</th>
                <th className="p-4">Average Score</th>
                <th className="p-4 pr-6 text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {[
                { name: 'Inspection Management', count: 1240, critical: 12, score: 94, trend: 'Increasing' },
                { name: 'Audit & Compliance', count: 48, critical: 0, score: 100, trend: 'Stable' },
                { name: 'NCR & RCA', count: 32, critical: 32, score: 12, trend: 'Decreasing' },
                { name: 'Supplier Multi-Tier', count: 156, critical: 4, score: 88, trend: 'Stable' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-bg-2/40 transition-colors">
                  <td className="p-4 pl-6 font-bold text-text-1 text-sm">{row.name}</td>
                  <td className="p-4 text-sm font-semibold text-text-2">{row.count}</td>
                  <td className="p-4 text-sm font-black text-red-500">{row.critical}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-bg-2 rounded-full overflow-hidden max-w-[60px]">
                        <div className="h-full bg-accent" style={{ width: `${row.score}%` }} />
                      </div>
                      <span className="text-xs font-black text-text-1">{row.score}%</span>
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right text-[10px] font-black uppercase tracking-tighter text-accent">{row.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
