export const createApi = (baseUrl: string, accessToken: string) => {
  const authHeader = `Bearer ${accessToken}`;

  const request = async <T, B = undefined>(
    method: "GET" | "POST",
    url: string,
    body?: B,
  ): Promise<T> => {
    const response = await fetch(`${baseUrl}${url}`, {
      method,
      headers: {
        Authorization: authHeader,
        ...(method === "POST" ? { "Content-Type": "application/json" } : {}),
      },
      ...(method === "POST" && body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      throw new Error(`${method} ${url} failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  };

  return {
    get: <T = unknown>(url: string): Promise<T> => request<T>("GET", url),
    post: <T = unknown, B = unknown>(url: string, body: B): Promise<T> =>
      request<T, B>("POST", url, body),
  };
};
