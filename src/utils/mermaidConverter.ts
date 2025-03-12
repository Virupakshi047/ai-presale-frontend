interface DiagramNode {
  id: string;
  attributes: {
    type?: string;
    technology?: string;
    components?: string[];
  };
}

interface DiagramEdge {
  source: string;
  target: string;
  attributes: {
    protocol: string;
  };
}

interface DiagramJson {
  diagram: {
    nodes: DiagramNode[];
    edges: DiagramEdge[];
  };
}

export const convertJsonToMermaid = (diagramData: any) => {
  const { nodes, edges } = diagramData;
  
  let mermaidCode = 'graph TD\n';
  
  // Add nodes
  nodes.forEach((node: any) => {
    mermaidCode += `  ${node.id}["${node.id}<br/>${node.attributes.technology}"]\n`;
  });
  
  // Add edges
  edges.forEach((edge: any) => {
    mermaidCode += `  ${edge.source} -->|${edge.attributes.protocol}| ${edge.target}\n`;
  });
  
  return mermaidCode;
};