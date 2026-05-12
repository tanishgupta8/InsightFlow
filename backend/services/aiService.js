require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'gsk_dummy_fallback_key',
});

async function generateSummary(data) {

  const prompt = `
You are a professional data analyst.

Analyze the following dataset and determine what type of data it contains.

Dataset sample:
${JSON.stringify(data.slice(0, 20))}

Your task:

1. Identify what the dataset represents (sales, education, finance, marketing, etc.).
2. Generate a meaningful analysis based on the detected dataset type.

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

Important rules:
- Do NOT assume the dataset is sales data.
- Determine the context from the columns and values.
- If the dataset is not suitable for trend analysis, explain what insights can still be derived.
`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-8b-instant"
  });

  return completion.choices[0].message.content;
}

module.exports = generateSummary;