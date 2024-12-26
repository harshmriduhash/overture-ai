import { RawMessageStreamEvent } from "@anthropic-ai/sdk/resources/messages.mjs";
import { Stream } from "@anthropic-ai/sdk/streaming.mjs";

export function createReadableStream(generator: Stream<RawMessageStreamEvent>) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of generator) {
        if (chunk.type === "content_block_delta" && "text" in chunk.delta) {
          const chunkData = encoder.encode(chunk.delta.text);
          controller.enqueue(chunkData);
        }
      }
      controller.close();
    },
  });
}

export async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let done, value;

  while (!done) {
    ({ done, value } = await reader.read());
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}
