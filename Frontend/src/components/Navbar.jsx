import React, { useState, useEffect } from 'react'
import { FaHome, FaChartLine, FaInfoCircle, FaUser, FaUserPlus } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/predictors', label: 'Predict', icon: FaChartLine },
    { path: '/about', label: 'About', icon: FaInfoCircle },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-white/95 shadow-sm border-b border-gray-200' : 'bg-white'
      }`}
    >
      <div className="max-w-8xl container mx-auto px-2 md:px-0">
        {/* main row */}
        <div className="flex items-center justify-between h-16">
          {/* logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="./logo.png"
              alt="logo"
              className="h-9 w-9 rounded-md object-contain"
            />
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              PREDICTIX
            </span>
          </Link>

          {/* center nav links (desktop) */}
          <ul className="hidden md:flex items-center gap-2">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="text-sm" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* right auth buttons (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/signin"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <FaUser className="text-sm" />
              <span>Sign In</span>
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <FaUserPlus className="text-sm" />
              <span>Sign Up</span>
            </Link>
          </div>

          {/* mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
          >
            <span className="sr-only">Open main menu</span>
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 bg-current transition-transform ${
                  isMenuOpen ? 'translate-y-1.5 rotate-45' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition-opacity ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition-transform ${
                  isMenuOpen ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE FULLSCREEN MENU */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-white transition-transform duration-300 ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="px-4 pt-20 pb-6 flex flex-col items-center h-full">
          {/* center nav links vertically and horizontally */}
          <Link to="/" className="flex items-center gap-2">
              <img
                src="./logo.png"
                alt="logo"
                className="h-9 w-9 rounded-md object-contain"
              />
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                PREDICTIX
              </span>
            </Link>
          <div className="flex-1 flex flex-col items-center justify-center">
            
            <ul className="space-y-3 w-full max-w-xs">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-base font-medium ${
                      isActive(path)
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="text-base" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* auth buttons at bottom */}
          <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
            <Link
              to="/signin"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-gray-800 hover:bg-gray-100"
            >
              <FaUser className="text-base" />
              <span>Sign In</span>
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FaUserPlus className="text-base" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
