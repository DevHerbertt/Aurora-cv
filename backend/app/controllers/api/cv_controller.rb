module Api
  class CvController < ApplicationController
    def generate
      cv_data = params.permit!.to_h.except("controller", "action")

      latex_content = ClaudeService.new.generate_latex(cv_data)

      if latex_content.nil?
        return render json: { error: "Falha ao gerar o conteúdo LaTeX" }, status: :unprocessable_entity
      end

      pdf_bytes = LatexCompilerService.new.compile(latex_content)

      if pdf_bytes.nil?
        return render json: { error: "Falha ao compilar o PDF" }, status: :unprocessable_entity
      end

      send_data pdf_bytes,
                filename: "curriculo.pdf",
                type: "application/pdf",
                disposition: "inline"
    end
  end
end
