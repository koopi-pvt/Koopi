"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function AuthHeader() {
  const t = useTranslations("AuthHeader");

  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-600">
        {t("subtitle")}{" "}
        <Link href="/terms" className="text-blue-600 hover:underline">
          {t("terms")}
        </Link>
        .
      </p>
    </div>
  );
}