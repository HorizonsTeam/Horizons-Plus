import Groq from "groq-sdk";
import { getSystemPrompt } from "./extractionPrompt.js";
import { ExtractionSchema } from "./extractionSchema.js";

let client;
function getClient() {
  if (!client) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY missing in env");
    }
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
}

/**
 * Calls Groq to extract structured travel info from a natural-language query.
 * Returns the parsed and validated object, or throws if anything goes wrong.
 */
export async function extractTravelQuery(query) {
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const completion = await getClient().chat.completions.create({
    model,
    response_format: { type: "json_object" },
    temperature: 0,
    max_tokens: 256,
    messages: [
      { role: "system", content: getSystemPrompt() },
      { role: "user", content: query },
    ],
  });

  const raw = completion.choices?.[0]?.message?.content ?? "";
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Groq returned non-JSON: " + raw.slice(0, 200));
  }

  const validation = ExtractionSchema.safeParse(parsed);
  if (!validation.success) {
    throw new Error(
      "Groq JSON failed schema: " + JSON.stringify(validation.error.issues)
    );
  }

  return validation.data;
}
