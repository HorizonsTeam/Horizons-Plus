import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket } from 'lucide-react';
import logoNavBar from '../../assets/logo-navbar.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-dark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 lg:hidden">
            {/* Basket Icon */}
            <div className="w-10 h-10 flex justify-center items-center">
              <ShoppingBasket size={50}/>
            </div>

            {/* Logo */}
            <Link to="/" className=" text-[2rem] font-bold " style={{color: '#98EAF3'}}>
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
              <Link to="/booking" className="text-white hover:text-primary transition-colors uppercase tracking-wide">
                Booking
              </Link>
              <Link to="/voyager" className="text-white hover:text-primary transition-colors uppercase tracking-wide">
                Voyager
              </Link>
              <Link to="/contact" className="text-white hover:text-primary transition-colors uppercase tracking-wide">
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
          className="fixed inset-0 bg-opacity-50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Offcanvas Menu (depuis la droite) */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-dark shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
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
        <img src={logoNavBar} className='mx-auto w-[35vw] ' alt="Horizon+ logo" />
        {/* Navigation */}
        <nav className="space-y-2">
          <Link
            to="/booking"
            className="block py-3 px-4 text-white hover:bg-secondary hover:text-primary transition-all rounded-lg uppercase tracking-wide"
            onClick={() => setIsMenuOpen(false)}
          >
            Booking
          </Link>
          <Link
            to="/voyager"
            className="block py-3 px-4 text-white hover:bg-secondary hover:text-primary transition-all rounded-lg uppercase tracking-wide"
            onClick={() => setIsMenuOpen(false)}
          >
            Voyager
          </Link>
          <Link
            to="/contact"
            className="block py-3 px-4 text-white hover:bg-secondary hover:text-primary transition-all rounded-lg uppercase tracking-wide"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </nav>
      </div>
    </>
  );
}