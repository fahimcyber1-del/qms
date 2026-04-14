import React, { useState, useEffect } from 'react';
import { ExportModal } from '../components/ExportModal';
import { CertificateRecord } from '../types';
import { getCertificates, saveCertificates, checkCertificateStatus, getDaysUntilExpiry } from '../utils/certificateUtils';
import { Copy, Plus, FileDown, Search } from 'lucide-react';

export function Certification() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);
  const [formData, setFormData] = useState<Partial<CertificateRecord>>({
    name: '', type: 'Factory', number: '', issuedBy: '', issueDate: '', expiryDate: '', status: 'Active', department: 'Quality', documentUrls: []
  });
  const [filterText, setFilterText] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    const loadedCerts = getCertificates();
    // Auto-update status based on expiry
    const updatedCerts = loadedCerts.map(cert => ({
      ...cert,
      status: checkCertificateStatus(cert.expiryDate)
    }));
    setCertificates(updatedCerts);
    saveCertificates(updatedCerts);
  }, []);

  const handleOpenModal = (cert?: CertificateRecord) => {
    if (cert) {
      setFormData(cert);
    } else {
      setFormData({ name: '', type: 'Factory', number: '', issuedBy: '', issueDate: '', expiryDate: '', status: 'Active', department: 'Quality', documentUrls: [] });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newStatus = checkCertificateStatus(formData.expiryDate as string);
    const newCert: CertificateRecord = {
      ...(formData as CertificateRecord),
      status: newStatus,
      id: formData.id || `CERT-${Date.now()}`,
      createdAt: formData.createdAt || new Date().toISOString()
    };

    let updatedCerts;
    if (formData.id) {
      updatedCerts = certificates.map(c => c.id === formData.id ? newCert : c);
    } else {
      updatedCerts = [newCert, ...certificates];
    }

    setCertificates(updatedCerts);
    saveCertificates(updatedCerts);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedCert) {
      const updatedCerts = certificates.filter(c => c.id !== selectedCert.id);
      setCertificates(updatedCerts);
      saveCertificates(updatedCerts);
      setIsDeleteModalOpen(false);
      setSelectedCert(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map((f: File) => f.name);
      setFormData({ ...formData, documentUrls: [...(formData.documentUrls || []), ...files] });
    }
  };

  const handleDownload = async (cert: CertificateRecord) => {
    const {
      createDoc, drawPdfHeader, drawInfoGrid, drawSectionLabel,
      proTable, addPageFooters, drawSignatureRow
    } = await import('../utils/pdfExport');

    const doc = createDoc({ orientation: 'p', paperSize: 'a4' });
    let y = drawPdfHeader(doc, 'Compliance Certificate Report', `Cert No: ${cert.number}`);

    y = drawInfoGrid(doc, y, [
      { label: 'Certificate Name',   value: cert.name },
      { label: 'Certificate Number', value: cert.number },
      { label: 'Type',               value: cert.type },
      { label: 'Issued By',          value: cert.issuedBy },
      { label: 'Department',         value: cert.department },
      { label: 'Issue Date',         value: cert.issueDate },
      { label: 'Expiry Date',        value: cert.expiryDate },
      { label: 'Status',             value: cert.status },
    ]);

    if (cert.documentUrls && cert.documentUrls.length > 0) {
      y = drawSectionLabel(doc, y, 'Attached Documents');
      y = proTable(doc, y, [['#', 'Document Name']], cert.documentUrls.map((d, i) => [String(i + 1), d])) + 6;
    }

    drawSignatureRow(doc, y, ['QA Manager', 'Compliance Officer', 'Director']);
    addPageFooters(doc);
    doc.save(`${cert.name.replace(/ /g, '_')}_Certificate.pdf`);
  };


  const filteredCertificates = certificates.filter(cert => 
    cert.name.toLowerCase().includes(filterText.toLowerCase()) || 
    cert.number.toLowerCase().includes(filterText.toLowerCase()) ||
    cert.issuedBy.toLowerCase().includes(filterText.toLowerCase()) ||
    cert.type.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="page active p-4 md:p-8">
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        data={filteredCertificates}
        columns={[
          {key: 'id', label: 'ID'},
          {key: 'name', label: 'Name'},
          {key: 'type', label: 'Type'},
          {key: 'number', label: 'Number'},
          {key: 'issuedBy', label: 'Issued By'},
          {key: 'issueDate', label: 'Issue Date'},
          {key: 'expiryDate', label: 'Expiry Date'},
          {key: 'status', label: 'Status'}
        ]}
        title="Certification Report"
      />

      <div className="sec-head">
        <div>
          <div className="sec-title">🏅 Certification Management</div>
          <div className="sec-sub">Factory Compliance Certifications</div>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-3" />
            <input 
              type="text" 
              placeholder="Filter certificates..." 
              className="form-control pl-9 w-64" 
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost" onClick={() => setIsExportModalOpen(true)}>⬇ Export</button>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}><Plus className="w-4 h-4 mr-2"/> Add Certificate</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Certificate Index</div></div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Cert No.</th>
                <th>Name</th>
                <th>Type</th>
                <th>Issued By</th>
                <th>Issue Date</th>
                <th>Expiry Date</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.map(cert => {
                const daysLeft = getDaysUntilExpiry(cert.expiryDate);
                const isExpiringSoon = daysLeft > 0 && daysLeft <= 30;
                const isExpired = daysLeft <= 0;
                return (
                  <tr key={cert.id} className={isExpired ? 'bg-red-500/5' : isExpiringSoon ? 'bg-amber-500/5' : ''}>
                    <td className="font-mono text-sm">{cert.number}</td>
                    <td className="font-semibold">{cert.name}</td>
                    <td>{cert.type}</td>
                    <td>{cert.issuedBy}</td>
                    <td>{cert.issueDate}</td>
                    <td>
                      <div className="flex flex-col">
                        <span>{cert.expiryDate}</span>
                        {!isExpired && isExpiringSoon && <span className="text-xs text-amber-500 mt-1">{daysLeft} days left</span>}
                      </div>
                    </td>
                    <td>{cert.department}</td>
                    <td>
                      <span className={`badge ${isExpired ? 'badge-red' : isExpiringSoon ? 'badge-amber' : 'badge-green'}`}>
                        {cert.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedCert(cert); setIsViewModalOpen(true); }}>Details</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleOpenModal(cert)}>Edit</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDownload(cert)} title="Download"><FileDown className="w-4 h-4" /></button>
                        <button className="btn btn-ghost btn-sm text-red-500 hover:bg-red-500/10" onClick={() => { setSelectedCert(cert); setIsDeleteModalOpen(true); }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCertificates.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-6 text-text-3">No certificates found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal active">
          <div className="modal-content">
            <h3>{formData.id ? 'Edit Certificate' : 'Add New Certificate'}</h3>
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-text-2 mb-1 block">Certificate Name</label>
                <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-text-2 mb-1 block">Certificate Type</label>
                <select className="form-control" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} required>
                  <option value="Factory">Factory</option>
                  <option value="Machine">Machine</option>
                  <option value="Testing">Testing</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-text-2 mb-1 block">Certificate Number</label>
                <input type="text" className="form-control" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} required />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-text-2 mb-1 block">Issued By</label>
                <input type="text" className="form-control" value={formData.issuedBy} onChange={e => setFormData({...formData, issuedBy: e.target.value})} required />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-text-2 mb-1 block">Issue Date</label>
                <input type="date" className="form-control" value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} required />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-text-2 mb-1 block">Expiry Date</label>
                <input type="date" className="form-control" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} required />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm text-text-2 mb-1 block">Department</label>
                <select className="form-control" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value as any})} required>
                  <option value="Quality">Quality</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Lab">Lab</option>
                  <option value="Production">Production</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-text-2 mb-1 block">Document Upload (PDF/Image)</label>
                <div className="flex items-center gap-2">
                   <div className="flex-1 border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
                      <input type="file" multiple accept=".pdf,image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} />
                      <div className="text-text-3">Click or drag files here to upload</div>
                   </div>
                </div>
                {formData.documentUrls && formData.documentUrls.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs text-text-3 block mb-1">Attached files:</span>
                    <div className="flex flex-wrap gap-2">
                      {formData.documentUrls.map((url, i) => (
                        <span key={i} className="text-xs bg-bg-2 px-2 py-1 rounded text-text-1 border border-border-1 inline-flex items-center gap-1">
                          <FileDown className="w-3 h-3 text-accent" /> {url}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Certificate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedCert && (
        <div className="modal active">
          <div className="modal-content">
            <div className="flex justify-between items-start mb-4 border-b border-border-1 pb-3">
               <div>
                  <h3 className="text-lg font-semibold">{selectedCert.name}</h3>
                  <div className="text-sm text-text-3 mt-1">Certificate Details</div>
               </div>
               <span className={`badge ${selectedCert.status === 'Active' ? 'badge-green' : selectedCert.status === 'Expired' ? 'badge-red' : 'badge-amber'}`}>
                  {selectedCert.status}
               </span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div className="col-span-1">
                <div className="text-text-3 text-xs mb-1">Certificate Number</div>
                <div className="font-mono">{selectedCert.number}</div>
              </div>
              <div className="col-span-1">
                <div className="text-text-3 text-xs mb-1">Type</div>
                <div>{selectedCert.type}</div>
              </div>
              <div className="col-span-1">
                <div className="text-text-3 text-xs mb-1">Issued By</div>
                <div>{selectedCert.issuedBy}</div>
              </div>
              <div className="col-span-1">
                <div className="text-text-3 text-xs mb-1">Department</div>
                <div>{selectedCert.department}</div>
              </div>
              <div className="col-span-1">
                <div className="text-text-3 text-xs mb-1">Issue Date</div>
                <div>{selectedCert.issueDate}</div>
              </div>
              <div className="col-span-1">
                <div className="text-text-3 text-xs mb-1">Expiry Date</div>
                <div>{selectedCert.expiryDate}</div>
              </div>
              <div className="col-span-2 mt-2">
                <div className="text-text-3 text-xs mb-2">Attached Documents</div>
                <div className="flex flex-col gap-2 bg-bg-2/30 p-3 rounded-lg border border-border-1">
                  {selectedCert.documentUrls && selectedCert.documentUrls.length > 0 ? (
                    selectedCert.documentUrls.map((doc, i) => (
                      <div key={i} className="flex justify-between items-center group">
                         <span className="text-blue-400 hover:text-blue-300 underline cursor-pointer truncate max-w-[80%]" title={doc}>{doc}</span>
                         <button className="text-text-3 hover:text-accent p-1" title="Download Document"><FileDown className="w-4 h-4" /></button>
                      </div>
                    ))
                  ) : (
                    <span className="text-text-3 text-sm italic">No documents attached</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border-1">
              <button className="btn btn-ghost" onClick={() => handleDownload(selectedCert)}>Download PDF</button>
              <button className="btn btn-primary" onClick={() => setIsViewModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedCert && (
        <div className="modal active">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p className="mt-2 text-text-2">Are you sure you want to delete the certificate <strong>"{selectedCert.name}"</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 mt-6">
              <button className="btn btn-ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button className="btn btn-red" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
