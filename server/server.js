import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Directories
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const COURSES_DIR = path.join(UPLOADS_DIR, 'courses');
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'courses.json');

[UPLOADS_DIR, COURSES_DIR, DATA_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, COURSES_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit for high quality course videos / heavy slides
});

// Helper functions for JSON database
function getCourses() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(getInitialSeedCourses(), null, 2), 'utf8');
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading courses.json:', err);
    return [];
  }
}

function saveCourses(courses) {
  fs.writeFileSync(DB_FILE, JSON.stringify(courses, null, 2), 'utf8');
}

// Initial pharmacy courses seed data
function getInitialSeedCourses() {
  return [
    {
      id: 'pharm-001',
      title: 'Pharmacocinétique Clinique : Modèles Compartimentaux & Biodisponibilité',
      subject: 'Pharmacologie',
      year: '3ème Année',
      semester: 'Semestre 5',
      type: 'pdf',
      chapter: 'Chapitre 1 - Principes Généraux de Pharmacologie',
      teacher: 'Pr. A. Benali',
      description: 'Étude approfondie de l\'absorption, distribution, métabolisme hépatique (Cytochromes P450) et élimination rénale des principes actifs. Calculs de clairance et volume de distribution.',
      tags: ['Pharmacocinétique', 'Clairance', 'CYP450', 'Biodisponibilité', 'Examen S5'],
      fileName: 'sample_pharmacocinetique.pdf',
      fileSize: 2450000,
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      views: 42,
      isFavorite: true,
      notes: 'Formules clés à mémoriser pour l\'épreuve : Vd = Dose / C0 et Cl = D / AUC. Attention aux inducteurs et inhibiteurs enzymatiques.'
    },
    {
      id: 'pharm-002',
      title: 'Formes Galéniques Solides : Formulation & Contrôle des Comprimés',
      subject: 'Pharmacie Galénique',
      year: '3ème Année',
      semester: 'Semestre 6',
      type: 'powerpoint',
      chapter: 'Chapitre 3 - Technologie Pharmaceutique des Formes Solides',
      teacher: 'Dr. C. Dumont',
      description: 'Diaporama complet sur la compression directe, granulation humide et sèche, excipients liants/délitants, et essais pharmacotechniques (délitement, dissolution, friabilité).',
      tags: ['Galénique', 'Comprimés', 'Granulation', 'Excipients', 'Pharmacopée'],
      fileName: 'sample_formes_solides.pptx',
      fileSize: 6840000,
      createdAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
      views: 31,
      isFavorite: false,
      notes: 'Schémas des poinçons et matrice de presse rotative. Savoir différencier les enrobages gastro-résistants et à libération prolongée (LP).'
    },
    {
      id: 'pharm-003',
      title: 'Mécanismes d\'Action des Antibiotiques & Antibiogramme',
      subject: 'Bactériologie & Thérapeutique',
      year: '4ème Année',
      semester: 'Semestre 7',
      type: 'video',
      chapter: 'Module Infectiologie & Antibiothérapie',
      teacher: 'Pr. E. Leroy',
      description: 'Cours vidéo masterclass : Cibles bactériennes (paroi, ribosomes, ADN gyrase), mécanismes de résistance aux bêtalactamines (carbapénèmases, BLSE) et lecture interprétative de l\'antibiogramme.',
      tags: ['Antibiotiques', 'Bétalactamines', 'Résistance', 'Antibiogramme', 'Infectiologie'],
      videoUrl: 'https://www.youtube.com/watch?v=0bA-3kLpQ8Q',
      embedUrl: 'https://www.youtube.com/embed/0bA-3kLpQ8Q',
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      views: 89,
      isFavorite: true,
      notes: 'Points cruciaux : Pénicillines inhibent les PLP (transpeptidases). Aminosides sur sous-unité 30S (néphro/ototoxicité). Macrolides sur 50S.'
    },
    {
      id: 'pharm-004',
      title: 'Chimie Thérapeutique des AINS & Corticoïdes',
      subject: 'Chimie Thérapeutique',
      year: '4ème Année',
      semester: 'Semestre 8',
      type: 'pdf',
      chapter: 'Chapitre 4 - Anti-inflammatoires & Stéroïdes',
      teacher: 'Pr. S. Martin',
      description: 'Relations structure-activité (RSA) des dérivés de l\'acide salicylique, dérivés indoliques, profènes et coxibs sélectifs. Métabolisme et synthèse chimique des glucocorticoïdes.',
      tags: ['AINS', 'ChimieMédicinale', 'COX-1', 'COX-2', 'RSA'],
      fileName: 'sample_chimie_ains.pdf',
      fileSize: 3120000,
      createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
      views: 57,
      isFavorite: true,
      notes: 'La pharmacophore anti-COX : groupement acide carboxylique interacteur avec Arg120. Poche hydrophobe spécifique de COX-2 exploitée par le célécoxib.'
    },
    {
      id: 'pharm-005',
      title: 'Botanique & Pharmacognosie : Alcaloïdes et Tanins Végétaux',
      subject: 'Pharmacognosie',
      year: '2ème Année',
      semester: 'Semestre 4',
      type: 'powerpoint',
      chapter: 'Plantes Médicinales & Molécules Actives d\'Origine Végétale',
      teacher: 'Dr. M. Riviere',
      description: 'Diapositives richement illustrées sur les drogues à alcaloïdes (Opium, Quinquina, Belladone, If de Bourgogne / Taxotère). Voies de biosynthèse et extraction hydroalcoolique.',
      tags: ['Plantes', 'Alcaloïdes', 'Pavot', 'Taxol', 'BotaniquePharmaceutique'],
      fileName: 'sample_pharmacognosie_plantes.pptx',
      fileSize: 11450000,
      createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
      views: 24,
      isFavorite: false,
      notes: 'Reconnaissance macroscopique des drogues et réactions de caractérisation (réactif de Mayer, Dragendorff, Bouchardat).'
    },
    {
      id: 'pharm-006',
      title: 'Toxicologie Médicale : Prise en Charge des Intoxications Aiguës & Antidotes',
      subject: 'Toxicologie',
      year: '5ème Année',
      semester: 'Semestre 9',
      type: 'video',
      chapter: 'Module Urgences Médicales & Toxicologie Clinique',
      teacher: 'Pr. V. Moreau',
      description: 'Conférence interactive : Syndromes toxiques (anticholinergique, opioïde, sérotoninergique), intoxications au paracétamol (N-acétylcystéine), bêtabloquants (Glucagon) et monoxyde de carbone.',
      tags: ['Toxicologie', 'Antidotes', 'Paracétamol', 'Toxidromes', 'Internat'],
      videoUrl: 'https://www.youtube.com/watch?v=F_fP_H9J0yA',
      embedUrl: 'https://www.youtube.com/embed/F_fP_H9J0yA',
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      views: 112,
      isFavorite: true,
      notes: 'Protocole Rumack-Matthew pour le paracétamol. NAC efficace idéalement dans les 8 premières heures. Naloxone titrée en urgence.'
    }
  ];
}

