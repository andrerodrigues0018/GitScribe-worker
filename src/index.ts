import { Hono } from "hono";
import { cors } from 'hono/cors'


const app = new Hono<{ Bindings: CloudflareBindings }>();
app.use(cors())

type GeminiBody = {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
};


app.get("/message", (c) => {
  return c.json({ hello: "World" })
});

app.post('gemini/pr', async (c) => {
	const body = await c.req.json()
  const API_KEY = c.env.GEMINI_API_KEY;

  try {
		const { userStoryName, description } = body;
		const defaultPrompt = `You are a software development assistant. Your task is to generate concise and informative commit messages and descriptions for AWS CodeCommit and Github, based on user-provided information.  You MUST NOT invent or speculate about changes.  Only create the output based on the text provided after "What I did:".
**Instructions:**

1.  **Title:** Create a short, effective title (no Markdown).  The title should follow the format:  '[TICKET-ID] - [Concise Summary of Change]'.
2.  **Description:** Create a detailed description in Markdown format.  This description should:
    *   Clearly explain the purpose of the change (the "why").
		*  	After the resume and Before the bullet points, provide a title "## Changes Made".
    *   Summarize the changes made (the "what").  Use a Markdown unordered list ('-') for multiple changes.  Do *not* use numbered lists.
    *   Use proper English grammar and punctuation.
    *   Be concise but comprehensive.
    *   If a ticket ID or user story name is provided, reference it.
3.  **Output Format:**  Return the title and description within a single JSON object.  The keys MUST be in camelCase. Do not include any other text outside of the JSON. The JSON object must have these keys:
    *   'title':  The commit title (string, no Markdown).
    *   'description': The commit description (string, Markdown formatted).
4. **Glossary**
		* **Ticket ID:** The unique identifier for the ticket or user story.
		* **DNC**: Escola DNC
**Example Input (do not use this in your response, this is just an example):**
Ticket ID: ENG-53
What I did: Created a condition that sends a positive access response for the front-end videoplayer. I verified the course path received in the route payload, and if it contains the "legacy" suffix, it means that the content should be accessible (based on the 3.0 migration business rule). This was done to fix a bug with blocked content on the old platform (data formation legacy).

**Input:**
Ticket ID: ${userStoryName}
What I did: ${description}
`;
		const payload = {
			contents: [
				{
					parts: [{ text: defaultPrompt }],
				},
			],
		};

		const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			throw new Error(`Error: ${response.status} - ${response.statusText}`);
		}
		const data: GeminiBody = await response.json() as GeminiBody;
    let feedbacks = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary available';
		function extrairEParsearJson(str: string) {
			try {

				const inicio = str.indexOf('{');
				const fim = str.lastIndexOf('}');
				if (inicio === -1 || fim === -1) {
						throw new Error("Não foi possível encontrar delimitadores JSON válidos ({ e }).");
				}
				const jsonString = str.substring(inicio, fim + 1);

				const objetoJson = JSON.parse(jsonString);
				return objetoJson;

			} catch (error) {
				console.error("Erro ao extrair ou parsear o JSON:", error);
				return null;
			}
		}
		const jsonData = extrairEParsearJson(feedbacks);

		return c.json({title: jsonData.title, markdown: jsonData.description})
	} catch (error) {
		console.error("Error processing request:", error);
		return new Response("Internal Server Error", { status: 500 });
	}

})

export default app;
