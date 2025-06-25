import type { QRCodeData } from "../types.js"

export function renderASCII(qrData: QRCodeData, options: { margin?: number } = {}): string {
  const { modules } = qrData
  const margin = options.margin || 2

  let result = ""

  // Add top margin
  const width = (modules[0]?.length ?? 0) + margin * 2
  
  for (let i = 0; i < margin; i++) {
    result += " ".repeat(width) + "\n"
  }

  // Render QR code
  for (const row of modules) {
    result += " ".repeat(margin)

    for (const module of row) {
      result += module ? "██" : "  "
    }

    result += " ".repeat(margin) + "\n"
  }

  // Add bottom margin
  for (let i = 0; i < margin; i++) {
    result += " ".repeat(width) + "\n"
  }

  return result
}
