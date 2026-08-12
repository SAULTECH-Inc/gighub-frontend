import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
  minHeight?: number;
}

const MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
  ],
};

const FORMATS = ['bold', 'italic', 'underline', 'list', 'bullet'];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  disabled = false,
  className,
  label,
  required = false,
  minHeight = 180,
}: RichTextEditorProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <div className="rich-text-editor-wrapper rounded-lg border border-border overflow-hidden">
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={MODULES}
          formats={FORMATS}
          placeholder={placeholder}
          readOnly={disabled}
          style={{ minHeight }}
        />
      </div>

      <style>{`
        .rich-text-editor-wrapper .ql-toolbar {
          background: hsl(var(--surface-raised));
          border: none;
          border-bottom: 1px solid hsl(var(--border));
          padding: 8px 12px;
        }
        .rich-text-editor-wrapper .ql-container {
          background: hsl(var(--surface));
          border: none;
          font-size: 14px;
          font-family: inherit;
        }
        .rich-text-editor-wrapper .ql-editor {
          color: hsl(var(--foreground));
          min-height: ${minHeight}px;
          padding: 12px 16px;
        }
        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
        }
        .rich-text-editor-wrapper .ql-toolbar .ql-stroke {
          stroke: hsl(var(--muted-foreground));
        }
        .rich-text-editor-wrapper .ql-toolbar .ql-fill {
          fill: hsl(var(--muted-foreground));
        }
        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: hsl(var(--primary));
        }
        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-fill,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: hsl(var(--primary));
        }
        .rich-text-editor-wrapper .ql-toolbar button:hover,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active {
          color: hsl(var(--primary));
        }
      `}</style>
    </div>
  );
}
