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

## SOMMAIRE 
- Installation - ligne 23
- Changement de branche et problèmes courants - ligne 146
- Mot de passe oublié - ligne 

## 2 Installation

```bash
cd backend
npm install

Configuration

3. Configuration de l'environnement (.env)
Un fichier .env.example est fourni comme modèle.
Copier le fichier d'exemple
bash cp .env.example .env

Configurer la base de données
Ouvrez le fichier .env et configurez DATABASE_URL selon votre installation MySQL :

Option A - Utilisateur root (simple, pour développement uniquement) :
envDATABASE_URL="mysql://root:@localhost:3306/horizons_auth"

Configurez dans .env :

envDATABASE_URL="mysql://horizons:motdepassefort@localhost:3306/horizons_auth"

Variables d'environnement par défaut (développement)
Le reste des variables peut rester inchangé pour le développement :
envPORT=3005
BETTER_AUTH_SECRET="dev-secret-change-me"  aller dans ce site là https://www.better-auth.com/docs/installation et chercher le générateur de code sécret
BETTER_AUTH_URL="http://localhost:3005"
FRONT_ORIGIN="http://localhost:5173"

IMPORTANT : En production, modifiez BETTER_AUTH_SECRET avec une valeur aléatoire sécurisée.

Il faut aussi remplir NAVITIA_API_KEY avec une clé générée avec ce lien : https://numerique.sncf.com/startup/api/
Sinon, si vous avez accès à notre clé, veuillez la renseigner dans NAVITIA_API_KEY.

Initialisation de la base de données

4. Préparer la base AUTH avec Prisma
Première utilisation OBLIGATOIRE :
npx prisma migrate dev
Cette commande :

Lit le schéma défini dans prisma/schema.prisma
Crée automatiquement les tables : user, session, account, verification

Si vous voulez visualiser les données avec Prisma Studio :
npx prisma studio

Démarrage des serveurs
5. Lancer le backend
npm run dev
```

✅ Message attendu :
```
API ready → http://localhost:3005
Endpoints disponibles :

GET http://localhost:3005/api/health → {"ok":true} (vérification santé)
GET http://localhost:3005/api/me → informations utilisateur connecté (401 si non connecté)

6. Lancer le frontend
Dans un nouveau terminal :
cd frontend
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

## 3 Changement de branche et problèmes courants

- Erreur possible : TypeScript non reconnu
Lors du premier lancement avec la commande :

                npm run dev

il est possible d’obtenir l’erreur suivante :

text
'tsc' n’est pas reconnu en tant que commande interne ou externe,
un programme exécutable ou un fichier de commandes.

Solution
Installez TypeScript manuellement dans le projet :

            npm install typescript

Puis exécutez la compilation TypeScript :

                    npx tsc

- À faire lors d’un changement de branche

Quand vous basculez sur une autre branche (par exemple avec Git), relancez toujours l’installation des dépendances pour éviter les problèmes de versions :

                    npm install

Puis redémarrez le serveur :

                    npm run dev

Cela garantit que toutes les dépendances correspondantes à la nouvelle branche sont bien installées.


## 4 Mot de passe oublié : 

- 1. Créer un compte Mailtrap (GRATUIT)

Allez sur mailtrap.io
Créez un compte gratuit
Confirmez votre email

- 2. Récupérer vos identifiants SMTP

Connectez-vous à Mailtrap
Allez dans "Email Testing" > "My Sandbox"
Cliquez sur l'onglet "SMTP Settings"
Notez vos identifiants :

Host : sandbox.smtp.mailtrap.io
Port : 587 (ou 2525, 465, 25)
Username : (ex: 8759cf80cc1de2)
Password : cliquez sur les **** pour voir le mot de passe complet

- 3. Configurer le fichier .env

voir fichier env.example et remplacer VOTRE_USERNAME_MAILTRAP et VOTRE_PASSWORD_MAILTRAP par vos vraies valeurs

- Étape 1 : Lancer le Projet

Terminal 1 - Backend : npm run dev
Terminal 2 - Frontend : npm run dev

- Étape 2 : Tester "Mot de passe oublié"

- Étape 3 : Vérifier l'email dans Mailtrap

ALler dans My Sandbox et trouver le dernier mail.
Cliquez dessus pour voir :

Le contenu de l'email
Le lien de réinitialisation

- Étape 4 : Réinitialiser le mot de passe

Après avoir cliquez saissisez votre nouveau mot de passe et encore une fois pour la confirmation.

- Étape 5 : Se connecter avec le nouveau mot de passe

Connectez-vous avec votre email et le nouveau mot de passe
