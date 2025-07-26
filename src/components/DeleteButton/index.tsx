"use client"

import React, { useActionState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import type { ServerActionReturn } from "@/types"

import IconButton from "@/components/IconButton"

interface Props {
  id: number
  action: (
    id: number,
  ) => Promise<ServerActionReturn<{ id: number; name: string }>>
  disabled?: boolean
  title?: string
}

const DeleteButton = ({ action, id, disabled, title }: Props) => {
  const [state, formAction, isPending] = useActionState(action.bind(null, id), {
    success: false,
    errors: [],
  })

  useEffect(() => {
    if (state.success) {
      toast("Deleted")
    } else if (!state.success && state.errors.length > 0) {
      toast("Delete error", {
        description: Object.values(state.errors).join(", "),
      })
    }
  }, [state])

  return (
    <form action={formAction}>
      <IconButton
        type="submit"
        disabled={isPending || disabled}
        title={title || "Delete"}
        className="border border-red-600 text-red-600 hover:border-red-700 hover:text-red-700 active:text-red-900 active:border-red-900 disabled:opacity-50 z-10 relative"
      >
        <Trash2 />
      </IconButton>
    </form>
  )
}

export default DeleteButton
