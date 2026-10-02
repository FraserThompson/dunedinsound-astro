export type AssetsBinding = {
  fetch(request: Request): Promise<Response>;
};

export interface Env {
  ASSETS: AssetsBinding;
  R2_BUCKET?: R2Bucket;
}

export type CloudflareRequestInit = RequestInit & {
  cf?: {
    cacheEverything?: boolean;
    cacheTtlByStatus?: Record<string | number, number>;
  };
};
