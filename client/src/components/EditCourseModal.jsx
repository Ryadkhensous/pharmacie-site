import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Edit3
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function EditCourseModal({ course, onClose, onSave, subjects }) {
  const { t, lang } = useTranslation();
  const [formData, setFormData] = useState({
    title: course.title || '',
    subject: course.subject || 'Pharmacologie',
    year: course.year || '3ème Année',
    semester: course.semester || 'Semestre 5',
    chapter: course.chapter || '',
    teacher: course.teacher || '',
    description: course.description || '',
    tags: Array.isArray(course.tags) ? course.tags.join(', ') : '',
    notes: course.notes || '',
    videoUrl: course.videoUrl || ''
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(course.id, formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-badge-format">
              <Edit3 size={18} />
              <span>{t('editTitle')}</span>
            </div>
            <h2 className="modal-title">{t('cardEdit')} : {course.title}</h2>
          </div>
          <button className="btn-close-modal" onClick={onClose} title={t('closeModal')}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label>{t('fieldTitle')}</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>{t('fieldSubject')}</label>
              <input
                type="text"
                list="subjects-datalist"
                required
                className="form-input"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
              <datalist id="subjects-datalist">
                {subjects && subjects.map((s) => (
                  <option key={s.id || s.name} value={s.name} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label>{t('fieldYear')}</label>
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
                className="form-input"
                placeholder={lang === 'fr' ? 'Ex: Pr. Dupont' : 'Ex: Prof. Smith'}
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>{t('fieldChapter')}</label>
              <input
                type="text"
                className="form-input"
                placeholder={lang === 'fr' ? 'Ex: Chapitre 2 - Les Antihypertenseurs' : 'Ex: Chapter 2 - Antihypertensives'}
                value={formData.chapter}
                onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
              />
            </div>

            {course.type === 'video' && (
              <div className="form-group full-width">
                <label>{t('fieldVideoUrl')}</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                />
              </div>
            )}

            <div className="form-group full-width">
              <label>{t('fieldDesc')}</label>
              <textarea
                rows={3}
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>{t('fieldMemo')}</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder={lang === 'fr' ? "Formules importantes, valeurs de référence, pièges fréquents aux QCM..." : "Important formulas, reference values, high-yield exam traps..."}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>{t('fieldTags')}</label>
              <input
                type="text"
                className="form-input"
                placeholder="Cardio, Examen, Formules, Internat"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              <span>{saving ? t('saving') : t('saveChanges')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
