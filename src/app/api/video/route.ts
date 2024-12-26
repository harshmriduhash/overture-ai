import { NextResponse } from "next/server";
import Replicate from "replicate";

import { streamToBuffer } from "@/lib/streamUtils";
import { executeFeature } from "@/lib/subscriptionUtils";

const replicate = new Replicate({
  auth: process.env["REPLICATE_API_TOKEN"],
});

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, userSubscription } = body;

  if (!process.env["REPLICATE_API_TOKEN"]) {
    return new Response("Replicate API key not configured", { status: 500 });
  }

  if (!messages) {
    return new Response("Messages are required", { status: 400 });
  }

  try {
    const model =
      "lucataco/hotshot-xl:78b3a6257e16e4b241245d65c8b2b81ea2e1ff7ed4c55306b511509ddbfd327a";
    const input = {
      mp4: true,
      seed: 6226,
      steps: 90,
      width: 672,
      height: 384,
      prompt: messages,
      scheduler: "EulerAncestralDiscreteScheduler",
      negative_prompt: "blurry",
    };
    const check = await executeFeature(userSubscription);
    if (check) {
      const output = (await replicate.run(model, { input })) as ReadableStream;
      const buffer = await streamToBuffer(output);
      const videoBase64 = buffer.toString("base64");

      return NextResponse.json({
        videoBase64: `data:video/mp4;base64,${videoBase64}`,
      });
    } else {
      return new NextResponse("NOT_OK", { status: 403 });
    }
  } catch (error) {
    console.error("[VIDEO_ROUTE] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
