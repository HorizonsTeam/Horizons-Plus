# Backend Horizons+

API Node.js + Express pour Horizons+ :
- Authentification utilisateurs (inscription, connexion, session) avec **Better Auth**
- Accès MySQL via **Prisma**
- CORS sécurisé pour le front **Vite/React** (localhost:5173)

---

## 1 Prérequis

- Node.js ≥ 18
- MySQL en local (Workbench ok)
- npm

---

## 2 Installation

```bash
cd backend
npm install

Configuration

3. Configuration de l'environnement (.env)
Un fichier .env.example est fourni comme modèle.
Copier le fichier d'exemple
bashcp .env.example .env
Configurer la base de données
Ouvrez le fichier .env et configurez DATABASE_URL selon votre installation MySQL :

Option A - Utilisateur root (simple, pour développement uniquement) :
envDATABASE_URL="mysql://root:@localhost:3306/horizons_auth"

Option B - Utilisateur dédié (recommandé) :

Créez la base et l'utilisateur MySQL :

sqlCREATE DATABASE IF NOT EXISTS horizons_auth DEFAULT CHARACTER SET utf8mb4;

CREATE USER IF NOT EXISTS 'horizons'@'localhost' IDENTIFIED BY 'motdepassefort';
GRANT ALL PRIVILEGES ON horizons_auth.* TO 'horizons'@'localhost';
FLUSH PRIVILEGES;

Configurez dans .env :

envDATABASE_URL="mysql://horizons:motdepassefort@localhost:3306/horizons_auth"
Variables d'environnement par défaut (développement)
Le reste des variables peut rester inchangé pour le développement :
envPORT=3005
BETTER_AUTH_SECRET="dev-secret-change-me"  aller dans ce site là https://www.better-auth.com/docs/installation et chercher le générateur de code sécret
BETTER_AUTH_URL="http://localhost:3005"
FRONT_ORIGIN="http://localhost:5173"

⚠️ Important : En production, modifiez BETTER_AUTH_SECRET avec une valeur aléatoire sécurisée.

Initialisation de la base de données

4. Préparer la base AUTH avec Prisma
Première utilisation obligatoire :
bashnpx prisma migrate dev
Cette commande :

Lit le schéma défini dans prisma/schema.prisma
Crée automatiquement les tables : user, session, account, verification

Optionnel - Visualiser les données avec Prisma Studio :
bashnpx prisma studio
Démarrage des serveurs
5. Lancer le backend
bashnpm run dev
```

✅ Message attendu :
```
API ready → http://localhost:3005
Endpoints disponibles :

GET http://localhost:3005/api/health → {"ok":true} (vérification santé)
GET http://localhost:3005/api/me → informations utilisateur connecté (401 si non connecté)

6. Lancer le frontend
Dans un nouveau terminal :
bashcd frontend
npm run dev
Le frontend est accessible sur : http://localhost:5173
Tester l'authentification

7.1 Inscription (Interface utilisateur)

Ouvrez http://localhost:5173/signin
Remplissez :

Prénom
Email
Mot de passe (minimum 8 caractères)


Cliquez sur "Créer un compte"

Résultat attendu :

Aucune erreur affichée
Cookie de session httpOnly automatiquement créé
Vérification possible via http://localhost:3005/api/me → affiche vos données JSON

7.2 Connexion (Interface utilisateur)

Ouvrez http://localhost:5173/login
Entrez l'email et le mot de passe créés précédemment
Après connexion réussie :

Votre prénom apparaît dans le menu burger
Bouton "Se déconnecter" disponible


💡 **Astuce :** L'utilisation du navigateur est plus pratique car les cookies sont gérés automatiquement.

### 7.4 Déconnexion (Interface utilisateur)

1. Ouvrez le menu burger
2. Cliquez sur **"Se déconnecter"**

**Vérification :** L'accès à `http://localhost:3005/api/me` doit retourner une erreur 401 (non autorisé).

## Problèmes fréquents

| Problème | Solution |
|----------|----------|
| Erreur de connexion MySQL | Vérifiez que MySQL est démarré et que les identifiants dans `.env` sont corrects |
| Port 3005 ou 5173 déjà utilisé | Modifiez `PORT` dans `.env` (backend) ou `vite.config.js` (frontend) |
| Tables non créées | Exécutez `npx prisma migrate dev` |

## Structure du projet
```
.
├── backend/
│   ├── prisma/
│   │   └── schema.prisma    # Schéma de base de données
│   ├── src/                 # Code source backend
│   └── .env                 # Configuration (à créer)
├── frontend/
│   ├── src/                 # Code source frontend
│   └── package.json
└── README.md