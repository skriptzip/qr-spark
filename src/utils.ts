import { ALPHANUMERIC_CHARS, MODE_INDICATORS } from "./constants.js"
import type { QRMode } from "./types.js"

// Determine the best encoding mode for the input data
export function getBestMode(data: string): QRMode {
  if (/^\d+$/.test(data)) {
    return "numeric"
  }

  if (data.split("").every((char) => ALPHANUMERIC_CHARS.includes(char))) {
    return "alphanumeric"
  }

  return "byte"
}

// Convert number to binary string with specified length
export function toBinary(num: number, length: number): string {
  return num.toString(2).padStart(length, "0")
}

// Convert binary string to number
export function fromBinary(binary: string): number {
  return Number.parseInt(binary, 2)
}

// Encode data based on mode
export function encodeData(data: string, mode: QRMode): string {
  switch (mode) {
    case "numeric":
      return encodeNumeric(data)
    case "alphanumeric":
      return encodeAlphanumeric(data)
    case "byte":
      return encodeByte(data)
    default:
      throw new Error(`Unsupported mode: ${mode}`)
  }
}

// Encode numeric data
function encodeNumeric(data: string): string {
  let result = ""

  for (let i = 0; i < data.length; i += 3) {
    const chunk = data.slice(i, i + 3)
    const num = Number.parseInt(chunk, 10)

    if (chunk.length === 3) {
      result += toBinary(num, 10)
    } else if (chunk.length === 2) {
      result += toBinary(num, 7)
    } else {
      result += toBinary(num, 4)
    }
  }

  return result
}

// Encode alphanumeric data
function encodeAlphanumeric(data: string): string {
  let result = ""

  for (let i = 0; i < data.length; i += 2) {
    if (i + 1 < data.length) {
      const val1 = ALPHANUMERIC_CHARS.indexOf(data[i] as string)
      const val2 = ALPHANUMERIC_CHARS.indexOf(data[i + 1] as string)
      const combined = val1 * 45 + val2
      result += toBinary(combined, 11)
    } else {
      const val = ALPHANUMERIC_CHARS.indexOf(data[i] as string)
      result += toBinary(val, 6)
    }
  }

  return result
}

// Encode byte data
function encodeByte(data: string): string {
  let result = ""

  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i)
    result += toBinary(charCode, 8)
  }

  return result
}

// Get character count indicator length based on mode and version
export function getCharCountLength(mode: QRMode, version: number): number {
  const ranges = {
    numeric: version <= 9 ? 10 : version <= 26 ? 12 : 14,
    alphanumeric: version <= 9 ? 9 : version <= 26 ? 11 : 13,
    byte: version <= 9 ? 8 : version <= 26 ? 16 : 16,
    kanji: version <= 9 ? 8 : version <= 26 ? 10 : 12,
  }

  return ranges[mode]
}

// Create data string with mode indicator, character count, and encoded data
export function createDataString(data: string, mode: QRMode, version: number): string {
  const modeIndicator = toBinary(MODE_INDICATORS[mode], 4)
  const charCountLength = getCharCountLength(mode, version)
  const charCount = toBinary(data.length, charCountLength)
  const encodedData = encodeData(data, mode)

  return modeIndicator + charCount + encodedData
}

// Add padding to data string
export function addPadding(dataString: string, totalBits: number): string {
  let result = dataString

  // Add terminator (up to 4 zeros)
  const terminatorLength = Math.min(4, totalBits - result.length)
  result += "0".repeat(terminatorLength)

  // Pad to make length multiple of 8
  const remainder = result.length % 8
  if (remainder !== 0) {
    result += "0".repeat(8 - remainder)
  }

  // Add padding bytes alternating between 11101100 and 00010001
  const paddingBytes = ["11101100", "00010001"]
  let paddingIndex = 0

  while (result.length < totalBits) {
    result += paddingBytes[paddingIndex % 2]
    paddingIndex++
  }

  return result.slice(0, totalBits)
}

// Convert bit string to byte array
export function bitsToBytes(bits: string): number[] {
  const bytes: number[] = []

  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8)
    bytes.push(fromBinary(byte))
  }

  return bytes
}
