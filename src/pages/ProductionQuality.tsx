import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductionQualityCharts } from '../components/ProductionQualityCharts';
import { ExportModal } from '../components/ExportModal';
import * as XLSX from 'xlsx';
import { 
  Search, Plus, Trash2, Edit, Download, Filter, 
  BarChart3, CheckCircle2, XCircle, AlertTriangle, 
  X, Upload, Settings, List, Activity, Eye, FileDown,
  Layers, Factory, Scissors, User, Calendar
} from 'lucide-react';
import { InspectionRecord } from '../types';
import { getProductionQualityRecords, saveProductionQualityRecords } from '../utils/qualityUtils';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export function ProductionQuality({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [activeTab, setActiveTab] = useState<'detailed' | 'manage'>('detailed');
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  // Manage Options (Persisted in localStorage)
  const [units, setUnits] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [lines, setLines] = useState<string[]>([]);
  const [newOption, setNewOption] = useState({ type: 'unit', value: '' });

  useEffect(() => {
    const u = localStorage.getItem('garmentqms_config_units');
    const s = localStorage.getItem('garmentqms_config_sections');
    const l = localStorage.getItem('garmentqms_config_lines');
    
    if (u) setUnits(JSON.parse(u));
    else setUnits(['Unit-1', 'Unit-2', 'Unit-3', 'Unit-4', 'Unit-5']);

    if (s) setSections(JSON.parse(s));
    else setSections(['Sewing', 'Finishing', 'Cutting', 'Packing']);

    if (l) setLines(JSON.parse(l));
    else setLines(['Line-1', 'Line-2', 'Line-3', 'Line-4', 'Line-5', 'Line-6', 'Line-7', 'Line-8', 'Line-9', 'Line-10']);

    setInspections(getProductionQualityRecords());
  }, []);

  const saveConfig = (type: string, data: string[]) => {
    localStorage.setItem(`garmentqms_config_${type}s`, JSON.stringify(data));
    if (type === 'unit') setUnits(data);
    if (type === 'section') setSections(data);
    if (type === 'line') setLines(data);
  };

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnit, setFilterUnit] = useState('All');
  const [filterShift, setFilterShift] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Derived Data
  const filteredInspections = useMemo(() => {
    return inspections.filter(i => {
      if (activeTab === 'manage') return true;
      
      const matchesSearch = 
        (i.lineNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.buyer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.style || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesUnit = filterUnit === 'All' || i.unit === filterUnit;
      const matchesShift = filterShift === 'All' || i.shift === filterShift;
      const matchesDate = (!startDate || i.date >= startDate) && (!endDate || i.date <= endDate);

      return matchesSearch && matchesUnit && matchesShift && matchesDate;
    });
  }, [inspections, activeTab, searchQuery, filterUnit, filterShift, startDate, endDate]);

  const metrics = useMemo(() => {
    const totalChecked = filteredInspections.reduce((sum, i) => sum + (i.checkedQuantity || 0), 0);
    const totalGoods = filteredInspections.reduce((sum, i) => sum + (i.goodsQuantity || 0), 0);
    const totalDefects = filteredInspections.reduce((sum, i) => sum + (i.totalDefects || 0), 0);
    
    const overallRft = totalChecked > 0 ? ((totalGoods / totalChecked) * 100).toFixed(2) : '0.00';
    const overallDhu = totalChecked > 0 ? ((totalDefects / totalChecked) * 100).toFixed(2) : '0.00';
    
    return { totalChecked, totalGoods, totalDefects, overallRft, overallDhu };
  }, [filteredInspections]);

  const { chartData, pieData } = useMemo(() => {
    const dataByLine: Record<string, any> = {};
    let totalPass = 0;
    let totalDefect = 0;

    filteredInspections.forEach(i => {
      if (activeTab === 'manage') return;
      if (!dataByLine[i.lineNumber]) {
        dataByLine[i.lineNumber] = { name: i.lineNumber, checked: 0, defects: 0, dhu: 0 };
      }
      dataByLine[i.lineNumber].checked += i.checkedQuantity;
      dataByLine[i.lineNumber].defects += i.totalDefects;
      
      totalPass += i.goodsQuantity;
      totalDefect += i.totalDefects;
    });

    const cData = Object.values(dataByLine).map(d => ({
      ...d,
      dhu: d.checked > 0 ? Number(((d.defects / d.checked) * 100).toFixed(2)) : 0
    }));

    const pData = [
      { name: 'Pass', value: totalPass },
      { name: 'Defect', value: totalDefect }
    ];

    return { chartData: cData, pieData: pData };
  }, [filteredInspections, activeTab]);

  const COLORS = ['#10b981', '#ef4444'];

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updated = inspections.filter(i => i.id !== id);
      setInspections(updated);
      saveProductionQualityRecords(updated);
    }
  };

  const handleNavigateToForm = (mode: 'create' | 'edit' | 'view', data?: any, recordType: 'detailed'|'quick' = 'detailed') => {
    onNavigate('prod-quality-form', { mode, data, recordType });
  };

  const exportPDF = async (record: InspectionRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const {
      createDoc, drawPdfHeader, drawInfoGrid, drawSectionLabel,
      proTable, embedAttachments, addPageFooters, drawSignatureRow
    } = await import('../utils/pdfExport');

    const rft = record.checkedQuantity > 0 ? ((record.goodsQuantity / record.checkedQuantity) * 100).toFixed(1) : '0';
    const dhu = record.checkedQuantity > 0 ? ((record.totalDefects / record.checkedQuantity) * 100).toFixed(1) : '0';

    const doc = createDoc({ orientation: 'p', paperSize: 'a4' });
    let y = drawPdfHeader(doc, 'Production Quality Report', `Line: ${record.lineNumber} | ${record.date}`);

    y = drawInfoGrid(doc, y, [
      { label: 'Date',    value: record.date },
      { label: 'Shift',   value: record.shift },
      { label: 'Unit',    value: record.unit },
      { label: 'Section', value: record.section },
      { label: 'Line',    value: record.lineNumber },
      { label: 'Style',   value: record.style || '—' },
      { label: 'Buyer',   value: record.buyer || '—' },
      { label: 'Operator',value: record.operatorId || '—' },
    ]);

    y = drawSectionLabel(doc, y, 'Quality Metrics');
    y = proTable(doc, y,
      [['Metric', 'Value']],
      [
        ['Checked Quantity', String(record.checkedQuantity)],
        ['Goods Passed',     String(record.goodsQuantity)],
        ['Total Defects',    String(record.totalDefects)],
        ['RFT %',           `${rft}%`],
        ['DHU %',           `${dhu}%`],
        ['Standard DHU',    `${record.standardDhu || 5}%`],
        ['Status', Number(dhu) > (record.standardDhu || 5) ? 'TARGET MISSED' : 'ON TARGET'],
      ],
      { columnStyles: { 0: { cellWidth: 80, fontStyle: 'bold' } } }
    ) + 6;

    if (record.topDefects && record.topDefects.length > 0) {
      y = drawSectionLabel(doc, y, 'Top Defects');
      y = proTable(doc, y,
        [['#', 'Defect Name', 'Count']],
        record.topDefects.map((d: any, i: number) => [String(i + 1), d.name || d, String(d.count || '')])
      ) + 6;
    }

    drawSignatureRow(doc, y, ['Line Supervisor', 'QC Inspector', 'QA Manager']);

    if (record.attachments && record.attachments.length > 0) {
      await embedAttachments(doc, record.attachments, 'QUALITY EVIDENCE PHOTOS');
    }

    addPageFooters(doc);
    doc.save(`Quality_${record.lineNumber}_${record.date}.pdf`);
  };


  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        const newInspections = (data as any[]).map(row => ({
          ...row,
          id: `PQ-${Math.random().toString(36).substr(2, 9)}`,
          source: 'detailed',
          topDefects: [],
          uid: 'mock' // For offline testing, ensure uid exists
        }));
        const updated = [...newInspections, ...inspections];
        setInspections(updated);
        saveProductionQualityRecords(updated);
        alert(`Successfully uploaded ${data.length} records.`);
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <Activity className="w-8 h-8 text-accent" />
            Production Quality
          </h1>
          <p className="text-text-2 text-base mt-2">Track line-wise DHU, RFT, and production metrics.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="btn btn-ghost flex items-center gap-2 cursor-pointer shadow-sm border border-border-main text-text-2">
            <Upload className="w-4 h-4" /> CSV Upload
            <input type="file" accept=".csv, .xlsx" className="hidden" onChange={handleBulkUpload} />
          </label>
          <button className="btn btn-ghost flex items-center gap-2 border border-border-main text-text-2 shadow-sm" onClick={() => setIsExportModalOpen(true)}>
            <Download className="w-4 h-4" /> Global Export
          </button>
          <button className="btn btn-primary flex items-center gap-2 shadow-md" onClick={() => handleNavigateToForm('create', null, 'detailed')}>
            <Plus className="w-4 h-4" /> Add Record
          </button>
        </div>
      </div>

      {activeTab !== 'manage' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Total Checked', value: metrics.totalChecked, icon: Layers, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Total Defects', value: metrics.totalDefects, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
            { label: 'Overall RFT', value: `${metrics.overallRft}%`, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: 'Overall DHU', value: `${metrics.overallDhu}%`, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-main overflow-x-auto no-scrollbar">
        {[
          { id: 'detailed', label: 'Quality Logs', icon: List },
          { id: 'manage', label: 'Operational Config', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors relative ${
              activeTab === tab.id ? 'text-accent' : 'text-text-2 hover:text-text-1'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
        
        {(activeTab === 'detailed') && (
          <>
            {activeTab === 'detailed' && chartData?.length > 0 && (
              <motion.div variants={itemVariants}>
                <ProductionQualityCharts chartData={chartData} pieData={pieData} COLORS={COLORS} />
              </motion.div>
            )}

            {/* Toolbar */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 bg-bg-1 p-3 rounded-2xl border border-border-main shadow-sm">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-2" />
                <input 
                  type="text" 
                  placeholder="Search by Line, Buyer, or Style..." 
                  className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
              </div>
              <div className="w-px h-8 bg-border-main hidden md:block"></div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <select className="w-full md:w-32 bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)}>
                  <option value="All">All Units</option>
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <select className="w-full md:w-32 bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterShift} onChange={(e) => setFilterShift(e.target.value)}>
                  <option value="All">All Shifts</option>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                </select>
                <div className="flex items-center gap-2 bg-bg-2 px-3 py-1.5 rounded-xl flex-1 md:flex-none">
                  <Calendar className="w-4 h-4 text-text-2" />
                  <input type="date" className="bg-transparent border-none text-sm text-text-1 outline-none w-full md:w-auto" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  <span className="text-text-2 text-sm px-1">-</span>
                  <input type="date" className="bg-transparent border-none text-sm text-text-1 outline-none w-full md:w-auto" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
            </motion.div>

            {/* Data Table */}
            <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-bg-2/50 border-b border-border-main text-xs uppercase tracking-wider text-text-2 font-semibold">
                      <th className="p-4">Date</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Style / Order</th>
                      <th className="p-4 text-right">Checked</th>
                      <th className="p-4 text-right">Goods</th>
                      <th className="p-4 text-right">Defects</th>
                      <th className="p-4 text-right">RFT %</th>
                      <th className="p-4 text-right">DHU %</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-main">
                    <AnimatePresence>
                      {filteredInspections.length === 0 ? (
                        <motion.tr>
                          <td colSpan={10} className="p-12 text-center text-text-2">
                            <div className="flex flex-col items-center justify-center gap-3">
                              <Search className="w-8 h-8 opacity-20" />
                              <p className="font-semibold text-lg text-text-1">No production audits found</p>
                              <p className="text-sm">Try adjusting your date range or filters.</p>
                            </div>
                          </td>
                        </motion.tr>
                      ) : filteredInspections.map(row => {
                        const rft = row.checkedQuantity > 0 ? ((row.goodsQuantity / row.checkedQuantity) * 100).toFixed(1) : '0.0';
                        const dhu = row.checkedQuantity > 0 ? ((row.totalDefects / row.checkedQuantity) * 100).toFixed(1) : '0.0';
                        const isDhuHigh = Number(dhu) > (row.standardDhu || 5);

                        return (
                          <motion.tr 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout
                            key={row.id} 
                            className="hover:bg-bg-2/50 transition-colors cursor-pointer group" 
                            onClick={() => handleNavigateToForm('view', row)}
                          >
                            <td className="p-4 text-sm text-text-1 whitespace-nowrap font-medium">{row.date}</td>
                            <td className="p-4">
                              <div className="font-bold text-text-1 group-hover:text-accent transition-colors">{row.lineNumber}</div>
                              <div className="text-xs text-text-3 font-medium mt-0.5">{row.unit} • {row.section}</div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-text-1">{row.style || '-'}</div>
                              <div className="text-xs text-text-3 font-medium mt-0.5">{row.buyer || '-'}</div>
                            </td>
                            <td className="p-4 text-right font-mono text-text-1">{row.checkedQuantity}</td>
                            <td className="p-4 text-right font-mono text-green-500">{row.goodsQuantity}</td>
                            <td className="p-4 text-right font-mono text-red-500">{row.totalDefects}</td>
                            <td className="p-4 text-right font-mono font-bold text-green-500">{rft}%</td>
                            <td className="p-4 text-right font-mono font-bold">
                              <span className={isDhuHigh ? 'text-red-500' : 'text-amber-500'}>{dhu}%</span>
                            </td>
                            <td className="p-4 text-center">
                              {isDhuHigh ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">TARGET MISSED</span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">ON TARGET</span>
                              )}
                            </td>
                            <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1">
                                <button className="p-2 text-text-2 hover:bg-accent/10 hover:text-accent rounded-lg transition-all" title="View Details" onClick={() => handleNavigateToForm('view', row)}>
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-text-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-lg transition-all" title="Edit" onClick={() => handleNavigateToForm('edit', row)}>
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-text-2 hover:bg-indigo-500/10 hover:text-indigo-500 rounded-lg transition-all" title="Download Report" onClick={(e) => exportPDF(row, e)}>
                                  <FileDown className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-text-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all" title="Delete" onClick={(e) => handleDelete(row.id, e)}>
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}

        {/* Configuration Management Tab */}
        {activeTab === 'manage' && (
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { type: 'unit', title: 'Units', data: units, setter: setUnits, icon: Factory },
              { type: 'section', title: 'Sections', data: sections, setter: setSections, icon: Scissors },
              { type: 'line', title: 'Lines', data: lines, setter: setLines, icon: Layers }
            ].map(config => (
              <div key={config.type} className="bg-bg-1 border border-border-main rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-bg-2 rounded-lg text-accent"><config.icon className="w-5 h-5" /></div>
                  <h3 className="text-lg font-bold text-text-1">{config.title}</h3>
                </div>
                <div className="flex gap-2 mb-4">
                  <input 
                    className="form-control flex-1 bg-bg-2 outline-none border-none focus:ring-1 focus:ring-accent rounded-xl text-sm px-4 py-2" 
                    placeholder={`Add new ${config.type}...`}
                    value={newOption.type === config.type ? newOption.value : ''}
                    onChange={e => setNewOption({ type: config.type, value: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newOption.value) {
                        config.setter([...config.data, newOption.value]);
                        setNewOption({ type: 'unit', value: '' });
                      }
                    }}
                  />
                    <button className="btn btn-primary px-4 shadow-sm" onClick={() => {
                    if (!newOption.value) return;
                    saveConfig(config.type, [...config.data, newOption.value]);
                    setNewOption({ type: config.type, value: '' });
                  }}>Add</button>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {config.data.map(item => (
                    <div key={item} className="flex items-center justify-between p-3 bg-bg-2 rounded-xl border border-border-main group">
                      <span className="font-medium text-text-1 text-sm">{item}</span>
                      <button 
                        className="text-text-2 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-red-500/10 rounded-md"
                        onClick={() => saveConfig(config.type, config.data.filter(i => i !== item))}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        data={filteredInspections}
        columns={[
          {key: 'id', label: 'ID'},
          {key: 'date', label: 'Date'},
          {key: 'lineNumber', label: 'Line'},
          {key: 'buyer', label: 'Buyer'},
          {key: 'style', label: 'Style'},
          {key: 'checkedQuantity', label: 'Checked'},
          {key: 'totalDefects', label: 'Defects'}
        ]}
        title="Production Quality Data Dump"
      />
    </motion.div>
  );
}



