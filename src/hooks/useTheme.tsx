import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isTransitioning: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    return (saved as Theme) || 'light'
  })
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    localStorage.setItem('theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setIsTransitioning(true)
    
    // Create multiple visual effects for theme transition
    const ripple = document.createElement('div')
    ripple.className = 'theme-ripple'
    document.body.appendChild(ripple)
    
    // Add transition overlay
    const overlay = document.createElement('div')
    overlay.className = 'theme-transition-overlay'
    document.body.appendChild(overlay)
    
    // Trigger the ripple animation
    setTimeout(() => {
      ripple.classList.add('active')
    }, 50)
    
    // Add a subtle flash effect
    document.body.style.transition = 'all 0.1s ease'
    document.body.style.filter = 'brightness(1.1)'
    
    setTimeout(() => {
      document.body.style.filter = 'brightness(1)'
    }, 100)
    
    // Change theme after a delay for smoother transition
    setTimeout(() => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }, 200)
    
    // Clean up effects
    setTimeout(() => {
      setIsTransitioning(false)
      document.body.style.transition = ''
      if (document.body.contains(ripple)) {
        document.body.removeChild(ripple)
      }
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay)
      }
    }, 1200)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}