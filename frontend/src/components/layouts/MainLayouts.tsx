import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PanierBtn  from '../AdditionalsComponents/PanierBtn.tsx';


export default function MainLayout() {
  return (
    <>
      <Header />
      <div>
        <main>
          <Outlet />
        </main>

        <PanierBtn  />
        
        <Footer />
      </div>
    </>
  );
}