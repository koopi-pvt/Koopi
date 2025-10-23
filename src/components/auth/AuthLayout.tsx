"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export default function AuthLayout() {
  const t = useTranslations("AuthLayout");
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = t.raw("testimonials") as Testimonial[];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between w-full px-12 py-16">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-400">
            {t("subtitle")}
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-opacity duration-1000 ${
                index === activeIndex ? "opacity-100" : "opacity-0 absolute"
              }`}
            >
              <p className="text-2xl text-white font-medium">
                "{testimonial.quote}"
              </p>
              <p className="mt-4 text-gray-300">
                - {testimonial.name}, {testimonial.role}
              </p>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? "bg-white" : "bg-gray-600 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}