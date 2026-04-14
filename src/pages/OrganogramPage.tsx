import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Network, Plus, Search, Trash2, Edit2, Eye, Save, X, ChevronLeft,
  User, Building, Users, Crown, Briefcase, Shield, Award,
  Download, FileDown, ZoomIn, ZoomOut, Maximize2,
  ChevronDown, ChevronRight, GripVertical, UserCheck, Layers
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { db } from '../db/db';

// ── Types ──────────────────────────────────────────────
interface OrgNode {
  id: string;
  title: string;
  name: string;
  department: string;
  level: string;
  children: OrgNode[];
  collapsed?: boolean;
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
];

// ── Count nodes ────────────────────────────────────────
const countNodes = (n: OrgNode): number => 1 + (n.children || []).reduce((s, c) => s + countNodes(c), 0);

// ═══════════════════════════════════════════════════════
// SVG ORG TREE RENDERER — pure, crisp, no DOM quirks
// ═══════════════════════════════════════════════════════
const NODE_W = 180;
const NODE_H = 70;
const H_GAP = 24;
const V_GAP = 60;

interface LayoutNode {
  node: OrgNode;
  x: number;
  y: number;
  width: number;
}

function layoutTree(node: OrgNode, depth: number = 0): { layouts: LayoutNode[]; width: number } {
  if (!node.children || node.children.length === 0 || node.collapsed) {
    return { layouts: [{ node, x: 0, y: depth * (NODE_H + V_GAP), width: NODE_W }], width: NODE_W };
  }
  const childResults = node.children.map(c => layoutTree(c, depth + 1));
  const totalChildWidth = childResults.reduce((s, r) => s + r.width, 0) + H_GAP * (childResults.length - 1);
  const myWidth = Math.max(NODE_W, totalChildWidth);
  const myX = myWidth / 2 - NODE_W / 2;
  const layouts: LayoutNode[] = [{ node, x: myX, y: depth * (NODE_H + V_GAP), width: NODE_W }];
  let cx = (myWidth - totalChildWidth) / 2;
  childResults.forEach(r => {
    r.layouts.forEach(l => layouts.push({ ...l, x: l.x + cx, y: l.y }));
    cx += r.width + H_GAP;
  });
  return { layouts, width: myWidth };
}

