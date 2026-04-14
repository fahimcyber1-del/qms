import { db } from '../db/db';
import { UniversalRecord } from '../types';

async function seedTable(tableName: string, records: any[]) {
  const table = (db as any)[tableName];
  if (!table) return;
  
  const count = await table.count();
  if (count === 0) {
    const now = new Date().toISOString();
    const fullRecords: UniversalRecord[] = records.map(r => ({
      attachments: [],
      comments: [],
      history: [],
      createdBy: 'System Seeder',
      updatedBy: 'System Seeder',
      updatedAt: now,
      createdAt: now,
      ...r
    }));
    await table.bulkAdd(fullRecords);
    console.log(`Seeded ${tableName} with ${fullRecords.length} records.`);
  }
}

export async function seedUniversalModules() {
  const now = new Date().toISOString();

  // ── 1. Supplier Management ──
  await seedTable('supplierManagement', [
    {
      id: 'SUP-001', supplierName: 'Fabric Innovators Ltd', supplierCode: 'FIL-101', supplierType: 'Fabric',
      contactPerson: 'Arif Ahmed', email: 'sales@fabricinnovators.com', phone: '+880-171-1223344',
      address: 'Industrial Plot 15, Gazipur, Bangladesh', qualityRating: 'A', lastAuditDate: '2024-01-10',
      certifications: 'ISO 9001, OEKO-TEX', status: 'Active'
    },
    {
      id: 'SUP-002', supplierName: 'Classic Trims & Accessories', supplierCode: 'CTA-202', supplierType: 'Accessories',
      contactPerson: 'Nila Sultana', email: 'info@classictrims.com', phone: '+880-171-5566778',
      address: 'Uttara Sector 7, Dhaka', qualityRating: 'B', lastAuditDate: '2023-11-20',
      certifications: 'GRS Certified', status: 'Active'
    }
  ]);

  // ── 2. Sub-Supplier Management ──
  await seedTable('subSupplierManagement', [
    {
      id: 'SUB-001', supplierName: 'Apex Dyeing Sub-Unit', process: 'Fabric Dyeing',
      address: 'Narayanganj BSCIC', contactPerson: 'Mr. Rahim', designation: 'Production Manager',
      email: 'dyeing@apex.com', phone: '01711223344', source: 'Primary Supplier Apex',
      score: 85, status: 'Active'
    }
  ]);

  // ── 3. Training ──
  await seedTable('training', [
    {
      id: 'TRN-001', trainingTitle: 'Chemical Handling Safety', trainingType: 'Safety',
      department: 'Washing', date: '2024-02-15', responsiblePerson: 'Mr. Safety',
      trainer: 'Global Compliance Ltd', participants: 'Operator 1, Operator 2, Supervisor',
      participantCount: 15, duration: 4, venue: 'Training Room A',
      effectiveness: 'Excellent', status: 'Completed'
    }
  ]);

  // ── 4. Customer Complaints ──
  await seedTable('customerComplaints', [
    {
      id: 'CC-001', complaintTitle: 'Shade Variation in Style #X77', buyer: 'H&M',
      orderNumber: 'ORD-7662', style: 'TS-SUMMER-BLUE', department: 'Quality',
      date: '2024-03-01', responsiblePerson: 'Kamrul Hasan', complaintType: 'Quality',
      severity: 'Major', description: 'Buyer reported 3 shade variation levels within the same carton.',
      rootCause: 'Improper fabric relaxation and batch mixing in cutting.',
      status: 'Corrective Action'
    }
  ]);

  // ── 5. Testing Management ──
  await seedTable('testing', [
    {
      id: 'TST-001', testName: 'Dimensional Stability after Washing', testType: 'Dimensional Stability',
      sampleId: 'SAM-88', buyer: 'Zara', style: 'PL-2024', department: 'Lab',
      date: '2024-03-05', responsiblePerson: 'Lab In-charge', labName: 'Internal Lab',
      standardApplied: 'ISO 6330', testResult: 'Pass', expectedValue: '+/- 3%',
      actualValue: '-1.2%', status: 'Pass'
    }
  ]);

  // ── 6. Meeting Minutes ──
  await seedTable('meetingMinutes', [
    {
      id: 'MTG-001', meetingTitle: 'Monthly Quality Review', meetingType: 'Quality Review',
      department: 'Quality', date: '2024-03-10', responsiblePerson: 'Admin',
      chairperson: 'Plant Manager', attendees: 'All Dept Heads', agenda: 'Recurrent defect analysis',
      discussions: 'End-line defects increased by 2% in Sewing Line 4.',
      decisions: 'Additional training for the specific sewing operation required.',
      actionItems: 'HR to schedule training by next Friday.', status: 'Completed'
    }
  ]);

  // ── 7. Order Summary ──
  await seedTable('orderSummary', [
    {
      id: 'ORD-001', buyer: 'Target', orderNumber: 'TGT-9921', style: 'JKT-WINTER',
      date: '2024-01-20', quantity: 50000, deliveryDate: '2024-06-15',
      department: 'Merchandising', responsiblePerson: 'Fahim Ahmed',
      fabricType: 'Heavy Denim', color: 'Midnight Black', shipmentMode: 'Sea',
      status: 'In Production'
    }
  ]);

  // ── 8. NCR ──
  await seedTable('ncr', [
    {
      id: 'NCR-001', ncrTitle: 'Interlining Fusing Peel Strength Failure', ncrType: 'Product',
      department: 'Production', date: '2024-03-11', responsiblePerson: 'Supervisor',
      detectedBy: 'QC Inspector', detectionStage: 'In-Process',
      description: 'Peel strength below 5N for interlining in collar section.',
      disposition: 'Rework', rootCause: 'Fusing machine temperature fluctuation.',
      correctiveAction: 'Calibrate machine and reheat affected parts.',
      status: 'Open'
    }
  ]);

  // ── 9. Root Cause Analysis ──
  await seedTable('rootCauseAnalysis', [
    {
      id: 'RCA-001', problemTitle: 'Repeat Needle Marks in Line 05', sourceModule: 'Inspection',
      referenceId: 'INSP-771', department: 'Sewing', date: '2024-03-12',
      responsiblePerson: 'IE Manager', problemDescription: 'Constant needle marks detected at end-line.',
      analysisMethod: '5 Why', why1: 'Needle is damaged', why2: 'Machine is running too fast',
      why3: 'Operator is not checking regularly', why4: 'Lack of training on machine setup',
      why5: 'Inadequate supervisory oversight', rootCause: 'Machine speed exceeded safety limits.',
      status: 'Completed'
    }
  ]);

  // ── 10. Management Review ──
  await seedTable('managementReview', [
    {
      id: 'MRM-001', reviewTitle: 'Q1 Management Review Meeting', reviewType: 'Quarterly',
      date: '2024-03-15', chairperson: 'Managing Director', department: 'Management',
      responsiblePerson: 'QMS Manager', attendees: 'Board of Directors, GM, HODs',
      inputItems: 'Internal audit reports, KPI trends, Customer feedback',
      outputDecisions: 'Approved purchase of 5 new automatic sewing machines.',
      actionItems: 'Finance to release funds by April.', status: 'Scheduled'
    }
  ]);

  // ── 11. Equipment Maintenance ──
  await seedTable('equipmentMaintenance', [
    {
      id: 'EQM-001', equipmentName: 'Juki Automatic Placket Machine', equipmentId: 'JUK-7721',
      maintenanceType: 'Preventive', department: 'Maintenance', date: '2024-03-01',
      responsiblePerson: 'Tech Lead', location: 'Sewing Floor A',
      scheduledDate: '2024-03-01', completionDate: '2024-03-01',
      workDescription: 'Oil change and sensor cleaning performed.',
      status: 'Completed'
    }
  ]);

  // ── 12. Incoming QC ──
  await seedTable('incomingQC', [
    {
      id: 'IQC-001', materialName: 'Organic Cotton Twill', materialType: 'Fabric',
      supplier: 'Sustainable Textiles', lotNumber: 'LT-8822', date: '2024-02-28',
      department: 'Fabric Store', responsiblePerson: 'Store Manager',
      receivedQty: 5000, inspectedQty: 500, acceptedQty: 480, rejectedQty: 20,
      defectsFound: 'Minor pilling detected in 2 rolls.', status: 'Pass'
    }
  ]);

  // ── 13. Final Inspection ──
  await seedTable('finalInspection', [
    {
      id: 'FIN-001', inspectionTitle: 'Polo Shirt Pre-Shipment Audit', buyer: 'Next',
      orderNumber: 'NX-2211', style: 'PL-WHITE', date: '2024-03-14',
      department: 'Quality', responsiblePerson: 'Final Auditor',
      orderQty: 20000, inspectedQty: 315, aqlLevel: '2.5',
      criticalDefects: 0, majorDefects: 2, minorDefects: 2,
      measurementCheck: 'Pass', packingCheck: 'Pass', status: 'Pass'
    }
  ]);

  // ── 14. Continuous Improvement ──
  await seedTable('continuousImprovement', [
    {
      id: 'CI-001', improvementTitle: 'Digital Thread Consumption Tracking', category: 'Cost Reduction',
      department: 'IE', date: '2024-01-15', responsiblePerson: 'IE Head',
      currentSituation: 'Thread consumption calculated manually, 5% error margin.',
      proposedImprovement: 'Implement GSD software integration for accurate thread estim.',
      expectedBenefit: 'Expected thread saving of $2000/month.',
      targetDate: '2024-04-30', status: 'In Progress'
    }
  ]);

  // ── 15. KPI Records ──
  await seedTable('kpiRecords', [
    {
      id: 'KPI-001', kpiName: 'End-Line Pass Rate', kpiCategory: 'Quality',
      department: 'Production', date: '2024-03-01', responsiblePerson: 'PM',
      targetValue: '98%', actualValue: '96.5%', unit: '%', frequency: 'Daily',
      dataSource: 'Inspection Reports', trend: 'Stable', status: 'Active'
    }
  ]);

  // ── 16. Calibration Records ──
  await seedTable('calibrationRecords', [
    {
      id: 'CAL-001', equipmentName: 'Digital Weighing Scale', equipmentId: 'SC-L-01',
      equipmentType: 'Scale', date: '2024-01-05', department: 'Lab',
      responsiblePerson: 'Lab Manager', nextCalibrationDate: '2025-01-04',
      calibrationResult: 'Pass', calibratedBy: 'Third Party BSTI',
      certificateNumber: 'BSTI/SC/2024/991', status: 'Calibrated'
    }
  ]);

  // ── 17. Record Retention Control ──
  await seedTable('recordRetention', [
    {
      id: 'RRC-001', recordTitle: 'Daily Inspection Reports 2023', recordType: 'Inspection Record',
      department: 'Quality', date: '2024-01-01', responsiblePerson: 'Doc Controller',
      retentionPeriod: 5, location: 'Archive Room B / Box 12', medium: 'Both',
      disposalDate: '2028-12-31', status: 'Active'
    }
  ]);

  // ── 18. Change Management ──
  await seedTable('changeManagement', [
    {
      id: 'CHG-001', changeTitle: 'Switch from Manual to Automatic Spread Machine', changeType: 'Equipment',
      department: 'Cutting', date: '2024-02-10', responsiblePerson: 'Cutting Head',
      requestedBy: 'Fahim Ahmed', reason: 'To increase cutting efficiency.',
      description: 'Replace spread table 1 with automatic spreader.',
      impactAnalysis: 'Low risk of downtime, high productivity gain.',
      approvedBy: 'GM Operations', implementationDate: '2024-03-20', status: 'Approved'
    }
  ]);

  // ── 19. Product Safety ──
  await seedTable('productSafety', [
    {
      id: 'PSA-001', assessmentTitle: 'Kids Wear Metal Detection Compliance', productType: 'Romper',
      buyer: 'Walmart', style: 'WM-KID-TS', department: 'Compliance',
      date: '2024-03-12', responsiblePerson: 'Safety Officer', safetyCategory: 'Needle Detection',
      regulatoryStandard: 'CPSIA', testRequired: 'Metal detection for all units.',
      testResult: '100% Units Passed', status: 'Compliant'
    }
  ]);

  // ── 20. Process Interaction Matrix ──
  await seedTable('processInteractionMatrix', [
    {
      id: 'PIM-001', processName: 'Raw Material Procurement', processOwner: 'Purchase Manager',
      department: 'Commercial', date: '2024-01-10', responsiblePerson: 'Admin',
      processType: 'Core', inputs: 'Tech Pack, Fabric Requisition',
      outputs: 'Fabric Inhouse, Accessories Inhouse', upstreamProcess: 'Merchandising',
      downstreamProcess: 'Fabric Inspection, Cutting', kpis: 'Procurement Lead Time',
      isoClause: '8.4 Control of externally provided processes', status: 'Approved'
    }
  ]);

  // Remaining generic modules in MODULE_CONFIGS
  const allKeys = [
    'training', 'supplierManagement', 'subSupplierManagement', 'customerComplaints', 
    'testing', 'meetingMinutes', 'orderSummary', 'ncr', 'rootCauseAnalysis', 
    'managementReview', 'equipmentMaintenance', 'incomingQC', 'finalInspection', 
    'continuousImprovement', 'processInteractionMatrix', 'recordRetention', 
    'changeManagement', 'productSafety', 'kpiRecords', 'qualityGoals', 'calibrationRecords'
  ];
  
  // Handled specifically above, any missed will get a record here
  for (const moduleName of allKeys) {
    const table = (db as any)[moduleName];
    if (table) {
      const count = await table.count();
      if (count === 0) {
        await table.add({
          id: `REC-${moduleName.toUpperCase().slice(0, 3)}-SEED`,
          title: `Initial ${moduleName} Dataset`,
          status: 'Active',
          createdAt: now,
          updatedAt: now,
          createdBy: 'System Seeder',
          updatedBy: 'System Seeder',
          attachments: [],
          comments: [],
          history: [],
          department: 'Quality',
          responsiblePerson: 'System Seeder'
        });
      }
    }
  }
}
