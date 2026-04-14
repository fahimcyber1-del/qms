import { FieldConfig } from '../types';
import {
  GraduationCap, Factory, Megaphone, TestTube2, GitBranch, Users,
  AlertOctagon, SearchCode, Briefcase, Wrench, ClipboardCheck,
  CheckSquare, TrendingUp, Grid3X3, Archive, RefreshCw,
  ShieldAlert, Network, BarChart3, Target, ShoppingBag, Settings2,
  Package, FileText, BookOpen
} from 'lucide-react';

// ── Standard departments used across modules ──
export const DEPARTMENTS = [
  'Quality', 'Production', 'Cutting', 'Sewing', 'Finishing',
  'Packing', 'Maintenance', 'HR', 'Compliance', 'IE',
  'Fabric Store', 'Washing', 'Embroidery', 'Lab', 'Admin', 'Management'
];

// ── Standard status options ──
export const STATUS_STANDARD = ['Open', 'Pending', 'Closed'];
export const STATUS_REVIEW = ['Draft', 'Under Review', 'Approved', 'Closed'];
export const STATUS_PROGRESS = ['Open', 'In Progress', 'Completed', 'Closed'];

// ── Field helper: creates common base fields ──
function baseFields(): FieldConfig[] {
  return [
    { key: 'department', label: 'Department', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: DEPARTMENTS.map(d => ({ value: d, label: d })) },
    { key: 'responsiblePerson', label: 'Responsible Person', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
    { key: 'date', label: 'Date', type: 'date', required: true, showInTable: true, showInForm: true, showInDetail: true },
  ];
}

// ── MODULE CONFIGURATIONS ──

export interface ModuleConfigDef {
  key: string;
  title: string;
  subtitle: string;
  icon: any;
  tableName: string;
  idPrefix: string;
  fields: FieldConfig[];
  statusOptions: string[];
  defaultStatus: string;
}

export const MODULE_CONFIGS: Record<string, ModuleConfigDef> = {
  // ═══ EXISTING PLACEHOLDER MODULES (now fully functional) ═══

  training: {
    key: 'training',
    title: 'Training Management',
    subtitle: 'Employee Training Records & Certifications',
    icon: GraduationCap,
    tableName: 'training',
    idPrefix: 'TRN',
    statusOptions: STATUS_PROGRESS,
    defaultStatus: 'Open',
    fields: [
      { key: 'trainingTitle', label: 'Training Title', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'trainingType', label: 'Training Type', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Induction', label: 'Induction' }, { value: 'On-the-Job', label: 'On-the-Job' },
        { value: 'Refresher', label: 'Refresher' }, { value: 'Skill Upgrade', label: 'Skill Upgrade' },
        { value: 'Safety', label: 'Safety' }, { value: 'Quality', label: 'Quality' }, { value: 'Compliance', label: 'Compliance' }
      ]},
      ...baseFields(),
      { key: 'trainer', label: 'Trainer', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'participants', label: 'Participants', type: 'textarea', showInForm: true, showInDetail: true, placeholder: 'List participant names' },
      { key: 'participantCount', label: 'Participant Count', type: 'number', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'duration', label: 'Duration (hrs)', type: 'number', showInForm: true, showInDetail: true },
      { key: 'venue', label: 'Venue', type: 'text', showInForm: true, showInDetail: true },
      { key: 'description', label: 'Training Content', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'effectiveness', label: 'Effectiveness Rating', type: 'select', showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Excellent', label: 'Excellent' }, { value: 'Good', label: 'Good' },
        { value: 'Average', label: 'Average' }, { value: 'Poor', label: 'Poor' }, { value: 'Not Evaluated', label: 'Not Evaluated' }
      ]},
      { key: 'nextTrainingDate', label: 'Next Training Date', type: 'date', showInForm: true, showInDetail: true },
    ]
  },

  supplierManagement: {
    key: 'supplierManagement',
    title: 'Supplier Management',
    subtitle: 'Supplier Evaluation, Audits & Performance',
    icon: Factory,
    tableName: 'supplierManagement',
    idPrefix: 'SUP',
    statusOptions: ['Active', 'Inactive', 'Pending Approval', 'Blacklisted'],
    defaultStatus: 'Active',
    fields: [
      { key: 'supplierName', label: 'Supplier Name', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'supplierCode', label: 'Supplier Code', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'supplierType', label: 'Supplier Type', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Fabric', label: 'Fabric' }, { value: 'Accessories', label: 'Accessories' },
        { value: 'Packaging', label: 'Packaging' }, { value: 'Chemical', label: 'Chemical' },
        { value: 'Machine Parts', label: 'Machine Parts' }, { value: 'Service', label: 'Service' }
      ]},
      { key: 'contactPerson', label: 'Contact Person', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'email', label: 'Email', type: 'email', showInForm: true, showInDetail: true },
      { key: 'phone', label: 'Phone', type: 'text', showInForm: true, showInDetail: true },
      { key: 'address', label: 'Address', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'qualityRating', label: 'Quality Rating', type: 'select', showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'A', label: 'A - Excellent' }, { value: 'B', label: 'B - Good' },
        { value: 'C', label: 'C - Average' }, { value: 'D', label: 'D - Poor' }
      ]},
      { key: 'lastAuditDate', label: 'Last Audit Date', type: 'date', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'certifications', label: 'Certifications', type: 'text', showInForm: true, showInDetail: true, placeholder: 'ISO 9001, OEKO-TEX, etc.' },
      { key: 'remarks', label: 'Remarks', type: 'textarea', showInForm: true, showInDetail: true },
    ]
  },

  subSupplierManagement: {
    key: 'subSupplierManagement',
    title: 'Sub Supplier Masterlist',
    subtitle: 'Sub Supplier Details & Evaluation',
    icon: Factory,
    tableName: 'subSupplierManagement',
    idPrefix: 'SUB',
    statusOptions: ['Active', 'Inactive', 'Pending Approval', 'Blacklisted'],
    defaultStatus: 'Active',
    fields: [
      { key: 'supplierName', label: 'Supplier Name', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'process', label: 'Process', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'address', label: 'Address', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'contactPerson', label: 'Contact Person', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'designation', label: 'Designation', type: 'text', showInForm: true, showInDetail: true },
      { key: 'email', label: 'Email', type: 'email', showInForm: true, showInDetail: true },
      { key: 'phone', label: 'Phone', type: 'text', showInForm: true, showInDetail: true },
      { key: 'source', label: 'Source', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'score', label: 'Score (%)', type: 'number', showInTable: true, showInForm: true, showInDetail: true },
      // Evaluation Questions
      { key: 'qTradeLicense', label: 'Q1: Have a valid Trade license?', type: 'select', showInForm: true, showInDetail: true, options: [{value: '5', label: '5 - Yes'}, {value: '0', label: '0 - No'}, {value: 'N/A', label: 'N/A'}] },
      { key: 'qFactoryLicense', label: 'Q2: Have a valid Factory License?', type: 'select', showInForm: true, showInDetail: true, options: [{value: '5', label: '5 - Yes'}, {value: '0', label: '0 - No'}, {value: 'N/A', label: 'N/A'}] },
      { key: 'qFireLicense', label: 'Q3: Have a valid Fire License?', type: 'select', showInForm: true, showInDetail: true, options: [{value: '5', label: '5 - Yes'}, {value: '0', label: '0 - No'}, {value: 'N/A', label: 'N/A'}] },
      { key: 'qAppointedManager', label: 'Q4: Is there an appointed factory manager?', type: 'select', showInForm: true, showInDetail: true, options: [{value: '5', label: '5 - Yes'}, {value: '0', label: '0 - No'}, {value: 'N/A', label: 'N/A'}] },
      { key: 'qWorkingHours', label: 'Q5: Is working hour limit maintained?', type: 'select', showInForm: true, showInDetail: true, options: [{value: '5', label: '5 - Yes'}, {value: '0', label: '0 - No'}, {value: 'N/A', label: 'N/A'}] },
      { key: 'qChildLabor', label: 'Q6: Is child labor free?', type: 'select', showInForm: true, showInDetail: true, options: [{value: '5', label: '5 - Yes'}, {value: '0', label: '0 - No'}, {value: 'N/A', label: 'N/A'}] },
      { key: 'qMinimumWage', label: 'Q7: Is minimum wage provided?', type: 'select', showInForm: true, showInDetail: true, options: [{value: '5', label: '5 - Yes'}, {value: '0', label: '0 - No'}, {value: 'N/A', label: 'N/A'}] },
      { key: 'qAppointmentLetter', label: 'Q8: Are employees provided Appointment letter?', type: 'select', showInForm: true, showInDetail: true, options: [{value: '5', label: '5 - Yes'}, {value: '0', label: '0 - No'}, {value: 'N/A', label: 'N/A'}] },
      { key: 'qLayoutPlan', label: 'Q9: Is there any display layout plan?', type: 'select', showInForm: true, showInDetail: true, options: [{value: '5', label: '5 - Yes'}, {value: '0', label: '0 - No'}, {value: 'N/A', label: 'N/A'}] },
      { key: 'qCleanWorkingArea', label: 'Q10: Is the working area clean and well organized?', type: 'select', showInForm: true, showInDetail: true, options: [{value: '5', label: '5 - Yes'}, {value: '0', label: '0 - No'}, {value: 'N/A', label: 'N/A'}] },
    ]
  },

  customerComplaints: {
    key: 'customerComplaints',
    title: 'Customer Complaint',
    subtitle: 'Complaint Registration, Investigation & Resolution',
    icon: Megaphone,
    tableName: 'customerComplaints',
    idPrefix: 'CC',
    statusOptions: ['Open', 'Under Investigation', 'Corrective Action', 'Closed', 'Re-opened'],
    defaultStatus: 'Open',
    fields: [
      { key: 'complaintTitle', label: 'Complaint Title', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'buyer', label: 'Buyer / Customer', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'orderNumber', label: 'Order Number', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'style', label: 'Style', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      ...baseFields(),
      { key: 'complaintType', label: 'Complaint Type', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Quality', label: 'Quality' }, { value: 'Measurement', label: 'Measurement' },
        { value: 'Packing', label: 'Packing' }, { value: 'Delivery', label: 'Delivery' },
        { value: 'Documentation', label: 'Documentation' }, { value: 'Other', label: 'Other' }
      ]},
      { key: 'severity', label: 'Severity', type: 'select', showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Critical', label: 'Critical' }, { value: 'Major', label: 'Major' }, { value: 'Minor', label: 'Minor' }
      ]},
      { key: 'description', label: 'Complaint Description', type: 'textarea', required: true, showInForm: true, showInDetail: true },
      { key: 'rootCause', label: 'Root Cause', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'correctiveAction', label: 'Corrective Action', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'preventiveAction', label: 'Preventive Action', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'closureDate', label: 'Target Closure Date', type: 'date', showInForm: true, showInDetail: true },
    ]
  },

  testing: {
    key: 'testing',
    title: 'Testing Management',
    subtitle: 'Fabric, Garment & Safety Testing Records',
    icon: TestTube2,
    tableName: 'testing',
    idPrefix: 'TST',
    statusOptions: ['Pending', 'In Progress', 'Pass', 'Fail', 'Re-test'],
    defaultStatus: 'Pending',
    fields: [
      { key: 'testName', label: 'Test Name', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'testType', label: 'Test Type', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Fabric', label: 'Fabric Test' }, { value: 'Garment', label: 'Garment Test' },
        { value: 'Color Fastness', label: 'Color Fastness' }, { value: 'Dimensional Stability', label: 'Dimensional Stability' },
        { value: 'Tensile Strength', label: 'Tensile Strength' }, { value: 'Pilling', label: 'Pilling' },
        { value: 'Chemical', label: 'Chemical' }, { value: 'Safety', label: 'Safety' }
      ]},
      { key: 'sampleId', label: 'Sample ID', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'buyer', label: 'Buyer', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'style', label: 'Style No.', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      ...baseFields(),
      { key: 'labName', label: 'Lab Name', type: 'text', showInForm: true, showInDetail: true },
      { key: 'standardApplied', label: 'Standard Applied', type: 'text', showInForm: true, showInDetail: true, placeholder: 'e.g., AATCC, ISO, ASTM' },
      { key: 'testResult', label: 'Test Result', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'expectedValue', label: 'Expected Value', type: 'text', showInForm: true, showInDetail: true },
      { key: 'actualValue', label: 'Actual Value', type: 'text', showInForm: true, showInDetail: true },
      { key: 'remarks', label: 'Remarks', type: 'textarea', showInForm: true, showInDetail: true },
    ]
  },

  processFlowChart: {
    key: 'processFlowChart',
    title: 'Flow Chart',
    subtitle: 'Visual Production Flow with QC Checkpoints',
    icon: GitBranch,
    tableName: 'processFlowChart',
    idPrefix: 'PFC',
    statusOptions: STATUS_REVIEW,
    defaultStatus: 'Draft',
    fields: [
      { key: 'flowTitle', label: 'Flow Chart Title', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'processType', label: 'Process Type', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Production', label: 'Production' }, { value: 'Quality Control', label: 'Quality Control' },
        { value: 'Supply Chain', label: 'Supply Chain' }, { value: 'Support', label: 'Support Process' }
      ]},
      ...baseFields(),
      { key: 'version', label: 'Version', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'processSteps', label: 'Process Steps', type: 'textarea', required: true, showInForm: true, showInDetail: true, placeholder: 'List steps in order, one per line' },
      { key: 'qcCheckpoints', label: 'QC Checkpoints', type: 'textarea', showInForm: true, showInDetail: true, placeholder: 'QC checks within this process' },
      { key: 'inputMaterials', label: 'Input Materials', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'outputProducts', label: 'Output Products', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'approvedBy', label: 'Approved By', type: 'text', showInForm: true, showInDetail: true },
    ]
  },

  meetingMinutes: {
    key: 'meetingMinutes',
    title: 'Meeting Minutes',
    subtitle: 'Meeting Records, Action Items & Follow-ups',
    icon: Users,
    tableName: 'meetingMinutes',
    idPrefix: 'MTG',
    statusOptions: ['Scheduled', 'Completed', 'Cancelled', 'Follow-up Required'],
    defaultStatus: 'Scheduled',
    fields: [
      { key: 'meetingTitle', label: 'Meeting Title', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'meetingType', label: 'Meeting Type', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'MRM', label: 'Management Review Meeting' }, { value: 'Quality Review', label: 'Quality Review' },
        { value: 'Production Meeting', label: 'Production Meeting' }, { value: 'Safety Meeting', label: 'Safety Meeting' },
        { value: 'Buyer Meeting', label: 'Buyer Meeting' }, { value: 'CAPA Review', label: 'CAPA Review' },
        { value: 'Daily Briefing', label: 'Daily Briefing' }, { value: 'Other', label: 'Other' }
      ]},
      ...baseFields(),
      { key: 'chairperson', label: 'Chairperson', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'attendees', label: 'Attendees', type: 'textarea', required: true, showInForm: true, showInDetail: true, placeholder: 'List all attendees' },
      { key: 'agenda', label: 'Agenda', type: 'textarea', required: true, showInForm: true, showInDetail: true },
      { key: 'discussions', label: 'Discussion Points', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'decisions', label: 'Decisions Made', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'actionItems', label: 'Action Items', type: 'textarea', showInForm: true, showInDetail: true, placeholder: 'List action items with responsible persons' },
      { key: 'nextMeetingDate', label: 'Next Meeting Date', type: 'date', showInForm: true, showInDetail: true },
    ]
  },

  orderSummary: {
    key: 'orderSummary',
    title: 'Buyer / Order Summary',
    subtitle: 'Order Tracking, Shipment & Quality Summary',
    icon: Package,
    tableName: 'orderSummary',
    idPrefix: 'ORD',
    statusOptions: ['Received', 'In Production', 'QC Approved', 'Shipped', 'Delivered', 'Cancelled'],
    defaultStatus: 'Received',
    fields: [
      { key: 'buyer', label: 'Buyer', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'orderNumber', label: 'Order Number', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'style', label: 'Style No.', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'date', label: 'Order Date', type: 'date', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'quantity', label: 'Order Quantity', type: 'number', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'deliveryDate', label: 'Delivery Date', type: 'date', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'department', label: 'Department', type: 'select', showInForm: true, showInDetail: true, options: DEPARTMENTS.map(d => ({ value: d, label: d })) },
      { key: 'responsiblePerson', label: 'Merchandiser', type: 'text', showInForm: true, showInDetail: true },
      { key: 'fabricType', label: 'Fabric Type', type: 'text', showInForm: true, showInDetail: true },
      { key: 'color', label: 'Color', type: 'text', showInForm: true, showInDetail: true },
      { key: 'shipmentMode', label: 'Shipment Mode', type: 'select', showInForm: true, showInDetail: true, options: [
        { value: 'Sea', label: 'Sea' }, { value: 'Air', label: 'Air' }, { value: 'Road', label: 'Road' }
      ]},
      { key: 'remarks', label: 'Remarks', type: 'textarea', showInForm: true, showInDetail: true },
    ]
  },

  // ═══ NEW MANDATORY QMS MODULES ═══

  ncr: {
    key: 'ncr',
    title: 'Nonconformance (NCR)',
    subtitle: 'Nonconformance Reports & Disposition',
    icon: AlertOctagon,
    tableName: 'ncr',
    idPrefix: 'NCR',
    statusOptions: ['Open', 'Under Review', 'Disposition Decided', 'Corrective Action', 'Closed'],
    defaultStatus: 'Open',
    fields: [
      { key: 'ncrTitle', label: 'NCR Title', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'ncrType', label: 'NCR Type', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Product', label: 'Product' }, { value: 'Process', label: 'Process' },
        { value: 'Material', label: 'Material' }, { value: 'System', label: 'System' }
      ]},
      ...baseFields(),
      { key: 'detectedBy', label: 'Detected By', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'detectionStage', label: 'Detection Stage', type: 'select', showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Incoming', label: 'Incoming Inspection' }, { value: 'In-Process', label: 'In-Process' },
        { value: 'Final', label: 'Final Inspection' }, { value: 'Customer', label: 'Customer Return' }
      ]},
      { key: 'description', label: 'Nonconformance Description', type: 'textarea', required: true, showInForm: true, showInDetail: true },
      { key: 'affectedQuantity', label: 'Affected Quantity', type: 'number', showInForm: true, showInDetail: true },
      { key: 'disposition', label: 'Disposition', type: 'select', showInForm: true, showInDetail: true, options: [
        { value: 'Rework', label: 'Rework' }, { value: 'Reject', label: 'Reject' },
        { value: 'Accept as-is', label: 'Accept as-is' }, { value: 'Return to Supplier', label: 'Return to Supplier' }
      ]},
      { key: 'rootCause', label: 'Root Cause', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'correctiveAction', label: 'Corrective Action', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'verificationDate', label: 'Verification Date', type: 'date', showInForm: true, showInDetail: true },
    ]
  },

  rootCauseAnalysis: {
    key: 'rootCauseAnalysis',
    title: 'Root Cause Analysis (RCA)',
    subtitle: 'Systematic Problem Analysis & Prevention',
    icon: SearchCode,
    tableName: 'rootCauseAnalysis',
    idPrefix: 'RCA',
    statusOptions: STATUS_PROGRESS,
    defaultStatus: 'Open',
    fields: [
      { key: 'problemTitle', label: 'Problem Title', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'sourceModule', label: 'Source Module', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'NCR', label: 'NCR' }, { value: 'CAPA', label: 'CAPA' },
        { value: 'Customer Complaint', label: 'Customer Complaint' }, { value: 'Audit', label: 'Audit' },
        { value: 'Inspection', label: 'Inspection' }, { value: 'Other', label: 'Other' }
      ]},
      { key: 'referenceId', label: 'Reference ID', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      ...baseFields(),
      { key: 'problemDescription', label: 'Problem Description', type: 'textarea', required: true, showInForm: true, showInDetail: true },
      { key: 'analysisMethod', label: 'Analysis Method', type: 'select', showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: '5 Why', label: '5 Why Analysis' }, { value: 'Fishbone', label: 'Fishbone Diagram' },
        { value: 'Pareto', label: 'Pareto Analysis' }, { value: 'FMEA', label: 'FMEA' }, { value: 'Other', label: 'Other' }
      ]},
      { key: 'why1', label: 'Why 1', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'why2', label: 'Why 2', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'why3', label: 'Why 3', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'why4', label: 'Why 4', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'why5', label: 'Why 5 (Root Cause)', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'rootCause', label: 'Root Cause Summary', type: 'textarea', required: true, showInForm: true, showInDetail: true },
      { key: 'correctiveAction', label: 'Corrective Action', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'preventiveAction', label: 'Preventive Action', type: 'textarea', showInForm: true, showInDetail: true },
    ]
  },

  managementReview: {
    key: 'managementReview',
    title: 'Management Review',
    subtitle: 'MRM Records, Decisions & Action Plans',
    icon: Briefcase,
    tableName: 'managementReview',
    idPrefix: 'MRM',
    statusOptions: ['Scheduled', 'In Progress', 'Completed', 'Follow-up Required', 'Closed'],
    defaultStatus: 'Scheduled',
    fields: [
      { key: 'reviewTitle', label: 'Review Title', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'reviewType', label: 'Review Type', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Annual', label: 'Annual Review' }, { value: 'Semi-Annual', label: 'Semi-Annual' },
        { value: 'Quarterly', label: 'Quarterly' }, { value: 'Ad-hoc', label: 'Ad-hoc' }
      ]},
      { key: 'date', label: 'Review Date', type: 'date', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'chairperson', label: 'Chairperson', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'department', label: 'Department', type: 'select', showInForm: true, showInDetail: true, options: DEPARTMENTS.map(d => ({ value: d, label: d })) },
      { key: 'responsiblePerson', label: 'Minutes Taker', type: 'text', showInForm: true, showInDetail: true },
      { key: 'attendees', label: 'Attendees', type: 'textarea', required: true, showInForm: true, showInDetail: true },
      { key: 'inputItems', label: 'Review Input Items', type: 'textarea', showInForm: true, showInDetail: true, placeholder: 'Audit results, customer feedback, NCRs, KPIs, etc.' },
      { key: 'outputDecisions', label: 'Output / Decisions', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'actionItems', label: 'Action Items', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'resourceNeeds', label: 'Resource Requirements', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'nextReviewDate', label: 'Next Review Date', type: 'date', showInForm: true, showInDetail: true },
    ]
  },

  equipmentMaintenance: {
    key: 'equipmentMaintenance',
    title: 'Equipment Maintenance',
    subtitle: 'Preventive & Corrective Maintenance Records',
    icon: Wrench,
    tableName: 'equipmentMaintenance',
    idPrefix: 'EQM',
    statusOptions: ['Scheduled', 'In Progress', 'Completed', 'Overdue', 'Cancelled'],
    defaultStatus: 'Scheduled',
    fields: [
      { key: 'equipmentName', label: 'Equipment Name', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'equipmentId', label: 'Equipment ID', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'maintenanceType', label: 'Maintenance Type', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Preventive', label: 'Preventive' }, { value: 'Corrective', label: 'Corrective' },
        { value: 'Predictive', label: 'Predictive' }, { value: 'Emergency', label: 'Emergency' }
      ]},
      ...baseFields(),
      { key: 'location', label: 'Location', type: 'text', showInForm: true, showInDetail: true },
      { key: 'scheduledDate', label: 'Scheduled Date', type: 'date', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'completionDate', label: 'Completion Date', type: 'date', showInForm: true, showInDetail: true },
      { key: 'workDescription', label: 'Work Description', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'partsReplaced', label: 'Parts Replaced', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'cost', label: 'Cost', type: 'number', showInForm: true, showInDetail: true },
      { key: 'nextMaintenanceDate', label: 'Next Maintenance Date', type: 'date', showInForm: true, showInDetail: true },
      { key: 'remarks', label: 'Remarks', type: 'textarea', showInForm: true, showInDetail: true },
    ]
  },

  incomingQC: {
    key: 'incomingQC',
    title: 'Incoming Quality Control',
    subtitle: 'Raw Material & Fabric Incoming Inspection',
    icon: ClipboardCheck,
    tableName: 'incomingQC',
    idPrefix: 'IQC',
    statusOptions: ['Pending', 'Pass', 'Fail', 'Conditional Accept', 'Re-inspect'],
    defaultStatus: 'Pending',
    fields: [
      { key: 'materialName', label: 'Material Name', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'materialType', label: 'Material Type', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Fabric', label: 'Fabric' }, { value: 'Accessories', label: 'Accessories' },
        { value: 'Packaging', label: 'Packaging' }, { value: 'Chemical', label: 'Chemical' }, { value: 'Other', label: 'Other' }
      ]},
      { key: 'supplier', label: 'Supplier', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'lotNumber', label: 'Lot / Roll Number', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'date', label: 'Inspection Date', type: 'date', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'department', label: 'Department', type: 'select', showInForm: true, showInDetail: true, options: DEPARTMENTS.map(d => ({ value: d, label: d })) },
      { key: 'responsiblePerson', label: 'Inspector', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'receivedQty', label: 'Received Quantity', type: 'number', showInForm: true, showInDetail: true },
      { key: 'inspectedQty', label: 'Inspected Quantity', type: 'number', showInForm: true, showInDetail: true },
      { key: 'acceptedQty', label: 'Accepted Quantity', type: 'number', showInForm: true, showInDetail: true },
      { key: 'rejectedQty', label: 'Rejected Quantity', type: 'number', showInForm: true, showInDetail: true },
      { key: 'defectsFound', label: 'Defects Found', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'testResults', label: 'Test Results', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'remarks', label: 'Remarks', type: 'textarea', showInForm: true, showInDetail: true },
    ]
  },

  finalInspection: {
    key: 'finalInspection',
    title: 'Final Inspection',
    subtitle: 'Pre-Shipment & Final Quality Inspection',
    icon: CheckSquare,
    tableName: 'finalInspection',
    idPrefix: 'FIN',
    statusOptions: ['Scheduled', 'In Progress', 'Pass', 'Fail', 'Conditional Pass'],
    defaultStatus: 'Scheduled',
    fields: [
      { key: 'inspectionTitle', label: 'Inspection Title', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'buyer', label: 'Buyer', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'orderNumber', label: 'Order Number', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'style', label: 'Style No.', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'date', label: 'Inspection Date', type: 'date', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'department', label: 'Department', type: 'select', showInForm: true, showInDetail: true, options: DEPARTMENTS.map(d => ({ value: d, label: d })) },
      { key: 'responsiblePerson', label: 'Inspector', type: 'text', required: true, showInForm: true, showInDetail: true },
      { key: 'orderQty', label: 'Order Quantity', type: 'number', showInForm: true, showInDetail: true },
      { key: 'inspectedQty', label: 'Inspected Quantity', type: 'number', showInForm: true, showInDetail: true },
      { key: 'aqlLevel', label: 'AQL Level', type: 'select', showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: '1.5', label: 'AQL 1.5' }, { value: '2.5', label: 'AQL 2.5' }, { value: '4.0', label: 'AQL 4.0' }
      ]},
      { key: 'criticalDefects', label: 'Critical Defects', type: 'number', showInForm: true, showInDetail: true },
      { key: 'majorDefects', label: 'Major Defects', type: 'number', showInForm: true, showInDetail: true },
      { key: 'minorDefects', label: 'Minor Defects', type: 'number', showInForm: true, showInDetail: true },
      { key: 'measurementCheck', label: 'Measurement Result', type: 'select', showInForm: true, showInDetail: true, options: [
        { value: 'Pass', label: 'Pass' }, { value: 'Fail', label: 'Fail' }, { value: 'Marginal', label: 'Marginal' }
      ]},
      { key: 'packingCheck', label: 'Packing Check', type: 'select', showInForm: true, showInDetail: true, options: [
        { value: 'Pass', label: 'Pass' }, { value: 'Fail', label: 'Fail' }
      ]},
      { key: 'remarks', label: 'Remarks', type: 'textarea', showInForm: true, showInDetail: true },
    ]
  },

  continuousImprovement: {
    key: 'continuousImprovement',
    title: 'Continuous Improvement',
    subtitle: 'Kaizen, Improvement Initiatives & Tracking',
    icon: TrendingUp,
    tableName: 'continuousImprovement',
    idPrefix: 'CI',
    statusOptions: ['Proposed', 'Approved', 'In Progress', 'Completed', 'On Hold'],
    defaultStatus: 'Proposed',
    fields: [
      { key: 'improvementTitle', label: 'Improvement Title', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'category', label: 'Category', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Quality', label: 'Quality' }, { value: 'Productivity', label: 'Productivity' },
        { value: 'Safety', label: 'Safety' }, { value: 'Cost Reduction', label: 'Cost Reduction' },
        { value: 'Process', label: 'Process' }, { value: 'Waste Reduction', label: 'Waste Reduction' }
      ]},
      ...baseFields(),
      { key: 'currentSituation', label: 'Current Situation', type: 'textarea', required: true, showInForm: true, showInDetail: true },
      { key: 'proposedImprovement', label: 'Proposed Improvement', type: 'textarea', required: true, showInForm: true, showInDetail: true },
      { key: 'expectedBenefit', label: 'Expected Benefit', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'implementationPlan', label: 'Implementation Plan', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'targetDate', label: 'Target Completion Date', type: 'date', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'actualResult', label: 'Actual Result', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'verifiedBy', label: 'Verified By', type: 'text', showInForm: true, showInDetail: true },
    ]
  },

  processInteractionMatrix: {
    key: 'processInteractionMatrix',
    title: 'Process Interaction Matrix',
    subtitle: 'Inter-Process Dependencies & Interactions',
    icon: Grid3X3,
    tableName: 'processInteractionMatrix',
    idPrefix: 'PIM',
    statusOptions: STATUS_REVIEW,
    defaultStatus: 'Draft',
    fields: [
      { key: 'processName', label: 'Process Name', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'processOwner', label: 'Process Owner', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'department', label: 'Department', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: DEPARTMENTS.map(d => ({ value: d, label: d })) },
      { key: 'responsiblePerson', label: 'Responsible Person', type: 'text', showInForm: true, showInDetail: true },
      { key: 'date', label: 'Date', type: 'date', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'processType', label: 'Process Type', type: 'select', showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Core', label: 'Core Process' }, { value: 'Support', label: 'Support Process' }, { value: 'Management', label: 'Management Process' }
      ]},
      { key: 'inputs', label: 'Process Inputs', type: 'textarea', required: true, showInForm: true, showInDetail: true },
      { key: 'outputs', label: 'Process Outputs', type: 'textarea', required: true, showInForm: true, showInDetail: true },
      { key: 'upstreamProcess', label: 'Upstream Process (Input From)', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'downstreamProcess', label: 'Downstream Process (Output To)', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'kpis', label: 'KPIs / Metrics', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'isoClause', label: 'ISO Clause Reference', type: 'text', showInForm: true, showInDetail: true },
    ]
  },

  recordRetention: {
    key: 'recordRetention',
    title: 'Record Retention Control',
    subtitle: 'Document Retention Periods & Disposal Tracking',
    icon: Archive,
    tableName: 'recordRetention',
    idPrefix: 'RRC',
    statusOptions: ['Active', 'Archived', 'Due for Disposal', 'Disposed'],
    defaultStatus: 'Active',
    fields: [
      { key: 'recordTitle', label: 'Record Title', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'recordType', label: 'Record Type', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Quality Record', label: 'Quality Record' }, { value: 'Training Record', label: 'Training Record' },
        { value: 'Audit Record', label: 'Audit Record' }, { value: 'Inspection Record', label: 'Inspection Record' },
        { value: 'CAPA Record', label: 'CAPA Record' }, { value: 'Customer Record', label: 'Customer Record' },
        { value: 'Supplier Record', label: 'Supplier Record' }, { value: 'Other', label: 'Other' }
      ]},
      ...baseFields(),
      { key: 'retentionPeriod', label: 'Retention Period (Years)', type: 'number', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'location', label: 'Storage Location', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'medium', label: 'Storage Medium', type: 'select', showInForm: true, showInDetail: true, options: [
        { value: 'Physical', label: 'Physical' }, { value: 'Digital', label: 'Digital' }, { value: 'Both', label: 'Both' }
      ]},
      { key: 'disposalDate', label: 'Disposal Date', type: 'date', showInForm: true, showInDetail: true },
      { key: 'disposalMethod', label: 'Disposal Method', type: 'select', showInForm: true, showInDetail: true, options: [
        { value: 'Shredding', label: 'Shredding' }, { value: 'Incineration', label: 'Incineration' },
        { value: 'Digital Deletion', label: 'Digital Deletion' }, { value: 'Archive', label: 'Archive' }
      ]},
      { key: 'remarks', label: 'Remarks', type: 'textarea', showInForm: true, showInDetail: true },
    ]
  },

  changeManagement: {
    key: 'changeManagement',
    title: 'Change Management',
    subtitle: 'Change Requests, Impact Analysis & Approval',
    icon: RefreshCw,
    tableName: 'changeManagement',
    idPrefix: 'CHG',
    statusOptions: ['Requested', 'Under Review', 'Approved', 'Implementing', 'Completed', 'Rejected'],
    defaultStatus: 'Requested',
    fields: [
      { key: 'changeTitle', label: 'Change Title', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'changeType', label: 'Change Type', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Process', label: 'Process Change' }, { value: 'Product', label: 'Product Change' },
        { value: 'Document', label: 'Document Change' }, { value: 'System', label: 'System Change' },
        { value: 'Equipment', label: 'Equipment Change' }, { value: 'Material', label: 'Material Change' }
      ]},
      ...baseFields(),
      { key: 'requestedBy', label: 'Requested By', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'reason', label: 'Reason for Change', type: 'textarea', required: true, showInForm: true, showInDetail: true },
      { key: 'description', label: 'Change Description', type: 'textarea', required: true, showInForm: true, showInDetail: true },
      { key: 'impactAnalysis', label: 'Impact Analysis', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'riskAssessment', label: 'Risk Assessment', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'approvedBy', label: 'Approved By', type: 'text', showInForm: true, showInDetail: true },
      { key: 'implementationDate', label: 'Implementation Date', type: 'date', showInForm: true, showInDetail: true },
      { key: 'verificationResult', label: 'Verification Result', type: 'textarea', showInForm: true, showInDetail: true },
    ]
  },

  productSafety: {
    key: 'productSafety',
    title: 'Product Safety',
    subtitle: 'Product Safety Assessments & Compliance',
    icon: ShieldAlert,
    tableName: 'productSafety',
    idPrefix: 'PSA',
    statusOptions: ['Open', 'Under Assessment', 'Compliant', 'Non-Compliant', 'Closed'],
    defaultStatus: 'Open',
    fields: [
      { key: 'assessmentTitle', label: 'Assessment Title', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'productType', label: 'Product Type', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'buyer', label: 'Buyer', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'style', label: 'Style No.', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      ...baseFields(),
      { key: 'safetyCategory', label: 'Safety Category', type: 'select', showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Chemical', label: 'Chemical Safety' }, { value: 'Physical', label: 'Physical Safety' },
        { value: 'Flammability', label: 'Flammability' }, { value: 'Needle Detection', label: 'Needle Detection' },
        { value: 'Metal Free', label: 'Metal Free' }, { value: 'Age Group', label: 'Age Group Compliance' }
      ]},
      { key: 'regulatoryStandard', label: 'Regulatory Standard', type: 'text', showInForm: true, showInDetail: true, placeholder: 'e.g., CPSIA, REACH, EN 14682' },
      { key: 'testRequired', label: 'Tests Required', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'testResult', label: 'Test Results', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'correctiveAction', label: 'Corrective Action', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'verifiedBy', label: 'Verified By', type: 'text', showInForm: true, showInDetail: true },
    ]
  },

  organogram: {
    key: 'organogram',
    title: 'Organogram',
    subtitle: 'Organizational Structure & Hierarchy',
    icon: Network,
    tableName: 'organogram',
    idPrefix: 'ORG',
    statusOptions: ['Active', 'Draft', 'Archived'],
    defaultStatus: 'Active',
    fields: [
      { key: 'positionTitle', label: 'Position Title', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'employeeName', label: 'Employee Name', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'employeeId', label: 'Employee ID', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      ...baseFields(),
      { key: 'reportsTo', label: 'Reports To', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'level', label: 'Hierarchy Level', type: 'select', showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Top Management', label: 'Top Management' }, { value: 'Senior Management', label: 'Senior Management' },
        { value: 'Middle Management', label: 'Middle Management' }, { value: 'Supervisory', label: 'Supervisory' },
        { value: 'Operational', label: 'Operational' }
      ]},
      { key: 'directReports', label: 'Direct Reports', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'responsibilities', label: 'Key Responsibilities', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'qualifications', label: 'Qualifications Required', type: 'textarea', showInForm: true, showInDetail: true },
    ]
  },

  // ═══ ENHANCED EXISTING MODULES ═══

  kpiRecords: {
    key: 'kpiRecords',
    title: 'KPI Management',
    subtitle: 'Key Performance Indicators & Targets',
    icon: BarChart3,
    tableName: 'kpiRecords',
    idPrefix: 'KPI',
    statusOptions: ['Active', 'Achieved', 'Not Achieved', 'Under Review'],
    defaultStatus: 'Active',
    fields: [
      { key: 'kpiName', label: 'KPI Name', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'kpiCategory', label: 'Category', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Quality', label: 'Quality' }, { value: 'Productivity', label: 'Productivity' },
        { value: 'Delivery', label: 'Delivery' }, { value: 'Safety', label: 'Safety' },
        { value: 'Customer', label: 'Customer Satisfaction' }, { value: 'Cost', label: 'Cost' }
      ]},
      ...baseFields(),
      { key: 'targetValue', label: 'Target Value', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'actualValue', label: 'Actual Value', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'unit', label: 'Unit of Measure', type: 'text', showInForm: true, showInDetail: true, placeholder: 'e.g., %, pcs, hrs' },
      { key: 'frequency', label: 'Monitoring Frequency', type: 'select', showInForm: true, showInDetail: true, options: [
        { value: 'Daily', label: 'Daily' }, { value: 'Weekly', label: 'Weekly' },
        { value: 'Monthly', label: 'Monthly' }, { value: 'Quarterly', label: 'Quarterly' }, { value: 'Annual', label: 'Annual' }
      ]},
      { key: 'dataSource', label: 'Data Source', type: 'text', showInForm: true, showInDetail: true },
      { key: 'trend', label: 'Trend', type: 'select', showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Improving', label: '↑ Improving' }, { value: 'Stable', label: '→ Stable' }, { value: 'Declining', label: '↓ Declining' }
      ]},
      { key: 'remarks', label: 'Remarks', type: 'textarea', showInForm: true, showInDetail: true },
    ]
  },

  qualityGoals: {
    key: 'qualityGoals',
    title: 'Quality Goals',
    subtitle: 'Annual Quality Objectives & Achievement Tracking',
    icon: Target,
    tableName: 'qualityGoals',
    idPrefix: 'QGL',
    statusOptions: ['Active', 'Achieved', 'Partially Achieved', 'Not Achieved', 'Deferred'],
    defaultStatus: 'Active',
    fields: [
      { key: 'goalTitle', label: 'Goal Title', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      ...baseFields(),
      { key: 'year', label: 'Year', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true, placeholder: 'e.g., 2026' },
      { key: 'targetValue', label: 'Target', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'currentValue', label: 'Current Value', type: 'text', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'achievement', label: 'Achievement %', type: 'number', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'deadline', label: 'Deadline', type: 'date', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'actionPlan', label: 'Action Plan', type: 'textarea', showInForm: true, showInDetail: true },
      { key: 'remarks', label: 'Remarks', type: 'textarea', showInForm: true, showInDetail: true },
    ]
  },

  calibrationRecords: {
    key: 'calibrationRecords',
    title: 'Calibration Management',
    subtitle: 'Equipment & Instrument Calibration Records',
    icon: Settings2,
    tableName: 'calibrationRecords',
    idPrefix: 'CAL',
    statusOptions: ['Calibrated', 'Due', 'Overdue', 'Out of Service'],
    defaultStatus: 'Calibrated',
    fields: [
      { key: 'equipmentName', label: 'Equipment Name', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'equipmentId', label: 'Equipment ID', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'equipmentType', label: 'Type', type: 'select', required: true, showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Measuring Tape', label: 'Measuring Tape' }, { value: 'Scale', label: 'Scale / Balance' },
        { value: 'Thermometer', label: 'Thermometer' }, { value: 'Gauge', label: 'Gauge' },
        { value: 'Machine', label: 'Machine' }, { value: 'Other', label: 'Other' }
      ]},
      { key: 'date', label: 'Calibration Date', type: 'date', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'department', label: 'Department', type: 'select', showInForm: true, showInDetail: true, options: DEPARTMENTS.map(d => ({ value: d, label: d })) },
      { key: 'responsiblePerson', label: 'Responsible Person', type: 'text', required: true, showInTable: true, showInForm: true, showInDetail: true },
      { key: 'nextCalibrationDate', label: 'Next Calibration Date', type: 'date', showInTable: true, showInForm: true, showInDetail: true },
      { key: 'calibrationResult', label: 'Result', type: 'select', showInTable: true, showInForm: true, showInDetail: true, options: [
        { value: 'Pass', label: 'Pass' }, { value: 'Fail', label: 'Fail' }, { value: 'Adjusted', label: 'Adjusted & Pass' }
      ]},
      { key: 'calibratedBy', label: 'Calibrated By', type: 'text', showInForm: true, showInDetail: true },
      { key: 'calibrationMethod', label: 'Method / Standard', type: 'text', showInForm: true, showInDetail: true },
      { key: 'certificateNumber', label: 'Certificate Number', type: 'text', showInForm: true, showInDetail: true },
      { key: 'remarks', label: 'Remarks', type: 'textarea', showInForm: true, showInDetail: true },
    ]
  },
};

// Get all module config keys
export const ALL_MODULE_KEYS = Object.keys(MODULE_CONFIGS);
