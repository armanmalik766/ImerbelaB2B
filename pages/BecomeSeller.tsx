import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerSeller } from '../services/api';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, Building2, Eye, EyeOff, UserCheck } from 'lucide-react';

interface FormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  gstNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

const BecomeSeller: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    gstNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Surname is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required';
    } else if (!/^[+]?[\d\s()-]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid mobile number';
    }
    if (!formData.businessType) newErrors.businessType = 'Please select business type';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const element = document.getElementsByName(firstError)[0];
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      await registerSeller({
        title: formData.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName,
        businessType: formData.businessType,
        gstNumber: formData.gstNumber,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode,
        password: formData.password,
      });
      setIsSuccess(true);
    } catch (error: any) {
      setServerError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State
  if (isSuccess) {
    return (
      <section className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-4 py-24">
        <div className="max-w-lg w-full text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white p-12 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
            <div className="w-20 h-20 mx-auto mb-8 bg-[#6B8E23]/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[#6B8E23]" />
            </div>
            <h2 className="text-3xl font-light tracking-tight text-[#111111] mb-4">
              Application <span className="font-serif italic text-gray-400">Submitted</span>
            </h2>
            <p className="text-gray-500 font-light leading-relaxed mb-3">
              Thank you for your interest in partnering with IMERBELA.
            </p>
            <div className="bg-[#F5F5F7] rounded-lg p-4 mb-8">
              <p className="text-sm text-[#111111] font-medium">
                ⏳ Your application is under review
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Our team will review your application and get back to you within 24–48 hours.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="flex-1 inline-block bg-[#111111] text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#6B8E23] transition-all rounded-lg text-center"
              >
                Back to Home
              </Link>
              <Link
                to="/seller-login"
                className="flex-1 inline-block border border-gray-200 text-[#111111] py-4 text-xs font-bold tracking-[0.2em] uppercase hover:border-[#6B8E23] hover:text-[#6B8E23] transition-all rounded-lg text-center"
              >
                Seller Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Form input helper
  const inputClasses = (field: string) =>
    `w-full bg-white border ${
      errors[field] ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#6B8E23]'
    } rounded-lg py-3 px-4 text-sm outline-none transition-all duration-300 placeholder-gray-400 focus:shadow-[0_0_0_3px_rgba(107,142,35,0.08)]`;

  return (
    <section className="min-h-screen bg-[#FAFAF9] py-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-[#111111] transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Store
          </Link>
          <div className="w-14 h-14 mx-auto mb-6 bg-[#111111] rounded-full flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#111111] mb-4">
            Reseller <span className="font-serif italic text-gray-400">Registration</span>
          </h1>
          <p className="text-gray-500 font-light max-w-md mx-auto">
            Please provide your detailed information to join IMERBELA's B2B partnership program.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {serverError && (
            <div className="mb-8 flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Personal Details */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6 flex items-center gap-2">
                <div className="w-1 h-3 bg-[#6B8E23] rounded-full" />
                Personal Information
              </h3>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`${inputClasses('title')} appearance-none cursor-pointer`}
                    >
                      <option value="">Select</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                    </select>
                    {errors.title && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.title}</p>}
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                        First Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={inputClasses('firstName')}
                        placeholder="e.g. John"
                      />
                      {errors.firstName && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                        Surname <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={inputClasses('lastName')}
                        placeholder="e.g. Doe"
                      />
                      {errors.lastName && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.lastName}</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                      Email ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClasses('email')}
                      placeholder="email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                      Mobile Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClasses('phone')}
                      placeholder="+91 00000 00000"
                    />
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Business details */}
            <div className="pt-4">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6 flex items-center gap-2">
                <div className="w-1 h-3 bg-[#111111] rounded-full" />
                Business details
              </h3>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                      Business Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className={inputClasses('businessName')}
                      placeholder="Legal Entity Name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                      GST Number <span className="text-gray-300 font-normal ml-1">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      className={inputClasses('gstNumber')}
                      placeholder="GSTIN"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                    Option / Business Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className={`${inputClasses('businessType')} appearance-none cursor-pointer`}
                  >
                    <option value="">Select Category</option>
                    <option value="Home Seller">Home Seller</option>
                    <option value="Salon">Salon</option>
                    <option value="Beauty Parlour">Beauty Parlour</option>
                    <option value="Shop">Shop</option>
                  </select>
                  {errors.businessType && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.businessType}</p>}
                </div>
              </div>
            </div>

            {/* Section 3: Detailed Address */}
            <div className="pt-4">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6 flex items-center gap-2">
                <div className="w-1 h-3 bg-amber-400 rounded-full" />
                Residence / Shop Address
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                    Address Line 1 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className={inputClasses('addressLine1')}
                    placeholder="House No., Building Name, Street"
                  />
                  {errors.addressLine1 && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.addressLine1}</p>}
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                    Address Line 2 <span className="text-gray-300 font-normal ml-1">(Landmark / Area)</span>
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className={inputClasses('addressLine2')}
                    placeholder="Near, Colony, Sector"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                      City <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={inputClasses('city')}
                      placeholder="Town / City"
                    />
                    {errors.city && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                      District <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className={inputClasses('district')}
                      placeholder="District"
                    />
                    {errors.district && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.district}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                      State <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={inputClasses('state')}
                      placeholder="State"
                    />
                    {errors.state && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">
                      Pincode <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      maxLength={6}
                      className={inputClasses('pincode')}
                      placeholder="6-digit Area PIN"
                    />
                    {errors.pincode && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Security */}
            <div className="pt-4">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6 flex items-center gap-2">
                <div className="w-1 h-3 bg-red-400 rounded-full" />
                Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">Create Password <span className="text-red-400">*</span></span>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${inputClasses('password')} pr-10`}
                      placeholder="Min. 6 chars"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.password}</p>}
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 ml-1">Confirm Password <span className="text-red-400">*</span></span>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`${inputClasses('confirmPassword')} pr-10`}
                      placeholder="Repeat password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#111111] text-white py-4.5 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#6B8E23] transition-all rounded-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-black/5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Create Partner Account'
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Already have an account?{' '}
              <Link to="/seller-login" className="text-[#6B8E23] hover:underline font-bold">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BecomeSeller;
