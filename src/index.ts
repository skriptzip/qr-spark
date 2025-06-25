export { QRGenerator } from "./qr-generator.js"
export { renderASCII } from "./renderers/ascii.js"
export { renderSVG, renderDataURL } from "./renderers/svg.js"
export { renderPNG, renderPNGDataURL } from "./renderers/png.js"
export { encodeReedSolomon } from "./reed-solomon.js"
export { findBestMask, applyMask } from "./mask-patterns.js"
export * from "./types.js"
export * from "./utils.js"

// Convenience function
import { QRGenerator } from "./qr-generator.js"
import type { QRCodeOptions } from "./types.js"

export function generateQR(data: string, options?: QRCodeOptions) {
  const generator = new QRGenerator(options)
  return generator.generate(data)
}
