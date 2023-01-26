const columnsCount = 6;
const imageSize = 115;

function formatRow(data, start) {
  const lastIndex = start + columnsCount;
  let index = start;
  let row = '';
  while (index < data.length && index < lastIndex) {
    const { login, html_url: url } = data[index];
    row += `[<img alt="${login}" src="${url}.png?size=${imageSize}" width="${imageSize}"><br><sub>@${login}</sub>](${url}) | `;
    index += 1;
  }
  return row;
}

function buildMarkdownTable(data) {
  let current = 0;
  let row = 0;
  let markdown = '';
  while (current < data.length) {
    markdown += `| ${formatRow(data, current).trim()}\n`;
    if (row === 0) {
      markdown += `| ${':---: |'.repeat(columnsCount)}\n`;
    }
    current += columnsCount;
    row += 1;
  }
  return markdown;
}

module.exports = function layout() {
  return buildMarkdownTable;
};
