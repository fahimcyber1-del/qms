import { db } from '../db/db';

export interface BackupData {
  version: number;
  timestamp: string;
  dexie: { [tableName: string]: any[] };
  localStorage: { [key: string]: string };
}

export async function exportFullBackup(): Promise<BackupData> {
  const backup: BackupData = {
    version: 1,
    timestamp: new Date().toISOString(),
    dexie: {},
    localStorage: {}
  };

  // Export Dexie tables
  const tables = db.tables;
  for (const table of tables) {
    const name = table.name;
    const data = await table.toArray();
    backup.dexie[name] = data;
  }

  // Export all localStorage keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const val = localStorage.getItem(key);
      if (val !== null) {
        backup.localStorage[key] = val;
      }
    }
  }

  return backup;
}

export async function importRestoreBackup(data: BackupData): Promise<void> {
  // Clear existing Dexie tables first? Or just merge?
  // Usually, a restore should be a clean state.
  
  // 1. Restore localStorage
  if (data.localStorage) {
    localStorage.clear();
    Object.entries(data.localStorage).forEach(([key, val]) => {
      localStorage.setItem(key, val);
    });
  }

  // 2. Restore Dexie tables
  if (data.dexie) {
    for (const [tableName, tableData] of Object.entries(data.dexie)) {
      const table = (db as any)[tableName];
      if (table) {
        await table.clear();
        if (tableData.length > 0) {
          await table.bulkAdd(tableData);
        }
      }
    }
  }
}

export function downloadBackupFile(data: BackupData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `QMS_Backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
