"use client";
import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chart,
  className,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [renderAttempts, setRenderAttempts] = useState(0);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[MermaidDiagram] Initialization started");

    if (renderAttempts > 3) {
      console.error("[MermaidDiagram] Too many render attempts, stopping");
      return;
    }

    const renderDiagram = async () => {
      if (!elementRef.current || !chart) {
        console.log("[MermaidDiagram] No element ref or chart data");
        return;
      }

      console.log("[MermaidDiagram] Attempting to render chart:", {
        chartLength: chart.length,
        firstLine: chart.split("\n")[0],
      });

      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          logLevel: "error",
          fontFamily: "inherit",
        });

        elementRef.current.innerHTML = "";
        const uniqueId = `mermaid-${Date.now()}`;

        console.log("[MermaidDiagram] Rendering with ID:", uniqueId);
        const { svg } = await mermaid.render(uniqueId, chart);

        if (elementRef.current) {
          elementRef.current.innerHTML = svg;
          setRenderError(null);
          console.log("[MermaidDiagram] Render successful");
        }
      } catch (error) {
        console.error("[MermaidDiagram] Rendering failed:", error);
        setRenderError(
          error instanceof Error ? error.message : "Unknown error"
        );
        setRenderAttempts((prev) => prev + 1);
      }
    };

    renderDiagram();
  }, [chart]);

  return (
    <div className="relative">
      <div ref={elementRef} className={`mermaid ${className || ""}`} />
      {renderError && (
        <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">
          {renderError}
        </div>
      )}
    </div>
  );
};

export default MermaidDiagram;
