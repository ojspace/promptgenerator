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
  const [projectType, setProjectType] = useState('web');
  const [imageData, setImageData] = useState<string | undefined>();
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    
    setLoading(true);
    try {
      const result = await generatePrompt(prompt, projectType, imageData);
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
                    <Select 
                      defaultValue="web"
                      onValueChange={setProjectType}
                    >
                      <SelectTrigger className="w-[120px] bg-zinc-900 border-zinc-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Web App</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="ai">AI/ML</SelectItem>
                        <SelectItem value="desktop">Desktop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-300">
                      Upload Image (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-300
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-zinc-800 file:text-white
                        hover:file:bg-zinc-700"
                    />
                    {imageData && (
                      <div className="mt-2">
                        <img 
                          src={imageData} 
                          alt="Uploaded preview" 
                          className="max-w-xs rounded-lg"
                        />
                      </div>
                    )}
                  </div>

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
