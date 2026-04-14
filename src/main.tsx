import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { migrateLocalStorageToDatabase } from './db/migrator';

try {
  migrateLocalStorageToDatabase().then(() => {
    console.log("Database online block initialized.");
  }).catch(e => {
    console.error("Migration failed", e);
  });

  const root = document.getElementById('root');
  if (!root) throw new Error("Root element not found");

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (error: any) {
  document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>BOOTSTRAP ERROR</h1><pre>${error.stack || error.message}</pre></div>`;
  console.error("Bootstrap Error:", error);
}
