"use client";

import { motion } from "framer-motion";
import { StarIcon, ClockIcon, RocketIcon } from "lucide-react";

interface Feature {
  feature: string;
  description: string;
  rationale?: string;
  business_impact?: string;
}

interface FeatureCategories {
  must_have: Feature[];
  nice_to_have: Feature[];
  future_enhancements: Feature[];
}

const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemAnimation = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function FeatureCategories({
  data,
}: {
  data: { feature_categories: FeatureCategories };
}) {
  const categories = [
    {
      title: "Must Have Features",
      features: data.feature_categories.must_have,
      icon: StarIcon,
      bgColor: "bg-blue-500",
      textColor: "text-blue-700",
      bgLight: "bg-blue-50",
    },
    {
      title: "Nice to Have Features",
      features: data.feature_categories.nice_to_have,
      icon: ClockIcon,
      bgColor: "bg-purple-500",
      textColor: "text-purple-700",
      bgLight: "bg-purple-50",
    },
    {
      title: "Future Enhancements",
      features: data.feature_categories.future_enhancements,
      icon: RocketIcon,
      bgColor: "bg-green-500",
      textColor: "text-green-700",
      bgLight: "bg-green-50",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Feature Categories
      </h2>

      <motion.div
        className="grid md:grid-cols-3 gap-6"
        variants={containerAnimation}
        initial="hidden"
        animate="show"
      >
        {categories.map((category, idx) => (
          <motion.div
            key={category.title}
            variants={itemAnimation}
            className="space-y-4"
          >
            <div className={`rounded-lg p-4 ${category.bgLight}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${category.bgColor}`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {category.title}
                </h3>
              </div>

              <div className="space-y-4">
                {category.features.map((feature, index) => (
                  <motion.div
                    key={feature.feature}
                    variants={itemAnimation}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <h4 className={`font-medium ${category.textColor} mb-2`}>
                      {feature.feature}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {feature.description}
                    </p>
                    {feature.rationale && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Rationale:</span>{" "}
                          {feature.rationale}
                        </p>
                      </div>
                    )}
                    {feature.business_impact && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded">
                          Impact: {feature.business_impact}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
