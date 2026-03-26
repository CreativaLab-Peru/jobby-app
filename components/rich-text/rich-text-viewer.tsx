'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { cn } from '@/lib/utils';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new');
    return RQ;
  },
  {
    ssr: false,
    loading: () => <div className="h-20 w-full animate-pulse bg-muted rounded-md border border-input" />
  }
);

interface RichTextViewerProps {
  value: string;
  lineClamp?: number;
  className?: string;
}

export function RichTextViewer({ value, lineClamp, className }: RichTextViewerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-20 w-full bg-muted rounded-md border border-input" />;
  }

  // Estimamos la altura: 1.5rem (line-height) * número de líneas
  const maxHeight = lineClamp ? `${lineClamp * 1.5}rem` : 'none';

  return (
    <div className={cn("rich-text-viewer-wrapper relative", className)}>
      <ReactQuill
        theme="snow"
        value={value}
        readOnly={true}
        modules={{ toolbar: false }}
      />

      <style jsx global>{`
        .rich-text-viewer-wrapper .ql-container.ql-snow {
          border: none !important;
        }

        .rich-text-viewer-wrapper .ql-editor {
          padding: 0 !important;
          min-height: auto !important;
          cursor: default;
          font-size: 0.875rem;
          line-height: 1.5rem; /* Altura de línea fija para el cálculo */
          overflow: hidden;

          ${lineClamp ? `
            max-height: ${maxHeight};
            display: block;
            /* Agregamos un degradado al final para indicar que hay más texto */
            mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
          ` : ''}
        }

        .rich-text-viewer-wrapper .ql-toolbar,
        .rich-text-viewer-wrapper .ql-tooltip {
          display: none !important;
        }

        .dark .rich-text-viewer-wrapper .ql-editor {
          color: hsl(var(--foreground));
        }
      `}</style>
    </div>
  );
}
