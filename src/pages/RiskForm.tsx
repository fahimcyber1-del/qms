import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, X, Plus, Trash2, Save, AlertTriangle, Shield, Activity, Info, Eye, FileDown } from 'lucide-react';
import { RiskAssessmentRecord, RiskItem } from '../types';
import { getRiskAssessments, saveRiskAssessments, calculateRiskScore, determineRiskLevel } from '../utils/riskUtils';
import { AttachmentList } from '../components/AttachmentList';

interface RiskFormProps {
  params: {
    mode: 'create' | 'edit' | 'view';
    data?: any;
  };
  onNavigate: (page: string, params?: any) => void;
}

export function RiskForm({ params, onNavigate }: RiskFormProps) {
  const { mode, data } = params;
  
  const initialRiskItem: RiskItem = {
    id: '', processName: '', operation: '', department: '', lineSection: '', criticalProcessCategory: 'Quality Critical',
    hazard: '', riskDescription: '', likelihood: 1, severity: 1, riskScore: 1, riskLevel: 'Low',
    existingControl: '', correctiveAction: '', responsiblePerson: '', targetDate: '', status: 'Open'
  };

  const [formData, setFormData] = useState<Partial<RiskAssessmentRecord>>(data || {
    productName: '', styleNumber: '', buyer: '', orderNumber: '', productCategory: 'Knit',
    risks: [{ ...initialRiskItem, id: `RITEM-${Date.now()}` }],
    attachments: []
  });

  const isReadOnly = mode === 'view';

  const handleProductFormChange = (field: keyof RiskAssessmentRecord, value: any) => {
    if (isReadOnly) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleRiskItemChange = (index: number, field: keyof RiskItem, value: any) => {
    if (isReadOnly) return;
    const updatedRisks = [...(formData.risks || [])];
    const updatedItem = { ...updatedRisks[index], [field]: value };
    
    if (field === 'likelihood' || field === 'severity') {
      const l = field === 'likelihood' ? Number(value) : Number(updatedItem.likelihood);
      const s = field === 'severity' ? Number(value) : Number(updatedItem.severity);
      const score = calculateRiskScore(l, s);
      updatedItem.riskScore = score;
      updatedItem.riskLevel = determineRiskLevel(score);
    }
    
    updatedRisks[index] = updatedItem;
    setFormData({ ...formData, risks: updatedRisks });
  };

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newAtts: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newAtts.push({ name: file.name, data });
    }
    
    setFormData(prev => ({ ...prev, attachments: [...(prev.attachments || []), ...newAtts] }));
  };

  const addRiskItem = () => {
    if (isReadOnly) return;
    setFormData({
      ...formData,
      risks: [...(formData.risks || []), { ...initialRiskItem, id: `RITEM-${Date.now()}` }]
    });
  };

  const removeRiskItem = (index: number) => {
    if (isReadOnly) return;
    const updatedRisks = [...(formData.risks || [])];
    updatedRisks.splice(index, 1);
    setFormData({ ...formData, risks: updatedRisks });
  };

  const handleSave = () => {
    if (!formData.productName || !formData.styleNumber) {
      alert('Product Name and Style Number are required.');
      return;
    }

    const now = new Date().toISOString();
    const newRecord: RiskAssessmentRecord = {
      ...(formData as RiskAssessmentRecord),
      id: formData.id || `RISK-${Date.now()}`,
      createdAt: formData.createdAt || now,
      updatedAt: now
    };

    const records = getRiskAssessments();
    let updatedRecords;
    if (mode === 'edit' && data) {
      updatedRecords = records.map(r => r.id === data.id ? newRecord : r);
    } else {
      updatedRecords = [newRecord, ...records];
    }

    saveRiskAssessments(updatedRecords);
    onNavigate('risk');
  };

  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case 'High': return 'badge-red';
      case 'Medium': return 'badge-amber';
      case 'Low': return 'badge-green';
      default: return 'badge-blue';
    }
  };

  const handleExportPDF = async () => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');

    let matrixRows: string[][] = [];
    if (formData.risks && formData.risks.length > 0) {
      matrixRows = formData.risks.map(r => [
        r.processName || '\u2014',
        r.hazard || '\u2014',
        r.riskDescription || '\u2014',
        String(r.likelihood),
        String(r.severity),
        String(r.riskScore),
        r.riskLevel || 'Low',
        r.status || 'Open'
      ]);
    }

    const rawData = formData.attachments?.map((a: any) => typeof a === 'string' ? a : a.data);

    await exportDetailToPDF({
      moduleName: 'Risk Assessment & Hazard Analysis',
      moduleId: `ID: ${formData.id || 'Draft'} \u2022 ${formData.styleNumber || '01'}`,
      recordId: formData.id || 'Draft',
      fileName: `Risk_Assessment_${formData.styleNumber || 'Report'}`,
      orientation: 'landscape',
      fields: [
        { label: 'Assessment Metadata & Context', value: 'Overview', fullWidth: true },
        { label: 'Product Name',     value: formData.productName || '\u2014', fullWidth: true },
        { label: 'Style / Model No', value: formData.styleNumber || '\u2014' },
        { label: 'Major Client',     value: formData.buyer || '\u2014' },
        { label: 'Order / Job No',   value: formData.orderNumber || '\u2014' },
        { label: 'Product Category', value: formData.productCategory || '\u2014' },
        { label: 'Assessment Date',  value: formData.createdAt ? new Date(formData.createdAt).toLocaleDateString('en-GB') : '\u2014' },
      ],
      tables: matrixRows.length > 0 ? [
        {
          title: 'Risk Identification & Mitigation Matrix',
          columns: ['Process / Operation', 'Hazard Identified', 'Risk Desc.', 'L', 'S', 'Score', 'Level', 'Status'],
          rows: matrixRows,
          columnStyles: {
            0: { cellWidth: 35, fontStyle: 'bold' },
            1: { cellWidth: 40 },
            2: { cellWidth: 50 },
            3: { cellWidth: 10, halign: 'center' },
            4: { cellWidth: 10, halign: 'center' },
            5: { cellWidth: 15, halign: 'center', fontStyle: 'bold' },
            6: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
            7: { cellWidth: 20, halign: 'center' },
          }
        }
      ] : undefined,
      signatureLabels: ['Prepared By (QE)', 'HOD Manufacturing', 'Compliance Lead', 'Certified Risk Officer'],
      attachments: rawData && rawData.length > 0 ? rawData : undefined
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page active"
    >
      <div className="sec-head">
        <div className="flex items-center gap-4">
          <button className="btn btn-ghost p-2" onClick={() => onNavigate('risk')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="sec-title">
              {mode === 'create' ? 'New Risk Assessment' : 
               mode === 'edit' ? 'Edit Risk Assessment' : 'Risk Assessment Details'}
            </div>
            <div className="sec-sub">{formData.productName || 'Untitled Assessment'} — {formData.styleNumber}</div>
          </div>
        </div>
        <div className="flex gap-2">
          {mode === 'view' && (
            <button className="btn btn-primary" onClick={handleExportPDF}>
              <FileDown className="w-4 h-4 mr-2" /> Download Report
            </button>
          )}
          {!isReadOnly && (
            <button className="btn btn-primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> Save Assessment
            </button>
          )}
          <button className="btn btn-ghost" onClick={() => onNavigate('risk')}>
            <X className="w-4 h-4 mr-2" /> Close
          </button>
        </div>
      </div>

      <div className="w-full p-4 md:p-6 lg:p-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar: Product Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-6 space-y-4">
              <h4 className="font-bold border-b border-border-main pb-2 text-primary-main flex items-center gap-2">
                <Info className="w-4 h-4" /> Product Information
              </h4>
              <div className="fg">
                <label>Product Name</label>
                <input 
                  className="form-control" 
                  value={formData.productName} 
                  readOnly={isReadOnly}
                  onChange={e => handleProductFormChange('productName', e.target.value)} 
                />
              </div>
              <div className="fg">
                <label>Style Number</label>
                <input 
                  className="form-control" 
                  value={formData.styleNumber} 
                  readOnly={isReadOnly}
                  onChange={e => handleProductFormChange('styleNumber', e.target.value)} 
                />
              </div>
              <div className="fg">
                <label>Buyer</label>
                <input 
                  className="form-control" 
                  value={formData.buyer} 
                  readOnly={isReadOnly}
                  onChange={e => handleProductFormChange('buyer', e.target.value)} 
                />
              </div>
              <div className="fg">
                <label>Order / PO Number</label>
                <input 
                  className="form-control" 
                  value={formData.orderNumber} 
                  readOnly={isReadOnly}
                  onChange={e => handleProductFormChange('orderNumber', e.target.value)} 
                />
              </div>
              <div className="fg">
                <label>Product Category</label>
                <select 
                  className="form-control" 
                  value={formData.productCategory} 
                  disabled={isReadOnly}
                  onChange={e => handleProductFormChange('productCategory', e.target.value)}
                >
                  <option value="Knit">Knit</option>
                  <option value="Woven">Woven</option>
                  <option value="Denim">Denim</option>
                </select>
              </div>
            </div>

            <div className="card p-6 bg-amber-50 border-amber-100">
              <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" /> Risk Matrix Info
              </h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                Risk Score = Likelihood (1-3) × Severity (1-3)
              </p>
              <ul className="text-[10px] text-amber-600 mt-2 space-y-1">
                <li>• 1-2: Low (Green)</li>
                <li>• 3-4: Medium (Amber)</li>
                <li>• 6-9: High (Red)</li>
              </ul>
            </div>
          </div>

          {/* Main Content: Risk Items */}
          <div className="lg:col-span-3 space-y-6">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6 border-b border-border-main pb-4">
                <h4 className="font-bold text-primary-main flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Process Risks & Action Plan
                </h4>
                {!isReadOnly && (
                  <button className="btn btn-ghost btn-sm" onClick={addRiskItem}>
                    <Plus className="w-4 h-4 mr-1" /> Add Risk
                  </button>
                )}
              </div>

              <div className="space-y-8">
                {formData.risks && formData.risks.length > 0 ? (
                  formData.risks.map((risk, idx) => (
                    <div key={risk.id} className="p-5 bg-bg-2 rounded-xl border border-border-main relative group">
                      {!isReadOnly && (
                        <button 
                          className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeRiskItem(idx)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="fg">
                            <label>Process Name</label>
                            <input 
                              className="form-control" 
                              placeholder="e.g. Sewing"
                              value={risk.processName}
                              readOnly={isReadOnly}
                              onChange={e => handleRiskItemChange(idx, 'processName', e.target.value)}
                            />
                          </div>
                          <div className="fg">
                            <label>Operation</label>
                            <input 
                              className="form-control" 
                              placeholder="e.g. Sleeve Attach"
                              value={risk.operation}
                              readOnly={isReadOnly}
                              onChange={e => handleRiskItemChange(idx, 'operation', e.target.value)}
                            />
                          </div>
                          <div className="fg">
                            <label>Department</label>
                            <input 
                              className="form-control" 
                              value={risk.department}
                              readOnly={isReadOnly}
                              onChange={e => handleRiskItemChange(idx, 'department', e.target.value)}
                            />
                          </div>
                          <div className="fg">
                            <label>Critical Category</label>
                            <select 
                              className="form-control" 
                              value={risk.criticalProcessCategory}
                              disabled={isReadOnly}
                              onChange={e => handleRiskItemChange(idx, 'criticalProcessCategory', e.target.value)}
                            >
                              <option value="Quality Critical">Quality Critical</option>
                              <option value="Safety Critical">Safety Critical</option>
                              <option value="Compliance Critical">Compliance Critical</option>
                              <option value="Production Critical">Production Critical</option>
                              <option value="Environmental Critical">Environmental Critical</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div className="fg">
                            <label>Hazard</label>
                            <input 
                              className="form-control" 
                              value={risk.hazard}
                              readOnly={isReadOnly}
                              onChange={e => handleRiskItemChange(idx, 'hazard', e.target.value)}
                            />
                          </div>
                          <div className="fg">
                            <label>Risk Description</label>
                            <textarea 
                              className="form-control min-h-[100px]" 
                              value={risk.riskDescription}
                              readOnly={isReadOnly}
                              onChange={e => handleRiskItemChange(idx, 'riskDescription', e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="fg">
                              <label>Likelihood</label>
                              <select 
                                className="form-control" 
                                value={risk.likelihood}
                                disabled={isReadOnly}
                                onChange={e => handleRiskItemChange(idx, 'likelihood', e.target.value)}
                              >
                                <option value={1}>1 - Rare</option>
                                <option value={2}>2 - Possible</option>
                                <option value={3}>3 - Likely</option>
                              </select>
                            </div>
                            <div className="fg">
                              <label>Severity</label>
                              <select 
                                className="form-control" 
                                value={risk.severity}
                                disabled={isReadOnly}
                                onChange={e => handleRiskItemChange(idx, 'severity', e.target.value)}
                              >
                                <option value={1}>1 - Minor</option>
                                <option value={2}>2 - Moderate</option>
                                <option value={3}>3 - Major</option>
                              </select>
                            </div>
                            <div className="fg">
                              <label>Level</label>
                              <div className={`form-control flex items-center justify-center font-bold ${getRiskLevelBadge(risk.riskLevel)}`}>
                                {risk.riskLevel} ({risk.riskScore})
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-main">
                          <div className="fg">
                            <label>Existing Control</label>
                            <textarea 
                              className="form-control min-h-[80px]" 
                              value={risk.existingControl}
                              readOnly={isReadOnly}
                              onChange={e => handleRiskItemChange(idx, 'existingControl', e.target.value)}
                            />
                          </div>
                          <div className="fg">
                            <label>Corrective Action</label>
                            <textarea 
                              className="form-control min-h-[80px]" 
                              value={risk.correctiveAction}
                              readOnly={isReadOnly}
                              onChange={e => handleRiskItemChange(idx, 'correctiveAction', e.target.value)}
                            />
                          </div>
                          <div className="fg">
                            <label>Responsible Person</label>
                            <input 
                              className="form-control" 
                              value={risk.responsiblePerson}
                              readOnly={isReadOnly}
                              onChange={e => handleRiskItemChange(idx, 'responsiblePerson', e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="fg">
                              <label>Target Date</label>
                              <input 
                                type="date"
                                className="form-control" 
                                value={risk.targetDate}
                                readOnly={isReadOnly}
                                onChange={e => handleRiskItemChange(idx, 'targetDate', e.target.value)}
                              />
                            </div>
                            <div className="fg">
                              <label>Status</label>
                              <select 
                                className="form-control" 
                                value={risk.status}
                                disabled={isReadOnly}
                                onChange={e => handleRiskItemChange(idx, 'status', e.target.value)}
                              >
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-bg-2 rounded-xl border-2 border-dashed border-border-main">
                    <Activity className="w-12 h-12 text-text-3 mx-auto mb-3 opacity-20" />
                    <p className="text-text-3">No risks identified yet.</p>
                    {!isReadOnly && (
                      <button className="btn btn-primary btn-sm mt-4" onClick={addRiskItem}>
                        <Plus className="w-4 h-4 mr-1" /> Add First Risk
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Attachments Section */}
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6 border-b border-border-main pb-4">
                <h4 className="font-bold text-primary-main flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" /> Photographic Evidence & Supporting Documents
                </h4>
                {!isReadOnly && (
                  <label className="btn btn-ghost btn-sm cursor-pointer">
                    <Plus className="w-4 h-4 mr-1" /> Add Evidence
                    <input type="file" multiple className="hidden" onChange={handleFileAttach} />
                  </label>
                )}
              </div>
              
              {!formData.attachments || formData.attachments.length === 0 ? (
                <div className="py-8 text-center bg-bg-2 rounded-xl border border-dashed border-border-main">
                   <p className="text-text-3 italic text-sm">No evidence files attached to this assessment.</p>
                </div>
              ) : (
                <AttachmentList
                  attachments={formData.attachments}
                  onRemove={!isReadOnly ? (i) => setFormData(p => ({ ...p, attachments: p.attachments?.filter((_, idx) => idx !== i) })) : undefined}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
