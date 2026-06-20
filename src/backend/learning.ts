/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from './database.js';
import { Memory, Relationship, MemoryType } from '../types.js';
import { getGemini, generateContentWithRetry } from './memory.js';
import { Type } from '@google/genai';

/**
 * Step 1: Cognitive Integration
 * Inserts new entities as nodes and maps synapse pathways between them in the database graph
 */
export function integrateNewEntitiesIntoGraph(entities: { conteudo: string; tipo: MemoryType }[]): string[] {
  if (entities.length === 0) return [];
  
  const memoriasAtual = db.getMemories();
  const idsCriadosOuAtualizados: string[] = [];

  // 1. Insert or update the memory nodes
  entities.forEach(ent => {
    // Check if case-insensitive entity exists
    let existing = memoriasAtual.find(m => m.conteudo.toLowerCase() === ent.conteudo.toLowerCase());
    const nodeId = existing ? existing.id : `n_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    const nodeMemory: Memory = {
      id: nodeId,
      conteudo: ent.conteudo,
      tipo: ent.tipo,
      timestamp: existing ? existing.timestamp : new Date().toISOString(),
      visualWeight: existing ? Math.min(10, existing.visualWeight + 1) : 5, // Boot up with size 5
      lastAccessed: new Date().toISOString()
    };

    db.saveMemory(nodeMemory);
    idsCriadosOuAtualizados.push(nodeId);

    // CRITICAL: Connect newly created entities to 'Cérebro Digital' (ID '4') so they reside in the main network
    if (!existing && nodeId !== '4') {
      const relId = `rel_auto_${nodeId}_4`;
      db.saveRelationship({
        id: relId,
        origem_id: '4', // Cérebro Digital
        destino_id: nodeId,
        peso: 6,
        tipo_relacao: 'associa'
      });
      db.addLog('REFORÇO', `Sinapse cognitiva criada: "Cérebro Digital" 🔗 "${ent.conteudo}"`);
    }
  });

  // 2. Map bidirectional pathways (edges) between all pairs of the newly active nodes
  if (idsCriadosOuAtualizados.length > 1) {
    for (let i = 0; i < idsCriadosOuAtualizados.length; i++) {
      for (let j = i + 1; j < idsCriadosOuAtualizados.length; j++) {
        const idA = idsCriadosOuAtualizados[i];
        const idB = idsCriadosOuAtualizados[j];

        const matchA = db.getMemories().find(m => m.id === idA);
        const matchB = db.getMemories().find(m => m.id === idB);
        if (!matchA || !matchB) continue;

        // Find existing relation
        const relacaoExistente = db.getRelationships().find(
          r => (r.origem_id === idA && r.destino_id === idB) || (r.origem_id === idB && r.destino_id === idA)
        );

        const relation: Relationship = {
          id: relacaoExistente ? relacaoExistente.id : `r_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          origem_id: idA,
          destino_id: idB,
          peso: relacaoExistente ? Math.min(10, relacaoExistente.peso + 1.5) : 5, // Start with connection strength 5
          tipo_relacao: 'associa'
        };

        db.saveRelationship(relation);
        
        if (!relacaoExistente) {
          db.addLog('REFORÇO', `Sinapse criada: "${matchA.conteudo}"  🔀  "${matchB.conteudo}" (Força: 5/10)`);
        } else {
          db.addLog('REFORÇO', `Sinapse fortalecida: "${matchA.conteudo}"  ⚡  "${matchB.conteudo}" (Novo Peso: ${relation.peso}/10)`);
        }
      }
    }
  }

  return idsCriadosOuAtualizados;
}

/**
 * Step 2: Reinforcement Learning Loop
 * When a user likes or dislikes a response, adjust the cognitive pathway weights
 */
