import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import { templateService, TemplateDTO } from '../services/templateService';
import { CreditCard, Lock } from 'lucide-react';
import TemplatePreview from '../components/TemplatePreview';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<TemplateDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
  });

  const formData = location.state?.formData || {};

  useEffect(() => {
    if (id) {
      fetchTemplate();
    }
    loadRazorpayScript();
  }, [id]);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const fetchTemplate = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      const templateData = await templateService.getTemplateById(id);
      
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
      
      setTemplate(parsedTemplate);
    } catch (error) {
      console.error('Error fetching template:', error);
    }
    setLoading(false);
  };

  const handlePayment = async () => {
    if (!template || !userDetails.name || !userDetails.email) {
      alert('Please fill in all details');
      return;
    }

    setProcessing(true);

    try {
      // DUMMY PAYMENT MODE - Skip Razorpay integration
      console.log('DUMMY PAYMENT MODE: Simulating payment...');
      
      // Simulate payment success after 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create dummy payment response
      const dummyPaymentResponse = {
        razorpay_order_id: `order_dummy_${Date.now()}`,
        razorpay_payment_id: `pay_dummy_${Date.now()}`,
        razorpay_signature: `sig_dummy_${Date.now()}`
      };
      
      console.log('DUMMY PAYMENT: Payment successful', dummyPaymentResponse);
      await verifyPayment(dummyPaymentResponse);
      
      /* ORIGINAL RAZORPAY CODE - Uncomment when ready to use real payments
      const orderResponse = await paymentService.createOrder({
        template_id: template.id,
        amount: template.price || 0,
        user_name: userDetails.name,
        user_email: userDetails.email,
      });

      const order = orderResponse.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'TemplateMart',
        description: template.name,
        order_id: order.id,
        handler: async function (response: any) {
          await verifyPayment(response);
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
        },
        theme: {
          color: '#2563EB',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      */
    } catch (error) {
      console.error('Error in payment:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const verifyPayment = async (response: any) => {
    try {
      console.log('Verifying payment with data:', {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        user_name: userDetails.name,
        user_email: userDetails.email,
        user_data: formData
      });

      const result = await paymentService.verifyPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        user_data: JSON.stringify(formData),
        user_name: userDetails.name,
        user_email: userDetails.email,
      });

      console.log('Payment verification result:', result);

      if (result.success && result.page) {
        alert('Payment successful! Redirecting to your page...');
        navigate(`/view/${result.page.id}`);
      } else {
        alert(result.message || 'Payment verification failed. Please contact support.');
      }
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      alert(error.message || 'Payment verification failed. Please contact support.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="bg-slate-200 h-8 w-48 rounded mb-8"></div>
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
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Complete Your Purchase</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Your Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
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
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-900">{template.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal</span>
                  <span>₹{template.price}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Tax</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span>₹{template.price}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing || !userDetails.name || !userDetails.email}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                {processing ? (
                  'Processing Payment...'
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay ₹{template.price} (DUMMY MODE)
                  </>
                )}
              </button>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <strong>Test Mode:</strong> Payment is simulated. No real transaction will occur.
              </div>

              <div className="flex items-center justify-center text-sm text-slate-500">
                <Lock className="w-4 h-4 mr-1" />
                Secure payment powered by Razorpay (Test Mode)
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Preview</h2>
          <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
            <TemplatePreview template={template} data={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}
