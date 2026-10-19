import React from 'react';
import { 
  BookOpen, 
  PlusCircle, 
  Star, 
  BarChart3, 
  Sun, 
  Moon, 
  GraduationCap,
  Languages
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme, stats }) {
  const { lang, toggleLang, t } = useTranslation();

  return (
    <>
      <header className="navbar-container">
        <div className="navbar-content">
          {/* Logo and Brand */}
          <div className="navbar-brand" onClick={() => setActiveTab('courses')} style={{ cursor: 'pointer' }}>
            <div className="brand-logo-wrapper">
              <img src="/logo.jpg" alt="PharmaVault Logo" className="brand-logo" />
              <div className="status-indicator"></div>
            </div>
            <div className="brand-text">
              <div className="brand-title-row">
                <span className="brand-name">PharmaVault</span>
                <span className="brand-badge">Pharmacie</span>
              </div>
              <span className="brand-sub">{t('brandSub')}</span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="navbar-links desktop-only-nav">
            <button
              className={`nav-btn ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
              id="nav-courses-btn"
            >
              <BookOpen size={18} />
              <span>{t('navLibrary')}</span>
              {stats && stats.totalCourses > 0 && (
                <span className="nav-counter">{stats.totalCourses}</span>
              )}
            </button>

            <button
              className={`nav-btn nav-btn-highlight ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
              id="nav-upload-btn"
            >
              <PlusCircle size={18} />
              <span>{t('navUpload')}</span>
            </button>

            <button
              className={`nav-btn ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
              id="nav-favorites-btn"
            >
              <Star size={18} />
              <span>{t('navFavorites')}</span>
              {stats && stats.favoriteCount > 0 && (
                <span className="nav-counter favorite-counter">{stats.favoriteCount}</span>
              )}
            </button>

            <button
              className={`nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
              id="nav-stats-btn"
            >
              <BarChart3 size={18} />
              <span>{t('navStats')}</span>
            </button>
          </nav>

          {/* Actions (Language Switcher + Faculty pill + Theme toggle) */}
          <div className="navbar-actions">
            {/* Language Switcher Button */}
            <button
              className="lang-switcher-btn"
              onClick={toggleLang}
              title={t('switchLanguage')}
              aria-label={t('switchLanguage')}
              id="lang-toggle-btn"
            >
              <Languages size={17} className="lang-icon" />
              <span className={`lang-pill ${lang === 'fr' ? 'active' : ''}`}>FR</span>
              <span className="lang-divider">/</span>
              <span className={`lang-pill ${lang === 'en' ? 'active' : ''}`}>EN</span>
            </button>

            <div className="university-pill desktop-only">
              <GraduationCap size={16} className="uni-icon" />
              <span>{t('facultyBadge')}</span>
            </div>

            <button 
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? t('themeLight') : t('themeDark')}
              aria-label="Changer de thème"
            >
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet App Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-nav-item ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <div className="mobile-nav-icon-wrap">
            <BookOpen size={20} />
            {stats && stats.totalCourses > 0 && (
              <span className="mobile-nav-badge">{stats.totalCourses}</span>
            )}
          </div>
          <span className="mobile-nav-label">{t('navLibrary')}</span>
        </button>

        <button
          className={`mobile-nav-item mobile-upload-item ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <div className="mobile-nav-icon-wrap upload-circle">
            <PlusCircle size={22} />
          </div>
          <span className="mobile-nav-label">{t('navUpload')}</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <div className="mobile-nav-icon-wrap">
            <Star size={20} />
            {stats && stats.favoriteCount > 0 && (
              <span className="mobile-nav-badge fav">{stats.favoriteCount}</span>
            )}
          </div>
          <span className="mobile-nav-label">{t('navFavorites')}</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <div className="mobile-nav-icon-wrap">
            <BarChart3 size={20} />
          </div>
          <span className="mobile-nav-label">{t('navStats')}</span>
        </button>
      </nav>
    </>
  );
}
