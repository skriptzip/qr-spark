import type { ErrorCorrectionLevel, VersionInfo } from "./types.js"

// Error correction level indicators
export const ERROR_CORRECTION_LEVELS: Record<ErrorCorrectionLevel, number> = {
  L: 0b01, // ~7% correction
  M: 0b00, // ~15% correction
  Q: 0b11, // ~25% correction
  H: 0b10, // ~30% correction
}

// Mode indicators
export const MODE_INDICATORS = {
  numeric: 0b0001,
  alphanumeric: 0b0010,
  byte: 0b0100,
  kanji: 0b1000,
}

// Alphanumeric character set
export const ALPHANUMERIC_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:"

// Extended version information (1-40)
export const VERSION_INFO: VersionInfo[] = [
  // Versions 1-10 (existing)
  { version: 1, totalCodewords: 26, errorCorrectionCodewords: 7, dataCodewords: 19, blocks: 1, size: 21 },
  { version: 2, totalCodewords: 44, errorCorrectionCodewords: 10, dataCodewords: 34, blocks: 1, size: 25 },
  { version: 3, totalCodewords: 70, errorCorrectionCodewords: 15, dataCodewords: 55, blocks: 1, size: 29 },
  { version: 4, totalCodewords: 100, errorCorrectionCodewords: 20, dataCodewords: 80, blocks: 1, size: 33 },
  { version: 5, totalCodewords: 134, errorCorrectionCodewords: 26, dataCodewords: 108, blocks: 1, size: 37 },
  { version: 6, totalCodewords: 172, errorCorrectionCodewords: 36, dataCodewords: 136, blocks: 2, size: 41 },
  { version: 7, totalCodewords: 196, errorCorrectionCodewords: 40, dataCodewords: 156, blocks: 2, size: 45 },
  { version: 8, totalCodewords: 242, errorCorrectionCodewords: 48, dataCodewords: 194, blocks: 2, size: 49 },
  { version: 9, totalCodewords: 292, errorCorrectionCodewords: 60, dataCodewords: 232, blocks: 2, size: 53 },
  { version: 10, totalCodewords: 346, errorCorrectionCodewords: 72, dataCodewords: 274, blocks: 2, size: 57 },

  // Versions 11-20
  { version: 11, totalCodewords: 404, errorCorrectionCodewords: 80, dataCodewords: 324, blocks: 4, size: 61 },
  { version: 12, totalCodewords: 466, errorCorrectionCodewords: 96, dataCodewords: 370, blocks: 4, size: 65 },
  { version: 13, totalCodewords: 532, errorCorrectionCodewords: 104, dataCodewords: 428, blocks: 4, size: 69 },
  { version: 14, totalCodewords: 581, errorCorrectionCodewords: 120, dataCodewords: 461, blocks: 4, size: 73 },
  { version: 15, totalCodewords: 655, errorCorrectionCodewords: 132, dataCodewords: 523, blocks: 6, size: 77 },
  { version: 16, totalCodewords: 733, errorCorrectionCodewords: 144, dataCodewords: 589, blocks: 6, size: 81 },
  { version: 17, totalCodewords: 815, errorCorrectionCodewords: 168, dataCodewords: 647, blocks: 6, size: 85 },
  { version: 18, totalCodewords: 901, errorCorrectionCodewords: 180, dataCodewords: 721, blocks: 6, size: 89 },
  { version: 19, totalCodewords: 991, errorCorrectionCodewords: 196, dataCodewords: 795, blocks: 7, size: 93 },
  { version: 20, totalCodewords: 1085, errorCorrectionCodewords: 224, dataCodewords: 861, blocks: 8, size: 97 },

  // Versions 21-30
  { version: 21, totalCodewords: 1156, errorCorrectionCodewords: 224, dataCodewords: 932, blocks: 8, size: 101 },
  { version: 22, totalCodewords: 1258, errorCorrectionCodewords: 252, dataCodewords: 1006, blocks: 9, size: 105 },
  { version: 23, totalCodewords: 1364, errorCorrectionCodewords: 270, dataCodewords: 1094, blocks: 9, size: 109 },
  { version: 24, totalCodewords: 1474, errorCorrectionCodewords: 300, dataCodewords: 1174, blocks: 10, size: 113 },
  { version: 25, totalCodewords: 1588, errorCorrectionCodewords: 312, dataCodewords: 1276, blocks: 12, size: 117 },
  { version: 26, totalCodewords: 1706, errorCorrectionCodewords: 336, dataCodewords: 1370, blocks: 12, size: 121 },
  { version: 27, totalCodewords: 1828, errorCorrectionCodewords: 360, dataCodewords: 1468, blocks: 12, size: 125 },
  { version: 28, totalCodewords: 1921, errorCorrectionCodewords: 390, dataCodewords: 1531, blocks: 13, size: 129 },
  { version: 29, totalCodewords: 2051, errorCorrectionCodewords: 420, dataCodewords: 1631, blocks: 14, size: 133 },
  { version: 30, totalCodewords: 2185, errorCorrectionCodewords: 450, dataCodewords: 1735, blocks: 15, size: 137 },

  // Versions 31-40
  { version: 31, totalCodewords: 2323, errorCorrectionCodewords: 480, dataCodewords: 1843, blocks: 16, size: 141 },
  { version: 32, totalCodewords: 2465, errorCorrectionCodewords: 510, dataCodewords: 1955, blocks: 17, size: 145 },
  { version: 33, totalCodewords: 2611, errorCorrectionCodewords: 540, dataCodewords: 2071, blocks: 18, size: 149 },
  { version: 34, totalCodewords: 2761, errorCorrectionCodewords: 570, dataCodewords: 2191, blocks: 19, size: 153 },
  { version: 35, totalCodewords: 2915, errorCorrectionCodewords: 570, dataCodewords: 2345, blocks: 19, size: 157 },
  { version: 36, totalCodewords: 3073, errorCorrectionCodewords: 600, dataCodewords: 2473, blocks: 20, size: 161 },
  { version: 37, totalCodewords: 3235, errorCorrectionCodewords: 630, dataCodewords: 2605, blocks: 21, size: 165 },
  { version: 38, totalCodewords: 3401, errorCorrectionCodewords: 660, dataCodewords: 2741, blocks: 22, size: 169 },
  { version: 39, totalCodewords: 3571, errorCorrectionCodewords: 720, dataCodewords: 2851, blocks: 24, size: 173 },
  { version: 40, totalCodewords: 3745, errorCorrectionCodewords: 750, dataCodewords: 2995, blocks: 25, size: 177 },
]

