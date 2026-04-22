import React from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  Award,
  Gem,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Truck,
  Headphones,
  Shield,
  Users,
  MapPin,
  Package,
  Leaf,
  Star,
} from 'lucide-react';

const TIERS = [
  {
    name: 'Silver',
    icon: Shield,
    color: '#94A3B8',
    bgGradient: 'from-slate-50 to-slate-100',
    borderColor: 'border-slate-200',
    badgeColor: 'bg-slate-100 text-slate-600',
    minPurchase: '₹50,000',
    minUnits: '200 units',
    discount: '10%',
    benefits: [
      'Standard bulk pricing',
      'Email support',
      'Monthly order reports',
      'Basic marketing materials',
      'Standard shipping (5–7 days)',
    ],
  },
  {
    name: 'Gold',
    icon: Award,
    color: '#D97706',
    bgGradient: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-700',
    minPurchase: '₹1,50,000',
    minUnits: '500 units',
    discount: '20%',
    featured: true,
    benefits: [
      'Enhanced bulk pricing',
      'Priority phone & WhatsApp support',
      'Weekly order reports',
      'Premium marketing kit + POS displays',
      'Express shipping (2–3 days)',
      'Dedicated account manager',
      'Early access to new products',
    ],
  },
  {
    name: 'Platinum',
    icon: Crown,
    color: '#6B8E23',
    bgGradient: 'from-[#6B8E23]/5 to-emerald-50',
    borderColor: 'border-[#6B8E23]/30',
    badgeColor: 'bg-[#6B8E23]/10 text-[#6B8E23]',
    minPurchase: '₹5,00,000',
    minUnits: '2000 units',
    discount: '30%',
    benefits: [
      'Best-in-class seller pricing',
      '24/7 dedicated support line',
      'Real-time analytics dashboard',
      'Custom branding & white-label options',
      'Free express shipping',
      'Senior account manager',
      'Territory exclusivity (select regions)',
      'Co-branded marketing campaigns',
      'First priority on limited editions',
    ],
  },
];

const REQUIREMENTS = [
  { icon: Package, title: 'GST Registration', desc: 'Valid GST number for tax invoice generation' },
  { icon: MapPin, title: 'Physical Store or Warehouse', desc: 'Dedicated space for product storage and distribution' },
  { icon: Users, title: 'Established Customer Base', desc: 'Active retail or distribution network in your region' },
  { icon: TrendingUp, title: 'Minimum Monthly Commitment', desc: 'Based on your selected tier level' },
];

const DistributorProgram: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-[#111111] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6B8E23] rounded-full blur-[200px] opacity-10"></div>
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-amber-500 rounded-full blur-[150px] opacity-5"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 md:py-32 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-[1px] w-8 bg-[#6B8E23]"></div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#6B8E23] font-bold">
              Exclusive Partnership
            </span>
            <div className="h-[1px] w-8 bg-[#6B8E23]"></div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9] mb-8">
            Become an{' '}
            <span className="block font-serif italic text-gray-400 mt-2">
              IMERBELA Distributor
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-10">
            Join our tiered distributor network. Build a profitable business with India's
            most trusted Ayurvedic haircare brand. Higher commitment, bigger rewards.
          </p>

          <Link
            to="/become-seller"
            className="inline-flex items-center gap-2 bg-[#6B8E23] text-white px-12 py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#7da028] transition-all rounded-sm shadow-lg shadow-[#6B8E23]/20"
          >
            Apply for Distribution
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ═══ TIER CARDS ═══ */}
      <section className="py-24 md:py-32 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#6B8E23] font-bold block mb-4">
              Choose Your Level
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#111111] mb-6">
              Distributor{' '}
              <span className="font-serif italic text-gray-400">Tiers</span>
            </h2>
            <p className="text-gray-500 font-light max-w-lg mx-auto">
              Select the partnership level that matches your business capacity.
              Upgrade anytime as your business grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {TIERS.map((tier, idx) => (
              <div
                key={idx}
                className={`relative bg-gradient-to-br ${tier.bgGradient} p-8 md:p-10 rounded-xl border ${tier.borderColor} transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] flex flex-col ${
                  tier.featured ? 'md:-mt-4 md:mb-0 md:py-12 shadow-xl' : ''
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#111111] text-white text-[9px] uppercase tracking-widest px-4 py-1.5 font-bold rounded-full inline-flex items-center gap-1.5">
                      <Star className="w-3 h-3 fill-[#6B8E23] text-[#6B8E23]" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                    style={{ backgroundColor: `${tier.color}15` }}
                  >
                    <tier.icon className="w-7 h-7" style={{ color: tier.color }} />
                  </div>
                  <h3 className="text-2xl font-light tracking-tight text-[#111111] mb-2">
                    {tier.name}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${tier.badgeColor}`}>
                    {tier.discount} OFF
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center">
                    <p className="text-lg font-semibold text-[#111111]">{tier.minPurchase}</p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1">
                      Monthly Min
                    </p>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center">
                    <p className="text-lg font-semibold text-[#111111]">{tier.minUnits}</p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1">
                      Min Units
                    </p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3 flex-1">
                  {tier.benefits.map((b, bidx) => (
                    <div key={bidx} className="flex items-start gap-3">
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: tier.color }}
                      />
                      <span className="text-sm text-gray-600 font-light">{b}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-8">
                  <Link
                    to="/become-seller"
                    className={`w-full block text-center py-4 text-xs font-bold tracking-[0.2em] uppercase rounded-lg transition-all ${
                      tier.featured
                        ? 'bg-[#111111] text-white hover:bg-[#6B8E23]'
                        : 'border border-gray-300 text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111]'
                    }`}
                  >
                    Apply as {tier.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REQUIREMENTS ═══ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#6B8E23] font-bold block mb-4">
              Eligibility
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-[#111111]">
              Requirements to{' '}
              <span className="font-serif italic text-gray-400">Qualify</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {REQUIREMENTS.map((req, idx) => (
              <div
                key={idx}
                className="flex items-start gap-5 p-6 bg-[#FAFAF9] rounded-xl border border-gray-100 group hover:border-[#6B8E23]/20 transition-all duration-500"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-[#6B8E23] transition-colors duration-500">
                  <req.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111] mb-1">
                    {req.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-light">{req.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24 md:py-32 bg-[#111111] text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#6B8E23] rounded-full blur-[200px] opacity-10"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="w-16 h-16 bg-[#6B8E23]/10 rounded-full mx-auto mb-8 flex items-center justify-center">
            <Leaf className="w-7 h-7 text-[#6B8E23]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
            Build Your{' '}
            <span className="font-serif italic text-gray-400">Empire</span>
          </h2>
          <p className="text-gray-400 font-light text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Start as Silver, scale to Platinum. We grow with you —
            providing the products, support, and margins you need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/become-seller"
              className="bg-[#6B8E23] text-white px-12 py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#7da028] transition-all rounded-sm shadow-lg shadow-[#6B8E23]/20 inline-flex items-center justify-center gap-2"
            >
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/seller"
              className="border border-white/20 text-white px-12 py-5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-[#111111] transition-all rounded-sm text-center"
            >
              View Seller Hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DistributorProgram;
