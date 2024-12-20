'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/nav";
import { UploadArea } from "@/components/upload-area";
import { FrameworkIcons } from "@/components/framework-icons";
import { Textarea } from "@/components/ui/textarea";
import { LoginOverlay } from "@/components/login-overlay";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generatePrompt, sendMagicLink } from '@/lib/api';
import { Card } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Initialize as null
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    const errorParam = searchParams.get('error');
    if (errorParam === 'invalid_token') {
      setError('Invalid or expired magic link. Please try logging in again.');
    }
  }, [searchParams]);

  // Don't render anything until after mount
  if (!mounted) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    
    setLoading(true);
    try {
      const result = await generatePrompt(prompt);
      setResponse(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string) => {
    setError('');
    try {
      await sendMagicLink(email);
      return true;
    } catch (error) {
      console.error('Error sending magic link:', error);
      setError('Failed to send magic link. Please try again.');
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Nav onLogout={isLoggedIn ? handleLogout : undefined} />
      
      <main className="container mx-auto px-4 pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Create powerful
              <br />
              prompts for Cursor,
              <br />
              Bolt, v0 & more..
            </h1>
            
            <p className="text-lg text-zinc-400 max-w-xl">
              Built for the next generation of AI coders. Upload images of full applications, UI
              mockups, or custom designs and use our generated prompts to build your apps
              faster.
            </p>

            <div className="space-y-4">
              <h2 className="text-lg font-medium">Our front-end frameworks</h2>
              <FrameworkIcons />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 relative">
            <div className={isLoggedIn === false ? 'filter blur-sm' : ''}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Generate your prompt</h2>
                    <Select defaultValue="cursor">
                      <SelectTrigger className="w-[120px] bg-zinc-900 border-zinc-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cursor">Cursor</SelectItem>
                        <SelectItem value="bolt">Bolt</SelectItem>
                        <SelectItem value="v0">v0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <UploadArea />

                  <Textarea
                    placeholder="Describe what you want to build..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] bg-zinc-900 border-zinc-800"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !prompt || !isLoggedIn}
                >
                  {loading ? 'Generating...' : 'Generate Prompt'}
                </Button>
              </form>

              {response && (
                <Card className="mt-4 p-4 bg-zinc-900 border-zinc-800">
                  <pre className="whitespace-pre-wrap text-sm">{response}</pre>
                </Card>
              )}
            </div>
            
            {isLoggedIn === false && (
              <LoginOverlay onLogin={handleLogin} error={error} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
