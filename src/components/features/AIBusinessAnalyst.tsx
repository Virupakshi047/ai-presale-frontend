"use client";

import { useState } from "react";
import { User, ChevronRight, X, ArrowDown, CheckCircle } from "lucide-react";

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

export default function AIBusinessAnalyst() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
    null
  );

  const data: BusinessAnalysisData = {
    personas: [
      {
        type: "Football Fan",
        description:
          "A passionate fan of a specific football club who regularly accesses the club's website or apps for news, match updates, and videos.",
        workflows: [
          {
            name: "Checking Latest News",
            description:
              "User journey for accessing and reading club news articles",
            steps: [
              {
                step: 1,
                action: "Navigates to the Homepage",
                system_response:
                  "Displays the latest news, fixtures, and upcoming matches",
                features_used: ["Homepage"],
              },
              {
                step: 2,
                action: "Clicks on the News tab",
                system_response:
                  "Lists the latest news articles and allows user to filter by category",
                features_used: ["News Listing"],
              },
              {
                step: 3,
                action: "Reads an article",
                system_response:
                  "Displays individual news articles and allows user to comment, share, and embed polls",
                features_used: ["News Article"],
              },
            ],
            success_criteria: [
              "User can access and read news articles about their favorite club",
              "User can share articles on social media",
              "User can interact with embedded polls",
            ],
          },
          {
            name: "Viewing Match Fixtures",
            description:
              "A fan checks the upcoming matches for their favorite club.",
            steps: [
              {
                step: 1,
                action: "Navigates to the Homepage",
                system_response:
                  "Displays the latest news, fixtures, and upcoming matches.",
                features_used: ["Homepage"],
              },
              {
                step: 2,
                action: "Clicks on the Fixtures tab",
                system_response:
                  "Lists upcoming matches and provides details such as date, time, and venue.",
                features_used: ["Match Fixtures"],
              },
            ],
            success_criteria: [
              "User can view upcoming matches for their favorite club",
            ],
          },
          {
            name: "Watching Match Videos",
            description: "A fan watches videos related to their favorite club.",
            steps: [
              {
                step: 1,
                action: "Navigates to the Video Hub",
                system_response:
                  "Provides access to the club's TV channel and video content.",
                features_used: ["Video Hub"],
              },
              {
                step: 2,
                action: "Clicks on a video",
                system_response:
                  "Displays individual videos and allows user to watch and share.",
                features_used: ["Video Article"],
              },
            ],
            success_criteria: [
              "User can watch videos related to their favorite club",
            ],
          },
        ],
      },
      {
        type: "Club Staff Member",
        description:
          "A member of the club's staff who uses the website or apps for work-related purposes, such as checking league tables, player profiles, and staff listings.",
        workflows: [
          {
            name: "Checking League Tables",
            description:
              "A staff member checks the current league standings for the club's team.",
            steps: [
              {
                step: 1,
                action: "Navigates to the League Tables tab",
                system_response:
                  "Displays the current league standings for the club's team.",
                features_used: ["League Tables"],
              },
            ],
            success_criteria: [
              "Staff member can view the current league standings for the club's team",
            ],
          },
          {
            name: "Viewing Player Profiles",
            description:
              "A staff member checks detailed information about a specific player.",
            steps: [
              {
                step: 1,
                action: "Navigates to the Player Listing",
                system_response:
                  "Lists all the players on the club's team and provides details such as position, age, and nationality.",
                features_used: ["Player Listing"],
              },
              {
                step: 2,
                action: "Clicks on a player's profile",
                system_response:
                  "Displays detailed information about a specific player, including career statistics, awards, and social media links.",
                features_used: ["Player Profile"],
              },
            ],
            success_criteria: [
              "Staff member can view detailed information about a specific player",
            ],
          },
          {
            name: "Checking Staff Listings",
            description:
              "A staff member checks the contact information for other staff members.",
            steps: [
              {
                step: 1,
                action: "Navigates to the Staff Listing",
                system_response:
                  "Lists all the staff members on the club and provides details such as position and contact information.",
                features_used: ["Staff Listing"],
              },
            ],
            success_criteria: [
              "Staff member can view contact information for other staff members",
            ],
          },
        ],
      },
    ],
  };

  const featureData = {
    feature_categories: {
      must_have: [
        {
          feature: "AI-Powered Proficiency Assessment",
          description:
            "AI evaluates the user's proficiency level via a diagnostic test at onboarding and ongoing performance analysis from lesson interactions using speech, text, and grammar evaluation.",
          rationale:
            "Essential for MVP as it provides a baseline for user proficiency and guides the adaptive learning process.",
          business_impact: "High",
        },
        {
          feature: "Adaptive Lesson Planning",
          description:
            "Provides personalized lesson plans targeting weak areas. AI generates tailored daily lessons based on user's availability and learning goals. Dynamically adjusts difficulty level based on real-time performance.",
          rationale:
            "Essential for MVP as it ensures that the learning content is relevant and challenging for each user.",
          business_impact: "High",
        },
        {
          feature: "Conversational AI for Real-Life Dialogues",
          description:
            "AI simulates real-world conversations for practical learning. The AI can understand and correct grammar mistakes, adapt responses based on the user's proficiency, engage in natural conversations to improve fluency, analyze pronunciation and give real-time feedback, detect phonetic mistakes and provide corrections, and grade pronunciation accuracy and suggest improvements.",
          rationale:
            "Essential for MVP as it provides a realistic and interactive learning environment.",
          business_impact: "High",
        },
        {
          feature: "Spaced Repetition & Revision Scheduling",
          description:
            "AI suggests revision schedules based on spaced repetition techniques. Users receive reminders for timely lesson reviews. Generates AI-powered summaries of past lessons for quick revision.",
          rationale:
            "Essential for MVP as it improves user retention and learning efficiency.",
          business_impact: "High",
        },
      ],
      nice_to_have: [
        {
          feature:
            "Scalability and efficiency of AI-powered adaptive learning engine",
          description:
            "Ensures the system can handle a large number of users and lessons efficiently.",
        },
        {
          feature: "Security compliance and data protection measures",
          description:
            "Ensures user data is protected and handled in accordance with relevant regulations.",
        },
        {
          feature:
            "Accuracy of AI-generated language explanations vs. human instructors",
          description:
            "Ensures the AI's language explanations are as accurate and helpful as those provided by human instructors.",
        },
      ],
      future_enhancements: [
        {
          feature:
            "AI adjusts lesson difficulty dynamically based on real-time user performance",
          description:
            "Improves the adaptive learning engine's responsiveness to user performance changes.",
        },
        {
          feature: "Speech recognition achieves at least 85% phonetic accuracy",
          description:
            "Improves the system's ability to accurately transcribe user speech.",
        },
        {
          feature:
            "Conversational AI engages naturally and provides contextual corrections",
          description:
            "Improves the AI's ability to engage users in natural and contextually relevant conversations.",
        },
      ],
    },
  };
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
              : "grid md:grid-cols-2 gap-6 col-span-2"
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
          <div className="bg-white rounded-lg shadow-md p-6 relative  top-6">
            <button
              onClick={() => setSelectedWorkflow(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-red-50 hover:bg-red-100 transition-colors duration-200"
              aria-label="Close workflow details"
            >
              <X className="w-4 h-4 text-red-500 cursor-pointer" />
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pr-8">
              {selectedWorkflow.name}
            </h3>
            {renderWorkflowDetails(selectedWorkflow)}
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Feature Categories
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Must Have Features",
              features: featureData.feature_categories.must_have,
              bgColor: "bg-blue-500",
              lightBg: "bg-blue-50",
              textColor: "text-blue-700",
              showExtras: true,
            },
            {
              title: "Nice to Have Features",
              features: featureData.feature_categories.nice_to_have,
              bgColor: "bg-purple-500",
              lightBg: "bg-purple-50",
              textColor: "text-purple-700",
              showExtras: false,
            },
            {
              title: "Future Enhancements",
              features: featureData.feature_categories.future_enhancements,
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
                          Impact: {(feature as MustHaveFeature).business_impact}
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
