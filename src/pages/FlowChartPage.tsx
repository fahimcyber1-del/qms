import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GitBranch, Plus, Search, Trash2, Edit2, Save, FileDown, X, Copy,
  ChevronLeft, Network, LayoutDashboard, Box, Play, XSquare,
  AlertTriangle, CheckCircle2, Clock, Settings2, Layers, Maximize2,
  Scissors, Activity, Package, Shield, User, Calendar, Tag,
  Zap, RefreshCw, Image as ImageIcon, FileText, Filter,
  ArrowRight, Download
} from 'lucide-react';
import {
  ReactFlow, Controls, Background, MiniMap, addEdge, applyNodeChanges, applyEdgeChanges,
  Node, Edge, Connection, NodeChange, EdgeChange, BackgroundVariant,
  ReactFlowProvider, useReactFlow, Handle, Position, NodeProps,
  useNodesInitialized,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { jsPDF } from 'jspdf';
import { db } from '../db/db';

// ── Types ───────────────────────────────────────────────
export type FlowStatus = 'Draft' | 'Pending Review' | 'Approved' | 'Archived';

export interface FlowChartRecord {
  id: string;
  code: string;
  title: string;
  department: string;
  processOwner: string;
  version: string;
  status: FlowStatus;
  createdAt: string;
  updatedAt: string;
  nodes: Node[];
  edges: Edge[];
  description: string;
  changeHistory: { date: string; user: string; note: string }[];
}

// ── Constants ────────────────────────────────────────────
const DEPARTMENTS = ['Cutting','Sewing','Finishing','Quality','Merchandising','Washing','Packing','Management','Lab','IE','HR','Audit'];

const STATUS_CONFIG: Record<FlowStatus, { label: string; color: string; bg: string; icon: any }> = {
  'Draft':          { label: 'Draft',          color: 'text-slate-500',   bg: 'bg-slate-100 border-slate-200',    icon: Edit2 },
  'Pending Review': { label: 'Pending Review', color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200',     icon: Clock },
  'Approved':       { label: 'Approved',       color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  'Archived':       { label: 'Archived',       color: 'text-red-500',     bg: 'bg-red-50 border-red-200',         icon: XSquare },
};

const DEPT_ICONS: Record<string, any> = {
  'Cutting': Scissors, 'Sewing': Activity, 'Finishing': Package, 'Quality': Shield,
  'Merchandising': Tag, 'Packing': Package, 'Management': LayoutDashboard, 'Audit': AlertTriangle,
  'Lab': Zap, 'IE': Activity, 'HR': User, 'Washing': RefreshCw,
};

// ── Node style helpers ───────────────────────────────────
const handleStyle = (color: string) => ({ background: color, border: '2px solid #fff', width: 10, height: 10 });

function NodeHandles({ color }: { color: string }) {
  return (
    <>
      <Handle type="source" position={Position.Bottom} style={handleStyle(color)} />
      <Handle type="target" position={Position.Top}    style={handleStyle(color)} />
      <Handle type="source" position={Position.Right}  style={handleStyle(color)} />
      <Handle type="target" position={Position.Left}   style={handleStyle(color)} />
    </>
  );
}

// ── Custom Node Types ────────────────────────────────────
function TerminalNode({ data, selected }: NodeProps) {
  return (
    <div style={{
      background: 'linear-gradient(135deg,#1d4ed8,#1e40af)',
      border: `3px solid ${selected ? '#93c5fd' : '#1e3a8a'}`,
      borderRadius: 50, padding: '12px 32px', minWidth: 170, textAlign: 'center',
      boxShadow: selected ? '0 0 0 4px rgba(96,165,250,0.3),0 8px 24px rgba(29,78,216,0.5)' : '0 4px 16px rgba(29,78,216,0.4)',
    }}>
      <NodeHandles color="#1e3a8a" />
      <span style={{ color: '#fff', fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', lineHeight: 1.3, display: 'block', fontFamily: 'Inter,Arial,sans-serif' }}>
        {data.label as string}
      </span>
    </div>
  );
}

function ProcessNode({ data, selected }: NodeProps) {
  return (
    <div style={{
      background: 'linear-gradient(135deg,#1d4ed8,#1565c0)',
      border: `3px solid ${selected ? '#93c5fd' : '#1e3a8a'}`,
      borderRadius: 8, padding: '14px 20px', minWidth: 190, textAlign: 'center',
      boxShadow: selected ? '0 0 0 3px rgba(96,165,250,0.3)' : '0 2px 12px rgba(0,0,0,0.25)',
    }}>
      <NodeHandles color="#1e3a8a" />
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: 0.5, lineHeight: 1.4, display: 'block', fontFamily: 'Inter,Arial,sans-serif' }}>
        {data.label as string}
      </span>
    </div>
  );
}

function QCNode({ data, selected }: NodeProps) {
  return (
    <div style={{
      background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
      border: `3px solid ${selected ? '#c4b5fd' : '#4c1d95'}`,
      borderRadius: 8, padding: '14px 18px', minWidth: 180, textAlign: 'center',
      boxShadow: selected ? '0 0 0 3px rgba(167,139,250,0.4)' : '0 2px 12px rgba(124,58,237,0.4)',
    }}>
      <NodeHandles color="#4c1d95" />
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3, fontFamily: 'Inter,Arial,sans-serif' }}>QC Inspection</div>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 12, lineHeight: 1.4, display: 'block', fontFamily: 'Inter,Arial,sans-serif' }}>
        {data.label as string}
      </span>
    </div>
  );
}

function RecordNode({ data, selected }: NodeProps) {
  return (
    <div style={{
      background: 'linear-gradient(135deg,#f59e0b,#d97706)',
      border: `3px solid ${selected ? '#fff' : '#92400e'}`,
      borderRadius: 8, padding: '10px 18px', minWidth: 140, textAlign: 'center',
      boxShadow: selected ? '0 0 0 3px rgba(252,211,77,0.5)' : '0 2px 10px rgba(217,119,6,0.35)',
    }}>
      <NodeHandles color="#92400e" />
      <div style={{ color: 'rgba(28,9,0,0.6)', fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2, fontFamily: 'Inter,Arial,sans-serif' }}>Record</div>
      <span style={{ color: '#1c1917', fontWeight: 700, fontSize: 11, lineHeight: 1.35, display: 'block', fontFamily: 'Inter,Arial,sans-serif' }}>
        {data.label as string}
      </span>
    </div>
  );
}

