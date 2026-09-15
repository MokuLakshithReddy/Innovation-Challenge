export interface Repository {
  id: string;
  name: string;
  org: string;
  framework: "Express / Node.js" | "FastAPI / Python" | "NestJS / TypeScript";
  branch: string;
  branches: string[];
  lastSync: string;
  totalEndpoints: number;
  openApiVersion: string;
  status: "healthy" | "running" | "failed";
}

export interface CommitActivity {
  id: string;
  hash: string;
  message: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  branch: string;
  status: "success" | "running" | "failed";
  changesCount: {
    added: number;
    modified: number;
    removed: number;
  };
  duration: string;
  agentSummary: string;
}

export const MOCK_REPOSITORIES: Repository[] = [
  {
    id: "repo-1",
    name: "payment-gateway-service",
    org: "fintech-core",
    framework: "Express / Node.js",
    branch: "main",
    branches: ["main", "feat/v2-checkout", "fix/refund-webhook", "staging"],
    lastSync: "Just now",
    totalEndpoints: 42,
    openApiVersion: "3.1.0",
    status: "healthy",
  },
  {
    id: "repo-2",
    name: "auth-identity-provider",
    org: "fintech-core",
    framework: "FastAPI / Python",
    branch: "production",
    branches: ["production", "develop", "feat/passkeys"],
    lastSync: "12m ago",
    totalEndpoints: 28,
    openApiVersion: "3.1.0",
    status: "healthy",
  },
  {
    id: "repo-3",
    name: "order-stream-pipeline",
    org: "fintech-core",
    framework: "NestJS / TypeScript",
    branch: "main",
    branches: ["main", "release/v3.0.0"],
    lastSync: "1h ago",
    totalEndpoints: 64,
    openApiVersion: "3.0.3",
    status: "healthy",
  },
];

export const MOCK_COMMITS: CommitActivity[] = [
  {
    id: "commit-1",
    hash: "c4a89f2",
    message: "feat(payments): add multi-currency refund endpoint and idempotency header",
    author: {
      name: "Alex Morgan",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    },
    timestamp: "4 minutes ago",
    branch: "main",
    status: "success",
    changesCount: { added: 1, modified: 2, removed: 0 },
    duration: "4.2s",
    agentSummary: "Extracted POST /v2/refunds route with 3 new response schemas. Updated RefundRequest DTO.",
  },
  {
    id: "commit-2",
    hash: "7b201a9",
    message: "refactor(auth): rename 'username' field to 'email' in LoginRequest payload",
    author: {
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    },
    timestamp: "38 minutes ago",
    branch: "feat/v2-checkout",
    status: "success",
    changesCount: { added: 0, modified: 1, removed: 0 },
    duration: "3.8s",
    agentSummary: "Detected breaking schema change in POST /v1/auth/login. Updated OpenAPI requestBody schema.",
  },
  {
    id: "commit-3",
    hash: "a12e84c",
    message: "feat(webhooks): add Stripe webhook signature validation middleware",
    author: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    },
    timestamp: "2 hours ago",
    branch: "main",
    status: "success",
    changesCount: { added: 2, modified: 0, removed: 0 },
    duration: "5.1s",
    agentSummary: "Identified new webhook listener at POST /webhooks/stripe with header 'stripe-signature'.",
  },
  {
    id: "commit-4",
    hash: "93f0b21",
    message: "chore(users): deprecate GET /v1/users/search query parameters in favor of /v2/filter",
    author: {
      name: "Alex Morgan",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    },
    timestamp: "5 hours ago",
    branch: "main",
    status: "success",
    changesCount: { added: 1, modified: 1, removed: 1 },
    duration: "4.0s",
    agentSummary: "Marked GET /v1/users/search with 'deprecated: true'. Added new endpoint GET /v2/users/filter.",
  },
];
