import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { description } = await request.json();

    // 1) Get your API key from .env
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Perplexity API key" },
        { status: 500 }
      );
    }

    // 2) Make sure description is present
    if (!description) {
      return NextResponse.json(
        { error: "Description is missing or empty" },
        { status: 400 }
      );
    }

    // 3) Construct prompt so Perplexity returns content in the 
    //    ### 1. SomeApp format needed by parseCompanies
    const body = {
      model: "sonar-pro", // or "sonar-pro", etc.
      messages: [
        {
          role: "system",
          content: "You are a concise AI. Format output in Markdown."
        },
        {
          role: "user",
          content: `
Here is information about a company: "${description}".
Please list the top 5 most popular apps in the industry this company is based in,
and format the answer as follows:

### 1. <Name of App>
A short description about the app or why it's popular.

### 2. <Name of App>
Another short description.

...and so on, up to ### 5.
          `
        }
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
      response_format: null
    };

    // 4) Call the Perplexity endpoint
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    // 5) Check Perplexity response
    if (!response.ok) {
      console.error("Perplexity API error:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Failed to fetch from Perplexity API" },
        { status: 500 }
      );
    }

    // 6) Return parsed response
    const data = await response.json();
    return NextResponse.json(data);

  } catch (err) {
    console.error("Error in /api/discover route:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
