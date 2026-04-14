export const getSamplingPlan = (lotSize: number, aql: string) => {
  // Simplified lookup based on the provided table for Level-I
  // Values: [Sample Size, Ac, Re]
  
  let sampleSize = 0;
  let ac = 0;
  let re = 0;

  if (lotSize <= 8) { sampleSize = 2; }
  else if (lotSize <= 15) { sampleSize = 3; }
  else if (lotSize <= 25) { sampleSize = 5; }
  else if (lotSize <= 50) { sampleSize = 8; }
  else if (lotSize <= 90) { sampleSize = 13; }
  else if (lotSize <= 150) { sampleSize = 20; }
  else if (lotSize <= 280) { sampleSize = 32; }
  else if (lotSize <= 500) { sampleSize = 50; }
  else if (lotSize <= 1200) { sampleSize = 80; }
  else if (lotSize <= 3200) { sampleSize = 125; }
  else if (lotSize <= 10000) { sampleSize = 200; }
  else { sampleSize = 315; }

  if (aql === '2.5') {
    if (lotSize <= 50) { ac = 0; re = 1; }
    else if (lotSize <= 150) { ac = 1; re = 2; }
    else if (lotSize <= 280) { ac = 2; re = 3; }
    else if (lotSize <= 500) { ac = 3; re = 4; }
    else if (lotSize <= 1200) { ac = 5; re = 6; }
    else if (lotSize <= 3200) { ac = 7; re = 8; }
    else if (lotSize <= 10000) { ac = 10; re = 11; }
    else { ac = 14; re = 15; }
  } else if (aql === '4.0') {
    if (lotSize <= 25) { ac = 0; re = 1; }
    else if (lotSize <= 90) { ac = 1; re = 2; }
    else if (lotSize <= 150) { ac = 2; re = 3; }
    else if (lotSize <= 280) { ac = 3; re = 4; }
    else if (lotSize <= 500) { ac = 5; re = 6; }
    else if (lotSize <= 1200) { ac = 7; re = 8; }
    else if (lotSize <= 3200) { ac = 10; re = 11; }
    else if (lotSize <= 10000) { ac = 14; re = 15; }
    else { ac = 21; re = 22; }
  } else {
    // Default or 1.5 logic (not in table, using 2.5 as fallback)
    return getSamplingPlan(lotSize, '2.5');
  }

  return { sampleSize, ac, re };
};
