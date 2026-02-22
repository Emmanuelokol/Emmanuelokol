/**
 * Claude (Anthropic) API helper — prepared for future features:
 *   • Symptom checking  (user describes symptoms → suggestions)
 *   • Prevention tips    (based on profile conditions & region)
 *
 * IMPORTANT: Never call this from the client.
 * Route requests through a server endpoint / Edge Function so the
 * ANTHROPIC_API_KEY stays secret.
 *
 * Example Supabase Edge Function usage:
 *   const tips = await askClaude({
 *     systemPrompt: PREVENTION_SYSTEM_PROMPT,
 *     userMessage: "I have high blood pressure and live in Kampala.",
 *   });
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

interface ClaudeRequestOptions {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
}

interface ClaudeResponse {
  content: string;
  error?: string;
}

/**
 * Send a message to Claude. Only call from a secure server context
 * (Supabase Edge Function, API route, etc.)
 */
export async function askClaude({
  systemPrompt,
  userMessage,
  maxTokens = 1024,
}: ClaudeRequestOptions): Promise<ClaudeResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return { content: "", error: "ANTHROPIC_API_KEY is not configured" };
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      return { content: "", error: `API returned ${response.status}` };
    }

    const data = await response.json();
    const text =
      data.content?.[0]?.type === "text" ? data.content[0].text : "";

    return { content: text };
  } catch {
    return { content: "", error: "Failed to reach Claude API" };
  }
}

/** System prompt for symptom-checking conversations. */
export const SYMPTOM_CHECK_PROMPT = `You are a friendly health assistant for Hommatt Health, a healthcare app used in Uganda.
When a user describes symptoms:
1. Ask clarifying questions if needed (one at a time).
2. Suggest possible conditions in simple, non-scary language.
3. Always recommend visiting a nearby health facility for proper diagnosis.
4. Never provide a definitive diagnosis — you are an assistant, not a doctor.
Keep responses short and easy to understand.`;

/** System prompt for prevention tips. */
export const PREVENTION_TIPS_PROMPT = `You are a friendly health educator for Hommatt Health, a healthcare app in Uganda.
Given a user's health conditions and location, provide 3-5 practical prevention tips.
Use simple language (primary-school reading level).
Focus on affordable, locally available actions.
Keep each tip to 1-2 sentences.`;
