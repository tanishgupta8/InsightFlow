require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'gsk_dummy_fallback_key',
});

async function generateSummary(data, customInsight) {
  // Sample up to 100 rows to keep token count optimal and prevent Groq 429 rate limits
  const sampleSize = Math.min(data.length, 100);
  const sampleData = data.slice(0, sampleSize);

  let prompt = `
You are a professional data analyst.

Analyze the following dataset.

Dataset Metadata:
- Total rows in the uploaded file: ${data.length}
- Columns present: ${data.length > 0 ? Object.keys(data[0]).join(", ") : "None"}

Dataset content (showing sample of up to ${sampleSize} rows out of ${data.length} total):
${JSON.stringify(sampleData)}

Important rules:
- Be highly accurate with data facts. If a requested insight cannot be accurately found in the ${sampleSize} sample rows provided, mention that you are analyzing a sample.
- If the user asks for counts or totals, use the "Total rows" metadata above to give accurate numbers rather than manually counting the JSON objects.
- Take a deep breath and work on this step by step. If calculating numbers or finding specific insights, explain your reasoning before giving the final answer.
`;

  if (customInsight && customInsight.trim() !== "") {
    prompt += `
Your task:
The user has asked a specific question or requested a specific insight. 
You must ONLY answer this question. Do not provide a general summary or the default report template.

User Request/Insight: "${customInsight}"
`;
  } else {
    prompt += `
Your task:

1. Identify what the dataset represents (sales, education, finance, marketing, etc.).
2. Generate a meaningful analysis based on the detected dataset type.
3. Do NOT assume the dataset is sales data. Determine the context from the columns and values.

Provide the output in the following structure:

Executive Summary:
Give a short overview of what the dataset contains.

Dataset Type:
Identify what kind of dataset this is.

Key Insights:
List important observations from the data.

Patterns or Trends:
Highlight any trends or patterns found.

Recommendations:
Provide useful recommendations or conclusions based on the data.
`;
  }

  // Candidate models with fallbacks to gracefully handle 429 Rate Limits
  const candidateModels = Array.from(new Set([
    process.env.GROQ_MODEL,
    "groq/compound",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.6-27b"
  ].filter(Boolean)));

  let lastError = null;
  for (const model of candidateModels) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: model,
        max_tokens: 1500
      });
      if (completion && completion.choices && completion.choices[0] && completion.choices[0].message) {
        return completion.choices[0].message.content;
      }
    } catch (err) {
      console.warn(`Groq Model ${model} failed: ${err.message}. Trying next fallback model...`);
      lastError = err;
      if (err.status === 429 || (err.message && err.message.includes("429"))) {
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }

  throw lastError || new Error("Failed to generate summary with all candidate Groq models.");
}

module.exports = generateSummary;