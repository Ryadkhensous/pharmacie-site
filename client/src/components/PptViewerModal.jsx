import React, { useState } from 'react';
import { 
  X, 
  Presentation, 
  Download, 
  ExternalLink, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function PptViewerModal({ course, onClose }) {
  const [showNotes, setShowNotes] = useState(true);
  const { t, lang } = useTranslation();

  if (!course) return null;

  const fileUrl = course.fileName 
    ? `/api/files/${encodeURIComponent(course.fileName)}` 
    : null;

  const formatFileSize = (bytes) => {
    if (!bytes) return null;
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + (lang === 'fr' ? ' Mo' : ' MB');
    }
    return Math.round(bytes / 1024) + (lang === 'fr' ? ' Ko' : ' KB');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container ppt-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-badge-format ppt">
              <Presentation size={18} />
              <span>PowerPoint</span>
            </div>
            <div className="modal-title-wrap">
              <h2 className="modal-title">{course.title}</h2>
              <div className="modal-subtitle-meta">
                <span className="meta-sub-pill">{course.subject}</span>
                <span>•</span>
                <span>{course.year}</span>
                {course.teacher && <span>• {course.teacher}</span>}
              </div>
            </div>
          </div>

          <div className="modal-header-actions">
            {fileUrl && (
              <a 
                href={fileUrl} 
                download 
                className="btn btn-primary"
                title={t('cardDownload')}
              >
                <Download size={16} />
                <span>{t('cardDownload')} ({formatFileSize(course.fileSize)})</span>
              </a>
            )}

            <button 
              className="btn-close-modal"
              onClick={onClose}
              title={t('closeModal')}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body ppt-body-layout">
          {/* Main Visual Presentation Card */}
          <div className="ppt-presentation-showcase">
            <div className="ppt-banner-preview">
              <div className="ppt-icon-circle">
                <Presentation size={56} />
              </div>
              <h3 className="ppt-hero-title">{course.title}</h3>
              <p className="ppt-hero-sub">{t('pptHeroSub')} • {course.subject} ({course.year})</p>

              <div className="ppt-quick-features">
                <div className="ppt-feature-item">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>{t('pptFeature1')}</span>
                </div>
                <div className="ppt-feature-item">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>{t('pptFeature2')}</span>
                </div>
                <div className="ppt-feature-item">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>{t('pptFeature3')}</span>
                </div>
              </div>

              {fileUrl && (
                <div className="ppt-actions-bar">
                  <a href={fileUrl} download className="btn btn-primary btn-lg">
                    <Download size={18} />
                    <span>{t('pptDownloadBtn')}</span>
                  </a>
                  <a 
                    href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(window.location.origin + fileUrl)}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-secondary btn-lg"
                  >
                    <ExternalLink size={18} />
                    <span>{t('pptOfficePreview')}</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Notes Sidebar */}
          <div className="ppt-notes-sidebar">
            <div className="notes-sidebar-header">
              <Sparkles size={16} className="text-primary" />
              <h3>{t('pptPlanTitle')}</h3>
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
                  <p>{lang === 'fr' ? 'Aucune note enregistrée pour ce diaporama.' : 'No notes recorded for this slide deck.'}</p>
                </div>
              )}

              {course.chapter && (
                <div className="notes-section">
                  <h4>{t('fieldChapter')}</h4>
                  <p>{course.chapter}</p>
                </div>
              )}

              {course.description && (
                <div className="notes-section">
                  <h4>{t('fieldDesc')}</h4>
                  <p>{course.description}</p>
                </div>
              )}

              {course.tags && course.tags.length > 0 && (
                <div className="notes-section">
                  <h4>{t('fieldTags')}</h4>
                  <div className="notes-tags-list">
                    {course.tags.map((tag, i) => (
                      <span key={i} className="tag-pill">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
