import { useState, useCallback } from "react"
import { Sparkles } from "lucide-react"
import CvForm from "./components/CvForm"
import PdfPreview from "./components/PdfPreview"
import { generateCv } from "./services/api"
import { emptyCvData } from "./types/cv"
import type { CvData } from "./types/cv"

export default function App() {
  const [cvData, setCvData] = useState<CvData>({ ...emptyCvData })
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Revoke previous blob URL
    if (pdfUrl) URL.revokeObjectURL(pdfUrl)

    try {
      const blob = await generateCv(cvData)
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (err) {
      console.error(err)
      setError("Erro ao gerar o currículo. Verifique os dados e tente novamente.")
    } finally {
      setLoading(false)
    }
  }, [cvData, pdfUrl])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-beige-dark bg-beige/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-terra" />
          <h1 className="font-heading text-2xl font-bold tracking-tight">Aurora CV</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Form */}
          <div>
            <p className="text-ink-light mb-6">
              Preencha seus dados abaixo e gere um currículo profissional em PDF.
            </p>
            <CvForm
              data={cvData}
              onChange={setCvData}
              onSubmit={handleSubmit}
              loading={loading}
            />
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Right: PDF Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <PdfPreview pdfUrl={pdfUrl} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-beige-dark mt-16 py-6 text-center text-sm text-ink-light">
        Aurora CV — Gerador de currículos profissionais
      </footer>
    </div>
  )
}
