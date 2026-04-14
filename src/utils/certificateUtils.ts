import { CertificateRecord } from '../types';

const MOCK_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'CERT-001',
    name: 'ISO 9001:2015',
    type: 'Factory',
    number: 'ISO-9001-2023-001',
    issuedBy: 'SGS Bangladesh Ltd.',
    issueDate: '2023-01-15',
    expiryDate: '2026-01-14',
    status: 'Active',
    department: 'Quality',
    documentUrls: ['iso_9001.pdf'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'CERT-002',
    name: 'BSCI - Business Social Compliance',
    type: 'Compliance',
    number: 'BSCI-2024-882',
    issuedBy: 'Bureau Veritas',
    issueDate: '2024-03-10',
    expiryDate: '2026-03-09',
    status: 'Active',
    department: 'Compliance',
    documentUrls: ['bsci_cert.pdf'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'CERT-003',
    name: 'SEDEX / SMETA',
    type: 'Compliance',
    number: 'SEDEX-2022-11',
    issuedBy: 'Intertek',
    issueDate: '2022-10-22',
    expiryDate: '2025-04-30',
    status: 'Active',
    department: 'Compliance',
    documentUrls: ['sedex.pdf'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'CERT-004',
    name: 'OEKO-TEX Standard 100',
    type: 'Testing',
    number: 'OEKO-2021-99',
    issuedBy: 'Hohenstein',
    issueDate: '2021-01-10',
    expiryDate: '2022-01-09',
    status: 'Expired',
    department: 'Lab',
    documentUrls: ['oeko_tex.pdf'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'CERT-005',
    name: 'WRAP - Worldwide Responsible Accredited Production',
    type: 'Compliance',
    number: 'WRAP-GOLD-2024',
    issuedBy: 'Intertek',
    issueDate: '2024-05-20',
    expiryDate: '2025-05-19',
    status: 'Active',
    department: 'Compliance',
    documentUrls: ['wrap_cert.pdf'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'CERT-006',
    name: 'GOTS - Global Organic Textile Standard',
    type: 'Testing',
    number: 'GOTS-ORG-2023',
    issuedBy: 'Control Union',
    issueDate: '2023-11-15',
    expiryDate: '2024-11-14',
    status: 'Active',
    department: 'Lab',
    documentUrls: ['gots_cert.pdf'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'CERT-006',
    name: 'GOTS (Global Organic Textile Standard)',
    type: 'Sustainability',
    number: 'GOTS-CU-8832',
    issuedBy: 'Control Union',
    issueDate: '2023-09-01',
    expiryDate: '2024-08-31',
    status: 'Active',
    department: 'Quality',
    documentUrls: ['gots.pdf'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'CERT-007',
    name: 'HIGG Index - FEM/FSLM',
    type: 'Environmental',
    number: 'HIGG-2024-FAC',
    issuedBy: 'Sustainable Apparel Coalition',
    issueDate: '2024-02-15',
    expiryDate: '2025-02-14',
    status: 'Active',
    department: 'Compliance',
    documentUrls: ['higg.pdf'],
    createdAt: new Date().toISOString()
  }
];

export const getCertificates = (): CertificateRecord[] => {
  const stored = localStorage.getItem('garmentqms_certificates');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('garmentqms_certificates', JSON.stringify(MOCK_CERTIFICATES));
  return MOCK_CERTIFICATES;
};

export const saveCertificates = (certs: CertificateRecord[]) => {
  localStorage.setItem('garmentqms_certificates', JSON.stringify(certs));
};

export const checkCertificateStatus = (expiryDate: string): 'Active' | 'Expired' | 'Pending' => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  
  // Reset time part for accurate day comparison
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  if (expiry < today) {
    return 'Expired';
  }
  return 'Active';
};

export const getDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
