'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation('auth');

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
        { value: 'fashion', label: 'Fashion' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'food', label: 'Food & Beverage' },
        { value: 'health', label: 'Health & Beauty' },
        { value: 'books', label: 'Books & Media' },
        { value: 'other', label: 'Other' },
    ];

    const countries = [
        { value: 'LK', label: 'Sri Lanka' },
        { value: 'IN', label: 'India' },
        { value: 'PK', label: 'Pakistan' },
        { value: 'BD', label: 'Bangladesh' },
    ];

    const plans = [
        {
            id: 'trial',
            name: 'Free Trial',
            price: 'Free',
            duration: '14 days',
            features: ['100 products', '1 user', 'All basic features', 'Email support'],
            popular: true,
        },
        {
            id: 'basic',
            name: 'Basic',
            price: 'LKR 1,000',
            duration: 'per month',
            features: ['100 products', '1 user', 'Basic analytics', 'Email support'],
            popular: false,
        },
        {
            id: 'professional',
            name: 'Professional',
            price: 'LKR 2,500',
            duration: 'per month',
            features: ['Unlimited products', '5 users', 'Advanced analytics', 'Priority support'],
            popular: false,
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
                    setError(t('signup.validation.fullName'));
                    return false;
                }
                if (!formData.email.includes('@')) {
                    setError(t('signup.validation.email'));
                    return false;
                }
                if (formData.password.length < 8) {
                    setError(t('signup.validation.password'));
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    setError(t('signup.validation.passwordMatch'));
                    return false;
                }
                return true;
            case 2:
                if (!formData.storeName || formData.storeName.length < 2) {
                    setError(t('signup.validation.storeName'));
                    return false;
                }
                if (!formData.subdomain || formData.subdomain.length < 3) {
                    setError(t('signup.validation.subdomain'));
                    return false;
                }
                if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
                    setError(t('signup.validation.subdomainChars'));
                    return false;
                }
                if (subdomainAvailable === false) {
                    setError(t('signup.validation.subdomainTaken'));
                    return false;
                }
                return true;
            case 3:
                return true;
            case 4:
                if (!formData.agreedToTerms) {
                    setError(t('signup.validation.terms'));
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
            const { error: authError } = await supabase.auth.signUp({
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
            setError(err.message || t('signup.errorGeneric'));
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, title: t('signup.steps.1') },
        { number: 2, title: t('signup.steps.2') },
        { number: 3, title: t('signup.steps.3') },
        { number: 4, title: t('signup.steps.4') },
    ];

    return (
        <div className="relative min-h-screen flex bg-white">
            {/* Animated background for brand cohesion */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-indigo-400/20 rounded-full filter blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-violet-400/20 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-0 left-1/2 w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] bg-purple-400/20 rounded-full filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="absolute top-6 right-6 z-10"><LanguageToggle /></div>

            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-2xl py-8">
                    {/* Logo & Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4 group">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                    <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
                                        <span className="text-white text-base font-bold">K</span>
                                    </div>
                                </div>
                                <span className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Koopi</span>
                            </Link>
                        </div>
                        <h2 className="mt-2 text-3xl font-bold text-gray-900">{t('signup.title')}</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {t('signup.haveAccount')}{' '}
                            <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
                                {t('signup.signIn')}
                            </Link>
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.number} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border transition-all ${
                                            currentStep >= step.number
                                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow'
                                                : 'bg-white text-gray-500 border-gray-300'
                                        }`}>
                                            {step.number}
                                        </div>
                                        <span className={`mt-2 text-xs font-medium ${
                                            currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                                        }`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="flex-1 h-1 mx-2 rounded-full bg-gray-200">
                                            <div className={`h-1 rounded-full transition-all duration-300 ${
                                                currentStep > step.number ? 'bg-gradient-to-r from-indigo-600 to-violet-600 w-full' : 'w-0'
                                            }`} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-2xl p-8">
                        {error && (
                            <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Step 1: Account Information */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900">{t('signup.account.heading')}</h3>
                                    <div className="space-y-5">
                                        <div>
                                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('signup.account.fullName')}
                                            </label>
                                            <input
                                                id="fullName"
                                                type="text"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('signup.account.email')}
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('signup.account.password')}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all pr-10"
                                                    placeholder={t('signup.account.passwordPlaceholder') as string}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                                    aria-label="Toggle password visibility"
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
                                                {t('signup.account.confirmPassword')}
                                            </label>
                                            <input
                                                id="confirmPassword"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Store Information */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900">{t('signup.store.heading')}</h3>
                                    <div className="space-y-5">
                                        <div>
                                            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('signup.store.storeName')}
                                            </label>
                                            <input
                                                id="storeName"
                                                type="text"
                                                value={formData.storeName}
                                                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                                placeholder="My Fashion Store"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('signup.store.storeUrl')}
                                            </label>
                                            <div className="mt-1 flex rounded-lg">
                                                <input
                                                    id="subdomain"
                                                    type="text"
                                                    value={formData.subdomain}
                                                    onChange={(e) => {
                                                        const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                                        setFormData({ ...formData, subdomain: value });
                                                        checkSubdomainAvailability(value);
                                                    }}
                                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                                                    placeholder="mystore"
                                                    required
                                                />
                                                <span className="inline-flex items-center px-4 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-600 text-sm">
                                                    {t('signup.store.domainSuffix')}
                                                </span>
                                            </div>
                                            {subdomainAvailable === true && (
                                                <p className="mt-2 text-sm text-green-600">
                                                    {t('signup.store.availability.available')}
                                                </p>
                                            )}
                                            {subdomainAvailable === false && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {t('signup.store.availability.notAvailable')}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('signup.store.businessType')}
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {businessTypes.map((type) => (
                                                    <button
                                                        key={type.value}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, businessType: type.value })}
                                                        className={`px-4 py-3 text-left border rounded-lg transition-colors ${
                                                            formData.businessType === type.value
                                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                        }`}
                                                    >
                                                        <span className="text-sm font-medium">{type.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('signup.store.country')}
                                            </label>
                                            <select
                                                id="country"
                                                value={formData.country}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
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
                            )}

                            {/* Step 3: Plan Selection */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900">{t('signup.plan.heading')}</h3>
                                    <p className="text-sm text-gray-600">{t('signup.plan.subtitle')}</p>

                                    <div className="space-y-4">
                                        {plans.map((plan) => (
                                            <button
                                                key={plan.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, plan: plan.id as any })}
                                                className={`relative w-full text-left p-5 border rounded-lg transition-colors ${
                                                    formData.plan === plan.id
                                                        ? 'border-indigo-600 bg-indigo-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                {plan.popular && (
                                                    <span className="absolute -top-3 left-5 px-3 py-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-medium rounded-full">
                                                        {t('signup.plan.popular')}
                                                    </span>
                                                )}

                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="mb-2">
                                                            <h4 className="text-base font-semibold text-gray-900">{plan.name}</h4>
                                                            <p className="text-xs text-gray-500">{plan.duration}</p>
                                                        </div>

                                                        <div className="mb-4">
                                                            <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                                                        </div>

                                                        <ul className="space-y-2">
                                                            {plan.features.map((feature, index) => (
                                                                <li key={index} className="text-sm text-gray-600">
                                                                    • {feature}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="ml-4">
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                            formData.plan === plan.id
                                                                ? 'border-indigo-600 bg-indigo-600'
                                                                : 'border-gray-300'
                                                        }`}>
                                                            {formData.plan === plan.id && (
                                                                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
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
                            )}

                            {/* Step 4: Review & Confirm */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900">{t('signup.review.heading')}</h3>

                                    <div className="rounded-lg p-6 border border-gray-200 bg-neutral-50 space-y-4 mb-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-600 mb-1">{t('signup.review.account')}</p>
                                                <p className="font-medium text-gray-900">{formData.fullName}</p>
                                                <p className="text-sm text-gray-600">{formData.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 mb-1">{t('signup.review.store')}</p>
                                                <p className="font-medium text-gray-900">{formData.storeName}</p>
                                                <p className="text-sm text-indigo-700">{formData.subdomain}{t('signup.store.domainSuffix')}</p>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4">
                                            <p className="text-xs text-gray-600 mb-1">{t('signup.review.selectedPlan')}</p>
                                            <p className="font-medium text-gray-900">
                                                {plans.find(p => p.id === formData.plan)?.name} - {plans.find(p => p.id === formData.plan)?.price}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg border-gray-200 p-4">
                                        <label className="flex items-start cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.agreedToTerms}
                                                onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                                                className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-600 border-gray-300 rounded"
                                            />
                                            <span className="ml-3 text-sm text-gray-700">
                                                {t('signup.terms.agree')} <a href="#" className="font-medium text-indigo-600 hover:underline">{t('signup.terms.tos')}</a> {t('signup.terms.and')} <a href="#" className="font-medium text-indigo-600 hover:underline">{t('signup.terms.privacy')}</a>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                        currentStep === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {t('signup.nav.back')}
                                </button>

                                {currentStep < 4 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg font-medium hover:shadow-xl hover:shadow-indigo-500/30"
                                    >
                                        {t('signup.nav.continue')}
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading || !formData.agreedToTerms}
                                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg font-medium hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? t('signup.nav.creating') : t('signup.nav.create')}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right Side - Brand-aligned info */}
            <div className="hidden lg:block relative w-0 flex-1 border-l border-gray-200">
                <div className="absolute inset-0 p-12 flex items-center">
                    <div className="max-w-md space-y-6 text-gray-800">
                        <div>
                            <h3 className="text-2xl font-semibold">Build confidently</h3>
                            <p className="mt-2 text-sm text-gray-600">A streamlined setup experience to launch your store quickly.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                <h4 className="font-medium">Quick setup</h4>
                                <p className="text-sm text-gray-600">Get your store online in minutes.</p>
                            </div>
                            <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                <h4 className="font-medium">Local payments</h4>
                                <p className="text-sm text-gray-600">Accept LKR payments with local gateways.</p>
                            </div>
                            <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                <h4 className="font-medium">Analytics</h4>
                                <p className="text-sm text-gray-600">Track growth and make informed decisions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
