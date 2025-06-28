import { useState, useEffect } from 'react'
import { MessageCircle, X, Bot } from 'lucide-react'

export function BotButton() {
  const [showModal, setShowModal] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  // Capture scroll position when modal opens
  useEffect(() => {
    if (showModal) {
      setScrollPosition(window.scrollY)
    }
  }, [showModal])

  return (
    <>
      {/* Floating Bot Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40 flex items-center justify-center group"
        title="AI Assistant"
      >
        <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Coming Soon Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4"
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
            className="w-full h-full flex items-start justify-center overflow-y-auto"
            style={{
              paddingTop: `${Math.max(scrollPosition + 20, 20)}px`,
              paddingBottom: '20px'
            }}
          >
            <div className="card w-full max-w-md relative animate-fade-in-up my-8 mx-auto">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-semibold mb-3">AI Assistant</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  We're building an intelligent AI assistant to help you track and analyze your daily progress. 
                  Stay tuned for exciting features!
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Coming Soon
                  </div>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Progress insights & analytics</li>
                    <li>• Personalized recommendations</li>
                    <li>• Smart goal tracking</li>
                    <li>• Achievement celebrations</li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="btn-primary w-full"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}