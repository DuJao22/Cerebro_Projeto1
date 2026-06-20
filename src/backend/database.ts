/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { Memory, Relationship, Feedback, LearningLog, ChatMessage, CreatorSkill, LandingPageDesign } from '../types.js';

const DB_DIR = process.env.RENDER_DISK_PATH
  ? path.join(process.env.RENDER_DISK_PATH, 'database')
  : path.join(process.cwd(), 'database');
const DB_FILE = path.join(DB_DIR, 'memoria.json');

interface Schema {
  memorias: Memory[];
  relacoes: Relationship[];
  feedbacks: Feedback[];
  votos: Record<string, 'good' | 'bad' | null>; // Message feedback tracker
  logs: LearningLog[];
  cacheResponses?: Record<string, string>; // Intelligent Cache Layer for repetitive questions
  skills?: CreatorSkill[];
  designs?: LandingPageDesign[];
}

// Initial knowledge base to represent the brain on first launch
const INITIAL_MEMORIES: Memory[] = [
  { id: '1', conteudo: 'João Layon', tipo: 'usuario', timestamp: new Date().toISOString(), visualWeight: 10, lastAccessed: new Date().toISOString(), accessCount: 15 },
  { id: '2', conteudo: '@layon.dev', tipo: 'entidade', timestamp: new Date().toISOString(), visualWeight: 8, lastAccessed: new Date().toISOString(), accessCount: 12 },
  { id: '3', conteudo: 'Layon-System', tipo: 'fato', timestamp: new Date().toISOString(), visualWeight: 9, lastAccessed: new Date().toISOString(), accessCount: 14 },
  { id: '4', conteudo: 'Cérebro Digital', tipo: 'fato', timestamp: new Date().toISOString(), visualWeight: 9, lastAccessed: new Date().toISOString(), accessCount: 10 },
  { id: '5', conteudo: 'Inteligência Artificial', tipo: 'fato', timestamp: new Date().toISOString(), visualWeight: 8, lastAccessed: new Date().toISOString(), accessCount: 8 },
  { id: '6', conteudo: 'Aprendizado por Reforço', tipo: 'evento', timestamp: new Date().toISOString(), visualWeight: 7, lastAccessed: new Date().toISOString(), accessCount: 5 },
  { id: '7', conteudo: 'Memória Persistente', tipo: 'fato', timestamp: new Date().toISOString(), visualWeight: 8, lastAccessed: new Date().toISOString(), accessCount: 6 },
  { id: '8', conteudo: 'Grafo de Conhecimento', tipo: 'entidade', timestamp: new Date().toISOString(), visualWeight: 7, lastAccessed: new Date().toISOString(), accessCount: 4 },
  { id: '9', conteudo: 'Retorno de Feedback', tipo: 'sentimento', timestamp: new Date().toISOString(), visualWeight: 6, lastAccessed: new Date().toISOString(), accessCount: 3 }
];

const INITIAL_RELATIONS: Relationship[] = [
  { id: 'r1', origem_id: '1', destino_id: '2', peso: 10, tipo_relacao: 'Instagram' },
  { id: 'r2', origem_id: '1', destino_id: '3', peso: 9, tipo_relacao: 'Desenvolveu' },
  { id: 'r3', origem_id: '1', destino_id: '4', peso: 8, tipo_relacao: 'Criador' },
  { id: 'r4', origem_id: '4', destino_id: '5', peso: 9, tipo_relacao: 'Estuda' },
  { id: 'r5', origem_id: '4', destino_id: '7', peso: 8, tipo_relacao: 'Operação' },
  { id: 'r6', origem_id: '4', destino_id: '8', peso: 8, tipo_relacao: 'Visualiza' },
  { id: 'r7', origem_id: '5', destino_id: '6', peso: 7, tipo_relacao: 'Usa' },
  { id: 'r8', origem_id: '6', destino_id: '9', peso: 8, tipo_relacao: 'Processa' },
  { id: 'r9', origem_id: '7', destino_id: '8', peso: 7, tipo_relacao: 'Mapeia' }
];

const INITIAL_LOGS: LearningLog[] = [
  { id: 'l1', timestamp: new Date().toISOString(), acao: 'COGNICÃO', detalhe: 'Sistema Cognitivo Layon-System inicializado.' },
  { id: 'l2', timestamp: new Date().toISOString(), acao: 'MEMORIZAÇÃO', detalhe: 'Base inicial de conhecimento carregada na memória persistente.' }
];

const INITIAL_SKILLS: CreatorSkill[] = [
  {
    id: 'skill_1',
    name: '3D Orbit Motion Landing Page 🧬',
    description: 'Landing pages de alta fidelidade com efeitos de órbita 3D, menus expansivos inteligentes e tema Neon Cyberpunk.',
    systemPrompt: 'Você é um Lead Frontend Designer especializado em interfaces de alto nível visual e efeitos de Motion 3D estruturados em Tailwind CSS com SVGs interativos de órbita molecular.',
    promptTemplate: 'Crie uma Landing Page 3D para o setor de [Setor] com um painel de dados com efeitos de órbita molecular que se abre ao arrastar/clicar e blocos expansivos interativos.',
    tags: ['Landing Page', '3D Motion', 'Glow', 'Bento Grid'],
    author: 'João Layon',
    timestamp: new Date().toISOString()
  },
  {
    id: 'skill_2',
    name: 'Stretching Elastic Dashboard ⚡',
    description: 'Painéis flexíveis elásticos cujo layout se divide ou estica ao expandir métricas, revelando sub-panels interativos no clique.',
    systemPrompt: 'Você é um arquiteto de Dashboard interativo. Escreva aplicativos em que os componentes esticam e revelam tabelas ricas, botões de ação e dados estatísticos de forma fluida.',
    promptTemplate: 'Crie um dashboard com 3 widgets principais que se esticam horizontalmente de forma elástica quando ativados.',
    tags: ['Dashboard', 'Stretching UI', 'Flex-Bento', 'Logs'],
    author: 'Layon-System',
    timestamp: new Date().toISOString()
  },
  {
    id: 'skill_3',
    name: '21st.dev Prompt & Code Adaptor 🌟',
    description: 'Conversor de componentes do repositório de designs 21st.dev e layouts Tailwind para componentes funcionais purificados com Lucide-React.',
    systemPrompt: 'Você é um conversor especialista de componentes 21st.dev. Remova importações redundantes, garanta compatibilidade da biblioteca Lucide-React e implemente estados reativos completos.',
    promptTemplate: 'Refatore e incorpore o seguinte componente da 21st.dev para torná-lo espetacular: \n\n[CÓDIGO/PROMPT_COPIADO]',
    tags: ['21st.dev', 'Clean Code', 'Refactoring', 'Compatibilidade'],
    author: 'João Layon',
    timestamp: new Date().toISOString()
  }
];

