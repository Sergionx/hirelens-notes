import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools"

import { AuthProvider } from "@/features/auth/contexts/AuthContext"

import { Toaster } from "@ui/sonner"

import appCss from "../styles.css?url"

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
})

export function RootComponent() {
  const { queryClient } = Route.useRouteContext()
  return (
    <RootDocument queryClient={queryClient}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </RootDocument>
  )
}

function RootDocument({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              {
                name: "Tanstack Query",
                render: <ReactQueryDevtoolsPanel />,
              },
              formDevtoolsPlugin(),
            ]}
          />
        </QueryClientProvider>
        <Toaster richColors />

        <Scripts />
      </body>
    </html>
  )
}
