'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface LoginOverlayProps {
  onLogin: (email: string) => Promise<boolean>;
  error?: string;
}

export function LoginOverlay({ onLogin, error }: LoginOverlayProps) {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await onLogin(email);
      if (success) {
        setIsSent(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <Card className="w-full max-w-md p-6 bg-zinc-900/90 border-zinc-800">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Sign in to continue</h2>
          <p className="text-zinc-400">Enter your email to receive a magic link</p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/50 border-zinc-800 text-white placeholder:text-zinc-500"
              required
              disabled={isLoading}
            />
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>
        ) : (
          <div className="mt-6 space-y-4 text-center">
            <div className="text-green-500">✓ Magic link sent!</div>
            <p className="text-zinc-400">
              Check your email for the magic link to sign in.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
