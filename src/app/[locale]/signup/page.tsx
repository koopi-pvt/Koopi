import MultiStepSignupForm from "@/components/auth/MultiStepSignupForm";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthHeader from "@/components/auth/AuthHeader";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "si" }];
}

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen flex">
      <AuthLayout />
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">
          <AuthHeader />
          <MultiStepSignupForm locale={locale} />
        </div>
      </div>
    </div>
  );
}