function DecisionNode({ data, selected }: NodeProps) {
  return (
    <div style={{ padding: 0, background: 'transparent', width: 140, height: 100, position: 'relative' }}>
      <NodeHandles color="#78350f" />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', width: 85, height: 85,
        transform: 'translate(-50%,-50%) rotate(45deg)',
        background: 'linear-gradient(135deg,#f59e0b,#d97706)',
        border: `3px solid ${selected ? '#fbbf24' : '#78350f'}`,
        boxShadow: selected ? '0 0 0 3px rgba(251,191,36,0.4)' : '0 2px 12px rgba(0,0,0,0.3)',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        color: '#1c1917', fontWeight: 800, fontSize: 11, textAlign: 'center',
        padding: '0 10px', fontFamily: 'Inter,Arial,sans-serif', zIndex: 2, pointerEvents: 'none', lineHeight: 1.3,
      }}>{data.label as string}</div>
    </div>
  );
}

function DecisionPassNode({ data, selected }: NodeProps) {
  return (
    <div style={{ padding: 0, background: 'transparent', width: 110, height: 85, position: 'relative' }}>
      <NodeHandles color="#14532d" />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', width: 72, height: 72,
        transform: 'translate(-50%,-50%) rotate(45deg)',
        background: 'linear-gradient(135deg,#22c55e,#16a34a)',
        border: `3px solid ${selected ? '#86efac' : '#14532d'}`,
        boxShadow: selected ? '0 0 0 3px rgba(134,239,172,0.4)' : '0 2px 12px rgba(0,0,0,0.3)',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        color: '#fff', fontWeight: 900, fontSize: 13, textAlign: 'center',
        fontFamily: 'Inter,Arial,sans-serif', zIndex: 2, pointerEvents: 'none',
      }}>{data.label as string}</div>
    </div>
  );
}

function DecisionFailNode({ data, selected }: NodeProps) {
  return (
    <div style={{ padding: 0, background: 'transparent', width: 110, height: 85, position: 'relative' }}>
      <NodeHandles color="#7f1d1d" />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', width: 72, height: 72,
        transform: 'translate(-50%,-50%) rotate(45deg)',
        background: 'linear-gradient(135deg,#ef4444,#dc2626)',
        border: `3px solid ${selected ? '#fca5a5' : '#7f1d1d'}`,
        boxShadow: selected ? '0 0 0 3px rgba(252,165,165,0.4)' : '0 2px 12px rgba(0,0,0,0.3)',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        color: '#fff', fontWeight: 900, fontSize: 13, textAlign: 'center',
        fontFamily: 'Inter,Arial,sans-serif', zIndex: 2, pointerEvents: 'none',
      }}>{data.label as string}</div>
    </div>
  );
}

const NODE_TYPES = {
  terminal: TerminalNode, process: ProcessNode, qc: QCNode,
  decision: DecisionNode, decision_pass: DecisionPassNode, decision_fail: DecisionFailNode,
  record: RecordNode,
};

