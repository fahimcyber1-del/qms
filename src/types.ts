// ── UNIVERSAL TYPES ──
export interface Comment {
  id: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  userName: string;
  details: string;
  timestamp: string;
}

export interface FileAttachment {
  name: string;
  data: string;
  type: string;
  size?: number;
}

// Base record interface that all module records extend
export interface BaseModuleRecord {
  id: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  status: string;
  attachments: FileAttachment[];
  comments: Comment[];
  history: ActivityLogEntry[];
}

// Universal record for generic modules
export interface UniversalRecord extends BaseModuleRecord {
  [key: string]: any;
}

// ── EXISTING TYPES (preserved) ──

export interface HistoryEntry {
  date: string;
  change: string;
  responsible?: string;
  status?: string;
}

export interface CAPARecord {
  id: string;
  auditId?: string;
  nc: string;
  cause: string;
  action: string;
  preventive: string;
  responsible: string;
  deadline: string;
  status: string;
  description: string;
  attachments: string[];
  history: HistoryEntry[];
  uid?: string;
  createdAt?: any;
}

export interface DefectCategory {
  id: string;
  name: string;
  order: number;
  uid: string;
}

export interface Defect {
  id: string;
  categoryId: string;
  code: string;
  name: string;
  localName?: string;
  department: string;
  process: string;
  severity: 'Minor' | 'Major' | 'Critical';
  imageUrl?: string;
  imageUrls?: string[];
  severityImages?: {
    Minor?: string;
    Major?: string;
    Critical?: string;
  };
  zoningImpact?: {
    zoneA: 'Minor' | 'Major' | 'Critical';
    zoneB: 'Minor' | 'Major' | 'Critical';
    zoneC: 'Minor' | 'Major' | 'Critical';
  };
  description: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  standardReference: string;
  revision: string;
  createdBy: string;
  createdAt: string;
  uid: string;
  aqlLevel?: '1.5' | '2.5' | '4.0';
  inspectionLevel?: '1' | '2' | '3';
}

export interface RootCause {
  id: string;
  defectId: string;
  description: string;
  department: string;
  uid: string;
}

export interface CorrectiveAction {
  id: string;
  defectId: string;
  description: string;
  department: string;
  uid: string;
}

export interface PreventiveAction {
  id: string;
  defectId: string;
  description: string;
  department: string;
  uid: string;
}

export interface DefectDocument {
  id: string;
  defectId: string;
  name: string;
  url: string;
  type: string;
  uid: string;
}

export interface DefectHistory {
  id: string;
  defectId: string;
  action: string;
  timestamp: string;
  uid: string;
}

export interface CertificateRecord {
  id: string;
  name: string;
  type: 'Factory' | 'Machine' | 'Testing' | 'Compliance' | 'Sustainability' | 'Environmental';
  number: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Pending';
  department: 'Quality' | 'Compliance' | 'Lab' | 'Production';
  documentUrls: string[];
  uid?: string;
  createdAt?: string;
}

export interface RiskItem {
  id: string;
  processName: string;
  operation: string;
  department: string;
  lineSection: string;
  criticalProcessCategory: 'Quality Critical' | 'Safety Critical' | 'Compliance Critical' | 'Production Critical' | 'Environmental Critical';
  hazard: string;
  riskDescription: string;
  likelihood: number;
  severity: number;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  existingControl: string;
  correctiveAction: string;
  responsiblePerson: string;
  targetDate: string;
  status: 'Open' | 'Closed';
}

export interface RiskAssessmentRecord {
  id: string;
  productName: string;
  styleNumber: string;
  buyer: string;
  orderNumber?: string;
  productCategory: 'Knit' | 'Woven' | 'Denim';
  risks: RiskItem[];
  createdAt: string;
  updatedAt: string;
}

export interface SOPAttachment {
  name: string;
  data: string;
  type: string;
}

export interface SOPVersionHistory {
  version: string;
  updatedAt: string;
  updatedBy: string;
  changes: string;
}

