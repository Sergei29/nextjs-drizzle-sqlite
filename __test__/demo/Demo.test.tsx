import React from "react"
import { render, waitFor, screen } from "@testing-library/react"

import UserProfile from "@/components/Demo"

describe("Demo with api mocking", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
        }),
    }) as typeof fetch
  })

  test("renders user data correctly when fetched", async () => {
    render(<UserProfile />)

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument()
      expect(screen.getByText(/john.doe@example.com/i)).toBeInTheDocument()
    })
  })
})
