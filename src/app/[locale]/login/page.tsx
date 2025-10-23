import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthHeader from "@/components/auth/AuthHeader";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "si" }];
}

export default async function LoginPage({
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
          <LoginForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