export interface SOPRecord {
  id: string;
  sopId: string;
  title: string;
  department: 'Cutting' | 'Sewing' | 'Finishing' | 'Packing' | 'Quality' | 'Maintenance' | 'HR' | string;
  process: string;
  version: string;
  effectiveDate: string;
  reviewDate: string;
  status: 'Draft' | 'Approved' | 'Obsolete';
  
  // Content
  purpose: string;
  scope: string;
  responsibility: string;
  procedureSteps: string;
  safetyGuidelines: string;
  requiredEquipment: string;
  qcPoints: string;
  
  // Attachments
  attachments: SOPAttachment[];
  videoLink?: string;
  
  // Workflow
  createdBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  
  // Additional Features
  versionHistory: SOPVersionHistory[];
  trainingLink?: string;
  acknowledgementCount?: number;
  
  createdAt: string;
  updatedAt: string;
}



// ── TRACEABILITY SYSTEM TYPES (ISO 9001:2015) ──
export interface TraceabilityStep {
  date: string;
  department: string;
  operator: string;
  details: string;
  status: 'Pass' | 'Fail' | 'Pending';
  documents: FileAttachment[];
}

export interface TraceabilityRecord {
  id: string; // Used as UUID
  code: string; // e.g. TRC-001
  poNumber: string;
  styleNumber: string;
  buyer: string;
  orderQuantity: number;
  currentStage: 'Fabric' | 'Cutting' | 'Sewing' | 'Finishing' | 'Packing' | 'Shipped';
  status: 'In Progress' | 'On Hold' | 'Completed';
  
  // High-level Tracking
  identifiedDate: string;
  targetDate: string;
  responsiblePerson: string;
  
