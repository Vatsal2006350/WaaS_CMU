"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Building, FileText } from "lucide-react";

// Minimal interface for Perplexity's raw response
interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  choices?: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string; // the raw text
    };
  }[];
}

interface FormData {
  companyName: string;
  description: string;
}

interface CompanyData {
  name: string;
  description: string;
}

// A simple parser to find lines like "### 1. Notion", etc.
// The first line is the name, subsequent lines are the description.
function parseCompanies(text: string): CompanyData[] {
  // This splits on "### 1.", "### 2.", etc. and discards the initial empty chunk
  const blocks = text.split(/###\s+\d+\.\s+/).slice(1);
  // Map each chunk to a name + description
  return blocks.slice(0, 5).map((block) => {
    const lines = block.trim().split("\n");
    // First line might be "**Notion**" or just "Notion"
    const firstLine = lines[0].replace(/\*+/g, "").trim();
    const rest = lines.slice(1).join("\n").trim();
    return {
      name: firstLine || "Unknown",
      description: rest || "No description provided.",
    };
  });
}

export function AdDiscoveryForm() {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  // Store the parsed top five companies
  const [companies, setCompanies] = useState<CompanyData[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowForm(false);

    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          description: formData.description,
        }),
      });

      const data: PerplexityResponse = await res.json();

      // Extract and parse Perplexity's text
      const content = data?.choices?.[0]?.message?.content || "";
      const parsed = parseCompanies(content);
      setCompanies(parsed);
    } catch (error) {
      console.error(error);
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
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="companyName"
              className="text-lg font-medium text-gray-900 mb-2 flex items-center"
            >
              <Building className="w-5 h-5 mr-2 stroke-purple-500" />
              Business or Brand Name
            </label>
            <div className="relative">
              <div
                className="absolute -inset-x-0.5 -inset-y-0.5 -bottom-[6px] 
                  bg-gradient-to-r from-purple-500 to-pink-500 
                  rounded-xl opacity-30"
              />
              <input
                type="text"
                id="companyName"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                className="relative w-full px-4 py-3 bg-gradient-to-r 
                  from-purple-50 to-pink-50 rounded-xl text-gray-900 
                  placeholder-gray-500 focus:outline-none 
                  focus:ring-2 focus:ring-purple-400 
                  focus:border-transparent transition-all"
                placeholder="Enter your company name"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="text-lg font-medium text-gray-900 mb-2 flex items-center"
            >
              <FileText className="w-5 h-5 mr-2 stroke-purple-500" />
              Product Description
            </label>
            <div className="relative">
              <div
                className="absolute -inset-x-0.5 -inset-y-0.5 -bottom-[-.2px] 
                  bg-gradient-to-r from-purple-500 to-pink-500 
                  rounded-xl opacity-30"
              />
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="relative w-full px-4 py-3 bg-gradient-to-r 
                  from-purple-50 to-pink-50 rounded-xl text-gray-900 
                  placeholder-gray-500 focus:outline-none 
                  focus:ring-2 focus:ring-purple-400 
                  focus:border-transparent transition-all"
                placeholder="Describe your product or service..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full flex items-center justify-center px-8 py-4 
              bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 
              hover:to-pink-600 text-white text-lg font-medium rounded-xl 
              transition-all transform hover:scale-[1.02] hover:-translate-y-[2px] 
              focus:outline-none focus:ring-2 focus:ring-purple-400 
              focus:ring-offset-2 disabled:opacity-50 
              disabled:cursor-not-allowed disabled:transform-none"
          >
            <div
              className="absolute -inset-x-0.5 -inset-y-0.5 -bottom-[6px] 
                bg-gradient-to-r from-purple-700 to-pink-700 
                rounded-xl -z-10"
            />
            <Sparkles className="w-5 h-5 mr-2" />
            {isLoading ? "Discovering Ads..." : "Discover Successful Ads"}
          </button>
        </form>
      )}

      <div
        className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 
          rounded-2xl p-6 text-center border border-purple-100"
      >
        {isLoading && (
          <p className="text-gray-600 text-lg">
            Finding top five competitors...
          </p>
        )}

        {/* Show the 5 cards in a flex-wrapped row:
            3 items in the first line, 2 items in the second, centered */}
        {!isLoading && companies.length > 0 && (
          <>
            <p className="text-xl font-semibold text-gray-800 mb-8">
              Top five competitors
            </p>
            <div
              className="flex flex-wrap justify-center gap-6
                         max-w-4xl mx-auto"
            >
              {companies.map((co, index) => (
                <div
                  key={index}
                  className="relative bg-white rounded-xl 
                             px-6 py-4 w-48 text-purple-700 font-semibold 
                             text-lg shadow-sm hover:shadow-md 
                             cursor-pointer group
                             transition-transform transform 
                             hover:-translate-y-1"
                >
                  {/* Company name */}
                  {co.name}

                  {/* Hover tooltip (above the card) */}
                  <div
                    className="absolute bottom-full left-1/2 
                               -translate-x-1/2 mb-2 w-60 
                               bg-white border border-gray-200 
                               rounded-md p-3 text-left text-gray-700 
                               opacity-0 pointer-events-none 
                               group-hover:opacity-100 
                               transition-opacity z-50"
                  >
                    {co.description}
                    {/* Arrow pointing down at the card */}
                    <div
                      className="absolute left-1/2 bottom-[-6px] 
                                 -translate-x-1/2 w-0 h-0 
                                 border-l-6 border-r-6 border-t-6
                                 border-l-transparent 
                                 border-r-transparent 
                                 border-t-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!isLoading && companies.length === 0 && !showForm && (
          <p className="text-gray-600 text-lg">No data to display yet.</p>
        )}

        {showForm && (
          <p className="text-gray-600 text-lg">
            Video previews and analysis will appear here after submission
          </p>
        )}
      </div>
    </motion.div>
  );
}
