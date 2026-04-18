# QMS ERP Pro — Enterprise Quality Management System

> A comprehensive, ISO 9001:2015 compliant **Quality Management System** built for garment and manufacturing industries.

---

## 🚀 Features

| Module | Description |
|---|---|
| 📊 **Live Dashboard** | Real-time KPIs — DHU, RFT, CAPA closure, audit pass rates |
| 🔬 **Production Quality** | Inline, endline, final inspection tracking with defect logging |
| 🔍 **Defect Library** | 300+ categorized defects with severity levels and images |
| 📋 **Audit & CAPA** | Full audit lifecycle, corrective action plans, follow-up tracking |
| 🏆 **Certifications** | Certificate registry with expiry tracking and smart alerts |
| ⚠️ **Risk Management** | Risk scoring, likelihood/severity matrix, ISO-aligned |
| 📄 **Document Control** | Version-controlled documents, SOPs, quality manuals |
| 👥 **Supplier Management** | Principal supplier + sub-supplier evaluation (150-question scoring) |
| 📦 **Traceability** | End-to-end product traceability from fabric to shipment |
| 🎓 **Training Management** | Department training plans and completion tracking |
| 📈 **Reports & Analytics** | Multi-chart reporting with CSV/Excel/PDF export |
| ⚙️ **Calibration** | Machine and equipment calibration schedule management |
| 🗂️ **Process Flow** | Interactive flow chart builder with ISO process mapping |
| 🏢 **Organogram** | Drag-and-drop organizational chart builder |
| 📑 **32+ Modules** | NCR, RCA, KPI, Goals, Meetings, Incoming QC, Final Inspection... |

---

## 🔐 Login

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `qms2026` |

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** — lightning-fast dev/build
- **Tailwind CSS v4** — utility-first styling
- **Framer Motion** — smooth animations
- **Recharts** — beautiful data visualizations
- **Dexie (IndexedDB)** — client-side persistent storage
- **jsPDF + AutoTable** — PDF report generation
- **XLSX** — Excel export support
- **React Easy Crop** — avatar image cropping

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📐 Architecture

```
src/
├── components/          # Sidebar, Topbar, Universal Module, Export Modal
├── pages/               # 32+ page components
├── config/              # Theme engine, module configurations
├── utils/               # PDF export, backup, certificate utilities
├── db/                  # Dexie IndexedDB schema and migrator
└── types.ts             # Shared TypeScript interfaces
```

---

## 🎨 Customization

- **Appearance**: Settings → Appearance (color palette, dark/light mode, fonts, border radius)
- **Organization**: Settings → Organization (company name, logo, address)
- **PDF Export**: Settings → PDF Export (header styles, watermark, color accent)
- **Notifications**: Settings → Notifications (channel control, expiry lead time)
- **Backup**: Settings → Database (full JSON backup/restore)

---

## 📜 Compliance

Designed to support **ISO 9001:2015** Quality Management System requirements including:
- Document and record control (Clause 7.5)
- Nonconformance and corrective action (Clause 10.2)
- Internal audit (Clause 9.2)
- Management review (Clause 9.3)
- Monitoring, measurement, and KPIs (Clause 9.1)

---

## 📝 License

© 2026 QMS ERP Pro. All rights reserved.
