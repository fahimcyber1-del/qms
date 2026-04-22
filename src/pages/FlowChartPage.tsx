import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GitBranch, Plus, Search, Trash2, Edit2, Save, FileDown, X, Copy,
  ChevronLeft, Network, LayoutDashboard, Box, Play, XSquare,
  AlertTriangle, CheckCircle2, Clock, Settings2, Layers, Maximize2,
  Scissors, Activity, Package, Shield, User, Calendar, Tag,
  Zap, RefreshCw, Image as ImageIcon, FileText, Filter,
  ArrowRight, Download, ChevronDown, ChevronRight, GripVertical, Settings
} from 'lucide-react';
import mermaid from 'mermaid';
import { db } from '../db/db';
import { cn } from '../lib/utils';

// ── Types ───────────────────────────────────────────────
export type FlowStatus = 'Draft' | 'Pending Review' | 'Approved' | 'Archived';

export interface FlowStep {
  id: string;
  type: 'process' | 'decision' | 'qc' | 'terminal' | 'record';
  label: string;
  links: { targetId: string; label?: string }[];
}

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
  description: string;
  mermaidDefinition: string; // The source of truth for the chart
  steps?: FlowStep[]; // Structured steps for the builder
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

// ── Mermaid Styles ───────────────────────────────────────
const MERMAID_THEME = `
  %%{init: { 
    'theme': 'base', 
    'themeVariables': {
      'primaryColor': '#1d4ed8',
      'primaryTextColor': '#fff',
      'primaryBorderColor': '#1e3a8a',
      'lineColor': '#475569',
      'secondaryColor': '#f59e0b',
      'tertiaryColor': '#7c3aed',
      'mainBkg': '#ffffff',
      'nodeBorder': '#1e293b',
      'clusterBkg': '#f8fafc',
      'titleColor': '#1e293b',
      'edgeLabelBackground': '#ffffff',
      'fontFamily': 'Inter, sans-serif'
    }
  }}%%
  graph TD
  
  classDef terminal fill:#1d4ed8,stroke:#1e3a8a,stroke-width:2px,color:#fff,rx:20,ry:20;
  classDef process fill:#1565c0,stroke:#1e3a8a,stroke-width:2px,color:#fff;
  classDef qc fill:#7c3aed,stroke:#4c1d95,stroke-width:2px,color:#fff;
  classDef decision fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#1c1917;
  classDef record fill:#d97706,stroke:#92400e,stroke-width:2px,color:#1c1917;
`;

// ── Helper: Convert steps to mermaid code ────────────────
function stepsToMermaid(steps: FlowStep[]): string {
  let code = 'graph TD\n';
  steps.forEach(step => {
    let shape = '';
    switch(step.type) {
      case 'terminal': shape = `([${step.label}])`; break;
      case 'decision': shape = `{${step.label}}`; break;
      case 'qc': shape = `[[${step.label}]]`; break;
      case 'record': shape = `[/${step.label}/]`; break;
      default: shape = `[${step.label}]`;
    }
    code += `    ${step.id}${shape}:::${step.type}\n`;
  });
  
  steps.forEach(step => {
    (step.links || []).forEach(link => {
      const labelText = link.label ? `|${link.label}| ` : '';
      code += `    ${step.id} --> ${labelText}${link.targetId}\n`;
    });
  });
  
  return code;
}

// ── Mermaid Component ───────────────────────────────────
function MermaidPreview({ chartCode }: { chartCode: string }) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'base',
      fontFamily: 'Inter, sans-serif'
    });
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const renderChart = async () => {
      if (!chartCode) {
        setSvg('');
        return;
      }
      try {
        setError(null);
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        
        // Validation: Mermaid needs a graph type
        if (!/^\s*(graph|flowchart|sequenceDiagram|gantt|classDiagram|stateDiagram|erDiagram|journey|pie|gitGraph)/i.test(chartCode)) {
           // If it's just steps, it might be missing the header. 
           // But our engine adds MERMAID_THEME which has graph TD.
        }

        const { svg: renderedSvg } = await mermaid.render(id, MERMAID_THEME + '\n' + chartCode);
        if (!isCancelled) setSvg(renderedSvg);
      } catch (err) {
        console.error('Mermaid render error:', err);
        if (!isCancelled) {
          setError(String(err));
          // Try fallback rendering without theme variables
          try {
             const fallbackId = `fallback-${Math.random().toString(36).substring(2, 11)}`;
             const { svg: fallbackSvg } = await mermaid.render(fallbackId, 'graph TD\n' + chartCode);
             setSvg(fallbackSvg);
             setError(null);
          } catch (e) {
             setSvg('');
          }
        }
      }
    };
    renderChart();
    return () => { isCancelled = true; };
  }, [chartCode]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white rounded-2xl overflow-auto select-none shadow-inner relative">
      {error && (
        <div className="absolute top-4 right-4 bg-red-50 text-red-500 text-[10px] px-2 py-1 rounded border border-red-100 z-10">
          Render Warning
        </div>
      )}
      {svg ? (
        <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="flex flex-col items-center gap-4 opacity-20">
          <Network className="w-16 h-16" />
          <p className="text-sm font-bold uppercase tracking-widest">Generating Visual...</p>
        </div>
      )}
    </div>
  );
}

