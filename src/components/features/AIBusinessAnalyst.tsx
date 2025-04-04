"use client";

import { useState, useEffect } from "react";
import {
  User,
  ChevronRight,
  X,
  ArrowDown,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";

interface BaseFeature {
  feature: string;
  description: string;
}

interface MustHaveFeature extends BaseFeature {
  rationale: string;
  business_impact: string;
}

interface FeatureCategories {
  must_have: MustHaveFeature[];
  nice_to_have: BaseFeature[];
  future_enhancements: BaseFeature[];
}

interface Workflow {
  name: string;
  description: string;
  steps: Array<{
    step: number;
    action: string;
    system_response: string;
    features_used: string[];
  }>;
  success_criteria: string[];
}

interface Persona {
  type: string;
  description: string;
  workflows: Workflow[];
}

// interface BusinessAnalysisData {
//   personas: Persona[];
// }

interface UserPersonaResponse {
  message: string;
  userPersona: {
    _id: string;
    personas: Persona[];
    categorized_features: {
      feature_categories: FeatureCategories;
    };
  };
}

interface ComponentState {
  personas: Persona[];
  featureCategories: FeatureCategories | null;
}

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white shadow-lg text-gray-600 hover:text-blue-600 transition-colors"
  >
    <ChevronRightIcon className="w-5 h-5" />
  </button>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white shadow-lg text-gray-600 hover:text-blue-600 transition-colors"
  >
    <ChevronLeft className="w-5 h-5" />
  </button>
);

