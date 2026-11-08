import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DetectSection from './components/DetectSection';
import WasteInfoSection from './components/WasteInfoCard';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
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
