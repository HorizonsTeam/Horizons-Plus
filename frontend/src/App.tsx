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
import PaymentPage  from './features/Products/Billets/Payment.tsx';


import ResetPassword from './features/connexion/ResetPassword/resetpassword.tsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes imbriquées sous ton layout principal */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="singin" element={<Singin />} />
          <Route path="panier" element={<Panier />} />
          <Route path="Recherche" element={<Resultats />} />
          <Route path='mdpoublie' element={<MdpOublie />} />
          <Route path='reset-password' element={<ResetPassword />} />
          <Route path="Recap" element={<Recap />} />
          <Route path="PaymentPage" element={<PaymentPage />} />
           


        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
