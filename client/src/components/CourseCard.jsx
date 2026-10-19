import React from 'react';
import { 
  FileText, 
  Presentation, 
  Video, 
  Eye, 
  Download, 
  Star, 
  Trash2, 
  Edit3, 
  Clock, 
  User, 
  Bookmark, 
  ExternalLink,
  Calendar,
  FileCheck
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function CourseCard({
  course,
  onOpen,
  onEdit,
  onDelete,
  onToggleFavorite,
  onTagClick
}) {
  const { t, lang } = useTranslation();

  const getFormatBadge = (type) => {
    switch (type) {
      case 'pdf':
        return (
          <span className="badge badge-pdf">
            <FileText size={13} />
            <span>PDF</span>
          </span>
        );
      case 'powerpoint':
        return (
          <span className="badge badge-powerpoint">
            <Presentation size={13} />
            <span>PowerPoint</span>
          </span>
        );
      case 'video':
        return (
          <span className="badge badge-video">
            <Video size={13} />
            <span>{lang === 'fr' ? 'Vidéo' : 'Video'}</span>
          </span>
        );
      default:
        return null;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return null;
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + (lang === 'fr' ? ' Mo' : ' MB');
    }
    return Math.round(bytes / 1024) + (lang === 'fr' ? ' Ko' : ' KB');
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getSubjectColor = (subject) => {
    const s = (subject || '').toLowerCase();
    if (s.includes('pharmacolog')) return '#10b981';
    if (s.includes('galén') || s.includes('galen') || s.includes('pharmaceutic')) return '#06b6d4';
    if (s.includes('chimi') || s.includes('medicinal')) return '#8b5cf6';
    if (s.includes('bactér') || s.includes('infect') || s.includes('bacterio')) return '#ec4899';
    if (s.includes('botan') || s.includes('cognos')) return '#84cc16';
    if (s.includes('toxico')) return '#f59e0b';
    if (s.includes('biochim') || s.includes('biochem')) return '#3b82f6';
    if (s.includes('sémio') || s.includes('patho')) return '#ef4444';
    return '#14b8a6';
  };

  const subjectColor = getSubjectColor(course.subject);

  return (
    <div className={`course-card glass-panel ${course.isFavorite ? 'is-fav' : ''}`}>
      {/* Top Header: Format Badge, Year, and Favorite Star */}
      <div className="card-top-row">
        <div className="card-badges-left">
          {getFormatBadge(course.type)}
          <span className="badge badge-year">{course.year}</span>
          {course.semester && (
            <span className="badge badge-semester">{course.semester}</span>
          )}
        </div>

        <button
          className={`favorite-btn ${course.isFavorite ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(course.id);
          }}
          title={course.isFavorite ? t('cardFavRemove') : t('cardFavAdd')}
        >
          <Star size={18} fill={course.isFavorite ? '#f59e0b' : 'none'} color={course.isFavorite ? '#f59e0b' : 'currentColor'} />
        </button>
      </div>

      {/* Discipline Tag */}
      <div className="card-subject-row">
        <span 
          className="card-subject-pill"
          style={{ 
            color: subjectColor, 
            borderColor: `${subjectColor}40`,
            backgroundColor: `${subjectColor}15`
          }}
        >
          <span className="sub-dot" style={{ backgroundColor: subjectColor }}></span>
          {course.subject}
        </span>
        {course.chapter && (
          <span className="card-chapter-text" title={course.chapter}>
            {course.chapter}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="card-title" onClick={() => onOpen(course)}>
        {course.title}
      </h3>

      {/* Teacher & Date Meta */}
      <div className="card-meta-row">
        {course.teacher && (
          <div className="meta-item" title={t('cardTeacher')}>
            <User size={14} />
            <span>{course.teacher}</span>
          </div>
        )}
        <div className="meta-item" title={t('cardDate')}>
          <Calendar size={14} />
          <span>{formatDate(course.createdAt)}</span>
        </div>
        <div className="meta-item" title="Vues">
          <Eye size={14} />
          <span>{course.views || 0} {t('cardViews')}</span>
        </div>
      </div>

      {/* Description Snippet */}
      {course.description && (
        <p className="card-description">
          {course.description}
        </p>
      )}

      {/* Study Notes Highlight snippet */}
      {course.notes && (
        <div className="card-notes-preview">
          <FileCheck size={14} className="notes-icon" />
          <span className="notes-text">
            <strong>{t('cardMemo')}</strong> {course.notes}
          </span>
        </div>
      )}

      {/* Tags Chips */}
      {course.tags && course.tags.length > 0 && (
        <div className="card-tags-row">
          {course.tags.map((tag, idx) => (
            <span
              key={idx}
              className="tag-pill"
              onClick={(e) => {
                e.stopPropagation();
                if (onTagClick) onTagClick(tag);
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Card Footer: Action Buttons */}
      <div className="card-footer-row">
        <button
          className="btn btn-primary card-action-btn"
          onClick={() => onOpen(course)}
          id={`open-course-${course.id}`}
        >
          <Eye size={16} />
          <span>{t('cardOpen')}</span>
        </button>

        {course.fileName && (
          <a
            href={`/api/files/${encodeURIComponent(course.fileName)}`}
            download
            className="btn btn-secondary card-download-btn"
            title={t('cardDownload')}
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={16} />
            {course.fileSize ? <span>{formatFileSize(course.fileSize)}</span> : null}
          </a>
        )}

        {course.videoUrl && !course.fileName && (
          <a
            href={course.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary card-download-btn"
            title="Lien source"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={16} />
          </a>
        )}

        <div className="card-admin-actions">
          <button
            className="btn-icon-action"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(course);
            }}
            title={t('cardEdit')}
          >
            <Edit3 size={15} />
          </button>
          <button
            className="btn-icon-action btn-icon-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(course);
            }}
            title={t('cardDelete')}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
