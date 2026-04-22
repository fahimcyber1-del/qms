import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis, ComposedChart
} from 'recharts';
import { 
  LineChart as LineChartIcon, BarChart3, PieChart as PieChartIcon, 
  Download, Calendar, Filter, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle2, Factory, Users, Target, ShieldCheck,
  Zap, Brain, Activity, Globe, ArrowUpRight, ArrowDownRight,
  Sparkles, Layers, Cpu, Box, Search, Maximize2
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#059669', '#0891b2'];

const MONTHLY_DATA = [
  { name: 'Oct 24', dhu: 3.2, rft: 94.5, audits: 12, compliance: 98, planned: 12000, actual: 11500 },
  { name: 'Nov 24', dhu: 2.9, rft: 95.8, audits: 15, compliance: 97, planned: 12500, actual: 12200 },
  { name: 'Dec 24', dhu: 3.5, rft: 93.2, audits: 10, compliance: 95, planned: 11000, actual: 10800 },
  { name: 'Jan 25', dhu: 2.8, rft: 96.1, audits: 14, compliance: 99, planned: 13000, actual: 13100 },
  { name: 'Feb 25', dhu: 2.6, rft: 97.4, audits: 18, compliance: 98, planned: 12800, actual: 12900 },
  { name: 'Mar 25', dhu: 2.4, rft: 98.2, audits: 16, compliance: 100, planned: 14000, actual: 13950 },
];

const MODULE_DISTRIBUTION = [
  { name: 'Production', value: 35 },
  { name: 'Audit', value: 20 },
  { name: 'CAPA', value: 15 },
  { name: 'Maintenance', value: 10 },
  { name: 'Certification', value: 12 },
  { name: 'Other', value: 8 },
];

const RADAR_DATA = [
  { subject: 'Compliance', A: 120, B: 110, fullMark: 150 },
  { subject: 'Efficiency', A: 98, B: 130, fullMark: 150 },
  { subject: 'Safety', A: 86, B: 130, fullMark: 150 },
  { subject: 'Quality', A: 99, B: 100, fullMark: 150 },
  { subject: 'Speed', A: 85, B: 90, fullMark: 150 },
  { subject: 'Reliability', A: 65, B: 85, fullMark: 150 },
];

const SCATTER_DATA = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];

