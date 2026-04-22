import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Download, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, FileText, Image } from 'lucide-react';

export interface AttachmentItem {
  name: string;
  data: string; // base64 data URI  e.g. "data:application/pdf;base64,..."
  type?: string;
}

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: AttachmentItem[];
  initialIndex?: number;
}

function getFileType(item: AttachmentItem): 'pdf' | 'image' | 'unknown' {
  const mimeType = item.type || (item.data?.split(';')[0]?.replace('data:', '') ?? '');
  if (mimeType.includes('pdf') || item.name?.toLowerCase().endsWith('.pdf')) return 'pdf';
  if (mimeType.startsWith('image/') || /\.(png|jpg|jpeg|gif|webp|svg|bmp)$/i.test(item.name ?? '')) return 'image';
  return 'unknown';
}

export function openFileInNewTab(file: AttachmentItem) {
  if (!file.data) return;
  const win = window.open();
  if (!win) return;
  const fileType = getFileType(file);
  if (fileType === 'pdf') {
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${file.name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #111; display: flex; flex-direction: column; height: 100vh; }
            .toolbar {
              background: #1e1e2e;
              padding: 12px 20px;
              display: flex;
              align-items: center;
              gap: 12px;
              border-bottom: 1px solid rgba(255,255,255,0.08);
              flex-shrink: 0;
            }
            .toolbar span { color: #94a3b8; font-size: 13px; font-family: system-ui, sans-serif; font-weight: 600; }
            .toolbar a {
              margin-left: auto;
              color: #60a5fa;
              text-decoration: none;
              font-size: 12px;
              font-family: system-ui, sans-serif;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              background: rgba(96,165,250,0.12);
              padding: 6px 14px;
              border-radius: 8px;
              border: 1px solid rgba(96,165,250,0.2);
            }
            iframe { flex: 1; width: 100%; border: none; }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <span>📄 ${file.name}</span>
            <a href="${file.data}" download="${file.name}">⬇ Download</a>
          </div>
          <iframe src="${file.data}"></iframe>
        </body>
      </html>
    `);
  } else if (fileType === 'image') {
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${file.name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #111; display: flex; flex-direction: column; height: 100vh; }
            .toolbar {
              background: #1e1e2e;
              padding: 12px 20px;
              display: flex;
              align-items: center;
              gap: 12px;
              border-bottom: 1px solid rgba(255,255,255,0.08);
              flex-shrink: 0;
            }
            .toolbar span { color: #94a3b8; font-size: 13px; font-family: system-ui, sans-serif; font-weight: 600; }
            .toolbar a {
              margin-left: auto;
              color: #60a5fa;
              text-decoration: none;
              font-size: 12px;
              font-family: system-ui, sans-serif;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              background: rgba(96,165,250,0.12);
              padding: 6px 14px;
              border-radius: 8px;
              border: 1px solid rgba(96,165,250,0.2);
            }
            .img-container { flex: 1; display: flex; align-items: center; justify-content: center; overflow: auto; padding: 24px; }
            img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; box-shadow: 0 0 60px rgba(0,0,0,0.5); }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <span>🖼 ${file.name}</span>
            <a href="${file.data}" download="${file.name}">⬇ Download</a>
          </div>
          <div class="img-container">
            <img src="${file.data}" alt="${file.name}" />
          </div>
        </body>
      </html>
    `);
  } else {
    // Generic download
    const link = win.document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    win.document.body.appendChild(link);
    link.click();
    win.close();
  }
}

export function FileViewerModal({ isOpen, onClose, files, initialIndex = 0 }: FileViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imgScale, setImgScale] = useState(1);
  const [imgRotation, setImgRotation] = useState(0);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setImgScale(1);
    setImgRotation(0);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    setImgScale(1);
    setImgRotation(0);
  }, [currentIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex(i => Math.min(i + 1, files.length - 1));
      if (e.key === 'ArrowLeft') setCurrentIndex(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, files.length, onClose]);

  if (!isOpen || files.length === 0) return null;

  const file = files[currentIndex];
  if (!file) return null;

  const fileType = getFileType(file);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={backdropRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[999] flex flex-col"
          style={{ background: 'rgba(2, 6, 23, 0.94)', backdropFilter: 'blur(12px)' }}
          onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
        >
          {/* Top Toolbar */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0"
            style={{ background: 'rgba(15, 23, 42, 0.96)', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            {/* File Icon + Name */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(96,165,250,0.12)' }}>
                {fileType === 'image' ? (
                  <Image className="w-4 h-4 text-blue-400" />
                ) : (
                  <FileText className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{file.name}</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.7)' }}>
                  {fileType === 'pdf' ? 'PDF Document' : fileType === 'image' ? 'Image' : 'File'}
                  {files.length > 1 && ` • ${currentIndex + 1} of ${files.length}`}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {fileType === 'image' && (
                <>
                  <button
                    onClick={() => setImgScale(s => Math.max(0.25, s - 0.25))}
                    title="Zoom out"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                    onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                    onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-400 font-mono w-12 text-center">{Math.round(imgScale * 100)}%</span>
                  <button
                    onClick={() => setImgScale(s => Math.min(4, s + 0.25))}
                    title="Zoom in"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                    onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                    onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setImgRotation(r => (r + 90) % 360)}
                    title="Rotate"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                    onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                    onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <div className="w-px h-5 bg-white/10" />
                </>
              )}

              <a
                href={file.data}
                download={file.name}
                title="Download file"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                onClick={() => openFileInNewTab(file)}
                title="Open in new tab"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              >
                <ExternalLink className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-white/10" />

              <button
                onClick={onClose}
                title="Close viewer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.18)')}
                onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Viewer Area */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            {/* Prev / Next arrows for multi-file */}
            {files.length > 1 && currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex(i => i - 1)}
                className="absolute left-4 z-10 w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all"
                style={{ background: 'rgba(15,23,42,0.80)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(29,95,209,0.50)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.80)'; }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {files.length > 1 && currentIndex < files.length - 1 && (
              <button
                onClick={() => setCurrentIndex(i => i + 1)}
                className="absolute right-4 z-10 w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all"
                style={{ background: 'rgba(15,23,42,0.80)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(29,95,209,0.50)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.80)'; }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {fileType === 'pdf' && (
              <motion.iframe
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                src={file.data}
                title={file.name}
                className="w-full h-full border-0"
                style={{ maxWidth: 'calc(100% - 80px)' }}
              />
            )}

            {fileType === 'image' && (
              <div className="w-full h-full overflow-auto flex items-center justify-center p-8">
                <motion.img
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  src={file.data}
                  alt={file.name}
                  className="object-contain rounded-xl select-none"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    transform: `scale(${imgScale}) rotate(${imgRotation}deg)`,
                    transition: 'transform 0.25s ease',
                    boxShadow: '0 0 80px rgba(0,0,0,0.6)',
                  }}
                  draggable={false}
                />
              </div>
            )}

            {fileType === 'unknown' && (
              <div className="flex flex-col items-center justify-center gap-6 text-slate-400">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <FileText className="w-12 h-12 opacity-40" />
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-base mb-2">{file.name}</p>
                  <p className="text-sm opacity-60">Preview not available for this file type.</p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={file.data}
                    download={file.name}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ background: 'rgba(29,95,209,0.8)', border: '1px solid rgba(29,95,209,0.4)' }}
                  >
                    <Download className="w-4 h-4" /> Download File
                  </a>
                  <button
                    onClick={() => openFileInNewTab(file)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <ExternalLink className="w-4 h-4" /> Open in New Tab
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Thumbnails (multi-file) */}
          {files.length > 1 && (
            <div
              className="flex items-center justify-center gap-2 px-4 py-3 overflow-x-auto flex-shrink-0"
              style={{ background: 'rgba(15, 23, 42, 0.96)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              {files.map((f, i) => {
                const ft = getFileType(f);
                const isActive = i === currentIndex;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0 transition-all"
                    style={{
                      background: isActive ? 'rgba(29,95,209,0.30)' : 'rgba(255,255,255,0.05)',
                      border: isActive ? '1px solid rgba(29,95,209,0.5)' : '1px solid rgba(255,255,255,0.06)',
                      color: isActive ? '#93c5fd' : 'rgba(148,163,184,0.7)',
                    }}
                  >
                    {ft === 'image' ? <Image className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                    <span className="truncate max-w-[120px]">{f.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
