import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, CheckCircle, Package, AlertTriangle, ClipboardCheck, TrendingDown, AlertCircle, Factory, Search, Award, GraduationCap, Wrench, Target, Archive, Files } from 'lucide-react';
import { motion } from 'motion/react';
import { getCertificates, getDaysUntilExpiry } from '../utils/certificateUtils';
import { getProductionQualityRecords } from '../utils/qualityUtils';
import { getProcedures } from '../utils/procedureUtils';
import { getDocuments } from '../utils/docUtils';
import { CertificateRecord } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

interface Defect {
  name: string;
  count: number;
}

interface InspectionRecord {
  id: string;
  date: string;
  unit: string;
  section: string;
  lineNumber: string;
  checkedQuantity: number;
  goodsQuantity: number;
  totalDefects: number;
  topDefects: Defect[];
  uid: string;
  source: string;
  createdAt: any;
}

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

function Dashboard({ onNavigate }: DashboardProps) {
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [capas, setCapas] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [proceduresCount, setProceduresCount] = useState(0);
  const [auditPassRate, setAuditPassRate] = useState(100);

  useEffect(() => {
    // Load certificates
    setCertificates(getCertificates());

    // Load Inspections
    setInspections(getProductionQualityRecords() as unknown as InspectionRecord[]);

    // CAPAs
    try {
      const storedCapas = localStorage.getItem('garmentqms_capas');
      if (storedCapas) setCapas(JSON.parse(storedCapas));
    } catch(e) {}

    // Documents
    setDocumentsCount(getDocuments().length);

    // Procedures
    setProceduresCount(getProcedures().length);

    // Audits Pass Rate
    try {
      const auditsStr = localStorage.getItem('garmentqms_audits');
      if (auditsStr) {
        const audits = JSON.parse(auditsStr);
        if (audits.length > 0) {
          const passed = audits.filter((a: any) => a.overallScore != null && parseFloat(a.overallScore) >= 75).length;
          setAuditPassRate(Math.round((passed / audits.length) * 100));
        }
      }
    } catch(e) {}
  }, []);

  // Aggregated Data for KPIs
  const kpis = useMemo(() => {
    if (inspections.length === 0) return { dhu: 0, rft: 0, totalChecked: 0, totalGoods: 0, totalDefects: 0 };
    
    let totalChecked = 0;
    let totalGoods = 0;
    let totalDefects = 0;

    inspections.forEach(insp => {
      totalChecked += insp.checkedQuantity || 0;
      totalGoods += insp.goodsQuantity || 0;
      totalDefects += insp.totalDefects || 0;
    });

    const dhu = totalChecked > 0 ? (totalDefects / totalChecked) * 100 : 0;
    const rft = totalChecked > 0 ? (totalGoods / totalChecked) * 100 : 0;

    return { dhu, rft, totalChecked, totalGoods, totalDefects };
  }, [inspections]);

  // DHU Trend Data (Grouped by Date/Week)
  const dhuTrendData = useMemo(() => {
    const grouped: Record<string, { totalChecked: number, totalDefects: number }> = {};
    
    // Sort inspections by date ascending for the chart
    const sorted = [...inspections].sort((a, b) => a.date.localeCompare(b.date));
    
    sorted.forEach(insp => {
      const date = insp.date;
      if (!grouped[date]) grouped[date] = { totalChecked: 0, totalDefects: 0 };
      grouped[date].totalChecked += insp.checkedQuantity || 0;
      grouped[date].totalDefects += insp.totalDefects || 0;
    });

    return Object.entries(grouped).map(([date, vals]) => ({
      name: date.split('-').slice(1).join('/'), // MM/DD format
      actual: Number((vals.totalChecked > 0 ? (vals.totalDefects / vals.totalChecked) * 100 : 0).toFixed(2)),
      target: 3.0
    })).slice(-12); // Last 12 entries
  }, [inspections]);

  // Top Defects Data
  const defectChartData = useMemo(() => {
    const defectCounts: Record<string, number> = {};
    inspections.forEach(insp => {
      (insp.topDefects || []).forEach(d => {
        defectCounts[d.name] = (defectCounts[d.name] || 0) + (d.count || 1);
      });
    });

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return Object.entries(defectCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }));
  }, [inspections]);

  // Line Performance Data
  const linePerfData = useMemo(() => {
    const lineData: Record<string, { totalChecked: number, totalGoods: number, totalDefects: number }> = {};
    inspections.forEach(insp => {
      const line = insp.lineNumber || 'Unknown';
      if (!lineData[line]) lineData[line] = { totalChecked: 0, totalGoods: 0, totalDefects: 0 };
      lineData[line].totalChecked += insp.checkedQuantity || 0;
      lineData[line].totalGoods += insp.goodsQuantity || 0;
      lineData[line].totalDefects += insp.totalDefects || 0;
    });

    return Object.entries(lineData).map(([name, vals]) => ({
      name,
      dhu: Number((vals.totalChecked > 0 ? (vals.totalDefects / vals.totalChecked) * 100 : 0).toFixed(2)),
      rft: Number((vals.totalChecked > 0 ? (vals.totalGoods / vals.totalChecked) * 100 : 0).toFixed(2))
    })).slice(0, 7);
  }, [inspections]);

  let capaClosureRate = 100;
  if (capas.length > 0) {
    const closed = capas.filter(c => c.status === 'Closed').length;
    capaClosureRate = Math.round((closed / capas.length) * 100);
  }

  const radarData = [
    { subject: 'DHU', A: Math.min(100, (kpis.dhu / 3) * 100), B: 100, fullMark: 100 },
    { subject: 'RFT', A: kpis.rft, B: 100, fullMark: 100 },
    { subject: 'Audit Pass', A: auditPassRate, B: 100, fullMark: 100 },
    { subject: 'CAPA Closure', A: capaClosureRate, B: 100, fullMark: 100 },
    { subject: 'Training', A: 80, B: 100, fullMark: 100 },
  ];

  const expiringCerts = certificates.filter(c => {
    const days = getDaysUntilExpiry(c.expiryDate);
    return days <= 30 && days > 0;
  });

  const expiredCerts = certificates.filter(c => getDaysUntilExpiry(c.expiryDate) <= 0);

  return (
    <motion.div 
      className="page active space-y-6 w-full p-4 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Live Dashboard</h2>
      </motion.div>

      {/* Certificate Alerts */}
      {(expiringCerts.length > 0 || expiredCerts.length > 0) && (
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          {expiredCerts.map(cert => (
            <div key={cert.id} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-red-800 font-semibold text-sm">Certificate Expired</h4>
                <p className="text-red-700 text-sm mt-1">The certificate <strong>{cert.name}</strong> ({cert.number}) expired on {cert.expiryDate}. Please renew immediately.</p>
              </div>
            </div>
          ))}
          {expiringCerts.map(cert => (
            <div key={cert.id} className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-800 font-semibold text-sm">Certificate Expiring Soon</h4>
                <p className="text-amber-700 text-sm mt-1">The certificate <strong>{cert.name}</strong> ({cert.number}) will expire in {getDaysUntilExpiry(cert.expiryDate)} days ({cert.expiryDate}).</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Top KPIs */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div variants={itemVariants} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total DHU</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Activity className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.dhu.toFixed(2)}%</div>
          <div className="text-xs text-gray-500">Real-time aggregation</div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">RFT %</span>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.rft.toFixed(1)}%</div>
          <div className="text-xs text-gray-500">Quality pass rate</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Checked</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Package className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.totalChecked}</div>
          <div className="text-xs text-gray-500">Units inspected</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Defects</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertTriangle className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{kpis.totalDefects}</div>
          <div className="text-xs text-gray-500">Issues identified</div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onNavigate?.('doc-control')}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Document Control</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Archive className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{documentsCount}</div>
          <div className="text-xs text-gray-500">Active QMS documents</div>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onNavigate?.('procedure')}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Procedures</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Files className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{proceduresCount}</div>
          <div className="text-xs text-gray-500">Documented SOPs</div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Audit Pass Rate</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ClipboardCheck className="w-4 h-4" /></div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{auditPassRate}%</div>
          <div className="text-xs text-gray-500">Historical performance</div>
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DHU Trend */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><TrendingDown className="w-5 h-5 text-blue-500" /> DHU Trend</h3>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Target &lt;3%</span>
              <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">Current: {kpis.dhu.toFixed(2)}%</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dhuTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', color: '#111827', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#4b5563', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="actual" name="DHU%" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Line type="step" dataKey="target" name="Target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top 5 Defects */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6"><AlertCircle className="w-5 h-5 text-amber-500" /> Top 5 Defects</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={defectChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                  {defectChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', color: '#111827', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 12, color: '#4b5563' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Line Performance */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6"><Factory className="w-5 h-5 text-indigo-500" /> Line-Wise Performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={linePerfData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis yAxisId="left" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', color: '#111827', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f3f4f6' }} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#4b5563', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="dhu" name="DHU%" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar yAxisId="right" dataKey="rft" name="RFT%" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Inspection Status */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6"><Search className="w-5 h-5 text-teal-500" /> Inspection Status</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-1.5 text-sm font-medium"><span className="text-gray-700">Inline Pass</span><span className="text-green-600">82%</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: '82%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5 text-sm font-medium"><span className="text-gray-700">Endline Pass</span><span className="text-green-600">91%</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: '91%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5 text-sm font-medium"><span className="text-gray-700">Final Pass</span><span className="text-amber-600">78%</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '78%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5 text-sm font-medium"><span className="text-gray-700">Pre-Final Pass</span><span className="text-green-600">88%</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: '88%' }}></div></div>
            </div>
          </div>
        </motion.div>

        {/* Certification Status */}
        <motion.div variants={itemVariants} className="bg-bg-1/50 backdrop-blur-md rounded-xl border border-border-main shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-text-1 flex items-center gap-2 mb-6"><Award className="w-5 h-5 text-purple-500" /> Cert Status</h3>
          <div className="space-y-4">
            {certificates.length > 0 ? certificates.slice(0, 5).map(cert => {
              const daysLeft = getDaysUntilExpiry(cert.expiryDate);
              const isExpiringSoon = daysLeft > 0 && daysLeft <= 30;
              const isExpired = daysLeft <= 0;
              
              let badgeClass = "bg-green-500/10 text-green-500";
              let badgeText = "Valid";
              
              if (isExpired) {
                badgeClass = "bg-red-500/10 text-red-500";
                badgeText = "Expired";
              } else if (isExpiringSoon) {
                badgeClass = "bg-amber-500/10 text-amber-500";
                badgeText = "Expiring";
              }

              return (
                <div key={cert.id} className="flex justify-between items-center pb-3 border-b border-border-main last:border-0 last:pb-0">
                  <span className="text-sm font-medium text-text-2 truncate pr-2" title={cert.name}>{cert.name}</span>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex-shrink-0 ${badgeClass}`}>{badgeText}</span>
                </div>
              );
            }) : (
              <div className="text-text-3 text-sm">No certificates found.</div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Training & CAPA */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Status */}
        <motion.div variants={itemVariants} className="bg-bg-1/50 backdrop-blur-md rounded-xl border border-border-main shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-text-1 flex items-center gap-2 mb-6"><GraduationCap className="w-5 h-5 text-pink-500" /> Training Status</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-bg-2 text-text-2 border-b border-border-main">
                <tr>
                  <th className="px-4 py-3 font-semibold">Department</th>
                  <th className="px-4 py-3 font-semibold text-center">Planned</th>
                  <th className="px-4 py-3 font-semibold text-center">Done</th>
                  <th className="px-4 py-3 font-semibold text-right">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                <tr className="hover:bg-bg-2/50">
                  <td className="px-4 py-3 font-medium text-text-1">Sewing</td>
                  <td className="px-4 py-3 text-center text-text-2">12</td>
                  <td className="px-4 py-3 text-center text-text-2">10</td>
                  <td className="px-4 py-3 text-right font-medium text-green-500">83%</td>
                </tr>
                <tr className="hover:bg-bg-2/50">
                  <td className="px-4 py-3 font-medium text-text-1">Cutting</td>
                  <td className="px-4 py-3 text-center text-text-2">8</td>
                  <td className="px-4 py-3 text-center text-text-2">8</td>
                  <td className="px-4 py-3 text-right font-medium text-green-500">100%</td>
                </tr>
                <tr className="hover:bg-bg-2/50">
                  <td className="px-4 py-3 font-medium text-text-1">Finishing</td>
                  <td className="px-4 py-3 text-center text-text-2">6</td>
                  <td className="px-4 py-3 text-center text-text-2">4</td>
                  <td className="px-4 py-3 text-right font-medium text-amber-500">67%</td>
                </tr>
                <tr className="hover:bg-bg-2/50">
                  <td className="px-4 py-3 font-medium text-text-1">QC Dept</td>
                  <td className="px-4 py-3 text-center text-text-2">10</td>
                  <td className="px-4 py-3 text-center text-text-2">9</td>
                  <td className="px-4 py-3 text-right font-medium text-green-500">90%</td>
                </tr>
                <tr className="hover:bg-bg-2/50">
                  <td className="px-4 py-3 font-medium text-text-1">IE/IE Tech</td>
                  <td className="px-4 py-3 text-center text-text-2">4</td>
                  <td className="px-4 py-3 text-center text-text-2">2</td>
                  <td className="px-4 py-3 text-right font-medium text-red-500">50%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* CAPA Summary */}
        <motion.div variants={itemVariants} className="bg-bg-1/50 backdrop-blur-md rounded-xl border border-border-main shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-text-1 flex items-center gap-2 mb-6"><Wrench className="w-5 h-5 text-orange-500" /> CAPA Summary</h3>
          <div className="space-y-6 pl-4 border-l-2 border-border-main">
            {capas.length > 0 ? capas.map(capa => (
              <div key={capa.id} className="relative">
                <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-bg-0 ${
                  capa.status === 'Closed' ? 'bg-green-500' : 
                  capa.status === 'Overdue' ? 'bg-red-500' : 
                  capa.status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'
                }`}></div>
                <div className="font-medium text-text-1 text-sm mb-1">{capa.nc}</div>
                <div className="text-xs text-text-3">
                  {capa.status === 'Closed' ? 'Closed' : `Deadline: ${capa.deadline}`} &middot; Responsible: {capa.responsible}
                </div>
              </div>
            )) : (
              <div className="text-text-3 text-sm">No recent CAPA records found.</div>
            )}
          </div>
        </motion.div>

        {/* KPI vs Target */}
        <motion.div variants={itemVariants} className="bg-bg-1/50 backdrop-blur-md rounded-xl border border-border-main shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-text-1 flex items-center gap-2 mb-6"><Target className="w-5 h-5 text-red-500" /> KPI vs Target</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-3)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Actual" dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} />
                <Radar name="Target" dataKey="B" stroke="var(--amber)" strokeDasharray="4 4" fill="var(--amber)" fillOpacity={0.1} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-1)', borderColor: 'var(--border)', color: 'var(--text-1)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export { Dashboard };
