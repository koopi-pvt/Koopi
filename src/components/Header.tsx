"use client";

import { useState } from "react";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const Header = () => {
  const t = useTranslations("Header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isLangOpenMobile, setIsLangOpenMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/");
  const currentLang = segments[1] === "si" ? "SI" : "EN";
  const localePrefix = `/${segments[1] || "en"}`;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsLangOpenMobile(false);
  };

  const handleLanguageChange = (locale: string) => {
    const newPath = `/${locale}${pathname.substring(3)}`;
    router.push(newPath);
    setIsLangOpen(false);
    setIsLangOpenMobile(false);
  };

  return (
    <>
      {/* Desktop Dock Header */}
      <header className="hidden md:flex fixed top-5 left-1/2 -translate-x-1/2 z-50">
        <nav className="flex items-center gap-1 bg-gradient-to-b from-white/70 to-white/50 backdrop-blur-2xl shadow-2xl shadow-gray-900/20 rounded-2xl p-2 border border-white/40 ring-1 ring-black/5">
          <a
            href={`${localePrefix}`}
            className="text-xl font-bold text-black px-4 py-1"
          >
            Koopi
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2.5 rounded-xl transition-all hover:bg-white/70 hover:shadow-sm flex items-center justify-center relative group"
          >
            {t("features")}
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-3/4 transition-all duration-300"></span>
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2.5 rounded-xl transition-all hover:bg-white/70 hover:shadow-sm flex items-center justify-center relative group"
          >
            {t("about")}
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-3/4 transition-all duration-300"></span>
          </a>
          <a
            href={`${localePrefix}/login`}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2.5 rounded-xl transition-all hover:bg-white/70 hover:shadow-sm flex items-center justify-center"
          >
            {t("login")}
          </a>
          <a
            href={`${localePrefix}/signup`}
            className="text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 flex items-center justify-center"
          >
            {t("startFree")}
          </a>
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-1"></div>
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/70 transition-all hover:shadow-sm"
            >
              <Globe className="h-4 w-4" />
              {currentLang}
              <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`} />
            </button>
            {isLangOpen && (
              <div className="absolute top-full mt-2 right-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden min-w-[140px] ring-1 ring-black/5">
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-all ${
                    currentLang === "EN" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange("si")}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-all ${
                    currentLang === "SI" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  සිංහල
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-gray-200/60 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a 
              href="#" 
              className="text-2xl font-bold text-black"
            >
              Koopi
            </a>
            <button
              onClick={toggleMenu}
              className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="bg-gradient-to-b from-white/98 to-white/95 backdrop-blur-2xl border-t border-gray-200/60 shadow-xl">
            <div className="container mx-auto px-4 py-6">
              {/* Navigation Links */}
              <div className="space-y-2 mb-6">
                <a
                  href="#features"
                  className="flex items-center justify-center px-4 py-3.5 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all active:scale-98 border border-transparent hover:border-blue-100"
                >
                  {t("features")}
                </a>
                <a
                  href="#about"
                  className="flex items-center justify-center px-4 py-3.5 rounded-xl text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all active:scale-98 border border-transparent hover:border-blue-100"
                >
                  {t("about")}
                </a>
              </div>

              {/* Language Selector */}
              <div className="mb-6">
                <button
                  onClick={() => setIsLangOpenMobile(!isLangOpenMobile)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 active:scale-98"
                >
                  <Globe className="h-5 w-5" />
                  {currentLang === "EN" ? "English" : "සිංහල"}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isLangOpenMobile ? "rotate-180" : ""}`} />
                </button>
                {isLangOpenMobile && (
                  <div className="mt-2 space-y-2 bg-white/50 backdrop-blur-xl rounded-xl p-2 border border-gray-200">
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium transition-all active:scale-98 ${
                        currentLang === "EN"
                          ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-200"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLanguageChange("si")}
                      className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium transition-all active:scale-98 ${
                        currentLang === "SI"
                          ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-200"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      සිංහල
                    </button>
                  </div>
                )}
              </div>

              {/* Auth Buttons */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <a
                  href={`${localePrefix}/login`}
                  className="flex items-center justify-center px-4 py-3.5 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 active:scale-98"
                >
                  {t("login")}
                </a>
                <a
                  href={`${localePrefix}/signup`}
                  className="flex items-center justify-center px-4 py-3.5 rounded-xl text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 active:scale-98"
                >
                  {t("startFree")}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-0"></div>
    </>
  );
};

export default Header;