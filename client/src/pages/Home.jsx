import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Stats from '../components/Stats';
import Pricing from '../components/Pricing';
import AboutMe from '../components/AboutMe';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--section-bg)', color: 'var(--text-primary)' }}>
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <Pricing />
      <AboutMe />
      <Contact />
      <Footer />
    </div>
  );
}