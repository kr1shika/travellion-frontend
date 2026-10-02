
import {
    Award,
    ChevronLeft,
    ChevronRight,
    Heart,
    Leaf,
    Mountain,
    ShieldCheck,
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import poonHillBg from "../assets/poonhill.jpg";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function About() {
    return (
        <div className="min-h-screen bg-[#f7f5ef] text-[#18243a] overflow-hidden">
            <Header />

            {/* =====================================================
                HERO
            ====================================================== */}
            <section className="relative min-h-[78vh] flex items-end overflow-hidden">
                <img
                    src={poonHillBg}
                    alt="Poon Hill, Nepal"
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-[#081426]/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#071323]/60 via-transparent to-transparent" />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-20 lg:pb-24">
                    <div className="max-w-4xl">
                        <p className="uppercase tracking-[0.35em] text-[#d6aa63] text-xs sm:text-sm font-semibold mb-6">
                            About Travelion Adventures
                        </p>

                        <h1 className="font-serif text-white text-5xl sm:text-6xl md:text-7xl lg:text-[4rem] leading-[0.9] tracking-tight">
                            Journeys crafted
                            <br />
                            <span className="italic font-light">
                                with heart.
                            </span>
                        </h1>

                        <p className="mt-7 max-w-2xl text-white/80 text-base sm:text-lg leading-relaxed">
                            Travelion Adventures is a Nepal-based trekking and
                            travel company built by people who've spent their
                            lives in the mountains. We design journeys that go
                            beyond the checklist — deep into the culture, the
                            landscape, and the spirit of the Himalayas.
                        </p>
                    </div>

                    <div className="absolute right-8 bottom-16 hidden lg:flex flex-col items-center gap-3 text-white/60">
                        <span className="text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
                            Our story
                        </span>
                        <div className="w-px h-16 bg-white/40" />
                    </div>
                </div>
            </section>

            {/* =====================================================
                INTRO / STORY
            ====================================================== */}
            <section className="bg-[#f7f5ef] py-20 sm:py-28">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-24 items-center">
                        <div>
                            <p className="uppercase tracking-[0.3em] text-[#c99b52] text-xs font-semibold mb-5">
                                Our story
                            </p>

                            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-[#18243a]">
                                From local trails
                                <br />
                                <span className="italic font-light">
                                    to global travelers.
                                </span>
                            </h2>

                            <div className="space-y-5 mt-8 text-gray-600 text-base sm:text-lg leading-relaxed">
                                <p>
                                    We started as a small team of guides
                                    leading treks through the Khumbu region.
                                    What began as weekend trips for friends has
                                    grown into a full-service travel company
                                    welcoming guests from around the world.
                                </p>

                                <p>
                                    But our approach hasn't changed. Every
                                    route we offer has been walked by us. Every
                                    lodge is one we trust. Every guide is
                                    someone we'd send our own family with.
                                    We're small on purpose — it lets us stay
                                    personal.
                                </p>

                                <p>
                                    Whether you're chasing the sunrise at Kala
                                    Patthar, weaving through Annapurna's
                                    rhododendron forests, or discovering the
                                    quieter trails of Langtang, we're here to
                                    make it unforgettable.
                                </p>
                            </div>

                            <Link
                                to="/packages"
                                className="inline-flex items-center gap-3 mt-8 font-semibold text-[#18243a] group"
                            >
                                Explore our journeys
                                <span className="group-hover:translate-x-1 transition-transform">
                                    →
                                </span>
                            </Link>
                        </div>

                        {/* Statistics */}
                        <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-[#e7e2d6]">
                            <p className="text-xs uppercase tracking-[0.3em] text-[#c99b52] font-semibold mb-8">
                                By the numbers
                            </p>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                                <Stat number="500+" label="Happy travelers" />
                                <Stat number="20+" label="Curated routes" />
                                <Stat number="10+" label="Years experience" />
                                <Stat number="100%" label="Local guides" />
                            </div>

                            <div className="mt-10 pt-8 border-t border-gray-100">
                                <p className="font-serif text-2xl text-[#18243a]">
                                    Small by choice.
                                </p>
                                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                    Staying personal means every traveler gets
                                    the attention they deserve.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                VALUES
            ====================================================== */}
            <section className="bg-[#101d30] py-20 sm:py-28 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="max-w-2xl mb-14">
                        <p className="uppercase tracking-[0.3em] text-[#d6aa63] text-xs font-semibold mb-4">
                            What we stand for
                        </p>

                        <h2 className="font-serif text-4xl sm:text-5xl leading-tight">
                            The principles behind
                            <br />
                            <span className="italic font-light">
                                every journey.
                            </span>
                        </h2>

                        <p className="text-white/60 mt-5 text-lg leading-relaxed">
                            The way we travel matters just as much as where we
                            travel. These values shape the experiences we
                            create.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ValueCard
                            icon={Heart}
                            title="Personal, not packaged"
                            description="Small groups, flexible itineraries, and guides who actually know your name."
                        />

                        <ValueCard
                            icon={ShieldCheck}
                            title="Safety first"
                            description="Licensed, first-aid trained guides, daily altitude checks, and 24/7 support on every trek."
                        />

                        <ValueCard
                            icon={Users}
                            title="Local by default"
                            description="We hire local guides, porters, and cooks — money stays in the communities you visit."
                        />

                        <ValueCard
                            icon={Leaf}
                            title="Leave no trace"
                            description="Responsible trekking, waste management, and respect for fragile mountain environments."
                        />

                        <ValueCard
                            icon={Award}
                            title="Honest pricing"
                            description="No hidden fees. What you see is what you pay — with everything clearly spelled out."
                        />

                        <ValueCard
                            icon={Mountain}
                            title="Real adventure"
                            description="From easy day hikes to serious expeditions, we'll match the journey to your comfort level."
                        />
                    </div>
                </div>
            </section>

            {/* =====================================================
                JOURNAL
            ====================================================== */}
            <section className="bg-white py-20 sm:py-28">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                        <div className="max-w-2xl">
                            <p className="uppercase tracking-[0.3em] text-[#c99b52] text-xs font-semibold mb-4">
                                Travel journal
                            </p>

                            <h2 className="font-serif text-4xl sm:text-5xl text-[#18243a]">
                                Moments from
                                <br />
                                <span className="italic font-light">
                                    the trail.
                                </span>
                            </h2>

                            <p className="text-gray-500 mt-5 max-w-xl text-base sm:text-lg leading-relaxed">
                                A glimpse into the places, faces, and mornings
                                that make these journeys worth taking.
                            </p>
                        </div>

                        <div className="hidden sm:flex items-center gap-2">
                            <SliderArrow
                                direction="left"
                                targetId="journal-slider"
                            />
                            <SliderArrow
                                direction="right"
                                targetId="journal-slider"
                            />
                        </div>
                    </div>

                    <div
                        id="journal-slider"
                        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        <JournalSlide
                            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200"
                            alt="Sunrise over Poon Hill"
                        />

                        <JournalSlide
                            src="https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1200"
                            alt="Everest Base Camp"
                        />

                        <JournalSlide
                            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200"
                            alt="Himalayan peaks at dawn"
                        />

                        <JournalSlide
                            src="https://images.unsplash.com/photo-1597733336794-12d05021d510?w=1200"
                            alt="Annapurna trail"
                        />

                        <JournalSlide
                            src="https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200"
                            alt="Rhododendron forest"
                        />

                        <JournalSlide
                            src="https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=1200"
                            alt="Prayer flags on the trail"
                        />

                        <JournalSlide
                            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200"
                            alt="Starry night in the mountains"
                        />

                        <JournalSlide
                            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200"
                            alt="Mountain lake reflection"
                        />
                    </div>

                    <div className="text-center mt-10">
                        <a
                            href="https://www.instagram.com/travelionadventures_trek?stkn=ZDNlZDc0MzIxNw=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 text-[#18243a] font-semibold group"
                        >
                            Follow the journey on Instagram
                            <span className="group-hover:translate-x-1 transition-transform">
                                →
                            </span>
                        </a>
                    </div>
                </div>
            </section>

            {/* =====================================================
                PROMISE
            ====================================================== */}
            <section className="bg-[#f7f5ef] py-20 sm:py-28">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="bg-[#101d30] text-white rounded-[2rem] p-8 sm:p-10">
                                <p className="uppercase tracking-[0.3em] text-[#d6aa63] text-xs font-semibold mb-6">
                                    What you can expect
                                </p>

                                <h3 className="font-serif text-3xl sm:text-4xl mb-8">
                                    The details matter.
                                </h3>

                                <ul className="space-y-5">
                                    <Bullet text="Handcrafted itineraries — every route is one we've walked ourselves" />
                                    <Bullet text="24/7 on-trek support from our Kathmandu office" />
                                    <Bullet text="Fully licensed, insured, and government-registered" />
                                    <Bullet text="Transparent pricing with no hidden costs" />
                                    <Bullet text="Free cancellation up to 30 days before departure" />
                                </ul>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <p className="uppercase tracking-[0.3em] text-[#c99b52] text-xs font-semibold mb-5">
                                Our promise
                            </p>

                            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-[#18243a]">
                                You're not a
                                <br />
                                <span className="italic font-light">
                                    booking number.
                                </span>
                            </h2>

                            <div className="space-y-5 mt-7 text-gray-600 text-lg leading-relaxed">
                                <p>
                                    We cap our groups small so every traveler
                                    gets attention. We reply to every email
                                    personally. We greet you at the airport by
                                    name. And when your trek is over, we want
                                    you to leave with stories worth telling.
                                </p>

                                <p>
                                    If something isn't right, we fix it. If
                                    plans change, we adapt. That's how we've
                                    built a team that travelers come back to —
                                    and bring their friends with.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                FINAL CTA
            ====================================================== */}
            <section className="relative min-h-[60vh] flex items-center overflow-hidden">
                <img
                    src={poonHillBg}
                    alt="Himalayan mountains"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-[#081426]/75" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
                    <p className="uppercase tracking-[0.4em] text-[#d6aa63] text-xs font-semibold mb-6">
                        Your story starts here
                    </p>

                    <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-tight">
                        Ready to find
                        <br />
                        <span className="italic font-light">
                            your trail?
                        </span>
                    </h2>

                    <p className="max-w-xl mx-auto mt-7 text-white/70 text-lg leading-relaxed">
                        Browse our curated routes or reach out. We'd love to
                        hear where you want to go.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 mt-9">
                        <Link
                            to="/packages"
                            className="rounded-xl bg-[#c99b52] hover:bg-[#b88b43] px-8 py-4 text-white font-semibold shadow-xl transition"
                        >
                            Browse Packages
                        </Link>

                        <Link
                            to="/contact"
                            className="rounded-xl border border-white/40 bg-white/5 backdrop-blur-sm px-8 py-4 text-white font-semibold hover:bg-white hover:text-[#18243a] transition"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

/* ================================================================
   STAT
================================================================ */

function Stat({ number, label }) {
    return (
        <div>
            <p className="font-serif text-4xl text-[#18243a]">{number}</p>
            <p className="text-xs uppercase tracking-widest text-gray-400 mt-2">
                {label}
            </p>
        </div>
    );
}

/* ================================================================
   VALUE CARD
================================================================ */

function ValueCard({ icon: Icon, title, description }) {
    return (
        <div className="group bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:bg-white/[0.08] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#c99b52]/10 border border-[#c99b52]/20 flex items-center justify-center mb-7">
                <Icon className="w-5 h-5 text-[#d6aa63]" />
            </div>

            <h3 className="font-serif text-2xl text-white">
                {title}
            </h3>

            <p className="text-sm text-white/55 leading-relaxed mt-3">
                {description}
            </p>
        </div>
    );
}

/* ================================================================
   BULLET
================================================================ */

function Bullet({ text }) {
    return (
        <li className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#c99b52] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <span className="text-sm text-white/80 leading-relaxed">
                {text}
            </span>
        </li>
    );
}

/* ================================================================
   JOURNAL SLIDE
================================================================ */

function JournalSlide({ src, alt }) {
    return (
        <div className="relative flex-shrink-0 w-[280px] sm:w-[340px] md:w-[390px] aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-gray-100 snap-start group">
            <img
                src={src}
                alt={alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

            <p className="absolute bottom-5 left-5 right-5 text-white font-serif text-xl drop-shadow">
                {alt}
            </p>
        </div>
    );
}

/* ================================================================
   SLIDER ARROW
================================================================ */

function SliderArrow({ direction, targetId }) {
    const handleClick = () => {
        const slider = document.getElementById(targetId);

        if (!slider) return;

        slider.scrollBy({
            left: direction === "left" ? -400 : 400,
            behavior: "smooth",
        });
    };

    const Icon =
        direction === "left" ? ChevronLeft : ChevronRight;

    return (
        <button
            onClick={handleClick}
            className="w-11 h-11 rounded-full border border-gray-300 bg-white flex items-center justify-center text-[#18243a] hover:bg-[#18243a] hover:text-white hover:border-[#18243a] transition-all duration-300"
            aria-label={
                direction === "left"
                    ? "Scroll left"
                    : "Scroll right"
            }
        >
            <Icon className="w-5 h-5" />
        </button>
    );
}
