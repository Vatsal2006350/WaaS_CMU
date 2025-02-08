"use client"

import { useState } from "react"

export function AdAnalysis() {
  const [industry, setIndustry] = useState("")
  const [competitors, setCompetitors] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setResults([
      "Ad 1: High engagement rate due to catchy music",
      "Ad 2: Effective use of text overlays for product features",
      "Ad 3: Influencer collaboration increased reach",
    ])
    setIsLoading(false)
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Analyze Competitor Ads</h2>
        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <input
                type="text"
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="competitors" className="block text-sm font-medium text-gray-700">
                Competitors (comma-separated)
              </label>
              <input
                type="text"
                id="competitors"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? "Analyzing..." : "Analyze Ads"}
            </button>
          </form>
        </div>
        {results.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h3>
            <ul className="space-y-2">
              {results.map((result, index) => (
                <li key={index} className="bg-white p-4 rounded-md shadow">
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

