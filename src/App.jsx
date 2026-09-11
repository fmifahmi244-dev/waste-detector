import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DetectSection from './components/DetectSection';
import WasteInfoSection from './components/WasteInfoCard';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      {/* Ambient background orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <Navbar />
      <main>
        <Hero />
        <DetectSection />
        <WasteInfoSection />
      </main>
      <Footer />
    </>
  );
}
