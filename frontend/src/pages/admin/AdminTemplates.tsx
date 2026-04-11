import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Eye, EyeOff, BarChart3 } from 'lucide-react';
import { templateService } from '../../services/templateService';
import { getTemplateAnalytics } from '../../services/analyticsService';
import { CategoryService, CategoryDTO } from '../../services/categoryService';
import TemplateAnalyticsModal from '../../components/TemplateAnalyticsModal';
import type { TemplateDTO } from '../../services/templateService';
import type { Template } from '../../types/database';

const CATEGORIES = [
  { value: 'birthday', label: '🎂 Birthday' },
  { value: 'wedding', label: '💒 Wedding' },
  { value: 'anniversary', label: '💝 Anniversary' },
  { value: 'business', label: '💼 Business' },
  { value: 'invitation', label: '✉️ Invitation' },
  { value: 'greeting', label: '🎉 Greeting' },
  { value: 'portfolio', label: '📁 Portfolio' },
  { value: 'resume', label: '📄 Resume' },
  { value: 'certificate', label: '🏆 Certificate' },
  { value: 'social-media', label: '📱 Social Media' },
  { value: 'event', label: '🎪 Event' },
  { value: 'other', label: '📦 Other' },
];

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateDTO | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templateAnalytics, setTemplateAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data.filter(c => c.isActive));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await templateService.getAllTemplatesForAdmin();
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      await templateService.deleteTemplate(id);
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template');
    }
  };

  const handleViewAnalytics = async (templateId: string) => {
    try {
      const data = await getTemplateAnalytics(templateId);
      setTemplateAnalytics(data);
      setSelectedTemplateId(templateId);
      setShowAnalytics(true);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      alert('Failed to load analytics');
    }
  };

  const toggleActive = async (template: TemplateDTO) => {
    try {
      await templateService.toggleTemplateActive(template.id);
      fetchTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Failed to update template');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Manage Templates</h1>
        <div className="flex items-center gap-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold text-slate-700"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold text-slate-700"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={() => {
              setEditingTemplate(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Template
          </button>
        </div>
      </div>

      {showForm && (
        <TemplateForm
          template={editingTemplate}
          onClose={() => {
            setShowForm(false);
            setEditingTemplate(null);
            fetchTemplates();
          }}
        />
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {templates
                .filter((t) => !categoryFilter || t.category === categoryFilter)
                .filter((t) => !statusFilter || (statusFilter === 'active' ? t.is_active : !t.is_active))
                .map((template) => (
                <tr key={template.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{template.name}</div>
                    <div className="text-sm text-slate-500 truncate max-w-xs">{template.template_url}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 capitalize">{template.category}</td>
                  <td className="px-6 py-4 text-slate-900 font-semibold">₹{template.price}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(template)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        template.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {template.is_active ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleViewAnalytics(template.id)}
                      className="text-green-600 hover:text-green-800 p-1"
                      title="View Analytics"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingTemplate(template);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAnalytics && templateAnalytics && (
        <TemplateAnalyticsModal
          analytics={templateAnalytics}
          onClose={() => {
            setShowAnalytics(false);
            setTemplateAnalytics(null);
            setSelectedTemplateId(null);
          }}
        />
      )}
    </div>
  );
}

function TemplateForm({
  template,
  onClose,
}: {
  template: Template | null;
  onClose: () => void;
}) {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    category: template?.category || '',
    price: template?.price || 0,
    preview_url: template?.preview_url || '',
    preview_type: template?.preview_type?.toLowerCase() || 'image',
    template_url: template?.template_url || '',
    features: (() => {
      if (!template?.features) return '';
      try {
        const parsed = typeof template.features === 'string' ? JSON.parse(template.features) : template.features;
        return Array.isArray(parsed) ? parsed.join(', ') : '';
      } catch {
        return '';
      }
    })(),
    config: (() => {
      if (!template?.config) return JSON.stringify({ fields: [] }, null, 2);
      try {
        const parsed = typeof template.config === 'string' ? JSON.parse(template.config) : template.config;
        return JSON.stringify(parsed, null, 2);
      } catch {
        return JSON.stringify({ fields: [] }, null, 2);
      }
    })(),
    demo_data: (() => {
      if (!template?.demo_data) return JSON.stringify({}, null, 2);
      try {
        const parsed = typeof template.demo_data === 'string' ? JSON.parse(template.demo_data) : template.demo_data;
        return JSON.stringify(parsed, null, 2);
      } catch {
        return JSON.stringify({}, null, 2);
      }
    })(),
    is_active: template?.is_active !== undefined ? template.is_active : true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data.filter(c => c.isActive));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = formData.template_url.trim();
    if (!url || !/^https?:\/\/.+/.test(url)) {
      setUrlError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    
    setSubmitting(true);

    try {
      // Validate JSON fields
      let configObj, demoDataObj;
      try {
        configObj = JSON.parse(formData.config);
      } catch (e) {
        alert('Invalid JSON in Form Config field. Please check the syntax.');
        setSubmitting(false);
        return;
      }
      
      try {
        demoDataObj = JSON.parse(formData.demo_data);
      } catch (e) {
        alert('Invalid JSON in Demo Data field. Please check the syntax.');
        setSubmitting(false);
        return;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        type: 'simple',
        category: formData.category,
        price: Number(formData.price),
        preview_url: formData.preview_url,
        preview_type: formData.preview_type,
        template_url: formData.template_url,
        features: JSON.stringify(formData.features.split(',').map((f) => f.trim()).filter(Boolean)),
        config: formData.config,
        demo_data: formData.demo_data,
        is_active: formData.is_active,
      };

      console.log('Submitting template:', payload);

      if (template) {
        await templateService.updateTemplate(template.id, payload);
      } else {
        await templateService.createTemplate(payload);
      }

      alert('Template saved successfully!');
      onClose();
    } catch (err: any) {
      console.error('Error saving template:', err);
      alert(`Failed to save template: ${err.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">
            {template ? 'Edit Template' : 'Add New Template'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Template Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Template URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.template_url}
                onChange={(e) => {
                  setFormData({ ...formData, template_url: e.target.value });
                  setUrlError('');
                }}
                onBlur={(e) => {
                  const url = e.target.value.trim();
                  if (url && !/^https?:\/\/.+/.test(url)) {
                    setUrlError('Please enter a valid URL starting with http:// or https://');
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  urlError ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="https://template.netlify.app"
              />
              {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                <a href="/admin/categories" className="text-blue-600 hover:underline">Manage categories</a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Preview Type
              </label>
              <select
                value={formData.preview_type}
                onChange={(e) => setFormData({ ...formData, preview_type: e.target.value as 'image' | 'video' | 'iframe' })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="iframe">Iframe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.is_active ? 'active' : 'inactive'}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active (Visible to users)</option>
                <option value="inactive">Inactive (Hidden from users)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Preview URL <span className="text-red-500">*</span></label>
            <input
              type="url"
              required
              value={formData.preview_url}
              onChange={(e) => setFormData({ ...formData, preview_url: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={
                formData.preview_type === 'image' 
                  ? 'https://example.com/image.jpg'
                  : formData.preview_type === 'video'
                  ? 'https://youtube.com/watch?v=...'
                  : 'https://example.com/preview'
              }
            />
            <p className="text-xs text-slate-500 mt-1">
              {formData.preview_type === 'image' && 'Direct link to image file (jpg, png, gif, webp)'}
              {formData.preview_type === 'video' && 'YouTube or Vimeo video URL'}
              {formData.preview_type === 'iframe' && 'URL to embed in iframe'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Features (comma-separated)
            </label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Feature 1, Feature 2, Feature 3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Form Config (JSON)
            </label>
            <textarea
              value={formData.config}
              onChange={(e) => setFormData({ ...formData, config: e.target.value })}
              rows={10}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Demo Data (JSON)
            </label>
            <textarea
              value={formData.demo_data}
              onChange={(e) => setFormData({ ...formData, demo_data: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
