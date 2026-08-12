import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ClipboardList, Search, ChevronDown, Plus, X, Loader2,
  CheckCircle2, XCircle, Clock, Eye, Users, Briefcase,
  BarChart3, Trash2, Flag, ThumbsUp, ThumbsDown,
} from 'lucide-react';
import { TopBar } from '@/components/common/TopBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { jobsApi } from '@/lib/api';
import { cn, timeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionType = 'short_text' | 'long_text' | 'yes_no' | 'single_choice' | 'multiple_choice';
type SubmissionStatus = 'pending' | 'passed' | 'failed' | 'flagged';

interface ScreeningQuestion {
  id?: string;
  question: string;
  type: QuestionType;
  options?: string[];
  isRequired: boolean;
}

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  aiMatchScore?: number;
  appliedAt: string;
  screeningAnswers?: Record<string, any>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployerAssessmentsPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [view, setView]                   = useState<'questions' | 'submissions'>('questions');
  const [addOpen, setAddOpen]             = useState(false);
  const [reviewCandidate, setReviewCandidate] = useState<Candidate | null>(null);
  const [search, setSearch]               = useState('');

  const { data: jobsRaw, isLoading: jobsLoading } = useQuery({
    queryKey: ['employer-jobs-assess'],
    queryFn: () => jobsApi.getEmployerJobs({ limit: 50 }).then(r => r.data.data ?? r.data),
  });

  const jobs: any[] = useMemo(() => {
    const raw = Array.isArray(jobsRaw) ? jobsRaw : (jobsRaw as any)?.data ?? [];
    return raw;
  }, [jobsRaw]);

  const activeJob = jobs.find(j => j.id === selectedJobId) ?? jobs[0];
  const activeJobId = activeJob?.id ?? null;

  const { data: qRaw, isLoading: qLoading } = useQuery({
    queryKey: ['screening-questions-employer', activeJobId],
    queryFn: () => jobsApi.getScreeningQuestions(activeJobId!).then(r => r.data.data ?? r.data),
    enabled: !!activeJobId,
    retry: false,
  });

  const { data: appsRaw, isLoading: appsLoading } = useQuery({
    queryKey: ['job-applications-assess', activeJobId],
    queryFn: () => jobsApi.getApplicationsForJob(activeJobId!, { limit: 50 }).then(r => r.data.data ?? r.data),
    enabled: !!activeJobId,
    retry: false,
  });

  const questions: ScreeningQuestion[] = Array.isArray(qRaw) ? qRaw : (qRaw as any)?.data ?? [];
  const candidates: Candidate[]        = Array.isArray(appsRaw) ? appsRaw : (appsRaw as any)?.data ?? [];

  const filteredCandidates = candidates.filter(c => {
    const q = search.toLowerCase();
    return !q || `${c.firstName} ${c.lastName}`.toLowerCase().includes(q);
  });

  const stats = useMemo(() => ({
    total:   candidates.length,
    pending: candidates.filter(c => !c.screeningAnswers || Object.keys(c.screeningAnswers).length === 0).length,
    passed:  candidates.filter(c => (c.status ?? '').toLowerCase() === 'shortlisted').length,
    failed:  candidates.filter(c => (c.status ?? '').toLowerCase() === 'rejected').length,
  }), [candidates]);

  return (
    <>
      <TopBar title="Assessments" />

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-56px)]">
        {/* Job list sidebar */}
        <div className="w-56 shrink-0 border-r border-border bg-surface flex flex-col overflow-hidden">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-4 pb-2">Your Jobs</p>
          <div className="flex-1 overflow-y-auto">
            {jobsLoading
              ? <div className="p-3 space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}</div>
              : jobs.map(j => (
                <button key={j.id}
                  onClick={() => { setSelectedJobId(j.id); setView('questions'); }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-xs transition-colors border-l-2',
                    activeJobId === j.id
                      ? 'border-primary bg-primary/5 text-foreground font-medium'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-surface-raised',
                  )}>
                  <p className="truncate">{j.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{j._count?.applications ?? 0} applicants</p>
                </button>
              ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!activeJob ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <Briefcase className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">Select a job to manage assessments</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-5 py-4 border-b border-border bg-surface shrink-0 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{activeJob.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{candidates.length} candidates</p>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { v: 'questions',    icon: ClipboardList, label: 'Questions'   },
                      { v: 'submissions',  icon: Users,         label: 'Submissions' },
                    ].map(t => (
                      <button key={t.v}
                        onClick={() => setView(t.v as any)}
                        className={cn('flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors',
                          view === t.v ? 'bg-primary/10 border-primary/30 text-primary font-medium' : 'border-border text-muted-foreground hover:text-foreground')}>
                        <t.icon className="h-3.5 w-3.5" />{t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-3 flex-wrap">
                  {[
                    { label: 'Total',   value: stats.total,   color: 'text-primary'   },
                    { label: 'Pending', value: stats.pending, color: 'text-warning'   },
                    { label: 'Passed',  value: stats.passed,  color: 'text-success'   },
                    { label: 'Failed',  value: stats.failed,  color: 'text-destructive'},
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-1.5 bg-surface-raised border border-border rounded-lg px-3 py-1.5">
                      <span className={cn('text-xs font-bold', s.color)}>{s.value}</span>
                      <span className="text-[11px] text-muted-foreground">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {view === 'questions' && (
                  <QuestionsView
                    jobId={activeJobId!}
                    questions={questions}
                    loading={qLoading}
                    addOpen={addOpen}
                    setAddOpen={setAddOpen}
                  />
                )}
                {view === 'submissions' && (
                  <SubmissionsView
                    candidates={filteredCandidates}
                    loading={appsLoading}
                    search={search}
                    setSearch={setSearch}
                    onReview={setReviewCandidate}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Review modal */}
      {reviewCandidate && (
        <ReviewModal
          candidate={reviewCandidate}
          questions={questions}
          jobId={activeJobId!}
          onClose={() => setReviewCandidate(null)}
        />
      )}
    </>
  );
}

// ─── Questions view ───────────────────────────────────────────────────────────

function QuestionsView({ jobId, questions, loading, addOpen, setAddOpen }: {
  jobId: string; questions: ScreeningQuestion[]; loading: boolean;
  addOpen: boolean; setAddOpen: (v: boolean) => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<ScreeningQuestion>({
    question: '', type: 'short_text', options: [], isRequired: true,
  });
  const [newOption, setNewOption] = useState('');

  const add = useMutation({
    mutationFn: () => jobsApi.addScreeningQuestions(jobId, { questions: [form] }),
    onSuccess: () => {
      toast.success('Question added');
      qc.invalidateQueries({ queryKey: ['screening-questions-employer', jobId] });
      setAddOpen(false);
      setForm({ question: '', type: 'short_text', options: [], isRequired: true });
    },
  });

  const needsOptions = form.type === 'single_choice' || form.type === 'multiple_choice';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{questions.length} question{questions.length !== 1 ? 's' : ''}</p>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => setAddOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Add question
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ClipboardList className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">No screening questions yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add questions candidates will answer when applying</p>
        </div>
      ) : (
        <div className="space-y-2">
          {questions.map((q, i) => (
            <div key={q.id ?? i} className="bg-surface border border-border rounded-xl p-4 flex items-start gap-3">
              <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{q.question}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{q.type.replace('_', ' ')}</Badge>
                  {q.isRequired && <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-destructive border-destructive/30">Required</Badge>}
                </div>
                {q.options && q.options.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {q.options.map((o, j) => (
                      <span key={j} className="text-[11px] px-2 py-0.5 rounded bg-surface-raised border border-border text-muted-foreground">{o}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add question modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Add Screening Question</p>
              <button onClick={() => setAddOpen(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>

            <textarea value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
              rows={2} placeholder="Enter your question…"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary/50 resize-none" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Type</label>
                <div className="relative">
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as QuestionType, options: [] }))}
                    className="w-full h-9 pl-2.5 pr-7 rounded-lg border border-border bg-surface text-xs appearance-none outline-none focus:ring-1 focus:ring-primary/50">
                    {[
                      { v: 'short_text',      l: 'Short text'       },
                      { v: 'long_text',       l: 'Long text'        },
                      { v: 'yes_no',          l: 'Yes / No'         },
                      { v: 'single_choice',   l: 'Single choice'    },
                      { v: 'multiple_choice', l: 'Multiple choice'  },
                    ].map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <label className="text-xs text-muted-foreground">Required</label>
                <Switch checked={form.isRequired} onCheckedChange={v => setForm(p => ({ ...p, isRequired: v }))} />
              </div>
            </div>

            {needsOptions && (
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Options</label>
                {(form.options ?? []).map((o, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex-1 text-sm px-3 py-1.5 rounded-lg bg-surface-raised border border-border">{o}</span>
                    <button onClick={() => setForm(p => ({ ...p, options: p.options?.filter((_, j) => j !== i) }))}
                      className="text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input value={newOption} onChange={e => setNewOption(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && newOption.trim()) { setForm(p => ({ ...p, options: [...(p.options ?? []), newOption.trim()] })); setNewOption(''); } }}
                    placeholder="Add option…"
                    className="flex-1 h-8 px-3 rounded-lg border border-border bg-background text-xs outline-none focus:ring-1 focus:ring-primary/50" />
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => { if (newOption.trim()) { setForm(p => ({ ...p, options: [...(p.options ?? []), newOption.trim()] })); setNewOption(''); } }}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-1">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button size="sm" className="text-xs" onClick={() => add.mutate()} disabled={!form.question.trim() || add.isPending}>
                {add.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                Add question
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Submissions view ─────────────────────────────────────────────────────────

function SubmissionsView({ candidates, loading, search, setSearch, onReview }: {
  candidates: Candidate[]; loading: boolean; search: string; setSearch: (v: string) => void; onReview: (c: Candidate) => void;
}) {
  const qc = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: ({ appId, status }: { appId: string; status: string }) => jobsApi.updateApplicationStatus(appId, status),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries({ queryKey: ['job-applications-assess'] }); },
  });

  return (
    <div className="space-y-4">
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search candidates…"
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-surface text-sm outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground" />
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">No candidates yet</p>
        </div>
      ) : (
        <div className="divide-y divide-border/50 rounded-xl border border-border bg-surface overflow-hidden">
          {candidates.map(c => {
            const hasAnswers = c.screeningAnswers && Object.keys(c.screeningAnswers).length > 0;
            const s = (c.status ?? '').toLowerCase();
            const isPassed  = s === 'shortlisted';
            const isFailed  = s === 'rejected';
            return (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{c.firstName} {c.lastName}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] text-muted-foreground">{timeAgo(c.appliedAt)}</span>
                    {c.aiMatchScore != null && (
                      <span className="text-[11px] text-primary">{c.aiMatchScore}% match</span>
                    )}
                    {hasAnswers
                      ? <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-success border-success/30">Answered</Badge>
                      : <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">No answers</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {hasAnswers && (
                    <Button size="icon" variant="ghost" className="h-7 w-7" title="Review answers" onClick={() => onReview(c)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost"
                    className={cn('h-7 w-7', isPassed ? 'text-success' : 'text-muted-foreground hover:text-success')}
                    title="Mark as passed"
                    onClick={() => updateStatus.mutate({ appId: c.id, status: 'shortlisted' })}>
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost"
                    className={cn('h-7 w-7', isFailed ? 'text-destructive' : 'text-muted-foreground hover:text-destructive')}
                    title="Mark as failed"
                    onClick={() => updateStatus.mutate({ appId: c.id, status: 'rejected' })}>
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Review Modal ─────────────────────────────────────────────────────────────

function ReviewModal({ candidate, questions, jobId, onClose }: {
  candidate: Candidate; questions: ScreeningQuestion[]; jobId: string; onClose: () => void;
}) {
  const answers = candidate.screeningAnswers ?? {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <p className="text-sm font-semibold">{candidate.firstName} {candidate.lastName} — Answers</p>
          <button onClick={onClose}><X className="h-4 w-4 text-muted-foreground" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {questions.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No questions defined for this job.</p>
          ) : (
            questions.map((q, i) => {
              const answer = answers[q.id ?? i];
              return (
                <div key={q.id ?? i} className="space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Q{i + 1}</p>
                  <p className="text-sm text-foreground">{q.question}</p>
                  <div className="rounded-xl bg-surface-raised border border-border px-3 py-2">
                    {answer != null
                      ? <p className="text-sm text-foreground">{Array.isArray(answer) ? answer.join(', ') : String(answer)}</p>
                      : <p className="text-xs text-muted-foreground italic">No answer provided</p>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
