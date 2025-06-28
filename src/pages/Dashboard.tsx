import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { ProgressCard } from '../components/ProgressCard'
import { Database } from '../lib/database.types'
import { Layout } from '../components/Layout'
import { Calendar, TrendingUp } from 'lucide-react'

type ProgressEntry = Database['public']['Tables']['daily_progress']['Row']

export function Dashboard() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<ProgressEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEntries: 0,
    uniqueDays: 0,
    currentStreak: 0,
  })

  useEffect(() => {
    if (user) {
      fetchProgress()
    }
  }, [user])

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      
      const progressData = data || []
      setProgress(progressData)
      
      // Calculate stats
      const uniqueDates = new Set(progressData.map(p => p.date))
      setStats({
        totalEntries: progressData.length,
        uniqueDays: uniqueDates.size,
        currentStreak: calculateStreak(Array.from(uniqueDates).sort().reverse()),
      })
    } catch (error) {
      // Silently handle error - user will see empty state
      setProgress([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProgress = (deletedId: string) => {
    // Remove the deleted progress from the state
    const updatedProgress = progress.filter(p => p.id !== deletedId)
    setProgress(updatedProgress)
    
    // Recalculate stats
    const uniqueDates = new Set(updatedProgress.map(p => p.date))
    setStats({
      totalEntries: updatedProgress.length,
      uniqueDays: uniqueDates.size,
      currentStreak: calculateStreak(Array.from(uniqueDates).sort().reverse()),
    })
  }

  const calculateStreak = (sortedDates: string[]): number => {
    if (sortedDates.length === 0) return 0
    
    let streak = 0
    const today = new Date().toISOString().split('T')[0]
    let currentDate = new Date(today)
    
    for (const dateStr of sortedDates) {
      const progressDate = currentDate.toISOString().split('T')[0]
      
      if (dateStr === progressDate) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    return streak
  }

  const groupProgressByDate = (progressEntries: ProgressEntry[]) => {
    const grouped: { [key: string]: ProgressEntry[] } = {}
    
    progressEntries.forEach(entry => {
      if (!grouped[entry.date]) {
        grouped[entry.date] = []
      }
      grouped[entry.date].push(entry)
    })
    
    return grouped
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-lg">Loading your progress...</div>
        </div>
      </Layout>
    )
  }

  const groupedProgress = groupProgressByDate(progress)
  const sortedDates = Object.keys(groupedProgress).sort().reverse()

  return (
    <Layout>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Your Daily Progress</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Track your journey, one day at a time.</p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="card !p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">{stats.totalEntries}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Entries</div>
              </div>
            </div>
          </div>
          
          <div className="card !p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">{stats.uniqueDays}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Active Days</div>
              </div>
            </div>
          </div>
          
          <div className="card !p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-400 font-bold text-sm sm:text-base">🔥</span>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">{stats.currentStreak}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {progress.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-lg mb-4">No progress entries yet.</div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Start documenting your daily achievements!</p>
        </div>
      ) : (
        <div>
          {sortedDates.map((date) => (
            <div key={date} className="mb-8">
              <div className="sticky top-0 bg-white dark:bg-black py-2 mb-4 border-b border-gray-200 dark:border-gray-700 z-10">
                <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 flex-wrap">
                  <Calendar size={16} className="sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    ({groupedProgress[date].length} {groupedProgress[date].length === 1 ? 'entry' : 'entries'})
                  </span>
                </h2>
              </div>
              
              <div className="space-y-4">
                {groupedProgress[date].map((entry) => (
                  <ProgressCard 
                    key={entry.id} 
                    progress={entry} 
                    onDelete={handleDeleteProgress}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}