// Generate minimal demo PDF files on startup so demo courses can be opened/tested
function createSampleCourseFiles() {
  const samplePdfPath = path.join(COURSES_DIR, 'sample_pharmacocinetique.pdf');
  const samplePdfPath2 = path.join(COURSES_DIR, 'sample_chimie_ains.pdf');
  const samplePptxPath = path.join(COURSES_DIR, 'sample_formes_solides.pptx');
  const samplePptxPath2 = path.join(COURSES_DIR, 'sample_pharmacognosie_plantes.pptx');

  const pdfContent = `%PDF-1.4
1 0 obj
<< /Title (Cours de Pharmacologie - Pharmacocinetique Clinique)
   /Author (Faculte de Pharmacie)
   /Type /Catalog
   /Pages 2 0 R
>>
endobj
2 0 obj
<< /Type /Pages
   /Kids [3 0 R]
   /Count 1
>>
endobj
3 0 obj
<< /Type /Page
   /Parent 2 0 R
   /MediaBox [0 0 612 792]
   /Contents 4 0 R
   /Resources << /Font << /F1 5 0 R >> >>
>>
endobj
4 0 obj
<< /Length 215 >>
stream
BT
/F1 22 Tf
50 720 Td
(PHARMACOLOGIE CLINIQUE & BIODISPONIBILITE) Tj
/F1 14 Tf
50 670 Td
(Faculte des Sciences Pharmaceutiques - Annee Universitaire) Tj
50 640 Td
(1. Cinetique d'absorption et passage transmembranaire) Tj
50 610 Td
(2. Volume de distribution (Vd = Dose / C0)) Tj
50 580 Td
(3. Clairance renale et hepatique (Cytochromes P450)) Tj
50 550 Td
(4. Demi-vie d'elimination (t1/2 = 0.693 * Vd / Cl)) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font
   /Subtype /Type1
   /BaseFont /Helvetica-Bold
>>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000120 00000 n 
0000000177 00000 n 
0000000301 00000 n 
0000000570 00000 n 
trailer
<< /Size 6
   /Root 1 0 R
>>
startxref
647
%%EOF`;

  if (!fs.existsSync(samplePdfPath)) {
    fs.writeFileSync(samplePdfPath, pdfContent);
  }
  if (!fs.existsSync(samplePdfPath2)) {
    fs.writeFileSync(samplePdfPath2, pdfContent);
  }
  if (!fs.existsSync(samplePptxPath)) {
    fs.writeFileSync(samplePptxPath, 'Presentation PowerPoint - Pharmacie Galenique (Support de Cours & Diapositives)');
  }
  if (!fs.existsSync(samplePptxPath2)) {
    fs.writeFileSync(samplePptxPath2, 'Presentation PowerPoint - Botanique et Plantes Medicinales');
  }
}

