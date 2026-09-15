import "server-only";

export function isJsonMutation(request) {
  // JSON requires a browser CORS preflight; these endpoints do not allow cross-origin CORS.
  return request.headers?.["content-type"]?.split(";")[0].trim().toLowerCase() === "application/json"
    && request.headers?.["sec-fetch-site"] !== "cross-site";
}
