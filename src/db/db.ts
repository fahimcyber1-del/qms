import Dexie, { Table } from 'dexie';
import { 
  CAPARecord, 
  DefectCategory, 
  Defect, 
  CertificateRecord, 
  RiskAssessmentRecord, 
  SOPRecord, 
  QualityManualRecord, 
  OperationalGuideline, 
  DocumentControlRecord, 
  ProcedureRecord, 
  JDRecord, 
  InspectionRecord,
  AQLInspectionRecord,
  UniversalRecord,
  TraceabilityRecord
} from '../types';

export class QMSDatabase extends Dexie {
  // ── Existing Tables ──
  audits!: Table<any, string>;
  capas!: Table<CAPARecord, string>;
  defectCategories!: Table<DefectCategory, string>;
  defects!: Table<Defect, string>;
  certificates!: Table<CertificateRecord, string>;
  risks!: Table<RiskAssessmentRecord, string>;
  sops!: Table<SOPRecord, string>;

  qualityManuals!: Table<QualityManualRecord, string>;
  operationalGuidelines!: Table<OperationalGuideline, string>;
  documents!: Table<DocumentControlRecord, string>;
  procedures!: Table<ProcedureRecord, number|string>;
  jobDescriptions!: Table<JDRecord, string>;
  productionQuality!: Table<InspectionRecord, string>;
  aqlInspections!: Table<AQLInspectionRecord, string>;
  
  traceability!: Table<TraceabilityRecord, string>;

  // ── New Universal Module Tables ──
  training!: Table<UniversalRecord, string>;
  supplierManagement!: Table<UniversalRecord, string>;
  customerComplaints!: Table<UniversalRecord, string>;
  testing!: Table<UniversalRecord, string>;
  processFlowChart!: Table<UniversalRecord, string>;
  meetingMinutes!: Table<UniversalRecord, string>;
  orderSummary!: Table<UniversalRecord, string>;
  ncr!: Table<UniversalRecord, string>;
  rootCauseAnalysis!: Table<UniversalRecord, string>;
  managementReview!: Table<UniversalRecord, string>;
  equipmentMaintenance!: Table<UniversalRecord, string>;
  incomingQC!: Table<UniversalRecord, string>;
  finalInspection!: Table<UniversalRecord, string>;
  continuousImprovement!: Table<UniversalRecord, string>;
  processInteractionMatrix!: Table<UniversalRecord, string>;
  recordRetention!: Table<UniversalRecord, string>;
  changeManagement!: Table<UniversalRecord, string>;
  productSafety!: Table<UniversalRecord, string>;
  organogram!: Table<UniversalRecord, string>;
  kpiRecords!: Table<UniversalRecord, string>;
  qualityGoals!: Table<UniversalRecord, string>;
  buyerOrders!: Table<UniversalRecord, string>;
  calibrationRecords!: Table<UniversalRecord, string>;
  subSupplierManagement!: Table<UniversalRecord, string>;