createSampleCourseFiles();

// Standard pharmacy subjects
const DEFAULT_SUBJECTS = [
  { id: 'pharmacologie', name: 'Pharmacologie', icon: 'Pill', color: '#10b981' },
  { id: 'galenique', name: 'Pharmacie Galénique', icon: 'FlaskConical', color: '#06b6d4' },
  { id: 'chimie_therapeutique', name: 'Chimie Thérapeutique', icon: 'Atom', color: '#8b5cf6' },
  { id: 'bacteriologie', name: 'Bactériologie & Virologie', icon: 'Bug', color: '#ec4899' },
  { id: 'pharmacognosie', name: 'Pharmacognosie & Botanique', icon: 'Leaf', color: '#84cc16' },
  { id: 'toxicologie', name: 'Toxicologie', icon: 'AlertTriangle', color: '#f59e0b' },
  { id: 'biochimie', name: 'Biochimie Médicale', icon: 'Activity', color: '#3b82f6' },
  { id: 'semiologie', name: 'Sémiologie & Pathologie', icon: 'Stethoscope', color: '#ef4444' },
  { id: 'legislation', name: 'Législation & Déontologie', icon: 'Scale', color: '#64748b' },
  { id: 'autres', name: 'Autres / Transversal', icon: 'Folder', color: '#14b8a6' }
];

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Get stats
app.get('/api/stats', (req, res) => {
  const courses = getCourses();
  const pdfCount = courses.filter((c) => c.type === 'pdf').length;
  const pptCount = courses.filter((c) => c.type === 'powerpoint').length;
  const videoCount = courses.filter((c) => c.type === 'video').length;
  const totalViews = courses.reduce((acc, c) => acc + (c.views || 0), 0);
  const favoriteCount = courses.filter((c) => c.isFavorite).length;

  let totalBytes = 0;
  courses.forEach((c) => {
    if (c.fileSize) totalBytes += c.fileSize;
  });

  const subjectsCount = {};
  courses.forEach((c) => {
    subjectsCount[c.subject] = (subjectsCount[c.subject] || 0) + 1;
  });

  const yearsCount = {};
  courses.forEach((c) => {
    yearsCount[c.year] = (yearsCount[c.year] || 0) + 1;
  });

  res.json({
    totalCourses: courses.length,
    pdfCount,
    pptCount,
    videoCount,
    totalViews,
    favoriteCount,
    totalStorageMb: (totalBytes / (1024 * 1024)).toFixed(1),
    subjectsCount,
    yearsCount
  });
});

