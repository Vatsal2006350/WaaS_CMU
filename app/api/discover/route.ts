import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { companyName, description } = await request.json();

    // 1) Get your API key from .env
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Perplexity API key" },
        { status: 500 }
      );
    }

    // 2) Build the request payload for Perplexity
    //    We enhance the user content to ask for logos, top 5, etc.
    const body = {
      model: "sonar", // or "sonar-pro", etc.
      messages: [
        {
          role: "system",
          content: "You are a concise AI. Format output in Markdown.",
        },
        {
          role: "user",
          content: `
We are "${companyName}" offering: "${description}".
Provide **5 top companies** that are currently **viral** in the general category of our product and the company description.
Use headings, bullet points, or bold styling in Markdown.
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

    // 3) Call the Perplexity endpoint
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    // If Perplexity returns non-200, handle it
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

    // 4) Return whatever Perplexity gives us
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