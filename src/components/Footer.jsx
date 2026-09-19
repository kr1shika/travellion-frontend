import { Link } from "react-router-dom";
import logo from "../assets/nobglogo.png";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#093468] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

                {/* Top grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="inline-block mb-4">
                            <img
                                src={logo}
                                alt="Travelion Adventures"
                                className="h-10 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <p className="text-sm text-white/70 leading-relaxed mb-5">
                            Curated Himalayan treks and adventures. Crafted by
                            locals, trusted by travellers worldwide.
                        </p>

                        {/* Socials */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://www.instagram.com/travelionadventures_trek?stkn=ZDNlZDc0MzIxNw=="
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#cd9d4e] flex items-center justify-center transition-colors"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>

                            <a
                                href="mailto:info@travelionadventures.com"
                                aria-label="Email"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#cd9d4e] flex items-center justify-center transition-colors"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                </svg>
                            </a>

                            <a
                                href="tel:9843120192"
                                aria-label="Call"
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#cd9d4e] flex items-center justify-center transition-colors"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 uppercase tracking-wide text-xs">
                            Explore
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link
                                    to="/packages"
                                    className="text-white/70 hover:text-[#cd9d4e] transition-colors"
                                >
                                    All Packages
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/packages?category=Trekking"
                                    className="text-white/70 hover:text-[#cd9d4e] transition-colors"
                                >
                                    Trekking
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/packages?category=Tour"
                                    className="text-white/70 hover:text-[#cd9d4e] transition-colors"
                                >
                                    Tours
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/packages?category=Expedition"
                                    className="text-white/70 hover:text-[#cd9d4e] transition-colors"
                                >
                                    Expeditions
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 uppercase tracking-wide text-xs">
                            Company
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link
                                    to="/about"
                                    className="text-white/70 hover:text-[#cd9d4e] transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-white/70 hover:text-[#cd9d4e] transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/terms"
                                    className="text-white/70 hover:text-[#cd9d4e] transition-colors"
                                >
                                    Terms &amp; Conditions
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/privacy"
                                    className="text-white/70 hover:text-[#cd9d4e] transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 uppercase tracking-wide text-xs">
                            Get in touch
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href="mailto:info@travelionadventures.com"
                                    className="flex items-start gap-3 text-white/70 hover:text-[#cd9d4e] transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                    </svg>
                                    <span>info@travelionadventures.com</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:9843120192"
                                    className="flex items-start gap-3 text-white/70 hover:text-[#cd9d4e] transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    <span>9843120192</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.instagram.com/travelionadventures_trek?stkn=ZDNlZDc0MzIxNw=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 text-white/70 hover:text-[#cd9d4e] transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                    </svg>
                                    <span>@travelionadventures_trek</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/50">
                        © {currentYear} Travelion Adventures. All rights reserved.
                    </p>
                    <p className="text-xs text-white/50">
                        Crafted with care in Nepal 🇳🇵
                    </p>
                </div>
            </div>
        </footer>
    );
}