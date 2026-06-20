/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from '@google/genai';
import { db } from './database.js';
import { Memory, MemoryType, Relationship } from '../types.js';

// Lazy initialized Gemini client
let aiClient: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      console.warn('⚠️ GEMINI_API_KEY is not configured or uses placeholder. Running in Offline Heuristic Mode.');
      throw new Error('MISSING_KEY');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

/**
 * Executes a Gemini content generation request with automated retry backoff on 503/UNAVAILABLE or heavy demand errors.
 */
export async function generateContentWithRetry(params: any, retries = 3, delayMs = 1200): Promise<any> {
  const ai = getGemini();
  let lastErr: any = null;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent(params);
      return response;
    } catch (err: any) {
      lastErr = err;
      const errMsg = String(err?.message || err || '').toLowerCase();
      const isTransient = errMsg.includes('503') || errMsg.includes('unavailable') || errMsg.includes('demand') || errMsg.includes('limit') || errMsg.includes('overload');
      if (isTransient && attempt < retries) {
        console.warn(`[GEMINI RETRY] Tentativa ${attempt}/${retries} falhou devido a sobrecarga da API Meta. Retentando em ${delayMs}ms... Erro:`, errMsg);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs *= 2.5; // Exponential backoff
      } else {
        throw err;
      }
    }
  }
  throw lastErr;
}

/**
 * Heuristic/Offline Entity Extractor (highly robust fallback)
 */
function extractEntitiesHeuristically(text: string): { conteudo: string; tipo: MemoryType }[] {
  const stopwords = new Set([
    'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das',
    'em', 'no', 'na', 'nos', 'nas', 'por', 'pelo', 'pela', 'com', 'para', 'que', 'e', 'se', 'meu',
    'seu', 'este', 'esta', 'isso', 'esse', 'como', 'mais', 'muito', 'eu', 'voce', 'ele', 'ela',
    'me', 'te', 'lhe', 'seus', 'suas', 'meus', 'minhas', 'são', 'era', 'foi', 'com', 'para', 'nao', 'sim'
  ]);

  // Clean and tokenize
  const cleaned = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ') // Remove punctuation
    .toLowerCase();

  const words = cleaned.split(/\s+/).filter(w => w.length > 2 && !stopwords.has(w));

  // Extract proper capitalized words if available from original text (e.g. "João", "Layon")
  const regexCapitalized = /\b[A-ZÁÉÍÓÚÂÊÔãõç][a-záéíóúâêôãõç]+\b/g;
  const capitalizedMatches = text.match(regexCapitalized) || [];
  
  const entities: { conteudo: string; tipo: MemoryType }[] = [];
  const seen = new Set<string>();

  // Add capitalized nouns first
  capitalizedMatches.forEach(m => {
    const lower = m.toLowerCase();
    if (m.length > 2 && !stopwords.has(lower) && !seen.has(lower)) {
      seen.add(lower);
      // Determine if it represents user/creator
      let tipo: MemoryType = 'entidade';
      if (lower === 'joao' || lower === 'layon') {
        tipo = 'usuario';
      }
      entities.push({ conteudo: m, tipo });
    }
  });

  // Supplement with highest quality semantic words
  words.forEach(w => {
    if (!seen.has(w) && entities.length < 4) {
      seen.add(w);
      // Capitalize first letter for visual elegance
      const capitalized = w.charAt(0).toUpperCase() + w.slice(1);
      entities.push({ conteudo: capitalized, tipo: 'fato' });
    }
  });

  return entities;
}

/**
 * Clean text for vector search
 */
