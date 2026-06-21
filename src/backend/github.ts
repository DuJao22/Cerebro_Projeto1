/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db } from './database.js';
import { Memory, Relationship } from '../types.js';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
}

interface ParsedClass {
  name: string;
  docstring: string;
  codeSnippet: string;
  methods: string[];
}

interface ParsedFunction {
  name: string;
  params: string;
  docstring: string;
  codeSnippet: string;
  belongsToClass?: string;
}

interface ParsedFile {
  filePath: string;
  fileName: string;
  imports: string[];
  classes: ParsedClass[];
  functions: ParsedFunction[];
}

/**
 * Fetch list of repositories for a given user or authenticated account
 */
export async function listGitHubRepos(token?: string, username?: string): Promise<GitHubRepo[]> {
  let url = 'https://api.github.com/user/repos?per_page=100&sort=updated';
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'Layon-System-Brain-Analyst'
  };

  if (token && token.trim()) {
    headers['Authorization'] = `Bearer ${token.trim()}`;
  } else if (username && username.trim()) {
    url = `https://api.github.com/users/${username.trim()}/repos?per_page=100&sort=updated`;
  } else {
    throw new Error('Por favor, informe um Token do GitHub ou um Nome de Usuário.');
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const errorText = await res.text();
    if (res.status === 403) {
      if (errorText.toLowerCase().includes('rate limit') || res.headers.get('x-ratelimit-remaining') === '0') {
        throw new Error('Limite de requisições anônimo do GitHub excedido para o IP desse servidor. Por favor, insira um "GitHub Personal Token" para listar com segurança.');
      }
      throw new Error(`Acesso Negado (403): Permissões insuficientes para obter repositórios.`);
    } else if (res.status === 401) {
      throw new Error('O Token Pessoal do GitHub fornecido é inválido, expirou ou foi revogado.');
    } else if (res.status === 404) {
      throw new Error(`Usuário do GitHub "${username}" não foi encontrado. Verifique a grafia e tente novamente.`);
    }
    throw new Error(`Erro da API do GitHub: ${res.statusText} (${errorText})`);
  }

  return await res.json() as GitHubRepo[];
}

/**
 * Parses file contents (JS, TS, Python) to extract dependencies, classes, and functions.
 */
