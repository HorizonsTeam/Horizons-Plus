#  Horizons+ – Réservation de billets train & avion

> Une Single Page Application pour simplifier la recherche et la réservation de billets de train et d'avion.

## 📌 À propos

**Horizons+** est une application web moderne conçue pour centraliser la recherche et la réservation de trajets en train et en avion. L'application vise à réduire la fragmentation actuelle des services de réservation en proposant une interface épurée, mobile-first et centrée sur l'essentiel : recherche rapide, comparaison claire des options et parcours de réservation court et rassurant.

Le projet a été développé dans le cadre de la **SAE S3.01** (Développement d'une application) par une équipe de 4 étudiants en informatique.

---

## ✨ Fonctionnalités principales

-  **Recherche de trajets** – Moteur de recherche minimaliste (départ, destination, dates, voyageurs)
-  **Comparaison des résultats** – Affichage clair avec horaires, durée, prix et correspondances
-  **Réservation rapide** – Parcours court et lisible (sélection, saisie passagers, récapitulatif)
-  **Authentification sécurisée** – Connexion, inscription, 2FA et gestion de compte
-  **Panier persistant** – Gestion des billets avant validation (utilisateurs connectés et invités)
-  **Espace utilisateur** – Consultation de l'historique et accès aux billets
-  **Système de paiement** – Intégration Stripe en mode test
-  **Notifications** – Envoi de billets par email après confirmation

---

## 🛠️ Stack technologique

### Frontend
- **React 19** + **TypeScript** – Framework UI avec typage statique
- **React Router** – Routage côté client (SPA)
- **TailwindCSS** – Stylisation responsive
- **Axios** – Requêtes HTTP

### Backend
- **Node.js** + **Express** – Serveur API REST
- **TypeScript** – Typage côté serveur
- **Prisma ORM** – Gestion des données et relations
- **Better Auth** – Authentification et gestion des sessions

### Base de données & Stockage
- **PostgreSQL** (via Neon) – Base de données relationnelle
- **Cloudinary** – Hébergement des images
- **Fichiers CSV** – Enrichissement des données (communes, régions)

### APIs externes intégrées
-  **SNCF API** – Données ferroviaires (gares, villes, trajets)
-  **Amadeus API** – Aéroports internationaux et autocomplétion
-  **Stripe** – Système de paiement (mode test)
-  **Mailtrap / Gmail SMTP** – Gestion des emails
-  **Better Auth** – Authentification et sécurité

---

## 📁 Structure du projet

```
Horizons-plus/
├── frontend/                    # Application React (TypeScript)
│   ├── src/
│   │   ├── components/          # Composants réutilisables
│   │   ├── features/            # Modules fonctionnels (auth, search, etc.)
│   │   ├── assets/              # Images et ressources
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── backend/                     # API Node.js (TypeScript)
    ├── src/
    │   ├── routes/              # Endpoints API
    │   ├── controllers/         # Orchestration des requêtes
    │   ├── services/            # Logique métier
    │   ├── repositories/        # Accès aux données
    │   ├── middlewares/         # Authentification, validation
    │   ├── utils/               # Fonctions utilitaires
    │   └── index.ts
    ├── prisma/
    │   └── schema.prisma        # Schéma de la base de données
    ├── package.json
    └── .env.example
```

---

## 🚀 Installation & Lancement

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn
- PostgreSQL (ou Neon pour la base de données cloud)

### 1. Cloner le repository

```bash
git clone https://github.com/HorizonsTeam/Horizons-Plus.git
cd Horizons-plus
```

### 2. Configuration du Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur `http://localhost:5173`

### 3. Configuration du Backend

```bash
cd ../backend
npm install
```

Créer un fichier `.env` :

```bash
cp .env.example .env
```

Éditer le fichier `.env` avec vos configurations (voir section ci-dessous).

```bash
npm run dev
```

Le backend démarre sur `http://localhost:3005`

### 4. Initialiser la base de données

```bash
# Depuis le dossier backend
npx prisma migrate dev --name init
npx prisma generate
```

---

## 🔑 Variables d'environnement

### Backend (.env)

```env
PORT=3005

# Base de données 
DATABASE_URL="postgresql://neondb_owner:npg_APg7nIufQ0dZ@ep-young-tree-agajp6ft-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    
# Better Auth
BETTER_AUTH_SECRET=1rFTElg16R74vSpsfEVXt8EbFbE2kVj1
BETTER_AUTH_URL=http://localhost:3005

# Vite
FRONT_ORIGIN=http://localhost:5173
FRONT_URL=http://localhost:5173   
AUTH_BASE_URL=http://localhost:3005/api/auth

# SMTP LOCAL (MAILTRAP SANDBOX)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=8759cf80cc1de2
SMTP_PASS=3f2306c6b03739
SMTP_FROM="Horizons+ <no-reply@horizonsplus.com>"

# Clé API NAVITIA
NAVITIA_API_KEY=69d2722e-c5ea-425e-adc3-9d7a89477f9e

# Clés API AMADEUS
AMADEUS_API_KEY=cqDU8kuqsC7A2FEB1XHyqLPP7V5IA0At
AMADEUS_API_SECRET=ixiRQNjFlT338zrh

STRIPE_SECRET_KEY=sk_test_51SX37VLQtrac1MMTN7rOofEagoL5ywCUYdm6L8CPir1plxVpIDgyaYP1caiv3gIfcYozAN3G417J5XPyq33SPT1N00YQFuf9BB
STRIPE_PUBLISHABLE_KEY=pk_test_51SX37VLQtrac1MMTUj6coAspaE7Kzt4hWeH2sdpdUFF7IUEeO10p7YiydBocgRIQVPTe8GACWuLXtTJHJ2lnJfbB00HlwqUoq8

CLOUDINARY_SECRET=BzEPRuzLIHzmkkShT6g0rgsUBvQ
CLOUDINARY_URL=cloudinary://752413822317222:BzEPRuzLIHzmkkShT6g0rgsUBvQ@dty7z8rxt
```

---

## 👥 Équipe

| Nom | Rôle | Contributions clés |
|-----|------|--------------------|
| **Aloïs POURNY** | Fullstack | Backend, DB, moteur de recherche, système d'emails |
| **André TINCO-PUMACAHUA** | Backend Lead | Authentification, paiement, déploiement, documentation |
| **Nassim AZZOUZI** | Frontend Lead | Pages principales, formulaires, filtres, intégration UI |
| **Funaki DA SILVA** | Tech Lead | Coordination Git, CI/CD, gestion de projet |

---

## 🎨 Design

L'application suit une approche **mobile-first** avec un design moderne et épuré.

- ✅ **Wireframes et maquettes** réalisées sur Figma
- ✅ **Responsive design** – Adapté à tous les appareils
- ✅ **Accessibilité** – Contraste amélioré, zones tactiles appropriées
- ✅ **Prototype interactif** – Validation des parcours utilisateur

---


## 📊 Méthodologie

-  **Approche Agile** – Itérations courtes, points de suivi réguliers
-  **Gestion Git** – Branches feature/fix, Pull Requests validées
-  **Outils collaboratifs**
  - Trello – Gestion des tâches
  - Git – Contrôle de version
  - Discord – Communication d'équipe
  - Figma – Design collaboratif

---

## 🚀 Perspectives d'évolution

-  Intégration de réservations d'hôtels
-  Programmes de fidélité et promotions avancées
-  Application mobile native (React Native)
-  Tests unitaires et d'intégration automatisés
-  Optimisations de performance (mise en cache, lazy loading)
-  Expansion géographique

---

## 📚 Documentation & Ressources

-  [Compte rendu du projet](https://univbourgogne-my.sharepoint.com/:w:/g/personal/alois_pourny_etu_ube_fr/IQDRagDeHtKwQ4N-WUJo6UmHASRRmN4c8CcabfHMNGroTdE?rtime=2oRlavNX3kg)
-  [Présentation](https://www.canva.com/design/DAG-eY1b6uY/Jp5a6EomNj-h9isTlX2AJw/edit)
-  [Maquettes Figma](https://www.figma.com/design/tisGqULN0hJfoypHXvlfYE/Untitled?node-id=50-30&p=f&t=xyeiPqKG5YnIgzuq-0)

---

## 📝 Licence

Ce projet est réalisé dans le cadre d'une SAE académique.

---

**Horizons+** – Voyagez simplement.
