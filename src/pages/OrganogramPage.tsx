import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Network, Plus, Search, Trash2, Edit2, Eye, Save, X, ChevronLeft,
  User, Building, Users, Crown, Briefcase, Shield, Award,
  Download, FileDown, ZoomIn, ZoomOut, Maximize2,
  ChevronDown, ChevronRight, GripVertical, UserCheck, Layers
} from 'lucide-react';

import { db } from '../db/db';


// ── Types ──────────────────────────────────────────────
interface OrgNode {
  id: string;
  title: string;
  name: string;
  department: string;
  level: string;
  children: OrgNode[];
}

interface OrgRecord {
  id: string;
  code: string;
  chartTitle: string;
  department: string;
  version: string;
  status: 'Active' | 'Draft' | 'Archived';
  date: string;
  responsiblePerson: string;
  approvedBy: string;
  tree: OrgNode;
  createdAt: string;
}

// ── Level config ───────────────────────────────────────
const LEVELS: Record<string, { color: string; bg: string; border: string; text: string; icon: any }> = {
  'Top Management':    { color: '#7c3aed', bg: '#f5f3ff', border: '#7c3aed', text: '#4c1d95', icon: Crown },
  'Senior Management': { color: '#1d4ed8', bg: '#eff6ff', border: '#1d4ed8', text: '#1e3a8a', icon: Shield },
  'Middle Management': { color: '#0891b2', bg: '#ecfeff', border: '#0891b2', text: '#164e63', icon: Briefcase },
  'Supervisory':       { color: '#059669', bg: '#f0fdf4', border: '#059669', text: '#064e3b', icon: Award },
  'Operational':       { color: '#d97706', bg: '#fffbeb', border: '#d97706', text: '#78350f', icon: User },
};

const STATUS_STYLE: Record<string, string> = {
  'Active':   'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Draft':    'bg-amber-50 text-amber-700 border-amber-200',
  'Archived': 'bg-red-50 text-red-600 border-red-200',
};