const INITIAL_DESIGNS: LandingPageDesign[] = [
  {
    id: 'design_1',
    title: 'CyberHelix: BioTech 3D Core',
    description: 'Uma landing page de bioinformática futurista com uma hélice de DNA 3D em SVG rotativo ativo, bento-grid de biossensores e dashboard molecular inteligente que estica ao toque.',
    code: 'App.tsx de Bioinformática com hélice rotativa 3D e expansão inteligente de seções',
    files: [
      {
        fileName: 'App.tsx',
        fileLanguage: 'tsx',
        fileContent: `import React, { useState } from 'react';
import { Brain, Heart, Activity, Shield, Cpu, RefreshCw, Zap, Plus, Layers, Sparkles } from 'lucide-react';

export default function App() {
  const [selectedSensor, setSelectedSensor] = useState<string>('cortex');
  const [pulseSpeed, setPulseSpeed] = useState<number>(3);
  
  const sensors = [
    { id: 'cortex', name: 'Sincronizador Córtex', value: '98.4%', status: 'Nominal', desc: 'Conexão sináptica principal transmitindo telemetria neural.' },
    { id: 'heart', name: 'Cardiorreceptor 3D', value: '72 bpm', status: 'Estável', desc: 'Monitoramento do fluxo cardíaco bioelétrico em tempo real.' },
    { id: 'immune', name: 'Escudo Imunológico', value: '100%', status: 'Protegido', desc: 'Barreira nanotecnológica ativa protegendo sistemas vitais.' }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-[#e6edf3] p-4 font-sans select-none overflow-x-hidden flex flex-col justify-between">
      <header className="flex items-center justify-between p-4 bg-slate-950/80 rounded-xl border border-indigo-500/10 mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
          <span className="font-mono text-xs font-black tracking-widest text-[#00f2ff]">CYBERHELIX PLATFORM</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-purple-950/50 text-purple-400 border border-purple-500/20 text-[9px] px-2.5 py-0.5 rounded-full font-bold">BIOTECH IA v12.4</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        <div className="lg:col-span-5 bg-gradient-to-b from-[#0a0f1d] to-[#04060b] border border-cyan-500/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden min-h-[350px]">
          <div className="z-10">
            <span className="text-[9px] font-mono text-cyan-400 tracking-wider uppercase">SIMULADOR MOLECULAR 3D</span>
            <h3 className="text-lg font-bold font-display text-white mt-1">Interação Tridimensional</h3>
          </div>

          <div className="flex-1 flex items-center justify-center relative my-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0%,transparent_60%)] pointer-events-none" />
            
            <svg viewBox="0 0 300 160" className="w-full max-w-[280px] drop-shadow-[0_0_15px_rgba(0,242,255,0.25)]">
              <g>
                <circle cx="150" cy="80" r="65" stroke="rgba(0,242,255,0.15)" strokeWidth="1" fill="none" strokeDasharray="3,3" />
                <circle cx="150" cy="80" r="35" stroke="rgba(189,0,255,0.1)" strokeWidth="1" fill="none" />
              </g>

              {[...Array(9)].map((_, i) => {
                const x = 50 + i * 25;
                const phase = i * 0.7;
                return (
                  <g key={i}>
                    <line x1={x} y1="30" x2={x} y2="130" stroke="rgba(30,41,59,0.5)" strokeWidth="1.5" />
                    <line 
                      x1={x} 
                      y1={80 + Math.sin(phase) * 35} 
                      x2={x} 
                      y2={80 - Math.sin(phase) * 35} 
                      stroke="rgba(0,242,255,0.3)" 
                      strokeWidth="2"
                    />
                    
                    <circle cx={x} cy={80 + Math.sin(phase) * 35} r="5.5" fill="#00f2ff" />
                    <circle cx={x} cy={80 - Math.sin(phase) * 35} r="4.5" fill="#bd00ff" />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="z-10 bg-black/40 p-3 rounded-lg border border-slate-900 flex justify-between items-center mt-2">
            <span className="text-[10px] font-mono text-gray-400">Velocidade da Órbita:</span>
            <div className="flex gap-1.5">
              {[5, 3, 1].map((speed, idx) => (
                <button
                  key={speed}
                  onClick={() => setPulseSpeed(speed)}
                  className={\`text-[9px] font-mono py-1 px-2.5 bg-black border \${
                    pulseSpeed === speed ? "text-cyan-400 border-cyan-500/40" : "text-gray-500 border-gray-900"
                  }\`}
                >
                  {["Lento", "Médio", "Rápido"][idx]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-4 font-sans">
          <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest font-black block">SENSORES COGNITIVOS BIO-INTEGRADOS</span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sensors.map(s => {
              const isSelected = selectedSensor === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSensor(s.id)}
                  className={\`p-4 rounded-xl border transition cursor-pointer flex flex-col gap-2 bg-[#090b11] \${
                    isSelected ? "border-cyan-500/40 shadow-lg shadow-cyan-950/20" : "border-slate-900 hover:border-slate-800"
                  }\`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-gray-500">{s.status}</span>
                    <Sparkles className={\`w-3 h-3 \${isSelected ? "text-cyan-400" : "text-gray-600"}\`} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">{s.name}</h4>
                  <span className="text-lg font-mono font-black text-white">{s.value}</span>
                </div>
              );
            })}
          </div>

          <div className="bg-[#090b11] border border-violet-950/40 rounded-xl p-5 flex flex-col gap-3 flex-1 select-text">
            <div className="flex items-center gap-2 select-none">
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono font-black uppercase text-purple-300">Análise Molecular Expandida</span>
            </div>
            
            <p className="text-xs text-gray-300 leading-relaxed">
              {sensors.find(s => s.id === selectedSensor)?.desc} O ambiente cognitivo de João Layon de forma autoral estica essa telemetria.
            </p>

            <div className="mt-2 bg-black/60 p-4 rounded-lg border border-gray-900 font-mono text-[10px] text-[#00ff9d] flex flex-col gap-1">
              <div className="flex justify-between text-[8.5px] text-gray-500">
                <span>PARÂMETRO SENSOR</span>
                <span>RETORNO HEX</span>
              </div>
              <div className="flex justify-between">
                <span>HEURISTIC_DNA_PAIR</span>
                <span>0xFE241031B50D</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`
      },
      {
        fileName: 'database.ts',
        fileLanguage: 'typescript',
        fileContent: 'export const db = { sensors: [] };'
      }
    ],
    compilationLogs: [
      '[simulation] CyberHelix compilado com sucesso.',
      '[simulation] renderizando elemento 3D rotativo.'
    ],
    interactiveVariables: { speed: 3 },
    promptUsed: 'Crie uma landing page com hélice rotativa',
    skillIdUsed: 'skill_1',
    timestamp: new Date().toISOString()
  },
  {
    id: 'design_2',
    title: 'Minimalist Elastic Clock Dashboard ⏰',
    description: 'Interface de relógio e produtividade em que as seções se esticam e encolhem elástica e dinamicamente de acordo com fuso-horários selecionados, com contador de pomodoro integrado!',
    code: 'Painel com fuso-horário e pomodoro',
    files: [
      {
        fileName: 'App.tsx',
        fileLanguage: 'tsx',
        fileContent: `import React, { useState, useEffect } from 'react';
import { Watch, Play, Pause, RefreshCw } from 'lucide-react';

export default function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [activeZone, setActiveZone] = useState('BR');
  const [seconds, setSeconds] = useState(1500);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      if (activeZone === 'BR') {
        setTime(now.toLocaleTimeString("pt-BR"));
      } else if (activeZone === 'NY') {
        setTime(now.toLocaleTimeString("en-US", { timeZone: "America/New_York" }));
      } else {
        setTime(now.toLocaleTimeString("en-US", { timeZone: "Europe/London" }));
      }
    }, 1000);
    return () => clearInterval(t);
  }, [activeZone]);

  useEffect(() => {
    let t: any;
    if (timerActive && seconds > 0) {
      t = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(t);
  }, [timerActive, seconds]);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return \`\${m}:\${s}\`;
  };

  return (
    <div className="min-h-screen bg-[#03060c] text-slate-100 p-6 font-mono flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-gray-900 pb-3 mb-6">
        <span className="text-[10px] tracking-widest font-bold uppercase text-emerald-300">ESTAÇÃO CHRONOS</span>
        <span className="text-[9px] text-gray-500">ZONAS DINÂMICAS</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="bg-black/60 border border-gray-900 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-[8px] uppercase text-gray-500">Horizonte de Fuso</span>
            <h3 className="text-base font-bold text-white mt-1">Multi-Fuso Elástico</h3>
          </div>

          <div className="my-6 text-center">
            <span className="text-3xl font-black text-white hover:text-cyan-400 transition tracking-wider block">{time}</span>
          </div>

          <div className="flex justify-center gap-2">
            {['BR', 'NY', 'LDN'].map(zone => (
              <button
                key={zone}
                onClick={() => { setActiveZone(zone); }}
                className={\`px-4 py-2 rounded-lg border text-xs cursor-pointer transition-all \${
                  activeZone === zone ? 'bg-[#00ff9d]/20 text-[#00ff9d] border-[#00ff9d]/40' : 'bg-transparent border-gray-800 text-gray-400'
                }\`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-black/60 border border-gray-900 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-[8px] uppercase text-gray-400">Concentração</span>
            <h3 className="text-base font-bold text-white mt-1">Pomodoro</h3>
          </div>

          <div className="my-6 text-center">
            <span className="text-4xl font-black text-purple-400 block tracking-widest">{formatSeconds(seconds)}</span>
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2 rounded flex items-center gap-1 cursor-pointer animate-pulse"
            >
              TIMER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`
      }
    ],
    compilationLogs: [
      '[simulation] Chronos Clock compiled successfully.'
    ],
    interactiveVariables: { activeZone: 'BR' },
    promptUsed: 'Crie um dashboard com relógio fuso e pomodoro',
    skillIdUsed: 'skill_2',
    timestamp: new Date().toISOString()
  }
];

