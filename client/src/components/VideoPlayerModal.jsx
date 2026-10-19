import React, { useState, useRef } from 'react';
import { 
  X, 
  Video, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  FastForward, 
  BookOpen, 
  Sparkles,
  Info
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function VideoPlayerModal({ course, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showNotes, setShowNotes] = useState(true);
  const videoRef = useRef(null);
  const { t, lang } = useTranslation();

  if (!course) return null;

  const isLocalVideo = !!course.fileName;
  const videoSourceUrl = isLocalVideo ? `/api/files/${encodeURIComponent(course.fileName)}` : null;

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-container video-modal ${isFullscreen ? 'fullscreen' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-badge-format video">
              <Video size={18} />
              <span>{lang === 'fr' ? 'Vidéo' : 'Video'}</span>
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
            <button 
              className={`btn btn-secondary ${showNotes ? 'active-toggle' : ''}`}
              onClick={() => setShowNotes(!showNotes)}
              title={t('notesDrawer')}
            >
              <BookOpen size={16} />
              <span>{t('notesDrawer')}</span>
            </button>

            {videoSourceUrl && (
              <a 
                href={videoSourceUrl} 
                download 
                className="btn btn-secondary"
                title={t('cardDownload')}
              >
                <Download size={16} />
                <span>{t('cardDownload')}</span>
              </a>
            )}

            {course.videoUrl && (
              <a 
                href={course.videoUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-secondary"
                title={t('openNewTab')}
              >
                <ExternalLink size={16} />
              </a>
            )}

            <button 
              className="btn btn-secondary"
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

        {/* Modal Body */}
        <div className="modal-body video-body-layout">
          {/* Main Video Area */}
          <div className="video-player-container">
            {isLocalVideo ? (
              <div className="local-video-wrapper">
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  className="html5-video"
                  src={videoSourceUrl}
                >
                  {lang === 'fr' 
                    ? 'Votre navigateur ne supporte pas la lecture de cette vidéo.' 
                    : 'Your browser does not support the video tag.'}
                </video>
                
                {/* Custom Playback Speed Bar for fast studying */}
                <div className="video-speed-toolbar">
                  <div className="speed-label">
                    <FastForward size={14} />
                    <span>{t('videoSpeedLabel')}</span>
                  </div>
                  {[0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                    <button
                      key={speed}
                      className={`speed-btn ${playbackSpeed === speed ? 'active' : ''}`}
                      onClick={() => handleSpeedChange(speed)}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            ) : course.embedUrl ? (
              <div className="video-iframe-wrapper">
                <iframe
                  src={course.embedUrl}
                  title={course.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="embed-video-iframe"
                />
              </div>
            ) : course.videoUrl ? (
              <div className="video-iframe-wrapper">
                <iframe
                  src={course.videoUrl}
                  title={course.title}
                  allowFullScreen
                  className="embed-video-iframe"
                />
              </div>
            ) : (
              <div className="no-file-placeholder">
                <Video size={48} />
                <p>{t('videoNoSource')}</p>
              </div>
            )}
          </div>

          {/* Notes Sidebar */}
          {showNotes && (
            <div className="video-notes-sidebar">
              <div className="notes-sidebar-header">
                <Sparkles size={16} className="text-primary" />
                <h3>{t('videoNotesTitle')}</h3>
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
                    <p>{t('videoNoNotes')}</p>
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
                    <h4>{t('videoPlanTitle')}</h4>
                    <p>{course.description}</p>
                  </div>
                )}

                {course.tags && course.tags.length > 0 && (
                  <div className="notes-section">
                    <h4>{t('videoTagsTitle')}</h4>
                    <div className="notes-tags-list">
                      {course.tags.map((tag, i) => (
                        <span key={i} className="tag-pill">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
