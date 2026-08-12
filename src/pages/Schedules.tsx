import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calendar, Video, Phone, Users, Search, Filter, SortAsc, SortDesc,
  CheckCircle2, XCircle, Clock, AlertCircle, ChevronDown, Loader2,
  MapPin, Link as LinkIcon, X, Plus, LayoutList, Columns,
  ChevronLeft, ChevronRight, Download, RefreshCw, ClipboardList,
  Building2, Trash2, Bell,
} from 'lucide-react';
import { TopBar } from '@/components/common/TopBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { jobsApi } from '@/lib/api';
import { cn, getInitials, timeAgo } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────

type InterviewType   = 'in-person' | 'virtual-meeting' | 'hybrid' | 'phone-call' | 'assessment' | 'group-interview';
type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no-show';
type Priority        = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
type DateFilter      = 'all' | 'today' | 'week' | 'month';
type SortField       = 'date' | 'status' | 'priority' | 'created';
type ViewMode        = 'list' | 'calendar' | 'kanban';

interface Interview {
  id: string;
  title: string;
  interviewType: InterviewType;
  date: string;       // 'YYYY-MM-DD'
  startTime: string;
  endTime?: string;
  status: InterviewStatus;
  applicants: Array<{ id: string; firstName: string; lastName: string; profilePicture?: string }>;
  job: { id: string; title: string; priority: Priority };
  interviewer?: string;
  meetingLink?: string;
  location?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_ICON: Record<string, React.ElementType> = {
  'virtual-meeting': Video,
  'phone-call':      Phone,
  'in-person':       MapPin,
  'hybrid':          Building2,
  'assessment':      ClipboardList,
  'group-interview': Users,
};

const TYPE_LABEL: Record<string, string> = {
  'virtual-meeting': 'Virtual Meeting',
  'phone-call':      'Phone Call',
  'in-person':       'In Person',
  'hybrid':          'Hybrid',
  'assessment':      'Assessment',
  'group-interview': 'Group Interview',
};

const STATUS_STYLE: Record<string, string> = {
  scheduled:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
  completed:   'text-success bg-success/10 border-success/20',
  cancelled:   'text-destructive bg-destructive/10 border-destructive/20',
  rescheduled: 'text-warning bg-warning/10 border-warning/20',
  'no-show':   'text-muted-foreground bg-muted/10 border-border',
};

const STATUS_DOT: Record<string, string> = {
  scheduled:   'bg-blue-400',
  completed:   'bg-success',
  cancelled:   'bg-destructive',
  rescheduled: 'bg-warning',
  'no-show':   'bg-muted-foreground',
};

const PRIORITY_STYLE: Record<string, string> = {
  HIGH:   'text-destructive bg-destructive/10 border-destructive/20',
  URGENT: 'text-destructive bg-destructive/5  border-destructive/40',
  MEDIUM: 'text-warning bg-warning/10 border-warning/20',
  LOW:    'text-success bg-success/10 border-success/20',
};

const KANBAN_COLS: { status: InterviewStatus; label: string }[] = [
  { status: 'scheduled',   label: 'Scheduled'   },
  { status: 'rescheduled', label: 'Rescheduled' },
  { status: 'completed',   label: 'Completed'   },
  { status: 'cancelled',   label: 'Cancelled'   },
  { status: 'no-show',     label: 'No Show'     },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SchedulesPage() {
  const qc = useQueryClient();
  const { user } = useAuthStore();
  const isEmployer = user?.userType === 'employer';
  const [scheduleOpen, setScheduleOpen] = useState(false);

  // View
  const [viewMode,       setViewMode]       = useState<ViewMode>('list');

  // Filters
  const [search,         setSearch]         = useState('');
  const [statusFilter,   setStatusFilter]   = useState<InterviewStatus | 'All'>('All');
  const [typeFilter,     setTypeFilter]     = useState<InterviewType | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [dateFilter,     setDateFilter]     = useState<DateFilter>('all');
  const [sortBy,         setSortBy]         = useState<SortField>('date');
  const [sortOrder,      setSortOrder]      = useState<'asc' | 'desc'>('asc');
  const [showFilters,    setShowFilters]    = useState(false);
  const [selected,       setSelected]       = useState<Interview | null>(null);

  // Bulk
  const [bulkMode,     setBulkMode]     = useState(false);
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);

  // Calendar nav
  const today = new Date();
  const [calYear,  setCalYear]  = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth()); // 0-indexed

  // Reschedule / delete modals
  const [rescheduleOpen,   setRescheduleOpen]   = useState(false);
  const [deleteConfirmIv,  setDeleteConfirmIv]  = useState<Interview | null>(null);

  const { data: raw, isLoading } = useQuery({
    queryKey: ['my-interviews'],
    queryFn: () => jobsApi.getMyInterviews().then(r => r.data.data ?? r.data),
    retry: false,
  });

