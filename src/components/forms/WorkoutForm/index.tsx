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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import WorkoutSetsReorder from "@/components/forms/WorkoutSetsReorder"

import { workoutSchema } from "@/lib/validation"
import { createNewWorkout, updateWorkout } from "@/lib/actions/workouts"
import { paths } from "@/lib/utils"

interface Props {
  initialValues?: z.output<typeof workoutSchema> & { id: number }
}

const WorkoutForm = ({ initialValues }: Props) => {
  const router = useRouter()
  const { id: currentWorkoutId, ...currentWorkoutFields } = initialValues || {}

  const form = useForm<z.infer<typeof workoutSchema>>({
    resolver: zodResolver(workoutSchema),
    defaultValues: initialValues
      ? currentWorkoutFields
      : {
          name: "",
          restTime: 0,
          description: "",
        },
  })
  const { isLoading, isSubmitting } = form.formState

  const onSubmit = async (input: z.output<typeof workoutSchema>) => {
    const response = currentWorkoutId
      ? await updateWorkout({
          input,
          workoutId: currentWorkoutId,
        })
      : await createNewWorkout({
          input,
        })

    if (response.success) {
      toast(`Workout has been ${currentWorkoutId ? "updated" : "created"}.`, {
        description: `"${response.data.name}"`,
      })
      router.push(paths.workouts())
    } else {
      toast(`Workout ${currentWorkoutId ? "update" : "create"} error.`)
      Object.entries(response.errors).forEach(([key, value]) => {
        form.setError(
          key as
            | "name"
            | "description"
            | "restTime"
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
                What is the workout title ?
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
                  placeholder="Workout description"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription className="text-xs">
                What is this workout about ?
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
                What is the rest time in seconds between the sets?
              </FormDescription>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {currentWorkoutId && (
          <WorkoutSetsReorder
            workoutId={currentWorkoutId}
            renderTitle={(sets) => (
              <h3 className="text-lg font-semibold">{`Currently ${sets.length} sets in the workout`}</h3>
            )}
          />
        )}

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
            {currentWorkoutId ? "edit" : "create"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default WorkoutForm
