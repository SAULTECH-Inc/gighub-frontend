import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotAuthorizedPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-4">
      <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
        <ShieldOff className="h-8 w-8 text-destructive" />
      </div>
      <p className="text-6xl font-bold text-foreground">403</p>
      <h1 className="mt-2 text-xl font-bold text-foreground">Access denied</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        You don't have permission to view this page. If you think this is a mistake, contact support.
      </p>
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="text-sm">
          Go back
        </Button>
        <Button onClick={() => navigate('/')} className="text-sm">
          Go home
        </Button>
      </div>
    </div>
  );
}
