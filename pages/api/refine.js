export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()
  const { text } = req.body
  if (!text) return res.status(400).json({ error: "No text provided" })

  const apiKey = process.env.OPENAI_API_KEY
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant that improves writing." },
        { role: "user", content: `Refine this text:\n${text}` },
      ],
    }),
  })
  const data = await response.json()
  const refined = data.choices?.[0]?.message?.content?.trim() || ""
  res.status(200).json({ refined })
}