// ── Default data ───────────────────────────────────────
const DEFAULT_ORGS: OrgRecord[] = [
  {
    id: 'org-1', code: 'ORG-001', chartTitle: 'Factory Organization Chart',
    department: 'Management', version: 'v1.0', status: 'Active',
    date: '2026-01-01', responsiblePerson: 'HR Manager', approvedBy: 'Managing Director',
    createdAt: new Date().toISOString(),
    tree: {
      id: 'n1', title: 'Managing Director', name: 'Mr. Rahman', department: 'Management', level: 'Top Management',
      children: [
        {
          id: 'n2', title: 'GM - Operations', name: 'Mr. Kamal', department: 'Operations', level: 'Senior Management',
          children: [
            {
              id: 'n3', title: 'Production Manager', name: 'Mr. Hossain', department: 'Production', level: 'Middle Management',
              children: [
                { id: 'n4', title: 'Cutting In-charge', name: 'Mr. Rahim', department: 'Cutting', level: 'Supervisory', children: [] },
                { id: 'n5', title: 'Sewing In-charge', name: 'Mr. Jamal', department: 'Sewing', level: 'Supervisory', children: [] },
                { id: 'n6', title: 'Finishing In-charge', name: 'Ms. Fatima', department: 'Finishing', level: 'Supervisory', children: [] },
              ]
            },
          ]
        },
        {
          id: 'n7', title: 'Quality Director', name: 'Mr. Ahmed', department: 'Quality', level: 'Senior Management',
          children: [
            {
              id: 'n8', title: 'QC Manager', name: 'Mr. Islam', department: 'QC', level: 'Middle Management',
              children: [
                { id: 'n9', title: 'QC Supervisor - Cutting', name: 'Mr. Rafi', department: 'QC', level: 'Supervisory', children: [] },
                { id: 'n10', title: 'QC Supervisor - Sewing', name: 'Ms. Nasrin', department: 'QC', level: 'Supervisory', children: [] },
              ]
            },
            { id: 'n12', title: 'QMS Manager', name: 'Mr. Faruk', department: 'Quality', level: 'Middle Management', children: [] },
          ]
        },
        {
          id: 'n13', title: 'HR & Admin Manager', name: 'Ms. Akter', department: 'HR', level: 'Senior Management',
          children: [
            { id: 'n14', title: 'Training Officer', name: 'Mr. Billah', department: 'HR', level: 'Middle Management', children: [] },
            { id: 'n15', title: 'Compliance Officer', name: 'Ms. Sultana', department: 'Compliance', level: 'Middle Management', children: [] },
          ]
        },
      ]
    }
  },
  {
    id: 'org-2', code: 'ORG-002', chartTitle: 'Quality Department Organization',
    department: 'Quality', version: 'v1.0', status: 'Active',
    date: '2026-01-15', responsiblePerson: 'Quality Director', approvedBy: 'Managing Director',
    createdAt: new Date().toISOString(),
    tree: {
      id: 'q1', title: 'Quality Director', name: 'Mr. Ahmed', department: 'Quality', level: 'Senior Management',
      children: [
        {
          id: 'q2', title: 'QC Manager', name: 'Mr. Islam', department: 'QC', level: 'Middle Management',
          children: [
            {
              id: 'q3', title: 'QC Supervisor - Cutting', name: 'Mr. Rafi', department: 'QC-Cutting', level: 'Supervisory',
              children: [
                { id: 'q4', title: 'Fabric Inspector', name: 'Mr. Sumon', department: 'QC-Cutting', level: 'Operational', children: [] },
                { id: 'q5', title: 'Spreading QC', name: 'Ms. Rima', department: 'QC-Cutting', level: 'Operational', children: [] },
                { id: 'q6', title: 'Cut Panel Checker', name: 'Mr. Nasir', department: 'QC-Cutting', level: 'Operational', children: [] },
              ]
            },
            {
              id: 'q7', title: 'QC Supervisor - Sewing', name: 'Ms. Nasrin', department: 'QC-Sewing', level: 'Supervisory',
              children: [
                { id: 'q8', title: 'Inline QC Inspector', name: 'Mr. Dipu', department: 'QC-Sewing', level: 'Operational', children: [] },
                { id: 'q9', title: 'End Line Inspector', name: 'Ms. Moni', department: 'QC-Sewing', level: 'Operational', children: [] },
                { id: 'q10', title: 'Roaming QC', name: 'Mr. Hashem', department: 'QC-Sewing', level: 'Operational', children: [] },
              ]
            },
            {
              id: 'q11', title: 'QC Supervisor - Finishing', name: 'Mr. Sohel', department: 'QC-Finishing', level: 'Supervisory',
              children: [
                { id: 'q12', title: 'Final Inspector', name: 'Ms. Tania', department: 'QC-Finishing', level: 'Operational', children: [] },
                { id: 'q13', title: 'AQL Inspector', name: 'Mr. Robin', department: 'QC-Finishing', level: 'Operational', children: [] },
              ]
            },
          ]
        },
        {
          id: 'q14', title: 'QMS Manager', name: 'Mr. Faruk', department: 'QMS', level: 'Middle Management',
          children: [
            { id: 'q15', title: 'Document Controller', name: 'Ms. Laboni', department: 'QMS', level: 'Supervisory', children: [] },
            { id: 'q16', title: 'Internal Auditor', name: 'Mr. Sajib', department: 'QMS', level: 'Supervisory', children: [] },
            { id: 'q17', title: 'CAPA Coordinator', name: 'Ms. Jesmin', department: 'QMS', level: 'Supervisory', children: [] },
          ]
        },
        {
          id: 'q18', title: 'Lab Manager', name: 'Mr. Kabir', department: 'Lab', level: 'Middle Management',
          children: [
            { id: 'q19', title: 'Physical Test Technician', name: 'Mr. Milon', department: 'Lab', level: 'Operational', children: [] },
            { id: 'q20', title: 'Color Matching Specialist', name: 'Ms. Sharmin', department: 'Lab', level: 'Operational', children: [] },
          ]
        },
      ]
    }
  },
  {
    id: 'org-3', code: 'ORG-003', chartTitle: 'Production Floor Organization',
    department: 'Production', version: 'v1.0', status: 'Active',
    date: '2026-02-01', responsiblePerson: 'Production Manager', approvedBy: 'GM - Operations',
    createdAt: new Date().toISOString(),
    tree: {
      id: 'p1', title: 'Production Manager', name: 'Mr. Hossain', department: 'Production', level: 'Middle Management',
      children: [
        {
          id: 'p2', title: 'Cutting In-charge', name: 'Mr. Rahim', department: 'Cutting', level: 'Supervisory',
          children: [
            { id: 'p3', title: 'Cutting Operator', name: 'Mr. Bacchu', department: 'Cutting', level: 'Operational', children: [] },
            { id: 'p4', title: 'Spreading Operator', name: 'Mr. Liton', department: 'Cutting', level: 'Operational', children: [] },
            { id: 'p5', title: 'Pattern Master', name: 'Mr. Manik', department: 'Cutting', level: 'Operational', children: [] },
            { id: 'p6', title: 'Bundling Operator', name: 'Ms. Rupa', department: 'Cutting', level: 'Operational', children: [] },
          ]
        },
        {
          id: 'p7', title: 'Sewing In-charge', name: 'Mr. Jamal', department: 'Sewing', level: 'Supervisory',
          children: [
            { id: 'p8', title: 'Line Chief - Line 1', name: 'Mr. Helal', department: 'Sewing', level: 'Operational', children: [] },
            { id: 'p9', title: 'Line Chief - Line 2', name: 'Mr. Shamim', department: 'Sewing', level: 'Operational', children: [] },
            { id: 'p10', title: 'Line Chief - Line 3', name: 'Ms. Rahima', department: 'Sewing', level: 'Operational', children: [] },
            { id: 'p11', title: 'Sample Room Head', name: 'Mr. Babul', department: 'Sewing', level: 'Operational', children: [] },
          ]
        },
        {
          id: 'p12', title: 'Finishing In-charge', name: 'Ms. Fatima', department: 'Finishing', level: 'Supervisory',
          children: [
            { id: 'p13', title: 'Iron & Press Supervisor', name: 'Mr. Rajib', department: 'Finishing', level: 'Operational', children: [] },
            { id: 'p14', title: 'Packing Supervisor', name: 'Ms. Shilpi', department: 'Finishing', level: 'Operational', children: [] },
            { id: 'p15', title: 'Spot Cleaning Operator', name: 'Mr. Dulal', department: 'Finishing', level: 'Operational', children: [] },
          ]
        },
        {
          id: 'p16', title: 'Wash Manager', name: 'Mr. Asad', department: 'Washing', level: 'Supervisory',
          children: [
            { id: 'p17', title: 'Wash Operator', name: 'Mr. Jewel', department: 'Washing', level: 'Operational', children: [] },
            { id: 'p18', title: 'Dryer Operator', name: 'Mr. Mamun', department: 'Washing', level: 'Operational', children: [] },
          ]
        },
      ]
    }
  },
  {
    id: 'org-4', code: 'ORG-004', chartTitle: 'Compliance & Safety Department',
    department: 'Compliance', version: 'v1.0', status: 'Active',
    date: '2026-02-15', responsiblePerson: 'Compliance Manager', approvedBy: 'Managing Director',
    createdAt: new Date().toISOString(),
    tree: {
      id: 'c1', title: 'Compliance Manager', name: 'Mr. Zahid', department: 'Compliance', level: 'Middle Management',
      children: [
        {
          id: 'c2', title: 'Social Compliance Officer', name: 'Ms. Sultana', department: 'Social Compliance', level: 'Supervisory',
          children: [
            { id: 'c3', title: 'Welfare Officer', name: 'Ms. Nargis', department: 'Welfare', level: 'Operational', children: [] },
            { id: 'c4', title: 'Grievance Handler', name: 'Mr. Belal', department: 'HR', level: 'Operational', children: [] },
          ]
        },
        {
          id: 'c5', title: 'EHS Officer', name: 'Mr. Ripon', department: 'Safety', level: 'Supervisory',
          children: [
            { id: 'c6', title: 'Fire Safety In-charge', name: 'Mr. Alamin', department: 'Safety', level: 'Operational', children: [] },
            { id: 'c7', title: 'First Aid Coordinator', name: 'Ms. Poly', department: 'Safety', level: 'Operational', children: [] },
            { id: 'c8', title: 'Building Safety Inspector', name: 'Mr. Toha', department: 'Safety', level: 'Operational', children: [] },
          ]
        },
        {
          id: 'c9', title: 'Environmental Officer', name: 'Ms. Ayesha', department: 'Environment', level: 'Supervisory',
          children: [
            { id: 'c10', title: 'ETP Operator', name: 'Mr. Kamrul', department: 'Environment', level: 'Operational', children: [] },
            { id: 'c11', title: 'Waste Management Officer', name: 'Mr. Fazlu', department: 'Environment', level: 'Operational', children: [] },
          ]
        },
        {
          id: 'c12', title: 'Audit Coordinator', name: 'Mr. Shakil', department: 'Audit', level: 'Supervisory',
          children: [
            { id: 'c13', title: 'Internal Auditor', name: 'Mr. Tanvir', department: 'Audit', level: 'Operational', children: [] },
            { id: 'c14', title: 'Documentation Assistant', name: 'Ms. Liza', department: 'Audit', level: 'Operational', children: [] },
          ]
        },
      ]
    }
  },
];