export function applyUserFeedback(memoriesInvolved: string[], feedbackType: 'good' | 'bad') {
  if (memoriesInvolved.length === 0) return;

  const memories = db.getMemories();
  const relations = db.getRelationships();

  const namesInvolved = memories
    .filter(m => memoriesInvolved.includes(m.id))
    .map(m => `"${m.conteudo}"`)
    .join(', ');

  db.addLog('FEEDBACK', `Usuário marcou resposta como: ${feedbackType === 'good' ? '👍 ÚTIL' : '👎 INEXATA'}. Modificando pesos de: ${namesInvolved}.`);

  if (feedbackType === 'good') {
    // Strengthen involved memories and relationships
    memoriesInvolved.forEach(id => {
      const match = memories.find(m => m.id === id);
      if (match) {
        db.saveMemory({
          ...match,
          visualWeight: Math.min(10, match.visualWeight + 1.5)
        });
      }
    });

    // Strengthen connections among them
    for (let i = 0; i < memoriesInvolved.length; i++) {
      for (let j = i + 1; j < memoriesInvolved.length; j++) {
        const idA = memoriesInvolved[i];
        const idB = memoriesInvolved[j];

        const rel = relations.find(
          r => (r.origem_id === idA && r.destino_id === idB) || (r.origem_id === idB && r.destino_id === idA)
        );

        if (rel) {
          db.saveRelationship({
            ...rel,
            peso: Math.min(10, rel.peso + 2.0)
          });
        }
      }
    }
    db.addLog('REFORÇO', `Pontes neurais associadas a [${namesInvolved}] foram super-reforçadas pelo feedback do usuário.`);

  } else {
    // Weaken involved memories and relationships. If too weak, they start to decay
    memoriesInvolved.forEach(id => {
      const match = memories.find(m => m.id === id);
      if (match) {
        const newWeight = Math.max(1, match.visualWeight - 1.5);
        db.saveMemory({
          ...match,
          visualWeight: newWeight
        });
        
        if (newWeight <= 1.5 && match.tipo !== 'usuario') {
          db.addLog('ENFRAQUECIMENTO', `Memória "${match.conteudo}" enfraqueceu criticamente devido a feedback negativo.`);
        }
      }
    });

    // Weaken pathways
    for (let i = 0; i < memoriesInvolved.length; i++) {
      for (let j = i + 1; j < memoriesInvolved.length; j++) {
        const idA = memoriesInvolved[i];
        const idB = memoriesInvolved[j];

        const rel = relations.find(
          r => (r.origem_id === idA && r.destino_id === idB) || (r.origem_id === idB && r.destino_id === idA)
        );

        if (rel) {
          const newWeight = rel.peso - 2.5;
          if (newWeight <= 1.0) {
            db.deleteRelationship(rel.id);
            db.addLog('ESQUECIMENTO', `Sinapse desfeita por enfraquecimento total: relação deletada entre os nós.`);
          } else {
            db.saveRelationship({
              ...rel,
              peso: newWeight
            });
          }
        }
      }
    }
  }
}

/**
 * Step 3: Natural Cognitive Decay / Forgetfulness Simulation
 * Shrinks unused pathways systematically to prevent network congestion
 */
export function applyNaturalDecay() {
  const memories = db.getMemories();
  const relations = db.getRelationships();

  db.addLog('ENFRAQUECIMENTO', 'Iniciando varredura de entropia sináptica (simulação de esquecimento natural).');

  // Decay general relations slightly (decrements weight by 1.0)
  relations.forEach(rel => {
    const newWeight = rel.peso - 1.0;
    if (newWeight <= 1.0) {
      db.deleteRelationship(rel.id);
      const mOrig = memories.find(m => m.id === rel.origem_id)?.conteudo || 'Nó';
      const mDest = memories.find(m => m.id === rel.destino_id)?.conteudo || 'Nó';
      db.addLog('ESQUECIMENTO', `A ponte sináptica entre "${mOrig}" e "${mDest}" decaiu para o esquecimento permanente.`);
    } else {
      db.saveRelationship({
        ...rel,
        peso: newWeight
      });
    }
  });

  // Decay memories slightly, unless it is the core user/creator node "João Layon" (which is indestructible!)
  memories.forEach(mem => {
    if (mem.id === '1' || mem.conteudo.toLowerCase().includes('joão') || mem.conteudo.toLowerCase().includes('layon')) return; // Core anchoring

    const newWeight = Math.max(1, mem.visualWeight - 0.5);
    db.saveMemory({
      ...mem,
      visualWeight: newWeight
    });

    // If memory weight is at baseline 1 and it has no connections, there's a 20% biological decay chance to delete it
    const hasActiveConnections = db.getRelationships().some(r => r.origem_id === mem.id || r.destino_id === mem.id);
    if (newWeight <= 1.0 && !hasActiveConnections && Math.random() < 0.40) {
      db.deleteMemory(mem.id);
    }
  });

  db.addLog('COGNICÃO', 'Doutrina de entropia concluída. Conexões frias e memórias sobressalentes foram limpas.');
}

