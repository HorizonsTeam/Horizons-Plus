# Frontend Refactor & Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lazy-load routes, wire Header links to HomePage sections via anchors, dedupe Header menus + share `/api/me` via a UserContext, and optimize HomePage images — without changing any existing view.

**Architecture:** Route-level code splitting with `React.lazy` + `Suspense`. Anchor navigation via `react-router` hash + `scrollIntoView`. Shared session state via React Context mounted in `MainLayout`. Image optimizations via standard HTML attributes.

**Tech Stack:** React 19, Vite 7, TypeScript, Tailwind 4, react-router-dom 7, framer-motion, swiper, react-spinners.

**No tests exist in this repo.** Verification is done via `npm run build`, `npm run lint`, and manual browser checks. Each task ends with a build + lint + smoke check, then a commit.

---

## File Structure

**New files:**
- `frontend/src/lib/user-context.tsx` — React Context exposing `{ user, loading, refresh, signOut }` and `<UserProvider>`.

**Modified files:**
- `frontend/src/App.tsx` — route lazy-loading + Suspense fallback.
- `frontend/src/components/layouts/MainLayouts.tsx` — wrap children in `<UserProvider>`.
- `frontend/src/components/layouts/Header.tsx` — consume `useUser()`, dedupe menus, update anchor paths.
- `frontend/src/features/home/HomePage.tsx` — add section `id`s + scroll-to-hash effect, add image attrs.
- `frontend/src/features/home/components/PromotionSlider.tsx` — add image attrs, remove dead `<style>` block.

Each file has one responsibility and can be reviewed independently.

---

## Task 1: Lazy-load routes in App.tsx

**Files:**
- Modify: `frontend/src/App.tsx` (full rewrite of file)

- [ ] **Step 1: Rewrite `App.tsx` to use `React.lazy` + `Suspense`**

Replace the entire contents of `frontend/src/App.tsx` with:

```tsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import 'leaflet/dist/leaflet.css'
import './App.css'
import MainLayout from './components/layouts/MainLayouts.tsx'
import HomePage from './features/home/HomePage.tsx'

const Login = lazy(() => import('./features/connexion/Login/login.tsx'))
const Singin = lazy(() => import('./features/connexion/Singin/singin.tsx'))
const MdpOublie = lazy(() => import('./features/connexion/MdpOublie/mdpoublie.tsx'))
const ResetPassword = lazy(() => import('./features/connexion/ResetPassword/resetpassword.tsx'))
const TwoFactor = lazy(() => import('./features/connexion/2AF/TwoFactor.tsx'))
const Panier = lazy(() => import('./features/panier/panier.tsx'))
const Resultats = lazy(() => import('./features/Recherche/Resultats.tsx'))
const Recap = lazy(() => import('./features/Products/Billets/Pages/recap.tsx'))
const PaymentPage = lazy(() => import('./features/Products/Billets/Pages/Payment.tsx'))
const Infos_Passagers = lazy(() => import('./features/Products/Billets/Pages/Infos_Passagers.tsx'))
const Settings = lazy(() => import('./features/Settings/setingsPage.tsx'))
const UserInfoPageMobile = lazy(() => import('./features/Settings/components/UserInformation/UserInfoMobilePage.tsx'))
const AccountSettings = lazy(() => import('./features/Settings/Pages/AccountSettings/AccountSettings.tsx'))
const ReservationsPages = lazy(() => import('./features/reservations-pages/components/reservationsPages.tsx'))

function RouteFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <ClipLoader color="#98EAF3" size={48} />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="login"
            element={<Suspense fallback={<RouteFallback />}><Login /></Suspense>}
          />
          <Route
            path="two-factor"
            element={<Suspense fallback={<RouteFallback />}><TwoFactor /></Suspense>}
          />
          <Route
            path="mdpoublie"
            element={<Suspense fallback={<RouteFallback />}><MdpOublie /></Suspense>}
          />
          <Route
            path="ResetPassword"
            element={<Suspense fallback={<RouteFallback />}><ResetPassword /></Suspense>}
          />
          <Route
            path="singin"
            element={<Suspense fallback={<RouteFallback />}><Singin /></Suspense>}
          />
          <Route
            path="panier"
            element={<Suspense fallback={<RouteFallback />}><Panier /></Suspense>}
          />
          <Route
            path="Recherche"
            element={<Suspense fallback={<RouteFallback />}><Resultats /></Suspense>}
          />
          <Route
            path="Recap"
            element={<Suspense fallback={<RouteFallback />}><Recap /></Suspense>}
          />
          <Route
            path="PaymentPage"
            element={<Suspense fallback={<RouteFallback />}><PaymentPage /></Suspense>}
          />
          <Route
            path="Infos_Passagers"
            element={<Suspense fallback={<RouteFallback />}><Infos_Passagers /></Suspense>}
          />
          <Route
            path="Settings"
            element={<Suspense fallback={<RouteFallback />}><Settings /></Suspense>}
          />
          <Route
            path="UserInfoPageMobile"
            element={<Suspense fallback={<RouteFallback />}><UserInfoPageMobile /></Suspense>}
          />
          <Route
            path="AccountSettings"
            element={<Suspense fallback={<RouteFallback />}><AccountSettings /></Suspense>}
          />
          <Route
            path="reservations"
            element={<Suspense fallback={<RouteFallback />}><ReservationsPages /></Suspense>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

Note: the original `"/two-factor"` route path had a leading slash — absolute paths work under a parent route, but consistency with the other child routes (all relative) is preferable. The path is changed to `"two-factor"` which still resolves to `/two-factor`.

- [ ] **Step 2: Verify build and types**

Run from `frontend/`:

```bash
cd frontend && npm run build
```

Expected: build succeeds. Chunks for lazy routes should appear in `dist/assets/` as separate `.js` files (e.g. `Panier-xxx.js`, `Settings-xxx.js`).

- [ ] **Step 3: Verify lint**

```bash
cd frontend && npm run lint
```

Expected: no new errors introduced. Pre-existing lint warnings are fine.

- [ ] **Step 4: Smoke check in browser**

```bash
cd frontend && npm run dev
```

Open the dev URL. HomePage must render without flash. Click "Se connecter" → `/login` must load (fallback spinner may flash briefly on slow connections — that's expected). Click around to a couple of routes to confirm they work.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/App.tsx
git commit -m "perf(frontend): lazy-load non-home routes with Suspense"
```