// ── Count nodes ────────────────────────────────────────
const countNodes = (n: OrgNode): number => 1 + (n.children || []).reduce((s, c) => s + countNodes(c), 0);

import mermaid from 'mermaid';

// ── Mermaid Conversion ──────────────────────────────────
const MERMAID_THEME = `%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ffffff', 'primaryTextColor': '#1e293b', 'primaryBorderColor': '#e2e8f0', 'lineColor': '#94a3b8', 'secondaryColor': '#f8fafc', 'tertiaryColor': '#ffffff' }}}%%`;

function orgToMermaid(node: OrgNode): string {
  let lines: string[] = ['graph TD'];
  
  // Style definitions
  lines.push('  classDef top fill:#7c3aed,color:#fff,stroke:#7c3aed,stroke-width:2px');
  lines.push('  classDef senior fill:#1d4ed8,color:#fff,stroke:#1d4ed8,stroke-width:2px');
  lines.push('  classDef middle fill:#0891b2,color:#fff,stroke:#0891b2,stroke-width:2px');
  lines.push('  classDef supervisor fill:#059669,color:#fff,stroke:#059669,stroke-width:2px');
  lines.push('  classDef operational fill:#d97706,color:#fff,stroke:#d97706,stroke-width:2px');

  function traverse(n: OrgNode) {
    const safeLabel = (n.title || '').replace(/"/g, "'");
    const safeName = (n.name || '').replace(/"/g, "'") || '—';
    const safeDept = (n.department || '').replace(/"/g, "'");
    
    const label = `"${safeLabel}<br/><b>${safeName}</b><br/><small>${safeDept}</small>"`;
    const classMap: Record<string, string> = {
      'Top Management': 'top',
      'Senior Management': 'senior',
      'Middle Management': 'middle',
      'Supervisory': 'supervisor',
      'Operational': 'operational'
    };
    const cls = classMap[n.level] || 'operational';
    lines.push(`  ${n.id}[${label}]`);
    lines.push(`  class ${n.id} ${cls}`);

    (n.children || []).forEach(child => {
      lines.push(`  ${n.id} --> ${child.id}`);
      traverse(child);
    });
  }

  traverse(node);
  return lines.join('\n');
}

function MermaidOrgPreview({ chartCode }: { chartCode: string }) {
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, securityLevel: 'loose', theme: 'base' });
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const render = async () => {
      if (!chartCode) return;
      try {
        const id = `mermaid-org-${Math.random().toString(36).substring(2, 11)}`;
        const { svg: renderedSvg } = await mermaid.render(id, MERMAID_THEME + '\n' + chartCode);
        if (!isCancelled) setSvg(renderedSvg);
      } catch (err) {
        console.error('Mermaid render error:', err);
      }
    };
    render();
    return () => { isCancelled = true; };
  }, [chartCode]);

  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-white rounded-2xl overflow-auto select-none shadow-inner mermaid-render"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// ═══════════════════════════════════════════════════════
