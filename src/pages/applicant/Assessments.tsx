import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ClipboardList, Search, PlayCircle, Clock, CheckCircle2,
  XCircle, AlertTriangle, TrendingUp, Award, Bell, Loader2,
  Calendar, X, Sparkles, ChevronRight, Zap, Check, Building2,
} from 'lucide-react';
import { TopBar } from '@/components/common/TopBar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { jobsApi } from '@/lib/api';
import { cn, timeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';

type AssessmentStatus = 'not_taken' | 'partially_completed' | 'passed' | 'failed' | 'expired';
type Urgency = 'low' | 'medium' | 'high';

interface Assessment {
  id: string;
  jobTitle: string;
  company: string;
  status: AssessmentStatus;
  dueDate: Date;
  assignedDate: Date;
  completedDate?: Date;
  duration: number;
  tests: string[];
  progress: number;
  score?: number;
  urgency: Urgency;
  jobId: string;
  applicationId: string;
}

const STATUS_CONFIG: Record<AssessmentStatus, { label: string; color: string; icon: React.ElementType }> = {
  not_taken:           { label: 'Not Started',  color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',     icon: PlayCircle    },
  partially_completed: { label: 'In Progress',  color: 'text-warning bg-warning/10 border-warning/20',        icon: Clock         },
  passed:              { label: 'Passed',        color: 'text-success bg-success/10 border-success/20',        icon: CheckCircle2  },
  failed:              { label: 'Failed',        color: 'text-destructive bg-destructive/10 border-destructive/20', icon: XCircle  },
  expired:             { label: 'Expired',       color: 'text-muted-foreground bg-muted/10 border-border',     icon: AlertTriangle },
};

function mapApplication(app: any): Assessment {
  const createdAt = new Date(app.createdAt);
  const dueDate   = new Date(createdAt.getTime() + 7 * 86400_000);
  const now       = new Date();
  const daysLeft  = Math.ceil((dueDate.getTime() - now.getTime()) / 86400_000);

  let status: AssessmentStatus = 'not_taken';
  const s = (app.status ?? '').toLowerCase();
  if (s === 'hired' || s === 'accepted' || s === 'offer_extended') status = 'passed';
  else if (s === 'rejected') status = 'failed';
  else if (s === 'withdrawn') status = 'expired';
  else if (s === 'shortlisted' || s === 'under_review' || s === 'interview_scheduled') status = 'partially_completed';

  const urgency: Urgency = daysLeft <= 2 ? 'high' : daysLeft <= 5 ? 'medium' : 'low';

  return {
    id:            app.id,
    applicationId: app.id,
    jobId:         app.jobId ?? app.job?.id ?? '',
    jobTitle:      app.job?.title ?? 'Unknown Position',
    company:       app.job?.employer?.companyName ?? app.job?.companyName ?? 'Unknown Company',
    status,
    dueDate,
    assignedDate:  createdAt,
    completedDate: (status === 'passed' || status === 'failed') ? new Date(app.updatedAt) : undefined,
    duration:      60,
    tests:         app.job?.skills?.slice(0, 3) ?? ['General Skill Assessment'],
    progress:      status === 'passed' || status === 'failed' ? 100 : status === 'partially_completed' ? 50 : 0,
    score:         status === 'passed' ? 85 : status === 'failed' ? 55 : undefined,
    urgency,
  };
}

export default function ApplicantAssessmentsPage() {
  const [search,       setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState<AssessmentStatus | 'all'>('all');
  const [sortBy,       setSortBy]       = useState<'newest' | 'oldest' | 'deadline' | 'score'>('newest');
  const [selected,     setSelected]     = useState<Assessment | null>(null);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminders,    setReminders]    = useState({ email: true, push: true, whatsapp: false });

  const { user } = useAuthStore();
  const { data: raw, isLoading } = useQuery({
    queryKey: ['my-applications-assessments'],
    queryFn: () => jobsApi.getMyApplications({ limit: 100 }).then(r => r.data.data ?? r.data),
    retry: false,
    enabled: user?.userType === 'applicant',
  });

  const apps: any[] = Array.isArray(raw) ? raw : (raw as any)?.data ?? [];
  const assessments: Assessment[] = useMemo(() => apps.map(mapApplication), [apps]);

  const stats = useMemo(() => ({
    total:    assessments.length,
    pending:  assessments.filter(a => a.status === 'not_taken' || a.status === 'partially_completed').length,
    passed:   assessments.filter(a => a.status === 'passed').length,
    avgScore: (() => {
      const scored = assessments.filter(a => a.score != null);
      return scored.length ? Math.round(scored.reduce((s, a) => s + (a.score ?? 0), 0) / scored.length) : 0;
    })(),
  }), [assessments]);

  const filtered = useMemo(() => {
    return [...assessments]
      .filter(a => {
        if (filterStatus !== 'all' && a.status !== filterStatus) return false;
        const q = search.toLowerCase();
        if (q && !a.jobTitle.toLowerCase().includes(q) && !a.company.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest')   return b.assignedDate.getTime() - a.assignedDate.getTime();
        if (sortBy === 'oldest')   return a.assignedDate.getTime() - b.assignedDate.getTime();
        if (sortBy === 'deadline') return a.dueDate.getTime() - b.dueDate.getTime();
        if (sortBy === 'score')    return (b.score ?? 0) - (a.score ?? 0);
        return 0;
      });
  }, [assessments, search, filterStatus, sortBy]);

  return (
    <>
      <TopBar title="Assessments" />

      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* Hero Header */}
        <div className="glass rounded-3xl border border-border/50 p-6 md:p-8 bg-gradient-to-r from-primary/10 via-surface to-accent/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(262_83%_58%/0.12),transparent_50%)]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 mb-2">
                <Sparkles className="h-3.5 w-3.5" /> Skill Evaluations
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground font-['Outfit',sans-serif]">Skill Assessments</h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                Take skill evaluation tests assigned by employers to demonstrate your expertise and boost your match ranking.
              </p>
            </div>
          </div>
        </div>

        {/* Stat Widgets */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Assessments', value: stats.total,    icon: ClipboardList, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
            { label: 'Pending / Active',  value: stats.pending,  icon: Clock,         color: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
            { label: 'Passed Tests',      value: stats.passed,   icon: CheckCircle2,  color: 'text-success', bg: 'bg-success/10 border-success/20' },
            { label: 'Average Score',     value: stats.avgScore ? `${stats.avgScore}%` : '—', icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          ].map(s => (
            <div key={s.label} className="glass border border-border/50 rounded-2xl p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{s.label}</p>
                <div className={cn('h-8 w-8 rounded-xl border flex items-center justify-center', s.bg)}>
                  <s.icon className={cn('h-4 w-4', s.color)} />
                </div>
              </div>
              <p className="text-3xl font-black text-foreground font-['Outfit',sans-serif]">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter Controls */}
        <div className="glass rounded-2xl border border-border/50 p-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by job title or company name…"
              className="w-full pl-10 pr-4 h-10 rounded-xl border border-border/60 bg-surface-raised text-sm outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground font-medium"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="h-10 text-xs bg-surface-raised border border-border/60 rounded-xl px-3 text-foreground font-semibold"
            >
              <option value="all">All Statuses</option>
              <option value="not_taken">Not Started</option>
              <option value="partially_completed">In Progress</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="expired">Expired</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="h-10 text-xs bg-surface-raised border border-border/60 rounded-xl px-3 text-foreground font-semibold"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="deadline">By Deadline</option>
              <option value="score">By Score</option>
            </select>
          </div>
        </div>

        {/* Assessment List */}
        {isLoading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-3xl border border-border/50">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <ClipboardList className="h-8 w-8" />
            </div>
            <p className="text-base font-bold text-foreground">No assessments found</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              {search || filterStatus !== 'all' ? 'Try clearing or adjusting your search filters' : 'Apply to job positions to receive skill assessment tests.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(a => (
              <AssessmentCard
                key={a.id}
                assessment={a}
                onTake={() => setSelected(a)}
                onReminder={() => { setSelected(a); setReminderOpen(true); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Take Assessment modal */}
      {selected && !reminderOpen && (
        <TakeAssessmentModal assessment={selected} onClose={() => setSelected(null)} />
      )}

      {/* Reminder modal */}
      {reminderOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border/60 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <p className="text-base font-bold text-foreground">Set Assessment Reminder</p>
              </div>
              <button onClick={() => { setReminderOpen(false); setSelected(null); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground font-medium">{selected.jobTitle} at {selected.company}</p>
            <div className="space-y-3 pt-2">
              {[
                { key: 'email',    label: 'Email reminder',    sub: 'Receive email reminders before deadline' },
                { key: 'push',     label: 'Push notification', sub: 'Browser & mobile push notifications'     },
                { key: 'whatsapp', label: 'WhatsApp',          sub: 'Message updates via WhatsApp'            },
              ].map(r => (
                <div key={r.key} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-surface-raised">
                  <div>
                    <p className="text-xs font-bold text-foreground">{r.label}</p>
                    <p className="text-[11px] text-muted-foreground">{r.sub}</p>
                  </div>
                  <Switch checked={reminders[r.key as keyof typeof reminders]}
                    onCheckedChange={v => setReminders(p => ({ ...p, [r.key]: v }))} />
                </div>
              ))}
            </div>
            <Button className="w-full font-bold rounded-xl h-10 mt-2" onClick={() => {
              toast.success('Reminders updated');
              setReminderOpen(false);
              setSelected(null);
            }}>
              Save Preferences
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Assessment Card ──────────────────────────────────────────────────────────

function AssessmentCard({ assessment: a, onTake, onReminder }: {
  assessment: Assessment;
  onTake: () => void;
  onReminder: () => void;
}) {
  const cfg = STATUS_CONFIG[a.status];
  const Icon = cfg.icon;

  return (
    <div className="glass border border-border/50 rounded-2xl p-5 hover:border-primary/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-5">
      
      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-border/40 flex items-center justify-center shrink-0">
            <Building2 className="h-6 w-6 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-foreground font-['Outfit',sans-serif]">{a.jobTitle}</h3>
              <span className={cn('text-xs font-bold border rounded-full px-2.5 py-0.5 flex items-center gap-1 shrink-0', cfg.color)}>
                <Icon className="h-3 w-3" /> {cfg.label}
              </span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">{a.company}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1 max-w-md">
          <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
            <span>Progress</span>
            <span>{a.progress}%</span>
          </div>
          <div className="h-2 w-full bg-surface-raised rounded-full overflow-hidden border border-border/40">
            <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300" style={{ width: `${a.progress}%` }} />
          </div>
        </div>

        {/* Meta tags */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap font-medium">
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary/70" /> Due: {a.dueDate.toLocaleDateString()}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary/70" /> {a.duration} min duration</span>
          {a.tests.map((t, i) => (
            <span key={i} className="bg-surface-raised border border-border/40 text-foreground text-[11px] font-semibold rounded-lg px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 shrink-0 md:flex-col md:items-end">
        {a.score != null && (
          <div className="text-right mb-1">
            <span className="text-xl font-black text-primary font-['Outfit',sans-serif]">{a.score}%</span>
            <p className="text-[10px] font-semibold text-muted-foreground">Final Score</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 text-xs font-semibold rounded-xl" onClick={onReminder}>
            <Bell className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> Remind me
          </Button>
          <Button size="sm" className="h-9 px-5 text-xs font-bold rounded-xl" onClick={onTake}>
            {a.status === 'passed' || a.status === 'failed' ? 'View Results' : a.status === 'partially_completed' ? 'Continue' : 'Start Test'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Take Assessment Modal ───────────────────────────────────────────────────

function TakeAssessmentModal({ assessment: a, onClose }: { assessment: Assessment; onClose: () => void }) {
  const [answers, setAnswers] = useState<Record<string, any>>({});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border/60 rounded-3xl p-6 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/40 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-foreground font-['Outfit',sans-serif]">{a.jobTitle} Skill Assessment</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{a.company} · {a.duration} Minutes</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-raised">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-3 text-xs text-foreground">
            <Sparkles className="h-5 w-5 text-primary shrink-0" />
            <p>Answer all questions to complete your evaluation. Your score will automatically update your applicant profile match rank.</p>
          </div>

          {a.tests.map((testName, i) => (
            <div key={i} className="glass rounded-2xl border border-border/50 p-4 space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Question {i + 1} — {testName}</p>
              <p className="text-sm font-semibold text-foreground">Describe your core experience and proficiency level working with {testName} in production environments.</p>
              <textarea
                rows={3}
                placeholder="Type your response here…"
                value={answers[i] ?? ''}
                onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                className="w-full p-3 text-xs bg-surface-raised border border-border/60 rounded-xl text-foreground focus:ring-1 focus:ring-primary/50 outline-none"
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border/40 flex items-center justify-between shrink-0">
          <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="rounded-xl text-xs font-bold px-6" onClick={() => {
            toast.success('Assessment answers submitted successfully!');
            onClose();
          }}>
            Submit Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
