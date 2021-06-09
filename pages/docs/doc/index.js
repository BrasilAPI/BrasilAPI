import fs from 'fs';
import path from 'path';

const docsDirectory = path.join(process.cwd(), 'pages/docs/doc');

export function getJson() {
  let spec = {};
  fs.readdirSync(docsDirectory, 'utf-8', (err, files) => {
    spec = files;
    if (err) {
      console.log(err);
      // onError(err);
      return;
    }

    files.forEach((file) => {
      if (file.split('.').pop() === 'json') {
        const fullPath = path.join(docsDirectory, file);
        // spec.push(fullPath);
        const content = fs.readFileSync(`./${fullPath}`, 'utf-8');
        spec = { ...spec, ...content };
      }
      /*
fs.readFile(dirname + filename, 'utf-8', function(err, content) {
if (err) {
  onError(err);
  return;
}
onFileContent(filename, content);
}); */
      console.log(file);
    });
  });

  return spec;
}
