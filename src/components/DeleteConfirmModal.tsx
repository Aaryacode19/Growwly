import { useEffect, useState } from 'react'
import { Trash2, X } from 'lucide-react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
  progressEntry: {
    heading: string
    date: string
  }
}

export function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading, 
  progressEntry 
}: DeleteConfirmModalProps) {
  const [scrollPosition, setScrollPosition] = useState(0)

  // Capture scroll position when modal opens
  useEffect(() => {
    if (isOpen) {
      setScrollPosition(window.scrollY)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !loading) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      <div 
        className="bg-white dark:bg-black border border-black dark:border-white p-6 w-full max-w-md mx-auto relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Delete Progress Entry</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Are you sure you want to delete this progress entry? This action cannot be undone.
          </p>
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded text-left">
            <p className="font-medium text-sm truncate">{progressEntry.heading}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {progressEntry.date}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 text-white px-4 py-2 border border-red-600 hover:bg-red-700 hover:border-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}