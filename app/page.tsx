import { AdDiscoveryForm } from "../components/AdDiscoverForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Image
              src="/AdDojo-logo.png"
              alt="AdDojo Logo"
              width={480}
              height={160}
              className="object-contain"
            />
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Find and analyze successful TikTok campaigns in your industry
              using advanced AI technology to create viral Tiktoks.
            </p>
          </div>
        </div>
        <AdDiscoveryForm />
      </main>
    </div>
  );
}