export default function AIBusinessAnalyst() {
  const { currentProject } = useProject();
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    null
  );
  const [data, setData] = useState<ComponentState>({
    personas: [],
    featureCategories: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    const fetchUserPersona = async () => {
      if (!currentProject?._id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // First, check if we have a valid token in localStorage
        const userData =
          typeof window !== "undefined"
            ? localStorage.getItem("userData")
            : null;
        if (!userData) {
          throw new Error("No authentication data found");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-persona/${currentProject._id}`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user persona");
        }

        const responseData: UserPersonaResponse = await response.json();
        console.log("User Persona Data:", responseData);

        if (!responseData.userPersona) {
          throw new Error("Invalid response format");
        }

        setData({
          personas: responseData.userPersona.personas,
          featureCategories:
            responseData.userPersona.categorized_features.feature_categories,
        });
        setError(null);
      } catch (err) {
        console.error("Error details:", err);
        if (err instanceof Error) {
          if (err.message.includes("authentication")) {
            // Handle authentication errors
            setError("Please login again");
            // Optionally redirect to login
            window.location.href = "/login";
          } else {
            setError(`Failed to fetch user persona: ${err.message}`);
          }
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPersona();
  }, [currentProject?._id]);

  const handleRegenerate = async () => {
    if (!currentProject?._id) return;

    setIsRegenerating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user-persona/regenerate/${currentProject._id}`,
        {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to regenerate user personas");
      }

      const responseData: UserPersonaResponse = await response.json();

      // Update the data with new personas
      setData({
        personas: responseData.userPersona.personas,
        featureCategories:
          responseData.userPersona.categorized_features.feature_categories,
      });

      // Clear any selected workflow when regenerating
      setSelectedWorkflow(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to regenerate user personas"
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  const renderWorkflowDetails = (workflow: Workflow) => {
    return (
      <div className="space-y-6">
        {/* Workflow Description */}
        <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
          <p className="text-gray-700">{workflow.description}</p>
        </div>

        {/* Steps Flow */}
        <div className="space-y-6">
          {workflow.steps.map((step, index) => (
            <div key={step.step} className="relative">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    Step {step.step}
                  </span>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">
                  {step.action}
                </h4>
                <p className="text-gray-600 text-sm mb-2">
                  {step.system_response}
                </p>
                <div className="flex flex-wrap gap-2">
                  {step.features_used.map((feature, fIndex) => (
                    <span
                      key={fIndex}
                      className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              {index < workflow.steps.length - 1 && (
                <div className="flex justify-center my-6">
                  <ArrowDown
                    className="w-6 h-6 text-blue-500 animate-bounce"
                    strokeWidth={2.5}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Success Criteria */}
        {workflow.success_criteria.length > 0 && (
          <div className="bg-green-50/50 rounded-lg p-4 border border-green-100 mt-8">
            <h4 className="flex items-center gap-2 text-green-800 font-medium mb-3">
              <CheckCircle className="w-5 h-5" />
              Success Criteria
            </h4>
            <ul className="space-y-2">
              {workflow.success_criteria.map((criteria, index) => (
                <li
                  key={index}
                  className="text-green-700 text-sm flex items-start gap-2"
                >
                  <span className="min-w-[20px]">•</span>
                  {criteria}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          User Personas & Workflows
        </h2>
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer
            ${
              isRegenerating
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            }`}
        >
          <RefreshCw
            className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`}
          />
          <span>{isRegenerating ? "Regenerating..." : "Re-Generate"}</span>
        </button>
      </div>
      <div
        className={`grid ${
          selectedWorkflow ? "grid-cols-2" : "md:grid-cols-3"
        } gap-6`}
      >
        {/* Left side - Personas with scroll */}
        <div
          className={`${
            selectedWorkflow
              ? "space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent"
              : "grid md:grid-cols-3 gap-6 col-span-3"
          }`}
        >
          {data.personas.map((persona, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Persona Header */}
              <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {persona.type}
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">
                      {persona.workflows.length} workflows
                    </p>
                  </div>
                </div>
              </div>

              {/* Persona Description */}
              <div className="px-6 py-4 border-b border-gray-100">
                <p className="text-gray-600 text-sm">{persona.description}</p>
              </div>

              {/* Workflow List */}
              <div className="divide-y divide-gray-100">
                {persona.workflows.map((workflow, wIndex) => (
                  <div
                    key={wIndex}
                    className={`px-6 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors
                      ${
                        selectedWorkflow?.name === workflow.name
                          ? "bg-blue-50"
                          : ""
                      }`}
                    onClick={() => setSelectedWorkflow(workflow)}
                  >
                    <span className="text-gray-700">{workflow.name}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right side - Workflow Details with fixed height */}
        {selectedWorkflow && (
          <div className="bg-white rounded-lg shadow-md p-6 relative max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            <div className="sticky top-0 bg-white pb-4 z-10">
              <button
                onClick={() => setSelectedWorkflow(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-red-50 hover:bg-red-100 transition-colors duration-200"
                aria-label="Close workflow details"
              >
                <X className="w-4 h-4 text-red-500 cursor-pointer" />
              </button>
              <h3 className="text-xl font-semibold text-gray-800 pr-8">
                {selectedWorkflow.name}
              </h3>
            </div>
            {renderWorkflowDetails(selectedWorkflow)}
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Feature Categories
        </h2>
        <div className="space-y-8">
          {data.featureCategories &&
            [
              {
                title: "Must Have Features",
                features: data.featureCategories.must_have,
                bgColor: "bg-blue-500",
                lightBg: "bg-blue-50",
                textColor: "text-blue-700",
                showExtras: true,
              },
              {
                title: "Nice to Have Features",
                features: data.featureCategories.nice_to_have,
                bgColor: "bg-purple-500",
                lightBg: "bg-purple-50",
                textColor: "text-purple-700",
                showExtras: false,
              },
              {
                title: "Future Enhancements",
                features: data.featureCategories.future_enhancements,
                bgColor: "bg-green-500",
                lightBg: "bg-green-50",
                textColor: "text-green-700",
                showExtras: false,
              },
            ].map((category) => (
              <div
                key={category.title}
                className={`${category.lightBg} rounded-lg p-4 md:p-6`}
              >
                <div className="flex justify-center mb-4">
                  <div
                    className={`${category.bgColor} text-white rounded-lg p-3 sticky top-0 shadow-sm z-10 w-fit`}
                  >
                    <h3 className="font-semibold text-base md:text-lg">
                      {category.title}
                    </h3>
                  </div>
                </div>
                <div className="relative px-4">
                  <Slider
                    dots={true}
                    infinite={false}
                    speed={500}
                    slidesToShow={3}
                    slidesToScroll={1}
                    nextArrow={<NextArrow />}
                    prevArrow={<PrevArrow />}
                    className="feature-slider"
                    responsive={[
                      {
                        breakpoint: 1024,
                        settings: {
                          slidesToShow: 2,
                          slidesToScroll: 1,
                        },
                      },
                      {
                        breakpoint: 640,
                        settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1,
                        },
                      },
                    ]}
                  >
                    {category.features.map((feature, index) => (
                      <div key={index} className="px-2">
                        <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-200 h-full">
                          <h4
                            className={`${category.textColor} font-medium mb-2 text-sm md:text-base`}
                          >
                            {feature.feature}
                          </h4>
                          <p className="text-gray-600 text-xs md:text-sm">
                            {feature.description}
                          </p>
                          {category.showExtras && "rationale" in feature && (
                            <p className="text-gray-500 text-xs md:text-sm mt-2 pt-2 border-t">
                              <span className="font-medium">Rationale:</span>{" "}
                              {(feature as MustHaveFeature).rationale}
                            </p>
                          )}
                          {category.showExtras &&
                            "business_impact" in feature && (
                              <div className="mt-2">
                                <span className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-700">
                                  Impact:{" "}
                                  {(feature as MustHaveFeature).business_impact}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
