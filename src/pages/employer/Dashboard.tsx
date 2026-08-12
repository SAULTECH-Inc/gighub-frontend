import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity, ArrowRight, BarChart3, Briefcase, Calendar, CheckCircle, ChevronRight,
  Clock, Download, Eye, Lightbulb, MessageSquare, PlusCircle, RefreshCw,
  Sparkles, Star, Target, TrendingUp, UserCheck, Users, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TopBar } from '@/components/common/TopBar';
import { jobsApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { cn, APPLICATION_STATUS_COLOR, APPLICATION_STATUS_LABEL, timeAgo, getInitials } from '@/lib/utils';
import type { Job, Application } from '@/types';
import { PostJobModal } from './PostJobModal';

type Period = 'week' | 'month' | 'quarter' | 'year';

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, icon: Icon, gradientFrom, gradientTo, loading,
}: {
  label: string; value: string | number; icon: React.ElementType;
  gradientFrom: string; gradientTo: string; loading?: boolean;
}) {
  return (
    <div className="glass rounded-2xl border border-border/50 p-4 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center shadow-sm`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      {loading
        ? <Skeleton className="h-8 w-16" />
        : <p className="text-2xl font-bold font-['Outfit',sans-serif]">{value}</p>
      }
    </div>
  );
}

