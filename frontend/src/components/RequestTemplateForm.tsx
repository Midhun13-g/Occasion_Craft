import { useState } from 'react';
// Supabase import removed - using API service layer
import { CheckCircle } from 'lucide-react';

interface RequestTemplateFormProps {
  templateId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RequestTemplateForm({ templateId, onSuccess, onCancel }: RequestTemplateFormProps) {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('template_requests')
        .insert({
          template_id: templateId,
          ...formData,
          status: 'pending',
        } as any);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      console.error('Error submitting request:', err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Request Submitted!</h3>
        <p className="text-slate-600">
          Our team will contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.user_name}
          onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          required
          value={formData.user_email}
          onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          required
          value={formData.user_phone}
          onChange={(e) => setFormData({ ...formData, user_phone: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="+91 1234567890"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Additional Message
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tell us about your requirements..."
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
