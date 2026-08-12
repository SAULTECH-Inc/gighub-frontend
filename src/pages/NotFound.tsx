import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background text-center px-4 overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-primary/6 blur-[100px]" />
      <div className="pointer-events-none absolute top-20 right-20 h-64 w-64 rounded-full bg-accent/5 blur-[80px]" />

      <div className="relative z-10">
        <p className="text-[120px] font-bold leading-none bg-gradient-to-b from-primary/30 to-transparent bg-clip-text text-transparent select-none font-['Outfit',sans-serif]">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold text-foreground font-['Outfit',sans-serif]">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Button asChild>
            <Link to="/"><Home className="h-4 w-4" /> Go home</Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" /> Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
