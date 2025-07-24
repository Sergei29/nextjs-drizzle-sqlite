"use client"

import React, { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Link from "next/link"
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

import { exerciseSchema } from "@/lib/validation"
import { createNewSet, updateSet, getSetsCount } from "@/lib/actions/sets"
import { getErrorMessage, paths } from "@/lib/utils"

interface Props {
  initialValues?: z.output<typeof exerciseSchema> & { id: number } // if updating existing Exercise
}

const ExerciseForm = ({ initialValues }: Props) => {
  const { id: exerciseId, ...currentFields } = initialValues || {}

  const form = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    reValidateMode: "onChange",
    defaultValues: initialValues
      ? { ...currentFields }
      : {
          name: "",
          description: "",
          imageUrl: "",
          duration: 0,
          reps: 0,
        },
  })
  const { isLoading, isSubmitting, errors } = form.formState

  const onSubmit = async (data: z.output<typeof exerciseSchema>) => {
    console.log("data :>> ", data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Exercise name" {...field} />
              </FormControl>
              <FormDescription>
                What is the name of the exercise?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Exercise description"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription>
                Provide a brief description of the exercise.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Duration in seconds"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    form.trigger(["reps", "duration"])
                  }}
                />
              </FormControl>
              <FormDescription>
                Duration of the exercise in seconds?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repetitions</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Number of repetitions"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    form.trigger(["reps", "duration"])
                  }}
                />
              </FormControl>
              <FormDescription>How many repetitions?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Image URL" {...field} />
              </FormControl>
              <FormDescription>
                Provide a URL for the exercise image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {errors?.root?.message && (
          <p className="text-red-400 text-sm my-2">{errors.root.message}</p>
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
            {exerciseId ? "edit" : "create"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ExerciseForm
