import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Hero from './components/Hero';
import ServicesSection from './components/Services';
import Navbar from './components/Navbar';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import ScrollProgress from './components/ScrollProgress';
import { GithubLogo, TwitterLogo } from 'phosphor-react';

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
        <div className="flex min-h-screen flex-col bg-[#050505] text-white selection:bg-blue-400/30 font-sans">
            <ScrollProgress />
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1">
                <Hero />
                <ServicesSection />
                <Portfolio />
                <Contact />
            </main>

            {/* Footer */}
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
    );
}

export default App;
