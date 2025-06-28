import { ReactNode, useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { LogOut, Plus, Moon, Sun, Lock, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { ChangePasswordModal } from './ChangePasswordModal'
import { Footer } from './Footer'
import { BotButton } from './BotButton'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme, isTransitioning } = useTheme()
  const location = useLocation()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (mobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [mobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.position = 'unset'
      document.body.style.width = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.position = 'unset'
      document.body.style.width = 'unset'
    }
  }, [mobileMenuOpen])

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors flex flex-col">
      <header className="border-b border-black dark:border-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="text-lg sm:text-xl font-semibold hover:underline transition-all duration-200"
              onClick={closeMobileMenu}
            >
              Growwly
            </Link>
            
            {user && (
              <>
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2 lg:gap-3">
                  <button
                    onClick={toggleTheme}
                    disabled={isTransitioning}
                    className={`btn-secondary flex items-center gap-2 relative overflow-hidden px-3 py-2 ${
                      isTransitioning ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  >
                    <div className={`transition-transform duration-300 ${isTransitioning ? 'scale-110' : ''}`}>
                      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    </div>
                    <span className="hidden xl:inline text-sm">
                      {theme === 'light' ? 'Dark' : 'Light'}
                    </span>
                    {isTransitioning && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    )}
                  </button>
                  
                  {location.pathname === '/' && (
                    <Link to="/add" className="btn-secondary flex items-center gap-2 px-3 py-2">
                      <Plus size={16} />
                      <span className="hidden lg:inline text-sm">Add Progress</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="btn-secondary flex items-center gap-2 px-3 py-2"
                    title="Change Password"
                  >
                    <Lock size={16} />
                    <span className="hidden xl:inline text-sm">Password</span>
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className="btn-secondary flex items-center gap-2 px-3 py-2"
                  >
                    <LogOut size={16} />
                    <span className="hidden lg:inline text-sm">Sign Out</span>
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMobileMenuOpen(!mobileMenuOpen)
                  }}
                  className="md:hidden btn-secondary flex items-center gap-2 mobile-menu-button z-50 relative px-3 py-2"
                >
                  {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                  <span className="text-sm">Menu</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu - Redesigned */}
        {user && mobileMenuOpen && (
          <>
            {/* Enhanced Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Enhanced Menu */}
            <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-black border-l border-black dark:border-white md:hidden z-50 mobile-menu shadow-2xl">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold">Menu</h3>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Menu Content */}
              <div className="p-6 space-y-1">
                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    toggleTheme()
                    closeMobileMenu()
                  }}
                  disabled={isTransitioning}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left ${
                    isTransitioning ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Switch Theme</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Change to {theme === 'light' ? 'dark' : 'light'} mode
                    </div>
                  </div>
                </button>
                
                {/* Add Progress */}
                {location.pathname === '/' && (
                  <Link 
                    to="/add" 
                    className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Plus size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Add Progress</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Track your daily achievements
                      </div>
                    </div>
                  </Link>
                )}
                
                {/* Change Password */}
                <button
                  onClick={() => {
                    setShowPasswordModal(true)
                    closeMobileMenu()
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <Lock size={18} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Change Password</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Update your account security
                    </div>
                  </div>
                </button>
                
                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left text-red-600 dark:text-red-400"
                >
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <LogOut size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Sign Out</div>
                    <div className="text-sm text-red-500 dark:text-red-400">
                      End your session
                    </div>
                  </div>
                </button>
              </div>

              {/* Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Signed in as
                  </div>
                  <div className="font-medium text-sm truncate">
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 flex-1 w-full">
        {children}
      </main>

      <Footer />

      {/* Floating Bot Button - only show when user is logged in */}
      {user && <BotButton />}

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  )
}