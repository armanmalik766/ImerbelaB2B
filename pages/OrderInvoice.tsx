import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, PlacedOrder } from '../services/api';
import { Printer, Download, ArrowLeft, Loader2, Package } from 'lucide-react';

const OrderInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(id);
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setError('Order not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#6B8E23] mx-auto mb-4" />
          <p className="text-gray-500">Generating invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-500 mb-6">{error || 'Something went wrong'}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-[#111111] text-white rounded-lg text-sm font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const taxRate = 0.05; // 5% GST
  const subtotal = order.totalAmount;
  const shipping = 0; // Currently hardcoded as 0 in DB
  const totalWithTax = subtotal + shipping;
  
  // Back-calculate tax-exclusive amount for the table
  // Amount = Basic + Tax => Amount = Basic * (1 + rate) => Basic = Amount / (1 + rate)
  const calculateBasicAmount = (amount: number) => amount / (1 + taxRate);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white print-container">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide everything by default */
          body * {
            visibility: hidden;
          }
          /* Show only the invoice container and its children */
          .print-container, .print-container * {
            visibility: visible;
          }
          /* Position the invoice container at the top left */
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Hide the action bar inside the container */
          .action-bar {
            display: none !important;
          }
          /* Hide navigation and footers explicitly just in case */
          nav, footer, .navbar, .footer {
            display: none !important;
          }

          /* SINGLE PAGE OPTIMIZATIONS */
          @page {
            size: A4;
            margin: 1cm;
          }
          .invoice-doc {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          h1 { font-size: 24pt !important; margin-bottom: 5pt !important; }
          .section-header { margin-bottom: 15pt !important; }
          .info-grid { margin-bottom: 15pt !important; gap: 20pt !important; }
          .items-table { margin-bottom: 15pt !important; }
          .items-table th, .items-table td { padding-top: 5pt !important; padding-bottom: 5pt !important; }
          .calculation-section { margin-top: 10pt !important; }
          .words-box { padding: 10pt !important; }
          .footer-bar { padding: 10pt !important; margin-top: 20pt !important; }
          
          /* Prevent page breaks inside key elements */
          table, tr, .calculation-section {
            page-break-inside: avoid;
          }
        }
      ` }} />
      {/* Action Bar - Hidden during print */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden action-bar">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden print:shadow-none print:rounded-none invoice-doc">
        <div className="p-8 sm:p-12 print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-12 gap-8 section-header">
            <div>
              <h1 className="text-4xl font-light text-[#111111] mb-2 tracking-tight">Invoice</h1>
              <div className="flex items-center gap-2 text-[#6B8E23] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#6B8E23] animate-pulse"></span>
                Official Transaction Record
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Order Number</p>
              <p className="text-xl font-mono font-bold text-[#111111]">#{order._id.slice(-8).toUpperCase()}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Invoice Date</p>
                <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 info-grid">
            {/* Seller Info */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-gray-100">Sold By</h3>
              <div className="space-y-1">
                <p className="font-bold text-[#111111] text-lg">IMERBELA ORGANICS</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  512-B, Chetak Centre, 12/2,<br />
                  R.N.T. Marg, Indore,<br />
                  Madhya Pradesh, 452001<br />
                  India
                </p>
                <div className="mt-4 pt-4 space-y-1">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">GSTIN</p>
                  <p className="text-xs text-gray-600 font-mono">23AABCE9625K1ZJ</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mt-2">PAN</p>
                  <p className="text-xs text-gray-600 font-mono uppercase">AABCE9625K</p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="md:text-right">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-gray-100 md:border-r-0">Bill To</h3>
              <div className="space-y-1">
                <p className="font-bold text-[#111111] text-lg">{order.shippingAddress.name}</p>
                {order.shippingAddress.businessName && (
                  <p className="text-sm font-medium text-gray-700">{order.shippingAddress.businessName}</p>
                )}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                  India
                </p>
                <div className="mt-4 pt-4 space-y-1">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Phone</p>
                  <p className="text-xs text-gray-600">{order.shippingAddress.phone}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mt-2">Email</p>
                  <p className="text-xs text-gray-600">{order.shippingAddress.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-12 overflow-x-auto items-table">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#111111]">
                  <th className="py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 w-12">#</th>
                  <th className="py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Description</th>
                  <th className="py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Unit Price</th>
                  <th className="py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-center">Qty</th>
                  <th className="py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Basic Amt</th>
                  <th className="py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Tax (5%)</th>
                  <th className="py-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item, idx) => {
                  const basicAmount = calculateBasicAmount(item.totalPrice);
                  const taxAmount = item.totalPrice - basicAmount;
                  return (
                    <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-sm text-gray-400 font-mono">{(idx + 1).toString().padStart(2, '0')}</td>
                      <td className="py-4">
                        <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase tracking-tighter">SKU: {item.handle}</p>
                      </td>
                      <td className="py-4 text-sm text-gray-600 text-right">₹{item.unitPrice.toFixed(2)}</td>
                      <td className="py-4 text-sm text-[#111111] text-center font-medium">{item.quantity}</td>
                      <td className="py-4 text-sm text-gray-600 text-right">₹{basicAmount.toFixed(2)}</td>
                      <td className="py-4 text-sm text-gray-600 text-right">₹{taxAmount.toFixed(2)}</td>
                      <td className="py-4 text-sm font-bold text-[#111111] text-right">₹{item.totalPrice.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Calculation */}
          <div className="flex flex-col sm:flex-row justify-between gap-12 calculation-section">
            <div className="flex-1 space-y-6">
              <div className="bg-[#F8F8F6] p-6 rounded-xl border border-gray-100 words-box">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Amount in words</p>
                <p className="text-sm text-[#111111] font-serif italic">
                  {numberToWords(Math.round(totalWithTax))} Rupees Only
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-medium italic">
                  * This is a computer-generated invoice and does not require a physical signature.
                </p>
                <p className="text-[10px] text-gray-400 font-medium italic uppercase tracking-wider">
                  Subject to Indore Jurisdiction
                </p>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal (Basic)</span>
                <span>₹{calculateBasicAmount(order.totalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>GST (5%)</span>
                <span>₹{(order.totalAmount - calculateBasicAmount(order.totalAmount)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 pb-3 border-b border-gray-100">
                <span>Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#111111]">Total Amount</span>
                <div className="text-right">
                  <p className="text-2xl font-light text-[#6B8E23] leading-none">₹{totalWithTax.toFixed(2)}</p>
                  <p className="text-[10px] text-gray-400 uppercase mt-1">Net Payable</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#111111] p-6 text-center footer-bar">
          <p className="text-white text-[10px] uppercase tracking-[0.4em] font-bold">
            Order online: <span className="text-[#6B8E23]">www.imerbela.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple number to words helper (limited for demo/UI)
function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num === 0) return 'Zero';

  const convertLessThanThousand = (n: number): string => {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      str += teens[n - 10] + ' ';
      return str;
    }
    if (n > 0) {
      str += ones[n] + ' ';
    }
    return str;
  };

  let res = '';
  if (num >= 1000) {
    res += convertLessThanThousand(Math.floor(num / 1000)) + 'Thousand ';
    num %= 1000;
  }
  res += convertLessThanThousand(num);
  return res.trim();
}

export default OrderInvoice;