export function ReportsAnalytics() {
  const [timeRange, setTimeRange] = useState('6M');

  const exportGlobalPDF = () => {
    alert("Generating Comprehensive Intelligence Report...");
  };

  return (
    <motion.div 
      className="p-4 md:p-8 space-y-10 bg-bg-0 min-h-screen" 
      variants={containerVariants} 
      initial="hidden" 
      animate="show"
    >
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20">
              <Brain className="w-8 h-8 text-accent animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-text-1 tracking-tight">Intelligence Hub</h1>
              <p className="text-text-2 font-medium">Cross-module analytical engine & predictive quality insights.</p>
            </div>
          </motion.div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-bg-1 p-1 rounded-2xl border border-border-main shadow-sm">
            {['1M', '3M', '6M', '1Y', 'ALL'].map((t) => (
              <button 
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  timeRange === t ? 'bg-accent text-white shadow-lg shadow-accent/20 scale-105' : 'text-text-3 hover:text-text-2 hover:bg-bg-2'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button 
            className="group flex items-center gap-2 bg-text-1 text-bg-1 px-6 py-3 rounded-2xl font-bold hover:bg-accent transition-all duration-500 shadow-xl shadow-text-1/10 hover:shadow-accent/30"
            onClick={exportGlobalPDF}
          >
            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" /> 
            Comprehensive Export
          </button>
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Quality Index', value: '96.8', unit: '%', trend: '+2.4%', up: true, icon: ShieldCheck, color: 'accent' },
          { label: 'System DHU', value: '2.4', unit: '%', trend: '-0.8%', up: true, icon: Zap, color: 'blue-500' },
          { label: 'Audit Velocity', value: '18.5', unit: '/mo', trend: '+12%', up: true, icon: Activity, color: 'purple' },
          { label: 'Risk Exposure', value: 'Low', unit: '', trend: 'Stable', up: true, icon: AlertCircle, color: 'green' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants} 
            whileHover={{ y: -5 }}
            className="bg-bg-1 border border-border-main rounded-3xl p-6 shadow-sm relative overflow-hidden group transition-all"
          >
            <div className={`absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all text-${stat.color}`}>
              <stat.icon className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-start mb-4">
               <div className="text-xs font-black text-text-3 uppercase tracking-widest">{stat.label}</div>
               <div className={`p-2 rounded-xl bg-${stat.color}/10`}>
                 <stat.icon className={`w-4 h-4 text-${stat.color}`} />
               </div>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-black text-text-1">{stat.value}</span>
              <span className="text-sm font-extrabold text-text-3">{stat.unit}</span>
            </div>
            <div className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full w-fit ${
              stat.up ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            }`}>
              {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {stat.trend} VS PREV
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Radar Intelligence Matrix */}
        <motion.div variants={itemVariants} className="lg:col-span-5 bg-bg-1 border border-border-main rounded-3xl p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-text-1 flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-purple" />
                  Quality Dimension Matrix
                </h3>
                <p className="text-xs text-text-3 font-bold uppercase tracking-wider">Multi-dimensional system performance</p>
              </div>
              <button className="p-2 hover:bg-bg-2 rounded-xl transition-colors"><Maximize2 className="w-4 h-4 text-text-3" /></button>
           </div>
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                  <PolarGrid stroke="var(--border)" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-2)', fontSize: 11, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar name="Current Period" dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.4} strokeWidth={3} />
                  <Radar name="Target Matrix" dataKey="B" stroke="var(--purple)" fill="var(--purple)" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </RadarChart>
              </ResponsiveContainer>
           </div>
        </motion.div>

        {/* Composed Performance Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-7 bg-bg-1 border border-border-main rounded-3xl p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-text-1 flex items-center gap-2">
                  <Layers className="w-6 h-6 text-accent" />
                  Unified Production Flow
                </h3>
                <p className="text-xs text-text-3 font-bold uppercase tracking-wider">Planned vs Actual Output Correlation</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black text-text-3 uppercase">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent" /> Planned</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple" /> Actual</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /> RFT Trend</div>
              </div>
           </div>
           <div className="h-[350px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={MONTHLY_DATA}>
                 <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-3)', fontSize: 10, fontWeight: 700}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-3)', fontSize: 10, fontWeight: 700}} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}
                 />
                 <Bar dataKey="planned" fill="var(--accent)" radius={[6, 6, 0, 0]} barSize={20} opacity={0.6} />
                 <Bar dataKey="actual" fill="var(--purple)" radius={[6, 6, 0, 0]} barSize={20} />
                 <Line type="monotone" dataKey="rft" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} />
               </ComposedChart>
             </ResponsiveContainer>
           </div>
        </motion.div>

        {/* Scatter Correlation */}
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-bg-1 border border-border-main rounded-3xl p-8 shadow-sm">
           <div className="mb-6">
              <h3 className="text-lg font-black text-text-1">Defect Concentration</h3>
              <p className="text-xs font-bold text-text-3 mt-1 uppercase">Machine Hours vs Defect Rate</p>
           </div>
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" dataKey="x" name="stature" unit="hr" axisLine={false} tick={{fill: 'var(--text-3)', fontSize: 10}} />
                  <YAxis type="number" dataKey="y" name="weight" unit="pts" axisLine={false} tick={{fill: 'var(--text-3)', fontSize: 10}} />
                  <ZAxis type="number" dataKey="z" range={[100, 1000]} name="severity" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Machines" data={SCATTER_DATA} fill="var(--accent)" fillOpacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-6 p-4 bg-accent/5 rounded-2xl border border-accent/10">
              <div className="flex items-center gap-2 text-accent font-black text-xs mb-1">
                <Sparkles className="w-4 h-4" /> AI INSIGHT
              </div>
              <p className="text-xs text-text-2 leading-relaxed">Positive correlation detected between <b>Machine Op Time</b> and <b>Micro-defects</b> in Sector B.</p>
           </div>
        </motion.div>

        {/* Modular Summary Grid */}
        <motion.div variants={itemVariants} className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                 <Globe className="w-32 h-32" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-6">Regional Compliance</h4>
              <div className="space-y-6 relative z-10">
                 {[
                   { label: 'Europe Cluster', value: 98.4, color: 'bg-accent' },
                   { label: 'Asia Manufacturing', value: 94.2, color: 'bg-purple' },
                   { label: 'North America', value: 99.1, color: 'bg-green-500' },
                 ].map((reg, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                         <span>{reg.label}</span>
                         <span className="text-accent">{reg.value}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${reg.value}%` }}
                           className={`h-full ${reg.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-bg-1 border border-border-main rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-3 mb-6">Intelligence Brief</h4>
                <div className="space-y-4">
                   <div className="flex gap-4 p-4 rounded-2xl bg-bg-2/50 border border-border-main">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                         <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                         <div className="text-sm font-black text-text-1">Audit Streamline</div>
                         <p className="text-xs text-text-2 mt-1">94% of self-audits completed ahead of ISO deadline.</p>
                      </div>
                   </div>
                   <div className="flex gap-4 p-4 rounded-2xl bg-bg-2/50 border border-border-main">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                         <AlertCircle className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                         <div className="text-sm font-black text-text-1">NCR Response Time</div>
                         <p className="text-xs text-text-2 mt-1">Average RCA closure time increased by 4.2 hours this week.</p>
                      </div>
                   </div>
                </div>
              </div>
              <button className="w-full mt-6 py-3 rounded-2xl bg-bg-2 text-text-1 font-bold hover:bg-bg-3 transition-colors text-xs border border-border-main">
                 View Detailed RCA Logs
              </button>
           </div>
        </motion.div>

      </div>

      {/* Advanced Data Table */}
      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-3xl shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border-main flex justify-between items-center bg-bg-2/20">
           <div>
             <h3 className="text-xl font-black text-text-1">Aggregated Module Intelligence</h3>
             <p className="text-xs font-bold text-text-3 mt-1">Real-time performance across core QMS nodes</p>
           </div>
           <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
                <input 
                  type="text" 
                  placeholder="Filter nodes..." 
                  className="bg-bg-1 border border-border-main rounded-xl pl-9 pr-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-accent/20 w-64"
                />
              </div>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-2/30 text-[10px] font-black uppercase tracking-widest text-text-3 border-b border-border-main">
                <th className="px-8 py-5">Intelligence Node</th>
                <th className="px-8 py-5">Throughput</th>
                <th className="px-8 py-5">Criticality Index</th>
                <th className="px-8 py-5">Quality Score</th>
                <th className="px-8 py-5 text-right">Momentum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {[
                { name: 'Inspection Management', icon: Box, count: '1.24M Units', critical: 12, score: 94.2, trend: 'Accelerating', up: true },
                { name: 'Audit & Compliance', icon: ShieldCheck, count: '48 Sessions', critical: 0, score: 100, trend: 'Optimal', up: true },
                { name: 'NCR & RCA Engine', icon: AlertCircle, count: '32 Active', critical: 32, score: 12.5, trend: 'Slowing', up: false },
                { name: 'Supplier Multi-Tier', icon: Factory, count: '156 Entities', critical: 4, score: 88.8, trend: 'Expanding', up: true },
                { name: 'Job Descriptions', icon: Users, count: '890 Profiles', critical: 0, score: 96.2, trend: 'Stable', up: true },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-bg-2/40 transition-all duration-300 group cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                       <div className="p-2.5 rounded-xl bg-bg-2 group-hover:bg-accent group-hover:text-white transition-colors">
                          <row.icon className="w-5 h-5" />
                       </div>
                       <div>
                          <div className="text-sm font-black text-text-1">{row.name}</div>
                          <div className="text-[10px] text-text-3 font-bold uppercase">Active Module Node</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-extrabold text-text-2">{row.count}</td>
                  <td className="px-8 py-5">
                    <div className={`text-sm font-black ${row.critical > 10 ? 'text-red-500 animate-pulse' : 'text-text-1'}`}>
                      {row.critical} Issues
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-bg-2 rounded-full overflow-hidden min-w-[80px]">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${row.score}%` }}
                          className={`h-full ${row.score > 90 ? 'bg-green-500' : row.score > 70 ? 'bg-accent' : 'bg-red-500'}`} 
                        />
                      </div>
                      <span className="text-xs font-black text-text-1">{row.score}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                     <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${
                       row.up ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                     }`}>
                        {row.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {row.trend}
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
