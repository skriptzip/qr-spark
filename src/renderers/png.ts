import type { QRCodeData } from "../types.js"

export interface PNGOptions {
  margin?: number
  scale?: number
  darkColor?: [number, number, number]
  lightColor?: [number, number, number]
}

// Simple PNG encoder (basic implementation)
export function renderPNG(qrData: QRCodeData, options: PNGOptions = {}): Buffer {
  const { margin = 4, scale = 8, darkColor = [0, 0, 0], lightColor = [255, 255, 255] } = options

  const { modules } = qrData
  const size = modules.length
  const totalSize = (size + margin * 2) * scale

  // Create image data
  const imageData = new Uint8Array(totalSize * totalSize * 4) // RGBA

  for (let y = 0; y < totalSize; y++) {
    for (let x = 0; x < totalSize; x++) {
      const moduleRow = Math.floor((y - margin * scale) / scale)
      const moduleCol = Math.floor((x - margin * scale) / scale)

      let isDark = false
      if (moduleRow >= 0 && moduleRow < size && moduleCol >= 0 && moduleCol < size) {
        isDark = modules[moduleRow]![moduleCol] || false
      }

      const color = isDark ? darkColor : lightColor
      const index = (y * totalSize + x) * 4

      imageData[index] = color[0] // R
      imageData[index + 1] = color[1] // G
      imageData[index + 2] = color[2] // B
      imageData[index + 3] = 255 // A
    }
  }

  // Convert to PNG (simplified - in real implementation would use proper PNG encoding)
  return encodePNG(imageData, totalSize, totalSize)
}

// Simplified PNG encoding (basic implementation)
function encodePNG(data: Uint8Array, width: number, height: number): Buffer {
  // This is a simplified implementation
  // In a real scenario, you'd use a proper PNG encoder like 'pngjs' or similar

  const header = Buffer.from([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a, // PNG signature
  ])

  // For now, return a placeholder
  // In production, implement proper PNG encoding or use a library
  return Buffer.concat([header, Buffer.from(data)])
}

// Generate PNG data URL
export function renderPNGDataURL(qrData: QRCodeData, options: PNGOptions = {}): string {
  const pngBuffer = renderPNG(qrData, options)
  const base64 = pngBuffer.toString("base64")
  return `data:image/png;base64,${base64}`
}
