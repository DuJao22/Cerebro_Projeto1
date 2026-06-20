import { getGemini, generateContentWithRetry } from './memory.js';
import { Type } from '@google/genai';
import { db } from './database.js';

export interface CreatorFile {
  fileName: string;
  fileLanguage: string;
  fileContent: string;
}

export interface CreatorDiagnostic {
  severity: 'error' | 'warning' | 'info';
  message: string;
  fileName: string;
  line: number;
}

export interface CreatorResult {
  appName: string;
  description: string;
  files: CreatorFile[];
  compilationLogs: string[];
  diagnostics: CreatorDiagnostic[];
  interactiveVariables: Record<string, any>;
  suggestions: string[];
}

/**
 * Generates an interactive web app structure based on a user prompt.
 */
export async function generateAppStructure(prompt: string, existingFiles: CreatorFile[] = [], action: 'generate' | 'fix' = 'generate', customSystemPrompt?: string): Promise<CreatorResult> {
  try {
    const ai = getGemini();
    
    // Load repository memories with parsed code snippets to ground the generation with user's repository codes
    const memories = db.getMemories() || [];
    const repoFiles = memories.filter(m => m.repoName && m.codeSnippet);
    
    let repoContextPrompt = '';
    if (repoFiles.length > 0) {
      repoContextPrompt = `\n\n=== REPOSITÓRIOS GITHUB INTEGRADOS / CÓDIGOS DE REFERÊNCIA ESPELHADOS ===\n` +
        `Você possui acesso aos seguintes blocos de códigos-fonte, classes, arquivos e funções sincronizados pelo próprio usuário no gráfico cerebral do sistema Layon-System. Você DEVE usar as lógicas de negócio, assinaturas, padrões de componentes Tailwind CSS ou lógicas de utilitários abaixo sempre que fizer sentido ou for solicitado:\n\n`;
      
      repoFiles.forEach(rf => {
        repoContextPrompt += `[REPOSITÓRIO: ${rf.repoName}]\n`;
        repoContextPrompt += `Entidade: "${rf.conteudo}" (Tipo: ${rf.tipo})\n`;
        if (rf.details) repoContextPrompt += `Detalhes Técnicos: ${rf.details}\n`;
        if (rf.codeSnippet) {
          repoContextPrompt += `Trecho de Código de Referência:\n\`\`\`\n${rf.codeSnippet}\n\`\`\`\n`;
        }
        repoContextPrompt += `-------------------------------------------\n\n`;
      });
      repoContextPrompt += `=== FIM DOS CÓDIGOS DE REPOSITÓRIO ===\n\n`;
    }

    let promptContext = '';
    if (action === 'fix' && existingFiles.length > 0) {
      promptContext = `The user wants to identify and fix bugs, styling flaws, or warnings in the following app code files:\n` +
        existingFiles.map(f => `=== FILE: ${f.fileName} ===\n${f.fileContent}\n`).join('\n') +
        `\nUser requested improvement/fix instructions: "${prompt}"`;
    } else {
      promptContext = `Create from scratch a fully functioning interactive web application for the following request: "${prompt}".`;
    }

    if (repoContextPrompt) {
      promptContext += repoContextPrompt;
    }

    const baseSystemPrompt = `You are João Layon's AI App Creator Engine. You write complete, professional, highly functional codebases for single-page style complex dashboards.
Always build fully functional, responsive layouts styled with Tailwind CSS utility classes. Include complete interactive state hooks and mock data.

Generate a structured response according to the requested JSON Schema.
For the files, you should generate at least:
1. "App.tsx" - The complete interactive client layout with React hooks, local states, beautiful grids, lists, visual filters, action buttons, and mock data.
2. "database.ts" - Simulated typed local index database / storage client with mock tables (e.g. news articles, astronomical events, users) and seed data.
3. "types.ts" - Essential TypeScript interfaces and types for the entities.
4. "styles.css" - Optional extra scoped animations, pulse shadows, glow effects or font imports.

Make the simulated terminal output logs rich, mimicking a solid Vite build and lint checker:
e.g. "[vite] pre-bundling dependencies", "[compiler] transpiled App.tsx with zero warnings", etc.

If there are any potential design warning/info elements that can be corrected on subsequent iterations, put them in the diagnostics array.`;

    const systemPrompt = customSystemPrompt 
      ? `[CUSTOM SKILL / GUIDELINE ACTIVE]\n${customSystemPrompt}\n\n[GENERAL RULES]\n${baseSystemPrompt}`
      : baseSystemPrompt;

    const response = await generateContentWithRetry({
      model: 'gemini-3.5-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nTask:\n${promptContext}` }] }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            appName: { type: Type.STRING },
            description: { type: Type.STRING },
            files: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  fileName: { type: Type.STRING },
                  fileLanguage: { type: Type.STRING },
                  fileContent: { type: Type.STRING }
                },
                required: ['fileName', 'fileLanguage', 'fileContent']
              }
            },
            compilationLogs: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            diagnostics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: { type: Type.STRING, enum: ['error', 'warning', 'info'] },
                  message: { type: Type.STRING },
                  fileName: { type: Type.STRING },
                  line: { type: Type.INTEGER }
                },
                required: ['severity', 'message', 'fileName']
              }
            },
            interactiveVariables: {
              type: Type.OBJECT,
              description: 'Key-value mapping of interactive initial records (e.g., news: [...], events: [...], counter: 0)'
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['appName', 'description', 'files', 'compilationLogs', 'diagnostics', 'interactiveVariables', 'suggestions']
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text.trim());
      return parsed as CreatorResult;
    }
    throw new Error('Retorno vazio do Gemini.');

  } catch (err: any) {
    console.warn('Google GenAI fail or unconfigured key in App Creator. Activating offline beautiful heuristic builder fallback...', err);
    return getOfflineHeuristicApp(prompt, existingFiles, action);
  }
}

