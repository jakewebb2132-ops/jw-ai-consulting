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
        { name: "Strategy", href: "/#contact" },
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
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "py-4 bg-white/80 backdrop-blur-md border-b border-slate-200" : "py-6 bg-transparent"
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:bg-blue-700 transition-colors">
                        JW
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                        AI Consulting
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleLinkClick(e, link.href)}
                            className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="/#contact"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleLinkClick(e, '/#contact')}
                        className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        Contact
                    </a>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-slate-900"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <List size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 p-6 flex flex-col gap-4 md:hidden shadow-lg">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors"
                            onClick={(e) => handleLinkClick(e, link.href)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="/#contact"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleLinkClick(e, '/#contact')}
                        className="w-full flex items-center justify-center py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Contact
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
