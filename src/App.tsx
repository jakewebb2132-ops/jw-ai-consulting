import { lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import Hero from './components/Hero';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import CaseStudy from './pages/CaseStudy';
import { GithubLogo, TwitterLogo } from 'phosphor-react';
import Cursor from './components/Cursor';
import LazySection from './components/LazySection';

// Lazy load below-the-fold sections and subpages
const ServicesSection = lazy(() => import('./components/Services'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const ROICalculator = lazy(() => import('./components/ROICalculator'));
const Contact = lazy(() => import('./components/Contact'));
const ServicePage = lazy(() => import('./pages/ServicePage'));

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo(0, 0);
        } else {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [pathname, hash]);

    return null;
};

const HomePage = () => (
    <>
        <Hero />
        <LazySection minHeight="800px">
            <ServicesSection />
        </LazySection>
        <LazySection minHeight="800px">
            <Portfolio />
        </LazySection>
        <LazySection minHeight="600px">
            <ROICalculator />
        </LazySection>
        <LazySection minHeight="800px">
            <Contact />
        </LazySection>
    </>
);

function App() {
    useEffect(() => {
        const lenis = new Lenis({
            autoRaf: true,
        });

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <Router>
            <ScrollToTop />
            <div className="flex min-h-screen flex-col bg-[#050505] text-white selection:bg-blue-400/30 font-sans">
                <ScrollProgress />
                <Cursor />
                <Navbar />

                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/services/:slug" element={
                            <LazySection minHeight="100vh">
                                <ServicePage />
                            </LazySection>
                        } />
                        <Route path="/case-study/:id" element={<CaseStudy />} />
                    </Routes>
                </main>

                <footer className="border-t border-white/10 bg-[#0a0a0b] px-6 py-8">
                    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 text-zinc-400 md:flex-row">
                        <p>&copy; 2026 JW AI Consulting. All rights reserved.</p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition-colors"><GithubLogo size={24} /></a>
                            <a href="#" className="hover:text-white transition-colors"><TwitterLogo size={24} /></a>
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
