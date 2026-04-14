import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  FileText, 
  Download, 
  Printer, 
  Trash2, 
  Edit, 
  ChevronLeft, 
  Check, 
  X, 
  User, 
  Building, 
  MapPin, 
  Briefcase, 
  Users, 
  Calendar,
  AlertCircle,
  Save,
  ArrowRight,
  ClipboardList,
  ToggleLeft,
  ToggleRight,
  PenLine,
  Database,
  Hash
} from 'lucide-react';
import { JDRecord, Employee, JDResponsibility, DocumentControlRecord } from '../types';
import { COMPANIES, LOCATIONS } from '../constants';
import { cn } from '../lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Mock Employee Database (HRMS Integration)
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP001',
    erpId: 'ERP-1001',
    name: 'Fahim Ahmed',
    designation: 'Quality Manager',
    employeeCode: 'QA-001',
    department: 'Quality Assurance',
    section: 'Management',
    unit: 'Unit-01',
    doj: '2020-01-15',
    email: 'fahim@factory.com'
  },
  {
    id: 'EMP002',
    erpId: 'ERP-1002',
    name: 'Sazzad Hossain',
    designation: 'Production Manager',
    employeeCode: 'PROD-001',
    department: 'Production',
    section: 'Sewing',
    unit: 'Unit-01',
    doj: '2019-05-20',
    email: 'sazzad@factory.com'
  },
  {
    id: 'EMP003',
    erpId: 'ERP-1003',
    name: 'Kamrul Islam',
    designation: 'Senior QC Inspector',
    employeeCode: 'QA-005',
    department: 'Quality Assurance',
    section: 'Finishing',
    unit: 'Unit-02',
    doj: '2021-03-10',
    email: 'kamrul@factory.com'
  },
  {
    id: 'EMP004',
    erpId: 'ERP-1004',
    name: 'Abdur Rahman',
    designation: 'HR Manager',
    employeeCode: 'HR-001',
    department: 'Human Resources',
    section: 'Admin',
    unit: 'Head Office',
    doj: '2018-11-01',
    email: 'rahman@factory.com'
  }
];

interface JDModuleProps {
  onNavigate: (page: string, params?: any) => void;
}