// ── Default Templates ───────────────────────────────────
const DEFAULT_STEPS: FlowStep[] = [
  { id: 'start', type: 'terminal', label: 'Order Received', links: [{ targetId: 'review' }] },
  { id: 'review', type: 'process', label: 'Review Tech Pack', links: [{ targetId: 'qc_check' }] },
  { id: 'qc_check', type: 'decision', label: 'Docs Complete?', links: [{ targetId: 'planning', label: 'Yes' }, { targetId: 'missing', label: 'No' }] },
  { id: 'missing', type: 'process', label: 'Request Data', links: [{ targetId: 'review' }] },
  { id: 'planning', type: 'process', label: 'Production Plan', links: [{ targetId: 'end' }] },
  { id: 'end', type: 'terminal', label: 'Shipment Release', links: [] }
];

function buildDefaultTemplates(): FlowChartRecord[] {
  return [
    {
      id: 'fc-template-1',
      code: 'FC-001',
      title: 'Standard Production Flow',
      department: 'Quality',
      processOwner: 'Quality Manager',
      version: 'v1.0',
      status: 'Approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: 'Standard flowchart for general production process tracking.',
      mermaidDefinition: stepsToMermaid(DEFAULT_STEPS),
      steps: DEFAULT_STEPS,
      changeHistory: []
    }
  ];
}

