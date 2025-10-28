import DockNav from '@/components/landing/DockNav';
import Hero from '@/components/landing/Hero';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <DockNav />
      <Hero />
      <Footer />
    </main>
  );
}
