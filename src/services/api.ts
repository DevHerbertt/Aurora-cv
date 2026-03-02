import axios from "axios"
import type { CvData } from "../types/cv"

export async function generateCv(data: CvData): Promise<Blob> {
  const response = await axios.post("/api/cv/generate", data, {
    responseType: "blob",
  })
  return response.data
}
