import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoNavBar from '../../assets/logo-navbar.png';
import Search_Svg from '../../assets/Search_Svg.svg';
import Destination_Svg from '../../assets/Destinations_Logo.svg';
import Promotions_Svg from '../../assets/Promotion_Icon.svg';
import Events_Svg from '../../assets/Events_Eco.svg';
import Panier_Ico from '../../assets/Panier_Ico.svg';
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-[#103035] sticky top-0 z-40">
        <div className="   px-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 lg:hidden ">
            
            {/* Basket Icon with Notification Dot */}
            <div className="relative w-[27px] h-[33px] flex items-center justify-center">
              <img src={Panier_Ico} alt="Panier" className="w-full h-full" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
            </div>

            {/* Logo Centered */}
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 text-[2rem] font-bold" style={{ color: '#98EAF3' }}>
              Horizons+
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white"
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
        
        


          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">Horizons+</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="flex items-center space-x-8">

              <Link to="/Search" className="text-white hover:text-primary transition-colors  tracking-wide">
                Search 
              </Link>
              <Link to="/voyager" className="text-white hover:text-primary transition-colors  tracking-wide">
                Voyager
              </Link>
              <Link to="/contact" className="text-white hover:text-primary transition-colors  tracking-wide">
                Contact
              </Link>
            </nav>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-full overflow-hidden">
                <img 
                  src="https://via.placeholder.com/40" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
          {isMenuOpen && (
  <div
    className="fixed inset-0 z-40 lg:hidden transition-opacity duration-300"
    style={{ backgroundColor: 'rgba(16, 48, 53, 0.8)' }}
    onClick={() => setIsMenuOpen(false)}
  />
)}


      {/* Offcanvas Menu (depuis la droite) */}
      <div>
      <div className={`fixed top-0 right-0 h-full w-50 bg-dark shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`} style={{backgroundColor: '#2C474B'}}>
        {/* Header du menu */}
        <div className="flex items-center justify-end p-4 border-b border-secondary">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-white hover:text-primary transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <img src={logoNavBar} className='mx-auto w-[15vw] -mt-6' alt="Horizon+ logo" />
        {/* Navigation */}
        <nav className="space-y-4 p-6 flex flex-col items-center justify-center w-full mb-15 mt-4">
          <div className="flex items-center justify-center w-40  ">
            <Link to="/search" onClick={() => setIsMenuOpen(false)} className="w-50 h-10 py-3 px-5 text-white bg-[#103035] rounded-3xl flex items-center gap-3 font-semibold">
              <img src={Search_Svg} alt="Search Logo" className="w-4 h-4" />
              <span >Search</span>
            </Link>
          </div>
          <div className="flex items-center justify-center w-full max-w-md">
            <Link to="/booking" onClick={() => setIsMenuOpen(false)} className="w-50 py-3 px-5 text-white bg-[#103035] rounded-3xl flex items-center gap-3 font-semibold">
              <img src={Destination_Svg} alt="Search Logo" className="w-4 h-4" />
              <span>Destinations</span>
            </Link>
          </div>
          <div className="flex items-center justify-center w-full max-w-md">
            <Link to="/booking" onClick={() => setIsMenuOpen(false)} className="w-50 py-3 px-5 text-white bg-[#103035] rounded-3xl flex items-center gap-3 font-semibold">
              <img src={Promotions_Svg} alt="Search Logo" className="w-4 h-4" />
              <span>Promotions</span>
            </Link>
          </div>
          <div className="flex items-center justify-center w-full max-w-md">
            <Link to="/booking" onClick={() => setIsMenuOpen(false)} className="w-50 py-3 px-5 text-white bg-[#103035] rounded-3xl flex items-center gap-3 font-semibold">
              <img src={Events_Svg} alt="Search Logo" className="w-4 h-4" />
              <span>Evenments</span>
            </Link>
          </div>
          
        </nav>
        {/* User Actions */}
        <div className="flex flex-col items-center gap-4 p-6 justify-center ">
          <button className="w-40 py-3 text-white bg-[#98EAF3] rounded-3xl text-lg font-semibold">
            
            <Link to="/login" onClick={() => setIsMenuOpen(false)}  className="bg-primary text-dark font-semibold px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors">
                  Se connecter
                </Link>
          </button>
          <button className="w-40 py-3 text-white bg-[#FFB856] rounded-3xl text-lg font-semibold">
              
              <Link to="/singin" onClick={() => setIsMenuOpen(false)} className='text-[#115E66]' >S’inscrire</Link>

          </button>
        </div>
      

      </div>
       
      

      </div>
    </>
  );
}