import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Button } from "@/components/ui/button"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prompt Generator for Coding',
  description: 'Generate effective prompts for coding tasks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-background">
          <nav className="border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <span className="text-xl font-bold">PromptGen</span>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a href="/" className="text-foreground inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-border">
                      Home
                    </a>
                    <a href="/dashboard" className="text-foreground inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-border">
                      Dashboard
                    </a>
                    <a href="/generator" className="text-foreground inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-border">
                      Generator
                    </a>
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <Button>
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </nav>
          {children}
        </main>
      </body>
    </html>
  )
}