  const interviews: Interview[] = Array.isArray(raw) ? raw : (raw as any)?.data ?? [];

  const cancel = useMutation({
    mutationFn: (id: string) => jobsApi.cancelInterview(id),
    onSuccess: () => {
      toast.success('Interview cancelled');
      qc.invalidateQueries({ queryKey: ['my-interviews'] });
      setSelected(null);
    },
    onError: () => toast.error('Failed to cancel'),
  });

  // Stats
  const stats = useMemo(() => ({
    total:      interviews.length,
    scheduled:  interviews.filter(i => i.status === 'scheduled').length,
    completed:  interviews.filter(i => i.status === 'completed').length,
    cancelled:  interviews.filter(i => i.status === 'cancelled').length,
    today:      interviews.filter(i => i.date === today.toISOString().slice(0, 10) && i.status === 'scheduled').length,
  }), [interviews]);

  // Filter + sort
  const filtered = useMemo(() => {
    const todayStr = today.toISOString().slice(0, 10);
    return [...interviews]
      .filter(iv => {
        const q = search.toLowerCase();
        if (q && !iv.title.toLowerCase().includes(q) &&
            !iv.job.title.toLowerCase().includes(q) &&
            !iv.applicants.some(a => `${a.firstName} ${a.lastName}`.toLowerCase().includes(q)))
          return false;
        if (statusFilter   !== 'All' && iv.status        !== statusFilter)   return false;
        if (typeFilter     !== 'All' && iv.interviewType !== typeFilter)     return false;
        if (priorityFilter !== 'All' && iv.job.priority  !== priorityFilter) return false;
        if (dateFilter !== 'all') {
          const d = new Date(iv.date);
          if (dateFilter === 'today' && iv.date !== todayStr) return false;
          if (dateFilter === 'week') {
            const week = new Date(today.getTime() + 7 * 86400_000);
            if (d < today || d > week) return false;
          }
          if (dateFilter === 'month') {
            const month = new Date(today.getTime() + 30 * 86400_000);
            if (d < today || d > month) return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        let av: any, bv: any;
        if (sortBy === 'date')     { av = new Date(`${a.date} ${a.startTime}`).getTime(); bv = new Date(`${b.date} ${b.startTime}`).getTime(); }
        if (sortBy === 'status')   { av = a.status; bv = b.status; }
        if (sortBy === 'priority') { const m: Record<string,number> = { URGENT:4, HIGH:3, MEDIUM:2, LOW:1 }; av = m[a.job.priority]; bv = m[b.job.priority]; }
        if (sortBy === 'created')  { av = new Date(a.createdAt).getTime(); bv = new Date(b.createdAt).getTime(); }
        if (av === bv) return 0;
        return (av < bv ? -1 : 1) * (sortOrder === 'asc' ? 1 : -1);
      });
  }, [interviews, search, statusFilter, typeFilter, priorityFilter, dateFilter, sortBy, sortOrder]);

  function toggleSort(field: SortField) {
    if (sortBy === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
  }

  function toggleBulk(id: string) {
    setBulkSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function exportInterview(iv: Interview) {
    const rows = [
      ['Title', iv.title],
      ['Date', iv.date],
      ['Time', `${iv.startTime}${iv.endTime ? ` – ${iv.endTime}` : ''}`],
      ['Type', TYPE_LABEL[iv.interviewType] ?? iv.interviewType],
      ['Status', iv.status],
      ['Priority', iv.job.priority],
      ['Job', iv.job.title],
      ['Candidates', iv.applicants.map(a => `${a.firstName} ${a.lastName}`).join('; ')],
      ['Interviewer', iv.interviewer ?? ''],
      ['Notes', iv.notes ?? ''],
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = `interview-${iv.id}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported');
  }

  function exportBulk() {
    const items = filtered.filter(iv => bulkSelected.includes(iv.id));
    const header = ['Title','Date','Time','Type','Status','Priority','Job','Candidates'];
    const rows = items.map(iv => [
      iv.title, iv.date,
      `${iv.startTime}${iv.endTime ? ` – ${iv.endTime}` : ''}`,
      TYPE_LABEL[iv.interviewType] ?? iv.interviewType,
      iv.status, iv.job.priority, iv.job.title,
      iv.applicants.map(a => `${a.firstName} ${a.lastName}`).join('; '),
    ]);
    const csv = [header, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = `interviews-export.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${items.length} interviews`);
    setBulkSelected([]);
    setBulkMode(false);
  }

  // Calendar helpers
  function calDays(): (Interview[] | null)[] {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const byDate: Record<string, Interview[]> = {};
    interviews.forEach(iv => {
      if (!byDate[iv.date]) byDate[iv.date] = [];
      byDate[iv.date].push(iv);
    });
    const cells: (Interview[] | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      cells.push(byDate[key] ?? []);
    }
    return cells;
  }

  const activeFilters = (statusFilter !== 'All' ? 1 : 0) + (typeFilter !== 'All' ? 1 : 0) +
                        (priorityFilter !== 'All' ? 1 : 0) + (dateFilter !== 'all' ? 1 : 0);

  return (
    <>
      <TopBar title="Schedules" actions={
        <div className="flex items-center gap-2">
          {isEmployer && (
            <Button size="sm" onClick={() => setScheduleOpen(true)} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Schedule Interview
            </Button>
          )}
        </div>
      } />

      <div className="flex flex-col flex-1 overflow-hidden h-[calc(100vh-56px)]">

        {/* ── Toolbar ── */}
        <div className="p-3 border-b border-border bg-surface space-y-2.5 shrink-0">

          {/* Stats row */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'Total',     value: stats.total,     icon: Calendar,     color: 'text-primary'     },
              { label: 'Scheduled', value: stats.scheduled, icon: Clock,        color: 'text-blue-400'    },
              { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-success'     },
              { label: 'Cancelled', value: stats.cancelled, icon: XCircle,      color: 'text-destructive' },
              { label: 'Today',     value: stats.today,     icon: AlertCircle,  color: 'text-warning'     },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 bg-surface-raised border border-border rounded-lg px-3 py-1.5">
                <s.icon className={cn('h-3.5 w-3.5', s.color)} />
                <span className="text-xs font-semibold text-foreground">{s.value}</span>
                <span className="text-[11px] text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Search + controls row */}
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by title, candidate, or job…"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-xs outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
              />
            </div>

            {/* View toggle */}
            <div className="flex bg-surface-raised border border-border rounded-lg p-0.5 gap-0.5">
              {([
                { mode: 'list',     Icon: LayoutList, label: 'List'     },
                { mode: 'calendar', Icon: Calendar,   label: 'Calendar' },
                { mode: 'kanban',   Icon: Columns,    label: 'Kanban'   },
              ] as const).map(({ mode, Icon, label }) => (
                <button key={mode} title={label} onClick={() => setViewMode(mode as ViewMode)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs transition-colors',
                    viewMode === mode ? 'bg-surface text-foreground font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground',
                  )}>
                  <Icon className="h-3.5 w-3.5" /><span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <Button size="sm" variant="outline" onClick={() => setShowFilters(f => !f)} className="gap-1.5 text-xs">
              <Filter className="h-3.5 w-3.5" />
              Filters
              {activeFilters > 0 && (
                <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">{activeFilters}</span>
              )}
            </Button>

            {viewMode === 'list' && (
              <Button size="sm" variant="outline" onClick={() => { setBulkMode(b => !b); setBulkSelected([]); }} className="gap-1.5 text-xs">
                {bulkMode ? 'Done' : 'Select'}
              </Button>
            )}
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <FilterSelect label="Status"   value={statusFilter}   onChange={v => setStatusFilter(v as any)}
                options={['All','scheduled','completed','cancelled','rescheduled','no-show']} />
              <FilterSelect label="Type"     value={typeFilter}     onChange={v => setTypeFilter(v as any)}
                options={['All','virtual-meeting','phone-call','in-person','hybrid','assessment','group-interview']}
                display={v => v === 'All' ? 'All types' : (TYPE_LABEL[v] ?? v)} />
              <FilterSelect label="Priority" value={priorityFilter} onChange={v => setPriorityFilter(v as any)}
                options={['All','HIGH','URGENT','MEDIUM','LOW']} />
              <FilterSelect label="Date"     value={dateFilter}     onChange={v => setDateFilter(v as DateFilter)}
                options={['all','today','week','month']}
                display={v => v === 'all' ? 'All dates' : v.charAt(0).toUpperCase() + v.slice(1)} />
            </div>
          )}

          {/* Sort row (list only) */}
          {viewMode === 'list' && (
            <div className="flex gap-1 flex-wrap items-center">
              {(['date','status','priority','created'] as SortField[]).map(f => (
                <button key={f} onClick={() => toggleSort(f)}
                  className={cn(
                    'flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border transition-colors',
                    sortBy === f ? 'bg-primary/10 border-primary/30 text-primary font-medium' : 'border-border text-muted-foreground hover:text-foreground',
                  )}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {sortBy === f && (sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />)}
                </button>
              ))}
              <span className="ml-auto text-[11px] text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Bulk actions bar */}
          {bulkMode && bulkSelected.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-lg">
              <span className="text-xs font-medium text-foreground">{bulkSelected.length} selected</span>
              <div className="flex gap-1 ml-auto">
                <Button size="sm" variant="outline" onClick={exportBulk} className="gap-1 text-xs h-7">
                  <Download className="h-3 w-3" /> Export
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setBulkSelected([])} className="h-7 text-xs">
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        {viewMode === 'list' && (
          <ListView
            filtered={filtered} isLoading={isLoading} selected={selected} setSelected={setSelected}
            bulkMode={bulkMode} bulkSelected={bulkSelected} toggleBulk={toggleBulk}
            cancel={cancel} onExport={exportInterview}
            onReschedule={iv => { setSelected(iv); setRescheduleOpen(true); }}
            onDelete={iv => setDeleteConfirmIv(iv)}
          />
        )}
        {viewMode === 'calendar' && (
          <CalendarView
            interviews={interviews} calYear={calYear} calMonth={calMonth}
            setCalYear={setCalYear} setCalMonth={setCalMonth}
            onSelectInterview={setSelected}
          />
        )}
        {viewMode === 'kanban' && (
          <KanbanView filtered={filtered} isLoading={isLoading} onSelectInterview={iv => { setSelected(iv); setViewMode('list'); }} />
        )}
      </div>

      {/* Interview detail sheet (floating over calendar/kanban too) */}
      {selected && viewMode !== 'list' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-surface rounded-2xl border border-border overflow-hidden" onClick={e => e.stopPropagation()}>
            <InterviewDetailPanel
              iv={selected} onClose={() => setSelected(null)}
              cancel={cancel} onExport={exportInterview}
              onReschedule={() => setRescheduleOpen(true)}
              onDelete={() => setDeleteConfirmIv(selected)}
            />
          </div>
        </div>
      )}

      {/* Reschedule dialog (stub — just shows a toast) */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Reschedule Interview</DialogTitle></DialogHeader>
          <DialogBody className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Select a new date and time for <span className="text-foreground font-medium">{selected?.title}</span>.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">New Date</label>
                <Input type="date" className="h-9 text-sm" min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">New Time</label>
                <Input type="time" className="h-9 text-sm" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Reason (optional)</label>
              <textarea rows={2} placeholder="Reason for reschedule…"
                className="w-full resize-none bg-surface-raised border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRescheduleOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success('Reschedule request sent'); setRescheduleOpen(false); }} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteConfirmIv} onOpenChange={open => !open && setDeleteConfirmIv(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Interview</DialogTitle></DialogHeader>
          <DialogBody>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <span className="text-foreground font-medium">{deleteConfirmIv?.title}</span>? This action cannot be undone and will notify all participants.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteConfirmIv(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              toast.success('Interview deleted');
              setDeleteConfirmIv(null);
              if (selected?.id === deleteConfirmIv?.id) setSelected(null);
              qc.invalidateQueries({ queryKey: ['my-interviews'] });
            }}>
              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employer scheduling dialog */}
      {isEmployer && (
        <ScheduleInterviewDialog
          open={scheduleOpen} onClose={() => setScheduleOpen(false)}
          onDone={() => { setScheduleOpen(false); qc.invalidateQueries({ queryKey: ['my-interviews'] }); }}
        />
      )}
    </>
  );
}

// ─── List View ────────────────────────────────────────────────────────────────

function ListView({ filtered, isLoading, selected, setSelected, bulkMode, bulkSelected, toggleBulk, cancel, onExport, onReschedule, onDelete }: {
  filtered: Interview[];
  isLoading: boolean;
  selected: Interview | null;
  setSelected: (iv: Interview | null) => void;
  bulkMode: boolean;
  bulkSelected: string[];
  toggleBulk: (id: string) => void;
  cancel: any;
  onExport: (iv: Interview) => void;
  onReschedule: (iv: Interview) => void;
  onDelete: (iv: Interview) => void;
}) {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* List */}
      <div className={cn('flex flex-col flex-1 overflow-hidden', selected ? 'hidden lg:flex' : '')}>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-2">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">No interviews found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filtered.map(iv => {
                const Icon = TYPE_ICON[iv.interviewType] ?? Calendar;
                const isSelected = selected?.id === iv.id;
                const isChecked = bulkSelected.includes(iv.id);
                const soon = (() => {
                  if (iv.status !== 'scheduled') return false;
                  const d = new Date(`${iv.date}T${iv.startTime}`);
                  return (d.getTime() - Date.now()) < 24 * 60 * 60 * 1000 && d > new Date();
                })();
                return (
                  <div key={iv.id}
                    className={cn('flex items-start gap-3 px-4 py-3.5 transition-colors cursor-pointer',
                      isSelected ? 'bg-primary/5' : 'hover:bg-surface-raised')}>
                    {bulkMode && (
                      <input type="checkbox" checked={isChecked} onChange={() => toggleBulk(iv.id)}
                        className="mt-1 h-4 w-4 rounded border-border accent-primary shrink-0" />
                    )}
                    <button onClick={() => { if (!bulkMode) setSelected(isSelected ? null : iv); else toggleBulk(iv.id); }}
                      className="flex-1 flex items-start gap-3 text-left">
                      <div className="h-9 w-9 rounded-xl bg-surface-raised border border-border flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground truncate">{iv.title}</p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {soon && <span title="Upcoming soon"><Bell className="h-3 w-3 text-warning" /></span>}
                            <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full border font-medium', PRIORITY_STYLE[iv.job.priority])}>
                              {iv.job.priority}
                            </span>
                            <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full border font-medium', STATUS_STYLE[iv.status])}>
                              {iv.status.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">{iv.job.title}</p>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {iv.date} · {iv.startTime}{iv.endTime ? ` – ${iv.endTime}` : ''}
                          </span>
                          {iv.applicants.length > 0 && (
                            <span className="flex items-center gap-1">
                              <div className="flex -space-x-1">
                                {iv.applicants.slice(0, 3).map(a => (
                                  <Avatar key={a.id} className="h-4 w-4 border border-background">
                                    <AvatarImage src={a.profilePicture} />
                                    <AvatarFallback className="text-[8px]">{getInitials(`${a.firstName} ${a.lastName}`)}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <span className="text-[11px] text-muted-foreground">{iv.applicants.length} candidate{iv.applicants.length !== 1 ? 's' : ''}</span>
                            </span>
                          )}
                        </div>
                        {iv.tags && iv.tags.length > 0 && (
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {iv.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-raised border border-border text-muted-foreground">#{tag}</span>
                            ))}
                            {iv.tags.length > 3 && <span className="text-[10px] text-muted-foreground">+{iv.tags.length - 3}</span>}
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="w-full lg:w-96 shrink-0 border-l border-border bg-surface flex flex-col overflow-hidden">
          <InterviewDetailPanel
            iv={selected} onClose={() => setSelected(null)}
            cancel={cancel} onExport={onExport}
            onReschedule={() => onReschedule(selected)}
            onDelete={() => onDelete(selected)}
          />
        </div>
      )}
    </div>
  );
}

// ─── Calendar View ─────────────────────────────────────────────────────────────

function CalendarView({ interviews, calYear, calMonth, setCalYear, setCalMonth, onSelectInterview }: {
  interviews: Interview[];
  calYear: number; calMonth: number;
  setCalYear: (y: number) => void; setCalMonth: (m: number) => void;
  onSelectInterview: (iv: Interview) => void;
}) {
  const [daySelected, setDaySelected] = useState<string | null>(null);
  const todayStr = new Date().toISOString().slice(0, 10);

  const byDate = useMemo(() => {
    const map: Record<string, Interview[]> = {};
    interviews.forEach(iv => {
      if (!map[iv.date]) map[iv.date] = [];
      map[iv.date].push(iv);
    });
    return map;
  }, [interviews]);

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const monthLabel = new Date(calYear, calMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  function prevMonth() {
    if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11); }
    else setCalMonth(calMonth - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0); }
    else setCalMonth(calMonth + 1);
  }

  const dayInterviews = daySelected ? (byDate[daySelected] ?? []) : [];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Calendar grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-surface-raised border border-border text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="text-sm font-semibold text-foreground">{monthLabel}</h3>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-surface-raised border border-border text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="text-center text-[11px] font-medium text-muted-foreground py-1">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} className="h-20 rounded-lg" />)}
          {Array(daysInMonth).fill(null).map((_, idx) => {
            const d = idx + 1;
            const key = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const dayIvs = byDate[key] ?? [];
            const isToday = key === todayStr;
            const isSelected = daySelected === key;
            return (
              <button key={key} onClick={() => setDaySelected(isSelected ? null : key)}
                className={cn(
                  'h-20 rounded-lg p-1.5 text-left transition-colors border',
                  isSelected   ? 'bg-primary/10 border-primary/40'     :
                  isToday      ? 'bg-surface-raised border-primary/20' :
                  dayIvs.length > 0 ? 'bg-surface-raised border-border hover:border-primary/30' :
                  'border-transparent hover:bg-surface-raised',
                )}>
                <span className={cn('text-[11px] font-medium', isToday ? 'text-primary' : 'text-foreground')}>{d}</span>
                <div className="mt-1 space-y-0.5">
                  {dayIvs.slice(0, 3).map(iv => (
                    <div key={iv.id} className="flex items-center gap-1">
                      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', STATUS_DOT[iv.status])} />
                      <span className="text-[9px] text-foreground truncate leading-tight">{iv.title}</span>
                    </div>
                  ))}
                  {dayIvs.length > 3 && <span className="text-[9px] text-muted-foreground">+{dayIvs.length - 3} more</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day detail panel */}
      {daySelected && (
        <div className="w-72 shrink-0 border-l border-border bg-surface flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <p className="text-sm font-semibold text-foreground">
              {new Date(daySelected + 'T00:00:00').toLocaleDateString('default', { weekday:'long', month:'short', day:'numeric' })}
            </p>
            <button onClick={() => setDaySelected(null)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {dayInterviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">No interviews on this day</p>
              </div>
            ) : dayInterviews.map(iv => {
              const Icon = TYPE_ICON[iv.interviewType] ?? Calendar;
              return (
                <button key={iv.id} onClick={() => onSelectInterview(iv)}
                  className="w-full text-left p-2.5 rounded-xl bg-surface-raised border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <p className="text-xs font-medium text-foreground truncate">{iv.title}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">{iv.startTime}{iv.endTime ? ` – ${iv.endTime}` : ''}</span>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full border font-medium', STATUS_STYLE[iv.status])}>
                      {iv.status.replace('-',' ')}
                    </span>
                  </div>
                  {iv.applicants.length > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {iv.applicants.map(a => `${a.firstName} ${a.lastName}`).join(', ')}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Kanban View ──────────────────────────────────────────────────────────────

function KanbanView({ filtered, isLoading, onSelectInterview }: {
  filtered: Interview[]; isLoading: boolean; onSelectInterview: (iv: Interview) => void;
}) {
  const byStatus = useMemo(() => {
    const map: Record<string, Interview[]> = {};
    KANBAN_COLS.forEach(c => { map[c.status] = []; });
    filtered.forEach(iv => {
      if (map[iv.status]) map[iv.status].push(iv);
      else map['scheduled']?.push(iv);
    });
    return map;
  }, [filtered]);

  if (isLoading) return (
    <div className="flex flex-1 gap-3 p-4 overflow-x-auto">
      {KANBAN_COLS.map(c => <div key={c.status} className="w-64 shrink-0"><Skeleton className="h-8 mb-3" />{[...Array(3)].map((_,i) => <Skeleton key={i} className="h-28 mb-2 rounded-xl" />)}</div>)}
    </div>
  );

  return (
    <div className="flex flex-1 gap-3 p-4 overflow-x-auto overflow-y-hidden">
      {KANBAN_COLS.map(col => {
        const items = byStatus[col.status] ?? [];
        return (
          <div key={col.status} className="w-64 shrink-0 flex flex-col overflow-hidden">
            <div className={cn('flex items-center gap-2 mb-2 px-1')}>
              <span className={cn('h-2 w-2 rounded-full', STATUS_DOT[col.status])} />
              <span className="text-xs font-semibold text-foreground">{col.label}</span>
              <span className="ml-auto text-[11px] text-muted-foreground bg-surface-raised border border-border rounded-full px-2 py-0.5">{items.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
              {items.length === 0 ? (
                <div className="h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center">
                  <span className="text-[11px] text-muted-foreground">No interviews</span>
                </div>
              ) : items.map(iv => {
                const Icon = TYPE_ICON[iv.interviewType] ?? Calendar;
                return (
                  <button key={iv.id} onClick={() => onSelectInterview(iv)}
                    className="w-full text-left p-3 rounded-xl bg-surface border border-border hover:border-primary/30 hover:bg-surface-raised transition-colors">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="h-7 w-7 rounded-lg bg-surface-raised border border-border flex items-center justify-center shrink-0">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{iv.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{iv.job.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-2">
                      <Calendar className="h-3 w-3" />{iv.date} · {iv.startTime}
                    </div>
                    {iv.applicants.length > 0 && (
                      <div className="flex -space-x-1">
                        {iv.applicants.slice(0, 4).map(a => (
                          <Avatar key={a.id} className="h-5 w-5 border border-background">
                            <AvatarImage src={a.profilePicture} />
                            <AvatarFallback className="text-[8px]">{getInitials(`${a.firstName} ${a.lastName}`)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {iv.applicants.length > 4 && <span className="text-[10px] text-muted-foreground ml-1 self-center">+{iv.applicants.length - 4}</span>}
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full border font-medium', PRIORITY_STYLE[iv.job.priority])}>
                        {iv.job.priority}
                      </span>
                      {iv.tags && iv.tags.length > 0 && (
                        <span className="text-[10px] text-muted-foreground">#{iv.tags[0]}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Interview Detail Panel ────────────────────────────────────────────────────

function InterviewDetailPanel({ iv, onClose, cancel, onExport, onReschedule, onDelete }: {
  iv: Interview; onClose: () => void; cancel: any;
  onExport: (iv: Interview) => void;
  onReschedule: () => void;
  onDelete: () => void;
}) {
  const Icon = TYPE_ICON[iv.interviewType] ?? Calendar;
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
          <p className="text-sm font-semibold truncate">{iv.title}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onExport(iv)} title="Export" className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface-raised transition-colors">
            <Download className="h-3.5 w-3.5" />
          </button>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface-raised transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className={cn('text-[11px]', STATUS_STYLE[iv.status])}>
            {iv.status.replace('-', ' ')}
          </Badge>
          <Badge variant="outline" className={cn('text-[11px]', PRIORITY_STYLE[iv.job.priority])}>
            {iv.job.priority} priority
          </Badge>
          <Badge variant="outline" className="text-[11px]">
            {TYPE_LABEL[iv.interviewType] ?? iv.interviewType}
          </Badge>
        </div>

        {/* Date / time */}
        <div className="rounded-xl bg-surface-raised border border-border p-3 space-y-1.5">
          <Row icon={Calendar} label="Date"  value={iv.date} />
          <Row icon={Clock}    label="Time"  value={`${iv.startTime}${iv.endTime ? ` – ${iv.endTime}` : ''}`} />
          {iv.meetingLink && (
            <a href={iv.meetingLink} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-xs text-primary hover:underline mt-1">
              <LinkIcon className="h-3.5 w-3.5 shrink-0" /> Join meeting link
            </a>
          )}
          {iv.location && (
            <Row icon={MapPin} label="Venue" value={iv.location} />
          )}
        </div>

        {/* Job */}
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Job</p>
          <p className="text-sm text-foreground">{iv.job.title}</p>
        </div>

        {/* Candidates */}
        {iv.applicants.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Candidates ({iv.applicants.length})</p>
            {iv.applicants.map(a => (
              <div key={a.id} className="flex items-center gap-2.5">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={a.profilePicture} />
                  <AvatarFallback className="text-[10px]">{getInitials(`${a.firstName} ${a.lastName}`)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-foreground">{a.firstName} {a.lastName}</span>
              </div>
            ))}
          </div>
        )}

        {/* Interviewer */}
        {iv.interviewer && (
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Interviewer</p>
            <p className="text-sm text-foreground">{iv.interviewer}</p>
          </div>
        )}

        {/* Notes */}
        {iv.notes && (
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Notes</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{iv.notes}</p>
          </div>
        )}

        {/* Tags */}
        {iv.tags && iv.tags.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Tags</p>
            <div className="flex flex-wrap gap-1">
              {iv.tags.map((tag, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-raised border border-border text-muted-foreground">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground">Created {timeAgo(iv.createdAt)}</p>
      </div>

      {/* Actions */}
      {(iv.status === 'scheduled' || iv.status === 'rescheduled') && (
        <div className="border-t border-border p-4 shrink-0 space-y-2">
          <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs" onClick={onReschedule}>
            <RefreshCw className="h-3.5 w-3.5" /> Reschedule
          </Button>
          <Button
            variant="outline" size="sm"
            className="w-full text-destructive border-destructive/30 hover:bg-destructive/5 gap-1.5 text-xs"
            onClick={() => cancel.mutate(iv.id)} disabled={cancel.isPending}>
            {cancel.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
            Cancel interview
          </Button>
          <Button variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive gap-1.5 text-xs" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      )}
    </>
  );
}

// ─── Schedule Interview Dialog ─────────────────────────────────────────────────

const INTERVIEW_TYPES_LIST = [
  { value: 'virtual-meeting', label: 'Virtual',    icon: Video      },
  { value: 'phone-call',      label: 'Phone',      icon: Phone      },
  { value: 'in-person',       label: 'In Person',  icon: MapPin     },
  { value: 'hybrid',          label: 'Hybrid',     icon: Building2  },
  { value: 'assessment',      label: 'Assessment', icon: ClipboardList },
  { value: 'group-interview', label: 'Group',      icon: Users      },
];
const DURATIONS  = [15, 30, 45, 60, 90, 120];
const PRIORITIES = ['HIGH', 'URGENT', 'MEDIUM', 'LOW'] as const;

function ScheduleInterviewDialog({ open, onClose, onDone }: {
  open: boolean; onClose: () => void; onDone: () => void;
}) {
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedAppId, setSelectedAppId] = useState('');
  const [interviewType, setInterviewType] = useState<InterviewType>('virtual-meeting');
  const [date,     setDate]     = useState('');
  const [time,     setTime]     = useState('');
  const [duration, setDuration] = useState(60);
  const [link,     setLink]     = useState('');
  const [location, setLocation] = useState('');
  const [notes,    setNotes]    = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [tags,     setTags]     = useState('');

  const { data: jobsRaw } = useQuery({
    queryKey: ['employer-jobs-for-schedule'],
    queryFn: () => jobsApi.getEmployerJobs({ status: 'posted', limit: 50 }).then(r => r.data.data ?? r.data),
    enabled: open,
  });
  const jobs: any[] = Array.isArray(jobsRaw) ? jobsRaw : (jobsRaw as any)?.data ?? [];

  const { data: appsRaw } = useQuery({
    queryKey: ['apps-for-schedule', selectedJobId],
    queryFn: () => jobsApi.getApplicationsForJob(selectedJobId, { status: 'shortlisted', limit: 50 }).then(r => r.data.data ?? r.data),
    enabled: !!selectedJobId,
  });
  const apps: any[] = Array.isArray(appsRaw) ? appsRaw : (appsRaw as any)?.data ?? [];

  const schedule = useMutation({
    mutationFn: () => {
      const scheduledAt = new Date(`${date}T${time}`).toISOString();
      return jobsApi.scheduleInterview(selectedAppId, {
        interviewType,
        scheduledAt,
        duration,
        meetingLink: (interviewType === 'virtual-meeting' || interviewType === 'hybrid') ? link : undefined,
        location:    (interviewType === 'in-person' || interviewType === 'hybrid') ? location : undefined,
        notes,
        priority,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });
    },
    onSuccess: () => { toast.success('Interview scheduled!'); onDone(); },
    onError:   () => toast.error('Failed to schedule interview'),
  });

  const canSubmit = selectedAppId && date && time;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Schedule Interview</DialogTitle></DialogHeader>
        <DialogBody className="space-y-4">

          {/* Job */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Select Job *</label>
            <select value={selectedJobId} onChange={e => { setSelectedJobId(e.target.value); setSelectedAppId(''); }}
              className="w-full h-9 text-sm bg-surface-raised border border-border rounded-lg px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="">Choose a job posting…</option>
              {jobs.map((j: any) => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </div>

          {/* Candidate */}
          {selectedJobId && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Select Candidate *</label>
              {apps.length === 0 ? (
                <p className="text-xs text-muted-foreground">No shortlisted candidates for this job.</p>
              ) : (
                <select value={selectedAppId} onChange={e => setSelectedAppId(e.target.value)}
                  className="w-full h-9 text-sm bg-surface-raised border border-border rounded-lg px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="">Choose a candidate…</option>
                  {apps.map((app: any) => {
                    const name = app.applicant ? `${app.applicant.firstName ?? ''} ${app.applicant.lastName ?? ''}`.trim() : app.applicantId;
                    return <option key={app.id} value={app.id}>{name}</option>;
                  })}
                </select>
              )}
            </div>
          )}

          {/* Interview type */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Interview Type</label>
            <div className="grid grid-cols-3 gap-1.5">
              {INTERVIEW_TYPES_LIST.map(({ value, label, icon: Icon }) => (
                <button key={value} onClick={() => setInterviewType(value as InterviewType)}
                  className={cn('flex flex-col items-center gap-1 py-2 rounded-lg border text-xs transition-colors',
                    interviewType === value ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground')}>
                  <Icon className="h-4 w-4" />{label}
                </button>
              ))}
            </div>
          </div>

          {/* Date & time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Date *</label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-9 text-sm"
                min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Start Time *</label>
              <Input type="time" value={time} onChange={e => setTime(e.target.value)} className="h-9 text-sm" />
            </div>
          </div>

          {/* Duration & priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Duration</label>
              <select value={duration} onChange={e => setDuration(Number(e.target.value))}
                className="w-full h-9 text-sm bg-surface-raised border border-border rounded-lg px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                {DURATIONS.map(d => <option key={d} value={d}>{d} min</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as Priority)}
                className="w-full h-9 text-sm bg-surface-raised border border-border rounded-lg px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Meeting link / location */}
          {(interviewType === 'virtual-meeting' || interviewType === 'hybrid') && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Meeting Link</label>
              <Input value={link} onChange={e => setLink(e.target.value)}
                placeholder="https://meet.google.com/…" className="h-9 text-sm" />
            </div>
          )}
          {(interviewType === 'in-person' || interviewType === 'hybrid') && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Location / Address</label>
              <Input value={location} onChange={e => setLocation(e.target.value)}
                placeholder="123 Office Street, Lagos" className="h-9 text-sm" />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Notes / Instructions</label>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="What should the candidate know before joining?"
              className="w-full resize-none bg-surface-raised border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Tags (comma-separated)</label>
            <Input value={tags} onChange={e => setTags(e.target.value)}
              placeholder="technical, backend, senior" className="h-9 text-sm" />
          </div>

        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => schedule.mutate()} disabled={!canSubmit || schedule.isPending} className="gap-1.5">
            {schedule.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FilterSelect({ label, value, onChange, options, display }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
  display?: (v: string) => string;
}) {
  return (
    <div className="relative">
      <label className="text-[10px] text-muted-foreground font-medium block mb-0.5">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full h-8 pl-2.5 pr-7 rounded-lg border border-border bg-surface text-xs outline-none focus:ring-1 focus:ring-primary/50 appearance-none">
        {options.map(o => (
          <option key={o} value={o}>{display ? display(o) : o === 'All' ? `All ${label.toLowerCase()}s` : o.replace(/[-_]/g,' ')}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 bottom-1.5 h-3 w-3 text-muted-foreground" />
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground w-12 shrink-0">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}
