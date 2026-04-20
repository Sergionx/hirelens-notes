import * as React from "react"
import { useServerFn } from "@tanstack/react-start"
import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"

import { defaultLoginValues, loginSchema } from "./schema"

import { loginFn } from "@/api/auth"

import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { Field, FieldLabel, FieldError, FieldGroup } from "@ui/field"

export function LoginForm() {
  const [serverError, setServerError] = React.useState("")
  const loginMutation = useServerFn(loginFn)

  const form = useForm({
    defaultValues: defaultLoginValues,
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError("")
      try {
        const res = await loginMutation({ data: value })
        if (res?.error) {
          setServerError(res.error)
        }
        // Redirect is handled in server function via redirect()
      } catch (err) {
        setServerError((err as Error).message)
      }
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Login</h2>

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
                      autoComplete="current-password"
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
              name="rememberMe"
              children={(field) => (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={field.name}
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              )}
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
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            )}
          />

          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
