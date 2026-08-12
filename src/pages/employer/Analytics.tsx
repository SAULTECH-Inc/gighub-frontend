import { useQuery } from '@tanstack/react-query';
import {
  Briefcase, Users, TrendingUp, CheckCircle2,
  Clock, Zap, UserCheck, XCircle, BarChart2,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { TopBar } from '@/components/common/TopBar';
import { jobsApi } from '@/lib/api';
import { cn, APPLICATION_STATUS_LABEL } from '@/lib/utils';
import type { Job } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Analytics {
  overview: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    hired: number;
    avgMatchScore: number;
  };
  applicationsByStatus: Record<string, number>;
  topJobs: Array<{ id: string; title: string; applications: number; hired: number }>;
  recentActivity: Array<{ applicantName: string; jobTitle: string; status: string; time: string }>;
}

// ─── Pipeline stages (order matters for funnel) ───────────────────────────────

const PIPELINE = [
  { status: 'pending',            label: 'Applied',       color: 'bg-muted-foreground/30' },
  { status: 'under_review',       label: 'Under Review',  color: 'bg-blue-500/60' },
  { status: 'shortlisted',        label: 'Shortlisted',   color: 'bg-primary/70' },
  { status: 'interview_scheduled',label: 'Interviewing',  color: 'bg-warning/80' },
  { status: 'offer_extended',     label: 'Offer Sent',    color: 'bg-orange-400/80' },
  { status: 'hired',              label: 'Hired',         color: 'bg-success' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  // Try the dedicated analytics endpoint first
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['employer-analytics'],
    queryFn: () => jobsApi.getAnalytics().then(r => r.data.data ?? r.data),
    retry: false,
  });

  // Fallback: derive what we can from the jobs list
  const { data: jobsRaw, isLoading: jobsLoading } = useQuery({
    queryKey: ['employer-jobs-all'],
    queryFn: () => jobsApi.getEmployerJobs({ limit: 100 }).then(r => r.data.data ?? r.data),
    enabled: !analyticsData,
  });

  const isLoading = analyticsLoading || jobsLoading;

  // Derive analytics from jobs data when dedicated endpoint isn't available
  const jobs: Job[] = (jobsRaw as any)?.data ?? jobsRaw ?? [];
  const derived: Analytics | null = analyticsData ?? (jobs.length > 0 ? deriveAnalytics(jobs) : null);

  return (
    <>
      <TopBar title="Analytics" />

      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* ── Overview stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {isLoading
            ? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
            : [
                { label: 'Jobs Posted',  value: derived?.overview?.totalJobs ?? 0,        icon: Briefcase,  grad: 'from-primary/30 to-blue-500/20',   color: 'text-primary' },
                { label: 'Active Jobs',  value: derived?.overview?.activeJobs ?? 0,        icon: TrendingUp, grad: 'from-blue-500/30 to-cyan-500/20',  color: 'text-blue-400' },
                { label: 'Applications',  value: derived?.overview?.totalApplications ?? 0, icon: Users,      grad: 'from-warning/30 to-orange-400/20',  color: 'text-warning' },
                { label: 'Hired',        value: derived?.overview?.hired ?? 0,             icon: UserCheck,  grad: 'from-success/30 to-emerald-400/20', color: 'text-success' },
                { label: 'Avg AI Match', value: derived?.overview?.avgMatchScore != null
                    ? `${Math.round((derived?.overview?.avgMatchScore ?? 0) * 100)}%`
                    : '—',                                                                  icon: Zap,        grad: 'from-purple-500/30 to-pink-500/20',  color: 'text-primary' },
              ].map(s => (
                <div key={s.label} className="glass border border-border/50 rounded-2xl p-4 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                    <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center`}>
                      <s.icon className={cn('h-4 w-4', s.color)} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground font-['Outfit',sans-serif]">{s.value}</p>
                </div>
              ))
          }
        </div>

        <div className="grid sm:grid-cols-2 gap-5">

          {/* ── Application pipeline ── */}
          <div className="glass border border-border/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-primary" /> Application Pipeline
            </h3>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 rounded-lg" />)}
              </div>
            ) : derived ? (
              <div className="space-y-2.5">
                {(() => {
                  const total = Object.values(derived.applicationsByStatus).reduce((s, v) => s + v, 0) || 1;
                  return PIPELINE.map(stage => {
                    const count = derived.applicationsByStatus[stage.status] ?? 0;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={stage.status}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">{stage.label}</span>
                          <span className="text-xs font-semibold text-foreground">{count}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-surface-raised overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all duration-500', stage.color)}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            ) : (
              <EmptyState label="No application data yet" />
            )}
          </div>

          {/* ── Top jobs ── */}
          <div className="glass border border-border/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Top Jobs by Applications
            </h3>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
              </div>
            ) : derived?.topJobs?.length ? (
              <div className="space-y-3">
                {(() => {
                  const max = Math.max(...((derived?.topJobs ?? []).map(j => j.applications)), 1);
                  return (derived?.topJobs ?? []).slice(0, 6).map((job, i) => (
                    <div key={job.id}>
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <Link
                          to={`/employer/jobs/${job.id}/candidates`}
                          className="text-xs font-medium text-foreground hover:text-primary transition-colors truncate flex items-center gap-1 group"
                        >
                          {job.title}
                          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </Link>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {job.applications} applicants
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-raised overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary/60 transition-all duration-500"
                          style={{ width: `${(job.applications / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <EmptyState label="No jobs data yet" />
            )}
          </div>
        </div>

        {/* ── Rejection / success overview ── */}
        {derived && !isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: 'Rejection rate',
                value: (() => {
                  const total = Object.values(derived.applicationsByStatus).reduce((s, v) => s + v, 0);
                  const rejected = derived.applicationsByStatus['rejected'] ?? 0;
                  return total > 0 ? `${Math.round((rejected / total) * 100)}%` : '—';
                })(),
                icon: XCircle,
                color: 'text-destructive',
              },
              {
                label: 'Interview rate',
                value: (() => {
                  const total = Object.values(derived.applicationsByStatus).reduce((s, v) => s + v, 0);
                  const interviewed = (derived.applicationsByStatus['interview_scheduled'] ?? 0)
                    + (derived.applicationsByStatus['offer_extended'] ?? 0)
                    + (derived.applicationsByStatus['hired'] ?? 0);
                  return total > 0 ? `${Math.round((interviewed / total) * 100)}%` : '—';
                })(),
                icon: Clock,
                color: 'text-warning',
              },
              {
                label: 'Offer acceptance',
                value: (() => {
                  const offered = (derived.applicationsByStatus['offer_extended'] ?? 0)
                    + (derived.applicationsByStatus['hired'] ?? 0);
                  const accepted = derived.applicationsByStatus['hired'] ?? 0;
                  return offered > 0 ? `${Math.round((accepted / offered) * 100)}%` : '—';
                })(),
                icon: CheckCircle2,
                color: 'text-success',
              },
              {
                label: 'Avg per job',
                value: (() => {
                  const total = Object.values(derived.applicationsByStatus).reduce((s, v) => s + v, 0);
                  const jobs = derived?.overview?.totalJobs ?? 0;
                  return jobs > 0 ? (total / jobs).toFixed(1) : '—';
                })(),
                icon: Users,
                color: 'text-blue-400',
              },
            ].map(s => (
              <div key={s.label} className="bg-surface border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <s.icon className={cn('h-4 w-4', s.color)} />
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Recent activity ── */}
        {derived?.recentActivity && derived.recentActivity.length > 0 && (
          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {(derived?.recentActivity ?? []).map((activity, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">
                      <span className="font-medium">{activity.applicantName}</span>{' '}
                      applied for{' '}
                      <span className="font-medium">{activity.jobTitle}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge className="text-[10px] shrink-0" variant="outline">
                    {APPLICATION_STATUS_LABEL[activity.status] ?? activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state when no data at all */}
        {!isLoading && !derived && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BarChart2 className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">No data yet</p>
            <p className="text-xs text-muted-foreground mt-1">Post your first job to start tracking analytics.</p>
            <Link to="/employer/jobs" className="mt-4 text-xs text-primary hover:underline">
              Go to My Jobs →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Derive analytics from job list (fallback) ────────────────────────────────

function deriveAnalytics(jobs: Job[]): Analytics {
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const totalApplications = jobs.reduce((s, j) => s + (j._count?.applications ?? 0), 0);

  const topJobs = [...jobs]
    .sort((a, b) => (b._count?.applications ?? 0) - (a._count?.applications ?? 0))
    .slice(0, 6)
    .map(j => ({
      id: j.id,
      title: j.title,
      applications: j._count?.applications ?? 0,
      hired: 0,
    }));

  return {
    overview: {
      totalJobs,
      activeJobs,
      totalApplications,
      hired: 0,
      avgMatchScore: 0,
    },
    applicationsByStatus: { pending: totalApplications },
    topJobs,
    recentActivity: [],
  };
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
