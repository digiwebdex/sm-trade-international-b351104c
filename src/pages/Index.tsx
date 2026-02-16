import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import ProcessSection from '@/components/ProcessSection';
import ProductsSection from '@/components/ProductsSection';
import ClientsSection from '@/components/ClientsSection';
import BulkOrderCalculator from '@/components/BulkOrderCalculator';
import QuoteRequestForm from '@/components/QuoteRequestForm';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <ProductsSection />
      <ClientsSection />
      <BulkOrderCalculator />
      <QuoteRequestForm />
      <ContactSection />
    </main>
  );
};

export default Index;
