import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'leaflet/dist/leaflet.css';

import MainLayout from './components/layouts/MainLayouts.tsx'
import HomePage from './features/home/HomePage.tsx'
import Login from './features/connexion/Login/login.tsx';
import Singin from './features/connexion/Singin/singin.tsx';
import Ville from './features/Villes/ville.tsx';
import Panier from './features/panier/panier.tsx';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes imbriquées sous ton layout principal */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="singin" element={<Singin />} />
          <Route path="Ville" element={<Ville />} />
          <Route path="panier" element={<Panier />} />

        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
