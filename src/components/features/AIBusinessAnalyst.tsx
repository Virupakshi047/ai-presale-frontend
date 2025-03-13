"use client";

import { useState, useEffect } from "react";
import { User, ChevronRight, X, ArrowDown, CheckCircle } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

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

interface BusinessAnalysisData {
  personas: Persona[];
}

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

  useEffect(() => {
    const fetchUserPersona = async () => {
      if (!currentProject?._id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/user-persona/${currentProject._id}`
        );

        

        if (!response.ok) {
          throw new Error("Failed to fetch user persona");
        }

        const responseData: UserPersonaResponse = await response.json();
        setData({
          personas: responseData.userPersona.personas,
          featureCategories:
            responseData.userPersona.categorized_features.feature_categories,
        });
        setError(null);
      } catch (err) {
        setError("Failed to fetch user persona data");
        console.error("Error fetching user persona:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPersona();
  }, [currentProject?._id]);

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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        User Personas & Workflows
      </h2>

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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Feature Categories
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
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
            ].map((category, idx) => (
              <div
                key={category.title}
                className={`${category.lightBg} rounded-lg p-6 max-h-[calc(100vh-16rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 transition-all duration-200`}
              >
                <div
                  className={`${category.bgColor} text-white rounded-lg p-3 mb-4 sticky top-0 shadow-sm z-10`}
                >
                  <h3 className="font-semibold">{category.title}</h3>
                </div>
                <div className="space-y-4">
                  {category.features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-lg transition-all duration-200"
                    >
                      <h4 className={`${category.textColor} font-medium mb-2`}>
                        {feature.feature}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                      {category.showExtras && "rationale" in feature && (
                        <p className="text-gray-500 text-sm mt-2 pt-2 border-t">
                          <span className="font-medium">Rationale:</span>{" "}
                          {(feature as MustHaveFeature).rationale}
                        </p>
                      )}
                      {category.showExtras && "business_impact" in feature && (
                        <div className="mt-2">
                          <span className="px-2 py-1 text-xs rounded bg-orange-100 text-orange-700">
                            Impact:{" "}
                            {(feature as MustHaveFeature).business_impact}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
