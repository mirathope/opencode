import { describe, expect, test } from "bun:test"
import { makeSetColorScheme, type ThemeStore } from "./context"

function makeFakeStore() {
  const state: Partial<ThemeStore> = {
    colorScheme: "system",
    mode: "light",
  }
  const calls: Array<[string, unknown]> = []
  const setStore = ((key: string, value: unknown) => {
    calls.push([key, value])
    ;(state as Record<string, unknown>)[key] = value  }) as never
  return { state, calls, setStore }
}

describe("makeSetColorScheme", () => {
  test("updates the colorScheme in the store", () => {
    const { state, setStore } = makeFakeStore()
    const setColorScheme = makeSetColorScheme(setStore)
    setColorScheme("dark")
    expect(state.colorScheme).toBe("dark")
  })

  test("sets mode to the explicit scheme when scheme is not 'system'", () => {
    const { state, setStore } = makeFakeStore()
    const setColorScheme = makeSetColorScheme(setStore)
    setColorScheme("dark")
    expect(state.mode).toBe("dark")
    setColorScheme("light")
    expect(state.mode).toBe("light")
  })

  test("calls setStore exactly twice (colorScheme, then mode)", () => {
    const { calls, setStore } = makeFakeStore()
    const setColorScheme = makeSetColorScheme(setStore)
    setColorScheme("dark")
    expect(calls.length).toBe(2)
    expect(calls[0][0]).toBe("colorScheme")
    expect(calls[1][0]).toBe("mode")
  })
})