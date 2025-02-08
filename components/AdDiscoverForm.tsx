'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface FormData {
  companyName: string
  description: string
}

export function AdDiscoveryForm() {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="companyName" className="block text-lg font-medium text-white mb-2">
              Business or Brand Name
            </label>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-lg font-medium text-white mb-2">
              Product Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              placeholder="Describe your product or service..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white text-lg font-medium rounded-lg transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isLoading ? 'Discovering Ads...' : 'Discover Successful Ads'}
          </button>
        </form>
      </div>

      <div className="mt-12 backdrop-blur-xl bg-white/10 rounded-2xl p-6 text-center">
        <p className="text-purple-200 text-lg">
          Video previews and analysis will appear here after submission
        </p>
      </div>
    </motion.div>
  )
}