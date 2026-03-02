import { readFileSync } from "fs";
import { join } from "path";
import type { CvData } from "./types";

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";

export async function generateLatex(cvData: CvData): Promise<string> {
  const template = readFileSync(
    join(process.cwd(), "lib/templates/cv_template.tex"),
    "utf-8"
  );

  const systemPrompt = `You are a professional CV writer and LaTeX generator. You receive structured CV data and a LaTeX template.
Your job is to ENHANCE the user's CV content and produce the LaTeX body that goes between \\begin{document} and \\end{document} (do NOT include those lines).

ENHANCEMENT RULES:
- **Resumo (Summary)**: Expand the user's brief summary into a polished 2–3 sentence professional summary. Keep the user's intent but use confident, professional language.
- **Competências (Skills)**: Rephrase informal or brief skills into professional competency descriptions. Elaborate each skill into a clear, professional bullet point. You may add closely related professional soft skills that are reasonable to infer (e.g., if the user mentions "trabalho em equipe", expand to "Colaboração eficaz em equipes multidisciplinares").
- **Experiência / Voluntariado**: Keep all facts (roles, dates, institutions) exactly as provided, but improve the language — make bullet points more action-oriented and professional.
- **Rodapé (Footer)**: If the user provides a footer message, polish it into a professional closing statement. If empty, omit it.
- **NEVER fabricate** roles, dates, institutions, degrees, or qualifications the user did not provide.
- Keep ALL text in Brazilian Portuguese.

LATEX RULES:
- Output ONLY valid LaTeX code. No markdown, no explanations, no code fences.
- Use the exact environments from the template: jobshort (for education entries without bullet items), joblong (for experience/volunteer entries with bullet items).
- Use \\pagestyle{empty} at the start.
- For the header, use a tabularx with the person's name, location, email and phone.
- Escape special LaTeX characters in user data (& % $ # _ { } ~ ^).
- If a section has no data, omit it entirely.
- If a footer message is provided, add it as: \\vfill\\center{\\footnotesize <message>}

Here is the template structure for reference (preamble and environments):
${template}`;

  const userMessage = `Generate the LaTeX CV body for this data:\n${JSON.stringify(cvData)}`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: userMessage }],
      system: systemPrompt,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Claude API error: ${response.status} ${errorBody}`);
    throw new Error(`Claude API error: ${response.status}`);
  }

  const result = await response.json();
  const latexBody: string | undefined = result?.content?.[0]?.text;

  if (!latexBody) {
    throw new Error("Claude returned empty response");
  }

  // Strip markdown code fences that Claude may wrap around the LaTeX output
  const cleaned = latexBody
    .replace(/^```(?:latex)?\s*\n?/, "")
    .replace(/\n?```\s*$/, "");

  // Wrap the body in the full document
  const preamble = template.split("%% CV_CONTENT_HERE %%")[0];
  return `${preamble}${cleaned}\n\\end{document}`;
}
