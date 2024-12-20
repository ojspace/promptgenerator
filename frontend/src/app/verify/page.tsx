'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyToken } from '@/lib/api';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      router.push('/');
      return;
    }

    const verifyMagicLink = async () => {
      try {
        const response = await verifyToken(token);
        if (response.email) {
          // Store the email and login state
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', response.email);
          // Redirect to home page
          router.push('/');
        } else {
          setError('Invalid response from server');
          setTimeout(() => router.push('/?error=invalid_token'), 2000);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setError('Failed to verify token');
        setTimeout(() => router.push('/?error=invalid_token'), 2000);
      }
    };

    verifyMagicLink();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-red-500">Verification Failed</h1>
            <p className="text-zinc-400">{error}</p>
            <p className="text-zinc-400 mt-2">Redirecting you back...</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Verifying your login...</h1>
            <p className="text-zinc-400">Please wait while we verify your magic link.</p>
          </>
        )}
      </div>
    </div>
  );
}