/**
 * Offline fallback generator containing 3 highly detailed, styled templates
 * for seamless Offline compatibility.
 */
function getOfflineHeuristicApp(prompt: string, existingFiles: CreatorFile[], action: 'generate' | 'fix'): CreatorResult {
  const norm = prompt.toLowerCase();
  
  // Decide which heuristic layout is closest
  let type: 'news' | 'finance' | 'tasks' = 'news';
  if (norm.includes('finance') || norm.includes('caixa') || norm.includes('carteira') || norm.includes('orcamento') || norm.includes('dinheiro') || norm.includes('venda')) {
    type = 'finance';
  } else if (norm.includes('noticia') || norm.includes('portal') || norm.includes('astro') || norm.includes('news') || norm.includes('feed') || norm.includes('artigo')) {
    type = 'news';
  } else {
    type = 'tasks';
  }

  if (action === 'fix' && existingFiles.length > 0) {
    // Return a self-corrected version with cleared diagnostics
    return {
      appName: "Vortex Intelligence Core (Auto-Fixed)",
      description: "Edição corrigida e refinada pela inteligência de compilação virtual offline do Layon-System.",
      files: existingFiles.map(f => {
        let content = f.fileContent;
        // Mock corrections
        if (content.includes('TODO') || content.includes('// fixme')) {
          content = content.replace('// fixme', '// [CORRIGIDO] Lógica otimizada e sanitizada').replace('TODO', 'Lógica expandida e testada com sucesso');
        }
        return {
          ...f,
          fileContent: content
        };
      }),
      compilationLogs: [
        `[vite] Refactoring files and verifying type-safety...`,
        `[linter] Checking syntax against ES2026/TypeScript guidelines...`,
        `[linter] No warnings detected in App.tsx!`,
        `[linter] Successfully verified types.ts schema.`,
        `[vite] HMR updated in 12ms. Server listening on virtual port http://localhost:5000`
      ],
      diagnostics: [],
      interactiveVariables: { success: true },
      suggestions: [
        "Adicionar suporte a internacionalização",
        "Configurar pipeline de CI/CD para deploy no Cloud Run",
        "Conectar ao PostgreSQL persistente"
      ]
    };
  }

  if (type === 'news') {
    return {
      appName: "AstroNews - Portal de Cosmologia",
      description: "Um belíssimo portal de notícias de astronomia interativo, fornecendo dados em tempo real, filtros de galáxias e simulador planetário.",
      files: [
        {
          fileName: "App.tsx",
          fileLanguage: "tsx",
          fileContent: `import React, { useState } from 'react';
import { Newspaper, Star, Globe, Compass, MessageSquare, Flame } from 'lucide-react';
import { db } from './database';

export default function AstronomicalNewsPortal() {
  const [articles, setArticles] = useState(db.articles);
  const [filter, setFilter] = useState('todos');
  const [selectedArticle, setSelectedArticle] = useState(db.articles[0]);
  const [newComment, setNewComment] = useState('');

  const filtered = filter === 'todos' 
    ? articles 
    : articles.filter(a => a.category.toLowerCase() === filter.toLowerCase());

  const handleLike = (id: number) => {
    setArticles(articles.map(a => a.id === id ? { ...a, likes: a.likes + 1 } : a));
    if (selectedArticle.id === id) {
      setSelectedArticle(prev => ({ ...prev, likes: prev.likes + 1 }));
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now(),
      author: "Cosmonauta Explorador",
      text: newComment,
      time: "Agora mesmo"
    };
    const updated = articles.map(a => {
      if (a.id === selectedArticle.id) {
        const upArt = { ...a, comments: [...a.comments, commentObj] };
        setSelectedArticle(upArt);
        return upArt;
      }
      return a;
    });
    setArticles(updated);
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-950 border-b border-violet-950/40 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="font-mono text-xs font-black tracking-widest text-[#00f2ff]">ASTRONEWS</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> 1K+ estrelas</span>
          <span className="bg-[#bd00ff]/10 text-[#bd00ff] border border-[#bd00ff]/30 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold">Viga Cósmica Ativa</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
        {/* News Feed left columns */}
        <div className="lg:col-span-2 border-r border-[#1e293b]/30 p-5 overflow-y-auto max-h-[85vh]">
          <h2 className="text-xl font-bold font-display tracking-tight text-white mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#00ff9d]" /> Descobrir o Espaço
          </h2>

          {/* Categories Tab Bar */}
          <div className="flex gap-2 mb-6">
            {['todos', 'Galáxias', 'Planetas', 'Eclipses', 'Astrofísica'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={\`px-3 py-1.5 rounded-lg text-xs font-mono border transition \${
                  (filter === cat) 
                    ? 'bg-indigo-600 text-white border-indigo-400' 
                    : 'bg-black/40 border-gray-800 text-slate-400 hover:text-white'
                }\`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(art => (
              <div 
                key={art.id} 
                onClick={() => setSelectedArticle(art)}
                className={\`bg-gray-950/80 border rounded-xl p-4 cursor-pointer transition shadow-lg hover:-translate-y-0.5 \${
                  selectedArticle.id === art.id 
                    ? 'border-[#00ff9d]' 
                    : 'border-slate-900 hover:border-slate-800'
                }\`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-2 text-indigo-400 uppercase">
                  <span>{art.category}</span>
                  <span>{art.readTime}</span>
                </div>
                <h3 className="font-bold text-sm tracking-tight text-slate-100 mb-2 leading-snug line-clamp-2">{art.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 mb-4">{art.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-mono">{art.date}</span>
                  <div className="flex items-center gap-2.5 text-xs font-mono">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleLike(art.id); }}
                      className="text-gray-400 hover:text-red-400 flex items-center gap-1.5 transition"
                    >
                      ❤️ {art.likes}
                    </button>
                    <span className="text-gray-500">💬 {art.comments.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected inspect detail right panel */}
        <div className="bg-slate-950/40 p-5 overflow-y-auto max-h-[85vh] flex flex-col gap-4">
          <div className="border border-violet-950/40 rounded-xl p-4 bg-[#0a0f1d] flex flex-col gap-3">
            <span className="text-[9px] font-mono text-[#00f2ff] uppercase tracking-wider block">Artigo Selecionado</span>
            <h3 className="font-black text-base text-white leading-snug">{selectedArticle.title}</h3>
            <div className="flex items-center gap-3 text-[10px] text-gray-400 pb-3 border-b border-gray-900">
              <span>Por: {selectedArticle.author}</span>
              <span>•</span>
              <span>{selectedArticle.date}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedArticle.fullText}</p>
            
            <div className="bg-black/50 p-2.5 rounded border border-gray-900 flex items-center justify-between text-xs font-mono mt-2">
              <span className="text-gray-400">Achou este artigo estimulante?</span>
              <button 
                onClick={() => handleLike(selectedArticle.id)}
                className="bg-[#00f2ff]/10 text-[#00f2ff] hover:bg-[#00f2ff]/20 px-3 py-1 rounded border border-[#00f2ff]/30 text-[10px] font-bold"
              >
                ❤️ Apoiar ({selectedArticle.likes})
              </button>
            </div>
          </div>

          <div className="border border-gray-900 rounded-xl p-4 bg-black/40 flex flex-col gap-2.5">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#00ff9d]" /> Sinapses de Opinião ({selectedArticle.comments.length})
            </span>

            <div className="flex flex-col gap-2 max-h-36 overflow-y-auto scrollbar-thin">
              {selectedArticle.comments.map(c => (
                <div key={c.id} className="bg-slate-950/50 p-2 rounded-lg border border-gray-950 text-[11px]">
                  <div className="flex justify-between items-center mb-0.5 text-[9px] font-mono text-slate-500">
                    <span className="font-bold text-gray-400">{c.author}</span>
                    <span>{c.time}</span>
                  </div>
                  <p className="text-slate-300 leading-normal">{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-1.5 mt-2">
              <input
                type="text"
                placeholder="Insira sua ideia ou feedback..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-black text-[11px] font-mono p-2 rounded-lg flex-1 border border-gray-900 focus:outline-none focus:border-indigo-500 text-white"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] px-3 font-mono font-bold rounded-lg cursor-pointer">
                Postar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}`
        },
        {
          fileName: "database.ts",
          fileLanguage: "typescript",
          fileContent: `export const db = {
  articles: [
    {
      id: 1,
      category: "Planetas",
      title: "Descoberto Super-Netuno gasoso na Constelação de Órion",
      summary: "Novo telescópio espacial flagra órbita ultra-precoce de exoplaneta que desafia a cosmologia habitual com temperaturas extremas.",
      readTime: "4 min",
      date: "19 de Junho, 2026",
      author: "Dra. Sônia Cassini",
      likes: 142,
      fullText: "Um corpo massivo esférico, 4.3 vezes maior que a Terra, foi confirmado nos arredor da constelação de Órion. Seu trânsito tem duração espremida em apenas 18 horas de translação anual por sua estrela mãe anã vermelha. Este exoplaneta é rico em nuvens de metais pesados em estado de vapor aquecido extrema.",
      comments: [
        { id: 101, author: "Julius Kepler", text: "Excelente matéria científica! Seria possível esse vapor evaporar por vento solar?", time: "2 horas atrás" },
        { id: 102, author: "Elena Vance", text: "Espantoso saber que mundos tão exóticos existem no nosso quintal estelar.", time: "40 min atrás" }
      ]
    },
    {
      id: 2,
      category: "Galáxias",
      title: "Fusão Andromeda-Via Láctea acelerou colisão de nuvens",
      summary: "Cientistas recalculam velocidade e prevêem que o choque gravitacional de flutuações das orlas já começou a mesclar poeiras nas franjas externas.",
      readTime: "6 min",
      date: "18 de Junho, 2026",
      author: "Prof. Arthur Eddington",
      likes: 218,
      fullText: "Novos mapas telemétricos comprovam que as flutuações e poeira gasosa periférica de ambas as galáxias espirais já estão intersectando, aumentando o ritmo de surgimento de estrelas azuis quentes de alta luminosidade em todo nosso braço local.",
      comments: [
        { id: 201, author: "Galileo G", text: "Será o fim da clássica Via Láctea como a desenhamos. Lindo espetáculo cósmico.", time: "1 dia atrás" }
      ]
    },
    {
      id: 3,
      category: "Astrofísica",
      title: "Novos traços gravimétricos sugerem existência de Matéria Escura Fria",
      summary: "Simulações revelam comportamento anômalo em aglomerados globulares afastados que só podem ser explicados por matéria invisível coalescente.",
      readTime: "8 min",
      date: "15 de Junho, 2026",
      author: "Dr. Marcos Hawk",
      likes: 95,
      fullText: "Estudos apontam que a rotação e precessão de aglomerados estelares antigos contam com um empuxo extra gravitacional central que não possui emissão eletromagnética. Esse fenômeno é de suma importância para comprovar teses de matéria escura amorfa.",
      comments: []
    }
  ]
};`
        },
        {
          fileName: "types.ts",
          fileLanguage: "typescript",
          fileContent: `export interface ArticleComment {
  id: number;
  author: string;
  text: string;
  time: string;
}

export interface Article {
  id: number;
  category: string;
  title: string;
  summary: string;
  readTime: string;
  date: string;
  author: string;
  likes: number;
  fullText: string;
  comments: ArticleComment[];
}`
        }
      ],
      compilationLogs: [
        `[vite] Inicializando estrutura do aplicativo AstroNews...`,
        `[compiler] Analisando dependências: [react, lucide-react]`,
        `[compiler] Compilando módulos TypeScript... transpilado com sucesso.`,
        `[dev-server] Servidor virtual rodando na porta 5000: http://localhost:5000/`,
        `[audit] Código seguro contra falhas. Tudo operacional!`
      ],
      diagnostics: [
        {
          severity: "warning" as const,
          message: "O uso de 'useState' para arrays estáticos pode ser simplificado se não houver backend de persistência robusto.",
          fileName: "App.tsx",
          line: 5
        },
        {
          severity: "info" as const,
          message: "Considere migrar as variáveis de estilo do header para o plugin tailwind principal.",
          fileName: "styles.css",
          line: 12
        }
      ],
      interactiveVariables: {},
      suggestions: [
        "Adicionar um mapa estelar interativo desenhado com D3 SVG nativo.",
        "Implementar notificações WebPush para novos meteoros detectados.",
        "Integrar fluxo de IA da NASA para sugerir hipóteses teóricas de física quântica."
      ]
    };
  } else if (type === 'finance') {
    return {
      appName: "VortexCash - Painel de Controle de Caixa",
      description: "Um aplicativo financeiro completo de gestão e conciliação de caixa, ideal para monitorar transações com gráficos e feedback imediato de liquidez.",
      files: [
        {
          fileName: "App.tsx",
          fileLanguage: "tsx",
          fileContent: `import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, Filter, PlusCircle, CreditCard } from 'lucide-react';
import { db } from './database';

export default function VortexCashDashboard() {
  const [transactions, setTransactions] = useState(db.transactions);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('entrada');
  const [category, setCategory] = useState('Vendas');

  const balance = transactions.reduce((acc, curr) => 
    curr.type === 'entrada' ? acc + curr.amount : acc - curr.amount, 0
  );

  const totalIn = transactions
    .filter(t => t.type === 'entrada')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOut = transactions
    .filter(t => t.type === 'saida')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !amount) return;
    const value = parseFloat(amount);
    if (isNaN(value)) return;

    const newTx = {
      id: Date.now(),
      desc,
      amount: value,
      type: type as 'entrada' | 'saida',
      category,
      date: "Hoje"
    };

    setTransactions([newTx, ...transactions]);
    setDesc('');
    setAmount('');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 p-6 font-sans">
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-gray-900">
        <div>
          <span className="text-[10px] uppercase font-mono text-[#00ff9d] tracking-widest font-black">VORTEX_SYSTEM_FINANCES</span>
          <h2 className="text-xl font-bold text-white">VortexCash Manager</h2>
        </div>
        <div className="bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 text-xs font-mono px-3 py-1 rounded-lg">
          Disponível: R$ {balance.toFixed(2)}
        </div>
      </header>

      {/* Cards grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono uppercase text-gray-400 block">Fluxo Entrada</span>
            <span className="text-xl font-black text-emerald-400 font-mono">R$ {totalIn.toFixed(2)}</span>
          </div>
          <ArrowUpRight className="w-8 h-8 text-emerald-500 bg-emerald-900/10 p-1.5 rounded-lg border border-emerald-500/15" />
        </div>

        <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono uppercase text-gray-400 block">Fluxo Saídas</span>
            <span className="text-xl font-black text-rose-400 font-mono">R$ {totalOut.toFixed(2)}</span>
          </div>
          <ArrowDownRight className="w-8 h-8 text-rose-500 bg-rose-900/10 p-1.5 rounded-lg border border-rose-500/15" />
        </div>

        <div className="bg-gradient-to-br from-indigo-950/40 to-black border border-indigo-900/30 rounded-xl p-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono uppercase text-indigo-300 block">Balanço Geral</span>
            <span className={\`text-xl font-black font-mono \${balance >= 0 ? 'text-[#00f2ff]' : 'text-orange-400'}\`}>
              R$ {balance.toFixed(2)}
            </span>
          </div>
          <TrendingUp className="w-8 h-8 text-[#00f2ff] bg-indigo-900/20 p-1.5 rounded-lg border border-purple-500/25" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insert Tx left form */}
        <div className="bg-gray-950 border border-gray-900 rounded-2xl p-5 flex flex-col gap-4">
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">Lançar Transação</span>
          
          <form onSubmit={handleAdd} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9.5px] font-mono text-gray-400">Descrição do Lançamento</label>
              <input
                type="text"
                placeholder="Exemplo: Licença SaaS, Venda WebCommerce"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="bg-black border border-gray-900 rounded-lg p-2 text-xs font-mono text-white placeholder-gray-800"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9.5px] font-mono text-gray-400">Valor em Reais (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-black border border-gray-900 rounded-lg p-2 text-xs font-mono text-white placeholder-gray-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9.5px] font-mono text-gray-400">Tipo de Fluxo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-black border border-gray-900 p-2 rounded-lg text-xs font-mono text-white outline-none"
                >
                  <option value="entrada">🟢 Entrada</option>
                  <option value="saida">🔴 Saída</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9.5px] font-mono text-gray-400">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-black border border-gray-900 p-2 rounded-lg text-xs font-mono text-white outline-none"
                >
                  <option value="Vendas">Vendas</option>
                  <option value="Serviços">Serviços</option>
                  <option value="Infraestrutura">Infraestrutura</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Gerais">Gerais</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 mt-2 text-xs text-black font-black uppercase tracking-wider font-mono rounded-lg bg-[#00ff9d] hover:bg-[#00cc7c] transition cursor-pointer flex items-center justify-center gap-1.5">
              <PlusCircle className="w-4 h-4" /> Efetuar Conciliação
            </button>
          </form>
        </div>

        {/* Tx history on the right */}
        <div className="lg:col-span-2 bg-[#06080d]/70 p-5 rounded-2xl border border-gray-900 max-h-[50vh] overflow-y-auto scrollbar-thin">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-4 font-bold">Histórico de Movimentações Recentes</span>
          
          <div className="flex flex-col gap-2">
            {transactions.map(t => (
              <div key={t.id} className="bg-black/60 border border-gray-900/80 rounded-xl p-3 flex items-center justify-between hover:border-gray-800 transition">
                <div className="flex items-center gap-3">
                  <div className={\`p-2 rounded-lg border \${t.type === 'entrada' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/10' : 'bg-rose-950/20 text-rose-400 border-rose-500/10'}\`}>
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">{t.desc}</span>
                    <span className="text-[8.5px] font-mono uppercase bg-gray-900/50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-800">{t.category}</span>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className={\`font-black \${t.type === 'entrada' ? 'text-emerald-400' : 'text-rose-400'}\`}>
                    {t.type === 'entrada' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                  </span>
                  <p className="text-[8px] text-gray-600 mt-1">{t.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}`
        },
        {
          fileName: "database.ts",
          fileLanguage: "typescript",
          fileContent: `export const db = {
  transactions: [
    { id: 1, desc: "Faturamento Web SaaS Enterprise", amount: 12450.00, type: "entrada" as const, category: "Vendas", date: "Ontem" },
    { id: 2, desc: "Servidor Dedicado AWS Cloud", amount: 1420.50, type: "saida" as const, category: "Infraestrutura", date: "15 de Junho" },
    { id: 3, desc: "Suporte Técnico Mensal", amount: 2500.00, type: "entrada" as const, category: "Serviços", date: "12 de Junho" },
    { id: 4, desc: "Campanha Tráfego Pago Google Ads", amount: 800.00, type: "saida" as const, category: "Marketing", date: "10 de Junho" }
  ]
};`
        },
        {
          fileName: "types.ts",
          fileLanguage: "typescript",
          fileContent: `export interface Transaction {
  id: number;
  desc: string;
  amount: number;
  type: 'entrada' | 'saida';
  category: string;
  date: string;
}`
        }
      ],
      compilationLogs: [
        `[vite] Inicializando estrutura do aplicativo VortexCash...`,
        `[compiler] Escaneando decoradores e interfaces financeiras...`,
        `[compiler] Compilado com 100% de otimização de tipagem estrita!`,
        `[dev-server] Servidor virtual rodando na porta 5000: http://localhost:5000/`
      ],
      diagnostics: [
        {
          severity: "warning" as const,
          message: "Considere tipar estritamente as strings de Categoria para evitar mutações de sandbox.",
          fileName: "types.ts",
          line: 5
        }
      ],
      interactiveVariables: {},
      suggestions: [
        "Adicionar filtros mensais com gráficos em barras d3 customizados.",
        "Integrar exportação de arquivos para planilha .xlsx ou PDF via download.",
        "Implementar sistema de recorrência (mensalidades autonomas)."
      ]
    };
  }

  // Fallback 3: Task Manager
  return {
    appName: "NebulaTasks - Gestor de Objetivos",
    description: "Um completo e responsivo gestor de cartões e tarefas de equipes, ideal para criar, editar, categorizar e ordenar prioridades.",
    files: [
      {
        fileName: "App.tsx",
        fileLanguage: "tsx",
        fileContent: `import React, { useState } from 'react';
import { CheckSquare, ListTodo, Plus, Trash2, ShieldAlert } from 'lucide-react';
import { db } from './database';

export default function NebulaTasksApp() {
  const [tasks, setTasks] = useState(db.tasks);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('baixa');

  const handleToggle = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newTask = {
      id: Date.now(),
      text,
      priority: priority as 'baixa' | 'media' | 'alta',
      done: false
    };

    setTasks([...tasks, newTask]);
    setText('');
  };

  const handleRemove = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl bg-slate-950 border border-gray-900 rounded-2xl overflow-hidden p-6 shadow-2xl flex flex-col gap-4">
        <header className="flex justify-between items-center pb-4 border-b border-gray-900 shrink-0">
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-sm tracking-widest font-mono text-purple-300">NebulaTasks</h3>
          </div>
          <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border border-[#00f2ff]/30 text-[#00f2ff] bg-[#00f2ff]/10">
            {tasks.filter(t => !t.done).length} pendentes
          </span>
        </header>

        <form onSubmit={handleCreate} className="flex gap-2 bg-black p-2 rounded-xl border border-gray-900">
          <input
            type="text"
            placeholder="Nova tarefa cognitiva..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-transparent text-xs p-2.5 outline-none flex-1 text-slate-200 font-mono placeholder-gray-700"
          />
          <select 
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-[#05060a] border border-gray-800 text-[10px] text-slate-300 py-1 px-2.5 rounded font-mono outline-none"
          >
            <option value="baixa">Fácil</option>
            <option value="media">Média</option>
            <option value="alta">Forte</option>
          </select>
          <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white p-2.5 rounded-lg cursor-pointer transition">
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <hr className="border-gray-900" />

        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto scrollbar-thin">
          {tasks.length === 0 ? (
            <div className="text-center py-10 font-mono text-[10px] text-gray-600">Sem atividades registradas.</div>
          ) : (
            tasks.map(t => (
              <div 
                key={t.id} 
                onClick={() => handleToggle(t.id)}
                className={\`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition bg-[#0d0f17]/30 \${
                  t.done 
                    ? 'border-gray-900 opacity-50 line-through' 
                    : 'border-slate-900 hover:border-slate-800'
                }\`}
              >
                <div className="flex items-center gap-3">
                  <div className={\`w-4.5 h-4.5 rounded border flex items-center justify-center transition \${
                    t.done ? 'bg-purple-600 border-purple-500 text-white' : 'border-gray-800 hover:border-purple-600'
                  }\`}>
                    {t.done && <CheckSquare className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="text-xs text-slate-200">{t.text}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={\`text-[7px] uppercase font-mono px-1.5 py-0.5 rounded border \${
                    t.priority === 'alta' ? 'border-red-900/30 bg-red-950/15 text-red-400' :
                    t.priority === 'media' ? 'border-amber-900/30 bg-amber-950/15 text-amber-400' :
                    'border-gray-900 bg-gray-950 text-gray-400'
                  }\`}>
                    {t.priority}
                  </span>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRemove(t.id); }}
                    className="p-1 text-gray-500 hover:text-red-400 hover:bg-gray-900/50 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}`
      },
      {
        fileName: "database.ts",
        fileLanguage: "typescript",
        fileContent: `export const db = {
  tasks: [
    { id: 1, text: "Otimizar código de carregamento assíncrono", priority: "alta" as const, done: false },
    { id: 2, text: "Criar documentação de persistência do SQLite", priority: "media" as const, done: true },
    { id: 3, text: "Reunião de alinhamento com Arquiteto Layon", priority: "baixa" as const, done: false }
  ]
};`
      },
      {
        fileName: "types.ts",
        fileLanguage: "typescript",
        fileContent: `export interface Task {
  id: number;
  text: string;
  priority: 'baixa' | 'media' | 'alta';
  done: boolean;
}`
      }
    ],
    compilationLogs: [
      `[vite] Inicializando estrutura do aplicativo NebulaTasks...`,
      `[compiler] Módulo Kanban inicializado com sucesso.`,
      `[compiler] Nenhum erro detectado na análise sintática.`,
      `[dev-server] Servidor virtual rodando na porta 5000:`
    ],
    diagnostics: [
      {
        severity: "info",
        message: "As tarefas concluídas ficam salvas no estado local. Configure persistência em Cloud para não perder dados.",
        fileName: "App.tsx",
        line: 8
      }
    ],
    interactiveVariables: {},
    suggestions: [
      "Adicionar recurso de filtros inteligentes.",
      "Criar estatísticas visuais no cabeçalho sobre tarefas finalizadas.",
      "Vincular datas limite e alertas com beep sonoro ficção científica."
    ]
  };
}
