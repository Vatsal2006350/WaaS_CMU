"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Building, FileText } from "lucide-react";

interface FormData {
  companyName: string;
  description: string;
}

export function AdDiscoveryForm() {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // const res = await fetch("/api/discover", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     companyName: formData.companyName,
      //     description: formData.description,
      //   }),
      // });
      // const data = await res.json();
      // do whatever you want with 'data' (show logos, links, etc.)
    } catch (error) {
      console.error(error);
      // handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="companyName"
            className="text-lg font-medium text-gray-900 mb-2 flex items-center"
          >
            <Building className="w-5 h-5 mr-2" />
            Business or Brand Name
          </label>
          <div className="relative">
            <div className="absolute -inset-x-0.5 -inset-y-0.5 -bottom-[6px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-30"></div>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              className="relative w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              placeholder="Enter your company name"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-lg font-medium text-gray-900 mb-2 flex items-center"
          >
            <FileText className="w-5 h-5 mr-2" />
            Product Description
          </label>
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-30"></div>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="relative w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              placeholder="Describe your product or service..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-medium rounded-xl transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isLoading ? "Discovering Ads..." : "Discover Successful Ads"}
        </button>
      </form>

      <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 text-center border border-purple-100">
        <p className="text-gray-600 text-lg">
          Video previews and analysis will appear here after submission
        </p>
      </div>
    </motion.div>
  );
}
