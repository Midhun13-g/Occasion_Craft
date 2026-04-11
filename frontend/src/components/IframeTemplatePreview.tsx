import { useEffect, useRef, useState } from 'react';

interface IframeTemplatePreviewProps {
  src: string;
  data: Record<string, unknown>;
  title?: string;
}

export default function IframeTemplatePreview({ src, data, title = 'Template Preview' }: IframeTemplatePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const targetOrigin = (() => {
    try {
      return new URL(src, window.location.href).origin;
    } catch {
      return '*';
    }
  })();

  const sendPreviewData = () => {
    if (!iframeRef.current?.contentWindow) {
      console.log('[IframePreview] No iframe contentWindow available');
      return;
    }

    console.log('[IframePreview] Sending data to iframe:', {
      type: 'UPDATE',
      payload: data,
      targetOrigin,
      src
    });

    iframeRef.current.contentWindow.postMessage(
      {
        type: 'UPDATE',
        payload: data,
      },
      targetOrigin
    );
  };

  useEffect(() => {
    console.log('[IframePreview] Effect triggered - isLoaded:', isLoaded, 'data:', data);
    if (isLoaded) {
      // Small delay to ensure iframe is ready
      setTimeout(() => {
        sendPreviewData();
      }, 100);
    }
  }, [data, isLoaded, targetOrigin]);

  return (
    <div className="relative bg-slate-100 rounded-lg overflow-hidden min-h-[560px]">
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        sandbox="allow-scripts allow-same-origin allow-forms"
        className="w-full min-h-[560px] border-0"
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="text-slate-600 text-sm font-medium">Loading live preview…</div>
        </div>
      )}
    </div>
  );
}
