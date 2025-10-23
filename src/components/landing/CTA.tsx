"use client";

import { useTranslations } from "next-intl";

const CTA = () => {
  const t = useTranslations("CTA");

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient Accents */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center px-8 py-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {t("title")}
            </h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {t("primaryCta")}
              </a>
              <a
                href="#"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-900 bg-white hover:bg-gray-50 transition-colors"
              >
                {t("secondaryCta")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;