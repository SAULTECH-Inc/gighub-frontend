import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users, Search, MapPin, UserPlus, UserMinus, MessageSquare,
  Loader2, Network as NetworkIcon, CheckCircle2, Clock,
  UserCheck, UserX, Bell,
} from 'lucide-react';
import { TopBar } from '@/components/common/TopBar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { networkApi, chatApi } from '@/lib/api';
import { cn, getInitials } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type ConnectionStatus = 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED';

interface NetworkUser {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  location?: string;
  professionalTitle?: string;
  linkedIn?: string;
  twitter?: string;
  connectionStatus?: ConnectionStatus;
  mutualConnections?: number;
}

type Tab = 'discover' | 'connections' | 'requests';

export default function NetworkPage() {
  const [tab,    setTab]    = useState<Tab>('discover');
  const [search, setSearch] = useState('');
  const [page,   setPage]   = useState(1);

  // Count pending requests for badge
  const { data: reqRaw } = useQuery({
    queryKey: ['network-requests-count'],
    queryFn: () => networkApi.getRequests({ page: 1, limit: 1 }).then(r => r.data.data ?? r.data),
    retry: false,
  });
  const pendingCount: number = (reqRaw as any)?.total ?? 0;

  return (
    <>
      <TopBar title="Network" />
      <div className="flex flex-col flex-1 overflow-hidden h-[calc(100vh-56px)]">

        {/* Tab + Search Bar */}
        <div className="p-4 border-b border-border/40 shrink-0 space-y-3">
          {/* Pill tab switcher */}
          <div className="flex items-center gap-1 bg-surface-raised/60 border border-border/50 rounded-2xl p-1 w-fit">
            {([
              { id: 'discover',    label: 'Find Connections', icon: NetworkIcon },
              { id: 'connections', label: 'My Connections',   icon: Users },
              { id: 'requests',    label: 'Requests',         icon: Bell, badge: pendingCount },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setSearch(''); setPage(1); }}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-150 relative',
                  tab === t.id
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-raised',
                )}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
                {'badge' in t && (t as any).badge > 0 && (
                  <span className="min-w-[16px] h-4 flex items-center justify-center rounded-full bg-destructive text-white text-[9px] font-bold px-1">
                    {(t as any).badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder={tab === 'discover' ? 'Search by name, location, or profession…' : 'Search connections…'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/60 bg-surface/80 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'discover'    && <DiscoverTab    search={search} page={page} setPage={setPage} />}
          {tab === 'connections' && <ConnectionsTab search={search} page={page} setPage={setPage} />}
          {tab === 'requests'    && <RequestsTab />}
        </div>
      </div>
    </>
  );
}

// ─── Discover tab ─────────────────────────────────────────────────────────────

function DiscoverTab({ search, page, setPage }: { search: string; page: number; setPage: (n: number) => void }) {
  const qc = useQueryClient();

  const { data: raw, isLoading } = useQuery({
    queryKey: ['network-discover', search, page],
    queryFn: () => networkApi.discover({ q: search, page, limit: 12 }).then(r => r.data.data ?? r.data),
    retry: false,
  });

  const users: NetworkUser[] = Array.isArray(raw) ? raw : (raw as any)?.data ?? [];
  const total: number = (raw as any)?.total ?? users.length;
  const pages = Math.ceil(total / 12) || 1;

  const sendReq = useMutation({
    mutationFn: (id: string) => networkApi.sendRequest(id),
    onSuccess: (_, id) => {
      toast.success('Connection request sent');
      qc.setQueryData(['network-discover', search, page], (old: any) => {
        const list = Array.isArray(old) ? old : old?.data ?? [];
        const update = (u: NetworkUser) => u.id === id ? { ...u, connectionStatus: 'PENDING' as ConnectionStatus } : u;
        return Array.isArray(old) ? list.map(update) : { ...old, data: list.map(update) };
      });
    },
  });

  const withdraw = useMutation({
    mutationFn: (id: string) => networkApi.withdrawRequest(id),
    onSuccess: (_, id) => {
      toast.success('Request withdrawn');
      qc.setQueryData(['network-discover', search, page], (old: any) => {
        const list = Array.isArray(old) ? old : old?.data ?? [];
        const update = (u: NetworkUser) => u.id === id ? { ...u, connectionStatus: 'NONE' as ConnectionStatus } : u;
        return Array.isArray(old) ? list.map(update) : { ...old, data: list.map(update) };
      });
    },
  });

  if (isLoading) return <UserGrid loading />;
  if (!users.length) return <EmptyUsers label={search ? 'No users match your search' : 'No suggestions right now'} />;

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">{total} people to connect with</p>
      <UserGrid>
        {users.map(u => (
          <UserCard key={u.id} user={u}
            primaryAction={
              u.connectionStatus === 'PENDING' ? (
                <Button size="sm" variant="outline"
                  className="gap-1.5 text-xs text-muted-foreground"
                  onClick={() => withdraw.mutate(u.id)}
                  disabled={withdraw.isPending && withdraw.variables === u.id}
                >
                  {withdraw.isPending && withdraw.variables === u.id
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Clock className="h-3.5 w-3.5" />}
                  Pending
                </Button>
              ) : u.connectionStatus === 'ACCEPTED' ? (
                <Button size="sm" variant="outline" className="gap-1.5 text-xs text-success border-success/30" disabled>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                </Button>
              ) : (
                <Button size="sm" variant="outline"
                  className="gap-1.5 text-xs"
                  onClick={() => sendReq.mutate(u.id)}
                  disabled={sendReq.isPending && sendReq.variables === u.id}
                >
                  {sendReq.isPending && sendReq.variables === u.id
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <UserPlus className="h-3.5 w-3.5" />}
                  Connect
                </Button>
              )
            }
          />
        ))}
      </UserGrid>
      <Pagination page={page} pages={pages} setPage={setPage} />
    </div>
  );
}

// ─── My connections tab ───────────────────────────────────────────────────────

function ConnectionsTab({ search, page, setPage }: { search: string; page: number; setPage: (n: number) => void }) {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data: raw, isLoading } = useQuery({
    queryKey: ['network-connections', search, page],
    queryFn: () => networkApi.getConnections({ q: search, page, limit: 12 }).then(r => r.data.data ?? r.data),
    retry: false,
  });

  const users: NetworkUser[] = Array.isArray(raw) ? raw : (raw as any)?.data ?? [];
  const total: number = (raw as any)?.total ?? users.length;
  const pages = Math.ceil(total / 12) || 1;

  const remove = useMutation({
    mutationFn: (id: string) => networkApi.removeConnection(id),
    onSuccess: (_, id) => {
      toast.success('Connection removed');
      qc.setQueryData(['network-connections', search, page], (old: any) => {
        const list = Array.isArray(old) ? old : old?.data ?? [];
        const update = (arr: NetworkUser[]) => arr.filter(u => u.id !== id);
        return Array.isArray(old) ? update(list) : { ...old, data: update(list) };
      });
    },
  });

  const message = useMutation({
    mutationFn: (recipientId: string) => chatApi.startDirect(recipientId),
    onSuccess: (res) => {
      const convId = res.data?.data?.id ?? res.data?.id;
      if (convId) navigate(`/chat?conv=${convId}`);
    },
  });

  if (isLoading) return <UserGrid loading />;
  if (!users.length) return (
    <EmptyUsers label={search ? 'No connections match your search' : 'No connections yet'} sub="Discover people in the Find Connections tab" />
  );

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">{total} connection{total !== 1 ? 's' : ''}</p>
      <UserGrid>
        {users.map(u => (
          <UserCard key={u.id} user={u}
            primaryAction={
              <Button size="sm" variant="outline"
                className="gap-1.5 text-xs"
                onClick={() => message.mutate(u.id)}
                disabled={message.isPending && message.variables === u.id}
              >
                {message.isPending && message.variables === u.id
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <MessageSquare className="h-3.5 w-3.5" />}
                Message
              </Button>
            }
            secondaryAction={
              <Button size="sm" variant="ghost"
                className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                onClick={() => remove.mutate(u.id)}
                disabled={remove.isPending && remove.variables === u.id}
              >
                {remove.isPending && remove.variables === u.id
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <UserMinus className="h-3.5 w-3.5" />}
                Remove
              </Button>
            }
          />
        ))}
      </UserGrid>
      <Pagination page={page} pages={pages} setPage={setPage} />
    </div>
  );
}

