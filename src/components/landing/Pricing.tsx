"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

const Pricing = () => {
  const t = useTranslations("Pricing");

  return (
    <section id="pricing" className="py-16 sm:py-24 lg:py-32 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="mt-20 grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200/70 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900">
              {t("free.title")}
            </h3>
            <p className="mt-4 text-gray-600 flex-grow">
              {t("free.description")}
            </p>
            <p className="mt-8 text-5xl font-bold text-gray-900">
              {t("free.price")}{" "}
              <span className="text-xl font-medium text-gray-500">
                {t("free.period")}
              </span>
            </p>
            <ul className="mt-8 space-y-4 text-left">
              {t.raw("free.features").map((feature: string) => (
                <FeatureListItem key={feature}>{feature}</FeatureListItem>
              ))}
            </ul>
            <div className="mt-10">
              <a
                href="#"
                className="block w-full text-center bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold text-base hover:bg-blue-700 transition-colors"
              >
                {t("free.cta")}
              </a>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200/70 flex flex-col">
            <div className="flex justify-between items-baseline">
              <h3 className="text-xl font-semibold text-gray-900">
                {t("pro.title")}
              </h3>
              <p className="text-sm font-semibold text-blue-600">
                {t("pro.badge")}
              </p>
            </div>
            <p className="mt-4 text-gray-600 flex-grow">
              {t("pro.description")}
            </p>
            <p className="mt-8 text-5xl font-bold text-gray-400">
              {t("pro.price")}
            </p>
            <ul className="mt-8 space-y-4 text-left">
              {t.raw("pro.features").map((feature: string) => (
                <FeatureListItem key={feature}>{feature}</FeatureListItem>
              ))}
            </ul>
            <div className="mt-10">
              <button
                disabled
                className="block w-full text-center bg-gray-100 text-gray-400 px-6 py-4 rounded-lg font-semibold text-base cursor-not-allowed"
              >
                {t("pro.cta")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center">
    <Check className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
    <span className="text-gray-700">{children}</span>
  </li>
);

export default Pricing;
