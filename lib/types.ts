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
