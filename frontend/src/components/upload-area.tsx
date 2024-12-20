'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface UploadAreaProps {
  className?: string
}

export function UploadArea({ className }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  return (
    <Card className={cn("bg-zinc-900 border-zinc-800", className)}>
      <CardContent className="p-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDragLeave}
          className={cn(
            "flex flex-col items-center justify-center min-h-[300px] rounded-lg border-2 border-dashed border-zinc-800 bg-zinc-950/50 transition-colors",
            isDragging && "border-zinc-700 bg-zinc-900/50"
          )}
        >
          <div className="text-center space-y-4 p-8">
            <h3 className="text-lg font-medium text-white">
              Drag & drop images of websites,
              <br />
              Figma designs, or UI mockups
              <br />
              here
            </h3>
            <p className="text-sm text-zinc-400">or</p>
            <Button variant="outline" className="bg-black text-white border-zinc-800 hover:bg-zinc-900 hover:text-white">
              Choose image
            </Button>
            <p className="text-xs text-zinc-500">
              Note: Only one image can be uploaded at a time.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
