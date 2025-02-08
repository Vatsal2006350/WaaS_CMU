import { AdDiscoveryForm } from "../components/AdDiscoverForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
            Discover Top-Performing
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              TikTok Ads with AI
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Find and analyze successful TikTok campaigns in your industry using
            advanced AI technology
          </p>
        </div>
        <AdDiscoveryForm />
      </main>
    </div>
  );
}
