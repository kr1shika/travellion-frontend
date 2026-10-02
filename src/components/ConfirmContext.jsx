import { createContext, useCallback, useContext, useState } from "react";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
    const [state, setState] = useState({
        open: false,
        title: "",
        message: "",
        confirmText: "Confirm",
        cancelText: "Cancel",
        variant: "danger", // "danger" | "default"
        resolve: null,
    });

    const confirm = useCallback(
        ({
            title = "Are you sure?",
            message = "",
            confirmText = "Confirm",
            cancelText = "Cancel",
            variant = "danger",
        } = {}) => {
            return new Promise((resolve) => {
                setState({
                    open: true,
                    title,
                    message,
                    confirmText,
                    cancelText,
                    variant,
                    resolve,
                });
            });
        },
        []
    );

    const handleClose = (result) => {
        state.resolve?.(result);
        setState((s) => ({ ...s, open: false, resolve: null }));
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            {state.open && (
                <ConfirmDialog
                    title={state.title}
                    message={state.message}
                    confirmText={state.confirmText}
                    cancelText={state.cancelText}
                    variant={state.variant}
                    onConfirm={() => handleClose(true)}
                    onCancel={() => handleClose(false)}
                />
            )}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error("useConfirm must be used inside <ConfirmProvider>");
    return ctx;
}

// ----------------------------------------
// Dialog UI
// ----------------------------------------
function ConfirmDialog({
    title,
    message,
    confirmText,
    cancelText,
    variant,
    onConfirm,
    onCancel,
}) {
    const isDanger = variant === "danger";

    return (
        <div
            className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${
                                isDanger
                                    ? "bg-red-100 text-red-600"
                                    : "bg-blue-100 text-blue-600"
                            }`}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
                            </svg>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900">
                                {title}
                            </h3>
                            {message && (
                                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                                    {message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        autoFocus
                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition ${
                            isDanger
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-slate-950 hover:bg-slate-800"
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}