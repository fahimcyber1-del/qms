import { InspectionRecord } from '../types';
import { db } from '../db/db';

export const getProductionQualityRecords = (): InspectionRecord[] => {
  const records = localStorage.getItem('qms_prod_quality');
  if (records) {
    return JSON.parse(records);
  }
  return [
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      factory: 'Main Factory',
      unit: 'Unit-1',
      section: 'Sewing',
      floor: '1st',
      lineNumber: 'Line-1',
      style: 'S-1001',
      orderNumber: 'ORD-5001',
      buyer: 'Buyer A',
      operatorId: 'OP-101',
      qcInspector: 'QC-01',
      dayTarget: 500,
      checkedQuantity: 450,
      goodsQuantity: 430,
      totalDefects: 25,
      standardRft: 98,
      standardDhu: 2,
      standardPercentageDefective: 3,
      shift: 'Day',
      machineNumber: 'M-01',
      remark: 'Good quality overall',
      source: 'detailed',
      topDefects: [{ name: 'Broken Stitch', count: 10 }, { name: 'Oil Stain', count: 8 }],
      uid: 'mock',
      attachments: []
    },
    {
      id: '2',
      date: new Date().toISOString().split('T')[0],
      factory: 'Main Factory',
      unit: 'Unit-2',
      section: 'Finishing',
      floor: '3rd',
      lineNumber: 'Line-12',
      style: 'POLO-202',
      orderNumber: 'ORD-9921',
      buyer: 'Zara',
      operatorId: 'OP-552',
      qcInspector: 'QC-08',
      dayTarget: 800,
      checkedQuantity: 780,
      goodsQuantity: 760,
      totalDefects: 30,
      standardRft: 97,
      standardDhu: 3,
      standardPercentageDefective: 4,
      shift: 'Night',
      machineNumber: 'M-115',
      remark: 'Button pull test failed in morning, re-tested ok.',
      source: 'detailed',
      topDefects: [{ name: 'Loose Button', count: 15 }, { name: 'Untrimmed Thread', count: 10 }],
      uid: 'mock',
      attachments: []
    },
    {
      id: '3',
      date: new Date().toISOString().split('T')[0],
      factory: 'Annex Facility',
      unit: 'Unit-A',
      section: 'Cutting',
      floor: 'Basement',
      lineNumber: 'Table-04',
      style: 'DNM-55',
      orderNumber: 'ORD-4410',
      buyer: 'Levi\'s',
      operatorId: 'OP-901',
      qcInspector: 'QC-15',
      dayTarget: 1200,
      checkedQuantity: 1150,
      goodsQuantity: 1140,
      totalDefects: 12,
      standardRft: 99,
      standardDhu: 1,
      standardPercentageDefective: 1,
      shift: 'Day',
      machineNumber: 'CAD-01',
      remark: 'Auto-cutter maintenance performed.',
      source: 'detailed',
      topDefects: [{ name: 'Shade Variation', count: 5 }, { name: 'Cut mark', count: 4 }],
      uid: 'mock',
      attachments: []
    },
    {
      id: '4',
      date: new Date().toISOString().split('T')[0],
      factory: 'Main Factory',
      unit: 'Unit-1',
      section: 'Sewing',
      floor: '1st',
      lineNumber: 'Line-5',
      style: 'S-990',
      orderNumber: 'ORD-990',
      buyer: 'Buyer B',
      operatorId: 'OP-202',
      qcInspector: 'QC-02',
      dayTarget: 300,
      checkedQuantity: 200,
      goodsQuantity: 190,
      totalDefects: 12,
      standardRft: 98,
      standardDhu: 2,
      standardPercentageDefective: 3,
      shift: 'Day',
      machineNumber: 'M-05',
      remark: 'Quick entry record.',
      source: 'quick',
      topDefects: [],
      uid: 'mock',
      attachments: []
    }
  ];
};

export const saveProductionQualityRecords = (records: InspectionRecord[]) => {
  localStorage.setItem('qms_prod_quality', JSON.stringify(records));
  // Background dump to Dexie for relational linking
  if (records.length > 0) {
    db.productionQuality.clear().then(() => {
      // @ts-ignore
      db.productionQuality.bulkAdd(records).catch(e => console.error("Dexie push failed", e));
    });
  } else {
    db.productionQuality.clear();
  }
};
