import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { ExportModal } from '../components/ExportModal';
import jsPDF from 'jspdf';
import { motion } from 'motion/react';
import { CAPARecord, CertificateRecord } from '../types';
import { autoGenerateCAPA } from '../utils/capaUtils';
import { getCertificates, saveCertificates, checkCertificateStatus, getDaysUntilExpiry } from '../utils/certificateUtils';

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

function KPIManagement() {
  return (
    <div className="page active p-4 md:p-8">
      <div className="sec-head">
        <div><div className="sec-title">📊 KPI Management</div><div className="sec-sub">Target vs Actual · Factory & Line KPIs</div></div>
        <button className="btn btn-primary">+ Add KPI</button>
      </div>
      <div className="g4 mb-3">
        <div className="kpi-card cyan"><div className="kpi-label">DHU Target</div><div className="kpi-value cyan">&lt;3.0%</div><div className="kpi-sub">Actual: <span className="text-green">2.84%</span> ✓</div></div>
        <div className="kpi-card green"><div className="kpi-label">RFT Target</div><div className="kpi-value green">&gt;95%</div><div className="kpi-sub">Actual: <span className="text-green">96.4%</span> ✓</div></div>
        <div className="kpi-card amber"><div className="kpi-label">Audit Pass</div><div className="kpi-value amber">&gt;90%</div><div className="kpi-sub">Actual: <span className="text-red">89%</span> ✗</div></div>
        <div className="kpi-card red"><div className="kpi-label">Complaint Rate</div><div className="kpi-value red">&lt;0.5%</div><div className="kpi-sub">Actual: <span className="text-green">0.3%</span> ✓</div></div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Line Quality KPI</div></div>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Line</th><th>DHU%</th><th>RFT%</th><th>Alteration%</th><th>Rejection%</th><th>Supervisor</th><th>Score</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Line 1</td><td className="text-green">2.67</td><td className="text-green">97.1</td><td>1.5</td><td>0.2</td><td>Rahim</td><td className="text-green">92/100</td><td><span className="badge badge-green">A Grade</span></td></tr>
              <tr><td>Line 2</td><td className="text-green">2.20</td><td className="text-green">98.0</td><td>1.2</td><td>0.1</td><td>Karim</td><td className="text-green">95/100</td><td><span className="badge badge-green">A Grade</span></td></tr>
              <tr><td>Line 3</td><td className="text-red">4.74</td><td className="text-red">93.8</td><td>3.8</td><td>0.8</td><td>Jamal</td><td className="text-red">61/100</td><td><span className="badge badge-red">C Grade</span></td></tr>
              <tr><td>Line 4</td><td className="text-amber">3.33</td><td className="text-amber">94.5</td><td>2.9</td><td>0.5</td><td>Rashed</td><td className="text-amber">74/100</td><td><span className="badge badge-amber">B Grade</span></td></tr>
              <tr><td>Line 7</td><td className="text-green">1.20</td><td className="text-green">98.8</td><td>0.9</td><td>0.1</td><td>Hasan</td><td className="text-green">98/100</td><td><span className="badge badge-green">A+ Grade</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// CAPA is now moved to its own file src/pages/CAPA.tsx





function Goals() {
  return (
    <div className="page active p-4 md:p-8">
      <div className="sec-head">
        <div><div className="sec-title">🎯 Quality Goals & Objectives</div><div className="sec-sub">Annual · Department-wise</div></div>
        <button className="btn btn-primary">+ Add Goal</button>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>#</th><th>Goal</th><th>Department</th><th>Target</th><th>Current</th><th>Responsible</th><th>Deadline</th><th>Achievement</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Reduce Factory DHU</td><td>All Lines</td><td>&lt;2.5%</td><td>2.84%</td><td>QM Karim</td><td>Dec 2025</td><td><div className="progress" style={{width:'80px'}}><div className="progress-bar amber" style={{width:'60%'}}></div></div></td><td><span className="badge badge-amber">In Progress</span></td></tr>
            <tr><td>2</td><td>Improve RFT to 98%</td><td>Sewing</td><td>98%</td><td>96.4%</td><td>Prod. Manager</td><td>Jun 2025</td><td><div className="progress" style={{width:'80px'}}><div className="progress-bar green" style={{width:'70%'}}></div></div></td><td><span className="badge badge-amber">In Progress</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Certification component is now moved to its own file src/pages/Certification.tsx

function BuyerSummary() {
  const buyerData = [
    { name: 'H&M', dhu: 2.4, rft: 97.1 },
    { name: 'Zara', dhu: 3.8, rft: 94.2 },
    { name: 'Walmart', dhu: 1.9, rft: 98.0 },
    { name: 'Nike', dhu: 2.1, rft: 97.5 },
    { name: 'Target', dhu: 2.7, rft: 96.8 },
  ];

  return (
    <div className="page active p-4 md:p-8">
      <div className="sec-head">
        <div><div className="sec-title">🛍️ Buyer Summary</div><div className="sec-sub">Quality Performance by Buyer</div></div>
      </div>
      <div className="g2 mb-3">
        <div className="card">
          <div className="card-header"><div className="card-title">Buyer Quality Performance</div></div>
          <div className="chart-box tall">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buyerData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f3050" vertical={false} />
                <XAxis dataKey="name" stroke="#4d6880" tick={{ fill: '#4d6880', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <YAxis yAxisId="left" stroke="#4d6880" tick={{ fill: '#4d6880', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#4d6880" tick={{ fill: '#4d6880', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <Tooltip contentStyle={{ backgroundColor: '#131a23', borderColor: '#1f3050', color: '#e2ecf7' }} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: '#8ba3be' }} />
                <Bar yAxisId="left" dataKey="dhu" name="DHU%" fill="#ff3d5a" radius={[2, 2, 0, 0]} />
                <Bar yAxisId="right" dataKey="rft" name="RFT%" fill="#00e676" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Buyer Summary Table</div></div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Buyer</th><th>Orders</th><th>Qty</th><th>DHU%</th><th>RFT%</th><th>Complaints</th><th>Audit</th><th>Rating</th></tr></thead>
              <tbody>
                <tr><td>H&M</td><td>12</td><td>62,000</td><td className="text-green">2.4</td><td className="text-green">97.1</td><td>1</td><td><span className="badge badge-green">Pass</span></td><td className="text-green">A</td></tr>
                <tr><td>Zara</td><td>8</td><td>38,500</td><td className="text-amber">3.8</td><td className="text-amber">94.2</td><td>2</td><td><span className="badge badge-amber">Watch</span></td><td className="text-amber">B</td></tr>
                <tr><td>Walmart</td><td>6</td><td>45,000</td><td className="text-green">1.9</td><td className="text-green">98.0</td><td>0</td><td><span className="badge badge-green">Pass</span></td><td className="text-green">A+</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Reports() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const months = [
    { date: '2025-10-01', name: 'Oct', dhu: 2.91, rft: 95.8 },
    { date: '2025-11-01', name: 'Nov', dhu: 2.78, rft: 96.2 },
    { date: '2025-12-01', name: 'Dec', dhu: 3.12, rft: 94.1 },
    { date: '2026-01-01', name: 'Jan', dhu: 2.95, rft: 95.5 },
    { date: '2026-02-01', name: 'Feb', dhu: 2.88, rft: 96.0 },
    { date: '2026-03-01', name: 'Mar', dhu: 2.84, rft: 96.4 },
  ];

  const capaData = [
    { name: 'Closed', value: 24, color: '#00e676' },
    { name: 'In Progress', value: 4, color: '#00d4ff' },
    { name: 'Open', value: 4, color: '#ffaa00' },
    { name: 'Overdue', value: 3, color: '#ff3d5a' },
  ];

  return (
    <div className="page active p-4 md:p-8">
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        data={months}
        columns={[{key: 'name', label: 'Month'}, {key: 'dhu', label: 'DHU%'}, {key: 'rft', label: 'RFT%'}]}
        title="Quality Performance Report"
      />
      <div className="sec-head">
        <div><div className="sec-title">📈 Reports & Analytics</div><div className="sec-sub">Factory-wide Quality Performance</div></div>
        <div className="flex gap-2">
          <select className="form-control" style={{width:'120px'}}><option>Apr 2025</option><option>Mar 2025</option><option>Q1 2025</option></select>
          <button className="btn btn-primary" onClick={() => setIsExportModalOpen(true)}>⬇ Export Data</button>
        </div>
      </div>
      <div className="g3 mb-3">
        <div className="card">
          <div className="card-header"><div className="card-title">DHU Report</div></div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={months} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f3050" vertical={false} />
                <XAxis dataKey="name" stroke="#4d6880" tick={{ fill: '#4d6880', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <YAxis stroke="#4d6880" tick={{ fill: '#4d6880', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <Tooltip contentStyle={{ backgroundColor: '#131a23', borderColor: '#1f3050', color: '#e2ecf7' }} />
                <Line type="monotone" dataKey="dhu" name="DHU%" stroke="#00d4ff" strokeWidth={2} fill="rgba(0,212,255,.08)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">RFT Trend</div></div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={months} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f3050" vertical={false} />
                <XAxis dataKey="name" stroke="#4d6880" tick={{ fill: '#4d6880', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <YAxis stroke="#4d6880" tick={{ fill: '#4d6880', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                <Tooltip contentStyle={{ backgroundColor: '#131a23', borderColor: '#1f3050', color: '#e2ecf7' }} />
                <Line type="monotone" dataKey="rft" name="RFT%" stroke="#00e676" strokeWidth={2} fill="rgba(0,230,118,.08)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">CAPA Status</div></div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={capaData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {capaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#131a23', borderColor: '#1f3050', color: '#e2ecf7' }} />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: '#8ba3be' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function Calibration() {
  const [machines, setMachines] = useState([
    { id: 'MCH-001', name: 'Juki Single Needle', category: 'machine', calDate: '2025-01-15', nextCalDate: '2026-01-15', responsible: 'John Doe', certificates: ['cert_001.pdf'], history: [{ date: '2024-01-15', result: 'Pass', cert: 'cert_old1.pdf' }] },
    { id: 'MCH-002', name: 'Brother Overlock', category: 'machine', calDate: '2025-02-20', nextCalDate: '2026-02-20', responsible: 'Jane Smith', certificates: ['cert_002.pdf'], history: [] },
    { id: 'MCH-003', name: 'Kansai Special', category: 'machine', calDate: '2024-11-10', nextCalDate: '2025-11-10', responsible: 'Mike Johnson', certificates: [], history: [] },
    { id: 'MCH-004', name: 'Pegasus Coverstitch', category: 'machine', calDate: '2025-04-15', nextCalDate: '2026-04-15', responsible: 'Alice Brown', certificates: [], history: [] },
    { id: 'TAP-001', name: 'Measuring Tape 150cm', category: 'tape', calDate: '2025-03-01', nextCalDate: '2025-09-01', responsible: 'QC Alice', certificates: ['tape_cert.pdf'], history: [{ date: '2024-09-01', result: 'Pass', cert: 'tape_old.pdf' }] },
  ]);
  const [activeTab, setActiveTab] = useState('tape');
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [filterText, setFilterText] = useState('');
  const [machineToDelete, setMachineToDelete] = useState<string | null>(null);

  const isCalibrationDueSoon = (dateStr: string) => {
    const nextCal = new Date(dateStr);
    const today = new Date();
    const diffTime = nextCal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const files = formData.getAll('certificates') as File[];
    const fileNames = files.filter(f => f.name).map(f => f.name);
    const newMachine = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      category: activeTab,
      calDate: formData.get('calDate') as string,
      nextCalDate: formData.get('nextCalDate') as string,
      responsible: formData.get('responsible') as string,
      certificates: fileNames,
      history: []
    };
    setMachines([...machines, newMachine]);
    setIsAddModalOpen(false);
  };

  const startEdit = (machine: any) => {
    setEditingId(machine.id);
    setEditForm({ ...machine });
  };

  const saveEdit = () => {
    setMachines(prev => prev.map(m => m.id === editingId ? editForm : m));
    setEditingId(null);
    setEditForm(null);
  };

  const confirmDelete = () => {
    if (machineToDelete) {
      setMachines(prev => prev.filter(m => m.id !== machineToDelete));
      setMachineToDelete(null);
    }
  };

  const handleFileUpload = (id: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileNames = Array.from(files).map(f => f.name);
    setMachines(prev => prev.map(m => m.id === id ? { ...m, certificates: [...m.certificates, ...fileNames] } : m));
  };

  const moveCertificate = (machineId: string, fromIndex: number, toIndex: number) => {
    setMachines(prev => prev.map(m => {
      if (m.id !== machineId) return m;
      const newCerts = [...m.certificates];
      const [moved] = newCerts.splice(fromIndex, 1);
      newCerts.splice(toIndex, 0, moved);
      return { ...m, certificates: newCerts };
    }));
  };

  const removeCertificate = (machineId: string, index: number) => {
    setMachines(prev => prev.map(m => {
      if (m.id !== machineId) return m;
      const newCerts = [...m.certificates];
      newCerts.splice(index, 1);
      return { ...m, certificates: newCerts };
    }));
  };

  const filteredMachines = machines.filter(m => 
    m.category === activeTab &&
    (m.id.toLowerCase().includes(filterText.toLowerCase()) || 
    m.name.toLowerCase().includes(filterText.toLowerCase()) ||
    m.responsible.toLowerCase().includes(filterText.toLowerCase()))
  );

  const selectedMachine = machines.find(m => m.id === selectedMachineId);

  if (selectedMachine) {
    return (
      <div className="page active p-4 md:p-8">
        <div className="sec-head">
          <div>
            <div className="sec-title">🔍 {selectedMachine.name} Details</div>
            <div className="sec-sub">ID: {selectedMachine.id} · Category: {selectedMachine.category === 'tape' ? 'Quality Measurement Tape' : 'Machine, Tool & Equipment'}</div>
          </div>
          <button className="btn btn-ghost" onClick={() => setSelectedMachineId(null)}>← Back to List</button>
        </div>
        <div className="g2 mb-3">
          <div className="card">
            <div className="card-header"><div className="card-title">Current Calibration</div></div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Last Calibrated:</span>
                <span className="font-mono">{selectedMachine.calDate}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Next Due:</span>
                <span className={`font-mono ${isCalibrationDueSoon(selectedMachine.nextCalDate) ? 'text-amber font-bold' : new Date(selectedMachine.nextCalDate) < new Date() ? 'text-red font-bold' : ''}`}>
                  {selectedMachine.nextCalDate}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Responsible:</span>
                <span>{selectedMachine.responsible}</span>
              </div>
              <div className="flex flex-col border-b pb-2">
                <span className="text-gray-500 mb-2">Current Certificates:</span>
                {selectedMachine.certificates.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {selectedMachine.certificates.map((cert, idx) => (
                      <li key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                        <span className="text-blue-500 underline cursor-pointer">{cert}</span>
                        <div className="flex gap-1">
                          <button 
                            className="btn btn-ghost btn-sm px-2 py-1" 
                            disabled={idx === 0} 
                            onClick={() => moveCertificate(selectedMachine.id, idx, idx - 1)}
                          >↑</button>
                          <button 
                            className="btn btn-ghost btn-sm px-2 py-1" 
                            disabled={idx === selectedMachine.certificates.length - 1} 
                            onClick={() => moveCertificate(selectedMachine.id, idx, idx + 1)}
                          >↓</button>
                          <button 
                            className="btn btn-ghost btn-sm px-2 py-1 text-red-500" 
                            onClick={() => removeCertificate(selectedMachine.id, idx)}
                          >✕</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
                <div className="mt-3">
                  <input type="file" id={`details-file-${selectedMachine.id}`} multiple className="hidden" onChange={e => handleFileUpload(selectedMachine.id, e.target.files)} />
                  <label htmlFor={`details-file-${selectedMachine.id}`} className="btn btn-ghost btn-sm cursor-pointer border">+ Add Certificates</label>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Calibration History</div></div>
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Date</th><th>Result</th><th>Certificate</th></tr></thead>
                <tbody>
                  {selectedMachine.history.length > 0 ? selectedMachine.history.map((h, i) => (
                    <tr key={i}>
                      <td>{h.date}</td>
                      <td><span className={`badge ${h.result === 'Pass' ? 'badge-green' : 'badge-red'}`}>{h.result}</span></td>
                      <td>{h.cert ? <span className="text-blue-500 underline cursor-pointer">{h.cert}</span> : 'N/A'}</td>
                    </tr>
                  )) : <tr><td colSpan={3} className="text-center py-4 text-gray-500">No history available</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const exportData = filteredMachines.map(m => ({
    ...m,
    certificates: m.certificates.join(', ')
  }));

  return (
    <div className="page active p-4 md:p-8">
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        data={exportData}
        columns={[
          {key: 'id', label: 'Machine ID'},
          {key: 'name', label: 'Machine Name'},
          {key: 'calDate', label: 'Calibration Date'},
          {key: 'nextCalDate', label: 'Next Calibration Date'},
          {key: 'responsible', label: 'Responsible Person'},
          {key: 'certificates', label: 'Certificates'}
        ]}
        title="Calibration Report"
      />
      
      {machineToDelete && (
        <div className="modal active">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <h3>Confirm Deletion</h3>
            <p className="mt-2 text-gray-600">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end mt-4">
              <button className="btn btn-ghost" onClick={() => setMachineToDelete(null)}>Cancel</button>
              <button className="btn btn-primary bg-red-500 border-red-500 hover:bg-red-600" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="modal active">
          <div className="modal-content">
            <h3>Add New Machine Calibration</h3>
            <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-3">
              <input type="text" name="id" placeholder="Machine ID" className="form-control" required />
              <input type="text" name="name" placeholder="Machine Name" className="form-control" required />
              <div>
                <label className="text-sm text-gray-500">Calibration Date</label>
                <input type="date" name="calDate" className="form-control" required />
              </div>
              <div>
                <label className="text-sm text-gray-500">Next Calibration Date</label>
                <input type="date" name="nextCalDate" className="form-control" required />
              </div>
              <input type="text" name="responsible" placeholder="Responsible Person" className="form-control" required />
              <div>
                <label className="text-sm text-gray-500">Certificate Upload (Multiple)</label>
                <input type="file" name="certificates" multiple className="form-control" />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" className="btn btn-ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="sec-head">
        <div><div className="sec-title">⚙️ Calibration Management</div><div className="sec-sub">Machine & Equipment Calibration Tracking</div></div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search..." 
            className="form-control" 
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <button className="btn btn-ghost" onClick={() => setIsExportModalOpen(true)}>⬇ Export</button>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>+ Add Item</button>
        </div>
      </div>

      <div className="flex gap-2 mb-4 border-b pb-2">
        <button className={`btn ${activeTab === 'tape' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('tape')}>Quality Measurement Tape</button>
        <button className={`btn ${activeTab === 'machine' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('machine')}>Machine, Tool & Equipment</button>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Machine ID</th>
                <th>Machine Name</th>
                <th>Calibration Date</th>
                <th>Next Calibration Date</th>
                <th>Responsible Person</th>
                <th>Certificate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMachines.map(machine => (
                <tr key={machine.id}>
                  <td className="font-mono">{machine.id}</td>
                  <td>
                    {editingId === machine.id ? (
                      <input type="text" className="form-control" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    ) : machine.name}
                  </td>
                  <td>
                    {editingId === machine.id ? (
                      <input type="date" className="form-control" value={editForm.calDate} onChange={e => setEditForm({...editForm, calDate: e.target.value})} />
                    ) : machine.calDate}
                  </td>
                  <td>
                    {editingId === machine.id ? (
                      <input type="date" className="form-control" value={editForm.nextCalDate} onChange={e => setEditForm({...editForm, nextCalDate: e.target.value})} />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={
                          new Date(machine.nextCalDate) < new Date() 
                            ? 'text-red font-bold' 
                            : isCalibrationDueSoon(machine.nextCalDate) 
                              ? 'text-amber font-bold' 
                              : ''
                        }>
                          {machine.nextCalDate}
                        </span>
                        {new Date(machine.nextCalDate) < new Date() && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Overdue</span>
                        )}
                        {isCalibrationDueSoon(machine.nextCalDate) && (
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Due Soon</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    {editingId === machine.id ? (
                      <input type="text" className="form-control" value={editForm.responsible} onChange={e => setEditForm({...editForm, responsible: e.target.value})} />
                    ) : machine.responsible}
                  </td>
                  <td>
                    {machine.certificates.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {machine.certificates.map((cert, idx) => (
                          <span key={idx} className="text-sm text-blue-500 underline cursor-pointer truncate" title={cert}>{cert}</span>
                        ))}
                        <div className="mt-1">
                          <input type="file" id={`file-${machine.id}`} multiple className="hidden" onChange={e => handleFileUpload(machine.id, e.target.files)} />
                          <label htmlFor={`file-${machine.id}`} className="cursor-pointer text-xs bg-gray-200 px-2 py-1 rounded">+ Add</label>
                        </div>
                      </div>
                    ) : (
                      <input type="file" multiple className="text-sm" onChange={e => handleFileUpload(machine.id, e.target.files)} />
                    )}
                  </td>
                  <td>
                    {editingId === machine.id ? (
                      <div className="flex gap-2">
                        <button className="btn btn-primary btn-sm" onClick={saveEdit}>Save</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm" onClick={() => startEdit(machine)}>Edit</button>
                        <button className="btn btn-primary btn-sm" onClick={() => setSelectedMachineId(machine.id)}>Details</button>
                        <button className="btn btn-ghost btn-sm text-red-500" onClick={() => setMachineToDelete(machine.id)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredMachines.length === 0 && (
                <tr><td colSpan={7} className="text-center py-4 text-gray-500">No machines found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GenericPage({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <div className="page active p-4 md:p-8">
      <div className="sec-head">
        <div>
          <div className="sec-title">{title}</div>
          {subtitle && <div className="sec-sub">{subtitle}</div>}
        </div>
      </div>
      <div className="card">
        <p className="text-muted">This module is currently under development or data is not available.</p>
      </div>
    </div>
  );
}

export { KPIManagement, Goals, BuyerSummary, Reports, Calibration, GenericPage };

