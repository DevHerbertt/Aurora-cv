import { Plus, Trash2, Loader2 } from "lucide-react"
import type { CvData, Education, Experience } from "../types/cv"

interface CvFormProps {
  data: CvData
  onChange: (data: CvData) => void
  onSubmit: () => void
  loading: boolean
}

const inputClass =
  "w-full rounded-lg border border-beige-dark bg-white px-4 py-2.5 font-body text-ink placeholder:text-ink-light/50 focus:outline-none focus:ring-2 focus:ring-terra/40 focus:border-terra transition-colors"

const labelClass = "block text-sm font-medium text-ink-light mb-1"

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-xl font-semibold text-ink mt-8 mb-4 pb-2 border-b border-beige-dark">
      {children}
    </h2>
  )
}

export default function CvForm({ data, onChange, onSubmit, loading }: CvFormProps) {
  const set = <K extends keyof CvData>(key: K, value: CvData[K]) =>
    onChange({ ...data, [key]: value })

  // Education helpers
  const updateFormacao = (index: number, field: keyof Education, value: string) => {
    const updated = [...data.formacao]
    updated[index] = { ...updated[index], [field]: value }
    set("formacao", updated)
  }

  const addFormacao = () => set("formacao", [...data.formacao, { titulo: "", datas: "" }])

  const removeFormacao = (index: number) => {
    if (data.formacao.length > 1) set("formacao", data.formacao.filter((_, i) => i !== index))
  }

  // Experience helpers
  const updateExperiencia = (index: number, field: keyof Experience, value: string | string[]) => {
    const updated = [...data.experiencia]
    updated[index] = { ...updated[index], [field]: value }
    set("experiencia", updated)
  }

  const addExperiencia = () =>
    set("experiencia", [...data.experiencia, { titulo: "", datas: "", itens: [""] }])

  const removeExperiencia = (index: number) => {
    if (data.experiencia.length > 1)
      set("experiencia", data.experiencia.filter((_, i) => i !== index))
  }

  const addExperienciaItem = (expIndex: number) => {
    const updated = [...data.experiencia]
    updated[expIndex] = { ...updated[expIndex], itens: [...updated[expIndex].itens, ""] }
    set("experiencia", updated)
  }

  const removeExperienciaItem = (expIndex: number, itemIndex: number) => {
    const updated = [...data.experiencia]
    if (updated[expIndex].itens.length > 1) {
      updated[expIndex] = {
        ...updated[expIndex],
        itens: updated[expIndex].itens.filter((_, i) => i !== itemIndex),
      }
      set("experiencia", updated)
    }
  }

  const updateExperienciaItem = (expIndex: number, itemIndex: number, value: string) => {
    const updated = [...data.experiencia]
    const itens = [...updated[expIndex].itens]
    itens[itemIndex] = value
    updated[expIndex] = { ...updated[expIndex], itens }
    set("experiencia", updated)
  }

  // Volunteer helpers
  const updateVoluntariado = (index: number, field: keyof Experience, value: string | string[]) => {
    const updated = [...data.voluntariado]
    updated[index] = { ...updated[index], [field]: value }
    set("voluntariado", updated)
  }

  const addVoluntariado = () =>
    set("voluntariado", [...data.voluntariado, { titulo: "", datas: "", itens: [""] }])

  const removeVoluntariado = (index: number) => {
    if (data.voluntariado.length > 1)
      set("voluntariado", data.voluntariado.filter((_, i) => i !== index))
  }

  const addVoluntariadoItem = (volIndex: number) => {
    const updated = [...data.voluntariado]
    updated[volIndex] = { ...updated[volIndex], itens: [...updated[volIndex].itens, ""] }
    set("voluntariado", updated)
  }

  const removeVoluntariadoItem = (volIndex: number, itemIndex: number) => {
    const updated = [...data.voluntariado]
    if (updated[volIndex].itens.length > 1) {
      updated[volIndex] = {
        ...updated[volIndex],
        itens: updated[volIndex].itens.filter((_, i) => i !== itemIndex),
      }
      set("voluntariado", updated)
    }
  }

  const updateVoluntariadoItem = (volIndex: number, itemIndex: number, value: string) => {
    const updated = [...data.voluntariado]
    const itens = [...updated[volIndex].itens]
    itens[itemIndex] = value
    updated[volIndex] = { ...updated[volIndex], itens }
    set("voluntariado", updated)
  }

  // Skills helpers
  const updateCompetencia = (index: number, value: string) => {
    const updated = [...data.competencias]
    updated[index] = value
    set("competencias", updated)
  }

  const addCompetencia = () => set("competencias", [...data.competencias, ""])

  const removeCompetencia = (index: number) => {
    if (data.competencias.length > 1)
      set("competencias", data.competencias.filter((_, i) => i !== index))
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="space-y-2"
    >
      {/* Dados Pessoais */}
      <SectionTitle>Dados Pessoais</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>Nome completo</label>
          <input
            className={inputClass}
            value={data.nome}
            onChange={(e) => set("nome", e.target.value)}
            placeholder="Maria da Silva"
            required
          />
        </div>
        <div>
          <label className={labelClass}>Localização</label>
          <input
            className={inputClass}
            value={data.localizacao}
            onChange={(e) => set("localizacao", e.target.value)}
            placeholder="São Paulo/SP"
          />
        </div>
        <div>
          <label className={labelClass}>E-mail</label>
          <input
            type="email"
            className={inputClass}
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="email@exemplo.com"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Telefone</label>
          <input
            className={inputClass}
            value={data.telefone}
            onChange={(e) => set("telefone", e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      {/* Resumo */}
      <SectionTitle>Resumo</SectionTitle>
      <textarea
        className={`${inputClass} min-h-[120px] resize-y`}
        value={data.resumo}
        onChange={(e) => set("resumo", e.target.value)}
        placeholder="Breve resumo profissional..."
        rows={4}
      />

      {/* Formação Acadêmica */}
      <SectionTitle>Formação Acadêmica</SectionTitle>
      <div className="space-y-4">
        {data.formacao.map((edu, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  className={inputClass}
                  value={edu.titulo}
                  onChange={(e) => updateFormacao(i, "titulo", e.target.value)}
                  placeholder="Curso ou instituição"
                />
              </div>
              <input
                className={inputClass}
                value={edu.datas}
                onChange={(e) => updateFormacao(i, "datas", e.target.value)}
                placeholder="2020 -- 2024"
              />
            </div>
            <button
              type="button"
              onClick={() => removeFormacao(i)}
              className="mt-1 p-2 text-ink-light hover:text-red-600 transition-colors"
              title="Remover"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addFormacao}
          className="inline-flex items-center gap-1.5 text-sm text-terra hover:text-terra-dark font-heading font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Adicionar formação
        </button>
      </div>

      {/* Experiência Profissional */}
      <SectionTitle>Experiência Profissional</SectionTitle>
      <div className="space-y-6">
        {data.experiencia.map((exp, i) => (
          <div key={i} className="rounded-lg border border-beige-dark bg-white/50 p-4 space-y-3">
            <div className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    className={inputClass}
                    value={exp.titulo}
                    onChange={(e) => updateExperiencia(i, "titulo", e.target.value)}
                    placeholder="Cargo -- Empresa"
                  />
                </div>
                <input
                  className={inputClass}
                  value={exp.datas}
                  onChange={(e) => updateExperiencia(i, "datas", e.target.value)}
                  placeholder="01/2023 -- atual"
                />
              </div>
              <button
                type="button"
                onClick={() => removeExperiencia(i)}
                className="mt-1 p-2 text-ink-light hover:text-red-600 transition-colors"
                title="Remover"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 pl-2">
              {exp.itens.map((item, j) => (
                <div key={j} className="flex gap-2 items-center">
                  <span className="text-ink-light text-xs">•</span>
                  <input
                    className={`${inputClass} text-sm`}
                    value={item}
                    onChange={(e) => updateExperienciaItem(i, j, e.target.value)}
                    placeholder="Descreva uma atividade..."
                  />
                  <button
                    type="button"
                    onClick={() => removeExperienciaItem(i, j)}
                    className="p-1 text-ink-light hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addExperienciaItem(i)}
                className="inline-flex items-center gap-1 text-xs text-terra hover:text-terra-dark font-heading font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar item
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addExperiencia}
          className="inline-flex items-center gap-1.5 text-sm text-terra hover:text-terra-dark font-heading font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Adicionar experiência
        </button>
      </div>

      {/* Trabalho Voluntário */}
      <SectionTitle>Trabalho Voluntário</SectionTitle>
      <div className="space-y-6">
        {data.voluntariado.map((vol, i) => (
          <div key={i} className="rounded-lg border border-beige-dark bg-white/50 p-4 space-y-3">
            <div className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    className={inputClass}
                    value={vol.titulo}
                    onChange={(e) => updateVoluntariado(i, "titulo", e.target.value)}
                    placeholder="Organização ou projeto"
                  />
                </div>
                <input
                  className={inputClass}
                  value={vol.datas}
                  onChange={(e) => updateVoluntariado(i, "datas", e.target.value)}
                  placeholder="2019 -- atual"
                />
              </div>
              <button
                type="button"
                onClick={() => removeVoluntariado(i)}
                className="mt-1 p-2 text-ink-light hover:text-red-600 transition-colors"
                title="Remover"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 pl-2">
              {vol.itens.map((item, j) => (
                <div key={j} className="flex gap-2 items-center">
                  <span className="text-ink-light text-xs">•</span>
                  <input
                    className={`${inputClass} text-sm`}
                    value={item}
                    onChange={(e) => updateVoluntariadoItem(i, j, e.target.value)}
                    placeholder="Descreva uma atividade..."
                  />
                  <button
                    type="button"
                    onClick={() => removeVoluntariadoItem(i, j)}
                    className="p-1 text-ink-light hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addVoluntariadoItem(i)}
                className="inline-flex items-center gap-1 text-xs text-terra hover:text-terra-dark font-heading font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar item
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addVoluntariado}
          className="inline-flex items-center gap-1.5 text-sm text-terra hover:text-terra-dark font-heading font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Adicionar voluntariado
        </button>
      </div>

      {/* Aptidões e Competências */}
      <SectionTitle>Aptidões e Competências</SectionTitle>
      <div className="space-y-3">
        {data.competencias.map((comp, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className={inputClass}
              value={comp}
              onChange={(e) => updateCompetencia(i, e.target.value)}
              placeholder="Ex: Trabalho em equipe, comunicação clara..."
            />
            <button
              type="button"
              onClick={() => removeCompetencia(i)}
              className="p-2 text-ink-light hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCompetencia}
          className="inline-flex items-center gap-1.5 text-sm text-terra hover:text-terra-dark font-heading font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Adicionar competência
        </button>
      </div>

      {/* Rodapé */}
      <SectionTitle>Mensagem de Rodapé</SectionTitle>
      <textarea
        className={`${inputClass} min-h-[80px] resize-y`}
        value={data.rodape}
        onChange={(e) => set("rodape", e.target.value)}
        placeholder="Mensagem opcional no final do currículo..."
        rows={2}
      />

      {/* Submit */}
      <div className="pt-8 pb-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-terra hover:bg-terra-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-heading font-semibold text-lg px-6 py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Gerando currículo...
            </>
          ) : (
            "Gerar Currículo"
          )}
        </button>
      </div>
    </form>
  )
}
