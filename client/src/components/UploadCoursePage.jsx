import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Presentation, 
  Video, 
  Link as LinkIcon, 
  Sparkles, 
  X, 
  Trash2, 
  Eye, 
  Edit3, 
  FileUp, 
  Search,
  HardDrive,
  GraduationCap
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function UploadCoursePage({
  courses,
  subjects,
  onCourseCreated,
  onOpenCourse,
  onEditCourse,
  onDeleteCourse,
  showToast
}) {
  const { t, lang } = useTranslation();
  const [courseType, setCourseType] = useState('pdf'); // 'pdf' | 'powerpoint' | 'video'
  const [videoMode, setVideoMode] = useState('upload'); // 'upload' | 'url'
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Pharmacologie',
    customSubject: '',
    year: '3ème Année',
    semester: 'Semestre 5',
    chapter: '',
    teacher: '',
    description: '',
    notes: '',
    tags: '',
    videoUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableSearch, setTableSearch] = useState('');

  // Handle Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (courseType === 'pdf' && ext !== 'pdf') {
      showToast(lang === 'fr' ? 'Veuillez sélectionner un fichier PDF valide (.pdf)' : 'Please select a valid PDF file (.pdf)', 'error');
      return;
    }
    if (courseType === 'powerpoint' && !['ppt', 'pptx'].includes(ext)) {
      showToast(lang === 'fr' ? 'Veuillez sélectionner un fichier PowerPoint (.ppt ou .pptx)' : 'Please select a PowerPoint file (.ppt or .pptx)', 'error');
      return;
    }
    if (courseType === 'video' && !['mp4', 'webm', 'mkv', 'mov', 'avi'].includes(ext)) {
      showToast(lang === 'fr' ? 'Veuillez sélectionner un format vidéo valide (.mp4, .webm...)' : 'Please select a valid video file (.mp4, .webm...)', 'error');
      return;
    }

    setSelectedFile(file);
    if (!formData.title) {
      const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setFormData((prev) => ({
        ...prev,
        title: rawName.charAt(0).toUpperCase() + rawName.slice(1)
      }));
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast(t('toastErrorTitleReq'), 'error');
      return;
    }

    if (courseType === 'video' && videoMode === 'url' && !formData.videoUrl.trim()) {
      showToast(t('toastErrorUrlReq'), 'error');
      return;
    }

    if ((courseType === 'pdf' || courseType === 'powerpoint' || (courseType === 'video' && videoMode === 'upload')) && !selectedFile) {
      showToast(t('toastErrorSelectFile'), 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('subject', formData.customSubject.trim() ? formData.customSubject.trim() : formData.subject);
      postData.append('year', formData.year);
      postData.append('semester', formData.semester);
      postData.append('type', courseType);
      postData.append('chapter', formData.chapter);
      postData.append('teacher', formData.teacher);
      postData.append('description', formData.description);
      postData.append('notes', formData.notes);
      postData.append('tags', formData.tags);

      if (courseType === 'video' && videoMode === 'url') {
        postData.append('videoUrl', formData.videoUrl);
      }

      if (selectedFile) {
        postData.append('file', selectedFile);
      }

      let newCourse = null;
      try {
        const res = await fetch('/api/courses', {
          method: 'POST',
          body: postData,
        });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          newCourse = await res.json();
        }
      } catch (e) {
        console.warn('Backend API non disponible en production statique, mode local:', e);
      }

      if (!newCourse) {
        let parsedTags = [];
        if (typeof formData.tags === 'string') {
          parsedTags = formData.tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
        }
        let embedUrl = '';
        if (courseType === 'video' && formData.videoUrl) {
          const ytMatch = formData.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
          if (ytMatch) {
            embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
          } else {
            embedUrl = formData.videoUrl;
          }
        }
        newCourse = {
          id: 'pharm-' + Date.now(),
          title: formData.title,
          subject: formData.customSubject.trim() ? formData.customSubject.trim() : formData.subject,
          year: formData.year,
          semester: formData.semester,
          type: courseType,
          chapter: formData.chapter,
          teacher: formData.teacher,
          description: formData.description,
          tags: parsedTags,
          videoUrl: formData.videoUrl,
          embedUrl,
          fileName: selectedFile ? selectedFile.name : null,
          fileSize: selectedFile ? selectedFile.size : 0,
          notes: formData.notes,
          views: 1,
          isFavorite: false,
          createdAt: new Date().toISOString()
        };
      }

      showToast(`${lang === 'fr' ? 'Cours' : 'Course'} "${newCourse.title}" ${lang === 'fr' ? 'ajouté avec succès !' : 'successfully added!'}`);

      // Reset form
      setFormData({
        title: '',
        subject: formData.subject,
        customSubject: '',
        year: formData.year,
        semester: formData.semester,
        chapter: '',
        teacher: '',
        description: '',
        notes: '',
        tags: '',
        videoUrl: ''
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (onCourseCreated) onCourseCreated(newCourse);
    } catch (err) {
      console.error(err);
      showToast(err.message || (lang === 'fr' ? 'Erreur lors du téléversement' : 'Upload error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    if (!tableSearch) return true;
    const q = tableSearch.toLowerCase();
    return (
      (c.title || '').toLowerCase().includes(q) ||
      (c.subject || '').toLowerCase().includes(q) ||
      (c.year || '').toLowerCase().includes(q) ||
      (c.teacher || '').toLowerCase().includes(q)
    );
  });

  const formatFileSize = (bytes) => {
    if (!bytes) return '-';
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + (lang === 'fr' ? ' Mo' : ' MB');
    return Math.round(bytes / 1024) + (lang === 'fr' ? ' Ko' : ' KB');
  };

  return (
    <div className="upload-page-container fade-in">
      {/* Header section */}
      <div className="upload-header glass-panel">
        <div className="upload-header-text">
          <div className="upload-badge">
            <GraduationCap size={16} />
            <span>{t('uploadBadgeText')}</span>
          </div>
          <h1 className="upload-page-title">
            {t('uploadTitle')}
          </h1>
          <p className="upload-page-subtitle">
            {t('uploadSubtitle')}
          </p>
        </div>
      </div>

      {/* Main Form and Live Preview Layout */}
      <div className="upload-main-grid">
        {/* Left column: Upload Form */}
        <div className="upload-form-card glass-panel">
          {/* Format Selection Tabs */}
          <div className="type-selector-bar">
            <button
              type="button"
              className={`type-tab-btn ${courseType === 'pdf' ? 'active pdf' : ''}`}
              onClick={() => {
                setCourseType('pdf');
                setSelectedFile(null);
              }}
              id="type-tab-pdf"
            >
              <FileText size={18} />
              <span>{t('tabPdf')}</span>
            </button>

            <button
              type="button"
              className={`type-tab-btn ${courseType === 'powerpoint' ? 'active ppt' : ''}`}
              onClick={() => {
                setCourseType('powerpoint');
                setSelectedFile(null);
              }}
              id="type-tab-ppt"
            >
              <Presentation size={18} />
              <span>{t('tabPpt')}</span>
            </button>

            <button
              type="button"
              className={`type-tab-btn ${courseType === 'video' ? 'active video' : ''}`}
              onClick={() => {
                setCourseType('video');
                setSelectedFile(null);
              }}
              id="type-tab-video"
            >
              <Video size={18} />
              <span>{t('tabVideo')}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="upload-form">
            {/* If video: Choice between direct file upload or online URL */}
            {courseType === 'video' && (
              <div className="video-mode-switch">
                <button
                  type="button"
                  className={`video-mode-btn ${videoMode === 'upload' ? 'active' : ''}`}
                  onClick={() => setVideoMode('upload')}
                >
                  <FileUp size={16} />
                  <span>{t('videoModeUpload')}</span>
                </button>
                <button
                  type="button"
                  className={`video-mode-btn ${videoMode === 'url' ? 'active' : ''}`}
                  onClick={() => {
                    setVideoMode('url');
                    setSelectedFile(null);
                  }}
                >
                  <LinkIcon size={16} />
                  <span>{t('videoModeUrl')}</span>
                </button>
              </div>
            )}

            {/* Video URL Input when url mode selected */}
            {courseType === 'video' && videoMode === 'url' ? (
              <div className="form-group url-group">
                <label>{t('videoUrlLabel')}</label>
                <div className="input-with-icon">
                  <LinkIcon size={18} className="field-icon" />
                  <input
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="form-input"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  />
                </div>
                <span className="field-hint">
                  {t('videoUrlHint')}
                </span>
              </div>
            ) : (
              /* Dropzone for PDF / PPT / Video file */
              <div
                className={`dropzone-area ${dragActive ? 'drag-over' : ''} ${selectedFile ? 'has-file' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: 'none' }}
                  accept={
                    courseType === 'pdf'
                      ? '.pdf,application/pdf'
                      : courseType === 'powerpoint'
                      ? '.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation'
                      : 'video/mp4,video/webm,video/mkv,video/quicktime,.mp4,.webm,.mkv,.mov'
                  }
                  onChange={handleFileInputChange}
                />

                {selectedFile ? (
                  <div className="selected-file-info" onClick={(e) => e.stopPropagation()}>
                    <div className="file-icon-badge">
                      {courseType === 'pdf' && <FileText size={32} className="text-rose" />}
                      {courseType === 'powerpoint' && <Presentation size={32} className="text-amber" />}
                      {courseType === 'video' && <Video size={32} className="text-cyan" />}
                    </div>
                    <div className="file-details">
                      <span className="file-name">{selectedFile.name}</span>
                      <span className="file-meta">
                        {formatFileSize(selectedFile.size)} • {t('dropzoneReady')}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-remove-file"
                      onClick={removeSelectedFile}
                      title={t('cardDelete')}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="dropzone-prompt">
                    <div className="upload-icon-circle">
                      <UploadCloud size={36} />
                    </div>
                    <h4>{t('dropzoneTitle')} {courseType === 'pdf' ? (lang === 'fr' ? 'document PDF' : 'PDF document') : courseType === 'powerpoint' ? (lang === 'fr' ? 'présentation PowerPoint' : 'PowerPoint presentation') : (lang === 'fr' ? 'fichier vidéo' : 'video file')} {lang === 'fr' ? 'ici' : 'here'}</h4>
                    <p>{t('dropzoneSub')}</p>
                    <span className="upload-limits-pill">
                      {courseType === 'pdf' && 'PDF max 500 MB'}
                      {courseType === 'powerpoint' && 'PPTX, PPT max 500 MB'}
                      {courseType === 'video' && 'MP4, WebM, MKV max 500 MB'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Course Metadata Fields */}
            <div className="form-fields-grid">
              <div className="form-group full-width">
                <label>{t('fieldTitle')}</label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'fr' ? "Ex: Pharmacologie Cardiovasculaire : Antihypertenseurs" : "Ex: Cardiovascular Pharmacology : Antihypertensive Agents"}
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  id="course-title-input"
                />
              </div>

              <div className="form-group">
                <label>{t('fieldSubject')}</label>
                <select
                  className="form-input"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  id="course-subject-select"
                >
                  {subjects && subjects.map((s) => (
                    <option key={s.id || s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                  <option value="Autre">{lang === 'fr' ? '+ Autre discipline personnalisée...' : '+ Other custom discipline...'}</option>
                </select>
              </div>

              {formData.subject === 'Autre' && (
                <div className="form-group">
                  <label>{lang === 'fr' ? 'Nom de la nouvelle matière *' : 'New subject name *'}</label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'fr' ? "Ex: Chimie Analytique, Immunologie..." : "Ex: Analytical Chemistry, Immunology..."}
                    className="form-input"
                    value={formData.customSubject}
                    onChange={(e) => setFormData({ ...formData, customSubject: e.target.value })}
                  />
                </div>
              )}

              <div className="form-group">
                <label>{t('fieldYear')} *</label>
                <select
                  className="form-input"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                >
                  <option value="1ère Année">{t('year1')}</option>
                  <option value="2ème Année">{t('year2')}</option>
                  <option value="3ème Année">{t('year3')}</option>
                  <option value="4ème Année">{t('year4')}</option>
                  <option value="5ème Année">{t('year5')}</option>
                  <option value="6ème Année">{t('year6')}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('fieldSemester')}</label>
                <select
                  className="form-input"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                >
                  {Array.from({ length: 12 }, (_, i) => `${lang === 'fr' ? 'Semestre' : 'Semester'} ${i + 1}`).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t('fieldTeacher')}</label>
                <input
                  type="text"
                  placeholder={lang === 'fr' ? "Ex: Pr. Dupont / Dr. Benali" : "Ex: Prof. Benali / Dr. Smith"}
                  className="form-input"
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label>{t('fieldChapter')}</label>
                <input
                  type="text"
                  placeholder={lang === 'fr' ? "Ex: Module 3 - Thérapeutique des Maladies Infectieuses" : "Ex: Module 3 - Infectious Disease Therapeutics"}
                  className="form-input"
                  value={formData.chapter}
                  onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label>{t('fieldDesc')}</label>
                <textarea
                  rows={2}
                  placeholder={lang === 'fr' ? "Résumé du contenu, mécanismes abordés, notions d'examen..." : "Summary of content, pharmacological targets, high-yield topics..."}
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label>{t('fieldMemo')}</label>
                <textarea
                  rows={3}
                  placeholder={lang === 'fr' ? "Ex: Formule de clairance Cl = Dose / AUC. Attention à l'insuffisance rénale pour les aminosides." : "Ex: Clearance formula Cl = Dose / AUC. Caution with renal impairment for aminoglycosides."}
                  className="form-textarea memo-textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="form-group full-width">
                <label>{t('fieldTags')}</label>
                <input
                  type="text"
                  placeholder="Cardio, Antihypertenseurs, QCM, RévisionS5"
                  className="form-input"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
            </div>

            <div className="form-submit-row">
              <button
                type="submit"
                className="btn btn-primary btn-lg submit-course-btn"
                disabled={isSubmitting}
                id="submit-course-btn"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    <span>{t('uploadingBtn')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>{t('submitBtn')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right column: Live Card Preview & Quick Stats */}
        <div className="upload-preview-column">
          <div className="live-preview-card glass-panel">
            <div className="preview-header">
              <Sparkles size={16} className="text-primary" />
              <h3>{t('previewTitle')}</h3>
            </div>
            <p className="preview-sub">
              {t('previewSub')}
            </p>

            <div className="preview-card-box">
              <div className="card-top-row">
                <div className="card-badges-left">
                  <span className={`badge badge-${courseType}`}>
                    {courseType === 'pdf' && <FileText size={13} />}
                    {courseType === 'powerpoint' && <Presentation size={13} />}
                    {courseType === 'video' && <Video size={13} />}
                    <span>{courseType === 'pdf' ? 'PDF' : courseType === 'powerpoint' ? 'PowerPoint' : (lang === 'fr' ? 'Vidéo' : 'Video')}</span>
                  </span>
                  <span className="badge badge-year">{formData.year}</span>
                  <span className="badge badge-semester">{formData.semester}</span>
                </div>
              </div>

              <div className="card-subject-row" style={{ marginTop: 12 }}>
                <span className="card-subject-pill" style={{ color: '#10b981', backgroundColor: '#10b98115', borderColor: '#10b98140' }}>
                  <span className="sub-dot" style={{ backgroundColor: '#10b981' }}></span>
                  {formData.customSubject || formData.subject}
                </span>
                {formData.chapter && (
                  <span className="card-chapter-text">{formData.chapter}</span>
                )}
              </div>

              <h4 className="preview-card-title">
                {formData.title || (lang === 'fr' ? "Titre de votre cours s'affichera ici" : "Your course title will appear here")}
              </h4>

              {formData.teacher && (
                <div className="card-meta-row">
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    👨‍⚕️ {formData.teacher}
                  </span>
                </div>
              )}

              <p className="card-description" style={{ marginTop: 8 }}>
                {formData.description || (lang === 'fr' ? "Description courte du cours et objectifs pédagogiques..." : "Short course description and learning objectives...")}
              </p>

              {formData.notes && (
                <div className="card-notes-preview" style={{ marginTop: 10 }}>
                  <span style={{ fontSize: '0.82rem', color: '#10b981' }}>
                    💡 <strong>{t('cardMemo')}</strong> {formData.notes}
                  </span>
                </div>
              )}

              {selectedFile && (
                <div className="preview-attached-file">
                  <span>📎 {lang === 'fr' ? 'Fichier joint :' : 'Attached file:'} <strong>{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})</span>
                </div>
              )}
            </div>

            <div className="student-guide-box">
              <h4>{t('guideTitle')}</h4>
              <ul>
                <li><strong>PDF :</strong> {t('guidePdf')}</li>
                <li><strong>PowerPoint :</strong> {t('guidePpt')}</li>
                <li><strong>{lang === 'fr' ? 'Vidéos :' : 'Videos:'}</strong> {t('guideVideo')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Course Manager Table section */}
      <div className="course-manager-section glass-panel">
        <div className="manager-header">
          <div className="manager-title-group">
            <HardDrive size={22} className="text-primary" />
            <div>
              <h2>{t('managerTitle')} ({courses.length})</h2>
              <p>{t('managerSub')}</p>
            </div>
          </div>

          <div className="manager-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder={t('managerSearchPlaceholder')}
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="manager-search-input"
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="courses-table">
            <thead>
              <tr>
                <th>{t('colFormat')}</th>
                <th>{t('colTitle')}</th>
                <th>{t('colSubject')}</th>
                <th>{t('colYear')}</th>
                <th>{t('colTeacher')}</th>
                <th>{t('colSize')}</th>
                <th>{t('colViews')}</th>
                <th>{t('colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className={`badge badge-${c.type}`}>
                        {c.type === 'pdf' ? 'PDF' : c.type === 'powerpoint' ? 'PPT' : (lang === 'fr' ? 'Vidéo' : 'Video')}
                      </span>
                    </td>
                    <td className="table-title-cell">
                      <div className="title-bold">{c.title}</div>
                      {c.chapter && <div className="chapter-sub">{c.chapter}</div>}
                    </td>
                    <td>
                      <span className="table-subject-pill">{c.subject}</span>
                    </td>
                    <td>{c.year}</td>
                    <td>{c.teacher || '-'}</td>
                    <td>
                      {c.fileSize ? formatFileSize(c.fileSize) : (c.videoUrl ? (lang === 'fr' ? 'Lien Web' : 'Web Link') : '-')}
                    </td>
                    <td>{c.views || 0}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-table-action"
                          onClick={() => onOpenCourse(c)}
                          title={t('cardOpen')}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn-table-action"
                          onClick={() => onEditCourse(c)}
                          title={t('cardEdit')}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          className="btn-table-action delete"
                          onClick={() => onDeleteCourse(c)}
                          title={t('cardDelete')}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="empty-table-cell">
                    {t('noTableResults')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
