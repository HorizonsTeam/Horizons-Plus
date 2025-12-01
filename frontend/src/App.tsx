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
import Recap from './features/Products/recap.tsx';
import PaymentPage from './features/Products/Billets/Payment.tsx';

import Infos_Passagers from './features/Products/Billets/Infos_Passagers.tsx';
import Settings from './features/Settings/setingsPage.tsx';
import UserInfoPageMobile from './features/Settings/components/UserInfoMobilePage.tsx';
import ResetPassword from './features/connexion/ResetPassword/resetpassword.tsx';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes imbriquées sous ton layout principal */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="mdpoublie" element={<MdpOublie />} />
          <Route path="ResetPassword" element={<ResetPassword />} />
          <Route path="singin" element={<Singin />} />
          <Route path="panier" element={<Panier />} />
          <Route path="Recherche" element={<Resultats />} />
          <Route path="Recap" element={<Recap />} />
          <Route path="PaymentPage" element={<PaymentPage />} />
          <Route path="Infos_Passagers" element={<Infos_Passagers />} />
          <Route path="Settings" element={<Settings/>} />
          <Route path="UserInfoPageMobile" element={<UserInfoPageMobile />} />

           


        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
