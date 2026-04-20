import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllOrdersAdmin, getAllSellers, getSellerByIdAdmin, logout, AdminOrder, SellerProfile } from '../services/api';
import { ArrowLeft, Building2, Mail, Phone, Calendar, MapPin, Package, ShoppingBag, TrendingUp, Clock, Loader2 } from 'lucide-react';

const AdminSellerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const ordersRes = await getAllOrdersAdmin('all');
        if (ordersRes.success && ordersRes.data) {
          setOrders(ordersRes.data.filter((o) => o.seller?._id === id));
        }

        // First try the dedicated single-seller endpoint.
        try {
          const sellerRes = await getSellerByIdAdmin(id);
          if (sellerRes.success && sellerRes.data) {
            setSeller(sellerRes.data);
          }
        } catch {
          // Fallback for older backend instances: resolve by list endpoint.
          const sellersRes = await getAllSellers();
          if (sellersRes.success && sellersRes.data) {
            const found = sellersRes.data.find((s) => s._id === id) || null;
            setSeller(found);
          }
        }
      } catch (err: any) {
        if (err.status === 401 || err.status === 403) {
          logout();
          navigate('/seller-login');
        } else {
          setError(err.message || 'Failed to load seller profile');
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalUnits = orders.reduce((sum, o) => sum + (o.totalUnits || 0), 0);
    const totalValue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const latestOrder = orders.length > 0 ? orders[0] : null;

    return { totalOrders, totalUnits, totalValue, latestOrder };
  }, [orders]);

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#F8F8F6] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#6B8E23] mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading seller profile...</p>
        </div>
      </section>
    );
  }

  if (!seller) {
    return (
      <section className="min-h-screen bg-[#F8F8F6] p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <p className="text-gray-500 mb-4">Seller profile not found.</p>
          <Link to="/admin" className="text-[#6B8E23] hover:underline">Back to Admin</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F3F4F6]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-10">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <Link to="/admin" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-gray-500 hover:text-[#111111] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Admin
          </Link>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            seller.status === 'approved'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : seller.status === 'rejected'
              ? 'bg-red-50 text-red-600 border-red-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {seller.status}
          </span>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(17,17,17,0.05)] overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#111111] via-[#1E1E1E] to-[#2A2A2A] p-6 md:p-8 text-white relative">
            <div className="absolute -top-10 -right-6 w-40 h-40 rounded-full bg-[#6B8E23]/20 blur-2xl" />
            <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-2">Seller Profile</p>
                <h1 className="text-3xl md:text-4xl font-light leading-tight">{seller.name}</h1>
                <p className="text-sm text-gray-300 mt-1">{seller.businessName}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center">
                <span className="text-lg font-bold text-[#D6E5B4]">
                  {seller.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <InfoCard icon={<Mail className="w-4 h-4 text-[#6B8E23]" />} label="Email" value={seller.email} />
              <InfoCard icon={<Phone className="w-4 h-4 text-[#6B8E23]" />} label="Phone" value={seller.phone} />
              <InfoCard icon={<Building2 className="w-4 h-4 text-[#6B8E23]" />} label="Business" value={seller.businessName} />
              <InfoCard icon={<ShoppingBag className="w-4 h-4 text-[#6B8E23]" />} label="Category" value={seller.businessType} />
              <InfoCard icon={<Calendar className="w-4 h-4 text-[#6B8E23]" />} label="Registered" value={new Date(seller.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
              <InfoCard icon={<MapPin className="w-4 h-4 text-[#6B8E23]" />} label="Address" value={`${seller.addressLine1}${seller.addressLine2 ? ', ' + seller.addressLine2 : ''}, ${seller.city}, ${seller.state} - ${seller.pincode}`} />
            </div>

            <div>
              <h2 className="text-lg md:text-xl font-medium text-[#111111] mb-4">Order Insights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<ShoppingBag className="w-4 h-4" />} label="Total Orders" value={`${stats.totalOrders}`} />
                <StatCard icon={<Package className="w-4 h-4" />} label="Total Units" value={`${stats.totalUnits}`} />
                <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Total Value" value={`₹${stats.totalValue.toFixed(2)}`} />
                <StatCard icon={<Clock className="w-4 h-4" />} label="Latest Order" value={stats.latestOrder ? new Date(stats.latestOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No orders'} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(17,17,17,0.04)] p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg md:text-xl font-medium text-[#111111]">Order History</h2>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{orders.length} records</span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl bg-[#FAFAFA]">
              <ShoppingBag className="w-10 h-10 mx-auto text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">No orders yet for this seller.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 hover:bg-[#FCFCFC] transition-all">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                    <span>{order.totalUnits} units</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                    <span className="capitalize">{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const InfoCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-[#F8F8F6] border border-gray-100 rounded-xl p-4 hover:border-[#6B8E23]/20 transition-all">
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{label}</p>
    </div>
    <p className="text-sm text-[#111111] leading-relaxed">{value}</p>
  </div>
);

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-gradient-to-b from-[#F8F8F6] to-white border border-gray-100 rounded-xl p-4">
    <div className="flex items-center gap-2 mb-2 text-[#6B8E23]">
      {icon}
      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{label}</p>
    </div>
    <p className="text-2xl font-light text-[#111111] tracking-tight">{value}</p>
  </div>
);

export default AdminSellerProfile;
