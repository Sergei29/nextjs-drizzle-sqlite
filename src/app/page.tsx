import type { Metadata } from "next"

export const metadata: Metadata = {}

const HomePage = async () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-center my-8 underline">Hi!</h1>
    </>
  )
}

export default HomePage
