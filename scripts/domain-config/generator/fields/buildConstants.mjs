function formatOption(option, indent = 2) {
  const pad = " ".repeat(indent);
  const value = JSON.stringify(option.value);
  const label = JSON.stringify(option.label);
  return `${pad}{ value: ${value}, label: ${label} }`;
}

function formatOptions(options) {
  const body = options.map((option) => formatOption(option)).join(",\n");
  return ["[", body, "] as const"].join("\n");
}

export default function buildConstants(fields, filePath) {
  const header = `// ${filePath}\n\n// このファイルは domain-config スクリプトによって自動生成されています。\n// 手動での編集は変更が上書きされる可能性があるため推奨されません。`;

  const blocks = fields.map((field) => {
    const optionsLiteral = formatOptions(field.options);
    return `export const ${field.constantName} = ${optionsLiteral};`;
  });

  return `${header}\n\n${blocks.join("\n\n")}\n`;
}
