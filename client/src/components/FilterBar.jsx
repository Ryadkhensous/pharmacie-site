import React from 'react';
import { 
  Search, 
  X, 
  Filter, 
  FileText, 
  Presentation, 
  Video, 
  Layers, 
  Calendar, 
  ArrowUpDown, 
  RotateCcw
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedFormat,
  setSelectedFormat,
  selectedYear,
  setSelectedYear,
  selectedSubject,
  setSelectedSubject,
  selectedSemester,
  setSelectedSemester,
  sortBy,
  setSortBy,
  subjects,
  onResetFilters,
  totalResults
}) {
  const { t, lang } = useTranslation();

  const YEARS_OPTIONS = [
    { value: 'all', label: t('allYears') },
    { value: '1ère Année', label: t('year1') },
    { value: '2ème Année', label: t('year2') },
    { value: '3ème Année', label: t('year3') },
    { value: '4ème Année', label: t('year4') },
    { value: '5ème Année', label: t('year5') },
    { value: '6ème Année', label: t('year6') }
  ];

  const hasActiveFilters = 
    searchQuery || 
    selectedFormat !== 'all' || 
    selectedYear !== 'all' || 
    selectedSubject !== 'all' || 
    selectedSemester !== 'all' ||
    sortBy !== 'newest';

  const formatSubjectName = (subName) => {
    if (lang === 'fr') return subName;
    const lower = subName.toLowerCase();
    if (lower.includes('pharmacolog')) return 'Pharmacology';
    if (lower.includes('galén') || lower.includes('galen')) return 'Pharmaceutics';
    if (lower.includes('chimie')) return 'Medicinal Chemistry';
    if (lower.includes('bactér') || lower.includes('infect')) return 'Bacteriology';
    if (lower.includes('botan') || lower.includes('cognos')) return 'Pharmacognosy & Botany';
    if (lower.includes('toxico')) return 'Toxicology';
    if (lower.includes('biochim')) return 'Biochemistry';
    if (lower.includes('sémio') || lower.includes('patho')) return 'Semiology & Pathology';
    if (lower.includes('législat') || lower.includes('déontol')) return 'Law & Ethics';
    return subName;
  };

  return (
    <div className="filter-bar-card glass-panel">
      {/* Top row: Search input + Format Tabs */}
      <div className="filter-top-row">
        {/* Search Bar */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="course-search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              title={lang === 'fr' ? 'Effacer la recherche' : 'Clear search'}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Format Selector Tabs */}
        <div className="format-tabs-group">
          <button
            className={`format-tab-btn ${selectedFormat === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFormat('all')}
            id="format-tab-all"
          >
            <Layers size={16} />
            <span>{t('allFormats')}</span>
          </button>
          <button
            className={`format-tab-btn format-pdf ${selectedFormat === 'pdf' ? 'active' : ''}`}
            onClick={() => setSelectedFormat('pdf')}
            id="format-tab-pdf"
          >
            <FileText size={16} />
            <span>PDF</span>
          </button>
          <button
            className={`format-tab-btn format-ppt ${selectedFormat === 'powerpoint' ? 'active' : ''}`}
            onClick={() => setSelectedFormat('powerpoint')}
            id="format-tab-ppt"
          >
            <Presentation size={16} />
            <span>PowerPoint</span>
          </button>
          <button
            className={`format-tab-btn format-video ${selectedFormat === 'video' ? 'active' : ''}`}
            onClick={() => setSelectedFormat('video')}
            id="format-tab-video"
          >
            <Video size={16} />
            <span>{lang === 'fr' ? 'Vidéos' : 'Videos'}</span>
          </button>
        </div>
      </div>

      {/* Middle row: Dropdown Filters for Year, Semester, Sort */}
      <div className="filter-dropdowns-row">
        {/* Year Dropdown */}
        <div className="filter-select-wrapper">
          <Calendar size={16} className="select-icon" />
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="custom-select"
            id="select-year"
          >
            {YEARS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Semester Dropdown */}
        <div className="filter-select-wrapper">
          <Filter size={16} className="select-icon" />
          <select 
            value={selectedSemester} 
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="custom-select"
            id="select-semester"
          >
            <option value="all">{t('allSemesters')}</option>
            {Array.from({ length: 12 }, (_, i) => `${lang === 'fr' ? 'Semestre' : 'Semester'} ${i + 1}`).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="filter-select-wrapper">
          <ArrowUpDown size={16} className="select-icon" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="custom-select"
            id="select-sort"
          >
            <option value="newest">{t('sortNewest')}</option>
            <option value="views">{t('sortViews')}</option>
            <option value="title_asc">{t('sortTitleAsc')}</option>
            <option value="oldest">{t('sortOldest')}</option>
          </select>
        </div>

        {/* Reset button if active */}
        {hasActiveFilters && (
          <button 
            className="btn btn-ghost reset-filter-btn"
            onClick={onResetFilters}
            title={t('resetFilters')}
          >
            <RotateCcw size={15} />
            <span>{t('resetFilters')}</span>
          </button>
        )}

        <div className="results-count-pill">
          <span>
            <strong>{totalResults}</strong> {totalResults > 1 ? t('resultsFoundPlural') : t('resultsFound')}
          </span>
        </div>
      </div>

      {/* Bottom row: Discipline pills */}
      <div className="subjects-chips-row">
        <button
          className={`subject-chip ${selectedSubject === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedSubject('all')}
        >
          <span>{t('allSubjects')}</span>
        </button>
        {subjects && subjects.map((sub) => (
          <button
            key={sub.id || sub.name}
            className={`subject-chip ${selectedSubject.toLowerCase() === sub.name.toLowerCase() ? 'active' : ''}`}
            onClick={() => setSelectedSubject(sub.name)}
            style={{
              '--chip-color': sub.color || '#10b981'
            }}
          >
            <span className="subject-color-dot" style={{ backgroundColor: sub.color || '#10b981' }}></span>
            <span>{formatSubjectName(sub.name)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
