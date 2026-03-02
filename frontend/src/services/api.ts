import axios from "axios"
import type { CvData } from "../types/cv"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export async function generateCv(data: CvData): Promise<Blob> {
  const response = await axios.post(`${API_URL}/api/cv/generate`, data, {
    responseType: "blob",
  })
  return response.data
}
