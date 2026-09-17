import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminFetch } from "../../utils/adminFetch";

export default function AdminItineraryForm() {
    const { packageId } = useParams();
    const navigate = useNavigate();

    const [packageData, setPackageData] = useState(null);
    const [itinerary, setItinerary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ----------------------------------------
    // Load package + its itinerary
    // ----------------------------------------
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await adminFetch(`/packages/${packageId}`);
                if (!data.success) throw new Error(data.message);

                const p = data.data;
                setPackageData(p);

                // Sort days ascending
                const sorted = [...(p.itinerary || [])].sort(
                    (a, b) => a.day - b.day
                );
                setItinerary(sorted);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [packageId]);

    // ----------------------------------------
    // Day operations
    // ----------------------------------------
    const addDay = () => {
        setItinerary((prev) => [
            ...prev,
            {
                day: prev.length + 1,
                title: "",
                description: "",
                distance: "",
                altitude: { meters: "", feet: "" },
                accommodation: "",
                meals: { breakfast: true, lunch: true, dinner: true },
            },
        ]);
    };

    const removeDay = (index) => {
        const next = itinerary.filter((_, i) => i !== index);
        // Renumber remaining days
        setItinerary(
            next.map((d, i) => ({ ...d, day: i + 1 }))
        );
    };

    const moveDay = (index, direction) => {
        const target = index + direction;
        if (target < 0 || target >= itinerary.length) return;

        const copy = [...itinerary];
        [copy[index], copy[target]] = [copy[target], copy[index]];

        // Renumber
        setItinerary(copy.map((d, i) => ({ ...d, day: i + 1 })));
    };

    const updateField = (index, field, value) => {
        setItinerary((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    const updateAltitude = (index, key, value) => {
        setItinerary((prev) => {
            const copy = [...prev];
            copy[index] = {
                ...copy[index],
                altitude: {
                    ...(copy[index].altitude || {}),
                    [key]: value,
                },
            };
            return copy;
        });
    };

    const updateMeal = (index, meal, value) => {
        setItinerary((prev) => {
            const copy = [...prev];
            copy[index] = {
                ...copy[index],
                meals: {
                    ...(copy[index].meals || {}),
                    [meal]: value,
                },
            };
            return copy;
        });
    };

    // ----------------------------------------
    // Save
    // ----------------------------------------
    const handleSave = async () => {
        setError("");
        setSuccess("");

        // Validate
        for (let i = 0; i < itinerary.length; i++) {
            const day = itinerary[i];
            if (!day.title?.trim()) {
                setError(`Day ${i + 1}: Title is required`);
                return;
            }
            if (!day.description?.trim()) {
                setError(`Day ${i + 1}: Description is required`);
                return;
            }
        }

        setSaving(true);

        try {
            // Send ONLY itinerary — package PUT replaces itinerary fully
            const payload = {
                itinerary: itinerary.map((d, i) => ({
                    day: i + 1,
                    title: d.title.trim(),
                    description: d.description.trim(),
                    distance: d.distance || "",
                    altitude: {
                        meters: d.altitude?.meters
                            ? Number(d.altitude.meters)
                            : undefined,
                        feet: d.altitude?.feet
                            ? Number(d.altitude.feet)
                            : undefined,
                    },
                    accommodation: d.accommodation || "",
                    meals: d.meals || {
                        breakfast: true,
                        lunch: true,
                        dinner: true,
                    },
                })),
            };

            const { data } = await adminFetch(`/packages/${packageId}`, {
                method: "PUT",
                body: JSON.stringify(payload),
            });

            if (!data.success) throw new Error(data.message);

            setSuccess("Itinerary saved successfully");

            setTimeout(() => {
                navigate("/admin/itineraries");
            }, 800);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // ----------------------------------------
    // Loading state
    // ----------------------------------------
    if (loading) {
        return <p className="text-slate-500">Loading itinerary...</p>;
    }

    if (!packageData) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">Package not found.</p>
                <Link
                    to="/admin/itineraries"
                    className="mt-4 inline-block text-sm font-semibold text-slate-900 underline"
                >
                    Back to itineraries
                </Link>
            </div>
        );
    }

    // ----------------------------------------
    // Render
    // ----------------------------------------
    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Link
                    to="/admin/itineraries"
                    className="text-sm text-slate-500 hover:text-slate-900"
                >
                    ← Back to itineraries
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 mt-2">
                    {itinerary.length > 0 ? "Edit Itinerary" : "Add Itinerary"}
                </h1>
                <p className="text-sm text-slate-500">
                    {packageData.name} · {packageData.duration?.days} day
                    {packageData.duration?.days !== 1 && "s"} ·{" "}
                    {itinerary.length} day
                    {itinerary.length !== 1 && "s"} added
                </p>
            </div>

            {/* Alerts */}
            {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            {/* Progress indicator */}
            {packageData.duration?.days > 0 && (
                <div className="mb-6 bg-white rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-slate-700">
                            Progress
                        </p>
                        <p className="text-sm text-slate-500">
                            {itinerary.length} / {packageData.duration.days} days
                        </p>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-slate-900 transition-all"
                            style={{
                                width: `${Math.min(
                                    100,
                                    (itinerary.length / packageData.duration.days) *
                                        100
                                )}%`,
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Days */}
            <div className="space-y-4">
                {itinerary.map((day, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
                    >
                        {/* Day header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-slate-900 text-white text-xs font-bold px-3 py-1">
                                    Day {i + 1}
                                </span>
                                {day.title && (
                                    <span className="text-sm text-slate-500 truncate max-w-xs">
                                        {day.title}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => moveDay(i, -1)}
                                    disabled={i === 0}
                                    className="text-sm text-slate-500 hover:text-slate-900 disabled:opacity-30"
                                    title="Move up"
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveDay(i, 1)}
                                    disabled={i === itinerary.length - 1}
                                    className="text-sm text-slate-500 hover:text-slate-900 disabled:opacity-30"
                                    title="Move down"
                                >
                                    ↓
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeDay(i)}
                                    className="text-sm text-red-600 hover:text-red-800 ml-2"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                                value={day.title}
                                onChange={(e) =>
                                    updateField(i, "title", e.target.value)
                                }
                                placeholder="Fly to Lukla & Trek to Phakding"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={3}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                                value={day.description}
                                onChange={(e) =>
                                    updateField(i, "description", e.target.value)
                                }
                                placeholder="An early morning flight to Lukla, then trek through..."
                            />
                        </div>

                        {/* Distance & Accommodation */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Distance / Duration
                                </label>
                                <input
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                                    value={day.distance || ""}
                                    onChange={(e) =>
                                        updateField(i, "distance", e.target.value)
                                    }
                                    placeholder="5-6 hours"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Accommodation
                                </label>
                                <input
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                                    value={day.accommodation || ""}
                                    onChange={(e) =>
                                        updateField(i, "accommodation", e.target.value)
                                    }
                                    placeholder="Tea House"
                                />
                            </div>
                        </div>

                        {/* Altitude */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Altitude (m)
                                </label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                                    value={day.altitude?.meters || ""}
                                    onChange={(e) =>
                                        updateAltitude(i, "meters", e.target.value)
                                    }
                                    placeholder="2840"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Altitude (ft)
                                </label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                                    value={day.altitude?.feet || ""}
                                    onChange={(e) =>
                                        updateAltitude(i, "feet", e.target.value)
                                    }
                                    placeholder="9318"
                                />
                            </div>
                        </div>

                        {/* Meals */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Meals Included
                            </label>
                            <div className="flex gap-4">
                                {["breakfast", "lunch", "dinner"].map((meal) => (
                                    <label
                                        key={meal}
                                        className="flex items-center gap-2 text-sm capitalize text-slate-700"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={day.meals?.[meal] || false}
                                            onChange={(e) =>
                                                updateMeal(i, meal, e.target.checked)
                                            }
                                        />
                                        {meal}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {itinerary.length === 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <p className="text-slate-500">
                            No itinerary days yet. Add the first day below.
                        </p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={addDay}
                    className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-100"
                >
                    + Add Day
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-slate-950 px-6 py-3 text-white font-semibold hover:bg-slate-800 disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save Itinerary"}
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/admin/itineraries")}
                    className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}