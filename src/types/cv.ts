export interface Education {
  titulo: string
  datas: string
}

export interface Experience {
  titulo: string
  datas: string
  itens: string[]
}

export interface CvData {
  nome: string
  localizacao: string
  email: string
  telefone: string
  resumo: string
  formacao: Education[]
  experiencia: Experience[]
  voluntariado: Experience[]
  competencias: string[]
  rodape: string
}

export const emptyCvData: CvData = {
  nome: "",
  localizacao: "",
  email: "",
  telefone: "",
  resumo: "",
  formacao: [{ titulo: "", datas: "" }],
  experiencia: [{ titulo: "", datas: "", itens: [""] }],
  voluntariado: [{ titulo: "", datas: "", itens: [""] }],
  competencias: [""],
  rodape: "",
}
