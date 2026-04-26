import { create } from "zustand";

export const useAnalysisStore = create((set) => ({
    pdfFile: null,
    pdfPath: "",
    transactions: [],
    summary: null,
    cardRecs: null,
    status: "",
    loading: false,

    setState: (data) => set((state) => ({ ...state, ...data })),
    reset: () =>
        set({
            pdfFile: null,
            pdfPath: "",
            transactions: [],
            summary: null,
            cardRecs: null,
            status: "",
            loading: false
        }),
}));
