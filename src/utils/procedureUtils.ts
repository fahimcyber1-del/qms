import { ProcedureRecord } from '../types';

const MOCK_PROCEDURES: ProcedureRecord[] = [
  {
    "id": 1,
    "code": "NFFL/3/1163",
    "title": "PROCEDURE FOR CONFORMING PROCESS CONTROL",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v5.0",
    "issueNo": "05",
    "revNo": "Rev.0",
    "issueDate": "2022-03-06",
    "reviewDate": "2023-03-07",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1002",
      "NFFL/4/1038",
      "NFFL/4/1162"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2022-03-06",
        "by": "MR",
        "change": "First issue",
        "approved": "MD"
      }
    ],
    "purpose": "To define the procedures & processes of the Stitching department to ensure all stages of the stitching operation are clearly documented and communicated throughout the process chain.",
    "scope": "Stitching department operations.",
    "responsibilities": [
      {
        "role": "All section Manager",
        "responsibility": "Responsible for implementing and maintaining the conforming product control system, including maintaining records."
      },
      {
        "role": "All In-charge, Line chiefs, Supervisors and Quality Controller",
        "responsibility": "Responsible for reviewing and dis-positioning conforming product"
      },
      {
        "role": "Employees",
        "responsibility": "Responsible for immediately identifying and segregating conforming and nonconforming product."
      }
    ],
    "sections": [
      {
        "id": "3.1",
        "title": "Marketing, Merchandizing & Commercial",
        "subSections": [
          {
            "id": "3.1.1",
            "title": "Receive tech pack & quotation from buyer.",
            "content": "Detailed verification of all buyer requirements."
          },
          {
            "id": "3.1.2",
            "title": "Check consumptions of fabrics & trims.",
            "content": "Review against production capability."
          },
          {
            "id": "3.1.3",
            "title": "Prepare price & send development as per buyer requirement.",
            "content": "Formal approval of costings."
          },
          {
            "id": "3.1.4",
            "title": "Send samples (JSS, RE, AD, PP, GPT, SEALER, TOP) to buyer for approval.",
            "content": "Tracking of all approval statuses."
          }
        ]
      },
      {
        "id": "3.2",
        "title": "Sample",
        "subSections": [
          {
            "id": "3.2.1",
            "title": "Received technical package, reference sample, approval trim card.",
            "content": "Setup of sample room workflow."
          },
          {
            "id": "3.2.2",
            "title": "Must be checked all sample and maintained records.",
            "content": "Internal audit of sample quality before shipping."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Accessories inspection report (10%)",
        "ref": "NFFL/4/1002"
      },
      {
        "name": "Accessories inspection report (100%)",
        "ref": "NFFL/4/1038"
      }
    ],
    "distribution": [
      "Central Quality File",
      "Quality Assurance Department"
    ]
  },
  {
    "id": 2,
    "code": "NFFL/3/1164",
    "title": "FABRIC RELAXATION PROCEDURE",
    "dept": "CUTTING",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2023-01-10",
    "reviewDate": "2024-01-10",
    "approvedBy": "HOD Cutting",
    "author": "Production Manager",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1009"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2023-01-10",
        "by": "Production Manager",
        "change": "First issue",
        "approved": "HOD Cutting"
      }
    ],
    "purpose": "Standardize the relaxation time for different fabric types to ensure dimensional stability.",
    "scope": "Cutting and fabric store sections.",
    "responsibilities": [
      {
        "role": "Cutting Manager",
        "responsibility": "Verifying relaxation logs."
      }
    ],
    "sections": [
      {
        "id": "1.1",
        "title": "Relaxation Times",
        "subSections": [
          {
            "id": "1.1.1",
            "title": "Knit Fabrics",
            "content": "Minimum 24 hours open relaxation."
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "code": "NFFL/3/1164",
    "title": "PROCEDURE FOR PRESSING",
    "dept": "FINISHING",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1000"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for pressing to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for pressing according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Pressing Form",
        "ref": "NFFL/4/1000"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 4,
    "code": "NFFL/3/1165",
    "title": "PROCEDURE FOR FINISHING SECTION",
    "dept": "FINISHING",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1001"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for finishing section to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for finishing section according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Finishing Section Form",
        "ref": "NFFL/4/1001"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 5,
    "code": "NFFL/3/1166",
    "title": "PROCEDURE FOR CUTTING SECTION",
    "dept": "CUTTING",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1002"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for cutting section to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for cutting section according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Cutting Section Form",
        "ref": "NFFL/4/1002"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 6,
    "code": "NFFL/3/1167",
    "title": "PROCEDURE FOR SEWING SECTION",
    "dept": "SEWING",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1003"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for sewing section to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for sewing section according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Sewing Section Form",
        "ref": "NFFL/4/1003"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 7,
    "code": "NFFL/3/1168",
    "title": "PROCEDURE FOR CENTER TO SELVEDGE CHECK (CSV)",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1004"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for center to selvedge check (csv) to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for center to selvedge check (csv) according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Center to selvedge check (CSV) Form",
        "ref": "NFFL/4/1004"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 8,
    "code": "NFFL/3/1169",
    "title": "PROCEDURE FOR FABRICS SHRINKAGE TEST",
    "dept": "QUALITY/CUTTING",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1005"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for fabrics shrinkage test to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Raw Material Arrival",
            "content": "Check packing list and roll ID tags."
          },
          {
            "id": "2.2",
            "title": "Lab Test Verification",
            "content": "Review third-party lab reports for shrinkage, GSM, and color fastness."
          },
          {
            "id": "2.3",
            "title": "Internal Bulk Check",
            "content": "Run 10% inspection on 4-point system."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Fabrics Shrinkage Test Form",
        "ref": "NFFL/4/1005"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 9,
    "code": "NFFL/3/1170",
    "title": "PROCEDURE FOR FABRICS SHADE SEGREGATION",
    "dept": "QUALITY/CUTTING",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1006"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for fabrics shade segregation to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Raw Material Arrival",
            "content": "Check packing list and roll ID tags."
          },
          {
            "id": "2.2",
            "title": "Lab Test Verification",
            "content": "Review third-party lab reports for shrinkage, GSM, and color fastness."
          },
          {
            "id": "2.3",
            "title": "Internal Bulk Check",
            "content": "Run 10% inspection on 4-point system."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Fabrics Shade Segregation Form",
        "ref": "NFFL/4/1006"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 10,
    "code": "NFFL/3/1171",
    "title": "PROCEDURE FOR FABRICS RELAXATION",
    "dept": "QUALITY/CUTTING",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1007"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for fabrics relaxation to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Raw Material Arrival",
            "content": "Check packing list and roll ID tags."
          },
          {
            "id": "2.2",
            "title": "Lab Test Verification",
            "content": "Review third-party lab reports for shrinkage, GSM, and color fastness."
          },
          {
            "id": "2.3",
            "title": "Internal Bulk Check",
            "content": "Run 10% inspection on 4-point system."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Fabrics Relaxation Form",
        "ref": "NFFL/4/1007"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 11,
    "code": "NFFL/3/1172",
    "title": "PROCEDURE FOR THREAD INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1008"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for thread inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Thread Inspection Form",
        "ref": "NFFL/4/1008"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 12,
    "code": "NFFL/3/1173",
    "title": "PROCEDURE FOR BUTTON INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1009"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for button inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Button Inspection Form",
        "ref": "NFFL/4/1009"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 13,
    "code": "NFFL/3/1174",
    "title": "PROCEDURE FOR ZIPPER INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1010"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for zipper inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Zipper Inspection Form",
        "ref": "NFFL/4/1010"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 14,
    "code": "NFFL/3/1175",
    "title": "PROCEDURE FOR POLYBAG, GUM TAP & HANGER INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1011"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for polybag, gum tap & hanger inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Polybag, Gum tap & Hanger Inspection Form",
        "ref": "NFFL/4/1011"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 15,
    "code": "NFFL/3/1176",
    "title": "PROCEDURE FOR PATTERN INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1012"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for pattern inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Pattern Inspection Form",
        "ref": "NFFL/4/1012"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 16,
    "code": "NFFL/3/1177",
    "title": "PROCEDURE FOR MARKER INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1013"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for marker inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Marker Inspection Form",
        "ref": "NFFL/4/1013"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 17,
    "code": "NFFL/3/1178",
    "title": "PROCEDURE FOR SPREADING (LAY) & CUT PANEL VERIFY INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1014"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for spreading (lay) & cut panel verify inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Spreading (Lay) & Cut Panel Verify Inspection Form",
        "ref": "NFFL/4/1014"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 18,
    "code": "NFFL/3/1179",
    "title": "PROCEDURE FOR CUT PANEL INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1015"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for cut panel inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Cut Panel Inspection Form",
        "ref": "NFFL/4/1015"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 19,
    "code": "NFFL/3/1180",
    "title": "PROCEDURE FOR BUNDLE INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1016"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for bundle inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Bundle Inspection Form",
        "ref": "NFFL/4/1016"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 20,
    "code": "NFFL/3/1181",
    "title": "PROCEDURE FOR CHECK & TEST OF FUSING",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1017"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for check & test of fusing to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for check & test of fusing according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Check & Test of Fusing Form",
        "ref": "NFFL/4/1017"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 21,
    "code": "NFFL/3/1182",
    "title": "PROCEDURE FOR EMBROIDERY INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1018"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for embroidery inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Embroidery Inspection Form",
        "ref": "NFFL/4/1018"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 22,
    "code": "NFFL/3/1183",
    "title": "PROCEDURE FOR INLINE INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1019"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for inline inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Inline Inspection Form",
        "ref": "NFFL/4/1019"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 23,
    "code": "NFFL/3/1184",
    "title": "PROCEDURE FOR END LINE INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1020"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for end line inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For End line Inspection Form",
        "ref": "NFFL/4/1020"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 24,
    "code": "NFFL/3/1185",
    "title": "PROCEDURE FOR FIRST INSPECTION POINT",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1021"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for first inspection point to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For First Inspection Point Form",
        "ref": "NFFL/4/1021"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 25,
    "code": "NFFL/3/1186",
    "title": "PROCEDURE FOR QUALITY LOT AUDIT",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1022"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for quality lot audit to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for quality lot audit according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Quality Lot Audit Form",
        "ref": "NFFL/4/1022"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 26,
    "code": "NFFL/3/1187",
    "title": "PROCEDURE FOR MANAGEMENT OF INCIDENTS",
    "dept": "QMS",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1023"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for management of incidents to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for management of incidents according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Management of Incidents Form",
        "ref": "NFFL/4/1023"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 27,
    "code": "NFFL/3/1188",
    "title": "PROCEDURE FOR PLANNING",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1024"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for planning to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for planning according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Planning Form",
        "ref": "NFFL/4/1024"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 28,
    "code": "NFFL/3/1189",
    "title": "PROCEDURE FOR PRE-FINAL INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1025"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for pre-final inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Pre-Final Inspection Form",
        "ref": "NFFL/4/1025"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 29,
    "code": "NFFL/3/1190",
    "title": "PROCEDURE FOR PRE-PRODUCTION MEETING",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1026"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for pre-production meeting to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for pre-production meeting according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Pre-Production Meeting Form",
        "ref": "NFFL/4/1026"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 30,
    "code": "NFFL/3/1191",
    "title": "DOCUMENT AND DATA CONTROL PROCEDURE",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1027"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for document and data control procedure to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform document and data control procedure according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Document and Data Control Procedure Form",
        "ref": "NFFL/4/1027"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 31,
    "code": "NFFL/3/1192",
    "title": "PROCEDURE FOR MANAGEMENT REVIEW MEETING",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1028"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for management review meeting to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for management review meeting according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Management Review meeting Form",
        "ref": "NFFL/4/1028"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 32,
    "code": "NFFL/3/1193",
    "title": "PROCEDURE FOR QUALITY RECORD",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1029"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for quality record to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for quality record according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Quality Record Form",
        "ref": "NFFL/4/1029"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 33,
    "code": "NFFL/3/1194",
    "title": "PROCEDURE FOR CORRECTIVE & PREVENTIVE ACTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1030"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for corrective & preventive action to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for corrective & preventive action according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Corrective & Preventive Action Form",
        "ref": "NFFL/4/1030"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 34,
    "code": "NFFL/3/1195",
    "title": "PROCEDURE FOR TRAINING",
    "dept": "HR",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1031"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for training to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for training according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Training Form",
        "ref": "NFFL/4/1031"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 35,
    "code": "NFFL/3/1196",
    "title": "PROCEDURE FOR CONTROL OF NON-CONFORMING GOODS",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1032"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for control of non-conforming goods to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for control of non-conforming goods according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Control of Non-Conforming Goods Form",
        "ref": "NFFL/4/1032"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 36,
    "code": "NFFL/3/1197",
    "title": "PROCEDURE FOR CUSTOMER SATISFACTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1033"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for customer satisfaction to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for customer satisfaction according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Customer Satisfaction Form",
        "ref": "NFFL/4/1033"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 37,
    "code": "NFFL/3/1198",
    "title": "PROCEDURE FOR SUB SUPPLIER SELECTION EVALUATION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1034"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for sub supplier selection evaluation to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for sub supplier selection evaluation according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Sub Supplier Selection Evaluation Form",
        "ref": "NFFL/4/1034"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 38,
    "code": "NFFL/3/1199",
    "title": "SITE RISK ASSESSMENT & EMERGENCY CONTINUITY PLAN",
    "dept": "QMS",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1035"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for site risk assessment & emergency continuity plan to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform site risk assessment & emergency continuity plan according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Site Risk Assessment & Emergency Continuity Plan Form",
        "ref": "NFFL/4/1035"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 39,
    "code": "NFFL/3/1200",
    "title": "PROCEDURE FOR INTERNAL AUDIT",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1036"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for internal audit to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for internal audit according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Internal Audit Form",
        "ref": "NFFL/4/1036"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 40,
    "code": "NFFL/3/1201",
    "title": "PROCEDURE FOR INTERNAL AUDIT CHECKLIST",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1037"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for internal audit checklist to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for internal audit checklist according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Internal Audit Checklist Form",
        "ref": "NFFL/4/1037"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 41,
    "code": "NFFL/3/1202",
    "title": "PROCEDURE FOR PRODUCT RE-CALL",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1038"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for product re-call to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for product re-call according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Product Re-Call Form",
        "ref": "NFFL/4/1038"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 42,
    "code": "NFFL/3/1203",
    "title": "PROCEDURE FOR CUSTOMER COMPLAIN",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1039"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for customer complain to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for customer complain according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Customer Complain Form",
        "ref": "NFFL/4/1039"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 43,
    "code": "NFFL/3/1204",
    "title": "PROCEDURE FOR LOCK STITCH BUTTON MACHINE",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1040"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for lock stitch button machine to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for lock stitch button machine according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Lock Stitch Button Machine Form",
        "ref": "NFFL/4/1040"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 44,
    "code": "NFFL/3/1205",
    "title": "PROCEDURE FOR PULL TEST",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1041"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for pull test to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for pull test according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Pull Test Form",
        "ref": "NFFL/4/1041"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 45,
    "code": "NFFL/3/1206",
    "title": "PROCEDURE FOR SHARP TOOLS CONTROL",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1042"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for sharp tools control to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for sharp tools control according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Sharp Tools Control Form",
        "ref": "NFFL/4/1042"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 46,
    "code": "NFFL/3/1207",
    "title": "PROCEDURE FOR METAL DETECTOR",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1043"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for metal detector to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for metal detector according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Metal Detector Form",
        "ref": "NFFL/4/1043"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 47,
    "code": "NFFL/3/1208",
    "title": "PROCEDURE FOR HOUSE KEEPING",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1044"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for house keeping to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for house keeping according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for House Keeping Form",
        "ref": "NFFL/4/1044"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 48,
    "code": "NFFL/3/1209",
    "title": "PROCEDURE FOR PRODUCT SAFETY",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1045"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for product safety to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for product safety according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Product Safety Form",
        "ref": "NFFL/4/1045"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 49,
    "code": "NFFL/3/1210",
    "title": "PROCEDURE FOR FUSING TEST",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1046"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for fusing test to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for fusing test according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Fusing Test Form",
        "ref": "NFFL/4/1046"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 50,
    "code": "NFFL/3/1211",
    "title": "PROCEDURE FOR FABRICS INSPECTION",
    "dept": "QUALITY/CUTTING",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1047"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for fabrics inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Fabrics Inspection Form",
        "ref": "NFFL/4/1047"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 51,
    "code": "NFFL/3/1212",
    "title": "PROCEDURE FOR INCOMING TRIMS, ACCESSORIES & PACKING MATERIAL",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1048"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for incoming trims, accessories & packing material to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for incoming trims, accessories & packing material according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Incoming Trims, Accessories & Packing Material Form",
        "ref": "NFFL/4/1048"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 52,
    "code": "NFFL/3/1213",
    "title": "PROCEDURE FOR PURCHASE",
    "dept": "PROCUREMENT",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1049"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for purchase to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for purchase according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Purchase Form",
        "ref": "NFFL/4/1049"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 53,
    "code": "NFFL/3/1214",
    "title": "PROCEDURE FOR MAINTENANCE",
    "dept": "MAINTENANCE",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1050"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for maintenance to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for maintenance according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Maintenance Form",
        "ref": "NFFL/4/1050"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 54,
    "code": "NFFL/3/1215",
    "title": "PROCEDURE FOR NEEDLE CONTROL",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1051"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for needle control to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for needle control according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for needle control Form",
        "ref": "NFFL/4/1051"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 55,
    "code": "NFFL/3/1216",
    "title": "PROCEDURE FOR CONFORMING PROCESS CONTROL",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1052"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for conforming process control to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for conforming process control according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Conforming Process Control Form",
        "ref": "NFFL/4/1052"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 56,
    "code": "NFFL/3/1217",
    "title": "PROCEDURE FOR RISK ASSESSMENT",
    "dept": "QMS",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1053"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for risk assessment to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for risk assessment according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Risk Assessment Form",
        "ref": "NFFL/4/1053"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 57,
    "code": "NFFL/3/1218",
    "title": "PROCEDURE FOR PACKING AUDIT",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1054"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for packing audit to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for packing audit according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Packing Audit Form",
        "ref": "NFFL/4/1054"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 58,
    "code": "NFFL/3/1219",
    "title": "PROCEDURE FOR CARTON INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1055"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for carton inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Carton Inspection Form",
        "ref": "NFFL/4/1055"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 59,
    "code": "NFFL/3/1220",
    "title": "PROCEDURE FOR PRICE TAG, HAND TAG & BAR CODE",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1056"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for price tag, hand tag & bar code to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for price tag, hand tag & bar code according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for price tag, hand tag & bar code Form",
        "ref": "NFFL/4/1056"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 60,
    "code": "NFFL/3/1221",
    "title": "PROCEDURE FOR LABEL INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1057"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for label inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Label inspection Form",
        "ref": "NFFL/4/1057"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 61,
    "code": "NFFL/3/1222",
    "title": "PROCEDURE FOR CUT PANEL REPLACEMENT",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1058"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for cut panel replacement to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for cut panel replacement according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Cut Panel Replacement Form",
        "ref": "NFFL/4/1058"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 62,
    "code": "NFFL/3/1223",
    "title": "PROCEDURE FOR SKU",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1059"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for sku to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for sku according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for SKU Form",
        "ref": "NFFL/4/1059"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 63,
    "code": "NFFL/3/1224",
    "title": "PROCEDURE FOR WASTE MANAGEMENT",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1060"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for waste management to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for waste management according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Waste Management Form",
        "ref": "NFFL/4/1060"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 64,
    "code": "NFFL/3/1225",
    "title": "PROCEDURE FOR ORDER HANDLING",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1061"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for order handling to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for order handling according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Order Handling Form",
        "ref": "NFFL/4/1061"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 65,
    "code": "NFFL/3/1226",
    "title": "PROCEDURE FOR SAMPLE CHECK",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1062"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for sample check to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for sample check according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Sample Check Form",
        "ref": "NFFL/4/1062"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 66,
    "code": "NFFL/3/1227",
    "title": "PROCEDURE FOR CUSTOMER'S BRAND PROTECTION & DESTRUCTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1063"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for customer's brand protection & destruction to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for customer's brand protection & destruction according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Customer's Brand Protection & Destruction Form",
        "ref": "NFFL/4/1063"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 67,
    "code": "NFFL/3/1228",
    "title": "PROCEDURE FOR ALARMED GARMENTS",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1064"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for alarmed garments to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for alarmed garments according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Alarmed Garments Form",
        "ref": "NFFL/4/1064"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 68,
    "code": "NFFL/3/1229",
    "title": "PROCEDURE FOR WAREHOUSE",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1065"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for warehouse to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for warehouse according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Warehouse Form",
        "ref": "NFFL/4/1065"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 69,
    "code": "NFFL/3/1230",
    "title": "PROCEDURE FOR PRODUCT TESTING",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1066"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for product testing to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for product testing according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Product Testing Form",
        "ref": "NFFL/4/1066"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 70,
    "code": "NFFL/3/1231",
    "title": "PROCEDURE FOR LINE CLEANING FOR NEW STYLE",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1067"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for line cleaning for new style to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for line cleaning for new style according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Line Cleaning for New Style Form",
        "ref": "NFFL/4/1067"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 71,
    "code": "NFFL/3/1232",
    "title": "PROCEDURE FOR JEWELRY POLICY",
    "dept": "HR",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1068"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for jewelry policy to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for jewelry policy according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Jewelry Policy Form",
        "ref": "NFFL/4/1068"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 72,
    "code": "NFFL/3/1233",
    "title": "PROCEDURE FOR CUSTOMER SPECIFICATION VALIDATION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1069"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for customer specification validation to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for customer specification validation according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure for Customer Specification Validation Form",
        "ref": "NFFL/4/1069"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 73,
    "code": "NFFL/3/1234",
    "title": "LABEL POLICY",
    "dept": "HR",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1070"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for label policy to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform label policy according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Label Policy Form",
        "ref": "NFFL/4/1070"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 74,
    "code": "NFFL/3/1235",
    "title": "PROCEDURE FOR SAFEGUARD POLICY & CUSTOMER PROPERTIES",
    "dept": "HR",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1071"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for safeguard policy & customer properties to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for safeguard policy & customer properties according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Safeguard Policy & Customer Properties Form",
        "ref": "NFFL/4/1071"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 75,
    "code": "NFFL/3/1236",
    "title": "PROCEDURE FOR PRODUCT RELEASE",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1072"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for product release to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Initialization",
            "content": "Calibrate any necessary equipment and pull relevant tech packs for reference."
          },
          {
            "id": "2.2",
            "title": "Execution",
            "content": "Perform procedure for product release according to the specific technical requirements defined in the style file."
          },
          {
            "id": "2.3",
            "title": "Quality Check",
            "content": "Inspect the output for any major or minor defects using approved AQL standards."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Product Release Form",
        "ref": "NFFL/4/1072"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 76,
    "code": "NFFL/3/1237",
    "title": "PROCEDURE FOR OUTSOURCE PROCESS & INSPECTION",
    "dept": "QUALITY",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-01",
    "reviewDate": "2025-01-01",
    "approvedBy": "Managing Director (MD)",
    "author": "Management Representative (MR)",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": [
      "NFFL/4/1073"
    ],
    "revHistory": [
      {
        "rev": "Rev.0",
        "date": "2024-01-01",
        "by": "MR",
        "change": "Initial Release",
        "approved": "MD"
      }
    ],
    "purpose": "To establish a standardized method for procedure for outsource process & inspection to ensure high quality, compliance, and consistency across all production batches.",
    "scope": "This procedure applies to all relevant personnel and equipment involved in this specific process within the factory premises.",
    "responsibilities": [
      {
        "role": "Department Manager",
        "responsibility": "Overall implementation and monitoring of the procedure."
      },
      {
        "role": "Quality In-charge",
        "responsibility": "Verifying compliance and maintaining detailed records."
      },
      {
        "role": "Section Supervisor",
        "responsibility": "Training operators and ensuring daily execution as per standard."
      }
    ],
    "sections": [
      {
        "id": "1.0",
        "title": "Control Points",
        "subSections": [
          {
            "id": "1.1",
            "title": "Environmental Checks",
            "content": "Ensure proper lighting, ventilation, and workspace arrangement before starting."
          },
          {
            "id": "1.2",
            "title": "Material Verification",
            "content": "Verify that all raw materials match the approved trim card and buyer specifications."
          }
        ]
      },
      {
        "id": "2.0",
        "title": "Procedural Steps",
        "subSections": [
          {
            "id": "2.1",
            "title": "Sampling",
            "content": "Select samples according to AQL 2.5/4.0 or buyer-specific sampling plan."
          },
          {
            "id": "2.2",
            "title": "Visual Check",
            "content": "Perform a 3-point visual check under D65 lighting for color and physical defects."
          },
          {
            "id": "2.3",
            "title": "Measurement",
            "content": "Verify key dimensions against the spec sheet with a calibrated tape."
          },
          {
            "id": "2.4",
            "title": "Functionality",
            "content": "Test any functional trims (zippers, snaps, etc.) 10 times to ensure durability."
          }
        ]
      },
      {
        "id": "3.0",
        "title": "Documentation & Reporting",
        "subSections": [
          {
            "id": "3.1",
            "title": "Record Keeping",
            "content": "Log all parameters and results into the designated format immediately after the activity."
          },
          {
            "id": "3.2",
            "title": "Non-Conformity Handling",
            "content": "In case of failure, segregate the lot and issue a NC report to the manager."
          }
        ]
      }
    ],
    "relatedDocuments": [
      {
        "name": "Procedure For Outsource Process & Inspection Form",
        "ref": "NFFL/4/1073"
      },
      {
        "name": "Quality Manual",
        "ref": "NFFL/QM/001"
      }
    ],
    "distribution": [
      "Quality Dept",
      "Production Floor",
      "Compliance Office"
    ]
  },
  {
    "id": 51,
    "code": "NFFL/P/1201",
    "title": "PROCEDURE FOR FABRIC RELAXATION & SHRINKAGE TEST",
    "dept": "CUTTING",
    "cat": "Standard Operating Procedure (SOP)",
    "clause": "8.5.1",
    "ver": "v1.0",
    "issueNo": "01",
    "revNo": "Rev.0",
    "issueDate": "2024-01-10",
    "reviewDate": "2025-01-10",
    "approvedBy": "General Manager",
    "author": "Cutting In-charge",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": ["FORM-CUT-01", "FORM-CUT-02"],
    "revHistory": [
      { "rev": "Rev.0", "date": "2024-01-10", "by": "Cutting In-charge", "change": "First Issue", "approved": "GM" }
    ],
    "purpose": "To ensure all elastic fabrics are properly relaxed for at least 24 hours before cutting to avoid shrinkage issues.",
    "scope": "All knit and spandex fabric types.",
    "responsibilities": [
      { "role": "Cutting Supervisor", "responsibility": "Verification of relaxation time." }
    ],
    "sections": [
      {
        "id": "1",
        "title": "Relaxation Process",
        "content": "Unroll fabric and spread on relaxation racks for 24-48 hours depending on spandex content."
      }
    ],
    "relatedDocuments": [{ "name": "Relaxation Log", "ref": "FORM-CUT-01" }],
    "distribution": ["Cutting Dept", "Store Dept"]
  },
  {
    "id": 52,
    "code": "NFFL/P/1202",
    "title": "PROCEDURE FOR METAL DETECTION CALIBRATION",
    "dept": "PACKING",
    "cat": "Compliance Procedure",
    "clause": "8.7",
    "ver": "v2.0",
    "issueNo": "02",
    "revNo": "Rev.1",
    "issueDate": "2024-02-15",
    "reviewDate": "2025-02-15",
    "approvedBy": "QA Head",
    "author": "Packing Supervisor",
    "status": "Active",
    "linkedSops": [],
    "linkedForms": ["FORM-MET-01"],
    "revHistory": [
      { "rev": "Rev.1", "date": "2024-02-15", "by": "QA Head", "change": "Updated sensitivity levels", "approved": "MD" }
    ],
    "purpose": "To define the method of checking metal detector sensitivity using standard test pieces.",
    "scope": "All finished garments packed in cartons.",
    "responsibilities": [
      { "role": "Metal Detector Operator", "responsibility": "Perform tests every hour." }
    ],
    "sections": [
      {
        "id": "1",
        "title": "Calibration Steps",
        "content": "Pass 1.2mm Ferrous test piece through 9 points of the detector aperture."
      }
    ],
    "relatedDocuments": [{ "name": "Metal Detection Log", "ref": "FORM-MET-01" }],
    "distribution": ["Packing Dept", "Compliance Dept"]
  }
];

export const getProcedureRecords = (): ProcedureRecord[] => {
  const stored = localStorage.getItem('garmentqms_procedures');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length < MOCK_PROCEDURES.length - 10) {
        localStorage.setItem('garmentqms_procedures', JSON.stringify(MOCK_PROCEDURES));
        return MOCK_PROCEDURES;
      }
      return parsed;
    } catch (e) {
      console.error('Error parsing procedures from localStorage', e);
    }
  }
  localStorage.setItem('garmentqms_procedures', JSON.stringify(MOCK_PROCEDURES));
  return MOCK_PROCEDURES;
};

export const getProcedures = getProcedureRecords;


export const saveProcedureRecords = (records: ProcedureRecord[]) => {
  localStorage.setItem('garmentqms_procedures', JSON.stringify(records));
};
