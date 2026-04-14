import { OperationalGuideline } from '../types';

const MOCK_GUIDELINES: OperationalGuideline[] = [
  {
    id: 'GL-001',
    title: 'Basic Safety Guideline',
    department: 'Sewing',
    category: 'Safety',
    content: 'Keep your workstation clean.',
    version: 'V1.0',
    issueDate: '2024-01-01',
    nextReviewDate: '2025-01-01',
    approvedBy: 'Compliance Head',
    status: 'Active',
    versionHistory: [],
    acknowledgements: []
  }
];

export const getGuidelineRecords = (): OperationalGuideline[] => {
  return MOCK_GUIDELINES;
};

export const saveGuidelineRecords = (records: OperationalGuideline[]) => {
  localStorage.setItem('garmentqms_guidelines', JSON.stringify(records));
};
