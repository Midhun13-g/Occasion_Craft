import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { templateService, TemplateDTO } from '../services/templateService';
import { ArrowLeft, Check } from 'lucide-react';
import DynamicForm from '../components/DynamicForm';
import TemplatePreview from '../components/TemplatePreview';

interface FormConfig {
  fields: Array<{
    id: string;
    type: string;
    label: string;
    defaultValue?: unknown;
    [key: string]: unknown;
  }>;
}

export default function TemplateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<TemplateDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (id) {
      fetchTemplate();
    }
  }, [id]);

  const buildInitialFormData = (config: FormConfig, demoData: Record<string, unknown> = {}) => {
    const initialData = config?.fields?.reduce((acc, field) => {
      if (field.defaultValue !== undefined) {
        acc[field.id] = field.defaultValue;
      }
      return acc;
    }, {} as Record<string, unknown>);

    return {
      ...initialData,
      ...demoData,
    };
  };

  const fetchTemplate = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      console.log('[TemplateDetail] Fetching template:', id);
      const templateData = await templateService.getTemplateById(id);
      console.log('[TemplateDetail] Template data:', templateData);
      
      if (templateData) {
        // Parse JSON strings from backend
        const parsedTemplate = {
          ...templateData,
          config: typeof templateData.config === 'string' ? JSON.parse(templateData.config) : templateData.config,
          demo_data: typeof templateData.demo_data === 'string' ? JSON.parse(templateData.demo_data) : templateData.demo_data,
          features: (() => {
            if (!templateData.features) return [];
            try {
              return typeof templateData.features === 'string' ? JSON.parse(templateData.features) : templateData.features;
            } catch {
              return [];
            }
          })(),
        };
        
        console.log('[TemplateDetail] Parsed template:', parsedTemplate);
        setTemplate(parsedTemplate);
        
        // Initialize form data if config exists
        if (parsedTemplate.config) {
          const initialData = buildInitialFormData(parsedTemplate.config, parsedTemplate.demo_data);
          console.log('[TemplateDetail] Initial form data:', initialData);
          setFormData(initialData);
        }
      }
    } catch (error) {
      console.error('[TemplateDetail] Error fetching template:', error);
    }
    setLoading(false);
  };

  const handleFormChange = (data: Record<string, unknown>) => {
    setFormData(data);
  };

  const handleProceedToPayment = () => {
    navigate(`/checkout/${id}`, { state: { formData } });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="bg-slate-200 h-8 w-32 rounded mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-200 h-96 rounded-lg"></div>
            <div className="bg-slate-200 h-96 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Template not found</h2>
        <button
          onClick={() => navigate('/templates')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Browse all templates
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate('/templates')}
        className="flex items-center text-slate-600 hover:text-slate-900 mb-8 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to templates
      </button>

      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{template.name}</h1>
            <p className="text-lg text-slate-600 leading-relaxed">{template.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-900 mb-1">₹{template.price}</div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              template.type === 'simple'
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            }`}>
              {template.type === 'simple' ? 'Automated' : 'Custom'}
            </span>
          </div>
        </div>

        {template.features && Array.isArray(template.features) && template.features.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {template.features.map((feature, idx) => (
              <div key={idx} className="flex items-center text-sm text-slate-700">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                {feature}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Customize Your Template</h2>
          {template.config && template.config.fields && template.config.fields.length > 0 ? (
            <DynamicForm
              config={template.config}
              data={formData}
              onChange={handleFormChange}
            />
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>No customization fields available.</p>
              <p className="text-sm mt-2">Admin needs to add form config in template settings.</p>
            </div>
          )}
          <button
            onClick={handleProceedToPayment}
            className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Proceed to Payment - ₹{template.price}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Live Preview</h2>
          <div className="border-2 border-slate-200 rounded-lg overflow-hidden" style={{ minHeight: '600px' }}>
            <TemplatePreview template={template} data={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}
