import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { pageService, UserPageDTO } from '../services/pageService';
import { Share2, Eye } from 'lucide-react';
import TemplatePreview from '../components/TemplatePreview';

export default function ViewPage() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<UserPageDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPage();
    }
  }, [id]);

  const fetchPage = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      const pageData = await pageService.getPageBySlugOrId(id);
      setPage(pageData);
      
      // Increment view count
      if (pageData?.id) {
        await pageService.incrementViewCount(pageData.id);
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    }
    setLoading(false);
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my page!',
          url: url,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h2>
          <p className="text-slate-600">The page you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={handleShare}
          className="bg-white text-slate-700 px-4 py-2 rounded-lg shadow-lg hover:bg-slate-50 transition flex items-center gap-2 border border-slate-200"
        >
          <Share2 className="w-4 h-4" />
          {copied ? 'Copied!' : 'Share'}
        </button>

        <div className="bg-white text-slate-700 px-4 py-2 rounded-lg shadow-lg border border-slate-200 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span className="text-sm font-medium">{page.viewCount} views</span>
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg border border-slate-200">
        <p className="text-sm text-slate-600">
          Created with <span className="font-semibold text-blue-600">TemplateMart</span>
        </p>
      </div>
    </div>
  );
}
