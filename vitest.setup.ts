import "@testing-library/jest-dom/vitest"

import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"
import "@testing-library/jest-dom"

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})

// Add Default Functions, for example providers as here:
// https://testing-library.com/docs/react-testing-library/setup/#custom-render

const noop = () => {}
Object.defineProperty(window, "scrollTo", { value: noop, writable: true })
