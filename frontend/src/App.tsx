import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'leaflet/dist/leaflet.css';
import MainLayout from './components/layouts/MainLayouts.tsx'
import HomePage from './features/home/HomePage.tsx'
import Login from './features/connexion/Login/login.tsx';
import Singin from './features/connexion/Singin/singin.tsx';
import MdpOublie from './features/connexion/MdpOublie/mdpoublie.tsx';
import Panier from './features/panier/panier.tsx';
import Resultats from './features/Recherche/Resultats.tsx';
import Recap from './features/Products/Billets/Pages/recap.tsx';
import PaymentPage from './features/Products/Billets/Pages/Payment.tsx';

import Infos_Passagers from './features/Products/Billets/Pages/Infos_Passagers.tsx';
import Settings from './features/Settings/setingsPage.tsx';
import UserInfoPageMobile from './features/Settings/components/UserInformation/UserInfoMobilePage.tsx';
import ResetPassword from './features/connexion/ResetPassword/resetpassword.tsx';
import AccountSettings from './features/Settings/Pages/AccountSettings/AccountSettings.tsx';

import ReservationsPages from './features/reservations-pages/components/reservationsPages.tsx';
import TwoFactor from './features/connexion/2AF/TwoFactor.tsx';

import ProtectedRoute from './features/connexion/ProtectedRoute.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes imbriquées sous ton layout principal */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={ <ProtectedRoute requiredAuth={false}>
                <Login />
              </ProtectedRoute> } />
          <Route path="/two-factor" element={
            <ProtectedRoute requiredAuth={false}>
                <TwoFactor />
              </ProtectedRoute>
          } />
          <Route path="mdpoublie" element={
            <ProtectedRoute requiredAuth={false}>
                <MdpOublie />
              </ProtectedRoute>
          } />
          <Route path="ResetPassword" element={
            <ProtectedRoute requiredAuth={false}>
                <ResetPassword />
              </ProtectedRoute>
          } />
          <Route path="singin" element={
             <ProtectedRoute requiredAuth={false}>
                <Singin />
              </ProtectedRoute>
          } />
          <Route path="panier" element={
             <ProtectedRoute requiredAuth={true}>
                <Panier />
              </ProtectedRoute>
          } />
          <Route path="Recherche" element={
            <ProtectedRoute requiredAuth={true}>
                <Resultats />
              </ProtectedRoute>
          } />
          <Route path="Recap" element={
             <ProtectedRoute requiredAuth={true}>
                <Recap />
              </ProtectedRoute>
          } />
          <Route path="PaymentPage" element={
            <ProtectedRoute requiredAuth={true}>
                <PaymentPage />
              </ProtectedRoute>
          } />
          <Route path="Infos_Passagers" element={
            <ProtectedRoute requiredAuth={true}>
                <Infos_Passagers />
              </ProtectedRoute>
          } />
          <Route path="Settings" element={
            <ProtectedRoute requiredAuth={true}>
                <Settings />
              </ProtectedRoute>
          } />
          <Route path="UserInfoPageMobile" element={
            <ProtectedRoute requiredAuth={true}>
                <UserInfoPageMobile />
              </ProtectedRoute>
          } />
          <Route path="AccountSettings" element={
             <ProtectedRoute requiredAuth={true}>
                <AccountSettings />
              </ProtectedRoute>
          } />
          <Route path="reservations" element={
            <ProtectedRoute requiredAuth={true}>
                <ReservationsPages />
              </ProtectedRoute>
          } />
        </Route>
        <Route path="*" element={<div className="text-center py-20 text-white">Page non trouvée (404)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
