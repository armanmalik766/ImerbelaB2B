import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getAllSellers,
  getAllOrdersAdmin,
  approveSeller,
  rejectSeller,
  updateOrderStatusAdmin,
  getAllProductsAdmin,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  bulkUpdatePriceAdmin,
  uploadImageAdmin,
  getSellerProfile,
  SellerProfile,
  AdminOrder,
  OrderStatus,
  Product,
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Loader2,
  LogOut,
  Filter,
  Building2,
  Mail,
  Phone,
  Calendar,
  BadgeCheck,
  ShieldX,
  MapPin,
  FileText,
  Package,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Plus,
  Trash2,
  Edit,
  Tag,
  Percent,
  LayoutDashboard,
  Shield,
  TrendingUp,
  Eye,
  X,
  Hash,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';
type OrderFilterStatus = 'all' | OrderStatus;

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { logout, seller: profile, isLoading: authLoading } = useAuth();
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [expandedSeller, setExpandedSeller] = useState<string | null>(null);
  const [detailModal, setDetailModal] = useState<SellerProfile | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [allOrdersForStats, setAllOrdersForStats] = useState<AdminOrder[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderFilterStatus>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderActionLoading, setOrderActionLoading] = useState<string | null>(null);
  
  // Tab Management
  const [activeTab, setActiveTab] = useState<'sellers' | 'orders' | 'products'>('sellers');

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productActionLoading, setProductActionLoading] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bulk Price State
  const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false);
  const [bulkPriceData, setBulkPriceData] = useState({
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    action: 'increase' as 'increase' | 'decrease'
  });
  const [bulkPriceLoading, setBulkPriceLoading] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, [filterStatus]);

  useEffect(() => {
    fetchOrders();
  }, [orderStatus]);

  useEffect(() => {
    fetchAllOrdersForStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchSellers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const status = filterStatus === 'all' ? undefined : filterStatus;
      const response = await getAllSellers(status, searchQuery || undefined);
      if (response.success && response.data) {
        setSellers(response.data);
      }
    } catch (err: any) {
      if (err.status === 401 || err.status === 403) {
        logout();
        navigate('/seller-login');
      } else {
        setError(err.message || 'Failed to load sellers');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await approveSeller(id);
      setSellers((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: 'approved' as const } : s))
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await rejectSeller(id);
      setSellers((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: 'rejected' as const } : s))
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSellers();
  };

  const fetchAllOrdersForStats = async () => {
    try {
      const response = await getAllOrdersAdmin('all');
      if (response.success && response.data) {
        setAllOrdersForStats(response.data);
      }
    } catch {
      // Ignore stats fetch errors to keep main admin flows unaffected
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setError('');
    try {
      const response = await getAllOrdersAdmin(orderStatus, orderSearch || undefined);
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (err: any) {
      if (err.status === 401 || err.status === 403) {
        logout();
        navigate('/seller-login');
      } else {
        setError(err.message || 'Failed to load orders');
      }
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleOrderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleOrderStatusUpdate = async (orderId: string, status: OrderStatus) => {
    setOrderActionLoading(orderId);
    setError('');
    try {
      const response = await updateOrderStatusAdmin(orderId, status);
      if (response.success && response.data) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? response.data! : o)));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setOrderActionLoading(null);
    }
  };

  const handleOpenSellerProfileFromOrder = (sellerId?: string) => {
    if (!sellerId) {
      setError('Seller profile not available for this order');
      return;
    }
    navigate(`/admin/seller/${sellerId}`);
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    setError('');
    try {
      const response = await getAllProductsAdmin();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setError('');

    try {
      const res = await uploadImageAdmin(file);
      if (res.success && res.data) {
        setEditingProduct(prev => prev ? { ...prev, imageUrl: res.data!.url } : null);
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  const handleCreateOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.handle || editingProduct?.price === undefined) {
      setError('Title, handle, and price are required');
      return;
    }

    setProductActionLoading('modal');
    try {
      let res;
      if (editingProduct._id) {
        res = await updateProductAdmin(editingProduct._id, editingProduct);
      } else {
        res = await createProductAdmin(editingProduct);
      }

      if (res.success) {
        setIsProductModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
        alert(res.message || 'Product saved successfully!');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setProductActionLoading(null);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to toggle the active status of this product?')) return;
    setProductActionLoading(id);
    try {
      const res = await deleteProductAdmin(id);
      if (res.success) {
        setProducts(prev => prev.map(p => p._id === id ? { ...p, isActive: !p.isActive } : p));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to toggle product status');
    } finally {
      setProductActionLoading(null);
    }
  };

  const handleBulkPriceUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkPriceData.value <= 0) {
      setError('Adjustment value must be greater than 0');
      return;
    }

    setBulkPriceLoading(true);
    try {
      const res = await bulkUpdatePriceAdmin(bulkPriceData);
      if (res.success) {
        setIsBulkPriceModalOpen(false);
        fetchProducts();
        alert(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update prices bulkily');
    } finally {
      setBulkPriceLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(productSearch.toLowerCase()) || 
                           p.handle.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, productCategoryFilter]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const statusBadgeStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <BadgeCheck className="w-3.5 h-3.5" />;
      case 'rejected':
        return <ShieldX className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const stats = {
    total: sellers.length,
    pending: sellers.filter((s) => s.status === 'pending').length,
    approved: sellers.filter((s) => s.status === 'approved').length,
    rejected: sellers.filter((s) => s.status === 'rejected').length,
  };

  const toggleExpand = (id: string) => {
    setExpandedSeller(expandedSeller === id ? null : id);
  };

  const orderBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'confirmed':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const sellerOrderStats = useMemo(() => {
    const map: Record<
      string,
      {
        totalOrders: number;
        totalUnits: number;
        totalAmount: number;
        lastOrderAt: string | null;
      }
    > = {};

    allOrdersForStats.forEach((order) => {
      const sellerId = order.seller?._id;
      if (!sellerId) return;

      if (!map[sellerId]) {
        map[sellerId] = {
          totalOrders: 0,
          totalUnits: 0,
          totalAmount: 0,
          lastOrderAt: null,
        };
      }

      map[sellerId].totalOrders += 1;
      map[sellerId].totalUnits += order.totalUnits || 0;
      map[sellerId].totalAmount += order.totalAmount || 0;

      if (!map[sellerId].lastOrderAt || new Date(order.createdAt) > new Date(map[sellerId].lastOrderAt)) {
        map[sellerId].lastOrderAt = order.createdAt;
      }
    });

    return map;
  }, [allOrdersForStats]);

  const getSellerOrderStats = (sellerId: string) => {
    return (
      sellerOrderStats[sellerId] || {
        totalOrders: 0,
        totalUnits: 0,
        totalAmount: 0,
        lastOrderAt: null,
      }
    );
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#6B8E23] mx-auto" />
          <p className="text-gray-400 text-sm font-light italic">Accessing database...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <section className="min-h-screen bg-[#F8F8F6]">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-semibold tracking-[0.3em] uppercase">
              IMERBELA
            </Link>
            <div className="hidden md:flex items-center gap-1.5 bg-[#111111] text-white px-3 py-1 rounded-full">
              <Shield className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button
                onClick={() => setActiveTab('sellers')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'sellers' ? 'bg-[#111111] text-white shadow-sm' : 'text-gray-500 hover:text-[#111111]'
                }`}
              >
                Sellers
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'orders' ? 'bg-[#111111] text-white shadow-sm' : 'text-gray-500 hover:text-[#111111]'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'products' ? 'bg-[#111111] text-white shadow-sm' : 'text-gray-500 hover:text-[#111111]'
                }`}
              >
                Products
              </button>
            </div>
            <Link
              to="/seller-dashboard"
              className="hidden md:flex items-center gap-2 text-xs text-gray-500 hover:text-[#111111] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Tab-based Content */}
        {activeTab === 'sellers' && (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#111111] mb-2">
                Seller <span className="font-serif italic text-gray-400">Management</span>
              </h1>
              <p className="text-sm text-gray-400 font-light">
                Review, approve, and manage all seller partner applications
              </p>
            </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#111111] to-[#2a2a2a] p-6 rounded-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <Users className="w-5 h-5 mb-3 opacity-60" />
            <p className="text-3xl font-light mb-1">{stats.total}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Total Sellers</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-amber-100 relative overflow-hidden group hover:shadow-lg hover:shadow-amber-50 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-500" />
            <Clock className="w-5 h-5 mb-3 text-amber-500 relative z-10" />
            <p className="text-3xl font-light text-amber-600 relative z-10">{stats.pending}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500 relative z-10">Pending Review</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 relative overflow-hidden group hover:shadow-lg hover:shadow-emerald-50 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-500" />
            <CheckCircle className="w-5 h-5 mb-3 text-emerald-500 relative z-10" />
            <p className="text-3xl font-light text-emerald-600 relative z-10">{stats.approved}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500 relative z-10">Approved</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-red-100 relative overflow-hidden group hover:shadow-lg hover:shadow-red-50 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-500" />
            <XCircle className="w-5 h-5 mb-3 text-red-400 relative z-10" />
            <p className="text-3xl font-light text-red-500 relative z-10">{stats.rejected}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-red-400 relative z-10">Rejected</p>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Status Filters */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Filter className="w-4 h-4 text-gray-400" />
              <div className="flex gap-1.5">
                {(['all', 'pending', 'approved', 'rejected'] as FilterStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all duration-300 ${
                      filterStatus === status
                        ? 'bg-[#111111] text-white shadow-md'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {status}
                    {status !== 'all' && (
                      <span className="ml-1.5 opacity-60">
                        ({status === 'pending' ? stats.pending : status === 'approved' ? stats.approved : stats.rejected})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex gap-2 w-full lg:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F8F8F6] border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#6B8E23] focus:shadow-[0_0_0_3px_rgba(107,142,35,0.08)] transition-all"
                  placeholder="Search by name, email, or business..."
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#111111] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#6B8E23] transition-all flex-shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm flex items-center gap-3">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Sellers List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#6B8E23] mx-auto mb-4" />
              <p className="text-sm text-gray-400 font-light">Loading seller data...</p>
            </div>
          </div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <Users className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-light text-[#111111] mb-2">No Sellers Found</h3>
            <p className="text-gray-400 text-sm font-light">
              {filterStatus !== 'all'
                ? `No ${filterStatus} sellers at the moment.`
                : 'No seller registrations yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sellers.map((seller, index) => (
              (() => {
                const orderStats = getSellerOrderStats(seller._id);
                return (
              <div
                key={seller._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Main Row */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Seller Identity */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-[#6B8E23]/20 to-[#6B8E23]/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="text-[#6B8E23] font-bold text-sm">
                          {seller.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                          <h3 className="text-base font-medium text-[#111111]">{seller.name}</h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadgeStyle(seller.status)}`}
                          >
                            {statusIcon(seller.status)}
                            {seller.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                          <Building2 className="w-3.5 h-3.5 text-gray-400" />
                          {seller.businessName}
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3" />
                            {seller.email}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3" />
                            {seller.phone}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            {new Date(seller.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
                          <span className="px-2 py-1 rounded-full bg-gray-50 text-gray-500 font-bold">
                            Orders: {orderStats.totalOrders}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-gray-50 text-gray-500 font-bold">
                            Units: {orderStats.totalUnits}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-gray-50 text-gray-500 font-bold">
                            Value: ₹{orderStats.totalAmount.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* View Details */}
                      <button
                        onClick={() => navigate(`/admin/seller/${seller._id}`)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-100 transition-all border border-gray-100"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View Details</span>
                      </button>

                      {/* Expand/Collapse */}
                      <button
                        onClick={() => toggleExpand(seller._id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-100 transition-all border border-gray-100"
                      >
                        {expandedSeller === seller._id ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Approve */}
                      {seller.status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(seller._id)}
                          disabled={actionLoading === seller._id}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-sm hover:shadow-md hover:shadow-emerald-100"
                        >
                          {actionLoading === seller._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5" />
                          )}
                          Approve
                        </button>
                      )}

                      {/* Reject */}
                      {seller.status !== 'rejected' && (
                        <button
                          onClick={() => handleReject(seller._id)}
                          disabled={actionLoading === seller._id}
                          className="flex items-center gap-1.5 px-4 py-2 bg-white text-red-500 border border-red-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-50 transition-all disabled:opacity-50"
                        >
                          {actionLoading === seller._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedSeller === seller._id && (
                  <div className="border-t border-gray-50 bg-[#FAFAF9] p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <DetailItem
                        icon={<Building2 className="w-4 h-4 text-[#6B8E23]" />}
                        label="Business Name"
                        value={seller.businessName}
                      />
                      <DetailItem
                        icon={<Hash className="w-4 h-4 text-[#6B8E23]" />}
                        label="GST Number"
                        value={seller.gstNumber || 'Not provided'}
                        muted={!seller.gstNumber}
                      />
                      <DetailItem
                        icon={<ShoppingBag className="w-4 h-4 text-[#6B8E23]" />}
                        label="Category"
                        value={seller.businessType}
                      />
                      <DetailItem
                        icon={<Mail className="w-4 h-4 text-[#6B8E23]" />}
                        label="Email Address"
                        value={seller.email}
                      />
                      <DetailItem
                        icon={<Phone className="w-4 h-4 text-[#6B8E23]" />}
                        label="Phone Number"
                        value={seller.phone}
                      />
                      <DetailItem
                        icon={<Calendar className="w-4 h-4 text-[#6B8E23]" />}
                        label="Registered On"
                        value={new Date(seller.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      />
                      <DetailItem
                        icon={<ShoppingBag className="w-4 h-4 text-[#6B8E23]" />}
                        label="Total Orders"
                        value={`${orderStats.totalOrders}`}
                      />
                      <DetailItem
                        icon={<Package className="w-4 h-4 text-[#6B8E23]" />}
                        label="Total Units Ordered"
                        value={`${orderStats.totalUnits} units`}
                      />
                      <DetailItem
                        icon={<TrendingUp className="w-4 h-4 text-[#6B8E23]" />}
                        label="Total Order Value"
                        value={`₹${orderStats.totalAmount.toFixed(2)}`}
                      />
                      <DetailItem
                        icon={<Clock className="w-4 h-4 text-[#6B8E23]" />}
                        label="Last Order"
                        value={
                          orderStats.lastOrderAt
                            ? new Date(orderStats.lastOrderAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })
                            : 'No orders yet'
                        }
                        muted={!orderStats.lastOrderAt}
                      />
                      <div className="md:col-span-2 lg:col-span-3">
                        <DetailItem
                          icon={<MapPin className="w-4 h-4 text-[#6B8E23]" />}
                          label="Business Address"
                          value={`${seller.addressLine1}${seller.addressLine2 ? ', ' + seller.addressLine2 : ''}, ${seller.city}, ${seller.district}, ${seller.state} - ${seller.pincode}`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
                );
              })()
            ))}
          </div>
        )}
      </>
    )}

        {activeTab === 'orders' && (
          <div className="mt-0">
          <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#111111]">
                Orders <span className="font-serif italic text-gray-400">Management</span>
              </h2>
              <p className="text-sm text-gray-400 font-light">Admin access to all seller orders and status control</p>
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111111] text-white text-[10px] uppercase tracking-widest font-bold">
              <ShoppingBag className="w-3.5 h-3.5" />
              {orders.length} Orders
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex gap-1.5 flex-wrap">
                {(['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderFilterStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatus(status)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all duration-300 ${
                      orderStatus === status
                        ? 'bg-[#111111] text-white shadow-md'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <form onSubmit={handleOrderSearch} className="flex-1 flex gap-2 w-full lg:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-[#F8F8F6] border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#6B8E23] focus:shadow-[0_0_0_3px_rgba(107,142,35,0.08)] transition-all"
                    placeholder="Search by seller name, email, or business..."
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#111111] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#6B8E23] transition-all flex-shrink-0"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {ordersLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <Loader2 className="w-7 h-7 animate-spin text-[#6B8E23] mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-light">Loading all orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <h3 className="text-lg font-light text-[#111111] mb-1">No Orders Found</h3>
              <p className="text-sm text-gray-400 font-light">No matching orders for current filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${orderBadgeStyle(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#111111] font-medium">{order.seller?.name || 'Unknown Seller'} • {order.seller?.businessName || 'N/A'}</p>
                      <button
                        onClick={() => handleOpenSellerProfileFromOrder(order.seller?._id)}
                        className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-100 bg-gray-50 text-[10px] uppercase tracking-wider font-bold text-gray-600 hover:bg-gray-100 hover:text-[#111111] transition-all"
                      >
                        <Eye className="w-3 h-3" />
                        View Seller Profile
                      </button>
                      <p className="text-xs text-gray-400">{order.seller?.email || 'N/A'}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                        {' • '}
                        {order.totalUnits} units
                        {' • '}
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value as OrderStatus)}
                        disabled={orderActionLoading === order._id}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:border-[#6B8E23] disabled:opacity-60"
                      >
                        {(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {orderActionLoading === order._id && <Loader2 className="w-4 h-4 animate-spin text-[#6B8E23]" />}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={`${item.productId}-${idx}`} className="flex items-center justify-between text-sm">
                        <p className="text-gray-600 truncate pr-3">{item.title} • {item.quantity} units</p>
                        <p className="text-[#111111] font-medium">₹{item.totalPrice.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {activeTab === 'products' && (
          <div className="mt-0">
            <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight text-[#111111]">
                  Product <span className="font-serif italic text-gray-400">Inventory</span>
                </h2>
                <p className="text-sm text-gray-400 font-light">Manage your wholesale product catalog, pricing, and visibility</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setBulkPriceData({ type: 'percentage', value: 0, action: 'increase' });
                    setIsBulkPriceModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-all shadow-sm"
                >
                  <Percent className="w-4 h-4" />
                  Bulk Price
                </button>
                <button
                  onClick={() => {
                    setEditingProduct({
                      title: '',
                      handle: '',
                      price: 0,
                      category: 'shampoo',
                      imageUrl: '',
                      description: '',
                      isActive: true,
                      moq: 5,
                      tags: [],
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#111111] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#6B8E23] transition-all shadow-lg shadow-black/5"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>
            </div>

            {/* Product Filters */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="flex gap-2 flex-wrap">
                  {(['all', 'shampoo', 'conditioner', 'oil', 'serum', 'kit']).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProductCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                        productCategoryFilter === cat ? 'bg-[#111111] text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative flex-1 w-full lg:w-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-[#F8F8F6] border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-[#6B8E23] transition-all"
                    placeholder="Search products by title or handle..."
                  />
                </div>
              </div>
            </div>

            {productsLoading ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <Loader2 className="w-8 h-8 animate-spin text-[#6B8E23] mx-auto mb-4" />
                <p className="text-sm text-gray-400">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <Package className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                <h3 className="text-lg font-light text-[#111111]">No Products Found</h3>
                <p className="text-gray-400 text-sm">Create your first product to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((p) => (
                  <div
                    key={p._id}
                    className={`bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-[#111]/5 transition-all duration-300 group ${!p.isActive ? 'opacity-70 grayscale-[0.5]' : ''}`}
                  >
                    <div className="relative aspect-square bg-[#F8F8F6] overflow-hidden">
                      {p.imageUrl ? (
                        <img 
                          src={p.imageUrl.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${p.imageUrl}` : p.imageUrl} 
                          alt={p.title} 
                          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <Package className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className="px-2 py-1 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-lg text-[9px] font-bold uppercase tracking-wider text-gray-600 shadow-sm">
                          {p.category}
                        </span>
                        {!p.isActive && (
                          <span className="px-2 py-1 bg-red-500 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider shadow-sm">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsProductModalOpen(true);
                            }}
                            className="p-2.5 bg-white text-[#111111] rounded-xl shadow-lg border border-gray-100 hover:text-[#6B8E23] transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            disabled={productActionLoading === p._id}
                            className={`p-2.5 bg-white rounded-xl shadow-lg border border-gray-100 transition-colors ${p.isActive ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                          >
                            {productActionLoading === p._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-sm font-medium text-[#111111] truncate pr-2 group-hover:text-[#6B8E23] transition-colors">
                          {p.title}
                        </h3>
                        <p className="text-sm font-bold text-[#111111]">₹{p.price}</p>
                      </div>

                      {/* Pricing Tiers Preview */}
                      {p.bulkPricing && p.bulkPricing.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {p.bulkPricing.map((tier, idx) => (
                            <div 
                              key={idx}
                              className="px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100 flex items-center gap-1"
                            >
                              <span className="text-[7px] font-bold text-gray-400">{tier.minQty} units →</span>
                              <span className="text-[8px] font-bold text-[#6B8E23]">₹{(tier.price * tier.minQty).toFixed(0)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-3">
                        {p.handle}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                        <span className="text-[10px] font-bold text-gray-400 tracking-wider">MOQ: {p.moq}</span>
                        <span className="text-[10px] font-bold text-gray-400 tracking-wider">TIERS: {p.bulkPricing?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-medium text-[#111111]">{editingProduct._id ? 'Edit Product' : 'Add New Product'}</h2>
                <p className="text-xs text-gray-400">Enter product details and pricing</p>
              </div>
              <button onClick={() => setIsProductModalOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrUpdateProduct} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Product Title</label>
                  <input
                    required
                    type="text"
                    value={editingProduct.title || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
                    className="w-full bg-[#F8F8F6] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#6B8E23] outline-none transition-all"
                    placeholder="e.g. Neem & Aloe Hair Cleanser"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Handle (Slug)</label>
                  <input
                    required
                    type="text"
                    value={editingProduct.handle || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, handle: e.target.value.toLowerCase().replace(/ /g, '-')})}
                    className="w-full bg-[#F8F8F6] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#6B8E23] outline-none transition-all"
                    placeholder="e.g. neem-hair-cleanser"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Category</label>
                  <select
                    value={editingProduct.category || 'shampoo'}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value as any})}
                    className="w-full bg-[#F8F8F6] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#6B8E23] outline-none transition-all"
                  >
                    <option value="shampoo">Shampoo</option>
                    <option value="conditioner">Conditioner</option>
                    <option value="oil">Oil</option>
                    <option value="serum">Serum</option>
                    <option value="kit">Kit</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Base Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                    className="w-full bg-[#F8F8F6] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#6B8E23] outline-none transition-all"
                  />
                </div>

                {/* Bulk Pricing Tiers Editor */}
                <div className="space-y-4 col-span-1 md:col-span-2 p-4 md:p-6 bg-[#F8F8F6] rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Wholesale Pricing Tiers</label>
                      <p className="text-[9px] text-gray-400">Show price per pack to sellers (e.g. 3 units for ₹957)</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        const tiers = [...(editingProduct.bulkPricing || [])];
                        tiers.push({ minQty: 10, maxQty: null, price: editingProduct.price || 0, label: 'Bulk Tier' });
                        setEditingProduct({...editingProduct, bulkPricing: tiers});
                      }}
                      className="text-[9px] font-bold text-[#6B8E23] uppercase tracking-widest flex items-center gap-1 hover:text-[#111] transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Add Tier
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {(!editingProduct.bulkPricing || editingProduct.bulkPricing.length === 0) ? (
                      <p className="text-[10px] text-gray-400 italic">No bulk tiers defined. Base price applies to all orders.</p>
                    ) : (
                      editingProduct.bulkPricing.map((tier, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative group transition-all">
                          <div className="grid grid-cols-2 sm:flex-1 gap-4">
                            <div className="space-y-1">
                              <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">Min Qty</span>
                              <input 
                                type="number" 
                                value={tier.minQty} 
                                onChange={(e) => {
                                  const tiers = [...editingProduct.bulkPricing];
                                  tiers[idx].minQty = Number(e.target.value);
                                  setEditingProduct({...editingProduct, bulkPricing: tiers});
                                }}
                                className="w-full text-xs font-medium border border-gray-50 rounded bg-gray-50/30 p-1.5 focus:ring-1 focus:ring-[#6B8E23]/20"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">Unit Price (₹)</span>
                              <input 
                                type="number" 
                                value={tier.price} 
                                onChange={(e) => {
                                  const tiers = [...editingProduct.bulkPricing];
                                  tiers[idx].price = Number(e.target.value);
                                  setEditingProduct({...editingProduct, bulkPricing: tiers});
                                }}
                                className="w-full text-xs font-bold text-[#6B8E23] border border-gray-50 rounded bg-gray-50/30 p-1.5 focus:ring-1 focus:ring-[#6B8E23]/20"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-1 flex-1">
                            <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">Pill Label</span>
                            <div className="flex items-center gap-3">
                              <input 
                                type="text" 
                                value={tier.label || ''} 
                                onChange={(e) => {
                                  const tiers = [...editingProduct.bulkPricing];
                                  tiers[idx].label = e.target.value;
                                  setEditingProduct({...editingProduct, bulkPricing: tiers});
                                }}
                                className="w-full text-xs font-medium border border-gray-50 rounded bg-gray-50/30 p-1.5 focus:ring-1 focus:ring-[#6B8E23]/20"
                                placeholder="e.g. Kit x 03 Nos"
                              />
                              <button 
                                type="button" 
                                onClick={() => {
                                  const tiers = editingProduct.bulkPricing.filter((_, i) => i !== idx);
                                  setEditingProduct({...editingProduct, bulkPricing: tiers});
                                }}
                                className="p-2.5 text-red-300 hover:text-white hover:bg-red-500 rounded-lg transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Product Image</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 h-32 md:h-40 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#6B8E23] hover:bg-[#6B8E23]/5 transition-all group relative overflow-hidden"
                    >
                      {editingProduct.imageUrl ? (
                        <>
                          <img 
                            src={editingProduct.imageUrl.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${editingProduct.imageUrl}` : editingProduct.imageUrl} 
                            alt="Preview" 
                            className="absolute inset-0 w-full h-full object-contain p-2 opacity-100 group-hover:scale-105 transition-all" 
                          />
                          <div className="relative flex flex-col items-center bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                            <ImageIcon className="w-4 h-4 text-[#6B8E23]" />
                            <span className="text-[8px] font-bold text-[#6B8E23] uppercase tracking-wider">Change Image</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className={`w-6 h-6 ${imageUploading ? 'animate-bounce text-[#6B8E23]' : 'text-gray-300'}`} />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                            {imageUploading ? 'Uploading...' : 'Click or Drag to Upload'}
                          </span>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center space-y-2">
                      <p className="text-[10px] text-gray-400 font-medium">Or paste image URL instead:</p>
                      <input
                        type="text"
                        value={editingProduct.imageUrl || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, imageUrl: e.target.value})}
                        className="w-full bg-[#F8F8F6] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#6B8E23] outline-none transition-all"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Minimum Order Qty</label>
                  <input
                    type="number"
                    value={editingProduct.moq || 5}
                    onChange={(e) => setEditingProduct({...editingProduct, moq: Number(e.target.value)})}
                    className="w-full bg-[#F8F8F6] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#6B8E23] outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Product Subtitle / Benefit</label>
                <input
                  type="text"
                  value={editingProduct.subtitle || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, subtitle: e.target.value, benefit: e.target.value})}
                  className="w-full bg-[#F8F8F6] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#6B8E23] outline-none transition-all"
                  placeholder="e.g. Strengthens hair roots from within"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Full Description</label>
                <textarea
                  rows={4}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="w-full bg-[#F8F8F6] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#6B8E23] outline-none transition-all resize-none"
                  placeholder="Detailed product information..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveForm"
                  checked={editingProduct.isActive !== false}
                  onChange={(e) => setEditingProduct({...editingProduct, isActive: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300 text-[#6B8E23] focus:ring-[#6B8E23]"
                />
                <label htmlFor="isActiveForm" className="text-sm text-gray-600 font-medium">Product is active and visible to sellers</label>
              </div>

              <div className="pt-6 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={productActionLoading === 'modal'}
                  className="flex-[2] py-3 bg-[#111111] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#6B8E23] transition-all disabled:opacity-50"
                >
                  {productActionLoading === 'modal' ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (editingProduct._id ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Price Adjustment Modal */}
      {isBulkPriceModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsBulkPriceModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-medium text-[#111111]">Bulk Price Adjustment</h2>
                <p className="text-xs text-gray-400">Update prices for all products at once</p>
              </div>
              <button onClick={() => setIsBulkPriceModalOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleBulkPriceUpdate} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Action</label>
                  <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button
                      type="button"
                      onClick={() => setBulkPriceData({...bulkPriceData, action: 'increase'})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${bulkPriceData.action === 'increase' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-500'}`}
                    >
                      Increase
                    </button>
                    <button
                      type="button"
                      onClick={() => setBulkPriceData({...bulkPriceData, action: 'decrease'})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${bulkPriceData.action === 'decrease' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500'}`}
                    >
                      Decrease
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Type</label>
                  <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button
                      type="button"
                      onClick={() => setBulkPriceData({...bulkPriceData, type: 'percentage'})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${bulkPriceData.type === 'percentage' ? 'bg-[#111111] text-white shadow-sm' : 'text-gray-500'}`}
                    >
                      %
                    </button>
                    <button
                      type="button"
                      onClick={() => setBulkPriceData({...bulkPriceData, type: 'fixed'})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${bulkPriceData.type === 'fixed' ? 'bg-[#111111] text-white shadow-sm' : 'text-gray-500'}`}
                    >
                      Fixed
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  Adjustment Value ({bulkPriceData.type === 'percentage' ? '%' : '₹'})
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={bulkPriceData.value}
                  onChange={(e) => setBulkPriceData({...bulkPriceData, value: Number(e.target.value)})}
                  className="w-full bg-[#F8F8F6] border border-gray-100 rounded-xl px-4 py-3 text-lg font-medium focus:border-[#6B8E23] outline-none transition-all"
                  placeholder="0.00"
                />
              </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Shield className="w-3 h-3" /> Warning
                </p>
                <p className="text-[11px] text-amber-600 leading-relaxed">
                  This will immediately update the base price and all bulk pricing tiers for every product in the database. This action cannot be easily undone.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsBulkPriceModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bulkPriceLoading}
                  className={`flex-[2] py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all disabled:opacity-50 shadow-lg shadow-black/5 ${bulkPriceData.action === 'increase' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {bulkPriceLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Apply to All Products'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        (() => {
          const orderStats = getSellerOrderStats(detailModal._id);
          return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDetailModal(null)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-8 py-5 flex items-center justify-between rounded-t-3xl z-10">
              <div>
                <h2 className="text-lg font-medium text-[#111111]">Seller Details</h2>
                <p className="text-xs text-gray-400">Complete registration information</p>
              </div>
              <button
                onClick={() => setDetailModal(null)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8">
              {/* Seller Profile Header */}
              <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-[#6B8E23] to-[#4a6318] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6B8E23]/20">
                  <span className="text-white font-bold text-xl">
                    {detailModal.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[#111111]">{detailModal.name}</h3>
                  <p className="text-sm text-gray-400">{detailModal.businessName}</p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadgeStyle(detailModal.status)}`}
                    >
                      {statusIcon(detailModal.status)}
                      {detailModal.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail Sections */}
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-[#6B8E23] rounded-full" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ModalDetailCard 
                      icon={<Users className="w-4 h-4" />} 
                      label="Full Name" 
                      value={`${detailModal.title} ${detailModal.firstName} ${detailModal.lastName}`} 
                    />
                    <ModalDetailCard icon={<Mail className="w-4 h-4" />} label="Email Address" value={detailModal.email} />
                    <ModalDetailCard icon={<Phone className="w-4 h-4" />} label="Mobile Number" value={detailModal.phone} />
                    <ModalDetailCard
                      icon={<Calendar className="w-4 h-4" />}
                      label="Registered On"
                      value={new Date(detailModal.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    />
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-[#111111] rounded-full" />
                    Business Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ModalDetailCard 
                      icon={<Building2 className="w-4 h-4" />} 
                      label="Business Name" 
                      value={detailModal.businessName || 'Not provided'} 
                      muted={!detailModal.businessName} 
                    />
                    <ModalDetailCard 
                      icon={<ShoppingBag className="w-4 h-4" />} 
                      label="Category" 
                      value={detailModal.businessType} 
                      highlight
                    />
                    <ModalDetailCard
                      icon={<FileText className="w-4 h-4" />}
                      label="GST Number"
                      value={detailModal.gstNumber || 'Not provided'}
                      muted={!detailModal.gstNumber}
                    />
                    <ModalDetailCard
                      icon={<Package className="w-4 h-4" />}
                      label="Account Type"
                      value={detailModal.role === 'admin' ? 'Administrator' : 'Seller Partner'}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-amber-400 rounded-full" />
                    Address Information
                  </h4>
                  <div className="bg-[#F8F8F6] rounded-xl p-6 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Line 1</p>
                        <p className="text-sm text-[#111111]">{detailModal.addressLine1}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Line 2 / Landmark</p>
                        <p className="text-sm text-[#111111]">{detailModal.addressLine2 || '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">City & District</p>
                        <p className="text-sm text-[#111111]">{detailModal.city}, {detailModal.district}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">State & Pincode</p>
                        <p className="text-sm text-[#111111] font-medium">{detailModal.state} - <span className="text-[#6B8E23]">{detailModal.pincode}</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Insights */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                    Order Insights
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ModalDetailCard
                      icon={<ShoppingBag className="w-4 h-4" />}
                      label="Total Orders"
                      value={`${orderStats.totalOrders}`}
                      highlight
                    />
                    <ModalDetailCard
                      icon={<Package className="w-4 h-4" />}
                      label="Total Units"
                      value={`${orderStats.totalUnits} units`}
                    />
                    <ModalDetailCard
                      icon={<TrendingUp className="w-4 h-4" />}
                      label="Total Order Value"
                      value={`₹${orderStats.totalAmount.toFixed(2)}`}
                    />
                    <ModalDetailCard
                      icon={<Clock className="w-4 h-4" />}
                      label="Latest Order"
                      value={
                        orderStats.lastOrderAt
                          ? new Date(orderStats.lastOrderAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'No orders yet'
                      }
                      muted={!orderStats.lastOrderAt}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                {detailModal.status !== 'approved' && (
                  <button
                    onClick={() => {
                      handleApprove(detailModal._id);
                      setDetailModal({ ...detailModal, status: 'approved' });
                    }}
                    disabled={actionLoading === detailModal._id}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Seller
                  </button>
                )}
                {detailModal.status !== 'rejected' && (
                  <button
                    onClick={() => {
                      handleReject(detailModal._id);
                      setDetailModal({ ...detailModal, status: 'rejected' });
                    }}
                    disabled={actionLoading === detailModal._id}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-500 border border-red-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Seller
                  </button>
                )}
                <button
                  onClick={() => setDetailModal(null)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
          );
        })()
      )}
    </section>
  );
};

/* ─── Sub-components ─── */

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, muted }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100 shadow-sm">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-0.5">{label}</p>
      <p className={`text-sm ${muted ? 'text-gray-300 italic' : 'text-[#111111]'}`}>{value}</p>
    </div>
  </div>
);

interface ModalDetailCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
  highlight?: boolean;
}

const ModalDetailCard: React.FC<ModalDetailCardProps> = ({ icon, label, value, muted, highlight }) => (
  <div className={`rounded-xl p-4 border ${highlight ? 'bg-[#6B8E23]/5 border-[#6B8E23]/15' : 'bg-[#F8F8F6] border-gray-100'}`}>
    <div className="flex items-center gap-2 mb-2">
      <span className={`${highlight ? 'text-[#6B8E23]' : 'text-gray-400'}`}>{icon}</span>
      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{label}</p>
    </div>
    <p className={`text-sm font-medium ${muted ? 'text-gray-300 italic' : highlight ? 'text-[#6B8E23]' : 'text-[#111111]'}`}>
      {value}
    </p>
  </div>
);

export default AdminPanel;
