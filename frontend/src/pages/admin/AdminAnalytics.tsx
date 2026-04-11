import { useEffect, useState } from 'react';
import { getDashboardAnalytics } from '../../services/analyticsService';
import { TrendingUp, DollarSign, FileText, Eye, Package, Users } from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalTemplates: number;
    activeTemplates: number;
    totalPages: number;
    totalPayments: number;
  };
  revenue: {
    totalRevenue: number;
    monthlyRevenue: number;
    todayRevenue: number;
  };
  templates: {
    simple: number;
    complex: number;
    byCategory: Array<{ category: string; count: number }>;
  };
  recentActivity: Array<{
    type: string;
    userName: string;
    templateName: string;
    createdAt: string;
  }>;
  topTemplates: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    totalSales: number;
    totalRevenue: number;
  }>;
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getDashboardAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8">
        <div className="text-center text-red-600">Failed to load analytics</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Package className="w-8 h-8" />}
          title="Total Templates"
          value={analytics.overview.totalTemplates}
          subtitle={`${analytics.overview.activeTemplates} active`}
          color="blue"
        />
        <StatCard
          icon={<FileText className="w-8 h-8" />}
          title="Total Pages"
          value={analytics.overview.totalPages}
          subtitle="Generated pages"
          color="green"
        />
        <StatCard
          icon={<Users className="w-8 h-8" />}
          title="Total Payments"
          value={analytics.overview.totalPayments}
          subtitle="Successful transactions"
          color="purple"
        />
        <StatCard
          icon={<DollarSign className="w-8 h-8" />}
          title="Total Revenue"
          value={`₹${analytics.revenue.totalRevenue.toLocaleString()}`}
          subtitle="All time"
          color="yellow"
        />
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{analytics.revenue.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">All time earnings</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Monthly Revenue</h3>
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{analytics.revenue.monthlyRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Today's Revenue</h3>
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{analytics.revenue.todayRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">Today's earnings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Template Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Template Distribution</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Simple Templates</span>
              <span className="font-bold text-blue-600">{analytics.templates.simple}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Complex Templates</span>
              <span className="font-bold text-purple-600">{analytics.templates.complex}</span>
            </div>
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-gray-700 mb-3">By Category</h4>
              {analytics.templates.byCategory.map((cat) => (
                <div key={cat.category} className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 capitalize">{cat.category}</span>
                  <span className="font-semibold text-gray-900">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analytics.recentActivity.length > 0 ? (
              analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.userName}</span> created a page
                    </p>
                    <p className="text-xs text-gray-600">{activity.templateName}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Templates */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Templates</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.topTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {template.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                    {template.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{template.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    {template.totalSales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    ₹{template.totalRevenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}

function StatCard({ icon, title, value, subtitle, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}
