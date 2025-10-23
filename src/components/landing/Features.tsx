"use client";

import {
  Zap,
  Smartphone,
  ShieldCheck,
  BarChart2,
  Palette,
  LifeBuoy,
} from "lucide-react";
import { useTranslations } from "next-intl";

const Features = () => {
  const t = useTranslations("Features");

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      title: t("card1.title"),
      description: t("card1.description"),
    },
    {
      icon: <Smartphone className="h-6 w-6 text-blue-600" />,
      title: t("card2.title"),
      description: t("card2.description"),
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
      title: t("card3.title"),
      description: t("card3.description"),
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-blue-600" />,
      title: t("card4.title"),
      description: t("card4.description"),
    },
    {
      icon: <Palette className="h-6 w-6 text-blue-600" />,
      title: t("card5.title"),
      description: t("card5.description"),
    },
    {
      icon: <LifeBuoy className="h-6 w-6 text-blue-600" />,
      title: t("card6.title"),
      description: t("card6.description"),
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-gray-600">{t("subtitle")}</p>
        </div>
        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-8 bg-white rounded-2xl shadow-lg shadow-gray-200/40 border border-gray-200/70 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="inline-block bg-blue-100/70 rounded-lg p-4">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-base text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;