// SQLite Cloud variables and helpers
let sqliteCloudDbInstance: any = null;
let isSQLiteCloudEnabled = false;
let isNativeSQLiteCloud = false;

// Helper to escape values safely if running REST, or use params
function safeEscape(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'boolean') return val ? '1' : '0';
  const escaped = val.toString().replace(/'/g, "''");
  return `'${escaped}'`;
}

const INIT_QUERIES = [
  `CREATE TABLE IF NOT EXISTS memorias (
    id TEXT PRIMARY KEY,
    conteudo TEXT,
    tipo TEXT,
    timestamp TEXT,
    visualWeight INTEGER,
    lastAccessed TEXT,
    accessCount INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS relacoes (
    id TEXT PRIMARY KEY,
    origem_id TEXT,
    destino_id TEXT,
    peso INTEGER,
    tipo_relacao TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS feedbacks (
    id TEXT PRIMARY KEY,
    timestamp TEXT,
    messageId TEXT,
    feedbackType TEXT,
    entitiesUsed TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS votos (
    messageId TEXT PRIMARY KEY,
    feedbackType TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT,
    acao TEXT,
    detalhe TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS cache_responses (
    query TEXT PRIMARY KEY,
    responseText TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    systemPrompt TEXT,
    promptTemplate TEXT,
    tags TEXT,
    author TEXT,
    timestamp TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS designs (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    code TEXT,
    files TEXT,
    compilationLogs TEXT,
    interactiveVariables TEXT,
    promptUsed TEXT,
    skillIdUsed TEXT,
    timestamp TEXT
  )`
];

async function executeSQLiteCloud(sql: string): Promise<any[]> {
  const connectionString = process.env.SQLITE_CLOUD_CONNECTION_STRING;
  if (!connectionString) return [];

  // Try Native TCP driver if available
  if (isNativeSQLiteCloud && sqliteCloudDbInstance) {
    try {
      return await sqliteCloudDbInstance.exec(sql);
    } catch (nativeErr) {
      console.warn('Native SQLite Cloud execution failed, attempting REST Web Protocol:', nativeErr);
    }
  }

  // REST API fallback over fetch
  try {
    const apiKeyMatch = connectionString.match(/[?&]apikey=([^&]+)/);
    const apiKey = apiKeyMatch ? apiKeyMatch[1] : '';

    const hostMatch = connectionString.match(/@([^:/?]+)/);
    const hostname = hostMatch ? hostMatch[1] : '';

    const dbMatch = connectionString.match(/\/([^/?]+)\?/);
    const dbName = dbMatch ? dbMatch[1] : '';

    if (!hostname || !apiKey) {
      return [];
    }

    const hostWithPort = hostname.includes(':') ? hostname : `${hostname}:8090`;
    const url = `https://${hostWithPort}/v1/query`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        database: dbName,
        sql: sql
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`REST response status: ${response.status} - ${text}`);
    }

    const json = await response.json();
    return json.data || json.results || [];
  } catch (err) {
    console.error('REST SQLite Cloud execution failed:', err);
    throw err;
  }
}

class DatabaseManager {
  private schema: Schema = {
    memorias: [],
    relacoes: [],
    feedbacks: [],
    votos: {},
    logs: []
  };