const MOCK_JDS: JDRecord[] = [
  {
    id: '1',
    companyName: 'Vogue Garments Ltd.',
    factoryLocation: 'Gazipur, Dhaka',
    documentCode: 'QMS/FORM/060', // Needle Control Log
    revNo: '01',
    jdRefNo: 'JD-QAM-01',
    employeeName: 'Fahim Ahmed',
    employeeId: 'EMP001',
    employeeCode: 'QA-001',
    doj: '2020-01-15',
    erpId: 'ERP-1001',
    designation: 'Quality Manager',
    department: 'Quality Assurance',
    section: 'Quality',
    unit: 'Unit-01',
    grade: 'G-10',
    reportToName: 'Sazzad Hossain',
    reportToId: 'ERP-1002',
    reportToDesignation: 'Production Manager',
    responsibilities: [
      { id: '1', description: 'Maintain QMS according to ISO 9001:2015 standards.' },
      { id: '2', description: 'Monitor line-wise DHU and implement CAPA for high-defect lines.' },
      { id: '3', description: 'Oversee final inspection and pre-final audits.' }
    ],
    delegationClause: true,
    status: 'Finalized',
    preparedBy: 'HR Manager',
    preparedDate: '2024-01-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function JDModule({ onNavigate }: JDModuleProps) {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [records, setRecords] = useState<JDRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<JDRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Input mode toggles: 'search' = HRMS lookup, 'manual' = free-form typing
  const [empInputMode, setEmpInputMode] = useState<'search' | 'manual'>('manual');
  const [supInputMode, setSupInputMode] = useState<'search' | 'manual'>('manual');

  // Document Control link state
  const [docControlRecords, setDocControlRecords] = useState<DocumentControlRecord[]>([]);
  const [docCodeSearch, setDocCodeSearch] = useState('');
  const [showDocCodeResults, setShowDocCodeResults] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<JDRecord>>({
    companyName: localStorage.getItem('companyName') || 'Vogue Garments Ltd.',
    factoryLocation: 'Gazipur, Dhaka',
    documentCode: '',
    revNo: '',
    jdRefNo: `JD-${Date.now().toString().slice(-6)}`,
    responsibilities: [{ id: '1', description: '' }],
    delegationClause: true,
    status: 'Draft',
    preparedBy: '',
    preparedDate: new Date().toISOString().split('T')[0]
  });

  const [empSearch, setEmpSearch] = useState('');
  const [reportToSearch, setReportToSearch] = useState('');
  const [showEmpResults, setShowEmpResults] = useState(false);
  const [showReportToResults, setShowReportToResults] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('jd_records');
    if (saved) {
      setRecords(JSON.parse(saved));
    } else {
      setRecords(MOCK_JDS);
      localStorage.setItem('jd_records', JSON.stringify(MOCK_JDS));
    }
    // Load Document Control records for linking
    try {
      const dcRaw = localStorage.getItem('garmentqms_doc_control');
      if (dcRaw) setDocControlRecords(JSON.parse(dcRaw));
    } catch {}
  }, []);

  // Filtered document codes for search dropdown
  const filteredDocCodes = useMemo(() => {
    if (!docCodeSearch) return docControlRecords.filter(d => d.status === 'Active').slice(0, 20);
    const q = docCodeSearch.toLowerCase();
    return docControlRecords.filter(d =>
      d.code.toLowerCase().includes(q) ||
      d.name.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [docCodeSearch, docControlRecords]);

  const handleSelectDocCode = (doc: DocumentControlRecord) => {
    setFormData(prev => ({
      ...prev,
      documentCode: doc.code,
      revNo: doc.version || prev.revNo
    }));
    setDocCodeSearch(doc.code);
    setShowDocCodeResults(false);
  };

  const saveToLocal = (newRecords: JDRecord[]) => {
    localStorage.setItem('jd_records', JSON.stringify(newRecords));
    setRecords(newRecords);
  };

  const filteredEmployees = useMemo(() => {
    if (!empSearch) return [];
    return MOCK_EMPLOYEES.filter(e => 
      e.name.toLowerCase().includes(empSearch.toLowerCase()) || 
      e.erpId.toLowerCase().includes(empSearch.toLowerCase())
    );
  }, [empSearch]);

  const filteredSupervisors = useMemo(() => {
    if (!reportToSearch) return [];
    return MOCK_EMPLOYEES.filter(e => 
      e.name.toLowerCase().includes(reportToSearch.toLowerCase()) || 
      e.erpId.toLowerCase().includes(reportToSearch.toLowerCase())
    );
  }, [reportToSearch]);

  const handleSelectEmployee = (emp: Employee) => {
    setFormData(prev => ({
      ...prev,
      employeeId: emp.id,
      employeeName: emp.name,
      erpId: emp.erpId,
      designation: emp.designation,
      employeeCode: emp.employeeCode,
      department: emp.department,
      section: emp.section,
      unit: emp.unit,
      doj: emp.doj
    }));
    setEmpSearch(emp.name);
    setShowEmpResults(false);
  };

  const handleSelectSupervisor = (emp: Employee) => {
    setFormData(prev => ({
      ...prev,
      reportToId: emp.id,
      reportToName: emp.name,
      reportToDesignation: emp.designation
    }));
    setReportToSearch(emp.name);
    setShowReportToResults(false);
  };

  const addResponsibility = () => {
    setFormData(prev => ({
      ...prev,
      responsibilities: [
        ...(prev.responsibilities || []),
        { id: Date.now().toString(), description: '' }
      ]
    }));
  };

  const removeResponsibility = (id: string) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities?.filter(r => r.id !== id)
    }));
  };

  const updateResponsibility = (id: string, text: string) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities?.map(r => 
        r.id === id ? { ...r, description: text } : r
      )
    }));
  };

  const handleSave = () => {
    if (!formData.employeeName || !formData.reportToName) {
      alert('Please provide Employee Name and Supervisor Name.');
      return;
    }

    const newRecord: JDRecord = {
      ...(formData as JDRecord),
      id: formData.id || Date.now().toString(),
      employeeId: formData.employeeId || `MANUAL-${Date.now()}`,
      reportToId: formData.reportToId || `MANUAL-SUP-${Date.now()}`,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as JDRecord;

    const updatedRecords = formData.id 
      ? records.map(r => r.id === formData.id ? newRecord : r)
      : [newRecord, ...records];

    saveToLocal(updatedRecords);
    setView('list');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      companyName: localStorage.getItem('companyName') || 'Vogue Garments Ltd.',
      factoryLocation: 'Gazipur, Dhaka',
      documentCode: '',
      revNo: '',
      jdRefNo: `JD-${Date.now().toString().slice(-6)}`,
      responsibilities: [{ id: '1', description: '' }],
      delegationClause: true,
      status: 'Draft',
      preparedBy: '',
      preparedDate: new Date().toISOString().split('T')[0]
    });
    setEmpSearch('');
    setReportToSearch('');
    setDocCodeSearch('');
    setEmpInputMode('manual');
    setSupInputMode('manual');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this JD?')) {
      const updated = records.filter(r => r.id !== id);
      saveToLocal(updated);
    }
  };

  const handleEdit = (record: JDRecord) => {
    setFormData(record);
    setEmpSearch(record.employeeName);
    setReportToSearch(record.reportToName);
    setDocCodeSearch(record.documentCode || '');
    setEmpInputMode('manual');
    setSupInputMode('manual');
    setView('form');
  };

  // ═══════════════════════════════════════════════════════════════════
  //  CLEAN PDF EXPORT — Professional AutoTable Design
  //  Layout: Doc Code & Rev at top-left | Company center bold | Address below
  // ═══════════════════════════════════════════════════════════════════
  const exportToPDF = (record: JDRecord) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    // ── Color Palette ────────────────────────────────────────
    const DARK      = [30, 41, 59] as [number, number, number];
    const MEDIUM    = [71, 85, 105] as [number, number, number];
    const LIGHT     = [148, 163, 184] as [number, number, number];
    const LABEL_BG  = [241, 245, 249] as [number, number, number];
    const BORDER    = [203, 213, 225] as [number, number, number];
    const ALT_ROW   = [248, 250, 252] as [number, number, number];
    const WHITE     = [255, 255, 255] as [number, number, number];
    const BLACK     = [0, 0, 0] as [number, number, number];

    // ═══════════════════════════════════════════════════════════
    //  PAGE HEADER — Clean 3‐column layout with outer border box
    // ═══════════════════════════════════════════════════════════
    const headerH = 28;
    
    // Outer border box for the entire header
    doc.setDrawColor(...DARK);
    doc.setLineWidth(0.6);
    doc.rect(margin, 8, contentWidth, headerH, 'S');

    // ── Left column: Doc Code + Rev No ───────────────────────
    const leftColW = 45;
    // Vertical divider
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.line(margin + leftColW, 8, margin + leftColW, 8 + headerH);

    if (record.documentCode) {
      doc.setTextColor(...DARK);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text('Doc Code:', margin + 3, 16);
      doc.setFont('helvetica', 'normal');
      doc.text(record.documentCode, margin + 3, 21);
    }
    if (record.revNo) {
      doc.setTextColor(...DARK);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text('Rev No:', margin + 3, 27);
      doc.setFont('helvetica', 'normal');
      doc.text(record.revNo, margin + 20, 27);
    }

    // ── Right column: Date + Ref No  ─────────────────────────
    const rightColW = 45;
    // Vertical divider
    doc.line(margin + contentWidth - rightColW, 8, margin + contentWidth - rightColW, 8 + headerH);

    doc.setTextColor(...DARK);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('Ref No:', margin + contentWidth - rightColW + 3, 16);
    doc.setFont('helvetica', 'normal');
    doc.text(record.jdRefNo || '', margin + contentWidth - rightColW + 3, 21);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', margin + contentWidth - rightColW + 3, 27);
    doc.setFont('helvetica', 'normal');
    doc.text(record.preparedDate || '', margin + contentWidth - rightColW + 20, 27);

    // ── Center column: Company Name (bold) + Address below ───
    const centerX = pageWidth / 2;
    doc.setTextColor(...BLACK);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(record.companyName || 'Company Name', centerX, 19, { align: 'center' });

    doc.setTextColor(...MEDIUM);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(record.factoryLocation || '', centerX, 25, { align: 'center' });

    // ── Title bar: JOB DESCRIPTION ───────────────────────────
    const titleY = 8 + headerH + 2;
    doc.setFillColor(...DARK);
    doc.rect(margin, titleY, contentWidth, 9, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('JOB DESCRIPTION', centerX, titleY + 6.5, { align: 'center' });

    let currentY = titleY + 14;

    // ═══════════════════════════════════════════════════════════
    //  JOB HOLDER INFORMATION TABLE
    // ═══════════════════════════════════════════════════════════
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [
        [{ content: 'JOB HOLDER INFORMATION', colSpan: 4, styles: { halign: 'left' as const, fillColor: LABEL_BG, textColor: DARK, fontSize: 8, fontStyle: 'bold' as const } }]
      ],
      body: [
        ['Employee Name', record.employeeName || '—', 'ERP ID', record.erpId || '—'],
        ['Designation', record.designation || '—', 'Employee Code', record.employeeCode || '—'],
        ['Department', record.department || '—', 'Section', record.section || '—'],
        ['Unit', record.unit || '—', 'Date of Joining', record.doj || '—']
      ],
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: { top: 3, bottom: 3, left: 5, right: 5 },
        lineColor: BORDER,
        lineWidth: 0.3,
        textColor: DARK,
        font: 'helvetica'
      },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: LABEL_BG, cellWidth: 36, textColor: MEDIUM, fontSize: 8 },
        1: { cellWidth: (contentWidth / 2) - 36 },
        2: { fontStyle: 'bold', fillColor: LABEL_BG, cellWidth: 36, textColor: MEDIUM, fontSize: 8 },
        3: { cellWidth: (contentWidth / 2) - 36 }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 4;

    // ═══════════════════════════════════════════════════════════
    //  REPORTING STRUCTURE TABLE
    // ═══════════════════════════════════════════════════════════
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [
        [{ content: 'REPORTING STRUCTURE', colSpan: 4, styles: { halign: 'left' as const, fillColor: LABEL_BG, textColor: DARK, fontSize: 8, fontStyle: 'bold' as const } }]
      ],
      body: [
        ['Reports To', record.reportToName || '—', 'Designation', record.reportToDesignation || '—']
      ],
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: { top: 3, bottom: 3, left: 5, right: 5 },
        lineColor: BORDER,
        lineWidth: 0.3,
        textColor: DARK,
        font: 'helvetica'
      },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: LABEL_BG, cellWidth: 36, textColor: MEDIUM, fontSize: 8 },
        1: { cellWidth: (contentWidth / 2) - 36 },
        2: { fontStyle: 'bold', fillColor: LABEL_BG, cellWidth: 36, textColor: MEDIUM, fontSize: 8 },
        3: { cellWidth: (contentWidth / 2) - 36 }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 4;

    // ═══════════════════════════════════════════════════════════
    //  KEY RESPONSIBILITIES TABLE
    // ═══════════════════════════════════════════════════════════
    const responsibilitiesBody = record.responsibilities
      .filter(r => r.description.trim())
      .map((r, idx) => [
        { content: String(idx + 1), styles: { halign: 'center' as const, fontStyle: 'bold' as const } },
        r.description
      ]);

    if (responsibilitiesBody.length > 0) {
      autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [
          [
            { content: 'SL', styles: { halign: 'center' as const, cellWidth: 14 } },
            { content: 'KEY RESPONSIBILITIES' }
          ]
        ],
        body: responsibilitiesBody,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: { top: 3, bottom: 3, left: 5, right: 5 },
          lineColor: BORDER,
          lineWidth: 0.3,
          textColor: DARK,
          font: 'helvetica',
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: LABEL_BG,
          textColor: DARK,
          fontStyle: 'bold',
          fontSize: 8
        },
        columnStyles: {
          0: { cellWidth: 14, halign: 'center' },
          1: { cellWidth: contentWidth - 14 }
        },
        alternateRowStyles: {
          fillColor: ALT_ROW
        }
      });
      currentY = (doc as any).lastAutoTable.finalY + 4;
    }

    // ═══════════════════════════════════════════════════════════
    //  DELEGATION CLAUSE (if enabled)
    // ═══════════════════════════════════════════════════════════
    if (record.delegationClause) {
      if (currentY > pageHeight - 55) { doc.addPage(); currentY = 20; }

      autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [
          [{ content: 'DELEGATION CLAUSE', styles: { fillColor: LABEL_BG, textColor: DARK, fontSize: 8, fontStyle: 'bold' as const } }]
        ],
        body: [
          ["Authorized to delegate his authority to his subordinate with responsibility and continuous monitoring."]
        ],
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: { top: 3, bottom: 3, left: 5, right: 5 },
          lineColor: BORDER,
          lineWidth: 0.3,
          textColor: MEDIUM,
          font: 'helvetica',
          fontStyle: 'italic'
        }
      });
      currentY = (doc as any).lastAutoTable.finalY + 4;
    }

    // ═══════════════════════════════════════════════════════════
    //  REPORTING DECLARATION
    // ═══════════════════════════════════════════════════════════
    if (currentY > pageHeight - 55) { doc.addPage(); currentY = 20; }

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [
        [{ content: 'REPORTING DECLARATION', styles: { fillColor: LABEL_BG, textColor: DARK, fontSize: 8, fontStyle: 'bold' as const } }]
      ],
      body: [
        ["You are and will remain directly reporting to undersigned regarding all your responsibility matter."]
      ],
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: { top: 3, bottom: 3, left: 5, right: 5 },
        lineColor: BORDER,
        lineWidth: 0.3,
        textColor: DARK,
        font: 'helvetica'
      }
    });
    currentY = (doc as any).lastAutoTable.finalY + 6;

    // ═══════════════════════════════════════════════════════════
    //  SIGNATURE TABLE
    // ═══════════════════════════════════════════════════════════
    if (currentY > pageHeight - 55) { doc.addPage(); currentY = 20; }

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [
        [
          { content: 'Prepared By', styles: { halign: 'center' as const } },
          { content: "Supervisor's Signature", styles: { halign: 'center' as const } },
          { content: "Employee's Acknowledgement", styles: { halign: 'center' as const } }
        ]
      ],
      body: [
        [
          { content: `\n\n\n\n${record.preparedBy || '_______________'}\n\nDate: ${record.preparedDate || '___/___/______'}`, styles: { halign: 'center' as const } },
          { content: `\n\n\n\n${record.reportToName || '_______________'}\n${record.reportToDesignation || ''}\n\nSign: _______________`, styles: { halign: 'center' as const } },
          { content: `\n\n\n\n${record.employeeName || '_______________'}\n\nSign: _______________\nDate: ___/___/______`, styles: { halign: 'center' as const } }
        ]
      ],
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
        lineColor: BORDER,
        lineWidth: 0.3,
        textColor: DARK,
        font: 'helvetica',
        minCellHeight: 40,
        valign: 'top'
      },
      headStyles: {
        fillColor: LABEL_BG,
        textColor: DARK,
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: contentWidth / 3 },
        1: { cellWidth: contentWidth / 3 },
        2: { cellWidth: contentWidth / 3 }
      }
    });

    // ═══════════════════════════════════════════════════════════
    //  PAGE FOOTER — on every page
    // ═══════════════════════════════════════════════════════════
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const pH = doc.internal.pageSize.getHeight();
      const pW = doc.internal.pageSize.getWidth();

      doc.setDrawColor(...BORDER);
      doc.setLineWidth(0.3);
      doc.line(margin, pH - 12, pW - margin, pH - 12);

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...LIGHT);
      doc.text(record.companyName || '', margin, pH - 7);
      doc.text(`Page ${i} of ${totalPages}`, pW / 2, pH - 7, { align: 'center' });
      doc.text(`Ref: ${record.jdRefNo}`, pW - margin, pH - 7, { align: 'right' });
    }

    doc.save(`JD_${record.employeeName || 'Employee'}_${record.jdRefNo}.pdf`);
  };

  // ═══════════════════════════════════════════════════════════════════
  //  INPUT MODE TOGGLE COMPONENT
  // ═══════════════════════════════════════════════════════════════════
  const InputModeToggle = ({ mode, onToggle, label }: { mode: 'search' | 'manual'; onToggle: () => void; label: string }) => (
    <div className="flex items-center justify-between mb-3">
      <span className="font-mono text-[10px] text-text-3 uppercase tracking-widest">{label}</span>
      <button 
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider border transition-all",
          mode === 'manual' 
            ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20" 
            : "bg-accent/10 text-accent border-accent/30 hover:bg-accent/20"
        )}
      >
        {mode === 'manual' ? (
          <><PenLine className="w-3 h-3" /> Manual Input</>
        ) : (
          <><Database className="w-3 h-3" /> HRMS Search</>
        )}
      </button>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-rajdhani font-bold text-text-1 tracking-wider uppercase flex items-center gap-3">
            <User className="w-8 h-8 text-accent" />
            Job Description Management
          </h1>
          <p className="text-text-3 font-mono text-sm mt-1 uppercase tracking-widest">
            Generate and manage structured employee JDs
          </p>
        </div>
        
        {view === 'list' ? (
          <button 
            onClick={() => { setView('form'); resetForm(); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent/10 text-accent border border-accent/50 hover:bg-accent/20 transition-all font-mono font-bold uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            Create New JD
          </button>
        ) : (
          <button 
            onClick={() => setView('list')}
            className="flex items-center gap-2 px-6 py-2.5 bg-bg-2/50 text-text-2 border border-border-main hover:bg-bg-2 transition-all font-mono font-bold uppercase tracking-wider"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to List
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Search */}
            <div className="bg-bg-1/50 backdrop-blur-md border border-border-main p-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                <input 
                  type="text"
                  placeholder="SEARCH BY EMPLOYEE NAME OR REF NO..."
                  className="w-full bg-bg-2/50 border border-border-main py-2 pl-10 pr-4 text-text-1 font-mono text-sm focus:border-accent outline-none transition-all uppercase"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* List Table */}
            <div className="bg-bg-1/50 backdrop-blur-md border border-border-main overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-main bg-bg-2/50">
                    <th className="p-4 font-mono text-[10px] font-bold text-text-3 uppercase tracking-widest">Ref No</th>
                    <th className="p-4 font-mono text-[10px] font-bold text-text-3 uppercase tracking-widest">Employee</th>
                    <th className="p-4 font-mono text-[10px] font-bold text-text-3 uppercase tracking-widest">Designation</th>
                    <th className="p-4 font-mono text-[10px] font-bold text-text-3 uppercase tracking-widest">Department</th>
                    <th className="p-4 font-mono text-[10px] font-bold text-text-3 uppercase tracking-widest">Status</th>
                    <th className="p-4 font-mono text-[10px] font-bold text-text-3 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/50">
                  {records.filter(r => 
                    r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    r.jdRefNo.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map(record => (
                    <tr key={record.id} className="hover:bg-accent/5 transition-colors group">
                      <td className="p-4 font-mono text-xs text-accent font-bold">{record.jdRefNo}</td>
                      <td className="p-4">
                        <div className="font-mono text-sm text-text-1 font-bold uppercase">{record.employeeName}</div>
                        <div className="font-mono text-[10px] text-text-3 uppercase tracking-tighter">{record.erpId}</div>
                      </td>
                      <td className="p-4 font-mono text-xs text-text-2 uppercase">{record.designation}</td>
                      <td className="p-4 font-mono text-xs text-text-2 uppercase">{record.department}</td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-0.5 font-mono text-[10px] font-bold border",
                          record.status === 'Finalized' ? "bg-green-main/10 text-green-main border-green-main/30" : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                        )}>
                          {record.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => exportToPDF(record)}
                            className="p-1.5 text-text-3 hover:text-accent hover:bg-accent/10 border border-transparent hover:border-accent/30 transition-all"
                            title="Export PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEdit(record)}
                            className="p-1.5 text-text-3 hover:text-blue-400 hover:bg-blue-400/10 border border-transparent hover:border-blue-400/30 transition-all"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(record.id)}
                            className="p-1.5 text-text-3 hover:text-red-main hover:bg-red-main/10 border border-transparent hover:border-red-main/30 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-3 text-text-3">
                          <FileText className="w-12 h-12 opacity-20" />
                          <p className="font-mono text-sm uppercase tracking-widest">No Job Descriptions found</p>
                          <button 
                            onClick={() => setView('form')}
                            className="text-accent hover:underline font-mono text-xs uppercase"
                          >
                            Create your first JD
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Form Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* ═══════════════════════════════════════════ */}
                {/*  GENERAL INFO — Company, Address, Codes     */}
                {/* ═══════════════════════════════════════════ */}
                <section className="bg-bg-1/50 backdrop-blur-md border border-border-main p-6 space-y-6">
                  <h2 className="font-mono text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    General Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Name — free-text input */}
                    <div className="space-y-2">
                      <label className="block font-mono text-[10px] text-text-3 uppercase tracking-widest">Company Name</label>
                      <input
                        type="text"
                        placeholder="ENTER COMPANY NAME..."
                        className="w-full bg-bg-2/50 border border-border-main py-2 px-3 text-text-1 font-mono text-sm focus:border-accent outline-none transition-all"
                        value={formData.companyName || ''}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        autoComplete="off"
                      />
                    </div>
                    {/* Address — free-text input */}
                    <div className="space-y-2">
                      <label className="block font-mono text-[10px] text-text-3 uppercase tracking-widest">Address</label>
                      <input
                        type="text"
                        placeholder="ENTER FACTORY / COMPANY ADDRESS..."
                        className="w-full bg-bg-2/50 border border-border-main py-2 px-3 text-text-1 font-mono text-sm focus:border-accent outline-none transition-all"
                        value={formData.factoryLocation || ''}
                        onChange={(e) => setFormData({...formData, factoryLocation: e.target.value})}
                        autoComplete="off"
                      />
                    </div>
                    {/* JD Ref No */}
                    <div className="space-y-2">
                      <label className="block font-mono text-[10px] text-text-3 uppercase tracking-widest">JD Ref No</label>
                      <input 
                        type="text"
                        className="w-full bg-bg-2/50 border border-border-main py-2 px-3 text-text-1 font-mono text-sm focus:border-accent outline-none transition-all uppercase"
                        value={formData.jdRefNo}
                        onChange={(e) => setFormData({...formData, jdRefNo: e.target.value})}
                        autoComplete="off"
                      />
                    </div>
                    {/* Document Code — linked to Document Control */}
                    <div className="space-y-2 relative">
                      <label className="block font-mono text-[10px] text-text-3 uppercase tracking-widest flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        Document Code
                        <span className="text-text-3/50 font-normal">(Optional)</span>
                        {docControlRecords.length > 0 && (
                          <span className="ml-auto text-[9px] text-accent/60 font-normal flex items-center gap-1">
                            <FileText className="w-2.5 h-2.5" />
                            Linked to Doc Control ({docControlRecords.length})
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-3" />
                        <input 
                          type="text"
                          placeholder="SEARCH OR TYPE DOCUMENT CODE..."
                          className="w-full bg-bg-2/50 border border-border-main py-2 pl-9 pr-3 text-text-1 font-mono text-sm focus:border-accent outline-none transition-all uppercase"
                          value={docCodeSearch || formData.documentCode || ''}
                          onChange={(e) => {
                            setDocCodeSearch(e.target.value);
                            setFormData({...formData, documentCode: e.target.value});
                            setShowDocCodeResults(true);
                          }}
                          onFocus={() => setShowDocCodeResults(true)}
                          onBlur={() => setTimeout(() => setShowDocCodeResults(false), 200)}
                          autoComplete="off"
                        />
                      </div>
                      {/* Doc Code Dropdown */}
                      {showDocCodeResults && filteredDocCodes.length > 0 && (
                        <div className="absolute z-50 left-0 right-0 mt-1 bg-bg-1 border border-border-main shadow-2xl max-h-56 overflow-y-auto">
                          {filteredDocCodes.map(dc => (
                            <button
                              key={dc.id}
                              className="w-full text-left px-4 py-2.5 hover:bg-accent/10 border-b border-border-main/30 transition-colors flex items-center justify-between group"
                              onMouseDown={(e) => { e.preventDefault(); handleSelectDocCode(dc); }}
                            >
                              <div className="min-w-0">
                                <div className="font-mono text-xs text-accent font-bold group-hover:text-accent-bright">{dc.code}</div>
                                <div className="font-mono text-[10px] text-text-3 truncate">{dc.name}</div>
                              </div>
                              <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                                <span className="font-mono text-[9px] text-text-3 bg-bg-2/50 px-1.5 py-0.5 border border-border-main/50">V{dc.version}</span>
                                <span className={cn(
                                  "font-mono text-[9px] px-1.5 py-0.5 border",
                                  dc.status === 'Active' ? "text-green-main border-green-main/30 bg-green-main/10" : "text-amber-500 border-amber-500/30 bg-amber-500/10"
                                )}>{dc.status}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Rev No — optional (auto-filled from Doc Control) */}
                    <div className="space-y-2">
                      <label className="block font-mono text-[10px] text-text-3 uppercase tracking-widest flex items-center gap-1">
                        Rev No <span className="text-text-3/50 font-normal">(Optional)</span>
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. 01"
                        className="w-full bg-bg-2/50 border border-border-main py-2 px-3 text-text-1 font-mono text-sm focus:border-accent outline-none transition-all uppercase"
                        value={formData.revNo || ''}
                        onChange={(e) => setFormData({...formData, revNo: e.target.value})}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </section>

                {/* ═══════════════════════════════════════════ */}
                {/*  JOB HOLDER — MANUAL / HRMS TOGGLE         */}
                {/* ═══════════════════════════════════════════ */}
                <section className="bg-bg-1/50 backdrop-blur-md border border-border-main p-6 space-y-6">
                  <h2 className="font-mono text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Job Holder Details
                  </h2>
                  
                  <div className="space-y-4">
                    <InputModeToggle
                      mode={empInputMode}
                      onToggle={() => setEmpInputMode(prev => prev === 'search' ? 'manual' : 'search')}
                      label="Employee Input Mode"
                    />

                    {/* HRMS Search Mode */}
                    {empInputMode === 'search' && (
                      <div className="relative">
                        <label className="block font-mono text-[10px] text-text-3 uppercase tracking-widest mb-2">Search Employee (Name or ERP ID)</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                          <input 
                            type="text"
                            placeholder="TYPE TO SEARCH HRMS..."
                            className="w-full bg-bg-2/50 border border-accent/30 py-2.5 pl-10 pr-4 text-text-1 font-mono text-sm focus:border-accent outline-none transition-all uppercase"
                            value={empSearch}
                            onChange={(e) => {
                              setEmpSearch(e.target.value);
                              setShowEmpResults(true);
                            }}
                            onFocus={() => setShowEmpResults(true)}
                            autoComplete="off"
                          />
                        </div>
                        
                        {showEmpResults && filteredEmployees.length > 0 && (
                          <div className="absolute z-50 left-0 right-0 mt-1 bg-bg-1 border border-border-main shadow-2xl max-h-60 overflow-y-auto">
                            {filteredEmployees.map(emp => (
                              <button
                                key={emp.id}
                                className="w-full text-left p-3 hover:bg-accent/10 border-b border-border-main/50 transition-colors flex items-center justify-between group"
                                onClick={() => handleSelectEmployee(emp)}
                              >
                                <div>
                                  <div className="font-mono text-sm text-text-1 font-bold uppercase group-hover:text-accent">{emp.name}</div>
                                  <div className="font-mono text-[10px] text-text-3 uppercase tracking-tighter">{emp.erpId} · {emp.designation}</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-text-3 group-hover:text-accent translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Manual Mode: Employee Name */}
                    {empInputMode === 'manual' && (
                      <div className="space-y-1">
                        <label className="block font-mono text-[10px] text-text-3 uppercase tracking-widest">Employee Name <span className="text-red-main">*</span></label>
                        <input 
                          type="text"
                          placeholder="ENTER EMPLOYEE FULL NAME..."
                          className="w-full bg-bg-2/50 border border-amber-500/30 py-2.5 px-4 text-text-1 font-mono text-sm focus:border-amber-400 outline-none transition-all uppercase"
                          value={formData.employeeName || ''}
                          onChange={(e) => setFormData({...formData, employeeName: e.target.value, employeeId: `MANUAL-${Date.now()}`})}
                          autoComplete="off"
                        />
                      </div>
                    )}

                    {/* Employee Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-text-3 uppercase tracking-widest">ERP ID</span>
                        <input 
                          type="text"
                          placeholder="ERP-XXXX"
                          className="w-full bg-bg-2/30 border border-border-main/50 p-2 text-text-2 font-mono text-xs uppercase focus:border-accent outline-none transition-all"
                          value={formData.erpId || ''}
                          onChange={(e) => setFormData({...formData, erpId: e.target.value})}
                          autoComplete="off"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-text-3 uppercase tracking-widest">Designation <span className="text-red-main">*</span></span>
                        <input 
                          type="text"
                          placeholder="e.g. Quality Manager"
                          className="w-full bg-bg-2/30 border border-border-main/50 p-2 text-text-2 font-mono text-xs uppercase focus:border-accent outline-none transition-all"
                          value={formData.designation || ''}
                          onChange={(e) => setFormData({...formData, designation: e.target.value})}
                          autoComplete="off"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-text-3 uppercase tracking-widest">Emp Code</span>
                        <input 
                          type="text"
                          placeholder="QA-001"
                          className="w-full bg-bg-2/30 border border-border-main/50 p-2 text-text-2 font-mono text-xs uppercase focus:border-accent outline-none transition-all"
                          value={formData.employeeCode || ''}
                          onChange={(e) => setFormData({...formData, employeeCode: e.target.value})}
                          autoComplete="off"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-text-3 uppercase tracking-widest">Department</span>
                        <input 
                          type="text"
                          placeholder="e.g. Quality Assurance"
                          className="w-full bg-bg-2/30 border border-border-main/50 p-2 text-text-2 font-mono text-xs uppercase focus:border-accent outline-none transition-all"
                          value={formData.department || ''}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          autoComplete="off"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-text-3 uppercase tracking-widest">Section</span>
                        <input 
                          type="text"
                          placeholder="e.g. Management"
                          className="w-full bg-bg-2/30 border border-border-main/50 p-2 text-text-2 font-mono text-xs uppercase focus:border-accent outline-none transition-all"
                          value={formData.section || ''}
                          onChange={(e) => setFormData({...formData, section: e.target.value})}
                          autoComplete="off"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-text-3 uppercase tracking-widest">Unit</span>
                        <input 
                          type="text"
                          placeholder="e.g. Unit-01"
                          className="w-full bg-bg-2/30 border border-border-main/50 p-2 text-text-2 font-mono text-xs uppercase focus:border-accent outline-none transition-all"
                          value={formData.unit || ''}
                          onChange={(e) => setFormData({...formData, unit: e.target.value})}
                          autoComplete="off"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-text-3 uppercase tracking-widest">Joining Date</span>
                        <input 
                          type="date"
                          className="w-full bg-bg-2/30 border border-border-main/50 p-2 text-text-2 font-mono text-xs uppercase focus:border-accent outline-none transition-all"
                          value={formData.doj || ''}
                          onChange={(e) => setFormData({...formData, doj: e.target.value})}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Responsibilities */}
                <section className="bg-bg-1/50 backdrop-blur-md border border-border-main p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-mono text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                      <ClipboardList className="w-4 h-4" />
                      Responsibilities Section
                    </h2>
                    <button 
                      onClick={addResponsibility}
                      className="text-[10px] font-mono font-bold text-accent hover:text-accent-bright flex items-center gap-1 uppercase"
                    >
                      <Plus className="w-3 h-3" />
                      Add More
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.responsibilities?.map((res, idx) => (
                      <div key={res.id} className="flex gap-3 group">
                        <div className="w-8 h-10 flex items-center justify-center font-mono text-xs text-text-3 border border-border-main bg-bg-2/30">
                          {idx + 1}
                        </div>
                        <textarea 
                          className="flex-1 bg-bg-2/50 border border-border-main p-2 text-text-1 font-mono text-sm focus:border-accent outline-none transition-all min-h-[40px] resize-none"
                          placeholder="ENTER RESPONSIBILITY..."
                          value={res.description}
                          onChange={(e) => updateResponsibility(res.id, e.target.value)}
                        />
                        <button 
                          onClick={() => removeResponsibility(res.id)}
                          className="p-2 text-text-3 hover:text-red-main opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border-main/50">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={cn(
                        "w-5 h-5 border flex items-center justify-center transition-all",
                        formData.delegationClause ? "bg-accent border-accent text-bg-1" : "border-border-main group-hover:border-accent/50"
                      )}>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={formData.delegationClause}
                          onChange={(e) => setFormData({...formData, delegationClause: e.target.checked})}
                        />
                        {formData.delegationClause && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-xs font-mono text-text-2 uppercase tracking-wide">Insert Delegation Clause</span>
                    </label>
                    {formData.delegationClause && (
                      <p className="mt-2 text-[10px] font-mono text-text-3 italic pl-8">
                        "Authorized to delegate his authority to his sub ordinate with responsibility and continuous monitoring."
                      </p>
                    )}
                  </div>
                </section>
              </div>

              {/* ═══════════════════════════════════════════ */}
              {/*  RIGHT COLUMN — REPORTING & APPROVAL       */}
              {/* ═══════════════════════════════════════════ */}
              <div className="space-y-8">
                {/* Reporting Workflow */}
                <section className="bg-bg-1/50 backdrop-blur-md border border-border-main p-6 space-y-6">
                  <h2 className="font-mono text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Reporting Workflow
                  </h2>

                  <div className="space-y-4">
                    <InputModeToggle
                      mode={supInputMode}
                      onToggle={() => setSupInputMode(prev => prev === 'search' ? 'manual' : 'search')}
                      label="Supervisor Input Mode"
                    />

                    {/* HRMS Search Mode */}
                    {supInputMode === 'search' && (
                      <div className="relative">
                        <label className="block font-mono text-[10px] text-text-3 uppercase tracking-widest mb-2">Search Supervisor (Name or ERP ID)</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                          <input 
                            type="text"
                            placeholder="SEARCH HRMS..."
                            className="w-full bg-bg-2/50 border border-accent/30 py-2 px-3 pl-10 text-text-1 font-mono text-sm focus:border-accent outline-none transition-all uppercase"
                            value={reportToSearch}
                            onChange={(e) => {
                              setReportToSearch(e.target.value);
                              setShowReportToResults(true);
                            }}
                            onFocus={() => setShowReportToResults(true)}
                            autoComplete="off"
                          />
                        </div>
                        
                        {showReportToResults && filteredSupervisors.length > 0 && (
                          <div className="absolute z-50 left-0 right-0 mt-1 bg-bg-1 border border-border-main shadow-2xl max-h-60 overflow-y-auto">
                            {filteredSupervisors.map(emp => (
                              <button
                                key={emp.id}
                                className="w-full text-left p-3 hover:bg-accent/10 border-b border-border-main/50 transition-colors group"
                                onClick={() => handleSelectSupervisor(emp)}
                              >
                                <div>
                                  <div className="font-mono text-sm text-text-1 font-bold uppercase group-hover:text-accent">{emp.name}</div>
                                  <div className="font-mono text-[10px] text-text-3 uppercase tracking-tighter">{emp.erpId} · {emp.designation}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Manual Mode: Supervisor Inputs */}
                    {supInputMode === 'manual' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="block font-mono text-[10px] text-text-3 uppercase tracking-widest">Supervisor Name <span className="text-red-main">*</span></label>
                          <input 
                            type="text"
                            placeholder="ENTER SUPERVISOR NAME..."
                            className="w-full bg-bg-2/50 border border-amber-500/30 py-2.5 px-4 text-text-1 font-mono text-sm focus:border-amber-400 outline-none transition-all uppercase"
                            value={formData.reportToName || ''}
                            onChange={(e) => setFormData({...formData, reportToName: e.target.value, reportToId: `MANUAL-SUP-${Date.now()}`})}
                            autoComplete="off"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-mono text-[10px] text-text-3 uppercase tracking-widest">Supervisor Designation</label>
                          <input 
                            type="text"
                            placeholder="ENTER DESIGNATION..."
                            className="w-full bg-bg-2/30 border border-border-main/50 py-2 px-3 text-text-2 font-mono text-xs uppercase focus:border-accent outline-none transition-all"
                            value={formData.reportToDesignation || ''}
                            onChange={(e) => setFormData({...formData, reportToDesignation: e.target.value})}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-accent/5 border border-accent/20 space-y-3">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-accent mt-0.5" />
                        <div className="space-y-1">
                          <span className="block font-mono text-[10px] text-accent font-bold uppercase tracking-widest">Reporting Declaration</span>
                          <p className="text-[11px] font-mono text-text-2 leading-relaxed">
                            "You are and will remain directly reporting to undersigned regarding all your responsibility matter."
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block font-mono text-[10px] text-text-3 uppercase tracking-widest">Prepared By</label>
                      <input
                        type="text"
                        placeholder="ENTER NAME..."
                        className="w-full bg-bg-2/30 border border-border-main/50 p-2 text-text-2 font-mono text-xs uppercase focus:border-accent outline-none transition-all"
                        value={formData.preparedBy || ''}
                        onChange={(e) => setFormData({...formData, preparedBy: e.target.value})}
                        autoComplete="off"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-mono text-[10px] text-text-3 uppercase tracking-widest">Prepared Date</label>
                      <input
                        type="date"
                        className="w-full bg-bg-2/30 border border-border-main/50 p-2 text-text-2 font-mono text-xs uppercase focus:border-accent outline-none transition-all"
                        value={formData.preparedDate || ''}
                        onChange={(e) => setFormData({...formData, preparedDate: e.target.value})}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </section>

                {/* Status & Save */}
                <section className="bg-bg-1/50 backdrop-blur-md border border-border-main p-6 space-y-6">
                  <h2 className="font-mono text-xs font-bold text-accent uppercase tracking-[0.2em] flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Finalize & Save
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block font-mono text-[10px] text-text-3 uppercase tracking-widest">Document Status</label>
                      <div className="flex gap-2">
                        {(['Draft', 'Finalized'] as const).map(s => (
                          <button
                            key={s}
                            className={cn(
                              "flex-1 py-2 font-mono text-[10px] font-bold border transition-all uppercase tracking-widest",
                              formData.status === s 
                                ? "bg-accent/20 border-accent text-accent" 
                                : "bg-bg-2/30 border-border-main text-text-3 hover:border-accent/30"
                            )}
                            onClick={() => setFormData({...formData, status: s})}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleSave}
                      className="w-full py-4 bg-accent text-bg-1 font-mono font-bold uppercase tracking-[0.2em] hover:bg-accent-bright transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-center gap-3"
                    >
                      <Save className="w-5 h-5" />
                      Save Job Description
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
