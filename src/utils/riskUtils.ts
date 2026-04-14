import { RiskAssessmentRecord } from '../types';

export const calculateRiskScore = (likelihood: number, severity: number): number => {
  return likelihood * severity;
};

export const determineRiskLevel = (score: number): 'Low' | 'Medium' | 'High' => {
  if (score >= 6) return 'High';
  if (score >= 3) return 'Medium';
  return 'Low';
};

const MOCK_RISKS: RiskAssessmentRecord[] = [
  {
    id: 'RISK-001',
    productName: 'T-Shirt',
    styleNumber: 'TS-2026-A',
    buyer: 'H&M',
    productCategory: 'Knit',
    risks: [
      {
        id: 'RITEM-001',
        processName: 'Sewing',
        operation: 'Sleeve Attach',
        department: 'Production',
        lineSection: 'Line 1',
        criticalProcessCategory: 'Safety Critical',
        hazard: 'Needle breakage',
        riskDescription: 'Broken needle parts may remain in the garment causing injury to end user.',
        likelihood: 3,
        severity: 3,
        riskScore: 9,
        riskLevel: 'High',
        existingControl: 'Needle policy, metal detector',
        correctiveAction: 'Strict enforcement of 9-point needle check, calibrate metal detector daily.',
        responsiblePerson: 'Line Supervisor',
        targetDate: '2026-04-10',
        status: 'Open',
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'RISK-002',
    productName: 'Polo Shirt',
    styleNumber: 'POLO-SS-24',
    buyer: 'Zara',
    productCategory: 'Knit',
    risks: [
      {
        id: 'RITEM-002',
        processName: 'Washing',
        operation: 'Enzyme Wash',
        department: 'Washing',
        lineSection: 'Wash Machine 3',
        criticalProcessCategory: 'Compliance Critical',
        hazard: 'Chemical spillage',
        riskDescription: 'Spillage of enzyme chemicals leading to environmental contamination.',
        likelihood: 2,
        severity: 2,
        riskScore: 4,
        riskLevel: 'Medium',
        existingControl: 'Secondary containment, PPE',
        correctiveAction: 'Conduct weekly chemical handling training.',
        responsiblePerson: 'Wash Manager',
        targetDate: '2026-04-15',
        status: 'Open',
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'RISK-003',
    productName: 'Denim Jacket',
    styleNumber: 'DNM-JK-01',
    buyer: 'Levi\'s',
    productCategory: 'Denim',
    risks: [
      {
        id: 'RITEM-003',
        processName: 'Fusing',
        operation: 'Interlining Fusing',
        department: 'Cutting',
        lineSection: 'Fusing Unit 1',
        criticalProcessCategory: 'Quality Critical',
        hazard: 'Insufficient Bond Strength',
        riskDescription: 'Interlining may peel off during garment wash or use.',
        likelihood: 2,
        severity: 3,
        riskScore: 6,
        riskLevel: 'High',
        existingControl: 'Daily fusing test, temperature log',
        correctiveAction: 'Calibrate pressure and temperature every 4 hours.',
        responsiblePerson: 'Cutting HOD',
        targetDate: '2026-05-01',
        status: 'Open',
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'RISK-003',
    productName: 'Denim Jacket',
    styleNumber: 'DNM-JKT-101',
    buyer: 'Levi\'s',
    productCategory: 'Denim',
    risks: [
      {
        id: 'RITEM-003',
        processName: 'Fusing',
        operation: 'Interlining Fusing',
        department: 'Production',
        lineSection: 'Fusing Section',
        criticalProcessCategory: 'Quality Critical',
        hazard: 'Bonding failure',
        riskDescription: 'Interlining peeling off after washing due to incorrect temperature/pressure.',
        likelihood: 2,
        severity: 3,
        riskScore: 6,
        riskLevel: 'High',
        existingControl: 'Fusing machine temperature gauge',
        correctiveAction: 'Twice daily peel test, digital pressure sensor calibration.',
        responsiblePerson: 'Fusing In-charge',
        targetDate: '2024-12-01',
        status: 'Open',
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const getRiskAssessments = (): RiskAssessmentRecord[] => {
  const stored = localStorage.getItem('garmentqms_risks');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Migrate old format to new format if 'risks' array is missing
      const migrated = parsed.map((item: any) => {
        if (!item.risks) {
          return {
            id: item.id,
            productName: item.productName || '',
            styleNumber: item.styleNumber || '',
            buyer: item.buyer || '',
            orderNumber: item.orderNumber,
            productCategory: item.productCategory || 'Knit',
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString(),
            risks: [
              {
                id: `RITEM-${item.id || Date.now()}`,
                processName: item.processName || '',
                operation: item.operation || '',
                department: item.department || '',
                lineSection: item.lineSection || '',
                criticalProcessCategory: item.criticalProcessCategory || 'Quality Critical',
                hazard: item.hazard || '',
                riskDescription: item.riskDescription || '',
                likelihood: item.likelihood || 1,
                severity: item.severity || 1,
                riskScore: item.riskScore || 1,
                riskLevel: item.riskLevel || 'Low',
                existingControl: item.existingControl || '',
                correctiveAction: item.correctiveAction || '',
                responsiblePerson: item.responsiblePerson || '',
                targetDate: item.targetDate || '',
                status: item.status || 'Open',
              }
            ]
          };
        }
        return item;
      });
      return migrated;
    } catch (e) {
      console.error("Failed to parse risks", e);
    }
  }
  localStorage.setItem('garmentqms_risks', JSON.stringify(MOCK_RISKS));
  return MOCK_RISKS;
};

export const saveRiskAssessments = (risks: RiskAssessmentRecord[]) => {
  localStorage.setItem('garmentqms_risks', JSON.stringify(risks));
};