// 2. Get subjects list
app.get('/api/subjects', (req, res) => {
  const courses = getCourses();
  const existingNames = new Set(DEFAULT_SUBJECTS.map((s) => s.name.toLowerCase()));
  const extraSubjects = [];

  courses.forEach((c) => {
    if (c.subject && !existingNames.has(c.subject.toLowerCase())) {
      extraSubjects.push({
        id: c.subject.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        name: c.subject,
        icon: 'Folder',
        color: '#6366f1'
      });
      existingNames.add(c.subject.toLowerCase());
    }
  });

  res.json([...DEFAULT_SUBJECTS, ...extraSubjects]);
});

// 3. Get all courses with query filters
app.get('/api/courses', (req, res) => {
  let courses = getCourses();
  const { search, format, year, subject, semester, favorite, sort } = req.query;

  if (search) {
    const q = search.toLowerCase().trim();
    courses = courses.filter((c) => {
      const titleMatch = (c.title || '').toLowerCase().includes(q);
      const descMatch = (c.description || '').toLowerCase().includes(q);
      const subjectMatch = (c.subject || '').toLowerCase().includes(q);
      const teacherMatch = (c.teacher || '').toLowerCase().includes(q);
      const chapterMatch = (c.chapter || '').toLowerCase().includes(q);
      const tagsMatch = Array.isArray(c.tags) && c.tags.some((t) => t.toLowerCase().includes(q));
      return titleMatch || descMatch || subjectMatch || teacherMatch || chapterMatch || tagsMatch;
    });
  }

  if (format && format !== 'all') {
    courses = courses.filter((c) => c.type === format);
  }

  if (year && year !== 'all') {
    courses = courses.filter((c) => c.year === year);
  }

  if (subject && subject !== 'all') {
    courses = courses.filter((c) => c.subject.toLowerCase() === subject.toLowerCase());
  }

  if (semester && semester !== 'all') {
    courses = courses.filter((c) => c.semester === semester);
  }

  if (favorite === 'true') {
    courses = courses.filter((c) => c.isFavorite);
  }

  // Sorting
  courses.sort((a, b) => {
    if (sort === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sort === 'title_asc') {
      return (a.title || '').localeCompare(b.title || '');
    }
    if (sort === 'views') {
      return (b.views || 0) - (a.views || 0);
    }
    // Default newest
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  res.json(courses);
});

// 4. Get single course by ID & increment view count
app.get('/api/courses/:id', (req, res) => {
  const courses = getCourses();
  const course = courses.find((c) => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Cours non trouvé' });
  }

  course.views = (course.views || 0) + 1;
  saveCourses(courses);

  res.json(course);
});

// 5. Create new course (Upload file or link video)
app.post('/api/courses', upload.single('file'), (req, res) => {
  try {
    const {
      title,
      subject,
      year,
      semester,
      type,
      chapter,
      teacher,
      description,
      tags,
      videoUrl,
      notes
    } = req.body;

    if (!title || !subject || !type) {
      return res.status(400).json({ error: 'Le titre, la matière et le type sont requis.' });
    }

    let parsedTags = [];
    if (typeof tags === 'string') {
      parsedTags = tags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }

    let embedUrl = '';
    if (type === 'video' && videoUrl) {
      // Support YouTube embed conversion
      const ytMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (ytMatch) {
        embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
      } else {
        embedUrl = videoUrl;
      }
    }

    const newCourse = {
      id: 'pharm-' + Date.now(),
      title,
      subject,
      year: year || '3ème Année',
      semester: semester || 'Semestre 5',
      type, // 'pdf', 'powerpoint', 'video'
      chapter: chapter || '',
      teacher: teacher || '',
      description: description || '',
      tags: parsedTags,
      videoUrl: videoUrl || '',
      embedUrl,
      fileName: req.file ? req.file.filename : null,
      originalName: req.file ? req.file.originalname : null,
      fileSize: req.file ? req.file.size : 0,
      mimeType: req.file ? req.file.mimetype : null,
      notes: notes || '',
      views: 0,
      isFavorite: false,
      createdAt: new Date().toISOString()
    };

    const courses = getCourses();
    courses.unshift(newCourse);
    saveCourses(courses);

    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Erreur création cours:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'ajout du cours' });
  }
});