// ─── Pending requests tab ─────────────────────────────────────────────────────

function RequestsTab() {
  const qc = useQueryClient();

  const { data: raw, isLoading } = useQuery({
    queryKey: ['network-requests'],
    queryFn: () => networkApi.getRequests({ page: 1, limit: 50 }).then(r => r.data.data ?? r.data),
    retry: false,
  });

  const requests: NetworkUser[] = Array.isArray(raw) ? raw : (raw as any)?.data ?? [];

  const accept = useMutation({
    mutationFn: (id: string) => networkApi.acceptRequest(id),
    onSuccess: (_, id) => {
      toast.success('Connection accepted');
      qc.setQueryData(['network-requests'], (old: any) => {
        const list = Array.isArray(old) ? old : old?.data ?? [];
        const updated = list.filter((u: NetworkUser) => u.id !== id);
        return Array.isArray(old) ? updated : { ...old, data: updated };
      });
      qc.invalidateQueries({ queryKey: ['network-connections'] });
      qc.invalidateQueries({ queryKey: ['network-requests-count'] });
    },
  });

  const reject = useMutation({
    mutationFn: (id: string) => networkApi.rejectRequest(id),
    onSuccess: (_, id) => {
      toast.success('Request declined');
      qc.setQueryData(['network-requests'], (old: any) => {
        const list = Array.isArray(old) ? old : old?.data ?? [];
        const updated = list.filter((u: NetworkUser) => u.id !== id);
        return Array.isArray(old) ? updated : { ...old, data: updated };
      });
      qc.invalidateQueries({ queryKey: ['network-requests-count'] });
    },
  });

  if (isLoading) return <UserGrid loading />;
  if (!requests.length) return (
    <EmptyUsers label="No pending requests" sub="You'll see incoming connection requests here" />
  );

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">{requests.length} pending request{requests.length !== 1 ? 's' : ''}</p>
      <UserGrid>
        {requests.map(u => (
          <UserCard key={u.id} user={u}
            primaryAction={
              <Button size="sm" variant="default"
                className="gap-1.5 text-xs w-full"
                onClick={() => accept.mutate(u.id)}
                disabled={accept.isPending && accept.variables === u.id}
              >
                {accept.isPending && accept.variables === u.id
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <UserCheck className="h-3.5 w-3.5" />}
                Accept
              </Button>
            }
            secondaryAction={
              <Button size="sm" variant="ghost"
                className="gap-1.5 text-xs text-muted-foreground hover:text-destructive w-full"
                onClick={() => reject.mutate(u.id)}
                disabled={reject.isPending && reject.variables === u.id}
              >
                {reject.isPending && reject.variables === u.id
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <UserX className="h-3.5 w-3.5" />}
                Decline
              </Button>
            }
          />
        ))}
      </UserGrid>
    </div>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────

function UserCard({ user: u, primaryAction, secondaryAction }: {
  user: NetworkUser;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}) {
  return (
    <div className="glass border border-border/50 rounded-2xl p-4 flex flex-col items-center text-center gap-3 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 group">
      <Avatar className="h-16 w-16 ring-2 ring-primary/10 group-hover:ring-primary/25 transition-all">
        <AvatarImage src={u.profilePicture} />
        <AvatarFallback className="text-base font-bold bg-gradient-to-br from-primary/20 to-accent/10 text-primary">
          {getInitials(`${u.firstName} ${u.lastName}`)}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-0.5 min-w-0 w-full">
        <p className="text-sm font-bold text-foreground truncate font-['Outfit',sans-serif]">{u.firstName} {u.lastName}</p>
        {u.professionalTitle && (
          <p className="text-xs text-muted-foreground truncate">{u.professionalTitle}</p>
        )}
        {u.location && (
          <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
            <MapPin className="h-3 w-3" /> {u.location}
          </p>
        )}
        {u.mutualConnections != null && u.mutualConnections > 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium mt-1">
            {u.mutualConnections} mutual
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        {primaryAction}
        {secondaryAction}
      </div>
    </div>
  );
}

function UserGrid({ children, loading }: { children?: React.ReactNode; loading?: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {loading
        ? [...Array(8)].map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)
        : children}
    </div>
  );
}

function EmptyUsers({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Users className="h-10 w-10 text-muted-foreground mb-3" />
      <p className="text-sm font-medium text-foreground">{label}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function Pagination({ page, pages, setPage }: { page: number; pages: number; setPage: (n: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <Button size="sm" variant="outline" onClick={() => setPage(page - 1)} disabled={page <= 1} className="text-xs">
        Previous
      </Button>
      <span className="text-xs text-muted-foreground">{page} / {pages}</span>
      <Button size="sm" variant="outline" onClick={() => setPage(page + 1)} disabled={page >= pages} className="text-xs">
        Next
      </Button>
    </div>
  );
}
