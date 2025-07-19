import { Plus } from "lucide-react"

import type { Metadata } from "next"

import IconButton from "@/components/IconButton"
import { paths } from "@/lib/utils"

export const metadata: Metadata = {}

const SetsListPage = async () => {
  return (
    <>
      <div className="flex gap-4 justify-center items-center">
        <h1 className="text-3xl font-bold underline text-center">
          Sets List page
        </h1>
        <IconButton href={paths.sets("create")} title="add new">
          <Plus />
        </IconButton>
      </div>
    </>
  )
}

export default SetsListPage
