require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'gsk_dummy_fallback_key',
});

async function generateSummary(data, customInsight) {

  let prompt = `
You are a professional data analyst.

Analyze the following dataset.

Dataset Metadata:
- Total rows in the uploaded file: ${data.length}
- Columns present: ${data.length > 0 ? Object.keys(data[0]).join(", ") : "None"}

Dataset content (showing up to 1000 rows):
${JSON.stringify(data.slice(0, 1000))}

Important rules:
- Be highly accurate with data facts. If a requested insight cannot be accurately found in the 1000 rows provided, mention that you are analyzing a sample.
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

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile"
  });

  return completion.choices[0].message.content;
}

module.exports = generateSummary;