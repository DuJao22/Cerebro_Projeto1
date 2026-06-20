/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from './database.js';

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  size: number; // Mapping of memory.visualWeight to graph sizes
  lastAccessed: string;
  codeSnippet?: string;
  docstring?: string;
  details?: string;
  repoName?: string;
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
  weight: number; // Maps relationship.peso
}

/**
 * Returns formatted nodes and links for D3 layout visualization
 */
export function getFormattedBrainGraph(): { nodes: GraphNode[]; links: GraphLink[] } {
  const memories = db.getMemories();
  const relations = db.getRelationships();

  const nodes: GraphNode[] = memories.map(mem => ({
    id: mem.id,
    label: mem.conteudo,
    type: mem.tipo,
    size: mem.visualWeight, // Derived directly from reinforcement weight (1 to 10)
    lastAccessed: mem.lastAccessed,
    codeSnippet: mem.codeSnippet,
    docstring: mem.docstring,
    details: mem.details,
    repoName: mem.repoName
  }));

  const links: GraphLink[] = relations.map(rel => ({
    id: rel.id,
    source: rel.origem_id,
    target: rel.destino_id,
    weight: rel.peso // Matches synapse pathways strength (1 to 10)
  }));

  return { nodes, links };
}
