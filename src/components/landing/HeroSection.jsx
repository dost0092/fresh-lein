import { Link } from 'react-router-dom';
import { ArrowRight, Zap, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative bg-[#0F5132] overflow-hidden min-h-[90vh] flex items-center">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #F97316 0%, transparent 50%), radial-gradient(circle at 75% 20%, #22c55e 0%, transparent 40%)' }}
      />
      <div className="absolute inset-0"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23F97316\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 border border-orange-400/30 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            Same-day foreclosure intelligence — before the crowd
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
            Find distressed properties{' '}
            <span className="text-orange-400">30 days before</span>{' '}
            your competitors
          </h1>

          <p className="text-lg lg:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
            FreshLien scrapes US county courts directly — delivering same-day NOD, Lis Pendens, 
            auction, and probate data. While PropStream shows you 60-day-old leads, 
            you're already closing deals.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-4 rounded-xl text-base transition-all border border-white/20"
            >
              View Live Demo
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: '$800B+', label: 'Distressed Asset Market', icon: TrendingUp },
              { value: 'Same-Day', label: 'Data Freshness', icon: Zap },
              { value: '30–60 Days', label: 'Competitors\' Lag', icon: Clock },
              { value: '3,143', label: 'US Counties', icon: null },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center sm:text-left">
                <p className="text-2xl lg:text-3xl font-display font-bold text-orange-400 mb-1">{value}</p>
                <p className="text-sm text-white/60 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}