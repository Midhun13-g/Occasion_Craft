import { useEffect, useState } from 'react';
import { Mail, Phone, MessageSquare, Check, X } from 'lucide-react';

interface TemplateRequest {
  id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  message?: string;
  admin_notes?: string;
  status: string;
  created_at: string;
  template?: { name: string };
}

export default function AdminRequests() {
  const [requests, setRequests] = useState<TemplateRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    // Initialize with empty requests
    setRequests([]);
  }, [selectedStatus]);

  const fetchRequests = async () => {
    // Placeholder: requests management will be implemented via API
    setRequests([]);
  };

  const updateStatus = async (id: string, status: string) => {
    // Placeholder: status update will be implemented via API
    alert('Request status update will be available soon');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Template Requests</h1>
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No requests found</h3>
          <p className="text-slate-600">There are no template requests to display.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">
                    {request.user_name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Requested on {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-slate-700">
                  <Mail className="w-5 h-5 mr-2 text-slate-400" />
                  <a href={`mailto:${request.user_email}`} className="hover:text-blue-600">
                    {request.user_email}
                  </a>
                </div>
                <div className="flex items-center text-slate-700">
                  <Phone className="w-5 h-5 mr-2 text-slate-400" />
                  <a href={`tel:${request.user_phone}`} className="hover:text-blue-600">
                    {request.user_phone}
                  </a>
                </div>
              </div>

              {request.template && (
                <div className="bg-slate-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-slate-900">Template Requested:</p>
                  <p className="text-slate-700">{(request.template as any).name}</p>
                </div>
              )}

              {request.message && (
                <div className="bg-slate-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-slate-900 mb-1">Message:</p>
                  <p className="text-slate-700 leading-relaxed">{request.message}</p>
                </div>
              )}

              {request.admin_notes && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Admin Notes:</p>
                  <p className="text-blue-800 leading-relaxed">{request.admin_notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(request.id, 'contacted')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Mark as Contacted
                    </button>
                    <button
                      onClick={() => updateStatus(request.id, 'cancelled')}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                )}
                {request.status === 'contacted' && (
                  <button
                    onClick={() => updateStatus(request.id, 'completed')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Mark as Completed
                  </button>
                )}
                <a
                  href={`https://wa.me/${request.user_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hi ${request.user_name}, regarding your template request...`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
