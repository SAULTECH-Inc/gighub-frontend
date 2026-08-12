import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { usersApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setAuth } = useAuthStore();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = params.get('token');
    const userType = params.get('userType');

    if (!token) {
      toast.error('Authentication failed. Please try again.');
      navigate('/login', { replace: true });
      return;
    }

    // Store the token first so the API call below can use it
    localStorage.setItem('accessToken', token);

    const fetchUser = userType === 'employer'
      ? usersApi.getEmployerProfile
      : usersApi.getApplicantProfile;

    fetchUser()
      .then((res) => {
        const user = res.data.data ?? res.data;
        setAuth({ accessToken: token, user });
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
        toast.error('Could not load your profile. Please log in again.');
        navigate('/login', { replace: true });
      });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-7 w-7 text-primary animate-spin" />
      <p className="text-sm text-muted-foreground">Signing you in…</p>
    </div>
  );
}
