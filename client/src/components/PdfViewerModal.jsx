import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Maximize2, 
  Minimize2, 
  FileText, 
  ExternalLink,
  BookOpen,
  Sparkles,
  Info
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function PdfViewerModal({ course, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [mobileTab, setMobileTab] = useState('doc'); // 'doc' | 'notes'
  const { t, lang } = useTranslation();

  if (!course) return null;

  const fileUrl = course.fileName 
    ? `/api/files/${encodeURIComponent(course.fileName)}` 
    : null;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-container pdf-modal ${isFullscreen ? 'fullscreen' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-badge-format pdf">
              <FileText size={18} />
              <span>PDF</span>
            </div>
            <div className="modal-title-wrap">
              <h2 className="modal-title">{course.title}</h2>
              <div className="modal-subtitle-meta">
                <span className="meta-sub-pill">{course.subject}</span>
                <span>•</span>
                <span>{course.year}</span>
                {course.chapter && (
                  <>
                    <span>•</span>
                    <span className="hide-on-mobile">{course.chapter}</span>
                  </>
                )}
                {course.teacher && (
                  <>
                    <span>•</span>
                    <span className="hide-on-mobile">{course.teacher}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="modal-header-actions">
            {/* Desktop notes toggle */}
            <button 
              className={`btn btn-secondary hide-on-mobile ${showNotes ? 'active-toggle' : ''}`}
              onClick={() => setShowNotes(!showNotes)}
              title={t('notesDrawer')}
            >
              <BookOpen size={16} />
              <span>{t('notesDrawer')}</span>
            </button>

            {fileUrl && (
              <a 
                href={fileUrl} 
                download 
                className="btn btn-secondary modal-action-btn"
                title={t('cardDownload')}
              >
                <Download size={16} />
                <span className="hide-on-mobile">{t('cardDownload')}</span>
              </a>
            )}

            {fileUrl && (
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-secondary hide-on-mobile"
                title={t('openNewTab')}
              >
                <ExternalLink size={16} />
              </a>
            )}

            <button 
              className="btn btn-secondary hide-on-mobile"
              onClick={toggleFullscreen}
              title={isFullscreen ? t('exitFullscreen') : t('fullscreen')}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            <button 
              className="btn-close-modal"
              onClick={onClose}
              title={t('closeModal')}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Mobile View Switcher Tabs (Only visible on small screens) */}
        <div className="modal-mobile-tabs-bar">
          <button
            className={`mobile-tab-btn ${mobileTab === 'doc' ? 'active' : ''}`}
            onClick={() => setMobileTab('doc')}
          >
            <FileText size={16} />
            <span>{lang === 'fr' ? 'Document PDF' : 'PDF Document'}</span>
          </button>
          <button
            className={`mobile-tab-btn ${mobileTab === 'notes' ? 'active' : ''}`}
            onClick={() => setMobileTab('notes')}
          >
            <BookOpen size={16} />
            <span>{t('notesDrawer')}</span>
            {course.notes && <span className="tab-dot"></span>}
          </button>
        </div>

        {/* Modal Body */}
        <div className={`modal-body pdf-body-layout mobile-tab-${mobileTab}`}>
          {/* Main PDF Frame */}
          <div className={`pdf-frame-wrapper ${mobileTab === 'doc' ? 'show-mobile' : 'hide-mobile'}`}>
            {fileUrl ? (
              <iframe
                src={`${fileUrl}#toolbar=1&navpanes=1`}
                title={course.title}
                className="pdf-iframe"
              />
            ) : (
              <div className="no-file-placeholder">
                <FileText size={48} />
                <p>{t('pdfNoFile')}</p>
              </div>
            )}
          </div>

          {/* Side Revision Notes Panel */}
          {(showNotes || mobileTab === 'notes') && (
            <div className={`pdf-notes-sidebar ${mobileTab === 'notes' ? 'show-mobile' : 'hide-mobile'}`}>
              <div className="notes-sidebar-header">
                <Sparkles size={16} className="text-primary" />
                <h3>{t('pdfKeyNotesTitle')}</h3>
              </div>

              <div className="notes-sidebar-content">
                {course.notes ? (
                  <div className="notes-memo-box">
                    <h4>{t('pdfKeyPoints')}</h4>
                    <p>{course.notes}</p>
                  </div>
                ) : (
                  <div className="empty-notes-hint">
                    <Info size={16} />
                    <p>{t('pdfNoNotes')}</p>
                  </div>
                )}

                {course.description && (
                  <div className="notes-section">
                    <h4>{t('pdfDescTitle')}</h4>
                    <p>{course.description}</p>
                  </div>
                )}

                {course.tags && course.tags.length > 0 && (
                  <div className="notes-section">
                    <h4>{t('pdfKeywordsTitle')}</h4>
                    <div className="notes-tags-list">
                      {course.tags.map((tag, i) => (
                        <span key={i} className="tag-pill">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="notes-exam-tip-box">
                  <h4>{t('pdfStudyTipTitle')}</h4>
                  <p>{t('pdfStudyTipContent')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
