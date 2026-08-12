import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, Trash2, Star, StarOff, Loader2, CheckCircle2,
  AlertCircle, Sparkles, Eye, Edit, Plus, FileCode, UserCheck, Video, PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { TopBar } from '@/components/common/TopBar';
import { cvsApi, coverLettersApi } from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';
import type { CV, CoverLetterItem } from '@/types';
import toast from 'react-hot-toast';

export default function ResumePage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<'cvs' | 'cover-letters' | 'video-cv'>('cvs');

  // Video CV state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [liveVideoCvUrl, setLiveVideoCvUrl] = useState<string | null>(null);

  // Modals
  const [uploadCvFile, setUploadCvFile] = useState<File | null>(null);
  const [cvTitle, setCvTitle] = useState('');
  const [cvDesc, setCvDesc] = useState('');
  const [cvIsDefault, setCvIsDefault] = useState(false);
  const [cvAutoFill, setCvAutoFill] = useState(true);

  const [editCv, setEditCv] = useState<CV | null>(null);
  const [previewCv, setPreviewCv] = useState<CV | null>(null);

  // Cover letter modal
  const [clModalOpen, setClModalOpen] = useState(false);
  const [editCl, setEditCl] = useState<CoverLetterItem | null>(null);
  const [clTitle, setClTitle] = useState('');
  const [clDesc, setClDesc] = useState('');
  const [clContent, setClContent] = useState('');
  const [clIsDefault, setClIsDefault] = useState(false);
  const [clFile, setClFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'parsing' | 'done' | 'error'>('idle');

  // Queries
  const { data: cvs = [], isLoading: cvsLoading } = useQuery<CV[]>({
    queryKey: ['my-cvs'],
    queryFn: () => cvsApi.list().then(r => r.data.data ?? r.data),
  });

  const { data: coverLetters = [], isLoading: clLoading } = useQuery<CoverLetterItem[]>({
    queryKey: ['my-cover-letters'],
    queryFn: () => coverLettersApi.list().then(r => r.data.data ?? r.data),
  });

  // CV Mutations
  const deleteCv = useMutation({
    mutationFn: (id: string) => cvsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-cvs'] });
      toast.success('CV deleted');
    },
    onError: () => toast.error('Failed to delete CV'),
  });

  const setDefaultCv = useMutation({
    mutationFn: (id: string) => cvsApi.setDefault(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-cvs'] });
      toast.success('Default CV updated');
    },
  });

  const syncProfile = useMutation({
    mutationFn: (id: string) => cvsApi.syncProfileFromCv(id),
    onSuccess: () => toast.success('Profile auto-filled from CV!'),
    onError: () => toast.error('Failed to sync profile'),
  });

  const updateCv = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => cvsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-cvs'] });
      setEditCv(null);
      toast.success('CV updated');
    },
  });

  // Cover Letter Mutations
  const deleteCl = useMutation({
    mutationFn: (id: string) => coverLettersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-cover-letters'] });
      toast.success('Cover letter deleted');
    },
  });

  const setDefaultCl = useMutation({
    mutationFn: (id: string) => coverLettersApi.setDefault(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-cover-letters'] });
      toast.success('Default cover letter updated');
    },
  });

  // Upload Handlers
  const onDropCv = useCallback((accepted: File[]) => {
    if (!accepted.length) return;
    const file = accepted[0];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'txt'].includes(ext ?? '')) {
      toast.error('Supported: PDF, DOC, DOCX, TXT, PNG, JPG');
      return;
    }
    setUploadCvFile(file);
    setCvTitle(file.name.replace(/\.[^.]+$/, ''));
    setCvDesc('');
    setCvIsDefault(cvs.length === 0);
    setCvAutoFill(true);
  }, [cvs.length]);

  async function handleConfirmCvUpload() {
    if (!uploadCvFile) return;
    setUploading(true);
    setUploadProgress('uploading');
    try {
      const form = new FormData();
      form.append('file', uploadCvFile);
      form.append('title', cvTitle || uploadCvFile.name);
      if (cvDesc) form.append('description', cvDesc);
      form.append('isDefault', String(cvIsDefault));
      form.append('autoFillProfile', String(cvAutoFill));

      setUploadProgress('parsing');
      await cvsApi.upload(form);
      setUploadProgress('done');
      qc.invalidateQueries({ queryKey: ['my-cvs'] });
      setUploadCvFile(null);
      toast.success(cvAutoFill ? 'CV uploaded, parsed, and profile auto-filled!' : 'CV uploaded & tagged!');
    } catch (err: any) {
      setUploadProgress('error');
      toast.error(err.response?.data?.message ?? 'Upload failed');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress('idle'), 2000);
    }
  }

  // ── Video CV upload ───────────────────────────────────────────────────────────
  const onDropVideo = useCallback((accepted: File[]) => {
    if (!accepted.length) return;
    const f = accepted[0];
    setVideoFile(f);
    setVideoTitle(f.name.replace(/\.[^.]+$/, ''));
    const url = URL.createObjectURL(f);
    setVideoPreviewUrl(url);
  }, []);

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps, isDragActive: isVideoDrag } = useDropzone({
    onDrop: onDropVideo,
    accept: { 'video/mp4': ['.mp4'], 'video/webm': ['.webm'], 'video/quicktime': ['.mov'] },
    maxFiles: 1,
    disabled: videoUploading,
  });

  async function handleVideoUpload() {
    if (!videoFile) return;
    setVideoUploading(true);
    setVideoProgress('uploading');
    try {
      const form = new FormData();
      form.append('file', videoFile);
      if (videoTitle) form.append('title', videoTitle);
      const res = await cvsApi.uploadVideo(form);
      const url = res.data?.videoCv || res.data?.data?.videoCv;
      if (url) setLiveVideoCvUrl(url);
      setVideoProgress('done');
      qc.invalidateQueries({ queryKey: ['my-cvs'] });
      toast.success('Video CV uploaded!');
    } catch (err: any) {
      setVideoProgress('error');
      toast.error(err.response?.data?.message ?? 'Video upload failed');
    } finally {
      setVideoUploading(false);
      setTimeout(() => setVideoProgress('idle'), 2500);
    }
  }


  async function handleSaveCoverLetter() {
    if (!clTitle.trim()) {
      toast.error('Title is required');
      return;
    }
    try {
      if (clFile) {
        const form = new FormData();
        form.append('file', clFile);
        form.append('title', clTitle);
        if (clDesc) form.append('description', clDesc);
        form.append('isDefault', String(clIsDefault));
        await coverLettersApi.upload(form);
      } else if (editCl) {
        await coverLettersApi.update(editCl.id, {
          title: clTitle,
          description: clDesc,
          content: clContent,
          isDefault: clIsDefault,
        });
      } else {
        await coverLettersApi.create({
          title: clTitle,
          description: clDesc,
          content: clContent,
          isDefault: clIsDefault,
        });
      }
      qc.invalidateQueries({ queryKey: ['my-cover-letters'] });
      setClModalOpen(false);
      setEditCl(null);
      setClFile(null);
      toast.success(editCl ? 'Cover letter updated' : 'Cover letter saved!');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Operation failed');
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCv,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <>
      <TopBar title="Resumes & Cover Letters" />
      <div className="p-6 max-w-3xl mx-auto space-y-6">

        {/* Tab Selector */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('cvs')}
            className={cn(
              'px-5 py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2',
              activeTab === 'cvs'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <FileText className="h-4 w-4" />
            My Resumes ({cvs.length})
          </button>
          <button
            onClick={() => setActiveTab('cover-letters')}
            className={cn(
              'px-5 py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2',
              activeTab === 'cover-letters'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <FileCode className="h-4 w-4" />
            Cover Letters ({coverLetters.length})
          </button>
          <button
            onClick={() => setActiveTab('video-cv')}
            className={cn(
              'px-5 py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2',
              activeTab === 'video-cv'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <Video className="h-4 w-4" />
            Video CV
          </button>
        </div>

        {/* ─── RESUMES TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'cvs' && (
          <div className="space-y-6">
            {/* Upload dropzone */}
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
                isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-surface-raised',
                uploading && 'opacity-60 cursor-wait',
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3">
                {uploadProgress === 'uploading' && <Loader2 className="h-8 w-8 text-primary animate-spin" />}
                {uploadProgress === 'parsing' && <Sparkles className="h-8 w-8 text-primary animate-pulse" />}
                {uploadProgress === 'done' && <CheckCircle2 className="h-8 w-8 text-success" />}
                {uploadProgress === 'error' && <AlertCircle className="h-8 w-8 text-destructive" />}
                {uploadProgress === 'idle' && <Upload className={cn('h-8 w-8', isDragActive ? 'text-primary' : 'text-muted-foreground')} />}

                <div>
                  <p className="text-sm font-medium">
                    {uploadProgress === 'uploading' ? 'Uploading…' :
                     uploadProgress === 'parsing' ? 'AI is parsing your CV…' :
                     uploadProgress === 'done' ? 'Done! CV added.' :
                     uploadProgress === 'error' ? 'Upload failed. Try again.' :
                     isDragActive ? 'Drop your CV here' : 'Drag & drop or click to upload new CV'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT, or Image (OCR supported)</p>
                </div>
              </div>
            </div>

            {/* CV list */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Your Resumes ({cvs.length})</h3>
                <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => window.location.href = '/resume-builder'}>
                  <Plus className="h-3.5 w-3.5" />
                  Create with CV Builder
                </Button>
              </div>

              {cvsLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
                </div>
              ) : cvs.length === 0 ? (
                <div className="bg-surface border border-dashed border-border rounded-xl p-8 text-center">
                  <FileText className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No CVs uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cvs.map(cv => (
                    <div key={cv.id} className={cn('bg-surface border rounded-xl p-4 flex items-center gap-3', cv.isDefault && 'border-primary/40 bg-primary/5')}>
                      <div className="h-10 w-10 rounded-lg bg-surface-raised border border-border flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate">{cv.title || cv.label || 'Untitled CV'}</p>
                          {cv.isDefault && <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">Default (Auto-Apply)</Badge>}
                        </div>
                        {cv.description && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{cv.description}</p>}
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Uploaded {formatDate(cv.createdAt)}
                          {cv.parsedData?.skills && ` · ${cv.parsedData.skills.length} skills detected`}
                        </p>
                        {cv.parsedData?.skills && cv.parsedData.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {cv.parsedData.skills.slice(0, 5).map(s => (
                              <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                            ))}
                            {cv.parsedData.skills.length > 5 && (
                              <Badge variant="secondary" className="text-[10px]">+{cv.parsedData.skills.length - 5}</Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Auto-fill Profile from this CV"
                          onClick={() => syncProfile.mutate(cv.id)}
                          className="text-primary hover:text-primary"
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Preview"
                          onClick={() => setPreviewCv(cv)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit Tag & Description"
                          onClick={() => setEditCv(cv)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={cv.isDefault ? 'Default CV' : 'Set as default'}
                          onClick={() => !cv.isDefault && setDefaultCv.mutate(cv.id)}
                          className={cv.isDefault ? 'text-primary' : ''}
                        >
                          {cv.isDefault ? <Star className="h-4 w-4 fill-primary" /> : <StarOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          onClick={() => {
                            if (cv.isDefault && cvs.length > 1) {
                              toast.error('Set another CV as default first');
                              return;
                            }
                            deleteCv.mutate(cv.id);
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── COVER LETTERS TAB ───────────────────────────────────────────── */}
        {activeTab === 'cover-letters' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Your Cover Letters ({coverLetters.length})</h3>
              <Button
                variant="default"
                size="sm"
                className="text-xs gap-1.5"
                onClick={() => {
                  setEditCl(null);
                  setClTitle('');
                  setClDesc('');
                  setClContent('');
                  setClIsDefault(coverLetters.length === 0);
                  setClFile(null);
                  setClModalOpen(true);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Cover Letter
              </Button>
            </div>

            {clLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
              </div>
            ) : coverLetters.length === 0 ? (
              <div className="bg-surface border border-dashed border-border rounded-xl p-8 text-center">
                <FileCode className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No cover letters created yet</p>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 text-xs"
                  onClick={() => {
                    setEditCl(null);
                    setClTitle('');
                    setClDesc('');
                    setClContent('');
                    setClIsDefault(true);
                    setClModalOpen(true);
                  }}
                >
                  + Create your first cover letter
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {coverLetters.map(cl => (
                  <div key={cl.id} className={cn('bg-surface border rounded-xl p-4 flex items-center gap-3', cl.isDefault && 'border-primary/40 bg-primary/5')}>
                    <div className="h-10 w-10 rounded-lg bg-surface-raised border border-border flex items-center justify-center shrink-0">
                      <FileCode className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold truncate">{cl.title}</p>
                        {cl.isDefault && <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">Default</Badge>}
                      </div>
                      {cl.description && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{cl.description}</p>}
                      <p className="text-[11px] text-muted-foreground mt-0.5">Updated {formatDate(cl.createdAt)}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit Cover Letter"
                        onClick={() => {
                          setEditCl(cl);
                          setClTitle(cl.title);
                          setClDesc(cl.description || '');
                          setClContent(cl.content || '');
                          setClIsDefault(cl.isDefault);
                          setClModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={cl.isDefault ? 'Default Cover Letter' : 'Set as default'}
                        onClick={() => !cl.isDefault && setDefaultCl.mutate(cl.id)}
                        className={cl.isDefault ? 'text-primary' : ''}
                      >
                        {cl.isDefault ? <Star className="h-4 w-4 fill-primary" /> : <StarOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => deleteCl.mutate(cl.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}\n          </div>
        )}

        {/* ─── VIDEO CV TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'video-cv' && (
          <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
              <Video className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-primary">Video CV</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Record or upload a 1–3 minute video introducing yourself, your skills, and what you're looking for.
                  Employers can watch your Video CV before reviewing your written resume.
                </p>
              </div>
            </div>

            {/* Existing video CV from server */}
            {!videoPreviewUrl && cvs.some(c => c.videoCv) && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Current Video CV</p>
                {cvs.filter(c => c.videoCv).slice(0, 1).map(c => (
                  <div key={c.id} className="bg-surface border border-border rounded-xl overflow-hidden">
                    <video
                      src={c.videoCv!}
                      controls
                      className="w-full max-h-[320px] object-contain bg-black"
                    />
                    <div className="p-3 flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium">{c.title || 'Video CV'}</span>
                      <span className="text-[11px] text-muted-foreground ml-auto">Tap to play</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Live preview after selecting a new file */}
            {videoPreviewUrl && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Preview</p>
                <div className="bg-surface border border-border rounded-xl overflow-hidden">
                  <video
                    src={videoPreviewUrl}
                    controls
                    className="w-full max-h-[320px] object-contain bg-black"
                  />
                </div>
              </div>
            )}

            {/* Upload dropzone */}
            <div
              {...getVideoRootProps()}
              className={cn(
                'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
                isVideoDrag ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-surface-raised',
                videoUploading && 'opacity-60 cursor-wait',
              )}
            >
              <input {...getVideoInputProps()} />
              <div className="flex flex-col items-center gap-3">
                {videoProgress === 'uploading' && <Loader2 className="h-8 w-8 text-primary animate-spin" />}
                {videoProgress === 'done'      && <CheckCircle2 className="h-8 w-8 text-success" />}
                {videoProgress === 'error'     && <AlertCircle className="h-8 w-8 text-destructive" />}
                {videoProgress === 'idle'      && <Video className={cn('h-8 w-8', isVideoDrag ? 'text-primary' : 'text-muted-foreground')} />}
                <div>
                  <p className="text-sm font-medium">
                    {videoProgress === 'uploading' ? 'Uploading…' :
                     videoProgress === 'done'      ? 'Video CV uploaded!' :
                     videoProgress === 'error'     ? 'Upload failed. Try again.' :
                     videoFile                     ? videoFile.name :
                     isVideoDrag                   ? 'Drop your video here' :
                     'Drag & drop or click to upload Video CV'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">MP4, WebM or MOV · Max 50 MB · 1–3 min recommended</p>
                </div>
              </div>
            </div>

            {/* Title + upload action */}
            {videoFile && videoProgress !== 'done' && (
              <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Video Title</label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={e => setVideoTitle(e.target.value)}
                    placeholder="e.g., My Video Introduction"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setVideoFile(null); setVideoPreviewUrl(null); setVideoProgress('idle'); }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleVideoUpload}
                    disabled={videoUploading || !videoFile}
                    className="gap-2"
                  >
                    {videoUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {videoUploading ? 'Uploading…' : 'Upload Video CV'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI tips */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold text-primary">Multi-Role & Auto-Fill Tips</p>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1.5">
            <li>• Create separate tagged CVs for each role you apply for (e.g. Frontend vs Product Management).</li>
            <li>• The default CV is used for <strong>Auto-Apply</strong> and instant job applications.</li>
            <li>• Click the <UserCheck className="h-3 w-3 inline text-primary" /> icon on any CV to auto-fill your profile with detected skills & experience.</li>
          </ul>
        </div>
      </div>

      {/* ─── CV UPLOAD TAG MODAL ───────────────────────────────────────────── */}
      {uploadCvFile && (
        <Dialog open={!!uploadCvFile} onOpenChange={v => !v && setUploadCvFile(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tag & Save Uploaded CV</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">CV Title / Role Tag *</label>
                <Input
                  placeholder="e.g., Senior Fullstack Developer Resume"
                  value={cvTitle}
                  onChange={e => setCvTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Notes / Description (Optional)</label>
                <Input
                  placeholder="e.g., Tailored for React & Node.js roles"
                  value={cvDesc}
                  onChange={e => setCvDesc(e.target.value)}
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cvIsDefault}
                    onChange={e => setCvIsDefault(e.target.checked)}
                    className="accent-primary h-4 w-4 rounded"
                  />
                  <span className="text-xs font-medium">Set as Default CV (used for Auto-Apply)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cvAutoFill}
                    onChange={e => setCvAutoFill(e.target.checked)}
                    className="accent-primary h-4 w-4 rounded"
                  />
                  <span className="text-xs font-medium text-primary">Auto-fill my profile with data extracted from this CV</span>
                </label>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadCvFile(null)}>Cancel</Button>
              <Button onClick={handleConfirmCvUpload} disabled={uploading || !cvTitle.trim()}>
                {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {uploading ? 'Processing…' : 'Save & Tag CV'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ─── CV EDIT TAG MODAL ─────────────────────────────────────────────── */}
      {editCv && (
        <Dialog open={!!editCv} onOpenChange={v => !v && setEditCv(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit CV Tags</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">CV Title / Tag *</label>
                <Input
                  value={editCv.title || ''}
                  onChange={e => setEditCv({ ...editCv, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Description</label>
                <Input
                  value={editCv.description || ''}
                  onChange={e => setEditCv({ ...editCv, description: e.target.value })}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-border">
                <input
                  type="checkbox"
                  checked={editCv.isDefault}
                  onChange={e => setEditCv({ ...editCv, isDefault: e.target.checked })}
                  className="accent-primary h-4 w-4 rounded"
                />
                <span className="text-xs font-medium">Set as Default CV</span>
              </label>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditCv(null)}>Cancel</Button>
              <Button
                onClick={() => updateCv.mutate({ id: editCv.id, data: { title: editCv.title, description: editCv.description, isDefault: editCv.isDefault } })}
                disabled={updateCv.isPending}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ─── COVER LETTER MODAL ────────────────────────────────────────────── */}
      {clModalOpen && (
        <Dialog open={clModalOpen} onOpenChange={v => !v && setClModalOpen(false)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editCl ? 'Edit Cover Letter' : 'Add Cover Letter'}</DialogTitle>
            </DialogHeader>
            <DialogBody className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Title / Tag *</label>
                <Input
                  placeholder="e.g., General Software Engineer Cover Letter"
                  value={clTitle}
                  onChange={e => setClTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Description / Target Role (Optional)</label>
                <Input
                  placeholder="e.g., Tailored for startup tech lead roles"
                  value={clDesc}
                  onChange={e => setClDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Cover Letter Content</label>
                <textarea
                  rows={6}
                  placeholder="Write or paste your cover letter text here…"
                  value={clContent}
                  onChange={e => setClContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                />
              </div>

              {!editCl && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Or Upload Document File (DOCX/PDF)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={e => setClFile(e.target.files?.[0] || null)}
                    className="text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-border">
                <input
                  type="checkbox"
                  checked={clIsDefault}
                  onChange={e => setClIsDefault(e.target.checked)}
                  className="accent-primary h-4 w-4 rounded"
                />
                <span className="text-xs font-medium">Set as Default Cover Letter</span>
              </label>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setClModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveCoverLetter} disabled={!clTitle.trim()}>Save Cover Letter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ─── CV PREVIEW MODAL ──────────────────────────────────────────────── */}
      {previewCv && (
        <Dialog open={!!previewCv} onOpenChange={v => !v && setPreviewCv(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{previewCv.title}</DialogTitle>
            </DialogHeader>
            <DialogBody className="max-h-[60vh] overflow-y-auto space-y-4">
              {previewCv.parsedData ? (
                <>
                  {previewCv.parsedData.name && <InfoRow label="Name" value={previewCv.parsedData.name} />}
                  {previewCv.parsedData.email && <InfoRow label="Email" value={previewCv.parsedData.email} />}
                  {previewCv.parsedData.phone && <InfoRow label="Phone" value={previewCv.parsedData.phone} />}
                  {previewCv.parsedData.skills?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1.5">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {previewCv.parsedData.skills.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                      </div>
                    </div>
                  )}
                  {previewCv.parsedData.experience?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Experience</p>
                      <div className="space-y-3">
                        {previewCv.parsedData.experience.map((e, i) => (
                          <div key={i} className="border border-border rounded-lg p-3">
                            <p className="text-xs font-semibold">{e.title} <span className="font-normal text-muted-foreground">@ {e.company}</span></p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{e.startDate} – {e.endDate ?? 'Present'}</p>
                            {e.description && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{e.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No parsed data available for this CV.</p>
              )}
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewCv(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-xs text-muted-foreground w-16 shrink-0">{label}</span>
      <span className="text-xs">{value}</span>
    </div>
  );
}
