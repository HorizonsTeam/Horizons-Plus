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
const CartPayment = lazy(() => import('./features/Products/Billets/Pages/CartPayment.tsx'))
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
          <Route path="login" element={<Suspense fallback={<RouteFallback />}><Login /></Suspense>} />
          <Route path="two-factor" element={<Suspense fallback={<RouteFallback />}><TwoFactor /></Suspense>} />
          <Route path="mdpoublie" element={<Suspense fallback={<RouteFallback />}><MdpOublie /></Suspense>} />
          <Route path="ResetPassword" element={<Suspense fallback={<RouteFallback />}><ResetPassword /></Suspense>} />
          <Route path="singin" element={<Suspense fallback={<RouteFallback />}><Singin /></Suspense>} />
          <Route path="panier" element={<Suspense fallback={<RouteFallback />}><Panier /></Suspense>} />
          <Route path="Recherche" element={<Suspense fallback={<RouteFallback />}><Resultats /></Suspense>} />
          <Route path="Recap" element={<Suspense fallback={<RouteFallback />}><Recap /></Suspense>} />
          <Route path="PaymentPage" element={<Suspense fallback={<RouteFallback />}><PaymentPage /></Suspense>} />
          <Route path="CartPayment" element={<Suspense fallback={<RouteFallback />}><CartPayment /></Suspense>} />
          <Route path="Infos_Passagers" element={<Suspense fallback={<RouteFallback />}><Infos_Passagers /></Suspense>} />
          <Route path="Settings" element={<Suspense fallback={<RouteFallback />}><Settings /></Suspense>} />
          <Route path="UserInfoPageMobile" element={<Suspense fallback={<RouteFallback />}><UserInfoPageMobile /></Suspense>} />
          <Route path="AccountSettings" element={<Suspense fallback={<RouteFallback />}><AccountSettings /></Suspense>} />
          <Route path="reservations" element={<Suspense fallback={<RouteFallback />}><ReservationsPages /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
