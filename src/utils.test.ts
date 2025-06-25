import { getBestMode, toBinary, encodeData } from "./utils.js"
import { QRGenerator } from "./qr-generator.js"
import { renderASCII } from "./renderers/ascii.js"
import { test, expect, describe } from "vitest"

describe("Utils", () => {

  test("getBestMode", () => {
    expect(getBestMode("12345")).toBe("numeric")
    expect(getBestMode("HELLO WORLD")).toBe("alphanumeric")
    expect(getBestMode("Hello World!")).toBe("byte")
  })

  test("toBinary", () => {
    expect(toBinary(5, 4)).toBe("0101")
    expect(toBinary(255, 8)).toBe("11111111")
  })

  test("encodeData numeric", () => {
    const encoded = encodeData("123", "numeric")
    expect(encoded).toBe("0001111011") // 123 in 10 bits
  })
})

describe("QR Generator", () => {
  test("generates QR code", () => {
    const generator = new QRGenerator()
    const result = generator.generate("HELLO")

    expect(result.version).toBe(1)
    expect(result.size).toBe(21)
    expect(result.modules).toHaveLength(21)
    expect(result.modules[0]).toHaveLength(21)
  })

  test("renders ASCII", () => {
    const generator = new QRGenerator()
    const qrData = generator.generate("TEST")
    const ascii = renderASCII(qrData)

    expect(ascii).toContain("██")
    expect(ascii.split("\n").length).toBeGreaterThan(20)
  })
})
