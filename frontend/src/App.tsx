import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TemplateList from './pages/TemplateList';
import TemplateDetail from './pages/TemplateDetail';
import Checkout from './pages/Checkout';
import ViewPage from './pages/ViewPage';
import AuthPage from './pages/AuthPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTemplates from './pages/admin/AdminTemplates';
import AdminCategories from './pages/admin/AdminCategories';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminRequests from './pages/admin/AdminRequests';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes - No Layout */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        {/* Main Routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="templates" element={<TemplateList />} />
          <Route path="templates/:id" element={<TemplateDetail />} />
          <Route path="checkout/:id" element={<Checkout />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/templates" element={<AdminTemplates />} />
          <Route path="admin/categories" element={<AdminCategories />} />
          <Route path="admin/analytics" element={<AdminAnalytics />} />
          <Route path="admin/requests" element={<AdminRequests />} />
        </Route>
        
        {/* View Page - No Layout */}
        <Route path="view/:id" element={<ViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
