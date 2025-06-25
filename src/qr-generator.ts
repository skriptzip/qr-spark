import { VERSION_INFO, FINDER_PATTERN, ALIGNMENT_PATTERNS, FORMAT_INFO_TABLE } from "./constants.js"
import { getBestMode, createDataString, addPadding, bitsToBytes, getCharCountLength } from "./utils.js"
import { encodeReedSolomon } from "./reed-solomon.js"
import { findBestMask, applyMask } from "./mask-patterns.js"
import type { QRCodeOptions, QRCodeData } from "./types.js"

export class QRGenerator {
  private options: Required<QRCodeOptions>

  constructor(options: QRCodeOptions = {}) {
    this.options = {
      errorCorrectionLevel: options.errorCorrectionLevel || "M",
      version: options.version || 0, // 0 means auto-detect
      margin: options.margin || 4,
      scale: options.scale || 1,
    }
  }

  generate(data: string): QRCodeData {
    // Determine the best encoding mode
    const mode = getBestMode(data)

    // Find the minimum version that can hold the data
    const version = this.findMinimumVersion(data, mode)
    const versionInfo = VERSION_INFO[version - 1]

    if (!versionInfo) {
      throw new Error(`Invalid QR version: ${version}`)
    }

    // Create the data string
    const dataString = createDataString(data, mode, version)

    // Add padding to fill the data capacity
    const totalDataBits = versionInfo.dataCodewords * 8
    const paddedData = addPadding(dataString, totalDataBits)

    // Convert to bytes
    const dataBytes = bitsToBytes(paddedData)

    // Generate Reed-Solomon error correction codes
    const errorCorrectionBytes = encodeReedSolomon(dataBytes, versionInfo.errorCorrectionCodewords)

    // Combine data and error correction
    const finalData = [...dataBytes, ...errorCorrectionBytes]

    // Create the QR code matrix
    const matrix = this.createMatrix(finalData, version)

    // Find and apply the best mask pattern
    const bestMask = findBestMask(matrix)
    const maskedMatrix = applyMask(matrix, bestMask)

    // Add format information
    this.addFormatInformation(maskedMatrix, version, bestMask)

    return {
      modules: maskedMatrix,
      version,
      size: versionInfo.size,
      errorCorrectionLevel: this.options.errorCorrectionLevel,
    }
  }

  private findMinimumVersion(data: string, mode: string): number {
    if (this.options.version > 0) {
      return this.options.version
    }

    // Calculate required capacity
    const modeIndicatorLength = 4
    const charCountLength = getCharCountLength(mode as any, 1) // Start with version 1
    const encodedDataLength = this.getEncodedDataLength(data, mode)

    const requiredBits = modeIndicatorLength + charCountLength + encodedDataLength

    // Find minimum version that can accommodate the data
    for (let version = 1; version <= 40; version++) {
      const versionInfo = VERSION_INFO[version - 1]
      if (!versionInfo) continue

      const availableBits = versionInfo.dataCodewords * 8

      if (availableBits >= requiredBits) {
        return version
      }
    }

    throw new Error("Data too large for QR code")
  }

  private getEncodedDataLength(data: string, mode: string): number {
    switch (mode) {
      case "numeric":
        return Math.ceil(data.length / 3) * 10 - (data.length % 3 === 1 ? 6 : data.length % 3 === 2 ? 3 : 0)
      case "alphanumeric":
        return Math.ceil(data.length / 2) * 11 - (data.length % 2 === 1 ? 5 : 0)
      case "byte":
        return data.length * 8
      default:
        return data.length * 8
    }
  }

  // Update the generateErrorCorrection method to use Reed-Solomon
  private generateErrorCorrection(dataBytes: number[], versionInfo: any): number[] {
    return encodeReedSolomon(dataBytes, versionInfo.errorCorrectionCodewords)
  }

  // Add the new addFormatInformation method that takes mask pattern
  private addFormatInformation(matrix: boolean[][], version: number, maskPattern: number): void {
    const errorLevel = this.options.errorCorrectionLevel
    const formatKey = `${errorLevel}${maskPattern}`
    const formatBits = FORMAT_INFO_TABLE[formatKey] || "101010000010010"

    const size = matrix.length

    // Place format information around top-left finder pattern
    for (let i = 0; i < 15; i++) {
      const bit = formatBits[i] === "1"

      if (i < 6) {
        matrix[8]![i] = bit
        matrix[size - 1 - i]![8] = bit
      } else if (i < 8) {
        matrix[8]![i + 1] = bit
        matrix[size - 7 + i]![8] = bit
      } else if (i === 8) {
        matrix[7]![8] = bit
        matrix[8]![size - 8] = bit
      } else {
        matrix[14 - i]![8] = bit
        matrix[8]![size - 15 + i] = bit
      }
    }
  }

