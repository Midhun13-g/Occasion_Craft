import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare, DollarSign, Eye, TrendingUp, Users, Tag, BarChart3 } from 'lucide-react';
import { templateService } from '../../services/templateService';
import { getDashboardAnalytics } from '../../services/analyticsService';

interface DashboardStats {
  totalTemplates: number;
  activeTemplates: number;
  totalPages: number;
  pendingRequests: number;
  totalRevenue: number;
  recentTemplates: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTemplates: 0,
    activeTemplates: 0,
    totalPages: 0,
    pendingRequests: 0,
    totalRevenue: 0,
    recentTemplates: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [templates, analytics] = await Promise.all([
        templateService.getAllTemplatesForAdmin(),
        getDashboardAnalytics()
      ]);
      
      const activeTemplates = templates.filter(t => t.is_active);
      const recentTemplates = templates.slice(0, 5);

      setStats({
        totalTemplates: templates.length,
        activeTemplates: activeTemplates.length,
        totalPages: analytics.overview.totalPages,
        pendingRequests: 0,
        totalRevenue: analytics.revenue.totalRevenue,
        recentTemplates
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
        <div className="text-sm text-slate-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              {stats.activeTemplates} Active
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">
            {loading ? '-' : stats.totalTemplates}
          </h3>
          <p className="text-sm text-slate-600">Total Templates</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">
            {loading ? '-' : stats.totalPages}
          </h3>
          <p className="text-sm text-slate-600">Pages Created</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">
            {loading ? '-' : stats.pendingRequests}
          </h3>
          <p className="text-sm text-slate-600">Pending Requests</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-cyan-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">
            ₹{loading ? '-' : stats.totalRevenue.toLocaleString()}
          </h3>
          <p className="text-sm text-slate-600">Total Revenue</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link
          to="/admin/templates"
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-lg transition group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition">
            Manage Templates
          </h3>
          <p className="text-slate-600 text-sm">
            Create, edit, and manage your template collection
          </p>
        </Link>

        <Link
          to="/admin/categories"
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-lg transition group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-purple-600 transition">
            Manage Categories
          </h3>
          <p className="text-slate-600 text-sm">
            Add, edit, and organize template categories
          </p>
        </Link>

        <Link
          to="/admin/analytics"
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-lg transition group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-200 transition">
              <BarChart3 className="w-6 h-6 text-cyan-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-cyan-600 transition">
            Analytics
          </h3>
          <p className="text-slate-600 text-sm">
            View performance metrics and insights
          </p>
        </Link>

        <Link
          to="/admin/requests"
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-lg transition group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition">
              <MessageSquare className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-orange-600 transition">
            View Requests
          </h3>
          <p className="text-slate-600 text-sm">
            Manage template requests from customers
          </p>
        </Link>
      </div>

      {/* Recent Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Templates</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : stats.recentTemplates.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No templates yet. Create your first template!
          </div>
        ) : (
          <div className="space-y-4">
            {stats.recentTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-4">
                  {template.preview_url ? (
                    <img
                      src={template.preview_url}
                      alt={template.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-slate-900">{template.name}</h3>
                    <p className="text-sm text-slate-500 capitalize">{template.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-slate-900">₹{template.price}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      template.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {template.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
