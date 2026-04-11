import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { CategoryService, CategoryDTO } from '../../services/categoryService';

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to load categories');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await CategoryService.deleteCategory(id);
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      alert(error.message || 'Failed to delete category');
    }
  };

  const toggleActive = async (id: string) => {
    try {
      await CategoryService.toggleActive(id);
      fetchCategories();
    } catch (error) {
      console.error('Error toggling category:', error);
      alert('Failed to update category');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Manage Categories</h1>
          <p className="text-slate-600 mt-2">Organize your templates with categories</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
          onSave={() => {
            setShowForm(false);
            setEditingCategory(null);
            fetchCategories();
          }}
        />
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{category.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{category.name}</h3>
                  <p className="text-sm text-slate-500">{category.slug}</p>
                </div>
              </div>
              <button
                onClick={() => toggleActive(category.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  category.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {category.isActive ? 'Active' : 'Inactive'}
              </button>
            </div>

            <p className="text-slate-600 text-sm mb-4">{category.description}</p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-sm text-slate-500">
                {category.templateCount} templates
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCategory(category);
                    setShowForm(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 p-2"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

function CategoryForm({
  category,
  onClose,
  onSave,
}: {
  category: CategoryDTO | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    icon: category?.icon || '📦',
    isActive: category?.isActive !== undefined ? category.isActive : true,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate slug from name if not provided
    if (!formData.slug) {
      formData.slug = formData.name.toLowerCase().replace(/\s+/g, '-');
    }
    
    setSubmitting(true);
    try {
      if (category) {
        await CategoryService.updateCategory(category.id, formData);
      } else {
        await CategoryService.createCategory(formData);
      }
      alert('Category saved successfully!');
      onSave();
    } catch (error: any) {
      console.error('Error saving category:', error);
      alert(error.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ 
                    ...formData, 
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                  });
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Birthday"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., birthday"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Icon (Emoji) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 🎂"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.isActive ? 'active' : 'inactive'}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of this category"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
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
