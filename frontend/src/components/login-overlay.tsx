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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-md p-6 bg-zinc-900 border-zinc-800">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Sign in to continue</h2>
          <p className="text-zinc-400">Enter your email to receive a magic link</p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border-zinc-800 text-white placeholder:text-zinc-500"
              required
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send magic link'}
            </Button>
          </form>
        ) : (
          <div className="mt-8 space-y-4 text-center">
            <div className="text-green-400 text-xl">✓ Magic link sent!</div>
            <p className="text-sm text-zinc-400">
              Check your email for the magic link to sign in.
              <br />
              The link will expire in 5 minutes.
            </p>
            <p className="text-xs text-zinc-500 mt-4">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
