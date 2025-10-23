"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const Hero = () => {
  const t = useTranslations("Hero");

  return (
    <section
      id="hero"
      className="relative bg-gray-50/50 pt-32 pb-24 sm:pt-40 sm:pb-32 lg:pt-48 lg:pb-40"
    >
      {/* Background Gradient Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[32rem] h-[32rem] bg-purple-100 rounded-full opacity-50 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            {t("title1")}
            <br />
            <span className="text-blue-600">{t("title2")}</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
            >
              {t("primaryCta")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="#"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-gray-300/70 text-base font-semibold rounded-lg text-gray-700 bg-white/70 backdrop-blur-sm hover:bg-white transition-colors"
            >
              {t("secondaryCta")}
            </a>
          </div>
        </div>

        {/* Simplified Visual Element */}
        <div className="mt-20">
          <div className="relative bg-white rounded-2xl shadow-2xl shadow-gray-500/20 p-2 border border-gray-200/50 max-w-4xl mx-auto">
            <div className="flex items-center gap-1.5 p-2 border-b border-gray-200/70">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="aspect-video bg-gray-100 rounded-b-xl p-4 sm:p-6 lg:p-8">
              <div className="bg-white h-full w-full rounded-lg shadow-inner shadow-gray-200/50">
                {/* Placeholder for a clean storefront UI */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
