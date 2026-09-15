// Test-only adapters for Next's server marker, request context and @/ alias.
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
export async function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return { url: "data:text/javascript,export {};", shortCircuit: true };
  }
  if (["next/headers", "next/navigation"].includes(specifier)) {
    return { url: new URL("./request-context.mjs", import.meta.url).href, shortCircuit: true };
  }
  if (specifier.startsWith("@/")) {
    return { url: new URL(specifier.slice(2) + ".js", root).href, shortCircuit: true };
  }
  if (specifier.startsWith(".") && context.parentURL?.startsWith(root.href + "server/")) {
    return { url: new URL(/\.m?js$/.test(specifier) ? specifier : specifier + ".js", context.parentURL).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith(root.href + "server/") || url.startsWith(root.href + "pages/api/")) {
    return { format: "module", source: await readFile(new URL(url), "utf8"), shortCircuit: true };
  }
  return nextLoad(url, context);
}
