import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bookmark, Search, MapPin, Briefcase, Clock, Building2,
  Loader2, ExternalLink, Trash2, DollarSign, Zap, AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopBar } from '@/components/common/TopBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { QuickApplyModal } from '@/pages/jobs/QuickApplyModal';
import { jobsApi } from '@/lib/api';
import { timeAgo, formatSalary } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Job } from '@/types';

const TYPE_LABEL: Record<string, string> = {
  full_time:  'Full-time',
  part_time:  'Part-time',
  contract:   'Contract',
  internship: 'Internship',
  freelance:  'Freelance',
  temporary:  'Temporary',
  volunteer:  'Volunteer',
};

export default function SavedJobsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [applyJob, setApplyJob] = useState<Job | null>(null);

  const { data: raw, isLoading } = useQuery({
    queryKey: ['bookmarked-jobs'],
    queryFn: () => jobsApi.getBookmarkedJobs().then(r => r.data.data ?? r.data),
    retry: false,
  });

  const jobs: Job[] = Array.isArray(raw) ? raw : (raw as any)?.data ?? [];

  const unbookmark = useMutation({
    mutationFn: (id: string) => jobsApi.toggleBookmark(id),
    onSuccess: () => {
      toast.success('Removed from saved jobs');
      qc.invalidateQueries({ queryKey: ['bookmarked-jobs'] });
    },
  });

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      j.title.toLowerCase().includes(q) ||
      (j.employer?.companyName ?? '').toLowerCase().includes(q) ||
      (j.location ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <>
      <TopBar title="Saved Jobs" />

      <div className="p-4 max-w-3xl mx-auto space-y-4">

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search saved jobs by title, company, or location…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-surface text-sm outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
          />
        </div>

        {/* Count */}
        {!isLoading && (
          <p className="text-xs text-muted-foreground">
            {filtered.length} saved job{filtered.length !== 1 ? 's' : ''}
            {search ? ` matching "${search}"` : ''}
          </p>
        )}

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Bookmark className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">
              {search ? 'No saved jobs match your search' : 'No saved jobs yet'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {search ? 'Try a different keyword' : 'Bookmark jobs from the job board to save them here'}
            </p>
            {!search && (
              <Link to="/jobs" className="mt-4">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <Briefcase className="h-3.5 w-3.5" /> Browse Jobs
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(job => (
              <SavedJobCard
                key={job.id}
                job={job}
                onApply={() => setApplyJob(job)}
                onRemove={() => unbookmark.mutate(job.id)}
                removing={unbookmark.isPending && unbookmark.variables === job.id}
              />
            ))}
          </div>
        )}
      </div>

      {applyJob && (
        <QuickApplyModal
          job={applyJob}
          open={!!applyJob}
          onClose={() => setApplyJob(null)}
        />
      )}
    </>
  );
}

function SavedJobCard({ job, onApply, onRemove, removing }: {
  job: Job; onApply: () => void; onRemove: () => void; removing: boolean;
}) {
  const companyName = job.employer?.companyName ?? 'Company';
  const logo        = job.employer?.companyLogo;
  const jobStatus   = job.jobStatus ?? job.status ?? '';
  const isClosed    = jobStatus === 'closed';
  const isExpiring  = job.endDate
    ? (new Date(job.endDate).getTime() - Date.now()) < 3 * 24 * 60 * 60 * 1000
    : false;

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 flex gap-4 hover:border-primary/20 transition-colors">
      {/* Logo */}
      <Avatar className="h-12 w-12 rounded-xl shrink-0">
        <AvatarImage src={logo} className="object-cover" />
        <AvatarFallback className="rounded-xl bg-surface-raised text-sm font-semibold">
          {companyName.charAt(0)}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{job.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Building2 className="h-3 w-3 shrink-0" />
              {companyName}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Link to={`/jobs/${job.id}`}>
              <Button size="icon" variant="ghost" className="h-7 w-7" title="View full listing">
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={onRemove}
              disabled={removing}
              title="Remove from saved"
            >
              {removing
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Trash2 className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        {/* Metadata row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5">
          {job.location && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {job.location}
            </span>
          )}
          {job.salaryRange && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              {formatSalary(job.salaryRange)}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {timeAgo(job.createdAt)}
          </span>
          {isExpiring && !isClosed && (
            <span className="flex items-center gap-1 text-xs text-warning font-medium">
              <AlertTriangle className="h-3 w-3" /> Deadline soon
            </span>
          )}
        </div>

        {/* Tags + Apply button row */}
        <div className="flex items-center justify-between gap-2 mt-2.5">
          <div className="flex flex-wrap gap-1.5">
            {job.jobType && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {TYPE_LABEL[job.jobType] ?? job.jobType}
              </Badge>
            )}
            {job.employmentType === 'remote' && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-primary border-primary/30">
                Remote
              </Badge>
            )}
            {jobStatus === 'posted' && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-success border-success/30">
                Active
              </Badge>
            )}
            {isClosed && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
                Closed
              </Badge>
            )}
          </div>

          {!isClosed && (
            <Button
              size="sm"
              className="text-xs gap-1.5 h-7 shrink-0"
              onClick={onApply}
            >
              <Zap className="h-3 w-3" /> Apply Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

