import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllOrdersAdmin, getAllSellers, getSellerByIdAdmin, logout, getAllProductsAdmin, AdminOrder, SellerProfile, Product } from '../services/api';
import { ArrowLeft, Building2, Mail, Phone, Calendar, MapPin, Package, ShoppingBag, TrendingUp, Clock, Loader2, MoreHorizontal, ChevronDown, Truck, Pencil, Grid } from 'lucide-react';

const AdminSellerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);

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

        const productsRes = await getAllProductsAdmin();
        if (productsRes.success && productsRes.data) {
          setAllProducts(productsRes.data);
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
  if (selectedOrder) {
    const isPaid = selectedOrder.paymentStatus === 'captured' || selectedOrder.paymentStatus === 'paid';
    const isUnfulfilled = selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed' || selectedOrder.status === 'processing';
    const isFulfilled = selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered';
    const subtotal = selectedOrder.items.reduce((sum, item) => sum + (item.totalPrice || (item.unitPrice * item.quantity)), 0);
    const shipping = 0; // Hardcoded or from DB if available

    return (
      <section className="min-h-screen bg-[#F3F4F6]">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-8 md:py-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-[#6B8E23]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#111111]">#{selectedOrder._id.slice(-6).toUpperCase()}</h1>
                <div className="flex gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {isPaid ? 'Paid' : 'Pending'}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isFulfilled ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {isFulfilled ? 'Fulfilled' : 'Unfulfilled'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(selectedOrder.createdAt).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })} from Online Store
              </p>
            </div>
          </div>
 
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Fulfillment Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium ${isUnfulfilled ? 'bg-[#FBECA9] text-[#7A5B00]' : 'bg-green-100 text-green-800'}`}>
                  <Package className="w-4 h-4" />
                  {isUnfulfilled ? 'Unfulfilled' : 'Fulfilled'}
                </div>
              </div>
              <div className="p-4 border-b border-gray-100 text-sm text-gray-700 flex items-center gap-3 font-medium">
                <div className="w-6 h-6 bg-[#6B8E23]/10 rounded flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5 text-[#6B8E23]" />
                </div>
                IMERBELA
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between flex-wrap gap-4 group">
                      <Link to={`/product/${item.handle}`} className="flex items-center gap-4 group/item">
                        <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#6B8E23]/30">
                          {allProducts.find(p => p.handle === item.handle)?.imageUrl ? (
                            <img 
                              src={allProducts.find(p => p.handle === item.handle)?.imageUrl} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111111] group-hover/item:text-[#6B8E23] transition-colors">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium tracking-wide text-[10px] uppercase">Default</span>
                            <span className="text-gray-300">|</span>
                            <span className="font-mono text-[10px] text-gray-400">{item.handle}</span>
                          </p>
                        </div>
                      </Link>
                       <div className="text-right">
                        <div className="flex items-center justify-end gap-6 text-sm">
                          <div className="text-gray-400">
                            <p className="text-[10px] uppercase tracking-wider mb-0.5">Retail Price</p>
                            <p className="line-through">₹{(allProducts.find(p => p.handle === item.handle)?.mrpPerUnit || 0).toFixed(2)}</p>
                          </div>
                          <div className="text-[#111111] font-medium">
                            <p className="text-[10px] uppercase tracking-wider text-[#6B8E23] mb-0.5">Seller Price</p>
                            <p>₹{item.unitPrice.toFixed(2)} × {item.quantity}</p>
                          </div>
                          <div className="w-20 text-right font-bold text-[#111111]">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">Total</p>
                            <p>₹{item.totalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 bg-[#FAFAFA] flex justify-end">
                <div className="inline-flex rounded-lg shadow-sm">
                  <button className="px-4 py-2 bg-[#2E2E2E] hover:bg-[#111111] text-white text-sm font-medium rounded-l-lg transition-colors border border-[#2E2E2E]">
                    Mark as fulfilled
                  </button>
                  <button className="px-3 py-2 bg-[#2E2E2E] hover:bg-[#111111] text-white rounded-r-lg border-l border-[#4a4a4a] transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium ${isPaid ? 'bg-green-100 text-green-800' : 'bg-[#FFE9C9] text-[#9A5B13]'}`}>
                  {!isPaid && <Clock className="w-4 h-4" />}
                  {isPaid ? 'Paid' : 'Payment pending'}
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <div className="flex items-center gap-4 md:gap-10">
                    <span className="text-gray-600">{selectedOrder.totalUnits} item{selectedOrder.totalUnits > 1 ? 's' : ''}</span>
                    <span className="text-[#111111] w-20 text-right">₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Shipping</span>
                  <div className="flex items-center gap-4 md:gap-10">
                    <span className="text-gray-500">IMERBELA (Standard Shipping)</span>
                    <span className="text-[#111111] w-20 text-right">₹{shipping.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between py-3 font-semibold text-[#111111] text-base mt-2 mb-2">
                  <span>Total</span>
                  <span className="w-20 text-right">₹{(subtotal + shipping).toFixed(2)}</span>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 text-sm">
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Paid</span>
                  <span className="text-[#111111] w-20 text-right">₹{isPaid ? (subtotal + shipping).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between py-2 font-medium text-[#111111]">
                  <span>Balance</span>
                  <span className="w-20 text-right">₹{isPaid ? '0.00' : (subtotal + shipping).toFixed(2)}</span>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 bg-[#FAFAFA] flex justify-end gap-3 flex-wrap">
                <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-[#111111] text-sm font-medium rounded-lg transition-colors shadow-sm">
                  Send invoice
                </button>
                <button className="px-4 py-2 bg-[#2E2E2E] hover:bg-[#111111] text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                  Mark as paid
                </button>
              </div>
            </div>

            {/* Blocks Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-6">
              <div className="p-4 border-b border-gray-100 flex items-center gap-2 font-semibold text-[#111111]">
                <Grid className="w-4 h-4 text-gray-500" /> Blocks
              </div>
              <div className="p-10 text-center text-sm text-gray-500 bg-[#FAFAFA]">
                No blocks added
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Notes Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#111111] text-sm">Notes</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600">No notes from customer</p>
            </div>

            {/* Customer Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#111111] text-sm">Customer</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-sm text-[#005BD3] hover:underline cursor-pointer font-medium mb-1">{selectedOrder.shippingAddress?.name || seller.name}</p>
                <p className="text-sm text-[#005BD3] hover:underline cursor-pointer">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[#111111] text-sm">Contact information</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-[#005BD3] hover:underline cursor-pointer mb-1">{selectedOrder.shippingAddress?.email || seller.email}</p>
                <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.phone || seller.phone || 'No phone number'}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[#111111] text-sm">Shipping address</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p>{selectedOrder.shippingAddress?.name || seller.name}</p>
                  {selectedOrder.shippingAddress?.businessName && <p>{selectedOrder.shippingAddress.businessName}</p>}
                  <p>{selectedOrder.shippingAddress?.address || seller.addressLine1}</p>
                  <p>{selectedOrder.shippingAddress?.city || seller.city} {selectedOrder.shippingAddress?.pincode || seller.pincode}</p>
                  <p>{selectedOrder.shippingAddress?.state || seller.state}, India</p>
                  <p className="mt-1">{selectedOrder.shippingAddress?.phone || seller.phone}</p>
                </div>
                <p className="text-sm text-[#005BD3] hover:underline cursor-pointer mt-2 font-medium">View map</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[#111111] text-sm">Billing address</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">Same as shipping address</p>
              </div>
            </div>

            {/* Conversion Summary Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h3 className="font-semibold text-[#111111] text-sm mb-4">Conversion summary</h3>
              <div className="text-sm text-gray-600 flex items-start gap-3">
                <ShoppingBag className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p>This is their 1st order</p>
              </div>
            </div>
            </div>
          </div>
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
                <div 
                  key={order._id} 
                  className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 hover:bg-[#FCFCFC] transition-all cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 items-center">
                    <span>{order.totalUnits} units</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                    <span className="capitalize px-2 py-0.5 bg-gray-50 rounded text-[10px] font-medium border border-gray-100">{order.status}</span>
                    <Link 
                      to={`/admin/order/${order._id}/invoice`}
                      onClick={(e) => e.stopPropagation()}
                      className="ml-auto text-[10px] font-bold uppercase tracking-widest text-[#6B8E23] hover:underline"
                    >
                      View Invoice
                    </Link>
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

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-[#F8F8F6] border border-gray-100 rounded-xl p-4 hover:border-[#6B8E23]/20 transition-all">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{label}</p>
      </div>
      <p className="text-sm text-[#111111] leading-relaxed">{value}</p>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gradient-to-b from-[#F8F8F6] to-white border border-gray-100 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2 text-[#6B8E23]">
        {icon}
        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{label}</p>
      </div>
      <p className="text-2xl font-light text-[#111111] tracking-tight">{value}</p>
    </div>
  );
}

export default AdminSellerProfile;
