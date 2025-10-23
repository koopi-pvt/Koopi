"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Check, X, Loader2 } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const oobCode = searchParams.get("oobCode");
      
      if (!oobCode) {
        setStatus("error");
        setError("Invalid verification link. Please check your email for the correct link.");
        return;
      }

      try {
        // Apply the verification code
        await applyActionCode(auth, oobCode);
        setStatus("success");

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/en/dashboard");
        }, 3000);
      } catch (err: any) {
        console.error("Email verification error:", err);
        setStatus("error");
        
        // Provide user-friendly error messages
        if (err.code === "auth/invalid-action-code") {
          setError("This verification link has expired or has already been used. Please request a new one.");
        } else if (err.code === "auth/expired-action-code") {
          setError("This verification link has expired. Please request a new verification email.");
        } else {
          setError(err.message || "Failed to verify email. Please try again.");
        }
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {status === "verifying" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h1>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified! 🎉</h1>
              <p className="text-gray-600 mb-4">
                Your email has been successfully verified. You now have full access to your Koopi account.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting you to your dashboard in 3 seconds...
              </p>
              <Link
                href="/en/dashboard"
                className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard Now
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <Link
                  href="/en/dashboard"
                  className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/en/login"
                  className="block w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
