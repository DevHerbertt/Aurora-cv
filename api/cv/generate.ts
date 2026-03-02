import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateLatex } from "../../lib/claude-service";
import { compileToPdf } from "../../lib/latex-compiler-service";
import type { CvData } from "../../lib/types";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const cvData = req.body as CvData;

    if (!cvData || !cvData.nome || !cvData.email) {
      return res.status(400).json({ error: "Missing required fields: nome, email" });
    }

    // Step 1: Generate LaTeX via Claude
    const latexSource = await generateLatex(cvData);

    // Step 2: Compile LaTeX to PDF
    const pdfBytes = await compileToPdf(latexSource);

    // Step 3: Return PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=cv.pdf");
    return res.send(pdfBytes);
  } catch (error) {
    console.error("CV generation error:", error);
    return res.status(500).json({
      error: "Failed to generate CV",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
