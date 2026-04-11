import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { templateService, TemplateDTO } from '../services/templateService';
import { CategoryService, CategoryDTO } from '../services/categoryService';
import { Filter, Search, Sparkles } from 'lucide-react';

export default function TemplateList() {
  const [searchParams] = useSearchParams();
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');

  useEffect(() => {
    fetchCategories();
    fetchTemplates();
  }, [selectedCategory]);

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
      let data: TemplateDTO[] = [];
      
      if (selectedCategory !== 'all') {
        data = await templateService.getTemplatesByCategory(selectedCategory);
      } else {
        data = await templateService.getAllTemplates();
      }
      
      console.log('Fetched templates:', data);
      data.forEach(t => console.log(`Template: ${t.name}, preview_url: ${t.preview_url}`));
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
    setLoading(false);
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Browse Templates</h1>
        <p className="text-lg text-slate-600">
          Choose from our collection of beautiful, customizable templates
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 animate-pulse">
              <div className="bg-slate-200 h-48 rounded-lg mb-4"></div>
              <div className="bg-slate-200 h-6 rounded mb-2"></div>
              <div className="bg-slate-200 h-4 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No templates found</h3>
          <p className="text-slate-600">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Link
              key={template.id}
              to={`/templates/${template.id}`}
              className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-lg transition group"
            >
              <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-50 to-slate-50 h-48">
                {template.preview_url ? (
                  <img
                    src={template.preview_url}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      console.error(`Failed to load image for ${template.name}:`, template.preview_url);
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="flex items-center justify-center h-full"><svg class="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg></div>';
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Sparkles className="w-16 h-16 text-slate-300" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                  {template.name}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {template.description}
                </p>

                {template.features && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(() => {
                      try {
                        const features = typeof template.features === 'string' 
                          ? JSON.parse(template.features) 
                          : template.features;
                        return Array.isArray(features) ? features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                            {feature}
                          </span>
                        )) : null;
                      } catch (e) {
                        return null;
                      }
                    })()}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-900">
                    ₹{template.price}
                  </span>
                  <span className="text-sm text-slate-500 capitalize">
                    {template.category?.split('-').join(' ')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
