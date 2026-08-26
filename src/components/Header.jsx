import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/nobglogo.png";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Configuration
    const phoneNumber = "9842520169";
    const whatsappMessage = "Hello! I'm interested in studying abroad and would like to know more about your services.";

    // Handle scroll event
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 py-2 px-4 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex justify-between items-center">
                <Link to="/" className="flex items-center flex-shrink-0">
                    <img
                        src={logo}
                        alt="Aaronic Logo"
                        className="h-8 sm:h-22 w-auto object-contain"
                    />
                    {/* <span className={`ml-2 text-base sm:text-lg font-bold hidden sm:inline transition-colors duration-300 ${isScrolled ? 'text-[#253564]' : 'text-white'
                        }`}>
                        Aaronic
                    </span> */}
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-3 lg:gap-5 items-center">
                    <Link
                        to="/about"
                        className={`text-xs sm:text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-lg ${isScrolled
                            ? 'text-gray-700 hover:text-[#cd9d4e] hover:bg-gray-100'
                            : 'text-white hover:text-[#cd9d4e] hover:bg-white/10'
                            }`}
                    >
                        About
                    </Link>
                    <Link
                        to="/trek"
                        className={`text-xs sm:text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-lg ${isScrolled
                            ? 'text-gray-700 hover:text-[#cd9d4e] hover:bg-gray-100'
                            : 'text-white hover:text-[#cd9d4e] hover:bg-white/10'
                            }`}
                    >
                        Trek
                    </Link>
                    <Link
                        to="/tours"
                        className={`text-xs sm:text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-lg ${isScrolled
                            ? 'text-gray-700 hover:text-[#cd9d4e] hover:bg-gray-100'
                            : 'text-white hover:text-[#cd9d4e] hover:bg-white/10'
                            }`}
                    >
                        Tours
                    </Link>
                    <Link
                        to="/contact"
                        className={`text-xs sm:text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-lg ${isScrolled
                            ? 'text-gray-700 hover:text-[#cd9d4e] hover:bg-gray-100'
                            : 'text-white hover:text-[#cd9d4e] hover:bg-white/10'
                            }`}
                    >
                        Contact
                    </Link>
                </nav>

                {/* Desktop Action Buttons */}
                <div className="hidden md:flex items-center gap-2 sm:gap-3">
                    <a
                        href={`tel:${phoneNumber}`}
                        className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full transition-all duration-200 text-xs font-medium whitespace-nowrap shadow-sm hover:shadow-md ${isScrolled
                            ? 'bg-[#253564] hover:bg-[#1a2448] text-white'
                            : 'bg-white/10 backdrop-blur-sm hover:bg-[#253564] text-white border border-white/20 hover:border-transparent'
                            }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="hidden xs:inline">{phoneNumber}</span>
                        <span className="xs:hidden">Call</span>
                    </a>
                    <a
                        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full transition-all duration-200 text-xs font-medium whitespace-nowrap shadow-sm hover:shadow-md ${isScrolled
                            ? 'bg-[#cd9d4e] hover:bg-[#b88d3e] text-white'
                            : 'bg-white/10 backdrop-blur-sm hover:bg-[#cd9d4e] text-white border border-white/20 hover:border-transparent'
                            }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span className="hidden xs:inline">WhatsApp</span>
                        <span className="xs:hidden">WA</span>
                    </a>
                </div>

                {/* Hamburger Menu Button - Mobile */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                        }`}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} className={isScrolled ? 'text-gray-700' : 'text-white'} /> : <Menu size={24} className={isScrolled ? 'text-gray-700' : 'text-white'} />}
                </button>
            </div>

            {/* Mobile Navigation - Slides down when open */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className={`${isScrolled ? 'bg-white/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'} border-t ${isScrolled ? 'border-gray-100' : 'border-white/20'} px-4 py-4`}>
                    <div className="flex flex-col gap-2">
                        <Link
                            to="/"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-700 text-sm font-medium hover:text-[#cd9d4e] hover:bg-gray-50 px-3 py-2 rounded-lg transition"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-700 text-sm font-medium hover:text-[#cd9d4e] hover:bg-gray-50 px-3 py-2 rounded-lg transition"
                        >
                            About
                        </Link>
                        <Link
                            to="/trek"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-700 text-sm font-medium hover:text-[#cd9d4e] hover:bg-gray-50 px-3 py-2 rounded-lg transition"
                        >
                            Trek
                        </Link>
                        <Link
                            to="/tours"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-700 text-sm font-medium hover:text-[#cd9d4e] hover:bg-gray-50 px-3 py-2 rounded-lg transition"
                        >
                            Tours
                        </Link>
                        <Link
                            to="/contact"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-700 text-sm font-medium hover:text-[#cd9d4e] hover:bg-gray-50 px-3 py-2 rounded-lg transition"
                        >
                            Contact
                        </Link>

                        {/* Mobile Action Buttons */}
                        <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100">
                            <a
                                href={`tel:${phoneNumber}`}
                                className="flex-1 bg-[#253564] hover:bg-[#1a2448] text-white text-center px-3 py-2.5 rounded-lg text-sm font-medium transition"
                            >
                                Call Now
                            </a>
                            <a
                                href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-[#cd9d4e] hover:bg-[#b88d3e] text-white text-center px-3 py-2.5 rounded-lg text-sm font-medium transition"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

