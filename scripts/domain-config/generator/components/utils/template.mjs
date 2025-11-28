import { resolveFeatureTemplatePath } from "../../utils/pathHelpers.mjs";

const templateDir = resolveFeatureTemplatePath("components");

function replaceTokens(content, tokens) {
  const safeLabel = tokens.label ?? tokens.pascal;
  const safeKebab = tokens.kebab ?? tokens.camel;
  const safeKebabPlural = tokens.kebabPlural ?? tokens.camelPlural;

  return content
    .replace(/__domain__/g, tokens.camel)
    .replace(/__Domain__/g, tokens.pascal)
    .replace(/__domains__/g, tokens.camelPlural)
    .replace(/__Domains__/g, tokens.pascalPlural)
    .replace(/__domainSlug__/gi, safeKebab)
    .replace(/__domainsSlug__/gi, safeKebabPlural)
    .replace(/__domainLabel__/gi, safeLabel);
}

export { templateDir, replaceTokens };
