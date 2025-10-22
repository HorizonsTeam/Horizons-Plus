import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayouts.tsx'
import HomePage from './features/home/HomePage.tsx'
import Login from './features/connexion/Login/login.tsx';
import Singin from './features/connexion/Singin/singin.tsx';
import Ville from './features/Villes/ville.tsx';

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="singin" element={<Singin />} />
          <Route path="Ville" element={<Ville />} />

        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