  // Specific Stages
  fabricStage: TraceabilityStep & { rollNumber: string; supplier: string; lotNumber: string };
  cuttingStage: TraceabilityStep & { bundleNumber: string; cutQuantity: number };
  sewingStage: TraceabilityStep & { lineNumber: string; machineId: string };
  finishingStage: TraceabilityStep & { batchNumber: string };
  packingStage: TraceabilityStep & { cartonNumber: string };
  shipmentStage: TraceabilityStep & { destination: string; containerNumber: string };
  
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface QualityManualRecord {
  id: string;
  title: string;
  description: string;
  category: 'Cutting' | 'Sewing' | 'Fusing' | 'Washing' | 'Finishing' | 'Packing' | 'Embroidery' | 'Printing';
  file: SOPAttachment;
  version: string;
  uploaderName: string;
  createdAt: string;
  updatedAt: string;
  versionHistory: SOPVersionHistory[];
  tags: string[];
}

export interface VersionEntry {
  version: string;
  date: string;
  changes: string;
  approvedBy: string;
}

export interface Acknowledgement {
  userId: string;
  userName: string;
  date: string;
}

export interface OperationalGuideline {
  id: string;
  title: string;
  department: 'Cutting' | 'Sewing' | 'Finishing' | 'Packing' | 'Embroidery' | 'Washing' | 'Quality Control' | 'IE' | 'Fabric Store' | 'Buyer-Specific' | 'AQL' | 'Machine' | 'Measurement' | 'Safety' | 'HR' | 'Compliance' | 'Logistics' | 'Maintenance' | 'Merchandising';
  category: 'Safety' | 'Operational' | 'Quality' | 'Compliance' | 'HR';
  content: string;
  version: string;
  issueDate: string;
  nextReviewDate: string;
  approvedBy: string;
  status: 'Active' | 'Under Review' | 'Obsolete';
  attachments?: SOPAttachment[];
  versionHistory: VersionEntry[];
  acknowledgements: Acknowledgement[];
  sopLinkId?: string;
  qrCodeUrl?: string; // Placeholder for QR code
}

export interface DocumentControlRecord {
  id: string;
  serialNo: string;
  code: string;
  name: string;
  issueDate: string;
  status: 'Active' | 'Obsolete' | 'Under Review';
  category?: string;
  version?: string;
  uid?: string;
  createdAt?: string;
}

export interface RevisionEntry {
  rev: string;
  date: string;
  by: string;
  change: string;
  approved: string;
}

export interface ProcedureSection {
  id: string;
  title: string;
  content?: string;
  subSections?: { id: string; title: string; content: string }[];
}

export interface ProcedureRecord {
  id: number;
  code: string;
  title: string;
  dept: string;
  cat: string;
  clause: string;
  ver: string;
  issueNo: string;
  revNo: string;
  issueDate: string;
  reviewDate: string;
  approvedBy: string;
  status: 'Active' | 'Under Review' | 'Obsolete' | 'Draft';
  linkedSops: string[];
  linkedForms: string[];
  revHistory: RevisionEntry[];
  // Document Content
  documentType?: string;
  author?: string;
  purpose?: string;
  scope?: string;
  responsibilities?: { role: string; responsibility: string }[];
  sections?: ProcedureSection[];
  relatedDocuments?: { name: string; ref: string }[];
  distribution?: string[];
}

export interface Employee {
  id: string;
  erpId: string;
  name: string;
  designation: string;
  employeeCode: string;
  department: string;
  section: string;
  unit: string;
  doj: string;
  email?: string;
  phone?: string;
}

export interface JDResponsibility {
  id: string;
  description: string;
}

export interface JDRecord {
  id: string;
  companyName: string;
  factoryLocation: string;
  documentCode?: string;
  revNo?: string;
  jdRefNo: string;
  employeeId: string;
  employeeName: string;
  erpId: string;
  designation: string;
  employeeCode: string;
  department: string;
  section: string;
  unit: string;
  grade?: string;
  doj: string;
  reportToId: string;
  reportToName: string;
  reportToDesignation: string;
  responsibilities: JDResponsibility[];
  delegationClause: boolean;
  preparedBy: string;
  preparedDate: string;
  status: 'Draft' | 'Finalized';
  createdAt: string;
  updatedAt: string;
}

export interface InspectionDefect {
  name: string;
  count: number;
}

export interface InspectionRecord {
  id: string;
  date: string;
  factory: string;
  unit: string;
  section: string;
  floor: string;
  lineNumber: string;
  style: string;
  orderNumber: string;
  buyer: string;
  operatorId: string;
  qcInspector: string;
  dayTarget: number;
  checkedQuantity: number;
  goodsQuantity: number;
  totalDefects: number;
  standardRft: number;
  standardDhu: number;
  standardPercentageDefective: number;
  shift: string;
  machineNumber: string;
  remark: string;
  status?: string;
  source: 'detailed' | 'quick';
  topDefects: InspectionDefect[];
  uid: string;
  attachments: string[];
}

export interface AQLInspectionRecord {
  id: string;
  type: string;
  buyer: string;
  style: string;
  order: string;
  line: string;
  inspector: string;
  orderQty: number;
  inspectionQty: number;
  sampleSize: number;
  passQty: number;
  failQty: number;
  criticalDefect: number;
  majorDefect: number;
  minorDefect: number;
  crdDate: string;
  result: 'PASS' | 'FAIL' | 'HOLD';
  remarks: string;
  createdAt: string;
  updatedAt: string;
  attachments: string[];
  aqlLevel: string;
  inspectionLevel: string;
}
export interface FollowUpRecord {
  id: string;
  capaId: string;
  capaDescription: string;
  department: string;
  verificationDate: string;
  verifier: string;
  status: 'Verified' | 'Partially Verified' | 'Not Verified' | 'Needs Revisit';
  remarks: string;
  evidenceUrls: string[];
  createdAt: string;
}

// ── FIELD CONFIGURATION FOR UNIVERSAL MODULE ──

export type FieldType = 'text' | 'textarea' | 'select' | 'date' | 'number' | 'email' | 'file';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: SelectOption[];
  placeholder?: string;
  showInTable?: boolean;
  showInForm?: boolean;
  showInDetail?: boolean;
  tableWidth?: string;
  defaultValue?: any;
  group?: string; // For form grouping
}

export interface ModuleConfig {
  key: string;
  title: string;
  subtitle: string;
  icon: any; // LucideIcon
  tableName: string;
  idPrefix: string;
  fields: FieldConfig[];
  statusOptions: string[];
  defaultStatus: string;
  departments?: string[];
}
