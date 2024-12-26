import { NextResponse } from "next/server";
import OpenAI from "openai";

import { executeFeature } from "@/lib/subscriptionUtils";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, userSubscription } = body;

  if (!process.env["OPENAI_API_KEY"]) {
    return new Response("OpenAi API key not configured", { status: 500 });
  }

  if (!messages) {
    return new Response("Messages are required", { status: 400 });
  }

  try {
    const check = await executeFeature(userSubscription);
    if (check) {
      const response = await client.images.generate({
        prompt: messages,
        model: "dall-e-2",
        n: 4,
        quality: "standard",
        response_format: "b64_json",
        size: "256x256",
      });

      return NextResponse.json(response.data);
    } else {
      return new NextResponse("NOT_OK", { status: 403 });
    }
  } catch (error) {
    console.error("[IMAGE_ROUTE] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
