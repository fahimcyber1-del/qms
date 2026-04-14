import { QualityManualRecord } from '../types';

const MOCK_MANUALS: QualityManualRecord[] = [
  {
    id: 'MAN-001',
    title: 'Fabric Cutting Standards',
    description: 'Guidelines for fabric spreading and cutting.',
    category: 'Cutting',
    file: { name: 'Cutting_Manual_V1.pdf', data: '', type: 'application/pdf' },
    version: 'V1.0',
    uploaderName: 'John Doe',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
    versionHistory: [],
    tags: ['cutting', 'fabric', 'standards']
  },
  {
    id: 'MAN-002',
    title: 'Sewing Machine Maintenance',
    description: 'Routine maintenance for lockstitch machines.',
    category: 'Sewing',
    file: { name: 'Sewing_Maintenance.docx', data: '', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    version: 'V2.1',
    uploaderName: 'Sarah Lee',
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-03-01T14:00:00Z',
    versionHistory: [
      { version: 'V2.0', updatedAt: '2026-02-15', updatedBy: 'Sarah Lee', changes: 'Initial' },
      { version: 'V2.1', updatedAt: '2026-03-01', updatedBy: 'Sarah Lee', changes: 'Added oiling schedule' }
    ],
    tags: ['sewing', 'maintenance', 'machine']
  },
  {
    id: 'MAN-003',
    title: 'AQL Inspection Protocol',
    description: 'Standard procedures for final inspection based on AQL 1.5/2.5.',
    category: 'Packing',
    file: { name: 'AQL_Standards_2024.pdf', data: '', type: 'application/pdf' },
    version: 'V4.0',
    uploaderName: 'Arif Ahmed',
    createdAt: '2026-04-01T08:00:00Z',
    updatedAt: '2026-04-01T08:00:00Z',
    versionHistory: [],
    tags: ['aql', 'inspection', 'quality']
  },
  {
    id: 'MAN-004',
    title: 'Chemical Safety Data Sheet (SDS) Summary',
    description: 'Summary of hazardous chemicals used in the washing plant.',
    category: 'Washing',
    file: { name: 'SDS_Summary_Washing.pdf', data: '', type: 'application/pdf' },
    version: 'V1.0',
    uploaderName: 'Compliance Team',
    createdAt: '2026-03-20T11:00:00Z',
    updatedAt: '2026-03-20T11:00:00Z',
    versionHistory: [],
    tags: ['chemical', 'safety', 'compliance']
  },
  {
    id: 'MAN-005',
    title: 'Finishing Benchmarks - Jackets',
    description: 'Visual standards for premium jacket finishing and steaming.',
    category: 'Finishing',
    file: { name: 'Jacket_Benchmarks_V1.pdf', data: '', type: 'application/pdf' },
    version: 'V1.0',
    uploaderName: 'Maria Garcia',
    createdAt: '2026-04-10T15:00:00Z',
    updatedAt: '2026-04-10T15:00:00Z',
    versionHistory: [],
    tags: ['finishing', 'jackets', 'visuals']
  },
  {
    id: 'MAN-006',
    title: 'Metal Detection Calibration Protocol',
    description: 'Step-by-step guide for daily metal detector sensitivity tests.',
    category: 'Packing',
    file: { name: 'Metal_Detection_V2.pdf', data: '', type: 'application/pdf' },
    version: 'V2.0',
    uploaderName: 'James Wilson',
    createdAt: '2026-04-12T09:00:00Z',
    updatedAt: '2026-04-12T09:00:00Z',
    versionHistory: [],
    tags: ['metal-detector', 'safety', 'calibration']
  }
];

export const getManualRecords = (): QualityManualRecord[] => {
  const stored = localStorage.getItem('garmentqms_manuals');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('garmentqms_manuals', JSON.stringify(MOCK_MANUALS));
  return MOCK_MANUALS;
};

export const saveManualRecords = (records: QualityManualRecord[]) => {
  localStorage.setItem('garmentqms_manuals', JSON.stringify(records));
};
