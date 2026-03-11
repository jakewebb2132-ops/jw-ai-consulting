import { lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LazySection from './components/LazySection';

// Lazy load below-the-fold sections and subpages
const ServicesSection = lazy(() => import('./components/Services'));
const Portfolio = lazy(() => import('./components/Portfolio'));
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
        <LazySection minHeight="800px">
            <Contact />
        </LazySection>
    </>
);

const AppLayout = () => {
    // If the user visits the proposal subdomain but didn't hit a specific secure route,
    // automatically bounce them to the admin dashboard instead of rendering the consumer marketing site.
    const isProposalDomain = window.location.hostname.includes('proposal');
    if (isProposalDomain) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#f0f4f8] text-[#0f172a] selection:bg-blue-400/30 font-sans">
            <ScrollProgress />
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
            <Routes>
                {/* The Public Authentication Gate */}
                <Route path="/login" element={<Login />} />

                {/* Secure Internal Proposal Generator (Requires Auth) */}
                <Route path="/proposal-generator" element={<ProtectedRoute><ProposalGenerator /></ProtectedRoute>} />
                <Route path="/proposal-generator/print" element={<ProtectedRoute><ProposalPrint /></ProtectedRoute>} />
                
                {/* Secure Internal Admin Dashboard (Requires Auth) */}
                <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

                {/* Secure Magic Link Public Route (Does NOT require Auth) */}
                <Route path="/p/:id" element={<ProposalPublic />} />
                
                {/* All other routes wrapped in the classic Main Layout */}
                <Route path="/*" element={<AppLayout />} />
            </Routes>
        </Router>
    );
}

export default App;
