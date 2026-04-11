import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Shield, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Create Stunning Pages
              <span className="block text-blue-600">In Minutes</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Choose from our collection of beautiful templates, customize them with AI assistance,
              and share your unique page instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/templates"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
              >
                Browse Templates
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/templates?type=simple"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition border-2 border-slate-200"
              >
                View Simple Templates
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600">Three simple steps to your perfect page</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="text-4xl font-bold text-blue-600 mb-4">01</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Choose Template</h3>
              <p className="text-slate-600 leading-relaxed">
                Browse our collection and select the perfect template for your needs
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="text-4xl font-bold text-blue-600 mb-4">02</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Customize Content</h3>
              <p className="text-slate-600 leading-relaxed">
                Fill in your details with AI assistance and preview your page in real-time
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="text-4xl font-bold text-blue-600 mb-4">03</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Publish & Share</h3>
              <p className="text-slate-600 leading-relaxed">
                Complete payment and get your unique shareable link instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Join thousands of satisfied customers who have created beautiful pages with our templates
          </p>
          <Link
            to="/templates"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
