"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { sanitizeSlug } from "@/utils/slugValidation";
import { Check, X, Loader2, AlertCircle, ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface MultiStepSignupFormProps {
  locale: string;
}

export default function MultiStepSignupForm({ locale }: MultiStepSignupFormProps) {
  const t = useTranslations("SignupPage");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    // Step 1: Account Info
    email: "",
    password: "",
    displayName: "",
    
    // Step 2: Store Details
    storeName: "",
    storeSlug: "",
    storeDescription: "",
    countryCode: "+94",
    phoneNumber: "",
    
    // Step 3: Business Info
    accountType: "individual" as "individual" | "business",
    businessName: "",
    businessType: "" as "" | "llc" | "corporation" | "sole_proprietor" | "partnership" | "other",
    taxId: "",
    businessStreet: "",
    businessCity: "",
    businessState: "",
    businessPostalCode: "",
    businessCountry: "",
    
    // Terms
    acceptTerms: false,
  });

  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [slugError, setSlugError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Password strength checks
  const [passwordChecks, setPasswordChecks] = useState({
    hasEmailOrName: false,
    minLength: false,
    hasNumberOrSymbol: false,
  });

  // Auto-generate slug from store name
  useEffect(() => {
    if (formData.storeName) {
      const slug = sanitizeSlug(formData.storeName);
      setFormData(prev => ({ ...prev, storeSlug: slug }));
    }
  }, [formData.storeName]);

  // Check slug availability
  useEffect(() => {
    if (formData.storeSlug.length >= 3) {
      const timer = setTimeout(async () => {
        setSlugStatus("checking");
        setSlugError("");
        try {
          const response = await fetch("/api/store/check-slug", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: formData.storeSlug }),
          });

          const data = await response.json();
          
          if (response.ok && data.available) {
            setSlugStatus("available");
            setSlugError("");
          } else {
            setSlugStatus("unavailable");
            const randomNum = Math.floor(Math.random() * 9999);
            const suggestion = `${formData.storeSlug}-${randomNum}`;
            setSlugError(`Not available. Try: ${suggestion}`);
          }
        } catch (error) {
          // On error, assume available for better UX
          console.error("Slug check failed:", error);
          setSlugStatus("available");
          setSlugError("");
        }
      }, 150);

      return () => clearTimeout(timer);
    } else if (formData.storeSlug.length > 0 && formData.storeSlug.length < 3) {
      setSlugStatus("unavailable");
      setSlugError("Minimum 3 characters required");
    } else {
      setSlugStatus("idle");
      setSlugError("");
    }
  }, [formData.storeSlug]);

  // Check password strength
  useEffect(() => {
    const email = formData.email.toLowerCase();
    const password = formData.password.toLowerCase();
    const hasEmail = email && password.includes(email.split('@')[0]);
    const hasName = formData.displayName && password.includes(formData.displayName.toLowerCase());
    
    setPasswordChecks({
      hasEmailOrName: !(hasEmail || hasName),
      minLength: formData.password.length >= 8,
      hasNumberOrSymbol: /[0-9!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    });
  }, [formData.password, formData.email, formData.displayName]);

  const isPasswordStrong = passwordChecks.hasEmailOrName && passwordChecks.minLength && passwordChecks.hasNumberOrSymbol;

  // Calculate password strength percentage
  const passwordStrength = 
    (passwordChecks.hasEmailOrName ? 33 : 0) + 
    (passwordChecks.minLength ? 33 : 0) + 
    (passwordChecks.hasNumberOrSymbol ? 34 : 0);

  const getStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 100) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 100) return "Good";
    return "Strong";
  };

  // Validation for each step
  const canProceedToStep2 = formData.email && formData.password && formData.displayName && isPasswordStrong;
  const canProceedToStep3 = formData.storeName && formData.storeSlug && slugStatus === "available";
  const canProceedToStep4 = true; // Business info is optional

  const handleNext = () => {
    setError("");
    
    if (currentStep === 1 && !canProceedToStep2) {
      setError("Please complete all required fields and meet password requirements");
      return;
    }
    
    if (currentStep === 2 && !canProceedToStep3) {
      setError("Please complete store details with an available slug");
      return;
    }
    
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePrevious = () => {
    setError("");
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setError("");

    if (!formData.acceptTerms) {
      setError("Please accept the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare business info if business account type
      const businessInfo = formData.accountType === "business" ? {
        accountType: formData.accountType,
        businessName: formData.businessName || undefined,
        businessType: formData.businessType || undefined,
        taxId: formData.taxId || undefined,
        businessAddress: (formData.businessStreet || formData.businessCity) ? {
          street: formData.businessStreet,
          city: formData.businessCity,
          state: formData.businessState,
          postalCode: formData.businessPostalCode,
          country: formData.businessCountry,
        } : undefined,
      } : {
        accountType: formData.accountType,
      };

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
          phoneNumber: formData.phoneNumber ? `${formData.countryCode}${formData.phoneNumber.replace(/\s/g, '')}` : '',
          storeName: formData.storeName,
          storeSlug: formData.storeSlug,
          storeDescription: formData.storeDescription,
          businessInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed. Please try again.");
      }

      // Sign in with custom token
      await signInWithCustomToken(auth, data.customToken);

      // Create session
      const sessionResponse = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: await auth.currentUser?.getIdToken() }),
      });

      if (!sessionResponse.ok) {
        throw new Error("Failed to create session");
      }

      // Show success step
      setCurrentStep(4);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/${locale}/dashboard`);
      }, 2000);
    } catch (err) {
      setError((err as Error).message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "koopi.com";

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="relative flex items-center justify-between w-full">
          {/* Connection Lines */}
          <div className="absolute left-0 right-0 top-5 flex items-center px-5">
            <div className={`flex-1 h-1 transition-all ${
              currentStep > 1 ? "bg-blue-600" : "bg-gray-200"
            }`} />
            <div className={`flex-1 h-1 transition-all ${
              currentStep > 2 ? "bg-blue-600" : "bg-gray-200"
            }`} />
          </div>

          {/* Steps */}
          {[1, 2, 3].map((step) => (
            <div key={step} className="relative flex flex-col items-center z-10">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                currentStep >= step
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}>
                {currentStep > step ? <Check className="w-5 h-5" /> : step}
              </div>
              <span className="mt-2 text-xs text-gray-600 whitespace-nowrap">
                {step === 1 ? "Account" : step === 2 ? "Store" : "Business"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Step 1: Account Information */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Create Your Account</h3>
            <p className="text-sm text-gray-600">Let&apos;s start with your basic information</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              placeholder="John Doe"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Password Strength</span>
                  <span className={`text-xs font-semibold ${
                    passwordStrength < 50 ? "text-red-600" : 
                    passwordStrength < 100 ? "text-yellow-600" : 
                    "text-green-600"
                  }`}>
                    {getStrengthLabel()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {passwordChecks.minLength ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${passwordChecks.minLength ? "text-green-600" : "text-gray-600"}`}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordChecks.hasNumberOrSymbol ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${passwordChecks.hasNumberOrSymbol ? "text-green-600" : "text-gray-600"}`}>
                    Contains number or symbol
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordChecks.hasEmailOrName ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${passwordChecks.hasEmailOrName ? "text-green-600" : "text-gray-600"}`}>
                    Doesn&apos;t contain email or name
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={!canProceedToStep2}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 2: Store Details */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Setup Your Store</h3>
            <p className="text-sm text-gray-600">Tell us about your online store</p>
          </div>

          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Store Name
            </label>
            <input
              type="text"
              required
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              placeholder="My Awesome Store"
            />
          </div>

          {/* Store Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Store URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={formData.storeSlug}
                onChange={(e) => setFormData({ ...formData, storeSlug: sanitizeSlug(e.target.value) })}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                placeholder="my-store"
              />
              {slugStatus === "checking" && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
              {slugStatus === "available" && <Check className="w-5 h-5 text-green-600" />}
              {slugStatus === "unavailable" && <X className="w-5 h-5 text-red-500" />}
            </div>
            {formData.storeSlug && (
              <p className="mt-1.5 text-sm text-gray-600">
                Your store will be: <span className="font-medium text-blue-600">{formData.storeSlug}.{baseDomain}</span>
              </p>
            )}
            {slugError && (
              <p className="mt-1.5 text-sm text-red-600">{slugError}</p>
            )}
          </div>

          {/* Store Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Store Description <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <textarea
              value={formData.storeDescription}
              onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 resize-none"
              placeholder="Tell customers what makes your store special..."
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <div className="flex gap-2">
              <select
                value={formData.countryCode}
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                className="w-32 px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 cursor-pointer"
              >
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+94">🇱🇰 +94</option>
                <option value="+91">🇮🇳 +91</option>
                <option value="+86">🇨🇳 +86</option>
              </select>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/[^\d\s-]/g, '') })}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                placeholder="712345678"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-500">We&apos;ll use this to contact you about your store</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceedToStep3}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Business Information */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Business Information</h3>
            <p className="text-sm text-gray-600">Optional - You can skip this and add later</p>
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: "individual" })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.accountType === "individual"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold text-gray-900">Individual</div>
                <div className="text-xs text-gray-600 mt-1">Personal store</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: "business" })}
                className={`p-4 border-2 rounded-lg transition-all ${
                  formData.accountType === "business"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold text-gray-900">Business</div>
                <div className="text-xs text-gray-600 mt-1">Company store</div>
              </button>
            </div>
          </div>

          {/* Business Fields (only if business selected) */}
          {formData.accountType === "business" && (
            <>
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Business Name <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Acme Inc."
                />
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Business Type <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value as "" | "llc" | "corporation" | "sole_proprietor" | "partnership" | "other" })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 cursor-pointer"
                >
                  <option value="">Select business type</option>
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                  <option value="sole_proprietor">Sole Proprietor</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Tax ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tax ID / EIN <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  placeholder="12-3456789"
                />
              </div>

              {/* Business Address */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Business Address <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                
                <input
                  type="text"
                  value={formData.businessStreet}
                  onChange={(e) => setFormData({ ...formData, businessStreet: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Street Address"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.businessCity}
                    onChange={(e) => setFormData({ ...formData, businessCity: e.target.value })}
                    className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={formData.businessState}
                    onChange={(e) => setFormData({ ...formData, businessState: e.target.value })}
                    className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    placeholder="State/Province"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.businessPostalCode}
                    onChange={(e) => setFormData({ ...formData, businessPostalCode: e.target.value })}
                    className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    placeholder="Postal Code"
                  />
                  <input
                    type="text"
                    value={formData.businessCountry}
                    onChange={(e) => setFormData({ ...formData, businessCountry: e.target.value })}
                    className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    placeholder="Country"
                  />
                </div>
              </div>
            </>
          )}

          {/* Terms & Conditions */}
          <div className="pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !formData.acceptTerms}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {currentStep === 4 && (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Created! 🎉</h3>
          <p className="text-gray-600 mb-4">
            Welcome to Koopi! We&apos;ve sent a verification email to <strong>{formData.email}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Redirecting you to your dashboard...
          </p>
        </div>
      )}
    </div>
  );
}
