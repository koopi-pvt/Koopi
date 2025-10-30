"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageToggle({ className = "" }: { className?: string }) {
    const { i18n } = useTranslation();
    const current = i18n.language?.startsWith("si") ? "si" : "en";

    const change = async (lang: "en" | "si") => {
        if (current !== lang) await i18n.changeLanguage(lang);
    };

    return (
        <div className={`inline-flex items-center gap-1 p-1 rounded-full border border-gray-200 bg-white ${className}`}>
            <button
                onClick={() => change("en")}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${current === "en" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                aria-pressed={current === "en"}
            >
                EN
            </button>
            <button
                onClick={() => change("si")}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${current === "si" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                aria-pressed={current === "si"}
            >
                SI
            </button>
        </div>
    );
}
