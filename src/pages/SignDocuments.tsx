import { useState, useRef } from 'react';
import {
  Upload, FileText, Shield, CheckCircle2, Download, Share2,
  Mail, MessageSquare, Linkedin, Clock, FileCheck, AlertTriangle,
  X, Loader2, Eye, Pencil, Trash2, Plus, FilePenLine,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TopBar } from '@/components/common/TopBar';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// ── Types ─────────────────────────────────────────────────────────────────────

type View = 'dashboard' | 'upload' | 'analyzing' | 'identity' | 'review' | 'complete';
type DocStatus = 'completed' | 'pending' | 'draft';

interface Doc {
  id: string;
  name: string;
  status: DocStatus;
  date: string;
  size: string;
  sharedWith: number;
}

interface Identity {
  fullName: string;
  initials: string;
  role: string;
  company: string;
  address: string;
}

interface DetectedField {
  id: string;
  type: string;
  label: string;
  confidence: number;
  value: string;
}

const SAMPLE_DOCS: Doc[] = [
  { id: '1', name: 'Employment Contract — Acme Corp.pdf', status: 'completed', date: '2026-06-10', size: '245 KB', sharedWith: 2 },
  { id: '2', name: 'NDA Agreement — TechVentures.pdf', status: 'pending', date: '2026-06-15', size: '156 KB', sharedWith: 0 },
  { id: '3', name: 'Freelance Service Agreement.pdf', status: 'draft', date: '2026-06-17', size: '312 KB', sharedWith: 0 },
];