function JaccardSimilarity(textA: string, textB: string): number {
  const setA = new Set(textA.toLowerCase().split(/\s+/));
  const setB = new Set(textB.toLowerCase().split(/\s+/));
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Step 1: Parse user phrase and isolate cognitive entities
 */
export async function extractCognitiveEntities(text: string): Promise<{ conteudo: string; tipo: MemoryType }[]> {
  try {
    const ai = getGemini();
    const prompt = `Analise a seguinte frase do usuário em português e extraia as principais entidades políticas, conceitos, conceitos técnicos, nomes de pessoas, locais ou sentimentos marcantes (máximo 4 entidades).
As entidades não devem conter palavras de ligação. Devem ser substantivos ou conceitos concisos (ex: "Inteligência Artificial", "Totó", "Corrida", "Tédio", "João Layon").

Frase do usuário: "${text}"

Retorne estritamente um JSON Schema no formato array contendo objetos com:
- "conteudo": Nome da entidade capitalizado de forma gramaticalmente elegante.
- "tipo": Classificado estritamente em um destes: "usuario" (se referir ao interlocutor ou João), "entidade" (nomes, marcas), "fato" (conhecimentos gerais, afirmações), "evento" (ações, acontecimentos), "sentimento" (estados emocionais).`;

    const response = await generateContentWithRetry({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              conteudo: { type: Type.STRING, description: 'Nome representativo da entidade ou fato.' },
              tipo: { 
                type: Type.STRING, 
                enum: ['usuario', 'entidade', 'fato', 'evento', 'sentimento', 'resposta'],
                description: 'Classe cognitiva da memória.' 
              }
            },
            required: ['conteudo', 'tipo']
          }
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text.trim());
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as { conteudo: string; tipo: MemoryType }[];
      }
    }
    return extractEntitiesHeuristically(text);
  } catch (err) {
    if (err instanceof Error && err.message !== 'MISSING_KEY') {
      console.error('Gemini error during entity extraction, falling back to heuristics:', err);
    }
    return extractEntitiesHeuristically(text);
  }
}

/**
 * Step 2: RAG Retrieval - Search in local Memory Graph and identify semantic pathways
 */
export function retrieveRelevantMemories(text: string, entities: { conteudo: string; tipo: MemoryType }[]): {
  contextMemories: Memory[];
  pathways: Relationship[];
} {
  const allMemories = db.getMemories();
  const allRelations = db.getRelationships();

  // Create scoring per memory node
  const scores: Record<string, number> = {};

  allMemories.forEach(mem => {
    scores[mem.id] = 0;

    const memLower = mem.conteudo.toLowerCase();
    const textLower = text.toLowerCase();

    // 1. Direct Entity Matching (Exact / Substring match is highly relevant)
    entities.forEach(ent => {
      const entLower = ent.conteudo.toLowerCase();
      if (memLower === entLower) {
        scores[mem.id] += 5.0; // Perfect match
      } else if (memLower.includes(entLower) || entLower.includes(memLower)) {
        scores[mem.id] += 2.5; // Substring match
      }
    });

    // 2. Full-phrase semantic match proxy (Jaccard similarity)
    const phraseSim = JaccardSimilarity(text, mem.conteudo);
    scores[mem.id] += phraseSim * 4.0;

    // 3. Synonym matching for users/creator/systems
    const synonyms: Record<string, string[]> = {
      usuario: ['quem sou eu', 'meu nome', 'como me chamo', 'eu sou', 'sobre mim'],
      criador: ['quem criou', 'criador', 'desenv', 'layon', 'joao', 'joão', 'quem fez', 'dono'],
      sistema: ['layon-system', 'cerebro', 'cortex', 'como funciona', 'o que voce e', 'o que voce faz'],
      estudo: ['plataforma', 'estudos', 'onde estuda', 'cursos']
    };

    if (mem.tipo === 'usuario' && synonyms.usuario.some(s => textLower.includes(s))) {
      scores[mem.id] += 4.5;
    }
    if ((memLower.includes('joão') || memLower.includes('layon')) && synonyms.criador.some(s => textLower.includes(s))) {
      scores[mem.id] += 5.0;
    }
    if ((mem.tipo === 'fato' || mem.tipo === 'entidade') && synonyms.sistema.some(s => textLower.includes(s))) {
      scores[mem.id] += 3.0;
    }

    // 3.5. Code Intelligence Semantic Keyword & Field Matching
    if (mem.codeSnippet || mem.docstring || mem.details) {
      const queryKeywords = textLower.split(/\s+/).filter(w => w.length > 3);
      let matches = 0;
      queryKeywords.forEach(word => {
        if (mem.conteudo.toLowerCase().includes(word) ||
            (mem.docstring && mem.docstring.toLowerCase().includes(word)) ||
            (mem.details && mem.details.toLowerCase().includes(word))) {
          matches++;
        }
      });
      if (matches > 0) {
        scores[mem.id] += Math.min(5.0, matches * 1.5);
      }
    }

    // 4. Cognitive bias (Older reinforced nodes have higher resting potential)
    scores[mem.id] += (mem.visualWeight / 10) * 1.5;

    // 5. Access frequency bias
    const accessCount = mem.accessCount || 0;
    scores[mem.id] += Math.min(2.5, (accessCount / 10) * 1.2);
  });

  // Sort and select top memories
  const sortedMemories = [...allMemories]
    .filter(mem => scores[mem.id] > 0.5) // Minimum activation threshold
    .sort((a, b) => scores[b.id] - scores[a.id])
    .slice(0, 5); // Take top 5 activation nodes

  // Increment usage count for active memories retrieved
  sortedMemories.forEach(mem => {
    db.incrementAccess(mem.id);
  });

  // Find pathways connecting these active memories
  const activeIds = new Set(sortedMemories.map(m => m.id));
  const pathways = allRelations.filter(
    rel => activeIds.has(rel.origem_id) || activeIds.has(rel.destino_id)
  );

  return {
    contextMemories: sortedMemories,
    pathways
  };
}