// Finder pattern
export const FINDER_PATTERN = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
]

// Alignment pattern positions for each version (extended)
export const ALIGNMENT_PATTERNS: number[][] = [
  [], // Version 1
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50], // 2-10
  [6, 30, 54],
  [6, 32, 58],
  [6, 34, 62],
  [6, 26, 46, 66],
  [6, 26, 48, 70],
  [6, 26, 50, 74],
  [6, 30, 54, 78],
  [6, 30, 56, 82],
  [6, 30, 58, 86],
  [6, 34, 62, 90], // 11-20
  [6, 28, 50, 72, 94],
  [6, 26, 50, 74, 98],
  [6, 30, 54, 78, 102],
  [6, 28, 54, 80, 106],
  [6, 32, 58, 84, 110],
  [6, 30, 58, 86, 114],
  [6, 34, 62, 90, 118],
  [6, 26, 50, 74, 98, 122],
  [6, 30, 54, 78, 102, 126],
  [6, 26, 52, 78, 104, 130], // 21-30
  [6, 30, 56, 82, 108, 134],
  [6, 34, 60, 86, 112, 138],
  [6, 30, 58, 86, 114, 142],
  [6, 34, 62, 90, 118, 146],
  [6, 30, 54, 78, 102, 126, 150],
  [6, 24, 50, 76, 102, 128, 154],
  [6, 28, 54, 80, 106, 132, 158],
  [6, 32, 58, 84, 110, 136, 162],
  [6, 26, 54, 82, 110, 138, 166],
  [6, 30, 58, 86, 114, 142, 170], // 31-40
]

// Mask patterns (8 patterns as per QR spec)
export const MASK_PATTERNS = [
  (row: number, col: number) => (row + col) % 2 === 0,
  (row: number, col: number) => row % 2 === 0,
  (row: number, col: number) => col % 3 === 0,
  (row: number, col: number) => (row + col) % 3 === 0,
  (row: number, col: number) => (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0,
  (row: number, col: number) => ((row * col) % 2) + ((row * col) % 3) === 0,
  (row: number, col: number) => (((row * col) % 2) + ((row * col) % 3)) % 2 === 0,
  (row: number, col: number) => (((row + col) % 2) + ((row * col) % 3)) % 2 === 0,
]

// Format information for each error correction level and mask pattern
export const FORMAT_INFO_TABLE: Record<string, string> = {
  L0: "111011111000100",
  L1: "111001011110011",
  L2: "111110110101010",
  L3: "111100010011101",
  L4: "110011000101111",
  L5: "110001100011000",
  L6: "110110001000001",
  L7: "110100101110110",
  M0: "101010000010010",
  M1: "101000100100101",
  M2: "101111001111100",
  M3: "101101101001011",
  M4: "100010111111001",
  M5: "100000011001110",
  M6: "100111110010111",
  M7: "100101010100000",
  Q0: "011010101011111",
  Q1: "011000001101000",
  Q2: "011111100110001",
  Q3: "011101000000110",
  Q4: "010010010110100",
  Q5: "010000110000011",
  Q6: "010111011011010",
  Q7: "010101111101101",
  H0: "001011010001001",
  H1: "001001110111110",
  H2: "001110011100111",
  H3: "001100111010000",
  H4: "000011101100010",
  H5: "000001001010101",
  H6: "000110100001100",
  H7: "000100000111011",
}
