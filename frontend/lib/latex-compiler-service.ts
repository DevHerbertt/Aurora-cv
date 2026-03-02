const LATEX_API_URL = "https://latex.ytotech.com/builds/sync";

export async function compileToPdf(latexSource: string): Promise<Buffer> {
  const response = await fetch(LATEX_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      compiler: "pdflatex",
      resources: [
        {
          main: true,
          content: latexSource,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`LaTeX API error: ${response.status} ${errorBody}`);
    throw new Error(`LaTeX compilation failed: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