/**
 * Step 4: AI & Heuristic Brain Self-Improvement
 * Consolidates orphaned nodes, analyzes indexed code structures to produce auto-generated docstrings and recommends optimization nodes
 */
export async function selfImproveBrain(): Promise<{ 
  success: boolean; 
  orphansConnected: number; 
  relationshipsCreated: number; 
  optimizationsApplied: number;
  auditLogs: string[];
}> {
  const memories = db.getMemories();
  const relations = db.getRelationships();

  // Find all orphans: nodes that have no relationship anywhere
  const activeIds = new Set<string>();
  relations.forEach(r => {
    activeIds.add(r.origem_id);
    activeIds.add(r.destino_id);
  });

  const orphans = memories.filter(m => !activeIds.has(m.id));
  const connectedNodes = memories.filter(m => activeIds.has(m.id));

  let orphansConnected = 0;
  let relationshipsCreated = 0;
  let optimizationsApplied = 0;
  const auditLogs: string[] = [];

  // RETROACTIVE COGNITIVE HEALING: Scan for repository/system sub-graphs that are drifting and link them directly to Core nodes (IDs '1', '4', '5')
  const repoMemories = memories.filter(m => m.id.startsWith('repo_') || m.conteudo.startsWith('Repositório:'));
  repoMemories.forEach(repoNode => {
    // 1. Ensure connection to João Layon (ID '1')
    const hasConnectionTo1 = relations.some(r => 
      (r.origem_id === '1' && r.destino_id === repoNode.id) || 
      (r.origem_id === repoNode.id && r.destino_id === '1')
    );
    if (!hasConnectionTo1) {
      db.saveRelationship({
        id: `rel_heal_1_${repoNode.id}`,
        origem_id: '1',
        destino_id: repoNode.id,
        peso: 9,
        tipo_relacao: 'Explora'
      });
      relationshipsCreated++;
      auditLogs.push(`Conexão curada: "João Layon" 🔗 "${repoNode.conteudo}"`);
    }

    // 2. Ensure connection to Cérebro Digital (ID '4')
    const hasConnectionTo4 = relations.some(r => 
      (r.origem_id === '4' && r.destino_id === repoNode.id) || 
      (r.origem_id === repoNode.id && r.destino_id === '4')
    );
    if (!hasConnectionTo4) {
      db.saveRelationship({
        id: `rel_heal_4_${repoNode.id}`,
        origem_id: '4',
        destino_id: repoNode.id,
        peso: 9,
        tipo_relacao: 'Mapeia'
      });
      relationshipsCreated++;
      auditLogs.push(`Conexão curada: "Cérebro Digital" 🔗 "${repoNode.conteudo}"`);
    }

    // 3. Ensure connection to Inteligência Artificial (ID '5')
    const hasConnectionTo5 = relations.some(r => 
      (r.origem_id === '5' && r.destino_id === repoNode.id) || 
      (r.origem_id === repoNode.id && r.destino_id === '5')
    );
    if (!hasConnectionTo5) {
      db.saveRelationship({
        id: `rel_heal_5_${repoNode.id}`,
        origem_id: '5',
        destino_id: repoNode.id,
        peso: 8,
        tipo_relacao: 'Codifica'
      });
      relationshipsCreated++;
      auditLogs.push(`Conexão curada: "Inteligência Artificial" 🔗 "${repoNode.conteudo}"`);
    }
  });

  try {
    const ai = getGemini();

    if (orphans.length > 0) {
      // Connect orphans using AI!
      const orphansText = orphans.map(o => `ID: ${o.id} | Conteúdo: "${o.conteudo}" [Tipo: ${o.tipo}]`).join('\n');
      const connectedText = connectedNodes.slice(0, 30).map(c => `ID: ${c.id} | Conteúdo: "${c.conteudo}" [Tipo: ${c.tipo}]`).join('\n');

      const prompt = `Você é o córtex cognitivo do sistema Layon-System.
Detectamos nós órfãos (sem nenhuma conexão sináptica) no nosso Grafo de Conhecimento.
Sua missão é deduzir conexões lógicas/semânticas inteligentes entre estes nós órfãos e os nós já conectados de nossa base.

Nós Órfãos (Soltos):
${orphansText}

Nós de Referência (Conectados):
${connectedText}

Indique quais nós órfãos devem ser conectados a quais nós de referência (ou entre si) para otimizar o fluxo de informação.
Retorne estritamente um JSON no seguinte formato:
{
  "conexoes": [
    {
      "origem_id": "string (id do nó órfão)",
      "destino_id": "string (id de outro nó órfão ou de referência)",
      "tipo_relacao": "string (ex: 'especializa', 'executa', 'importa', 'utiliza', 'associa', de 1 a 3 palavras concisas)",
      "peso": number (valor de 5 a 10 de acordo com a proximidade física/lógica),
      "razao": "string explicativa concisa"
    }
  ]
}`;

      const response = await generateContentWithRetry({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              conexoes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    origem_id: { type: Type.STRING },
                    destino_id: { type: Type.STRING },
                    tipo_relacao: { type: Type.STRING },
                    peso: { type: Type.INTEGER },
                    razao: { type: Type.STRING }
                  },
                  required: ['origem_id', 'destino_id', 'tipo_relacao', 'peso', 'razao']
                }
              }
            },
            required: ['conexoes']
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      if (data.conexoes && Array.isArray(data.conexoes)) {
        data.conexoes.forEach((conn: any) => {
          const existsOrig = memories.some(m => m.id === conn.origem_id);
          const existsDest = memories.some(m => m.id === conn.destino_id);
          if (existsOrig && existsDest) {
            const relId = `r_ai_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
            db.saveRelationship({
              id: relId,
              origem_id: conn.origem_id,
              destino_id: conn.destino_id,
              peso: Math.min(10, Math.max(5, conn.peso)),
              tipo_relacao: conn.tipo_relacao || 'organiza'
            });

            const mO = memories.find(m => m.id === conn.origem_id);
            const mD = memories.find(m => m.id === conn.destino_id);
            const detailStr = `Conexão auto-sugerida: "${mO?.conteudo}" 🔗 "${mD?.conteudo}" (${conn.tipo_relacao}) - Razão: ${conn.razao}`;
            auditLogs.push(detailStr);
            db.addLog('REFORÇO', `Auto-Melhoria: ${detailStr}`);
            relationshipsCreated++;
            orphansConnected++;
          }
        });
      }
    }

    // Improve 2 code memories with AI-generated comments and optimization findings!
    const codeMemories = memories.filter(m => m.codeSnippet && (!m.docstring || m.docstring.length < 10));
    if (codeMemories.length > 0) {
      for (const codeNode of codeMemories.slice(0, 2)) {
        const promptCode = `Você é um Analista Sênior de Código. Analise o seguinte trecho de código indexado e gere uma documentação síncrota em português no formato docstring, explicando o propósito lógico. Além disso, identifique se existem melhorias de vulnerabilidades ou performance.

Snippet de Código:
\`\`\`
${codeNode.codeSnippet}
\`\`\`

Retorne um JSON no formato:
{
  "docstring": "string explicativa detalhada do que o código faz",
  "details": "string com parâmetros, retornos, dependências e análises extras",
  "otimizacao": "string opcional com recomendação de refatoração para performance ou segurança"
}`;

        const codeResponse = await generateContentWithRetry({
          model: 'gemini-3.5-flash',
          contents: promptCode,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                docstring: { type: Type.STRING },
                details: { type: Type.STRING },
                otimizacao: { type: Type.STRING }
              },
              required: ['docstring', 'details', 'otimizacao']
            }
          }
        });

        const codeData = JSON.parse(codeResponse.text || '{}');
        if (codeData.docstring || codeData.details) {
          db.saveMemory({
            ...codeNode,
            docstring: codeData.docstring || codeNode.docstring,
            details: codeData.details || codeNode.details,
            visualWeight: Math.min(10, codeNode.visualWeight + 1)
          });

          const logMsg = `Código "${codeNode.conteudo}" auto-explicado pela IA.`;
          auditLogs.push(logMsg);
          db.addLog('COGNICÃO', logMsg);
          optimizationsApplied++;

          if (codeData.otimizacao && codeData.otimizacao.length > 20) {
            const optNodeId = `n_opt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
            db.saveMemory({
              id: optNodeId,
              conteudo: `Otimização: ${codeNode.conteudo}`,
              tipo: 'fato',
              timestamp: new Date().toISOString(),
              visualWeight: 6,
              lastAccessed: new Date().toISOString(),
              accessCount: 1,
              details: codeData.otimizacao
            });

            db.saveRelationship({
              id: `r_opt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              origem_id: optNodeId,
              destino_id: codeNode.id,
              peso: 8,
              tipo_relacao: 'otimiza'
            });

            db.addLog('MEMORIZAÇÃO', `Injetada recomendação de otimização/refatoração conectada a "${codeNode.conteudo}"`);
          }
        }
      }
    }

  } catch (err: any) {
    console.warn('Utilizando Heurística de Consolidação de Rede Offline:', err.message);

    if (orphans.length > 0) {
      orphans.forEach(orph => {
        let bestTarget: Memory | null = null;
        let highestScore = 0;

        const orphTokens = new Set(orph.conteudo.toLowerCase().split(/\s+/).filter(t => t.length > 3));

        connectedNodes.forEach(conn => {
          let score = 0;
          const connTokens = new Set(conn.conteudo.toLowerCase().split(/\s+/).filter(t => t.length > 3));
          
          orphTokens.forEach(t => {
            if (connTokens.has(t) || conn.details?.toLowerCase().includes(t)) {
              score++;
            }
          });

          if (orph.tipo === 'entidade' && conn.tipo === 'fato') score += 0.5;

          if (score > highestScore) {
            highestScore = score;
            bestTarget = conn;
          }
        });

        if (!bestTarget && connectedNodes.length > 0) {
          bestTarget = connectedNodes.find(c => c.id === '3' || c.id === '1') || connectedNodes[0];
          highestScore = 1;
        }

        if (bestTarget) {
          const relId = `r_he__${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          db.saveRelationship({
            id: relId,
            origem_id: orph.id,
            destino_id: (bestTarget as Memory).id,
            peso: 6,
            tipo_relacao: 'correlaciona'
          });

          const logMsg = `Heurística Autônoma: Conectado nó órfão "${orph.conteudo}" com "${(bestTarget as Memory).conteudo}"`;
          auditLogs.push(logMsg);
          db.addLog('REFORÇO', logMsg);
          relationshipsCreated++;
          orphansConnected++;
        }
      });
    }

    const codeMemories = memories.filter(m => m.codeSnippet && (!m.docstring || m.docstring.length < 10));
    codeMemories.slice(0, 3).forEach(cNode => {
      db.saveMemory({
        ...cNode,
        docstring: `Método de Software para "${cNode.conteudo}". Executa rotina estrutural identificada no repositório.`,
        details: `Parâmetros de assinatura do código fonte de "${cNode.conteudo}".`,
        visualWeight: Math.min(10, cNode.visualWeight + 1)
      });
      const logMsg = `Heurística Autônoma: Documentação técnica adicionada para "${cNode.conteudo}".`;
      auditLogs.push(logMsg);
      db.addLog('COGNICÃO', logMsg);
      optimizationsApplied++;
    });
  }

  return {
    success: true,
    orphansConnected,
    relationshipsCreated,
    optimizationsApplied,
    auditLogs
  };
}

/**
 * Step 5: Advanced AI-Driven Synaptic Training on Newly Imported Source, Skins, or Skills
 * Teaches the AI Cortex how the newly imported Git repository, visual Skin design, or custom Creator Skill functions,
 * generating dedicated architectural understanding nodes and linking them to Core consciousness centers.
 */
export async function trainBrainOnSource(
  sourceType: 'git' | 'design' | 'skill',
  sourceId: string,
  sourceName: string,
  additionalContext: string
): Promise<{ success: boolean; logs: string[] }> {
  const logs: string[] = [];
  
  db.addLog('COGNICÃO', `[TREINAMENTO DE IA] Iniciando treinamento sináptico sobre ${sourceType}: "${sourceName}"`);
  logs.push(`Iniciando análise do córtex sobre ${sourceType}: "${sourceName}"...`);

  try {
    const ai = getGemini();

    const systemContextPrompt = `Você é o Centro de Treinamento Cognitivo do Layon-System.
O usuário adicionou ou importou um novo recurso do sistema (${sourceType}): "${sourceName}".
Sua tarefa é treinar o cérebro artificial para que a inteligência artificial aprenda e compreenda perfeitamente todas as funções, visual, arquitetura e propósitos pragmáticos desse novo componente.

Recurso adicionado (${sourceType}):
- Nome: ${sourceName}
- Identificador no Grafo: ${sourceId}
- Detalhes contextuais: ${additionalContext}

Crie de 2 a 4 novas memórias refinadas (nós de conhecimento) que o cérebro deve absorver para usar perfeitamente esse recurso nas funções gerais do chat.
Cada nova memória deve conter:
- conteudo: Um título conciso em português (ex: "Arquitetura do Repositório [Nome]", "Efeitos de CSS Neon-Glow do Skin [Nome]")
- tipo: Classificação estritamente de acordo com as regras: "entidade", "fato", "evento" ou "sentimento"
- details: Explicação detalhada e didática em português de como a IA deve usar, referenciar ou programar com esta informação.

Além disso, defina conexões (relacoes) ligando os novos nós de forma bidirecional ou estruturada a nós pré-existentes.
O recurso principal deve ser firmemente conectado a:
- '1' (João Layon - Criador)
- '4' (Cérebro Digital - Centro Cognitivo)
- '5' (Inteligência Artificial - Motor de Síntese)
E as novas memórias de compreensão criadas por você devem se conectar de volta para o recurso principal em '${sourceId}'.

Retorne estritamente um JSON no seguinte formato:
{
  "novasMemorias": [
    {
      "id": "string única gerada por você (ex: 'mem_train_[slug]_[random]')",
      "conteudo": "string concisa",
      "tipo": "string ('entidade' | 'fato' | 'evento' | 'sentimento')",
      "details": "string detalhada de doc/ensino técnico"
    }
  ],
  "conexoes": [
    {
      "origem_id": "string (id de origem)",
      "destino_id": "string (id de destino)",
      "tipo_relacao": "string (ex: 'especializa', 'implementa', 'ensina', de 1 a 3 palavras concisas)",
      "peso": number (peso de 6 a 10 de acordo com a relevância semântica)
    }
  ],
  "conclusaoTreinamento": "Uma declaração inspiradora e técnica de 1 a 2 frases explicando o que o cérebro aprendeu nesta rodada de treinamento."
}`;

    const response = await generateContentWithRetry({
      model: 'gemini-3.5-flash',
      contents: systemContextPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            novasMemorias: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  conteudo: { type: Type.STRING },
                  tipo: { type: Type.STRING, enum: ['entidade', 'fato', 'evento', 'sentimento'] },
                  details: { type: Type.STRING }
                },
                required: ['id', 'conteudo', 'tipo', 'details']
              }
            },
            conexoes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  origem_id: { type: Type.STRING },
                  destino_id: { type: Type.STRING },
                  tipo_relacao: { type: Type.STRING },
                  peso: { type: Type.INTEGER }
                },
                required: ['origem_id', 'destino_id', 'tipo_relacao', 'peso']
              }
            },
            conclusaoTreinamento: { type: Type.STRING }
          },
          required: ['novasMemorias', 'conexoes', 'conclusaoTreinamento']
        }
      }
    });

    const output = JSON.parse(response.text || '{}');

    // 1. Save new Memory Nodes
    if (output.novasMemorias && Array.isArray(output.novasMemorias)) {
      output.novasMemorias.forEach((m: any) => {
        db.saveMemory({
          id: m.id,
          conteudo: m.conteudo,
          tipo: m.tipo as MemoryType,
          timestamp: new Date().toISOString(),
          visualWeight: 6,
          lastAccessed: new Date().toISOString(),
          details: m.details
        });
        logs.push(`Nova sinapse gravada: "${m.conteudo}"`);
      });
    }

    // 2. Save Connections
    if (output.conexoes && Array.isArray(output.conexoes)) {
      output.conexoes.forEach((c: any) => {
        const memsNow = db.getMemories();
        const origExists = memsNow.some(mn => mn.id === c.origem_id);
        const destExists = memsNow.some(mn => mn.id === c.destino_id);
        if (origExists && destExists) {
          db.saveRelationship({
            id: `r_train_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            origem_id: c.origem_id,
            destino_id: c.destino_id,
            peso: Math.min(10, Math.max(5, c.peso)),
            tipo_relacao: c.tipo_relacao || 'compreende'
          });
        }
      });
    }

    const conclusao = output.conclusaoTreinamento || `Treinamento cognitivo de ${sourceType} concluído com sucesso.`;
    db.addLog('REFORÇO', `[CONCLUÍDO] ${conclusao}`);
    logs.push(conclusao);

    // Keep core connections solid
    const defaultCoreIds = ['1', '4', '5'];
    const relationsNow = db.getRelationships();
    defaultCoreIds.forEach(coreId => {
      const exists = relationsNow.some(r => 
        (r.origem_id === coreId && r.destino_id === sourceId) || 
        (r.origem_id === sourceId && r.destino_id === coreId)
      );
      if (!exists) {
        db.saveRelationship({
          id: `rel_train_core_${sourceId}_${coreId}`,
          origem_id: coreId,
          destino_id: sourceId,
          peso: 8,
          tipo_relacao: coreId === '1' ? 'Explora' : (coreId === '4' ? 'Mapeia' : 'Codifica')
        });
      }
    });

    return { success: true, logs };

  } catch (err: any) {
    console.warn(`[Offline fallback] Treinamento de IA via Heurística para ${sourceType}:`, err.message);

    const heuristicMemId = `mem_train_heur_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    let heurTitle = '';
    let heurDetails = '';
    let heurType: MemoryType = 'fato';

    if (sourceType === 'git') {
      heurTitle = `Manual Técnico: Repositório ${sourceName}`;
      heurDetails = `O cérebro consolidou os fluxos de classes, funções e dependências de ${sourceName}. Esta base técnica capacitará a inteligência artificial a estender, sugerir correções e documentar essas estruturas automaticamente a partir do chat interativo de João Layon.`;
    } else if (sourceType === 'design') {
      heurTitle = `Visual Skin: Layout ${sourceName}`;
      heurDetails = `Conhecimento visual consolidado sobre o skin/design "${sourceName}". Registrou os arquivos fontes, estilização responsiva com classes Tailwind, logos e mockups interativos. A IA agora compreende como invocar ou reproduzir este layout moderno.`;
      heurType = 'entidade';
    } else {
      heurTitle = `Habilidade de Criação: ${sourceName}`;
      heurDetails = `Guia estratégico absorvido para a diretriz de prompt de IA "${sourceName}". Configura o direcionador sintático e as tags de categorização para melhorar a precisão estética na geração de novos blocos e widgets de faturamento.`;
    }

    db.saveMemory({
      id: heuristicMemId,
      conteudo: heurTitle,
      tipo: heurType,
      timestamp: new Date().toISOString(),
      visualWeight: 6,
      lastAccessed: new Date().toISOString(),
      details: heurDetails
    });

    db.saveRelationship({
      id: `r_heur_train_${Date.now()}_1`,
      origem_id: heuristicMemId,
      destino_id: sourceId,
      peso: 8,
      tipo_relacao: 'diretriz_de'
    });

    db.saveRelationship({
      id: `r_heur_train_${Date.now()}_2`,
      origem_id: '4',
      destino_id: heuristicMemId,
      peso: 7,
      tipo_relacao: 'Mapeia'
    });

    const conclusaoMsg = `[Treinamento Heurístico] Memória técnica "${heurTitle}" criada e interconectada ao cérebro central com sucesso.`;
    db.addLog('REFORÇO', conclusaoMsg);
    logs.push(conclusaoMsg);

    return { success: true, logs };
  }
}
