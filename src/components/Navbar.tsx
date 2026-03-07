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
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "py-4 bg-black/60 backdrop-blur-md border-b border-white/10" : "py-6 bg-transparent"
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center font-bold text-black">
                        JW
                    </div>
                    <span className="text-xl font-semibold tracking-tight text-white hover:text-white/80 transition-colors">
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
                            className="text-sm font-medium text-white/70 hover:text-blue-400 transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="/#contact"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleLinkClick(e, '/#contact')}
                        className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-blue-50 transition-colors"
                    >
                        Contact
                    </a>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <List size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-black border-b border-white/10 p-6 flex flex-col gap-4 md:hidden">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-lg font-medium text-white"
                            onClick={(e) => handleLinkClick(e, link.href)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="/#contact"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleLinkClick(e, '/#contact')}
                        className="w-full flex items-center justify-center py-3 bg-blue-400 text-white font-semibold rounded-xl hover:bg-blue-500 transition-colors"
                    >
                        Contact
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
