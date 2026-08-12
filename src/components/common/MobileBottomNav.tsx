import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, FileText, MessageSquare, User,
  Menu, X, Sun, Moon, LogOut, Sparkles, ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi, chatApi, authApi } from '@/lib/api';
import { cn, getInitials } from '@/lib/utils';
import { APPLICANT_GROUPS, EMPLOYER_GROUPS } from '@/components/common/Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import toast from 'react-hot-toast';

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const isEmployer = user?.userType === 'employer';

  // Unread counts for mobile badges
  const { data: convData } = useQuery({
    queryKey: ['conversations-unread-count'],
    queryFn: () => chatApi.getConversations().then(r => r.data.data ?? r.data),
    retry: false,
  });

  const convList = Array.isArray(convData) ? convData : (convData as any)?.data ?? [];
  const unreadMessages = convList.reduce((acc: number, c: any) => acc + (c.unreadCount ?? 0), 0);

  const tabs = isEmployer ? [
    { label: 'Home',     path: '/dashboard',       icon: LayoutDashboard },
    { label: 'Jobs',     path: '/employer/jobs',   icon: Briefcase       },
    { label: 'Messages', path: '/chat',            icon: MessageSquare, badge: unreadMessages },
    { label: 'Profile',  path: '/employer/profile', icon: User           },
  ] : [
    { label: 'Home',     path: '/dashboard',     icon: LayoutDashboard },
    { label: 'Jobs',     path: '/jobs',          icon: Briefcase       },
    { label: 'Applied',  path: '/applications',  icon: FileText        },
    { label: 'Messages', path: '/chat',          icon: MessageSquare, badge: unreadMessages },
  ];

  const groups = isEmployer ? EMPLOYER_GROUPS : APPLICANT_GROUPS;

  const displayName = isEmployer
    ? user?.companyName ?? 'Company'
    : `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'User';

  async function handleLogout() {
    try { await authApi.logout(); } catch { /* best effort */ }
    clearAuth();
    setMenuOpen(false);
    toast.success('Logged out');
  }

  return (
    <>
      {/* Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass bg-surface/95 backdrop-blur-2xl border-t border-border/60 shadow-[0_-4px_24px_rgba(0,0,0,0.35)] px-2 pt-2 pb-safe">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 min-w-[56px]',
                  isActive
                    ? 'text-primary font-bold scale-105'
                    : 'text-muted-foreground hover:text-foreground font-medium',
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-primary/15 border border-primary/30 shadow-[0_0_12px_hsl(262_83%_58%/0.2)]" />
                )}

                <div className="relative">
                  <Icon className={cn('h-5 w-5 transition-transform', isActive && 'stroke-[2.2px]')} />
                  {tab.badge && tab.badge > 0 ? (
                    <span className="absolute -top-1 -right-1.5 min-w-[15px] h-3.5 flex items-center justify-center rounded-full bg-destructive text-white text-[9px] font-extrabold px-1 animate-pulse shadow-sm">
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </span>
                  ) : null}
                </div>

                <span className={cn('text-[10px] mt-1 relative z-10 leading-none font-[\'Outfit\',sans-serif]', isActive && 'text-primary')}>
                  {tab.label}
                </span>
              </Link>
            );
          })}

          {/* 5th Menu Tab trigger */}
          <button
            onClick={() => setMenuOpen(true)}
            className={cn(
              'relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 min-w-[56px]',
              menuOpen
                ? 'text-primary font-bold scale-105'
                : 'text-muted-foreground hover:text-foreground font-medium',
            )}
          >
            {menuOpen && (
              <div className="absolute inset-0 rounded-2xl bg-primary/15 border border-primary/30 shadow-[0_0_12px_hsl(262_83%_58%/0.2)]" />
            )}

            <div className="relative">
              <Menu className={cn('h-5 w-5 transition-transform', menuOpen && 'stroke-[2.2px]')} />
            </div>

            <span className={cn('text-[10px] mt-1 relative z-10 leading-none font-[\'Outfit\',sans-serif]', menuOpen && 'text-primary')}>
              Menu
            </span>
          </button>
        </div>
      </nav>

      {/* Full-featured Mobile Menu Sheet Drawer */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-3xl animate-in fade-in duration-200">
          
          {/* Sheet Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-surface/80 pt-safe">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src={user?.profilePicture ?? (user as any)?.companyLogo} />
                <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-primary/20 to-accent/10 text-primary">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate font-['Outfit',sans-serif]">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => setMenuOpen(false)}
              className="h-9 w-9 rounded-2xl bg-surface-raised border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* All Sidebar Sections & Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-24 touch-scrolling">
            {groups.map((group) => (
              <div key={group.title} className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest px-1 font-['Outfit',sans-serif]">
                  {group.title}
                </p>
                <div className="glass rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/40">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          'flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors group',
                          isActive
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-foreground/90 hover:bg-surface-raised/60',
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
                          <span className="font-['Outfit',sans-serif]">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quick Actions Footer inside drawer */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between glass border border-border/50 rounded-2xl p-3.5">
                <span className="text-xs font-semibold text-muted-foreground">Appearance</span>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-raised border border-border text-xs font-semibold text-foreground"
                >
                  {theme === 'dark' ? <><Sun className="h-3.5 w-3.5 text-warning" /> Light Mode</> : <><Moon className="h-3.5 w-3.5 text-primary" /> Dark Mode</>}
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold hover:bg-destructive/15 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
