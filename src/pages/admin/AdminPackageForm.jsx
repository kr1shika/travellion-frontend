import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { adminFetch } from "../../utils/adminFetch";

const API_URL = "http://localhost:5000/api";

export default function AdminPackageForm() {
    const navigate = useNavigate();
    const { id } = useParams(); // present when editing
    const isEdit = Boolean(id);
    const [searchParams] = useSearchParams();
    const itineraryRef = useRef(null);

    const [form, setForm] = useState({
        name: "",
        category: "Trekking",
        priceUsd: "",
        priceNpr: "",
        durationDays: "",
        durationNights: "",
        country: "Nepal",
        region: "",
        maxAltitudeMeters: "",
        maxAltitudeFeet: "",
        difficulty: "Moderate",
        activity: "Trekking/Hiking",
        seasonDisplay: "",
        accommodation: "",
        mealsIncluded: "",
        overview: "",
        description: "",
        status: "Draft",
        isFeatured: false,
        isPopular: false,
    });

    const [highlights, setHighlights] = useState([""]);
    const [exclusions, setExclusions] = useState([""]);
    const [images, setImages] = useState([]); // { url, caption, alt, isFeatured, order }
    const [itinerary, setItinerary] = useState([]);

    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Load package if editing
    useEffect(() => {
        if (!isEdit) return;

        (async () => {
            const { data } = await adminFetch(`/packages/${id}`);
            if (data.success) {
                const p = data.data;
                setForm({
                    name: p.name || "",
                    category: p.category || "Trekking",
                    priceUsd: p.price?.usd || "",
                    priceNpr: p.price?.npr || "",
                    durationDays: p.duration?.days || "",
                    durationNights: p.duration?.nights || "",
                    country: p.country || "Nepal",
                    region: p.region || "",
                    maxAltitudeMeters: p.maxAltitude?.meters || "",
                    maxAltitudeFeet: p.maxAltitude?.feet || "",
                    difficulty: p.difficulty || "Moderate",
                    activity: p.activity || "Trekking/Hiking",
                    seasonDisplay: p.seasonDisplay || "",
                    accommodation: p.accommodation || "",
                    mealsIncluded: p.mealsIncluded || "",
                    overview: p.overview || "",
                    description: p.description || "",
                    status: p.status || "Draft",
                    isFeatured: p.isFeatured || false,
                    isPopular: p.isPopular || false,
                });
                setHighlights(p.highlights?.length ? p.highlights : [""]);
                setExclusions(p.exclusions?.length ? p.exclusions : [""]);
                setImages(p.images || []);
                setItinerary(p.itinerary || []);
            }
        })();
    }, [id]);
    useEffect(() => {
        if (
            searchParams.get("focus") === "itinerary" &&
            itineraryRef.current
        ) {
            setTimeout(() => {
                itineraryRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 300);
        }
    }, [searchParams, itinerary]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // ---- image upload ----
    const handleImageUpload = async (files) => {
        if (!files || files.length === 0) return;
        if (images.length + files.length > 5) {
            setError("Maximum 5 images allowed");
            return;
        }

        setError("");
        setUploading(true);

        try {
            const formData = new FormData();
            Array.from(files).forEach((f) => formData.append("images", f));
            // No packageId — this is a new package

            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_URL}/images/upload-multiple`, {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
            });
            const data = await res.json();

            if (!data.success) throw new Error(data.message);

            // Keep the full image object (including _id) so backend can link it later
            setImages((prev) => [
                ...prev,
                ...data.data.map((img, i) => ({
                    _id: img._id,
                    url: img.url,
                    caption: img.caption || "",
                    alt: img.alt || "",
                    isFeatured: prev.length === 0 && i === 0,
                    order: prev.length + i,
                })),
            ]);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const setFeaturedImage = (index) => {
        setImages(
            images.map((img, i) => ({ ...img, isFeatured: i === index }))
        );
    };

    // ---- itinerary ----
    const addItineraryDay = () => {
        setItinerary([
            ...itinerary,
            {
                day: itinerary.length + 1,
                title: "",
                description: "",
                altitude: { meters: "", feet: "" },
                accommodation: "",
                distance: "",
                meals: { breakfast: true, lunch: true, dinner: true },
            },
        ]);
    };

    const updateItinerary = (index, field, value) => {
        const copy = [...itinerary];
        copy[index][field] = value;
        setItinerary(copy);
    };

    const removeItineraryDay = (index) => {
        setItinerary(itinerary.filter((_, i) => i !== index));
    };

    // ---- submit ----
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        try {
            const payload = {
                name: form.name,

                category: form.category,
                price: {
                    usd: Number(form.priceUsd),
                    npr: form.priceNpr ? Number(form.priceNpr) : undefined,
                },
                duration: {
                    days: Number(form.durationDays),
                    nights: form.durationNights
                        ? Number(form.durationNights)
                        : undefined,
                },
                country: form.country,
                region: form.region,
                maxAltitude: {
                    meters: form.maxAltitudeMeters
                        ? Number(form.maxAltitudeMeters)
                        : undefined,
                    feet: form.maxAltitudeFeet
                        ? Number(form.maxAltitudeFeet)
                        : undefined,
                },
                difficulty: form.difficulty,
                activity: form.activity,
                seasonDisplay: form.seasonDisplay,
                accommodation: form.accommodation,
                mealsIncluded: form.mealsIncluded,
                overview: form.overview,
                description: form.description,
                status: form.status,
                isFeatured: form.isFeatured,
                isPopular: form.isPopular,
                highlights: highlights.filter((h) => h.trim()),
                exclusions: exclusions.filter((e) => e.trim()),
                images,
                itinerary: itinerary.map((it, i) => ({
                    ...it,
                    day: i + 1,
                    altitude: {
                        meters: it.altitude?.meters
                            ? Number(it.altitude.meters)
                            : undefined,
                        feet: it.altitude?.feet
                            ? Number(it.altitude.feet)
                            : undefined,
                    },
                })),
            };

            const endpoint = isEdit ? `/packages/${id}` : "/packages";
            const method = isEdit ? "PUT" : "POST";

            const { data } = await adminFetch(endpoint, {
                method,
                body: JSON.stringify(payload),
            });

            if (!data.success) throw new Error(data.message);

            navigate("/admin/packages");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">
                {isEdit ? "Edit Package" : "New Package"}
            </h1>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* BASIC INFO */}
                <Section title="Basic Info">
                    <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
                    <Select label="Category" name="category" value={form.category} onChange={handleChange}
                        options={["Trekking", "Hiking", "Tour", "Expedition", "Adventure"]} />
                    <Select label="Difficulty" name="difficulty" value={form.difficulty} onChange={handleChange}
                        options={["Easy", "Moderate", "Strenuous", "Challenging", "Extreme"]} />
                    <Select label="Activity" name="activity" value={form.activity} onChange={handleChange}
                        options={["Trekking/Hiking", "Climbing", "Sightseeing", "Cultural Tour", "Wildlife Safari"]} />
                    <Select label="Status" name="status" value={form.status} onChange={handleChange}
                        options={["Draft", "Published", "Archived"]} />
                </Section>

                {/* LOCATION & DURATION */}
                <Section title="Location & Duration">
                    <Input label="Country" name="country" value={form.country} onChange={handleChange} />
                    <Input label="Region" name="region" value={form.region} onChange={handleChange} required />
                    <Input label="Duration (days)" name="durationDays" type="number" value={form.durationDays} onChange={handleChange} required />
                    <Input label="Duration (nights)" name="durationNights" type="number" value={form.durationNights} onChange={handleChange} />
                    <Input label="Max Altitude (m)" name="maxAltitudeMeters" type="number" value={form.maxAltitudeMeters} onChange={handleChange} />
                    <Input label="Max Altitude (ft)" name="maxAltitudeFeet" type="number" value={form.maxAltitudeFeet} onChange={handleChange} />
                </Section>

                {/* PRICING */}
                <Section title="Pricing">
                    <Input label="Price (USD)" name="priceUsd" type="number" value={form.priceUsd} onChange={handleChange} required />
                    <Input label="Price (NPR)" name="priceNpr" type="number" value={form.priceNpr} onChange={handleChange} />
                </Section>

                {/* DETAILS */}
                <Section title="Details">
                    <Input label="Best Season" name="seasonDisplay" value={form.seasonDisplay} onChange={handleChange} placeholder="Mar-May, Sep-Nov" />
                    <Input label="Accommodation" name="accommodation" value={form.accommodation} onChange={handleChange} />
                    <Input label="Meals Included" name="mealsIncluded" value={form.mealsIncluded} onChange={handleChange} />
                </Section>

                <Section title="Description">
                    <Textarea label="Overview" name="overview" value={form.overview} onChange={handleChange} required />
                    <Textarea label="Description" name="description" value={form.description} onChange={handleChange} required />
                </Section>

                {/* HIGHLIGHTS */}
                <Section title="Highlights">
                    {highlights.map((h, i) => (
                        <div key={i} className="flex gap-2">
                            <input
                                className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                                value={h}
                                onChange={(e) => {
                                    const copy = [...highlights];
                                    copy[i] = e.target.value;
                                    setHighlights(copy);
                                }}
                            />
                            <button type="button" onClick={() => setHighlights(highlights.filter((_, x) => x !== i))}
                                className="text-red-600 text-sm">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => setHighlights([...highlights, ""])}
                        className="text-sm text-slate-700 underline">+ Add highlight</button>
                </Section>

                {/* EXCLUSIONS */}
                <Section title="Exclusions">
                    {exclusions.map((ex, i) => (
                        <div key={i} className="flex gap-2">
                            <input
                                className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                                value={ex}
                                onChange={(e) => {
                                    const copy = [...exclusions];
                                    copy[i] = e.target.value;
                                    setExclusions(copy);
                                }}
                            />
                            <button type="button" onClick={() => setExclusions(exclusions.filter((_, x) => x !== i))}
                                className="text-red-600 text-sm">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => setExclusions([...exclusions, ""])}
                        className="text-sm text-slate-700 underline">+ Add exclusion</button>
                </Section>

                {/* IMAGES */}
                <Section title="Images (max 5)">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e.target.files)}
                        disabled={uploading}
                        className="block w-full text-sm"
                    />
                    {uploading && <p className="text-xs text-slate-500">Uploading...</p>}

                    <div className="grid grid-cols-3 gap-3 mt-3">
                        {images.map((img, i) => (
                            <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200">
                                <img src={img.url} alt="" className="w-full h-32 object-cover" />
                                {img.isFeatured && (
                                    <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-0.5 rounded">
                                        Featured
                                    </span>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 flex justify-between">
                                    <button type="button" onClick={() => setFeaturedImage(i)}
                                        className="text-xs text-white">Set featured</button>
                                    <button type="button" onClick={() => removeImage(i)}
                                        className="text-xs text-red-300">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* ITINERARY */}
                <div ref={itineraryRef}>

                    <Section title="Itinerary">
                        {itinerary.map((day, i) => (
                            <div key={i} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">Day {i + 1}</p>
                                    <button type="button" onClick={() => removeItineraryDay(i)}
                                        className="text-red-600 text-sm">Remove day</button>
                                </div>
                                <input placeholder="Title" className="w-full rounded border px-3 py-2"
                                    value={day.title}
                                    onChange={(e) => updateItinerary(i, "title", e.target.value)} />
                                <textarea placeholder="Description" className="w-full rounded border px-3 py-2"
                                    value={day.description}
                                    onChange={(e) => updateItinerary(i, "description", e.target.value)} />
                                <div className="grid grid-cols-3 gap-2">
                                    <input placeholder="Distance (hrs)" className="rounded border px-3 py-2"
                                        value={day.distance || ""}
                                        onChange={(e) => updateItinerary(i, "distance", e.target.value)} />
                                    <input placeholder="Altitude m" type="number" className="rounded border px-3 py-2"
                                        value={day.altitude?.meters || ""}
                                        onChange={(e) => updateItinerary(i, "altitude", {
                                            ...day.altitude, meters: e.target.value
                                        })} />
                                    <input placeholder="Accommodation" className="rounded border px-3 py-2"
                                        value={day.accommodation || ""}
                                        onChange={(e) => updateItinerary(i, "accommodation", e.target.value)} />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addItineraryDay}
                            className="text-sm text-slate-700 underline">+ Add day</button>
                    </Section>
                </div>


                {/* SUBMIT */}
                <div className="flex gap-3">
                    <button type="submit" disabled={saving}
                        className="rounded-lg bg-slate-950 px-6 py-3 text-white font-semibold hover:bg-slate-800 disabled:opacity-60">
                        {saving ? "Saving..." : isEdit ? "Update Package" : "Create Package"}
                    </button>
                    <button type="button" onClick={() => navigate("/admin/packages")}
                        className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

// ---------- helpers ----------
function Section({ title, children }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">{title}</h2>
            {children}
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
                {...props}
            />
        </div>
    );
}

function Textarea({ label, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <textarea
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
                {...props}
            />
        </div>
    );
}

function Select({ label, options, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <select className="w-full rounded-lg border border-slate-300 px-3 py-2" {...props}>
                {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
        </div>
    );
}