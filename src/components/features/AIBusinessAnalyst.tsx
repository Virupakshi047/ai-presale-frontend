"use client";

import { useState } from "react";
import { User, ChevronRight, X, ArrowDown, CheckCircle } from "lucide-react";

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
    <div className="max-w-7xl mx-auto">
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
          <div className="bg-white rounded-lg shadow-md p-6 relative sticky top-6">
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
    </div>
  );
}