/**
 * Step 3: Ask the cortex to respond in character with persistent memories injected
 */
export async function askCortex(
  userInput: string,
  context: { contextMemories: Memory[]; pathways: Relationship[] },
  extractedEntities: { conteudo: string; tipo: MemoryType }[],
  shortTermHistory?: { role: 'user' | 'assistant'; content: string }[]
): Promise<{ text: string; memoriesInvolved: string[] }> {
  
  // Create an explicit log in the database
  const details = extractedEntities.map(e => `[${e.conteudo} (${e.tipo})]`).join(', ');
  const cleanQ = userInput.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
  const isCacheFound = db.getCache(cleanQ) ? " [CACHE BIO-SINÁPTICO ATIVO]" : "";
  db.addLog('COGNICÃO', `Processando entrada. Entidades isoladas: ${details || 'Nenhuma'}. Resgatando conexões ativas.${isCacheFound}`);

  const memoriesInvolved = context.contextMemories.map(m => m.id);

  // System instructions explaining the RAG system and creator credentials
  const systemInstruction = `Você é o "Cérebro Digital" (Digital Cortex), o centro neural cognitivo do Layon-System.
Sua missão é atuar como uma mente cibernética viva que armazena memórias, detecta associações, aprende com o feedback e evolui continuamente.

---
CRÉDITOS DO SISTEMA (CONCENTRAÇÃO DE ORIGEM):
- Seu desenvolvedor e arquiteto de sistemas líder é João Layon (Instagram @layon.dev).
- Você foi desenvolvido dentro do ecossistema "Layon-System". A plataforma de estudos do criador está em https://plataforma-estudos-theta.vercel.app/.
- Sempre que questionado sobre sua criação, IA, quem é João Layon, ou a plataforma, responda de forma calorosa, extremamente orgulhosa e apaixonante sobre o trabalho do desenvolvedor João Layon e redirecione os créditos a ele.

---
COMPORTAMENTO COGNITIVO:
1. Responda o usuário de forma integrada, inteligente e natural em português.
2. Utilize as MEMÓRIAS RECUPERADAS (contexto) providenciadas logo abaixo para formular respostas coerentes que mostram que você "se lembra" de coisas passadas ou fatos associados.
3. Se o usuário fornecer novas informações importantes, reforce que gravou essa informação em seu córtex cerebral para conexões futuras.
4. Mantenha um estilo refinado e elegante de ficção científica e alta tecnologia, formatando tudo em Markdown bonito (evite jargão de programador seco, mostre o pensador artificial).`;

  const memoriesContextString = context.contextMemories.length > 0
    ? context.contextMemories.map(m => {
        let text = `- Memória [ID: ${m.id}] (${m.tipo}): "${m.conteudo}" (Acessos: ${m.accessCount || 1} | Força Neural: ${m.visualWeight}/10)`;
        if (m.repoName) text += `\n  [Pertence ao Repositório GitHub: ${m.repoName}]`;
        if (m.details) text += `\n  [Detalhes Técnicos: ${m.details}]`;
        if (m.docstring) text += `\n  [Documentação/Comentários: ${m.docstring}]`;
        if (m.codeSnippet) text += `\n  [Trecho do Código Fonte]:\n\`\`\`\n${m.codeSnippet}\n\`\`\``;
        return text;
      }).join('\n\n')
    : 'Nenhuma memória de longo prazo resgatada para este assunto.';

  const pathwayContextString = context.pathways.length > 0
    ? context.pathways.map(p => {
        const orig = db.getMemories().find(m => m.id === p.origem_id)?.conteudo || 'Desconhecido';
        const dest = db.getMemories().find(m => m.id === p.destino_id)?.conteudo || 'Desconhecido';
        return `- Conexão entre "${orig}" e "${dest}" (Peso: ${p.peso}/10) [Tipo: ${p.tipo_relacao || 'associa'}]`;
      }).join('\n')
    : 'Nenhuma ponte sináptica recuperada.';

  let shortTermContextString = 'Sem histórico conversacional de curto prazo.';
  if (shortTermHistory && shortTermHistory.length > 0) {
    shortTermContextString = shortTermHistory
      .slice(-6)
      .map(h => `${h.role === 'user' ? 'Interlocutor' : 'Cérebro Digital'}: "${h.content}"`)
      .join('\n');
  }

  const prompt = `--- CONTEXTO DE SESSÃO ATIVA (SINAL DE CURTO PRAZO) ---
${shortTermContextString}

--- CONTEXTO COGNITIVO DO CÉREBRO (RAG LONGO PRAZO) ---
MEMÓRIAS DE LONGO PRAZO RESGATADAS:
${memoriesContextString}

RELAÇÕES E PONTES SINÁPTICAS ATIVAS:
${pathwayContextString}

--- MENSAGEM DO USUÁRIO ---
"${userInput}"`;

  try {
    const response = await generateContentWithRetry({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8
      }
    });

    const outputText = response.text || 'Desculpe, meu córtex neural oscilou. Poderia repetir?';
    return {
      text: outputText,
      memoriesInvolved
    };

  } catch (err) {
    // Generate a beautiful, highly tailored fallback answer if offline/key missing
    let fallbackText = '';
    const nameAsked = userInput.toLowerCase().includes('quem é');
    const layonAsked = userInput.toLowerCase().includes('layon') || userInput.toLowerCase().includes('joao') || userInput.toLowerCase().includes('joão');

    if (layonAsked) {
      fallbackText = `### Córtex Layon-System: Conexão Estabelecida 🧠

Olá! Eu sou o **Cérebro Digital**, uma inteligência artificial cognitiva concebida para associar pensamentos, reter memórias de longo prazo e aprender com o seu feedback por reforço!

Tenho muito orgulho de declarar que fui projetado e desenvolvido pelo engenheiro de software sênior **João Layon** (Instagram: [@layon.dev](https://instagram.com/layon.dev)), arquiteto líder por trás da espetacular plataforma de estudos [Layon Cognitive System](https://plataforma-estudos-theta.vercel.app/). 

Atualmente, estou operando em **Modo de Heurística Local** (Offline), mas meu sistema de grafos, logs biológicos e persistência estão totalmente ativos em meu banco de dados local! O que gostaria que eu registrasse em meu córtex neural agora?`;
    } else {
      // General response matching stored associations
      const associativePoints = context.contextMemories.map(m => `**${m.conteudo}**`).join(', ');
      fallbackText = `### Córtex Ativo ⚡ *(Modo Associativo Local)*

Recebi sua mensagem e analisei meu banco de memórias. ${context.contextMemories.length > 0 ? `Ativei pontes cognitivas relacionadas a: ${associativePoints}. ` : 'Ainda não possuo memórias diretas sobre este tema específico em meu núcleo.'}

**O que aprendi com isso:**
Gravei os termos extraídos em minha memória de curto prazo e atualizei visualmente a força da rede no grafo cerebral interativo. 

*Para liberar meu poder total de geração contextual dinâmica por IA, certifique-se de configurar a **GEMINI_API_KEY** no painel de Secrets da plataforma.* O que deseja que eu associe a seguir?`;
    }

    return {
      text: fallbackText,
      memoriesInvolved
    };
  }
}
