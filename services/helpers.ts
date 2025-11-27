export const paramsSerializer = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    const value = params[key];

    if (Array.isArray(value)) {
      if (value.length) {
        searchParams.append(key, JSON.stringify(value));
      }
    } else if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
};

