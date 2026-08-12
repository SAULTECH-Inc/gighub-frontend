import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, Bookmark, Briefcase, Calendar, CheckCircle2,
  Clock, MessageSquare, Send, Sparkles, TrendingUp, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TopBar } from '@/components/common/TopBar';
import { jobsApi, chatApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import {
  cn, APPLICATION_STATUS_COLOR, APPLICATION_STATUS_LABEL,
  formatSalary, timeAgo, getInitials,
} from '@/lib/utils';
import type { Application, Job } from '@/types';

// ─── Greeting ─────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, icon: Icon, gradientFrom, gradientTo, loading, to,
}: {
  label: string; value: string | number; icon: React.ElementType;
  gradientFrom: string; gradientTo: string; loading?: boolean; to?: string;
}) {
  const inner = (
    <div className="glass rounded-2xl border border-border/50 p-4 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center shadow-sm`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      {loading
        ? <Skeleton className="h-8 w-12" />
        : <p className="text-2xl font-bold font-['Outfit',sans-serif]">{value}</p>
      }
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
  icon: Icon, iconClass, title, badge, viewAllTo, children,
}: {
  icon: React.ElementType; iconClass: string; title: string;
  badge?: React.ReactNode; viewAllTo?: string; children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl border border-border/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold flex items-center gap-2 font-['Outfit',sans-serif]">
          <Icon className={cn('h-4 w-4', iconClass)} />
          {title}
          {badge}
        </h3>
        {viewAllTo && (
          <Button variant="ghost" size="sm" asChild className="text-xs h-7 px-2">
            <Link to={viewAllTo}>
              View all <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ApplicantDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: appsData, isLoading: appsLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => jobsApi.getMyApplications({ limit: 20 }).then(r => r.data.data ?? r.data),
    enabled: user?.userType === 'applicant',
  });

  const { data: recsData, isLoading: recsLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => jobsApi.getRecommendations({ limit: 6 }).then(r => r.data.data ?? r.data),
    enabled: user?.userType === 'applicant',
  });

  const { data: interviewsData, isLoading: interviewsLoading } = useQuery({
    queryKey: ['my-interviews-dash'],
    queryFn: () => jobsApi.getMyInterviews({ status: 'scheduled', limit: 5 }).then(r => r.data.data ?? r.data),
    enabled: user?.userType === 'applicant',
  });

  const { data: convsData, isLoading: convsLoading } = useQuery({
    queryKey: ['conversations-dash'],
    queryFn: () => chatApi.getConversations().then(r => r.data.data ?? r.data),
    enabled: !!user,
  });

  const applications: Application[] = useMemo(() => {
    const raw = (appsData as any)?.data ?? appsData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [appsData]);

  const recommendations: Job[] = useMemo(() => {
    const raw = (recsData as any)?.data ?? recsData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [recsData]);

  const interviews: any[] = useMemo(() => {
    const raw = (interviewsData as any)?.data ?? interviewsData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [interviewsData]);

  const conversations: any[] = useMemo(() => {
    const raw = (convsData as any)?.data ?? convsData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [convsData]);

  const totalApps = (appsData as any)?.total ?? applications.length;
  const underReview = applications.filter(a => a.status === 'under_review').length;
  const shortlisted = applications.filter(a => a.status === 'shortlisted').length;
  const offers = applications.filter(a =>
    a.status === 'offer_extended' || a.status === 'offer_accepted' || a.status === 'hired'
  ).length;

  const totalUnread = conversations.reduce((s, c) => s + (c.unreadCount ?? 0), 0);

  return (
    <>
      <TopBar title="Dashboard" />
      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* Greeting banner */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/8 to-accent/10 px-6 py-6">
          {/* Background blobs */}
          <div className="pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full bg-accent/10 blur-[60px]" />
          <div className="pointer-events-none absolute bottom-0 left-20 h-32 w-32 rounded-full bg-primary/10 blur-[50px]" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-['Outfit',sans-serif]">
                {getGreeting()}, {user?.firstName ?? 'there'}! 👋
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {interviews.length > 0
                  ? `You have ${interviews.length} upcoming interview${interviews.length !== 1 ? 's' : ''}.`
                  : "Here's what's happening with your job search."}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <Button size="sm" asChild className="gap-1.5">
                  <Link to="/jobs"><Zap className="h-3.5 w-3.5" /> Find Jobs</Link>
                </Button>
                <Button size="sm" variant="outline" asChild className="gap-1.5">
                  <Link to="/schedules"><Calendar className="h-3.5 w-3.5" /> View Schedule</Link>
                </Button>
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2 shrink-0 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> AI-matched
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-warning/10 border border-warning/20 px-3 py-1">
                <TrendingUp className="h-3.5 w-3.5 text-warning" /> Real-time
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Applied"  value={totalApps}  icon={Send}         gradientFrom="from-primary"     gradientTo="to-accent"    loading={appsLoading} to="/applications" />
          <StatCard label="Under Review"   value={underReview} icon={Clock}        gradientFrom="from-warning"     gradientTo="to-amber-500" loading={appsLoading} to="/applications" />
          <StatCard label="Shortlisted"    value={shortlisted} icon={TrendingUp}   gradientFrom="from-blue-500"    gradientTo="to-indigo-500" loading={appsLoading} to="/applications" />
          <StatCard label="Offers"         value={offers}      icon={CheckCircle2} gradientFrom="from-success"     gradientTo="to-emerald-500" loading={appsLoading} to="/applications" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Applications + Recommendations */}
          <div className="lg:col-span-2 space-y-5">

            {/* Recent Applications */}
            <SectionCard icon={Send} iconClass="text-primary" title="Recent Applications" viewAllTo="/applications">
              {appsLoading ? (
                <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Send className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">No applications yet</p>
                  <Button size="sm" asChild><Link to="/jobs">Browse jobs</Link></Button>
                </div>
              ) : (
                <div className="space-y-1">
                  {applications.slice(0, 6).map(app => (
                    <Link
                      key={app.id}
                      to="/applications"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-raised/60 transition-colors group"
                    >
                      <Avatar className="h-9 w-9 rounded-xl shrink-0 ring-1 ring-border/50">
                        <AvatarImage src={app.job?.employer?.companyLogo} />
                        <AvatarFallback className="rounded-xl text-xs font-bold bg-gradient-to-br from-primary/15 to-accent/10 text-primary">
                          {app.job?.employer?.companyName?.[0] ?? '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate group-hover:text-primary transition-colors">{app.job?.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {app.job?.employer?.companyName} · {timeAgo(app.appliedAt)}
                        </p>
                      </div>
                      <Badge className={cn('text-[10px] border shrink-0', APPLICATION_STATUS_COLOR[app.status])}>
                        {APPLICATION_STATUS_LABEL[app.status]}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* AI Recommendations */}
            <SectionCard icon={Sparkles} iconClass="text-primary" title="AI Recommendations" viewAllTo="/jobs">
              {recsLoading ? (
                <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
              ) : recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Upload your CV to get personalised matches</p>
                  <Button size="sm" asChild><Link to="/resume">Upload CV</Link></Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-2">
                  {recommendations.map(job => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className="flex items-start gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/3 transition-all duration-150 group"
                    >
                      <Avatar className="h-9 w-9 rounded-xl shrink-0 ring-1 ring-border/40">
                        <AvatarImage src={job.employer?.companyLogo} />
                        <AvatarFallback className="rounded-xl text-xs font-bold bg-gradient-to-br from-primary/15 to-accent/10 text-primary">
                          {job.employer?.companyName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate group-hover:text-primary transition-colors">{job.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{job.employer?.companyName}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {formatSalary(job.salaryRange) !== '—' && (
                            <span className="text-[10px] text-muted-foreground">{formatSalary(job.salaryRange)}</span>
                          )}
                          {job.aiMatchScore != null && (
                            <span className={cn(
                              'text-[10px] font-bold px-1.5 py-0.5 rounded-lg border',
                              job.aiMatchScore >= 0.8 ? 'text-success bg-success/10 border-success/20' :
                              job.aiMatchScore >= 0.6 ? 'text-warning bg-warning/10 border-warning/20' :
                              'text-muted-foreground border-border/50',
                            )}>
                              {Math.round(job.aiMatchScore * 100)}% match
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          {/* RIGHT: Interviews + Messages + Quick Links */}
          <div className="space-y-5">

            {/* Upcoming Interviews */}
            <SectionCard icon={Calendar} iconClass="text-success" title="Upcoming Interviews" viewAllTo="/schedules">
              {interviewsLoading ? (
                <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
              ) : interviews.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No upcoming interviews</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {interviews.map(interview => {
                    const date = new Date(interview.scheduledAt);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSoon = (date.getTime() - Date.now()) < 2 * 60 * 60 * 1000 && date > new Date();
                    const jobTitle = interview.application?.job?.title ?? interview.job?.title ?? 'Interview';
                    const company = interview.application?.job?.employer?.companyName ?? interview.job?.employer?.companyName ?? '';
                    return (
                      <Link
                        key={interview.id}
                        to="/schedules"
                        className="flex items-start gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/25 hover:bg-surface-raised/50 transition-all"
                      >
                        <div className="shrink-0 text-center bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 rounded-xl px-2 py-1 min-w-[40px]">
                          <p className="text-[10px] text-primary font-bold uppercase">
                            {date.toLocaleString('default', { month: 'short' })}
                          </p>
                          <p className="text-base font-bold text-primary leading-none">{date.getDate()}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{jobTitle}</p>
                          {company && <p className="text-[11px] text-muted-foreground truncate">{company}</p>}
                          <p className={cn('text-[10px] mt-0.5', isSoon ? 'text-warning font-semibold' : 'text-muted-foreground')}>
                            {isToday
                              ? `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                              : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isSoon && ' · Soon'}
                          </p>
                        </div>
                        {isSoon && (
                          <span className="text-[9px] font-bold text-warning bg-warning/10 border border-warning/20 rounded-lg px-1.5 py-0.5 shrink-0">Soon</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </SectionCard>

            {/* Recent Messages */}
            <SectionCard
              icon={MessageSquare}
              iconClass="text-blue-400"
              title="Messages"
              badge={totalUnread > 0 && (
                <span className="text-[10px] font-bold bg-primary text-white rounded-full px-1.5 py-0.5 leading-none shadow-[0_0_6px_hsl(262_83%_58%/0.4)]">
                  {totalUnread > 99 ? '99+' : totalUnread}
                </span>
              )}
              viewAllTo="/chat"
            >
              {convsLoading ? (
                <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-6">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.slice(0, 4).map((conv: any) => {
                    const other = conv.participants?.find((p: any) => p.id !== user?.id) ?? conv.participants?.[0];
                    const name = other
                      ? `${other.firstName ?? ''} ${other.lastName ?? ''}`.trim() || other.companyName || 'User'
                      : conv.name ?? 'User';
                    const lastMsg = conv.lastMessage?.content ?? '';
                    const hasUnread = (conv.unreadCount ?? 0) > 0;
                    return (
                      <Link
                        key={conv.id}
                        to={`/chat?conv=${conv.id}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-raised/60 transition-colors"
                      >
                        <Avatar className="h-8 w-8 shrink-0 ring-1 ring-border/40">
                          <AvatarImage src={other?.profilePicture ?? other?.companyLogo} />
                          <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-primary/15 to-accent/10 text-primary">
                            {getInitials(name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-xs truncate', hasUnread ? 'font-bold' : 'font-medium')}>{name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{lastMsg || 'No messages yet'}</p>
                        </div>
                        {hasUnread && (
                          <span className="text-[10px] font-bold bg-primary text-white rounded-full px-1.5 py-0.5 shrink-0 shadow-[0_0_6px_hsl(262_83%_58%/0.4)]">
                            {conv.unreadCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </SectionCard>

            {/* Quick Links */}
            <div className="glass rounded-2xl border border-border/50 p-5">
              <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Quick access</p>
              <div className="space-y-1">
                {[
                  { label: 'Browse Jobs',  icon: Briefcase,   to: '/jobs' },
                  { label: 'Saved Jobs',   icon: Bookmark,    to: '/saved-jobs' },
                  { label: 'Auto Apply',   icon: Zap,         to: '/auto-apply' },
                  { label: 'My CV / Resume', icon: TrendingUp, to: '/resume' },
                ].map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-raised/60 transition-colors text-xs group"
                  >
                    <div className="h-7 w-7 rounded-lg bg-surface-raised flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <item.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="group-hover:text-foreground transition-colors">{item.label}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-accent/80 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full bg-white/5 blur-[40px]" />
          <div className="relative z-10">
            <h3 className="font-bold text-base font-['Outfit',sans-serif]">Ready for your next opportunity?</h3>
            <p className="text-sm text-white/75 mt-0.5">Discover jobs that match your skills and aspirations</p>
          </div>
          <div className="relative z-10 flex gap-3 shrink-0">
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90 gap-1.5 text-xs font-bold shadow-sm"
              onClick={() => navigate('/jobs')}
            >
              <Zap className="h-3.5 w-3.5" /> Browse Jobs
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 gap-1.5 text-xs"
              onClick={() => navigate('/profile')}
            >
              Update Profile
            </Button>
          </div>
        </div>

      </div>
    </>
  );
}
