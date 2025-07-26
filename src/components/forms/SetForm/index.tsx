"use client"
"use client"

import React, { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import type { AsyncState } from "@/types"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AddSelectExercises from "@/components/forms/AddSelectExercises"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { createNewSet, updateSet, getSetsCount } from "@/lib/actions/sets"
import { getErrorMessage, paths } from "@/lib/utils"
import { setSchema } from "@/lib/validation"

const getOrderOptions = ({ setsTotal }: { setsTotal: number }) => {
  if (setsTotal) {
    return Array.from({ length: setsTotal }, (_, i) => i + 1)
  }

  return [1]
}

const useSetsCount = ({ workoutId }: { workoutId?: number }) => {
  const [setsTotal, setSetsTotal] = useState<AsyncState<number>>({
    data: null,
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    const fetchSetsCount = async () => {
      try {
        const count = await getSetsCount({ workoutId })
        setSetsTotal({ data: count, isLoading: false, error: null })
      } catch (error) {
        setSetsTotal((current) => ({
          ...current,
          isLoading: false,
          error: getErrorMessage(error),
        }))
        return
      }
    }

    fetchSetsCount()
  }, [workoutId])

  return setsTotal
}

interface Props {
  workoutId?: number // if need to create Set from Workout details
  initialValues?: z.output<typeof setSchema> & { id: number } // if updating existing Set
  workoutOptions: {
    name: string
    id: number
  }[]
}

const SetForm = ({ initialValues, workoutId, workoutOptions }: Props) => {
  const router = useRouter()
  const search = useSearchParams()
  const callbackUrl = search.get("callbackUrl")

  const { id: currentSetId, ...currentSetFields } = initialValues || {}

  const form = useForm<z.infer<typeof setSchema>>({
    resolver: zodResolver(setSchema),
    defaultValues: initialValues
      ? currentSetFields
      : {
          name: "",
          description: "",
          restTime: 0,
          workoutId: workoutId ?? 0,
          setOrder: 0,
        },
  })
  const { isLoading, isSubmitting } = form.formState
  const setsTotal = useSetsCount({ workoutId: form.watch("workoutId") })

  const onSubmit = async (input: z.output<typeof setSchema>) => {
    const response = currentSetId
      ? await updateSet({
          setId: currentSetId,
          input,
        })
      : await createNewSet({
          input,
        })

    if (response.success) {
      toast(`Set has been ${currentSetId ? "updated" : "created"}.`, {
        description: `"${response.data.name}"`,
      })
      /**
       * will navigate to workout page if came from Workout.
       * or Set page if updating or Sets page if creating
       */
      router.push(callbackUrl ? callbackUrl : paths.sets(initialValues?.id))
    } else {
      toast(`Set ${currentSetId ? "update" : "create"} error.`)
      Object.entries(response.errors).forEach(([key, value]) => {
        form.setError(
          key as
            | "name"
            | "description"
            | "restTime"
            | "setOrder"
            | "workoutId"
            | "root"
            | `root.${string}`,
          value,
        )
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto"
      >
        <div className="flex items-start flex-col sm:flex-row gap-4 my-4 min-h-[140px]">
          <FormField
            control={form.control}
            name="workoutId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs w-full">Workout</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={workoutId?.toString()}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="min-w-[250px]">
                      <SelectValue placeholder="Select a workout" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {workoutOptions.map((workout) => (
                      <SelectItem
                        key={workout.id}
                        value={workout.id.toString()}
                      >
                        {workout.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs">
                  Select your workout
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="setOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Set the order</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="min-w-[250px]">
                      <SelectValue placeholder="Select the set order" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getOrderOptions({ setsTotal: setsTotal.data ?? 0 }).map(
                      (order) => (
                        <SelectItem key={order} value={order.toString()}>
                          {order}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs">
                  Set the order within workout
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Name</FormLabel>
              <FormControl>
                <Input placeholder="Set name" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                What is the set title ?
              </FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Set description"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription className="text-xs">
                What is this set about ?
              </FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="restTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Rest time</FormLabel>
              <FormControl>
                <Input type="number" placeholder="In seconds" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                What is the rest time in seconds between the exercises?
              </FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <AddSelectExercises setId={currentSetId} />

        <div className="flex justify-end gap-4">
          <Button
            type="reset"
            variant="outline"
            onClick={() => form.reset()}
            className="cursor-pointer"
            disabled={isLoading || isSubmitting}
          >
            reset
          </Button>
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={isLoading || isSubmitting}
          >
            {currentSetId ? "edit" : "create"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SetForm
