import type { Metadata } from "next"

import ThemeProvider from "@/components/providers/ThemeProvider"
import Navigation from "@/components/Navigation"
import "./globals.css"

export const metadata: Metadata = {
  title: "Next.js | Drizzle ORM | Sqlite",
  description: "As a proof of concept",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="p-4">
            <div className="max-w-5xl mx-auto">
              <Navigation />
            </div>
          </header>
          <main className="max-w-5xl mx-auto p-4 h-[calc(100vh-85px-60px)]">
            {children}
          </main>
          <footer className="mt-auto p-4">
            <div className="max-w-5xl mx-auto text-xs">
              <p className="text-center">Drizzle ORM | Sqlite | Next.js</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
