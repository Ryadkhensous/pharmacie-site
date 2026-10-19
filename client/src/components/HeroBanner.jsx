import React from 'react';
import { 
  FileText, 
  Presentation, 
  Video, 
  PlusCircle, 
  Search, 
  Sparkles,
  ShieldCheck,
  HardDrive
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function HeroBanner({ stats, onAddClick, onExploreClick }) {
  const { t } = useTranslation();

  return (
    <div className="hero-banner-card glass-panel">
      <div className="hero-content">
        <h1 className="hero-title">
          {t('heroTitlePrefix')}
          <span className="highlight-text">{t('heroTitleHighlight')}</span>
          {t('heroTitleSuffix')}
        </h1>

        <p className="hero-desc">
          {t('heroDesc')}
        </p>

        {/* Action Buttons */}
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={onAddClick} id="hero-add-course-btn">
            <PlusCircle size={20} />
            <span>{t('heroAddBtn')}</span>
          </button>
          <button className="btn btn-secondary btn-lg" onClick={onExploreClick} id="hero-explore-btn">
            <Search size={20} />
            <span>{t('heroExploreBtn')}</span>
          </button>
        </div>

        {/* Stats Pill Bar */}
        <div className="hero-stats-grid">
          <div className="hero-stat-item">
            <div className="stat-icon-wrap stat-courses">
              <ShieldCheck size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats?.totalCourses || 0}</span>
              <span className="stat-label">{t('heroStatTotal')}</span>
            </div>
          </div>

          <div className="hero-stat-item">
            <div className="stat-icon-wrap stat-pdf">
              <FileText size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats?.pdfCount || 0}</span>
              <span className="stat-label">{t('heroStatPdf')}</span>
            </div>
          </div>

          <div className="hero-stat-item">
            <div className="stat-icon-wrap stat-ppt">
              <Presentation size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats?.pptCount || 0}</span>
              <span className="stat-label">{t('heroStatPpt')}</span>
            </div>
          </div>

          <div className="hero-stat-item">
            <div className="stat-icon-wrap stat-video">
              <Video size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats?.videoCount || 0}</span>
              <span className="stat-label">{t('heroStatVideo')}</span>
            </div>
          </div>

          <div className="hero-stat-item">
            <div className="stat-icon-wrap stat-storage">
              <HardDrive size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats?.totalStorageMb || 0} Mo</span>
              <span className="stat-label">{t('heroStatStorage')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-media-wrapper">
        <div className="hero-img-glow"></div>
        <img 
          src="/hero_banner.jpg" 
          alt="Illustration Pharmacie et Sciences Médicales" 
          className="hero-media-img"
        />
      </div>
    </div>
  );
}
