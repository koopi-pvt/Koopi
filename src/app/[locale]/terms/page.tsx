import Terms from "@/components/terms/Terms";
import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "si" }];
}

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <Terms />
      <Footer />
    </div>
  );
}