// ─── Quick Action Card ────────────────────────────────────────────────────────
function QuickAction({
  icon: Icon, label, description, onClick, gradientFrom, gradientTo,
}: {
  icon: React.ElementType; label: string; description: string;
  onClick: () => void; gradientFrom: string; gradientTo: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 glass border border-border/50 rounded-2xl p-4 text-left hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 w-full group"
    >
      <div className={`rounded-xl p-2.5 shrink-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-sm`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold group-hover:text-primary transition-colors font-['Outfit',sans-serif] leading-tight">{label}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
      </div>
    </button>
  );
}

// ─── Interview Item ───────────────────────────────────────────────────────────
const TYPE_LABEL: Record<string, string> = {
  'in-person': 'In Person', 'virtual-meeting': 'Virtual', hybrid: 'Hybrid',
  'phone-call': 'Phone', assessment: 'Assessment', 'group-interview': 'Group',
};

function UpcomingInterviewItem({ interview }: { interview: any }) {
  const name = interview.application?.applicant
    ? `${interview.application.applicant.firstName} ${interview.application.applicant.lastName}`
    : 'Candidate';
  const jobTitle = interview.application?.job?.title ?? 'Position';
  const date = new Date(interview.scheduledAt);
  const isToday = date.toDateString() === new Date().toDateString();
  const isSoon = (date.getTime() - Date.now()) < 2 * 60 * 60 * 1000 && date > new Date();

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-raised/60 transition-colors">
      <Avatar className="h-9 w-9 shrink-0 ring-1 ring-border/40">
        <AvatarImage src={interview.application?.applicant?.profilePicture} />
        <AvatarFallback className="text-[11px] font-bold bg-gradient-to-br from-primary/15 to-accent/10 text-primary">{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate">{name}</p>
        <p className="text-[11px] text-muted-foreground truncate">{jobTitle}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className={cn('text-[10px]', isSoon ? 'text-warning font-semibold' : 'text-muted-foreground')}>
            {isToday ? `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : timeAgo(interview.scheduledAt)}
          </span>
          <span className="text-[10px] text-muted-foreground">·</span>
          <span className="text-[10px] text-muted-foreground">{TYPE_LABEL[interview.type] ?? interview.type}</span>
        </div>
      </div>
      {isSoon && (
        <span className="text-[9px] font-bold text-warning bg-warning/10 border border-warning/20 rounded-lg px-1.5 py-0.5 shrink-0">Soon</span>
      )}
    </div>
  );
}

// ─── Application Row ──────────────────────────────────────────────────────────
function AppRow({ app, onClick }: { app: Application; onClick?: () => void }) {
  const name = app.applicant
    ? `${app.applicant.firstName} ${app.applicant.lastName}`
    : 'Applicant';
  const statusColor = APPLICATION_STATUS_COLOR[app.status] ?? 'bg-border text-muted-foreground';
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-raised/60 transition-colors w-full text-left"
    >
      <Avatar className="h-8 w-8 shrink-0 ring-1 ring-border/40">
        <AvatarImage src={(app.applicant as any)?.profilePicture} />
        <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-primary/15 to-accent/10 text-primary">{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate">{name}</p>
        <p className="text-[11px] text-muted-foreground truncate">{app.job?.title ?? '—'}</p>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {app.aiMatchScore != null && (
          <span className="text-[10px] text-primary font-bold">{app.aiMatchScore}%</span>
        )}
        <span className={cn('text-[10px] rounded-full px-2 py-0.5 font-medium', statusColor)}>
          {APPLICATION_STATUS_LABEL[app.status] ?? app.status}
        </span>
      </div>
    </button>
  );
}

// ─── Funnel Bar ───────────────────────────────────────────────────────────────
function FunnelBar({ label, value, total, gradient }: { label: string; value: number; total: number; gradient: string }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold">{value} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-surface-raised rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
  icon: Icon, iconClass, title, extra, viewAllTo, children,
}: {
  icon: React.ElementType; iconClass: string; title: string;
  extra?: React.ReactNode; viewAllTo?: string; children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl border border-border/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={cn('h-4 w-4', iconClass)} />
          <h3 className="text-sm font-bold font-['Outfit',sans-serif]">{title}</h3>
          {extra}
        </div>
        {viewAllTo && (
          <Button variant="ghost" size="sm" asChild className="text-xs h-7 px-2">
            <Link to={viewAllTo}>View all <ArrowRight className="h-3 w-3 ml-1" /></Link>
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function EmployerDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [postJobOpen, setPostJobOpen] = useState(false);
  const [period, setPeriod] = useState<Period>('month');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // ── Queries ──────────────────────────────────────────────────────────────────
  const { data: jobsData, isLoading: jobsLoading, refetch: refetchJobs } = useQuery({
    queryKey: ['employer-jobs-dash'],
    queryFn: () => jobsApi.getEmployerJobs({ limit: 20 }).then(r => r.data.data ?? r.data),
    enabled: user?.userType === 'employer',
  });

  const { data: analyticsData, isLoading: analyticsLoading, refetch: refetchAnalytics } = useQuery({
    queryKey: ['employer-analytics'],
    queryFn: () => jobsApi.getAnalytics().then(r => r.data.data ?? r.data),
    enabled: user?.userType === 'employer',
  });

  const { data: interviewsData, isLoading: interviewsLoading, refetch: refetchInterviews } = useQuery({
    queryKey: ['employer-upcoming-interviews'],
    queryFn: () => jobsApi.getMyInterviews({ status: 'scheduled', limit: 10 }).then(r => r.data.data ?? r.data),
    enabled: user?.userType === 'employer',
  });

  const jobs: Job[] = useMemo(() => {
    const raw = (jobsData as any)?.data ?? jobsData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [jobsData]);

  const isJobActive = (j: any) => {
    const s = j.jobStatus ?? j.status;
    return s === 'posted' || s === 'active';
  };

  const firstActiveJobId = useMemo(() => jobs.find(isJobActive)?.id, [jobs]);

  const { data: appsData, isLoading: appsLoading } = useQuery({
    queryKey: ['employer-recent-apps', firstActiveJobId],
    queryFn: () => jobsApi.getApplicationsForJob(firstActiveJobId!, { limit: 8 }).then(r => r.data.data ?? r.data),
    enabled: !!firstActiveJobId,
  });

  const analytics: any = (analyticsData as any)?.data ?? analyticsData ?? {};
  const interviews: any[] = useMemo(() => {
    const raw = (interviewsData as any)?.data ?? interviewsData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [interviewsData]);
  const recentApps: Application[] = useMemo(() => {
    const raw = (appsData as any)?.data ?? appsData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [appsData]);

  const activeJobs = analytics?.activeJobs ?? jobs.filter(isJobActive).length;
  const totalApplicants = analytics?.totalApplications ?? jobs.reduce((s, j: any) => s + (j.applicantCount ?? j.applicationsCount ?? j._count?.applications ?? 0), 0);
  const scheduledCount = interviews.length;
  const totalJobs = analytics?.totalJobs ?? (jobsData as any)?.total ?? jobs.length;

  const funnelTotal = analytics?.totalApplications ?? totalApplicants;
  const funnelShortlisted = analytics?.shortlisted ?? recentApps.filter(a => a.status === 'shortlisted').length;
  const funnelInterviewed = analytics?.interviewed ?? scheduledCount;
  const funnelHired = analytics?.hired ?? 0;

  const handleRefresh = () => {
    refetchJobs(); refetchAnalytics(); refetchInterviews();
  };

  const handleExport = () => {
    const rows: string[][] = [
      ['Dashboard Report', new Date().toLocaleDateString(), `Period: ${period}`],
      [],
      ['--- Metrics ---'],
      ['Active Jobs', 'Total Applicants', 'Scheduled Interviews', 'Total Jobs'],
      [String(activeJobs), String(totalApplicants), String(scheduledCount), String(totalJobs)],
      [],
      ['--- Active Job Postings ---'],
      ['Title', 'Status', 'Applicants', 'Posted'],
      ...jobs.filter(j => j.status === 'active').map(j => [
        j.title, j.status, String(j._count?.applications ?? 0), timeAgo(j.createdAt),
      ]),
      [],
      ['--- Upcoming Interviews ---'],
      ['Candidate', 'Job', 'Date', 'Type'],
      ...interviews.map(i => [
        i.application?.applicant
          ? `${i.application.applicant.firstName} ${i.application.applicant.lastName}`
          : 'Candidate',
        i.application?.job?.title ?? '',
        new Date(i.scheduledAt).toLocaleString(),
        TYPE_LABEL[i.type] ?? i.type,
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const topBarActions = (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Button variant="ghost" size="sm" onClick={handleExport} className="text-xs gap-1.5 px-2 sm:px-3" title="Export report">
        <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Export</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleRefresh} className="text-xs gap-1.5 px-2 sm:px-3" title="Refresh dashboard">
        <RefreshCw className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Refresh</span>
      </Button>
      <Button size="sm" onClick={() => setPostJobOpen(true)} className="gap-1.5 text-xs px-2.5 sm:px-3">
        <PlusCircle className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Post a Job</span><span className="sm:hidden">Post</span>
      </Button>
    </div>
  );

  return (
    <>
      <TopBar title="Dashboard" actions={topBarActions} />
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5 sm:space-y-6">

        {/* Hero greeting */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/8 to-accent/10 px-4 sm:px-6 py-5 sm:py-6">
          <div className="pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full bg-accent/10 blur-[60px]" />
          <div className="pointer-events-none absolute bottom-0 left-20 h-32 w-32 rounded-full bg-primary/10 blur-[50px]" />
          <div className="relative z-10">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-['Outfit',sans-serif]">
                {greeting}, {user?.companyName ?? 'there'}! 👋
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {scheduledCount > 0
                  ? `You have ${scheduledCount} interview${scheduledCount !== 1 ? 's' : ''} scheduled.`
                  : 'Your hiring dashboard is ready with the latest updates.'}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> AI-powered insights
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-warning/10 border border-warning/20 px-3 py-1">
                  <Zap className="h-3.5 w-3.5 text-warning" /> Real-time analytics
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickAction
              icon={PlusCircle} label="Post New Job" description="Create & publish a position"
              gradientFrom="from-primary" gradientTo="to-accent" onClick={() => setPostJobOpen(true)}
            />
            <QuickAction
              icon={Calendar} label="Schedule Interview" description="Book interview slots"
              gradientFrom="from-success" gradientTo="to-emerald-500" onClick={() => navigate('/schedules')}
            />
            <QuickAction
              icon={Users} label="Browse Candidates" description="Scout & evaluate talent"
              gradientFrom="from-blue-500" gradientTo="to-indigo-500" onClick={() => navigate('/employer/candidates')}
            />
            <QuickAction
              icon={BarChart3} label="View Analytics" description="Deep dive into metrics"
              gradientFrom="from-orange-500" gradientTo="to-amber-500" onClick={() => setShowAnalytics(v => !v)}
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Key Metrics</p>
            <select
              value={period}
              onChange={e => setPeriod(e.target.value as Period)}
              className="text-xs bg-surface/80 border border-border/60 rounded-xl px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Active Jobs"           value={activeJobs}       icon={Briefcase}   gradientFrom="from-primary"   gradientTo="to-accent"     loading={jobsLoading} />
            <StatCard label="Total Applicants"      value={totalApplicants}  icon={Users}       gradientFrom="from-warning"   gradientTo="to-amber-500"  loading={jobsLoading} />
            <StatCard label="Interviews Scheduled"  value={scheduledCount}   icon={Calendar}    gradientFrom="from-success"   gradientTo="to-emerald-500" loading={interviewsLoading} />
            <StatCard label="Jobs Posted"           value={totalJobs}        icon={TrendingUp}  gradientFrom="from-blue-500"  gradientTo="to-indigo-500" loading={jobsLoading} />
          </div>
        </div>

        {/* Analytics expanded panel */}
        {showAnalytics && (
          <div className="glass rounded-2xl border border-border/50 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold font-['Outfit',sans-serif]">Analytics Overview</h3>
              </div>
              <button
                onClick={() => setShowAnalytics(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Hide
              </button>
            </div>
            {analyticsLoading ? (
              <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 rounded-xl" />)}</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total Applications', value: analytics?.totalApplications ?? funnelTotal, icon: Users },
                  { label: 'Avg Match Score', value: analytics?.averageMatchScore != null ? `${Math.round(analytics.averageMatchScore)}%` : '—', icon: Star },
                  { label: 'Hired', value: analytics?.hired ?? 0, icon: UserCheck },
                  { label: 'Conversion Rate', value: funnelTotal > 0 ? `${Math.round((funnelHired / funnelTotal) * 100)}%` : '—', icon: TrendingUp },
                ].map(m => (
                  <div key={m.label} className="bg-surface-raised/60 rounded-xl p-3.5 border border-border/30">
                    <div className="flex items-center gap-2 mb-1.5">
                      <m.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-[11px] text-muted-foreground">{m.label}</p>
                    </div>
                    <p className="text-xl font-bold font-['Outfit',sans-serif]">{String(m.value)}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-3 pt-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Hiring Funnel</p>
              <FunnelBar label="Total Applications" value={funnelTotal}       total={funnelTotal} gradient="from-blue-500 to-indigo-500" />
              <FunnelBar label="Shortlisted"        value={funnelShortlisted} total={funnelTotal} gradient="from-primary to-accent" />
              <FunnelBar label="Interviewed"        value={funnelInterviewed} total={funnelTotal} gradient="from-warning to-amber-400" />
              <FunnelBar label="Hired"              value={funnelHired}       total={funnelTotal} gradient="from-success to-emerald-400" />
            </div>
          </div>
        )}

        {/* Main grid: 2/3 + 1/3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-5">

            {/* Recent Applications */}
            <SectionCard
              icon={Activity} iconClass="text-orange-400" title="Recent Applications"
              extra={firstActiveJobId && (
                <span className="text-[10px] text-muted-foreground">
                  · {jobs.find(j => j.id === firstActiveJobId)?.title}
                </span>
              )}
              viewAllTo="/employer/jobs"
            >
              {!firstActiveJobId && !jobsLoading ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">No active jobs yet. Post a job to start receiving applications.</p>
                </div>
              ) : appsLoading || jobsLoading ? (
                <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
              ) : recentApps.length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center">No applications received yet.</p>
              ) : (
                <div className="space-y-1">
                  {recentApps.slice(0, 6).map(app => (
                    <AppRow key={app.id} app={app} onClick={() => navigate(`/employer/jobs/${app.jobId}/candidates`)} />
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Active Job Postings */}
            <SectionCard
              icon={Briefcase} iconClass="text-blue-400" title="Active Job Postings"
              extra={<span className="text-[10px] text-muted-foreground">{activeJobs} open</span>}
              viewAllTo="/employer/jobs"
            >
              {jobsLoading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
              ) : jobs.filter(j => j.status === 'active').length === 0 ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">No active jobs</p>
                  <Button size="sm" onClick={() => setPostJobOpen(true)}>
                    <PlusCircle className="h-3.5 w-3.5 mr-1.5" /> Post your first job
                  </Button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {jobs.filter(j => j.status === 'active').slice(0, 5).map(job => (
                    <Link
                      key={job.id}
                      to={`/employer/jobs/${job.id}/candidates`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-raised/60 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate group-hover:text-primary transition-colors">{job.title}</p>
                        <p className="text-[11px] text-muted-foreground">{job.location} · {timeAgo(job.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" /> {job._count?.applications ?? 0}
                        </span>
                        <Badge variant="default" className="text-[10px] bg-success/10 text-success border-success/20">Active</Badge>
                      </div>
                    </Link>
                  ))}
                  {jobs.filter(j => j.status !== 'active').slice(0, 3).map(job => (
                    <Link
                      key={job.id}
                      to={`/employer/jobs/${job.id}/candidates`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-raised/60 transition-colors opacity-60 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate group-hover:text-foreground transition-colors">{job.title}</p>
                        <p className="text-[11px] text-muted-foreground">{timeAgo(job.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" /> {job._count?.applications ?? 0}
                        </span>
                        <Badge variant="outline" className="text-[10px] capitalize">{job.status}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* AI Insights */}
            <SectionCard icon={Lightbulb} iconClass="text-warning" title="Tips & Insights">
              <div className="space-y-2.5">
                {activeJobs === 0 && (
                  <div className="flex items-start gap-3 p-3.5 rounded-xl border border-primary/20 bg-primary/5">
                    <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Post your first job</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Use AI-assisted job posting to attract the right candidates faster.</p>
                    </div>
                  </div>
                )}
                {totalApplicants > 0 && funnelShortlisted === 0 && (
                  <div className="flex items-start gap-3 p-3.5 rounded-xl border border-warning/20 bg-warning/5">
                    <Target className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Review pending applications</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">You have {totalApplicants} applicants waiting. Shortlisting within 48h improves offer acceptance.</p>
                    </div>
                  </div>
                )}
                {scheduledCount === 0 && activeJobs > 0 && (
                  <div className="flex items-start gap-3 p-3.5 rounded-xl border border-success/20 bg-success/5">
                    <Calendar className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Schedule your first interview</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Quick scheduling improves candidate experience and reduces drop-off rates.</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5">
                  <MessageSquare className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold">Engage candidates early</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Employers who message within 24h see 3× higher acceptance rates.</p>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">

            {/* Upcoming Interviews */}
            <SectionCard icon={Calendar} iconClass="text-success" title="Upcoming Interviews" viewAllTo="/schedules">
              {interviewsLoading ? (
                <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
              ) : interviews.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No scheduled interviews</p>
                  <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => navigate('/schedules')}>
                    Schedule one
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  {interviews.slice(0, 5).map(i => <UpcomingInterviewItem key={i.id} interview={i} />)}
                </div>
              )}
            </SectionCard>

            {/* Hiring Funnel */}
            <div className="glass rounded-2xl border border-border/50 p-5">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold font-['Outfit',sans-serif]">Hiring Funnel</h3>
              </div>
              {jobsLoading ? (
                <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-6 rounded-xl" />)}</div>
              ) : funnelTotal === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No data yet</p>
              ) : (
                <div className="space-y-4">
                  <FunnelBar label="Applied"      value={funnelTotal}       total={funnelTotal} gradient="from-blue-500 to-indigo-500" />
                  <FunnelBar label="Shortlisted"  value={funnelShortlisted} total={funnelTotal} gradient="from-primary to-accent" />
                  <FunnelBar label="Interviewed"  value={funnelInterviewed} total={funnelTotal} gradient="from-warning to-amber-400" />
                  <FunnelBar label="Hired"        value={funnelHired}       total={funnelTotal} gradient="from-success to-emerald-400" />
                </div>
              )}
            </div>

            {/* At a Glance */}
            <div className="glass rounded-2xl border border-border/50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-bold font-['Outfit',sans-serif]">At a Glance</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: CheckCircle, iconClass: 'text-success', label: 'Hired this period', value: funnelHired },
                  { icon: Clock,       iconClass: 'text-warning', label: 'Pending review',    value: recentApps.filter(a => a.status === 'pending' || a.status === 'under_review').length },
                  { icon: UserCheck,   iconClass: 'text-primary', label: 'Shortlisted',       value: funnelShortlisted },
                  { icon: Briefcase,   iconClass: 'text-blue-400', label: 'Draft jobs',       value: jobs.filter(j => j.status === 'draft').length },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <row.icon className={cn('h-3.5 w-3.5', row.iconClass)} />
                      {row.label}
                    </span>
                    <span className="font-bold">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PostJobModal open={postJobOpen} onClose={() => setPostJobOpen(false)} />
    </>
  );
}
