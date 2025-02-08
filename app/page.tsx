import { AdDiscoveryForm } from '../components/AdDiscoverForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-purple-900">
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-8">
            Discover Top-Performing
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
              TikTok Ads with AI
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-purple-100 opacity-90">
            Find and analyze successful TikTok campaigns in your industry using advanced AI technology
          </p>
        </div>
        <AdDiscoveryForm />
      </main>
    </div>
  )
}