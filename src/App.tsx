import { lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import MeshCanvas from './components/MeshCanvas';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import Hero from './components/Hero';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import CaseStudy from './pages/CaseStudy';
import { GithubLogo, TwitterLogo } from 'phosphor-react';
import ProposalGenerator from './pages/ProposalGenerator';
import ProposalPrint from './pages/ProposalPrint';
import ProposalPublic from './pages/ProposalPublic';
import AdminDashboard from './pages/AdminDashboard';
import Council from './pages/Council';
import VisitorInsights from './pages/VisitorInsights';
import CAPIPipeline from './pages/CAPIPipeline';
import LazySection from './components/LazySection';

// Lazy load below-the-fold sections and subpages
const ServicesSection = lazy(() => import('./components/Services'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Contact = lazy(() => import('./components/Contact'));
const ServicePage = lazy(() => import('./pages/ServicePage'));

const ScrollManager = () => {
    const { pathname, hash } = useLocation();

    // Reset scroll position on route change
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

    // Handle Lenis Smooth Scrolling logic
    useEffect(() => {
        // We only want smooth scrolling on the public marketing pages / read-only proposals.
        // The Proposal Generator and Admin Dashboard use fixed heights with internal scrolling containers,
        // so we must destroy the global Lenis instance to prevent it from swallowing the native scroll events.
        const isInternalApp = pathname.startsWith('/admin') || pathname.startsWith('/proposal-generator');
        
        let lenis: Lenis | null = null;
        
        if (!isInternalApp) {
            lenis = new Lenis({
                autoRaf: true,
            });
        }

        return () => {
            if (lenis) lenis.destroy();
        };
    }, [pathname]);

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
        <LazySection minHeight="800px">
            <Contact />
        </LazySection>
    </>
);

const AppLayout = () => {
    // If the user visits the proposal subdomain but didn't hit a specific secure route,
    // automatically bounce them to the admin dashboard instead of rendering the consumer marketing site.
    const isBoardroomDomain = window.location.hostname.includes('boardroom') || window.location.hostname.includes('proposal');
    if (isBoardroomDomain) {
        return <Navigate to="/admin/council" replace />;
    }

    return (
        <div className="flex min-h-screen flex-col font-sans overflow-x-hidden relative">
            <MeshCanvas />
            <ScrollProgress />
        <Navbar />
        <main className="flex-1 relative z-10">
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
        <footer className="border-t border-slate-200 bg-white px-6 py-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 text-slate-500 md:flex-row">
                <p>&copy; 2026 JW AI Consulting. All rights reserved.</p>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-blue-600 transition-colors"><GithubLogo size={24} /></a>
                    <a href="#" className="hover:text-blue-600 transition-colors"><TwitterLogo size={24} /></a>
                </div>
            </div>
        </footer>
        </div>
    );
};

import { useVisitorTracking } from './hooks/useVisitorTracking';

function App() {
    useVisitorTracking(); // Enable real-time visitor tracking
    return (
        <Router>
            <ScrollManager />
            <Routes>
                {/* Unified Access Redirects */}
                <Route path="/login" element={<Navigate to="/admin/dashboard" replace />} />

                {/* Secure Internal Proposal Generator (Now Public) */}
                <Route path="/proposal-generator" element={<ProposalGenerator />} />
                <Route path="/proposal-generator/print/:id" element={<ProposalPrint />} />
                
                {/* Secure Internal Admin Dashboard (Now Public) */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/council" element={<Council />} />
                <Route path="/admin/leads" element={<VisitorInsights />} />
                <Route path="/admin/pipeline" element={<CAPIPipeline />} />

                {/* Secure Magic Link Public Route (Does NOT require Auth) */}
                <Route path="/p/:id" element={<ProposalPublic />} />
                
                {/* All other routes wrapped in the classic Main Layout */}
                <Route path="/*" element={<AppLayout />} />
            </Routes>
        </Router>
    );
}

export default App;