// 6. Update course metadata
app.put('/api/courses/:id', (req, res) => {
  const courses = getCourses();
  const index = courses.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Cours non trouvé' });
  }

  const {
    title,
    subject,
    year,
    semester,
    chapter,
    teacher,
    description,
    tags,
    videoUrl,
    notes
  } = req.body;

  let parsedTags = courses[index].tags;
  if (tags !== undefined) {
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }
  }

  let embedUrl = courses[index].embedUrl;
  if (videoUrl !== undefined && courses[index].type === 'video') {
    const ytMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    } else {
      embedUrl = videoUrl;
    }
  }

  courses[index] = {
    ...courses[index],
    title: title !== undefined ? title : courses[index].title,
    subject: subject !== undefined ? subject : courses[index].subject,
    year: year !== undefined ? year : courses[index].year,
    semester: semester !== undefined ? semester : courses[index].semester,
    chapter: chapter !== undefined ? chapter : courses[index].chapter,
    teacher: teacher !== undefined ? teacher : courses[index].teacher,
    description: description !== undefined ? description : courses[index].description,
    tags: parsedTags,
    videoUrl: videoUrl !== undefined ? videoUrl : courses[index].videoUrl,
    embedUrl,
    notes: notes !== undefined ? notes : courses[index].notes,
    updatedAt: new Date().toISOString()
  };

  saveCourses(courses);
  res.json(courses[index]);
});

// 7. Toggle favorite
app.post('/api/courses/:id/favorite', (req, res) => {
  const courses = getCourses();
  const course = courses.find((c) => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Cours non trouvé' });
  }

  course.isFavorite = !course.isFavorite;
  saveCourses(courses);
  res.json({ id: course.id, isFavorite: course.isFavorite });
});

// 8. Delete course
app.delete('/api/courses/:id', (req, res) => {
  const courses = getCourses();
  const index = courses.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Cours non trouvé' });
  }

  const [removed] = courses.splice(index, 1);
  saveCourses(courses);

  // Clean file if stored locally
  if (removed.fileName) {
    const filePath = path.join(COURSES_DIR, removed.fileName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Erreur suppression fichier:', err);
      }
    }
  }

  res.json({ message: 'Cours supprimé avec succès', id: req.params.id });
});

// 9. Stream / Serve uploaded files with Range header (essential for videos and fast PDF rendering)
app.get('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  // Security check to avoid path traversal
  const safeFilename = path.basename(filename);
  const filePath = path.join(COURSES_DIR, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Fichier introuvable');
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const ext = path.extname(safeFilename).toLowerCase();

  let contentType = 'application/octet-stream';
  if (ext === '.pdf') contentType = 'application/pdf';
  else if (ext === '.pptx') contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  else if (ext === '.ppt') contentType = 'application/vnd.ms-powerpoint';
  else if (ext === '.mp4') contentType = 'video/mp4';
  else if (ext === '.webm') contentType = 'video/webm';
  else if (ext === '.mkv') contentType = 'video/x-matroska';
  else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.png') contentType = 'image/png';

  // Support video range requests for seeking
  const range = req.headers.range;
  if (range && contentType.startsWith('video/')) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': contentType,
      'Content-Disposition': ext === '.pdf' || contentType.startsWith('video/')
        ? 'inline'
        : `attachment; filename="${safeFilename}"`,
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

app.listen(PORT, () => {
  console.log(`Backend Pharmacie démarré sur http://localhost:${PORT}`);
});
