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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    // Check for error in URL params
    const errorParam = searchParams.get('error');
    if (errorParam === 'invalid_token') {
      setError('Invalid or expired magic link. Please try logging in again.');
    }
  }, [searchParams]);

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
      // Show success message in the LoginOverlay component
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
      
      <main className={`container mx-auto px-4 pt-24 ${!isLoggedIn ? 'filter blur-sm pointer-events-none' : ''}`}>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <UploadArea />
            
            <div className="space-y-4">
              <p className="text-sm text-zinc-400">Or enter your prompt:</p>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to generate..."
                className="min-h-[100px] bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
              />
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-zinc-400">Choose analysis focus:</p>
              <Select>
                <SelectTrigger className="w-full bg-zinc-900 border-zinc-800">
                  <SelectValue placeholder="Web applications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web applications</SelectItem>
                  <SelectItem value="mobile">Mobile applications</SelectItem>
                  <SelectItem value="desktop">Desktop applications</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit"
              disabled={loading || !isLoggedIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Generating...' : 'Generate prompt'}
            </Button>

            <p className="text-center text-sm text-zinc-500">
              Prompts generated: 0 / 50
            </p>

            {response && (
              <Card className="mt-8 p-6 bg-zinc-900 border-zinc-800">
                <h3 className="text-lg font-medium mb-4">Generated Response:</h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-zinc-300 whitespace-pre-wrap">{response}</p>
                </div>
              </Card>
            )}

            <p className="text-center text-xs text-zinc-600">
              Found bugs that needs squashing? Report bugs here:
              <br />
              info@copycoder.ai
            </p>
          </form>
        </div>
      </main>

      {!isLoggedIn && (
        <LoginOverlay onLogin={handleLogin} error={error} />
      )}
    </div>
  );
}
