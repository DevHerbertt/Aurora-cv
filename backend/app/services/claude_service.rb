require "net/http"
require "json"

class ClaudeService
  API_URL = "https://api.anthropic.com/v1/messages"
  MODEL = "claude-haiku-4-5-20251001"

  def generate_latex(cv_data)
    template = File.read(Rails.root.join("lib/templates/cv_template.tex"))

    system_prompt = <<~PROMPT
      You are a LaTeX CV generator. You receive structured CV data and a LaTeX template.
      Your job is to fill in the template with the user's data, producing ONLY the LaTeX content
      that goes between \\begin{document} and \\end{document} (do NOT include those lines).

      Rules:
      - Output ONLY valid LaTeX code, no markdown, no explanations, no code fences.
      - Use the exact environments from the template: jobshort (for education entries without bullet items), joblong (for experience/volunteer entries with bullet items).
      - Use \\pagestyle{empty} at the start.
      - For the header, use a tabularx with the person's name, location, email and phone.
      - Escape special LaTeX characters in user data (& % $ # _ { } ~ ^).
      - If a section has no data, omit it entirely.
      - Keep all text in Portuguese as provided by the user.
      - If a footer message is provided, add it as: \\vfill\\center{\\footnotesize <message>}

      Here is the template structure for reference (preamble and environments):
      #{template}
    PROMPT

    user_message = "Generate the LaTeX CV body for this data:\n#{cv_data.to_json}"

    body = {
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: user_message }],
      system: system_prompt
    }

    uri = URI(API_URL)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.read_timeout = 30

    request = Net::HTTP::Post.new(uri)
    request["Content-Type"] = "application/json"
    request["x-api-key"] = ENV.fetch("ANTHROPIC_API_KEY")
    request["anthropic-version"] = "2023-06-01"
    request.body = body.to_json

    response = http.request(request)

    unless response.is_a?(Net::HTTPSuccess)
      Rails.logger.error("Claude API error: #{response.code} #{response.body}")
      return nil
    end

    result = JSON.parse(response.body)
    latex_body = result.dig("content", 0, "text")

    return nil if latex_body.blank?

    # Wrap the body in the full document
    preamble = template.split("%% CV_CONTENT_HERE %%").first
    "#{preamble}#{latex_body}\n\\end{document}"
  rescue StandardError => e
    Rails.logger.error("ClaudeService error: #{e.message}")
    nil
  end
end
