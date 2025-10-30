'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Step = 1 | 2 | 3 | 4;

interface FormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    storeName: string;
    subdomain: string;
    businessType: string;
    country: string;
    plan: 'trial' | 'basic' | 'professional';
    agreedToTerms: boolean;
}

export default function SignupPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        storeName: '',
        subdomain: '',
        businessType: 'fashion',
        country: 'LK',
        plan: 'trial',
        agreedToTerms: false,
    });

    const businessTypes = [
        { value: 'fashion', label: '👗 Fashion', icon: '👗' },
        { value: 'electronics', label: '💻 Electronics', icon: '💻' },
        { value: 'food', label: '🍕 Food & Beverage', icon: '🍕' },
        { value: 'health', label: '💄 Health & Beauty', icon: '💄' },
        { value: 'books', label: '📚 Books & Media', icon: '📚' },
        { value: 'other', label: '🛍️ Other', icon: '🛍️' },
    ];

    const countries = [
        { value: 'LK', label: 'Sri Lanka 🇱🇰' },
        { value: 'IN', label: 'India 🇮🇳' },
        { value: 'PK', label: 'Pakistan 🇵🇰' },
        { value: 'BD', label: 'Bangladesh 🇧🇩' },
    ];

    const plans = [
        {
            id: 'trial',
            name: 'Free Trial',
            price: 'Free',
            duration: '14 days',
            features: ['100 products', '1 user', 'All basic features', 'Email support'],
            popular: true,
            color: 'from-green-500 to-emerald-600',
        },
        {
            id: 'basic',
            name: 'Basic',
            price: 'LKR 1,000',
            duration: 'per month',
            features: ['100 products', '1 user', 'Basic analytics', 'Email support'],
            popular: false,
            color: 'from-blue-500 to-cyan-600',
        },
        {
            id: 'professional',
            name: 'Professional',
            price: 'LKR 2,500',
            duration: 'per month',
            features: ['Unlimited products', '5 users', 'Advanced analytics', 'Priority support'],
            popular: false,
            color: 'from-violet-500 to-purple-600',
        },
    ];

    const checkSubdomainAvailability = async (subdomain: string) => {
        if (subdomain.length < 3) {
            setSubdomainAvailable(null);
            return;
        }

        setTimeout(() => {
            const reserved = ['admin', 'api', 'www', 'app'];
            setSubdomainAvailable(!reserved.includes(subdomain.toLowerCase()));
        }, 500);
    };

    const validateStep = (step: Step): boolean => {
        setError('');

        switch (step) {
            case 1:
                if (!formData.fullName || formData.fullName.length < 2) {
                    setError('Full name must be at least 2 characters');
                    return false;
                }
                if (!formData.email.includes('@')) {
                    setError('Please enter a valid email address');
                    return false;
                }
                if (formData.password.length < 8) {
                    setError('Password must be at least 8 characters');
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    return false;
                }
                return true;

            case 2:
                if (!formData.storeName || formData.storeName.length < 2) {
                    setError('Store name must be at least 2 characters');
                    return false;
                }
                if (!formData.subdomain || formData.subdomain.length < 3) {
                    setError('Subdomain must be at least 3 characters');
                    return false;
                }
                if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
                    setError('Subdomain can only contain lowercase letters, numbers, and hyphens');
                    return false;
                }
                if (subdomainAvailable === false) {
                    setError('This subdomain is not available');
                    return false;
                }
                return true;

            case 3:
                return true;

            case 4:
                if (!formData.agreedToTerms) {
                    setError('You must agree to the Terms of Service and Privacy Policy');
                    return false;
                }
                return true;

            default:
                return false;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(4, prev + 1) as Step);
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(1, prev - 1) as Step);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep(4)) return;

        setLoading(true);
        setError('');

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        store_name: formData.storeName,
                        subdomain: formData.subdomain,
                        business_type: formData.businessType,
                        country: formData.country,
                        plan: formData.plan,
                    },
                },
            });

            if (authError) throw authError;

            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    const getProgressPercentage = () => (currentStep / 4) * 100;

    const steps = [
        { number: 1, title: 'Account', icon: '👤' },
        { number: 2, title: 'Store', icon: '🏪' },
        { number: 3, title: 'Plan', icon: '💎' },
        { number: 4, title: 'Review', icon: '✓' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="w-full max-w-2xl py-8">
                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center space-x-2 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white text-2xl font-bold">K</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">Koop</span>
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-900">Create your store</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            {steps.map((step, index) => (
                                <div key={step.number} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all ${
                                            currentStep >= step.number
                                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg'
                                                : 'bg-white text-gray-400 border-2 border-gray-200'
                                        }`}>
                                            {step.icon}
                                        </div>
                                        <span className={`mt-2 text-xs font-medium ${
                                            currentStep >= step.number ? 'text-indigo-600' : 'text-gray-400'
                                        }`}>
                      {step.title}
                    </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="flex-1 h-1 mx-2 rounded-full bg-gray-200">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full transition-all duration-300"
                                                style={{ width: currentStep > step.number ? '100%' : '0%' }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Step 1: Account Information */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Let's start with your account</h3>

                                        <div className="space-y-5">
                                            <div>
                                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name
                                                </label>
                                                <input
                                                    id="fullName"
                                                    type="text"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    placeholder="john@example.com"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-10"
                                                        placeholder="At least 8 characters"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPassword ? (
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirm Password
                                                </label>
                                                <input
                                                    id="confirmPassword"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    placeholder="Re-enter your password"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Store Information */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Tell us about your store</h3>

                                        <div className="space-y-5">
                                            <div>
                                                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Store Name
                                                </label>
                                                <input
                                                    id="storeName"
                                                    type="text"
                                                    value={formData.storeName}
                                                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    placeholder="My Fashion Store"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Store URL
                                                </label>
                                                <div className="mt-1 flex rounded-xl shadow-sm">
                                                    <input
                                                        id="subdomain"
                                                        type="text"
                                                        value={formData.subdomain}
                                                        onChange={(e) => {
                                                            const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                                            setFormData({ ...formData, subdomain: value });
                                                            checkSubdomainAvailability(value);
                                                        }}
                                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                        placeholder="mystore"
                                                        required
                                                    />
                                                    <span className="inline-flex items-center px-4 rounded-r-xl border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            .koop.store
                          </span>
                                                </div>
                                                {subdomainAvailable === true && (
                                                    <p className="mt-2 text-sm text-green-600 flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        Available!
                                                    </p>
                                                )}
                                                {subdomainAvailable === false && (
                                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                        </svg>
                                                        Not available
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Business Type
                                                </label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {businessTypes.map((type) => (
                                                        <button
                                                            key={type.value}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, businessType: type.value })}
                                                            className={`px-4 py-3 text-left border-2 rounded-xl transition-all ${
                                                                formData.businessType === type.value
                                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                            }`}
                                                        >
                                                            <span className="text-xl mr-2">{type.icon}</span>
                                                            <span className="text-sm font-medium">{type.label.replace(type.icon + ' ', '')}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Country
                                                </label>
                                                <select
                                                    id="country"
                                                    value={formData.country}
                                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                >
                                                    {countries.map((country) => (
                                                        <option key={country.value} value={country.value}>
                                                            {country.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Plan Selection */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose your plan</h3>
                                        <p className="text-sm text-gray-600 mb-6">Start with a free trial, upgrade anytime</p>

                                        <div className="space-y-4">
                                            {plans.map((plan) => (
                                                <button
                                                    key={plan.id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, plan: plan.id as any })}
                                                    className={`relative w-full text-left p-6 border-2 rounded-2xl transition-all ${
                                                        formData.plan === plan.id
                                                            ? 'border-indigo-600 bg-indigo-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    {plan.popular && (
                                                        <span className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold rounded-full">
                              Most Popular
                            </span>
                                                    )}

                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center mb-3">
                                                                <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center text-white text-xl font-bold mr-4`}>
                                                                    {plan.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
                                                                    <p className="text-sm text-gray-500">{plan.duration}</p>
                                                                </div>
                                                            </div>

                                                            <div className="mb-4">
                                                                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                                                            </div>

                                                            <ul className="space-y-2">
                                                                {plan.features.map((feature, index) => (
                                                                    <li key={index} className="flex items-center text-sm text-gray-600">
                                                                        <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                        {feature}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <div className="ml-4">
                                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                                formData.plan === plan.id
                                                                    ? 'border-indigo-600 bg-indigo-600'
                                                                    : 'border-gray-300'
                                                            }`}>
                                                                {formData.plan === plan.id && (
                                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Review & Confirm */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Review your information</h3>

                                        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 space-y-4 mb-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Account</p>
                                                    <p className="font-semibold text-gray-900">{formData.fullName}</p>
                                                    <p className="text-sm text-gray-600">{formData.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Store</p>
                                                    <p className="font-semibold text-gray-900">{formData.storeName}</p>
                                                    <p className="text-sm text-indigo-600">{formData.subdomain}.koop.store</p>
                                                </div>
                                            </div>

                                            <div className="border-t border-indigo-200 pt-4">
                                                <p className="text-sm text-gray-600 mb-1">Selected Plan</p>
                                                <p className="font-semibold text-gray-900">
                                                    {plans.find(p => p.id === formData.plan)?.name} - {plans.find(p => p.id === formData.plan)?.price}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="border-2 border-gray-200 rounded-xl p-4">
                                            <label className="flex items-start cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.agreedToTerms}
                                                    onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                                                    className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <span className="ml-3 text-sm text-gray-700">
                          I agree to the{' '}
                                                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Terms of Service
                          </a>
                                                    {' '}and{' '}
                                                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Privacy Policy
                          </a>
                        </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                                        currentStep === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </button>

                                {currentStep < 4 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Continue
                                        <svg className="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading || !formData.agreedToTerms}
                                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating your store...
                                            </>
                                        ) : (
                                            <>
                                                Create My Store
                                                <svg className="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right Side - Preview/Info */}
            <div className="hidden lg:block relative w-0 flex-1">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZ2LTZoNnYtNmgtNnYtNmg2di02aDZ2NmgtNnY2aDZ2NmgtNnY2aDZ2Nmg2djZoLTZ2Nmg2djZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>

                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className="max-w-md">
                            <div className="text-center text-white mb-12">
                                <h2 className="text-4xl font-bold mb-4">Join thousands of successful stores</h2>
                                <p className="text-xl text-indigo-100">
                                    Everything you need to start, run, and grow your online business
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mr-4">
                                            🚀
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold text-lg">Quick Setup</h3>
                                        </div>
                                    </div>
                                    <p className="text-indigo-100 text-sm">
                                        Get your store online in minutes, not days
                                    </p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mr-4">
                                            💳
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold text-lg">Local Payments</h3>
                                        </div>
                                    </div>
                                    <p className="text-indigo-100 text-sm">
                                        Accept LKR payments with integrated local gateways
                                    </p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mr-4">
                                            📊
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold text-lg">Analytics</h3>
                                        </div>
                                    </div>
                                    <p className="text-indigo-100 text-sm">
                                        Track saless, monitor growth, and make data-driven decisions
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}