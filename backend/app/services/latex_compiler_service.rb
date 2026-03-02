require "tempfile"
require "open3"

class LatexCompilerService
  def compile(latex_content)
    Dir.mktmpdir("aurora_cv") do |dir|
      tex_path = File.join(dir, "cv.tex")
      pdf_path = File.join(dir, "cv.pdf")

      File.write(tex_path, latex_content)

      # Run pdflatex twice for references/layout
      2.times do
        stdout, stderr, status = Open3.capture3(
          "pdflatex",
          "-interaction=nonstopmode",
          "-output-directory=#{dir}",
          tex_path
        )

        unless status.success?
          log_path = File.join(dir, "cv.log")
          log_content = File.exist?(log_path) ? File.read(log_path).last(2000) : "No log file"
          Rails.logger.error("pdflatex failed:\n#{stderr}\nLog:\n#{log_content}")
          return nil
        end
      end

      return nil unless File.exist?(pdf_path)

      File.binread(pdf_path)
    end
  rescue StandardError => e
    Rails.logger.error("LatexCompilerService error: #{e.message}")
    nil
  end
end
