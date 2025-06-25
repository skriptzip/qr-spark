import { MASK_PATTERNS } from "./constants.js"

export interface MaskEvaluation {
  pattern: number
  penalty: number
}

// Apply mask pattern to QR matrix
export function applyMask(matrix: boolean[][], pattern: number): boolean[][] {
  const size = matrix.length
  const masked = matrix.map((row) => [...row])
  const maskFunction = MASK_PATTERNS[pattern]

  if (!maskFunction) {
    throw new Error(`Invalid mask pattern: ${pattern}`)
  }

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!isReservedArea(row, col, size)) {
        if (maskFunction(row, col)) {
          masked[row]![col] = !masked[row]![col]
        }
      }
    }
  }

  return masked
}

// Check if position is reserved (function patterns)
function isReservedArea(row: number, col: number, size: number): boolean {
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

// Evaluate mask pattern quality (lower penalty is better)
export function evaluateMask(matrix: boolean[][]): number {
  let penalty = 0

  // Rule 1: Adjacent modules in row/column with same color
  penalty += evaluateRule1(matrix)

  // Rule 2: Block of modules in same color
  penalty += evaluateRule2(matrix)

  // Rule 3: Finder-like patterns
  penalty += evaluateRule3(matrix)

  // Rule 4: Proportion of dark modules
  penalty += evaluateRule4(matrix)

  return penalty
}

// Rule 1: Five or more consecutive modules of same color
function evaluateRule1(matrix: boolean[][]): number {
  const size = matrix.length
  let penalty = 0

  // Check rows
  for (let row = 0; row < size; row++) {
    let count = 1
    let prevColor = matrix[row]![0]

    for (let col = 1; col < size; col++) {
      if (matrix[row]![col] === prevColor) {
        count++
      } else {
        if (count >= 5) {
          penalty += 3 + (count - 5)
        }
        count = 1
        prevColor = matrix[row]![col]
      }
    }

    if (count >= 5) {
      penalty += 3 + (count - 5)
    }
  }

  // Check columns
  for (let col = 0; col < size; col++) {
    let count = 1
    let prevColor = matrix[0]![col]

    for (let row = 1; row < size; row++) {
      if (matrix[row]![col] === prevColor) {
        count++
      } else {
        if (count >= 5) {
          penalty += 3 + (count - 5)
        }
        count = 1
        prevColor = matrix[row]![col]
      }
    }

    if (count >= 5) {
      penalty += 3 + (count - 5)
    }
  }

  return penalty
}

// Rule 2: 2x2 blocks of same color
function evaluateRule2(matrix: boolean[][]): number {
  const size = matrix.length
  let penalty = 0

  for (let row = 0; row < size - 1; row++) {
    for (let col = 0; col < size - 1; col++) {
      const color = matrix[row]![col]
      if (matrix[row]![col + 1] === color && matrix[row + 1]![col] === color && matrix[row + 1]![col + 1] === color) {
        penalty += 3
      }
    }
  }

  return penalty
}

// Rule 3: Finder-like patterns
function evaluateRule3(matrix: boolean[][]): number {
  const size = matrix.length
  let penalty = 0

  const pattern1 = [true, false, true, true, true, false, true, false, false, false, false]
  const pattern2 = [false, false, false, false, true, false, true, true, true, false, true]

  // Check rows
  for (let row = 0; row < size; row++) {
    for (let col = 0; col <= size - 11; col++) {
      if (
        matchesPattern(matrix[row]!.slice(col, col + 11), pattern1) ||
        matchesPattern(matrix[row]!.slice(col, col + 11), pattern2)
      ) {
        penalty += 40
      }
    }
  }

  // Check columns
  for (let col = 0; col < size; col++) {
    for (let row = 0; row <= size - 11; row++) {
      const columnSlice = []
      for (let i = 0; i < 11; i++) {
        columnSlice.push(matrix[row + i]![col])
      }
      if (matchesPattern(columnSlice, pattern1) || matchesPattern(columnSlice, pattern2)) {
        penalty += 40
      }
    }
  }

  return penalty
}

// Rule 4: Proportion of dark modules
function evaluateRule4(matrix: boolean[][]): number {
  const size = matrix.length
  let darkCount = 0

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (matrix[row]![col]) {
        darkCount++
      }
    }
  }

  const totalModules = size * size
  const percentage = Math.floor((darkCount * 100) / totalModules)
  const deviation = Math.abs(percentage - 50)

  return Math.floor(deviation / 5) * 10
}

function matchesPattern(sequence: boolean[], pattern: boolean[]): boolean {
  if (sequence.length !== pattern.length) return false

  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i] !== pattern[i]) return false
  }

  return true
}

// Find the best mask pattern
export function findBestMask(matrix: boolean[][]): number {
  let bestPattern = 0
  let lowestPenalty = Number.POSITIVE_INFINITY

  for (let pattern = 0; pattern < 8; pattern++) {
    const maskedMatrix = applyMask(matrix, pattern)
    const penalty = evaluateMask(maskedMatrix)

    if (penalty < lowestPenalty) {
      lowestPenalty = penalty
      bestPattern = pattern
    }
  }

  return bestPattern
}