// TREE NODE EDITOR (sidebar panel, flat list style)
// ═══════════════════════════════════════════════════════
interface NodeEditorProps {
  node: OrgNode;
  onUpdate: (n: OrgNode) => void;
  onDelete?: () => void;
  onAddSibling?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  depth?: number;
  inputClass: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const NodeEditor: React.FC<NodeEditorProps> = ({ node, onUpdate, onDelete, onAddSibling, onMoveUp, onMoveDown, onDuplicate, depth = 0, inputClass, isFirst, isLast }) => {
  const [open, setOpen] = useState(depth < 2);
  const lvl = LEVELS[node.level] || LEVELS['Operational'];

  const addChild = () => {
    const child: OrgNode = { id: `n${Date.now()}`, title: 'New Position', name: '', department: node.department, level: 'Operational', children: [] };
    onUpdate({ ...node, children: [...(node.children || []), child] });
  };
  const updateChild = (i: number, updated: OrgNode) => { const nc = [...(node.children || [])]; nc[i] = updated; onUpdate({ ...node, children: nc }); };
  const deleteChild = (i: number) => onUpdate({ ...node, children: (node.children || []).filter((_, idx) => idx !== i) });
  const moveChildUp = (i: number) => {
    if (i <= 0) return;
    const nc = [...(node.children || [])];
    [nc[i - 1], nc[i]] = [nc[i], nc[i - 1]];
    onUpdate({ ...node, children: nc });
  };
  const moveChildDown = (i: number) => {
    const nc = [...(node.children || [])];
    if (i >= nc.length - 1) return;
    [nc[i], nc[i + 1]] = [nc[i + 1], nc[i]];
    onUpdate({ ...node, children: nc });
  };
  const duplicateChild = (i: number) => {
    const nc = [...(node.children || [])];
    const cloneNode = (n: OrgNode): OrgNode => ({
      ...n, id: `n${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      children: (n.children || []).map(c => cloneNode(c)),
    });
    nc.splice(i + 1, 0, cloneNode(nc[i]));
    onUpdate({ ...node, children: nc });
  };
  const addSiblingChild = (afterIndex: number) => {
    const newSib: OrgNode = { id: `n${Date.now()}`, title: 'New Position', name: '', department: node.department, level: node.children?.[afterIndex]?.level || 'Operational', children: [] };
    const nc = [...(node.children || [])];
    nc.splice(afterIndex + 1, 0, newSib);
    onUpdate({ ...node, children: nc });
  };

  return (
    <div style={{ marginLeft: depth > 0 ? 16 : 0, borderLeft: depth > 0 ? `2px solid ${lvl.color}30` : 'none', paddingLeft: depth > 0 ? 12 : 0 }}>
      <div className="bg-bg-1 border border-border-main rounded-xl mb-2 overflow-hidden group shadow-sm">
        <div className="flex items-center gap-2 px-3 py-2 cursor-pointer select-none" onClick={() => setOpen(o => !o)}>
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: lvl.color }} />
          <span className="flex-1 text-xs font-semibold text-text-1 truncate">{node.title || 'Untitled'}</span>
          {open ? <ChevronDown className="w-3.5 h-3.5 text-text-3 flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-text-3 flex-shrink-0" />}
        </div>

        {open && (
          <div className="px-3 pb-3 space-y-2 border-t border-border-main">
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="text-[9px] font-bold text-text-3 uppercase tracking-wide block mb-1">Title</label>
                <input className={`${inputClass} text-xs`} value={node.title} placeholder="Position Title"
                  onChange={e => onUpdate({ ...node, title: e.target.value })} />
              </div>
              <div>
                <label className="text-[9px] font-bold text-text-3 uppercase tracking-wide block mb-1">Name</label>
                <input className={`${inputClass} text-xs`} value={node.name} placeholder="Person Name"
                  onChange={e => onUpdate({ ...node, name: e.target.value })} />
              </div>
              <div>
                <label className="text-[9px] font-bold text-text-3 uppercase tracking-wide block mb-1">Level</label>
                <select className={`${inputClass} text-xs`} value={node.level} onChange={e => onUpdate({ ...node, level: e.target.value })}>
                  {Object.keys(LEVELS).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="flex items-end justify-end gap-1">
                 {onDelete && (
                    <button className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all shadow-sm border border-red-100" title="Delete" onClick={onDelete}><Trash2 className="w-4 h-4" /></button>
                 )}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button className="flex items-center gap-1.5 text-[10px] font-bold text-accent px-3 py-1.5 bg-accent/5 rounded-lg border border-accent/10 hover:bg-accent/10 transition-all"
                onClick={addChild}>
                <Plus className="w-3 h-3" /> Sub-position
              </button>
              {onAddSibling && (
                <button className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
                  onClick={e => { e.stopPropagation(); onAddSibling(); }}>
                  <Users className="w-3 h-3" /> Add Same-Level
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {open && (node.children || []).map((child, i) => (
        <NodeEditor key={child.id} node={child}
          onUpdate={n => updateChild(i, n)}
          onDelete={() => deleteChild(i)}
          onAddSibling={() => addSiblingChild(i)}
          onMoveUp={() => moveChildUp(i)}
          onMoveDown={() => moveChildDown(i)}
          onDuplicate={() => duplicateChild(i)}
          depth={depth + 1}
          inputClass={inputClass}
          isFirst={i === 0}
          isLast={i === (node.children || []).length - 1}
        />
      ))}
    </div>
  );
};

// ── Export logic ───────────────────────────────────────
async function exportOrgPNG(record: OrgRecord) {
  const svgEl = document.querySelector('.mermaid-render svg');
  if (!svgEl) return;
  const canvas = document.createElement('canvas');
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width * 2; canvas.height = img.height * 2;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const link = document.createElement('a');
    link.download = `${record.code}_Organogram.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

async function exportOrgPDF(record: OrgRecord) {
  const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
  const svgEl = document.querySelector('.mermaid-render svg');
  if (!svgEl) return;
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width * 2; canvas.height = img.height * 2;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imgData = canvas.toDataURL('image/png');
    await exportDetailToPDF({
      moduleName: 'Organizational Hierarchy Report',
      moduleId: 'organogram',
      recordId: record.code,
      fileName: `${record.code}_Chart`,
      orientation: 'landscape',
      sections: [
        {
          title: 'Document Identification',
          fields: [
            { label: 'Chart Description', value: record.chartTitle },
            { label: 'Organization Code', value: record.code },
            { label: 'Revision Level',    value: record.version },
            { label: 'Effective Date',    value: record.date },
          ]
        },
        {
          title: 'Responsibility & Authority',
          fields: [
            { label: 'Business Process',   value: record.department },
            { label: 'Chart Responsible',  value: record.responsiblePerson || '—' },
            { label: 'Approved By',        value: record.approvedBy || '—' },
            { label: 'Status',             value: record.status },
          ]
        }
      ],
      attachments: [{ name: 'Hierarchy Visualization', data: imgData }]
    });
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════
export function OrganogramPage({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [records, setRecords] = useState<OrgRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<OrgRecord | null>(null);
  const [mode, setMode] = useState<'list' | 'view' | 'add' | 'edit'>('list');
  const [formData, setFormData] = useState<Partial<OrgRecord>>({});
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [exporting, setExporting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const count = await db.organogram.count();
        if (count === 0) await db.organogram.bulkPut(DEFAULT_ORGS as any[]);
        const data = await db.organogram.toArray();
        setRecords(data as unknown as OrgRecord[]);
      } catch { setRecords(DEFAULT_ORGS); }
    })();
  }, []);

  const filtered = records.filter(r =>
    r.chartTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this organogram?')) return;
    try { await db.organogram.delete(id); } catch { }
    setRecords(records.filter(r => r.id !== id));
    if (selectedRecord?.id === id) { setSelectedRecord(null); setMode('list'); }
  };

  const openAdd = () => {
    setFormData({
      code: `ORG-${String(records.length + 1).padStart(3, '0')}`,
      chartTitle: '', department: 'Management', version: 'v1.0', status: 'Draft',
      date: new Date().toISOString().split('T')[0], responsiblePerson: '', approvedBy: '',
      tree: { id: 'root', title: 'Managing Director', name: '', department: 'Management', level: 'Top Management', children: [] }
    });
    setMode('add');
  };

  const openEdit = (r: OrgRecord) => { setFormData({ ...r }); setSelectedRecord(r); setMode('edit'); };

  const handleSave = async () => {
    if (!formData.chartTitle) { alert('Chart title is required.'); return; }
    const isNew = mode === 'add';
    const record = {
      ...formData,
      id: isNew ? 'org-' + Date.now() : formData.id,
      createdAt: isNew ? new Date().toISOString() : formData.createdAt,
    } as OrgRecord;
    try { await db.organogram.put(record as any); } catch { }
    setRecords(isNew ? [record, ...records] : records.map(r => r.id === record.id ? record : r));
    setMode('list');
  };

  const inputClass = "w-full px-3 py-2 bg-bg-2 border border-border-main rounded-xl text-sm text-text-1 placeholder:text-text-3 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all";
  const labelClass = "block text-xs font-semibold text-text-2 mb-1.5";

  // ── LIST ──
  if (mode === 'list') return (
    <motion.div className="p-4 md:p-6 lg:p-8 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-1 flex items-center gap-3">
            <Network className="w-7 h-7 text-accent" /> Organogram
          </h1>
          <p className="text-text-3 text-sm mt-1">Organizational structure & hierarchy charts</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm" onClick={openAdd}>
          <Plus className="w-4 h-4" /> New Organogram
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Charts', value: records.length, color: 'bg-blue-500', icon: Network },
          { label: 'Active', value: records.filter(r => r.status === 'Active').length, color: 'bg-emerald-500', icon: UserCheck },
          { label: 'Departments', value: new Set(records.map(r => r.department)).size, color: 'bg-violet-500', icon: Building },
          { label: 'Positions', value: records.reduce((s, r) => s + countNodes(r.tree), 0), color: 'bg-amber-500', icon: Users },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-bg-1 border border-border-main rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${s.color} flex-shrink-0`}><s.icon className="w-5 h-5 text-white" /></div>
            <div>
              <div className="text-2xl font-black text-text-1">{s.value}</div>
              <div className="text-xs text-text-3 font-semibold uppercase tracking-wide">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-bg-1 rounded-2xl border border-border-main p-4 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input type="text" placeholder="Search organograms by title or code..." className={`${inputClass} pl-10`}
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((r, idx) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            className="bg-bg-1 rounded-2xl border border-border-main shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group">
            <div className="bg-gradient-to-br from-bg-2/80 to-bg-2/30 p-4 border-b border-border-main overflow-hidden cursor-pointer h-[160px] flex items-center justify-center"
               onClick={() => { setSelectedRecord(r); setMode('view'); }}>
              <div className="w-full h-full transform scale-[0.4] origin-center opacity-60">
                 <MermaidOrgPreview chartCode={orgToMermaid(r.tree)} />
              </div>
            </div>
            <div className="p-4 flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-accent tracking-widest">{r.code}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${STATUS_STYLE[r.status]}`}>{r.status}</span>
              </div>
              <h3 className="font-bold text-text-1 text-sm mb-1 group-hover:text-accent transition-colors line-clamp-1">{r.chartTitle}</h3>
              <p className="text-xs text-text-3">{r.department} · {countNodes(r.tree)} positions · {r.version}</p>
            </div>
            <div className="px-4 py-3 border-t border-border-main bg-bg-2/20 flex items-center justify-between" onClick={e => e.stopPropagation()}>
              <button className="text-xs font-semibold text-text-2 hover:text-accent transition-colors flex items-center gap-1"
                onClick={() => { setSelectedRecord(r); setMode('view'); }}>
                <Eye className="w-3.5 h-3.5" /> View
              </button>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-accent/10 text-text-3 hover:text-accent transition-all" onClick={() => openEdit(r)} title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 rounded-lg hover:bg-blue-50 text-text-3 hover:text-blue-500 transition-all" onClick={async () => { setExporting(true); await exportOrgPNG(r); setExporting(false); }} title="Export PNG"><Download className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 text-text-3 hover:text-red-500 transition-all" onClick={async () => { setExporting(true); await exportOrgPDF(r); setExporting(false); }} title="Export PDF"><FileDown className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 text-text-3 hover:text-red-500 transition-all" onClick={() => handleDelete(r.id)} title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center py-20 text-text-3">
            <Network className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-semibold">No organograms found.</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  // ── VIEW ──
  if (mode === 'view' && selectedRecord) return (
    <motion.div className="flex flex-col h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Sticky topbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-bg-1 border-b border-border-main shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button className="p-2 bg-bg-2 border border-border-main rounded-xl hover:bg-bg-1 transition-colors" onClick={() => setMode('list')}>
            <ChevronLeft className="w-5 h-5 text-text-2" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-1">{selectedRecord.chartTitle}</h1>
            <p className="text-text-3 text-xs">{selectedRecord.code} · {countNodes(selectedRecord.tree)} positions · {selectedRecord.version}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-bg-2 rounded-xl border border-border-main overflow-hidden">
            <button className="px-3 py-2 hover:bg-bg-1 transition-colors text-text-2" onClick={() => setZoom(z => Math.max(0.3, z - 0.15))}><ZoomOut className="w-4 h-4" /></button>
            <span className="text-xs font-bold text-text-2 px-2 min-w-[44px] text-center">{Math.round(zoom * 100)}%</span>
            <button className="px-3 py-2 hover:bg-bg-1 transition-colors text-text-2" onClick={() => setZoom(z => Math.min(2.5, z + 0.15))}><ZoomIn className="w-4 h-4" /></button>
          </div>
          <button className="p-2 bg-bg-2 border border-border-main rounded-xl hover:bg-bg-1 transition-colors text-text-2" onClick={() => { setZoom(1); setPanX(0); setPanY(0); }}><Maximize2 className="w-4 h-4" /></button>
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-2 border border-border-main rounded-xl text-sm font-medium text-text-2 hover:border-accent hover:text-accent transition-all" onClick={() => openEdit(selectedRecord)}>
            <Edit2 className="w-4 h-4" /> Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-2 border border-border-main rounded-xl text-sm font-medium text-text-2 hover:border-blue-500 hover:text-blue-500 transition-all"
            onClick={async () => { setExporting(true); await exportOrgPNG(selectedRecord); setExporting(false); }}>
            <Download className="w-4 h-4" /> {exporting ? 'Exporting…' : 'PNG'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
            onClick={async () => { setExporting(true); await exportOrgPDF(selectedRecord); setExporting(false); }}>
            <FileDown className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap px-6 py-3 bg-bg-2/30 border-b border-border-main flex-shrink-0">
        <span className="text-[10px] font-bold text-text-3 uppercase tracking-widest">Legend:</span>
        {Object.entries(LEVELS).map(([lvl, cfg]) => (
          <span key={lvl} className="flex items-center gap-1.5 text-[11px] text-text-2">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
            {lvl}
          </span>
        ))}
      </div>

      {/* Chart canvas */}
      <div className="flex-1 overflow-hidden relative bg-[radial-gradient(circle_at_50%_50%,var(--bg-2)_0%,var(--bg-0)_100%)]"
        ref={chartRef}
        onMouseDown={e => { setIsPanning(true); setPanStart({ x: e.clientX - panX, y: e.clientY - panY }); }}
        onMouseMove={e => { if (isPanning) { setPanX(e.clientX - panStart.x); setPanY(e.clientY - panStart.y); } }}
        onMouseUp={() => setIsPanning(false)}
        onMouseLeave={() => setIsPanning(false)}
        onWheel={e => setZoom(z => Math.max(0.3, Math.min(2.5, z - e.deltaY * 0.001)))}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}>
          <div className="w-full max-w-[1200px]" style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: isPanning ? 'none' : 'transform 0.1s',
          }}>
            <MermaidOrgPreview chartCode={orgToMermaid(selectedRecord.tree)} />
          </div>
      </div>
    </motion.div>
  );

  // ── ADD / EDIT ──
  return (
    <motion.div className="flex flex-col h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Sticky header */}
      <div className="flex items-center justify-between px-6 py-4 bg-bg-1 border-b border-border-main shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button className="p-2 bg-bg-2 border border-border-main rounded-xl hover:bg-bg-1 transition-colors" onClick={() => setMode('list')}>
            <ChevronLeft className="w-5 h-5 text-text-2" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-1">{mode === 'add' ? 'Create Organogram' : 'Edit Organogram'}</h1>
            <p className="text-text-3 text-xs">Build your organizational hierarchy</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm" onClick={handleSave}>
          <Save className="w-4 h-4" /> Save Chart
        </button>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — form + node editor */}
        <div className="w-[380px] flex-shrink-0 border-r border-border-main flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Meta fields */}
            <div className="bg-bg-1 rounded-2xl border border-border-main p-4 space-y-3">
              <h3 className="text-xs font-bold text-text-1 uppercase tracking-widest border-b border-border-main pb-2">Chart Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Code</label><input className={inputClass} value={formData.code || ''} onChange={e => setFormData({ ...formData, code: e.target.value })} /></div>
                <div><label className={labelClass}>Version</label><input className={inputClass} value={formData.version || ''} onChange={e => setFormData({ ...formData, version: e.target.value })} /></div>
              </div>
              <div><label className={labelClass}>Chart Title *</label><input className={inputClass} value={formData.chartTitle || ''} onChange={e => setFormData({ ...formData, chartTitle: e.target.value })} placeholder="e.g. Factory Organization Chart" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Department</label><input className={inputClass} value={formData.department || ''} onChange={e => setFormData({ ...formData, department: e.target.value })} /></div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select className={inputClass} value={formData.status || 'Draft'} onChange={e => setFormData({ ...formData, status: e.target.value as any })}>
                    {['Active', 'Draft', 'Archived'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Responsible</label><input className={inputClass} value={formData.responsiblePerson || ''} onChange={e => setFormData({ ...formData, responsiblePerson: e.target.value })} /></div>
                <div><label className={labelClass}>Approved By</label><input className={inputClass} value={formData.approvedBy || ''} onChange={e => setFormData({ ...formData, approvedBy: e.target.value })} /></div>
              </div>
            </div>

            {/* Node tree editor */}
            <div className="bg-bg-1 rounded-2xl border border-border-main p-4">
              <div className="flex items-center justify-between border-b border-border-main pb-2 mb-3">
                <h3 className="text-xs font-bold text-text-1 uppercase tracking-widest">Hierarchy Structure</h3>
                <button className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-500 px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-all border border-emerald-200"
                  onClick={() => {
                    if (!formData.tree) return;
                    const newSection: OrgNode = {
                      id: `n${Date.now()}`, title: 'New Section',
                      name: '', department: formData.department || 'Department',
                      level: 'Senior Management', children: []
                    };
                    setFormData({
                      ...formData,
                      tree: { ...formData.tree, children: [...(formData.tree.children || []), newSection] }
                    });
                  }}>
                  <Plus className="w-3 h-3" /> Add Main Section
                </button>
              </div>
              <div className="text-[9px] text-text-3 flex items-center gap-4 mb-3 bg-bg-2/50 rounded-lg px-3 py-2">
                <span className="flex items-center gap-1"><Plus className="w-2.5 h-2.5 text-accent" /> Sub-position</span>
                <span className="flex items-center gap-1"><Users className="w-2.5 h-2.5 text-emerald-600" /> Same level</span>
                <span className="flex items-center gap-1"><Layers className="w-2.5 h-2.5 text-blue-500" /> Duplicate</span>
                <span className="flex items-center gap-1"><ChevronDown className="w-2.5 h-2.5 text-text-3 rotate-180" /> Reorder</span>
              </div>
              {formData.tree && (
                <NodeEditor node={formData.tree} onUpdate={n => setFormData({ ...formData, tree: n })} inputClass={inputClass} />
              )}
            </div>
          </div>
        </div>

        {/* Right — live preview */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border-main flex items-center justify-between bg-bg-2/30 flex-shrink-0">
            <span className="text-xs font-bold text-text-2 flex items-center gap-2"><Network className="w-3.5 h-3.5" /> Live Preview</span>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg hover:bg-bg-1 text-text-3 transition-all" onClick={() => setZoom(z => Math.max(0.3, z - 0.15))}><ZoomOut className="w-3.5 h-3.5" /></button>
              <span className="text-xs text-text-3">{Math.round(zoom * 100)}%</span>
              <button className="p-1.5 rounded-lg hover:bg-bg-1 text-text-3 transition-all" onClick={() => setZoom(z => Math.min(2.5, z + 0.15))}><ZoomIn className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-[radial-gradient(circle_at_50%_50%,var(--bg-2)_0%,var(--bg-0)_100%)] flex justify-center p-8">
            {formData.tree && (
              <div className="w-full max-w-[1000px]" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
                 <MermaidOrgPreview chartCode={orgToMermaid(formData.tree)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
