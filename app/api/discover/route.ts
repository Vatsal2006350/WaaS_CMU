import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { description } = await request.json();

    // 1) Load your Perplexity API key from environment
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Perplexity API key" },
        { status: 500 }
      );
    }

    // 2) Validate description
    if (!description) {
      return NextResponse.json(
        { error: "Description is missing or empty" },
        { status: 400 }
      );
    }

    // 3) Build the request payload to Perplexity
    const body = {
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content: "You are a concise AI. Format output in Markdown.",
        },
        {
          role: "user",
          content: `
Here is information about a company: "${description}".
This company is part of a specific category based on the description above.

Please:
1. Identify **the top 5 popular apps based on amount of ratings from apps.apple.com, apps that have gone viral on social media, and buzz in the news** that operate in the **same category** as this company. The name
should only include the app name and each should be different.
2. Give a 3-4 word description of the category , e.g. "Education social media app", "health app", "screen time app" (must have "app" at the end)
3. For each app, use this exact Markdown format:

### 1. AppName
2. A short, plain-text description (no bracketed references such as [1] or [2]).
3. **Do not include** any references, footnotes, disclaimers, or bracketed citations in the text.
4. Make sure these apps are genuinely recognized in that industry and relevant to the given description.

Finally, follow exactly the style:

<App category description here>

### 1. <App Name>
<App description here>

### 2. <App Name>
<App description here>

...and so on, up to ### 5.
          `,
        },
      ],
      max_tokens: 1000,
      temperature: 0.2,
      top_p: 0.9,
      search_domain_filter: null,
      return_images: false,
      return_related_questions: false,
      search_recency_filter: null,
      top_k: 0,
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 1,
      response_format: null,
    };

    // 4) Call Perplexity API
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    // 5) Handle non-200 responses
    if (!response.ok) {
      console.error(
        "Perplexity API error:",
        response.status,
        response.statusText
      );
      return NextResponse.json(
        { error: "Failed to fetch from Perplexity API" },
        { status: 500 }
      );
    }

    // 6) Forward Perplexity data back to client
    const data = await response.json();

    // 7) OPTIONAL: Attempt to scrape logos if the model returns valid iOS app links
    //    But typically you'll do a separate code path or a different route to do the scraping.

    // Return the text as-is:
    const descriptions =
      data["choices"][0]["message"]["content"].match(/^(.*? app)\n/)[1];

    console.log(descriptions);

    console.log(descriptions);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in /api/discover route:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
