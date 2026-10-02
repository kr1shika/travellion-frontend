import {
    CheckCircle,
    Clock,
    Mail,
    MapPin,
    Phone,
    Send,
} from "lucide-react";
import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { publicFetch } from "../utils/api";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.subject.trim() ||
            !form.message.trim()
        ) {
            setError(
                "Please fill in name, email, subject, and message."
            );
            return;
        }

        setSubmitting(true);

        try {
            const { data } = await publicFetch("/inquiries", {
                method: "POST",
                body: JSON.stringify(form),
            });

            if (!data.success) throw new Error(data.message);

            setSubmitted(true);

            setForm({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
        } catch (err) {
            setError(
                err.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f5ef] text-[#18243a]">
            <Header />

            {/* ============================================
                HERO
            ============================================ */}
            <section className="relative overflow-hidden bg-[#101d30] text-white pt-35 pb-10">
                {/* Decorative background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#c99b52]/10 blur-3xl" />
                    <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
                </div>

                <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
                    <p className="text-[#d6aa63] uppercase tracking-[0.28em] text-xs font-semibold mb-5">
                        Get in touch
                    </p>

                    <h1 className="font-serif text-3xl sm:text-5xl md:text-5xl leading-[1.05] tracking-tight mb-6">
                        Let's talk about
                        <br />
                        <span className="text-white/85 italic">
                            your next journey.
                        </span>
                    </h1>

                    <p className="text-white/65 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                        Questions about a trek? Thinking about a custom
                        itinerary? Or simply want to talk about the mountains?
                        We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* ============================================
                CONTENT
            ============================================ */}
            <section className="py-10 lg:py-10">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                        {/* =================================
                            CONTACT INFORMATION
                        ================================= */}
                        <div className="lg:col-span-1">
                            <div className="mb-8">
                                <p className="text-[#c99b52] uppercase tracking-[0.22em] text-xs font-semibold mb-3">
                                    Contact us
                                </p>

                                <h2 className="font-serif text-3xl md:text-4xl text-[#101d30] leading-tight">
                                    We're here
                                    <br />
                                    <span className="italic">
                                        to help.
                                    </span>
                                </h2>

                                <p className="mt-4 text-[#18243a]/60 text-sm leading-relaxed max-w-sm">
                                    Whether you're planning your first
                                    Himalayan adventure or returning for
                                    another one, our team is happy to help
                                    you plan the details.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <ContactCard
                                    icon={Mail}
                                    title="Email"
                                    lines={[
                                        "info@travelionadventures.com",
                                        "We reply within a few hours",
                                    ]}
                                    href="mailto:info@travelionadventures.com"
                                />

                                <ContactCard
                                    icon={Phone}
                                    title="Phone"
                                    lines={[
                                        "+977 9843120192",
                                        "Available 24/7",
                                    ]}
                                    href="tel:9843120192"
                                />

                                <ContactCard
                                    icon={MapPin}
                                    title="Office"
                                    lines={[
                                        "Kathmandu, Nepal",
                                        "Thamel, near Chhetrapati",
                                    ]}
                                />

                                <ContactCard
                                    icon={Clock}
                                    title="Office Hours"
                                    lines={[
                                        "Sun – Fri: 8:00 AM – 6:00 PM",
                                        "Saturday: Closed",
                                    ]}
                                />

                                <ContactCard
                                    icon={InstagramIcon}
                                    title="Instagram"
                                    lines={[
                                        "@travelionadventures_trek",
                                    ]}
                                    href="https://www.instagram.com/travelionadventures_trek?stkn=ZDNlZDc0MzIxNw=="
                                />
                            </div>
                        </div>

                        {/* =================================
                            FORM
                        ================================= */}
                        <div className="lg:col-span-2">
                            {submitted ? (
                                <div className="bg-white rounded-[2rem] border border-[#18243a]/10 p-10 sm:p-14 text-center shadow-sm">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#c99b52]/10 text-[#c99b52] mb-6">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>

                                    <p className="text-[#c99b52] uppercase tracking-[0.2em] text-xs font-semibold mb-3">
                                        Thank you
                                    </p>

                                    <h2 className="font-serif text-3xl md:text-4xl text-[#101d30] mb-4">
                                        Message received.
                                    </h2>

                                    <p className="text-[#18243a]/60 leading-relaxed mb-8 max-w-md mx-auto">
                                        Thanks for reaching out. Our team
                                        will get back to you within 24
                                        hours — usually much sooner.
                                    </p>

                                    <button
                                        onClick={() =>
                                            setSubmitted(false)
                                        }
                                        className="text-sm font-semibold text-[#c99b52] hover:text-[#a97f3d] transition-colors"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white rounded-[2rem] border border-[#18243a]/10 p-7 sm:p-10 lg:p-12 shadow-sm">
                                    <div className="mb-8">
                                        <p className="text-[#c99b52] uppercase tracking-[0.2em] text-xs font-semibold mb-3">
                                            Send a message
                                        </p>

                                        <h2 className="font-serif text-3xl md:text-4xl text-[#101d30]">
                                            Tell us about
                                            <br />
                                            <span className="italic">
                                                your journey.
                                            </span>
                                        </h2>

                                        <p className="text-sm text-[#18243a]/55 mt-4 max-w-lg leading-relaxed">
                                            Fill in the form below and
                                            we'll get back to you shortly.
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                                            {error}
                                        </div>
                                    )}

                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <Field
                                                label="Full Name"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                            />

                                            <Field
                                                label="Email"
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <Field
                                                label="Phone (optional)"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                            />

                                            <Field
                                                label="Subject"
                                                name="subject"
                                                value={form.subject}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#18243a]/70 mb-2">
                                                Message
                                            </label>

                                            <textarea
                                                name="message"
                                                rows={6}
                                                value={form.message}
                                                onChange={handleChange}
                                                required
                                                placeholder="Tell us about your trip or ask us anything..."
                                                className="w-full rounded-xl border border-[#18243a]/15 bg-[#faf9f5] px-4 py-3.5 text-sm text-[#18243a] placeholder:text-[#18243a]/30 outline-none transition-all resize-none focus:border-[#c99b52] focus:ring-2 focus:ring-[#c99b52]/10"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c99b52] hover:bg-[#b88d45] px-7 py-3.5 text-white text-sm font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                        >
                                            <Send className="w-4 h-4" />

                                            {submitting
                                                ? "Sending..."
                                                : "Send Message"}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                BOTTOM STATEMENT
            ============================================ */}
            <section className="bg-[#e9e5d9] py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <p className="text-[#c99b52] uppercase tracking-[0.25em] text-xs font-semibold mb-5">
                        The mountains are waiting
                    </p>

                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#101d30] leading-tight">
                        Some journeys begin
                        <br />
                        with a simple{" "}
                        <span className="italic">
                            hello.
                        </span>
                    </h2>
                </div>
            </section>

            <Footer />
        </div>
    );
}

// ============================================
// CONTACT CARD
// ============================================
function ContactCard({ icon: Icon, title, lines, href }) {
    const Wrapper = href ? "a" : "div";

    const wrapperProps = href
        ? {
            href,
            target: href.startsWith("http")
                ? "_blank"
                : undefined,
            rel: "noopener noreferrer",
        }
        : {};

    return (
        <Wrapper
            {...wrapperProps}
            className={`group block bg-white rounded-2xl border border-[#18243a]/10 p-5 transition-all duration-300 ${href
                ? "hover:border-[#c99b52]/40 hover:shadow-md hover:-translate-y-0.5"
                : ""
                }`}
        >
            <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#c99b52]/10 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-[#c99b52]/15">
                    <Icon className="w-5 h-5 text-[#c99b52]" />
                </div>

                <div className="min-w-0">
                    <p className="font-semibold text-[#101d30] text-sm mb-1">
                        {title}
                    </p>

                    {lines.map((line, i) => (
                        <p
                            key={i}
                            className={
                                i === 0
                                    ? "text-sm text-[#18243a]/75"
                                    : "text-xs text-[#18243a]/40 mt-1"
                            }
                        >
                            {line}
                        </p>
                    ))}
                </div>
            </div>
        </Wrapper>
    );
}

// ============================================
// FORM FIELD
// ============================================
function Field({ label, ...props }) {
    return (
        <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#18243a]/70 mb-2">
                {label}
            </label>

            <input
                {...props}
                className="w-full rounded-xl border border-[#18243a]/15 bg-[#faf9f5] px-4 py-3.5 text-sm text-[#18243a] placeholder:text-[#18243a]/30 outline-none transition-all focus:border-[#c99b52] focus:ring-2 focus:ring-[#c99b52]/10"
            />
        </div>
    );
}

// ============================================
// INSTAGRAM ICON
// ============================================
function InstagramIcon({ className = "w-5 h-5" }) {
    return (
        <svg
            className={className}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    );
}