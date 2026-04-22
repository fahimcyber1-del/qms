import React, { useState } from 'react';
import { FileText, Image, Eye, ExternalLink, Trash2, Paperclip } from 'lucide-react';
import { FileViewerModal, AttachmentItem, openFileInNewTab } from './FileViewerModal';

interface AttachmentListProps {
  /** Array of attachment items. An item can be: { name, data }, { name, data, type }, or a plain string (name only, no preview). */
  attachments: any[];
  /** Called when the user clicks the delete (×) button. Pass null/undefined to hide delete buttons. */
  onRemove?: (index: number) => void;
  /** Class for the outer wrapper */
  className?: string;
  /** If true, shows a compact row layout instead of grid cards */
  compact?: boolean;
}

function normaliseAttachment(raw: any): AttachmentItem | null {
  if (!raw) return null;
  if (typeof raw === 'string') {
    if (raw.startsWith('data:')) {
      // It's a data URI string
      const mime = raw.split(';')[0]?.replace('data:', '') || '';
      const ext = mime.split('/')[1] || 'bin';
      return { name: `Attachment.${ext}`, data: raw, type: mime };
    }
    // Just a filename, no data to preview
    return { name: raw, data: '' };
  }
  if (raw.data) return raw as AttachmentItem;
  return { name: raw.name || 'Unknown', data: '' };
}

function getIcon(item: AttachmentItem) {
  const mimeType = item.type || (item.data?.split(';')[0]?.replace('data:', '') ?? '');
  if (mimeType.startsWith('image/') || /\.(png|jpg|jpeg|gif|webp|svg|bmp)$/i.test(item.name ?? '')) {
    return Image;
  }
  return FileText;
}

function canPreview(item: AttachmentItem) {
  return !!item.data;
}

export function AttachmentList({ attachments, onRemove, className = '', compact = false }: AttachmentListProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const items = attachments
    .map(normaliseAttachment)
    .filter((x): x is AttachmentItem => x !== null);

  const previewableItems = items.filter(canPreview);

  const openViewer = (item: AttachmentItem) => {
    const idx = previewableItems.findIndex(p => p === item || (p.name === item.name && p.data === item.data));
    setViewerIndex(Math.max(0, idx));
    setViewerOpen(true);
  };

  if (items.length === 0) return null;

  if (compact) {
    return (
      <>
        <div className={`space-y-2 ${className}`}>
          {items.map((item, i) => {
            const Icon = getIcon(item);
            const previewable = canPreview(item);
            return (
              <div
                key={i}
                className="flex items-center gap-2 group rounded-lg px-3 py-2 border border-border-main hover:border-accent/30 transition-colors"
                style={{ background: 'var(--bg-2, rgba(0,0,0,0.04))' }}
              >
                <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(29,95,209,0.10)' }}>
                  <Icon className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span className="text-sm font-semibold text-text-1 truncate flex-1">{item.name}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {previewable && (
                    <>
                      <button
                        type="button"
                        onClick={() => openViewer(item)}
                        title="View"
                        className="w-7 h-7 rounded flex items-center justify-center text-blue-400 hover:bg-blue-500/10 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openFileInNewTab(item)}
                        title="Open in new tab"
                        className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:bg-white/10 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {onRemove && (
                    <button
                      type="button"
                      onClick={() => onRemove(i)}
                      title="Remove"
                      className="w-7 h-7 rounded flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <FileViewerModal
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          files={previewableItems}
          initialIndex={viewerIndex}
        />
      </>
    );
  }

  // Grid card layout (default)
  return (
    <>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${className}`}>
        {items.map((item, i) => {
          const Icon = getIcon(item);
          const previewable = canPreview(item);
          const isImage = getIcon(item) === Image;

          return (
            <div
              key={i}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border-main transition-all hover:shadow-md"
              style={{ background: 'var(--bg-2, rgba(0,0,0,0.04))', borderColor: previewable ? undefined : undefined }}
            >
              {/* Thumbnail for images */}
              {previewable && isImage && (
                <div
                  className="w-full h-32 overflow-hidden cursor-pointer flex-shrink-0"
                  onClick={() => openViewer(item)}
                  style={{ background: 'rgba(0,0,0,0.2)' }}
                >
                  <img
                    src={item.data}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}

              {/* PDF preview banner */}
              {previewable && !isImage && (
                <div
                  className="w-full h-24 overflow-hidden cursor-pointer flex-shrink-0 flex items-center justify-center"
                  onClick={() => openViewer(item)}
                  style={{ background: 'linear-gradient(135deg, rgba(29,95,209,0.10), rgba(29,95,209,0.04))' }}
                >
                  <div className="flex flex-col items-center gap-2 text-blue-400 opacity-60">
                    <FileText className="w-8 h-8" />
                    <span className="text-[10px] font-black uppercase tracking-widest">PDF</span>
                  </div>
                </div>
              )}

              {/* Info row */}
              <div className="flex items-center gap-2 px-3 py-2.5">
                <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(29,95,209,0.10)' }}>
                  <Icon className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span className="text-xs font-semibold text-text-1 truncate flex-1">{item.name}</span>
              </div>

              {/* Action buttons */}
              <div
                className="flex items-center gap-1 px-3 pb-2.5"
                style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
              >
                {previewable && (
                  <>
                    <button
                      type="button"
                      onClick={() => openViewer(item)}
                      title="View in app"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-blue-400 hover:bg-blue-500/10 transition-colors border border-transparent hover:border-blue-500/20"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => openFileInNewTab(item)}
                      title="Open in new tab"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-400 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                    >
                      <ExternalLink className="w-3 h-3" /> New Tab
                    </button>
                  </>
                )}
                {!previewable && (
                  <span className="text-[10px] text-text-3 italic px-1">No preview available</span>
                )}
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    title="Remove"
                    className="ml-auto flex items-center justify-center w-6 h-6 rounded text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <FileViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        files={previewableItems}
        initialIndex={viewerIndex}
      />
    </>
  );
}
