/**
 * Edge Function failures arrive as three distinct shapes from supabase-js:
 *
 *  - `FunctionsFetchError`  — `fetch()` itself rejected. In a browser this is
 *    almost always a CORS block, which is what Supabase's gateway returns when
 *    the function does not exist (HTTP 404 without CORS headers), or an offline
 *    client. No response ever reached us, so there is no server message.
 *  - `FunctionsHttpError`   — the function answered with a non-2xx status.
 *    `error.context` is the raw `Response`, so the body still holds the
 *    function's own `{ error }` payload.
 *  - `FunctionsRelayError`  — the Supabase relay could not route the request.
 */
interface EdgeFunctionError {
  name?: string;
  message?: string;
  context?: unknown;
}

const readServerMessage = async (error: EdgeFunctionError): Promise<string | null> => {
  const response = error.context as Response | undefined;
  if (!response || typeof response.json !== "function") return null;

  try {
    const body = await response.json();
    if (typeof body === "string") return body;
    if (body && typeof body === "object") {
      const message = (body as { error?: unknown; message?: unknown }).error ?? (body as { message?: unknown }).message;
      if (typeof message === "string" && message.trim()) return message;
    }
    return null;
  } catch {
    return null;
  }
};

export const describeEdgeFunctionError = async (
  error: EdgeFunctionError | null | undefined,
  service: string,
): Promise<string> => {
  if (!error) return `The ${service} service isn't answering just now. Give it another go in a moment.`;

  switch (error.name) {
    case "FunctionsFetchError":
      return `We couldn't reach the ${service} service at all — the request never left your browser. Check your connection, and if you're running this yourself, check the function is actually deployed.`;

    case "FunctionsRelayError":
      return `The ${service} service is down for a moment. Nothing was charged. Try again shortly.`;

    case "FunctionsHttpError": {
      const serverMessage = await readServerMessage(error);
      // The function's own words come first. "Rate limit exceeded" or
      // "Insufficient EcoCoins balance" is more use to a person than anything
      // phrased from the outside.
      if (serverMessage) return serverMessage;

      const response = error.context as Response | undefined;
      const status = response?.status;
      return status
        ? `The ${service} service had a problem (HTTP ${status}). It isn't you — try again shortly.`
        : `The ${service} service had a problem. Nothing was charged — try again shortly.`;
    }

    default:
      return error.message || `The ${service} service isn't answering just now. Give it another go in a moment.`;
  }
};