  constructor() {
    super('GarmentsQMS');
    
    // Version 1: Original tables
    this.version(1).stores({
      audits: 'id, date, status, inspector, type',
      capas: 'id, status, deadline, responsible',
      defectCategories: 'id, name, order',
      defects: 'id, categoryId, department, process, severity, code',
      certificates: 'id, type, status, expiryDate, department',
      risks: 'id, productName, styleNumber, buyer',
      sops: 'id, department, process, status',
      qualityManuals: 'id, category',
      operationalGuidelines: 'id, department, category, status',
      documents: 'id, category, status',
      procedures: 'id, code, dept, status',
      jobDescriptions: 'id, erpId, department',
      productionQuality: 'id, date, unit, lineNumber, style',
      aqlInspections: 'id, type, buyer, style, result'
    });

    // Version 2: Add all new universal module tables
    this.version(2).stores({
      audits: 'id, date, status, inspector, type',
      capas: 'id, status, deadline, responsible',
      defectCategories: 'id, name, order',
      defects: 'id, categoryId, department, process, severity, code',
      certificates: 'id, type, status, expiryDate, department',
      risks: 'id, productName, styleNumber, buyer',
      sops: 'id, department, process, status',
      qualityManuals: 'id, category',
      operationalGuidelines: 'id, department, category, status',
      documents: 'id, category, status',
      procedures: 'id, code, dept, status',
      jobDescriptions: 'id, erpId, department',
      productionQuality: 'id, date, unit, lineNumber, style',
      aqlInspections: 'id, type, buyer, style, result',
      training: 'id, status, createdAt, department',
      supplierManagement: 'id, status, createdAt, department',
      customerComplaints: 'id, status, createdAt, department',
      testing: 'id, status, createdAt, department',
      processFlowChart: 'id, status, createdAt, department',
      meetingMinutes: 'id, status, createdAt, department',
      orderSummary: 'id, status, createdAt',
      ncr: 'id, status, createdAt, department',
      rootCauseAnalysis: 'id, status, createdAt, department',
      managementReview: 'id, status, createdAt',
      equipmentMaintenance: 'id, status, createdAt, department',
      incomingQC: 'id, status, createdAt',
      finalInspection: 'id, status, createdAt',
      continuousImprovement: 'id, status, createdAt, department',
      processInteractionMatrix: 'id, status, createdAt',
      recordRetention: 'id, status, createdAt, department',
      changeManagement: 'id, status, createdAt, department',
      productSafety: 'id, status, createdAt, department',
      organogram: 'id, status, createdAt, department',
      kpiRecords: 'id, status, createdAt, department',
      qualityGoals: 'id, status, createdAt, department',
      buyerOrders: 'id, status, createdAt',
      calibrationRecords: 'id, status, createdAt, department'
    });

    // Version 3: Add traceability
    this.version(3).stores({
      traceability: 'id, code, poNumber, styleNumber, buyer, currentStage, status'
    });

    // Version 4: Comprehensive tables for all modules
    this.version(4).stores({
      audits: 'id, date, status, inspector, type',
      capas: 'id, status, deadline, responsible',
      defectCategories: 'id, name, order',
      defects: 'id, categoryId, department, process, severity, code',
      certificates: 'id, type, status, expiryDate, department',
      risks: 'id, productName, styleNumber, buyer',
      sops: 'id, department, process, status',
      qualityManuals: 'id, category',
      operationalGuidelines: 'id, department, category, status',
      documents: 'id, category, status',
      procedures: 'id, code, dept, status',
      jobDescriptions: 'id, erpId, department',
      productionQuality: 'id, date, unit, lineNumber, style',
      aqlInspections: 'id, type, buyer, style, result',
      training: 'id, status, createdAt, department',
      supplierManagement: 'id, status, createdAt, department',
      subSupplierManagement: 'id, status, createdAt, department',
      customerComplaints: 'id, status, createdAt, department',
      testing: 'id, status, createdAt, department',
      processFlowChart: 'id, status, createdAt, department',
      meetingMinutes: 'id, status, createdAt, department',
      orderSummary: 'id, status, createdAt',
      ncr: 'id, status, createdAt, department',
      rootCauseAnalysis: 'id, status, createdAt, department',
      managementReview: 'id, status, createdAt',
      equipmentMaintenance: 'id, status, createdAt, department',
      incomingQC: 'id, status, createdAt',
      finalInspection: 'id, status, createdAt',
      continuousImprovement: 'id, status, createdAt, department',
      processInteractionMatrix: 'id, status, createdAt',
      recordRetention: 'id, status, createdAt, department',
      changeManagement: 'id, status, createdAt, department',
      productSafety: 'id, status, createdAt, department',
      organogram: 'id, status, createdAt, department',
      kpiRecords: 'id, status, createdAt, department',
      qualityGoals: 'id, status, createdAt, department',
      buyerOrders: 'id, status, createdAt',
      calibrationRecords: 'id, status, createdAt, department',
      traceability: 'id, code, poNumber, styleNumber, buyer, currentStage, status'
    });


  }
}

export const db = new QMSDatabase();

// Helper to get a table by name dynamically
export function getTable(tableName: string) {
  return (db as any)[tableName] as Table<UniversalRecord, string>;
}
