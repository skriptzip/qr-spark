export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H"

export type QRMode = "numeric" | "alphanumeric" | "byte" | "kanji"

export interface QRCodeOptions {
  errorCorrectionLevel?: ErrorCorrectionLevel
  version?: number
  margin?: number
  scale?: number
}

export interface QRCodeData {
  modules: boolean[][]
  version: number
  size: number
  errorCorrectionLevel: ErrorCorrectionLevel
}

export interface VersionInfo {
  version: number
  totalCodewords: number
  errorCorrectionCodewords: number
  dataCodewords: number
  blocks: number
  size: number
}
