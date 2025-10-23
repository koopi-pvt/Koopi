"use client";

import { useTranslations } from "next-intl";

const Terms = () => {
  const t = useTranslations("Terms");

  return (
    <section className="relative bg-gradient-to-b from-blue-50/50 to-white py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
              {t("title")}
            </h1>
            <p className="text-lg text-gray-600">
              {t("lastUpdated")}: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/70 p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              {/* Section 1: Acceptance of Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. {t("section1.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("section1.content")}
                </p>
              </section>

              {/* Section 2: Use of Service */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. {t("section2.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("section2.content")}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>{t("section2.list1")}</li>
                  <li>{t("section2.list2")}</li>
                  <li>{t("section2.list3")}</li>
                  <li>{t("section2.list4")}</li>
                </ul>
              </section>

              {/* Section 3: User Accounts */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. {t("section3.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("section3.content")}
                </p>
              </section>

              {/* Section 4: Intellectual Property */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. {t("section4.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("section4.content")}
                </p>
              </section>

              {/* Section 5: Payment and Billing */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. {t("section5.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("section5.content")}
                </p>
              </section>

              {/* Section 6: Limitation of Liability */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. {t("section6.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("section6.content")}
                </p>
              </section>

              {/* Section 7: Privacy Policy */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. {t("section7.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("section7.content")}
                </p>
              </section>

              {/* Section 8: Termination */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. {t("section8.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("section8.content")}
                </p>
              </section>

              {/* Section 9: Changes to Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. {t("section9.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("section9.content")}
                </p>
              </section>

              {/* Section 10: Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. {t("section10.title")}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t("section10.content")}
                </p>
                <div className="bg-blue-50 rounded-lg p-6 mt-4">
                  <p className="text-gray-800 font-medium">Email: support@koopi.com</p>
                  <p className="text-gray-800 font-medium">Address: Colombo, Sri Lanka</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terms;
