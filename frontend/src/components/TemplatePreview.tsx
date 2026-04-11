import { Suspense } from 'react';
import BirthdayTemplate from './templates/BirthdayTemplate';
import WeddingTemplate from './templates/WeddingTemplate';
import IframeTemplatePreview from './IframeTemplatePreview';
import { Template } from '../types/database';

interface TemplatePreviewProps {
  template: Template;
  data: Record<string, unknown>;
}

const templateComponents: Record<string, React.ComponentType<{ data: Record<string, unknown> }>> = {
  BirthdayTemplate,
  WeddingTemplate,
};

export default function TemplatePreview({ template, data }: TemplatePreviewProps) {
  // Always use iframe for template preview with postMessage
  if (template.template_url) {
    return <IframeTemplatePreview src={template.template_url} data={data} title={template.name} />;
  }

  return (
    <div className="flex items-center justify-center min-h-[560px] bg-slate-50 rounded-lg">
      <p className="text-slate-500">No template URL provided</p>
    </div>
  );
}
