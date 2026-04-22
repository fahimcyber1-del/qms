import { DocumentControlRecord } from '../types';

const getCategory = (name: string) => {
  if (name.includes('(IE)')) return 'IE';
  if (name.includes('(GPQ)')) return 'GPQ';
  if (name.includes('Audit')) return 'Audit';
  if (name.includes('Training')) return 'Training';
  if (name.includes('Fabrics') || name.includes('Cut') || name.includes('Marker') || name.includes('Spreading')) return 'Cutting';
  if (name.includes('Sewing') || name.includes('Needle')) return 'Sewing';
  if (name.includes('Finishing') || name.includes('Packing')) return 'Finishing';
  if (name.includes('Metal') || name.includes('Sharp tools')) return 'Safety';
  if (name.includes('Calibration') || name.includes('Machine')) return 'Maintenance';
  if (name.includes('Supplier')) return 'Supplier';
  if (name.includes('Internal Audit')) return 'Audit';
  return 'General';
};

export const DOCUMENT_NAMES = [
  "Daily Toilet Check List", "Sharp tools report", "Accessories inspection report (10%, AQL & 100%)", "Bin card",
  "Fabrics inspection report", "Fabrics inspection Summary report", "Shade band report", "Iron cleaning report",
  "Size set measurement correction report", "Fabrics relaxation report", "Pattern check report", "Marker check report",
  "Spreading quality control report", "Cut panel verify report", "Cut panel inspection report", "Cut panel Change (replacement) report",
  "Fusing report", "Sewing inline inspection", "Sewing endline report", "Sewing audit report", "Before wash measurement report",
  "Machine servicing card report", "Calibration list", "Quality Training attendance", "Daily Pull test report",
  "100% Button check report", "Finishing inside + Top side check report", "Finishing Topside check report", "Get-up check report",
  "Finishing measurement check report", "Finishing Audit report", "SKU check report", "PP Meeting Minute",
  "Finishing inline report (GPQ)", "Humidity report", "Pre-final inspection report (GPQ)", "Daily inline report Sewing (GPQ)",
  "Fabrics shrinkage report", "Accessories inspection report (100%)", "Center to selvedge check report (CSV)",
  "Embroidery/ Printing Inspection Report", "Washing Quality inspection", "Metal detector calibration report",
  "Bundle & Numbering check report", "PP meeting format (GPQ)", "Daily Rejection Report", "Button machine cleaning report",
  "Packing Audit report", "First Production Analysis Report", "Accessories Inventory Report", "Lay Chart",
  "Daily Production Report (IE)", "Capacity study (IE)", "Production study (IE)", "Recruitment & assessment report (IE)",
  "Quality Training record", "Quality Training Observation report", "Operation bulletin (IE)", "Line planning (IE)",
  "Monthly machine list update (IE)", "Daily Cutting report", "Style closing report (IE)", "Sewing hourly production report",
  "Finishing hourly production report", "Machine Oil Control", "Risk assessment", "Internal audit check list & record",
  "Internal audit report", "Non-Conformity report", "Defect Summary", "Visitor Register-Metal Detector",
  "Quality Training Record- Assessment (Staff)", "Process Scheme Report", "Product Risk Assessment", "Process Risk Assessment",
  "Weekly Lighting Lux check Report", "Quality Plan", "Master Control List", "Circulation Record", "Data Change Proposal",
  "Obsolete Document", "Management Review meeting Agenda", "Management Review meeting Minutes", "Quality Record List",
  "Corrective & Preventive Action Request", "Corrective & Preventive Action Log", "Training Needs Assessment Record",
  "Customer Satisfaction Feedback Form", "Approval Supplier List", "Supplier performance Evaluation Summary",
  "Internal Audit Activity Log", "Internal Audit Activity Report", "Internal Audit Non-Conformity Report",
  "Daily Floor Check List", "Daily Needle Issue Report", "Needle Control and Broken Needle Control Log",
  "Missing Needle (Fabrics Check Report)", "Sample Check Report", "Daily QC Defect Check Report", "Snap Fastener In-Process Log",
  "Metal detector report", "RCA (Root Cause Analysis) CAP", "Pull Test Machine Calibration Report", "Final Reject Goods Status",
  "Stock Register Format", "TLS Observation Report", "QI Weak Performer", "Monthly Needle Closing Report",
  "Trim Status Record", "Accessories Status Record", "Measurement Check Report", "Stitch Monitoring & Needle Sharpness Report",
  "Authorization Letter", "Color Fastness Test", "Daily Label Issue Record", "Fabrics G.S.M Check report",
  "Fabrics Bias & Bowing Check report", "First and Last Button Check Record for Lockstitch", "Finished Goods Keeping Record",
  "Defect Categories for Accessories Inspection", "In Process Audit report", "Garments Inline report", "Daily Spot Record",
  "Daily Sewing Spot Record", "Monthly Spot Record", "Technical Meeting Format", "Cutting Table Inspection-Working Procedure",
  "Sewing Table Inspection-Working Procedure", "Finishing Table Inspection-Working Procedure", "Procedure of Warehouse",
  "Procedure of Product Testing", "Metal Communication Garments Register", "Garments Inspection report",
  "Sewing Mock Up (Operation Specification Sheet)", "Customer Complain Register", "Product Shelf life Declaration",
  "Training Assessment Report", "Fusing Data Sheet", "Metal Detection Inspector Report", "Policy for Line Cleaning for New Style",
  "Without Process Report", "Sewing Line Feeding", "Needle Change Check Report", "Hourly Audit Report", "After Count Size Label Input",
  "Style Check Report (Top & Bottom)", "Knife Machine & Assembly Point Check Report", "Quality Inspector Performance",
  "Hourly Alter & Rectify Report", "Nickel Test Report", "Daily Quality Summary", "Monthly Quality Performance",
  "Line Wise DHU Report", "Top 5 Defects Analysis", "RFT Trend Analysis", "Endline Quality Report", "Inline Quality Report",
  "Pre-Final Audit Report", "Final Inspection Summary", "Buyer Wise Quality Report", "Machine Maintenance Log",
  "Needle Breakage Analysis", "Spotting Record Summary", "Accessories Quality Log", "Fabric Inspection Log",
  "Cutting Quality Audit", "Finishing Quality Audit", "Packing Quality Audit", "Shipment Quality Release"
];

export const MOCK_DOCS = DOCUMENT_NAMES.map((name, index) => ({
  id: `DOC-INIT-${(index + 1).toString().padStart(3, '0')}`,
  docTitle: name,
  docNumber: `QMS/FORM/${(index + 1).toString().padStart(3, '0')}`,
  category: getCategory(name),
  revision: '01',
  status: 'Published',
  department: getCategory(name),
  responsiblePerson: 'System Admin',
  releaseDate: '2024-01-01',
  createdAt: new Date().toISOString(),
  createdBy: 'System Admin',
  updatedAt: new Date().toISOString(),
  updatedBy: 'System Admin',
  attachments: [],
  comments: [],
  history: []
}));

export const getDocuments = () => {
  return MOCK_DOCS;
};

