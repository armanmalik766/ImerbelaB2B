import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSellerProfile, getOrders, getAllOrdersAdmin, getProducts, placeOrder, updateOrderStatusAdmin, SellerProfile, OrderStatus, PlacedOrder, AdminOrder, ShippingAddress } from '../services/api';
import {
  User,
  Package,
  FileText,
  LogOut,
  Loader2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BadgeCheck,
  Clock,
  XCircle,
  Send,
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
} from 'lucide-react';

type Tab = 'profile' | 'orders' | 'bulk-order';

type DashboardOrder = {
  id: string;
  date: string;
  product: string;
  qty: number;
  total: number;
  status: string;
  sellerName?: string;
};

const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<Array<{ _id: string; title: string; subtitle?: string; moq: number }>>([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [requestActionLoading, setRequestActionLoading] = useState<string | null>(null);

  // Bulk order form state
  const [bulkOrder, setBulkOrder] = useState({
    product: '',
    quantity: '',
    notes: '',
  });
  const [bulkOrderSubmitted, setBulkOrderSubmitted] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchCatalogProducts();
  }, []);

  useEffect(() => {
    if ((activeTab === 'orders' || (activeTab === 'bulk-order' && profile?.role === 'admin')) && profile) {
      fetchOrdersHistory();
    }
  }, [activeTab, profile]);

  const fetchProfile = async () => {
    try {
      const response = await getSellerProfile();
      if (response.success && response.data) {
        setProfile(response.data);
      }
    } catch (error: any) {
      // If unauthorized, redirect to login
      if (error.status === 401) {
        logout();
        navigate('/seller-login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toDashboardOrder = (order: PlacedOrder | AdminOrder): DashboardOrder => {
    const firstTitle = order.items?.[0]?.title || 'Order Items';
    const extraCount = Math.max((order.items?.length || 1) - 1, 0);
    const productLabel = extraCount > 0 ? `${firstTitle} +${extraCount} more` : firstTitle;

    const sellerName =
      typeof (order as AdminOrder).seller === 'object' && (order as AdminOrder).seller?.name
        ? (order as AdminOrder).seller.name
        : undefined;

    return {
      id: order._id,
      date: new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      product: productLabel,
      qty: order.totalUnits || 0,
      total: order.totalAmount || 0,
      status: order.status,
      sellerName,
    };
  };

  const fetchOrdersHistory = async () => {
    setOrdersLoading(true);
    try {
      if (profile?.role === 'admin') {
        const response = await getAllOrdersAdmin('all');
        if (response.success && response.data) {
          setOrders(response.data.map(toDashboardOrder));
        }
      } else {
        const response = await getOrders();
        if (response.success && response.data) {
          setOrders(response.data.map(toDashboardOrder));
        }
      }
    } catch (error: any) {
      if (error.status === 401 || error.status === 403) {
        logout();
        navigate('/seller-login');
      }
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleBulkOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitBulkOrderRequest();
  };

  const fetchCatalogProducts = async () => {
    try {
      const response = await getProducts();
      if (response.success && response.data && Array.isArray(response.data)) {
        setCatalogProducts(
          response.data
            .filter((p: any) => p && p._id && p.title)
            .map((p: any) => ({ _id: p._id, title: p.title, subtitle: p.subtitle, moq: p.moq || 1 }))
        );
      }
    } catch {
      // Keep form usable; user will see no products if API fails
    }
  };

  const submitBulkOrderRequest = async () => {
    const qty = parseInt(bulkOrder.quantity, 10);
    const selectedProduct = catalogProducts.find((p) => p._id === bulkOrder.product);

    if (!selectedProduct) {
      setRequestMessage({ type: 'error', text: 'Please select a valid product.' });
      return;
    }

    if (!qty || qty < 10) {
      setRequestMessage({
        type: 'error',
        text: `Minimum request quantity is 10 units for ${selectedProduct.title}.`,
      });
      return;
    }

    setRequestLoading(true);
    setRequestMessage(null);

    try {
      const shippingAddress = {
        name: profile?.name || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        businessName: profile?.businessName || '',
        gstNumber: profile?.gstNumber || '',
        address: `${profile?.addressLine1}${profile?.addressLine2 ? ', ' + profile?.addressLine2 : ''}`,
        city: profile?.city || '',
        state: profile?.state || '',
        pincode: profile?.pincode || '',
      };
      const response = await placeOrder(
        [{ productId: selectedProduct._id, quantity: qty }],
        shippingAddress,
        bulkOrder.notes || 'Order request submitted from Seller Dashboard'
      );

      if (response.success) {
        setBulkOrderSubmitted(true);
        setRequestMessage({ type: 'success', text: 'Order request submitted successfully.' });
        setBulkOrder({ product: '', quantity: '', notes: '' });

        // Refresh orders for admin request view if needed
        if (activeTab === 'bulk-order' && profile?.role === 'admin') {
          fetchOrdersHistory();
        }

        setTimeout(() => {
          setBulkOrderSubmitted(false);
          setRequestMessage(null);
        }, 3000);
      }
    } catch (error: any) {
      setRequestMessage({ type: 'error', text: error.message || 'Failed to submit order request.' });
    } finally {
      setRequestLoading(false);
    }
  };

  const handleAdminRequestAction = async (orderId: string, action: 'approve' | 'reject') => {
    if (!profile || profile.role !== 'admin') return;

    setRequestActionLoading(orderId);
    try {
      await updateOrderStatusAdmin(orderId, action === 'approve' ? 'confirmed' : 'cancelled');
      fetchOrdersHistory();
    } catch {
      // Keep UI stable; table refresh will happen on next fetch
    } finally {
      setRequestActionLoading(null);
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; Icon: React.FC<any> }> = {
      approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', Icon: BadgeCheck },
      pending: { bg: 'bg-amber-50', text: 'text-amber-700', Icon: Clock },
      rejected: { bg: 'bg-red-50', text: 'text-red-700', Icon: XCircle },
    };
    const s = styles[status] || styles.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
        <s.Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase() as OrderStatus) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700';
      case 'shipped':
        return 'bg-blue-50 text-blue-700';
      case 'processing':
        return 'bg-violet-50 text-violet-700';
      case 'confirmed':
        return 'bg-cyan-50 text-cyan-700';
      case 'cancelled':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-amber-50 text-amber-700';
    }
  };

  const requestedOrders = orders.filter((order) => order.status.toLowerCase() === 'pending');

  const sidebarItems: { tab: Tab | 'direct-order'; label: string; Icon: React.FC<any>; path?: string }[] = [
    { tab: 'profile', label: 'Profile', Icon: User },
    { tab: 'orders', label: 'Order History', Icon: Package },
    { tab: 'bulk-order', label: 'Order Request', Icon: FileText },
    { tab: 'direct-order', label: 'Wholesale Store', Icon: ShoppingBag, path: '/bulk-order' },
  ];

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#6B8E23] mx-auto mb-4" />
          <p className="text-sm text-gray-500 font-light">Loading dashboard...</p>
        </div>
      </section>
    );
  }

  if (!profile) return null;

  return (
    <section className="min-h-screen bg-[#FAFAF9]">
      <div className="flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-gray-100 z-50 transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <Link to="/" className="text-lg font-semibold tracking-[0.3em] uppercase">
                  IMERBELA
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#6B8E23]/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#6B8E23]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#111111] truncate">
                    {profile?.name || 'Seller'}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {profile?.role === 'admin' ? 'Administrator' : 'Seller Partner'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 px-3 mb-2">
                  Dashboard
                </p>
              </div>
              {sidebarItems.map(({ tab, label, Icon, path }) => (
                <button
                  key={tab}
                  onClick={() => {
                    if (path) {
                      navigate(path);
                    } else {
                      setActiveTab(tab as Tab);
                    }
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    activeTab === tab
                      ? 'bg-[#111111] text-white'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-[#111111]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}

              {profile?.role === 'admin' && (
                <>
                  <div className="my-4 border-t border-gray-100" />
                  <Link
                    to="/admin"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-[#111111] transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Panel
                  </Link>
                </>
              )}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden text-gray-500"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-light text-[#111111] capitalize">
                  {activeTab === 'bulk-order' ? 'Bulk Order Request' : activeTab}
                </h2>
              </div>
              <div>{profile && statusBadge(profile.status)}</div>
            </div>
          </header>

          {/* Content Area */}
          <div className="p-6 md:p-8 max-w-5xl">
            {/* ─── PROFILE TAB ─── */}
            {activeTab === 'profile' && profile && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Welcome Card */}
                <div className="bg-gradient-to-br from-[#111111] to-[#2a2a2a] text-white p-8 rounded-xl">
                  <h3 className="text-2xl font-light mb-2">
                    Welcome back, <span className="font-serif italic">{profile.name.split(' ')[0]}</span>
                  </h3>
                  <p className="text-gray-400 text-sm font-light">
                    Manage your seller account and business operations
                  </p>
                  {profile.status === 'approved' && (
                    <div className="mt-6 flex gap-4">
                      <Link
                        to="/bulk-order"
                        className="bg-[#6B8E23] text-white px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-opacity-90 transition-all flex items-center gap-2"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Quick Bulk Order
                      </Link>
                      <Link
                        to="/wholesale"
                        className="bg-white/10 text-white px-6 py-3 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-white/20 transition-all"
                      >
                        View Catalog
                      </Link>
                    </div>
                  )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">
                      Personal Details
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-[#6B8E23]" />
                        <div>
                          <p className="text-xs text-gray-400">Full Name</p>
                          <p className="text-sm text-[#111111] font-medium">{profile.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-[#6B8E23]" />
                        <div>
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="text-sm text-[#111111]">{profile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#6B8E23]" />
                        <div>
                          <p className="text-xs text-gray-400">Phone</p>
                          <p className="text-sm text-[#111111]">{profile.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">
                      Business Details
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-[#6B8E23]" />
                        <div>
                          <p className="text-xs text-gray-400">Business Name</p>
                          <p className="text-sm text-[#111111] font-medium">{profile.businessName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-[#6B8E23]" />
                        <div>
                          <p className="text-xs text-gray-400">GST Number</p>
                          <p className="text-sm text-[#111111]">{profile.gstNumber || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="w-4 h-4 text-[#6B8E23]" />
                        <div>
                          <p className="text-xs text-gray-400">Category</p>
                          <p className="text-sm text-[#111111] font-medium">{profile.businessType}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-4 h-4 text-[#6B8E23]" />
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      Business Address
                    </h4>
                  </div>
                  <p className="text-sm text-[#111111] ml-7">
                    {profile.addressLine1}
                    {profile.addressLine2 && <><br />{profile.addressLine2}</>}
                    <br />
                    {profile.city}, {profile.district}, {profile.state} - {profile.pincode}
                  </p>
                </div>

                {/* Joined date */}
                <div className="flex items-center gap-2 text-xs text-gray-400 ml-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            )}

            {/* ─── ORDERS TAB ─── */}
            {activeTab === 'orders' && (
              <div className="animate-in fade-in duration-500">
                <div className="bg-white rounded-xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#111111]">
                      {profile?.role === 'admin' ? 'All Orders (Admin View)' : 'Recent Orders'}
                    </h3>
                  </div>

                  {ordersLoading ? (
                    <div className="p-10 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-[#6B8E23] mx-auto mb-3" />
                      <p className="text-sm text-gray-400">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="p-10 text-center">
                      <Package className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">No orders found.</p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-[#FAFAF9]">
                              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Order ID</th>
                              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Date</th>
                              {profile?.role === 'admin' && (
                                <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Seller</th>
                              )}
                              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Product</th>
                              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Qty</th>
                              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Total</th>
                              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order) => (
                              <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-mono text-[#6B8E23]">#{order.id.slice(-8).toUpperCase()}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                                {profile?.role === 'admin' && (
                                  <td className="px-6 py-4 text-sm text-gray-600">{order.sellerName || 'N/A'}</td>
                                )}
                                <td className="px-6 py-4 text-sm text-[#111111]">{order.product}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{order.qty}</td>
                                <td className="px-6 py-4 text-sm font-medium text-[#111111]">₹{order.total.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${getStatusClass(order.status)}`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Cards */}
                      <div className="md:hidden p-4 space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="bg-[#FAFAF9] p-4 rounded-lg space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-mono text-[#6B8E23]">#{order.id.slice(-8).toUpperCase()}</span>
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${getStatusClass(order.status)}`}
                              >
                                {order.status}
                              </span>
                            </div>
                            {profile?.role === 'admin' && (
                              <p className="text-xs text-gray-500">Seller: {order.sellerName || 'N/A'}</p>
                            )}
                            <p className="text-sm text-[#111111]">{order.product}</p>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Qty: {order.qty}</span>
                              <span className="font-medium text-[#111111]">₹{order.total.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-gray-400">{order.date}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ─── BULK ORDER TAB ─── */}
            {activeTab === 'bulk-order' && (
              <div className="max-w-xl animate-in fade-in duration-500">
                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  {profile?.role === 'admin' ? (
                    <>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[#111111] mb-6">
                        All Requested Orders
                      </h3>

                      {ordersLoading ? (
                        <div className="text-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-[#6B8E23] mx-auto mb-3" />
                          <p className="text-sm text-gray-400">Loading requested orders...</p>
                        </div>
                      ) : requestedOrders.length === 0 ? (
                        <div className="text-center py-8 bg-[#FAFAF9] rounded-lg border border-gray-100">
                          <Package className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                          <p className="text-sm text-gray-400">No pending order requests.</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                          {requestedOrders.map((order) => (
                            <div key={order.id} className="border border-gray-100 rounded-lg p-4 bg-[#FAFAF9]">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-mono text-[#6B8E23]">#{order.id.slice(-8).toUpperCase()}</span>
                                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${getStatusClass(order.status)}`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-sm text-[#111111] mb-1">{order.product}</p>
                              <p className="text-xs text-gray-500 mb-2">Seller: {order.sellerName || 'N/A'}</p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{order.date}</span>
                                <span>Qty: {order.qty} • ₹{order.total.toFixed(2)}</span>
                              </div>
                              <div className="mt-3 flex items-center gap-2">
                                <button
                                  onClick={() => handleAdminRequestAction(order.id, 'approve')}
                                  disabled={requestActionLoading === order.id}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[10px] uppercase tracking-wider font-bold hover:bg-emerald-600 disabled:opacity-50"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleAdminRequestAction(order.id, 'reject')}
                                  disabled={requestActionLoading === order.id}
                                  className="px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-600 text-[10px] uppercase tracking-wider font-bold hover:bg-red-50 disabled:opacity-50"
                                >
                                  Reject
                                </button>
                                {requestActionLoading === order.id && (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#6B8E23]" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : bulkOrderSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-6 bg-[#6B8E23]/10 rounded-full flex items-center justify-center">
                        <Send className="w-7 h-7 text-[#6B8E23]" />
                      </div>
                      <h3 className="text-xl font-light text-[#111111] mb-2">Request Submitted</h3>
                      <p className="text-sm text-gray-500">
                        Our team will reach out to you with pricing and availability.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[#111111] mb-6">
                        Request Bulk Order
                      </h3>
                      {requestMessage && (
                        <div
                          className={`mb-5 p-3 rounded-lg text-sm ${
                            requestMessage.type === 'success'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-red-50 text-red-700 border border-red-100'
                          }`}
                        >
                          {requestMessage.text}
                        </div>
                      )}
                      <form onSubmit={handleBulkOrderSubmit} className="space-y-6">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">
                            Product
                          </label>
                          <select
                            value={bulkOrder.product}
                            onChange={(e) => setBulkOrder({ ...bulkOrder, product: e.target.value })}
                            className="w-full bg-white border border-gray-200 focus:border-[#6B8E23] rounded-lg py-3.5 px-4 text-sm outline-none transition-all appearance-none cursor-pointer"
                            required
                          >
                            <option value="">Select a product</option>
                            {catalogProducts.map((p) => (
                              <option key={p._id} value={p._id}>
                                {p.subtitle ? `${p.title} (${p.subtitle})` : p.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={bulkOrder.quantity}
                            onChange={(e) => setBulkOrder({ ...bulkOrder, quantity: e.target.value })}
                            className="w-full bg-white border border-gray-200 focus:border-[#6B8E23] rounded-lg py-3.5 px-4 text-sm outline-none transition-all"
                            placeholder="Enter quantity (10-50 or more)"
                            min={10}
                            required
                          />
                          <p className="mt-1 text-[10px] uppercase tracking-wider text-gray-400">Minimum request: 10 units</p>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">
                            Additional Notes
                          </label>
                          <textarea
                            value={bulkOrder.notes}
                            onChange={(e) => setBulkOrder({ ...bulkOrder, notes: e.target.value })}
                            rows={4}
                            className="w-full bg-white border border-gray-200 focus:border-[#6B8E23] rounded-lg py-3.5 px-4 text-sm outline-none transition-all resize-none"
                            placeholder="Special requirements, delivery timeline, etc."
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={requestLoading}
                          className="w-full bg-[#111111] text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#6B8E23] transition-all rounded-lg flex items-center justify-center gap-2"
                        >
                          {requestLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Submit Request
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </section>
  );
};

export default SellerDashboard;
