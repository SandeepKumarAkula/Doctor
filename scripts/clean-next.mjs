import { rmSync } from "node:fs"
import { resolve } from "node:path"

const nextDir = resolve(process.cwd(), ".next")

try {
  rmSync(nextDir, { recursive: true, force: true })
  console.log(`Removed ${nextDir}`)
} catch (error) {
  console.error("Unable to remove Next cache:", error)
  process.exitCode = 1
}