import CTA from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Header from "@/components/Header";
import Hero from "@/components/landing/Hero";
import Pricing from "@/components/landing/Pricing";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "si" }];
}

export default function Home() {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}