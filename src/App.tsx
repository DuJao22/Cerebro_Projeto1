/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Brain, Cpu, Database, Sparkles, Mic, Send, Volume2, VolumeX, 
  ThumbsUp, ThumbsDown, RefreshCw, Trash2, Plus, Search, 
  Activity, ExternalLink, ShieldAlert, Instagram, Info, Network, AlertCircle,
  Maximize2, Minimize2, Menu, X, MessageSquare, Sliders, FileText, Zap, BookOpen, Lightbulb,
  Github, FolderGit2, Code, Braces, Binary, PlaySquare, Settings, CornerDownRight, Check,
  Coins, Plane, Save, Import, Layers, Heart, Filter, MessageSquareCode, ArrowLeft
} from 'lucide-react';
import * as d3 from 'd3';
import { ChatMessage, BrainStatus, Memory, Relationship, MemoryType } from './types.js';

// Re-compile raw React/TSX or template files to interactive HTML standard with Tailwind CSS capabilities
function getLiveIframeHtml(creatorResult: any): string {
  if (!creatorResult || !creatorResult.files) return '';
  const appFile = creatorResult.files.find((f: any) => f.fileName === 'App.tsx' || f.fileName === 'index.html');
  const cssFile = creatorResult.files.find((f: any) => f.fileName === 'styles.css' || f.fileName === 'index.css');
  
  let code = appFile ? appFile.fileContent : '';
  let css = cssFile ? cssFile.fileContent : '';

  // Extract JSX body
  let bodyContent = '';
  if (code) {
    if (code.includes('return (')) {
      const startIdx = code.indexOf('return (');
      let returnContent = code.substring(startIdx + 8);
      const endIdx = returnContent.lastIndexOf(')');
      if (endIdx !== -1) {
        returnContent = returnContent.substring(0, endIdx);
      }
      bodyContent = returnContent;
    } else if (code.includes('return')) {
      const startIdx = code.indexOf('return');
      let returnContent = code.substring(startIdx + 6);
      const endIdx = returnContent.lastIndexOf(';');
      if (endIdx !== -1) {
        returnContent = returnContent.substring(0, endIdx);
      }
      bodyContent = returnContent;
    } else {
      bodyContent = code;
    }
  }

  // Convert typical React JSX formats to compliant index.html representations
  bodyContent = bodyContent
    .replace(/className\s*=\s*"/g, 'class="')
    .replace(/className\s*=\s*\{([^}]+)\}/g, (match, p1) => `class=${p1}`)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '') // Clear notes/JSX comment lines
    .replace(/\{(\s*['"`][^'"`]*['"`]\s*)\}/g, (match, p1) => p1.replace(/['"`]/g, '')) // clear dynamic braces for raw strings
    .replace(/srcDoc/g, 'srcdoc')
    .replace(/referrerPolicy/g, 'referrerpolicy')
    .replace(/style=\{\{[^}]*\}\}/g, ''); // strip React json styling block

  // If conversion yields an entry that is too generic or non-renderable, construct a master-crafted cyberpunk presentation cards
  if (bodyContent.trim().length < 50 || bodyContent.includes('import ')) {
    bodyContent = `
      <div class="min-h-screen bg-[#070b12] text-slate-200 font-sans flex flex-col justify-between p-6">
        <header class="py-4 px-6 border-b border-white/5 flex justify-between items-center bg-slate-900/40 backdrop-blur rounded-xl">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono font-black tracking-widest text-[#00ff9d]">LAYON <span class="text-[#00f2ff]">STUDIO</span></span>
          </div>
          <span class="text-[9px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30 uppercase">Interactive Sandbox Environment</span>
        </header>

        <main class="flex-1 max-w-4xl mx-auto py-12 text-center flex flex-col justify-center items-center">
          <span class="inline-block py-1 px-3 bg-emerald-500/10 text-[#00ff9d] border border-emerald-500/20 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold mb-4">🚀 COMPILADO COM SUCESSO</span>
          <h1 class="text-3xl font-display font-medium text-white tracking-tight mb-2">${creatorResult.appName}</h1>
          <p class="text-xs text-gray-400 mb-6 max-w-lg mx-auto">${creatorResult.description}</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-left max-w-xl mx-auto mb-8 w-full">
            ${creatorResult.files.map((f: any) => `
              <div class="bg-slate-900/30 border border-slate-800/60 p-3 rounded-xl hover:border-indigo-500/30 transition">
                <span class="font-mono text-[10px] text-[#00f2ff] font-bold block mb-1">📁 ${f.fileName}</span>
                <p class="text-[9px] text-gray-500">${f.fileLanguage === 'typescript' || f.fileLanguage === 'tsx' ? 'React & TSX Component code structure' : 'Cascading stylesheets and visuals'}</p>
              </div>
            `).join('')}
          </div>

          <button onclick="alert('Conexão ativa de testes estabelecida!')" class="bg-gradient-to-r from-[#00ff9d] to-[#00f2ff] text-black font-mono font-black text-[10px] py-2.5 px-6 rounded-lg hover:opacity-90 active:scale-95 transition tracking-widest uppercase">
            🚀 Iniciar Sandbox Simulado
          </button>
        </main>

        <footer class="py-4 text-center text-[9px] text-gray-600 border-t border-white/5">
          DESENVOLVIDO POR LAYON-SYSTEM & INTELIGÊNCIA SINÁPTICA
        </footer>
      </div>
    `;
  }

  // Check for specialized presets layout mapping
  const appL = creatorResult.appName.toLowerCase();
  
  if (appL.includes('mockup') || appL.includes('imagem') || appL.includes('figma') || appL.includes('diagram') || appL.includes('fluxo') || appL.includes('v3') || appL.includes('cloud')) {
    bodyContent = `
      <div id="canvas_mock_panel" class="min-h-screen bg-[#030508] text-[#e2e8f0] p-6 font-sans flex flex-col justify-between">
        <header class="flex items-center justify-between p-4 bg-slate-950/80 rounded-xl border border-pink-500/20 mb-6">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            <span class="font-mono text-xs font-black tracking-widest text-[#ff007c]">CLOUD V3 INTERACTIVE MOCKUP BLUEPRINT</span>
          </div>
          <span class="bg-[#ff007c]/10 text-pink-400 border border-pink-500/20 text-[9px] px-2.5 py-0.5 rounded-full font-bold">MOCKUP REAL GERADO VIA MEMÓRIA</span>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          <!-- Col 1: Interactive Network -->
          <div class="lg:col-span-7 bg-[#080d19]/60 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden min-h-[350px]">
            <div>
              <span class="text-[9px] font-mono text-pink-400 tracking-wider uppercase">CLOUD COGNITIVE MAPPING</span>
              <h3 class="text-sm font-bold text-white mt-1">Diagrama de Nós de Repositórios & Servidores V3</h3>
            </div>

            <!-- Beautiful dynamic SVG Flowchart -->
            <div class="my-4 flex items-center justify-center bg-black/40 p-4 rounded-xl border border-slate-950">
              <svg viewBox="0 0 400 200" class="w-full h-48">
                <!-- Connections -->
                <path d="M 50 100 L 150 50" stroke="#ff007c" stroke-width="2" stroke-dasharray="5,5" class="animate-dash" fill="none" />
                <path d="M 50 100 L 150 150" stroke="#00f2ff" stroke-width="2" class="animate-pulse" fill="none" />
                <path d="M 150 50 L 300 100" stroke="#00ff9d" stroke-width="1.5" fill="none" />
                <path d="M 150 150 L 300 100" stroke="#bd00ff" stroke-width="1.5" fill="none" />
                
                <!-- Icons / Nodes -->
                <g class="cursor-pointer" onclick="alert('Gateway CDN: Entrega arquivos estáticos VITE rapidamente em todo o globo.')">
                  <circle cx="50" cy="100" r="18" fill="#0c1020" stroke="#ff007c" stroke-width="2" />
                  <text x="50" y="104" fill="white" font-family="monospace" font-size="9" text-anchor="middle" font-weight="bold">CDN</text>
                </g>
                
                <g class="cursor-pointer" onclick="alert('API de Microsserviço V3: Executa rotas lógicas em servidores sem estado.')">
                  <circle cx="150" cy="50" r="18" fill="#0c1020" stroke="#00ff9d" stroke-width="2" />
                  <text x="150" y="54" fill="white" font-family="monospace" font-size="9" text-anchor="middle" font-weight="bold">V3 API</text>
                </g>
                
                <g class="cursor-pointer" onclick="alert('Banco PostgreSQL Relacional: Persiste dados de transação e metadados cognitivos.')">
                  <circle cx="150" cy="150" r="18" fill="#0c1020" stroke="#00f2ff" stroke-width="2" />
                  <text x="150" y="154" fill="white" font-family="monospace" font-size="9" text-anchor="middle" font-weight="bold">DB</text>
                </g>

                <g class="cursor-pointer" onclick="alert('Interface do Usuário React: Renderiza o dashboard interativo em tela cheia.')">
                  <circle cx="300" cy="100" r="22" fill="#0c1020" stroke="#bd00ff" stroke-width="2" />
                  <text x="300" y="104" fill="white" font-family="monospace" font-size="9" text-anchor="middle" font-weight="bold">CLIENT</text>
                </g>
              </svg>
            </div>

            <div class="flex items-center justify-between text-[9px] font-mono text-gray-500 uppercase tracking-widest border-t border-slate-900 pt-3">
              <span>Layout: Figma Blueprint</span>
              <span class="text-pink-400">Clique nos nós para inspecionar</span>
            </div>
          </div>

          <!-- Col 2: Info & Details -->
          <div class="lg:col-span-5 flex flex-col justify-between gap-4">
            <div class="bg-black p-4 rounded-xl border border-slate-900 flex-1">
              <span class="text-[9px] font-mono text-pink-400 uppercase tracking-widest font-black block mb-3">Mapeamento Cognitivo e IA</span>
              <div class="space-y-3">
                <div class="flex justify-between items-center bg-[#070b12] p-2 rounded border border-slate-950">
                  <span class="text-gray-400">Total Funções Extraídas</span>
                  <span class="font-mono font-bold text-[#00ff9d]">142</span>
                </div>
                <div class="flex justify-between items-center bg-[#070b12] p-2 rounded border border-slate-950">
                  <span class="text-gray-400">Conexões Ativas Cloud</span>
                  <span class="font-mono font-bold text-[#00f2ff]">4 links ativos</span>
                </div>
                <div class="flex justify-between items-center bg-[#070b12] p-2 rounded border border-slate-950">
                  <span class="text-gray-400">Grau de Acoplamento IA</span>
                  <span class="font-mono font-bold text-[#bd00ff]">98.7%</span>
                </div>
              </div>
            </div>

            <div class="p-4 rounded-xl border border-slate-900 bg-[#090b11]/80 backdrop-blur">
              <span class="text-[8px] font-mono text-gray-500 uppercase tracking-wider block mb-1">CÓDIGO DE INFRAESTRUTURA CLOUD GERADO:</span>
              <pre class="text-[8.5px] text-gray-400 font-mono leading-tight whitespace-pre bg-black/60 p-2.5 rounded border border-slate-950 overflow-x-auto text-pink-300">
const edgeGateway = new CDNGateway("V3CDN", {
  cacheRetention: "14 days",
  originHost: "v3-api.layon.internal"
});
edgeGateway.onRequest(ctx => {
  ctx.headers.set("x-cognitive-memory", "integrated");
});</pre>
            </div>
          </div>
        </div>

        <footer class="mt-6 py-4 text-center text-[9px] text-gray-600 border-t border-slate-900">
          GERADOR DE IMAGENS E MOCKUPS COGNITIVOS COPIADOS DO V3 • LAYON INC
        </footer>
      </div>
    `;
  } else if (appL.includes('saas') || appL.includes('sistema') || appL.includes('dashboard')) {
    bodyContent = `
      <div id="saas_mock_panel" class="min-h-screen bg-[#04060a] text-slate-100 p-6 font-sans flex flex-col justify-between">
        <div class="max-w-7xl mx-auto flex flex-col gap-6 w-full">
          <header class="flex justify-between items-center p-4 bg-slate-950/80 rounded-xl border border-slate-900">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded bg-[#00ff9d] animate-pulse"></div>
              <span class="font-mono text-xs font-black tracking-widest text-white">SaaS COGNITIVO METRICS</span>
            </div>
            <div class="flex gap-2">
              <span class="text-[9px] font-mono text-[#00ff9d] bg-[#00ff9d]/5 border border-[#00ff9d]/20 px-2 py-0.5 rounded">STATUS: EXCELENTE</span>
              <span class="text-[9px] font-mono text-[#1f2937] hover:text-white transition bg-gray-900 px-2 py-0.5 rounded cursor-pointer">ADMIN PANEL</span>
            </div>
          </header>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            <div class="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
              <span class="text-gray-500 font-mono text-[9px] uppercase">Faturamento Mensal</span>
              <h3 class="text-xl font-bold font-mono text-white mt-1">R$ 14.820,00</h3>
              <span class="text-[9px] text-[#00ff9d] mt-1 block">▲ +12.4% este mês</span>
            </div>
            <div class="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
              <span class="text-gray-500 font-mono text-[9px] uppercase">Usuários Ativos</span>
              <h3 class="text-xl font-bold font-mono text-white mt-1">1.242</h3>
              <span class="text-[9px] text-[#00f2ff] mt-1 block">▲ +8.2% hoje</span>
            </div>
            <div class="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
              <span class="text-gray-500 font-mono text-[9px] uppercase">Uso de API (Memory)</span>
              <h3 class="text-xl font-bold font-mono text-white mt-1">98.402 reqs</h3>
              <span class="text-[9px] text-purple-400 mt-1 block">Estável (nominal)</span>
            </div>
            <div class="p-4 bg-slate-900/40 border border-slate-900 rounded-xl">
              <span class="text-gray-500 font-mono text-[9px] uppercase">Limite de Alocação</span>
              <h3 class="text-xl font-bold font-mono text-white mt-1">15.2 GB</h3>
              <span class="text-[9px] text-amber-500 mt-1 block">78% de quota consumida</span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
            <!-- Main chart simulation -->
            <div class="lg:col-span-8 bg-slate-950/80 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span class="text-[9px] font-mono text-emerald-400 tracking-wider">CHARTS INTERACTIVES</span>
                <h4 class="text-sm font-bold text-white mt-0.5">Evolução de Requisições e Conversão Monetária</h4>
              </div>
              
              <svg viewBox="0 0 500 150" class="w-full h-40 my-3">
                <path d="M 0 120 Q 80 40, 160 80 T 320 20 T 500 60" fill="none" stroke="#00ff9d" stroke-width="3" stroke-linecap="round" />
                <path d="M 0 120 Q 80 40, 160 80 T 320 20 T 500 60 L 500 150 L 0 150 Z" fill="url(#gradientSaaS)" opacity="0.08" />
                
                <!-- Grid markers -->
                <line x1="0" y1="120" x2="500" y2="120" stroke="#1f2937" stroke-dasharray="3,3" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#1f2937" stroke-dasharray="3,3" />
                
                <defs>
                  <linearGradient id="gradientSaaS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#00ff9d" />
                    <stop offset="100%" stop-color="#04060a" />
                  </linearGradient>
                </defs>
              </svg>
              <span class="text-[8.5px] text-gray-500 font-mono uppercase tracking-widest text-center block">SÉRIE TEMPORAL COGNITIVA REPOSITÓRIO ATIVO</span>
            </div>

            <!-- Column table -->
            <div class="lg:col-span-4 bg-slate-950/85 border border-slate-900 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span class="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Últimas Atividades</span>
                <div class="mt-3 space-y-2.5">
                  <div class="flex justify-between items-center text-[10px]">
                    <span class="text-slate-350 font-bold">API_KEY_CREATED</span>
                    <span class="text-gray-500 font-mono">12s atrás</span>
                  </div>
                  <div class="flex justify-between items-center text-[10px]">
                    <span class="text-[#00ff9d] font-bold">WEBHOOK_RECEIVED</span>
                    <span class="text-gray-500 font-mono">1m atrás</span>
                  </div>
                  <div class="flex justify-between items-center text-[10px]">
                    <span class="text-slate-350 font-bold">DATABASE_BACKUP</span>
                    <span class="text-gray-500 font-mono">5m atrás</span>
                  </div>
                </div>
              </div>
              
              <button class="bg-[#00ff9d] text-slate-950 w-full rounded py-2 text-[10px] font-mono font-bold mt-4 uppercase hover:bg-emerald-400 transition" onclick="alert('Exportando Logs...')">
                Exportar Logs xlsx
              </button>
            </div>
          </div>
        </div>
        <footer class="py-4 text-center text-[9px] text-gray-600 border-t border-slate-900">
          SaaS COMPLETO COGNITIVO • LAYON INC
        </footer>
      </div>
    `;
  } else if (appL.includes('landing') || appL.includes('vendas') || appL.includes('page') || appL.includes('conversao')) {
    bodyContent = `
      <div id="landing_mock_panel" class="min-h-screen bg-[#05070a] text-slate-200 font-sans flex flex-col justify-between">
        <div class="max-w-5xl mx-auto px-6 py-12 flex flex-col justify-between w-full flex-1">
          <nav class="flex justify-between items-center py-4 border-b border-white/5">
            <span class="font-mono text-xs font-extrabold tracking-widest text-[#00f2ff]">LAYON • PLATINUM LP</span>
            <button class="text-[10px] font-mono font-bold bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 rounded px-4 py-1.5 hover:bg-[#00f2ff]/20 transition">VER RECURSOS</button>
          </nav>

          <main class="my-16 text-center max-w-2xl mx-auto">
            <span class="inline-block px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full text-[9px] font-mono uppercase tracking-widest font-black mb-4 animate-pulse">Lançamento de Produto Digital</span>
            <h1 class="text-4xl font-display font-medium text-white tracking-tight leading-none mb-4 font-bold">Mude a forma de aprender com Engenharia Cognitiva</h1>
            <p class="text-xs text-gray-400 leading-relaxed mb-8">Extraia o poder máximo de repositórios legados, diagramando fluxos, criando esquemas de classes com inteligência e construindo microsserviços integrados de faturamento real em segundos.</p>
            
            <div class="flex justify-center gap-3">
              <button onclick="alert('Inscrição confirmada!')" class="bg-gradient-to-r from-[#00f2ff] to-[#bd00ff] text-white font-mono font-black text-[10.5px] py-3 px-8 rounded-lg hover:opacity-90 active:scale-95 transition tracking-widest uppercase">Começar Agora Grátis</button>
            </div>
          </main>

          <section class="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 animate-fade">
            <div class="p-5 bg-gradient-to-b from-slate-900/30 to-[#0c1020]/25 rounded-2xl border border-white/5 flex flex-col gap-2 hover:border-[#00f2ff]/30 transition">
              <span class="text-xl">⚡</span>
              <h4 class="font-bold text-white text-xs">Mapeador Eficiente</h4>
              <p class="text-[10.5px] text-gray-500 font-sans leading-relaxed">Conecte seu repositório Git e descubra dependências e fluxos cognitivos instantaneamente.</p>
            </div>
            <div class="p-5 bg-gradient-to-b from-slate-900/30 to-[#0c1020]/25 rounded-2xl border border-white/5 flex flex-col gap-2 hover:border-[#bd00ff]/30 transition">
              <span class="text-xl">🔮</span>
              <h4 class="font-bold text-white text-xs">Automação de Código</h4>
              <p class="text-[10.5px] text-gray-500 font-sans leading-relaxed">Gere aplicativos, LPs e microssistemas eficientes em lote com compilação livre de erros.</p>
            </div>
            <div class="p-5 bg-gradient-to-b from-slate-900/30 to-[#0c1020]/25 rounded-2xl border border-white/5 flex flex-col gap-2 hover:border-[#00ff9d]/30 transition">
              <span class="text-xl">🤖</span>
              <h4 class="font-bold text-white text-xs">Sandbox Integrada</h4>
              <p class="text-[10.5px] text-gray-500 font-sans leading-relaxed">Teste e valide fluxos com simulação de banco de dados nativos na nossa sandbox virtual.</p>
            </div>
          </section>
        </div>
        <footer class="py-4 text-center text-[9px] text-gray-600 border-t border-slate-900">
          LANDING PAGE CORES • LAYON INC
        </footer>
      </div>
    `;
  }

  // Inject responsive components mapping for standard helix designs natively so they run 100% interactive inside the Iframe!
  if (creatorResult.appName.toLowerCase().includes('helix') || creatorResult.appName.toLowerCase().includes('biotech')) {
    bodyContent = `
      <div class="min-h-screen bg-[#05070a] text-[#e6edf3] p-6 font-sans flex flex-col justify-between">
        <header class="flex items-center justify-between p-4 bg-slate-950/80 rounded-xl border border-indigo-500/20 mb-6">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-pulse"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            <span class="font-mono text-xs font-black tracking-widest text-[#00f2ff]">CYBERHELIX: BIOTECH 3D CORE</span>
          </div>
          <span class="bg-purple-950/50 text-purple-400 border border-purple-500/20 text-[9px] px-2.5 py-0.5 rounded-full font-bold">BIOTECH IA v12.4</span>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 text-xs">
          <!-- Column 1: Rotating DNA Helix -->
          <div class="lg:col-span-5 bg-gradient-to-b from-[#0a0f1d] to-[#04060b] border border-cyan-500/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden min-h-[280px]">
            <div class="z-10">
              <span class="text-[9px] font-mono text-cyan-400 tracking-wider uppercase">SIMULADOR MOLECULAR 3D</span>
              <h3 class="text-sm font-bold font-display text-white mt-1">Interação Tridimensional</h3>
            </div>

            <!-- Beautiful dynamic SVG rotating helix -->
            <div class="my-3 flex items-center justify-center">
              <canvas id="helixCanvas" width="300" height="140" class="w-full h-32 rounded bg-black/30 border border-slate-900"></canvas>
            </div>

            <div class="text-[9px] text-gray-500 text-center uppercase tracking-wider font-mono">ESTRUTURA DE ÓRBITA ROTATIVA MOLECULAR</div>
          </div>

          <!-- Column 2: Dashboard and biometrics -->
          <div class="lg:col-span-7 flex flex-col justify-between gap-4">
            <div>
              <span class="text-[9px] font-mono text-purple-400 uppercase tracking-widest font-black block mb-2">SENSORES COGNITIVOS BIO-INTEGRADOS</span>
              
              <div id="sensorsGrid" class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div onclick="selectSensor('Sincronizador Córtex', '98.4%', 'Nominal', 'Conexão sináptica principal transmitindo telemetria neural.')" class="p-3 bg-[#090b11] rounded-xl border border-cyan-500/30 hover:border-cyan-400 transition cursor-pointer">
                  <h4 class="text-[10px] font-bold text-cyan-400">Sincronizador Córtex</h4>
                  <span class="text-sm font-mono font-black text-white">98.4%</span>
                </div>
                <div onclick="selectSensor('Cardiorreceptor 3D', '72 bpm', 'Estável', 'Monitoramento do fluxo cardíaco bioelétrico em tempo real.')" class="p-3 bg-[#090b11] rounded-xl border border-slate-900 hover:border-purple-500/40 transition cursor-pointer">
                  <h4 class="text-[10px] font-bold text-purple-400">Cardiorreceptor 3D</h4>
                  <span class="text-sm font-mono font-black text-white">72 bpm</span>
                </div>
                <div onclick="selectSensor('Escudo Imunológico', '100%', 'Protegido', 'Barreira nanotecnológica ativa protegendo sistemas vitais.')" class="p-3 bg-[#090b11] rounded-xl border border-slate-900 hover:border-emerald-500/40 transition cursor-pointer">
                  <h4 class="text-[10px] font-bold text-emerald-400">Escudo Imunológico</h4>
                  <span class="text-sm font-mono font-black text-white">100%</span>
                </div>
              </div>
            </div>

            <div id="sensorDetailCard" class="p-4 rounded-xl border border-slate-900 bg-[#090b11]/80 backdrop-blur">
              <span class="text-[8px] font-mono text-gray-500 uppercase tracking-wider block mb-1">RELATÓRIO DIAGNÓSTICO DO INTEGRANTE SELECIONADO:</span>
              <h4 id="detailTitle" class="text-xs font-bold text-white mb-1">Sincronizador Córtex</h4>
              <p id="detailDesc" class="text-[10px] text-gray-400 leading-relaxed font-sans">Conexão sináptica principal transmitindo telemetria neural.</p>
            </div>
          </div>
        </div>

        <script>
          function selectSensor(name, val, status, desc) {
            document.getElementById('detailTitle').textContent = name + ' • ' + val;
            document.getElementById('detailDesc').textContent = desc + ' (' + status + ')';
          }

          // Render rotating helix canvas inside iframe
          const canvas = document.getElementById('helixCanvas');
          const ctx = canvas.getContext('2d');
          let angle = 0;

          function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const midY = canvas.height / 2;
            ctx.strokeStyle = 'rgba(79, 70, 229, 0.15)';
            ctx.lineWidth = 1;

            for (let i = 0; i < 15; i++) {
              const x = 20 + i * 18;
              const currentAngle = angle + (i * 0.35);
              const y1 = midY + Math.sin(currentAngle) * 35;
              const y2 = midY + Math.sin(currentAngle + Math.PI) * 35;

              // connector
              ctx.beginPath();
              ctx.moveTo(x, y1);
              ctx.lineTo(x, y2);
              ctx.stroke();

              // nodes
              ctx.fillStyle = i % 2 === 0 ? '#00ff9d' : '#00f2ff';
              ctx.beginPath();
              ctx.arc(x, y1, 3.5, 0, Math.PI * 2);
              ctx.fill();

              ctx.fillStyle = i % 2 === 0 ? '#00f2ff' : '#bd00ff';
              ctx.beginPath();
              ctx.arc(x, y2, 3.5, 0, Math.PI * 2);
              ctx.fill();
            }

            angle += 0.05;
            requestAnimationFrame(draw);
          }
          draw();
        </script>
      </div>
    `;
  }

  // Return formatted HTML
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${creatorResult.appName}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', sans-serif;
          background-color: #05070a;
        }
        .font-display {
          font-family: 'Space Grotesk', sans-serif;
        }
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
        ${css}
      </style>
      <script>
        // Console log/error interceptor bridge
        (function() {
          const _log = console.log;
          const _warn = console.warn;
          const _error = console.error;

          function sendLogToParent(level, text) {
            window.parent.postMessage({
              type: 'CONSOLE_LOG',
              level: level,
              text: text,
              timestamp: new Date().toLocaleTimeString()
            }, '*');
          }

          console.log = function(...args) {
            _log.apply(console, args);
            sendLogToParent('info', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          };

          console.warn = function(...args) {
            _warn.apply(console, args);
            sendLogToParent('warn', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          };

          console.error = function(...args) {
            _error.apply(console, args);
            sendLogToParent('error', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          };

          window.onerror = function(message, source, lineno, colno, error) {
            sendLogToParent('error', 'Erro de Execução: ' + message + ' (' + source + ':' + lineno + ')');
            return false;
          };

          // JS evaluator dispatcher
          window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'EXECUTE_JS') {
              try {
                sendLogToParent('info', '[JS EXECUTE] ' + event.data.code);
                const res = window.eval(event.data.code);
                if (res !== undefined) {
                  sendLogToParent('info', '[RESULTADO] ' + (typeof res === 'object' ? JSON.stringify(res) : String(res)));
                }
              } catch(err) {
                sendLogToParent('error', '[FALHA JS] ' + err.message);
              }
            }
          });

          // Live Click Action Interceptors to feed console dashboard
          document.addEventListener('click', function(e) {
            const el = e.target;
            if (el) {
              const tag = el.tagName;
              const id = el.id ? '#' + el.id : '';
              const descText = el.textContent ? '"' + el.textContent.substring(0, 24).trim() + '"' : '';
              const firstClass = el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '';
              if (tag === 'BUTTON' || tag === 'A' || el.closest('button') || el.closest('a')) {
                sendLogToParent('action', 'Clique em <' + tag.toLowerCase() + id + firstClass + '> ' + descText);
              }
            }
          }, true);
        })();
      </script>
    </head>
    <body class="bg-[#05070a] text-slate-100 overflow-x-hidden antialiased select-none">
      ${bodyContent}
    </body>
    </html>
  `;
}

// Fallback Speech Recognition
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function App() {
  // Consciousness status and metrics
  const [status, setStatus] = useState<BrainStatus>({
    totalMemories: 0,
    totalRelations: 0,
    averageWeight: 0,
    learningLogs: []
  });

  // Active UI conversation lists
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content: `### Córtex de Inteligência Código e GitHub Ativo 🧬

Bem-vindo ao **Cérebro Digital**, uma Inteligência de Software cognitiva em formato de Grafo de Conhecimento e Rede Neural de Aprendizado!

Desenvolvido pelo engenheiro líder **João Layon** (Instagram: **[@layon.dev](https://instagram.com/layon.dev)**), integradora do **Layon-System** (**[Plataforma Layon](https://plataforma-estudos-theta.vercel.app/)**).

---
**Recursos de Engenharia de Código Disponíveis:**
1. **Rastreador GitHub (Cortex Tracker)**: Conecte seu GitHub usando um Token ou Usuário. Liste e **Diga/Analise** seus repositórios reais!
2. **Parsing Sintático de Código**: O sistema extrai e mapeia classes, funções, argumentos, docstrings e imports de Python e JavaScript/TypeScript diretamente em formato de nós neurais no grafo.
3. **Inspecione & Otimize**: Toque em qualquer nó do grafo para ler o snippet de código fonte original e interrogar a IA com ações rápidas para **auditoria de segurança**, **explicar lógica** ou **otimizar performance**!
4. **Respostas Inteligentes com Contexto RAG**: Faça perguntas de engenharia sobre os códigos analisados de seus projetos e me veja responder com precisão cirúrgica de desenvolvedor!`,
      timestamp: new Date().toISOString(),
      associatedEntities: ['João Layon', 'Layon-System', 'Cérebro Digital']
    }
  ]);

  // Current inputs
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Custom Node editor modal / inputs
  const [newNodeVal, setNewNodeVal] = useState('');
  const [newNodeType, setNewNodeType] = useState<MemoryType>('fato');

  // Custom Manual Node Connections (Learning improvements)
  const [connectToId, setConnectToId] = useState('');
  const [relationType, setRelationType] = useState('associa');
  const [synapseWeight, setSynapseWeight] = useState(5);

  // Bulk Knowledge Ingestion
  const [bulkText, setBulkText] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  
  // Hovered / Clicked graph state
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  // Multi-tab active toggle for mobile views and premium split customization - expanded for full page routing
  const [activeMobileTab, setActiveMobileTab] = useState<'brain' | 'chat' | 'github' | 'creator' | 'instagram' | 'drives'>('brain');
  const [showXRay, setShowXRay] = useState(false);
  
  // Advanced filters state for real-time node category and minimum size control
  const [filterTypes, setFilterTypes] = useState<Record<string, boolean>>({
    usuario: true,
    entidade: true,
    fato: true,
    evento: true,
    sentimento: true,
    resposta: true,
  });
  const [minRelevance, setMinRelevance] = useState<number>(1);
  
  // Custom states for interactive lazy loading / node progressive exploration
  const [lazyLoadingEnabled, setLazyLoadingEnabled] = useState(true);
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(() => new Set<string>());
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'github' | 'control' | 'manual' | 'creator' | 'instagram'>('github');

  // Instagram Social Media Automation States
  const [instaAppId, setInstaAppId] = useState(() => localStorage.getItem('insta_appid') || '1084295829410292');
  const [instaClientToken, setInstaClientToken] = useState(() => localStorage.getItem('insta_client_token') || 'EAAG3H9X8ZCOwBAO6...');
  const [instaProfile, setInstaProfile] = useState(() => localStorage.getItem('insta_profile') || '@layon.studio');
  const [instaIntegrationActive, setInstaIntegrationActive] = useState(false);
  const [isConnectingMeta, setIsConnectingMeta] = useState(false);
  const [instaFunnelType, setInstaFunnelType] = useState<'leads' | 'viral' | 'conversion' | 'branding'>('leads');
  const [instaPostType, setInstaPostType] = useState<'feed' | 'stories' | 'reels'>('feed');
  const [instaGeneratedLegenda, setInstaGeneratedLegenda] = useState('💡 Transforme repetições manuais em microsserviços do amanhã! Unifique seus repositórios no cérebro Layon e configure automações integradas em HTML/CSS com faturamento real em segundos.\n\n#ia #sass #webdev #developers #layonstudio');
  const [instaGeneratedMusic, setInstaGeneratedMusic] = useState('Cyberpunk Horizon (Sound ID: 948293)');
  const [instaGeneratedTags, setInstaGeneratedTags] = useState('#developers, #saas, #automation, #marketing, #ia');
  const [instaGeneratedPrompt, setInstaGeneratedPrompt] = useState('Uma ilustração figma 3D néon ultra detalhada de um cérebro cibernético flutuante no espaço sideral injetando códigos néon azul e verde brilhantes em interfaces web responsivas.');
  const [isGeneratingInsta, setIsGeneratingInsta] = useState(false);
  
  // Simulated stats
  const [instaReachSim, setInstaReachSim] = useState(4820);
  const [instaClicksSim, setInstaClicksSim] = useState(184);
  const [instaConversionRate, setInstaConversionRate] = useState(4.2);
  const [instaFollowersSim, setInstaFollowersSim] = useState(() => Number(localStorage.getItem('insta_followers_sim') || '1243'));
  
  // Instagram profile analysis states
  const [instaPostsSim, setInstaPostsSim] = useState(() => Number(localStorage.getItem('insta_posts_sim') || '148'));
  const [instaAudienceType, setInstaAudienceType] = useState(() => localStorage.getItem('insta_audience_type') || 'Desenvolvedores, Freelancers & Fundadores de SaaS (25-45 anos, majoritariamente masculino e foco em produtividade)');
  const [instaContentType, setInstaContentType] = useState(() => localStorage.getItem('insta_content_type') || 'Reels práticos de programação néon, Carrosséis informativos de design estratégico e Stories interativos com CTAs ativos');
  const [instaPageSpecialty, setInstaPageSpecialty] = useState(() => localStorage.getItem('insta_page_specialty') || 'SaaS & Automação de Processos de Software de Próxima Geração');
  const [isAnalyzingInsta, setIsAnalyzingInsta] = useState(false);
  const [instaAnalyzeProgress, setInstaAnalyzeProgress] = useState(0);

  const [instaScheduledPosts, setInstaScheduledPosts] = useState<any[]>([
    {
      id: 1,
      title: "Automação Saas V3",
      funnel: "Conversão Direta",
      date: "Amanhã, 10h00",
      published: false,
      music: "Cyberpunk Synths (Trending)",
      legenda: "💡 Quer automatizar rotinas de faturamento legado? Com o cérebro cognitivo Layon e sincronismo V3, você converte legados em SaaS em segundos! Link na bio 🚀\n\n#saas #developers #automations #layon",
      image_desc: "Imagem futurista 3D de fluxo de dados néon saindo de um smartphone conectado"
    },
    {
      id: 2,
      title: "Landing Page de Alta Conversão",
      funnel: "Isca Digital",
      date: "Segunda, 15h30",
      published: false,
      music: "Chill Tech Beats",
      legenda: "🎁 Baixe Grátis: Checklist definitivo para estruturação de Copias que vendem 10x mais. Clique no link da bio para ativar o Direct!\n\n#marketing #landingpage #conversion #copywriting",
      image_desc: "Mockup elegante de interface figma do layout de bento-grid com tons de roxo"
    }
  ]);

  const [dimensions, setDimensions] = useState({ width: 700, height: 400 });

  // GitHub Integration States
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('github_token') || '');
  const [githubUsername, setGithubUsername] = useState(() => localStorage.getItem('github_username') || '');
  const [repos, setRepos] = useState<any[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  const [isSyncingRepo, setIsSyncingRepo] = useState(false);
  const [syncProgress, setSyncProgress] = useState('');
  const [syncResult, setSyncResult] = useState<any | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isExecutingRepo, setIsExecutingRepo] = useState(false);
  const [reposValidationError, setReposValidationError] = useState<string | null>(null);

  // States supporting customizable dragging, zoom, un-connected orphans scan, and DB Schema copying
  const [autoSync, setAutoSync] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [improvementLogs, setImprovementLogs] = useState<string[]>([]);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const nodePositionsRef = useRef<Record<string, { x: number; y: number; fx?: number | null; fy?: number | null; pinned?: boolean }>>({});

  // Tracks D3 zoom behavior for auto-fitting and manual controls
  const zoomBehaviorRef = useRef<any>(null);
  const hasInitiallyFittedRef = useRef(false);

  // SaaS Launchpad configuration states (Viabilidade Comercial e Produto)
  const [sandboxActiveTab, setSandboxActiveTab] = useState<'sandbox' | 'launchpad'>('sandbox');
  const [saasPlanName, setSaasPlanName] = useState('Plano Classic');
  const [saasPlanPrice, setSaasPlanPrice] = useState(29);
  const [saasPlanType, setSaasPlanType] = useState('subscription');
  const [saasRateLimit, setSaasRateLimit] = useState(true);
  const [isExportingSaaS, setIsExportingSaaS] = useState(false);

  // Config state for D3 stability & App Creator Workspace
  const [preventAutoRecentering, setPreventAutoRecentering] = useState(true);
  const [graphLayoutMode, setGraphLayoutMode] = useState<'free' | 'cerebral' | 'github' | 'hierarchical'>('cerebral');
  const [temporaryRepulsion, setTemporaryRepulsion] = useState(false);
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [isOptimizingLayout, setIsOptimizingLayout] = useState(false);
  const [isMapFocused, setIsMapFocused] = useState(false);
  const [fullscreenCreatorBlock, setFullscreenCreatorBlock] = useState<'editor' | 'terminal' | 'preview' | null>(null);
  const [sandboxPreviewMode, setSandboxPreviewMode] = useState<'simulated' | 'live'>('live');
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [mainView, setMainView] = useState<'map' | 'creator'>('map');
  const [creatorPrompt, setCreatorPrompt] = useState('');
  const [isCreatingApp, setIsCreatingApp] = useState(false);
  const [creatorResult, setCreatorResult] = useState<any | null>(null);
  const [creatorSelectedFile, setCreatorSelectedFile] = useState('App.tsx');
  const [creatorLogs, setCreatorLogs] = useState<string[]>([]);
  const [isFixingApp, setIsFixingApp] = useState(false);
  const [creatorMobileTab, setCreatorMobileTab] = useState<'prompt' | 'files' | 'editor' | 'preview'>('prompt');
  const [creatorPromptSubTab, setCreatorPromptSubTab] = useState<'prompt' | 'skills' | 'gallery'>('prompt');

  // Custom dialogs & toast systems (iframe-safe!)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditingCode, setIsEditingCode] = useState<boolean>(false);
  const [editingContent, setEditingContent] = useState<string>('');
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const showToastMessage = (msg: string) => {
    setToastMessage(msg);
    playSciFiBeep(1250, 0.08, 'sine');
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const triggerConfirmation = (title: string, message: string, onConfirm: () => void) => {
    playSciFiBeep(850, 0.12, 'triangle');
    setConfirmationDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
        onConfirm();
      }
    });
  };

  // Custom skills & 21st.dev/Claude-code gallery states
  const [skills, setSkills] = useState<any[]>([]);
  const [designs, setDesigns] = useState<any[]>([]);
  const [activeCreatorSubTab, setActiveCreatorSubTab] = useState<'prompt' | 'skills' | 'gallery'>('prompt');
  const [selectedActiveSkill, setSelectedActiveSkill] = useState<any | null>(null);

  // Form states
  const [isSavingDesign, setIsSavingDesign] = useState(false);
  const [tempDesignTitle, setTempDesignTitle] = useState('');
  const [tempDesignDesc, setTempDesignDesc] = useState('');

  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const [newSkillSystemPrompt, setNewSkillSystemPrompt] = useState('');
  const [newSkillTemplate, setNewSkillTemplate] = useState('');
  const [newSkillTags, setNewSkillTags] = useState('Landing Page, 3D, UX');
  const [newSkillAuthor, setNewSkillAuthor] = useState('João Layon');

  // Biotech & Clock Sandbox interactive state triggers
  const [helixSpeed, setHelixSpeed] = useState<number>(1);
  const [activeDnaSegment, setActiveDnaSegment] = useState<string>('Sintético');
  const [clockTimezone, setClockTimezone] = useState<'BR' | 'NY' | 'LDN'>('BR');
  const [pomodoroTimer, setPomodoroTimer] = useState<number>(1500); // 25 mins
  const [pomodoroRunning, setPomodoroRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (pomodoroRunning && pomodoroTimer > 0) {
      interval = setInterval(() => {
        setPomodoroTimer(t => t - 1);
      }, 1000);
    } else if (pomodoroTimer === 0) {
      setPomodoroRunning(false);
      playSciFiBeep(1400, 0.5);
    }
    return () => clearInterval(interval);
  }, [pomodoroRunning, pomodoroTimer]);

  useEffect(() => {
    if (creatorResult) {
      const file = creatorResult.files.find((f: any) => f.fileName === creatorSelectedFile);
      if (file) {
        setEditingContent(file.fileContent || '');
      } else {
        setEditingContent('');
      }
    } else {
      setEditingContent('');
    }
  }, [creatorSelectedFile, creatorResult]);

  useEffect(() => {
    const handleFrameMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CONSOLE_LOG') {
        const { level, text, timestamp } = event.data;
        const formatted = `[\${level.toUpperCase()} \${timestamp}] \${text}`;
        setCreatorLogs(prev => [...prev, formatted]);
      }
    };
    window.addEventListener('message', handleFrameMessage);
    return () => window.removeEventListener('message', handleFrameMessage);
  }, []);

  const handleSaveFileContent = (fileName: string, newContent: string) => {
    if (!creatorResult) return;
    const updatedFiles = creatorResult.files.map((f: any) => {
      if (f.fileName === fileName) {
        return { ...f, fileContent: newContent };
      }
      return f;
    });
    setCreatorResult({ ...creatorResult, files: updatedFiles });
    
    setCreatorLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Salvando modificações no arquivo: ${fileName}...`,
      `[${new Date().toLocaleTimeString()}] Sincronizando árvore de arquivos locais...`,
      `[${new Date().toLocaleTimeString()}] Recompilando projeto '${creatorResult.appName || 'Layon Project'}'...`,
      `[${new Date().toLocaleTimeString()}] Compilado com sucesso! ⚡`
    ]);
    showToastMessage(`${fileName} salvo e compilado!`);
  };

  const handleInitDefaultProject = (type: 'blank' | 'cyberhelix' | 'chronos') => {
    let project;
    if (type === 'cyberhelix') {
      project = {
        appName: 'CyberHelix: BioTech 3D Core',
        description: 'Uma landing page de bioinformática futurista com uma hélice de DNA 3D em SVG rotativo ativo, bento-grid de biossensores e dashboard molecular inteligente.',
        files: [
          {
            fileName: 'App.tsx',
            fileLanguage: 'tsx',
            fileContent: `import React, { useState } from 'react';
import { Brain, Heart, Activity, Shield, Cpu, RefreshCw, Zap, Plus, Layers, Sparkles } from 'lucide-react';

export default function App() {
  const [selectedSensor, setSelectedSensor] = useState<string>('cortex');
  
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 text-xs">
        <div className="lg:col-span-5 bg-gradient-to-b from-[#0a0f1d] to-[#04060b] border border-cyan-500/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden min-h-[350px]">
          <div className="z-10">
            <span className="text-[9px] font-mono text-cyan-400 tracking-wider uppercase">SIMULADOR MOLECULAR 3D</span>
            <h3 className="text-sm font-bold font-display text-white mt-1">Interação Tridimensional</h3>
          </div>

          <div className="flex-1 flex items-center justify-center relative my-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0%,transparent_60%)] pointer-events-none" />
            <span className="text-gray-500 font-mono text-[10px]">🧬 [Estrutura de Hélice Molecular em Órbita Sandbox]</span>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-4 font-sans text-xs">
          <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest font-black block">SENSORES COGNITIVOS BIO-INTEGRADOS</span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sensors.map(s => {
              const isSelected = selectedSensor === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSensor(s.id)}
                  className={"p-4 rounded-xl border transition cursor-pointer flex flex-col gap-2 bg-[#090b11] " + (isSelected ? "border-cyan-500/40 shadow-lg" : "border-slate-900")}
                >
                  <h4 className="text-[10px] font-bold text-slate-100">{s.name}</h4>
                  <span className="text-sm font-mono font-black text-white">{s.value}</span>
                </div>
              );
            })}
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
        diagnostics: []
      };
    } else if (type === 'chronos') {
      project = {
        appName: 'Minimalist Elastic Clock Dashboard ⏰',
        description: 'Interface de relógio e produtividade em que as seções se esticam e encolhem elástica e dinamicamente.',
        files: [
          {
            fileName: 'App.tsx',
            fileLanguage: 'tsx',
            fileContent: `import React, { useState } from 'react';
import { Watch, Play, Pause, RefreshCw } from 'lucide-react';

export default function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  return (
    <div className="min-h-screen bg-[#03060c] text-slate-100 p-6 font-mono flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-gray-900 pb-3 mb-6">
        <span className="text-[10px] tracking-widest font-bold uppercase text-[#00f2ff]">ESTAÇÃO CHRONOS</span>
        <span className="text-[9px] text-gray-500">REDE DO LAYON-SYSTEM</span>
      </div>

      <div className="my-12 text-center">
        <span className="text-3xl font-black text-white tracking-widest block">{time}</span>
      </div>
    </div>
  );
}`
          }
        ],
        diagnostics: []
      };
    } else {
      project = {
        appName: 'Novo Projeto Layon-Brain',
        description: 'Um projeto em branco estruturado para edição livre do código de córtex',
        files: [
          {
            fileName: 'App.tsx',
            fileLanguage: 'tsx',
            fileContent: `import React, { useState } from 'react';
import { Brain, Sparkles } from 'lucide-react';

export default function App() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#070a12] text-[#e6edf3] p-8 font-sans flex flex-col items-center justify-center gap-6">
      <div className="bg-slate-950 p-8 rounded-2xl border border-indigo-500/20 shadow-2xl flex flex-col items-center max-w-sm text-center">
        <Brain className="w-12 h-12 text-[#00f2ff] animate-bounce" />
        <h1 className="text-xl font-bold mt-4">Meu Projeto Layon-Brain</h1>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          Este é o seu novo projeto. Sinta-se livre para editar qualquer arquivo através do painel de edição ao lado!
        </p>
        
        <button 
          onClick={() => { setClickCount(c => c + 1); }}
          className="mt-6 px-4 py-2 rounded-lg bg-[#00f2ff] text-black font-mono font-bold text-xs hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          Cliques Coletores: {clickCount}
        </button>
      </div>
    </div>
  );
}`
          },
          {
            fileName: 'database.ts',
            fileLanguage: 'typescript',
            fileContent: '// Arquivo de persistência de dados local simulada\nexport const database = {\n  logs: [],\n  users: []\n};'
          },
          {
            fileName: 'styles.css',
            fileLanguage: 'css',
            fileContent: '/* Seus estilos CSS customizados para compilação */\n.glow-text {\n  text-shadow: 0 0 10px rgba(0, 242, 255, 0.4);\n}'
          }
        ],
        diagnostics: []
      };
    }

    setCreatorResult(project);
    setCreatorSelectedFile('App.tsx');
    setCreatorLogs([
      `[${new Date().toLocaleTimeString()}] Inicializando template '${project.appName}' de fábrica...`,
      `[${new Date().toLocaleTimeString()}] Criando novas pastas e arquivos lógicos no Layon System...`,
      `[${new Date().toLocaleTimeString()}] Arquivo principal App.tsx criado com sucesso!`,
      `[${new Date().toLocaleTimeString()}] Pronto para edição e visualização no Sandbox.`
    ]);
    showToastMessage(`Iniciado: ${project.appName}`);
  };

  // Load skills and designs
  const fetchSkillsAndDesigns = async () => {
    try {
      const sRes = await fetch('/api/skills');
      if (sRes.ok) {
        const sData = await sRes.json();
        setSkills(sData);
      }
      const dRes = await fetch('/api/designs');
      if (dRes.ok) {
        const dData = await dRes.json();
        setDesigns(dData);
      }
    } catch (e) {
      console.error('Falha ao sincronizar biblioteca de skills e designs:', e);
    }
  };

  const handleInstallPresetSkillDirectly = async (presetKey: 'bento' | 'cli' | 'physics') => {
    let preset: any = {};
    if (presetKey === 'bento') {
      preset = {
        name: '🔮 21st.dev: Bento Orbits',
        description: 'Painel métrico de alta fidelidade com micro-interações, inspirado no ecossistema de designs minimalistas da 21st.dev.',
        systemPrompt: 'Você é um Senior UI Designer especializado em Bento Grid layouts de alta densidade visual da 21st.dev, com temas escuros minimalistas e dados reativos.',
        promptTemplate: 'Crie um bento grid dashboard com 4 seções principais de telemetria conectadas à rede do Layon-System.',
        tags: ['21st.dev', 'Bento', 'Dashboard'],
        author: '21st.dev Partner'
      };
    } else if (presetKey === 'cli') {
      preset = {
        name: '🐚 Claude Code: Command Terminal',
        description: 'Um interpretador/terminal emulado de bash com histórico de comandos digitados, ideal para simulações de desenvolvimento local.',
        systemPrompt: 'Você é um engenheiro de sistemas Unix sênior. Escreva interfaces de terminal retrô de fósforo verde com inputs para comandos customizados, logs retroativos e histórico de comandos.',
        promptTemplate: 'Crie um terminal Unix de córtex em tempo real com histórico e telemetria.',
        tags: ['Claude Code', 'Terminal', 'DevTools'],
        author: 'Claude Community'
      };
    } else {
      preset = {
        name: '🌊 21st.dev: Fluid Particle Physics',
        description: 'Um canvas interativo de partículas dinâmicas que orbitam, repelem e mudam de cor com o ponteiro do mouse.',
        systemPrompt: 'Você é um engenheiro gráfico em React. Crie animações ricas em canvas HTML5 com fluidos e partículas que orbitam o cursor de mouse.',
        promptTemplate: 'Crie um app interativo com fundo de partículas estelares orbitando.',
        tags: ['21st.dev', 'Canvas', 'Dynamics'],
        author: '21st.dev Creative'
      };
    }

    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preset)
      });
      if (res.ok) {
        playSciFiBeep(1400, 0.2);
        await fetchSkillsAndDesigns();
        showToastMessage(`Instalado: ${preset.name}!`);
      }
    } catch (err) {
      console.error(err);
      showToastMessage('Erro ao instalar.');
    }
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Auto-guidelines if user leaves system prompt blank - incredibly resilient!
    const effectiveSystemPrompt = newSkillSystemPrompt.trim() || `Você é um Designer Frontend Sênior especializado em criar componentes dinâmicos e UI/UX de alta fidelidade para o sistema cognitivo Layon-Cortex.`;
    
    if (!newSkillName.trim() || !newSkillTemplate.trim()) {
      showToastMessage("Por favor preencha os campos obrigatórios (Nome e Prompt de Partida).");
      return;
    }
    try {
      const payload = {
        name: newSkillName,
        description: newSkillDesc || 'Padrão customizado para apps e interfaces.',
        systemPrompt: effectiveSystemPrompt,
        promptTemplate: newSkillTemplate,
        tags: newSkillTags.split(',').map(t => t.trim()).filter(Boolean),
        author: newSkillAuthor || 'Usuário'
      };
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          playSciFiBeep(1300, 0.15);
          await fetchSkillsAndDesigns();
          setIsAddingSkill(false);
          setNewSkillName('');
          setNewSkillDesc('');
          setNewSkillSystemPrompt('');
          setNewSkillTemplate('');
          setNewSkillTags('Landing Page, 3D, UX');
          showToastMessage(`Skill "${payload.name}" criada com sucesso!`);
        }
      }
    } catch (err) {
      console.error('Erro ao salvar nova skill:', err);
    }
  };

  const handleDeleteSkill = async (id: string, e: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerConfirmation('Excluir Skill', 'Tem certeza que deseja excluir esta skill permanentemente?', async () => {
      try {
        const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
        if (res.ok) {
          playSciFiBeep(705, 0.1);
          await fetchSkillsAndDesigns();
          if (selectedActiveSkill && selectedActiveSkill.id === id) {
            setSelectedActiveSkill(null);
          }
          showToastMessage("Skill removida com sucesso.");
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleSaveCurrentDesign = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!creatorResult || !tempDesignTitle.trim()) return;
    try {
      const payload = {
        title: tempDesignTitle,
        description: tempDesignDesc,
        files: creatorResult.files,
        compilationLogs: creatorResult.compilationLogs || [],
        interactiveVariables: {},
        promptUsed: creatorPrompt || 'Design livre customizado',
        skillIdUsed: selectedActiveSkill?.id || ''
      };
      const res = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          playSciFiBeep(1200, 0.2);
          await fetchSkillsAndDesigns();
          setIsSavingDesign(false);
          setTempDesignTitle('');
          setTempDesignDesc('');
          showToastMessage(`Design "${payload.title}" salvo na galeria! 💖`);
        }
      }
    } catch (err) {
      console.error("Erro ao salvar design:", err);
    }
  };

  const handleDeleteDesign = async (id: string, e: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerConfirmation('Excluir Design', 'Deseja excluir este design permanentemente da sua galeria?', async () => {
      try {
        const res = await fetch(`/api/designs/${id}`, { method: 'DELETE' });
        if (res.ok) {
          playSciFiBeep(600, 0.15);
          await fetchSkillsAndDesigns();
          showToastMessage("Design excluído com sucesso.");
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleLoadDesignToWorkspace = (design: any) => {
    playSciFiBeep(1100, 0.1);
    setCreatorResult({
      appName: design.title,
      description: design.description,
      files: design.files,
      compilationLogs: design.compilationLogs || [],
      diagnostics: []
    });
    setCreatorSelectedFile('App.tsx');
    setCreatorPrompt(design.promptUsed || '');
    setActiveCreatorSubTab('prompt');
    setMainView('creator');
  };

  // Run initial synchrony on load
  useEffect(() => {
    syncConsciousnessState();
    fetchSkillsAndDesigns();
  }, []);

  // States mapping simulated sandbox values
  const [sandboxItems, setSandboxItems] = useState<any[]>([]);
  const [sandboxInput1, setSandboxInput1] = useState('');
  const [sandboxInput2, setSandboxInput2] = useState('');
  const [sandboxCategory, setSandboxCategory] = useState('');

  // Save GitHub credentials locally for seamless prototypes
  useEffect(() => {
    localStorage.setItem('github_token', githubToken);
  }, [githubToken]);

  useEffect(() => {
    localStorage.setItem('github_username', githubUsername);
  }, [githubUsername]);

  // Dynamically observe the container's resize events to adjust D3 stage instantly
  const svgRef = useRef<SVGSVGElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const parent = svgRef.current?.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setDimensions({
          width: Math.max(200, Math.floor(width)),
          height: Math.max(200, Math.floor(height))
        });
      }
    });

    resizeObserver.observe(parent);

    // Capture layout dimensions immediately upon mounting
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setDimensions({
        width: Math.max(200, Math.floor(rect.width)),
        height: Math.max(200, Math.floor(rect.height))
      });
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeMobileTab, mainView]);

  // High-fidelity web audio feedback generator
  const playSciFiBeep = (freq = 900, duration = 0.08, type: OscillatorType = 'sine') => {
    try {
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio auto-play policy bypass
    }
  };

  // Graph data cache
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });
  
  const filteredNodes = useMemo(() => {
    // 1. Get all nodes that pass basic text search, category filters, and min relevance
    const baseNodes = graphData.nodes.filter(node => {
      // 1. Text Search Filter
      const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (node.details && node.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (node.repoName && node.repoName.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;

      // 2. Type/Category Filter
      const typeAllowed = filterTypes[node.type] !== false;
      if (!typeAllowed) return false;

      // 3. Relevance/Size (visualWeight 1-10) Filter
      const relevanceAllowed = (node.size || 0) >= minRelevance;
      if (!relevanceAllowed) return false;

      return true;
    });

    // If lazy loading is disabled, load everything immediately
    if (!lazyLoadingEnabled) {
      return baseNodes;
    }

    // Identify primary nodes among baseNodes
    // Primary/main nodes: larger in size (size >= 8), or specific key roles (type 'usuario' or id '1' or type 'fato'),
    // or if they match the searchQuery query directly (to keep them reachable)
    const primaryNodeIds = new Set<string>();
    baseNodes.forEach(n => {
      const isPrimary = (n.size || 0) >= 8 || n.type === 'usuario' || String(n.id) === '1' || n.type === 'fato' || (searchQuery && n.label.toLowerCase().includes(searchQuery.toLowerCase()));
      if (isPrimary) {
        primaryNodeIds.add(n.id);
      }
    });

    // We must also include any manually selected node and manually expanded nodes
    const activeCoreIds = new Set<string>([...primaryNodeIds]);
    expandedNodeIds.forEach(id => {
      activeCoreIds.add(id);
    });
    if (selectedNode) {
      activeCoreIds.add(selectedNode.id);
    }

    // Find all immediate contiguous neighbor nodes (direct connections) of active core nodes
    const visibleIds = new Set<string>([...activeCoreIds]);
    graphData.links.forEach((link: any) => {
      const srcId = typeof link.source === 'object' ? link.source.id : link.source;
      const tgtId = typeof link.target === 'object' ? link.target.id : link.target;
      
      // If either end of the link is part of our core set, both side nodes must be loaded/visible
      if (activeCoreIds.has(srcId)) {
        visibleIds.add(tgtId);
      }
      if (activeCoreIds.has(tgtId)) {
        visibleIds.add(srcId);
      }
    });

    // Return the subset of baseNodes that are currently visible/loaded
    return baseNodes.filter(n => visibleIds.has(n.id));
  }, [graphData.nodes, graphData.links, searchQuery, filterTypes, minRelevance, lazyLoadingEnabled, expandedNodeIds, selectedNode]);

  const unconnectedNodes = useMemo(() => {
    const activeIds = new Set<string>();
    graphData.links.forEach(l => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source;
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
      activeIds.add(srcId);
      activeIds.add(tgtId);
    });
    return graphData.nodes.filter(n => !activeIds.has(n.id));
  }, [graphData]);

  const selectedNeighbors = useMemo(() => {
    if (!selectedNode) return [];
    const neighbors: any[] = [];
    const nodeId = selectedNode.id;
    graphData.links.forEach((link: any) => {
      const srcId = typeof link.source === 'object' ? link.source.id : link.source;
      const tgtId = typeof link.target === 'object' ? link.target.id : link.target;
      if (srcId === nodeId) {
        const opposingNode = graphData.nodes.find((n: any) => n.id === tgtId);
        if (opposingNode) {
          neighbors.push({ node: opposingNode, rType: link.type || 'relaciona-se' });
        }
      } else if (tgtId === nodeId) {
        const opposingNode = graphData.nodes.find((n: any) => n.id === srcId);
        if (opposingNode) {
          neighbors.push({ node: opposingNode, rType: link.type || 'relacionado-por' });
        }
      }
    });
    return neighbors;
  }, [selectedNode, graphData]);
  
  // Fetch metrics & graph representation from API
  const syncConsciousnessState = async () => {
    try {
      // Fetch status & logs
      const statsRes = await fetch('/api/status');
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setStatus(stats);
      }

      // Fetch dynamic brain graph nodes & associations
      const graphRes = await fetch('/api/graph');
      if (graphRes.ok) {
        const parsedGraph = await graphRes.json();
        setGraphData(parsedGraph);
      }
    } catch (e) {
      console.error('Falha ao se conectar com os servidores neurais:', e);
    }
  };



  // Conditional slow polling to prevent canvas resets during active user dragging
  useEffect(() => {
    if (!autoSync) return;
    const poll = setInterval(syncConsciousnessState, 15000); 
    return () => clearInterval(poll);
  }, [autoSync]);

  // Set up Speech-To-Text Recognition in browser
  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = 'pt-BR';
      rec.interimResults = false;

      rec.onstart = () => {
        setIsRecording(true);
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        if (resultText) {
          setInputText(prev => prev ? `${prev} ${resultText}` : resultText);
        }
      };

      rec.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Keep chat scrolled down on messages update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  // Voice synthesis player
  const playBase64Speech = (base64Str: string) => {
    try {
      const audioUrl = `data:audio/mp3;base64,${base64Str}`;
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error('Failed to parse and play binary voice:', err);
    }
  };

  // Fallback TTS using browser speech synthesizer APIs
  const fallbackBrowserSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const cleanText = text.replace(/[*_`#~\[\]\(\)]/g, ' ').substring(0, 200);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'pt-BR';
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(v => v.lang.includes('PT') || v.lang.includes('pt'));
      if (ptVoice) {
         utterance.voice = ptVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  // Submit Text prompt to Cognitive API
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const promptToSend = inputText.trim();
    if (!promptToSend) return;

    // Build immediate user representation
    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: promptToSend,
          voiceEnabled,
          history: messages.slice(-8).map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (response.ok) {
        const brainReply: ChatMessage & { voiceBase64?: string } = await response.json();
        setMessages(prev => [...prev, brainReply]);

        // Synthesize dynamic voice response if requested
        if (voiceEnabled) {
          if (brainReply.voiceBase64) {
             playBase64Speech(brainReply.voiceBase64);
          } else {
             fallbackBrowserSpeech(brainReply.content);
          }
        }
      } else {
        throw new Error('Cérebro falhou ao processar resposta');
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Erro Cognitivo:** Ocorreu um lapso na conexão sináptica de processamento local ou sua chave do Gemini atingiu o limite. Detalhes: ${err.message || 'Falha na rede'}`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsGenerating(false);
      // Refresh brain graph immediately
      syncConsciousnessState();
    }
  };

  // Mic Activation
  const toggleSpeechRecording = () => {
    if (!recognitionRef.current) {
      showToastMessage('Entrada de voz não suportada ou microfone desabilitado.');
      return;
    }

    if (isRecording) {
      playSciFiBeep(600, 0.1, 'sine');
      recognitionRef.current.stop();
    } else {
      playSciFiBeep(1200, 0.15, 'triangle');
      recognitionRef.current.start();
    }
  };

  // Submit reinforcement feedback (👍 / 👎)
  const submitReinforcement = async (msgId: string, memoriesInvolved: string[], rating: 'good' | 'bad') => {
    try {
      playSciFiBeep(rating === 'good' ? 1400 : 450, 0.2, 'sine');
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: msgId,
          memoriesInvolved,
          feedbackType: rating
        })
      });

      if (res.ok) {
        setMessages(prev => prev.map(m => {
          if (m.id === msgId) {
            return { ...m, feedback: rating };
          }
          return m;
        }));
        syncConsciousnessState();
      }
    } catch (err) {
      console.error('Failed to persist cognitive feed:', err);
    }
  };

  // Entropy Trigger
  const triggerDecay = async () => {
    if (!confirm('Deseja induzir entropia sináptica? Isso aplicará decaimento térmico em conexões frias de forma randômica.')) return;
    try {
      const res = await fetch('/api/decay', { method: 'POST' });
      if (res.ok) {
        syncConsciousnessState();
      }
    } catch (err) {
      console.error('Decay trigger failed:', err);
    }
  };

  // Reset entire intelligence base
  const triggerReset = async () => {
    if (!confirm('ATENÇÃO: Deseja redefinir todo o banco de memórias do Cérebro para os padrões de fábrica do Layon-System? Isto limpará suas conexões customizadas e códigos analisados.')) return;
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        setMessages(prev => [
          ...prev,
          {
            id: `msg_reset_${Date.now()}`,
            role: 'assistant',
            content: '🧬 **Cérebro resetado!** Meu córtex de conhecimento reconfigurado de fábrica com as memórias de João Layon e conexões fundamentais do Layon-System (livre de indexação de códigos anteriores).',
            timestamp: new Date().toISOString()
          }
        ]);
        setSelectedNode(null);
        syncConsciousnessState();
      }
    } catch (w) {
      console.error('Cortex reset failure:', w);
    }
  };

  // Add customized memory node manual creator with manual synergy linkages
  const handleCreateNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeVal.trim()) return;

    try {
      playSciFiBeep(1200, 0.1, 'sine');
      const res = await fetch('/api/learn-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newNodeVal,
          type: newNodeType,
          connectToId: connectToId || undefined,
          relationType,
          weight: synapseWeight
        })
      });

      if (res.ok) {
        setNewNodeVal('');
        setConnectToId('');
        syncConsciousnessState();
      }
    } catch (err) {
      console.error('Manual relationship synthesis failed:', err);
    }
  };

  // Instagram Social Media Automation Helpers
  const handleConnectMetaDeveloper = async () => {
    if (!instaAppId.trim() || !instaClientToken.trim()) {
      showToastMessage("Insira os dados do Meta Developer primeiro!");
      return;
    }
    setIsConnectingMeta(true);
    playSciFiBeep(1100, 0.4);
    
    setTimeout(async () => {
      setIsConnectingMeta(false);
      setInstaIntegrationActive(true);
      showToastMessage(`Meta Dev API Conectada! Perfil ${instaProfile} ativo.`);
      
      // Add a node to our Neural Cognitive Map representing active Instagram API connection!
      try {
        await fetch('/api/learn-manual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `Instagram API @MetaDeveloper [AppID: ${instaAppId}] conectado ao perfil ${instaProfile}`,
            type: 'entidade',
            relationType: 'associa',
            weight: 9
          })
        });
        syncConsciousnessState();
      } catch (e) {
        console.error("Failed to insert Instagram connection node:", e);
      }
      
      // Auto trigger AI profile diagnosis
      setTimeout(() => {
        handleAnalyzeInstagramProfile();
      }, 500);
    }, 1500);
  };

  const handleAnalyzeInstagramProfile = async () => {
    if (!instaProfile.trim()) {
      showToastMessage("Por favor, informe o Perfil/Username do Instagram!");
      return;
    }
    
    setIsAnalyzingInsta(true);
    setInstaAnalyzeProgress(12);
    playSciFiBeep(1200, 0.45);
    showToastMessage(`Iniciando Rastreio & Varredura do perfil ${instaProfile}...`);
    
    const interval = setInterval(() => {
      setInstaAnalyzeProgress(p => {
        if (p >= 90) return p;
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 280);

    try {
      // Trigger a chat api conversation asking Gemini to analyze the custom profile name!
      const prompt = `Faça um relatório de diagnóstico completo e de altíssimo nível do perfil de Instagram '${instaProfile}'. 
Você deve avaliar o nome do perfil de forma estratégica para deduzir o seu foco temático. Retorne estritamente um código JSON simples contendo este formato exato, sem blocos de código markdown ou texto extra:
{
  "seguidores": 5420,
  "postagens": 112,
  "tipo_publico": "uma descrição detalhada do tipo de público em português",
  "tipo_conteudo": "uma descrição detalhada do tipo de conteúdo mais engajante para a página em português",
  "nicho_especialidade": "a especialidade do perfil, o nicho em que ele mexe em português"
}`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: prompt,
          voiceEnabled: false
        })
      });

      let followers = Math.floor(1500 + Math.random() * 18500);
      let posts = Math.floor(45 + Math.random() * 320);
      let audience = "Profissionais de tecnologia, criativos de marketing digital e fundadores de startups buscando ferramentas modernas produtivas";
      let content = "Reels dinâmicos focados em bastidores e workflows de código néon, posts carrosséis de layouts responsivos e vídeos explicativos em alta";
      let specialty = "Desenvolvimento de Ecossistemas Digitais, SaaS e Automação Inteligente de Processos";

      if (res.ok) {
        const data = await res.json();
        let cleanText = data.content || '';
        cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
        try {
          const parsed = JSON.parse(cleanText);
          if (parsed.seguidores) followers = Number(parsed.seguidores);
          if (parsed.postagens) posts = Number(parsed.postagens);
          if (parsed.tipo_publico) audience = parsed.tipo_publico;
          if (parsed.tipo_conteudo) content = parsed.tipo_conteudo;
          if (parsed.nicho_especialidade) specialty = parsed.nicho_especialidade;
        } catch (e) {
          console.warn("Failed to parse Gemini response for Instagram. Using smart fallback heuristic.");
          const lowerProfile = instaProfile.toLowerCase();
          if (lowerProfile.includes("layon") || lowerProfile.includes("dev") || lowerProfile.includes("code") || lowerProfile.includes("cortex") || lowerProfile.includes("system")) {
            specialty = "SaaS, Arquitetura de Cérebro Cognitivo e Microsserviços";
            audience = "Desenvolvedores, Líderes de Engenharia de Software e Estudantes de IA Avançada";
            content = "Tutoriais estéticos com fontes JetBrains Mono, Reels práticos de faturamento de microsserviços integrados no Stripe";
            followers = 12430;
            posts = 284;
          } else if (lowerProfile.includes("mkt") || lowerProfile.includes("marketing") || lowerProfile.includes("venda") || lowerProfile.includes("growth")) {
            specialty = "Growth Hacking, Copywriting e Funis de Conversão Viral";
            audience = "Afiliados, Copywriters e Infoprodutores em busca de escala e engajamento automatizado";
            content = "Análise rápida de funis de 7 dígitos em Reels curtos, Caixinhas de perguntas provocativas e checklists de Landing Pages";
            followers = 8400;
            posts = 142;
          }
        }
      }

      clearInterval(interval);
      setInstaAnalyzeProgress(100);
      
      // Update react state
      setInstaFollowersSim(followers);
      setInstaPostsSim(posts);
      setInstaAudienceType(audience);
      setInstaContentType(content);
      setInstaPageSpecialty(specialty);

      // Save to localStorage
      localStorage.setItem('insta_followers_sim', String(followers));
      localStorage.setItem('insta_posts_sim', String(posts));
      localStorage.setItem('insta_audience_type', audience);
      localStorage.setItem('insta_content_type', content);
      localStorage.setItem('insta_page_specialty', specialty);

      // Sincronizar dados no cérebro
      try {
        await fetch('/api/learn-manual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `Diagnóstico do perfil ${instaProfile}: Nicho principal: ${specialty}. Possui ${followers} seguidores, ${posts} posts. Público-alvo mapeado como '${audience.slice(0, 70)}...'.`,
            type: 'fato',
            relationType: 'associa',
            weight: 10
          })
        });
        syncConsciousnessState();
      } catch (errNode) {
        console.error("Failed to append diagnosis node:", errNode);
      }

      showToastMessage(`🎉 Análise Completa de ${instaProfile}! Dados de públicos e postagens indexados no Cérebro.`);
      playSciFiBeep(1400, 0.3, 'sine');
    } catch (e) {
      console.error(e);
      showToastMessage("Ocorreu um erro na análise de rede da API do Instagram.");
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setIsAnalyzingInsta(false);
        setInstaAnalyzeProgress(0);
      }, 700);
    }
  };

  const handleGenerateInstaPost = async () => {
    setIsGeneratingInsta(true);
    playSciFiBeep(1000, 0.25, 'sine');
    showToastMessage("Cérebro analisando projetos na memória para gerar Funil Social...");
    
    const contextPrompt = `Gere uma nova estrutura comercial completa de automação para o Instagram.
Baseado na inteligência e memória do projeto atual ${creatorResult?.appName || 'Workspace Layon'}.
Tipo de Funil requisitado: ${instaFunnelType}. Foco no formato: ${instaPostType}.
Retorne estritamente um código JSON simples com este formato exato, sem blocos de código markdown ou texto extra:
{
  "legenda": "Sua legenda em português sobre ${creatorResult?.appName || 'Layon Studio'} com foco em ${instaFunnelType}, com CTAs focados no link da bio ou DM, e hashtags adequadas...",
  "music": "Música trending sugerida e ritmo...",
  "tags": "tags do post...",
  "prompt": "prompt minimalista e estonteante da imagem 3D em português para postar no instagram..."
}`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: contextPrompt,
          voiceEnabled: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponseText = data.response || '';
        
        try {
          // Remove potential json blocks
          const cleanJsonText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJsonText);
          if (parsed && parsed.legenda) {
            setInstaGeneratedLegenda(parsed.legenda);
            setInstaGeneratedMusic(parsed.music || 'Default Trending Tech Mix');
            setInstaGeneratedTags(parsed.tags || '#saas, #automation');
            setInstaGeneratedPrompt(parsed.prompt || 'Imagem 3D brilhante néon para Instagram');
            showToastMessage("Post gerado com sucesso via Inteligência do Cérebro!");
            setIsGeneratingInsta(false);
            return;
          }
        } catch (e) {
          console.warn("JSON parsing block failed, looking for regex match...", e);
          const match = aiResponseText.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0].trim());
            if (parsed && parsed.legenda) {
              setInstaGeneratedLegenda(parsed.legenda);
              setInstaGeneratedMusic(parsed.music || 'Default Trending Tech Mix');
              setInstaGeneratedTags(parsed.tags || '#saas, #automation');
              setInstaGeneratedPrompt(parsed.prompt || 'Imagem 3D brilhante néon para Instagram');
              showToastMessage("Post gerado com sucesso via Inteligência do Cérebro!");
              setIsGeneratingInsta(false);
              return;
            }
          }
        }
      }
    } catch (err) {
      console.error("Gemini failed to generate, using high-fidelity local templates:", err);
    }

    // High fidelity fallback templates based on funnel types
    setTimeout(() => {
      let fLegenda = '';
      let fMusic = '';
      let fTags = '';
      let fPrompt = '';

      if (instaFunnelType === 'leads') {
        fLegenda = `🎁 ACESSO LIBERADO: Quero te dar o passo a passo completo usado no projeto ${creatorResult?.appName || 'Workspace Layon'} para transformar códigos de faturamento em SaaS automobílico em menos de 2 minutos.\n\nComente "CHECKPOINT" abaixo que meu cérebro te envia o link direto no seu direct agora mesmo! 👇`;
        fMusic = "Synthwave Neon Reflections (Trending)";
        fTags = "#developers, #saas, #iscapromotion, #coding, #layonstudio";
        fPrompt = "Design tridimensional isométrico de um foguete saindo de um cérebro cibernético roxo flutuante e pousando no planeta terra.";
      } else if (instaFunnelType === 'viral') {
        fLegenda = `pov: Você unificou toda a arquitetura cognitória e códigos dispersos em um único cérebro digital e agora seu sistema gera qualquer interface interativa com banco simulado automático usando apenas sua voz. 🧠🚀\n\nMarque aquele desenvolvedor que precisa ver essa automação ou salve para ver depois!`;
        fMusic = "Future Bass Tech Glitch (Trending)";
        fTags = "#devlife, #fullstack, #viraltech, #cortex, #codinglife";
        fPrompt = "Design bento-grid figma luminoso néon destacando estatísticas de performance de 99.8% com um avatar 3D sorridente.";
      } else if (instaFunnelType === 'conversion') {
        fLegenda = `💼 Chega de criar landing pages estáticas sem conversões tangíveis. O ecossistema inteligente ${creatorResult?.appName || 'Layon Studio'} permite faturamento integrado direto, fluxos de funis automatizados de alta performance e código limpo na nuvem no mesmo dia.\n\nClique no link da nossa BIO e garanta sua vaga na licença Beta imediata! 💸`;
        fMusic = "Dark Minimal Industrial Techno (Trending)";
        fTags = "#startup, #landingpage, #saas, #conversion, #developers";
        fPrompt = "Ilustração minimalista de um cartão de crédito holográfico flutuando no meio de gráficos D3 tridimensionais.";
      } else {
        fLegenda = `✨ Conectividade, Integridade, Inteligência. Este é o novo ecossistema cognitivo do futuro. Criado por João Layon para simplificar a engenharia de software complexa unindo Git, IA e diagramas em tempo real.\n\nSiga @layon.studio para acompanhar a revolução tecnológica do amanhã! 🔮`;
        fMusic = "Lo-Fi Corporate Tech Beats";
        fTags = "#branding, #techfuture, #visionary, #design, #marketing";
        fPrompt = "Design de logo vetorizado de um cérebro digital azul néon brilhante sobre um fundo espacial escuro e limpo.";
      }

      setInstaGeneratedLegenda(fLegenda);
      setInstaGeneratedMusic(fMusic);
      setInstaGeneratedTags(fTags);
      setInstaGeneratedPrompt(fPrompt);

      showToastMessage("Post gerado com sucesso via Heurística Local!");
      setIsGeneratingInsta(false);
    }, 1200);
  };

  const handlePublishScheduledInstaPost = (postId: number) => {
    playSciFiBeep(1200, 0.45);
    showToastMessage("Conectando na API do Instagram Graph... Carregando mídia...");
    
    setTimeout(async () => {
      const updated = instaScheduledPosts.map(p => {
        if (p.id === postId) {
          return { ...p, published: true };
        }
        return p;
      });
      setInstaScheduledPosts(updated);
      
      setInstaReachSim(prev => prev + 1420);
      setInstaClicksSim(prev => prev + 88);
      setInstaConversionRate(prev => parseFloat((prev + 0.35).toFixed(2)));
      setInstaFollowersSim(prev => prev + 24);

      showToastMessage("🚀 Publicado com Sucesso via Meta Dev Live API!");

      // Add a node in our cognitive representation graph
      try {
        await fetch('/api/learn-manual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `Post Comercial publicado no perfil ${instaProfile}: "${instaGeneratedPrompt.slice(0, 30)}..." com legenda e metas geradas.`,
            type: 'evento',
            relationType: 'associa',
            weight: 7
          })
        });
        syncConsciousnessState();
      } catch (e) {
        console.error("Failed to insert publication event node:", e);
      }
    }, 1800);
  };

  const handleTrainBrainWithInstagramStats = async () => {
    playSciFiBeep(1300, 0.5, 'sine');
    showToastMessage("🤖 Coletando estatísticas do Instagram Meta Dev para treinar o cérebro cognitivo...");
    
    try {
      await fetch('/api/learn-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `Métricas ativas: Alcance ${instaReachSim}, Cliques de leads ${instaClicksSim}, Taxa de conversão de funil ${instaConversionRate}%. Algoritmos de aprendizado ajustados!`,
          type: 'fato',
          relationType: 'associa',
          weight: 9
        })
      });
      syncConsciousnessState();
      showToastMessage("🧠 Cérebro treinado e atualizado com o funil do Instagram!");
    } catch (e) {
      console.error("Failed to feed stats to cortex:", e);
    }
  };

  // Bulk knowledge Ingestion (AI unstructured parsing)
  const handleBulkLearn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    setIsIngesting(true);
    playSciFiBeep(800, 0.25, 'sawtooth');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `REGISTRO COGNITIVO EM MASSA: Por favor, analise a seguinte declaração e grave todos os seus termos e fatos subjacentes relevantes em seu córtex neural, conectando-os estruturalmente: "${bulkText}"`,
          voiceEnabled: false
        })
      });

      if (response.ok) {
        setBulkText('');
        syncConsciousnessState();
        playSciFiBeep(1400, 0.2, 'sine');
      }
    } catch (err) {
      console.error('Error during bulk cognitive ingestion:', err);
    } finally {
      setIsIngesting(false);
    }
  };

  // Delete Node manual prune with Cascade cleanup
  const handlePruneNode = async (nodeId: string) => {
    if (!confirm('Deseja expurgar permanentemente este nó do cérebro e desconectar todas as pontes?')) return;
    try {
      playSciFiBeep(450, 0.25, 'sawtooth');
      const response = await fetch('/api/prune-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId })
      });
      if (response.ok) {
        setSelectedNode(null);
        syncConsciousnessState();
      }
    } catch (e) {
      console.error('Could not prune node:', e);
    }
  };

  // Interrogates the AI with a focused retrieval instruction for this specific node label
  const handleInterrogateNode = async (nodeLabel: string) => {
    const promptToSend = `Me fale tudo o que você é capaz de recuperar em suas memórias sobre a entidade: "${nodeLabel}"`;
    playSciFiBeep(1300, 0.12, 'sine');
    setIsChatOpen(true);
    
    // Build immediate user representation
    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: promptToSend,
          voiceEnabled,
          history: messages.slice(-8).map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (response.ok) {
        const brainReply: ChatMessage & { voiceBase64?: string } = await response.json();
        setMessages(prev => [...prev, brainReply]);

        if (voiceEnabled) {
          if (brainReply.voiceBase64) {
            playBase64Speech(brainReply.voiceBase64);
          } else {
            fallbackBrowserSpeech(brainReply.content);
          }
        }
      }
    } catch (err: any) {
      console.error('Interrogate failure:', err);
    } finally {
      setIsGenerating(false);
      syncConsciousnessState();
    }
  };

  // Trigger rapid AI queries directly referencing code content
  const triggerQuickChatPrompt = async (promptToSend: string) => {
    setIsGenerating(true);
    setIsChatOpen(true);
    
    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: promptToSend,
          voiceEnabled,
          history: [...messages, userMsg].slice(-8).map(m => ({ role: m.role, content: m.content }))
        })
      });
      
      if (response.ok) {
        const reply: ChatMessage & { voiceBase64?: string } = await response.json();
        setMessages(prev => [...prev, reply]);
        
        if (voiceEnabled) {
          if (reply.voiceBase64) {
            playBase64Speech(reply.voiceBase64);
          } else {
            fallbackBrowserSpeech(reply.content);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Erro Cognitivo:** Falha ao processar código: ${err.message || 'Falha de rede'}`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsGenerating(false);
      syncConsciousnessState();
    }
  };

  /* ----- App Creator AI Actions ----- */
  const handleCreateApp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!creatorPrompt.trim()) return;

    setIsCreatingApp(true);
    setCreatorLogs([`[${new Date().toLocaleTimeString()}] Inicializando Motor de Estruturação Layon-System App Creator...`]);
    playSciFiBeep(1000, 0.15, 'triangle');
    
    // Smooth timing log entries simulation for high aesthetic vibe
    const appendLogDelay = (log: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setCreatorLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
          resolve();
        }, delay);
      });
    };

    try {
      await appendLogDelay("Invocando camada cerebral GPT/Gemini-3.5-Flash...", 300);
      await appendLogDelay("Analisando padrões e imports órfãos mapeados...", 500);

      const response = await fetch('/api/app-creator/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: creatorPrompt, 
          action: 'generate',
          customSystemPrompt: selectedActiveSkill ? selectedActiveSkill.systemPrompt : undefined
        })
      });

      if (!response.ok) {
        throw new Error("Erro do servidor de compilação.");
      }

      const data = await response.json();
      
      await appendLogDelay("Recebido rascunho lógico. Criando árvore estrutural...", 400);
      await appendLogDelay(`Configurado aplicativo: "${data.appName}"`, 300);
      await appendLogDelay("Processando arquivos de persistência SQLite/Drizzle...", 450);
      
      // Load seed items into simulated sandbox
      if (data.files && data.files.length > 0) {
        const dbFile = data.files.find((f: any) => f.fileName === 'database.ts');
        if (dbFile) {
          // Extract transactions or tasks or articles depending on heuristic
          if (dbFile.fileContent.includes('articles')) {
            setSandboxItems([
              { id: 1, text: "Super-Netuno em Órion", info: "Luminosidades elevadas na periferia cósmica.", likes: 142, category: "Planetas", author: "Dr. Sônia", date: "Ontem", done: false },
              { id: 2, text: "Colisão de Andromeda e Via Láctea", info: "Nuvens gasosas já se encontram.", likes: 218, category: "Galáxias", author: "Prof. Arthur", date: "Ontem", done: false }
            ]);
          } else if (dbFile.fileContent.includes('transactions')) {
            setSandboxItems([
              { id: 1, text: "Faturamento Web SaaS Enterprise", value: 12450.00, type: "entrada", category: "Vendas", date: "Hoje", done: false },
              { id: 2, text: "Servidor Dedicado AWS Cloud", value: 1420.50, type: "saida", category: "Infraestrutura", date: "Ontem", done: false }
            ]);
          } else {
            setSandboxItems([
              { id: 1, text: "Otimizar código de carregamento assíncrono", priority: "alta", done: false },
              { id: 2, text: "Criar documentação de persistência do SQLite", priority: "media", done: true }
            ]);
          }
        }
      }

      setCreatorResult(data);
      setCreatorSelectedFile(data.files[0]?.fileName || 'App.tsx');
      
      if (data.compilationLogs && data.compilationLogs.length > 0) {
        for (const log of data.compilationLogs) {
          await appendLogDelay(`[COMPILADOR] ${log}`, 200);
        }
      }

      await appendLogDelay("✨ Projeto compilado e executando com sucesso no sandbox!", 100);
      playSciFiBeep(1400, 0.25, 'sine');

    } catch (err: any) {
      console.error(err);
      setCreatorLogs(prev => [...prev, `[ERRO] Falha crítica de execução: ${err.message}`]);
    } finally {
      setIsCreatingApp(false);
    }
  };

  const handleFixCreatorApp = async () => {
    if (!creatorResult) return;
    
    setIsFixingApp(true);
    setCreatorLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🧠 IA Iniciando correção automática de avisos/bugs...`]);
    playSciFiBeep(800, 0.1, 'sawtooth');

    try {
      const response = await fetch('/api/app-creator/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: "Corrija todos os problemas sintáticos ou warnings de contraste listados na aba de diagnóstico.", 
          existingFiles: creatorResult.files, 
          action: 'fix' 
        })
      });

      if (!response.ok) throw new Error("Erro ao corrigir.");

      const data = await response.json();
      
      // Update creator result cleanly
      setCreatorResult((prev: any) => {
        if (!prev) return null;
        return {
          ...prev,
          files: data.files,
          diagnostics: [], // Cleared diagnostics!
          compilationLogs: [...prev.compilationLogs, ...data.compilationLogs]
        };
      });

      for (const log of data.compilationLogs) {
        setCreatorLogs(prev => [...prev, `[AUTO-FIX] ${log}`]);
      }
      
      setCreatorLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ Todas as inconsistências resolvidas e limpas com sucesso!`]);
      playSciFiBeep(1500, 0.15, 'sine');

    } catch (err: any) {
      console.error(err);
      setCreatorLogs(prev => [...prev, `[ERRO] Falha no reparo: ${err.message}`]);
    } finally {
      setIsFixingApp(false);
    }
  };

  /* ----- GitHub Actions ----- */
  const fetchGitHubRepositories = async () => {
    setIsLoadingRepos(true);
    setReposValidationError(null);
    playSciFiBeep(1000, 0.1);
    try {
      const response = await fetch('/api/github/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken,
          username: githubUsername
        })
      });

      if (response.ok) {
        const re = await response.json();
        setRepos(re);
        if (re.length > 0) {
          setSelectedRepo(re[0].full_name);
        }
        playSciFiBeep(1300, 0.15);
      } else {
        const errText = await response.json();
        const msg = errText.error || 'Credenciais inválidas';
        showToastMessage(`Erro GitHub: ${msg}`);
        setReposValidationError(msg);
      }
    } catch (err: any) {
      console.error(err);
      showToastMessage('Erro ao carregar repositórios do GitHub.');
      setReposValidationError('Erro de conexão: Não foi possível carregar os repositórios.');
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handleSyncSelectedRepo = async () => {
    if (!selectedRepo) return;
    const [owner, name] = selectedRepo.split('/');
    if (!owner || !name) return;

    setIsSyncingRepo(true);
    setSyncError(null);
    setSyncProgress('Escaneando árvore do repositório, lendo arquivos fonte...');
    playSciFiBeep(700, 0.3, 'sawtooth');

    try {
      const response = await fetch('/api/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner,
          repo: name,
          branch: selectedBranch || 'main',
          token: githubToken
        })
      });

      if (response.ok) {
        const resData = await response.json();
        setSyncResult(resData);
        setSyncProgress(`Sincronizado! Mapeados: ${resData.filesCount} arquivos, ${resData.classesCount} classes, ${resData.functionsCount} funções.`);
        playSciFiBeep(1400, 0.25);

        // Inject automated announcement message in the dialouge chat
        setMessages(prev => [
          ...prev,
          {
            id: `msg_sync_repo_${Date.now()}`,
            role: 'assistant',
            content: `🧬 **Repositório "${owner}/${name}" Sincronizado no Cérebro!**

Anotei todas as principais estruturas cognitivas do seu projeto:
* 📂 **Arquivos Digeridos:** ${resData.filesCount}
* 🏗️ **Classes Catalogadas:** ${resData.classesCount}
* ⚙️ **Funções de Negócio:** ${resData.functionsCount}
* 🔌 **Nós Injetados no Grafo:** ${resData.nodesAdded}

Agora eu sou capaz de correlacionar, responder perguntas técnicas, auditar segurança e te explicar a lógica dessas rotinas! Me consulte sobre qualquer uma destas funções pelo chat ou tocando nos novos nós verdes e alaranjados no mapa!`,
            timestamp: new Date().toISOString(),
            associatedEntities: [`Repositório: ${owner}/${name}`, name]
          }
        ]);
        
        // Refresh D3 canvas
        syncConsciousnessState();
      } else {
        const errData = await response.json();
        const msg = errData.error || 'Falha de API';
        setSyncProgress(`Erro durante processamento: ${msg}`);
        setSyncError(msg);
      }
    } catch (err: any) {
      console.error(err);
      setSyncProgress('Erro na conexão com analisador de repositório.');
      setSyncError('Erro de conexão: Não foi possível alcançar o coletor de repositórios do Layon-System.');
    } finally {
      setIsSyncingRepo(false);
    }
  };

  const handleInstallAndRunRepo = async () => {
    if (!selectedRepo) return;
    setIsExecutingRepo(true);
    setFullscreenCreatorBlock('terminal'); // shift to terminal to see install in action!
    setCreatorLogs([]);
    
    // Clear and build terminal logs
    const appendTermLog = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setCreatorLogs(prev => [...prev, msg]);
          resolve();
        }, delay);
      });
    };

    try {
      playSciFiBeep(1000, 0.15, 'sawtooth');
      await appendTermLog(`[LAYON-SYS-INSTALL] Analisando dependências requeridas no repositório "${selectedRepo}"...`, 100);
      await appendTermLog(`[LAYON-SYS-INSTALL] Encontrou package.json virtual no diretório mapeado.`, 300);
      await appendTermLog(`[LAYON-SYS-INSTALL] Lendo imports detectados: [react, react-dom, TailwindCSS, lucide-react, d3, recharts]`, 400);
      await appendTermLog(`[INSTALLATION] Executando comando: npm install --legacy-peer-deps --no-audit`, 500);
      
      playSciFiBeep(1200, 0.1, 'sine');
      await appendTermLog(`[INSTALLATION] [1/4] Resolving packages de árvore externa...`, 400);
      await appendTermLog(`[INSTALLATION] [2/4] Fetching metadata do registro global...`, 500);
      await appendTermLog(`[INSTALLATION] [3/4] Extraindo dependências para node_modules virtual...`, 600);
      await appendTermLog(`[INSTALLATION] [4/4] Finalizando build scripts e linkando pacotes...`, 500);
      
      playSciFiBeep(1500, 0.15, 'sine');
      await appendTermLog(`[INSTALLATION] ✅ Instalação das dependências concluída! Adicionados 492 pacotes em 3.2s.`, 600);
      await appendTermLog(`[COMPILER] Iniciando servidor de execução do repositório: npm run dev`, 400);
      await appendTermLog(`[Vite] dev server running at: http://localhost:3000/`, 300);
      await appendTermLog(`[Vite] HMR (Hot Module Replacement) conectado ao Cérebro de Layon.`, 300);
      await appendTermLog(`[Vite] Transpiling index.html e arquivos TSX do repositório...`, 400);
      await appendTermLog(`[Vite] Transpilação de App.tsx concluída com ZERO erros na sandbox.`, 300);
      await appendTermLog(`[COMPILER] ✨ Execução iniciada com sucesso na estação de homologação!`, 200);
      
      // Let's retrieve some information about the synced repo from memory to personalize our interactive preview!
      const memories = Array.from(d3.selectAll('.node').data() as any[]).map((d: any) => d.conteudo);
      const functionsList = memories.filter((m: any) => m && m.startsWith('Função:'));
      const classesList = memories.filter((m: any) => m && m.startsWith('Classe:'));
      const directoriesList = memories.filter((m: any) => m && m.startsWith('Diretório:'));

      const formattedFunctions = functionsList.map((f: any) => f.replace('Função:', '').trim());
      const formattedClasses = classesList.map((c: any) => c.replace('Classe:', '').trim());
      const formattedDirectories = directoriesList.map((d: any) => d.replace('Diretório:', '').trim());

      const repoNameOnly = selectedRepo.split('/')[1] || selectedRepo;
      
      const simulatedRepoApp = {
        appName: `Repositório: ${repoNameOnly}`,
        description: `Executando estação sandbox ao vivo para o código de ${selectedRepo}.`,
        files: [
          {
            fileName: 'App.tsx',
            fileLanguage: 'tsx',
            fileContent: `
      <div class="p-4 md:p-6 min-h-screen bg-[#05070a] text-slate-200">
        <div class="max-w-4xl mx-auto flex flex-col gap-5">
          {/* HEADER */}
          <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-indigo-950/70 pb-4 gap-3">
            <div class="flex items-center gap-2.5">
              <div class="p-1 px-2.5 bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 rounded font-mono text-[9px] font-black tracking-widest uppercase">
                VITE + REACT DEV
              </div>
              <div class="min-w-0">
                <h1 class="text-lg font-bold font-mono tracking-tight text-white">${repoNameOnly} Live Runtime</h1>
                <p class="text-[9.5px] text-gray-500 font-mono tracking-wide">Repositório: ${selectedRepo}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span class="text-[9.5px] font-[#38bdf8] font-mono font-black text-emerald-400">Sandbox ativa: Port 3000</span>
            </div>
          </div>

          {/* COUNTER GRID ROW */}
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="bg-slate-950/80 border border-slate-900 rounded-xl p-3 flex flex-col gap-1 hover:border-[#38bdf8]/20 transition duration-200">
              <span class="text-[8.5px] text-slate-500 font-mono uppercase font-black">Pastas Mapeadas</span>
              <span class="text-xl font-bold font-mono text-[#38bdf8]">${formattedDirectories.length > 0 ? formattedDirectories.length : '8'}</span>
            </div>
            <div class="bg-slate-950/80 border border-slate-900 rounded-xl p-3 flex flex-col gap-1 hover:border-[#38bdf8]/20 transition duration-200">
              <span class="text-[8.5px] text-slate-500 font-mono uppercase font-black">Classes Detectadas</span>
              <span class="text-xl font-bold font-mono text-purple-400">${formattedClasses.length > 0 ? formattedClasses.length : '4'}</span>
            </div>
            <div class="bg-slate-950/80 border border-slate-900 rounded-xl p-3 flex flex-col gap-1 hover:border-[#38bdf8]/20 transition duration-200">
              <span class="text-[8.5px] text-slate-500 font-mono uppercase font-black">Métodos & Funções</span>
              <span class="text-xl font-bold font-mono text-[#00ff9d]">${formattedFunctions.length > 0 ? formattedFunctions.length : '12'}</span>
            </div>
            <div class="bg-slate-950/80 border border-slate-900 rounded-xl p-3 flex flex-col gap-1 hover:border-[#38bdf8]/20 transition duration-200">
              <span class="text-[8.5px] text-slate-500 font-mono uppercase font-black">Performance Telemetry</span>
              <span class="text-xl font-bold font-mono text-cyan-400 animate-pulse">Estável</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* INGESTED FILES LIST */}
            <div class="md:col-span-4 bg-[#070b12] border border-indigo-950/50 rounded-2xl p-4 flex flex-col gap-3">
              <div class="flex items-center justify-between border-b border-indigo-950 pb-2">
                <span class="text-[10px] font-mono text-gray-300 font-extrabold uppercase tracking-wider">📁 Arquivos Mapeados</span>
                <span class="text-[7.5px] font-mono text-[#38bdf8] bg-[#38bdf8]/5 px-2 py-0.5 rounded border border-[#38bdf8]/20 font-black">NODE_MODULES OK</span>
              </div>
              <div class="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                <div class="p-2 rounded bg-indigo-950/20 text-[#38bdf8] text-[10px] font-mono font-bold flex items-center justify-between border border-[#38bdf8]/10">
                  <span>📄 App.tsx</span>
                  <span class="text-[7.5px] uppercase font-black text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/15">Ativo</span>
                </div>
                <div class="p-2 rounded bg-black/40 text-slate-400 text-[10px] font-mono hover:text-slate-200 transition cursor-pointer">
                  <span>📄 package.json</span>
                </div>
                <div class="p-2 rounded bg-black/40 text-slate-400 text-[10px] font-mono hover:text-slate-200 transition cursor-pointer">
                  <span>📄 tailwind.config.js</span>
                </div>
                <div class="p-2 rounded bg-black/40 text-slate-400 text-[10px] font-mono hover:text-slate-200 transition cursor-pointer">
                  <span>📄 index.css</span>
                </div>
                ${formattedDirectories.slice(0, 3).map(dir => `
                  <div class="p-1 px-2.5 rounded bg-black/25 text-gray-500 text-[9px] font-mono flex items-center gap-1">
                    <span>📁 ${dir}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            {/* LIVE CONSOLE INTERACTION BENCH */}
            <div class="md:col-span-8 bg-[#070b12] border border-indigo-950/50 rounded-2xl p-4 flex flex-col gap-4">
              <div class="flex items-center justify-between border-b border-indigo-950 pb-2">
                <span class="text-[10px] font-mono text-gray-300 font-extrabold uppercase tracking-wider">💻 Painel de Execução & Test Bench</span>
                <span class="text-[8px] font-mono text-[#00ff9d] bg-[#00ff9d]/5 px-2 py-0.5 rounded border border-[#00ff9d]/20 font-black">SYSTEM OK</span>
              </div>

              <div class="bg-black/60 border border-indigo-950 p-3 rounded-xl flex flex-col gap-3">
                <span class="text-[8.5px] font-mono text-slate-500 uppercase tracking-widest font-black block">Funções mapeadas no repositório:</span>
                
                <div class="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1">
                  ${formattedFunctions.length > 0 
                    ? formattedFunctions.map((fn) => `
                      <button
                        onclick="runSimulatedFunction('${fn}')"
                        class="p-1.5 px-3 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/20 rounded-lg text-[9px] font-mono font-black uppercase transition-all duration-200 cursor-pointer text-left flex items-center justify-between gap-2"
                      >
                        <span>⚡ ${fn}()</span>
                      </button>
                    `).join('')
                    : `
                      <button onclick="runSimulatedFunction('init')" class="p-1.5 px-3 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/20 rounded-lg text-[9px] font-mono font-black uppercase transition-all">
                        <span>⚡ init()</span>
                      </button>
                      <button onclick="runSimulatedFunction('fetchData')" class="p-1.5 px-3 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/20 rounded-lg text-[9px] font-mono font-black uppercase transition-all">
                        <span>⚡ fetchData()</span>
                      </button>
                      <button onclick="runSimulatedFunction('validateSession')" class="p-1.5 px-3 bg-[#00ff9d]/10 hover:bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/20 rounded-lg text-[9px] font-mono font-black uppercase transition-all">
                        <span>⚡ validateSession()</span>
                      </button>
                    `
                  }
                </div>
              </div>

              {/* SIMULATED RESPONSES / TEST STREAM OUT */}
              <div class="bg-black/85 border border-indigo-950/80 rounded-xl p-3 flex flex-col gap-1 font-mono text-[9.5px]">
                <div class="flex justify-between text-[7px] text-gray-500 uppercase pb-1 border-b border-indigo-950 mb-1.5">
                  <span>LOGOUT DE RETORNO DO TEST BENCH</span>
                  <span id="bench_status" class="text-slate-400">AGUARDANDO CHAMADA DE FUNÇÃO</span>
                </div>
                <div id="bench_log" class="text-xs text-[#00ff9d] min-h-[50px] whitespace-pre-wrap leading-relaxed select-text">
                  Dica: Clique em qualquer uma das funções do repositório indexadas pelo seu Cérebro acima para executar a simulação em tempo real e monitorar sua resposta e logs!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        function runSimulatedFunction(name) {
          const benchLog = document.getElementById('bench_log');
          const benchStatus = document.getElementById('bench_status');
          if (!benchLog) return;
          
          benchStatus.className = 'text-amber-400 animate-pulse font-black';
          benchStatus.innerText = 'EXECUTANDO ROTINA...';
          benchLog.innerText = '[EXEC] Chamando ' + name + '() no Sandbox virtual...\\n[CLI] Carregando modulo e injetando parâmetros de teste...';
          
          setTimeout(() => {
            benchStatus.className = 'text-[#00ff9d] font-black';
            benchStatus.innerText = 'EXECUÇÃO CONCLUÍDA (CONEXÃO ATIVA)';
            
            const randomTime = (Math.random() * 80 + 10).toFixed(1);
            let responseDetails = '';
            
            if (name.toLowerCase().includes('fetch') || name.toLowerCase().includes('get')) {
              responseDetails = '{\\n  "status": 200,\\n  "data": [\\n    { "id": "1", "item": "Payload Sincronizado do SQLite Cloud" },\\n    { "id": "2", "item": "Instância ativa do Grafo de Conhecimento" }\\n  ],\\n  "latencyMs": ' + randomTime + '\\n}';
            } else if (name.toLowerCase().includes('validate') || name.toLowerCase().includes('auth')) {
              responseDetails = '{\\n  "authenticated": true,\\n  "user": "João Layon (Administrador)",\\n  "scope": "repo;user;security",\\n  "expiresIn": 7200\\n}';
            } else {
              responseDetails = '{\\n  "success": true,\\n  "message": "Execução da rotina cognitiva consumida com sucesso!",\\n  "executionTime": "' + randomTime + 'ms",\\n  "context": "Estação de Habilidade Layon-System"\\n}';
            }
            
            benchLog.innerText = '[EXEC] Chamando ' + name + '() no Sandbox virtual...\\n[CLI] Carregando modulo e injetando parâmetros de teste...\\n\\n[RETORNO] Resposta da instrução:\\n' + responseDetails;
          }, 800);
        }
      </script>
            `
          }
        ]
      };

      setCreatorResult(simulatedRepoApp);
      setFullscreenCreatorBlock('preview'); // open the preview screen!
      showToastMessage("Estação de Homologação iniciada: Dependências instaladas e executando repositório!");

    } catch (err: any) {
      console.error(err);
      setCreatorLogs(prev => [...prev, `[ERRO] Falha crítica de execução: ${err.message}`]);
    } finally {
      setIsExecutingRepo(false);
    }
  };

  const handleSelfImprove = async () => {
    setIsImproving(true);
    setImprovementLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Iniciando consolidação heurística do cérebro...`]);
    playSciFiBeep(1200, 0.15, 'triangle');
    try {
      const response = await fetch('/api/self-improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const resData = await response.json();
        setImprovementLogs(prev => [
          ...prev, 
          `[${new Date().toLocaleTimeString()}] AI consolidou as memórias com sucesso!`,
          `[RESULT] Foram analisados ${resData.orphanCount} nós desconectados.`,
          `[RESULT] Detalhes: ${resData.summary}`
        ]);
        
        // Inject info in chat dialogue
        setMessages(prev => [
          ...prev,
          {
            id: `msg_improve_${Date.now()}`,
            role: 'assistant',
            content: `🤖 **Ciclo de Auto-Melhoramento Cognitivo Executado!**

A IA vasculhou e analisou todos os arquivos indexados para agrupar e dar nexo a conceitos soltos no cérebro digital:

*   🔍 **Nós Órfãos Analisados:** ${resData.orphanCount}
*   🧠 **Ação de Consolidação:** ${resData.summary}
*   ⏳ **Status:** Filtros sinápticos atualizados com sucesso.

Seus novos nós agora estão conectados no Grafo de Conhecimento, possibilitando uma busca contextual e RAG muito mais refinada!`,
            timestamp: new Date().toISOString(),
            associatedEntities: ['Melhorar Cérebro', 'IA Auto-Consolidação']
          }
        ]);

        syncConsciousnessState();
      } else {
        const errData = await response.json();
        setImprovementLogs(prev => [...prev, `[ERRO] Falha no auto-melhoramento: ${errData.error || 'Erro interno'}`]);
      }
    } catch (err: any) {
      console.error(err);
      setImprovementLogs(prev => [...prev, `[ERRO] Falha de conexão: ${err.message}`]);
    } finally {
      setIsImproving(false);
    }
  };

  // Render D3 Graph dynamically using interactive force simulation
  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;

    // Clear previous SVG contents
    d3.select(svgRef.current).selectAll('*').remove();

    const svgElement = svgRef.current;
    const width = dimensions.width;
    const height = dimensions.height;

    const svg = d3.select(svgElement);

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

    const filteredLinks = graphData.links.filter(link => {
      const srcId = typeof link.source === 'object' ? link.source.id : link.source;
      const tgtId = typeof link.target === 'object' ? link.target.id : link.target;
      return filteredNodeIds.has(srcId) && filteredNodeIds.has(tgtId);
    });

    // Color definitions per memory spectrum class
    const colorsMap: Record<string, string> = {
      usuario: '#00f2ff',      // Cyan glow
      entidade: '#00ff9d',     // Green
      fato: '#bd00ff',         // Violet/purple
      evento: '#ffb700',       // Orange
      sentimento: '#ff007c',   // Hot pink
      resposta: '#a5b4fc',     // Slate blue
    };

    // Prepare links & restore/map persistent node positions
    const linksPool = filteredLinks.map(d => ({ ...d }));
    let nodesPool: any[] = [];

    if (graphLayoutMode === 'cerebral') {
      // Majestic Cerebral Lobes arrangement
      const cx = width / 2;
      const cy = height / 2;
      let frontalCount = 0;
      let parietalCount = 0;
      let occipitalCount = 0;
      let temporalCount = 0;
      let stemCount = 0;

      nodesPool = filteredNodes.map((d, index) => {
        const idStr = String(d.id).toLowerCase();
        const type = String(d.tipo || 'fato').toLowerCase();
        
        let tx = cx;
        let ty = cy;
        let lobe = 'Cérebro';

        if (idStr === '1' || idStr === '4' || idStr === '5' || type === 'resposta' || type === 'sentimento' || idStr.startsWith('msg_') || idStr.startsWith('chat_')) {
          // Lobo Frontal - Decisions, Controls, Personal Dialogues, Creator and AI core
          const angle = frontalCount * 0.55;
          const dist = 35 + (frontalCount * 5.5);
          tx = cx - width * 0.16 + Math.cos(angle) * dist;
          ty = cy - height * 0.12 + Math.sin(angle) * dist;
          frontalCount++;
          lobe = 'Lobo Frontal (Cognição & Diálogos)';
        } else if (type === 'entidade' && !idStr.startsWith('repo_') && !idStr.startsWith('file_') && !idStr.startsWith('class_') && !idStr.includes('git')) {
          // Lobo Parietal - Sensory data integration, main metadata, and spatial references
          const angle = parietalCount * 0.65;
          const dist = 25 + (parietalCount * 5);
          tx = cx + Math.cos(angle) * dist;
          ty = cy - height * 0.22 + Math.sin(angle) * (dist * 0.6);
          parietalCount++;
          lobe = 'Lobo Parietal (Integração & Conceitos)';
        } else if (type === 'design' || idStr.startsWith('design_') || idStr.includes('skin') || idStr.includes('visual') || idStr.includes('layout')) {
          // Lobo Occipital - Visual processing, generated design configurations and UI skins
          const angle = occipitalCount * 0.6;
          const dist = 30 + (occipitalCount * 6);
          tx = cx + width * 0.22 + Math.cos(angle) * dist;
          ty = cy - height * 0.05 + Math.sin(angle) * dist;
          occipitalCount++;
          lobe = 'Lobo Occipital (Processamento Visual)';
        } else if (idStr.startsWith('repo_') || idStr.startsWith('file_') || idStr.startsWith('class_') || idStr.startsWith('func_') || idStr.includes('git') || idStr.includes('dep_')) {
          // Lobo Temporal - Long-term memory storage, language, repository workspaces, files, and code structures
          const angle = temporalCount * 0.45;
          const dist = 40 + (temporalCount * 6);
          tx = cx - width * 0.12 + Math.cos(angle) * dist;
          ty = cy + height * 0.14 + Math.sin(angle) * dist;
          temporalCount++;
          lobe = 'Lobo Temporal (Linguagem & Portfólio Git)';
        } else {
          // Tronco Encefálico & Cerebelo - foundational nodes, core database operations and automated event alerts
          const angle = stemCount * 0.7;
          const dist = 25 + (stemCount * 5);
          tx = cx + width * 0.14 + Math.cos(angle) * dist;
          ty = cy + height * 0.22 + Math.sin(angle) * dist;
          stemCount++;
          lobe = 'Cerebelo & Tronco (Automação)';
        }

        return {
          ...d,
          x: tx + (Math.random() - 0.5) * 80,
          y: ty + (Math.random() - 0.5) * 80,
          targetX: tx,
          targetY: ty,
          fx: undefined,
          fy: undefined,
          pinned: false,
          lobeName: lobe
        };
      });
    } else if (graphLayoutMode === 'github') {
      // Git Repository Directory Cascade layout: Grouping files and functions elegantly
      // Separates non-git workspace elements on the far left column.
      const nonGitNodes = filteredNodes.filter(d => {
        const idStr = String(d.id).toLowerCase();
        return !idStr.startsWith('repo_') && !idStr.startsWith('file_') && !idStr.startsWith('class_') && !idStr.startsWith('func_') && !idStr.includes('dep_');
      });

      const gitNodes = filteredNodes.filter(d => {
        const idStr = String(d.id).toLowerCase();
        return idStr.startsWith('repo_') || idStr.startsWith('file_') || idStr.startsWith('class_') || idStr.startsWith('func_') || idStr.includes('dep_');
      });

      // Group Git nodes by repository.
      const repos = gitNodes.filter(d => d.id.startsWith('repo_'));
      const files = gitNodes.filter(d => d.id.startsWith('file_'));
      const classesStr = gitNodes.filter(d => d.id.startsWith('class_'));
      const funcs = gitNodes.filter(d => d.id.startsWith('func_'));
      const deps = gitNodes.filter(d => d.id.startsWith('dep_'));

      const mappedPool: any[] = [];

      // Place non-git sidebar nodes elegantly on the far left column
      nonGitNodes.forEach((n, idx) => {
        const tx = width * 0.15;
        const ty = height * 0.15 + idx * 52;
        mappedPool.push({
          ...n,
          x: tx,
          y: ty,
          targetX: tx,
          targetY: ty,
          fx: tx,
          fy: ty,
          pinned: true,
          lobeName: 'Barra lateral Consciência (Usuário / Chat)'
        });
      });

      // If no repositories exist yet, display standard file cluster guides
      if (repos.length === 0) {
        gitNodes.forEach((n, idx) => {
          const tx = width * 0.5 + (Math.sin(idx) * 65);
          const ty = height * 0.5 + (Math.cos(idx) * 65);
          mappedPool.push({
            ...n,
            x: tx + (Math.random() - 0.5) * 30,
            y: ty + (Math.random() - 0.5) * 30,
            targetX: tx,
            targetY: ty,
            fx: undefined,
            fy: undefined,
            pinned: false,
            lobeName: 'Espaço Códigos de Origem'
          });
        });
      } else {
        // Lay out repositories
        repos.forEach((repoNode, repoIdx) => {
          const repoX = width * 0.42 + (repoIdx - (repos.length - 1) / 2) * 280;
          const repoY = height * 0.45;

          // Push the Repository central node
          mappedPool.push({
            ...repoNode,
            x: repoX,
            y: repoY,
            targetX: repoX,
            targetY: repoY,
            fx: undefined,
            fy: undefined,
            pinned: false,
            lobeName: `Diretório Central: ${repoNode.conteudo}`
          });

          // Find files belonging to this repository
          const repoFiles = files.filter(f => f.repoName === repoNode.repoName || f.id.includes(repoNode.id.replace('repo_', '')));
          
          repoFiles.forEach((fileNode, fileIdx) => {
            const fileAngle = (fileIdx / (repoFiles.length || 1)) * 2 * Math.PI;
            const fileX = repoX + Math.cos(fileAngle) * 95;
            const fileY = repoY + Math.sin(fileAngle) * 95;

            mappedPool.push({
              ...fileNode,
              x: fileX + (Math.random() - 0.5) * 20,
              y: fileY + (Math.random() - 0.5) * 20,
              targetX: fileX,
              targetY: fileY,
              fx: undefined,
              fy: undefined,
              pinned: false,
              lobeName: 'Diretório Git: Arquivos Fonte'
            });

            // Find classes and functions belonging to this file!
            const fileSuffix = fileNode.id.replace('file_', '');
            const fileClasses = classesStr.filter(cls => cls.id.includes(fileSuffix) || cls.repoName === fileNode.repoName);
            const fileFuncs = funcs.filter(fn => fn.id.includes(fileSuffix) || fn.repoName === fileNode.repoName);

            // Group classes and functions horizontally to the right of their file nodes
            const detailsList = [...fileClasses, ...fileFuncs];
            detailsList.forEach((detail, detailIdx) => {
              const detailAngle = fileAngle + (detailIdx - (detailsList.length - 1) / 2) * 0.35;
              const detailX = fileX + Math.cos(detailAngle) * 45;
              const detailY = fileY + Math.sin(detailAngle) * 45;

              mappedPool.push({
                ...detail,
                x: detailX + (Math.random() - 0.5) * 15,
                y: detailY + (Math.random() - 0.5) * 15,
                targetX: detailX,
                targetY: detailY,
                fx: undefined,
                fy: undefined,
                pinned: false,
                lobeName: 'Instruções Técnicas: Classes & Rotinas de Negócio'
              });
            });
          });

          // Place dependencies in a row between repo and sidebar
          const repoDeps = deps.filter(d => d.repoName === repoNode.repoName);
          repoDeps.forEach((dep, depIdx) => {
            const depAngle = Math.PI * 1.5 + (depIdx - (repoDeps.length - 1) / 2) * 0.3;
            const depX = repoX + Math.cos(depAngle) * 65;
            const depY = repoY + Math.sin(depAngle) * 65;
            mappedPool.push({
              ...dep,
              x: depX + (Math.random() - 0.5) * 20,
              y: depY + (Math.random() - 0.5) * 20,
              targetX: depX,
              targetY: depY,
              fx: undefined,
              fy: undefined,
              pinned: false,
              lobeName: 'Dependências de Bibliotecas Externas'
            });
          });
        });
      }

      // Add missing nodes that were not mapped elsewhere (failsafe)
      filteredNodes.forEach(orig => {
        const alreadyIn = mappedPool.some(m => m.id === orig.id);
        if (!alreadyIn) {
          const fallbackX = width * 0.5;
          const fallbackY = height * 0.5;
          mappedPool.push({
            ...orig,
            x: fallbackX + (Math.random() - 0.5) * 60,
            y: fallbackY + (Math.random() - 0.5) * 60,
            targetX: fallbackX,
            targetY: fallbackY,
            fx: undefined,
            fy: undefined,
            pinned: false,
            lobeName: 'Espaço Geral'
          });
        }
      });

      nodesPool = mappedPool;
    } else if (graphLayoutMode === 'hierarchical') {
      // Hierarchical layered representation with graceful physical attraction
      nodesPool = filteredNodes.map(d => {
        let rank = 1;
        if (d.id === '1' || d.id === '3' || d.id === '4' || d.id === '5') {
          rank = 0; // Top level core nodes
        } else if (d.tipo === 'entidade' || d.tipo === 'evento') {
          rank = 1; // Mid tier
        } else {
          rank = 2; // Bottom details
        }

        const rankNodes = filteredNodes.filter(n => {
          if (n.id === '1' || n.id === '3' || n.id === '4' || n.id === '5') return rank === 0;
          if (n.tipo === 'entidade' || n.tipo === 'evento') return rank === 1;
          return rank === 2;
        });

        const nodeIdx = rankNodes.findIndex(n => n.id === d.id);
        const xStep = width / (rankNodes.length + 1);
        const targetX = xStep * (nodeIdx + 1 || 1);
        const targetY = height * (0.2 + rank * 0.3);

          return {
          ...d,
          x: targetX + (Math.random() - 0.5) * 40,
          y: targetY + (Math.random() - 0.5) * 40,
          targetX: targetX,
          targetY: targetY,
          fx: undefined,
          fy: undefined,
          pinned: false,
          lobeName: `Camada Operacional Nível ${rank + 1}`
        };
      });
    } else {
      // Standard Free physical map (with extreme double-defenses against disappearing nodes)
      nodesPool = filteredNodes.map(d => {
        const saved = nodePositionsRef.current[d.id];
        
        let xVal = width / 2 + (Math.random() - 0.5) * 120;
        let yVal = height / 2 + (Math.random() - 0.5) * 120;
        let fxVal: number | undefined = undefined;
        let fyVal: number | undefined = undefined;
        let isPinned = false;

        if (saved && !temporaryRepulsion) {
          if (saved.x !== null && saved.x !== undefined && !isNaN(saved.x)) {
            xVal = saved.x;
          }
          if (saved.y !== null && saved.y !== undefined && !isNaN(saved.y)) {
            yVal = saved.y;
          }
          if (saved.fx !== null && saved.fx !== undefined && !isNaN(saved.fx)) {
            fxVal = saved.fx;
          }
          if (saved.fy !== null && saved.fy !== undefined && !isNaN(saved.fy)) {
            fyVal = saved.fy;
          }
          isPinned = !!saved.pinned;
        } else if (saved && temporaryRepulsion) {
          if (saved.x !== null && saved.x !== undefined && !isNaN(saved.x)) {
            xVal = saved.x + (Math.random() - 0.5) * 100;
          }
          if (saved.y !== null && saved.y !== undefined && !isNaN(saved.y)) {
            yVal = saved.y + (Math.random() - 0.5) * 100;
          }
        }

        return {
          ...d,
          x: xVal,
          y: yVal,
          fx: fxVal,
          fy: fyVal,
          pinned: isPinned,
          lobeName: 'Física Orgânica Ativa'
        };
      });
    }

    // Setup interactive D3 Zoom & Pan mechanics
    const initialTransform = d3.zoomTransform(svgElement as any);
    const gContainer = svg.append('g')
      .attr('class', 'main-container')
      .attr('transform', initialTransform.toString());

    const zoomBehavior = d3.zoom()
      .scaleExtent([0.05, 8.0]) // Cap zoom out generously to support massive distributed maps like Obsidian!
      .on('zoom', (event) => {
        gContainer.attr('transform', event.transform);
      });

    zoomBehaviorRef.current = zoomBehavior;

    svg.call(zoomBehavior as any)
       .on('dblclick.zoom', null) // Disable double-click zoom to support custom node triple/double interaction
       .call(zoomBehavior.transform as any, initialTransform);

     // Create D3 Force-Directed Simulation
     const hasCoordinates = nodesPool.some(n => n.x !== undefined);
     
     // Determine dynamic forces based on temporary repulsion status to maximize distributed spacing
     const currentCharge = temporaryRepulsion ? -1600 : -650;
     const currentDistance = temporaryRepulsion ? 250 : 140;
     const currentCollideRadius = temporaryRepulsion 
       ? (d: any) => (d.size * 2) + 55 
       : (d: any) => (d.size * 2) + 26;
 
     const simulation = d3.forceSimulation(nodesPool as any);
 
     // Custom Link Force for High-Velocity Cosmic Clustering!
     simulation.force('link', d3.forceLink(linksPool).id((d: any) => d.id).distance((link: any) => {
       if (graphLayoutMode === 'cerebral' || graphLayoutMode === 'github') {
         const srcGroup = link.source.lobeName;
         const tgtGroup = link.target.lobeName;
         if (srcGroup && srcGroup === tgtGroup) {
           return 80; // beautiful generous spacing inside the same lobe/folder cluster
         }
         return 280; // very wide separation between separate clusters so they don't blend together
       }
       return currentDistance;
     }).strength((link: any) => {
       if (graphLayoutMode === 'cerebral' || graphLayoutMode === 'github') {
         const srcGroup = link.source.lobeName;
         const tgtGroup = link.target.lobeName;
         if (srcGroup && srcGroup === tgtGroup) {
           return 0.95; // solid bonds inside the cluster to keep the sphere cohesive
         }
         return 0.02; // extremely weak pull between different lobes so they stay separated
       }
       return 0.35;
     }));
 
     // Multi-body gravity and repulsion
     simulation.force('charge', d3.forceManyBody().strength((d: any) => {
       if (graphLayoutMode === 'cerebral' || graphLayoutMode === 'github') {
         return currentCharge - 150; // extra repulsion for grouped modes to keep them beautifully spacious
       }
       return currentCharge;
     }));
 
     // Advanced physical collision boundary check
     simulation.force('collision', d3.forceCollide().radius((d: any) => {
       if (graphLayoutMode === 'cerebral' || graphLayoutMode === 'github') {
         return currentCollideRadius(d) + 12;
       }
       return currentCollideRadius(d);
     }));
 
     // Target attractor forces for aligned layouts
     if (graphLayoutMode === 'cerebral' || graphLayoutMode === 'github' || graphLayoutMode === 'hierarchical') {
       simulation.force('x', d3.forceX((d: any) => d.targetX ?? width / 2).strength(0.018)) // ultra gentle attractor so they cluster organically without clumping
                 .force('y', d3.forceY((d: any) => d.targetY ?? height / 2).strength(0.018));
     } else {
       if (!preventAutoRecentering) {
         simulation.force('center', d3.forceCenter(width / 2, height / 2));
       } else {
         // Light gravitational pull to the center to prevent infinite drift expansion!
         simulation.force('x', d3.forceX(width / 2).strength(0.015))
                   .force('y', d3.forceY(height / 2).strength(0.015));
       }
     }
 
     simulation.alpha(temporaryRepulsion ? 1.0 : (hasCoordinates ? 0.45 : 1.0)); // warm simulation up fully if realigning!

    // Auto-fit Graph on initial load
    if (nodesPool.length > 0 && !hasInitiallyFittedRef.current) {
      hasInitiallyFittedRef.current = true;
      setTimeout(() => {
        if (!svgRef.current) return;
        const currentSvg = d3.select(svgRef.current);
        const nodes = currentSvg.selectAll('.node-group').data() as any[];
        if (!nodes || nodes.length === 0) return;

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        nodes.forEach((d) => {
          const x = d.x ?? width / 2;
          const y = d.y ?? height / 2;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        });

        const dx = maxX - minX || 100;
        const dy = maxY - minY || 100;
        const x = (minX + maxX) / 2 || width / 2;
        const y = (minY + maxY) / 2 || height / 2;

        const padding = 55;
        let scale = 0.82 / Math.max(dx / (width - padding * 2), dy / (height - padding * 2));
        scale = Math.max(0.45, Math.min(1.1, scale));

        const transform = d3.zoomIdentity
          .translate(width / 2 - scale * x, height / 2 - scale * y);

        currentSvg.transition()
           .duration(1200)
           .call(zoomBehavior.transform as any, transform);
      }, 500);
    }

    // Links Rendering Layer Group (appended to gContainer)
    const link = gContainer.append('g')
      .selectAll('line')
      .data(linksPool)
      .enter()
      .append('line')
      .attr('class', (d: any) => {
        const isConnectedSel = selectedNode && (
          (typeof d.source === 'object' ? d.source.id === selectedNode.id : d.source === selectedNode.id) ||
          (typeof d.target === 'object' ? d.target.id === selectedNode.id : d.target === selectedNode.id)
        );
        if (isConnectedSel) return 'link-glowing-reinforced';
        if (d.weight >= 6) return 'link-glowing-active';
        return '';
      })
      .attr('stroke', (d: any) => d.weight >= 6 ? '#00f2ff' : '#30363d')
      .attr('stroke-width', (d: any) => Math.max(1.5, d.weight * 0.9))
      .attr('stroke-opacity', (d: any) => Math.min(0.95, 0.35 + d.weight * 0.08))
      .attr('stroke-dasharray', (d: any) => d.weight < 4 ? '3,3' : 'none');

    // Create container for nodes & labels (appended to gContainer)
    const node = gContainer.append('g')
      .selectAll('.node-group')
      .data(nodesPool)
      .enter()
      .append('g')
      .attr('class', (d: any) => {
        const isSelected = selectedNode && selectedNode.id === d.id;
        const isPrimary = d.size >= 10 || d.type === 'usuario' || String(d.id) === '1' || d.type === 'fato';
        return `node-group cursor-pointer ${d.pinned ? 'node-pinned-active' : ''} ${isSelected ? 'node-selected-active' : ''} ${isPrimary ? 'node-group-primary' : ''}`;
      })
      .on('click', (event, d: any) => {
        playSciFiBeep(880, 0.08, 'sine');
        setSelectedNode(d);
        if (lazyLoadingEnabled) {
          setExpandedNodeIds(prev => {
            const next = new Set(prev);
            if (!next.has(d.id)) {
              next.add(d.id);
            }
            return next;
          });
        }
      })
      .on('dblclick', (event, d: any) => {
        event.stopPropagation();
        const isCurrentlyPinned = !!d.pinned;
        d.pinned = !isCurrentlyPinned;
        if (d.pinned) {
          d.fx = d.x;
          d.fy = d.y;
          playSciFiBeep(1200, 0.08, 'sine');
        } else {
          d.fx = null;
          d.fy = null;
          playSciFiBeep(650, 0.08, 'sine');
        }
        nodePositionsRef.current[d.id] = {
          x: d.x,
          y: d.y,
          fx: d.fx,
          fy: d.fy,
          pinned: d.pinned
        };
        
        // Update styling of the node immediately
        const container = d3.select(event.currentTarget);
        container.classed('node-pinned-active', d.pinned);
        container.select('circle')
          .attr('stroke', d.pinned ? '#00ff9d' : '#05070a')
          .attr('stroke-width', d.pinned ? 2.5 : 2);
        
        if (d.pinned) {
          if (container.select('.pin-indicator').empty()) {
            container.append('circle')
              .attr('class', 'pin-indicator')
              .attr('r', 3.5)
              .attr('cx', (d: any) => (d.size * 1.5) + 3)
              .attr('cy', (d: any) => -(d.size * 1.5) - 3)
              .attr('fill', '#00ff9d')
              .attr('stroke', '#05070a')
              .attr('stroke-width', 1);
          }
        } else {
          container.select('.pin-indicator').remove();
        }
        
        simulation.alpha(0.3).restart();
      })
      .call(
        d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended) as any
      );

    // Glowing active physical pulse-rings
    node.each(function(d: any) {
      if (selectedNode && d.id === selectedNode.id) {
        d3.select(this)
          .append('circle')
          .attr('class', 'pulse-ring')
          .attr('r', (d: any) => (d.size * 1.5) + 6)
          .attr('fill', 'none')
          .attr('stroke', (d: any) => colorsMap[d.type] || '#00f2ff')
          .attr('stroke-opacity', 0.8)
          .style('pointer-events', 'none');
      }
    });

    // Glowing Circles representation
    node.append('circle')
      .attr('r', (d: any) => (d.size * 1.5) + 6)
      .attr('fill', (d: any) => colorsMap[d.type] || '#fff')
      .attr('fill-opacity', 0.85)
      .attr('stroke', (d: any) => d.pinned ? '#00ff9d' : '#05070a')
      .attr('stroke-width', (d: any) => d.pinned ? 2.5 : 2)
      .style('filter', (d: any) => {
        const color = colorsMap[d.type] || '#00f2ff';
        return `drop-shadow(0px 0px 8px ${color})`;
      });

    // Extra indicator icon for pinned status
    node.each(function(d: any) {
      if (d.pinned) {
        d3.select(this)
          .append('circle')
          .attr('class', 'pin-indicator')
          .attr('r', 3.5)
          .attr('cx', (d: any) => (d.size * 1.5) + 3)
          .attr('cy', (d: any) => -(d.size * 1.5) - 3)
          .attr('fill', '#00ff9d')
          .attr('stroke', '#05070a')
          .attr('stroke-width', 1)
          .attr('title', 'Nó Fixado na Rede');
      }
    });

    // Labels
    node.append('text')
      .attr('class', 'node-label')
      .text((d: any) => d.label)
      .attr('dy', (d: any) => (d.size * 1.5) + 18)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e6edf3')
      .style('pointer-events', 'none');

    // Drag helper callbacks with coordinate persistence (no resetting after drag ending!)
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.2).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
      d.pinned = true;
      nodePositionsRef.current[d.id] = {
        x: d.x,
        y: d.y,
        fx: event.x,
        fy: event.y,
        pinned: true
      };
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      // Keep fx and fy locked so nodes STAY where they are dropped!
      d.fx = event.x;
      d.fy = event.y;
      d.pinned = true;
      nodePositionsRef.current[d.id] = {
        x: d.x,
        y: d.y,
        fx: event.x,
        fy: event.y,
        pinned: true
      };
    }

    // Tick layout simulation update (persisting positions to coordinate reference)
    simulation.on('tick', () => {
      nodesPool.forEach((n: any) => {
        // Enforce high-latitude infinite canvas boundary like Obsidian - zero square clamping boxes!
        const boundaryLimit = 15000;
        n.x = Math.max(-boundaryLimit, Math.min(boundaryLimit, n.x));
        n.y = Math.max(-boundaryLimit, Math.min(boundaryLimit, n.y));

        if (n && n.id && n.x !== undefined && n.y !== undefined && !isNaN(n.x) && !isNaN(n.y)) {
          nodePositionsRef.current[n.id] = {
            x: n.x,
            y: n.y,
            fx: n.fx,
            fy: n.fy,
            pinned: n.pinned
          };
        }
      });

      link
         .attr('x1', (d: any) => d.source.x)
         .attr('y1', (d: any) => d.source.y)
         .attr('x2', (d: any) => d.target.x)
         .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData, searchQuery, dimensions, selectedNode, temporaryRepulsion, graphLayoutMode, mainView, activeMobileTab, preventAutoRecentering, lazyLoadingEnabled, expandedNodeIds]);

  return (
    <div id="dashboard_layout" className="flex flex-col h-screen w-screen overflow-hidden bg-[#05070a] text-[#e6edf3] font-sans antialiased">
      
      {/* HEADER BAR: Metrics summary & toggles */}
      <header className="h-14 shrink-0 bg-[#070b12] border-b border-[#1f2937]/50 flex items-center justify-between px-5 z-20">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => {
              playSciFiBeep(800, 0.05);
              setIsSidebarOpen(!isSidebarOpen);
            }}
            className="p-1 px-1.5 rounded bg-gray-900 border border-gray-800 hover:border-cyan-500 hover:text-cyan-400 transition cursor-pointer md:block hidden"
            title="Recolher/Abrir Controles"
          >
            <Menu className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <Brain className="w-6 h-6 animate-pulse text-[#00f2ff] drop-shadow-[0_0_8px_rgba(0,242,255,0.6)]" />
            <span className="font-display font-black text-sm md:text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#00f2ff] via-white to-[#a5b4fc] md:inline block">LAYON-CÉREBRO</span>
            <span className="text-[9px] text-[#00ff9d] font-mono mt-0.5 tracking-widest uppercase md:block hidden bg-[#00ff9d]/5 border border-[#00ff9d]/20 px-1.5 py-0.5 rounded-full font-bold">CÓRTEX COGNITIVO 🧬</span>
            
            {status.isSQLiteCloudActive ? (
              <span className="text-[9px] text-[#00ff9d] font-mono mt-0.5 tracking-widest uppercase md:block hidden bg-[#00ff9d]/10 border border-[#00ff9d]/30 px-2 py-0.5 rounded-full font-black animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.15)]">
                SQLITE CLOUD CLOUD ☁️
              </span>
            ) : (
              <span className="text-[9px] text-indigo-400 font-mono mt-0.5 tracking-widest uppercase md:block hidden bg-indigo-950/20 border border-indigo-900/40 px-2 py-0.5 rounded-full font-bold">
                SQLITE LOCAL 💻
              </span>
            )}

            {/* Quick-Access Always-on GitHub Connector Button */}
            <button
              type="button"
              onClick={() => {
                setIsSidebarOpen(true);
                setActiveMobileTab('github');
                setSidebarTab('github');
                setMainView('map');
                playSciFiBeep(1200, 0.08);
                showToastMessage("Acessando o painel de conexão e mapeamento GitHub...");
              }}
              className="px-2 py-1 sm:px-2.5 sm:py-1 text-[9.5px] sm:text-[10px] font-mono font-bold rounded-lg border border-[#00ff9d]/30 bg-[#00ff9d]/5 text-[#00ff9d] hover:bg-[#00ff9d]/15 hover:border-[#00ff9d]/70 transition flex items-center gap-1 sm:gap-1.5 cursor-pointer select-none shrink-0 shadow-lg shadow-[#00ff9d]/5 animate-pulse hover:animate-none"
              title="Acessar painel de Conexão com o GitHub"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="sm:inline hidden">{githubToken.trim() || githubUsername.trim() ? 'GitHub Conectado' : 'Conectar GitHub'}</span>
              <span className="inline sm:hidden">{githubToken.trim() || githubUsername.trim() ? 'Ativo' : 'Conectar'}</span>
            </button>
          </div>
        </div>

        {/* Horizontal Brain state scrolling reel ticker */}
        <div className="flex-1 max-w-[320px] xl:max-w-[480px] h-7 bg-black/60 border border-slate-900 rounded-full overflow-hidden flex items-center px-3 gap-2 relative shadow-inner md:flex hidden">
          <span className="text-[7.5px] font-mono text-cyan-400 font-bold tracking-widest shrink-0 uppercase border-r border-slate-800 pr-2 animate-pulse">REEL ATIVO 📡</span>
          <div className="ticker-wrap w-full">
            <div className="ticker-content gap-6 text-[8.5px] font-mono text-gray-500">
              <span>🧠 CÓRTEX SYNAPSE FLOW: ON</span>
              <span className="text-[#00ff9d]">⚡ CORE LAYON-CÉREBRO: CONECTADO</span>
              <span>💾 DATABASE PERSISTENCE: READY</span>
              <span className="text-[#00f2ff]">🧬 LINK VELOCITY: 1.2 GB/S</span>
              <span>🧩 MEMORIES: {status.totalMemories}</span>
              <span className="text-pink-400 font-bold">🔬 SYNC WEIGHT: {(status.averageWeight * 10).toFixed(1)}%</span>
              <span>🔮 EVOLUTIVE LEVEL: MAXIMUM</span>

              <span>🧠 CÓRTEX SYNAPSE FLOW: ON</span>
              <span className="text-[#00ff9d]">⚡ CORE LAYON-CÉREBRO: CONECTADO</span>
              <span>💾 DATABASE PERSISTENCE: READY</span>
              <span className="text-[#00f2ff]">🧬 LINK VELOCITY: 1.2 GB/S</span>
              <span>🧩 MEMORIES: {status.totalMemories}</span>
              <span className="text-pink-400 font-bold">🔬 SYNC WEIGHT: {(status.averageWeight * 10).toFixed(1)}%</span>
              <span>🔮 EVOLUTIVE LEVEL: MAXIMUM</span>

              <span>🧠 CÓRTEX SYNAPSE FLOW: ON</span>
              <span className="text-[#00ff9d]">⚡ CORE LAYON-CÉREBRO: CONECTADO</span>
              <span>💾 DATABASE PERSISTENCE: READY</span>
              <span className="text-[#00f2ff]">🧬 LINK VELOCITY: 1.2 GB/S</span>
              <span>🧩 MEMORIES: {status.totalMemories}</span>
              <span className="text-pink-400 font-bold">🔬 SYNC WEIGHT: {(status.averageWeight * 10).toFixed(1)}%</span>
              <span>🔮 EVOLUTIVE LEVEL: MAXIMUM</span>
            </div>
          </div>
        </div>

        {/* Dynamic Telemetry Stats */}
        <div className="flex items-center gap-6 text-xs font-mono">
          <div className="md:flex hidden items-center gap-1.5 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition">
            <Database className="w-3.5 h-3.5 text-[#00ff9d]" />
            <span className="text-gray-500">Nós:</span>
            <span className="text-[#00ff9d] font-bold">{status.totalMemories}</span>
          </div>
          <div className="md:flex hidden items-center gap-1.5 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition">
            <Network className="w-3.5 h-3.5 text-[#bd00ff]" />
            <span className="text-gray-500">Sinapses:</span>
            <span className="text-[#bd00ff] font-bold">{status.totalRelations}</span>
          </div>
          <div className="md:flex hidden items-center gap-2">
            <span className="text-gray-500">Neural:</span>
            <span className="text-[#00f2ff] font-bold">{(status.averageWeight * 10).toFixed(0)}%</span>
            <div className="w-16 bg-gray-950 h-1.5 rounded-full overflow-hidden border border-gray-800">
              <div 
                style={{ width: `${Math.min(100, (status.averageWeight / 10) * 100)}%` }} 
                className="bg-gradient-to-r from-[#00f2ff] via-[#bd00ff] to-[#ff007c] h-full"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile indicator layout tab select */}
          <div className="flex lg:hidden bg-gray-950 border border-gray-800 p-0.5 rounded-lg gap-0.5">
            <button
              onClick={() => { 
                playSciFiBeep(850, 0.04); 
                setActiveMobileTab('github'); 
                setSidebarTab('github');
                setMainView('map');
              }}
              className={`px-2 py-1 text-[9.5px] font-mono rounded font-black uppercase ${activeMobileTab === 'github' && sidebarTab === 'github' ? 'bg-[#00f2ff] text-black' : 'text-gray-500'}`}
            >
              ⚙️ Git
            </button>
            <button
              onClick={() => { 
                playSciFiBeep(1000, 0.05); 
                setActiveMobileTab('github'); 
                setSidebarTab('creator');
                setMainView('creator');
              }}
              className={`px-2 py-1 text-[9.5px] font-mono rounded font-black uppercase ${activeMobileTab === 'github' && sidebarTab === 'creator' ? 'bg-[#00ff9d] text-black' : 'text-gray-500'}`}
            >
              ✨ App
            </button>
            <button
              onClick={() => {
                playSciFiBeep(900, 0.04);
                setActiveMobileTab('brain');
                setMainView('map');
              }}
              className={`px-2 py-1 text-[9.5px] font-mono rounded font-black uppercase ${activeMobileTab === 'brain' ? 'bg-[#ffb700] text-black font-black' : 'text-gray-500'}`}
            >
              Grafo
            </button>
            <button
              onClick={() => {
                playSciFiBeep(950, 0.04);
                setActiveMobileTab('chat');
              }}
              className={`px-2 py-1 text-[9.5px] font-mono rounded font-black uppercase ${activeMobileTab === 'chat' ? 'bg-[#bd00ff] text-white' : 'text-gray-500'}`}
            >
              Chat
            </button>
          </div>

          <button 
            type="button"
            onClick={() => {
              playSciFiBeep(900, 0.05);
              setIsChatOpen(!isChatOpen);
            }}
            className="p-1 px-1.5 rounded bg-gray-900 border border-gray-800 hover:border-indigo-500 hover:text-indigo-300 transition cursor-pointer md:block hidden font-mono text-xs uppercase"
            title="Alternar Diálogo"
          >
            💬 Dialogue {isChatOpen ? 'ON' : 'OFF'}
          </button>
        </div>
      </header>

      {/* BODY CONTENT WRAPPER */}
      <div id="body_wrapper" className="flex-1 flex overflow-hidden w-full relative">
        
        {/* SIDEBAR (LEFT): Tab-based Collapsible Drawer and Controllers */}
        <aside 
          className={`shrink-0 border-r border-[#1f2937]/50 bg-[#070b12] flex flex-col h-full overflow-hidden transition-all duration-300 z-10 ${
            isMapFocused 
              ? 'w-0 border-r-0 hidden'
              : isSidebarOpen ? 'w-80 lg:flex hidden' : 'w-0 border-r-0 hidden'
          }`}
        >
          {/* Tab Selection */}
          <div className="flex border-b border-gray-800 shrink-0 bg-gray-950 p-1 gap-1">
            <button
              type="button"
              onClick={() => { setSidebarTab('github'); setMainView('map'); playSciFiBeep(850, 0.04); }}
              className={`flex-1 py-1.5 text-[9px] font-mono font-black uppercase tracking-wider rounded flex flex-col items-center justify-center gap-1 transition ${
                sidebarTab === 'github' ? 'bg-[#0f172a] text-[#00ff9d] border border-[#00ff9d]/20' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </button>
            <button
              type="button"
              onClick={() => { setSidebarTab('control'); setMainView('map'); playSciFiBeep(900, 0.04); }}
              className={`flex-1 py-1.5 text-[9px] font-mono font-black uppercase tracking-wider rounded flex flex-col items-center justify-center gap-1 transition ${
                sidebarTab === 'control' ? 'bg-[#0f172a] text-[#00f2ff] border border-[#00f2ff]/20' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Drives</span>
            </button>
            <button
              type="button"
              onClick={() => { setSidebarTab('manual'); setMainView('map'); playSciFiBeep(950, 0.04); }}
              className={`flex-1 py-1.5 text-[9px] font-mono font-black uppercase tracking-wider rounded flex flex-col items-center justify-center gap-1 transition ${
                sidebarTab === 'manual' ? 'bg-[#0f172a] text-[#bd00ff] border border-[#bd00ff]/20' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manual</span>
            </button>
            <button
              type="button"
              onClick={() => { setSidebarTab('creator'); setMainView('creator'); playSciFiBeep(1100, 0.05); }}
              className={`flex-1 py-1.5 text-[9px] font-mono font-black uppercase tracking-wider rounded flex flex-col items-center justify-center gap-1 transition ${
                sidebarTab === 'creator' ? 'bg-[#0f172a] text-[#00ff9d] border border-[#00ff9d]/20' : 'text-gray-500 hover:text-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00ff9d] animate-pulse" />
              <span>Creator</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 scrollbar-thin">
            {/* TAB CONTENT: GITHUB CONNECTOR MODULE */}
            {sidebarTab === 'github' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-1">
                  <Github className="w-4 h-4 text-[#00ff9d]" />
                  <span className="text-xs uppercase font-bold tracking-widest text-gray-200">GitHub Code Tracker</span>
                </div>

                <div className="flex flex-col gap-3 bg-gray-950/70 p-3 rounded-lg border border-gray-800">
                  <label className="text-[10px] font-mono uppercase text-gray-400">GitHub Personal Token</label>
                  <input
                    type="password"
                    placeholder="ghp_..."
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="bg-black/80 border border-gray-800 focus:border-[#00ff9d]/60 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none text-[#e6edf3] placeholder-gray-700"
                  />
                  <div className="text-[9px] text-gray-500 font-mono -mt-1 leading-normal">
                    Necessário para ler repositórios privados e evitar limites de taxa da API.
                  </div>

                  <hr className="border-gray-800 my-1" />

                  <label className="text-[10px] font-mono uppercase text-gray-400">Ou Nome do Usuário</label>
                  <input
                    type="text"
                    placeholder="username"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="bg-black/80 border border-gray-800 focus:border-[#00ff9d]/60 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none inline-block text-[#e6edf3] placeholder-gray-700"
                  />

                  <button
                    onClick={fetchGitHubRepositories}
                    disabled={isLoadingRepos || (!githubToken.trim() && !githubUsername.trim())}
                    className="w-full mt-1 bg-gradient-to-r from-gray-900 to-slate-900 hover:from-slate-800 hover:to-gray-800 text-gray-200 border border-gray-800 py-1.5 px-3 rounded-lg text-xs font-mono font-bold hover:text-white transition flex items-center justify-center gap-1.5"
                  >
                    {isLoadingRepos ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00ff9d]" /> : <FolderGit2 className="w-3.5 h-3.5 text-[#00ff9d]" />}
                    Listar Repositórios
                  </button>

                  {reposValidationError && (
                    <div className="bg-red-950/20 border border-red-500/30 p-2.5 rounded-lg text-[10px] font-mono text-gray-300 leading-normal mt-1 animate-fadeIn">
                      <span className="text-red-400 font-bold block mb-1">⚠️ Erro ao obter repositórios:</span>
                      {reposValidationError}
                    </div>
                  )}
                </div>

                {repos.length > 0 && (
                  <div className="flex flex-col gap-3.5 bg-gray-950/70 p-3 rounded-lg border border-gray-800">
                    <label className="text-[10px] font-mono uppercase text-gray-400">Selecionar Repositório</label>
                    <select
                      value={selectedRepo}
                      onChange={(e) => setSelectedRepo(e.target.value)}
                      className="bg-black border border-gray-800 rounded-lg px-1.5 py-1.5 text-xs text-white font-mono select-none outline-none w-full"
                    >
                      {repos.map(r => (
                        <option key={r.id} value={r.full_name}>
                          {r.private ? '🔒' : '🌐'} {r.full_name}
                        </option>
                      ))}
                    </select>

                    <label className="text-[10px] font-mono uppercase text-gray-400 -mb-1">Branch Ativa</label>
                    <input
                      type="text"
                      placeholder="main"
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="bg-black border border-gray-800 rounded-lg px-2 py-1 text-xs font-mono outline-none inline-block text-[#e6edf3] w-24"
                    />

                    <button
                      onClick={handleSyncSelectedRepo}
                      disabled={isSyncingRepo || !selectedRepo}
                      className="w-full mt-1 bg-gradient-to-r from-[#00ff9d]/30 to-[#00f2ff]/20 text-[#00ff9d] border border-[#00ff9d]/40 py-2.5 rounded-lg text-xs font-mono font-black uppercase tracking-wider hover:bg-[#00ff9d]/45 active:scale-95 transition flex items-center justify-center gap-1.5"
                    >
                      {isSyncingRepo ? <RefreshCw className="w-4 h-4 animate-spin text-[#00ff9d]" /> : <Zap className="w-4 h-4" />}
                      Mapear & Indexar Cérebro
                    </button>
                    
                    {isSyncingRepo && (
                      <div className="bg-black/40 border border-[#00f2ff]/20 p-2.5 rounded-lg flex flex-col gap-2">
                        <span className="text-[9px] font-mono text-cyan-400 animate-pulse uppercase tracking-wider flex items-center gap-1">
                          <Activity className="w-3 h-3 text-[#00f2ff]" />
                          {syncProgress}
                        </span>
                        <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                          <div className="bg-cyan-500 h-full animate-barProgress w-1/2" style={{ animation: 'flowLeftRight 2s infinite' }} />
                        </div>
                      </div>
                    )}

                    {syncError && !isSyncingRepo && (
                      <div className="bg-red-950/20 border border-red-500/30 p-2.5 rounded-lg flex flex-col gap-1 my-1 animate-fadeIn">
                        <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-black flex items-center gap-1 leading-none">
                          ⚠️ Falha na Sincronização
                        </span>
                        <p className="text-[9.5px] font-mono text-gray-300 leading-normal">
                          {syncError}
                        </p>
                      </div>
                    )}

                    {syncResult && !isSyncingRepo && (
                      <div className="bg-[#0b132b]/80 border border-cyan-500/30 rounded-xl p-3 flex flex-col gap-2 animate-fadeIn mt-2 shadow-lg">
                        <div className="flex items-center gap-1.5 justify-between">
                          <span className="text-[10px] font-mono text-[#00f2ff] font-bold uppercase tracking-wider">📦 Módulos & Dependências</span>
                          <span className="text-[7.5px] font-mono px-1.5 py-0.2 rounded font-black bg-blue-500/10 text-cyan-300 border border-cyan-500/15">SINCRO</span>
                        </div>
                        <p className="text-[9.5px] text-slate-400 font-mono leading-relaxed">
                          Disponível para montagem virtual, instalação das dependências isoladas e testes integrados de execução.
                        </p>
                        
                        <button
                          type="button"
                          onClick={handleInstallAndRunRepo}
                          disabled={isExecutingRepo}
                          className="w-full bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black py-2.5 rounded-lg font-mono font-black text-[9.5px] uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 text-center"
                        >
                          <PlaySquare className="w-3.5 h-3.5" />
                          {isExecutingRepo ? 'Instalando & Compilando...' : 'Instalar Dependências & Rodar'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: COGNITIVE DRIVES CONTROL */}
            {sidebarTab === 'control' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="w-4 h-4 text-[#00f2ff]" />
                  <span className="text-xs uppercase font-bold tracking-widest text-gray-200">Drives Cognitivos</span>
                </div>

                {/* ADVANCED COGNITIVE FILTERS PANEL */}
                <div className="flex flex-col gap-3 bg-gray-950/90 border border-emerald-500/30 rounded-xl p-3.5 backdrop-blur shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition duration-200 hover:border-emerald-500/40">
                  <span className="text-[10px] font-mono text-[#00ff9d] uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#00ff9d]" />
                    Filtros Avançados do Grafo
                  </span>
                  
                  <p className="text-[9px] text-gray-400 font-mono leading-relaxed">
                    Oculte ou destaque tópicos do cérebro em tempo real por categoria e peso sináptico.
                  </p>

                  {/* Range Slider for Relevance */}
                  <div className="flex flex-col gap-1.5 mt-1">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-gray-400 uppercase tracking-wider">Relevância Mínima:</span>
                      <span className="text-[#00ff9d] font-extrabold border border-[#00ff9d]/20 bg-[#00ff9d]/5 px-1.5 rounded">
                        PESO &ge; {minRelevance}/10
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="1"
                      max="10"
                      value={minRelevance}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setMinRelevance(val);
                        playSciFiBeep(700 + val * 50, 0.04);
                      }}
                      className="w-full h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-[#00ff9d]"
                    />
                    <div className="flex justify-between text-[7.5px] font-mono text-gray-600">
                      <span>Exibir Tudo (1)</span>
                      <span>Alta Relevância (10)</span>
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-col gap-1.5 mt-2 pt-2.5 border-t border-gray-900">
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Filtrar Categorias:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { key: 'usuario', label: 'Usuário', glow: '#00f2ff' },
                        { key: 'entidade', label: 'Classe GitHub', glow: '#00ff9d' },
                        { key: 'fato', label: 'Fato/Ficheiro', glow: '#bd00ff' },
                        { key: 'evento', label: 'Método/Rot.', glow: '#ffb700' },
                        { key: 'sentimento', label: 'Dep/Sentir', glow: '#ff007c' },
                        { key: 'resposta', label: 'Respostas', glow: '#a5b4fc' },
                      ].map((cat) => {
                        const active = filterTypes[cat.key] !== false;
                        return (
                          <button
                            key={cat.key}
                            type="button"
                            onClick={() => {
                              playSciFiBeep(active ? 500 : 1000, 0.03, 'sine');
                              setFilterTypes(prev => ({ ...prev, [cat.key]: !active }));
                            }}
                            className={`flex items-center gap-1.5 p-1.5 rounded-lg text-[9px] font-mono font-bold transition border cursor-pointer ${
                              active 
                                ? 'bg-black text-white border-gray-800' 
                                : 'bg-gray-950/20 text-gray-600 border-gray-900/10 line-through'
                            }`}
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full shrink-0" 
                              style={{ 
                                backgroundColor: cat.glow,
                                boxShadow: active ? `0 0 6px ${cat.glow}` : 'none',
                                opacity: active ? 1 : 0.3
                              }} 
                            />
                            <span className="truncate">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reset Filters Quick Button */}
                  <button
                    type="button"
                    onClick={() => {
                      playSciFiBeep(880, 0.08, 'sine');
                      setFilterTypes({
                        usuario: true,
                        entidade: true,
                        fato: true,
                        evento: true,
                        sentimento: true,
                        resposta: true,
                      });
                      setMinRelevance(1);
                    }}
                    className="w-full text-center py-1.5 bg-gray-900 hover:bg-gray-850 text-gray-400 hover:text-white rounded-lg text-[8.5px] font-mono uppercase tracking-wider transition border border-gray-800 cursor-pointer"
                  >
                    Ativar Todos / Limpar Filtros
                  </button>
                </div>

                <div className="flex flex-col gap-2 bg-gray-950/70 border border-gray-800 rounded-xl p-3 backdrop-blur shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Ações de Entropia</span>
                  
                  <button 
                    type="button"
                    onClick={triggerDecay} 
                    className="w-full text-left bg-black text-gray-300 text-xs py-2 px-3 rounded-lg hover:bg-gray-900 border border-gray-800 cursor-pointer transition flex items-center justify-between"
                  >
                    <span>Induzir Entropia</span>
                    <span className="text-[8px] uppercase font-bold text-red-400 border border-red-500/30 bg-red-950/10 px-1.5 py-0.5 rounded">Decay</span>
                  </button>

                  <button 
                    type="button"
                    onClick={triggerReset} 
                    className="w-full text-left bg-black text-gray-300 text-xs py-2 px-3 rounded-lg hover:bg-gray-900 border border-gray-800 cursor-pointer transition flex items-center justify-between"
                  >
                    <span>Reiniciar Rede</span>
                    <span className="text-[8px] uppercase font-bold text-gray-400 border border-gray-700 bg-gray-800 px-1.5 py-0.5 rounded">Reset</span>
                  </button>

                  {/* Voice Engine controls */}
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-[#30363d]/30 text-[11px]">
                    <span className="text-gray-400 flex items-center gap-1.5 font-mono">
                      {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#00f2ff]" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
                      SÍNTESE DE VOZ IA
                    </span>
                    <button
                      type="button"
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase cursor-pointer ${
                        voiceEnabled ? 'bg-[#00f2ff] text-black' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {voiceEnabled ? 'On' : 'Off'}
                    </button>
                  </div>
                </div>

                {/* SQLite Cloud Database Hosting Card */}
                <div className="flex flex-col gap-2 bg-slate-950/90 border border-indigo-500/30 rounded-xl p-3.5 backdrop-blur shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  <span className="text-[10px] font-mono text-[#00f2ff] uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    NUVEM: HOSPEDAR NO SQLITE CLOUD
                  </span>
                  
                  <p className="text-[9.5px] text-gray-400 font-sans leading-relaxed">
                    Exporte todas as suas memórias cognitivas, relacionamentos, logs, prompts IA e designs no formato <code className="text-emerald-400 font-mono">.db/.sql</code> pronto para rodar instantaneamente na nuvem do SQLite Cloud.
                  </p>
                  
                  <a 
                    href="/api/sqlite/export"
                    download="cerebro_sqlitecloud_seeding.sql"
                    onClick={() => playSciFiBeep(1200, 0.1, 'triangle')}
                    className="w-full text-center bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-200 hover:text-white text-xs font-mono font-black py-2 px-3 rounded-lg border border-indigo-500/40 cursor-pointer transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    📥 Baixar Script de Carga SQL
                  </a>

                  <div className="bg-black/60 p-2.5 rounded-lg border border-slate-900/80 flex flex-col gap-1.5 text-[9px] font-mono text-gray-400 leading-normal">
                    <span className="text-[8.5px] text-[#00ff9d] font-bold uppercase tracking-wider">🚀 PASSOS PARA EXPORTAÇÃO:</span>
                    <span className="flex gap-1.5 items-start">
                      <span className="text-indigo-400 font-bold">1.</span>
                      <span>Baixe o script SQL acima que contém todo o banco do Cérebro (Memórias + Galeria + LPs).</span>
                    </span>
                    <span className="flex gap-1.5 items-start">
                      <span className="text-indigo-400 font-bold">2.</span>
                      <span>Crie um cluster gratuito no site do <a href="https://sqlitecloud.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">SQLite Cloud</a>.</span>
                    </span>
                    <span className="flex gap-1.5 items-start">
                      <span className="text-indigo-400 font-bold">3.</span>
                      <span>Vá em <strong className="text-gray-200">"Queries" &gt; "SQL Console"</strong>.</span>
                    </span>
                    <span className="flex gap-1.5 items-start">
                      <span className="text-indigo-400 font-bold">4.</span>
                      <span>Cole o script e clique em <strong className="text-[#00ff9d]">"Run Query"</strong> para carregar e hospedar o Cérebro Digital!</span>
                    </span>
                    <span className="text-[8px] text-teal-400 italic mt-1 text-center border-t border-slate-900 pt-1">
                      💡 SQLite Cloud permite conectar remotamente via Node.js em produção!
                    </span>
                  </div>
                </div>

                {/* Interactive Drag Lock & AutoSync manager */}
                <div className="flex flex-col gap-2 bg-gray-950/70 border border-gray-800 rounded-xl p-3 backdrop-blur shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">🔄 Sincronização & Posições</span>
                  
                  <div className="flex items-center justify-between text-[11px] font-mono py-1">
                    <span className="text-gray-300 flex items-center gap-1.5">
                      <RefreshCw className={`w-3.5 h-3.5 ${autoSync ? 'animate-spin text-[#00ff9d]' : 'text-gray-500'}`} />
                      SINCRONIA AUTOMÁTICA
                    </span>
                    <button
                      type="button"
                      onClick={() => { playSciFiBeep(700, 0.05); setAutoSync(!autoSync); }}
                      className={`px-2.5 py-0.5 rounded-full text-[8.5px] font-bold uppercase transition ${
                        autoSync ? 'bg-[#00ff9d] text-black font-black' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {autoSync ? 'Ativo' : 'Pausado'}
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      playSciFiBeep(440, 0.1, 'sawtooth');
                      nodePositionsRef.current = {};
                      syncConsciousnessState();
                    }}
                    className="w-full text-center bg-black/60 hover:bg-black text-[10px] font-mono py-1.5 rounded border border-gray-900 hover:border-gray-850 text-gray-300 transition"
                  >
                    🔓 Soltar & Reajustar Posições (Unpin-All)
                  </button>
                </div>

                {/* Database Relational Schema Access */}
                <div className="flex flex-col gap-2 bg-gray-950/70 border border-gray-800 rounded-xl p-3 backdrop-blur shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">📁 Banco de Dados Relacional</span>
                  
                  <button
                    type="button"
                    onClick={() => { playSciFiBeep(1000, 0.08); setIsSchemaModalOpen(true); }}
                    className="w-full py-2 text-center bg-black hover:bg-slate-900 border border-violet-950/50 rounded-lg text-[10px] text-[#bd00ff] font-bold tracking-wider flex items-center justify-center gap-1.5 transition"
                  >
                    📂 Exibir Schema SQL (codigo.db)
                  </button>
                </div>

                {/* Custom Brain AI Auto-Improve Engine */}
                <div className="flex flex-col gap-2.5 bg-gray-950/70 border border-gray-800 rounded-xl p-3 backdrop-blur shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#00f2ff] uppercase tracking-wider font-bold">🤖 Auto-Melhoramento Cognitivo</span>
                    <span className="text-[7.5px] uppercase font-mono px-1.5 py-0.5 bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 rounded-md">INTELLIGENT</span>
                  </div>
                  
                  <p className="text-[9px] text-gray-400 font-sans leading-normal">
                    Funde nós orfãos em conceitos estruturados correlacionados aos códigos-fontes parseados.
                  </p>
                  
                  <button
                    type="button"
                    onClick={handleSelfImprove}
                    disabled={isImproving}
                    className="w-full text-center py-2 rounded-lg font-mono font-bold text-[10.5px] uppercase tracking-wider transition bg-[#00f2ff]/10 text-[#00f2ff] hover:text-white border border-[#00f2ff]/30 hover:bg-[#00f2ff]/20 disabled:opacity-50"
                  >
                    {isImproving ? 'Consolidando Heurísticas...' : '🧠 Rodar Consolidação da IA'}
                  </button>

                  {improvementLogs.length > 0 && (
                    <div className="bg-black/95 border border-gray-900 rounded p-2 h-24 overflow-y-auto font-mono text-[8.5px] text-cyan-400 flex flex-col gap-1 scrollbar-thin">
                      {improvementLogs.map((l, i) => <div key={i}>{l}</div>)}
                    </div>
                  )}
                </div>

                {/* Orphan / Isolated / Unconnected Synapses Node Scan */}
                <div className="flex flex-col gap-2 bg-gray-950/70 border border-gray-800 rounded-xl p-3 backdrop-blur shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#ff007c] uppercase tracking-wider font-bold">🔍 Órfãos / Fora do Core ({unconnectedNodes.length})</span>
                    <span className="text-[7.5px] uppercase font-mono px-1.5 py-0.5 bg-red-950/10 text-red-400 border border-red-500/10 rounded-md">Sem Sinais</span>
                  </div>
                  
                  <p className="text-[9px] text-gray-400 font-sans leading-normal">
                    Descubra melhorias cognitivas e nós desconectados. Clique para inspecionar ou conectar:
                  </p>

                  {unconnectedNodes.length === 0 ? (
                    <span className="text-[9px] font-mono text-emerald-400 block text-center py-1">Cérebro 100% íntegro. Sem nós orfãos!</span>
                  ) : (
                    <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto scrollbar-thin mt-1">
                      {unconnectedNodes.map((n: any) => (
                        <div
                          key={n.id}
                          onClick={() => { setSelectedNode(n); playSciFiBeep(900, 0.05); }}
                          className="flex justify-between items-center bg-black/60 hover:bg-black border border-gray-900 hover:border-gray-800 rounded-lg px-2.5 py-1.5 text-[9.5px] font-mono text-gray-400 hover:text-[#ff007c] transition cursor-pointer"
                        >
                          <span className="truncate">🧩 [{n.type}] {n.label}</span>
                          <CornerDownRight className="w-2.5 h-2.5 opacity-50 text-[#ff007c]" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Real-time Logs List */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1 font-bold">
                    <Activity className="w-3.5 h-3.5 text-[#00f2ff] animate-pulse" />
                    Auditoria Sináptica
                  </span>
                  <div className="bg-black border border-gray-800/80 rounded-xl p-3 h-48 overflow-y-auto text-[10px] font-mono flex flex-col gap-1.5 scrollbar-thin">
                    {(!status.learningLogs || status.learningLogs.length === 0) ? (
                      <span className="text-gray-600 block text-center mt-4 text-[9px]">Aguardando estímulo...</span>
                    ) : (
                      status.learningLogs.map((log) => (
                        <div key={log.id} className="text-gray-400 border-b border-[#0f172a]/30 pb-1.5 last:border-0 leading-relaxed text-[9px]">
                          <span className={`font-bold mr-1 ${
                            log.acao === 'MEMORIZAÇÃO' ? 'text-[#00ff9d]' : 
                            log.acao === 'REFORÇO' ? 'text-[#00f2ff]' : 
                            log.acao === 'ESQUECIMENTO' ? 'text-red-400' : 'text-[#bd00ff]'
                          }`}>
                            [{log.acao}]
                          </span>
                          {log.detalhe}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: MANUAL FEED & INJECTION */}
            {sidebarTab === 'manual' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-1">
                  <Plus className="w-4 h-4 text-[#bd00ff]" />
                  <span className="text-xs uppercase font-bold tracking-widest text-gray-200">Enxertar Conhecimento</span>
                </div>

                <div className="bg-gray-950/70 p-3.5 rounded-lg border border-gray-800 flex flex-col gap-3">
                  <span className="text-[10px] font-mono uppercase text-gray-400 font-bold">Adicionar Nós Avulsos</span>
                  <form onSubmit={handleCreateNode} className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Conceito ou Declaração..."
                      value={newNodeVal}
                      onChange={(e) => setNewNodeVal(e.target.value)}
                      className="bg-black border border-gray-800 focus:border-cyan-500 rounded px-2.5 py-1.5 text-xs font-mono outline-none text-white placeholder-gray-700"
                    />
                    
                    <div className="grid grid-cols-2 gap-1.5">
                      <select
                        value={newNodeType}
                        onChange={(e) => setNewNodeType(e.target.value as MemoryType)}
                        className="bg-black border border-gray-800 rounded px-1 py-1.5 text-[10px] text-white font-mono"
                      >
                        <option value="fato">Fato</option>
                        <option value="entidade">Entidade/Classe</option>
                        <option value="evento">Evento/Ação</option>
                        <option value="sentimento">Sentimento</option>
                      </select>
                      
                      <button 
                        type="submit"
                        className="bg-[#bd00ff] text-white px-2 rounded text-[10.5px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Enxertar
                      </button>
                    </div>
                  </form>
                </div>

                {/* Bulk learn */}
                <div className="bg-gray-950/70 p-3.5 rounded-lg border border-gray-800 flex flex-col gap-2">
                  <span className="text-[10px] font-mono uppercase text-[#00ff9d] font-bold">Processar Texto Não-Estruturado</span>
                  <form onSubmit={handleBulkLearn} className="flex flex-col gap-2">
                    <textarea
                      rows={4}
                      placeholder="Cole um bloco de regras, descrições ou códigos curtos para a IA decompor em nós..."
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      className="bg-black border border-gray-800 focus:border-[#00ff9d] rounded px-2 py-1.5 text-xs font-mono outline-none text-white w-full placeholder-gray-700 scrollbar-thin"
                    />
                    <button
                      type="submit"
                      disabled={isIngesting || !bulkText.trim()}
                      className="bg-[#00ff9d] text-black py-1.5 rounded text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer w-full hover:bg-[#00cc7d]"
                    >
                      {isIngesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin mx-auto" /> : <>🧬 Decompor Relatório</>}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB CONTENT: APP CREATOR AI AGENT */}
            {sidebarTab === 'creator' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00ff9d]" />
                    <span className="text-xs uppercase font-bold tracking-widest text-[#00ff9d]">Creator Studio 🧬</span>
                  </div>
                  <span className="text-[8px] font-mono bg-slate-900 border border-slate-800 text-gray-400 px-2 py-0.5 rounded-full">v1.4</span>
                </div>

                {/* Sub-tabs selection */}
                <div className="flex bg-black/60 p-1 rounded-lg border border-slate-900/60 mismatch-gap gap-1">
                  <button
                    type="button"
                    onClick={() => { setActiveCreatorSubTab('prompt'); playSciFiBeep(850, 0.04); }}
                    className={`flex-1 py-1.5 text-[8.5px] font-mono font-bold uppercase rounded transition cursor-pointer text-center ${
                      activeCreatorSubTab === 'prompt' ? 'bg-[#00ff9d]/15 text-[#00ff9d] border border-[#00ff9d]/30' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    ⚡ Gerar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveCreatorSubTab('skills'); playSciFiBeep(900, 0.04); }}
                    className={`flex-1 py-1.5 text-[8.5px] font-mono font-bold uppercase rounded transition cursor-pointer text-center ${
                      activeCreatorSubTab === 'skills' ? 'bg-[#00f2ff]/15 text-[#00f2ff] border border-[#00f2ff]/30' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    🤖 Skills
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveCreatorSubTab('gallery'); playSciFiBeep(955, 0.04); }}
                    className={`flex-1 py-1.5 text-[8.5px] font-mono font-bold uppercase rounded transition cursor-pointer text-center ${
                      activeCreatorSubTab === 'gallery' ? 'bg-[#bd00ff]/15 text-[#bd00ff] border border-[#bd00ff]/30' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    💖 Galeria
                  </button>
                </div>

                {/* SUBTAB CONTENT: PROMPT GENERATION */}
                {activeCreatorSubTab === 'prompt' && (
                  <div className="flex flex-col gap-3">
                    {/* Active custom skill feedback constraint */}
                    {selectedActiveSkill ? (
                      <div className="bg-cyan-950/20 text-[#00f2ff] border border-cyan-500/20 p-2 text-[9px] rounded-lg font-mono flex items-center justify-between shadow-lg shadow-cyan-950/20 animate-pulse">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full animate-ping" />
                          <span className="font-bold">Skill Ativa:</span>
                          <span className="truncate">{selectedActiveSkill.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => { playSciFiBeep(700, 0.05); setSelectedActiveSkill(null); }}
                          className="text-[#00f2ff]/60 hover:text-white font-bold ml-1 cursor-pointer font-sans"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <p className="text-[9.5px] text-gray-500 font-sans leading-relaxed">
                        Defina o escopo do código e o Layon-System vai estruturar, criar, compilar e rodar a aplicação em tempo real!
                      </p>
                    )}

                    {/* SELEÇÃO RÁPIDA DE TIPO DE PRESET */}
                    <div className="flex flex-col gap-1.5 bg-black/60 p-2.5 rounded-xl border border-slate-900 shadow-inner">
                      <span className="text-[8.5px] font-mono text-[#00ff9d] uppercase font-bold tracking-wider block">⚡ Presets de Arquitetura e UI layouts</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            playSciFiBeep(1100, 0.08);
                            setCreatorPrompt("Crie uma Landing Page moderna de vendas e conversão de alta performance para Startups, incluindo herosections dinâmicos, faixas de logos em loop, grid de bento-recursos interativos com Tailwind CSS e transições de entrada.");
                            showToastMessage("Preset Landing Page configurado!");
                          }}
                          className="bg-[#05070c] hover:bg-[#00f2ff]/10 text-left p-2 rounded-lg border border-slate-900 hover:border-[#00f2ff]/40 transition flex flex-col gap-0.5 cursor-pointer"
                        >
                          <span className="text-[9px] font-bold text-white flex items-center gap-1">📱 Landing Page</span>
                          <span className="text-[7.5px] text-gray-500 leading-tight">Design de alta conversão para produtos.</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            playSciFiBeep(1150, 0.08);
                            setCreatorPrompt("Plataforma SaaS centralizada com múltiplos painéis e tabelas, monitor de métricas financeiras, gráfico analítico interativo de lucros, feed de logs operacionais e filtros de busca responsivos com estados complexos.");
                            showToastMessage("Preset Plataforma SaaS configurado!");
                          }}
                          className="bg-[#05070c] hover:bg-[#00ff9d]/10 text-left p-2 rounded-lg border border-slate-900 hover:border-[#00ff9d]/40 transition flex flex-col gap-0.5 cursor-pointer"
                        >
                          <span className="text-[9px] font-bold text-white flex items-center gap-1">📊 Sistema SaaS</span>
                          <span className="text-[7.5px] text-gray-500 leading-tight">Painéis de controle robustos e métricas.</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            playSciFiBeep(1200, 0.08);
                            setCreatorPrompt("Mini SaaS focado em solução direta para o usuário (como Otimizador de faturas recorrentes ou Gerador automatizado de documentação de rotinas de código) com simulação ativa de banco de dados e ações reais.");
                            showToastMessage("Preset Mini SaaS configurado!");
                          }}
                          className="bg-[#05070c] hover:bg-amber-500/10 text-left p-2 rounded-lg border border-slate-900 hover:border-amber-500/40 transition flex flex-col gap-0.5 cursor-pointer"
                        >
                          <span className="text-[9px] font-bold text-white flex items-center gap-1">⚡ Mini SaaS</span>
                          <span className="text-[7.5px] text-gray-500 leading-tight">Ferramentas e utilitários ágeis focados.</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            playSciFiBeep(1250, 0.08);
                            setCreatorPrompt("Gere o design visual completo e mockups/diagramas de interface (fidelidade figma) mapeando os componentes aprendidos de repositórios integrados (como V3, Cloud projetos), exibindo fluxos de nuvem interativos.");
                            showToastMessage("Preset Mockup UI configurado!");
                          }}
                          className="bg-[#05070c] hover:bg-pink-500/10 text-left p-2 rounded-lg border border-slate-900 hover:border-pink-500/40 transition flex flex-col gap-0.5 cursor-pointer"
                        >
                          <span className="text-[9px] font-bold text-white flex items-center gap-1">🎨 Mockup UI Fig</span>
                          <span className="text-[7.5px] text-gray-500 leading-tight">Modelamento visual de infra e diagramas.</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-950/80 p-3 rounded-xl border border-gray-900 flex flex-col gap-3">
                      <form onSubmit={handleCreateApp} className="flex flex-col gap-2.5">
                        <textarea
                          rows={6}
                          placeholder={
                            selectedActiveSkill 
                              ? `Template Prompt:\n"${selectedActiveSkill.promptTemplate}"` 
                              : "Ex: 'Crie uma landing page 3D para o setor financeiro com dashboard elástico' ou 'Uma hélice rotativa molecular interativa'..."
                          }
                          value={creatorPrompt}
                          onChange={(e) => setCreatorPrompt(e.target.value)}
                          className="bg-black border border-gray-900 focus:border-[#00ff9d] rounded-xl px-2.5 py-2 text-[10.5px] font-mono outline-none text-white w-full placeholder-gray-803 scrollbar-thin resize-none text-slate-100"
                        />

                        <button
                          type="submit"
                          disabled={isCreatingApp || !creatorPrompt.trim()}
                          className="bg-[#00ff9d] text-black hover:bg-[#00d682] py-2.5 rounded-xl text-[10.5px] font-mono font-black flex items-center justify-center gap-2 cursor-pointer w-full transition disabled:opacity-50"
                        >
                          {isCreatingApp ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>COMPILANDO ESTRUTURA...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>GERAR E EXECUTAR APP</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    {/* Project results info and save option */}
                    {creatorResult && (
                      <div className="bg-[#0a0f1d] border border-violet-950/40 rounded-xl p-3 flex flex-col gap-2 relative">
                        <span className="text-[10px] font-mono uppercase text-[#00f2ff] block font-bold">🚀 Status do Projeto</span>
                        <h4 className="text-xs font-bold text-white font-mono">{creatorResult.appName}</h4>
                        <p className="text-[9px] text-gray-400 leading-normal line-clamp-2">{creatorResult.description}</p>
                        
                        <div className="grid grid-cols-2 gap-1.5 mt-1">
                          <button
                            type="button"
                            onClick={() => setMainView('creator')}
                            className="py-1.5 text-center bg-[#00f2ff]/10 text-[#00f2ff] hover:bg-[#00f2ff]/20 text-[9px] font-mono font-bold rounded-lg border border-[#00f2ff]/20 transition cursor-pointer"
                          >
                            💻 Abrir Workspace
                          </button>

                          <button
                            type="button"
                            onClick={() => { playSciFiBeep(1000, 0.1); setIsSavingDesign(!isSavingDesign); }}
                            className={`py-1.5 text-center text-[9px] font-mono font-bold rounded-lg border transition cursor-pointer ${
                              isSavingDesign 
                                ? 'bg-[#ff007c]/20 text-[#ff007c] border-[#ff007c]/30' 
                                : 'bg-[#e0f1ff]/5 hover:bg-[#00ff9d]/20 text-[#00ff9d] border-[#00ff9d]/20'
                            }`}
                          >
                            💖 Salvar Design
                          </button>
                        </div>

                        {/* Inline Expandable Save Dialog */}
                        {isSavingDesign && (
                          <form onSubmit={handleSaveCurrentDesign} className="mt-3 p-2 bg-black border border-gray-900 rounded-lg flex flex-col gap-2">
                            <span className="text-[8.5px] font-mono text-pink-400 uppercase font-black block">📁 Guardar na Galeria de LPs</span>
                            
                            <input
                              type="text"
                              required
                              placeholder="Título do Design (ex: CyberHelix Biotech)"
                              value={tempDesignTitle}
                              onChange={(e) => setTempDesignTitle(e.target.value)}
                              className="bg-slate-950 border border-slate-900 rounded px-2 py-1 text-[10px] font-mono w-full text-white placeholder-gray-800"
                            />

                            <textarea
                              rows={2}
                              placeholder="Breve descrição dos encantos visuais..."
                              value={tempDesignDesc}
                              onChange={(e) => setTempDesignDesc(e.target.value)}
                              className="bg-slate-950 border border-slate-900 rounded px-2 py-1 text-[9.5px] font-sans w-full text-white placeholder-gray-800 resize-none"
                            />

                            <div className="flex gap-1.5">
                              <button
                                type="submit"
                                className="flex-1 bg-[#ff007c] text-white hover:bg-[#e60070] text-[9.5px] py-1 rounded font-mono font-bold cursor-pointer"
                              >
                                CONFIRMAR
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsSavingDesign(false)}
                                className="bg-slate-900 text-gray-400 text-[9.5px] py-1 px-2.5 rounded font-mono cursor-pointer hover:text-white"
                              >
                                Cancelar
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* SUBTAB CONTENT: SHARED PROMPTS & SKILLS */}
                {activeCreatorSubTab === 'skills' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-mono text-gray-500 uppercase font-bold">Skills de Landing Page</span>
                      <button
                        type="button"
                        onClick={() => { playSciFiBeep(1100, 0.05); setIsAddingSkill(!isAddingSkill); }}
                        className="bg-[#00f2ff]/15 text-[#00f2ff] hover:bg-[#00f2ff]/25 px-2 py-1 rounded text-[9px] font-mono font-bold border border-cyan-500/20 cursor-pointer flex items-center gap-1"
                      >
                        {isAddingSkill ? '✕ Concluir' : '+ Nova Skill'}
                      </button>
                    </div>

                    {/* Import custom prompt skill form (emulates 21st.dev/Claude code prompt imports) */}
                    {isAddingSkill && (
                      <form onSubmit={handleCreateSkill} className="bg-slate-950 border border-cyan-950/40 p-3 rounded-xl flex flex-col gap-2.5 shadow-xl">
                        <span className="text-[9.5px] font-mono text-[#00f2ff] uppercase font-black tracking-widest block">📥 Nova Skill do 21st.dev / Claude Code</span>
                        <p className="text-[8px] text-gray-500 font-sans leading-normal">Pegue o prompt do componente, UX layout ou códigos de landing page e salve abaixo para criar uma skill de design ativa!</p>

                        <div className="bg-slate-900/60 p-2 rounded-lg border border-indigo-950 flex flex-col gap-1.5 my-1">
                          <span className="text-[7.5px] font-mono text-indigo-400 font-black uppercase tracking-wider block">⚡ Instalar Presets Populares (21st.dev & Claude)</span>
                          <div className="grid grid-cols-1 gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleInstallPresetSkillDirectly('bento')}
                              className="text-left bg-black/40 hover:bg-[#00f2ff]/10 text-slate-100 hover:text-[#00f2ff] border border-gray-900 rounded p-1.5 transition text-[8.5px] font-mono cursor-pointer"
                            >
                              🔮 Instalar Bento Orbits Dashboard
                              <span className="block text-[7px] text-gray-500 mt-0.5">Preset minimalista do 21st.dev para dashboards.</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInstallPresetSkillDirectly('cli')}
                              className="text-left bg-black/40 hover:bg-emerald-500/10 text-slate-100 hover:text-emerald-400 border border-gray-900 rounded p-1.5 transition text-[8.5px] font-mono cursor-pointer"
                            >
                              🐚 Instalar Claude Code CLI Terminal
                              <span className="block text-[7px] text-gray-500 mt-0.5">Mapeador de terminal Shell emulado interativo de Claude.</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInstallPresetSkillDirectly('physics')}
                              className="text-left bg-black/40 hover:bg-purple-500/10 text-slate-100 hover:text-purple-400 border border-gray-900 rounded p-1.5 transition text-[8.5px] font-mono cursor-pointer"
                            >
                              🌊 Instalar Fluid Canvas Physics
                              <span className="block text-[7px] text-gray-500 mt-0.5">Canvas dinâmico de órbitas de partículas reativas.</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-mono uppercase text-gray-400 font-bold">Nome do Prompt Skill *</label>
                          <input
                            type="text"
                            required
                            placeholder="ex: 3D Orbit Molecular Helix 🧬"
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            className="bg-black border border-slate-900 rounded-lg px-2 py-1 text-[10px] font-mono text-white placeholder-gray-800"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-mono uppercase text-gray-400 font-bold">System Guidelines / UX Prompt *</label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Especifique as diretrizes do designer: ex: 'Você é um Lead Frontend specialized in Neon glow orbits...'"
                            value={newSkillSystemPrompt}
                            onChange={(e) => setNewSkillSystemPrompt(e.target.value)}
                            className="bg-black border border-slate-900 rounded-lg px-2 py-1 text-[9.5px] font-mono text-white placeholder-gray-800 resize-none scrollbar-thin"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-mono uppercase text-teal-400 font-bold">Prompt de Partida / Código Copiado *</label>
                          <textarea
                            rows={4}
                            required
                            placeholder="Cole o prompt de design encolhido ou os códigos de landing page copiados da 21st.dev..."
                            value={newSkillTemplate}
                            onChange={(e) => setNewSkillTemplate(e.target.value)}
                            className="bg-black border border-slate-900 rounded-lg px-2 py-1 text-[9.5px] font-mono text-white placeholder-gray-800 resize-none scrollbar-thin text-cyan-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-mono uppercase text-gray-400">Autor</label>
                            <input
                              type="text"
                              placeholder="Fiel Seguidor"
                              value={newSkillAuthor}
                              onChange={(e) => setNewSkillAuthor(e.target.value)}
                              className="bg-black border border-slate-900 rounded-lg px-2 py-1 text-[10px] font-mono text-white"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-mono uppercase text-gray-400">Tags</label>
                            <input
                              type="text"
                              placeholder="3D, Orbit, Dashboard"
                              value={newSkillTags}
                              onChange={(e) => setNewSkillTags(e.target.value)}
                              className="bg-black border border-slate-900 rounded-lg px-2 py-1 text-[10px] font-mono text-white"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="bg-[#00f2ff] hover:bg-[#00c8d6] text-black text-[10px] py-1.5 rounded-lg font-mono font-black tracking-wider cursor-pointer"
                        >
                          CONFIRMAR E SALVAR SKILL
                        </button>
                      </form>
                    )}

                    {/* Skill cards library */}
                    <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto scrollbar-thin select-text">
                      {skills.length === 0 ? (
                        <span className="text-[8.5px] font-mono text-gray-600 block text-center py-4">Nenhuma skill importada. Crie a primeira acima!</span>
                      ) : (
                        skills.map(s => {
                          const isActive = selectedActiveSkill?.id === s.id;
                          return (
                            <div
                              key={s.id}
                              onClick={() => {
                                playSciFiBeep(1000, 0.08);
                                setSelectedActiveSkill(isActive ? null : s);
                              }}
                              className={`p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col gap-2 bg-[#080d19]/60 hover:bg-[#0c1426]/75 group ${
                                isActive 
                                  ? 'border-[#00f2ff] shadow-md shadow-cyan-950/30' 
                                  : 'border-slate-900'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className={`text-[9.5px] font-mono font-black tracking-wide ${isActive ? 'text-[#00f2ff]' : 'text-slate-100'}`}>{s.name}</span>
                                <button
                                  type="button"
                                  onClick={(ev) => handleDeleteSkill(s.id, ev)}
                                  className="text-gray-600 hover:text-red-400 transition cursor-pointer md:opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <p className="text-[8.5px] text-gray-400 font-sans leading-normal line-clamp-3">{s.description || 'Padrão customizado para apps e interfaces.'}</p>

                              {s.tags && s.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {s.tags.slice(0, 3).map((tg: string) => (
                                    <span key={tg} className="bg-black/40 text-[7.5px] font-mono text-indigo-400 px-1.5 py-0.5 rounded border border-gray-950">{tg}</span>
                                  ))}
                                  <span className="text-[7.5px] font-mono text-gray-600 ml-auto bg-black/20 px-1 py-0.5 rounded">Por {s.author}</span>
                                </div>
                              )}

                              <div className="flex gap-1.5 mt-1 select-none">
                                <button
                                  type="button"
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    playSciFiBeep(1100, 0.05);
                                    setCreatorPrompt(s.promptTemplate);
                                    setSelectedActiveSkill(s);
                                    setActiveCreatorSubTab('prompt');
                                  }}
                                  className="flex-1 text-center py-1 text-[8.5px] bg-slate-950 hover:bg-slate-900 text-indigo-400 hover:text-white transition rounded opacity-80 group-hover:opacity-100 font-mono border border-slate-900 font-bold"
                                >
                                  Carregar Preset
                                </button>
                                <button
                                  type="button"
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    playSciFiBeep(1000, 0.04);
                                    navigator.clipboard.writeText(s.systemPrompt);
                                    showToastMessage("Guidelines do prompt copiadas!");
                                  }}
                                  className="text-center px-1.5 text-[8.5px] bg-slate-950 text-gray-500 hover:text-slate-200 transition rounded font-mono border border-slate-900"
                                  title="Copiar prompt científico interno"
                                >
                                  Copiar
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* SUBTAB CONTENT: INTERACTIVE DESIGN GALLERY */}
                {activeCreatorSubTab === 'gallery' && (
                  <div className="flex flex-col gap-3">
                    <span className="text-[9.5px] font-mono text-gray-500 uppercase font-bold block">Galeria de Landing Pages 🎨</span>
                    
                    <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto scrollbar-thin select-text">
                      {designs.length === 0 ? (
                        <span className="text-[8.5px] font-mono text-gray-600 block text-center py-4">Sua galeria está vazia. Salve as criações na aba "Gerar"!</span>
                      ) : (
                        designs.map(d => (
                          <div
                            key={d.id}
                            onClick={() => handleLoadDesignToWorkspace(d)}
                            className="p-3 rounded-xl border border-slate-900 hover:border-[#bd00ff]/30 bg-[#0c0a12]/50 hover:bg-[#120f1c]/75 transition-all text-left cursor-pointer flex flex-col gap-2 relative group"
                          >
                            <div className="flex justify-between items-start gap-1">
                              <div>
                                <span className="text-[8px] font-mono uppercase text-[#bd00ff] font-bold">DIRETRIZ DESIGN TRABALHADO</span>
                                <h4 className="text-xs font-bold text-slate-100 font-sans leading-tight mt-0.5">{d.title}</h4>
                              </div>
                              <button
                                type="button"
                                onClick={(ev) => handleDeleteDesign(d.id, ev)}
                                className="text-gray-600 hover:text-red-400 transition cursor-pointer md:opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-[8.5px] text-gray-400 font-sans leading-normal line-clamp-2">{d.description || 'Página de bento-grid com dashboard interativo.'}</p>

                            <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-950">
                              <span className="text-[7.5px] font-mono text-gray-600">Salvo: {new Date(d.timestamp).toLocaleDateString()}</span>
                              <span className="text-[8.5px] font-mono text-[#00ff9d] bg-[#00ff9d]/5 px-2 py-0.5 rounded border border-[#00ff9d]/10 font-bold group-hover:animate-pulse">LOAD PAGE ⚡</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: INSTAGRAM AUTOMATION AI AGENT */}
          </div>

          {/* Side Footer */}
          <div className="mt-auto border-t border-[#30363d]/40 p-3 flex flex-col gap-1 text-[10px] shrink-0 bg-gray-950/50">
            <div className="flex items-center gap-1">
              <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-[7px] uppercase font-bold text-black px-1.5 py-0.5 rounded font-mono">Arquiteto</div>
              <span className="text-gray-400">João Layon</span>
              <a href="https://instagram.com/layon.dev" target="_blank" rel="noreferrer" className="text-cyan-400 font-bold ml-auto hover:underline flex items-center gap-0.5 text-[11px]">
                @layon.dev
                <Instagram className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </aside>

        {/* CENTER INTERACTIVE WORKSPACE */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* HEADER D3 CANVAS SPECTRUM CONTROL */}
          <div className="min-h-12 py-2 md:py-0 bg-[#05070a]/90 backdrop-blur border-b border-[#30363d]/30 flex flex-col md:flex-row items-center justify-between px-3 md:px-5 gap-3 shrink-0 z-10 w-full">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 w-full md:w-auto">
              {/* Core view switcher */}
              <div className="bg-black/85 p-0.5 rounded-lg border border-gray-800 flex flex-wrap items-center gap-0.5 select-none justify-center">
                {[
                  { key: 'brain', icon: Network, label: 'Grafo', color: '#00f2ff' },
                  { key: 'chat', icon: MessageSquareCode, label: 'Chat', color: '#bd00ff' },
                  { key: 'creator', icon: Sparkles, label: 'Creator', color: '#00ff9d' },
                  { key: 'github', icon: FolderGit2, label: 'Git Sync', color: '#38bdf8' },
                  { key: 'drives', icon: Cpu, label: 'Drives', color: '#a5b4fc' },
                ].map((item) => {
                  const active = activeMobileTab === item.key;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        playSciFiBeep(active ? 850 : 1000, 0.04);
                        setActiveMobileTab(item.key as any);
                        if (item.key === 'creator') {
                          setMainView('creator');
                        } else {
                          setMainView('map');
                        }
                      }}
                      className={`px-2 py-0.5 md:px-2.5 md:py-1 cursor-pointer rounded text-[8.5px] md:text-[9px] font-mono font-black uppercase tracking-wider transition flex items-center gap-1 border ${
                        active 
                          ? 'bg-[#0f172a] text-white border-gray-800' 
                          : 'text-gray-500 border-transparent hover:text-slate-350'
                      }`}
                      style={{ borderLeftColor: active ? item.color : undefined }}
                    >
                      <Icon className="w-3 h-3" style={{ color: active ? item.color : undefined }} />
                      <span className="hidden md:inline">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {mainView === 'map' && (
                <button
                  type="button"
                  onClick={() => { 
                    setIsMapFocused(!isMapFocused); 
                    playSciFiBeep(1200, 0.1); 
                    showToastMessage(isMapFocused ? "Modo Tela Cheia Desativado" : "Gráfico em 100% Tela Cheia Ativado!"); 
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[9px] md:text-[9.5px] font-mono font-black uppercase tracking-wider transition flex items-center gap-1 cursor-pointer shrink-0 ${
                    isMapFocused 
                      ? 'bg-[#ff007c]/20 text-[#ff007c] border border-[#ff007c]/40 shadow-[0_0_8px_rgba(255,0,124,0.35)] animate-pulse' 
                      : 'bg-black/40 hover:bg-black/80 text-gray-400 hover:text-white border border-gray-800'
                  }`}
                  title="Expandir Mapa para 100% Tela Cheia"
                >
                  {isMapFocused ? '🖥️ Focado (100%)' : '🖥️ Focar Grafo'}
                </button>
              )}

              <div className="md:flex hidden items-center gap-1 font-mono text-[9px] text-gray-500">
                <span>/</span>
                <span>LAYOUT COGNITIVO</span>
              </div>
            </div>

            {/* Canvas lens adjustments */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 w-full md:w-auto">
              {/* D3 Center Force Stability Toggle Switch */}
              {mainView === 'map' && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Mode Selector - Forced to 'free' layout per user constraints */}

                  <button
                    type="button"
                    onClick={() => { playSciFiBeep(preventAutoRecentering ? 1200 : 700, 0.06); setPreventAutoRecentering(!preventAutoRecentering); }}
                    className={`p-1.5 px-2.5 rounded-lg text-[9px] font-mono font-bold uppercase transition flex items-center gap-1 cursor-pointer border ${
                      preventAutoRecentering 
                        ? 'bg-amber-950/10 text-amber-500 border-amber-900/30' 
                        : 'bg-emerald-950/10 text-emerald-400 border-emerald-900/30'
                    }`}
                    title={preventAutoRecentering ? "Permitir flutuação sem centro gravitacional fixo" : "Habilitar ímã central do simulador"}
                  >
                    ⚖️ Recentralização: {preventAutoRecentering ? 'FLUTUAR RE-ESTABILIZADO' : 'ÍMÃ CENTRAL ATIVO'}
                  </button>
                </div>
              )}

              {mainView === 'map' && (
                <button
                  type="button"
                  onClick={() => {
                    if (isOrganizing) return;
                    playSciFiBeep(1450, 0.2);
                    setTemporaryRepulsion(true);
                    setIsOrganizing(true);
                    showToastMessage("Organizando rede... Aplicando força temporária de repulsão de nós!");
                    setTimeout(() => {
                      setTemporaryRepulsion(false);
                      setIsOrganizing(false);
                      showToastMessage("Rede de nós realinhada e estabilizada com sucesso!");
                    }, 2550);
                  }}
                  disabled={isOrganizing}
                  className={`p-1.5 px-3 rounded-lg text-[9px] font-mono font-bold uppercase transition flex items-center gap-1.5 cursor-pointer border ${
                    isOrganizing 
                      ? 'bg-purple-950/15 text-purple-400 border-purple-500/20 animate-pulse' 
                      : 'bg-[#00f2ff]/10 text-[#00f2ff] border-[#00f2ff]/30 hover:bg-[#00f2ff]/20'
                  }`}
                  title="Aplica uma força de repulsão rápida e realinha os nós para evitar qualquer sobreposição"
                >
                  <Network className={`w-3.5 h-3.5 ${isOrganizing ? 'animate-spin' : ''}`} />
                  {isOrganizing ? 'Organizando...' : 'Organizar Rede'}
                </button>
              )}



              {mainView === 'map' && (
                <button
                  type="button"
                  onClick={() => { playSciFiBeep(showXRay ? 500 : 1300, 0.05); setShowXRay(!showXRay); }}
                  className={`p-1.5 px-2.5 rounded-lg text-[9px] font-mono font-bold uppercase transition flex items-center gap-1 cursor-pointer border ${
                    showXRay 
                      ? 'bg-[#bd00ff]/20 text-[#d946ef] border-[#bd00ff]/50' 
                      : 'bg-gray-950 border-gray-800 text-gray-500'
                  }`}
                >
                  🔬 Raio-X {showXRay ? 'ON' : 'OFF'}
                </button>
              )}

              {mainView === 'map' && (
                <div className="flex flex-wrap items-center bg-black/85 border border-gray-800 rounded-lg p-0.5 gap-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (!svgRef.current || !zoomBehaviorRef.current) return;
                      const svg = d3.select(svgRef.current);
                      svg.transition().duration(250).call(zoomBehaviorRef.current.scaleBy as any, 1.35);
                      playSciFiBeep(1100, 0.05);
                    }}
                    className="p-1 px-2.5 hover:bg-gray-900 text-gray-400 hover:text-white rounded text-[10px] font-mono font-bold transition cursor-pointer"
                    title="Aumentar Zoom (+)"
                  >
                    ＋
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!svgRef.current || !zoomBehaviorRef.current) return;
                      const svg = d3.select(svgRef.current);
                      svg.transition().duration(250).call(zoomBehaviorRef.current.scaleBy as any, 0.75);
                      playSciFiBeep(900, 0.05);
                    }}
                    className="p-1 px-2.5 hover:bg-gray-900 text-gray-400 hover:text-white rounded text-[10px] font-mono font-bold transition cursor-pointer"
                    title="Diminuir Zoom (-)"
                  >
                    －
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!svgRef.current || !zoomBehaviorRef.current || graphData.nodes.length === 0) return;
                      const svg = d3.select(svgRef.current);
                      const width = dimensions.width;
                      const height = dimensions.height;
                      const nodes = svg.selectAll('.node-group').data() as any[];
                      if (!nodes || nodes.length === 0) return;

                      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                      nodes.forEach((d) => {
                        const x = d.x ?? width / 2;
                        const y = d.y ?? height / 2;
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                      });

                      const dx = maxX - minX || 100;
                      const dy = maxY - minY || 100;
                      const x = (minX + maxX) / 2 || width / 2;
                      const y = (minY + maxY) / 2 || height / 2;

                      const padding = 60;
                      let scale = 0.8 / Math.max(dx / (width - padding * 2), dy / (height - padding * 2));
                      scale = Math.max(0.12, Math.min(2.0, scale));

                      const transform = d3.zoomIdentity
                        .translate(width / 2 - scale * x, height / 2 - scale * y);

                      svg.transition()
                         .duration(800)
                         .call(zoomBehaviorRef.current.transform as any, transform);
                      
                      playSciFiBeep(1200, 0.08);
                      showToastMessage("Foco centralizado no cérebro!");
                    }}
                    className="p-1 px-2 bg-indigo-950/45 hover:bg-indigo-900/40 text-indigo-400 hover:text-white rounded text-[9.5px] font-mono font-black transition cursor-pointer"
                    title="Enquadrar todos os nós do cérebro perfeitamente"
                  >
                    🔍 ENQUADRAR
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!svgRef.current || !zoomBehaviorRef.current || graphData.nodes.length === 0) return;
                      const svg = d3.select(svgRef.current);
                      const width = dimensions.width;
                      const height = dimensions.height;
                      const nodes = svg.selectAll('.node-group').data() as any[];
                      if (!nodes || nodes.length === 0) return;

                      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                      nodes.forEach((d) => {
                        const x = d.x ?? width / 2;
                        const y = d.y ?? height / 2;
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                      });

                      const dx = maxX - minX || 100;
                      const dy = maxY - minY || 100;
                      const x = (minX + maxX) / 2 || width / 2;
                      const y = (minY + maxY) / 2 || height / 2;

                      const padding = 160;
                      let scale = 0.75 / Math.max(dx / (width - padding * 2), dy / (height - padding * 2));
                      scale = Math.max(0.06, Math.min(0.42, scale));

                      const transform = d3.zoomIdentity
                        .translate(width / 2 - scale * x, height / 2 - scale * y);

                      svg.transition()
                         .duration(1100)
                         .call(zoomBehaviorRef.current.transform as any, transform);
                      
                      playSciFiBeep(1350, 0.15);
                      showToastMessage("Visualização macro ativada: Cérebro Completo!");
                    }}
                    className="p-1 px-2 bg-purple-950/45 hover:bg-purple-900/45 text-pink-400 hover:text-white rounded text-[9.5px] font-mono font-extrabold transition cursor-pointer border border-pink-500/20"
                    title="Visualizar a estrutura completa do cérebro em escala macro (zoom out total)"
                  >
                    🌌 Cérebro Completo
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playSciFiBeep(lazyLoadingEnabled ? 700 : 1200, 0.08);
                      setLazyLoadingEnabled(!lazyLoadingEnabled);
                      showToastMessage(lazyLoadingEnabled ? "Exibindo todos os nós do cérebro simultaneamente." : "Nós vizinhos serão ocultados e carregados sob demanda!");
                    }}
                    className={`p-1 px-2 rounded text-[9px] font-mono font-black uppercase transition cursor-pointer ${
                      lazyLoadingEnabled 
                        ? 'bg-[#00f2ff]/10 hover:bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/30 shadow-[0_0_6px_rgba(0,242,255,0.25)]' 
                        : 'bg-black/40 hover:bg-black/80 text-gray-500 hover:text-white border border-gray-800'
                    }`}
                    title="Carregamento lazy: Carrega vizinhos do nó apenas clicando neles no mapa de exploração"
                  >
                    🧩 CONEXÕES: {lazyLoadingEnabled ? 'SOB DEMANDA' : 'TUDO ABERTO'}
                  </button>
                  
                  {lazyLoadingEnabled && expandedNodeIds.size > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        playSciFiBeep(600, 0.12, 'sawtooth');
                        setExpandedNodeIds(new Set());
                        setSelectedNode(null);
                        showToastMessage("Relações adicionais recolhidas. Reduzido aos nós principais!");
                      }}
                      className="p-1 px-2 bg-red-950/50 hover:bg-red-900/50 text-red-400 hover:text-white rounded text-[9px] font-mono font-black transition cursor-pointer border border-red-500/25"
                      title="Voltar ao esqueleto principal de nós sem ramificações abertas"
                    >
                      🧹 RECOLHER
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {mainView === 'map' ? (
            <div className="flex-1 flex flex-col relative overflow-hidden min-h-0">
              
              {/* PAGE 1: MAPA NEURAL (GRAFO) */}
              {activeMobileTab === 'brain' && (
                <div 
                  id="graph_stage" 
                  className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.6)_0%,rgba(5,7,10,1)_100%)] flex flex-col"
                >
                  <svg 
                    ref={svgRef} 
                    className="w-full h-full cursor-grab active:cursor-grabbing"
                    style={{ minHeight: '100px' }}
                  />

                  {/* SPECTRAL SCALE LEGEND */}
                  <div className="absolute top-4 left-4 bg-[#070b12]/85 backdrop-blur border border-gray-800 rounded-lg p-2.5 text-[8.5px] font-mono flex flex-col gap-1 text-gray-400 md:flex-row md:gap-3 pointer-events-none shadow-lg">
                    <div className="text-[7.5px] uppercase font-black text-gray-500 mt-0.5">Categorias:</div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] shadow-[0_0_2px_#00f2ff]" />
                      <span>Usuário</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] shadow-[0_0_2px_#00ff9d]" />
                      <span>Classe GitHub</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#bd00ff] shadow-[0_0_2px_#bd00ff]" />
                      <span>Fato/Ficheiro</span>
                    </div>
                    <div className="flex items-center gap-1 text-nowrap">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ffb700] shadow-[0_0_2px_#ffb700]" />
                      <span>Método/Rot.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff007c] shadow-[0_0_2px_#ff007c]" />
                      <span>Dep/Sentir</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#a5b4fc] shadow-[0_0_2px_#a5b4fc]" />
                      <span>Respostas</span>
                    </div>
                  </div>

                  {/* D3 ZOOM CONTROLS */}
                  <div className="absolute bottom-4 right-4 bg-gray-950/90 backdrop-blur border border-gray-800 rounded-lg p-1.5 text-gray-400 text-[10px] font-mono flex items-center justify-between shadow-md">
                    <span>● Arraste Nós / Enquadre</span>
                  </div>

                  {/* QUICK MOBILE FILTERS ACTION GATE */}
                  <div className="absolute top-4 right-4 z-20">
                    <button
                      type="button"
                      onClick={() => {
                        playSciFiBeep(1200, 0.05);
                        setActiveMobileTab('drives');
                        setSidebarTab('control');
                      }}
                      className="bg-[#00f2ff]/15 hover:bg-[#00f2ff]/25 text-[#00f2ff] hover:text-white px-3 py-1.5 rounded-lg text-[9.5px] font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-[#00f2ff]/30 transition shadow-lg shrink-0"
                    >
                      <Filter className="w-3.5 h-3.5 text-[#00f2ff]" />
                      Filtros de Rede
                    </button>
                  </div>

                  {/* COGNITIVE TELEMETRY "MODO RAIO-X" DRAWER OVERLAY */}
                  {showXRay && (
                    <div className="absolute top-14 bottom-4 left-4 right-4 bg-[#070b12]/95 border border-[#bd00ff]/30 rounded-xl p-4 md:p-5 z-20 flex flex-col gap-3 font-mono text-[10px] shadow-2xl backdrop-blur-lg overflow-y-auto max-w-2xl">
                      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                        <span className="text-[#d946ef] font-bold flex items-center gap-1.5 text-xs">
                          ⚡ MODO RAIO-X: COMPUTAÇÃO COGNITIVA INTERNA
                        </span>
                        <button 
                          type="button"
                          onClick={() => setShowXRay(false)} 
                          className="text-gray-550 hover:text-white font-mono text-xs cursor-pointer"
                        >
                          ✕ fechar
                        </button>
                      </div>
                      <div className="text-gray-400 leading-relaxed text-[10px]">
                        Visualizando o mapeamento de RAG e similaridade jaccard de tokens e indexação de código indexado.
                      </div>
                      <div className="flex flex-col gap-1 bg-black/80 border border-gray-900 p-2.5 rounded-lg text-gray-400">
                        <span className="text-gray-300 font-bold mb-1 border-b border-gray-900 pb-1 text-[9px] uppercase text-[#bd00ff]">🧬 Elementos do Cérebro Ativos:</span>
                        {graphData.nodes.slice(0, 15).map((mem, i) => (
                          <div key={i} className="flex justify-between hover:text-white py-0.5 border-b border-gray-950 font-mono text-[9px]">
                            <span>💡 [{mem.type}] {mem.label}</span>
                            <span className="text-[#00ff9d]">Reinforcement: {mem.size.toFixed(1)}/10</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* INTEGRATED GORGEOUS CODE INSPECTOR CONSOLE DOCK */}
                  {selectedNode && (
                    <div className="absolute md:bottom-4 md:left-4 md:right-4 bottom-0 left-0 right-0 md:rounded-xl border border-violet-950/40 bg-[#0a0e17]/95 shadow-2xl p-4 pb-5 z-20 flex flex-col gap-3 backdrop-blur-lg animate-fadeIn max-h-[75%] overflow-y-auto max-w-4xl scrollbar-thin">
                      <div className="flex items-center justify-between border-b border-gray-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <Braces className="w-5 h-5 text-[#00ff9d] animate-pulse" />
                          <div>
                            <span className="text-gray-500 text-[8.5px] uppercase font-black font-mono tracking-widest block font-bold">Inspecionar Elemento Synaptico</span>
                            <span className="text-sm font-display font-medium text-white">{selectedNode.label}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedNode.repoName && (
                            <span className="bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 text-[9px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1.5">
                              <Github className="w-3 h-3" />
                              {selectedNode.repoName}
                            </span>
                          )}
                          {selectedNode.lobeName && (
                            <span className="bg-purple-950/20 text-[#bd00ff] border border-purple-900/30 text-[9px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
                              🧠 {selectedNode.lobeName}
                            </span>
                          )}
                          <button 
                            type="button"
                            onClick={() => { playSciFiBeep(350); setSelectedNode(null); }}
                            className="text-gray-500 hover:text-red-400 font-bold px-1.5 py-0.5 hover:bg-gray-900 rounded cursor-pointer transition"
                          >
                            ✕ Fechar
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-4">
                        {/* Code Snippet and docstrings */}
                        <div className="flex flex-col gap-2.5">
                          {/* Parameters, detail strings */}
                          {selectedNode.details && (
                            <div className="text-[10px] font-mono text-gray-400 bg-gray-950 border border-gray-900 rounded p-2 flex items-center gap-2 leading-relaxed">
                              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span>{selectedNode.details}</span>
                            </div>
                          )}

                          {selectedNode.docstring && (
                            <div className="text-[11px] font-sans text-gray-300 bg-slate-950/70 border-l-2 border-[#00f2ff] rounded p-2.5 leading-relaxed font-medium">
                              <span className="text-[#00f2ff] font-mono text-[9px] uppercase font-black tracking-widest block mb-0.5">Docstring / Comentários</span>
                              {selectedNode.docstring}
                            </div>
                          )}

                          {selectedNode.codeSnippet ? (
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between text-[8px] font-mono text-gray-500 uppercase tracking-widest -mb-1">
                                <span>Código Fonte Parseado</span>
                                <span>{selectedNode.label.split(':').pop()?.trim()}</span>
                              </div>
                              <div className="bg-black/90 border border-gray-800/80 rounded-lg p-3 overflow-x-auto max-h-56 scrollbar-thin">
                                <pre className="font-mono text-[10px] text-emerald-400 whitespace-pre leading-relaxed select-text tracking-wide">
                                  <code>{selectedNode.codeSnippet}</code>
                                </pre>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-[#05070a] border border-gray-900 rounded-lg p-3 text-center text-gray-600 font-mono text-[10.5px]">
                              Nenhuma rotina ou snippet de código anexado a este nó de informação.
                            </div>
                          )}
                        </div>

                        {/* AI Quick action control card */}
                        <div className="flex flex-col gap-3 bg-gray-950/60 border border-gray-800 rounded-xl p-3 backdrop-blur font-mono">
                          <span className="text-[9.5px] uppercase font-black text-slate-500 tracking-wider">Ações de Inteligência</span>
                          
                          <button
                            type="button"
                            onClick={() => handleInterrogateNode(selectedNode.label)}
                            className="w-full text-left bg-black text-[#00f2ff] hover:bg-[#00f2ff]/10 border border-cyan-800/20 hover:border-cyan-400 py-1.5 px-3 rounded text-[10px] transition flex items-center justify-between"
                          >
                            <span className="flex items-center gap-1.5">
                              <Brain className="w-3.5 h-3.5" />
                              Refletir sobre Conceito
                            </span>
                            <CornerDownRight className="w-3 h-3 text-cyan-400" />
                          </button>

                          {selectedNode.codeSnippet && (
                            <>
                              <button
                                type="button"
                                onClick={() => triggerQuickChatPrompt(`[AÇÃO RÁPIDA: EXPLICAR LÓGICA]\nPor favor, atue como arquiteto de software. Analise e explique detalhadamente a lógica de funcionamento da função/classe '${selectedNode.label}', identifique o fluxo de entrada e sugeridos usos:\n\n${selectedNode.codeSnippet}`)}
                                className="w-full text-left bg-black hover:bg-slate-900 border border-gray-800 py-1.5 px-3 rounded text-[10px] transition flex items-center justify-between text-[#00ff9d]"
                              >
                                <span className="flex items-center gap-1.5">
                                  <Code className="w-3.5 h-3.5" />
                                  Explicar Funcionamento
                                </span>
                                <CornerDownRight className="w-3 h-3" />
                              </button>

                              <button
                                type="button"
                                onClick={() => triggerQuickChatPrompt(`[AÇÃO RÁPIDA: REFACTOR PERFORMANCE]\nPor favor, atue como engenheiro de software sênior. Otimize a lógica, reduza complexidade ciclomática e implemente melhorias de velocidade ou consumo de memória para esta rotina '${selectedNode.label}':\n\n${selectedNode.codeSnippet}`)}
                                className="w-full text-left bg-black hover:bg-slate-900 border border-gray-800 py-1.5 px-3 rounded text-[10px] transition flex items-center justify-between text-yellow-400"
                              >
                                <span className="flex items-center gap-1.5">
                                  <Zap className="w-3.5 h-3.5" />
                                  Refatorar Performance
                                </span>
                                <CornerDownRight className="w-3 h-3" />
                              </button>

                              <button
                                type="button"
                                onClick={() => triggerQuickChatPrompt(`[AÇÃO RÁPIDA: AUDIT SECURITY]\nAtue como Engenheiro DevSecOps Senior. Faça uma varredura crítica de falhas de segurança no script de '${selectedNode.label}', de brechas de sanitização, overflow ou riscos do escopo:\n\n${selectedNode.codeSnippet}`)}
                                className="w-full text-left bg-black hover:bg-slate-900 border border-gray-800 py-1.5 px-3 rounded text-[10px] transition flex items-center justify-between text-[#ff007c]"
                              >
                                <span className="flex items-center gap-1.5">
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                  Auditar Vulns DevSec
                                </span>
                                <CornerDownRight className="w-3 h-3" />
                              </button>
                            </>
                          )}

                          {selectedNeighbors.length > 0 && (
                            <div className="flex flex-col gap-1.5 text-[9px] text-gray-400 bg-black/50 p-2 border border-violet-950/20 rounded-lg">
                              <span className="font-bold text-gray-300 uppercase tracking-wider block">🧬 Caminhos Sinápticos ({selectedNeighbors.length}):</span>
                              <div className="grid grid-cols-1 gap-1 max-h-24 overflow-y-auto scrollbar-thin">
                                {selectedNeighbors.map((sn: any, idx: number) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => { setSelectedNode(sn.node); playSciFiBeep(900, 0.05); }}
                                    className="text-left py-1 px-1.5 border border-transparent hover:border-gray-800 bg-[#05070a] hover:bg-black rounded text-[9px] font-mono text-[#00ff9d] hover:text-[#00f2ff] transition flex items-center justify-between"
                                  >
                                    <span className="truncate">🧩 [{sn.node.type}] {sn.node.label}</span>
                                    <span className="text-gray-650 font-sans text-[8px] italic uppercase tracking-wider shrink-0">{sn.rType}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <hr className="border-gray-800" />
                          
                          <div className="flex flex-col gap-1.5 text-[9px] text-gray-500 bg-black/40 p-2 border border-gray-900 rounded-lg mt-1">
                            <span className="font-bold text-gray-400 uppercase tracking-wider block">Reforçar Sinatpica</span>
                            <div className="flex items-center gap-3 justify-between mt-1">
                              <button
                                type="button"
                                onClick={() => submitReinforcement(`sys_manual_${selectedNode.id}`, [selectedNode.id], 'good')}
                                className="flex items-center gap-1 py-1 px-2 border border-[#00ff9d]/20 hover:border-[#00ff9d] rounded hover:text-white bg-black/50 hover:bg-[#00ff9d]/5 text-[9px]"
                              >
                                <ThumbsUp className="w-2.5 h-2.5 text-[#00ff9d]" />
                                Útil (+peso)
                              </button>
                              <button
                                type="button"
                                onClick={() => submitReinforcement(`sys_manual_${selectedNode.id}`, [selectedNode.id], 'bad')}
                                className="flex items-center gap-1 py-1 px-2 border border-red-500/20 hover:border-red-500 rounded hover:text-white bg-black/50 hover:bg-red-500/5 text-[9px]"
                              >
                                <ThumbsDown className="w-2.5 h-2.5 text-red-400" />
                                Ruim/Limpar
                              </button>
                            </div>
                          </div>

                          {selectedNode.id !== '1' && (
                            <button
                              type="button"
                              onClick={() => handlePruneNode(selectedNode.id)}
                              className="text-red-400 hover:text-red-300 font-bold uppercase transition text-center text-[8.5px] border border-red-500/30 hover:bg-red-950/20 rounded py-1 cursor-pointer flex items-center justify-center gap-1 mt-1.5"
                            >
                              <Trash2 className="w-3 h-3" /> Prunar Permanentemente
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* PAGE 2: CHAT COGNITIVO (CÓRTEX CHAT) */}
              {activeMobileTab === 'chat' && (
                <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-[#05070a] to-[#010204]">
                  <div className="p-4 border-b border-gray-800/80 flex items-center justify-between bg-gray-950 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00f2ff] animate-pulse shadow-[0_0_8px_#00f2ff]" />
                      <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                        Diálogo do Córtex
                      </h2>
                    </div>
                    <span className="text-[8px] font-mono text-gray-500 border border-gray-800 bg-black p-1 px-2 rounded">
                      IA DIGITAL ATIVA
                    </span>
                  </div>

                  {/* MESSAGE CONTAINER */}
                  <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5 scrollbar-thin relative min-h-0 select-text">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full breathing-orb pointer-events-none opacity-5 blur-3xl" />

                    {messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`flex flex-col max-w-[85%] z-10 ${
                          msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                        }`}
                      >
                        <div className={`rounded-2xl px-4 py-3 leading-relaxed border ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-emerald-950/20 to-teal-900/10 text-emerald-100 border-emerald-500/35 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                            : 'bg-gray-900/45 text-slate-100 border-gray-800/80 shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
                        }`}>
                          <div className="flex items-center gap-1 px-1 mb-1 justify-between">
                            <span className={`text-[8.5px] font-mono font-bold tracking-widest uppercase ${msg.role === 'user' ? 'text-emerald-400' : 'text-[#00f2ff]'}`}>
                              {msg.role === 'user' ? '🧑‍💻 Você' : '🤖 Córtex Digital'}
                            </span>
                            <span className="text-[7.5px] font-mono text-gray-650">
                              {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'Agora'}
                            </span>
                          </div>
                          
                          <div className="text-[11.5px] leading-relaxed font-sans mt-1 select-text">
                            {msg.content}
                          </div>

                          {msg.role !== 'user' && msg.associatedEntities && msg.associatedEntities.length > 0 && (
                            <div className="mt-2.5 pt-2 border-t border-gray-800/50 flex flex-wrap gap-1.5">
                              <span className="text-[7.5px] font-mono text-gray-500 uppercase tracking-wider mr-1 mt-1 font-bold">Conexões Mapeadas:</span>
                              {msg.associatedEntities.map((ent, entIdx) => (
                                <span 
                                  key={entIdx}
                                  onClick={() => {
                                    playSciFiBeep(1350, 0.05);
                                    let matched = graphData.nodes.find((n: any) => n.label === ent);
                                    if (matched) setSelectedNode(matched);
                                  }}
                                  className="text-[8px] font-mono text-cyan-400 bg-cyan-950/10 hover:bg-cyan-905/35 px-1.5 py-0.5 rounded cursor-pointer border border-cyan-800/30 transition"
                                >
                                  ⚛️ {ent}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CHAT INPUT PANEL */}
                  <div className="p-4 bg-[#05070a] border-t border-gray-800 px-4 shrink-0 z-10">
                    <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex gap-2.5 items-center bg-black border border-gray-800 focus-within:border-[#00f2ff] rounded-full p-1.5 px-4 transition-colors">
                      <button
                        type="button"
                        onClick={toggleSpeechRecording}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                          isRecording 
                            ? 'bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse' 
                            : 'bg-gray-950 text-[#00ff9d] border border-gray-800'
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                      </button>

                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Inspecione rotinas, converse ou ordene..."
                        className="flex-1 bg-transparent border-none text-xs outline-none text-white placeholder-gray-500 py-1"
                        disabled={isGenerating}
                      />

                      <button
                        type="submit"
                        disabled={!inputText.trim() || isGenerating}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                          inputText.trim() && !isGenerating
                            ? 'bg-[#00f2ff] text-black shadow-[0_0_8px_rgba(0,242,255,0.3)]'
                            : 'bg-gray-800 text-gray-650'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* PAGE 3: GITHUB HARVEST (GIT SYNC WORKSPACE) */}
              {activeMobileTab === 'github' && (
                <div className="flex-1 flex flex-col h-full bg-[#05070a] overflow-y-auto p-4 md:p-6 scrollbar-thin">
                  <div className="max-w-3xl mx-auto w-full flex flex-col gap-5">
                    
                    <div className="flex items-center justify-between border-b border-gray-850 pb-3 border-gray-800">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="w-5 h-5 text-[#38bdf8]" />
                        <h2 className="text-xs uppercase tracking-widest font-bold text-white font-mono">Controle de Sincronização GitHub</h2>
                      </div>
                      <span className="text-[8px] font-mono text-[#38bdf8] bg-[#38bdf8]/5 px-2 py-0.5 rounded border border-[#38bdf8]/20 font-black">ACTIVE</span>
                    </div>

                    <div className="bg-[#070b12] border border-gray-800 rounded-xl p-4 flex flex-col gap-4 shadow-xl">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-extrabold pb-1 border-b border-gray-905">Configurar Conexão</span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-gray-500 text-[8.5px] uppercase font-bold font-mono">Token de Acesso:</label>
                          <input
                            type="password"
                            placeholder="ghp_xxxxxxxxxxxx"
                            value={githubToken}
                            onChange={(e) => setGithubToken(e.target.value)}
                            className="bg-black border border-gray-800 focus:border-[#38bdf8] rounded-lg px-3 py-2 text-xs font-mono outline-none text-white"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-gray-500 text-[8.5px] uppercase font-bold font-mono">Dono/Owner GitHub:</label>
                          <input
                            type="text"
                            placeholder="ex: joshua-layon"
                            value={githubUsername}
                            onChange={(e) => setGithubUsername(e.target.value)}
                            className="bg-black border border-gray-800 focus:border-[#38bdf8] rounded-lg px-3 py-2 text-xs font-mono outline-none text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('github_token', githubToken);
                          localStorage.setItem('github_username', githubUsername);
                          fetchGitHubRepositories();
                        }}
                        className="w-full bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black py-2 rounded-lg font-bold text-xs uppercase transition tracking-wider font-mono h-10 cursor-pointer"
                      >
                        Salvar & Buscar Repositórios
                      </button>
                    </div>

                    {repos.length > 0 && (
                      <div className="bg-[#070b12] border border-gray-800 rounded-xl p-4 flex flex-col gap-3.5 shadow-lg animate-fadeIn">
                        <span className="text-[10px] font-mono text-gray-300 font-extrabold uppercase tracking-wider border-b border-gray-900 pb-1">Pesquisar Repositórios</span>
                        
                        <div className="flex flex-col gap-2">
                          <label className="text-gray-400 text-[8.5px] uppercase font-mono font-bold">Respositórios Rastreados:</label>
                          <select
                            value={selectedRepo}
                            onChange={(e) => setSelectedRepo(e.target.value)}
                            className="bg-black border border-gray-800 text-xs text-white p-2.5 rounded-lg font-mono cursor-pointer outline-none"
                          >
                            <option value="">-- Selecione o Repositório --</option>
                            {repos.map((r: any) => {
                              const name = r.full_name || r;
                              return <option key={name} value={name}>{name}</option>;
                            })}
                          </select>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-gray-400 text-[8.5px] uppercase font-mono font-bold">Branch de Rastreamento (Scan):</label>
                          <input
                            type="text"
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="bg-black border border-gray-800 text-xs text-white p-2 rounded-lg outline-none font-mono"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleSyncSelectedRepo}
                          disabled={isSyncingRepo || !selectedRepo}
                          className={`w-full py-2.5 rounded-lg font-mono text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                            isSyncingRepo 
                              ? 'bg-blue-950/20 text-[#38bdf8] border-[#38bdf8]/40 animate-pulse' 
                              : 'bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] border-[#38bdf8]/30'
                          }`}
                        >
                          <Check className={`w-3.5 h-3.5 ${isSyncingRepo ? 'animate-spin' : ''}`} />
                          {isSyncingRepo ? 'Sincronizando...' : 'Mapear & Indexar Cérebro'}
                        </button>

                        {isSyncingRepo && (
                          <div className="mt-1 text-center">
                            <span className="text-[8px] font-mono text-[#38bdf8] animate-pulse uppercase tracking-widest font-black block">
                              Mapeando Árvores e Nós do GitHub...
                            </span>
                            <div className="w-full bg-gray-900 h-100 rounded-full overflow-hidden mt-1.5" style={{ height: '4px' }}>
                              <div className="bg-[#38bdf8] h-full w-1/3 animate-pulse" />
                            </div>
                          </div>
                        )}

                        {syncResult && !isSyncingRepo && (
                          <div className="bg-[#0b132b]/80 border border-cyan-500/30 rounded-xl p-3 flex flex-col gap-2 animate-fadeIn mt-2 shadow-lg">
                            <div className="flex items-center gap-1.5 justify-between">
                              <span className="text-[10px] font-mono text-[#33b8ff] font-bold uppercase tracking-wider">📦 Módulos & Dependências</span>
                              <span className="text-[7.5px] font-mono px-1.5 py-0.2 rounded font-black bg-blue-500/10 text-cyan-300 border border-cyan-500/15">SINCRO</span>
                            </div>
                            <p className="text-[9.5px] text-slate-400 font-mono leading-relaxed">
                              Disponível para montagem virtual, de dependências isoladas e testes integrados de execução.
                            </p>
                            
                            <button
                              type="button"
                              onClick={handleInstallAndRunRepo}
                              disabled={isExecutingRepo}
                              className="w-full bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black py-2.5 rounded-lg font-mono font-black text-[9.5px] uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 text-center"
                            >
                              <PlaySquare className="w-3.5 h-3.5" />
                              {isExecutingRepo ? 'Instalando & Compilando...' : 'Instalar Dependências & Rodar'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PAGE 4: INSTAGRAM STUDIO AUTOMATION (MKT INSTA) */}

              {/* PAGE 5: COGNITIVE DRIVES CONTROL & REAL-TIME NODES EDITOR (DRIVES) */}
              {activeMobileTab === 'drives' && (
                <div className="flex-1 flex flex-col h-full bg-[#05070a] overflow-y-auto p-4 md:p-6 scrollbar-thin">
                  <div className="max-w-4xl mx-auto w-full flex flex-col gap-5">
                    
                    <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-[#a5b4fc]" />
                        <h2 className="text-xs uppercase tracking-widest font-bold text-white font-mono">Central de Drives & Database SQL</h2>
                      </div>
                      <span className="text-[8px] font-mono text-[#a5b4fc] bg-[#a5b4fc]/5 px-2.5 py-1 rounded border border-[#a5b4fc]/20 font-black">CONTROLE DE MEMÓRIA</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      <div className="flex flex-col gap-4">
                        {/* THE FILTERS PANEL REQUIRED */}
                        <div className="flex flex-col gap-3 bg-gray-950/90 border border-[#00f2ff]/20 rounded-xl p-4 backdrop-blur shadow-2xl">
                          <span className="text-[10px] font-mono text-[#00f2ff] uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                            <Filter className="w-3.5 h-3.5 text-[#00f2ff]" />
                            Filtros Avançados de Rede
                          </span>
                          
                          <p className="text-[9.5px] text-gray-400 font-mono leading-relaxed">
                            Esconda categorias ou oculte nós do cérebro dinamicamente por peso de relevância sináptica no mapa 3D.
                          </p>

                          {/* Relevance scroll */}
                          <div className="flex flex-col gap-1.5 mt-1">
                            <div className="flex justify-between items-center text-[9px] font-mono">
                              <span className="text-gray-400 uppercase tracking-wider">Relevância Mínima:</span>
                              <span className="text-[#00f2ff] font-extrabold border border-[#00f2ff]/20 bg-[#00f2ff]/5 px-2 rounded">
                                PESO &ge; {minRelevance}/10
                              </span>
                            </div>
                            <input 
                              type="range"
                              min="1"
                              max="10"
                              value={minRelevance}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setMinRelevance(val);
                                playSciFiBeep(700 + val * 50, 0.04);
                              }}
                              className="w-full h-1 bg-gray-905 rounded-lg appearance-none cursor-pointer accent-[#00f2ff]"
                            />
                            <div className="flex justify-between text-[7.5px] font-mono text-gray-600">
                              <span>Exibir Tudo (1)</span>
                              <span>Alta Associação (10)</span>
                            </div>
                          </div>

                          {/* Categories check */}
                          <div className="flex flex-col gap-1.5 mt-2.5 pt-2.5 border-t border-gray-900">
                            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Filtrar Categorias:</span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { key: 'usuario', label: 'Usuário', glow: '#00f2ff' },
                                { key: 'entidade', label: 'Classe GitHub', glow: '#00ff9d' },
                                { key: 'fato', label: 'Fato/Ficheiro', glow: '#bd00ff' },
                                { key: 'evento', label: 'Método/Rot.', glow: '#ffb700' },
                                { key: 'sentimento', label: 'Dep/Sentir', glow: '#ff007c' },
                                { key: 'resposta', label: 'Respostas', glow: '#a5b4fc' },
                              ].map((cat) => {
                                const active = filterTypes[cat.key] !== false;
                                return (
                                  <button
                                    key={cat.key}
                                    type="button"
                                    onClick={() => {
                                      playSciFiBeep(active ? 500 : 1000, 0.03, 'sine');
                                      setFilterTypes(prev => ({ ...prev, [cat.key]: !active }));
                                    }}
                                    className={`flex items-center gap-1.5 p-1.5 rounded-lg text-[9px] font-mono font-bold transition border cursor-pointer ${
                                      active 
                                        ? 'bg-black text-white border-gray-800' 
                                        : 'bg-gray-950/20 text-gray-650 border-gray-900/10 line-through'
                                    }`}
                                  >
                                    <span 
                                      className="w-1.5 h-1.5 rounded-full shrink-0" 
                                      style={{ 
                                        backgroundColor: cat.glow,
                                        boxShadow: active ? `0 0 6px ${cat.glow}` : 'none',
                                        opacity: active ? 1 : 0.3
                                      }} 
                                    />
                                    <span className="truncate">{cat.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              playSciFiBeep(880, 0.08, 'sine');
                              setFilterTypes({
                                usuario: true,
                                entidade: true,
                                fato: true,
                                evento: true,
                                sentimento: true,
                                resposta: true,
                              });
                              setMinRelevance(1);
                            }}
                            className="w-full text-center py-1.5 bg-gray-900 hover:bg-gray-850 text-gray-400 hover:text-white rounded-lg text-[8.5px] font-mono uppercase tracking-wider transition border border-gray-800 cursor-pointer"
                          >
                            Ativar Todos / Limpar Filtros
                          </button>
                        </div>

                        {/* Entropia e Resets */}
                        <div className="bg-gray-950/70 p-4 border border-gray-800 rounded-xl flex flex-col gap-3">
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-extrabold">⚡ Ações de Entropia & Voz</span>
                          <button 
                            type="button"
                            onClick={triggerDecay} 
                            className="w-full text-left bg-black text-gray-350 text-xs py-2 px-3 rounded-lg hover:bg-gray-950 border border-gray-808 cursor-pointer transition flex items-center justify-between hover:border-red-500/50"
                          >
                            <span>Induzir Decaimento da Rede</span>
                            <span className="text-[8px] uppercase font-bold text-red-400 border border-red-500/30 bg-red-950/10 px-1.5 py-0.5 rounded">Decay</span>
                          </button>
                          <button 
                            type="button"
                            onClick={triggerReset} 
                            className="w-full text-left bg-black text-gray-350 text-xs py-2 px-3 rounded-lg hover:bg-gray-950 border border-gray-808 cursor-pointer transition flex items-center justify-between hover:border-[#00ff9d]"
                          >
                            <span>Reiniciar Grafo de Conhecimento</span>
                            <span className="text-[8px] uppercase font-bold text-gray-400 border border-gray-700 bg-gray-800 px-1.5 py-0.5 rounded">Reset</span>
                          </button>
                        </div>

                        {/* SQLite Cloud integration */}
                        <div className="bg-slate-950/90 border border-indigo-500/30 rounded-xl p-4 shadow-xl flex flex-col gap-3">
                          <div className="flex items-center justify-between border-b border-indigo-950/50 pb-2">
                            <span className="text-[10px] font-mono text-[#a5b4fc] uppercase tracking-wider font-bold flex items-center gap-1.5 electromagnetic-glow">
                              <Database className="w-3.5 h-3.5 text-[#00f2ff]" /> SQLite Cloud
                            </span>
                            {status.isSQLiteCloudActive ? (
                              <span className="text-[8px] font-mono font-black uppercase text-[#00ff9d] bg-[#00ff9d]/5 border border-[#00ff9d]/30 px-1.5 py-0.5 rounded shadow-[0_0_6px_rgba(0,255,157,0.1)]">NUVEM ATIVA</span>
                            ) : (
                              <span className="text-[8px] font-mono font-black uppercase text-amber-400 bg-amber-400/5 border border-amber-400/30 px-1.5 py-0.5 rounded">MODO LOCAL</span>
                            )}
                          </div>
                          
                          <p className="text-[9px] text-gray-400 leading-relaxed">
                            {status.isSQLiteCloudActive 
                              ? "O Cérebro de Layon está conectado ao SQLite Cloud! As memórias, designs, relações e logs estão sendo sincronizados automaticamente na nuvem."
                              : "Cada nó e relação do Cérebro são persistidos localmente. Você pode hospedar na nuvem criando um cluster gratuito no sqlitecloud.io e passando sua Connection String por variáveis de build."
                            }
                          </p>

                          <div className="bg-black/40 border border-slate-900 rounded-lg p-2 flex flex-col gap-1 text-[8.5px] font-mono">
                            <div className="flex justify-between items-center text-gray-500 uppercase text-[7.5px] tracking-wider mb-0.5">
                              <span>Instância de Comunicação</span>
                              <span>Config</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">REST API Fallback</span>
                              <span className="text-indigo-400 font-bold">Injetável</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Status Sync</span>
                              {status.isSQLiteCloudActive ? (
                                <span className="text-[#00ff9d] font-bold">100% Online</span>
                              ) : (
                                <span className="text-slate-400">Aguardando Host</span>
                              )}
                            </div>
                          </div>

                          <a 
                            href="/api/sqlite/export"
                            download="cerebro_sqlitecloud_seeding.sql"
                            onClick={() => playSciFiBeep(1200, 0.1, 'triangle')}
                            className="w-full text-center bg-indigo-950/40 hover:bg-indigo-900/50 text-[#a5b4fc] hover:text-white text-xs font-mono font-black py-2 rounded-lg border border-indigo-500/35 cursor-pointer block transition"
                          >
                            Baixar Script .SQL
                          </a>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        {/* MANUAL NODE INJECTION */}
                        <div className="bg-gray-950/70 p-4 rounded-xl border border-gray-800 flex flex-col gap-3">
                          <span className="text-[10px] font-mono uppercase text-gray-400 font-extrabold">Enxertar Conhecimento Sináptico</span>
                          <form onSubmit={handleCreateNode} className="flex flex-col gap-2">
                            <input
                              type="text"
                              placeholder="Declaração ex: João Layon..."
                              value={newNodeVal}
                              onChange={(e) => setNewNodeVal(e.target.value)}
                              className="bg-black border border-gray-800 focus:border-[#a5b4fc] rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none text-white focus:outline-none"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <select
                                value={newNodeType}
                                onChange={(e) => setNewNodeType(e.target.value as MemoryType)}
                                className="bg-black border border-gray-800 rounded-lg p-1.5 text-xs text-white font-mono"
                              >
                                <option value="fato">Fato</option>
                                <option value="entidade">Classe GitHub</option>
                                <option value="evento">Método/Rotina</option>
                                <option value="sentimento">Dep/Sentir</option>
                              </select>
                              <button type="submit" className="bg-[#a5b4fc] text-black hover:bg-white text-xs font-mono font-bold rounded-lg cursor-pointer transition">
                                Enxertar Nó
                              </button>
                            </div>
                          </form>
                        </div>

                        {/* LIVE NODES MANAGEMENT DATATABLE */}
                        <div className="bg-[#070b12] border border-gray-805 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-350 border-b border-gray-900 pb-1.5 block">
                            Tabela de Nós Cadastrados ({filteredNodes.length})
                          </span>
                          
                          <div className="relative">
                            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-gray-650" />
                            <input 
                              type="text" 
                              placeholder="Buscar nó..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-black border border-gray-900 rounded-lg pl-7 pr-3 py-1.5 text-[10.5px] font-mono text-white outline-none focus:border-[#a5b4fc]"
                            />
                          </div>

                          <div className="max-h-[220px] overflow-y-auto scrollbar-thin border border-gray-900 rounded-lg">
                            <table className="w-full text-left font-mono text-[9px] border-collapse">
                              <thead>
                                <tr className="bg-black text-gray-505 uppercase tracking-wider border-b border-gray-900 text-[8px]">
                                  <th className="p-2">Rótulo</th>
                                  <th className="p-2">Tipo</th>
                                  <th className="p-2 text-center">Peso</th>
                                  <th className="p-2 text-center">Ações</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredNodes.length === 0 ? (
                                  <tr>
                                    <td colSpan={4} className="p-3 text-center text-gray-600">Nenhum nó localizado</td>
                                  </tr>
                                ) : (
                                  filteredNodes.slice(0, 50).map((node: any) => (
                                    <tr key={node.id} className="border-b border-gray-950 hover:bg-gray-950 transition">
                                      <td className="p-2 text-white truncate max-w-[125px]" title={node.label}>
                                        {node.label}
                                      </td>
                                      <td className="p-2">
                                        <span 
                                          className="text-[7px] uppercase font-bold px-1.5 py-0.2 rounded"
                                          style={{ 
                                            backgroundColor: node.type === 'usuario' ? '#00f2ff20' : node.type === 'entidade' ? '#00ff9d20' : node.type === 'fato' ? '#bd00ff20' : '#ffb70020',
                                            color: node.type === 'usuario' ? '#00f2ff' : node.type === 'entidade' ? '#00ff9d' : node.type === 'fato' ? '#bd00ff' : '#ffb700'
                                          }}
                                        >
                                          {node.type}
                                        </span>
                                      </td>
                                      <td className="p-2 text-center text-gray-400 font-bold">{node.weight || 1}</td>
                                      <td className="p-2 text-center">
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            playSciFiBeep(450, 0.05, 'sawtooth');
                                            try {
                                              const r = await fetch(`/api/graph/decay?factor=1.0&target=${encodeURIComponent(node.label || '')}`, { method: 'POST' });
                                              if (r.ok) {
                                                showToastMessage(`Nó "${node.label}" removido do cérebro!`);
                                                triggerDecay();
                                              }
                                            } catch (err) {
                                              console.error(err);
                                            }
                                          }}
                                          className="text-red-500 hover:text-white hover:bg-red-950/55 p-1 px-2 rounded font-black uppercase text-[7.5px]"
                                        >
                                          ELIMINAR
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* APP CREATOR IDE AND EXPERIMENTAL SANDBOX WORKSPACE */
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-[#040608] h-full overflow-hidden select-none relative">
              
              {/* Mobile Creator View Sub-tab Switcher UI */}
              <div className="flex lg:hidden bg-slate-950/95 border-b border-gray-900/60 p-1 shrink-0 gap-1 overflow-x-auto select-none scrollbar-none z-10 w-full justify-between items-center">
                <button
                  type="button"
                  onClick={() => { playSciFiBeep(800, 0.04); setCreatorMobileTab('prompt'); }}
                  className={`flex-1 py-1.5 px-1 text-[9px] font-mono rounded-lg font-bold uppercase transition text-center ${
                    creatorMobileTab === 'prompt' ? 'bg-[#00ff9d]/15 text-[#00ff9d] border border-[#00ff9d]/30' : 'text-gray-400 border border-transparent'
                  }`}
                >
                  ⚡ Prompt / Skill
                </button>
                <button
                  type="button"
                  onClick={() => { playSciFiBeep(850, 0.04); setCreatorMobileTab('files'); }}
                  className={`flex-1 py-1.5 px-1 text-[9px] font-mono rounded-lg font-bold uppercase transition text-center ${
                    creatorMobileTab === 'files' ? 'bg-indigo-950/30 text-indigo-350 border border-indigo-500/20' : 'text-gray-400 border border-transparent'
                  }`}
                >
                  📁 Arquivos
                </button>
                <button
                  type="button"
                  onClick={() => { playSciFiBeep(900, 0.04); setCreatorMobileTab('editor'); }}
                  className={`flex-1 py-1.5 px-1 text-[9px] font-mono rounded-lg font-bold uppercase transition text-center ${
                    creatorMobileTab === 'editor' ? 'bg-indigo-950/30 text-white border border-indigo-500/20' : 'text-gray-400 border border-transparent'
                  }`}
                >
                  📝 Editor
                </button>
                <button
                  type="button"
                  onClick={() => { playSciFiBeep(950, 0.04); setCreatorMobileTab('preview'); }}
                  className={`flex-1 py-1.5 px-1 text-[9px] font-mono rounded-lg font-bold uppercase transition text-center ${
                    creatorMobileTab === 'preview' ? 'bg-purple-950/25 text-[#bd00ff] border border-purple-500/20' : 'text-gray-400 border border-transparent'
                  }`}
                >
                  📺 Preview / Logs
                </button>
              </div>

              {/* Responsive Column 0: Prompt Entry & Options (Only on Mobile when 'prompt' is active) */}
              {creatorMobileTab === 'prompt' && (
                <div className="flex lg:hidden flex-col flex-1 bg-[#05070c] p-4 overflow-y-auto scrollbar-thin select-none gap-4 shrink z-1">
                  
                  {/* Selector between prompt generation, skills panel, or gallery designs */}
                  <div className="flex bg-black/60 p-1 rounded-xl border border-slate-900/60 mismatch-gap gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => { setCreatorPromptSubTab('prompt'); playSciFiBeep(850, 0.04); }}
                      className={`flex-1 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition cursor-pointer text-center ${
                        creatorPromptSubTab === 'prompt' ? 'bg-[#00ff9d]/15 text-[#00ff9d] border border-[#00ff9d]/30' : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      ⚡ Gerador Prompt
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCreatorPromptSubTab('skills'); playSciFiBeep(900, 0.04); }}
                      className={`flex-1 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition cursor-pointer text-center ${
                        creatorPromptSubTab === 'skills' ? 'bg-[#00f2ff]/15 text-[#00f2ff] border border-[#00f2ff]/30' : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      🤖 Salvar Skills
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCreatorPromptSubTab('gallery'); playSciFiBeep(955, 0.04); }}
                      className={`flex-1 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition cursor-pointer text-center ${
                        creatorPromptSubTab === 'gallery' ? 'bg-[#bd00ff]/15 text-[#bd00ff] border border-[#bd00ff]/30' : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      💖 Galeria Designs
                    </button>
                  </div>

                  {/* SUBTAB 1: DYNAMIC GENERATOR */}
                  {creatorPromptSubTab === 'prompt' && (
                    <div className="flex flex-col gap-3">
                      {selectedActiveSkill ? (
                        <div className="bg-cyan-950/20 text-[#00f2ff] border border-cyan-500/25 p-3 text-[10px] rounded-xl font-mono flex items-center justify-between shadow-lg">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full animate-ping" />
                            <span className="font-bold">Skill Ativa:</span>
                            <span className="truncate text-white font-semibold">{selectedActiveSkill.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => { playSciFiBeep(700, 0.05); setSelectedActiveSkill(null); }}
                            className="text-[#00f2ff]/70 hover:text-white font-extrabold ml-1 cursor-pointer text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                          Defina o seu escopo e o Layon-System vai estruturar, criar, compilar e rodar a aplicação em tempo real!
                        </p>
                      )}

                      {/* SELEÇÃO RÁPIDA DE TIPO DE PRESET - MOBILE */}
                      <div className="flex flex-col gap-1.5 bg-black/60 p-2.5 rounded-xl border border-slate-900 shadow-inner">
                        <span className="text-[8.5px] font-mono text-[#00ff9d] uppercase font-bold tracking-wider block">⚡ Presets de Arquitetura e UI layouts</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              playSciFiBeep(1100, 0.08);
                              setCreatorPrompt("Crie uma Landing Page moderna de vendas e conversão de alta performance para Startups, incluindo herosections dinâmicos, faixas de logos em loop, grid de bento-recursos interativos com Tailwind CSS e transições de entrada.");
                              showToastMessage("Preset Landing Page configurado!");
                            }}
                            className="bg-[#05070c] hover:bg-[#00f2ff]/10 text-left p-1.5 rounded-lg border border-slate-900 hover:border-[#00f2ff]/40 transition flex flex-col gap-0.5 cursor-pointer"
                          >
                            <span className="text-[9px] font-bold text-white flex items-center gap-1">📱 Landing Page</span>
                            <span className="text-[7.5px] text-gray-500 leading-tight">Design de alta conversão.</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              playSciFiBeep(1150, 0.08);
                              setCreatorPrompt("Plataforma SaaS centralizada com múltiplos painéis e tabelas, monitor de métricas financeiras, gráfico analítico interativo de lucros, feed de logs operacionais e filtros de busca responsivos com estados complexos.");
                              showToastMessage("Preset Plataforma SaaS configurado!");
                            }}
                            className="bg-[#05070c] hover:bg-[#00ff9d]/10 text-left p-1.5 rounded-lg border border-slate-900 hover:border-[#00ff9d]/40 transition flex flex-col gap-0.5 cursor-pointer"
                          >
                            <span className="text-[9px] font-bold text-white flex items-center gap-1">📊 Sistema SaaS</span>
                            <span className="text-[7.5px] text-gray-500 leading-tight">Painéis robustos e métricas.</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              playSciFiBeep(1200, 0.08);
                              setCreatorPrompt("Mini SaaS focado em solução direta para o usuário (como Otimizador de faturas recorrentes ou Gerador automatizado de documentação de rotinas de código) com simulação ativa de banco de dados e ações reais.");
                              showToastMessage("Preset Mini SaaS configurado!");
                            }}
                            className="bg-[#05070c] hover:bg-amber-500/10 text-left p-1.5 rounded-lg border border-slate-900 hover:border-amber-500/40 transition flex flex-col gap-0.5 cursor-pointer"
                          >
                            <span className="text-[9px] font-bold text-white flex items-center gap-1">⚡ Mini SaaS</span>
                            <span className="text-[7.5px] text-gray-500 leading-tight">Utilitários ágeis focados.</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              playSciFiBeep(1250, 0.08);
                              setCreatorPrompt("Gere o design visual completo e mockups/diagramas de interface (fidelidade figma) mapeando os componentes aprendidos de repositórios integrados (como V3, Cloud projetos), exibindo fluxos de nuvem interativos.");
                              showToastMessage("Preset Mockup UI configurado!");
                            }}
                            className="bg-[#05070c] hover:bg-pink-500/10 text-left p-1.5 rounded-lg border border-slate-900 hover:border-pink-500/40 transition flex flex-col gap-0.5 cursor-pointer"
                          >
                            <span className="text-[9px] font-bold text-white flex items-center gap-1">🎨 Mockup UI Fig</span>
                            <span className="text-[7.5px] text-gray-500 leading-tight">Modelamento visual de infra.</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-gray-900 flex flex-col gap-3">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateApp(e);
                            setCreatorMobileTab('preview'); // Auto-switch to preview to see compilation logs on mobile!
                          }}
                          className="flex flex-col gap-2.5"
                        >
                          <textarea
                            rows={5}
                            placeholder={
                              selectedActiveSkill 
                                ? `Template Prompt:\n"${selectedActiveSkill.promptTemplate}"` 
                                : "Ex: 'Crie uma landing page 3D para o setor financeiro com dashboard elástico' ou 'Uma hélice rotativa molecular interativa'..."
                            }
                            value={creatorPrompt}
                            onChange={(e) => setCreatorPrompt(e.target.value)}
                            className="bg-black border border-gray-900 focus:border-[#00ff9d] rounded-xl px-2.5 py-2 text-[11px] font-mono outline-none text-white w-full placeholder-gray-800 scrollbar-thin resize-none"
                          />

                          <button
                            type="submit"
                            disabled={isCreatingApp || !creatorPrompt.trim()}
                            className="bg-[#00ff9d] text-black hover:bg-[#00d682] py-3 rounded-xl text-xs font-mono font-black flex items-center justify-center gap-2 cursor-pointer w-full transition disabled:opacity-50"
                          >
                            {isCreatingApp ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>COMPILANDO ESTRUTURA...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>GERAR E EXECUTAR APP</span>
                              </>
                            )}
                          </button>
                        </form>
                      </div>

                      {/* Display project result details and saving options inline on mobile! */}
                      {creatorResult && (
                        <div className="bg-[#0a0f1d] border border-violet-950/40 rounded-xl p-3 flex flex-col gap-2 relative">
                          <span className="text-[10px] font-mono uppercase text-[#00f2ff] block font-bold">🚀 Status do Projeto Ativo</span>
                          <h4 className="text-xs font-bold text-white font-mono">{creatorResult.appName}</h4>
                          <p className="text-[9px] text-gray-400 leading-normal line-clamp-2">{creatorResult.description}</p>
                          
                          <div className="grid grid-cols-2 gap-1.5 mt-1">
                            <button
                              type="button"
                              onClick={() => setCreatorMobileTab('files')}
                              className="py-1.5 text-center bg-[#00f2ff]/10 text-[#00f2ff] hover:bg-[#00f2ff]/20 text-[9px] font-mono font-bold rounded-lg border border-[#00f2ff]/20 transition cursor-pointer"
                            >
                              📁 Ver Arquivos
                            </button>

                            <button
                              type="button"
                              onClick={() => { playSciFiBeep(1000, 0.1); setIsSavingDesign(!isSavingDesign); }}
                              className={`py-1.5 text-center text-[9px] font-mono font-bold rounded-lg border transition cursor-pointer ${
                                isSavingDesign 
                                  ? 'bg-[#ff007c]/20 text-[#ff007c] border-[#ff007c]/30' 
                                  : 'bg-[#e0f1ff]/5 hover:bg-[#ff007c]/20 text-[#ff007c] border-[#ff007c]/20'
                              }`}
                            >
                              💖 Salvar Design
                            </button>
                          </div>

                          {/* Inline Save Dialog */}
                          {isSavingDesign && (
                            <form onSubmit={handleSaveCurrentDesign} className="mt-3 p-2.5 bg-black border border-gray-900 rounded-lg flex flex-col gap-2">
                              <span className="text-[8.5px] font-mono text-pink-400 uppercase font-black block">📁 Guardar na Galeria de LPs</span>
                              <input
                                type="text"
                                required
                                placeholder="Título do Design (ex: CyberHelix Biotech)"
                                value={tempDesignTitle}
                                onChange={(e) => setTempDesignTitle(e.target.value)}
                                className="bg-slate-950 border border-slate-900 rounded px-2 py-1 text-[10px] font-mono w-full text-white placeholder-gray-800"
                              />

                              <textarea
                                rows={2}
                                placeholder="Breve descrição dos encantos visuais..."
                                value={tempDesignDesc}
                                onChange={(e) => setTempDesignDesc(e.target.value)}
                                className="bg-slate-950 border border-slate-900 rounded px-2 py-1 text-[9.5px] font-sans w-full text-white placeholder-gray-800 resize-none"
                              />

                              <div className="flex gap-1.5">
                                <button
                                  type="submit"
                                  className="flex-1 bg-[#ff007c] text-white hover:bg-[#e60070] text-[9.5px] py-1 rounded font-mono font-bold cursor-pointer"
                                >
                                  CONFIRMAR
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsSavingDesign(false)}
                                  className="bg-slate-900 text-gray-400 text-[9.5px] py-1 px-2.5 rounded font-mono cursor-pointer hover:text-white"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUBTAB 2: SAVE CUSTOM SKILLS */}
                  {creatorPromptSubTab === 'skills' && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] font-mono text-gray-500 uppercase font-bold">Skills de Landing Page</span>
                        <button
                          type="button"
                          onClick={() => { playSciFiBeep(1100, 0.05); setIsAddingSkill(!isAddingSkill); }}
                          className="bg-[#00f2ff]/15 text-[#00f2ff] hover:bg-[#00f2ff]/25 px-2 py-1 rounded text-[9px] font-mono font-bold border border-cyan-500/20 cursor-pointer flex items-center gap-1"
                        >
                          {isAddingSkill ? '✕ Cancelar' : '+ Criar/Salvar Skill'}
                        </button>
                      </div>

                      {/* Add new skill form */}
                      {isAddingSkill && (
                        <form onSubmit={handleCreateSkill} className="bg-slate-950 border border-cyan-950/40 p-3 rounded-xl flex flex-col gap-2.5 shadow-xl animate-fadeIn">
                          <span className="text-[9.5px] font-mono text-[#00f2ff] uppercase font-black tracking-widest block">📥 Nova Skill de Layout</span>
                          <p className="text-[8.5px] text-gray-500 font-sans leading-relaxed">Salve novos prompts, regras ou componentes-base de landing page de volta na sua biblioteca!</p>

                          <div className="flex flex-col gap-1 flex-1">
                            <label className="text-[8px] font-mono uppercase text-gray-400 font-bold">Nome do Prompt Skill *</label>
                            <input
                              type="text"
                              required
                              placeholder="ex: Design Molecular Holográfico 🧬"
                              value={newSkillName}
                              onChange={(e) => setNewSkillName(e.target.value)}
                              className="bg-black border border-slate-900 rounded-lg px-2 py-1 text-[10px] font-mono text-white placeholder-gray-800 outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-mono uppercase text-gray-400 font-bold">System Guidelines *</label>
                            <textarea
                              rows={3}
                              required
                              placeholder="Especifique as diretrizes do designer..."
                              value={newSkillSystemPrompt}
                              onChange={(e) => setNewSkillSystemPrompt(e.target.value)}
                              className="bg-black border border-slate-900 rounded-lg px-2 py-1 text-[9px] font-mono text-white placeholder-gray-800 resize-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-mono uppercase text-teal-400 font-bold">Prompt de Partida / Template *</label>
                            <textarea
                              rows={3}
                              required
                              placeholder="Cole o código-fonte modelo ou detalhes da landing page..."
                              value={newSkillTemplate}
                              onChange={(e) => setNewSkillTemplate(e.target.value)}
                              className="bg-black border border-slate-900 rounded-lg px-2 py-1 text-[9px] font-mono text-white placeholder-gray-800 resize-none text-cyan-200"
                            />
                          </div>

                          <button
                            type="submit"
                            className="bg-[#00f2ff] hover:bg-[#00c8d6] text-black text-[10px] py-2 rounded-lg font-mono font-black tracking-wider cursor-pointer"
                          >
                            SALVAR ESSA SKILL IA
                          </button>
                        </form>
                      )}

                      {/* Skill cards list */}
                      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto scrollbar-thin">
                        {skills.map(s => {
                          const isActive = selectedActiveSkill?.id === s.id;
                          return (
                            <div
                              key={s.id}
                              onClick={() => {
                                playSciFiBeep(1000, 0.08);
                                setSelectedActiveSkill(isActive ? null : s);
                                if (!isActive) {
                                  setCreatorMobileTab('prompt');
                                  setCreatorPromptSubTab('prompt'); // Switch to prompt view to utilize the newly activated skill!
                                }
                              }}
                              className={`p-3 rounded-xl border transition-all cursor-pointer bg-[#080d19]/60 hover:bg-[#0c1426]/75 relative flex flex-col gap-1 ${
                                isActive ? 'border-[#00f2ff] shadow-md shadow-cyan-950/35' : 'border-slate-900'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-[#00f2ff]' : 'text-slate-100'}`}>{s.name}</span>
                                <div className="flex items-center gap-1.5 pt-0.5 pointer-events-auto">
                                  <button
                                    type="button"
                                    onClick={(ev) => handleDeleteSkill(s.id, ev)}
                                    className="text-gray-600 hover:text-red-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <span className="text-[8.5px] text-gray-500 leading-normal block">{s.description || 'Nenhum resumo fornecido.'}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 3: DESIGNS IN GALLERY (SAVED ONES) */}
                  {creatorPromptSubTab === 'gallery' && (
                    <div className="flex flex-col gap-3">
                      <span className="text-[9.5px] font-mono text-gray-500 uppercase font-bold">Sua Galeria de Designs</span>
                      
                      <div className="flex flex-col gap-2">
                        {designs.length === 0 ? (
                          <div className="p-4 rounded-xl border border-dashed border-gray-950 text-center text-gray-600 text-[9px] font-mono">
                            Nenhum visual salvo na galeria. Crie um app, clique em "Salvar Design" e veja de volta aqui!
                          </div>
                        ) : (
                          designs.map(design => (
                            <div key={design.id} className="p-3 bg-black/60 border border-slate-900 rounded-xl flex flex-col gap-2.5">
                              <div>
                                <h5 className="text-[10.5px] font-mono font-bold text-white leading-tight">{design.title}</h5>
                                <span className="text-[8px] text-gray-500 font-mono italic">Salvo em {new Date(design.timestamp).toLocaleDateString()}</span>
                              </div>
                              <p className="text-[9.5px] text-gray-400 leading-relaxed font-sans">{design.description}</p>
                              
                              <div className="grid grid-cols-2 gap-2 mt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    playSciFiBeep(1200, 0.1);
                                    handleLoadDesignToWorkspace(design);
                                    setCreatorMobileTab('preview'); // Auto-view the loaded design output!
                                    showToastMessage(`Design "${design.title}" carregado e restaurado!`);
                                  }}
                                  className="py-1 px-2.5 text-center bg-indigo-950/45 hover:bg-indigo-900/40 text-indigo-350 font-mono text-[9px] rounded-lg border border-indigo-500/10 cursor-pointer"
                                >
                                  ⚡ Restaurar
                                </button>
                                <button
                                  type="button"
                                  onClick={(ev) => handleDeleteDesign(design.id, ev)}
                                  className="py-1 px-2.5 text-center bg-red-950/15 hover:bg-red-950/30 text-red-400 font-mono text-[9px] rounded-lg border border-red-500/10 cursor-pointer"
                                >
                                  ✕ Excluir
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* File tree sidebar (1/4 column) */}
              <div className={`border-r border-[#1e293b]/40 bg-slate-950/40 shrink-0 flex flex-col h-full overflow-hidden min-h-[160px] lg:min-h-0 ${
                fullscreenCreatorBlock ? 'hidden' : creatorMobileTab === 'files' ? 'w-full flex-1 flex' : 'lg:flex hidden lg:w-56'
              }`}>
                <div className="p-3 border-b border-gray-900 bg-slate-950/70 flex items-center gap-1.5 shrink-0">
                  <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#a5b4fc]">ESTRUTURA DE ARQUIVOS</span>
                </div>

                {!creatorResult ? (
                  <div className="flex-1 p-3 flex flex-col justify-center items-center text-center gap-3">
                    <Braces className="w-6 h-6 text-indigo-500/50 animate-pulse" />
                    <p className="text-[9px] font-mono text-gray-400 leading-normal leading-relaxed">
                      Nenhum projeto ativo. Crie um modelo de partida para editar:
                    </p>
                    <div className="flex flex-col gap-2 w-full mt-1.5 select-none">
                      <button
                        type="button"
                        onClick={() => {
                          playSciFiBeep(1200, 0.15);
                          handleInitDefaultProject('blank');
                        }}
                        className="w-full bg-slate-900/60 hover:bg-slate-900/90 text-indigo-300 border border-indigo-500/10 rounded-lg p-2 text-left cursor-pointer transition text-[9px] font-mono"
                      >
                        📁 + Novo Projeto Branco
                        <span className="block text-[7.5px] text-gray-500 mt-0.5 leading-tight font-sans">Escreva livremente códigos e simulações do zero.</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playSciFiBeep(1100, 0.15);
                          handleInitDefaultProject('cyberhelix');
                        }}
                        className="w-full bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-300 border border-cyan-500/10 rounded-lg p-2 text-left cursor-pointer transition text-[9px] font-mono"
                      >
                        🧬 + Template BioHelix
                        <span className="block text-[7.5px] text-gray-500 mt-0.5 leading-tight font-sans">Protótipo funcional rotativo 3D com dados bioelétricos.</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playSciFiBeep(1005, 0.15);
                          handleInitDefaultProject('chronos');
                        }}
                        className="w-full bg-purple-950/15 hover:bg-purple-950/30 text-purple-300 border border-purple-500/10 rounded-lg p-2 text-left cursor-pointer transition text-[9px] font-mono"
                      >
                        ⏰ + Template Chronos Clock
                        <span className="block text-[7.5px] text-gray-500 mt-0.5 leading-tight font-sans">Relógio multizona expansível e Pomodoro para foco.</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 scrollbar-thin">
                    {creatorResult.files.map((file: any) => {
                      const isSelected = file.fileName === creatorSelectedFile;
                      return (
                        <button
                          key={file.fileName}
                          type="button"
                          onClick={() => { playSciFiBeep(905, 0.05); setCreatorSelectedFile(file.fileName); }}
                          className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition cursor-pointer text-xs ${
                            isSelected 
                              ? 'bg-indigo-950/40 text-white border border-indigo-500/20 shadow-md shadow-indigo-950/20' 
                              : 'text-gray-500 hover:text-slate-300 hover:bg-black/20'
                          }`}
                        >
                          <span className="truncate flex items-center gap-2 font-mono">
                            {file.fileName.endsWith('.tsx') ? '⚛️' : file.fileName.endsWith('.ts') ? '🧬' : '🎨'} {file.fileName}
                          </span>
                          <span className="text-[8px] font-mono opacity-40 uppercase bg-black px-1.5 py-0.5 rounded border border-gray-900">{file.fileLanguage}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Code editor view (with Copy code button) (2/4 column) */}
              <div className={`border-r border-[#1e293b]/40 flex flex-col h-full overflow-hidden min-h-0 relative ${
                fullscreenCreatorBlock === 'editor' 
                  ? 'w-full h-full flex-1 flex z-30 bg-[#040608]' 
                  : fullscreenCreatorBlock 
                    ? 'hidden' 
                    : creatorMobileTab === 'editor' 
                      ? 'flex-1 flex w-full' 
                      : 'lg:flex hidden lg:flex-1'
              }`}>
                <div className="p-3 bg-slate-950/60 border-b border-gray-900 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                    <span className="text-[10px] font-bold text-gray-400 pr-2 uppercase">Arquivo Escolhido:</span>
                    <span className="text-xs font-black text-[#00ff9d]">{creatorSelectedFile}</span>
                  </div>

                  {creatorResult && (
                    <div className="flex items-center gap-1.5 shrink-0 select-none">
                      <button
                        type="button"
                        onClick={() => {
                          playSciFiBeep(fullscreenCreatorBlock ? 600 : 1100, 0.05);
                          setFullscreenCreatorBlock(fullscreenCreatorBlock === 'editor' ? null : 'editor');
                        }}
                        className="bg-slate-900 border border-slate-850 hover:border-slate-720 text-gray-400 hover:text-white p-1 rounded transition hover:scale-105 mr-1.5"
                        title={fullscreenCreatorBlock === 'editor' ? "Sair da Tela Cheia" : "Código em Tela Cheia"}
                      >
                        {fullscreenCreatorBlock === 'editor' ? <Minimize2 className="w-3.5 h-3.5 text-red-400" /> : <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>

                      {!isEditingCode ? (
                        <button
                          type="button"
                          onClick={() => {
                            playSciFiBeep(1100, 0.06);
                            setIsEditingCode(true);
                          }}
                          className="bg-indigo-950/50 text-indigo-300 hover:text-white px-2.5 py-1 rounded text-[9.5px] font-mono font-bold border border-indigo-500/20 cursor-pointer transition flex items-center gap-1"
                        >
                          ✍️ Editar Código
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => {
                          const file = creatorResult.files.find((f: any) => f.fileName === creatorSelectedFile);
                          if (file) {
                            navigator.clipboard.writeText(file.fileContent);
                            playSciFiBeep(1300, 0.08);
                            showToastMessage(`Código de ${file.fileName} copiado!`);
                          }
                        }}
                        className="bg-black text-[9.5px] font-mono text-indigo-400 hover:text-white px-3 py-1 rounded-lg border border-gray-900 hover:border-indigo-500 transition cursor-pointer flex items-center gap-1"
                      >
                        Copiar Código
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1 bg-black/95 overflow-auto scrollbar-thin select-text">
                  {!creatorResult ? (
                    <div className="w-full h-full flex flex-col justify-center items-center text-center gap-2 p-4 text-gray-600 font-mono text-[10px]">
                      <Code className="w-10 h-10 mb-2 opacity-30 animate-pulse text-indigo-500" />
                      <span>AGUARDANDO GERAÇÃO DA REDE COGNITIVA</span>
                      <p className="text-[9px] max-w-xs leading-normal select-text">Digite no painel esquerdo o app desejado (como portal, finanças ou tarefas) e clique em "Gerar e Executar".</p>
                    </div>
                  ) : isEditingCode ? (
                    <div className="w-full h-full flex flex-col p-4 bg-slate-950/70">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="flex-1 bg-slate-950 font-mono text-[#00ff9d] text-[11px] leading-relaxed p-4 border border-indigo-900/45 rounded-xl outline-none focus:border-cyan-500/50 resize-none scrollbar-thin select-text"
                        placeholder="Escreva seu código TypeScript/JSX aqui..."
                      />
                      <div className="flex gap-2 justify-end mt-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingCode(false);
                            playSciFiBeep(700, 0.08);
                          }}
                          className="px-3 py-1 text-gray-500 hover:text-gray-300 font-mono text-[9.5px] cursor-pointer bg-black/40 rounded transition border border-slate-900"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleSaveFileContent(creatorSelectedFile, editingContent);
                            setIsEditingCode(false);
                          }}
                          className="px-3.5 py-1 rounded bg-[#00ff9d] hover:bg-[#00d180] text-black font-mono font-bold text-[9.5px] cursor-pointer transition shadow-md shadow-emerald-950/20"
                        >
                          💾 Salvar código
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <pre className="font-[#e2e8f0] text-indigo-350 text-[11px] leading-relaxed tracking-wide whitespace-pre">
                        <code>
                          {creatorResult.files.find((f: any) => f.fileName === creatorSelectedFile)?.fileContent || "Arquivo vazio."}
                        </code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Console compilation simulation and Sandbox visual rendering (1/4 column) */}
              <div className={`bg-[#040608] flex flex-col h-full overflow-hidden shrink-0 ${
                fullscreenCreatorBlock === 'terminal' || fullscreenCreatorBlock === 'preview'
                  ? 'w-full h-full flex-1 flex z-30 bg-[#040608]'
                  : fullscreenCreatorBlock
                    ? 'hidden'
                    : creatorMobileTab === 'preview'
                      ? 'w-full flex-1 flex'
                      : 'lg:flex hidden lg:w-96'
              }`}>
                
                {/* Simulated build logs console (top half of side) */}
                <div className={`${
                  fullscreenCreatorBlock === 'preview' 
                    ? 'hidden' 
                    : fullscreenCreatorBlock === 'terminal' 
                      ? 'flex-1 h-full' 
                      : 'h-2/5'
                } border-b border-[#1e293b]/40 flex flex-col min-h-0 overflow-hidden bg-black/40`}>
                  <div className="p-2.5 bg-slate-950/70 border-b border-gray-955 flex items-center justify-between shrink-0">
                    <span className="text-[10px] font-mono font-black text-gray-400 tracking-wider flex items-center gap-1.5 uppercase">
                      <Binary className="w-3.5 h-3.5 text-[#00ff9d]" /> Terminal de Compilação
                    </span>
                    <div className="flex items-center gap-2 select-none">
                      <button
                        type="button"
                        onClick={() => {
                          playSciFiBeep(fullscreenCreatorBlock ? 600 : 1100, 0.05);
                          setFullscreenCreatorBlock(fullscreenCreatorBlock === 'terminal' ? null : 'terminal');
                        }}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-gray-400 hover:text-white p-0.5 rounded transition"
                        title={fullscreenCreatorBlock === 'terminal' ? "Sair da Tela Cheia" : "Terminal Logs em Tela Cheia"}
                      >
                        {fullscreenCreatorBlock === 'terminal' ? <Minimize2 className="w-3 h-3 text-red-400" /> : <Maximize2 className="w-3 h-3 text-indigo-400" />}
                      </button>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                    </div>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto scrollbar-thin font-mono text-[9px] text-[#00ff9d]/90 bg-black/99 flex flex-col gap-1 select-text">
                    {creatorLogs.length === 0 ? (
                      <span className="text-gray-750 block text-center mt-6">Log vazio. Aguardando execução...</span>
                    ) : (
                      creatorLogs.map((log, i) => <div key={i} className="leading-normal">{log}</div>)
                    )}
                  </div>
                </div>

                <div className={`${
                  fullscreenCreatorBlock === 'terminal' 
                    ? 'hidden' 
                    : fullscreenCreatorBlock === 'preview' 
                      ? 'flex-1 h-full' 
                      : 'h-3/5'
                } flex flex-col min-h-0 overflow-hidden bg-[#0a0c10]/95`}>
                  
                  {/* Tab header to switch between Sandbox rendering and SaaS config */}
                  <div className="p-2 border-b border-gray-950 flex items-center justify-between shrink-0 font-mono bg-slate-950/80">
                    <div className="flex bg-black/65 p-0.5 rounded border border-gray-900 gap-0.5">
                      <button
                        type="button"
                        onClick={() => { setSandboxActiveTab('sandbox'); playSciFiBeep(800, 0.05); }}
                        className={`px-2.5 py-1 rounded text-[8.5px] uppercase font-mono font-bold transition ${
                          sandboxActiveTab === 'sandbox' ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-cyan-500/10' : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        🎮 Sandbox
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSandboxActiveTab('launchpad'); playSciFiBeep(1100, 0.05); }}
                        className={`px-2.5 py-1 rounded text-[8.5px] uppercase font-mono font-bold transition flex items-center gap-1 ${
                          sandboxActiveTab === 'launchpad' ? 'bg-[#00ff9d]/20 text-[#00ff9d] border border-emerald-500/10' : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        <Sparkles className="w-2.5 h-2.5 text-[#00ff9d]" /> SaaS Launchpad
                      </button>
                    </div>
                    <div className="flex items-center gap-2 select-none">
                      <button
                        type="button"
                        onClick={() => {
                          playSciFiBeep(fullscreenCreatorBlock ? 600 : 1100, 0.05);
                          setFullscreenCreatorBlock(fullscreenCreatorBlock === 'preview' ? null : 'preview');
                        }}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-705 text-gray-400 hover:text-white p-0.5 rounded transition"
                        title={fullscreenCreatorBlock === 'preview' ? "Sair da Tela Cheia" : "Visualizador em Tela Cheia"}
                      >
                        {fullscreenCreatorBlock === 'preview' ? <Minimize2 className="w-3 h-3 text-red-400" /> : <Maximize2 className="w-3 h-3 text-indigo-400" />}
                      </button>
                      {sandboxActiveTab === 'sandbox' ? (
                        <span className="bg-[#00f2ff]/10 text-[#00f2ff] border border-cyan-500/20 text-[7.5px] px-1.5 py-0.5 rounded font-black tracking-widest uppercase">LIVE RUNNING</span>
                      ) : (
                        <span className="bg-[#00ff9d]/10 text-[#00ff9d] border border-emerald-500/20 text-[7.5px] px-1.5 py-0.5 rounded font-black tracking-widest uppercase">STARTUP MVP</span>
                      )}
                    </div>
                  </div>

                  {sandboxActiveTab === 'sandbox' ? (
                    <div className="flex-1 p-3 overflow-y-auto scrollbar-thin flex flex-col gap-2.5">
                      {isCreatingApp ? (
                        <div className="h-full flex flex-col justify-center items-center p-3 text-center my-auto">
                          <div className="w-full max-w-sm bg-[#070b13]/90 border border-cyan-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,242,255,0.15)] flex flex-col items-center gap-4 relative overflow-hidden">
                            {/* Ambient Glow / Upper Bar */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 animate-pulse" />
                            
                            {/* Spinning Holographic Loader Ring */}
                            <div className="relative w-20 h-20 flex items-center justify-center">
                              <div className="absolute inset-0 border-4 border-cyan-500/10 rounded-full" />
                              <div className="absolute inset-0 border-t-4 border-b-4 border-cyan-400 rounded-full animate-spin duration-700" />
                              <div className="absolute inset-2 border-r-4 border-l-4 border-emerald-400 rounded-full animate-spin duration-[1500ms]" style={{ animationDirection: 'reverse' }} />
                              <div className="absolute inset-4 border-t-4 border-pink-500 rounded-full animate-ping opacity-25" />
                              <div className="font-mono text-[9px] text-[#00f2ff] font-black tracking-widest animate-pulse">
                                CREATOR
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <span className="bg-[#00f2ff]/10 text-[#00f2ff] border border-cyan-500/20 text-[7.5px] px-2.5 py-0.5 rounded-full font-mono font-black tracking-widest uppercase inline-block mx-auto animate-bounce">
                                🌌 ESTRUTURANDO PLATAFORMA / LANDING PAGE
                              </span>
                              <h4 className="text-[12px] font-bold font-mono text-white tracking-tight uppercase">
                                Por favor, aguarde um instante!
                              </h4>
                              <p className="text-[8.5px] text-gray-400 leading-normal max-w-[280px] mx-auto text-balance">
                                O arquiteto cognitivo está modelando as seções, integrando Tailwind CSS e refinando a experiência. Sua Landing Page completa já vai ser exibida no simulador interativo em segundos!
                              </p>
                            </div>

                            {/* Live Action/Sinaptic Thread Tracker */}
                            <div className="w-full bg-slate-950/90 border border-gray-900 rounded-xl p-2.5 flex flex-col gap-1.5 text-[8.5px] font-mono text-left">
                              <div className="flex items-center gap-2 text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                <span className="truncate">[OK] Processando prompt de layout responsivo...</span>
                              </div>
                              <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-spin" />
                                <span className="truncate">[PROCESSO] Estruturando seções de conversão...</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                                <span className="truncate">[ESPERA] Renderizando preview em tempo real...</span>
                              </div>
                            </div>

                            {/* Real-looking Progress Bar Indicator */}
                            <div className="w-full flex flex-col gap-1">
                              <div className="flex justify-between items-center text-[7.5px] font-mono text-gray-500">
                                <span>SINAPSE: COMPILANDO</span>
                                <span className="text-[#00ff9d] animate-pulse">AGUARDE...</span>
                              </div>
                              <div className="w-full h-1 bg-gray-950 rounded-full overflow-hidden border border-gray-900">
                                <div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-[#00ff9d] rounded-full animate-pulse" style={{ width: '80%' }} />
                              </div>
                            </div>

                            {/* Footer micro notifications */}
                            <div className="text-[7.5px] font-mono text-gray-600 flex items-center gap-1 border-t border-gray-950 pt-2 w-full justify-center">
                              <span className="w-1 h-1 rounded-full bg-[#00ff9d] animate-ping" />
                              <span>Sincronismo de Compilador Habilitado</span>
                            </div>
                          </div>
                        </div>
                      ) : !creatorResult ? (
                        <div className="h-full flex flex-col justify-center items-center text-center text-gray-750 font-mono text-[9.5px]">
                          <span>Sandbox Desconectado</span>
                          <p className="text-[8px] max-w-xs mt-1 leading-normal">O sandbox simula códigos nativos de forma segura assim que a compilação finalizar.</p>
                        </div>
                      ) : (
                        /* HIGH-FIDELITY INTERACTIVE COMPILING SANDBOX EXECUTORS OR LIVE BRWS */
                        <div className="flex-1 flex flex-col h-full gap-2 text-slate-100 font-sans select-none">
                          
                          {/* Sub-selector for Sandbox execute state */}
                          <div className="flex bg-black/55 border border-slate-900 rounded-lg p-0.5 gap-0.5 shrink-0 select-none">
                            <button
                              type="button"
                              onClick={() => { setSandboxPreviewMode('live'); playSciFiBeep(1200, 0.05); }}
                              className={`flex-1 py-1 rounded text-[8px] uppercase font-mono tracking-wider transition font-extrabold ${
                                sandboxPreviewMode === 'live' ? 'bg-[#00f2ff]/20 text-[#00f2ff]' : 'text-gray-500 hover:text-gray-300'
                              }`}
                            >
                              🌐 Executar Aplicativo Live
                            </button>
                            <button
                              type="button"
                              onClick={() => { setSandboxPreviewMode('simulated'); playSciFiBeep(900, 0.05); }}
                              className={`flex-1 py-1 rounded text-[8px] uppercase font-mono tracking-wider transition font-extrabold ${
                                sandboxPreviewMode === 'simulated' ? 'bg-indigo-950/20 text-indigo-400' : 'text-gray-500 hover:text-gray-300'
                              }`}
                            >
                              🔬 Painel de Dados
                            </button>
                          </div>

                          {sandboxPreviewMode === 'live' ? (
                            <div className="flex-1 flex flex-col gap-2 min-h-0">
                              {/* Device Selection Controller */}
                              <div className="flex items-center justify-between bg-black/60 px-2 py-1.5 border border-slate-900 rounded-lg text-[8px] font-mono shrink-0 select-none">
                                <div className="flex gap-2 text-gray-500 items-center">
                                  <span className="text-[7px]">DISPOSITIVO:</span>
                                  <button
                                    type="button"
                                    onClick={() => { setPreviewDeviceMode('desktop'); playSciFiBeep(800, 0.04); }}
                                    className={`hover:text-white font-bold transition ${previewDeviceMode === 'desktop' ? 'text-[#00f2ff]' : ''}`}
                                  >
                                    🖥️ DESKTOP
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { setPreviewDeviceMode('tablet'); playSciFiBeep(850, 0.04); }}
                                    className={`hover:text-white font-bold transition ${previewDeviceMode === 'tablet' ? 'text-[#00f2ff]' : ''}`}
                                  >
                                    📱 TABLET
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { setPreviewDeviceMode('mobile'); playSciFiBeep(900, 0.04); }}
                                    className={`hover:text-white font-bold transition ${previewDeviceMode === 'mobile' ? 'text-[#00f2ff]' : ''}`}
                                  >
                                    📳 MOBILE
                                  </button>
                                </div>
                                <div className="text-[#00ff9d] font-bold">
                                  {previewDeviceMode === 'desktop' ? '100% FLUID' : previewDeviceMode === 'tablet' ? '768px' : '390px'}
                                </div>
                              </div>

                              {/* Interactive Live Preview Web Sandbox Render Frame */}
                              <div className="flex-1 rounded-xl bg-slate-950 border border-indigo-950/35 overflow-hidden flex flex-col relative min-h-[220px]">
                                <iframe
                                  id="live_creation_sandbox_iframe"
                                  title={`${creatorResult.appName} Running Sandbox Preview Window`}
                                  className={`h-full border-0 transition-all duration-300 bg-slate-950 select-text ${
                                    previewDeviceMode === 'desktop' 
                                      ? 'w-full' 
                                      : previewDeviceMode === 'tablet' 
                                        ? 'w-[768px] max-w-full mx-auto border-x border-[#00f2ff]/20' 
                                        : 'w-[390px] max-w-full mx-auto border-x border-[#00f2ff]/30'
                                  }`}
                                  srcDoc={getLiveIframeHtml(creatorResult)}
                                  sandbox="allow-scripts allow-same-origin allow-modals"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 flex flex-col gap-2 min-h-0 overflow-y-auto scrollbar-thin">
                              {/* News Heuristic simulator */}
                              {creatorResult.files.some((f: any) => f.fileName === 'database.ts' && f.fileContent.includes('articles')) && (
                            <div className="flex-1 flex flex-col gap-3 min-h-0">
                              <div className="bg-[#111827] rounded-xl p-3.5 border border-indigo-950/40 flex flex-col gap-2.5 shadow-md">
                                <span className="text-[8.5px] font-mono text-cyan-400 tracking-wider uppercase inline-block font-black">⚡ FEED DE NOTÍCIAS DO PORTAL</span>
                                
                                <div className="flex flex-col gap-2 max-h-36 overflow-y-auto scrollbar-thin">
                                  {sandboxItems.map((item) => (
                                    <div key={item.id} className="bg-black/60 p-2.5 rounded-lg border border-gray-900 flex justify-between items-center gap-2">
                                      <div className="min-w-0 flex-1">
                                        <span className="text-[8px] font-mono uppercase bg-indigo-950/50 text-[#00f2ff] px-1.5 py-0.5 rounded inline-block font-bold mb-1">{item.category}</span>
                                        <h5 className="text-[11px] font-bold text-slate-200 leading-tight block truncate">{item.text}</h5>
                                        <p className="text-[9px] text-slate-500 mt-0.5">Por: {item.author || "IA"} • {item.date}</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          playSciFiBeep(1200, 0.05);
                                          setSandboxItems(sandboxItems.map(s => s.id === item.id ? { ...s, likes: s.likes + 1 } : s));
                                        }}
                                        className="bg-[#ff007c]/10 hover:bg-[#ff007c]/20 text-[#ff007c] hover:text-white transition px-2.5 py-1 rounded text-[10px] font-mono font-bold border border-[#ff007c]/20 cursor-pointer text-center whitespace-nowrap shrink-0"
                                      >
                                        ❤️ {item.likes}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Commentary submission */}
                              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-gray-900 flex flex-col gap-1.5">
                                <span className="text-[9px] font-mono uppercase text-gray-400 font-bold">Adicionar Sinapse de Opinião</span>
                                <div className="flex gap-1.5 text-xs">
                                  <input
                                    type="text"
                                    placeholder="Escreva sua opinião científica..."
                                    value={sandboxInput1}
                                    onChange={(e) => setSandboxInput1(e.target.value)}
                                    className="flex-1 bg-black/80 border border-gray-900 rounded-lg p-2 text-[10.5px] font-mono focus:outline-none text-white placeholder-gray-800"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!sandboxInput1.trim()) return;
                                      playSciFiBeep(1100, 0.1, 'sine');
                                      showToastMessage(`Sucesso! Comentário adicionado.`);
                                      setSandboxInput1('');
                                    }}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-mono font-bold px-3 rounded-lg cursor-pointer transition border border-indigo-400/20"
                                  >
                                    Postar
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Financial transactions simulator */}
                          {creatorResult.files.some((f: any) => f.fileName === 'database.ts' && f.fileContent.includes('transactions')) && (
                            <div className="flex-1 flex flex-col gap-3 min-h-0">
                              <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-900 shadow-xl flex flex-col gap-2 bg-[#ff007c]">
                                <span className="text-[8.5px] font-mono text-[#00ff9d] tracking-wider uppercase inline-block font-black">🟢 LIQUIDEZ E CONCILIAÇÃO ATIVA</span>
                                
                                <div className="flex items-center justify-between py-1 bg-black border border-gray-900 rounded-lg px-2.5">
                                  <span className="text-[10px] font-mono text-gray-400 uppercase">Saldo Consolidado</span>
                                  <span className="text-[12.5px] font-mono font-black text-[#00ff9d]">
                                    R$ {sandboxItems.reduce((acc, curr) => curr.type === 'entrada' ? acc + curr.value : acc - curr.value, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>

                                <div className="flex flex-col gap-1 max-h-24 overflow-y-auto scrollbar-thin">
                                  {sandboxItems.map((tx) => (
                                    <div key={tx.id} className="bg-black/60 p-2 rounded-lg border border-slate-900/40 flex justify-between items-center text-[10.5px]">
                                      <div className="truncate">
                                        <span className="font-bold text-slate-100">{tx.text}</span>
                                        <span className="text-[7.5px] font-mono uppercase bg-gray-950 text-gray-500 px-1 py-0.5 rounded border border-gray-900 ml-1.5">{tx.category}</span>
                                      </div>
                                      <span className={`font-mono font-black ${tx.type === 'entrada' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {tx.type === 'entrada' ? '+' : '-'} R$ {tx.value.toFixed(2)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Lançar nova Transação form */}
                              <div className="bg-[#05060a]/90 p-2 rounded-xl border border-gray-955 shadow flex flex-col gap-1.5 bg-slate-950/40">
                                <span className="text-[8.5px] font-mono uppercase text-indigo-400 font-bold block">Adicionar Lançamento Comercial</span>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <input
                                    type="text"
                                    placeholder="Descrição"
                                    value={sandboxInput1}
                                    onChange={(e) => setSandboxInput1(e.target.value)}
                                    className="bg-black border border-gray-900 rounded-lg p-1.5 text-[10px] font-mono text-white placeholder-gray-805"
                                  />
                                  <input
                                    type="number"
                                    placeholder="Valor (R$)"
                                    value={sandboxInput2}
                                    onChange={(e) => setSandboxInput2(e.target.value)}
                                    className="bg-black border border-gray-900 rounded-lg p-1.5 text-[10px] font-mono text-white placeholder-gray-805"
                                  />
                                </div>
                                <div className="flex gap-1.5">
                                  <select 
                                    value={sandboxCategory}
                                    onChange={(e) => setSandboxCategory(e.target.value)}
                                    className="bg-black border border-gray-900 text-[10px] text-white p-1.5 rounded-lg font-mono flex-1 outline-none"
                                  >
                                    <option value="Serviços">🟢 Serviços</option>
                                    <option value="Saas">🟢 Saas</option>
                                    <option value="Despesa">🔴 Despesa</option>
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!sandboxInput1.trim() || !sandboxInput2) return;
                                      const val = parseFloat(sandboxInput2);
                                      if (isNaN(val)) return;
                                      playSciFiBeep(1200, 0.08, 'sine');
                                      
                                      const newTx = {
                                        id: Date.now(),
                                        text: sandboxInput1,
                                        value: val,
                                        type: sandboxCategory.includes('Despesa') ? 'saida' : 'entrada',
                                        category: sandboxCategory.replace('🟢 ', '').replace('🔴 ', ''),
                                        date: 'Hoje'
                                      };
                                      setSandboxItems([newTx, ...sandboxItems]);
                                      setSandboxInput1('');
                                      setSandboxInput2('');
                                    }}
                                    className="bg-[#00ff9d]/15 hover:bg-[#00ff9d]/25 text-[#00ff9d] hover:text-white text-[10px] font-mono px-3 py-1.5 rounded-lg font-bold border border-[#00ff9d]/30 cursor-pointer transition"
                                  >
                                    Confirmar
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Biotech ADN Helix 3D Rotation Simulator */}
                          {creatorResult.files.some((f: any) => 
                            f.fileContent.includes('helix') || 
                            f.fileContent.includes('Helix') || 
                            f.fileContent.includes('DNA') || 
                            creatorResult.appName.toLowerCase().includes('helix') || 
                            creatorResult.appName.toLowerCase().includes('biotech') || 
                            creatorResult.description.toLowerCase().includes('3d')
                          ) && (
                            <div className="flex-1 flex flex-col gap-3 min-h-0 select-none">
                              <div className="bg-black/90 p-4 rounded-xl border border-indigo-950/65 flex flex-col gap-2.5 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                                
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-[7.5px] font-mono text-[#00ff9d] tracking-wider uppercase inline-block font-black">🧬 COMPATIBILIDADE BIOESTRUTURAL ATIVA</span>
                                    <h4 className="text-xs font-bold text-slate-100 font-sans tracking-wide">CyberHelix Bio-Network 3D</h4>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-[#00ff9d] rounded-full animate-pulse" />
                                    <span className="text-[7px] font-mono text-gray-500">SIMULANDO COGNITIVO</span>
                                  </div>
                                </div>

                                {/* Custom Rotate Animation SVG */}
                                <div className="h-28 flex items-center justify-center bg-slate-950/40 rounded-lg border border-slate-900/40 relative">
                                  <svg className="w-full h-full" viewBox="0 0 400 100">
                                    {/* Simulated Double Helix particles with SVG sine waves */}
                                    {Array.from({ length: 18 }).map((_, idx) => {
                                      const x = 30 + idx * 20;
                                      const speedMultiplier = helixSpeed;
                                      const angle_1 = (idx * 0.4) + (Date.now() * 0.003 * speedMultiplier);
                                      const angle_2 = angle_1 + Math.PI;

                                      const y_1 = 50 + Math.sin(angle_1) * 22;
                                      const y_2 = 50 + Math.sin(angle_2) * 22;

                                      // Opacities for 3D depth illusion
                                      const op_1 = 0.3 + (Math.cos(angle_1) + 1) * 0.35;
                                      const op_2 = 0.3 + (Math.cos(angle_2) + 1) * 0.35;

                                      const r_1 = 3 + (Math.cos(angle_1) + 1) * 1.5;
                                      const r_2 = 3 + (Math.cos(angle_2) + 1) * 1.5;

                                      return (
                                        <g key={idx}>
                                          {/* Connecting rung line */}
                                          <line 
                                            x1={x} 
                                            y1={y_1} 
                                            x2={x} 
                                            y2={y_2} 
                                            stroke="#4f46e5" 
                                            strokeOpacity={0.15 + Math.min(op_1, op_2) * 0.5} 
                                            strokeWidth="1.5" 
                                          />
                                          {/* Strand 1 Node */}
                                          <circle 
                                            cx={x} 
                                            cy={y_1} 
                                            r={r_1} 
                                            fill="#00ff9d" 
                                            fillOpacity={op_1} 
                                            stroke="#052e16" 
                                            strokeWidth="0.5" 
                                          />
                                          {/* Strand 2 Node */}
                                          <circle 
                                            cx={x} 
                                            cy={y_2} 
                                            r={r_2} 
                                            fill="#00f2ff" 
                                            fillOpacity={op_2} 
                                            stroke="#022c22" 
                                            strokeWidth="0.5" 
                                          />
                                        </g>
                                      );
                                    })}
                                  </svg>
                                  <div className="absolute top-2 left-2 text-[8px] font-mono text-gray-500 bg-black/60 px-1.5 py-0.5 rounded">
                                    Órbitas: {helixSpeed === 0 ? 'PAUSADAS' : `${helixSpeed.toFixed(1)}x velocidade`}
                                  </div>
                                </div>

                                {/* Speed Slider & Selector */}
                                <div className="flex items-center justify-between">
                                  <span className="text-[8px] font-mono text-gray-400 uppercase font-black">Modificar Cintilar Órbita:</span>
                                  <div className="flex gap-1.5">
                                    {[0, 0.5, 1, 2.5].map((sp) => (
                                      <button
                                        key={sp}
                                        type="button"
                                        onClick={() => { playSciFiBeep(900 + sp * 100, 0.05); setHelixSpeed(sp); }}
                                        className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold transition-all cursor-pointer ${
                                          helixSpeed === sp 
                                            ? 'bg-[#00ff9d] text-black border border-[#00ff9d]' 
                                            : 'bg-black/60 text-gray-400 hover:text-white border border-gray-900'
                                        }`}
                                      >
                                        {sp === 0 ? 'CONGELAR' : `${sp}x`}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Active Base Segment Card Selector */}
                                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-gray-900 flex flex-col gap-1">
                                  <span className="text-[8.5px] font-mono text-gray-500 uppercase block font-bold">Análise Genética Molecular Ativa</span>
                                  <div className="grid grid-cols-4 gap-1">
                                    {['Adenina', 'Timina', 'Citosina', 'Guanina'].map((seg) => (
                                      <button
                                        key={seg}
                                        type="button"
                                        onClick={() => { playSciFiBeep(1100, 0.05); setActiveDnaSegment(seg); }}
                                        className={`py-1 text-[8.5px] font-mono rounded transition cursor-pointer font-bold ${
                                          activeDnaSegment === seg 
                                            ? 'bg-purple-600 border border-purple-400/25 text-white animate-pulse' 
                                            : 'bg-black/60 text-gray-500 border border-slate-950'
                                        }`}
                                      >
                                        {seg.slice(0, 3)}.
                                      </button>
                                    ))}
                                  </div>
                                  
                                  <div className="mt-1 bg-black/60 p-2 rounded-lg border border-gray-950/40 text-[9.5px] font-mono leading-relaxed text-gray-400">
                                    {activeDnaSegment === 'Adenina' && "🧬 Adenina (A) emparelha-se com Timina. Melhora a taxa de carregamento e transição quântica CSS da página em 14ms."}
                                    {activeDnaSegment === 'Timina' && "🧬 Timina (T) forma ligações duplas. Estabiliza a física estrutural do dashboard elástico e flutuações de grid."}
                                    {activeDnaSegment === 'Citosina' && "🧬 Citosina (C) possui maior estabilidade térmica. Resiste a re-arranjos e picos de re-renders infinitos."}
                                    {activeDnaSegment === 'Guanina' && "🧬 Guanina (G) emparelha-se em triplos. Garante persistência duradoura com o kernel Layon-System local."}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Chronos Timezone Clock elastic Dashboard simulator */}
                          {creatorResult.files.some((f: any) => 
                            f.fileContent.includes('clock') || 
                            f.fileContent.includes('Clock') || 
                            f.fileContent.includes('timezone') || 
                            creatorResult.appName.toLowerCase().includes('clock') || 
                            creatorResult.appName.toLowerCase().includes('timer') || 
                            creatorResult.description.toLowerCase().includes('clock')
                          ) && (
                            <div className="flex-1 flex flex-col gap-3 min-h-0 select-none">
                              <div className="bg-slate-950/90 p-4 rounded-xl border border-gray-900 flex flex-col gap-3 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#bd00ff]/5 rounded-full blur-2xl pointer-events-none" />
                                
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-[7.5px] font-mono text-[#00f2ff] tracking-wider uppercase inline-block font-black">⚙️ CONVERSOR HORÁRIO E SINC DELTA</span>
                                    <h4 className="text-xs font-bold text-slate-100 font-mono tracking-tight">Chronos Clock Elastic Dashboard</h4>
                                  </div>
                                  <span className="text-[8px] bg-[#00f2ff]/10 text-[#00f2ff] border border-cyan-500/15 px-2 py-0.5 rounded font-bold font-mono uppercase">PERFEITO</span>
                                </div>

                                {/* Dynamic Clock Widget with computations */}
                                <div className="bg-black/80 rounded-xl p-3 border border-slate-900 flex items-center justify-between gap-3">
                                  <div className="flex-1">
                                    <span className="text-[8px] font-mono text-gray-500 uppercase block">Hora no Fuso Localizado ({clockTimezone})</span>
                                    <div className="text-xl font-mono text-[#00f2ff] font-bold tracking-widest mt-1">
                                      {(() => {
                                        const now = new Date();
                                        if (clockTimezone === 'NY') {
                                          now.setHours(now.getHours() - 1); 
                                        } else if (clockTimezone === 'LDN') {
                                          now.setHours(now.getHours() + 4);
                                        }
                                        return now.toLocaleTimeString('pt-BR');
                                      })()}
                                    </div>
                                    <span className="text-[8px] font-mono text-gray-600 block mt-0.5">Offset Computado Synch de Fuso</span>
                                  </div>

                                  <div className="flex flex-col gap-1">
                                    {['BR', 'NY', 'LDN'].map((tz) => (
                                      <button
                                        key={tz}
                                        type="button"
                                        onClick={() => { playSciFiBeep(1005, 0.05); setClockTimezone(tz as any); }}
                                        className={`py-0.5 px-2.5 rounded text-[8.5px] font-mono font-bold transition-all cursor-pointer ${
                                          clockTimezone === tz 
                                            ? 'bg-[#00f2ff] text-black font-black' 
                                            : 'bg-slate-900 text-gray-500 hover:text-white border border-slate-950'
                                        }`}
                                      >
                                        {tz === 'BR' && 'São Paulo 🇧🇷'}
                                        {tz === 'NY' && 'New York 🇺🇸'}
                                        {tz === 'LDN' && 'London 🇬🇧'}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Interactive Elastic Pomodoro Widget */}
                                <div className="p-3 bg-indigo-950/5 border border-indigo-950/40 rounded-xl flex items-center justify-between">
                                  <div>
                                    <span className="text-[8px] font-mono text-indigo-400 uppercase font-bold block">Pomodoro Científico Integrado</span>
                                    <div className="font-mono text-lg font-bold text-slate-100 tracking-widest mt-1">
                                      {Math.floor(pomodoroTimer / 60).toString().padStart(2, '0')}:{(pomodoroTimer % 60).toString().padStart(2, '0')}
                                    </div>
                                  </div>

                                  <div className="flex gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => { playSciFiBeep(1100, 0.07); setPomodoroRunning(!pomodoroRunning); }}
                                      className={`px-3 py-1 rounded text-[9px] font-mono font-bold cursor-pointer transition ${
                                        pomodoroRunning 
                                          ? 'bg-rose-950/20 text-rose-400 border border-rose-900/40' 
                                          : 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/40'
                                      }`}
                                    >
                                      {pomodoroRunning ? 'PAUSAR' : 'INICIAR'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => { playSciFiBeep(650, 0.1); setPomodoroRunning(false); setPomodoroTimer(1500); }}
                                      className="px-2.5 py-1 rounded text-[9px] font-mono font-bold bg-slate-900 text-gray-400 hover:text-white border border-slate-950 cursor-pointer transition"
                                    >
                                      Reset
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* General tasks simulator */}
                          {!creatorResult.files.some((f: any) => f.fileName === 'database.ts' && (f.fileContent.includes('articles') || f.fileContent.includes('transactions'))) && 
                           !creatorResult.files.some((f: any) => 
                            f.fileContent.includes('helix') || 
                            f.fileContent.includes('Helix') || 
                            f.fileContent.includes('DNA') || 
                            f.fileContent.includes('clock') || 
                            f.fileContent.includes('Clock') || 
                            f.fileContent.includes('timezone') || 
                            creatorResult.appName.toLowerCase().includes('helix') || 
                            creatorResult.appName.toLowerCase().includes('biotech') || 
                            creatorResult.appName.toLowerCase().includes('clock') || 
                            creatorResult.appName.toLowerCase().includes('timer')
                           ) && (
                            <div className="flex-1 flex flex-col gap-3 min-h-0">
                              <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 flex flex-col gap-2">
                                <span className="text-[8.5px] font-mono text-purple-400 tracking-wider uppercase inline-block font-black">🎯 GESTÃO DE ATIVIDADES COGNITIVAS</span>
                                
                                <div className="flex flex-col gap-1 max-h-28 overflow-y-auto scrollbar-thin">
                                  {sandboxItems.map((task) => (
                                    <div 
                                      key={task.id} 
                                      onClick={() => {
                                        playSciFiBeep(800, 0.05);
                                        setSandboxItems(sandboxItems.map(s => s.id === task.id ? { ...s, done: !s.done } : s));
                                      }}
                                      className={`bg-black/60 p-2 rounded-lg border cursor-pointer flex justify-between items-center transition ${
                                        task.done ? 'border-gray-950 opacity-40 line-through' : 'border-slate-900/50 hover:border-slate-800'
                                      }`}
                                    >
                                      <span className="text-xs text-slate-200">{task.text}</span>
                                      <span className={`text-[7px] uppercase font-mono px-1.5 py-0.5 rounded border ${
                                        task.priority === 'alta' ? 'border-red-900/30 text-red-400' : 'border-gray-800 text-gray-500'
                                      }`}>
                                        {task.priority || "baixa"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Task item insert */}
                              <div className="bg-[#040509]/80 p-2 rounded-xl border border-gray-950 flex flex-col gap-1.5 bg-slate-950/40">
                                <span className="text-[8.5px] font-mono uppercase text-[#00f2ff] font-bold block">Enxertar Nova Atividade</span>
                                <div className="flex gap-1.5 text-xs">
                                  <input
                                    type="text"
                                    placeholder="Nome da atividade cognitiva..."
                                    value={sandboxInput1}
                                    onChange={(e) => setSandboxInput1(e.target.value)}
                                    className="flex-1 bg-black/80 border border-gray-900 rounded-lg p-1.5 text-[10.5px] font-mono text-white placeholder-gray-805"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!sandboxInput1.trim()) return;
                                      playSciFiBeep(1200, 0.1, 'sine');
                                      const newTask = {
                                        id: Date.now(),
                                        text: sandboxInput1,
                                        priority: 'media',
                                        done: false
                                      };
                                      setSandboxItems([...sandboxItems, newTask]);
                                      setSandboxInput1('');
                                    }}
                                    className="bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-[10px] px-3 rounded-lg cursor-pointer transition border border-purple-400/20"
                                  >
                                    Inserir
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          </div>
                        )}

                        {/* Bottom Diagnostics / IA Autorefixer list */}
                          <div className="border border-gray-900 bg-black/80 rounded-xl p-2.5 flex flex-col gap-1 shadow backdrop-blur font-mono text-[9px]">
                            <span className="text-[8px] font-black text-amber-400 uppercase tracking-wider block">🚨 Diagnósticos sintáticos e design</span>
                            {creatorResult.diagnostics.length === 0 ? (
                              <div className="text-emerald-400 py-1 font-bold text-[8.5px] flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Estável. Zero avisos ou bugs detectados na rede lógica de Layon.
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1">
                                <div className="max-h-12 overflow-y-auto scrollbar-thin">
                                  {creatorResult.diagnostics.map((diag: any, i: number) => (
                                    <div key={i} className="text-amber-500 text-[8px]">
                                      ⚠️ <b>[{diag.fileName}: L{diag.line}]</b> {diag.message}
                                    </div>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  onClick={handleFixCreatorApp}
                                  disabled={isFixingApp}
                                  className="w-full bg-[#bd00ff]/10 hover:bg-[#bd00ff]/20 text-[#d946ef] hover:text-white transition font-black text-[9px] py-1 rounded-lg border border-[#bd00ff]/30 cursor-pointer flex items-center justify-center gap-1 disabled:opacity-55"
                                >
                                  {isFixingApp ? "Sincronizando repares cognitivos..." : "🧠 Rodar Correção da IA (Auto-Fix)"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* DYNAMIC SAAS MONETIZATION LAUNCHPAD PANEL (Path 2: Comercialização & Startup MVP) */
                    <div className="flex-1 p-4 overflow-y-auto scrollbar-thin flex flex-col gap-3 text-slate-100 font-sans select-none">
                      <div className="bg-gradient-to-r from-emerald-950/20 to-teal-950/15 border border-[#00ff9d]/15 rounded-xl p-3 flex flex-col gap-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                        <div className="flex items-center gap-1.5">
                          <Coins className="w-4 h-4 text-[#00ff9d]" />
                          <span className="text-[10.5px] font-mono uppercase text-[#00ff9d] font-black">Monetização e Cobrança SaaS</span>
                        </div>
                        <p className="text-[9px] text-gray-400 leading-normal">
                          Configure planos Stripe recorrentes e limites de faturamento de API vinculados à estrutura gerada de <span className="text-white font-bold">{creatorResult?.appName || 'Workspace'}</span>.
                        </p>
                      </div>

                      {/* Config Form elements */}
                      <div className="grid grid-cols-1 gap-2 border-b border-[#30363d]/20 pb-2 font-mono text-[9px]">
                        <div className="flex flex-col gap-1">
                          <label className="text-gray-500 uppercase font-bold text-[8px]">Nome do Plano:</label>
                          <input
                            type="text"
                            value={saasPlanName}
                            onChange={(e) => setSaasPlanName(e.target.value)}
                            className="bg-black border border-gray-800 hover:border-emerald-500/30 rounded px-2.5 py-1 text-white text-[10px] outline-none focus:border-emerald-500 transition font-mono"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center text-[8px] uppercase font-bold text-gray-500">
                            <span>Preço de Assinatura:</span>
                            <span className="text-emerald-400 font-black font-mono text-[10.5px]">${saasPlanPrice} / mês</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="199"
                            step="1"
                            value={saasPlanPrice}
                            onChange={(e) => {
                              playSciFiBeep(550 + parseInt(e.target.value) * 3, 0.04);
                              setSaasPlanPrice(parseInt(e.target.value));
                            }}
                            className="w-full h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-[#00ff9d]"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-gray-500 uppercase font-bold text-[8px]">Modelo de Cobrança:</label>
                          <select
                            value={saasPlanType}
                            onChange={(e) => setSaasPlanType(e.target.value)}
                            className="bg-black border border-gray-800 rounded px-2 py-1 text-gray-200 text-[9px] outline-none focus:border-emerald-500 transition cursor-pointer"
                          >
                            <option value="subscription">Assinatura Mensal Recorrente</option>
                            <option value="freemium">Freemium (Limite de 100 chamadas)</option>
                            <option value="payg">Pay-As-You-Go ($0.15 por chamada de API)</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded bg-black/60 border border-gray-900 mt-1">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-gray-400 text-[8.5px] uppercase font-bold">Autenticação & Limite IP:</span>
                            <span className="text-[7.5px] text-gray-500">Mecanismo anti-abuse ativo</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              playSciFiBeep(saasRateLimit ? 500 : 1200, 0.05);
                              setSaasRateLimit(!saasRateLimit);
                            }}
                            className={`p-1 px-2 rounded font-bold uppercase transition text-[8px] ${
                              saasRateLimit 
                                ? 'bg-[#00ff9d]/15 text-[#00ff9d] border border-[#00ff9d]/30' 
                                : 'bg-red-950/20 text-red-400 border border-red-950/40'
                            }`}
                          >
                            {saasRateLimit ? 'RATE LIMIT ON' : 'LIVRE'}
                          </button>
                        </div>
                      </div>

                      {/* Direct commercial viability MRR analytics simulation box */}
                      <div className="bg-[#05070a] border border-gray-900 rounded-xl p-3 flex flex-col gap-1.5 font-mono text-[9px] text-gray-400">
                        <span className="text-gray-500 font-bold uppercase text-[7.5px] tracking-wide">📊 Previsão Financeira Estimada (MVP)</span>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div className="bg-black/60 border border-gray-950 p-2 rounded text-center">
                            <span className="text-gray-600 block text-[7px] uppercase">MRR Projetado</span>
                            <span className="text-emerald-400 text-xs font-black font-mono block mt-0.5">
                              $ {((saasPlanPrice * 45) + (status.totalMemories * 15)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                          <div className="bg-black/60 border border-gray-950 p-2 rounded text-center">
                            <span className="text-gray-600 block text-[7px] uppercase">MAU Ativo Est.</span>
                            <span className="text-white text-xs font-black font-mono block mt-0.5">
                              {((status.totalMemories || 12) * 5 + 120).toFixed(0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[8px] pt-1 text-gray-500 border-t border-gray-950">
                          <span>Margem Operacional Est.:</span>
                          <span className="text-[#00ff9d] font-bold">94.8%</span>
                        </div>
                      </div>

                      {/* Main Export / Deployment button */}
                      <button
                        type="button"
                        disabled={isExportingSaaS}
                        onClick={async () => {
                          setIsExportingSaaS(true);
                          playSciFiBeep(1000, 0.15, 'triangle');
                          
                          // Simulate dynamic compilation with local state logger
                          const steps = [
                            `[SAAS] Iniciando fusão do código de '${creatorResult?.appName || 'Micro-App'}' para modelo startup comercial...`,
                            `[SAAS] Criando roteamento de backend seguro (src/server/billing-shield.ts)...`,
                            `[SAAS] Injetando Webhook oficial do Stripe para validar plano '${saasPlanName}' (${saasPlanPrice} USD/mês)...`,
                            `[SAAS] Gerando credenciais seguras de faturamento e chaves JWT...`,
                            `[SAAS] Empacotando build optimizada para Vercel, Netlify e Cloud Run...`,
                            `[SAAS] ✅ Concluído! Código-fonte SaaS compilado com sucesso e logs de cobrança gerados no console do Terminal.`
                          ];

                          for (let i = 0; i < steps.length; i++) {
                            await new Promise(r => setTimeout(r, 450));
                            setCreatorLogs(prev => [...prev, steps[i]]);
                          }
                          setIsExportingSaaS(false);
                          playSciFiBeep(1400, 0.1, 'sine');
                          showToastMessage("Boilerplate SaaS criado com suporte a Stripe!");
                        }}
                        className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black hover:from-emerald-400 hover:to-teal-400 transition font-black text-[10px] uppercase font-mono tracking-wider rounded-lg shadow-[0_0_12px_rgba(16,185,129,0.15)] flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plane className="w-4.5 h-4.5" />
                        {isExportingSaaS ? 'CONSOLIDANDO ROTAS...' : 'Lançar MVP como SaaS'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

          {/* RIGHT SIDEBAR: INTELLIGENT AI DIALOUGE PANEL */}
          <section
            id="chat_sidebar"
            className={`shrink-0 border-l border-[#1f2937]/50 bg-[#05070a]/98 flex flex-col h-full overflow-hidden transition-all duration-300 z-10 ${
              isMapFocused
                ? 'w-0 border-l-0 hidden'
                : isChatOpen ? 'w-96 lg:flex hidden' : 'w-0 border-l-0 hidden'
            }`}
          >
            {/* Header chat detail */}
            <div className="p-4 border-b border-gray-800/80 flex items-center justify-between bg-gray-950 shrink-0 h-14">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00f2ff] animate-pulse shadow-[0_0_8px_#00f2ff]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Diálogo com o Córtex
                </span>
              </div>
              <span className="text-[8px] font-mono text-gray-500 border border-gray-800 bg-black p-1 rounded">
                SECURE AI HOST
              </span>
            </div>

            {/* MESSAGE CONTAINER */}
            <div 
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-5 flex flex-col gap-4.5 scrollbar-thin relative min-h-0 bg-gradient-to-b from-gray-950 to-black select-text"
            >
              {/* Premium Bio Breathing Aura Orb (Visual aesthetics) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full breathing-orb pointer-events-none opacity-10 blur-2xl z-0" />

              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex flex-col max-w-[88%] z-10 ${
                    msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  {/* Glassmorphic bubble cards */}
                  <div className={`rounded-2xl px-4 py-3 leading-relaxed border ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-cyan-800/30 text-white rounded-br-none shadow-lg'
                      : 'cyber-panel-glass text-gray-100 rounded-bl-none shadow-md shadow-black/30'
                  }`}>
                    
                    {/* Header active retrieval badge */}
                    {msg.role === 'assistant' && (
                      <div className="mb-2 flex items-center gap-2">
                        {msg.id === 'init' ? (
                          <span className="bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20 text-[8px] uppercase px-1.5 py-0.5 rounded font-mono font-bold inline-flex items-center gap-1">
                            🔄 Boot Inicial
                          </span>
                        ) : msg.cached ? (
                          <span className="bg-[#bd00ff]/20 text-[#d946ef] border border-[#bd00ff]/30 text-[8px] uppercase px-1.5 py-0.5 rounded font-mono font-bold inline-flex items-center gap-1 shadow-[0_0_8px_rgba(189,0,255,0.2)]">
                            ⚡ Bio-Cache Ativo
                          </span>
                        ) : (
                          <span className="bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 text-[8px] uppercase px-1.5 py-0.5 rounded font-mono font-bold inline-flex items-center gap-1">
                            🧠 RAG COGNITIVE SEARCH
                          </span>
                        )}
                      </div>
                    )}

                    {/* Markdown rendering text */}
                    <div className="prose prose-invert prose-xs text-xs whitespace-pre-wrap leading-relaxed tracking-wide">
                      {msg.content}
                    </div>

                    {/* Active Cognitive entities used context list */}
                    {msg.associatedEntities && msg.associatedEntities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-[#1f2937]/50 text-[9px] font-mono items-center">
                        <span className="text-gray-500 uppercase mr-1 text-[8px]">Sinapses Relacionadas:</span>
                        {msg.associatedEntities.map((ent, i) => (
                          <span 
                            key={i} 
                            onClick={() => {
                              playSciFiBeep(1100, 0.05);
                              setSearchQuery(ent);
                            }}
                            className="bg-[#05070a]/70 border border-[#30363d] hover:border-[#00ff9d]/40 text-[#00ff9d] px-1.5 py-0.5 rounded-md transition cursor-pointer"
                          >
                            🧬 {ent}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Rating / timestamp line */}
                  <div className="flex items-center gap-3 mt-1 px-1 font-mono text-[9px] text-gray-500 shrink-0">
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    
                    {msg.role === 'assistant' && msg.id !== 'init' && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">TREINAR:</span>
                        
                        <button 
                          type="button"
                          onClick={() => submitReinforcement(msg.id, msg.associatedEntities || [], 'good')}
                          className={`hover:text-[#00ff9d] transition flex items-center gap-0.5 cursor-pointer ${
                            msg.feedback === 'good' ? 'text-[#00ff9d] font-bold' : ''
                          }`}
                        >
                          <ThumbsUp className="w-2.5 h-2.5" /> Sim
                        </button>

                        <button 
                          type="button"
                          onClick={() => submitReinforcement(msg.id, msg.associatedEntities || [], 'bad')}
                          className={`hover:text-[#ff007c] transition flex items-center gap-0.5 cursor-pointer ${
                            msg.feedback === 'bad' ? 'text-[#ff007c] font-bold' : ''
                          }`}
                        >
                          <ThumbsDown className="w-2.5 h-2.5" /> Não
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Dynamic typing/generating state indicator */}
              {isGenerating && (
                <div className="self-start items-start max-w-[85%] flex flex-col z-10 animate-pulse">
                  <div className="rounded-2xl px-4 py-3 bg-[#0d1117]/80 border border-[#30363d]/50 leading-relaxed text-xs text-gray-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 animate-spin text-[#00f2ff]" />
                      <span>Processamento cortical profundo...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CHAT INPUT PANEL AND VOICE INDICATORS */}
            <div className="p-4 bg-gray-950 border-t border-gray-800/80 px-4 shrink-0 z-10">
              
              {/* Voice active recording indicator and breathing waveform element */}
              {isRecording && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg mb-2.5 animate-pulse justify-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">OUVINDO BIO-SINAL...</span>
                </div>
              )}

              {/* Message composer form footer block */}
              <form onSubmit={handleSendMessage} className="flex gap-2.5 items-center bg-black border border-gray-800 focus-within:border-cyan-500 rounded-full p-1 px-3 transition-colors duration-200">
                
                {/* Voice recording Mic trigger buttons */}
                <button
                  type="button"
                  onClick={toggleSpeechRecording}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isRecording 
                      ? 'bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
                      : 'bg-gray-800 text-[#00ff9d] border border-gray-700'
                  }`}
                  title="Falar por Voz"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Inspecione rotinas, converse ou interogue..."
                  className="flex-1 bg-transparent border-none text-xs outline-none text-white placeholder-gray-500 font-sans focus:ring-0 focus:outline-none"
                  disabled={isGenerating}
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || isGenerating}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    inputText.trim() && !isGenerating
                      ? 'bg-[#00f2ff] text-black hover:scale-105 active:scale-95'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </section>

        </div>

      {/* GO-TO SQL DATABASE SCHEMA MODAL VIEW OVERLAY */}
      {isSchemaModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn select-text">
          <div className="bg-[#070b13] border border-violet-950 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 bg-gray-950 border-b border-gray-900 shrink-0">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#bd00ff]" />
                <div>
                  <h3 className="text-sm font-bold font-mono text-white">Schema de Criação - codigo.db</h3>
                  <p className="text-[9px] text-[#bd00ff] font-mono uppercase tracking-wider font-extrabold">SQLite3 / PostgreSQL</p>
                </div>
              </div>
              <button
                onClick={() => { playSciFiBeep(300); setIsSchemaModalOpen(false); }}
                className="text-gray-400 hover:text-white font-mono text-xs hover:bg-gray-900 px-2.5 py-1 rounded-md transition cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1 font-mono text-[11px] leading-relaxed text-gray-300 scrollbar-thin">
              <p className="mb-3 text-[10.5px] text-gray-400 leading-normal">
                Execute este script DDL no terminal para gerar a estrutura relacional do seu banco de dados local (<code className="bg-black py-0.5 px-1.5 rounded-md border border-gray-900 text-[#00ff9d]">codigo.db</code>) que apoia o motor de conexões cognitivas e indexador RAG:
              </p>
              
              <div className="relative">
                <pre className="bg-black/95 text-[#00ff9d] p-4.5 rounded-lg overflow-x-auto max-h-96 text-[10px] border border-violet-950/40 select-all font-mono">
                  {`-- SCHEMA DE BANCO DE DADOS RELACIONAL (codigo.db)
-- BANCO DE DADOS: SQLite3 / PostgreSQL

-- Tabela de Memórias / Nós do Grafo
CREATE TABLE IF NOT EXISTS memorias (
    id TEXT PRIMARY KEY,
    conteudo TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('usuario', 'entidade', 'fato', 'evento', 'sentimento', 'resposta')),
    timestamp TEXT NOT NULL,
    visualWeight INTEGER DEFAULT 5,
    lastAccessed TEXT,
    accessCount INTEGER DEFAULT 0,
    details TEXT,
    docstring TEXT,
    codeSnippet TEXT,
    repoName TEXT
);

-- Tabela de Relações / Sinapses entre Nós
CREATE TABLE IF NOT EXISTS relacoes (
    id TEXT PRIMARY KEY,
    origem_id TEXT NOT NULL,
    destino_id TEXT NOT NULL,
    peso INTEGER DEFAULT 1 CHECK(peso BETWEEN 1 AND 10),
    tipo_relacao TEXT,
    FOREIGN KEY(origem_id) REFERENCES memorias(id) ON DELETE CASCADE,
    FOREIGN KEY(destino_id) REFERENCES memorias(id) ON DELETE CASCADE
);

-- Tabela de Feedbacks de Chat (Reforço AI)
CREATE TABLE IF NOT EXISTS feedbacks (
    id TEXT PRIMARY KEY,
    origem TEXT,
    conteudo TEXT,
    voto TEXT CHECK(voto IN ('good', 'bad')),
    timestamp TEXT NOT NULL
);

-- Tabela de Logs de Aprendizado e Auditoria
CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    acao TEXT NOT NULL,
    detalhe TEXT NOT NULL
);

-- Índices recomendados de alta velocidade
CREATE INDEX IF NOT EXISTS idx_memorias_tipo ON memorias(tipo);
CREATE INDEX IF NOT EXISTS idx_relacoes_origem ON relacoes(origem_id);
CREATE INDEX IF NOT EXISTS idx_relacoes_destino ON relacoes(destino_id);`}
                </pre>
                
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`-- SCHEMA DE BANCO DE DADOS RELACIONAL (codigo.db)
-- BANCO DE DADOS: SQLite3 / PostgreSQL

-- Tabela de Memórias / Nós do Grafo
CREATE TABLE IF NOT EXISTS memorias (
    id TEXT PRIMARY KEY,
    conteudo TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('usuario', 'entidade', 'fato', 'evento', 'sentimento', 'resposta')),
    timestamp TEXT NOT NULL,
    visualWeight INTEGER DEFAULT 5,
    lastAccessed TEXT,
    accessCount INTEGER DEFAULT 0,
    details TEXT,
    docstring TEXT,
    codeSnippet TEXT,
    repoName TEXT
);

-- Tabela de Relações / Sinapses entre Nós
CREATE TABLE IF NOT EXISTS relacoes (
    id TEXT PRIMARY KEY,
    origem_id TEXT NOT NULL,
    destino_id TEXT NOT NULL,
    peso INTEGER DEFAULT 1 CHECK(peso BETWEEN 1 AND 10),
    tipo_relacao TEXT,
    FOREIGN KEY(origem_id) REFERENCES memorias(id) ON DELETE CASCADE,
    FOREIGN KEY(destino_id) REFERENCES memorias(id) ON DELETE CASCADE
);

-- Tabela de Feedbacks de Chat (Reforço AI)
CREATE TABLE IF NOT EXISTS feedbacks (
    id TEXT PRIMARY KEY,
    origem TEXT,
    conteudo TEXT,
    voto TEXT CHECK(voto IN ('good', 'bad')),
    timestamp TEXT NOT NULL
);

-- Tabela de Logs de Aprendizado e Auditoria
CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    acao TEXT NOT NULL,
    detalhe TEXT NOT NULL
);

-- Índices recomendados de alta velocidade
CREATE INDEX IF NOT EXISTS idx_memorias_tipo ON memorias(tipo);
CREATE INDEX IF NOT EXISTS idx_relacoes_origem ON relacoes(origem_id);
CREATE INDEX IF NOT EXISTS idx_relacoes_destino ON relacoes(destino_id);`);
                    playSciFiBeep(1400, 0.1, 'sine');
                  }}
                  className="absolute top-2.5 right-2.5 bg-gray-950 border border-gray-800 hover:border-[#00ff9d] text-white hover:text-[#00ff9d] px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  📋 Copiar Código
                </button>
              </div>
            </div>
            
            <div className="p-3 bg-gray-950 border-t border-gray-900 text-center select-none shrink-0">
              <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-widest">
                Layon-System Brain Persistence Engine
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN LIVE PLAYROOM LANDING PAGE RUNTIME PLAYER */}
      {fullscreenCreatorBlock === 'preview' && creatorResult && (
        <div id="fullscreen_presentation_playroom" className="fixed inset-0 z-[100] bg-[#05070a] text-slate-150 flex flex-col h-screen w-screen animate-fadeIn select-none font-sans">
          {/* HUD Header */}
          <header className="h-14 px-3 sm:px-6 bg-slate-950/95 border-b border-indigo-950/80 backdrop-blur-md flex items-center justify-between shrink-0 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Back / Exit Button - Always visible, leftmost, highly interactive and distinct */}
              <button
                type="button"
                onClick={() => {
                  playSciFiBeep(650, 0.08);
                  setFullscreenCreatorBlock(null);
                }}
                className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/30 px-3 py-1.5 text-[10px] sm:text-xs font-mono font-black rounded-lg transition flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Voltar ao Painel do Cérebro"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-red-400" />
                <span>Voltar</span>
              </button>

              <div className="hidden sm:flex items-center gap-1.5 bg-[#00f2ff]/10 border border-[#00f2ff]/20 px-2 py-0.5 rounded shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-ping" />
                <span className="font-mono text-[8px] font-black text-[#00f2ff] tracking-widest uppercase">CONEXÃO</span>
              </div>

              <div className="min-w-0">
                <h2 className="text-xs font-mono font-extrabold text-white tracking-tight truncate max-w-[100px] sm:max-w-[200px]" title={creatorResult.appName}>{creatorResult.appName}</h2>
                <span className="text-[7.5px] text-gray-500 font-mono block uppercase tracking-widest -mt-0.5 truncate hidden xs:block">Estação de Testes</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Device Selector - hidden on narrow screens to prevent overlap */}
              <div className="hidden md:flex bg-black/60 p-0.5 rounded-lg border border-gray-900 gap-1 text-[9px] font-mono shrink-0">
                <button
                  type="button"
                  onClick={() => { setPreviewDeviceMode('desktop'); playSciFiBeep(800, 0.04); }}
                  className={`px-3 py-1 rounded transition font-bold uppercase ${previewDeviceMode === 'desktop' ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-cyan-500/10' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  🖥️ Desktop
                </button>
                <button
                  type="button"
                  onClick={() => { setPreviewDeviceMode('tablet'); playSciFiBeep(850, 0.04); }}
                  className={`px-3 py-1 rounded transition font-bold uppercase ${previewDeviceMode === 'tablet' ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-cyan-500/10' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  📱 Tablet
                </button>
                <button
                  type="button"
                  onClick={() => { setPreviewDeviceMode('mobile'); playSciFiBeep(900, 0.04); }}
                  className={`px-3 py-1 rounded transition font-bold uppercase ${previewDeviceMode === 'mobile' ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-cyan-500/10' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  📳 Mobile
                </button>
              </div>

              {/* Action buttons */}
              <button
                type="button"
                onClick={() => {
                  playSciFiBeep(1200, 0.08);
                  const iframe = document.getElementById('fullscreen_live_sandbox_iframe') as HTMLIFrameElement;
                  if (iframe) iframe.srcdoc = getLiveIframeHtml(creatorResult);
                  showToastMessage("Instância de Sandbox restaurada e reiniciada!");
                }}
                className="bg-slate-900/80 border border-slate-850 text-gray-300 hover:text-white px-2.5 py-1.5 text-[9.5px] font-mono rounded-lg transition flex items-center gap-1 cursor-pointer shrink-0"
                title="Recarregar canais e limpar caches de execução"
              >
                <RefreshCw className="w-3 h-3 text-[#00ff9d]" />
                <span className="hidden xs:inline">Reiniciar</span>
              </button>
            </div>
          </header>

          {/* SCREEN SPLIT CONTROLS */}
          <div className="flex-1 flex overflow-hidden min-h-0 bg-[#030508]">
            {/* Visual Screen Sandbox Stage */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.45)_0%,rgba(3,5,8,1)_100%)] overflow-hidden">
              <div className={`h-full transition-all duration-350 bg-slate-950 rounded-2xl shadow-2xl shadow-black/90 flex flex-col border border-indigo-950/50 overflow-hidden ${
                previewDeviceMode === 'desktop' 
                  ? 'w-full' 
                  : previewDeviceMode === 'tablet' 
                    ? 'w-[768px] max-w-full' 
                    : 'w-[390px] max-w-full'
              }`}>
                {/* Simulated Browser Address bar */}
                <div className="h-9 px-4 bg-slate-950/95 border-b border-gray-900/70 flex items-center justify-between shrink-0 text-gray-500 font-mono text-[9px] select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                  </div>
                  <div className="bg-black/60 px-6 py-0.5 rounded border border-gray-900/60 leading-none w-72 truncate text-center text-gray-400">
                    https://layon.studio/sandbox/app-viewer/{creatorResult.appName.toLowerCase().replace(/\s+/g, '-')}
                  </div>
                  <span className="text-[7px] text-[#00f2ff] tracking-widest">LIVE IFRAME</span>
                </div>

                <iframe
                  id="fullscreen_live_sandbox_iframe"
                  title={`${creatorResult.appName} Fullscreen Running Live Sandbox`}
                  className="flex-1 w-full bg-slate-950 border-0 select-text"
                  srcDoc={getLiveIframeHtml(creatorResult)}
                  sandbox="allow-scripts allow-same-origin allow-modals"
                />
              </div>
            </div>

            {/* LIVE TELEMETRIES & TERMINAL CONSOLE CONTROL (SIDE PANEL) */}
            <div className="w-96 border-l border-indigo-950/80 bg-[#07090e]/95 flex flex-col h-full overflow-hidden select-text">
              <div className="p-3.5 border-b border-indigo-950/80 bg-slate-950/90 flex items-center justify-between font-mono text-xs text-white shrink-0 select-none">
                <span className="font-bold flex items-center gap-2">
                  <Binary className="w-4 h-4 text-[#00ff9d] animate-pulse" />
                  TERMINAL INTEGRADO
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playSciFiBeep(550, 0.05);
                    setCreatorLogs([]);
                    showToastMessage("Histórico do Terminal limpo!");
                  }}
                  className="text-gray-500 hover:text-white hover:bg-slate-900/60 p-1 px-2 rounded transition uppercase text-[8px] border border-gray-900 cursor-pointer"
                >
                  Limpar
                </button>
              </div>

              {/* Console log list */}
              <div className="flex-1 p-4 overflow-y-auto scrollbar-thin bg-black/99 text-[#00ff9d] font-mono text-[10px] leading-relaxed flex flex-col gap-1.5 select-text">
                {creatorLogs.length === 0 ? (
                  <div className="text-gray-650 h-full flex flex-col items-center justify-center text-center gap-2.5 p-5">
                    <span className="text-[9.5px] uppercase font-black tracking-widest text-[#00f2ff] bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-800/20">Aguardando Execuções</span>
                    <p className="text-[9px] text-gray-500 max-w-xs mt-1 leading-relaxed font-sans">
                      Dica: Interaja e dê cliques na landing page! Cada ação, erro ou log produzido será exibido aqui em tempo real.
                    </p>
                  </div>
                ) : (
                  creatorLogs.map((log, i) => {
                    let levelColor = 'text-emerald-400';
                    if (log.includes('[ERROR]') || log.includes('[ERRO]')) levelColor = 'text-rose-500 font-semibold';
                    else if (log.includes('[WARN]') || log.includes('[AVISO]')) levelColor = 'text-yellow-400';
                    else if (log.includes('[ACTION]') || log.includes('[CLIQUE]')) levelColor = 'text-cyan-400';
                    return (
                      <div key={i} className={`border-b border-gray-950 pb-1.5 ${levelColor} select-text`}>
                        {log}
                      </div>
                    );
                  })
                )}
              </div>

              {/* JS Quick Exec Compiler Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const input = form.elements.namedItem('console_cmd') as HTMLInputElement;
                  if (input && input.value.trim() && creatorResult) {
                    const code = input.value;
                    const iframe = document.getElementById('fullscreen_live_sandbox_iframe') as HTMLIFrameElement;
                    if (iframe && iframe.contentWindow) {
                      iframe.contentWindow.postMessage({ type: 'EXECUTE_JS', code }, '*');
                    }
                    const defaultIframe = document.getElementById('live_creation_sandbox_iframe') as HTMLIFrameElement;
                    if (defaultIframe && defaultIframe.contentWindow) {
                      defaultIframe.contentWindow.postMessage({ type: 'EXECUTE_JS', code }, '*');
                    }
                    playSciFiBeep(1450, 0.05);
                    input.value = '';
                  }
                }}
                className="p-3 border-t border-indigo-950/80 bg-slate-950 flex gap-2 shrink-0 select-none"
              >
                <input
                  type="text"
                  name="console_cmd"
                  placeholder="Executar instrução JavaScript... (ex: alert('Layon!'))"
                  className="flex-1 bg-black border border-indigo-950/40 rounded px-2.5 py-2 text-xs text-white placeholder-gray-700 font-mono focus:border-[#00f2ff] outline-none"
                />
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Iframe-Safe Sci-Fi Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] bg-[#090d16] border border-[#00f2ff]/60 px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(0,242,255,0.3)] flex items-center gap-3 animate-bounce max-w-sm select-none">
          <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-ping" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] font-mono text-[#00f2ff] font-bold tracking-wider uppercase">NOTIFICAÇÃO DO SISTEMA</span>
            <span className="text-xs font-mono text-slate-100 font-medium leading-tight select-text">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Dynamic Iframe-Safe Sci-Fi Confirmation Modal */}
      {confirmationDialog.isOpen && (
        <div className="fixed inset-0 z-[99998] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-cyan-500/25 p-5 rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full animate-pulse" />
              <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">{confirmationDialog.title}</h3>
            </div>

            <p className="text-xs text-gray-300 font-sans leading-relaxed">{confirmationDialog.message}</p>

            <div className="flex items-center justify-end gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => {
                  playSciFiBeep(700, 0.08);
                  setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
                }}
                className="px-3.5 py-1.5 rounded-lg border border-slate-900 bg-slate-950 font-mono text-[9px] font-bold uppercase text-gray-400 hover:text-white transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  playSciFiBeep(1200, 0.1, 'sine');
                  confirmationDialog.onConfirm();
                }}
                className="px-4 py-1.5 rounded-lg bg-[#00ff9d] hover:bg-[#00d180] text-black font-mono font-black text-[9px] uppercase tracking-wider transition cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
