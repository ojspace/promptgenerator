import Image from 'next/image';
import { Button } from './ui/button';

interface NavProps {
  onLogout?: () => void;
}

export function Nav({ onLogout }: NavProps) {
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src="/placeholder.svg"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-lg font-medium">SaasBoiled</span>
          </div>

          <div className="flex items-center space-x-4">
            {userEmail && (
              <span className="text-sm text-zinc-400">{userEmail}</span>
            )}
            {onLogout && (
              <Button
                onClick={onLogout}
                variant="ghost"
                className="text-zinc-400 hover:text-white"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
