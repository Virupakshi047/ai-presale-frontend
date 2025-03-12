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

// Updated to match the actual data structure you're receiving
interface DiagramData {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export function convertJsonToMermaid(diagramData: DiagramData): string {
  if (!diagramData || !diagramData.nodes || !diagramData.edges) {
    return '';
  }

  const { nodes, edges } = diagramData;
  const idMap: { [key: string]: string } = {};
  const sanitizeId = (id: string) => id.replace(/\s+/g, '_');
  
  nodes.forEach((node) => {
    idMap[node.id] = sanitizeId(node.id);
  });

  let mermaidCode = 'graph TD\n';
  
  // Group nodes by type for subgraphs
  const subgraphs: { [key: string]: string[] } = {};
  
  nodes.forEach((node) => {
    const safeId = idMap[node.id];
    let label = `${node.id}`;
    
    if (node.attributes) {
      if (node.attributes.technology) {
        label += `\n(${node.attributes.technology})`;
      }
      if (node.attributes.components && node.attributes.components.length) {
        // label += `\nComponents: ${node.attributes.components.join(', ')}`;
      }
    }
    
    let nodeRepresentation = `${safeId}["${label}"]`;
    
    // Database representation
    if (node.attributes.type === 'database') {
      nodeRepresentation = `${safeId}[(${label})]`; // Cylindrical shape
    }
    
    if (node.attributes.type) {
      if (!subgraphs[node.attributes.type]) {
        subgraphs[node.attributes.type] = [];
      }
      subgraphs[node.attributes.type].push(nodeRepresentation);
    } else {
      mermaidCode += `${nodeRepresentation}\n`;
    }
  });
  
  // Add subgraphs to Mermaid code
  Object.keys(subgraphs).forEach((type) => {
    mermaidCode += `subgraph ${type.toUpperCase()}\n`;
    subgraphs[type].forEach((line) => (mermaidCode += `  ${line}\n`));
    mermaidCode += `end\n`;
  });
  
  // Add edges
  edges.forEach((edge) => {
    const sourceId = idMap[edge.source];
    const targetId = idMap[edge.target];
    const protocol = edge.attributes.protocol;
    mermaidCode += `${sourceId} -->|${protocol}| ${targetId}\n`;
  });
  
  return mermaidCode;
}