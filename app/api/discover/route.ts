import { NextResponse } from "next/server";
import { SerpAPIWrapper } from "langchain/tools/serpapi";  
import { SystemMessage, HumanMessage } from "langchain/schema";
import axios from "axios";
import * as cheerio from "cheerio";

// Load API keys from environment variables
const SERPAPI_KEY = process.env.SERPAPI_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    console.log("Received Query:", query);

    // Initialize SerpAPI
    const search = new SerpAPIWrapper({ apiKey: SERPAPI_KEY });

    // Perform a web search
    const searchResults = await search.run(query);
    console.log("Search Results:", searchResults);

    // Extract URLs from search results
    const urls = extractUrls(searchResults);
    
    // Scrape content from top search results
    const extractedContent = await scrapeWebPages(urls);

    // Set up OpenAI Chat Model
    const llm = new ChatOpenAI({
      openAIApiKey: OPENAI_API_KEY,
      modelName: "gpt-4o",
      temperature: 0.7,
    });

    // Construct AI prompt
    const messages = [
      new SystemMessage("You are an AI assistant that extracts relevant information from web search results."),
      new HumanMessage(`Based on the following search results, what are the most popular screen time apps in 2025?\n\nSearch Results: ${searchResults}\n\nExtracted Content: ${extractedContent}`)
    ];

    // Generate AI Response
    const response = await llm.call(messages);

    return NextResponse.json({ result: response });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Extract URLs from search results
function extractUrls(searchResults: any): string[] {
  const urls: string[] = [];
  try {
    if (typeof searchResults === "string") {
      const parsedResults = JSON.parse(searchResults);
      if (parsedResults && parsedResults.results) {
        parsedResults.results.forEach((result: any) => {
          if (result.link) urls.push(result.link);
        });
      }
    }
  } catch (error) {
    console.error("Error extracting URLs:", error);
  }
  return urls;
}

// Scrape web pages using Axios and Cheerio
async function scrapeWebPages(urls: string[]): Promise<string> {
  let extractedText = "";
  for (const url of urls.slice(0, 3)) {
    try {
      const { data } = await axios.get(url, { timeout: 5000 });
      const $ = cheerio.load(data);
      extractedText += $("body").text().substring(0, 1000) + "\n\n"; // Limit text per page
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
    }
  }
  return extractedText;
}
