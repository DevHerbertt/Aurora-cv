import { Download, FileText } from "lucide-react"

interface PdfPreviewProps {
  pdfUrl: string | null
}

export default function PdfPreview({ pdfUrl }: PdfPreviewProps) {
  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-ink-light">
        <FileText className="w-16 h-16 mb-4 opacity-30" />
        <p className="font-heading text-lg">Seu currículo aparecerá aqui</p>
        <p className="text-sm mt-1 opacity-60">Preencha o formulário e clique em gerar</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading text-xl font-semibold">Pré-visualização</h2>
        <a
          href={pdfUrl}
          download="curriculo.pdf"
          className="inline-flex items-center gap-2 bg-terra hover:bg-terra-dark text-white font-heading font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Baixar PDF
        </a>
      </div>
      <iframe
        src={pdfUrl}
        className="w-full rounded-lg border border-beige-dark"
        style={{ height: "80vh" }}
        title="Pré-visualização do currículo"
      />
    </div>
  )
}
