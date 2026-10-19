import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import FilterBar from './components/FilterBar';
import CourseCard from './components/CourseCard';
import PdfViewerModal from './components/PdfViewerModal';
import VideoPlayerModal from './components/VideoPlayerModal';
import PptViewerModal from './components/PptViewerModal';
import EditCourseModal from './components/EditCourseModal';
import UploadCoursePage from './components/UploadCoursePage';
import StatsView from './components/StatsView';
import { 
  PlusCircle, 
  Star, 
  FolderSearch, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useTranslation } from './context/LanguageContext';
import { DEFAULT_SAMPLE_COURSES, DEFAULT_SUBJECTS_LIST, computeStats } from './data/fallbackCourses';
import './App.css';

export default function App() {
  const { t, lang } = useTranslation();

  // Navigation & Theme
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'upload' | 'favorites' | 'stats'
  const [theme, setTheme] = useState(() => localStorage.getItem('pharmavault_theme') || 'dark');

  // Data states
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('pharmavault_courses');
      return saved ? JSON.parse(saved) : DEFAULT_SAMPLE_COURSES;
    } catch {
      return DEFAULT_SAMPLE_COURSES;
    }
  });
  const [stats, setStats] = useState(() => computeStats(DEFAULT_SAMPLE_COURSES));
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS_LIST);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modals
  const [viewingPdfCourse, setViewingPdfCourse] = useState(null);
  const [viewingVideoCourse, setViewingVideoCourse] = useState(null);
  const [viewingPptCourse, setViewingPptCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pharmavault_theme', theme);
  }, [theme]);

  // Persist courses locally as well
  useEffect(() => {
    if (courses && courses.length > 0) {
      localStorage.setItem('pharmavault_courses', JSON.stringify(courses));
    }
  }, [courses]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesRes, statsRes, subjectsRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/stats'),
        fetch('/api/subjects')
      ]);

      const isJson = (res) => {
        const ct = res.headers.get('content-type');
        return ct && ct.includes('application/json');
      };

      if (coursesRes.ok && isJson(coursesRes)) {
        const coursesData = await coursesRes.json();
        if (Array.isArray(coursesData) && coursesData.length > 0) {
          setCourses(coursesData);
        }
      }
      if (statsRes.ok && isJson(statsRes)) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else {
        setStats(computeStats(courses));
      }
      if (subjectsRes.ok && isJson(subjectsRes)) {
        const subjectsData = await subjectsRes.json();
        setSubjects(subjectsData);
      }
    } catch (err) {
      console.warn('Mode prototype autonome (données locales synchronisées):', err);
      setStats(computeStats(courses));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered courses logic
  const filteredCourses = courses.filter((c) => {
    if (activeTab === 'favorites' && !c.isFavorite) {
      return false;
    }

    if (selectedFormat !== 'all' && c.type !== selectedFormat) {
      return false;
    }

    if (selectedYear !== 'all' && c.year !== selectedYear) {
      return false;
    }

    if (selectedSubject !== 'all' && (c.subject || '').toLowerCase() !== selectedSubject.toLowerCase()) {
      return false;
    }

    if (selectedSemester !== 'all' && c.semester !== selectedSemester) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = (c.title || '').toLowerCase().includes(q);
      const descMatch = (c.description || '').toLowerCase().includes(q);
      const subjectMatch = (c.subject || '').toLowerCase().includes(q);
      const teacherMatch = (c.teacher || '').toLowerCase().includes(q);
      const chapterMatch = (c.chapter || '').toLowerCase().includes(q);
      const tagsMatch = Array.isArray(c.tags) && c.tags.some((t) => t.toLowerCase().includes(q));
      if (!titleMatch && !descMatch && !subjectMatch && !teacherMatch && !chapterMatch && !tagsMatch) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === 'title_asc') {
      return (a.title || '').localeCompare(b.title || '');
    }
    if (sortBy === 'views') {
      return (b.views || 0) - (a.views || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedFormat('all');
    setSelectedYear('all');
    setSelectedSubject('all');
    setSelectedSemester('all');
    setSortBy('newest');
  };

  const handleOpenCourse = async (course) => {
    try {
      fetch(`/api/courses/${course.id}`);
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, views: (c.views || 0) + 1 } : c))
      );
    } catch (e) {
      console.error(e);
    }

    if (course.type === 'pdf') {
      setViewingPdfCourse(course);
    } else if (course.type === 'video') {
      setViewingVideoCourse(course);
    } else if (course.type === 'powerpoint') {
      setViewingPptCourse(course);
    }
  };

  const handleToggleFavorite = async (courseId) => {
    let newFavState = false;
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          newFavState = !c.isFavorite;
          return { ...c, isFavorite: newFavState };
        }
        return c;
      })
    );
    showToast(newFavState ? t('toastFavAdded') : t('toastFavRemoved'));

    try {
      await fetch(`/api/courses/${courseId}/favorite`, { method: 'POST' });
    } catch (err) {
      // Prototype mode
    }
  };

  const handleSaveEdit = async (courseId, updatedData) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const tagsArray = typeof updatedData.tags === 'string'
            ? updatedData.tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean)
            : updatedData.tags;
          return { ...c, ...updatedData, tags: tagsArray };
        }
        return c;
      })
    );
    showToast(t('toastCourseUpdated'));

    try {
      await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
    } catch (err) {
      // Prototype mode
    }
  };

  const handleDeleteCourse = async (course) => {
    const confirmDelete = window.confirm(`${t('toastConfirmDelete')} "${course.title}" ?`);
    if (!confirmDelete) return;

    setCourses((prev) => {
      const updated = prev.filter((c) => c.id !== course.id);
      setStats(computeStats(updated));
      return updated;
    });
    showToast(`${t('toastCourseDeleted')} "${course.title}"`);

    try {
      await fetch(`/api/courses/${course.id}`, { method: 'DELETE' });
    } catch (err) {
      // Prototype mode
    }
  };

  const handleCourseCreated = (newCourse) => {
    setCourses((prev) => {
      const updated = [newCourse, ...prev];
      setStats(computeStats(updated));
      return updated;
    });
  };

  return (
    <div className="app-layout">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        stats={stats}
      />

      {/* Main Content Area */}
      <main className="main-content-container">
        {activeTab === 'upload' ? (
          <UploadCoursePage
            courses={courses}
            subjects={subjects}
            onCourseCreated={handleCourseCreated}
            onOpenCourse={handleOpenCourse}
            onEditCourse={setEditingCourse}
            onDeleteCourse={handleDeleteCourse}
            showToast={showToast}
          />
        ) : activeTab === 'stats' ? (
          <StatsView
            stats={stats}
            courses={courses}
            onOpenCourse={handleOpenCourse}
          />
        ) : (
          /* Courses Library View (or Favorites) */
          <div className="courses-library-view fade-in">
            {activeTab === 'courses' && (
              <HeroBanner
                stats={stats}
                onAddClick={() => setActiveTab('upload')}
                onExploreClick={() => {
                  const el = document.getElementById('course-search-input');
                  if (el) el.focus();
                }}
              />
            )}

            {/* If Favorites tab */}
            {activeTab === 'favorites' && (
              <div className="favorites-header glass-panel">
                <div className="fav-title-wrap">
                  <Star size={24} fill="#f59e0b" color="#f59e0b" />
                  <h2>{t('favTitle')}</h2>
                </div>
                <p>{t('favSub')}</p>
              </div>
            )}

            {/* Filter Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedFormat={selectedFormat}
              setSelectedFormat={setSelectedFormat}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              selectedSemester={selectedSemester}
              setSelectedSemester={setSelectedSemester}
              sortBy={sortBy}
              setSortBy={setSortBy}
              subjects={subjects}
              onResetFilters={handleResetFilters}
              totalResults={filteredCourses.length}
            />

            {/* Courses Grid */}
            {loading ? (
              <div className="loading-state glass-panel">
                <div className="spinner"></div>
                <p>{t('loadingText')}</p>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="courses-cards-grid">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onOpen={handleOpenCourse}
                    onEdit={setEditingCourse}
                    onDelete={handleDeleteCourse}
                    onToggleFavorite={handleToggleFavorite}
                    onTagClick={(tag) => setSearchQuery(tag)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state glass-panel">
                <div className="empty-icon-wrap">
                  <FolderSearch size={48} />
                </div>
                <h3>{t('emptyTitle')}</h3>
                <p>
                  {searchQuery || selectedFormat !== 'all' || selectedSubject !== 'all' || selectedYear !== 'all'
                    ? t('emptyFilterDesc')
                    : activeTab === 'favorites'
                    ? t('emptyFavDesc')
                    : t('emptyLibraryDesc')}
                </p>
                <div className="empty-actions">
                  {(searchQuery || selectedFormat !== 'all' || selectedSubject !== 'all' || selectedYear !== 'all') && (
                    <button className="btn btn-secondary" onClick={handleResetFilters}>
                      {t('resetFilters')}
                    </button>
                  )}
                  <button className="btn btn-primary" onClick={() => setActiveTab('upload')}>
                    <PlusCircle size={16} />
                    <span>{t('emptyAddBtn')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-brand">PharmaVault</span>
            <span className="footer-dot">•</span>
            <span>{t('footerSub')}</span>
          </div>
          <div className="footer-right">
            <span>{t('footerTech')}</span>
            <span className="footer-dot">•</span>
            <span>{t('footerFormats')}</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {viewingPdfCourse && (
        <PdfViewerModal
          course={viewingPdfCourse}
          onClose={() => setViewingPdfCourse(null)}
        />
      )}

      {viewingVideoCourse && (
        <VideoPlayerModal
          course={viewingVideoCourse}
          onClose={() => setViewingVideoCourse(null)}
        />
      )}

      {viewingPptCourse && (
        <PptViewerModal
          course={viewingPptCourse}
          onClose={() => setViewingPptCourse(null)}
        />
      )}

      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={handleSaveEdit}
          subjects={subjects}
        />
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((tItem) => (
          <div key={tItem.id} className={`toast ${tItem.type === 'error' ? 'error' : ''}`}>
            {tItem.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
            <span>{tItem.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
