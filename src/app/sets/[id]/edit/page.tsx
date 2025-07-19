import type { Metadata } from "next"
import type { PageProps } from "@/types"

export const metadata: Metadata = {}

const EditPage = async ({ params }: PageProps<{ id: string }>) => {
  const { id } = await params
  return (
    <>
      <h1 className="text-3xl font-bold underline text-center">Edit {id}</h1>
    </>
  )
}

export default EditPage