---

## Task 2: Add section ids + hash-scroll effect in HomePage

**Files:**
- Modify: `frontend/src/features/home/HomePage.tsx`

- [ ] **Step 1: Add `useEffect` + `useLocation` import and scroll handler**

At the top of `HomePage.tsx`, extend the imports:

```tsx
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
```

(Keep the existing imports — `Link` already comes from `react-router-dom`; just add `useLocation`. Add a new `useEffect` import line if `useEffect` isn't already imported from `'react'`.)

Inside `export default function HomePage()`, before the `return`, add:

```tsx
const location = useLocation();

useEffect(() => {
  if (!location.hash) return;
  const id = location.hash.slice(1);
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}, [location]);
```

- [ ] **Step 2: Add `id` and `scroll-mt-20` to the three target sections**

Find the three `<motion.section>` elements and add `id` + `scroll-mt-20` to their className.

**Destinations section** — currently:

```tsx
<motion.section
  className="px-4 py-12 lg:py-16 bg-dark"
  variants={sectionVariants}
```

Change to:

```tsx
<motion.section
  id="destinations"
  className="px-4 py-12 lg:py-16 bg-dark scroll-mt-20"
  variants={sectionVariants}
```

**Promotions section** — the `<motion.section>` wrapping `<PromotionSlider />`. Currently:

```tsx
<motion.section
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.25 }}
>
  {/* Promotions Section */}
  <PromotionSlider />
</motion.section>
```

Change to:

```tsx
<motion.section
  id="promotions"
  className="scroll-mt-20"
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.25 }}
>
  {/* Promotions Section */}
  <PromotionSlider />
</motion.section>
```

**Events section** — currently:

```tsx
<motion.section
  className="px-4 py-12 lg:py-16 bg-dark"
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.25 }}
>
```

Change to:

```tsx
<motion.section
  id="evenements"
  className="px-4 py-12 lg:py-16 bg-dark scroll-mt-20"
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.25 }}
>
```

- [ ] **Step 3: Verify build**

```bash
cd frontend && npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Smoke check in browser**

From `frontend/`, run `npm run dev`. Manually:
- Open `http://localhost:5173/#destinations` → page scrolls to the "Prêt(e) à découvrir ?" section.
- Same for `/#promotions` and `/#evenements`.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/features/home/HomePage.tsx
git commit -m "feat(home): add section ids and hash-scroll effect"
```

---

## Task 3: Wire Header menu links to anchors

**Files:**
- Modify: `frontend/src/components/layouts/Header.tsx:68-93`

- [ ] **Step 1: Update the 4 menu arrays to use anchor paths**

Locate the four arrays `menuItemsPublic`, `menuItemsPrivate`, `menuItemsPrivateDesktop`, `menuItemsProfileDesktop` (lines 68-93). Change the `path` values for the three nav entries:

- `Destinations` → `"/#destinations"`
- `Promotions` → `"/#promotions"`
- `Évènements` → `"/#evenements"`

The arrays stay in place for now (Task 5 will dedupe them). Only the three `path` fields change in each array where these labels appear.

- [ ] **Step 2: Verify build**

```bash
cd frontend && npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Smoke check**

Run `npm run dev`. From the HomePage:
- Click "Destinations" in the Header → scrolls to destinations section.
- Click "Promotions" → scrolls to promotions section.
- Click "Évènements" → scrolls to events section.
- Repeat from another route (e.g. `/panier`): clicking a Header link should navigate to `/` and then scroll.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/layouts/Header.tsx
git commit -m "feat(header): point nav links to HomePage section anchors"
```

---

## Task 4: Create UserContext

**Files:**
- Create: `frontend/src/lib/user-context.tsx`

- [ ] **Step 1: Write the context module**

Create `frontend/src/lib/user-context.tsx` with:

```tsx
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { authClient } from './auth-clients';

export type User = { name?: string; email: string; image?: string } | null;

type UserContextValue = {
  user: User;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL || '';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/me`, { credentials: 'include' });
      if (res.status === 401) {
        setUser(null);
      } else {
        const data = await res.json();
        setUser(data?.user ?? null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await authClient.signOut();
    setUser(null);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <UserContext.Provider value={{ user, loading, refresh, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used inside <UserProvider>');
  }
  return ctx;
}
```

- [ ] **Step 2: Verify build**

```bash
cd frontend && npm run build
```

Expected: build succeeds. File is not yet imported anywhere — just verify it compiles.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/lib/user-context.tsx
git commit -m "feat(lib): add UserContext for shared session state"
```

---

## Task 5: Mount UserProvider in MainLayout

**Files:**
- Modify: `frontend/src/components/layouts/MainLayouts.tsx`

- [ ] **Step 1: Import and wrap the layout in `<UserProvider>`**

At the top of `MainLayouts.tsx`, add:

```tsx
import { UserProvider } from '../../lib/user-context';
```

Change the `return` block from:

```tsx
return (
  <>
    <Header />
    <main>
      <Outlet context={{ panierItems, setPanierItems }} />
    </main>

    {
      displayBtnPanier &&
      <PanierBtn nombresArticles={panierItems.length} />
    }
    <Footer />
  </>
);
```

To:

```tsx
return (
  <UserProvider>
    <Header />
    <main>
      <Outlet context={{ panierItems, setPanierItems }} />
    </main>

    {
      displayBtnPanier &&
      <PanierBtn nombresArticles={panierItems.length} />
    }
    <Footer />
  </UserProvider>
);
```

- [ ] **Step 2: Verify build**

```bash
cd frontend && npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/layouts/MainLayouts.tsx
git commit -m "feat(layout): mount UserProvider in MainLayout"
```

---

## Task 6: Refactor Header — use context + dedupe menus

**Files:**
- Modify: `frontend/src/components/layouts/Header.tsx` (full rewrite of file)

- [ ] **Step 1: Rewrite Header to consume `useUser()` and share menu constants**

Replace the entire contents of `frontend/src/components/layouts/Header.tsx` with:

```tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Panier_Ico from "../../assets/Panier_Ico.svg";
import Destinations_Ico from "../../assets/Destinations_Ico.svg";
import Promotions_Ico from "../../assets/Promotions_Ico.svg";
import Evenements_Ico from "../../assets/Evenement_Ico.svg";
import Reservation_ico from "../../assets/Resrvation_ico.svg";
import Carte_Reduc_Ico from "../../assets/Carte_Reduc_Ico.svg";
import Parametres_Ico from "../../assets/Parametres_Ico.svg";
import { useUser } from "../../lib/user-context";
import useIsMobile from "./UseIsMobile";

type NavItem = { label: string; icon: string; path: string };

const PUBLIC_NAV: NavItem[] = [
  { label: "Destinations", icon: Destinations_Ico, path: "/#destinations" },
  { label: "Promotions", icon: Promotions_Ico, path: "/#promotions" },
  { label: "Évènements", icon: Evenements_Ico, path: "/#evenements" },
];

const PROFILE_NAV: NavItem[] = [
  { label: "Mes réservations", icon: Reservation_ico, path: "/reservations" },
  { label: "Mes cartes de réduction", icon: Carte_Reduc_Ico, path: "/" },
  { label: "Paramètres", icon: Parametres_Ico, path: "/Settings" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading: loadingUser, signOut } = useUser();
  const navigate = useNavigate();
  const [quickProfileOpen, setQuickProfileOpen] = useState(false);
  const isMobile = useIsMobile();
  const [imageError, setImageError] = useState(false);

  const userImage = user?.image ?? null;

  const displayName = useMemo(() => {
    if (!user?.name || user.name.trim() === "") {
      return user?.email ?? "Utilisateur";
    }
    return user.name.split(" ")[0];
  }, [user]);

  const initials = displayName
    ? displayName
        .split(" ")
        .map((w) => w[0]?.toUpperCase())
        .join("")
        .slice(0, 2)
    : "";

  const handleLogout = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Erreur déconnexion:", err);
    }
  };

  const privateMobileNav: NavItem[] = [
    { label: "Mes réservations", icon: Reservation_ico, path: "/reservations" },
    { label: "Panier", icon: Panier_Ico, path: "/panier" },
    { label: "Mes cartes de réduction", icon: Carte_Reduc_Ico, path: "/" },
    { label: "Paramètres", icon: Parametres_Ico, path: "/Settings" },
    ...PUBLIC_NAV,
  ];
  const mobileNav: NavItem[] = user ? privateMobileNav : PUBLIC_NAV;
  const desktopNav: NavItem[] = PUBLIC_NAV;

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-[#103035] sticky top-0 z-51 text-white border-b border-[#4A6367]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 px-4 lg:h-20 relative">
          <Link
            to="/"
            className="text-2xl font-bold text-[#98EAF3] lg:text-3xl absolute lg:static lg:left-auto lg:translate-x-0"
          >
            Horizons+
          </Link>
          {!isMobile && (
            <Link to="/panier">
              <img src={Panier_Ico} alt="Panier" className="w-7 h-7 ml-10" />
            </Link>
          )}

          <nav className="hidden lg:flex space-x-8 items-center absolute right-4">
            {desktopNav.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center space-x-2 hover:text-[#98EAF3] transition-colors"
              >
                <span className="font-semibold">{item.label}</span>
              </Link>
            ))}

            {!loadingUser && !user && (
              <Link
                to="/login"
                className="border border-[#98EAF3] text-[#98EAF3] px-4 py-2 rounded-xl font-semibold hover:bg-[#98EAF3] hover:text-[#103035] transition"
              >
                Se connecter
              </Link>
            )}

            {!loadingUser && user && (
              <div>
                <div
                  className="flex items-center space-x-3 ml-6 hover:cursor-pointer relative hover:text-[#98EAF3] transition-colors hover:bg-[#4A6367] p-2 rounded-xl"
                  onClick={() => setQuickProfileOpen(!quickProfileOpen)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#98EAF3] flex items-center justify-center text-[#103035] font-bold text-lg">
                    {userImage && !imageError ? (
                      <img
                        id="header-user-image"
                        src={userImage}
                        alt="Profil"
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                  <div className="font-bold">{displayName}</div>
                </div>

                <div className={`absolute top-19 right-0 z-50 ${quickProfileOpen ? "" : "hidden"}`}>
                  <div className="bg-[#103035] border border-[#4A6367] rounded-lg shadow-lg p-4 w-60 mr-2">
                    {PROFILE_NAV.map((item) => (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setQuickProfileOpen(false)}
                        className="flex items-center space-x-3 mb-3 hover:bg-[#4A6367] p-2 hover:rounded-xl border-b-1 border-[#4A6367]"
                      >
                        <img src={item.icon} alt="" className="w-5 h-5" />
                        <span className="font-semibold">{item.label}</span>
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="hover:cursor-pointer bg-[#FFB856] text-[#115E66] font-semibold w-full py-2 rounded-xl"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            )}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden absolute right-4 p-2"
            aria-label="Menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div
          className={`fixed top-[4rem] left-0 right-0 bottom-0 z-40 bg-[#103035] transform transition-transform duration-300 ease-in-out lg:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 overflow-y-auto">
            {loadingUser ? (
              <div className="text-sm opacity-60">Chargement...</div>
            ) : user ? (
              <div className="mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#98EAF3] flex items-center justify-center text-[#103035] font-bold text-lg">
                    {userImage && !imageError ? (
                      <img src={userImage} alt="" className="w-full h-full object-cover" onError={() => setImageError(true)} />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-xl">{displayName}</div>
                    <div className="text-gray-300 text-sm">{user.email}</div>
                  </div>
                </div>
              </div>
            ) : null}

            <nav className="space-y-6">
              {mobileNav.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-4 pb-2"
                >
                  <img src={item.icon} alt="" className="w-6 h-6" />
                  <span className="text-xl font-bold">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-10 flex flex-col gap-4">
              {!loadingUser && !user && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center py-3 bg-[#98EAF3] text-[#115E66] font-bold rounded-xl"
                  >
                    Se connecter
                  </Link>

                  <Link
                    to="/singin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center py-3 bg-[#FFB856] text-[#115E66] font-bold rounded-xl"
                  >
                    S'inscrire
                  </Link>
                </>
              )}

              {!loadingUser && user && (
                <button
                  onClick={handleLogout}
                  className="block w-full py-3 bg-[#FFB856] text-[#115E66] font-bold rounded-xl"
                >
                  Déconnexion
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
```

Notes:
- The `User` type export (previously `export type User = ...`) is moved to `user-context.tsx` where it lives with the provider. If anything else imports `User` from `Header.tsx`, that import needs updating — check with:

```bash
cd frontend && grep -rn "from.*components/layouts/Header" src/
```

If any file imports `User` from Header, change it to `from '../../lib/user-context'` (adjust relative path).

- [ ] **Step 2: Verify no stale imports of `User` from Header**

```bash
cd frontend && grep -rn "import.*User.*from.*Header" src/ || echo "No matches"
```

Expected: `No matches`. If any matches appear, update them as described above, then rerun.

- [ ] **Step 3: Verify build**

```bash
cd frontend && npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Verify lint**

```bash
cd frontend && npm run lint
```

Expected: no new errors.

- [ ] **Step 5: Smoke check**

Run `npm run dev`. Verify:
- Anonymous: Header shows "Destinations / Promotions / Évènements / Se connecter" on desktop.
- Anonymous mobile: burger menu shows the 3 public links + Se connecter + S'inscrire.
- Logged in: avatar appears, dropdown shows Mes réservations / Mes cartes / Paramètres / Déconnexion.
- Logged in mobile: menu shows profile + `[Réservations, Panier, Cartes, Paramètres, Destinations, Promotions, Évènements]` (same order as before the refactor).
- Open the Network tab, navigate between 2 routes: `/api/me` is fetched **once**, not on every route change.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/layouts/Header.tsx
git commit -m "refactor(header): dedupe menus and consume UserContext"
```

---

## Task 7: Optimize HomePage images

**Files:**
- Modify: `frontend/src/features/home/HomePage.tsx`

- [ ] **Step 1: Add lazy/async attributes + explicit dimensions to the 5 Unsplash `<img>` tags**

In `HomePage.tsx`, there are 5 Unsplash images without `loading="lazy"`:

1. Rome (around line 273):
   ```tsx
   <img
     src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop"
     alt="Rome Colisée"
     className="w-full h-full object-cover"
   />
   ```
   Change to:
   ```tsx
   <img
     src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop"
     alt="Rome Colisée"
     width={600}
     height={400}
     loading="lazy"
     decoding="async"
     className="w-full h-full object-cover"
   />
   ```

2. Paris (around line 293):
   ```tsx
   <img
     src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop"
     alt="Paris"
     className="w-full h-full object-cover"
   />
   ```
   Change to:
   ```tsx
   <img
     src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop"
     alt="Paris"
     width={600}
     height={400}
     loading="lazy"
     decoding="async"
     className="w-full h-full object-cover"
   />
   ```

3. Tokyo (around line 313):
   ```tsx
   <img
     src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop"
     alt="Tokyo"
     className="w-full h-full object-cover"
   />
   ```
   Change to:
   ```tsx
   <img
     src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop"
     alt="Tokyo"
     width={600}
     height={400}
     loading="lazy"
     decoding="async"
     className="w-full h-full object-cover"
   />
   ```

4. Event "Concert" (around line 360):
   ```tsx
   <img
     src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=400&fit=crop"
     alt="Concert"
     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
   />
   ```
   Change to:
   ```tsx
   <img
     src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=400&fit=crop"
     alt="Concert"
     width={800}
     height={400}
     loading="lazy"
     decoding="async"
     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
   />
   ```

5. Event "Sport" (around line 374):
   ```tsx
   <img
     src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop"
     alt="Sport"
     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
   />
   ```
   Change to:
   ```tsx
   <img
     src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop"
     alt="Sport"
     width={800}
     height={400}
     loading="lazy"
     decoding="async"
     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
   />
   ```

- [ ] **Step 2: Verify build**

```bash
cd frontend && npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Smoke check**

Run `npm run dev`. HomePage renders identically, no visual change.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/features/home/HomePage.tsx
git commit -m "perf(home): lazy-load + explicit dimensions on Unsplash images"
```

---

## Task 8: PromotionSlider — image attrs + remove dead styles

**Files:**
- Modify: `frontend/src/features/home/components/PromotionSlider.tsx`

- [ ] **Step 1: Add image attrs**

Find the `<img>` inside the slide (around line 81):

```tsx
<img 
  src={destination.image} 
  alt={destination.title}
  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
/>
```

Change to:

```tsx
<img
  src={destination.image}
  alt={destination.title}
  width={800}
  height={400}
  loading="lazy"
  decoding="async"
  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
/>
```

- [ ] **Step 2: Remove the dead `<style>` block**

Remove the entire block at the bottom of the component (lines 122-163 in the original file):

```tsx
{/* Styles personnalisés pour Swiper */}
<style>{`
  .swiper-slide {
    width: auto !important;
    height: auto;
  }
  
  .swiper-button-next,
  .swiper-button-prev {
    color: #fbbf24;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  
  .swiper-button-next:after,
  .swiper-button-prev:after {
    font-size: 20px;
  }
  
  .swiper-pagination-bullet {
    background: #fbbf24;
    opacity: 0.5;
    width: 12px;
    height: 12px;
  }
  
  .swiper-pagination-bullet-active {
    opacity: 1;
    width: 32px;
    border-radius: 6px;
  }
  
  .swiper-scrollbar {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .swiper-scrollbar-drag {
    background: #fbbf24;
  }
`}</style>
```

The rules target `.swiper-button-next/prev`, `.swiper-pagination-bullet`, `.swiper-scrollbar` — none of which are rendered because the Swiper in this component does not enable the `Navigation`, `Pagination`, or `Scrollbar` modules. The `.swiper-slide { width: auto !important; }` rule is redundant with the inline `!w-80 md:!w-96` Tailwind classes on each `<SwiperSlide>`.

- [ ] **Step 3: Verify build**

```bash
cd frontend && npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Smoke check**

Run `npm run dev`. PromotionSlider renders and swipes identically — cards show at `w-80` (mobile) and `w-96` (md+), exactly as before.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/features/home/components/PromotionSlider.tsx
git commit -m "perf(promotions): lazy-load image and remove unused swiper styles"
```

---

## Final Verification

- [ ] **Step 1: Full build + lint from a clean state**

```bash
cd frontend && npm run build && npm run lint
```

Expected: both pass.

- [ ] **Step 2: Bundle inspection**

```bash
cd frontend && ls -lh dist/assets/*.js | sort -k5 -h
```

Expected: the largest file is the main entry; several smaller per-route chunks exist (one per lazy route). The main entry is visibly smaller than before this plan was implemented (compare against `git stash` of current state if desired).

- [ ] **Step 3: End-to-end manual smoke**

Run `npm run dev`. Walk through:
1. Open `/` — renders fast, no blank flash.
2. Click Header "Destinations" → smooth scroll to that section.
3. Click "Promotions" → smooth scroll.
4. Click "Évènements" → smooth scroll.
5. Navigate to `/panier` — spinner briefly, Panier loads.
6. Navigate back to `/#destinations` — scrolls correctly.
7. Log in (if possible). Verify `/api/me` called once in Network tab.
8. Open desktop profile dropdown — links and logout work.
9. Mobile viewport: burger menu shows correct links for anon and logged-in states.

## Out of Scope (flagged in spec)

- Root-level `package.json` dependency cleanup (pdf-lib, @mui/material, qrcode, path orphaned). Confirm with user separately before deletion.
