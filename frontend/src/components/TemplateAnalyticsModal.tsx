import { X, TrendingUp, Eye, DollarSign, ShoppingCart } from 'lucide-react';

interface TemplateAnalyticsModalProps {
  analytics: {
    templateId: string;
    templateName: string;
    totalSales: number;
    totalRevenue: number;
    totalViews: number;
    activePages: number;
  };
  onClose: () => void;
}

export default function TemplateAnalyticsModal({ analytics, onClose }: TemplateAnalyticsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Template Analytics</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{analytics.templateName}</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">Total Sales</span>
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-900">{analytics.totalSales}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700">Total Revenue</span>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-900">₹{analytics.totalRevenue.toLocaleString()}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-700">Total Views</span>
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-900">{analytics.totalViews}</p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-yellow-700">Active Pages</span>
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-900">{analytics.activePages}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Average Revenue per Sale</span>
              <span className="font-semibold text-gray-900">
                ₹{analytics.totalSales > 0 ? (analytics.totalRevenue / analytics.totalSales).toFixed(2) : '0'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
              <span>Conversion Rate</span>
              <span className="font-semibold text-gray-900">
                {analytics.totalViews > 0 ? ((analytics.totalSales / analytics.totalViews) * 100).toFixed(2) : '0'}%
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
