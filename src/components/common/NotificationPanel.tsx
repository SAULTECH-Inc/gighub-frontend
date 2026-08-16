import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { notificationsApi } from '@/lib/api';
import { cn, timeAgo, toList } from '@/lib/utils';
import type { Notification } from '@/types';

interface Props { open: boolean; onClose: () => void; }

export function NotificationPanel({ open, onClose }: Props) {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.list({ limit: 30 }).then(r => r.data),
    enabled: open,
    refetchInterval: open ? 30_000 : false,
  });

  const markAll = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markOne = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const notifications = toList<Notification>(data);
  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-sm p-0">
        <SheetHeader className="flex-row items-center justify-between">
          <div>
            <SheetTitle>Notifications</SheetTitle>
            {unread > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">{unread} unread</p>
            )}
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={() => markAll.mutate()} className="text-xs">
              <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark all read
            </Button>
          )}
        </SheetHeader>

        <SheetBody className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <Bell className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">All caught up</p>
              <p className="text-xs text-muted-foreground mt-1">No notifications yet</p>
            </div>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => !n.isRead && markOne.mutate(n.id)}
                  className={cn(
                    'flex gap-3 px-4 py-3 border-b border-border/50 cursor-default transition-colors',
                    !n.isRead && 'bg-primary/5 hover:bg-primary/10',
                    n.isRead && 'hover:bg-surface-raised',
                  )}
                >
                  <div className={cn('mt-0.5 h-2 w-2 rounded-full shrink-0', !n.isRead ? 'bg-primary' : 'bg-transparent')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground leading-snug">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{n.body}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
