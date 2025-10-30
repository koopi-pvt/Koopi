"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageToggle({ className = "" }: { className?: string }) {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className={`flex items-center bg-gray-100 rounded-xl p-1 ${className}`}>
            <button
                onClick={() => changeLanguage('en')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    i18n.language === 'en'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                EN
            </button>
            <button
                onClick={() => changeLanguage('si')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    i18n.language === 'si'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                }`}
            >
                සිං
            </button>
        </div>
    );
}
