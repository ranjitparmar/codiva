export interface User {
  id: string;
  email: string;
  isVerified: boolean;
  credits: number;
  lastCreditsClaimed: string | null;
  createdAt: string;
}

export interface Site {
  id: string;
  subdomain: string | null;
  filePath: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  generations: Generation[];
}

export interface Generation {
  id: string;
  prompt: string;
  tier: GenerationTier;
  status: GenerationStatus;
  creditsUsed: number;
  errorMsg: string | null;
  requestedSubdomain: string | null;
  siteId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationStatusResponse {
  status: GenerationStatus;
  subdomain: string | null;
  url: string | null;
  errorMsg: string | null;
}

export type GenerationTier = "STANDARD" | "PRO";
export type GenerationStatus = "PENDING" | "GENERATING" | "READY" | "FAILED";