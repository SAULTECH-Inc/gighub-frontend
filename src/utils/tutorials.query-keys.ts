// tutorials.query-keys.ts
export const tutorialsQueryKeys = {
  all: ["tutorials"] as const,
  lists: () => [...tutorialsQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...tutorialsQueryKeys.lists(), filters] as const,
  details: () => [...tutorialsQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...tutorialsQueryKeys.details(), id] as const,
};
