import { Outlet } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import MobileBottomBar from '@/components/MobileBottomBar';

const PublicLayout = () => (
  <div className="min-h-screen pb-14 md:pb-0">
    <TopBar />
    <Navbar />
    <Outlet />
    <Footer />
    <WhatsAppFloat />
    <MobileBottomBar />
  </div>
);

export default PublicLayout;