  constructor() {
    this.init();
    this.initSQLiteCloud();
  }

  private async initSQLiteCloud() {
    const connectionString = process.env.SQLITE_CLOUD_CONNECTION_STRING;
    if (!connectionString) {
      console.log('SQLITE_CLOUD_CONNECTION_STRING state empty. Couching in offline localized JSON state.');
      return;
    }

    try {
      console.log('🔄 Initializing SQLite Cloud layer...');
      
      // Attempt to load native SDK
      try {
        const { Database } = await import('@sqlitecloud/drivers');
        sqliteCloudDbInstance = new Database(connectionString);
        isNativeSQLiteCloud = true;
        console.log('✅ SQLite Cloud: Native TCP driver enabled safely.');
      } catch (sdkError) {
        console.log('ℹ️ SQLite Cloud SDK not found or native dependencies skipped. Using HTTPS REST Protocol Web adaptor.');
      }

      isSQLiteCloudEnabled = true;

      // 1. Create tables
      for (const query of INIT_QUERIES) {
        await executeSQLiteCloud(query);
      }

      // 2. Check if database is empty by selecting count
      let count = 0;
      try {
        const result = await executeSQLiteCloud('SELECT COUNT(*) as cnt FROM memorias;');
        if (result && result.length > 0) {
          count = Number(result[0].cnt || result[0]['COUNT(*)'] || result[0].count || 0);
        }
      } catch (cntErr) {
        console.warn('Count check failed or table fresh. Initiating seed...', cntErr);
        count = 0;
      }

      if (count === 0) {
        console.log('🧬 SQLite Cloud: Database is fresh. Uploading initial seeds of Layon-System...');
        
        // Seed Memorias
        for (const m of INITIAL_MEMORIES) {
          const sql = `INSERT OR REPLACE INTO memorias (id, conteudo, tipo, timestamp, visualWeight, lastAccessed, accessCount) VALUES (
            ${safeEscape(m.id)}, ${safeEscape(m.conteudo)}, ${safeEscape(m.tipo)}, ${safeEscape(m.timestamp)}, ${m.visualWeight}, ${safeEscape(m.lastAccessed)}, ${m.accessCount || 1}
          );`;
          await executeSQLiteCloud(sql);
        }

        // Seed Relacoes
        for (const r of INITIAL_RELATIONS) {
          const sql = `INSERT OR REPLACE INTO relacoes (id, origem_id, destino_id, peso, tipo_relacao) VALUES (
            ${safeEscape(r.id)}, ${safeEscape(r.origem_id)}, ${safeEscape(r.destino_id)}, ${r.peso}, ${safeEscape(r.tipo_relacao)}
          );`;
          await executeSQLiteCloud(sql);
        }

        // Seed Skills
        for (const s of INITIAL_SKILLS) {
          const sql = `INSERT OR REPLACE INTO skills (id, name, description, systemPrompt, promptTemplate, tags, author, timestamp) VALUES (
            ${safeEscape(s.id)}, ${safeEscape(s.name)}, ${safeEscape(s.description)}, ${safeEscape(s.systemPrompt)}, ${safeEscape(s.promptTemplate)}, ${safeEscape(JSON.stringify(s.tags))}, ${safeEscape(s.author)}, ${safeEscape(s.timestamp)}
          );`;
          await executeSQLiteCloud(sql);
        }

        // Seed Designs
        for (const d of INITIAL_DESIGNS) {
          const sql = `INSERT OR REPLACE INTO designs (id, title, description, code, files, compilationLogs, interactiveVariables, promptUsed, skillIdUsed, timestamp) VALUES (
            ${safeEscape(d.id)}, ${safeEscape(d.title)}, ${safeEscape(d.description)}, ${safeEscape(d.code)}, ${safeEscape(JSON.stringify(d.files))}, ${safeEscape(JSON.stringify(d.compilationLogs))}, ${safeEscape(JSON.stringify(d.interactiveVariables))}, ${safeEscape(d.promptUsed)}, ${safeEscape(d.skillIdUsed)}, ${safeEscape(d.timestamp)}
          );`;
          await executeSQLiteCloud(sql);
        }

        // Seed Logs
        for (const l of INITIAL_LOGS) {
          const sql = `INSERT OR REPLACE INTO logs (id, timestamp, acao, detalhe) VALUES (
            ${safeEscape(l.id)}, ${safeEscape(l.timestamp)}, ${safeEscape(l.acao)}, ${safeEscape(l.detalhe)}
          );`;
          await executeSQLiteCloud(sql);
        }

        console.log('✅ SQLite Cloud: Base seeded successfully.');
      } else {
        console.log(`🌐 SQLite Cloud: Populated database found. Synchronizing ${count} records into memory...`);
        
        // Load Memorias
        const dbMems = await executeSQLiteCloud('SELECT * FROM memorias;');
        this.schema.memorias = dbMems.map((row: any) => ({
          id: row.id,
          conteudo: row.conteudo,
          tipo: row.tipo,
          timestamp: row.timestamp,
          visualWeight: Number(row.visualWeight || 5),
          lastAccessed: row.lastAccessed || new Date().toISOString(),
          accessCount: Number(row.accessCount || 1)
        }));

        // Load Relacoes
        const dbRels = await executeSQLiteCloud('SELECT * FROM relacoes;');
        this.schema.relacoes = dbRels.map((row: any) => ({
          id: row.id,
          origem_id: row.origem_id,
          destino_id: row.destino_id,
          peso: Number(row.peso || 5),
          tipo_relacao: row.tipo_relacao || 'associa'
        }));

        // Load Feedbacks
        try {
          const dbFbs = await executeSQLiteCloud('SELECT * FROM feedbacks;');
          this.schema.feedbacks = dbFbs.map((row: any) => ({
            id: row.id,
            timestamp: row.timestamp,
            messageId: row.messageId,
            feedbackType: row.feedbackType,
            entitiesUsed: row.entitiesUsed ? JSON.parse(row.entitiesUsed) : []
          }));
        } catch (fbErr) {
          console.warn('Feedbacks fetch bypassed:', fbErr);
        }

        // Load Votos
        try {
          const dbVotos = await executeSQLiteCloud('SELECT * FROM votos;');
          this.schema.votos = {};
          for (const row of dbVotos) {
            this.schema.votos[row.messageId] = row.feedbackType;
          }
        } catch (votoErr) {
          console.warn('Votos fetch bypassed:', votoErr);
        }

        // Load Cache
        try {
          const dbCache = await executeSQLiteCloud('SELECT * FROM cache_responses;');
          this.schema.cacheResponses = {};
          for (const row of dbCache) {
            this.schema.cacheResponses[row.query] = row.responseText;
          }
        } catch (cacheErr) {
          console.warn('Cache fetch bypassed:', cacheErr);
        }

        // Load Skills
        try {
          const dbSkills = await executeSQLiteCloud('SELECT * FROM skills;');
          this.schema.skills = dbSkills.map((row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            systemPrompt: row.systemPrompt,
            promptTemplate: row.promptTemplate,
            tags: row.tags ? JSON.parse(row.tags) : [],
            author: row.author,
            timestamp: row.timestamp
          }));
        } catch (skillErr) {
          this.schema.skills = INITIAL_SKILLS;
        }

        // Load Designs
        try {
          const dbDesigns = await executeSQLiteCloud('SELECT * FROM designs;');
          this.schema.designs = dbDesigns.map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            code: row.code,
            files: row.files ? JSON.parse(row.files) : [],
            compilationLogs: row.compilationLogs ? JSON.parse(row.compilationLogs) : [],
            interactiveVariables: row.interactiveVariables ? JSON.parse(row.interactiveVariables) : {},
            promptUsed: row.promptUsed,
            skillIdUsed: row.skillIdUsed,
            timestamp: row.timestamp
          }));
        } catch (designErr) {
          this.schema.designs = INITIAL_DESIGNS;
        }

        // Load Logs
        try {
          const dbLogs = await executeSQLiteCloud('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100;');
          this.schema.logs = dbLogs.map((row: any) => ({
            id: row.id,
            timestamp: row.timestamp,
            acao: row.acao,
            detalhe: row.detalhe
          }));
        } catch (logErr) {
          this.schema.logs = INITIAL_LOGS;
        }

        console.log(`🚀 SQLite Cloud synchronization complete! Local consciousness loaded with ${this.schema.memorias.length} memories, ${this.schema.relacoes.length} paths.`);
      }

      this.addLog('COGNICÃO', 'Conectado e Sincronizado com SQLite Cloud com Sucesso!');
    } catch (e: any) {
      console.error('❌ Failed to synchronize SQLite Cloud database instance:', e);
      this.addLog('COGNICÃO', `Erro ao sincronizar com SQLite Cloud: ${e.message || e}`);
    }
  }

  private ensureSkillsAndDesignsInBrain() {
    let changed = false;
    
    const skillsList = this.getSkills();
    for (const skill of skillsList) {
      const memoryId = `skill_mem_${skill.id}`;
      const hasMemory = this.schema.memorias.some(m => m.id === memoryId);
      if (!hasMemory) {
        this.saveMemory({
          id: memoryId,
          conteudo: `Skill: ${skill.name}`,
          tipo: 'entidade',
          timestamp: new Date().toISOString(),
          visualWeight: 6,
          lastAccessed: new Date().toISOString()
        });
        this.saveRelationship({
          id: `rel_skill_${skill.id}`,
          origem_id: '4', // Cérebro Digital
          destino_id: memoryId,
          peso: 7,
          tipo_relacao: 'Habilidade'
        });
        changed = true;
      }
    }

    const designsList = this.getDesigns();
    for (const design of designsList) {
      const memoryId = `design_mem_${design.id}`;
      const hasMemory = this.schema.memorias.some(m => m.id === memoryId);
      if (!hasMemory) {
        this.saveMemory({
          id: memoryId,
          conteudo: `Design: ${design.title}`,
          tipo: 'entidade',
          timestamp: new Date().toISOString(),
          visualWeight: 6,
          lastAccessed: new Date().toISOString()
        });
        this.saveRelationship({
          id: `rel_design_${design.id}`,
          origem_id: '4', // Cérebro Digital
          destino_id: memoryId,
          peso: 7,
          tipo_relacao: 'Design'
        });
        changed = true;
      }
    }

    if (changed) {
      this.save();
    }
  }

  private init() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
        console.log(`Directory created: ${DB_DIR}`);
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.schema = JSON.parse(raw);
        if (!this.schema.skills) {
          this.schema.skills = INITIAL_SKILLS;
        }
        if (!this.schema.designs) {
          this.schema.designs = INITIAL_DESIGNS;
        }
        console.log(`Knowledge Base loaded successfully: ${this.schema.memorias.length} memories, ${this.schema.relacoes.length} pathways.`);
      } else {
        // Seeding starter knowledge database
        this.schema = {
          memorias: INITIAL_MEMORIES,
          relacoes: INITIAL_RELATIONS,
          feedbacks: [],
          votos: {},
          logs: INITIAL_LOGS,
          skills: INITIAL_SKILLS,
          designs: INITIAL_DESIGNS
        };
        this.save();
        console.log('Knowledge Base seeded with Layon-System initial data.');
      }
      this.ensureSkillsAndDesignsInBrain();
      this.healFloatingRepositories();
    } catch (e) {
      console.error('Failed to initialize cognitive database:', e);
      // Fallback state
      this.schema = {
        memorias: INITIAL_MEMORIES,
        relacoes: INITIAL_RELATIONS,
        feedbacks: [],
        votos: {},
        logs: INITIAL_LOGS,
        skills: INITIAL_SKILLS,
        designs: INITIAL_DESIGNS
      };
      this.ensureSkillsAndDesignsInBrain();
      this.healFloatingRepositories();
    }
  }

  public healFloatingRepositories() {
    let changed = false;
    const memories = this.schema.memorias || [];
    const relations = this.schema.relacoes || [];

    const repoMemories = memories.filter(m => m.id.startsWith('repo_') || m.conteudo.startsWith('Repositório:'));
    repoMemories.forEach(repoNode => {
      // 1. Ensure connection to João Layon (ID '1')
      const hasConnectionTo1 = relations.some(r => 
        (r.origem_id === '1' && r.destino_id === repoNode.id) || 
        (r.origem_id === repoNode.id && r.destino_id === '1')
      );
      if (!hasConnectionTo1) {
        this.saveRelationship({
          id: `rel_heal_1_${repoNode.id}`,
          origem_id: '1',
          destino_id: repoNode.id,
          peso: 9,
          tipo_relacao: 'Explora'
        });
        changed = true;
        this.addLog('REFORÇO', `Conexão auto-curada na carga: "João Layon" 🔗 "${repoNode.conteudo}"`);
      }

      // 2. Ensure connection to Cérebro Digital (ID '4')
      const hasConnectionTo4 = relations.some(r => 
        (r.origem_id === '4' && r.destino_id === repoNode.id) || 
        (r.origem_id === repoNode.id && r.destino_id === '4')
      );
      if (!hasConnectionTo4) {
        this.saveRelationship({
          id: `rel_heal_4_${repoNode.id}`,
          origem_id: '4',
          destino_id: repoNode.id,
          peso: 9,
          tipo_relacao: 'Mapeia'
        });
        changed = true;
        this.addLog('REFORÇO', `Conexão auto-curada na carga: "Cérebro Digital" 🔗 "${repoNode.conteudo}"`);
      }

      // 3. Ensure connection to Inteligência Artificial (ID '5')
      const hasConnectionTo5 = relations.some(r => 
        (r.origem_id === '5' && r.destino_id === repoNode.id) || 
        (r.origem_id === repoNode.id && r.destino_id === '5')
      );
      if (!hasConnectionTo5) {
        this.saveRelationship({
          id: `rel_heal_5_${repoNode.id}`,
          origem_id: '5',
          destino_id: repoNode.id,
          peso: 8,
          tipo_relacao: 'Codifica'
        });
        changed = true;
        this.addLog('REFORÇO', `Conexão auto-curada na carga: "Inteligência Artificial" 🔗 "${repoNode.conteudo}"`);
      }
    });

    if (changed) {
      this.save();
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.schema, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to serialize knowledge dump:', e);
    }
  }

  // Memorias APIS
  getMemories(): Memory[] {
    return this.schema.memorias;
  }

  saveMemory(memory: Memory) {
    const idx = this.schema.memorias.findIndex((m) => m.id === memory.id || m.conteudo.toLowerCase() === memory.conteudo.toLowerCase());
    let finalMemory: Memory;

    if (idx !== -1) {
      // Keep old timestamps but update weights & increment usage count
      const existing = this.schema.memorias[idx];
      finalMemory = {
        ...existing,
        ...memory,
        visualWeight: Math.min(10, Math.max(1, memory.visualWeight)),
        lastAccessed: new Date().toISOString(),
        accessCount: (existing.accessCount || 0) + 1
      };
      this.schema.memorias[idx] = finalMemory;
    } else {
      finalMemory = {
        ...memory,
        visualWeight: Math.min(10, Math.max(1, memory.visualWeight || 5)),
        lastAccessed: new Date().toISOString(),
        accessCount: 1
      };
      this.schema.memorias.push(finalMemory);
      this.addLog('MEMORIZAÇÃO', `Nova memória gravada: "${memory.conteudo}" [Tipo: ${memory.tipo}]`);
    }
    this.save();

    // Async sync with SQLite Cloud
    if (isSQLiteCloudEnabled) {
      const sql = `INSERT OR REPLACE INTO memorias (id, conteudo, tipo, timestamp, visualWeight, lastAccessed, accessCount) VALUES (
        ${safeEscape(finalMemory.id)}, ${safeEscape(finalMemory.conteudo)}, ${safeEscape(finalMemory.tipo)}, ${safeEscape(finalMemory.timestamp)}, ${finalMemory.visualWeight}, ${safeEscape(finalMemory.lastAccessed)}, ${finalMemory.accessCount || 1}
      );`;
      executeSQLiteCloud(sql).catch(e => console.error('Failed to sync saveMemory in SQLite Cloud:', e));
    }
  }

  deleteMemory(id: string) {
    const memory = this.schema.memorias.find((m) => m.id === id);
    if (memory) {
      this.schema.memorias = this.schema.memorias.filter((m) => m.id !== id);
      // Cascade delete relations
      this.schema.relacoes = this.schema.relacoes.filter((r) => r.origem_id !== id && r.destino_id !== id);
      this.addLog('ESQUECIMENTO', `Memória esquecida: "${memory.conteudo}"`);
      this.save();

      // Async sync with SQLite Cloud
      if (isSQLiteCloudEnabled) {
        const sqlM = `DELETE FROM memorias WHERE id = ${safeEscape(id)};`;
        const sqlR = `DELETE FROM relacoes WHERE origem_id = ${safeEscape(id)} OR destino_id = ${safeEscape(id)};`;
        executeSQLiteCloud(sqlM)
          .then(() => executeSQLiteCloud(sqlR))
          .catch(e => console.error('Failed to sync deleteMemory in SQLite Cloud:', e));
      }
    }
  }

  // Relations APIS
  getRelationships(): Relationship[] {
    return this.schema.relacoes;
  }

  saveRelationship(rel: Relationship) {
    const idx = this.schema.relacoes.findIndex(
      (r) => (r.origem_id === rel.origem_id && r.destino_id === rel.destino_id) || 
             (r.origem_id === rel.destino_id && r.destino_id === rel.origem_id)
    );

    const peso = Math.min(10, Math.max(1, Math.round(rel.peso)));
    let finalRel: Relationship;

    if (idx !== -1) {
      this.schema.relacoes[idx].peso = peso;
      finalRel = this.schema.relacoes[idx];
    } else {
      finalRel = {
        id: rel.id || `r_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        origem_id: rel.origem_id,
        destino_id: rel.destino_id,
        peso,
        tipo_relacao: rel.tipo_relacao || 'associa'
      };
      this.schema.relacoes.push(finalRel);
    }
    this.save();

    // Async sync with SQLite Cloud
    if (isSQLiteCloudEnabled) {
      const sql = `INSERT OR REPLACE INTO relacoes (id, origem_id, destino_id, peso, tipo_relacao) VALUES (
        ${safeEscape(finalRel.id)}, ${safeEscape(finalRel.origem_id)}, ${safeEscape(finalRel.destino_id)}, ${finalRel.peso}, ${safeEscape(finalRel.tipo_relacao)}
      );`;
      executeSQLiteCloud(sql).catch(e => console.error('Failed to sync saveRelationship in SQLite Cloud:', e));
    }
  }

  deleteRelationship(id: string) {
    this.schema.relacoes = this.schema.relacoes.filter((r) => r.id !== id);
    this.save();

    // Async sync with SQLite Cloud
    if (isSQLiteCloudEnabled) {
      const sql = `DELETE FROM relacoes WHERE id = ${safeEscape(id)};`;
      executeSQLiteCloud(sql).catch(e => console.error('Failed to sync deleteRelationship in SQLite Cloud:', e));
    }
  }

  // Feedbacks
  getFeedbacks(): Feedback[] {
    return this.schema.feedbacks;
  }

  saveFeedback(fb: Feedback) {
    this.schema.feedbacks.push(fb);
    this.schema.votos[fb.messageId] = fb.feedbackType;
    this.save();

    // Async sync with SQLite Cloud
    if (isSQLiteCloudEnabled) {
      const sqlFb = `INSERT OR REPLACE INTO feedbacks (id, timestamp, messageId, feedbackType, entitiesUsed) VALUES (
        ${safeEscape(fb.id)}, ${safeEscape(fb.timestamp)}, ${safeEscape(fb.messageId)}, ${safeEscape(fb.feedbackType)}, ${safeEscape(JSON.stringify(fb.entitiesUsed))}
      );`;
      const sqlVote = `INSERT OR REPLACE INTO votos (messageId, feedbackType) VALUES (
        ${safeEscape(fb.messageId)}, ${safeEscape(fb.feedbackType)}
      );`;
      executeSQLiteCloud(sqlFb)
        .then(() => executeSQLiteCloud(sqlVote))
        .catch(e => console.error('Failed to sync saveFeedback in SQLite Cloud:', e));
    }
  }

  getMessageVote(messageId: string): 'good' | 'bad' | null {
    return this.schema.votos[messageId] || null;
  }

  // Cache APIs
  getCache(query: string): string | null {
    if (!this.schema.cacheResponses) {
      this.schema.cacheResponses = {};
    }
    const cleanQuery = query.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
    return this.schema.cacheResponses[cleanQuery] || null;
  }

  saveCache(query: string, responseText: string) {
    if (!this.schema.cacheResponses) {
      this.schema.cacheResponses = {};
    }
    const cleanQuery = query.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
    this.schema.cacheResponses[cleanQuery] = responseText;
    this.save();

    // Async sync with SQLite Cloud
    if (isSQLiteCloudEnabled) {
      const sql = `INSERT OR REPLACE INTO cache_responses (query, responseText) VALUES (
        ${safeEscape(cleanQuery)}, ${safeEscape(responseText)}
      );`;
      executeSQLiteCloud(sql).catch(e => console.error('Failed to sync saveCache in SQLite Cloud:', e));
    }
  }

  // Increment explicit access
  incrementAccess(id: string) {
    const idx = this.schema.memorias.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.schema.memorias[idx].accessCount = (this.schema.memorias[idx].accessCount || 0) + 1;
      this.schema.memorias[idx].lastAccessed = new Date().toISOString();
      this.save();

      // Async sync with SQLite Cloud
      if (isSQLiteCloudEnabled) {
        const sql = `UPDATE memorias SET accessCount = ${this.schema.memorias[idx].accessCount}, lastAccessed = ${safeEscape(this.schema.memorias[idx].lastAccessed)} WHERE id = ${safeEscape(id)};`;
        executeSQLiteCloud(sql).catch(e => console.error('Failed to sync incrementAccess in SQLite Cloud:', e));
      }
    }
  }

  // Logs
  getLogs(): LearningLog[] {
    return this.schema.logs;
  }

  addLog(acao: LearningLog['acao'], detalhe: string) {
    const log: LearningLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      acao,
      detalhe
    };
    this.schema.logs.unshift(log); // Keep newest on top
    // Limit to 100 entries
    if (this.schema.logs.length > 100) {
      this.schema.logs = this.schema.logs.slice(0, 100);
    }
    this.save();

    // Async sync with SQLite Cloud
    if (isSQLiteCloudEnabled) {
      const sql = `INSERT INTO logs (id, timestamp, acao, detalhe) VALUES (
        ${safeEscape(log.id)}, ${safeEscape(log.timestamp)}, ${safeEscape(log.acao)}, ${safeEscape(log.detalhe)}
      );`;
      executeSQLiteCloud(sql).catch(e => console.error('Failed to sync addLog in SQLite Cloud:', e));
    }
  }

  // Wipe / Reset database to Initial Seeding
  resetDatabase() {
    this.schema = {
      memorias: [
        { id: '1', conteudo: 'João Layon', tipo: 'usuario', timestamp: new Date().toISOString(), visualWeight: 10, lastAccessed: new Date().toISOString(), accessCount: 15 },
        { id: '2', conteudo: '@layon.dev', tipo: 'entidade', timestamp: new Date().toISOString(), visualWeight: 8, lastAccessed: new Date().toISOString(), accessCount: 12 },
        { id: '3', conteudo: 'Layon-System', tipo: 'fato', timestamp: new Date().toISOString(), visualWeight: 9, lastAccessed: new Date().toISOString(), accessCount: 14 },
        { id: '4', conteudo: 'Cérebro Digital', tipo: 'fato', timestamp: new Date().toISOString(), visualWeight: 9, lastAccessed: new Date().toISOString(), accessCount: 10 },
        { id: '5', conteudo: 'Inteligência Artificial', tipo: 'fato', timestamp: new Date().toISOString(), visualWeight: 8, lastAccessed: new Date().toISOString(), accessCount: 8 },
        { id: '6', conteudo: 'Aprendizado por Reforço', tipo: 'evento', timestamp: new Date().toISOString(), visualWeight: 7, lastAccessed: new Date().toISOString(), accessCount: 5 },
        { id: '7', conteudo: 'Memória Persistente', tipo: 'fato', timestamp: new Date().toISOString(), visualWeight: 8, lastAccessed: new Date().toISOString(), accessCount: 6 },
        { id: '8', conteudo: 'Grafo de Conhecimento', tipo: 'entidade', timestamp: new Date().toISOString(), visualWeight: 7, lastAccessed: new Date().toISOString(), accessCount: 4 },
        { id: '9', conteudo: 'Retorno de Feedback', tipo: 'sentimento', timestamp: new Date().toISOString(), visualWeight: 6, lastAccessed: new Date().toISOString(), accessCount: 3 }
      ],
      relacoes: [
        { id: 'r1', origem_id: '1', destino_id: '2', peso: 10, tipo_relacao: 'Instagram' },
        { id: 'r2', origem_id: '1', destino_id: '3', peso: 9, tipo_relacao: 'Desenvolveu' },
        { id: 'r3', origem_id: '1', destino_id: '4', peso: 8, tipo_relacao: 'Criador' },
        { id: 'r4', origem_id: '4', destino_id: '5', peso: 9, tipo_relacao: 'Estuda' },
        { id: 'r5', origem_id: '4', destino_id: '7', peso: 8, tipo_relacao: 'Operação' },
        { id: 'r6', origem_id: '4', destino_id: '8', peso: 8, tipo_relacao: 'Visualiza' },
        { id: 'r7', origem_id: '5', destino_id: '6', peso: 7, tipo_relacao: 'Usa' },
        { id: 'r8', origem_id: '6', destino_id: '9', peso: 8, tipo_relacao: 'Processa' },
        { id: 'r9', origem_id: '7', destino_id: '8', peso: 7, tipo_relacao: 'Mapeia' }
      ],
      feedbacks: [],
      votos: {},
      logs: [
        { id: `log_${Date.now()}`, timestamp: new Date().toISOString(), acao: 'COGNICÃO', detalhe: 'Rede neural redefinida com padrões de fábrica (Layon-System).' }
      ],
      cacheResponses: {},
      skills: INITIAL_SKILLS,
      designs: INITIAL_DESIGNS
    };
    this.save();

    // Async sync with SQLite Cloud
    if (isSQLiteCloudEnabled) {
      (async () => {
        try {
          await executeSQLiteCloud('DELETE FROM memorias;');
          await executeSQLiteCloud('DELETE FROM relacoes;');
          await executeSQLiteCloud('DELETE FROM feedbacks;');
          await executeSQLiteCloud('DELETE FROM votos;');
          await executeSQLiteCloud('DELETE FROM logs;');
          await executeSQLiteCloud('DELETE FROM cache_responses;');
          await executeSQLiteCloud('DELETE FROM skills;');
          await executeSQLiteCloud('DELETE FROM designs;');
          // Re-trigger seeding sequence asynchronously
          await this.initSQLiteCloud();
        } catch (err) {
          console.error('Failed to sync resetDatabase to SQLite Cloud:', err);
        }
      })();
    }
  }

  // Skills CRUD API
  getSkills(): CreatorSkill[] {
    if (!this.schema.skills) {
      this.schema.skills = INITIAL_SKILLS;
    }
    return this.schema.skills;
  }

  saveSkill(skill: CreatorSkill) {
    if (!this.schema.skills) {
      this.schema.skills = INITIAL_SKILLS;
    }
    const idx = this.schema.skills.findIndex(s => s.id === skill.id);
    if (idx !== -1) {
      this.schema.skills[idx] = skill;
    } else {
      this.schema.skills.push(skill);
    }
    this.addLog('MEMORIZAÇÃO', `Nova skill compartilhada gravada: "${skill.name}"`);
    
    // Ingest as physical Memory Node in the Brain!
    const memoryId = `skill_mem_${skill.id}`;
    this.saveMemory({
      id: memoryId,
      conteudo: `Skill: ${skill.name}`,
      tipo: 'entidade',
      timestamp: new Date().toISOString(),
      visualWeight: 7,
      lastAccessed: new Date().toISOString()
    });

    this.saveRelationship({
      id: `rel_skill_${skill.id}`,
      origem_id: '4', // ID for Cérebro Digital
      destino_id: memoryId,
      peso: 8,
      tipo_relacao: 'Habilidade'
    });

    this.save();

    // Async sync with SQLite Cloud
    if (isSQLiteCloudEnabled) {
      const sql = `INSERT OR REPLACE INTO skills (id, name, description, systemPrompt, promptTemplate, tags, author, timestamp) VALUES (
        ${safeEscape(skill.id)}, ${safeEscape(skill.name)}, ${safeEscape(skill.description)}, ${safeEscape(skill.systemPrompt)}, ${safeEscape(skill.promptTemplate)}, ${safeEscape(JSON.stringify(skill.tags))}, ${safeEscape(skill.author)}, ${safeEscape(skill.timestamp)}
      );`;
      executeSQLiteCloud(sql).catch(e => console.error('Failed to sync saveSkill in SQLite Cloud:', e));
    }
  }

  deleteSkill(id: string) {
    if (!this.schema.skills) return;
    const name = this.schema.skills.find(s => s.id !== id)?.name || '';
    this.schema.skills = this.schema.skills.filter(s => s.id !== id);
    if (name) {
      this.addLog('ESQUECIMENTO', `Skill removida: "${name}"`);
    }

    // Delete corresponding memory node
    const memoryId = `skill_mem_${id}`;
    this.deleteMemory(memoryId);

    this.save();

    // Async sync with SQLite Cloud
    if (isSQLiteCloudEnabled) {
      const sql = `DELETE FROM skills WHERE id = ${safeEscape(id)};`;
      executeSQLiteCloud(sql).catch(e => console.error('Failed to sync deleteSkill in SQLite Cloud:', e));
    }
  }

  // Designs Gallery CRUD API
  getDesigns(): LandingPageDesign[] {
    if (!this.schema.designs) {
      this.schema.designs = INITIAL_DESIGNS;
    }
    return this.schema.designs;
  }

  saveDesign(design: LandingPageDesign) {
    if (!this.schema.designs) {
      this.schema.designs = INITIAL_DESIGNS;
    }
    const idx = this.schema.designs.findIndex(d => d.id === design.id);
    if (idx !== -1) {
      this.schema.designs[idx] = design;
    } else {
      this.schema.designs.push(design);
    }
    this.addLog('MEMORIZAÇÃO', `Design de Landing Page salvo na galeria: "${design.title}"`);
    
    // Ingest as physical Memory Node in the Brain!
    const memoryId = `design_mem_${design.id}`;
    this.saveMemory({
      id: memoryId,
      conteudo: `Design: ${design.title}`,
      tipo: 'entidade',
      timestamp: new Date().toISOString(),
      visualWeight: 7,
      lastAccessed: new Date().toISOString()
    });

    this.saveRelationship({
      id: `rel_design_${design.id}`,
      origem_id: '4', // ID for Cérebro Digital
      destino_id: memoryId,
      peso: 8,
      tipo_relacao: 'Design'
    });

    this.save();

    // Async sync with SQLite Cloud
    if (isSQLiteCloudEnabled) {
      const sql = `INSERT OR REPLACE INTO designs (id, title, description, code, files, compilationLogs, interactiveVariables, promptUsed, skillIdUsed, timestamp) VALUES (
        ${safeEscape(design.id)}, ${safeEscape(design.title)}, ${safeEscape(design.description)}, ${safeEscape(design.code)}, ${safeEscape(JSON.stringify(design.files))}, ${safeEscape(JSON.stringify(design.compilationLogs))}, ${safeEscape(JSON.stringify(design.interactiveVariables))}, ${safeEscape(design.promptUsed)}, ${safeEscape(design.skillIdUsed)}, ${safeEscape(design.timestamp)}
      );`;
      executeSQLiteCloud(sql).catch(e => console.error('Failed to sync saveDesign in SQLite Cloud:', e));
    }
  }

  deleteDesign(id: string) {
    if (!this.schema.designs) return;
    const title = this.schema.designs.find(d => d.id !== id)?.title || '';
    this.schema.designs = this.schema.designs.filter(d => d.id !== id);
    if (title) {
      this.addLog('ESQUECIMENTO', `Design de Landing Page excluído da galeria: "${title}"`);
    }

    // Delete corresponding memory node
    const memoryId = `design_mem_${id}`;
    this.deleteMemory(memoryId);

    this.save();

    // Async sync with SQLite Cloud
    if (isSQLiteCloudEnabled) {
      const sql = `DELETE FROM designs WHERE id = ${safeEscape(id)};`;
      executeSQLiteCloud(sql).catch(e => console.error('Failed to sync deleteDesign in SQLite Cloud:', e));
    }
  }
}

export const db = new DatabaseManager();

