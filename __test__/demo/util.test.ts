import { getUser, userLogin } from "@/components/Demo/util"

describe("fetch mocking demo", () => {
  it("should fetch user data successfully", async () => {
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

    const user = await getUser()
    expect(user).toEqual({
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
    })
  })

  it("should log the user in", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    })
    const response = await userLogin({ username: "valid_user" })
    expect(response).toEqual({ success: true })
  })
})
