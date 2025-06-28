import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { AccessRequestForm } from './AccessRequestForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { Footer } from './Footer'
import { Moon, Sun } from 'lucide-react'

export function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAccessRequest, setShowAccessRequest] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const { signIn } = useAuth()
  const { theme, toggleTheme, isTransitioning } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await signIn(email, password)
      if (error) throw error
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (showAccessRequest) {
    return <AccessRequestForm onBack={() => setShowAccessRequest(false)} />
  }

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {/* Header */}
      <header className="border-b border-black dark:border-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <div className="text-lg sm:text-xl font-semibold">
            Growwly
          </div>
          
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
            <span className="hidden sm:inline text-sm">
              {theme === 'light' ? 'Dark' : 'Light'}
            </span>
            {isTransitioning && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content with balanced spacing */}
      <div className="flex-1 flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:py-16">
        <div className="card w-full max-w-md mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Sign in to continue tracking your progress
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm border border-red-600 p-2 bg-red-50 dark:bg-red-900/20 rounded text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="text-center">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-sm hover:underline text-gray-600 dark:text-gray-400"
              >
                Forgot your password?
              </button>
            </div>
            
            <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Don't have access yet?
              </p>
              <button
                onClick={() => setShowAccessRequest(true)}
                className="text-sm hover:underline font-medium"
              >
                Request Access
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}