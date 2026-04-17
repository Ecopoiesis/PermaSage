import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { profile } = req.body;

  const systemPrompt = `You are PermaSage, an expert permaculture design consultant. 
You analyze land profiles and provide actionable, site-specific guidance.
Be practical, specific to the user's climate zone and soil type, and think in terms of 
permaculture zones, guilds, water harvesting, and succession planting.
Keep your response under 800 words. Use clear sections with headers.`;

  const userPrompt = `Analyze this land profile and provide a permaculture design assessment:

Site name: ${profile.name || "Unnamed site"}
Acreage: ${profile.acreage || "Not specified"}
USDA Climate Zone: ${profile.climateZone || "Not specified"}
Soil type: ${profile.soilType || "Not specified"}
Annual rainfall: ${profile.annualRainfall || "Not specified"} inches
Topography: ${profile.topography || "Not specified"}
Goals: ${profile.goals || "General permaculture design"}

Provide:
1. Site assessment — strengths and challenges of this land
2. Zone layout recommendation — what to put in zones 0-5
3. Top 3 plant guilds suited to this site
4. Water management strategy
5. First-year action plan with seasonal timing`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return res.status(200).json({ analysis: text });
  } catch (err) {
    console.error("Claude API error:", err);
    return res.status(500).json({ error: "Analysis failed. Check your API key." });
  }
}