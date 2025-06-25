import type { QRCodeData } from "../types.js"

export interface SVGOptions {
  margin?: number
  scale?: number
  darkColor?: string
  lightColor?: string
  xmlDeclaration?: boolean
}

export function renderSVG(qrData: QRCodeData, options: SVGOptions = {}): string {
  const { margin = 4, scale = 1, darkColor = "#000000", lightColor = "#ffffff", xmlDeclaration = true } = options

  const { modules } = qrData
  const moduleSize = scale
  const size = modules.length
  const totalSize = (size + margin * 2) * moduleSize

  let svg = ""

  if (xmlDeclaration) {
    svg += '<?xml version="1.0" encoding="UTF-8"?>\n'
  }

  svg += `<svg xmlns="http://www.w3.org/2000/svg" `
  svg += `width="${totalSize}" height="${totalSize}" `
  svg += `viewBox="0 0 ${totalSize} ${totalSize}">\n`

  // Background
  svg += `  <rect width="${totalSize}" height="${totalSize}" fill="${lightColor}"/>\n`

  // QR modules
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (modules[row]![col]) {
        const x = (col + margin) * moduleSize
        const y = (row + margin) * moduleSize
        svg += `  <rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${darkColor}"/>\n`
      }
    }
  }

  svg += "</svg>"
  return svg
}

// Generate data URL for web use
export function renderDataURL(qrData: QRCodeData, options: SVGOptions = {}): string {
  const svg = renderSVG(qrData, { ...options, xmlDeclaration: false })
  const base64 = Buffer.from(svg).toString("base64")
  return `data:image/svg+xml;base64,${base64}`
}
