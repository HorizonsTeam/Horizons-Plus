# Frontend Refactoring & Performance — Design

**Date:** 2026-04-20
**Branch:** `funaki/review-frontend`
**Scope:** Refactor ciblé du frontend React/Vite pour améliorer la performance d'affichage et ajouter 3 liens de navigation ancres depuis le Header vers les sections de la HomePage.

## Objectifs

1. Réduire la taille du bundle initial pour accélérer le premier affichage.
2. Brancher les liens "Destinations", "Promotions", "Évènements" du Header sur les sections correspondantes de la HomePage via des ancres.
3. Éliminer des duplications et appels réseau redondants dans le Header.
4. Optimiser le chargement des images de la HomePage.

## Contraintes

- **Ne pas modifier les vues existantes.** Aucun changement visuel n'est attendu hors navigation d'ancre.
- **Ne pas ajouter de nouvelles pages ni remplacer les composants de présentation.**
- Pas d'ajout de dépendance.
- Pas d'ajout de tests (le projet n'en a pas).

---

## Section 1 — Lazy-loading des routes

**Fichier:** `frontend/src/App.tsx`

**Changement:**
- Convertir tous les imports de pages en `React.lazy` **sauf** `HomePage` et `MainLayout` (qui restent eager — l'une parce qu'elle est la landing, l'autre pour éviter un flash du Header).
- Wrapper le contenu de `<Routes>` dans un `<Suspense>` avec un fallback utilisant `react-spinners` (déjà en dépendance).

**Pages concernées:** `Login`, `Singin`, `MdpOublie`, `ResetPassword`, `TwoFactor`, `Panier`, `Resultats`, `Recap`, `PaymentPage`, `Infos_Passagers`, `Settings`, `UserInfoPageMobile`, `AccountSettings`, `ReservationsPages`.

**Effet attendu:** les chunks lourds (MUI, Stripe, pdf-lib, Leaflet, react-calendar) sortent du bundle initial et se chargent à la demande au clic.

---

## Section 2 — Ancres de navigation

**Fichiers:** `frontend/src/components/layouts/Header.tsx`, `frontend/src/features/home/HomePage.tsx`.

**Dans `Header.tsx`** (tableaux `menuItemsPublic`, `menuItemsPrivate`, `menuItemsPrivateDesktop`):
- `Destinations` → `path: "/#destinations"`
- `Promotions` → `path: "/#promotions"`
- `Évènements` → `path: "/#evenements"`

**Dans `HomePage.tsx`** — ajouter un `id` et `scroll-mt-20` sur chaque section cible:
- Section "Prêt(e) à découvrir ?" (ligne 254 actuelle) → `id="destinations"`
- Section wrappant `<PromotionSlider />` (ligne 333) → `id="promotions"`
- Section "Réservez votre prochain évènement" (ligne 344) → `id="evenements"`

**Gestion du scroll:** dans `HomePage`, un `useEffect` avec `useLocation().hash` en dépendance. À chaque changement de hash (y compris au mount), si le hash est non vide, `document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })`. Ça couvre aussi le cas où l'utilisateur est déjà sur `/` et reclique sur un lien du Header (react-router met à jour `location.hash` sans remount).

Le Header étant sticky (`position: sticky, top-0`), `scroll-mt-20` (Tailwind → `scroll-margin-top: 5rem`) assure que la section n'est pas masquée.

---

## Section 3 — Refactor du Header et session utilisateur

**Fichier:** `frontend/src/components/layouts/Header.tsx`, nouveau fichier `frontend/src/lib/user-context.tsx`.

**Déduplication des menus** — remplacer les 4 tableaux actuels (lignes 68-93) par 2 constantes déclarées **hors composant** (pour éviter la recréation à chaque render):

```
PUBLIC_NAV    = [Destinations, Promotions, Évènements]  // avec ancres
PROFILE_NAV   = [Mes réservations, Mes cartes de réduction, Paramètres]
```

Rendu:
- Desktop non connecté → `PUBLIC_NAV`
- Desktop connecté → `PUBLIC_NAV` + dropdown `PROFILE_NAV`
- Mobile non connecté → `PUBLIC_NAV`
- Mobile connecté → `PROFILE_NAV` + `PUBLIC_NAV` concaténés (préserve l'ordre actuel côté mobile)

**Session utilisateur — `user-context.tsx`:**
- `UserProvider` monté dans `MainLayout`, fait le fetch `/api/me` une fois.
- Expose `{ user, loading, refresh, signOut }` via `useUser()`.
- Le `Header` consomme ce contexte au lieu de refetch à chaque remount.

**Effet:** 1 fetch `/api/me` par session au lieu d'un à chaque mount du Header, menus non recréés à chaque render, même comportement visuel.

---

## Section 4 — Images et nettoyage

**Fichiers:** `frontend/src/features/home/HomePage.tsx`, `frontend/src/features/home/components/PromotionSlider.tsx`.

**Images Unsplash:**
- Ajouter `loading="lazy"` et `decoding="async"` sur toutes les `<img>` Unsplash qui ne les ont pas encore (HomePage lignes 273, 293, 313, 360, 374 ; PromotionSlider ligne 81).
- Ajouter attributs HTML `width` et `height` sur chaque image pour éviter le layout shift (valeurs matchant les tailles Unsplash déjà en query string).

**Nettoyage:**
- `PromotionSlider.tsx` lignes 122-163: supprimer le bloc `<style>{...}</style>` qui cible `.swiper-button-next/prev/pagination/scrollbar`, éléments non rendus car aucun module navigation/pagination/scrollbar n'est activé sur ce Swiper.

**Non touché:** animations Framer Motion, structure des sections, couleurs, layout, cartes destination Paris/Tokyo sans `<Link>` (inchangées faute de route `/Ville` fonctionnelle).

---

## Flagging (ne pas implémenter)

- `package.json` **racine** contient des dépendances orphelines (`@mui/material`, `@emotion/*`, `pdf-lib`, `qrcode`, `path`). Si ce fichier n'est pas utilisé (tout vit dans `frontend/package.json`), il peut être supprimé — à confirmer avec l'utilisateur avant toute suppression.

---

## Ce qui n'est pas dans le scope

- Réécriture des features Settings, Reservations, Products.
- Remplacement de MUI ou autre dépendance.
- Ajout de tests.
- Refactor de composants de présentation sans bénéfice perf clair.
- Modification des routes existantes (la carte destination Rome pointe vers `/Ville` qui n'existe pas — laissé en l'état).

## Plan de vérification

- `npm run build` passe sans erreur.
- `npm run lint` passe.
- Bundle initial plus léger (vérifiable via rapport Vite `rollup-plugin-visualizer` si souhaité, sinon comparaison tailles `dist/assets`).
- Navigation manuelle: clic sur chaque lien ancre depuis le Header → scroll fluide vers la bonne section, depuis `/` comme depuis une autre route.
- Session: connexion → un seul appel à `/api/me` visible dans l'onglet réseau.
