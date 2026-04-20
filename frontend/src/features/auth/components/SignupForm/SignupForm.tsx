import * as React from "react"
import { useServerFn } from "@tanstack/react-start"
import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"

import { defaultSignupValues, signupSchema } from "./schema"
import { signupFn } from "@/api/auth"

import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { Field, FieldLabel, FieldError, FieldGroup } from "@ui/field"

export function SignupForm() {
  const [serverError, setServerError] = React.useState("")
  const signupMutation = useServerFn(signupFn)

  const form = useForm({
    defaultValues: defaultSignupValues,
    validators: {
      onSubmit: signupSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError("")
      try {
        const res = await signupMutation({ data: value })
        if (res?.error) {
          setServerError(res.error)
        }
      } catch (err) {
        setServerError((err as Error).message)
      }
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Create Account</h2>

        {serverError && (
          <div className="mb-4 text-sm text-red-500">{serverError}</div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <FieldGroup>
            <form.Field
              name="username"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Username"
                    />
                    {isInvalid && (
                      <FieldError
                        errors={field.state.meta.errors.map((error) => ({
                          message: error?.toString(),
                        }))}
                      />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Email"
                      autoComplete="email"
                    />
                    {isInvalid && (
                      <FieldError
                        errors={field.state.meta.errors.map((error) => ({
                          message: error?.toString(),
                        }))}
                      />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Password"
                      autoComplete="new-password"
                    />
                    {isInvalid && (
                      <FieldError
                        errors={field.state.meta.errors.map((error) => ({
                          message: error?.toString(),
                        }))}
                      />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="confirmPassword"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                    />
                    {isInvalid && (
                      <FieldError
                        errors={field.state.meta.errors.map((error) => ({
                          message: error?.toString(),
                        }))}
                      />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>
            )}
          />

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