  private createMatrix(data: number[], version: number): boolean[][] {
    const size = VERSION_INFO[version - 1].size
    const matrix: boolean[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill(false))

    // Add finder patterns
    this.addFinderPatterns(matrix, size)

    // Add separators
    this.addSeparators(matrix, size)

    // Add timing patterns
    this.addTimingPatterns(matrix, size)

    // Add alignment patterns (for versions > 1)
    if (version > 1) {
      this.addAlignmentPatterns(matrix, version)
    }

    // Add dark module (always at (4*version + 9, 8))
    if (version >= 2) {
      matrix[4 * version + 9][8] = true
    }

    // Place data
    this.placeData(matrix, data, size)

    return matrix
  }

  private addFinderPatterns(matrix: boolean[][], size: number): void {
    const positions = [
      [0, 0], // Top-left
      [0, size - 7], // Top-right
      [size - 7, 0], // Bottom-left
    ]

    for (const [row, col] of positions) {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          matrix[row + i][col + j] = FINDER_PATTERN[i][j] === 1
        }
      }
    }
  }

  private addSeparators(matrix: boolean[][], size: number): void {
    // Add white borders around finder patterns
    const positions = [
      [0, 0], // Top-left
      [0, size - 8], // Top-right
      [size - 8, 0], // Bottom-left
    ]

    for (const [row, col] of positions) {
      // Add separator borders
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (i === 7 || j === 7) {
            if (row + i < size && col + j < size && row + i >= 0 && col + j >= 0) {
              matrix[row + i][col + j] = false
            }
          }
        }
      }
    }
  }

  private addTimingPatterns(matrix: boolean[][], size: number): void {
    // Horizontal timing pattern
    for (let i = 8; i < size - 8; i++) {
      matrix[6][i] = i % 2 === 0
    }

    // Vertical timing pattern
    for (let i = 8; i < size - 8; i++) {
      matrix[i][6] = i % 2 === 0
    }
  }

  private addAlignmentPatterns(matrix: boolean[][], version: number): void {
    const positions = ALIGNMENT_PATTERNS[version - 1]

    for (const row of positions) {
      for (const col of positions) {
        // Skip if overlaps with finder patterns
        if (this.isFinderPatternArea(row, col, matrix.length)) {
          continue
        }

        // Add 5x5 alignment pattern
        for (let i = -2; i <= 2; i++) {
          for (let j = -2; j <= 2; j++) {
            const isDark = Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0)
            if (row + i >= 0 && row + i < matrix.length && col + j >= 0 && col + j < matrix.length) {
              matrix[row + i][col + j] = isDark
            }
          }
        }
      }
    }
  }

  private isFinderPatternArea(row: number, col: number, size: number): boolean {
    return (row <= 8 && col <= 8) || (row <= 8 && col >= size - 9) || (row >= size - 9 && col <= 8)
  }

  private placeData(matrix: boolean[][], data: number[], size: number): void {
    let dataIndex = 0
    let bitIndex = 7
    let upward = true

    // Start from bottom-right, moving in zigzag pattern
    for (let col = size - 1; col > 0; col -= 2) {
      if (col === 6) col-- // Skip timing column

      for (let count = 0; count < size; count++) {
        const row = upward ? size - 1 - count : count

        for (let c = 0; c < 2; c++) {
          const currentCol = col - c

          // Skip if position is already occupied
          if (this.isOccupied(matrix, row, currentCol, size)) {
            continue
          }

          // Place data bit
          if (dataIndex < data.length) {
            const bit = (data[dataIndex] >> bitIndex) & 1
            matrix[row][currentCol] = bit === 1

            bitIndex--
            if (bitIndex < 0) {
              bitIndex = 7
              dataIndex++
            }
          }
        }
      }

      upward = !upward
    }
  }

  private isOccupied(matrix: boolean[][], row: number, col: number, size: number): boolean {
    // Check if position is part of function patterns

    // Finder patterns and separators
    if ((row < 9 && col < 9) || (row < 9 && col >= size - 8) || (row >= size - 8 && col < 9)) {
      return true
    }

    // Timing patterns
    if (row === 6 || col === 6) {
      return true
    }

    // Format information areas
    if ((row === 8 && (col < 9 || col >= size - 8)) || (col === 8 && (row < 9 || row >= size - 7))) {
      return true
    }

    return false
  }
}
