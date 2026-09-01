import fs from 'fs';
import { merge } from 'lodash';
import path from 'path';

const docsDirectory = path.join(process.cwd(), 'pages/docs/doc');

export function getJsonDoc() {
  let spec = {};

  const files = fs.readdirSync(docsDirectory);
  const tags = [];
  let tagGroups = null;
  let servers = null;

  files.forEach((file) => {
    if (file.split('.').pop() === 'json') {
      const fullPath = path.join(docsDirectory, file);

      const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
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

      // servers também é definido em um único arquivo (basic_info.json).
      // O merge de arrays do lodash acontece por índice, então um arquivo que
      // declarasse o próprio servers sobrescreveria a URL base da spec inteira
      // (ex.: perder o prefixo /api e documentar URLs que retornam 404).
      if (content.servers) {
        servers = content.servers;
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

  if (servers) {
    spec.servers = servers;
  }

  return spec;
}
