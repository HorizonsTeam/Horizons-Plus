import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 lg:hidden">
          {/* Profile Picture */}
          <div className="w-10 h-10 bg-secondary rounded-full overflow-hidden">
            <img 
              src="https://via.placeholder.com/40" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-white">
            Horizons+
          </Link>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <span className="text-2xl font-bold ">Horizons+</span>
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

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-secondary bg-dark">
          <nav className="px-4 py-4 space-y-3">
            <Link
              to="/booking"
              className="block py-2 text-white hover:text-primary transition-colors uppercase tracking-wide"
              onClick={() => setIsMenuOpen(false)}
            >
              Booking
            </Link>
            <Link
              to="/voyager"
              className="block py-2 text-white hover:text-primary transition-colors uppercase tracking-wide"
              onClick={() => setIsMenuOpen(false)}
            >
              Voyager
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-white hover:text-primary transition-colors uppercase tracking-wide"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}