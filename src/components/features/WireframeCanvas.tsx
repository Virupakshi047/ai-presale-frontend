"use client";

import { useEffect, useRef, useState } from "react";

interface Position {
    x: number;
    y: number;
}

interface Element {
    type: string;
    label: string;
    position: Position;
}

interface Page {
    name: string;
    elements: Element[];
}

interface WireframeData {
    pages: Page[];
}

const sampleWireframe: WireframeData = {
    pages: [
        {
            "name": "Requirement Extraction",
            "elements": [
                {
                    "type": "header",
                    "label": "Requirement Extraction",
                    "position": {
                        "x": 50,
                        "y": 50
                    }
                },
                {
                    "type": "textbox",
                    "label": "Text Input",
                    "position": {
                        "x": 50,
                        "y": 100
                    }
                },
                {
                    "type": "button",
                    "label": "Upload Document",
                    "position": {
                        "x": 50,
                        "y": 150
                    }
                },
                {
                    "type": "header",
                    "label": "Feature Breakdown",
                    "position": {
                        "x": 50,
                        "y": 200
                    }
                }
            ]
        },
        {
            "name": "Requirement Categorization",
            "elements": [
                {
                    "type": "header",
                    "label": "Requirement Categorization",
                    "position": {
                        "x": 50,
                        "y": 50
                    }
                },
                {
                    "type": "textbox",
                    "label": "User Persona & Workflow Mapping",
                    "position": {
                        "x": 50,
                        "y": 100
                    }
                },
                {
                    "type": "textbox",
                    "label": "Integration Analysis",
                    "position": {
                        "x": 50,
                        "y": 150
                    }
                }
            ]
        },
        {
            "name": "Architecture Suggestion",
            "elements": [
                {
                    "type": "header",
                    "label": "Architecture Suggestion",
                    "position": {
                        "x": 50,
                        "y": 50
                    }
                },
                {
                    "type": "textbox",
                    "label": "Third-Party API Integration Identification",
                    "position": {
                        "x": 50,
                        "y": 100
                    }
                },
                {
                    "type": "textbox",
                    "label": "Architecture Visualization",
                    "position": {
                        "x": 50,
                        "y": 150
                    }
                }
            ]
        },
        {
            "name": "Effort Estimation",
            "elements": [
                {
                    "type": "header",
                    "label": "Effort Estimation",
                    "position": {
                        "x": 50,
                        "y": 50
                    }
                },
                {
                    "type": "textbox",
                    "label": "Timeline Prediction",
                    "position": {
                        "x": 50,
                        "y": 100
                    }
                },
                {
                    "type": "textbox",
                    "label": "Cost Estimation",
                    "position": {
                        "x": 50,
                        "y": 150
                    }
                }
            ]
        },
        {
            "name": "Wireframe Generation",
            "elements": [
                {
                    "type": "header",
                    "label": "Wireframe Generation",
                    "position": {
                        "x": 50,
                        "y": 50
                    }
                },
                {
                    "type": "textbox",
                    "label": "UI Visualization",
                    "position": {
                        "x": 50,
                        "y": 100
                    }
                }
            ]
        },
        {
            "name": "Collaborative Editing",
            "elements": [
                {
                    "type": "header",
                    "label": "Collaborative Editing",
                    "position": {
                        "x": 50,
                        "y": 50
                    }
                },
                {
                    "type": "textbox",
                    "label": "Collaborative Editing",
                    "position": {
                        "x": 50,
                        "y": 100
                    }
                },
                {
                    "type": "textbox",
                    "label": "Past Proposals & Revisions Display",
                    "position": {
                        "x": 50,
                        "y": 150
                    }
                },
                {
                    "type": "textbox",
                    "label": "Proposal Change Tracking",
                    "position": {
                        "x": 50,
                        "y": 200
                    }
                },
                {
                    "type": "textbox",
                    "label": "Notification System",
                    "position": {
                        "x": 50,
                        "y": 250
                    }
                }
            ]
        }
    ],
};

export default function WireframeCanvas() {
    const canvasRef = useRef<any>(null);
    const [fabricModule, setFabricModule] = useState<any>(null);
    const [wireframeData] = useState<WireframeData>(sampleWireframe);
    const [currentPage, setCurrentPage] = useState<number>(0);

    useEffect(() => {
        if (typeof window === "undefined") return;

        import("fabric").then((module) => {
            setFabricModule(module.default || module);
        }).catch((err) => {
            console.error("Error loading Fabric.js:", err);
        });
    }, []);

    useEffect(() => {
        if (!fabricModule) return;

        if (canvasRef.current) {
            canvasRef.current.dispose();
        }

        const canvas = new fabricModule.Canvas("wireframeCanvas");
        canvasRef.current = canvas;

        renderPage(canvas, wireframeData.pages[currentPage]);

        return () => {
            if (canvasRef.current) {
                canvasRef.current.dispose();
                canvasRef.current = null;
            }
        };
    }, [fabricModule, wireframeData, currentPage]); // Re-render when page changes

    const renderPage = (canvas: any, page: Page) => {
        if (!fabricModule) return;

        canvas.clear();

        page.elements.forEach((element) => {
            let fabricElement;

            if (element.type === "button") {
                const buttonRect = new fabricModule.Rect({
                    width: 100,
                    height: 30,
                    fill: "lightblue",
                    rx: 5,
                    ry: 5,
                });

                const buttonText = new fabricModule.Text(element.label, {
                    fontSize: 14,
                    fill: "black",
                    originX: "center",
                    originY: "center",
                });

                fabricElement = new fabricModule.Group([buttonRect, buttonText], {
                    left: element.position.x,
                    top: element.position.y,
                    selectable: true, // Allow selection & movement
                    hasControls: true, // Enable resizing & rotation
                });

                buttonText.set({ left: 50, top: 15 }); // Center text inside button
            }


            if (element.type === "textbox") {
                fabricElement = new fabricModule.Textbox(element.label, {
                    left: element.position.x,
                    top: element.position.y,
                    fontSize: 16,
                    fill: "black",
                    editable: false,
                });
            } else if (element.type === "button") {
                const buttonRect = new fabricModule.Rect({
                    width: 100,
                    height: 30,
                    fill: "lightblue",
                    rx: 5,
                    ry: 5,
                });

                const buttonText = new fabricModule.Text(element.label, {
                    fontSize: 14,
                    fill: "black",
                    originX: "center",
                    originY: "center",
                });

                fabricElement = new fabricModule.Group([buttonRect, buttonText], {
                    left: element.position.x,
                    top: element.position.y,
                    selectable: false,
                });
            }

            if (fabricElement) {
                canvas.add(fabricElement);
            }
        });

        canvas.renderAll();
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">{wireframeData.pages[currentPage].name}</h2>
            <canvas id="wireframeCanvas" width={500} height={400} className="border rounded-lg" />

            {/* Page Navigation */}
            <div className="mt-4 flex justify-between">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(wireframeData.pages.length - 1, prev + 1))}
                    disabled={currentPage === wireframeData.pages.length - 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
