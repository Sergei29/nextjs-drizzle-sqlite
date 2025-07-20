"use client"
"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { setSchema } from "@/lib/validation"
import { createNewSet, updateSet } from "@/lib/actions/sets"
import { paths } from "@/lib/utils"
import Link from "next/link"

interface Props {
  workoutId?: number // if need to create Set from Workout details
  initialValues?: z.output<typeof setSchema> & { id: number } // if updating existing Set
  setExercises?: {
    id: number
    name: string
  }[]
  workoutOptions: {
    name: string
    id: number
  }[]
}

const SetForm = ({
  initialValues,
  workoutId,
  setExercises = [],
  workoutOptions,
}: Props) => {
  const router = useRouter()
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
      // will navigate to workout page if came from Workout. or Set page if updating or Sets page if creating
      router.push(
        workoutId ? paths.workouts(workoutId) : paths.sets(initialValues?.id),
      )
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
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((order) => (
                      <SelectItem key={order} value={order.toString()}>
                        {order}
                      </SelectItem>
                    ))}
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
                <Input placeholder="Workout name" {...field} />
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

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-sm">
              {setExercises.length ? "Set exercises:" : "No exercises yet"}
            </h3>
          </CardHeader>
          <CardContent>
            <ul className="grid sm:grid-cols-3 gap-2">
              {setExercises.map(({ id, name }) => {
                return (
                  <li
                    key={id}
                    className="p-2 rounded-lg border border-slate-300 flex flex-col gap-2"
                  >
                    <span>{name}</span>
                    <span className="flex gap-2">
                      <Link href={paths.exercises(id)}>edit</Link>
                    </span>
                  </li>
                )
              })}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              onClick={() => {
                // open exercises modal
              }}
            >
              add exercise
            </Button>
          </CardFooter>
        </Card>

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
