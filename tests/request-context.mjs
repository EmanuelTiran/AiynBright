export const cookieJar = new Map();
export async function cookies() {
  return {
    get: (name) => cookieJar.get(name),
    set: (name, value, options) => cookieJar.set(name, { value, options }),
  };
}
export function redirect(path) { throw new Error(`Redirect: ${path}`); }
