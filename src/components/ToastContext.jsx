import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(
        (message, type = "success", duration = 3500) => {
            const id = Date.now() + Math.random();

            setToasts((prev) => [
                ...prev,
                { id, message, type, duration },
            ]);

            setTimeout(() => removeToast(id), duration);
        },
        [removeToast]
    );

    // Convenience wrappers
    const toast = {
        success: (msg, dur) => showToast(msg, "success", dur),
        error: (msg, dur) => showToast(msg, "error", dur),
        info: (msg, dur) => showToast(msg, "info", dur),
        warning: (msg, dur) => showToast(msg, "warning", dur),
    };

    return (
        <ToastContext.Provider value={{ toast, toasts, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
    return ctx.toast;
}

// ----------------------------------------
// Toast container + individual toast
// ----------------------------------------
function ToastContainer({ toasts, onDismiss }) {
    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
            ))}
        </div>
    );
}

const STYLES = {
    success: {
        bg: "bg-white",
        border: "border-green-200",
        accent: "bg-green-500",
        icon: "text-green-500",
        iconPath:
            "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    error: {
        bg: "bg-white",
        border: "border-red-200",
        accent: "bg-red-500",
        icon: "text-red-500",
        iconPath:
            "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    warning: {
        bg: "bg-white",
        border: "border-yellow-200",
        accent: "bg-yellow-500",
        icon: "text-yellow-500",
        iconPath:
            "M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z",
    },
    info: {
        bg: "bg-white",
        border: "border-blue-200",
        accent: "bg-blue-500",
        icon: "text-blue-500",
        iconPath:
            "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
};

function ToastItem({ toast, onDismiss }) {
    const s = STYLES[toast.type] || STYLES.info;

    return (
        <div
            className={`pointer-events-auto relative overflow-hidden rounded-xl border ${s.border} ${s.bg} shadow-lg animate-toast-in`}
        >
            {/* Left accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.accent}`} />

            <div className="flex items-start gap-3 pl-5 pr-4 py-3.5">
                {/* Icon */}
                <svg
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${s.icon}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d={s.iconPath} />
                </svg>

                {/* Message */}
                <p className="flex-1 text-sm text-slate-800 leading-snug">
                    {toast.message}
                </p>

                {/* Close */}
                <button
                    onClick={() => onDismiss(toast.id)}
                    className="text-slate-400 hover:text-slate-700 flex-shrink-0"
                    aria-label="Dismiss"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}