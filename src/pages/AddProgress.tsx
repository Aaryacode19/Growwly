import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Layout } from '../components/Layout'
import { ImageUpload } from '../components/ImageUpload'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AddProgress() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    heading: '',
    description: '',
    videoUrl: '',
    imageUrl: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')
    
    try {
      // Insert new progress entry (multiple entries per day allowed)
      const { error } = await supabase.from('daily_progress').insert({
        user_id: user.id,
        date: formData.date,
        heading: formData.heading,
        description: formData.description || null,
        video_url: formData.videoUrl || null,
        image_url: formData.imageUrl || null,
      })

      if (error) throw error
      navigate('/')
    } catch (error) {
      setError('Failed to save progress. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageUploaded = (url: string) => {
    setFormData({
      ...formData,
      imageUrl: url,
    })
  }

  const handleImageRemoved = () => {
    setFormData({
      ...formData,
      imageUrl: '',
    })
  }

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 hover:underline mb-4 text-sm sm:text-base">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-semibold">Add Daily Progress</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
          Track your achievements and milestones. You can add multiple entries for the same day.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-2xl">
        <div className="space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date
            </label>
            <div className="relative">
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field pl-10"
                required
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" size={16} />
            </div>
          </div>

          <div>
            <label htmlFor="heading" className="block text-sm font-medium mb-1">
              Heading *
            </label>
            <input
              id="heading"
              name="heading"
              type="text"
              value={formData.heading}
              onChange={handleChange}
              className="input-field"
              placeholder="What did you accomplish today?"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field min-h-[120px] resize-y"
              placeholder="Tell us more about your progress, challenges overcome, lessons learned..."
            />
          </div>

          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium mb-1">
              Any URL (optional)
            </label>
            <input
              id="videoUrl"
              name="videoUrl"
              type="url"
              value={formData.videoUrl}
              onChange={handleChange}
              className="input-field"
              placeholder="https://youtube.com/watch?v=... or any link"
            />
          </div>

          <ImageUpload
            onImageUploaded={handleImageUploaded}
            currentImage={formData.imageUrl}
            onImageRemoved={handleImageRemoved}
          />

          {error && (
            <div className="text-red-600 text-sm border border-red-600 p-2 bg-red-50 dark:bg-red-900/20 rounded">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 sm:flex-none"
            >
              {loading ? 'Saving...' : 'Save Progress'}
            </button>
            <Link to="/" className="btn-secondary flex-1 sm:flex-none text-center">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </Layout>
  )
}