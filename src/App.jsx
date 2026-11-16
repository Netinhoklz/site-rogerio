import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Partners from './components/Partners.jsx';
import About from './components/About.jsx';
import Principles from './components/Principles.jsx';
import Services from './components/Services.jsx';
import Features from './components/Features.jsx';
import Gallery from './components/Gallery.jsx';
import Testimonials from './components/Testimonials.jsx';
import Faq from './components/Faq.jsx';
import Cta from './components/Cta.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import FloatingButtons from './components/FloatingButtons.jsx';
import { WHATSAPP_URL } from './data/content.js';

export default function App() {
    return (
        <>
            <a href="#main" className="skip-link">Pular para o conteúdo principal</a>
            <Header />
            <main id="main">
                <Hero />
                <Partners />
                <About />
                <Principles />
                <Services />
                <Features />
                <Gallery />
                <Testimonials />
                <Faq />
                <Cta />
                <Contact />
            </main>
            <Footer />
            <FloatingButtons whatsappUrl={WHATSAPP_URL} />
        </>
    );
}
