#!/usr/bin/env node

import { QRGenerator } from "./qr-generator.js"
import { renderASCII } from "./renderers/ascii.js"
import { renderSVG, renderDataURL } from "./renderers/svg.js"
import { renderPNG } from "./renderers/png.js"
import { writeFileSync } from "fs"
import { resolve } from "path"
import type { ErrorCorrectionLevel } from "./types.js"

interface CLIOptions {
  text: string
  output?: string
  format: "ascii" | "svg" | "png" | "dataurl"
  errorCorrection: ErrorCorrectionLevel
  version: number
  margin: number
  scale: number
  darkColor: string
  lightColor: string
}

function parseArgs(): CLIOptions {
  const args = process.argv.slice(2)
  const options: Partial<CLIOptions> = {
    format: "ascii",
    errorCorrection: "M",
    version: 0,
    margin: 4,
    scale: 1,
    darkColor: "#000000",
    lightColor: "#ffffff",
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const nextArg = args[i + 1]

    switch (arg) {
      case "-t":
      case "--text":
        options.text = nextArg
        i++
        break
      case "-o":
      case "--output":
        options.output = nextArg
        i++
        break
      case "-f":
      case "--format":
        if (["ascii", "svg", "png", "dataurl"].includes(nextArg)) {
          options.format = nextArg as any
        }
        i++
        break
      case "-e":
      case "--error-correction":
        if (["L", "M", "Q", "H"].includes(nextArg)) {
          options.errorCorrection = nextArg as ErrorCorrectionLevel
        }
        i++
        break
      case "-v":
      case "--version":
        options.version = Number.parseInt(nextArg) || 0
        i++
        break
      case "-m":
      case "--margin":
        options.margin = Number.parseInt(nextArg) || 4
        i++
        break
      case "-s":
      case "--scale":
        options.scale = Number.parseInt(nextArg) || 1
        i++
        break
      case "--dark-color":
        options.darkColor = nextArg
        i++
        break
      case "--light-color":
        options.lightColor = nextArg
        i++
        break
      case "-h":
      case "--help":
        showHelp()
        process.exit(0)
        break
      default:
        if (!options.text && !arg.startsWith("-")) {
          options.text = arg
        }
        break
    }
  }

  if (!options.text) {
    console.error("Error: Text is required")
    showHelp()
    process.exit(1)
  }

  return options as CLIOptions
}

function showHelp() {
  console.log(`
QR-Spark - Pure TypeScript QR Code Generator

Usage: qr-spark [options] <text>

Options:
  -t, --text <text>              Text to encode (required)
  -o, --output <file>            Output file path
  -f, --format <format>          Output format: ascii, svg, png, dataurl (default: ascii)
  -e, --error-correction <level> Error correction level: L, M, Q, H (default: M)
  -v, --version <number>         QR version 1-40 (default: auto)
  -m, --margin <number>          Margin size (default: 4)
  -s, --scale <number>           Scale factor (default: 1)
  --dark-color <color>           Dark color (default: #000000)
  --light-color <color>          Light color (default: #ffffff)
  -h, --help                     Show this help

Examples:
  qr-spark "Hello World"
  qr-spark -t "Hello World" -f svg -o qr.svg
  qr-spark "https://example.com" -f png -s 8 -o qr.png
  qr-spark "Test" -e H -v 5 --dark-color "#FF0000"
`)
}

function main() {
  try {
    const options = parseArgs()

    // Generate QR code
    const generator = new QRGenerator({
      errorCorrectionLevel: options.errorCorrection,
      version: options.version,
      margin: options.margin,
      scale: options.scale,
    })

    const qrData = generator.generate(options.text)

    let output: string | Buffer

    // Render based on format
    switch (options.format) {
      case "ascii":
        output = renderASCII(qrData, { margin: options.margin })
        break
      case "svg":
        output = renderSVG(qrData, {
          margin: options.margin,
          scale: options.scale,
          darkColor: options.darkColor,
          lightColor: options.lightColor,
        })
        break
      case "png":
        const darkRGB = hexToRgb(options.darkColor)
        const lightRGB = hexToRgb(options.lightColor)
        output = renderPNG(qrData, {
          margin: options.margin,
          scale: options.scale,
          darkColor: darkRGB,
          lightColor: lightRGB,
        })
        break
      case "dataurl":
        if (options.output) {
          console.error("Data URL format cannot be saved to file")
          process.exit(1)
        }
        output = renderDataURL(qrData, {
          margin: options.margin,
          scale: options.scale,
          darkColor: options.darkColor,
          lightColor: options.lightColor,
        })
        break
      default:
        throw new Error(`Unsupported format: ${options.format}`)
    }

    // Output result
    if (options.output) {
      const outputPath = resolve(options.output)
      if (typeof output === "string") {
        writeFileSync(outputPath, output, "utf8")
      } else {
        writeFileSync(outputPath, output)
      }
      console.log(`QR code saved to: ${outputPath}`)
    } else {
      console.log(output.toString())
    }

    // Show info
    console.error(`Generated QR Code:`)
    console.error(`- Version: ${qrData.version}`)
    console.error(`- Size: ${qrData.size}x${qrData.size}`)
    console.error(`- Error Correction: ${qrData.errorCorrectionLevel}`)
    console.error(`- Format: ${options.format}`)
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`)
  }
  return [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)]
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
