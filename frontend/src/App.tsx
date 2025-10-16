import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayouts';
import HomePage from './features/home/HomePage';
import Register from './features/Register/Register';
import Login from './features/Login/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes imbriquées sous ton layout principal */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
