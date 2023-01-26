import fs from 'fs';
import { merge } from 'lodash';
import path from 'path';

const docsDirectory = path.join(process.cwd(), 'pages/docs/doc');

export function getJsonDoc() {
  let spec = {};

  const files = fs.readdirSync(docsDirectory);
  const tags = [];
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

  return spec;
}
