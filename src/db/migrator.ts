import { db } from './db';

// This function scans all known localStorage keys and injects the parsed data into the new SQLite-based IndexedDb backend.
export const migrateLocalStorageToDatabase = async () => {
  try {
    const keysMap = {
      'qms_audits': db.audits,
      'qms_capa': db.capas,
      'qms_defect_cats': db.defectCategories,
      'qms_defects': db.defects,
      'qms_certs': db.certificates,
      'qms_risk': db.risks,
      'qms_sops': db.sops,
      'qms_manuals': db.qualityManuals,
      'qms_guidelines': db.operationalGuidelines,
      'qms_docs': db.documents,
      'qms_procedures': db.procedures,
      'qms_jd': db.jobDescriptions,
      'qms_prod_quality': db.productionQuality,
      'garmentqms_inspections': db.aqlInspections
    };

    for (const [lsKey, table] of Object.entries(keysMap)) {
      const dataStr = localStorage.getItem(lsKey);
      if (dataStr) {
        try {
          const data = JSON.parse(dataStr);
          if (Array.isArray(data) && data.length > 0) {
            const count = await table.count();
            if (count === 0) {
              // @ts-ignore
              await table.bulkAdd(data);
              console.log(`Migrated ${data.length} records into ${table.name}`);
            }
          }
        } catch (err) {
          console.error(`Failed to migrate ${lsKey}`, err);
        }
      }
    }
  } catch (error) {
    console.error('Migration failed:', error);
  }
};
