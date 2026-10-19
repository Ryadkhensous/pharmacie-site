import React from 'react';
import { 
  BarChart3, 
  FileText, 
  Presentation, 
  Video, 
  HardDrive, 
  Eye, 
  Star, 
  Award, 
  BookOpen, 
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function StatsView({ stats, courses, onOpenCourse }) {
  const { t, lang } = useTranslation();
  if (!stats) return null;

  const topCourses = [...courses]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const subjectsEntries = Object.entries(stats.subjectsCount || {}).sort((a, b) => b[1] - a[1]);
  const yearsEntries = Object.entries(stats.yearsCount || {}).sort((a, b) => b[1] - a[1]);

  const formatSubjectName = (subName) => {
    if (lang === 'fr') return subName;
    const lower = subName.toLowerCase();
    if (lower.includes('pharmacolog')) return 'Pharmacology';
    if (lower.includes('galén') || lower.includes('galen') || lower.includes('pharmaceutic')) return 'Pharmaceutics';
    if (lower.includes('chimie')) return 'Medicinal Chemistry';
    if (lower.includes('bactér') || lower.includes('infect') || lower.includes('bacterio')) return 'Bacteriology';
    if (lower.includes('botan') || lower.includes('cognos')) return 'Pharmacognosy & Botany';
    if (lower.includes('toxico')) return 'Toxicology';
    if (lower.includes('biochim') || lower.includes('biochem')) return 'Biochemistry';
    if (lower.includes('sémio') || lower.includes('patho')) return 'Semiology & Pathology';
    if (lower.includes('législat') || lower.includes('déontol')) return 'Law & Ethics';
    return subName;
  };

  const formatYearName = (yearName) => {
    if (lang === 'fr') return yearName;
    if (yearName.includes('1ère')) return '1st Year (PASS/LAS)';
    if (yearName.includes('2ème')) return '2nd Year (DFGSP2)';
    if (yearName.includes('3ème')) return '3rd Year (DFGSP3)';
    if (yearName.includes('4ème')) return '4th Year (DFASP1)';
    if (yearName.includes('5ème')) return '5th Year (DFASP2)';
    if (yearName.includes('6ème')) return '6th Year';
    return yearName;
  };

  return (
    <div className="stats-view-container fade-in">
      <div className="stats-header glass-panel">
        <div className="stats-badge">
          <BarChart3 size={16} />
          <span>{t('statsBadgeText')}</span>
        </div>
        <h1 className="stats-title">{t('statsTitle')}</h1>
        <p className="stats-sub">
          {t('statsSubtitle')}
        </p>
      </div>

      {/* Main Stats Counters Grid */}
      <div className="stats-cards-grid">
        <div className="stat-metric-card glass-panel">
          <div className="metric-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <BookOpen size={28} />
          </div>
          <div className="metric-details">
            <span className="metric-value">{stats.totalCourses}</span>
            <span className="metric-label">{t('statMetricTotal')}</span>
          </div>
        </div>

        <div className="stat-metric-card glass-panel">
          <div className="metric-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <FileText size={28} />
          </div>
          <div className="metric-details">
            <span className="metric-value">{stats.pdfCount}</span>
            <span className="metric-label">{t('statMetricPdf')}</span>
          </div>
        </div>

        <div className="stat-metric-card glass-panel">
          <div className="metric-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Presentation size={28} />
          </div>
          <div className="metric-details">
            <span className="metric-value">{stats.pptCount}</span>
            <span className="metric-label">{t('statMetricPpt')}</span>
          </div>
        </div>

        <div className="stat-metric-card glass-panel">
          <div className="metric-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Video size={28} />
          </div>
          <div className="metric-details">
            <span className="metric-value">{stats.videoCount}</span>
            <span className="metric-label">{t('statMetricVideo')}</span>
          </div>
        </div>

        <div className="stat-metric-card glass-panel">
          <div className="metric-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <HardDrive size={28} />
          </div>
          <div className="metric-details">
            <span className="metric-value">{stats.totalStorageMb} {lang === 'fr' ? 'Mo' : 'MB'}</span>
            <span className="metric-label">{t('statMetricStorage')}</span>
          </div>
        </div>

        <div className="stat-metric-card glass-panel">
          <div className="metric-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#eab308' }}>
            <Star size={28} />
          </div>
          <div className="metric-details">
            <span className="metric-value">{stats.favoriteCount}</span>
            <span className="metric-label">{t('statMetricFavs')}</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Subjects Distribution & Top Courses */}
      <div className="stats-breakdown-grid">
        {/* Disciplines breakdown */}
        <div className="stats-panel-box glass-panel">
          <div className="panel-title-row">
            <GraduationCap size={20} className="text-primary" />
            <h3>{t('breakdownSubjectTitle')}</h3>
          </div>

          <div className="progress-bars-list">
            {subjectsEntries.length > 0 ? (
              subjectsEntries.map(([subject, count]) => {
                const percentage = stats.totalCourses > 0 ? Math.round((count / stats.totalCourses) * 100) : 0;
                return (
                  <div key={subject} className="progress-item">
                    <div className="progress-labels">
                      <span className="progress-name">{formatSubjectName(subject)}</span>
                      <span className="progress-count">{count} {lang === 'fr' ? 'cours' : 'courses'} ({percentage}%)</span>
                    </div>
                    <div className="progress-bar-track">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-text">{lang === 'fr' ? 'Aucun cours disponible.' : 'No courses available.'}</p>
            )}
          </div>
        </div>

        {/* Study Years Distribution */}
        <div className="stats-panel-box glass-panel">
          <div className="panel-title-row">
            <TrendingUp size={20} className="text-primary" />
            <h3>{t('breakdownYearTitle')}</h3>
          </div>

          <div className="progress-bars-list">
            {yearsEntries.length > 0 ? (
              yearsEntries.map(([year, count]) => {
                const percentage = stats.totalCourses > 0 ? Math.round((count / stats.totalCourses) * 100) : 0;
                return (
                  <div key={year} className="progress-item">
                    <div className="progress-labels">
                      <span className="progress-name">{formatYearName(year)}</span>
                      <span className="progress-count">{count} {lang === 'fr' ? 'cours' : 'courses'} ({percentage}%)</span>
                    </div>
                    <div className="progress-bar-track">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${percentage}%`,
                          background: 'linear-gradient(90deg, #06b6d4, #3b82f6)'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-text">{lang === 'fr' ? 'Aucune donnée disponible.' : 'No data available.'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Top 5 Most Viewed Courses */}
      <div className="top-courses-panel glass-panel">
        <div className="panel-title-row">
          <Award size={20} className="text-primary" />
          <h3>{t('topCoursesTitle')}</h3>
        </div>

        <div className="top-courses-list">
          {topCourses.map((c, index) => (
            <div key={c.id} className="top-course-item" onClick={() => onOpenCourse(c)}>
              <div className="top-rank">#{index + 1}</div>
              <div className="top-info">
                <h4 className="top-title">{c.title}</h4>
                <div className="top-meta">
                  <span className="top-subject">{formatSubjectName(c.subject)}</span>
                  <span>•</span>
                  <span>{formatYearName(c.year)}</span>
                  <span>•</span>
                  <span className="top-type">{c.type.toUpperCase()}</span>
                </div>
              </div>
              <div className="top-views">
                <Eye size={16} />
                <span>{c.views || 0} {t('consultationsCount')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
