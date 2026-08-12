import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Loader2, ArrowRight, RefreshCw } from 'lucide-react';
import { subscriptionsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

type ResultState = 'loading' | 'success' | 'failed';

export default function PaymentResultPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<ResultState>('loading');
  const [planName, setPlanName] = useState('');

  // URL params from various gateways
  // Paystack:     ?reference=xxx&trxref=xxx
  // Flutterwave:  ?status=successful&tx_ref=xxx&transaction_id=xxx
  // Stripe:       ?session_id=xxx  (redirected from stripe checkout)
  const reference   = params.get('reference') || params.get('tx_ref') || params.get('session_id');
  const status      = params.get('status');                        // flutterwave: 'successful' | 'cancelled'
  const subsId      = params.get('subscriptionId') || params.get('tx_ref') || reference;

  const confirm = useMutation({
    mutationFn: () => subscriptionsApi.confirm({
      subscriptionId: subsId ?? '',
      gatewayRef:     reference ?? '',
      gateway:        detectGateway(),
    }),
    onSuccess: (res) => {
      setPlanName(res.data?.planName ?? '');
      setState('success');
    },
    onError: () => setState('failed'),
  });

  function detectGateway(): string {
    if (params.get('session_id'))     return 'STRIPE';
    if (params.get('transaction_id')) return 'FLUTTERWAVE';
    return 'PAYSTACK';
  }

  useEffect(() => {
    // Flutterwave cancelled
    if (status === 'cancelled' || status === 'failed') {
      setState('failed');
      return;
    }
    // Nothing to confirm
    if (!reference && !subsId) {
      setState('failed');
      return;
    }
    confirm.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {state === 'loading' && (
          <div className="bg-surface border border-border rounded-3xl p-10 text-center space-y-5 shadow-xl">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">Confirming payment…</p>
              <p className="text-sm text-muted-foreground mt-1">Please wait while we verify your transaction.</p>
            </div>
          </div>
        )}

        {state === 'success' && (
          <div className="bg-surface border border-border rounded-3xl p-10 text-center space-y-5 shadow-xl">
            {/* Animated checkmark */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-success/20 animate-ping opacity-30" />
              <div className="relative h-24 w-24 rounded-full bg-success/15 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-success" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Payment successful!</p>
              {planName && (
                <p className="text-sm text-muted-foreground mt-1">
                  Welcome to <span className="font-semibold text-primary">{planName}</span>. Your subscription is now active.
                </p>
              )}
              {!planName && (
                <p className="text-sm text-muted-foreground mt-1">Your subscription is now active.</p>
              )}
            </div>
            <div className="grid gap-2">
              <Button className="w-full gap-2" onClick={() => { toast.success('Subscription active!'); navigate('/dashboard'); }}>
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full text-sm" onClick={() => navigate('/settings?tab=billing')}>
                View billing details
              </Button>
            </div>
          </div>
        )}

        {state === 'failed' && (
          <div className="bg-surface border border-border rounded-3xl p-10 text-center space-y-5 shadow-xl">
            <div className="h-24 w-24 rounded-full bg-destructive/15 flex items-center justify-center mx-auto">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Payment failed</p>
              <p className="text-sm text-muted-foreground mt-1">
                We couldn't confirm your payment. You have not been charged. Please try again.
              </p>
            </div>
            <div className="grid gap-2">
              <Button className="w-full gap-2" onClick={() => navigate('/plans')}>
                <RefreshCw className="h-4 w-4" /> Try again
              </Button>
              <Button variant="outline" className="w-full text-sm" onClick={() => navigate('/help')}>
                Contact support
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
