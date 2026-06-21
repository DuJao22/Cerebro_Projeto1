/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db } from './src/backend/database.js';
import { extractCognitiveEntities, retrieveRelevantMemories, askCortex } from './src/backend/memory.js';
import { integrateNewEntitiesIntoGraph, applyUserFeedback, applyNaturalDecay, selfImproveBrain, trainBrainOnSource } from './src/backend/learning.js';
import { getFormattedBrainGraph } from './src/backend/graph.js';
import { synthesizeSpeech } from './src/backend/voice.js';
import { listGitHubRepos, syncGitHubRepoToBrain } from './src/backend/github.js';
import { Memory } from './src/types.js';
import { generateAppStructure } from './src/backend/app_creator.js';

const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  const app = express();
  app.use(express.json());

  // Handle explicit API routes
  
  // 1. GET /api/status - Get overall consciousness metrics and activity logs
  app.get('/api/status', (req: Request, res: Response) => {
    try {
      const memories = db.getMemories();
      const relations = db.getRelationships();
      const logs = db.getLogs();

      const totalWeight = memories.reduce((acc, m) => acc + m.visualWeight, 0);
      const averageWeight = memories.length > 0 ? Number((totalWeight / memories.length).toFixed(2)) : 0;

      res.status(200).json({
        totalMemories: memories.length,
        totalRelations: relations.length,
        averageWeight,
        learningLogs: logs,
        logs,
        isSQLiteCloudActive: db.isSQLiteCloudActive()
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro interno do córtex' });
    }
  });

  // 2. GET /api/graph - Get formatted graph data (nodes & lines) for live React d3 display
  app.get('/api/graph', (req: Request, res: Response) => {
    try {
      const graphData = getFormattedBrainGraph();
      res.status(200).json(graphData);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao carregar grafo' });
    }
  });

  // 3. POST /api/chat - Central Cognitive Engine: Parse -> Retrieve -> Cortex Formulation -> Learning Synapse Evolution
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { text, voiceEnabled, history } = req.body;
      if (!text || typeof text !== 'string') {
        res.status(400).json({ error: 'Mensagem de texto do usuário é obrigatória.' });
        return;
      }

      // Check Smart Cache layer for instant, repetitive queries (performance optimization)
      const cleanTextQuery = text.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
      const cachedText = db.getCache(cleanTextQuery);
      if (cachedText) {
        db.addLog('COGNICÃO', `HIT NO CACHE: Resposta instantânea recuperada para: "${text}"`);
        
        // Handle TTS Voice generation for cached path if active
        let voiceBase64 = '';
        if (voiceEnabled) {
          try {
            voiceBase64 = await synthesizeSpeech(cachedText);
          } catch (voiceErr) {
            console.warn('TTS voice bypass for cached content.');
          }
        }

        res.status(200).json({
          id: `msg_cached_${Date.now()}`,
          role: 'assistant',
          content: cachedText,
          timestamp: new Date().toISOString(),
          associatedEntities: [],
          memoriesInvolved: [],
          voiceBase64,
          cached: true
        });
        return;
      }

      // Step A: Extract cognitive entities (People, Facts, Entities)
      const extracted = await extractCognitiveEntities(text);

      // Step B: Formulate synaptical retrieval pathways and re-rank Top-K memories
      const context = retrieveRelevantMemories(text, extracted);

      // Step C: Ask the digital cortex to generate response with short term history injected for context continuity (RAG)
      const cortexResponse = await askCortex(text, context, extracted, history);

      // Step D: Integrate new connections & update visual nodes in the cognitive graph
      const involvedNodeIds = integrateNewEntitiesIntoGraph(extracted);
      
      // Merge involved nodes with pre-existing retrieved memories to make reinforcement powerful
      const allInvolvedNodes = Array.from(new Set([...involvedNodeIds, ...cortexResponse.memoriesInvolved]));

      // Save generated content to Smart Cache layer
      db.saveCache(cleanTextQuery, cortexResponse.text);

      // Step E: Handle TTS Voice generation if user requested vocal output
      let voiceBase64 = '';
      if (voiceEnabled) {
        try {
          voiceBase64 = await synthesizeSpeech(cortexResponse.text);
        } catch (voiceErr) {
          console.warn('Focal speech synthesis bypassed. Utilizing local speech synthesis Web API on client web browser.');
        }
      }

      // Build and return transaction response
      res.status(200).json({
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        role: 'assistant',
        content: cortexResponse.text,
        timestamp: new Date().toISOString(),
        associatedEntities: extracted.map(e => e.conteudo),
        memoriesInvolved: allInvolvedNodes,
        voiceBase64,
        cached: false
      });

    } catch (err: any) {
      console.error('Chat cognition error:', err);
      res.status(500).json({ error: err.message || 'Falha no processamento mental da IA' });
    }
  });

  // 4. POST /api/feedback - Strengthen neural connections based on user 👍 or 👎 feedback
  app.post('/api/feedback', (req: Request, res: Response) => {
    try {
      const { messageId, memoriesInvolved, feedbackType } = req.body;
      if (!messageId || !feedbackType || !Array.isArray(memoriesInvolved)) {
         res.status(400).json({ error: 'Parâmetros de feedback incorretos' });
         return;
      }

      // Record feedback
      db.saveFeedback({
        id: `fb_${Date.now()}`,
        timestamp: new Date().toISOString(),
        messageId,
        feedbackType,
        entitiesUsed: memoriesInvolved
      });

      // Apply adjustment weights in database
      applyUserFeedback(memoriesInvolved, feedbackType);

      res.status(200).json({ success: true, message: 'Pesos sinápticos recalculados.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao gravar reforço' });
    }
  });

  // 5. POST /api/decay - Manually trigger cognitive decay/forgetfulness simulation in graph nodes
  app.post('/api/decay', (req: Request, res: Response) => {
    try {
      applyNaturalDecay();
      res.status(200).json({ success: true, message: 'Varredura de entropia sináptica iniciada com sucesso.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro na entropia sináptica' });
    }
  });

  // 5.5. POST /api/self-improve - Triggers cognitive consolidation (links orphans and adds optimization recommendations)
  app.post('/api/self-improve', async (req: Request, res: Response) => {
    try {
      const result = await selfImproveBrain();
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro durante processo de auto-melhoria' });
    }
  });

  // 6. POST /api/reset - Factory Reset cognitive dataset
  app.post('/api/reset', (req: Request, res: Response) => {
    try {
      db.resetDatabase();
      res.status(200).json({ success: true, message: 'Rede redefinida para os termos iniciais do Layon-System.' });
    } catch (err: any) {
       res.status(500).json({ error: err.message || 'Erro ao redefinir memória' });
    }
  });

  // 7. POST /api/learn-manual - Directly teach or inject a specific memory node and route
  app.post('/api/learn-manual', (req: Request, res: Response) => {
    try {
      const { content, type, connectToId, relationType, weight } = req.body;
      if (!content || typeof content !== 'string') {
        res.status(400).json({ error: 'Conteúdo textual é obrigatório.' });
        return;
      }

      // Generate a clean memory entity
      const nodeId = `n_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newMemory: Memory = {
        id: nodeId,
        conteudo: content,
        tipo: type || 'fato',
        timestamp: new Date().toISOString(),
        visualWeight: 5,
        lastAccessed: new Date().toISOString(),
        accessCount: 1
      };

      db.saveMemory(newMemory);

      // Create optional relationship if targeted
      if (connectToId) {
        const relationId = `r_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        db.saveRelationship({
          id: relationId,
          origem_id: nodeId,
          destino_id: connectToId,
          peso: Number(weight) || 5,
          tipo_relacao: relationType || 'associa'
        });
        const targetMem = db.getMemories().find(m => m.id === connectToId);
        const targetLabel = targetMem ? targetMem.conteudo : 'Outro';
        db.addLog('REFORÇO', `Sinapse manual adicionada: "${content}" 🔗 "${targetLabel}" (Peso: ${weight}/10)`);
      } else {
        db.addLog('MEMORIZAÇÃO', `Nó manual injetado no córtex: "${content}" [Tipo: ${type || 'fato'}]`);
      }

      res.status(200).json({ success: true, nodeId });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro no ensinamento manual' });
    }
  });

  // 8. POST /api/prune-node - Delete node and cascade its edges
  app.post('/api/prune-node', (req: Request, res: Response) => {
    try {
      const { nodeId } = req.body;
      if (!nodeId) {
        res.status(400).json({ error: 'ID do nó é obrigatório.' });
        return;
      }

      const memories = db.getMemories();
      const nodeToPrune = memories.find(m => m.id === nodeId);
      if (!nodeToPrune) {
        res.status(404).json({ error: 'Nó não localizado na base.' });
        return;
      }

      db.deleteMemory(nodeId);
      res.status(200).json({ success: true, message: 'Nó expurgado com sucesso.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao expurgar nó' });
    }
  });

  // 9. POST /api/github/repos - List user or token repositories
  app.post('/api/github/repos', async (req: Request, res: Response) => {
    try {
      const { token, username } = req.body;
      const repos = await listGitHubRepos(token, username);
      res.status(200).json(repos);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao obter repositórios do GitHub' });
    }
  });

  // 10. POST /api/github/sync - Parse repository and ingest classes, functions, and imports
  app.post('/api/github/sync', async (req: Request, res: Response) => {
    try {
      const { owner, repo, branch, token } = req.body;
      if (!owner || !repo || !branch) {
        res.status(400).json({ error: 'Proprietário (owner), repositório (repo) e ramo (branch) são obrigatórios.' });
        return;
      }
      const syncResult = await syncGitHubRepoToBrain(owner, repo, branch, token);

      // TRIGGER INTER-SYNAPTIC AI TRAINING ON THE NEW CODE INTEGRATION
      try {
        const repoNodeId = `repo_${owner.replace(/\W/g, '_').toLowerCase()}_${repo.replace(/\W/g, '_').toLowerCase()}`;
        const trainingDetails = `Repositório ${owner}/${repo} sincronizado com sucesso. Arquivos analisados: ${syncResult.filesCount}, Classes identificadas: ${syncResult.classesCount}, Funções mapeadas: ${syncResult.functionsCount}. Nós novos: ${syncResult.nodesAdded}.`;
        await trainBrainOnSource('git', repoNodeId, `${owner}/${repo}`, trainingDetails);
      } catch (trainErr) {
        console.error('Falha no treinamento de IA pós-sincronização git:', trainErr);
      }

      res.status(200).json({ success: true, ...syncResult });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao sincronizar repositório' });
    }
  });

  // 11. POST /api/app-creator/generate - AI dynamic App Creator engine
  app.post('/api/app-creator/generate', async (req: Request, res: Response) => {
    try {
      const { prompt, existingFiles, action, customSystemPrompt } = req.body;
      if (!prompt) {
        res.status(400).json({ error: 'O prompt de instrução é obrigatório.' });
        return;
      }
      const result = await generateAppStructure(prompt, existingFiles, action, customSystemPrompt);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Falha no gerador de aplicações' });
    }
  });

  // 12. CRUD endpoints for custom shared skills
  app.get('/api/skills', (req: Request, res: Response) => {
    try {
      res.status(200).json(db.getSkills());
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao carregar skills' });
    }
  });

  app.post('/api/skills', async (req: Request, res: Response) => {
    try {
      const { id, name, description, systemPrompt, promptTemplate, tags, author } = req.body;
      if (!name || !systemPrompt || !promptTemplate) {
        res.status(400).json({ error: 'Nome, prompt do sistema e prompt template são obrigatórios.' });
        return;
      }
      const skillId = id || `skill_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const newSkill = {
        id: skillId,
        name,
        description: description || '',
        systemPrompt,
        promptTemplate,
        tags: Array.isArray(tags) ? tags : [],
        author: author || 'Usuário',
        timestamp: new Date().toISOString()
      };
      db.saveSkill(newSkill);

      // TRIGGER INTER-SYNAPTIC AI TRAINING ON THE NEW CREATOR SKILL
      try {
        const skillDetails = `Skill de Geração de Landing Page: "${name}". Descrição: ${description || 'Nenhuma'}. Prompt do Sistema: "${systemPrompt}". Template de Prompt: "${promptTemplate}". Tags da Habilidade: ${tags ? tags.join(', ') : 'Nenhuma'}.`;
        await trainBrainOnSource('skill', skillId, name, skillDetails);
      } catch (trainErr) {
        console.error('Falha no treinamento de IA pós-salvamento de skill:', trainErr);
      }

      res.status(200).json({ success: true, skill: newSkill });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao salvar skill' });
    }
  });

  app.delete('/api/skills/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      db.deleteSkill(id);
      res.status(200).json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao deletar skill' });
    }
  });

  // 13. CRUD endpoints for landing page designs gallery
  app.get('/api/designs', (req: Request, res: Response) => {
    try {
      res.status(200).json(db.getDesigns());
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao carregar galeria' });
    }
  });

  app.post('/api/designs', async (req: Request, res: Response) => {
    try {
      const { id, title, description, code, files, compilationLogs, interactiveVariables, promptUsed, skillIdUsed } = req.body;
      if (!title || !files) {
        res.status(400).json({ error: 'Título e arquivos do design de landing page são obrigatórios.' });
        return;
      }
      const designId = id || `design_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const newDesign = {
        id: designId,
        title,
        description: description || '',
        code: code || '',
        files,
        compilationLogs: compilationLogs || [],
        interactiveVariables: interactiveVariables || {},
        promptUsed: promptUsed || '',
        skillIdUsed: skillIdUsed || '',
        timestamp: new Date().toISOString()
      };
      db.saveDesign(newDesign);

      // TRIGGER INTER-SYNAPTIC AI TRAINING ON THE NEW DESIGN SKIN
      try {
        const fileNames = Object.keys(files || {}).join(', ');
        const designDetails = `Design Visual / Skin de Landing Page "${title}" foi salvo. Descrição: ${description || 'Nenhuma'}. Prompt gerador utilizado: "${promptUsed || 'Manual/Direto'}". Arquivos gerados no layout: [${fileNames}].`;
        await trainBrainOnSource('design', designId, title, designDetails);
      } catch (trainErr) {
        console.error('Falha no treinamento de IA pós-salvamento de design:', trainErr);
      }

      res.status(200).json({ success: true, design: newDesign });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao salvar design' });
    }
  });

  app.delete('/api/designs/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      db.deleteDesign(id);
      res.status(200).json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao excluir design' });
    }
  });

  // 14. GET /api/sqlite/export - Generates and serves a SQL script file to import directly into SQLite Cloud Console
  app.get('/api/sqlite/export', (req: Request, res: Response) => {
    try {
      const memories = db.getMemories();
      const rels = db.getRelationships();
      const logsList = db.getLogs();
      const skillsList = db.getSkills();
      const designsList = db.getDesigns();
      const feedbacksList = db.getFeedbacks();

      let sql = `-- =========================================================\n`;
      sql += `-- SYSTEM-COGNITIVE LARGESCALE BRAIN EXPORT (SQLITE / SQLITE CLOUD)\n`;
      sql += `-- Gerado em: ${new Date().toISOString()}\n`;
      sql += `-- Autor do Cérebro: João Layon (Layon-System)\n`;
      sql += `-- =========================================================\n\n`;
      
      sql += `PRAGMA foreign_keys = ON;\n\n`;

      // 1. Memorias Table
      sql += `-- ---------------------------------------------------------\n`;
      sql += `-- TABELA: memorias (Nós do Grafo Cognitivo)\n`;
      sql += `-- ---------------------------------------------------------\n`;
      sql += `CREATE TABLE IF NOT EXISTS memorias (\n`;
      sql += `  id TEXT PRIMARY KEY,\n`;
      sql += `  conteudo TEXT NOT NULL,\n`;
      sql += `  tipo TEXT NOT NULL,\n`;
      sql += `  timestamp TEXT NOT NULL,\n`;
      sql += `  visualWeight INTEGER NOT NULL,\n`;
      sql += `  lastAccessed TEXT NOT NULL,\n`;
      sql += `  accessCount INTEGER DEFAULT 0,\n`;
      sql += `  codeSnippet TEXT,\n`;
      sql += `  docstring TEXT,\n`;
      sql += `  details TEXT,\n`;
      sql += `  repoName TEXT\n`;
      sql += `);\n\n`;

      // 2. Relacoes Table
      sql += `-- ---------------------------------------------------------\n`;
      sql += `-- TABELA: relacoes (Arestas/Sinapses do Grafo Cognitivo)\n`;
      sql += `-- ---------------------------------------------------------\n`;
      sql += `CREATE TABLE IF NOT EXISTS relacoes (\n`;
      sql += `  id TEXT PRIMARY KEY,\n`;
      sql += `  origem_id TEXT NOT NULL,\n`;
      sql += `  destino_id TEXT NOT NULL,\n`;
      sql += `  peso INTEGER NOT NULL,\n`;
      sql += `  tipo_relacao TEXT,\n`;
      sql += `  FOREIGN KEY (origem_id) REFERENCES memorias(id) ON DELETE CASCADE,\n`;
      sql += `  FOREIGN KEY (destino_id) REFERENCES memorias(id) ON DELETE CASCADE\n`;
      sql += `);\n\n`;

      // 3. Feedbacks Table
      sql += `-- ---------------------------------------------------------\n`;
      sql += `-- TABELA: feedbacks (Ajustes de Pesos por Feedback Humano)\n`;
      sql += `-- ---------------------------------------------------------\n`;
      sql += `CREATE TABLE IF NOT EXISTS feedbacks (\n`;
      sql += `  id TEXT PRIMARY KEY,\n`;
      sql += `  timestamp TEXT NOT NULL,\n`;
      sql += `  messageId TEXT NOT NULL,\n`;
      sql += `  feedbackType TEXT CHECK(feedbackType IN ('good', 'bad')) NOT NULL,\n`;
      sql += `  entitiesUsed TEXT\n`;
      sql += `);\n\n`;

      // 4. Votos Table
      sql += `-- ---------------------------------------------------------\n`;
      sql += `-- TABELA: votos (Votos Unitários por ID de Resposta)\n`;
      sql += `-- ---------------------------------------------------------\n`;
      sql += `CREATE TABLE IF NOT EXISTS votos (\n`;
      sql += `  message_id TEXT PRIMARY KEY,\n`;
      sql += `  voto TEXT CHECK(voto IN ('good', 'bad'))\n`;
      sql += `);\n\n`;

      // 5. Logs Table
      sql += `-- ---------------------------------------------------------\n`;
      sql += `-- TABELA: logs (Registro de Atividades Cognitivas)\n`;
      sql += `-- ---------------------------------------------------------\n`;
      sql += `CREATE TABLE IF NOT EXISTS logs (\n`;
      sql += `  id TEXT PRIMARY KEY,\n`;
      sql += `  timestamp TEXT NOT NULL,\n`;
      sql += `  acao TEXT CHECK(acao IN ('MEMORIZAÇÃO', 'REFORÇO', 'COGNICÃO', 'ENFRAQUECIMENTO', 'ESQUECIMENTO', 'FEEDBACK')) NOT NULL,\n`;
      sql += `  detalhe TEXT NOT NULL\n`;
      sql += `);\n\n`;

      // 6. Cache Responses
      sql += `-- ---------------------------------------------------------\n`;
      sql += `-- TABELA: cacheResponses (Intelligent Memo Cache)\n`;
      sql += `-- ---------------------------------------------------------\n`;
      sql += `CREATE TABLE IF NOT EXISTS cacheResponses (\n`;
      sql += `  prompt TEXT PRIMARY KEY,\n`;
      sql += `  response TEXT NOT NULL\n`;
      sql += `);\n\n`;

      // 7. Skills Table
      sql += `-- ---------------------------------------------------------\n`;
      sql += `-- TABELA: skills (Instâncias de Layout do Gerador de LPs)\n`;
      sql += `-- ---------------------------------------------------------\n`;
      sql += `CREATE TABLE IF NOT EXISTS skills (\n`;
      sql += `  id TEXT PRIMARY KEY,\n`;
      sql += `  name TEXT NOT NULL,\n`;
      sql += `  description TEXT NOT NULL,\n`;
      sql += `  systemPrompt TEXT NOT NULL,\n`;
      sql += `  promptTemplate TEXT NOT NULL,\n`;
      sql += `  tags TEXT, \n`;
      sql += `  author TEXT,\n`;
      sql += `  timestamp TEXT NOT NULL\n`;
      sql += `);\n\n`;

      // 8. Designs Table
      sql += `-- ---------------------------------------------------------\n`;
      sql += `-- TABELA: designs (Arquivos e Códigos do Portfólio de LPs)\n`;
      sql += `-- ---------------------------------------------------------\n`;
      sql += `CREATE TABLE IF NOT EXISTS designs (\n`;
      sql += `  id TEXT PRIMARY KEY,\n`;
      sql += `  title TEXT NOT NULL,\n`;
      sql += `  description TEXT NOT NULL,\n`;
      sql += `  code TEXT NOT NULL,\n`;
      sql += `  files TEXT,\n`;
      sql += `  compilationLogs TEXT,\n`;
      sql += `  interactiveVariables TEXT,\n`;
      sql += `  promptUsed TEXT,\n`;
      sql += `  skillIdUsed TEXT,\n`;
      sql += `  timestamp TEXT NOT NULL\n`;
      sql += `);\n\n`;

      // --- ESCAPE AND SEED DATA UTILITY ---
      const escapeSQL = (val: any) => {
        if (val === undefined || val === null) return 'NULL';
        const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
        return "'" + str.replace(/'/g, "''") + "'";
      };

      sql += `-- =========================================================\n`;
      sql += `-- INICIAÇÃO DAS CARGAS DE DADOS COGNITIVOS\n`;
      sql += `-- =========================================================\n\n`;

      // Memorias inserts
      if (memories.length > 0) {
        sql += `-- Carga de Memórias\n`;
        memories.forEach(m => {
          sql += `INSERT OR REPLACE INTO memorias (id, conteudo, tipo, timestamp, visualWeight, lastAccessed, accessCount, codeSnippet, docstring, details, repoName) VALUES (${escapeSQL(m.id)}, ${escapeSQL(m.conteudo)}, ${escapeSQL(m.tipo)}, ${escapeSQL(m.timestamp)}, ${m.visualWeight}, ${escapeSQL(m.lastAccessed)}, ${m.accessCount || 0}, ${escapeSQL(m.codeSnippet)}, ${escapeSQL(m.docstring)}, ${escapeSQL(m.details)}, ${escapeSQL(m.repoName)});\n`;
        });
        sql += `\n`;
      }

      // Relacoes inserts
      if (rels.length > 0) {
        sql += `-- Carga de Conexões (Sinapses)\n`;
        rels.forEach(r => {
          sql += `INSERT OR REPLACE INTO relacoes (id, origem_id, destino_id, peso, tipo_relacao) VALUES (${escapeSQL(r.id)}, ${escapeSQL(r.origem_id)}, ${escapeSQL(r.destino_id)}, ${r.peso}, ${escapeSQL(r.tipo_relacao)});\n`;
        });
        sql += `\n`;
      }

      // Feedbacks inserts
      if (feedbacksList && feedbacksList.length > 0) {
        sql += `-- Carga de Feedbacks Realizados\n`;
        feedbacksList.forEach(f => {
          sql += `INSERT OR REPLACE INTO feedbacks (id, timestamp, messageId, feedbackType, entitiesUsed) VALUES (${escapeSQL(f.id)}, ${escapeSQL(f.timestamp)}, ${escapeSQL(f.messageId)}, ${escapeSQL(f.feedbackType)}, ${escapeSQL(f.entitiesUsed)});\n`;
        });
        sql += `\n`;
      }

      // Logs inserts
      if (logsList.length > 0) {
        sql += `-- Carga dos Logs de Inteligência\n`;
        logsList.forEach(l => {
          sql += `INSERT OR REPLACE INTO logs (id, timestamp, acao, detalhe) VALUES (${escapeSQL(l.id)}, ${escapeSQL(l.timestamp)}, ${escapeSQL(l.acao)}, ${escapeSQL(l.detalhe)});\n`;
        });
        sql += `\n`;
      }

      // Skills inserts
      if (skillsList.length > 0) {
        sql += `-- Carga de Habilidades (Skills)\n`;
        skillsList.forEach(s => {
          sql += `INSERT OR REPLACE INTO skills (id, name, description, systemPrompt, promptTemplate, tags, author, timestamp) VALUES (${escapeSQL(s.id)}, ${escapeSQL(s.name)}, ${escapeSQL(s.description)}, ${escapeSQL(s.systemPrompt)}, ${escapeSQL(s.promptTemplate)}, ${escapeSQL(s.tags)}, ${escapeSQL(s.author)}, ${escapeSQL(s.timestamp)});\n`;
        });
        sql += `\n`;
      }

      // Designs inserts
      if (designsList.length > 0) {
        sql += `-- Carga de Portfólios de Landing Page Salvos\n`;
        designsList.forEach(d => {
          sql += `INSERT OR REPLACE INTO designs (id, title, description, code, files, compilationLogs, interactiveVariables, promptUsed, skillIdUsed, timestamp) VALUES (${escapeSQL(d.id)}, ${escapeSQL(d.title)}, ${escapeSQL(d.description)}, ${escapeSQL(d.code)}, ${escapeSQL(d.files)}, ${escapeSQL(d.compilationLogs)}, ${escapeSQL(d.interactiveVariables)}, ${escapeSQL(d.promptUsed)}, ${escapeSQL(d.skillIdUsed)}, ${escapeSQL(d.timestamp)});\n`;
        });
        sql += `\n`;
      }

      sql += `-- Fim do dump cognitivo. Importado com sucesso.\n`;

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="cerebro_sqlitecloud_carga.sql"');
      res.status(200).send(sql);
    } catch (err: any) {
      res.status(500).send(`-- EXECUTION FAILED: ${err.message}`);
    }
  });

  // Static files / developer server setup
  if (!isProd) {
    console.log('Mounting development middleware for dynamic layout HMR...');
    const viteServer = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    
    // Serve Vite assets
    app.use(viteServer.middlewares);

    // Fallback index.html router
    app.use('*', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await viteServer.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        viteServer.ssrFixStacktrace(e as Error);
        next(e);
      }
    });

  } else {
    console.log('Operating in production server mode...');
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.use('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🧠 Layon-Cortex Server listening on web port http://localhost:${PORT}`);
  });
}

bootstrap().catch(err => {
  console.error('Core neuron failure on boot launch:', err);
});
