/**
 * Simplified AQL Sampling Plan Lookup
 * In a real application, this would use a full ANSI/ASQ Z1.4 table.
 */

export const calculateAQLSampling = (
  orderQty: number,
  aqlLevel: '1.5' | '2.5' | '4.0',
  inspectionLevel: '1' | '2' | '3'
): { sampleSize: number; acceptanceNumber: number } => {
  if (orderQty <= 0) return { sampleSize: 0, acceptanceNumber: 0 };

  // Simplified logic for demonstration
  // Inspection Level 1: ~5%, Level 2: ~10%, Level 3: ~20% of orderQty
  const levelMultiplier = inspectionLevel === '1' ? 0.05 : inspectionLevel === '2' ? 0.1 : 0.2;
  const sampleSize = Math.min(orderQty, Math.max(5, Math.ceil(orderQty * levelMultiplier)));

  // Acceptance number based on AQL
  // Lower AQL = stricter = lower acceptance number
  const aqlFactor = aqlLevel === '1.5' ? 0.02 : aqlLevel === '2.5' ? 0.05 : 0.1;
  const acceptanceNumber = Math.max(0, Math.floor(sampleSize * aqlFactor));

  return { sampleSize, acceptanceNumber };
};
