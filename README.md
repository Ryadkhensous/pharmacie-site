# 💊 PharmaVault • Plateforme Numérique pour Étudiant en Pharmacie

Une plateforme moderne, réactive et complète conçue sur mesure pour les étudiants en pharmacie, leur permettant de stocker, classer, visionner et réviser l'ensemble de leurs supports de cours :
- 📄 **Documents PDF** (Polycopiés, fiches synthétiques, annales d'examens)
- 📊 **Présentations PowerPoint** (Diaporamas PPT / PPTX des enseignants d'amphi)
- 🎥 **Vidéos Cliniques & Cours** (Fichiers vidéo téléversés ou intégrations YouTube/Drive avec streaming et contrôle de la vitesse 1x à 2x)
- 📝 **Fiches Mémos & Notes de Révision** (Formules de clairance, interactions médicamenteuses, cibles pharmacologiques, pièges de QCM)

---

## 🚀 Architecture Technique

- **Frontend** : **React (Vite)** + Vanilla CSS moderne (Glassmorphism, animations fluides, mode sombre/clair, design système médicalisé)
- **Backend** : **Node.js + Express**
  - Téléversement de fichiers multi-formats via **Multer**
  - Streaming vidéo avec gestion des en-têtes HTTP `Range` (support du saut temporel et seeking instantané)
  - Base de données persistante (`server/data/courses.json`) pré-chargée avec des cours types de pharmacie
  - API RESTful complète (Consultation, Ajout, Modification, Suppression, Favoris, Statistiques)

---

## 📦 Démarrage Rapide

### 1. Démarrer Frontend + Backend en une seule commande :
Depuis la racine du projet :
```bash
npm run dev
```
- Le serveur Backend Express sera accessible sur : `http://localhost:5000`
- L'interface React sera accessible sur : `http://localhost:5173`

---

## ✨ Fonctionnalités Clés

1. **Bibliothèque de Cours Interactive** :
   - Recherche en direct par titre, matière, enseignant, ou tags (#Cardio, #Antibio, #Formules).
   - Filtres par format (Tous, PDF, PowerPoint, Vidéos).
   - Filtres par année universitaire (1ère Année PASS/LAS jusqu'à la 6ème Année).
   - Filtres par semestre (S1 à S12).
   - Badges de matières avec code couleur (Pharmacologie, Galénique, Chimie Thérapeutique, Toxicologie, Pharmacognosie...).

2. **Lecteurs & Visionneuses Dédiés** :
   - **Lecteur PDF Intégré** : Mode plein écran, zoom, impression, téléchargement et panneau latéral des mémos de cours.
   - **Lecteur Vidéo Avancé** : Vitesse de lecture accélérée (1x, 1.25x, 1.5x, 1.75x, 2x) pour réviser plus rapidement, affichage des repères clés.
   - **Module PowerPoint** : Téléchargement rapide, compatibilité Office Online, résumé des diapositives.

3. **Espace Ajout & Gestion Dédié** :
   - Formulaire intuitif avec glisser-déposer (Drag & Drop) de fichiers PDF, PPT, PPTX ou MP4/WebM.
   - Support d'ajout de liens vidéo (YouTube, Google Drive, URL directe).
   - Aperçu visuel en direct de la carte pendant la saisie.
   - Tableau de gestion complet pour modifier les métadonnées, voir la taille des fichiers ou supprimer.

4. **Tableau de Bord & Statistiques** :
   - Suivi du nombre de cours par format et espace disque utilisé.
   - Graphiques de répartition par matière et par année d'études.
   - Classement des cours les plus consultés.

5. **Bilingue Français (Par Défaut) & Anglais** :
   - Langue principale par défaut en **Français** (`FR`).
   - Bouton de bascule dans la barre de navigation (`FR / EN`) pour traduire l'intégralité de l'interface en anglais en 1 clic.
   - Mémorisation du choix de langue de l'étudiant dans le navigateur.