function OrgSvgTree({ tree, onNodeClick }: { tree: OrgNode; onNodeClick?: (id: string) => void }) {
  const { layouts, width } = layoutTree(tree);
  const totalLevels = Math.max(...layouts.map(l => Math.floor(l.y / (NODE_H + V_GAP))));
  const svgH = (totalLevels + 1) * (NODE_H + V_GAP) + 20;
  const svgW = width + 40;

  // Build parent map
  const parentOf: Record<string, LayoutNode> = {};
  const nodeMap: Record<string, LayoutNode> = {};
  layouts.forEach(l => { nodeMap[l.node.id] = l; });
  function buildParent(n: OrgNode) {
    (n.children || []).forEach(c => { parentOf[c.id] = nodeMap[n.id]; buildParent(c); });
  }
  buildParent(tree);

  return (
    <svg width={svgW} height={svgH} style={{ overflow: 'visible' }}>
      <g transform="translate(20, 10)">
        {/* Draw connector lines first */}
        {layouts.map(l => {
          const parent = parentOf[l.node.id];
          if (!parent) return null;
          const px = parent.x + NODE_W / 2;
          const py = parent.y + NODE_H;
          const cx = l.x + NODE_W / 2;
          const cy = l.y;
          const midY = (py + cy) / 2;
          return (
            <path key={`edge-${l.node.id}`}
              d={`M ${px} ${py} C ${px} ${midY}, ${cx} ${midY}, ${cx} ${cy}`}
              fill="none" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="none"
            />
          );
        })}

        {/* Draw nodes */}
        {layouts.map(l => {
          const lvl = LEVELS[l.node.level] || LEVELS['Operational'];
          const hasChildren = l.node.children && l.node.children.length > 0;
          return (
            <g key={l.node.id} transform={`translate(${l.x}, ${l.y})`}
              onClick={() => onNodeClick?.(l.node.id)}
              style={{ cursor: onNodeClick ? 'pointer' : 'default' }}>
              {/* Card shadow */}
              <rect x={3} y={3} width={NODE_W} height={NODE_H} rx={10} fill="rgba(0,0,0,0.08)" />
              {/* Card body */}
              <rect x={0} y={0} width={NODE_W} height={NODE_H} rx={10}
                fill="white" stroke={lvl.border} strokeWidth={2} />
              {/* Left accent bar */}
              <rect x={0} y={0} width={6} height={NODE_H} rx={4} fill={lvl.color} />
              {/* Top level badge */}
              <rect x={16} y={8} width={NODE_W - 32} height={16} rx={4} fill={lvl.bg} />
              <text x={NODE_W / 2} y={19} textAnchor="middle" fontSize={9} fontWeight="700"
                fill={lvl.text} fontFamily="Inter, Arial, sans-serif" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {l.node.level}
              </text>
              {/* Title */}
              <text x={16} y={38} fontSize={11} fontWeight="700" fill="#1e293b"
                fontFamily="Inter, Arial, sans-serif" clipPath={undefined}>
                {l.node.title.length > 22 ? l.node.title.slice(0, 22) + '…' : l.node.title}
              </text>
              {/* Name */}
              <text x={16} y={53} fontSize={9.5} fill="#64748b" fontFamily="Inter, Arial, sans-serif">
                {l.node.name || '—'}
              </text>
              {/* Dept */}
              {l.node.department && (
                <text x={16} y={65} fontSize={8} fill="#94a3b8" fontFamily="Inter, Arial, sans-serif">
                  {l.node.department}
                </text>
              )}
              {/* Collapse indicator */}
              {hasChildren && !l.node.collapsed && (
                <circle cx={NODE_W / 2} cy={NODE_H + 2} r={5} fill={lvl.color} />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════
// TREE NODE EDITOR (sidebar panel, flat list style)
// ═══════════════════════════════════════════════════════
interface NodeEditorProps {
  node: OrgNode;
  onUpdate: (n: OrgNode) => void;
  onDelete?: () => void;
  depth?: number;
  inputClass: string;
}

const NodeEditor: React.FC<NodeEditorProps> = ({ node, onUpdate, onDelete, depth = 0, inputClass }) => {
  const [open, setOpen] = useState(depth < 2);
  const lvl = LEVELS[node.level] || LEVELS['Operational'];

  const addChild = () => {
    const child: OrgNode = { id: `n${Date.now()}`, title: 'New Position', name: '', department: node.department, level: 'Operational', children: [] };
    onUpdate({ ...node, children: [...(node.children || []), child] });
  };
  const updateChild = (i: number, updated: OrgNode) => { const nc = [...(node.children || [])]; nc[i] = updated; onUpdate({ ...node, children: nc }); };
  const deleteChild = (i: number) => onUpdate({ ...node, children: (node.children || []).filter((_, idx) => idx !== i) });

  return (
    <div style={{ marginLeft: depth > 0 ? 16 : 0, borderLeft: depth > 0 ? `2px solid ${lvl.color}30` : 'none', paddingLeft: depth > 0 ? 12 : 0 }}>
      <div className="bg-bg-1 border border-border-main rounded-xl mb-2 overflow-hidden group">
        <div className="flex items-center gap-2 px-3 py-2 cursor-pointer select-none" onClick={() => setOpen(o => !o)}>
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: lvl.color }} />
          <span className="flex-1 text-xs font-semibold text-text-1 truncate">{node.title || 'Untitled'}</span>
          <span className="text-[9px] text-text-3 uppercase tracking-wide hidden group-hover:block">{node.level}</span>
          {onDelete && (
            <button className="p-1 rounded hover:bg-red-50 text-text-3 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
              onClick={e => { e.stopPropagation(); onDelete(); }}>
              <Trash2 className="w-3 h-3" />
            </button>
          )}
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
                <label className="text-[9px] font-bold text-text-3 uppercase tracking-wide block mb-1">Department</label>
                <input className={`${inputClass} text-xs`} value={node.department} placeholder="Dept."
                  onChange={e => onUpdate({ ...node, department: e.target.value })} />
              </div>
              <div>
                <label className="text-[9px] font-bold text-text-3 uppercase tracking-wide block mb-1">Level</label>
                <select className={`${inputClass} text-xs`} value={node.level} onChange={e => onUpdate({ ...node, level: e.target.value })}>
                  {Object.keys(LEVELS).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <button className="flex items-center gap-1 text-[10px] font-semibold text-accent hover:text-accent/80 mt-1 transition-colors"
              onClick={addChild}>
              <Plus className="w-3 h-3" /> Add Sub-position
            </button>
          </div>
        )}
      </div>
      {open && (node.children || []).map((child, i) => (
        <NodeEditor key={child.id} node={child} onUpdate={n => updateChild(i, n)} onDelete={() => deleteChild(i)} depth={depth + 1} inputClass={inputClass} />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// HIGH-QUALITY EXPORT FUNCTIONS (Canvas-based)
// ═══════════════════════════════════════════════════════

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function renderOrgToCanvas(record: OrgRecord, scale: number = 2): HTMLCanvasElement {
  const { layouts, width } = layoutTree(record.tree);
  const maxY = Math.max(...layouts.map(l => l.y));
  const svgW = width + 80;
  const svgH = maxY + NODE_H + 60;

  const HEADER = 120;
  const FOOTER = 90;
  const PAD = 40;

  const canvas = document.createElement('canvas');
  canvas.width = (svgW + PAD * 2) * scale;
  canvas.height = (svgH + HEADER + FOOTER) * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);

  const W = svgW + PAD * 2;
  const H = svgH + HEADER + FOOTER;

  // Background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff';
  drawRoundRect(ctx, 16, 16, W - 32, H - 32, 12);
  ctx.fill();

  // ── Header ──
  const headerGrad = ctx.createLinearGradient(0, 0, W, 0);
  headerGrad.addColorStop(0, '#1e3a8a');
  headerGrad.addColorStop(1, '#1d4ed8');
  ctx.fillStyle = headerGrad;
  drawRoundRect(ctx, 16, 16, W - 32, HEADER - 10, 12);
  ctx.fill();

  // Header text
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(16, HEADER - 10, W - 32, 4);

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${20}px "Arial", sans-serif`;
  ctx.textBaseline = 'top';
  ctx.fillText(record.chartTitle.toUpperCase(), 36, 30);

  ctx.font = `${11}px "Arial", sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText(`${record.code}  ·  ${record.department}  ·  Version ${record.version}  ·  Status: ${record.status}`, 36, 56);
  ctx.fillText(`Responsible: ${record.responsiblePerson || '—'}  ·  Approved By: ${record.approvedBy || '—'}`, 36, 74);
  ctx.fillText(`Positions: ${countNodes(record.tree)}  ·  Generated: ${new Date().toLocaleDateString('en-GB')}`, 36, 92);

  // ── Connector lines ──
  const nodeMap: Record<string, LayoutNode> = {};
  layouts.forEach(l => { nodeMap[l.node.id] = l; });
  const parentOf: Record<string, LayoutNode> = {};
  function buildParentMap(n: OrgNode) {
    (n.children || []).forEach(c => { parentOf[c.id] = nodeMap[n.id]; buildParentMap(c); });
  }
  buildParentMap(record.tree);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  layouts.forEach(l => {
    const parent = parentOf[l.node.id];
    if (!parent) return;
    const px = parent.x + PAD + NODE_W / 2;
    const py = parent.y + HEADER + NODE_H;
    const cx = l.x + PAD + NODE_W / 2;
    const cy = l.y + HEADER;
    const midY = (py + cy) / 2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.bezierCurveTo(px, midY, cx, midY, cx, cy);
    ctx.stroke();
  });

  // ── Nodes ──
  layouts.forEach(l => {
    const lvl = LEVELS[l.node.level] || LEVELS['Operational'];
    const nx = l.x + PAD;
    const ny = l.y + HEADER;

    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.10)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = '#ffffff';
    drawRoundRect(ctx, nx, ny, NODE_W, NODE_H, 10);
    ctx.fill();
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

    // Border
    ctx.strokeStyle = lvl.border;
    ctx.lineWidth = 2;
    drawRoundRect(ctx, nx, ny, NODE_W, NODE_H, 10);
    ctx.stroke();

    // Left accent bar
    ctx.fillStyle = lvl.color;
    drawRoundRect(ctx, nx, ny, 6, NODE_H, 4);
    ctx.fill();

    // Level badge bg
    ctx.fillStyle = lvl.bg;
    drawRoundRect(ctx, nx + 14, ny + 6, NODE_W - 28, 15, 4);
    ctx.fill();

    // Level text
    ctx.fillStyle = lvl.text;
    ctx.font = `bold 8px "Arial", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(l.node.level.toUpperCase(), nx + NODE_W / 2, ny + 13.5);

    // Title
    ctx.fillStyle = '#1e293b';
    ctx.font = `bold 11px "Arial", sans-serif`;
    ctx.textAlign = 'left';
    const titleText = l.node.title.length > 22 ? l.node.title.slice(0, 22) + '…' : l.node.title;
    ctx.fillText(titleText, nx + 14, ny + 32);

    // Name
    ctx.fillStyle = '#64748b';
    ctx.font = `9px "Arial", sans-serif`;
    ctx.fillText(l.node.name || '—', nx + 14, ny + 46);

    // Dept
    ctx.fillStyle = '#94a3b8';
    ctx.font = `8px "Arial", sans-serif`;
    ctx.fillText(l.node.department, nx + 14, ny + 59);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  });

  // ── Footer ──
  const footerY = H - FOOTER;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(16, footerY, W - 32, FOOTER - 16);

  // Signature zones
  const sigW = (W - 100) / 3;
  ['Prepared By', 'Reviewed By', 'Approved By'].forEach((label, i) => {
    const sx = 50 + i * (sigW + 25);
    const sigLineY = footerY + 45;
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx, sigLineY);
    ctx.lineTo(sx + sigW - 20, sigLineY);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = `bold 10px "Arial", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(label, sx + (sigW - 20) / 2, sigLineY + 5);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = `8px "Arial", sans-serif`;
    ctx.fillText('Name / Date', sx + (sigW - 20) / 2, sigLineY + 18);
  });

  // Footer bottom bar info
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(16, H - 32, W - 32, 16);
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 9px "Arial", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`QMS Organogram  ·  ${record.code}  ·  ${record.chartTitle}`, 26, H - 24);
  ctx.textAlign = 'right';
  ctx.fillText(`Generated: ${new Date().toLocaleString('en-GB')}`, W - 26, H - 24);

  return canvas;
}

async function exportOrgPNG(record: OrgRecord) {
  const canvas = renderOrgToCanvas(record, 2);
  const url = canvas.toDataURL('image/png', 1.0);
  const a = document.createElement('a'); a.href = url; a.download = `${record.code}_Organogram.png`; a.click();
}

async function exportOrgPDF(record: OrgRecord) {
  const canvas = renderOrgToCanvas(record, 2);
  const imgData = canvas.toDataURL('image/png', 1.0);
  const aspectRatio = canvas.width / canvas.height;

  const doc = new jsPDF({ orientation: aspectRatio > 1 ? 'l' : 'p', unit: 'mm', format: 'a4' });
  const pgW = doc.internal.pageSize.getWidth();
  const pgH = doc.internal.pageSize.getHeight();

  const margin = 8;
  const availW = pgW - margin * 2;
  const availH = pgH - margin * 2;
  const ratio = Math.min(availW / (canvas.width / 2), availH / (canvas.height / 2));
  const imgW = (canvas.width / 2) * ratio;
  const imgH = (canvas.height / 2) * ratio;
  const imgX = margin + (availW - imgW) / 2;
  const imgY = margin + (availH - imgH) / 2;

  doc.addImage(imgData, 'PNG', imgX, imgY, imgW, imgH);
  doc.save(`${record.code}_Organogram.pdf`);
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
            {/* Mini preview */}
            <div className="bg-gradient-to-br from-bg-2/80 to-bg-2/30 p-4 border-b border-border-main overflow-hidden cursor-pointer"
              style={{ height: 160 }} onClick={() => { setSelectedRecord(r); setMode('view'); }}>
              <div className="flex justify-center items-start" style={{ transform: 'scale(0.38)', transformOrigin: 'top center', width: '100%' }}>
                <OrgSvgTree tree={r.tree} />
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
        <div style={{
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: 'center top',
          transition: isPanning ? 'none' : 'transform 0.1s',
          display: 'flex',
          justifyContent: 'center',
          padding: '40px',
          minWidth: 'max-content',
        }}>
          <OrgSvgTree tree={selectedRecord.tree} />
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
              <h3 className="text-xs font-bold text-text-1 uppercase tracking-widest border-b border-border-main pb-2 mb-3">Hierarchy Structure</h3>
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
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
                <OrgSvgTree tree={formData.tree} />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
