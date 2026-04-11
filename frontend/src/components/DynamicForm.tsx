import { useEffect, useState } from 'react';
import { FormConfig, FormField } from '../types/database';
import { Sparkles } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface DynamicFormProps {
  config: FormConfig;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export default function DynamicForm({ config, data, onChange }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(data);
  const [localImagePreviews, setLocalImagePreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const uploadImageToCloudinary = async (file: File) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary is not configured');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Image upload failed');
    }

    return result.secure_url as string;
  };

  const handleFieldChange = (fieldId: string, value: unknown) => {
    const updatedData = { ...formData, [fieldId]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  const handleImageFileChange = async (fieldId: string, file: File | null) => {
    if (!file) return;

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      handleFieldChange(fieldId, imageUrl);
      setLocalImagePreviews((prev) => ({ ...prev, [fieldId]: imageUrl }));
    } catch (error) {
      console.warn('Cloudinary upload unavailable; using local preview', error);
      const previewUrl = URL.createObjectURL(file);
      setLocalImagePreviews((prev) => ({ ...prev, [fieldId]: previewUrl }));
      handleFieldChange(fieldId, previewUrl);
    }
  };

  const handleAISuggestion = async (field: FormField) => {
    const suggestion = `Sample ${field.label}`;
    handleFieldChange(field.id, suggestion);
  };

  const renderField = (field: FormField) => {
    const value = (formData[field.id] as string) ?? (field.defaultValue as string) ?? '';
    const imagePreview = localImagePreviews[field.id] || (field.type === 'image' ? (value as string) : '');

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                required={field.required}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {field.aiSuggestion && (
                <button
                  type="button"
                  onClick={() => handleAISuggestion(field)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 p-1"
                  title="Generate AI suggestion"
                >
                  <Sparkles className="w-5 h-5" />
                </button>
              )}
            </div>
            {field.validation?.message && (
              <p className="text-xs text-slate-500 mt-1">{field.validation.message}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <textarea
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                required={field.required}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {field.aiSuggestion && (
                <button
                  type="button"
                  onClick={() => handleAISuggestion(field)}
                  className="absolute right-2 top-2 text-blue-600 hover:text-blue-700 p-1"
                  title="Generate AI suggestion"
                >
                  <Sparkles className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'color':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={(value as string) || '#000000'}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className="h-10 w-20 border border-slate-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={(value as string) || '#000000'}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="#000000"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div key={field.id} className="mb-6">
            <ImageUpload
              value={value}
              onChange={(url) => handleFieldChange(field.id, url)}
              label={field.label + (field.required ? ' *' : '')}
              accept="image/*"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (!config || !config.fields || config.fields.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No form configuration available
      </div>
    );
  }

  return (
    <form className="space-y-2">
      {config.fields.map((field) => renderField(field))}
    </form>
  );
}