export function parseFileCode(filePath: string, content: string): ParsedFile {
  const fileName = filePath.split('/').pop() || filePath;
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  const importsObj = new Set<string>();
  const classes: ParsedClass[] = [];
  const functions: ParsedFunction[] = [];

  const lines = content.split('\n');

  if (['py'].includes(extension)) {
    // ---- PYTHON PARSING ----
    // 1. Imports
    lines.forEach(line => {
      const importMatch = line.match(/^\s*(?:import\s+(\w+)|from\s+(\w+)\s+import)/);
      if (importMatch) {
        const dep = importMatch[1] || importMatch[2];
        if (dep && dep.length > 1) importsObj.add(dep);
      }
    });

    // 2. Classes and Functions (Simple Regex AST-like Sweep)
    let currentClass: ParsedClass | null = null;
    let currentBlock: string[] = [];
    let currentBlockType: 'class' | 'func' | null = null;
    let currentBlockName = '';
    let currentBlockParams = '';
    let currentBlockDoc = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const classMatch = line.match(/^class\s+([A-Za-z0-9_]+)(?:\(([^)]+)\))?:/);
      const defMatch = line.match(/^(\s*)def\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)(?:\s*->\s*[^:]+)?:/);

      if (classMatch) {
        // Save previous block if exists
        if (currentBlockType === 'class' && currentClass) {
          currentClass.codeSnippet = currentBlock.join('\n');
          classes.push(currentClass);
        } else if (currentBlockType === 'func') {
          functions.push({
            name: currentBlockName,
            params: currentBlockParams,
            docstring: currentBlockDoc,
            codeSnippet: currentBlock.join('\n'),
            belongsToClass: currentClass ? currentClass.name : undefined
          });
        }

        const className = classMatch[1];
        currentClass = {
          name: className,
          docstring: '',
          codeSnippet: '',
          methods: []
        };
        currentBlock = [line];
        currentBlockType = 'class';
        currentBlockName = className;
        currentBlockDoc = '';

        // Extract immediate docstring if exists
        if (i + 1 < lines.length && lines[i + 1].trim().startsWith('"""')) {
          let j = i + 1;
          let doc = lines[j].trim();
          if (doc.endsWith('"""') && doc.length > 6) {
            currentClass.docstring = doc.replace(/"""/g, '').trim();
          } else {
            const docLines: string[] = [];
            while (j < lines.length) {
              docLines.push(lines[j]);
              if (j > i + 1 && lines[j].includes('"""')) break;
              j++;
            }
            currentClass.docstring = docLines.join('\n').replace(/"""/g, '').trim();
          }
        }
      } else if (defMatch) {
        // Save previous block
        if (currentBlockType === 'class' && currentClass) {
          currentClass.codeSnippet = currentBlock.join('\n');
          classes.push(currentClass);
        } else if (currentBlockType === 'func') {
          functions.push({
            name: currentBlockName,
            params: currentBlockParams,
            docstring: currentBlockDoc,
            codeSnippet: currentBlock.join('\n'),
            belongsToClass: currentClass ? currentClass.name : undefined
          });
        }

        const indent = defMatch[1];
        const funcName = defMatch[2];
        const params = defMatch[3];

        if (indent.length > 0 && currentClass) {
          currentClass.methods.push(funcName);
        }

        currentBlock = [line];
        currentBlockType = 'func';
        currentBlockName = funcName;
        currentBlockParams = params;
        currentBlockDoc = '';

        // Extract immediate docstring if exists
        if (i + 1 < lines.length && lines[i + 1].trim().startsWith('"""')) {
          let j = i + 1;
          const docLines: string[] = [];
          while (j < lines.length) {
            docLines.push(lines[j]);
            if (lines[j].trim().endsWith('"""') && (j > i + 1 || lines[j].trim().length > 3)) break;
            j++;
          }
          currentBlockDoc = docLines.join('\n').replace(/"""/g, '').trim();
        }
      } else {
        if (currentBlockType) {
          currentBlock.push(line);
        }
      }
    }

    // Flush final blocks
    if (currentBlockType === 'class' && currentClass) {
      currentClass.codeSnippet = currentBlock.slice(0, 30).join('\n'); // limit size
      classes.push(currentClass);
    } else if (currentBlockType === 'func') {
      functions.push({
        name: currentBlockName,
        params: currentBlockParams,
        docstring: currentBlockDoc,
        codeSnippet: currentBlock.slice(0, 30).join('\n'),
        belongsToClass: currentClass ? currentClass.name : undefined
      });
    }

  } else if (['js', 'jsx', 'ts', 'tsx'].includes(extension)) {
    // ---- JS / TS PARSING ----
    // 1. Imports
    lines.forEach(line => {
      const importMatch = line.match(/import\s+(?:[\w\s{},*]+|type\s+[^;]+)\s+from\s+['"]([^'"]+)['"]/);
      const requireMatch = line.match(/(?:const|let|var)\s+[\w\s{},*]+\s*=\s*require\s*\(['"]([^'"]+)['"]\)/);
      if (importMatch || requireMatch) {
        const fullDep = importMatch ? importMatch[1] : requireMatch![1];
        // Clean out path identifiers
        if (fullDep && !fullDep.startsWith('.') && !fullDep.startsWith('/') && !fullDep.startsWith('@/')) {
          const baseName = fullDep.split('/')[0]; // e.g. @google/genai or react-dom
          importsObj.add(baseName);
        }
      }
    });

    // 2. Classes and Functions scanning
    let inClass = false;
    let className = '';
    let currentClassBlock: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Match class
      const classMatch = line.match(/(?:export\s+)?class\s+([A-Za-z0-9_]+)/);
      if (classMatch) {
        inClass = true;
        className = classMatch[1];
        currentClassBlock = [line];
        classes.push({
          name: className,
          docstring: `Representação de classe: ${className}`,
          codeSnippet: lines.slice(i, i + 25).join('\n'), // Grab 25 lines
          methods: []
        });
      }

      // Match function declarations
      const funcMatch = line.match(/(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)/);
      const arrowMatch = line.match(/(?:export\s+)?const\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/);

      if (funcMatch || arrowMatch) {
        const name = funcMatch ? funcMatch[1] : arrowMatch![1];
        const params = funcMatch ? funcMatch[2] : arrowMatch![2];
        const snippet = lines.slice(i, i + 25).join('\n');

        // Look back for JSDoc documentation
        let j = i - 1;
        let docLines: string[] = [];
        if (j >= 0 && lines[j].trim().includes('*/')) {
          while (j >= 0) {
            docLines.unshift(lines[j]);
            if (lines[j].trim().startsWith('/**')) break;
            j--;
          }
        }
        const docstring = docLines.length > 0 
          ? docLines.join('\n').replace(/\/\*\*|\*\/|\*/g, '').trim() 
          : `Função de negócio mapeada no arquivo: ${fileName}`;

        functions.push({
          name,
          params,
          docstring,
          codeSnippet: snippet,
          belongsToClass: inClass ? className : undefined
        });

        if (inClass && classes.length > 0) {
          classes[classes.length - 1].methods.push(name);
        }
      }

      // Class brace counting helper simplified:
      if (inClass) {
        currentClassBlock.push(line);
        if (line.trim().startsWith('}') && !line.includes('{') && currentClassBlock.length > 5) {
          inClass = false;
        }
      }
    }
  }

  return {
    filePath,
    fileName,
    imports: Array.from(importsObj),
    classes,
    functions
  };
}

/**
 * Synchronize a user repository, pull code files, parse structure, and rebuild graph connections
 */
export async function syncGitHubRepoToBrain(
  owner: string,
  repo: string,
  branch: string,
  token?: string
): Promise<{ filesCount: number; classesCount: number; functionsCount: number; nodesAdded: number }> {
  
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'Layon-System-Brain-Analyst'
  };
  if (token && token.trim()) {
    headers['Authorization'] = `Bearer ${token.trim()}`;
  }

  let activeBranch = branch || 'main';
  db.addLog('COGNICÃO', `Iniciando clonagem virtual do repositório: "${owner}/${repo}" [Branch: ${activeBranch}]`);

  // Step 1: List all files recursively using the Git Trees API
  let treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${activeBranch}?recursive=1`;
  let treeRes = await fetch(treeUrl, { headers });

  // Automatic branch resolution helper
  if (treeRes.status === 404) {
    db.addLog('COGNICÃO', `Branch "${activeBranch}" do repositório "${owner}/${repo}" não localizado. Tentando obter o ramo padrão ou alternativo...`);
    // Try querying repo details directly to find default branch
    const repoDetailsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (repoDetailsRes.ok) {
      const repoData = await repoDetailsRes.json() as { default_branch?: string };
      if (repoData.default_branch && repoData.default_branch !== activeBranch) {
        activeBranch = repoData.default_branch;
        db.addLog('COGNICÃO', `Ramo alternativo detectado: "${activeBranch}". Re-tentando carga dos arquivos...`);
        treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${activeBranch}?recursive=1`;
        treeRes = await fetch(treeUrl, { headers });
      }
    } else if (activeBranch === 'main') {
      // Fallback fallback: try master directly
      activeBranch = 'master';
      db.addLog('COGNICÃO', `Sem conseguir dados do repositório. Tentando ramo legado alternativo por padrão ("master")...`);
      treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${activeBranch}?recursive=1`;
      treeRes = await fetch(treeUrl, { headers });
    }
  }

  if (!treeRes.ok) {
    const errorText = await treeRes.text();
    if (treeRes.status === 403) {
      if (errorText.toLowerCase().includes('rate limit') || treeRes.headers.get('x-ratelimit-remaining') === '0') {
        throw new Error('Limite de taxa (Rate Limit) da API do GitHub excedido para requisições anônimas. Por favor, insira um "GitHub Personal Token" no painel à esquerda para sincronizar repositórios com limites ampliados (5000 requisições por hora).');
      } else {
        throw new Error(`Acesso Negado (403): O token do GitHub fornecido pode não ter permissão ('repo' scope) para acessar o projeto "${owner}/${repo}".`);
      }
    } else if (treeRes.status === 401) {
      throw new Error('Não Autorizado (401): O token pessoal do GitHub é inválido, expirou ou foi revogado.');
    } else if (treeRes.status === 404) {
      throw new Error(`Repositório "${owner}/${repo}" ou ramo "${activeBranch}" não foi encontrado. Certifique-se de que o caminho é público ou que o token tem acesso.`);
    } else {
      throw new Error(`Falha ao ler árvore git: HTTP ${treeRes.status} (${treeRes.statusText})`);
    }
  }

  const treeJson = await treeRes.json() as { tree: { path: string; type: string; url: string; size?: number }[] };
  const allGitItems = treeJson.tree || [];

  // Filter out source code files of interests
  const targetExtensions = ['py', 'js', 'ts', 'tsx', 'jsx'];
  const codeFiles = allGitItems.filter(item => {
    if (item.type !== 'blob') return false;
    const ext = item.path.split('.').pop()?.toLowerCase() || '';
    // Exclude node_modules, build artifacts, configs, test folders to maintain optimal memory graph limits
    const pathLower = item.path.toLowerCase();
    if (pathLower.includes('node_modules/') || 
        pathLower.includes('dist/') || 
        pathLower.includes('build/') || 
        pathLower.includes('tests/') || 
        pathLower.includes('test_') || 
        pathLower.includes('.git/') ||
        pathLower.includes('package-lock.json')) {
      return false;
    }
    return targetExtensions.includes(ext);
  });

  // Limit ingestion size to top 15 modules to respect GitHub rate limiting and UI performance (keeps graph uncluttered)
  const filesToProcess = codeFiles.slice(0, 15);
  db.addLog('MEMORIZAÇÃO', `Identificados ${codeFiles.length} arquivos elegíveis. Serão digeridos os principais ${filesToProcess.length} arquivos.`);

  let nodesAddedCount = 0;
  let totalClasses = 0;
  let totalFunctions = 0;

  // Repository Master Node creation
  const repoNodeId = `repo_${owner.replace(/\W/g, '_').toLowerCase()}_${repo.replace(/\W/g, '_').toLowerCase()}`;
  const repoNodeName = `Repositório: ${owner}/${repo}`;
  
  db.saveMemory({
    id: repoNodeId,
    conteudo: repoNodeName,
    tipo: 'entidade',
    timestamp: new Date().toISOString(),
    visualWeight: 9, // Highly central repository node
    lastAccessed: new Date().toISOString(),
    repoName: repo,
    details: `Repositório integrado via Git Tracker API. Idioma principal estimado: Python/TypeScript.`
  });
  nodesAddedCount++;

  // ESTABLISH SINAPTIC TUNNEL TO CORE NODES TO PREVENT ISOLATION
  // 1. Connect to João Layon (id: '1') - the supervisor/creator
  db.saveRelationship({
    id: `rel_repo_${repoNodeId}_joaolayon`,
    origem_id: '1',
    destino_id: repoNodeId,
    peso: 9,
    tipo_relacao: 'Explora'
  });

  // 2. Connect to Cérebro Digital (id: '4') - the cognitive core
  db.saveRelationship({
    id: `rel_repo_${repoNodeId}_cerebro`,
    origem_id: '4',
    destino_id: repoNodeId,
    peso: 9,
    tipo_relacao: 'Mapeia'
  });

  // 3. Connect to Inteligência Artificial (id: '5') - the analysis system
  db.saveRelationship({
    id: `rel_repo_${repoNodeId}_ia`,
    origem_id: '5',
    destino_id: repoNodeId,
    peso: 8,
    tipo_relacao: 'Codifica'
  });

  // Process and ingest system directory nodes
  const directories = allGitItems.filter(item => {
    if (item.type !== 'tree') return false;
    const pathLower = item.path.toLowerCase();
    if (pathLower.includes('node_modules/') || 
        pathLower.includes('dist/') || 
        pathLower.includes('build/') || 
        pathLower.includes('tests/') ||
        pathLower.startsWith('node_modules') || 
        pathLower.startsWith('dist') || 
        pathLower.startsWith('build') || 
        pathLower.startsWith('tests') || 
        pathLower.includes('.git')) {
      return false;
    }
    return true;
  });

  const dirsToProcess = directories.slice(0, 30);
  dirsToProcess.forEach(dirItem => {
    const dirNodeId = `dir_${owner.toLowerCase()}_${repo.toLowerCase()}_${dirItem.path.replace(/\W/g, '_').toLowerCase()}`;
    db.saveMemory({
      id: dirNodeId,
      conteudo: `Diretório: ${dirItem.path}`,
      tipo: 'entidade',
      timestamp: new Date().toISOString(),
      visualWeight: 6,
      lastAccessed: new Date().toISOString(),
      repoName: repo,
      details: `Pasta/Diretório de código dentro do repositório ${owner}/${repo}: ${dirItem.path}`
    });
    nodesAddedCount++;

    // Connect folder --- belongs to ---> Repository
    db.saveRelationship({
      id: `rel_${dirNodeId}_${repoNodeId}`,
      origem_id: dirNodeId,
      destino_id: repoNodeId,
      peso: 6,
      tipo_relacao: 'diretorio_do_repositorio'
    });

    // Handle nested parent mappings
    const parts = dirItem.path.split('/');
    if (parts.length > 1) {
      const parentPath = parts.slice(0, -1).join('/');
      const parentNodeId = `dir_${owner.toLowerCase()}_${repo.toLowerCase()}_${parentPath.replace(/\W/g, '_').toLowerCase()}`;
      db.saveRelationship({
        id: `rel_${dirNodeId}_parent_${parentNodeId}`,
        origem_id: dirNodeId,
        destino_id: parentNodeId,
        peso: 8,
        tipo_relacao: 'subdiretorio_de'
      });
    }
  });

  for (const gitFile of filesToProcess) {
    try {
      // Step 2: Fetch the file contents using Git raw media API or raw content raw format
      const rawUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${gitFile.path}?ref=${branch}`;
      const blobRes = await fetch(rawUrl, { 
        headers: {
          ...headers,
          'Accept': 'application/vnd.github.v3.raw' // Returns raw text content directly
        }
      });

      if (!blobRes.ok) {
        console.warn(`Bypassed file retrieval for ${gitFile.path} due to HTTP ${blobRes.status}`);
        continue;
      }

      const fileContentString = await blobRes.text();

      // Step 3: Extract Class, Methods, and Functions
      const parsed = parseFileCode(gitFile.path, fileContentString);

      // Create file node in graph
      const fileNodeId = `file_${owner.toLowerCase()}_${repo.toLowerCase()}_${gitFile.path.replace(/\W/g, '_').toLowerCase()}`;
      db.saveMemory({
        id: fileNodeId,
        conteudo: `Arquivo: ${gitFile.path}`,
        tipo: 'fato',
        timestamp: new Date().toISOString(),
        visualWeight: 7,
        lastAccessed: new Date().toISOString(),
        repoName: repo,
        details: `Caminho: ${gitFile.path} | Importações extraídas: ${parsed.imports.join(', ') || 'Nenhuma'}`
      });
      nodesAddedCount++;

      // Connect File --belongs to--> Repository
      db.saveRelationship({
        id: `rel_${fileNodeId}_${repoNodeId}`,
        origem_id: fileNodeId,
        destino_id: repoNodeId,
        peso: 7,
        tipo_relacao: 'pertence_ao_repositorio'
      });

      // Connect File --belongs to--> Folder Node if directory is tracked
      const fileParts = gitFile.path.split('/');
      if (fileParts.length > 1) {
        const fileDirPath = fileParts.slice(0, -1).join('/');
        const dirNodeId = `dir_${owner.toLowerCase()}_${repo.toLowerCase()}_${fileDirPath.replace(/\W/g, '_').toLowerCase()}`;
        db.saveRelationship({
          id: `rel_${fileNodeId}_dir_${dirNodeId}`,
          origem_id: fileNodeId,
          destino_id: dirNodeId,
          peso: 8,
          tipo_relacao: 'contido_na_pasta'
        });
      }

      // Parse and register dependencies
      parsed.imports.slice(0, 5).forEach(imp => {
        const depId = `dep_${imp.replace(/\W/g, '_').toLowerCase()}`;
        db.saveMemory({
          id: depId,
          conteudo: `Biblioteca: ${imp}`,
          tipo: 'entidade',
          timestamp: new Date().toISOString(),
          visualWeight: 4,
          lastAccessed: new Date().toISOString(),
          repoName: repo,
          details: `Dependência externa detectada no arquivo ${gitFile.path}`
        });

        // Link File --imports--> Dependency
        db.saveRelationship({
          id: `rel_${fileNodeId}_${depId}`,
          origem_id: fileNodeId,
          destino_id: depId,
          peso: 4,
          tipo_relacao: 'importa'
        });
      });

      // Process Classes
      parsed.classes.forEach(cls => {
        totalClasses++;
        const classNodeId = `class_${owner.toLowerCase()}_${repo.toLowerCase()}_${cls.name.replace(/\W/g, '_').toLowerCase()}`;
        db.saveMemory({
          id: classNodeId,
          conteudo: `Classe: ${cls.name}`,
          tipo: 'entidade',
          timestamp: new Date().toISOString(),
          visualWeight: 8, // Structured classes have higher weight
          lastAccessed: new Date().toISOString(),
          codeSnippet: cls.codeSnippet,
          docstring: cls.docstring,
          repoName: repo,
          details: `Classe contida no arquivo ${gitFile.path}. Métodos detectados: ${cls.methods.join(', ') || 'Nenhum'}`
        });
        nodesAddedCount++;

        // Link Class --belongs to--> File
        db.saveRelationship({
          id: `rel_${classNodeId}_${fileNodeId}`,
          origem_id: classNodeId,
          destino_id: fileNodeId,
          peso: 8,
          tipo_relacao: 'contida_no_arquivo'
        });
      });

      // Process Functions
      parsed.functions.forEach(f => {
        totalFunctions++;
        const funcNodeId = `func_${owner.toLowerCase()}_${repo.toLowerCase()}_${f.name.replace(/\W/g, '_').toLowerCase()}`;
        db.saveMemory({
          id: funcNodeId,
          conteudo: `Função: ${f.name}`,
          tipo: 'evento',
          timestamp: new Date().toISOString(),
          visualWeight: 6,
          lastAccessed: new Date().toISOString(),
          codeSnippet: f.codeSnippet,
          docstring: f.docstring,
          repoName: repo,
          details: `Função definida no arquivo ${gitFile.path}. Parâmetros de entrada: (${f.params})` + (f.belongsToClass ? ` | Pertence à Classe: ${f.belongsToClass}` : '')
        });
        nodesAddedCount++;

        if (f.belongsToClass) {
          const classNodeId = `class_${owner.toLowerCase()}_${repo.toLowerCase()}_${f.belongsToClass.replace(/\W/g, '_').toLowerCase()}`;
          // Link Function --belongs to--> Class
          db.saveRelationship({
            id: `rel_${funcNodeId}_${classNodeId}`,
            origem_id: funcNodeId,
            destino_id: classNodeId,
            peso: 9,
            tipo_relacao: 'metodo_da_classe'
          });
        } else {
          // Link Function --belongs to--> File
          db.saveRelationship({
            id: `rel_${funcNodeId}_${fileNodeId}`,
            origem_id: funcNodeId,
            destino_id: fileNodeId,
            peso: 7,
            tipo_relacao: 'declarada_no_arquivo'
          });
        }
      });

    } catch (fileErr: any) {
      console.error(`Falha ao ler ou processar arquivo ${gitFile.path} do GitHub:`, fileErr);
    }
  }

  // Create synthesis audit trail
  db.addLog('COGNICÃO', `Varredura inteligente concluída. Adicionados ${nodesAddedCount} nós sinápticos ao cérebro relacionados ao repositório ${repo}.`);

  return {
    filesCount: filesToProcess.length,
    classesCount: totalClasses,
    functionsCount: totalFunctions,
    nodesAdded: nodesAddedCount
  };
}