// ── Node factory ─────────────────────────────────────────
function makeNode(type: string, label: string, x: number, y: number): Node {
  return {
    id: `n${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    position: { x, y }, data: { label }, type,
  };
}

function makeEdge(source: string, target: string, label?: string): Edge {
  return {
    id: `e${source}_${target}_${Date.now()}`,
    source, target, animated: false,
    label: label || undefined,
    labelStyle: label ? { fill: '#1e3a5f', fontWeight: 700, fontSize: 11, fontFamily: 'Inter,Arial' } : undefined,
    labelBgStyle: label ? { fill: '#fff', fillOpacity: 0.9 } : undefined,
    labelBgPadding: [6, 3] as [number, number],
    style: { strokeWidth: 2.5, stroke: '#1e293b' },
    markerEnd: { type: 'arrowclosed' as any, color: '#1e293b', width: 14, height: 14 },
  };
}

// ── Templates ────────────────────────────────────────────
function buildTemplateFlow(steps: string[], types?: string[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = steps.map((label, i) =>
    makeNode(types?.[i] || (i === 0 || i === steps.length - 1 ? 'terminal' : 'process'), label, 280, i * 130)
  );
  const edges: Edge[] = nodes.slice(0, -1).map((n, i) => makeEdge(n.id, nodes[i + 1].id));
  return { nodes, edges };
}

const TEMPLATES_RAW = [
  { code: 'FC-001', title: 'Order Management Flow', department: 'Merchandising', processOwner: 'Merchandising Manager', description: 'End-to-end buyer order flow.',
    ...buildTemplateFlow(['Buyer Order Received','Order Review','Tech Pack Review','Costing Approval','Order Confirmation','Production Planning'], ['terminal','process','process','decision','process','terminal']) },
  { code: 'FC-002', title: 'Fabric Inspection Flow', department: 'Quality', processOwner: 'Fabric QC Officer', description: '4-point fabric inspection workflow.',
    ...buildTemplateFlow(['Fabric Receive','Fabric Identification','4 Point Inspection','Defect Recording','Inspection Report','Accept / Reject'], ['terminal','process','qc','record','process','decision']) },
  { code: 'FC-003', title: 'Cutting Process Flow', department: 'Cutting', processOwner: 'Cutting Manager', description: 'Standard garment cutting process.',
    ...buildTemplateFlow(['Cutting Plan','Fabric Relaxation','Fabric Spreading','Marker Placement','Cutting','Cutting QC Inspection','Bundle Numbering'], ['terminal','process','process','process','process','qc','terminal']) },
  { code: 'FC-004', title: 'Sewing QC Flow', department: 'Sewing', processOwner: 'Sewing QC Manager', description: 'In-line sewing quality control.',
    ...buildTemplateFlow(['Bundle Input','Line Setup','Pilot Run','Inline QC','Defect Correction','End Line Inspection'], ['terminal','process','process','qc','process','qc']) },
  { code: 'FC-005', title: 'Finishing Flow', department: 'Finishing', processOwner: 'Finishing Manager', description: 'Garment finishing and packing approval.',
    ...buildTemplateFlow(['Thread Cutting','Ironing','Spot Cleaning','Finishing QC','Measurement Check','Packing Approval'], ['terminal','process','process','qc','qc','terminal']) },
  { code: 'FC-006', title: 'Final Inspection Flow', department: 'Quality', processOwner: 'Quality Manager', description: 'AQL-based pre-shipment final inspection.',
    ...buildTemplateFlow(['Lot Selection','AQL Sampling','Visual Inspection','Measurement Inspection','Defect Classification','PASS','FAIL'], ['terminal','process','qc','qc','qc','decision_pass','decision_fail']) },
  { code: 'FC-007', title: 'Shipment Release Flow', department: 'Merchandising', processOwner: 'Shipment Coordinator', description: 'Post-final-inspection shipment release.',
    ...buildTemplateFlow(['Final Inspection Pass','Documentation Review','Buyer Approval','Shipment Booking','Shipment Release'], ['terminal','process','decision','process','terminal']) },
];

function buildDefaultTemplates(): FlowChartRecord[] {
  return TEMPLATES_RAW.map((t, i) => ({
    ...t, id: 'fc-' + Date.now() + '-' + i, version: 'v1.0', status: 'Approved' as FlowStatus,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    changeHistory: [{ date: new Date().toISOString(), user: 'System', note: 'Template imported.' }],
  }));
}

// ═══════════════════════════════════════════════════════
// PROFESSIONAL PDF/PNG EXPORT (Canvas-based)
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

async function renderFlowToImage(reactFlowElement: HTMLElement): Promise<string> {
  // Use toPng from dom-to-image-more dynamically
  const domtoimage = await import('dom-to-image-more');
  return domtoimage.default.toPng(reactFlowElement, { bgcolor: '#ffffff', scale: 2 });
}

async function buildFlowExportCanvas(record: FlowChartRecord, flowImgSrc: string): Promise<HTMLCanvasElement> {
  const flowImg = new Image();
  await new Promise<void>(res => { flowImg.onload = () => res(); flowImg.src = flowImgSrc; });

  const SCALE = 1;
  const HEADER = 130;
  const FOOTER = 100;
  const PAD = 40;
  const MIN_W = 1400;

  const contentW = Math.max(flowImg.width ? flowImg.width / 2 : 1000, MIN_W);
  const contentH = flowImg.height ? (flowImg.height / 2) : 800;
  const totalW = contentW + PAD * 2;
  const totalH = HEADER + contentH + FOOTER + PAD * 2;

  const canvas = document.createElement('canvas');
  canvas.width = totalW * SCALE;
  canvas.height = totalH * SCALE;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(SCALE, SCALE);

  const W = totalW;
  const H = totalH;

  // ── Background ──
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff';
  drawRoundRect(ctx, 12, 12, W - 24, H - 24, 14);
  ctx.fill();

  // ── HEADER ──
  const hGrad = ctx.createLinearGradient(0, 0, W, 0);
  hGrad.addColorStop(0, '#0f172a');
  hGrad.addColorStop(0.5, '#1e3a8a');
  hGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = hGrad;
  drawRoundRect(ctx, 12, 12, W - 24, HEADER - 8, 14);
  ctx.fill();

  // Accent line under header
  const lineGrad = ctx.createLinearGradient(0, 0, W, 0);
  lineGrad.addColorStop(0, '#3b82f6');
  lineGrad.addColorStop(0.5, '#60a5fa');
  lineGrad.addColorStop(1, '#3b82f6');
  ctx.fillStyle = lineGrad;
  ctx.fillRect(12, HEADER - 8, W - 24, 3);

  // Company / chart title
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 22px Arial, sans-serif`;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText(record.title.toUpperCase(), 36, 28);

  // Subtitle info row
  ctx.font = `12px Arial, sans-serif`;
  ctx.fillStyle = 'rgba(148,163,184,1)';
  ctx.fillText(`${record.code}  ·  ${record.department} Department  ·  Process Owner: ${record.processOwner || '—'}  ·  Version: ${record.version}`, 36, 58);

  // Status badge
  const statusColors: Record<string, [string, string]> = {
    'Approved': ['#059669', '#d1fae5'], 'Draft': ['#64748b', '#f1f5f9'],
    'Pending Review': ['#d97706', '#fef3c7'], 'Archived': ['#dc2626', '#fee2e2'],
  };
  const [sBg, sFg] = statusColors[record.status] || ['#64748b', '#f1f5f9'];
  ctx.fillStyle = sFg;
  drawRoundRect(ctx, W - 160, 30, 130, 28, 6);
  ctx.fill();
  ctx.fillStyle = sBg;
  ctx.font = `bold 11px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(record.status.toUpperCase(), W - 95, 44);

  // Meta boxes
  const metaItems = [
    { label: 'NODES', value: String(record.nodes.length) },
    { label: 'CONNECTIONS', value: String(record.edges.length) },
    { label: 'CREATED', value: new Date(record.createdAt).toLocaleDateString('en-GB') },
    { label: 'UPDATED', value: new Date(record.updatedAt).toLocaleDateString('en-GB') },
  ];
  const boxW = 180, boxH = 40, boxY = 76;
  metaItems.forEach((item, i) => {
    const bx = 36 + i * (boxW + 10);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    drawRoundRect(ctx, bx, boxY, boxW, boxH, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    drawRoundRect(ctx, bx, boxY, boxW, boxH, 6);
    ctx.stroke();
    ctx.fillStyle = 'rgba(148,163,184,0.8)';
    ctx.font = `bold 8px Arial, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(item.label, bx + 10, boxY + 8);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 15px Arial, sans-serif`;
    ctx.textBaseline = 'bottom';
    ctx.fillText(item.value, bx + 10, boxY + boxH - 8);
  });

  // Description if exists
  if (record.description) {
    ctx.fillStyle = 'rgba(148,163,184,0.7)';
    ctx.font = `italic 10px Arial, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const desc = record.description.length > 100 ? record.description.slice(0, 100) + '…' : record.description;
    ctx.fillText(desc, 36, 78);
  }

  // ── Flow diagram ──
  const imgY = HEADER + PAD;
  const imgX = PAD;
  const imgW = contentW;
  const imgH = contentH;

  // Diagram background
  ctx.fillStyle = '#f8fafc';
  drawRoundRect(ctx, imgX, imgY, imgW, imgH, 10);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  drawRoundRect(ctx, imgX, imgY, imgW, imgH, 10);
  ctx.stroke();

  // Draw the flow image, fitting within the box
  const srcRatio = flowImg.width / flowImg.height;
  const boxRatio = imgW / imgH;
  let drawW = imgW, drawH = imgH, drawX = imgX, drawY = imgY;
  if (srcRatio > boxRatio) {
    drawW = imgW; drawH = imgW / srcRatio;
    drawY = imgY + (imgH - drawH) / 2;
  } else {
    drawH = imgH; drawW = imgH * srcRatio;
    drawX = imgX + (imgW - drawW) / 2;
  }
  ctx.save();
  drawRoundRect(ctx, imgX, imgY, imgW, imgH, 10);
  ctx.clip();
  ctx.drawImage(flowImg, drawX, drawY, drawW, drawH);
  ctx.restore();

  // ── FOOTER ──
  const footerY = imgY + imgH + PAD;

  // Signature strip
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(PAD, footerY, contentW, FOOTER - 20);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.strokeRect(PAD, footerY, contentW, FOOTER - 20);

  const sigLabels = ['Prepared By', 'Reviewed By', 'Approved By'];
  const sigW = (contentW - 60) / 3;
  sigLabels.forEach((label, i) => {
    const sx = PAD + 20 + i * (sigW + 20);
    const sigLineY = footerY + 55;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(sx, sigLineY); ctx.lineTo(sx + sigW - 10, sigLineY); ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = `bold 10px Arial, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(label, sx + (sigW - 10) / 2, sigLineY + 6);
    ctx.fillStyle = '#94a3b8';
    ctx.font = `8px Arial, sans-serif`;
    ctx.fillText('Name / Designation / Date', sx + (sigW - 10) / 2, sigLineY + 18);
  });

  // Bottom bar
  const bbY = footerY + FOOTER - 20;
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(PAD, bbY, contentW, 20);
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 9px Arial, sans-serif`;
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(`QMS Process Flowchart  ·  ${record.code}  ·  ${record.title}`, PAD + 12, bbY + 10);
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText(`Generated: ${new Date().toLocaleString('en-GB')}`, PAD + contentW - 12, bbY + 10);

  return canvas;
}

// ═══════════════════════════════════════════════════════
// CANVAS EDITOR (ReactFlow)
// ═══════════════════════════════════════════════════════
interface EditorProps { record: FlowChartRecord; onSave: (r: FlowChartRecord) => void; onClose: () => void; }

const NODE_BTNS = [
  { type: 'terminal',      label: 'Start/End',  bg: '#1d4ed8', desc: 'Oval — begin or end' },
  { type: 'process',       label: 'Process',    bg: '#1565c0', desc: 'Rectangle — step' },
  { type: 'qc',            label: 'QC Check',   bg: '#6d28d9', desc: 'Purple — inspection' },
  { type: 'decision',      label: 'Decision',   bg: '#b45309', desc: 'Diamond — branch' },
  { type: 'decision_pass', label: 'PASS',       bg: '#15803d', desc: 'Green diamond' },
  { type: 'decision_fail', label: 'FAIL',       bg: '#b91c1c', desc: 'Red diamond' },
  { type: 'record',        label: 'Record',     bg: '#d97706', desc: 'Yellow — document' },
];

function CanvasEditorInner({ record, onSave, onClose }: EditorProps) {
  const [nodes, setNodes] = useState<Node[]>(record.nodes);
  const [edges, setEdges] = useState<Edge[]>(record.edges);
  const [meta, setMeta] = useState({
    title: record.title, department: record.department, processOwner: record.processOwner,
    version: record.version, status: record.status as FlowStatus, description: record.description,
  });
  const [selected, setSelected] = useState<{ id: string; type: 'node' | 'edge'; label: string; nodeType?: string } | null>(null);
  const [panel, setPanel] = useState<'props' | 'meta' | null>(null);
  const [exporting, setExporting] = useState(false);
  const rf = useReactFlow();
  const flowRef = useRef<HTMLDivElement>(null);

  const onNodesChange = useCallback((c: NodeChange[]) => setNodes(n => applyNodeChanges(c, n)), []);
  const onEdgesChange = useCallback((c: EdgeChange[]) => setEdges(e => applyEdgeChanges(c, e)), []);
  const onConnect = useCallback((c: Connection) => {
    setEdges(es => addEdge({ ...c, style: { strokeWidth: 2.5, stroke: '#1e293b' }, markerEnd: { type: 'arrowclosed' as any, color: '#1e293b', width: 14, height: 14 } } as unknown as Edge, es));
  }, []);

  const spawnNode = (type: string) => {
    const labels: Record<string, string> = {
      terminal: 'Start / End', process: 'New Process Step', qc: 'QC Inspection',
      decision: 'Decision?', decision_pass: 'PASS', decision_fail: 'FAIL', record: 'Keep Record',
    };
    const vp = rf.getViewport();
    const x = (-vp.x + window.innerWidth / 2) / vp.zoom;
    const y = (-vp.y + window.innerHeight / 2) / vp.zoom;
    setNodes(ns => [...ns, makeNode(type, labels[type] || 'New Node', x, y)]);
  };

  const onSelectionChange = useCallback(({ nodes: sn, edges: se }: { nodes: Node[]; edges: Edge[] }) => {
    if (sn.length === 1) {
      setSelected({ id: sn[0].id, type: 'node', label: sn[0].data.label as string, nodeType: sn[0].type });
      setPanel('props');
    } else if (se.length === 1) {
      setSelected({ id: se[0].id, type: 'edge', label: se[0].label as string || '' });
      setPanel('props');
    } else {
      setSelected(null);
      setPanel(p => p === 'props' ? null : p);
    }
  }, []);

  const updateLabel = (val: string) => {
    if (!selected) return;
    setSelected(p => p ? { ...p, label: val } : null);
    if (selected.type === 'node')
      setNodes(ns => ns.map(n => n.id === selected.id ? { ...n, data: { ...n.data, label: val } } : n));
    else
      setEdges(es => es.map(e => e.id === selected.id ? { ...e, label: val, labelStyle: { fill: '#1e3a5f', fontWeight: 700, fontSize: 11 }, labelBgPadding: [6, 3] as [number, number] } : e));
  };

  const changeNodeType = (nodeType: string) => {
    if (!selected || selected.type !== 'node') return;
    setNodes(ns => ns.map(n => n.id === selected.id ? { ...n, type: nodeType } : n));
    setSelected(p => p ? { ...p, nodeType } : null);
  };

  const deleteSelected = () => {
    if (!selected) return;
    if (selected.type === 'node') setNodes(ns => ns.filter(n => n.id !== selected.id));
    else setEdges(es => es.filter(e => e.id !== selected.id));
    setSelected(null); setPanel(null);
  };

  const commit = () => onSave({ ...record, ...meta, nodes, edges, updatedAt: new Date().toISOString(), changeHistory: [{ date: new Date().toISOString(), user: 'QMS User', note: 'Updated.' }, ...record.changeHistory].slice(0, 20) });

  const handleExportPNG = async () => {
    setExporting(true);
    try {
      const rfEl = document.querySelector('.react-flow') as HTMLElement;
      if (!rfEl) throw new Error('No canvas');
      const imgSrc = await renderFlowToImage(rfEl);
      const tempRecord = { ...record, ...meta, nodes, edges };
      const canvas = await buildFlowExportCanvas(tempRecord, imgSrc);
      const url = canvas.toDataURL('image/png', 1.0);
      const a = document.createElement('a'); a.href = url; a.download = `${record.code}_Flowchart.png`; a.click();
    } catch (e) { console.error(e); alert('PNG export failed. Try again.'); }
    setExporting(false);
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const rfEl = document.querySelector('.react-flow') as HTMLElement;
      if (!rfEl) throw new Error('No canvas');
      const imgSrc = await renderFlowToImage(rfEl);
      const tempRecord = { ...record, ...meta, nodes, edges };
      const canvas = await buildFlowExportCanvas(tempRecord, imgSrc);
      const imgData = canvas.toDataURL('image/png', 1.0);
      const landscape = canvas.width > canvas.height;
      const doc = new jsPDF({ orientation: landscape ? 'l' : 'p', unit: 'mm', format: 'a4' });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      const ratio = Math.min(W / (canvas.width / 2), H / (canvas.height / 2));
      const iW = (canvas.width / 2) * ratio;
      const iH = (canvas.height / 2) * ratio;
      doc.addImage(imgData, 'PNG', (W - iW) / 2, (H - iH) / 2, iW, iH);
      doc.save(`${record.code}_Flowchart.pdf`);
    } catch (e) { console.error(e); alert('PDF export failed. Try again.'); }
    setExporting(false);
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px', background: '#0f1117', border: '1px solid #2d3147',
    borderRadius: 10, fontSize: 13, color: '#fff', outline: 'none',
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: '#0c0e16', fontFamily: '"Inter", system-ui, sans-serif' }}>
      {/* ── Top Bar ── */}
      <div style={{ height: 56, background: '#141621', borderBottom: '1px solid #2d3147', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onClose} style={{ padding: 8, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ArrowRight style={{ width: 18, height: 18, transform: 'rotate(180deg)' }} />
          </button>
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)' }} />
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{meta.title}</div>
            <div style={{ color: '#64748b', fontSize: 10, fontFamily: 'monospace' }}>{record.code} · {meta.department} · {meta.version}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {/* Node spawn buttons */}
          {NODE_BTNS.map(b => (
            <button key={b.type} onClick={() => spawnNode(b.type)}
              title={b.desc}
              style={{ padding: '6px 12px', background: b.bg, border: 'none', borderRadius: 8, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              + {b.label}
            </button>
          ))}

          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

          {/* Meta toggle */}
          <button onClick={() => setPanel(p => p === 'meta' ? null : 'meta')}
            style={{ padding: 8, borderRadius: 8, border: 'none', background: panel === 'meta' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}>
            <Settings2 style={{ width: 16, height: 16 }} />
          </button>

          {/* Fit view */}
          <button onClick={() => rf.fitView({ padding: 0.15 })}
            style={{ padding: 8, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
            title="Fit to screen">
            <Maximize2 style={{ width: 16, height: 16 }} />
          </button>

          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

          {/* Export buttons */}
          <button onClick={handleExportPNG} disabled={exporting}
            style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, opacity: exporting ? 0.5 : 1 }}>
            <ImageIcon style={{ width: 13, height: 13 }} /> PNG
          </button>
          <button onClick={handleExportPDF} disabled={exporting}
            style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, opacity: exporting ? 0.5 : 1 }}>
            <FileDown style={{ width: 13, height: 13 }} /> PDF
          </button>

          {/* Save */}
          <button onClick={commit}
            style={{ padding: '8px 20px', background: 'var(--accent, #2563eb)', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>
            <Save style={{ width: 15, height: 15 }} /> Save
          </button>
        </div>
      </div>

      {/* ── Canvas + Panel ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* ReactFlow Canvas */}
        <div style={{ flex: 1, position: 'relative' }} ref={flowRef}>
          <ReactFlow
            nodes={nodes} edges={edges}
            nodeTypes={NODE_TYPES}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            fitView
            style={{ background: '#0c0e16' }}
            deleteKeyCode="Backspace"
          >
            <Background variant={BackgroundVariant.Dots} gap={28} size={1.5} color="#1e2235" />
            <Controls style={{ background: '#141621', border: '1px solid #2d3147', borderRadius: 12 }} />
            <MiniMap nodeColor="#1976d2" maskColor="rgba(12,14,22,0.85)"
              style={{ background: '#141621', border: '1px solid #2d3147', borderRadius: 12 }} />
          </ReactFlow>

          {nodes.length === 0 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ textAlign: 'center', opacity: 0.4 }}>
                <GitBranch style={{ width: 52, height: 52, color: '#475569', margin: '0 auto 12px' }} />
                <p style={{ color: '#475569', fontWeight: 700, fontSize: 18 }}>Canvas is empty</p>
                <p style={{ color: '#334155', fontSize: 13, marginTop: 4 }}>Click the shape buttons above to add nodes</p>
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        <AnimatePresence>
          {panel && (
            <motion.div key="panel"
              initial={{ x: 310, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 310, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{ width: 300, background: '#141621', borderLeft: '1px solid #2d3147', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>

              <div style={{ padding: '14px 16px', borderBottom: '1px solid #2d3147', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {panel === 'meta' ? 'Flow Properties' : selected?.type === 'node' ? 'Node Properties' : 'Edge Properties'}
                </span>
                <button onClick={() => { setPanel(null); setSelected(null); }}
                  style={{ padding: 6, borderRadius: 7, border: 'none', background: 'rgba(255,255,255,0.05)', color: '#64748b', cursor: 'pointer', display: 'flex' }}>
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {panel === 'meta' ? (
                  <>
                    {[
                      { key: 'title', label: 'Flow Title' },
                      { key: 'processOwner', label: 'Process Owner' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ display: 'block', color: '#64748b', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{f.label}</label>
                        <input value={(meta as any)[f.key]} onChange={e => setMeta(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
                      </div>
                    ))}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ display: 'block', color: '#64748b', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Department</label>
                        <select value={meta.department} onChange={e => setMeta(p => ({ ...p, department: e.target.value }))} style={inputStyle}>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', color: '#64748b', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Version</label>
                        <input value={meta.version} onChange={e => setMeta(p => ({ ...p, version: e.target.value }))} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', color: '#64748b', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Status</label>
                      <select value={meta.status} onChange={e => setMeta(p => ({ ...p, status: e.target.value as FlowStatus }))} style={inputStyle}>
                        {(['Draft', 'Pending Review', 'Approved', 'Archived'] as FlowStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', color: '#64748b', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Description</label>
                      <textarea value={meta.description} onChange={e => setMeta(p => ({ ...p, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'none' }} />
                    </div>
                  </>
                ) : selected ? (
                  <>
                    <div>
                      <label style={{ display: 'block', color: '#64748b', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Label</label>
                      <textarea value={selected.label} onChange={e => updateLabel(e.target.value)} rows={3} autoFocus style={{ ...inputStyle, resize: 'none' }} />
                    </div>
                    {selected.type === 'node' && (
                      <div>
                        <label style={{ display: 'block', color: '#64748b', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Shape Type</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                          {NODE_BTNS.map(nb => (
                            <button key={nb.type} onClick={() => changeNodeType(nb.type)}
                              style={{
                                padding: '8px 10px', border: selected.nodeType === nb.type ? 'none' : '1px solid #2d3147',
                                borderRadius: 8, cursor: 'pointer', fontSize: 10, fontWeight: 700,
                                background: selected.nodeType === nb.type ? nb.bg : 'rgba(255,255,255,0.03)',
                                color: selected.nodeType === nb.type ? '#fff' : '#64748b',
                                display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
                              }}>
                              <span style={{ width: 8, height: 8, borderRadius: nb.type.includes('terminal') ? '50%' : 2, background: nb.bg, flexShrink: 0 }} />
                              {nb.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <button onClick={deleteSelected}
                      style={{ padding: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Trash2 style={{ width: 14, height: 14 }} /> Delete {selected.type === 'node' ? 'Node' : 'Connection'}
                    </button>
                    <p style={{ color: '#334155', fontSize: 10, textAlign: 'center' }}>Press <kbd>Backspace</kbd> / <kbd>Delete</kbd> to remove selected</p>
                  </>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CanvasEditor(props: EditorProps) {
  return (
    <ReactFlowProvider>
      <CanvasEditorInner {...props} />
    </ReactFlowProvider>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN LIST PAGE
// ═══════════════════════════════════════════════════════
export function FlowChartPage({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [records, setRecords] = useState<FlowChartRecord[]>([]);
  const [editing, setEditing] = useState<FlowChartRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ title: '', department: 'Quality', processOwner: '', version: 'v1.0', description: '' });
  const [exportingId, setExportingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const count = await db.processFlowChart.count();
        if (count === 0) { await db.processFlowChart.bulkPut(buildDefaultTemplates() as any[]); }
        const data = await db.processFlowChart.toArray();
        setRecords(data as unknown as FlowChartRecord[]);
      } catch { setRecords(buildDefaultTemplates()); }
    })();
  }, []);

  const filtered = useMemo(() => records.filter(r => {
    const q = searchTerm.toLowerCase();
    return (filterDept === 'All' || r.department === filterDept)
      && (filterStatus === 'All' || r.status === filterStatus)
      && (r.title.toLowerCase().includes(q) || r.code.toLowerCase().includes(q) || r.department.toLowerCase().includes(q));
  }), [records, searchTerm, filterDept, filterStatus]);

  const stats = useMemo(() => ({
    total: records.length,
    approved: records.filter(r => r.status === 'Approved').length,
    pending: records.filter(r => r.status === 'Pending Review').length,
    draft: records.filter(r => r.status === 'Draft').length,
  }), [records]);

  const handleSave = async (r: FlowChartRecord) => {
    try { await db.processFlowChart.put(r as any); } catch { }
    setRecords(prev => prev.some(x => x.id === r.id) ? prev.map(x => x.id === r.id ? r : x) : [r, ...prev]);
    setEditing(null);
  };

  const handleCreate = async () => {
    if (!newForm.title.trim()) return;
    const r: FlowChartRecord = {
      id: 'fc-' + Date.now(), code: `FC-${String(records.length + 1).padStart(3, '0')}`,
      title: newForm.title, department: newForm.department, processOwner: newForm.processOwner,
      version: newForm.version, status: 'Draft', description: newForm.description,
      nodes: [], edges: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      changeHistory: [{ date: new Date().toISOString(), user: 'QMS User', note: 'Created.' }],
    };
    try { await db.processFlowChart.put(r as any); } catch { }
    setRecords(prev => [r, ...prev]);
    setShowNew(false);
    setEditing(r);
    setNewForm({ title: '', department: 'Quality', processOwner: '', version: 'v1.0', description: '' });
  };

  const handleDuplicate = async (r: FlowChartRecord) => {
    const dup: FlowChartRecord = {
      ...r, id: 'fc-' + Date.now(), code: `FC-${String(records.length + 1).padStart(3, '0')}`,
      title: r.title + ' (Copy)', status: 'Draft',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      changeHistory: [{ date: new Date().toISOString(), user: 'QMS User', note: 'Duplicated.' }],
    };
    try { await db.processFlowChart.put(dup as any); } catch { }
    setRecords(prev => [dup, ...prev]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this flowchart?')) return;
    try { await db.processFlowChart.delete(id); } catch { }
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  // Quick export directly from list page
  const quickExportPNG = async (record: FlowChartRecord) => {
    setExportingId(record.id);
    // Render nodes as a simple static image using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1400; canvas.height = 900;
    const ctx = canvas.getContext('2d')!;

    // Build a simple branded document
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, 1400, 900);
    const hGrad = ctx.createLinearGradient(0, 0, 1400, 0);
    hGrad.addColorStop(0, '#0f172a'); hGrad.addColorStop(0.5, '#1e3a8a'); hGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = hGrad; ctx.fillRect(0, 0, 1400, 120);
    ctx.fillStyle = '#3b82f6'; ctx.fillRect(0, 120, 1400, 3);

    ctx.fillStyle = '#fff'; ctx.font = 'bold 28px Arial'; ctx.textBaseline = 'top'; ctx.textAlign = 'left';
    ctx.fillText(record.title.toUpperCase(), 40, 30);
    ctx.fillStyle = 'rgba(148,163,184,0.9)'; ctx.font = '13px Arial';
    ctx.fillText(`${record.code}  ·  ${record.department}  ·  ${record.version}  ·  Status: ${record.status}`, 40, 66);
    ctx.fillText(`Process Owner: ${record.processOwner || '—'}  ·  ${record.nodes.length} nodes, ${record.edges.length} connections`, 40, 86);

    // Flow diagram area placeholder with info
    ctx.fillStyle = '#ffffff'; ctx.fillRect(30, 140, 1340, 700);
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2; ctx.strokeRect(30, 140, 1340, 700);

    // Draw nodes as simple rectangles in their relative positions
    if (record.nodes.length > 0) {
      const xs = record.nodes.map(n => n.position.x);
      const ys = record.nodes.map(n => n.position.y);
      const minX = Math.min(...xs), maxX = Math.max(...xs) + 200;
      const minY = Math.min(...ys), maxY = Math.max(...ys) + 80;
      const scaleX = 1200 / Math.max(maxX - minX, 1);
      const scaleY = 620 / Math.max(maxY - minY, 1);
      const scale = Math.min(scaleX, scaleY, 1);

      const nodeColors: Record<string, string> = {
        terminal: '#1d4ed8', process: '#1565c0', qc: '#7c3aed', decision: '#d97706',
        decision_pass: '#15803d', decision_fail: '#b91c1c', record: '#f59e0b',
      };

      record.nodes.forEach(n => {
        const nx = 80 + (n.position.x - minX) * scale;
        const ny = 160 + (n.position.y - minY) * scale;
        const nw = 160 * Math.min(scale, 1);
        const nh = 52 * Math.min(scale, 1);
        const color = nodeColors[n.type || 'process'] || '#1565c0';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect?.(nx, ny, nw, nh, 6);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(9, 11 * scale)}px Arial`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const lbl = (n.data.label as string || '').length > 20 ? (n.data.label as string).slice(0, 20) + '…' : (n.data.label as string);
        ctx.fillText(lbl, nx + nw / 2, ny + nh / 2);
      });
    } else {
      ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 20px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Open in canvas editor to build the flowchart', 700, 490);
    }

    ctx.fillStyle = '#1e3a8a'; ctx.fillRect(0, 858, 1400, 32);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px Arial'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(`QMS Flowchart  ·  ${record.code}  ·  ${record.title}`, 20, 874);
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(`Generated: ${new Date().toLocaleString('en-GB')}`, 1380, 874);

    const url = canvas.toDataURL('image/png', 1.0);
    const a = document.createElement('a'); a.href = url; a.download = `${record.code}_Flowchart.png`; a.click();
    setExportingId(null);
  };

  const quickExportPDF = async (record: FlowChartRecord) => {
    setExportingId(record.id);
    const canvas = document.createElement('canvas');
    canvas.width = 2480; canvas.height = 1754; // A4 landscape @ 150dpi
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 2480, 1754);

    // Header
    const hGrad = ctx.createLinearGradient(0, 0, 2480, 0);
    hGrad.addColorStop(0, '#0f172a'); hGrad.addColorStop(0.5, '#1e3a8a'); hGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = hGrad; ctx.fillRect(0, 0, 2480, 200);
    ctx.fillStyle = '#3b82f6'; ctx.fillRect(0, 200, 2480, 5);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 52px Arial'; ctx.textBaseline = 'top'; ctx.textAlign = 'left';
    ctx.fillText(record.title.toUpperCase(), 60, 45);
    ctx.fillStyle = 'rgba(148,163,184,0.9)'; ctx.font = '24px Arial';
    ctx.fillText(`${record.code}  ·  ${record.department} Department  ·  Process Owner: ${record.processOwner || '—'}  ·  Version: ${record.version}`, 60, 110);
    ctx.fillText(`Description: ${record.description || 'No description.'}`, 60, 150);

    // Content area
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(30, 220, 2420, 1440);
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 3; ctx.strokeRect(30, 220, 2420, 1440);

    if (record.nodes.length > 0) {
      const xs = record.nodes.map(n => n.position.x);
      const ys = record.nodes.map(n => n.position.y);
      const minX = Math.min(...xs), maxX = Math.max(...xs) + 220;
      const minY = Math.min(...ys), maxY = Math.max(...ys) + 80;
      const scaleX = 2340 / Math.max(maxX - minX, 1);
      const scaleY = 1340 / Math.max(maxY - minY, 1);
      const scale = Math.min(scaleX, scaleY, 1.4);

      const nodeColors: Record<string, string> = {
        terminal: '#1d4ed8', process: '#1565c0', qc: '#7c3aed', decision: '#d97706',
        decision_pass: '#15803d', decision_fail: '#b91c1c', record: '#f59e0b',
      };

      record.nodes.forEach(n => {
        const nx = 60 + (n.position.x - minX) * scale;
        const ny = 240 + (n.position.y - minY) * scale;
        const nw = 200 * scale;
        const nh = 70 * scale;
        const color = nodeColors[n.type || 'process'] || '#1565c0';
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.roundRect?.(nx, ny, nw, nh, 10); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(14, 16 * scale)}px Arial`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const lbl = (n.data.label as string || '').length > 22 ? (n.data.label as string).slice(0, 22) + '…' : (n.data.label as string);
        ctx.fillText(lbl, nx + nw / 2, ny + nh / 2);
      });
    } else {
      ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 36px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Open in Canvas Editor to build the flowchart', 1240, 940);
    }

    // Footer
    ctx.fillStyle = '#1e3a8a'; ctx.fillRect(0, 1700, 2480, 54);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 18px Arial'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(`QMS Process Flowchart  ·  ${record.code}  ·  ${record.title}  ·  ${record.version}`, 40, 1727);
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(`Generated: ${new Date().toLocaleString('en-GB')}`, 2440, 1727);

    const imgData = canvas.toDataURL('image/png', 1.0);
    const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    doc.addImage(imgData, 'PNG', 0, 0, W, H);
    doc.save(`${record.code}_Flowchart.pdf`);
    setExportingId(null);
  };

  const inputClass = "w-full px-3 py-2 bg-bg-2 border border-border-main rounded-xl text-sm text-text-1 placeholder:text-text-3 focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-all";

  if (editing) return <CanvasEditor record={editing} onSave={handleSave} onClose={() => setEditing(null)} />;

  return (
    <motion.div className="p-4 md:p-6 lg:p-8 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-1 flex items-center gap-3">
            <GitBranch className="w-7 h-7 text-accent" /> Process Flow Charts
          </h1>
          <p className="text-text-3 text-sm mt-1">ISO 9001 process flowchart library — build, manage and export</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm" onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4" /> New Flow Chart
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Charts', value: stats.total, color: 'bg-blue-500', icon: GitBranch },
          { label: 'Approved', value: stats.approved, color: 'bg-emerald-500', icon: CheckCircle2 },
          { label: 'Pending Review', value: stats.pending, color: 'bg-amber-500', icon: Clock },
          { label: 'Drafts', value: stats.draft, color: 'bg-slate-400', icon: Edit2 },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-bg-1 border border-border-main rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${s.color} flex-shrink-0`}><s.icon className="w-5 h-5 text-white" /></div>
            <div>
              <div className="text-2xl font-black text-text-1">{s.value}</div>
              <div className="text-xs text-text-3 font-semibold uppercase tracking-wide">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-bg-1 border border-border-main rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input type="text" placeholder="Search flowcharts..." className={`${inputClass} pl-10`}
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className="px-3 py-2 bg-bg-2 border border-border-main rounded-xl text-sm text-text-1 outline-none focus:ring-2 focus:ring-accent/30"
          value={filterDept} onChange={e => setFilterDept(e.target.value)}>
          <option value="All">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="px-3 py-2 bg-bg-2 border border-border-main rounded-xl text-sm text-text-1 outline-none focus:ring-2 focus:ring-accent/30"
          value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          {['Draft', 'Pending Review', 'Approved', 'Archived'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((r, idx) => {
          const s = STATUS_CONFIG[r.status];
          const DI = DEPT_ICONS[r.department] || Network;
          return (
            <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
              className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
              {/* Top accent */}
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 rounded-t-2xl" />

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 rounded-xl dark:bg-blue-950/30"><DI className="w-5 h-5 text-blue-500" /></div>
                    <div>
                      <div className="text-[10px] font-black text-blue-500 tracking-widest">{r.code}</div>
                      <h3 className="font-bold text-text-1 text-sm leading-tight group-hover:text-accent transition-colors">{r.title}</h3>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${s.bg} ${s.color} flex-shrink-0`}>
                    <s.icon className="w-3 h-3" /> {s.label}
                  </span>
                </div>

                <p className="text-xs text-text-3 leading-relaxed flex-1 line-clamp-2 mb-4">{r.description || 'No description.'}</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-text-3">
                  <div className="flex items-center gap-1.5"><User className="w-3 h-3 flex-shrink-0 text-text-3/60" /><span className="truncate">{r.processOwner || '—'}</span></div>
                  <div className="flex items-center gap-1.5"><Layers className="w-3 h-3 flex-shrink-0 text-text-3/60" />{r.nodes.length} nodes · {r.edges.length} links</div>
                  <div className="flex items-center gap-1.5"><Tag className="w-3 h-3 flex-shrink-0 text-text-3/60" />{r.department}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 flex-shrink-0 text-text-3/60" />{r.version}</div>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-border-main bg-bg-2/20 flex items-center justify-between">
                <button onClick={() => setEditing(r)}
                  className="flex items-center gap-1.5 text-xs font-bold text-text-2 hover:text-accent transition-colors">
                  <Edit2 className="w-3.5 h-3.5" /> Open Canvas
                </button>
                <div className="flex items-center gap-0.5">
                  <button onClick={() => quickExportPNG(r)} disabled={exportingId === r.id}
                    className="p-2 rounded-lg text-text-3 hover:text-blue-500 hover:bg-blue-50 transition-all disabled:opacity-40" title="Export PNG">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => quickExportPDF(r)} disabled={exportingId === r.id}
                    className="p-2 rounded-lg text-text-3 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-40" title="Export PDF">
                    <FileDown className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDuplicate(r)}
                    className="p-2 rounded-lg text-text-3 hover:text-emerald-500 hover:bg-emerald-50 transition-all" title="Duplicate">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(r.id)}
                    className="p-2 rounded-lg text-text-3 hover:text-red-500 hover:bg-red-50 transition-all" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center py-20 text-text-3">
            <GitBranch className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-semibold">No flowcharts found. Try creating one.</p>
          </div>
        )}
      </div>

      {/* New flowchart modal */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="bg-bg-1 rounded-2xl border border-border-main shadow-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-text-1">New Flow Chart</h3>
                <button className="p-2 hover:bg-bg-2 rounded-xl transition-colors text-text-3" onClick={() => setShowNew(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-2 mb-1.5">Chart Title *</label>
                  <input className={inputClass} placeholder="e.g. Sewing In-line QC Flow" value={newForm.title} onChange={e => setNewForm(p => ({ ...p, title: e.target.value }))} autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-2 mb-1.5">Department</label>
                    <select className={inputClass} value={newForm.department} onChange={e => setNewForm(p => ({ ...p, department: e.target.value }))}>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-2 mb-1.5">Version</label>
                    <input className={inputClass} value={newForm.version} onChange={e => setNewForm(p => ({ ...p, version: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-2 mb-1.5">Process Owner</label>
                  <input className={inputClass} placeholder="e.g. QC Manager" value={newForm.processOwner} onChange={e => setNewForm(p => ({ ...p, processOwner: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-2 mb-1.5">Description</label>
                  <textarea className={`${inputClass} resize-none`} rows={2} placeholder="Brief description of the process…" value={newForm.description} onChange={e => setNewForm(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button className="px-4 py-2.5 bg-bg-2 border border-border-main rounded-xl text-sm font-medium text-text-2 hover:text-text-1 transition-colors" onClick={() => setShowNew(false)}>Cancel</button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm" onClick={handleCreate}>
                    <Plus className="w-4 h-4" /> Create & Edit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
