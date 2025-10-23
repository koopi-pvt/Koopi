"use client";

import { Github, Linkedin, Twitter } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

const Footer = () => {
  const t = useTranslations("Footer");
  const locale = useLocale();

  return (
    <footer className="bg-white border-t border-gray-200/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-6">
          <p className="text-sm text-gray-500">{t("copyright")}</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-800">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-800">
              <Github size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-800">
              <Linkedin size={20} />
            </a>
            <Link
              href={`/${locale}/terms`}
              className="text-gray-500 hover:text-gray-800 text-sm"
            >
              {t("terms")}
            </Link>
            <a href="#" className="text-gray-500 hover:text-gray-800 text-sm">
              {t("privacy")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;