const STATUS_STYLE: Record<DocStatus, string> = {
  completed: 'bg-success/10 text-success',
  pending:   'bg-warning/10 text-warning',
  draft:     'bg-muted text-muted-foreground',
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SignDocumentsPage() {
  const [view, setView]             = useState<View>('dashboard');
  const [docs, setDocs]             = useState<Doc[]>(SAMPLE_DOCS);
  const [uploadedDoc, setUploadedDoc] = useState<{ name: string; size: string } | null>(null);
  const [identity, setIdentity]     = useState<Identity>({ fullName: '', initials: '', role: '', company: '', address: '' });
  const [fields, setFields]         = useState<DetectedField[]>([]);
  const [shareModal, setShareModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.docx')) {
      toast.error('Please upload a PDF or Word document');
      return;
    }
    setUploadedDoc({ name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' });
    setView('analyzing');
    setTimeout(() => {
      setFields([
        { id: '1', type: 'signature', label: 'Signature Field', confidence: 0.97, value: '' },
        { id: '2', type: 'name',      label: 'Full Name',       confidence: 0.94, value: identity.fullName },
        { id: '3', type: 'date',      label: 'Date Signed',     confidence: 0.98, value: new Date().toLocaleDateString() },
        { id: '4', type: 'company',   label: 'Company Name',    confidence: 0.88, value: identity.company },
        { id: '5', type: 'initials',  label: 'Initials',        confidence: 0.91, value: identity.initials },
      ]);
      setView('identity');
    }, 2000);
  };

  const handleSign = () => {
    const newDoc: Doc = {
      id: String(Date.now()),
      name: uploadedDoc?.name ?? 'Document.pdf',
      status: 'completed',
      date: new Date().toISOString().slice(0, 10),
      size: uploadedDoc?.size ?? '—',
      sharedWith: 0,
    };
    setDocs(prev => [newDoc, ...prev]);
    setView('complete');
  };

  const handleDelete = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id));
    toast.success('Document deleted');
  };

  const shareDoc = (platform: string) => {
    const text = `Signed document: ${uploadedDoc?.name ?? 'Document'}`;
    const url = window.location.href;
    const links: Record<string, string> = {
      email:     `mailto:?subject=${encodeURIComponent(uploadedDoc?.name ?? 'Document')}&body=${encodeURIComponent(text)}`,
      whatsapp:  `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      linkedin:  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    if (links[platform]) window.open(links[platform], '_blank');
    setShareModal(false);
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Sign Documents"
        actions={
          view === 'dashboard' ? (
            <Button size="sm" onClick={() => fileRef.current?.click()} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Upload & Sign
            </Button>
          ) : view !== 'complete' ? (
            <Button size="sm" variant="ghost" onClick={() => { setView('dashboard'); setUploadedDoc(null); }}>
              ← Back to Documents
            </Button>
          ) : undefined
        }
      />

      <input ref={fileRef} type="file" accept=".pdf,.docx" className="sr-only" onChange={handleFileSelect} />

      <div className="flex-1 overflow-y-auto">
        {view === 'dashboard' && <DashboardView docs={docs} onUpload={() => fileRef.current?.click()} onDelete={handleDelete} />}
        {view === 'analyzing' && <AnalyzingView docName={uploadedDoc?.name ?? ''} />}
        {view === 'identity'  && <IdentityView identity={identity} setIdentity={setIdentity} fields={fields} setFields={setFields} onNext={() => setView('review')} />}
        {view === 'review'    && <ReviewView doc={uploadedDoc} identity={identity} fields={fields} onSign={handleSign} onBack={() => setView('identity')} />}
        {view === 'complete'  && <CompleteView doc={uploadedDoc} identity={identity} onShare={() => setShareModal(true)} onBack={() => setView('dashboard')} />}
      </div>

      {shareModal && <ShareModal docName={uploadedDoc?.name ?? ''} onShare={shareDoc} onClose={() => setShareModal(false)} />}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function DashboardView({ docs, onUpload, onDelete }: { docs: Doc[]; onUpload: () => void; onDelete: (id: string) => void }) {
  const counts = { completed: docs.filter(d => d.status === 'completed').length, pending: docs.filter(d => d.status === 'pending').length };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: FileCheck, label: 'Documents Signed', value: counts.completed, color: 'text-success' },
          { icon: Clock,     label: 'Pending Signature', value: counts.pending, color: 'text-warning' },
          { icon: FileText,  label: 'Total Documents',  value: docs.length, color: 'text-primary' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-surface border border-border rounded-xl p-4">
            <Icon className={cn('h-5 w-5 mb-2', color)} />
            <p className={cn('text-2xl font-bold', color)}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Security note */}
      <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4">
        <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">AI-Powered Document Signing</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Our AI automatically detects signature fields and pre-fills known information.
            All documents are encrypted and securely stored.
          </p>
        </div>
      </div>

      {/* Document list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">My Documents</h2>
          <Button size="sm" variant="outline" onClick={onUpload} className="gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Upload New
          </Button>
        </div>

        {docs.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-10 text-center">
            <FilePenLine className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No documents yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Upload a PDF or Word document to get started</p>
            <Button size="sm" className="mt-4 gap-1.5" onClick={onUpload}>
              <Upload className="h-3.5 w-3.5" /> Upload Document
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {docs.map(doc => (
              <div key={doc.id} className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                    <span>{doc.size}</span>
                    <span>·</span>
                    <span>{doc.date}</span>
                    {doc.sharedWith > 0 && <><span>·</span><span>Shared with {doc.sharedWith}</span></>}
                  </div>
                </div>
                <Badge className={cn('text-xs shrink-0 capitalize', STATUS_STYLE[doc.status])}>
                  {doc.status}
                </Badge>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="icon" variant="ghost" className="h-8 w-8" title="View">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" title="Download">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" title="Delete" onClick={() => onDelete(doc.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Analyzing ─────────────────────────────────────────────────────────────────

function AnalyzingView({ docName }: { docName: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center px-6">
      <div className="relative">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <Shield className="h-6 w-6 text-primary absolute inset-0 m-auto" />
      </div>
      <div>
        <p className="text-base font-semibold text-foreground">Analyzing document…</p>
        <p className="text-sm text-muted-foreground mt-1 truncate max-w-xs">{docName}</p>
      </div>
      <div className="space-y-2 text-left w-full max-w-xs">
        {['Scanning for signature fields', 'Detecting form inputs', 'Pre-filling known data', 'Verifying document integrity'].map((step, i) => (
          <div key={step} className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" style={{ opacity: i < 2 ? 1 : 0.3 }} />
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Identity ──────────────────────────────────────────────────────────────────

function IdentityView({ identity, setIdentity, fields, setFields, onNext }: {
  identity: Identity;
  setIdentity: (id: Identity) => void;
  fields: DetectedField[];
  setFields: (f: DetectedField[]) => void;
  onNext: () => void;
}) {
  const set = (patch: Partial<Identity>) => setIdentity({ ...identity, ...patch });
  const setField = (id: string, value: string) =>
    setFields(fields.map(f => f.id === id ? { ...f, value } : f));

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
      <div className="bg-success/5 border border-success/20 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">AI Analysis Complete</p>
          <p className="text-xs text-muted-foreground mt-0.5">Found {fields.length} fields. Confirm your signing identity and review the detected fields.</p>
        </div>
      </div>

      {/* Identity */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" /> Signing Identity
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name</label>
            <Input value={identity.fullName} onChange={e => set({ fullName: e.target.value })} placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Initials</label>
            <Input value={identity.initials} onChange={e => set({ initials: e.target.value })} placeholder="JD" maxLength={4} />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Role / Title</label>
            <Input value={identity.role} onChange={e => set({ role: e.target.value })} placeholder="Software Engineer" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Company</label>
            <Input value={identity.company} onChange={e => set({ company: e.target.value })} placeholder="Acme Corp" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Address</label>
            <Input value={identity.address} onChange={e => set({ address: e.target.value })} placeholder="123 Main Street, Lagos, Nigeria" />
          </div>
        </div>
      </div>

      {/* Detected fields */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Pencil className="h-4 w-4 text-primary" /> Detected Fields
        </h3>
        {fields.map(f => (
          <div key={f.id} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
                <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full">
                  {Math.round(f.confidence * 100)}% confidence
                </span>
              </div>
              {f.type === 'signature' ? (
                <div className="h-10 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-surface-raised">
                  <span className="text-muted-foreground italic text-sm" style={{ fontFamily: 'cursive' }}>
                    {identity.fullName || 'Your Signature'}
                  </span>
                </div>
              ) : (
                <Input
                  value={f.value}
                  onChange={e => setField(f.id, e.target.value)}
                  className="text-sm"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} className="gap-1.5" disabled={!identity.fullName}>
          Review & Sign <CheckCircle2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ── Review ────────────────────────────────────────────────────────────────────

function ReviewView({ doc, identity, fields, onSign, onBack }: {
  doc: { name: string; size: string } | null;
  identity: Identity;
  fields: DetectedField[];
  onSign: () => void;
  onBack: () => void;
}) {
  const [signing, setSigning] = useState(false);

  const handleSign = async () => {
    setSigning(true);
    await new Promise(r => setTimeout(r, 1500));
    setSigning(false);
    onSign();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">
      {/* Alert */}
      <div className="flex items-start gap-3 bg-warning/5 border border-warning/20 rounded-xl p-4">
        <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Review before signing</p>
          <p className="text-xs text-muted-foreground mt-0.5">Verify all fields below are correct. Signed documents create a legally binding audit trail.</p>
        </div>
      </div>

      {/* Document info */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{doc?.name}</p>
            <p className="text-xs text-muted-foreground">{doc?.size} · Uploaded just now</p>
          </div>
        </div>

        {/* Simulated doc content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-gray-800 text-sm space-y-4">
          <p className="font-bold text-center text-base">DOCUMENT AGREEMENT</p>
          <p>This agreement is entered into between <span className="border-b border-dashed border-gray-400 px-1">{identity.fullName || '________________'}</span> (hereinafter "the Party") and the undersigned parties.</p>
          <p>By signing below, the Party agrees to the terms and conditions set forth in this document.</p>
          <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Signature</p>
              <div className="h-10 border-b border-gray-400 flex items-end pb-1">
                <span className="italic text-gray-700" style={{ fontFamily: 'cursive', fontSize: '18px' }}>{identity.fullName}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Date</p>
              <div className="h-10 border-b border-gray-400 flex items-end pb-1">
                <span className="text-gray-700">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Field summary */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-2">
        <p className="text-xs font-semibold text-foreground">Fields to be applied</p>
        {fields.map(f => (
          <div key={f.id} className="flex justify-between text-xs text-muted-foreground">
            <span>{f.label}</span>
            <span className="font-medium text-foreground">{f.type === 'signature' ? `[${identity.fullName}]` : f.value || '—'}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button onClick={handleSign} disabled={signing} className="gap-1.5">
          {signing ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Signing…</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Finalize & Sign</>}
        </Button>
      </div>
    </div>
  );
}

// ── Complete ──────────────────────────────────────────────────────────────────

function CompleteView({ doc, identity, onShare, onBack }: {
  doc: { name: string } | null;
  identity: Identity;
  onShare: () => void;
  onBack: () => void;
}) {
  return (
    <div className="max-w-lg mx-auto px-6 py-12 text-center space-y-6">
      <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
        <CheckCircle2 className="h-10 w-10 text-success" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-foreground">Document Signed!</h2>
        <p className="text-sm text-muted-foreground mt-1">Your signature has been applied and the document is secured.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4 text-left space-y-2 text-sm">
        {[
          { label: 'Document', value: doc?.name ?? '—' },
          { label: 'Signed by', value: identity.fullName || '—' },
          { label: 'Date', value: new Date().toLocaleString() },
          { label: 'Status', value: 'Completed & Secured' },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4">
            <span className="text-muted-foreground shrink-0">{label}</span>
            <span className="font-medium text-foreground text-right truncate">{value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Button className="w-full gap-1.5"><Download className="h-4 w-4" /> Download Signed Document</Button>
        <Button variant="outline" className="w-full gap-1.5" onClick={onShare}><Share2 className="h-4 w-4" /> Share Document</Button>
        <Button variant="ghost" className="w-full" onClick={onBack}>Back to Documents</Button>
      </div>
    </div>
  );
}

// ── Share Modal ───────────────────────────────────────────────────────────────

function ShareModal({ docName, onShare, onClose }: { docName: string; onShare: (p: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-2xl max-w-sm w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Share Document</p>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground truncate">{docName}</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { platform: 'email',    icon: Mail,           label: 'Email' },
            { platform: 'whatsapp', icon: MessageSquare,  label: 'WhatsApp' },
            { platform: 'linkedin', icon: Linkedin,       label: 'LinkedIn' },
          ].map(({ platform, icon: Icon, label }) => (
            <button
              key={platform}
              onClick={() => onShare(platform)}
              className="flex flex-col items-center gap-2 py-4 rounded-xl border border-border bg-surface-raised hover:border-primary/50 hover:bg-surface transition-colors"
            >
              <Icon className="h-6 w-6 text-primary" />
              <span className="text-xs text-muted-foreground">{label}</span>
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          className="w-full gap-1.5"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied');
            onClose();
          }}
        >
          Copy Link
        </Button>
      </div>
    </div>
  );
}
