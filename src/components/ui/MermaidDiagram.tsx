"use client";
import { useEffect, useRef } from "react";
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
  console.log("Rendering MermaidDiagram with chart:", chart);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
      logLevel: "error",
      fontFamily: "inherit",
    });

    const renderDiagram = async () => {
      if (elementRef.current) {
        elementRef.current.innerHTML = "";
        const uniqueId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        try {
          const { svg } = await mermaid.render(uniqueId, chart);
          elementRef.current.innerHTML = svg;
        } catch (error) {
          console.error("Mermaid rendering failed:", error);
          elementRef.current.innerHTML = "Failed to render diagram";
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return <div ref={elementRef} className={`mermaid ${className || ""}`} />;
};

export default MermaidDiagram;
