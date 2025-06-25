/**
 * Reed-Solomon Error Correction Implementation
 * Based on the QR Code specification
 */

// Galois Field GF(256) with primitive polynomial x^8 + x^4 + x^3 + x^2 + 1
const GF256_PRIMITIVE = 0x11d

// Pre-computed log and antilog tables for GF(256)
const LOG_TABLE: number[] = new Array(256)
const ANTILOG_TABLE: number[] = new Array(256)

// Initialize Galois Field tables
function initializeGF256Tables() {
  let x = 1
  for (let i = 0; i < 255; i++) {
    ANTILOG_TABLE[i] = x
    LOG_TABLE[x] = i
    x <<= 1
    if (x & 0x100) {
      x ^= GF256_PRIMITIVE
    }
  }
  LOG_TABLE[0] = 0 // Special case
}

// Initialize tables on module load
initializeGF256Tables()

// Galois Field multiplication
function gfMultiply(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  const result = ANTILOG_TABLE[(LOG_TABLE[a]! + LOG_TABLE[b]!) % 255]
  return result as number
}

// Galois Field division
function gfDivide(a: number, b: number): number {
  if (a === 0) return 0
  if (b === 0) throw new Error("Division by zero in GF(256)")
  const result = ANTILOG_TABLE[(LOG_TABLE[a]! - LOG_TABLE[b]! + 255) % 255]
  return result as number
}

// Galois Field polynomial multiplication
function gfPolyMultiply(poly1: number[], poly2: number[]): number[] {
  const result = new Array(poly1.length + poly2.length - 1).fill(0)

  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      result[i + j] ^= gfMultiply(poly1[i]!, poly2[j]!)
    }
  }

  return result
}

// Generate Reed-Solomon generator polynomial
function generateRSGeneratorPoly(numECCodewords: number): number[] {
  let generator = [1]

  for (let i = 0; i < numECCodewords; i++) {
    const factor = [1, ANTILOG_TABLE[i]]
    generator = gfPolyMultiply(generator, factor as number[])
  }

  return generator
}

// Reed-Solomon encoding
export function encodeReedSolomon(data: number[], numECCodewords: number): number[] {
  const generator = generateRSGeneratorPoly(numECCodewords)
  const messageLength = data.length

  // Pad message with zeros
  const message = [...data, ...new Array(numECCodewords).fill(0)]

  // Polynomial division
  for (let i = 0; i < messageLength; i++) {
    const coeff = message[i]
    if (coeff !== 0) {
      for (let j = 0; j < generator.length; j++) {
        message[i + j] ^= gfMultiply(generator[j]!, coeff)
      }
    }
  }

  // Return only the remainder (error correction codewords)
  return message.slice(messageLength)
}

// Error correction capacity for each level
export const ERROR_CORRECTION_CAPACITY = {
  L: 0.07, // ~7%
  M: 0.15, // ~15%
  Q: 0.25, // ~25%
  H: 0.3, // ~30%
}
