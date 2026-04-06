import React, { useState, useEffect } from 'react';
import { List, X } from "phosphor-react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: "Services", href: "/#services" },
        { name: "Portfolio", href: "/#portfolio" },
        { name: "Discovery", href: "https://calendar.app.google/jfu9ejCAa4fAnrVF9", isExternal: true },
    ];

    const navigate = useNavigate();
    const location = useLocation();

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        const hash = href.replace('/', '');

        if (location.pathname !== '/') {
            navigate('/' + hash);
            return;
        }

        const element = document.querySelector(hash);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            window.history.pushState(null, '', hash);
        }
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-0 md:px-10 border-b border-[var(--border-color)] ${isScrolled ? "py-4 bg-white/90 backdrop-blur-[20px]" : "py-6 bg-[rgba(255,255,255,0.6)] backdrop-blur-[20px]"
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <span className="font-space text-[16px] font-bold tracking-[0.12em] uppercase text-[var(--text-primary)]">
                        JW AI Consulting
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-12">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target={link.isExternal ? "_blank" : undefined}
                            rel={link.isExternal ? "noopener noreferrer" : undefined}
                            onClick={link.isExternal ? undefined : (e) => handleLinkClick(e, link.href)}
                            className="font-space text-[13px] font-semibold tracking-[0.1em] uppercase text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[2px] after:bg-[var(--accent-cyan)] after:transition-all hover:after:w-full"
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="https://calendar.app.google/jfu9ejCAa4fAnrVF9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 bg-transparent text-[var(--accent-cyan)] border border-[var(--accent-cyan)] font-space text-[12px] font-semibold tracking-[0.15em] uppercase rounded hover:bg-[var(--accent-cyan)] hover:text-white transition-all shadow-sm"
                    >
                        Book a Call
                    </a>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-[var(--text-primary)]"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <List size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-[var(--bg-main)] border-b border-[var(--border-color)] p-6 flex flex-col gap-6 md:hidden shadow-lg">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target={link.isExternal ? "_blank" : undefined}
                            rel={link.isExternal ? "noopener noreferrer" : undefined}
                            className="font-space text-lg font-bold text-[var(--text-primary)] hover:text-[var(--accent-cyan)] transition-colors"
                            onClick={link.isExternal ? undefined : (e) => handleLinkClick(e, link.href)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="https://calendar.app.google/jfu9ejCAa4fAnrVF9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center py-4 bg-[var(--accent-cyan)] text-white font-space font-bold uppercase tracking-widest rounded transition-colors shadow-sm"
                    >
                        Book a Call
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
