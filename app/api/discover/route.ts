// app/api/discover/route.ts

import { NextResponse } from 'next/server';

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
    //    This is just an example—tweak as you like
    const body = {
      model: "sonar", // or "sonar-pro", etc.
      messages: [
        { role: "system", content: "Be precise and concise." },
        {
          role: "user",
          content: `We are "${companyName}" offering: "${description}". 
                    Please analyze top TikTok ads in our niche.`,
        },
      ],
      max_tokens: 200,
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
        // Must be in the form: Bearer <YourKey>
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
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
