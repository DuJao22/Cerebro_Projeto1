/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MemoryType = 'entidade' | 'fato' | 'evento' | 'sentimento' | 'usuario' | 'resposta';

export interface Memory {
  id: string;
  conteudo: string;
  tipo: MemoryType;
  timestamp: string;
  visualWeight: number; // Node weight/size, from 1 to 10
  lastAccessed: string; // ISO String
  accessCount?: number; // Usage statistics for query popularity context & re-ranking
  codeSnippet?: string; // Parsed code structure
  docstring?: string;   // Understood docstring or comment
  details?: string;     // Additional file/class/method details
  repoName?: string;    // Associated GitHub repository name
}

export interface Relationship {
  id: string;
  origem_id: string;
  destino_id: string;
  peso: number; // Connection strength/affinity, from 1 to 10
  tipo_relacao?: string; // Optional label, e.g., 'associa'
}

export interface Feedback {
  id: string;
  timestamp: string;
  messageId: string; // Message being evaluated
  feedbackType: 'good' | 'bad';
  entitiesUsed: string[]; // Entities involved that had their weights modified
}

export interface LearningLog {
  id: string;
  timestamp: string;
  acao: 'MEMORIZAÇÃO' | 'REFORÇO' | 'COGNICÃO' | 'ENFRAQUECIMENTO' | 'ESQUECIMENTO' | 'FEEDBACK';
  detalhe: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  voiceBase64?: string; // PCM context or synthesized MP3 data if requested
  associatedEntities?: string[];
  feedback?: 'good' | 'bad' | null;
  cached?: boolean; // True if response pulled from instant Smart Memo Cache
}

export interface CreatorSkill {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  promptTemplate: string;
  tags: string[]; // e.g. ['Landing Page', '3D', 'Dashboard', '21st.dev']
  author: string;
  timestamp: string;
}

export interface LandingPageDesign {
  id: string;
  title: string;
  description: string;
  code: string;
  files: { fileName: string; fileContent: string; fileLanguage: string }[];
  compilationLogs?: string[];
  interactiveVariables?: Record<string, any>;
  promptUsed?: string;
  skillIdUsed?: string;
  timestamp: string;
}

export interface BrainStatus {
  totalMemories: number;
  totalRelations: number;
  averageWeight: number;
  learningLogs: LearningLog[];
}
