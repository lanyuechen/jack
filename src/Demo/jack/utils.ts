export function toCamelCase(str: string) {
  return str.replace(/[-_ \/\.](.)/g, (_, c) => c.toUpperCase());
}