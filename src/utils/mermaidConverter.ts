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

export function convertJsonToMermaid(diagramJson: DiagramJson): string {
  if (!diagramJson || !diagramJson.diagram) {
    return '';
  }

  const { nodes, edges } = diagramJson.diagram;
  const idMap: { [key: string]: string } = {};

  const sanitizeId = (id: string) => id.replace(/\s+/g, '_');

  nodes.forEach((node) => {
    idMap[node.id] = sanitizeId(node.id);
  });

  let mermaidCode = 'graph LR\n';

  nodes.forEach((node) => {
    const safeId = idMap[node.id];
    let label = `${node.id}\\n`;
    if (node.attributes) {
      if (node.attributes.type) {
        label += `Type: ${node.attributes.type}\\n`;
      }
      if (node.attributes.technology) {
        label += `Technology: ${node.attributes.technology}`;
      }
      if (node.attributes.components && node.attributes.components.length) {
        label += `\\nComponents: ${node.attributes.components.join(', ')}`;
      }
    }
    mermaidCode += `${safeId}["${label}"]\n`;
  });

  edges.forEach((edge) => {
    const sourceId = idMap[edge.source];
    const targetId = idMap[edge.target];
    const protocol = edge.attributes.protocol;
    mermaidCode += `${sourceId} -->|${protocol}| ${targetId}\n`;
  });

  return mermaidCode;
}