// ── EDITOR COMPONENT ────────────────────────────────────
function FlowBuilderEditor({ record, onSave, onClose }: { record: FlowChartRecord; onSave: (r: FlowChartRecord) => void; onClose: () => void }) {
  const [steps, setSteps] = useState<FlowStep[]>(record.steps || DEFAULT_STEPS);
  const [meta, setMeta] = useState({
    title: record.title,
    department: record.department,
    processOwner: record.processOwner,
    version: record.version,
    status: record.status,
    description: record.description
  });
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'visual' | 'code' | 'wizard'>('visual');
  const [mermaidCode, setMermaidCode] = useState(record.mermaidDefinition);
  const [wizardText, setWizardText] = useState((record.steps || []).map(s => s.label).join('\n'));

  useEffect(() => {
    if (viewMode === 'visual') {
      setMermaidCode(stepsToMermaid(steps));
    }
  }, [steps, viewMode]);

  const addStep = () => {
    const newId = `step_${Date.now()}`;
    const newStep: FlowStep = {
      id: newId,
      type: 'process',
      label: 'New Step',
      links: []
    };
    setSteps([...steps, newStep]);
    setActiveStepId(newId);
  };

  const updateStep = (id: string, updates: Partial<FlowStep>) => {
    setSteps(curr => curr.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStep = (id: string) => {
    if (!confirm('Are you sure you want to delete this step?')) return;
    setSteps(curr => curr.filter(s => s.id !== id).map(s => ({
       ...s,
       links: s.links.filter(l => l.targetId !== id)
    })));
    if (activeStepId === id) setActiveStepId(null);
  };

  const handleSave = () => {
    onSave({
      ...record,
      ...meta,
      steps,
      mermaidDefinition: mermaidCode,
      updatedAt: new Date().toISOString()
    });
  };

  const handleExportPDF = async () => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    const svgEl = document.querySelector('.mermaid-preview svg');
    if (!svgEl) return;
    
    // Generate PNG from SVG for PDF
    const canvas = document.createElement('canvas');
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = async () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imgData = canvas.toDataURL('image/png');
      
      await exportDetailToPDF({
        moduleName: 'Process Flow Chart Report',
        moduleId: 'flow-chart',
        recordId: record.code,
        fileName: `${record.code}_Flowchart`,
        orientation: 'landscape',
        sections: [
          {
            title: 'Design Identification',
            fields: [
              { label: 'Process Title',      value: meta.title },
              { label: 'Sequential Code',    value: record.code },
              { label: 'Project Version',    value: meta.version },
              { label: 'Operational Status', value: meta.status },
            ]
          },
          {
            title: 'Ownership & Authority',
            fields: [
              { label: 'Process Owner',      value: meta.processOwner },
              { label: 'Stakeholder Dept',   value: meta.department },
              { label: 'Definition Source',  value: 'Mermaid Engine v1.0' },
            ]
          },
          {
             title: 'Process Description',
             fields: [
               { label: 'Summary', value: meta.description || 'Verified process flow for QMS compliance.', fullWidth: true }
             ]
          }
        ],
        attachments: [{ name: 'Visual Workflow Diagram', data: imgData }]
      });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const activeStep = steps.find(s => s.id === activeStepId);

  return (
    <div className="fixed inset-0 z-[100] bg-bg-1 flex flex-col font-sans">
      {/* Header */}
      <div className="h-16 border-b border-border-main bg-bg-2 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-bg-1 rounded-xl text-text-3 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-text-1">{meta.title || 'Untitled Flow'}</h2>
            <div className="text-[10px] uppercase font-black tracking-widest text-text-3">Flow Builder Tool</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-bg-1 rounded-xl p-1 flex border border-border-main mr-4 shadow-sm">
             <button 
                onClick={() => setViewMode('wizard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'wizard' ? 'bg-amber-500 text-white shadow-md' : 'text-text-3 hover:text-text-2'}`}
             >Easy Creator</button>
             <button 
                onClick={() => setViewMode('visual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'visual' ? 'bg-accent text-white shadow-md' : 'text-text-3 hover:text-text-2'}`}
             >Manual Edit</button>
             <button 
                onClick={() => setViewMode('code')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'code' ? 'bg-accent text-white shadow-md' : 'text-text-3 hover:text-text-2'}`}
             >Source Code</button>
          </div>
          
          <button onClick={handleExportPDF} className="btn bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-4">
            <Download className="w-4 h-4 mr-2" /> PDF Report
          </button>
          <button onClick={handleSave} className="btn btn-primary px-6 shadow-lg shadow-accent/20">
            <Save className="w-4 h-4 mr-2" /> Save & Build
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Step List */}
        <div className="w-80 border-r border-border-main bg-bg-1 flex flex-col">
           <div className="p-4 border-b border-border-main flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-3">Structure Index</span>
              <button onClick={addStep} className="p-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-all">
                <Plus className="w-4 h-4" />
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {steps.map((step, idx) => (
                <div 
                  key={step.id}
                  onClick={() => setActiveStepId(step.id)}
                  className={`group p-4 rounded-xl border transition-all cursor-pointer ${
                    activeStepId === step.id 
                    ? 'bg-accent/5 border-accent shadow-sm' 
                    : 'bg-bg-2 border-border-main hover:border-text-3'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                      step.type === 'terminal' ? 'bg-blue-500/10 text-blue-500' :
                      step.type === 'decision' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {step.type}
                    </span>
                    <span className="text-[9px] font-mono text-text-3 opacity-0 group-hover:opacity-100 transition-opacity">#{idx+1}</span>
                  </div>
                  <div className="text-xs font-bold text-text-1 truncate">{step.label}</div>
                  <div className="text-[9px] text-text-3 mt-1 flex items-center gap-1">
                    <Network className="w-3 h-3" /> {step.links.length} connections
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Main Content: Preview or Code */}
        <div className="flex-1 bg-bg-2 relative flex flex-col">
            {viewMode === 'wizard' ? (
               <div className="flex-1 p-8 flex flex-col gap-6">
                  <div className="bg-bg-1 border border-border-main p-6 rounded-2xl shadow-sm">
                    <h3 className="text-sm font-bold text-text-1 mb-2">Rapid Step Generation</h3>
                    <p className="text-xs text-text-3 mb-4">Just type your steps line-by-line. Use {"->"} to indicate decision branching (e.g., "Review {"->"} Accept").</p>
                    <textarea 
                      value={wizardText}
                      onChange={e => setWizardText(e.target.value)}
                      placeholder="Order Received&#10;In-line Inspection&#10;QC Status -> OK&#10;Packing&#10;Shipment"
                      className="w-full h-[300px] bg-bg-2 border border-border-main rounded-xl p-6 text-sm font-mono text-text-1 focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-inner"
                    />
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={() => {
                           const lines = wizardText.split('\n').filter(l => l.trim());
                           const newSteps: FlowStep[] = lines.map((line, i) => {
                              const id = `wz_${i}`;
                              const label = line.trim();
                              const isDecision = label.includes('->') || label.includes('?');
                              const nextId = i < lines.length - 1 ? `wz_${i+1}` : null;
                              
                              return {
                                 id,
                                 type: isDecision ? 'decision' : (i === 0 || i === lines.length - 1) ? 'terminal' : 'process',
                                 label: label.replace('->', '').trim(),
                                 links: nextId ? [{ targetId: nextId }] : []
                              };
                           });
                           setSteps(newSteps);
                           setViewMode('visual');
                        }}
                        className="btn bg-amber-500 text-white shadow-lg shadow-amber-500/20 px-6 font-bold"
                      >
                        Generate Flow Visual
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 bg-white rounded-2xl border border-border-main p-4 opacity-40 grayscale pointer-events-none">
                     <p className="text-[10px] font-black uppercase text-center mt-20">Live Preview Unavailable in Wizard Mode</p>
                  </div>
               </div>
            ) : viewMode === 'visual' ? (
               <div className="flex-1 p-8 mermaid-preview">
                  <MermaidPreview chartCode={mermaidCode} />
               </div>
            ) : (
               <div className="flex-1 p-8 h-full">
                  <textarea 
                    value={mermaidCode}
                    onChange={e => setMermaidCode(e.target.value)}
                    className="w-full h-full bg-[#0c0e16] text-emerald-400 font-mono text-sm p-8 rounded-2xl border border-border-main outline-none focus:ring-2 focus:ring-accent/40"
                    spellCheck={false}
                  />
                  <div className="absolute top-12 right-12 text-[10px] font-black uppercase text-text-3 tracking-widest pointer-events-none">Mermaid syntax</div>
               </div>
            )}
        </div>

        {/* Right Sidebar: Properties */}
        <AnimatePresence>
          {(activeStepId || viewMode === 'visual') && (
            <motion.div 
              initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}
              className="w-80 border-l border-border-main bg-bg-1 flex flex-col"
            >
              <div className="p-4 border-b border-border-main flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-3">Properties</span>
                {activeStepId && (
                  <button onClick={() => deleteStep(activeStepId)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                 {activeStep ? (
                   <>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-text-3 block mb-2">Step Label</label>
                          <input 
                            className="w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-xs text-text-1 focus:ring-2 focus:ring-accent outline-none"
                            value={activeStep.label}
                            onChange={e => updateStep(activeStepId, { label: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-text-3 block mb-2">Shape Type</label>
                          <select 
                            className="w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-xs text-text-1 focus:ring-2 focus:ring-accent outline-none"
                            value={activeStep.type}
                            onChange={e => updateStep(activeStepId, { type: e.target.value as any })}
                          >
                             <option value="process">Standard Process</option>
                             <option value="decision">Decision Gate</option>
                             <option value="qc">Inspection Check</option>
                             <option value="terminal">Start / End</option>
                             <option value="record">Doc / Record</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-border-main">
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-text-3">Next Steps</label>
                          <button 
                            onClick={() => {
                              const targets = steps.filter(s => s.id !== activeStepId);
                              if (targets.length === 0) return;
                              updateStep(activeStepId, { 
                                links: [...activeStep.links, { targetId: targets[0].id }] 
                              });
                            }}
                            className="text-[10px] font-bold text-accent hover:underline"
                          >+ Add Link</button>
                        </div>
                        <div className="space-y-3">
                           {activeStep.links.map((link, idx) => (
                             <div key={idx} className="bg-bg-2 p-3 rounded-xl border border-border-main space-y-2 relative group-link">
                                <button 
                                  onClick={() => updateStep(activeStepId, { links: activeStep.links.filter((_, i) => i !== idx) })}
                                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-link-hover:opacity-100 transition-all shadow-md"
                                ><X className="w-3 h-3" /></button>
                                
                                <select 
                                   className="w-full bg-bg-1 border border-border-main rounded-lg px-3 py-2 text-[11px] text-text-1 outline-none"
                                   value={link.targetId}
                                   onChange={e => {
                                      const newLinks = [...activeStep.links];
                                      newLinks[idx].targetId = e.target.value;
                                      updateStep(activeStepId, { links: newLinks });
                                   }}
                                >
                                   {steps.filter(s => s.id !== activeStepId).map(s => (
                                     <option key={s.id} value={s.id}>{s.label}</option>
                                   ))}
                                </select>
                                <input 
                                   placeholder="Edge Label (Optional)"
                                   className="w-full bg-bg-1 border border-border-main rounded-lg px-3 py-2 text-[11px] text-text-1 outline-none"
                                   value={link.label || ''}
                                   onChange={e => {
                                      const newLinks = [...activeStep.links];
                                      newLinks[idx].label = e.target.value;
                                      updateStep(activeStepId, { links: newLinks });
                                   }}
                                />
                             </div>
                           ))}
                        </div>
                      </div>
                   </>
                 ) : (
                   <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-3 block mb-2">Flow Chart Info</label>
                        <input 
                           className="w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-xs text-text-1 focus:ring-2 focus:ring-accent outline-none mb-3"
                           placeholder="Flow Title"
                           value={meta.title}
                           onChange={e => setMeta(p => ({ ...p, title: e.target.value }))}
                        />
                        <select 
                           className="w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-xs text-text-1 focus:ring-2 focus:ring-accent outline-none"
                           value={meta.department}
                           onChange={e => setMeta(p => ({ ...p, department: e.target.value }))}
                        >
                           {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <textarea 
                         placeholder="Brief description of the process..."
                         className="w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-xs text-text-1 focus:ring-2 focus:ring-accent outline-none resize-none"
                         rows={4}
                         value={meta.description}
                         onChange={e => setMeta(p => ({ ...p, description: e.target.value }))}
                      />
                   </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── MAIN LIST PAGE ──────────────────────────────────────
export function FlowChartPage({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [records, setRecords] = useState<FlowChartRecord[]>([]);
  const [editing, setEditing] = useState<FlowChartRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ title: '', department: 'Quality', processOwner: '', version: 'v1.0', description: '' });

  const loadData = useCallback(async () => {
    try {
      const data = await db.processFlowChart.toArray();
      
      // MIGRATION: If legacy records found (nodes/edges instead of steps/mermaidDefinition)
      const migrated = data.map((item: any) => {
        if (!item.mermaidDefinition && (item.nodes || !item.steps)) {
          // Convert legacy structure to steps if possible
          const steps: FlowStep[] = (item.nodes || []).map((n: any) => ({
            id: n.id,
            type: n.type === 'decision' ? 'decision' : n.type === 'output' ? 'terminal' : 'process',
            label: n.data?.label || 'Step',
            links: (item.edges || [])
              .filter((e: any) => e.source === n.id)
              .map((e: any) => ({ targetId: e.target, label: e.label })),
          }));
          
          if (steps.length === 0 && !item.mermaidDefinition) {
             // Fallback to default template if truly empty
             return {
               ...item,
               steps: DEFAULT_STEPS,
               mermaidDefinition: stepsToMermaid(DEFAULT_STEPS),
               changeHistory: item.changeHistory || []
             };
          }

          return {
            ...item,
            steps,
            mermaidDefinition: stepsToMermaid(steps),
            changeHistory: item.changeHistory || [{ date: new Date().toISOString(), user: 'System', note: 'Migrated to Mermaid Engine' }]
          };
        }
        return item;
      });

      setRecords(migrated as FlowChartRecord[]);
    } catch (err) {
      console.error('Failed to load FlowCharts:', err);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const count = await db.processFlowChart.count();
        if (count === 0) { await db.processFlowChart.bulkPut(buildDefaultTemplates() as any[]); }
        loadData();
      } catch { setRecords(buildDefaultTemplates()); }
    })();
  }, [loadData]);

  const filtered = useMemo(() => records.filter(r => {
    const q = searchTerm.toLowerCase();
    return (filterDept === 'All' || r.department === filterDept)
      && (filterStatus === 'All' || r.status === filterStatus)
      && (r.title.toLowerCase().includes(q) || r.code.toLowerCase().includes(q));
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

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this flowchart?')) return;
    try { await db.processFlowChart.delete(id); } catch { }
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleCreate = async () => {
     if (!newForm.title) return;
     const newRecord: FlowChartRecord = {
        id: `fc-${Date.now()}`,
        code: `FC-${String(records.length + 1).padStart(3, '0')}`,
        title: newForm.title,
        department: newForm.department,
        processOwner: newForm.processOwner || 'Manager',
        version: newForm.version || 'v1.0',
        status: 'Draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: newForm.description,
        steps: DEFAULT_STEPS,
        mermaidDefinition: stepsToMermaid(DEFAULT_STEPS),
        changeHistory: []
     };
     await handleSave(newRecord);
     setEditing(newRecord);
     setShowNew(false);
  };

  if (editing) return <FlowBuilderEditor record={editing} onSave={handleSave} onClose={() => setEditing(null)} />;

  return (
    <motion.div className="p-4 md:p-8 space-y-8 min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-accent" />
            Process Flow Command
          </h1>
          <p className="text-text-2 text-base mt-1">Design and manage high-fidelity QMS process diagrams.</p>
        </div>
        <button 
           className="btn btn-primary flex items-center gap-2 px-6 shadow-lg shadow-accent/20"
           onClick={() => setShowNew(true)}
        >
          <Plus className="w-4 h-4" /> New Flowchart
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Library', value: stats.total, icon: Layers, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Live Systems', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'System Drafts', value: stats.draft, icon: Edit2, color: 'text-slate-500', bg: 'bg-slate-500/10' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-bg-1 border border-border-main rounded-2xl p-6 flex items-center gap-5 shadow-sm">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-text-3 mb-1">{stat.label}</div>
              <div className="text-3xl font-bold text-text-1">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(r => {
          const s = STATUS_CONFIG[r.status];
          const IDI = DEPT_ICONS[r.department] || Network;
          return (
            <motion.div 
              key={r.id}
              className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-bg-2 rounded-xl border border-border-main">
                      <IDI className="w-5 h-5 text-accent" />
                   </div>
                   <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${s.bg} ${s.color}`}>
                      {s.label}
                   </span>
                </div>
                <div className="text-[10px] font-black text-accent tracking-widest mb-1">{r.code}</div>
                <h3 className="text-lg font-bold text-text-1 mb-2 group-hover:text-accent transition-colors">{r.title}</h3>
                <p className="text-xs text-text-3 line-clamp-2 mb-6 h-8 opacity-70 leading-relaxed font-medium">
                  {r.description || 'No detailed process breakdown available for this module.'}
                </p>
                <div className="flex items-center gap-4 py-3 border-t border-border-main">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-text-3" />
                    <span className="text-[10px] font-bold text-text-2 uppercase truncate max-w-[80px]">{r.processOwner}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Network className="w-3.5 h-3.5 text-text-3" />
                    <span className="text-[10px] font-bold text-text-2 uppercase">v{r.version}</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-bg-2/30 border-t border-border-main flex items-center justify-between">
                <button 
                  onClick={() => setEditing(r)}
                  className="text-xs font-black uppercase tracking-widest text-text-2 hover:text-accent flex items-center gap-2 transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Project Tool
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => handleDelete(r.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* New Modal */}
      <AnimatePresence>
        {showNew && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
               className="bg-bg-1 border border-border-main rounded-3xl w-full max-w-lg p-8 shadow-2xl"
             >
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-text-1">Initialize Process Flow</h2>
                   <button onClick={() => setShowNew(false)} className="p-2 hover:bg-bg-2 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-3 block mb-2">Process Name</label>
                    <input 
                      placeholder="e.g. End-to-End Sewing Workflow"
                      className="w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm text-text-1 focus:ring-2 focus:ring-accent outline-none"
                      value={newForm.title}
                      onChange={e => setNewForm(p => ({ ...p, title: e.target.value }))}
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-3 block mb-2">Assign Department</label>
                      <select 
                        className="w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm text-text-1 focus:ring-2 focus:ring-accent outline-none"
                        value={newForm.department}
                        onChange={e => setNewForm(p => ({ ...p, department: e.target.value }))}
                      >
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-text-3 block mb-2">Process Version</label>
                      <input 
                         className="w-full bg-bg-2 border border-border-main rounded-xl px-4 py-3 text-sm text-text-1 focus:ring-2 focus:ring-accent outline-none"
                         value={newForm.version}
                         onChange={e => setNewForm(p => ({ ...p, version: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                     <button onClick={() => setShowNew(false)} className="btn bg-bg-2 border-border-main flex-1">Cancel</button>
                     <button 
                        onClick={handleCreate}
                        disabled={!newForm.title}
                        className="btn btn-primary flex-1 shadow-lg shadow-accent/20"
                     >Start Designing</button>
                  </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
