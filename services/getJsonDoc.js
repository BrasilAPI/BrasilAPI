import fs from 'fs';
import { merge } from 'lodash';
import path from 'path';

const docsDirectory = path.join(process.cwd(), 'pages/docs/doc');

// Arquivo dono da identidade global da spec (openapi, info, servers).
const BASE_FILE = 'basic_info.json';

// Chaves globais que só podem vir do BASE_FILE. Um arquivo de endpoint que as
// declare sobrescreve a spec inteira no merge do lodash — foi assim que o
// `servers` perdeu o prefixo /api e todas as rotas da documentação passaram a
// exibir URLs que retornam 404.
const GLOBAL_KEYS = ['openapi', 'info', 'servers'];

export function getJsonDoc() {
  let spec = {};

  const files = fs.readdirSync(docsDirectory);
  const tags = [];
  let tagGroups = null;

  files.forEach((file) => {
    if (file.split('.').pop() === 'json') {
      const fullPath = path.join(docsDirectory, file);

      const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

      if (file !== BASE_FILE) {
        GLOBAL_KEYS.forEach((key) => delete content[key]);
      }

      spec = merge(spec, content);

      // Seção de tags sendo tratada dentro de um foreach pois o merge dos
      // arrays estava trazendo problemas com repetição de tags e sobrescrevendo outras.
      if (content.tags) {
        Object.values(content.tags).forEach((tag) => {
          tags.push(tag);
        });
      }

      // x-tagGroups é definido em um único arquivo (basic_info.json).
      // Extraímos aqui para evitar que o merge de arrays do lodash cause
      // duplicações caso outros arquivos venham a definir a propriedade.
      if (content['x-tagGroups']) {
        tagGroups = content['x-tagGroups'];
      }
    }
  });

  spec.tags = tags;

  spec.tags.sort((a, b) => {
    if (a.name.toLowerCase() === 'termos de uso') {
      return -1;
    }
    if (b.name.toLowerCase() === 'termos de uso') {
      return 1;
    }

    return a.name.localeCompare(b.name, 'pt-br');
  });

  if (tagGroups) {
    spec['x-tagGroups'] = tagGroups;
  }

  return spec;
}
