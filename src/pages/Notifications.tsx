import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell, Search, Check, CheckCheck, Trash2, Loader2,
  Briefcase, MessageSquare, Zap, Users, Star, Info,
} from 'lucide-react';
import { TopBar } from '@/components/common/TopBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { notificationsApi } from '@/lib/api';
import { cn, timeAgo, toList } from '@/lib/utils';
import type { Notification } from '@/types';
import toast from 'react-hot-toast';

type SortOrder = 'newest' | 'oldest';
type FilterType = 'all' | 'unread' | string;

const TYPE_ICON: Record<string, React.ElementType> = {
  application:   Briefcase,
  message:       MessageSquare,
  ai:            Zap,
  interview:     Users,
  offer:         Star,
  system:        Info,
};

const TYPE_COLOR: Record<string, string> = {
  application: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  message:     'bg-primary/15 text-primary border border-primary/20',
  ai:          'bg-purple-500/15 text-purple-400 border border-purple-500/20',
  interview:   'bg-warning/15 text-warning border border-warning/20',
  offer:       'bg-success/15 text-success border border-success/20',
  system:      'bg-muted/20 text-muted-foreground border border-border/40',
};

export default function NotificationsPage() {
  const qc = useQueryClient();
  const [search,     setSearch]     = useState('');
  const [sortOrder,  setSortOrder]  = useState<SortOrder>('newest');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');

  const { data: raw, isLoading } = useQuery({
    queryKey: ['notifications-page'],
    queryFn: () => notificationsApi.list({ limit: 100 }).then(r => r.data),
    retry: false,
  });

  const notifications = useMemo(() => toList<Notification>(raw), [raw]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...notifications]
      .filter(n => {
        if (typeFilter === 'unread' && n.isRead) return false;
        if (typeFilter !== 'all' && typeFilter !== 'unread' && n.type !== typeFilter) return false;
        if (q && !(n.title ?? '').toLowerCase().includes(q) && !(n.body ?? '').toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        const ta = new Date(a.createdAt).getTime();
        const tb = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? tb - ta : ta - tb;
      });
  }, [notifications, search, sortOrder, typeFilter]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Rewrites the cached list in place, whatever envelope the API wrapped it in.
  const patchCache = (fn: (list: Notification[]) => Notification[]) => {
    qc.setQueryData(['notifications-page'], (old: any) => {
      const updated = fn(toList<Notification>(old));
      if (!old || Array.isArray(old)) return updated;
      if (Array.isArray(old.data?.items)) return { ...old, data: { ...old.data, items: updated } };
      if (Array.isArray(old.items))       return { ...old, items: updated };
      if (Array.isArray(old.data))        return { ...old, data: updated };
      return updated;
    });
  };

  const markRead = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: (_, id) => {
      patchCache(list => list.map(n => n.id === id ? { ...n, isRead: true } : n));
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllRead = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      patchCache(list => list.map(n => ({ ...n, isRead: true })));
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  const deleteNotif = useMutation({
    mutationFn: (id: string) => notificationsApi.delete(id),
    onSuccess: (_, id) => {
      patchCache(list => list.filter(n => n.id !== id));
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, Notification[]>();
    for (const n of filtered) {
      const d = new Date(n.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      let key: string;
      if (d.toDateString() === today.toDateString()) key = 'Today';
      else if (d.toDateString() === yesterday.toDateString()) key = 'Yesterday';
      else key = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(n);
    }
    return map;
  }, [filtered]);

  const types = useMemo(() => {
    const set = new Set(notifications.map(n => n.type).filter(Boolean));
    return Array.from(set) as string[];
  }, [notifications]);

  return (
    <>
      <TopBar title="Notifications" />

      <div className="flex flex-col flex-1 max-w-3xl mx-auto w-full p-5 space-y-5">

        {/* Header bar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter notifications…"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border/60 bg-surface/80 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 focus:shadow-[0_0_0_4px_hsl(262_83%_58%/0.08)] transition-all placeholder:text-muted-foreground"
            />
          </div>

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as SortOrder)}
            className="h-10 px-3 rounded-xl border border-border/60 bg-surface/80 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>

          {/* Mark all read */}
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs font-semibold rounded-xl"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              {markAllRead.isPending
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <CheckCheck className="h-3.5 w-3.5" />}
              Mark all read
            </Button>
          )}
        </div>

        {/* Type filter chips */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'all',    label: 'All' },
            { value: 'unread', label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
            ...types.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) })),
          ].map(chip => (
            <button
              key={chip.value}
              onClick={() => setTypeFilter(chip.value)}
              className={cn(
                'text-xs px-3.5 py-1.5 rounded-xl border font-medium transition-all duration-150',
                typeFilter === chip.value
                  ? 'bg-primary/15 border-primary/40 text-primary font-bold shadow-[0_0_10px_hsl(262_83%_58%/0.15)]'
                  : 'border-border/60 text-muted-foreground hover:text-foreground hover:bg-surface-raised',
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl border border-border/50 flex flex-col items-center justify-center py-20 text-center p-6">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-bold text-foreground font-['Outfit',sans-serif]">
              {search ? 'No notifications match your filter' : 'No notifications yet'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {search ? 'Try a different keyword' : "You're all caught up!"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from(grouped.entries()).map(([date, items]) => (
              <div key={date} className="space-y-2">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1 font-['Outfit',sans-serif]">{date}</p>
                <div className="glass rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/40 shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                  {items.map(n => {
                    const type = n.type ?? 'system';
                    const Icon = TYPE_ICON[type] ?? Bell;
                    const iconStyle = TYPE_COLOR[type] ?? TYPE_COLOR.system;

                    return (
                      <div
                        key={n.id}
                        className={cn(
                          'flex items-start gap-3.5 px-4 py-4 transition-all duration-150 group relative',
                          !n.isRead ? 'bg-primary/5 hover:bg-primary/8' : 'hover:bg-surface-raised/60',
                        )}
                      >
                        {/* Unread indicator bar */}
                        {!n.isRead && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-primary to-accent" />
                        )}

                        {/* Icon */}
                        <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5', iconStyle)}>
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn('text-sm', !n.isRead ? 'font-bold text-foreground' : 'font-medium text-foreground/90')}>
                              {n.title}
                            </p>
                            <span className="text-[11px] text-muted-foreground shrink-0 mt-0.5">{timeAgo(n.createdAt)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.body}</p>
                          {n.type && (
                            <Badge variant="outline" className="text-[10px] mt-2 px-2 py-0.5 capitalize border-border/60">
                              {n.type}
                            </Badge>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-center gap-1.5 shrink-0 self-center">
                          {!n.isRead && (
                            <button
                              title="Mark as read"
                              onClick={() => markRead.mutate(n.id)}
                              disabled={markRead.isPending && markRead.variables === n.id}
                              className="h-7 w-7 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                              {markRead.isPending && markRead.variables === n.id
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <Check className="h-3.5 w-3.5" />}
                            </button>
                          )}
                          <button
                            title="Delete"
                            onClick={() => deleteNotif.mutate(n.id)}
                            disabled={deleteNotif.isPending && deleteNotif.variables === n.id}
                            className="h-7 w-7 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            {deleteNotif.isPending && deleteNotif.variables === n.id
                              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              : <Trash2 className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
