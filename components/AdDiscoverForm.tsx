"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Building, FileText } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import ReactVideoEditor from "@/components/editor/version-5.0.0/react-video-editor";
import { SidebarProvider } from "@/components/ui/sidebar";

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
  logo?: string;
  selected?: boolean;
  /** The short "Category" line extracted from the first line of the response (e.g. "Productivity app") */
  shortDescription?: string;
  tiktoks?: string[];
}

/**
 * Parse the Perplexity response for 5 apps.
 * We expect the rest of the text to be in a "### 1. AppName" format.
 */
function parseCompanies(text: string): CompanyData[] {
  // Split on "### 1.", "### 2.", etc.
  const blocks = text.split(/###\s+\d+\.\s+/).slice(1);

  return blocks.slice(0, 5).map((block) => {
    const lines = block.trim().split("\n");
    const firstLine = lines[0].replace(/\*+/g, "").trim();

    // Everything after the first line is the app description
    const rest = lines.slice(1).join("\n").trim();

    // Attempt to find a "Logo:" line
    let logo: string | undefined;
    const logoRegex = /Logo:\s*(https?:\/\/[^\s]+)/i;
    const logoMatch = rest.match(logoRegex);

    if (logoMatch) {
      logo = logoMatch[1];
    }

    return {
      name: firstLine || "Unknown",
      description: rest || "No description provided.",
      logo,
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

  // List of parsed apps + their shortDescription
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [showSelected, setShowSelected] = useState(false);

  // Add new state for TikTok loading
  const [isFetchingTikToks, setIsFetchingTikToks] = useState(false);

  // Add new state for selected TikToks
  const [selectedTikToks, setSelectedTikToks] = useState<string[]>([]);

  // Add state for AI processing
  const [isProcessingAi, setIsProcessingAi] = useState(false);

  // Add state for showing editor
  const [showEditor, setShowEditor] = useState(false);

  /**
   * Sends selected apps to your /scrape endpoint, passing [name, shortDescription].
   * Only fetches TikToks for companies that don't already have them.
   */
  async function getTikTokUrls(companies: CompanyData[]) {
    setIsFetchingTikToks(true);

    // Filter to only companies that don't have TikToks yet
    const companiesNeedingTikToks = companies.filter(
      (company) => !company.tiktoks
    );

    if (companiesNeedingTikToks.length === 0) {
      setIsFetchingTikToks(false);
      setShowSelected(true);
      return;
    }

    const appDescriptions = companiesNeedingTikToks.map((company) => [
      company.name,
      company.shortDescription,
    ]);

    try {
      console.log("Fetching TikToks for:", appDescriptions);
      const response = await axios.post("http://localhost:8000/scrape", {
        app_descriptions: [appDescriptions],
        num_vids_each: 2,
      });
      const data = response.data;

      // Update companies with their TikTok URLs, preserving existing ones
      setCompanies((prevCompanies) => {
        return prevCompanies.map((company) => {
          // If company already has TikToks, keep them
          if (company.tiktoks) {
            return company;
          }
          // Otherwise, add new TikToks if available
          const companyTikToks = data[company.name];
          return companyTikToks
            ? {
                ...company,
                tiktoks: companyTikToks,
              }
            : company;
        });
      });
    } catch (error) {
      console.error("Error fetching TikTok URLs:", error);
    } finally {
      setIsFetchingTikToks(false);
      setShowSelected(true);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
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
      const content = data?.choices?.[0]?.message?.content || "";

      // 1) Extract the first line (short category description),
      //    e.g. "Productivity app"
      const lines = content.split("\n");
      const categoryDescription = lines[0]?.trim() || "";

      // 2) Parse the rest of the text into actual app data
      const parsedApps = parseCompanies(content);

      // 3) Attach the short description from line[0] to each app
      const finalCompanies = parsedApps.map((app) => ({
        ...app,
        shortDescription: categoryDescription,
      }));

      setCompanies(finalCompanies);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function toggleCompany(companyName: string) {
    setSelectedCompanies((prev) =>
      prev.includes(companyName)
        ? prev.filter((name) => name !== companyName)
        : [...prev, companyName]
    );
  }

  function handleNewChat() {
    setFormData({ companyName: "", description: "" });
    setCompanies([]);
    setSelectedCompanies([]);
    setShowSelected(false);
    setShowForm(true);
  }

  // Add toggle function for TikToks
  const toggleTikTokSelection = (tiktokUrl: string) => {
    setSelectedTikToks((prev) =>
      prev.includes(tiktokUrl)
        ? prev.filter((url) => url !== tiktokUrl)
        : [...prev, tiktokUrl]
    );
  };

  // Modify sendTikToksToAi to show editor after processing
  const sendTikToksToAi = async () => {
    if (selectedTikToks.length === 0) {
      alert("Please select at least one TikTok video");
      return;
    }

    setIsProcessingAi(true);
    try {
      const response = await axios.post(
        "http://localhost:6000/process-tiktoks",
        {
          tiktoks: selectedTikToks,
        }
      );

      console.log("AI Processing Response:", response.data);
      setShowEditor(true); // Show editor after successful processing
    } catch (error) {
      console.error("Error processing TikToks:", error);
      alert("Error processing TikToks. Please try again.");
    } finally {
      setIsProcessingAi(false);
    }
  };

  return (
    <>
      <div suppressHydrationWarning>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* The Input Form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 max-w-4xl mx-auto"
            >
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as unknown as React.FormEvent);
                      }
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full flex items-center justify-center px-8 py-3 
                bg-white text-white text-lg font-medium rounded-full 
                transition-all transform hover:scale-[1.02] hover:-translate-y-[2px] 
                focus:outline-none focus:ring-2 focus:ring-purple-200 
                focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed 
                disabled:transform-none group"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/95 
                to-pink-500/95 rounded-full backdrop-blur-sm"
                />
                <div
                  className="absolute -inset-1.5 bg-gradient-to-r from-purple-600/60 
                to-pink-600/60 rounded-full blur-md"
                />
                <div className="relative flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 stroke-white" />
                  <span className="leading-6 inline-block mt-0.5">
                    {isLoading
                      ? "Discovering Ads..."
                      : "Discover Successful Ads"}
                  </span>
                </div>
              </button>

              {/* Add Video Editor */}
            </form>
          )}

          {/* Results + Actions */}
          <div className="relative mt-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-30"></div>
            <div className="relative bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 text-center">
              {isLoading && (
                <>
                  <p className="text-gray-600 text-lg mb-4">
                    Finding top five competitors...
                  </p>
                  <div className="flex justify-center items-center">
                    <div className="flex items-center bg-black text-white px-4 py-1.5 rounded-full">
                      <span className="text-sm mr-2">
                        powered by perplexity
                      </span>
                      <Image
                        src="/perplexity.png"
                        alt="Perplexity Logo"
                        width={20}
                        height={20}
                        className="inline-block"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Show competitor list */}
              {!isLoading && companies.length > 0 && !showSelected && (
                <div className="relative">
                  {/* Loading overlay */}
                  {isFetchingTikToks && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-700 font-medium">
                          Finding TikToks...
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="text-2xl font-semibold text-gray-800 mb-10">
                    Top five competitors
                  </p>
                  <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
                    {companies.map((co, index) => (
                      <div
                        key={index}
                        onClick={() => toggleCompany(co.name)}
                        className={`relative bg-white rounded-xl px-6 py-4 
                        min-w-[12rem] max-w-[16rem] text-purple-700 font-semibold text-lg 
                        shadow-sm hover:shadow-md cursor-pointer group transition-all 
                        transform hover:-translate-y-1
                        ${
                          selectedCompanies.includes(co.name)
                            ? "ring-2 ring-purple-500"
                            : ""
                        }`}
                      >
                        {selectedCompanies.includes(co.name) && (
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-30 -z-10" />
                        )}

                        {/* Center the name (and optional logo) */}
                        <div className="flex justify-center text-center">
                          <div className="break-words">{co.name}</div>
                        </div>

                        {/* Hover tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-white border border-gray-200 rounded-md p-3 text-left text-gray-700 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                          {co.description}
                          <div className="absolute left-1/2 bottom-[-6px] -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col items-center">
                    {selectedCompanies.length > 0 && (
                      <button
                        onClick={() => {
                          // First fetch TikToks, then show selected view after they're loaded
                          getTikTokUrls(
                            companies.filter((co) =>
                              selectedCompanies.includes(co.name)
                            )
                          ).then(() => {
                            setShowSelected(true);
                          });
                        }}
                        className="mt-8 relative px-8 py-3 bg-white text-white text-lg 
                        font-medium rounded-full transition-all transform hover:scale-[1.02] 
                        hover:-translate-y-[2px] focus:outline-none focus:ring-2 
                        focus:ring-purple-200 focus:ring-offset-2 group"
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/95 
                        to-pink-500/95 rounded-full backdrop-blur-sm"
                        />
                        <div
                          className="absolute -inset-1.5 bg-gradient-to-r from-purple-600/60 
                        to-pink-600/60 rounded-full blur-md"
                        />
                        <div className="relative flex items-center justify-center">
                          <span className="leading-6 inline-block mt-0.5">
                            Next
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                  {/* Restart button */}
                  <div className="absolute bottom-4 left-4">
                    <button
                      onClick={handleNewChat}
                      className="px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-400 text-white text-sm font-medium rounded-lg transition-all transform hover:scale-[1.02] hover:-translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    >
                      <div className="absolute -inset-x-0.5 -inset-y-0.5 -bottom-[4px] bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg -z-10" />
                      <span className="leading-5">Restart</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Show selected companies */}
              {!isLoading && companies.length > 0 && showSelected && (
                <>
                  <p className="text-2xl font-semibold text-gray-800 mb-10">
                    Selected Companies
                  </p>
                  <div className="flex justify-center gap-8 max-w-5xl mx-auto">
                    {companies
                      .filter((co) => selectedCompanies.includes(co.name))
                      .map((co, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className="relative bg-white rounded-xl px-6 py-4 w-48 
                          text-purple-700 font-semibold text-lg shadow-sm mb-2"
                          >
                            <div
                              className="absolute -inset-0.5 bg-gradient-to-r 
                            from-purple-500 to-pink-500 rounded-xl opacity-30 -z-10"
                            />
                            <div className="text-center">{co.name}</div>
                          </div>
                          <span className="text-gray-600 mb-4">TikToks</span>
                          {/* Display TikTok videos */}
                          <div className="flex flex-col gap-4">
                            {co.tiktoks?.map((tiktokUrl, idx) => (
                              <div key={idx} className="w-[250px]">
                                <div className="relative">
                                  {/* Loading placeholder */}
                                  <div className="absolute inset-0 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                  </div>

                                  <blockquote
                                    className="tiktok-embed"
                                    cite={tiktokUrl}
                                    data-video-id={
                                      tiktokUrl.split("/video/")[1]
                                    }
                                    data-autoplay="false"
                                  >
                                    <section>
                                      <a
                                        target="_blank"
                                        href={tiktokUrl}
                                        rel="noreferrer"
                                      >
                                        Loading...
                                      </a>
                                    </section>
                                  </blockquote>
                                  <script
                                    async
                                    src="https://www.tiktok.com/embed.js"
                                  ></script>
                                </div>

                                {/* Selection button */}
                                <button
                                  onClick={() =>
                                    toggleTikTokSelection(tiktokUrl)
                                  }
                                  className={`mt-2 w-full px-4 py-2 rounded-lg font-medium transition-all
                                  ${
                                    selectedTikToks.includes(tiktokUrl)
                                      ? "bg-purple-500 text-white hover:bg-purple-600"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  {selectedTikToks.includes(tiktokUrl)
                                    ? "Deselect"
                                    : "Select"}
                                </button>
                              </div>
                            ))}
                            {!co.tiktoks && !isFetchingTikToks && (
                              <p className="text-gray-500 text-sm">
                                No TikToks found
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Navigation and AI Analysis buttons */}
                  <div className="flex flex-col items-center gap-4 mt-8">
                    <button
                      onClick={() => setShowSelected(false)}
                      className="relative px-8 py-3 bg-white text-white text-lg 
                      font-medium rounded-full transition-all transform hover:scale-[1.02] 
                      hover:-translate-y-[2px] focus:outline-none focus:ring-2 
                      focus:ring-purple-200 focus:ring-offset-2 group"
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/95 
                      to-pink-500/95 rounded-full backdrop-blur-sm"
                      />
                      <div
                        className="absolute -inset-1.5 bg-gradient-to-r from-purple-600/60 
                      to-pink-600/60 rounded-full blur-md"
                      />
                      <div className="relative flex items-center justify-center">
                        <span className="leading-6 inline-block mt-0.5">
                          Back
                        </span>
                      </div>
                    </button>

                    {/* AI Analysis button */}
                    {selectedTikToks.length > 0 && (
                      <button
                        onClick={sendTikToksToAi}
                        disabled={isProcessingAi}
                        className={`relative px-8 py-3 bg-white text-white text-lg 
                        font-medium rounded-full transition-all transform hover:scale-[1.02] 
                        hover:-translate-y-[2px] focus:outline-none focus:ring-2 
                        focus:ring-purple-200 focus:ring-offset-2 group
                        ${
                          isProcessingAi ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/95 
                        to-pink-500/95 rounded-full backdrop-blur-sm"
                        />
                        <div
                          className="absolute -inset-1.5 bg-gradient-to-r from-purple-600/60 
                        to-pink-600/60 rounded-full blur-md"
                        />
                        <div className="relative flex items-center justify-center">
                          <span className="leading-6 inline-block mt-0.5">
                            {isProcessingAi
                              ? "Analyzing..."
                              : "Analyze with AI"}
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* No data + form hidden */}
              {!isLoading && companies.length === 0 && !showForm && (
                <>
                  <p className="text-gray-600 text-lg">
                    No data to display yet.
                  </p>
                  <button
                    onClick={handleNewChat}
                    className="mt-4 relative px-8 py-4 bg-gradient-to-r 
                    from-gray-300 to-gray-400 text-white text-lg font-medium 
                    rounded-xl transition-all transform hover:scale-[1.02] 
                    hover:-translate-y-[2px] focus:outline-none 
                    focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    <div
                      className="absolute -inset-x-0.5 -inset-y-0.5 -bottom-[6px] 
                      bg-gradient-to-r from-gray-500 to-gray-600 
                      rounded-xl -z-10"
                    />
                    New Chat
                  </button>
                </>
              )}

              {/* Prompt to fill form (initial state) */}
              {showForm && (
                <p className="text-gray-600 text-lg">
                  Video previews and analysis will appear here after submission
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Show video editor after AI analysis */}
      {showEditor && (
        <div className="mt-8 max-w-full">
          <SidebarProvider
            style={{ "--sidebar-width": "350px" } as React.CSSProperties}
          >
            <ReactVideoEditor recommendedOverlays={[]} defaultVideos={[]} />
          </SidebarProvider>
        </div>
      )}
    </>
  );
}
