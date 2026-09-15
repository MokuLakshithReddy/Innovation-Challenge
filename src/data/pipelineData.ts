export interface PipelineStage {
  id: string;
  name: string;
  shortDesc: string;
  description: string;
  status: "completed" | "running" | "pending" | "failed";
  duration: string;
  metrics?: { label: string; value: string }[];
  details: string[];
}

export interface PipelineLog {
  id: string;
  timestamp: string;
  level: "INFO" | "AST" | "DIFF" | "CHECK" | "SUCCESS" | "WARN";
  message: string;
  stageId?: string;
}

export interface EndpointDiff {
  id: string;
  method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
  path: string;
  status: "added" | "modified" | "removed" | "deprecated";
  tag: string;
  summary: string;
  description: string;
  breaking: boolean;
  changesSummary: string[];
  beforeSnippet?: string;
  afterSnippet: string;
  beforeSchema?: Record<string, unknown>;
  afterSchema: Record<string, unknown>;
}

export const MOCK_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "stage-1",
    name: "Git Commit Detected",
    shortDesc: "Fetching repository diff",
    description: "Webhook event received from GitHub Enterprise. Extracting git commit tree and modified controller files.",
    status: "completed",
    duration: "0.4s",
    metrics: [
      { label: "Commit", value: "c4a89f2" },
      { label: "Changed Files", value: "3 files" },
      { label: "Author", value: "Alex Morgan" },
    ],
    details: [
      "Cloned sparse tree for branch 'main' at HEAD c4a89f2",
      "Detected modified files: src/controllers/refund.controller.ts, src/routes/refund.route.ts, src/types/dto.ts",
      "Triggered AST worker daemon [worker-pod-04]",
    ],
  },
  {
    id: "stage-2",
    name: "Route Extraction",
    shortDesc: "Analyzing Express/Node controllers",
    description: "Babel & TypeScript AST parser traversed router declarations, middleware chains, and TypeScript interfaces.",
    status: "completed",
    duration: "1.2s",
    metrics: [
      { label: "AST Nodes", value: "1,420 nodes" },
      { label: "Decorators", value: "18 parsed" },
      { label: "Routes Found", value: "42 active" },
    ],
    details: [
      "Loaded TypeScript compiler API v5.4.2",
      "Extracted route signature: router.post('/v2/refunds', validateRefundDTO, handleRefund)",
      "Resolved DTO schema 'RefundRequest' and response type 'RefundResponse'",
      "Extracted JSDoc @summary 'Process multi-currency payment refund' and @tag 'Payments'",
    ],
  },
  {
    id: "stage-3",
    name: "Change Comparison",
    shortDesc: "Calculating diffs against current spec",
    description: "Semantic JSON tree comparison between previous baseline OpenAPI specification and newly extracted routes.",
    status: "completed",
    duration: "0.8s",
    metrics: [
      { label: "Routes Added", value: "+1 route" },
      { label: "Schemas Modified", value: "2 schemas" },
      { label: "Breaking Changes", value: "0 detected" },
    ],
    details: [
      "Fetched baseline OpenAPI 3.0.3 spec from registry artifact store",
      "Calculated path diff: [ADDED] /v2/refunds (methods: POST)",
      "Calculated schema diff: [MODIFIED] components/schemas/RefundRequest (added 'idempotencyKey')",
      "Calculated deprecation diff: [DEPRECATED] /v1/users/search query parameter 'full_name'",
    ],
  },
  {
    id: "stage-4",
    name: "Spec Validation",
    shortDesc: "Checking OpenAPI 3.1 compliance",
    description: "Automated linter and schema validator executing Spectral rulesets and structural contract checks.",
    status: "completed",
    duration: "0.9s",
    metrics: [
      { label: "Validation Engine", value: "Spectral v6.11" },
      { label: "Violations", value: "0 errors" },
      { label: "Spec Target", value: "OpenAPI 3.1.0" },
    ],
    details: [
      "Enforcing OAS 3.1 schema definition rules",
      "Check passed: all operations have unique operationId",
      "Check passed: requestBody schemas contain valid JSON Schema draft 2020-12 types",
      "Check passed: all HTTP response status codes have descriptions",
    ],
  },
  {
    id: "stage-5",
    name: "Deployment",
    shortDesc: "Publishing to Swagger / Redoc",
    description: "Generated artifacts synchronized with API gateway catalog and internal developer portal.",
    status: "completed",
    duration: "0.7s",
    metrics: [
      { label: "Deploy Target", value: "Swagger UI & Redoc" },
      { label: "CDN Invalidation", value: "42 edges purged" },
      { label: "Spec URL", value: "/specs/v3.1.json" },
    ],
    details: [
      "Rendered static documentation bundles",
      "Updated /v3.1/openapi.json distribution endpoint",
      "Triggered webhook: notified Slack channel #eng-api-updates",
      "Repository commit c4a89f2 status set to SUCCESS on GitHub",
    ],
  },
];

export const MOCK_PIPELINE_LOGS: PipelineLog[] = [
  { id: "log-1", timestamp: "11:28:40.120", level: "INFO", message: "[Webhook] Received 'push' event from github.com/fintech-core/payment-gateway-service", stageId: "stage-1" },
  { id: "log-2", timestamp: "11:28:40.312", level: "INFO", message: "[Git] HEAD advanced to c4a89f2 by Alex Morgan (feat(payments): add multi-currency refund endpoint)", stageId: "stage-1" },
  { id: "log-3", timestamp: "11:28:40.505", level: "AST", message: "[AST Extractor] Initializing Babel TypeScript AST engine for Node.js/Express controllers...", stageId: "stage-2" },
  { id: "log-4", timestamp: "11:28:40.890", level: "AST", message: "[AST Extractor] Scanning src/controllers/refund.controller.ts [182 LOC]", stageId: "stage-2" },
  { id: "log-5", timestamp: "11:28:41.150", level: "AST", message: "[AST Extractor] Identified Express route: router.post('/v2/refunds', validateRefundDTO)", stageId: "stage-2" },
  { id: "log-6", timestamp: "11:28:41.340", level: "AST", message: "[AST Extractor] Extracted TypeScript interface RefundRequest: { paymentId, amount, currency, reason, idempotencyKey }", stageId: "stage-2" },
  { id: "log-7", timestamp: "11:28:41.680", level: "DIFF", message: "[Diff Engine] Comparing extracted route map against baseline OpenAPI 3.0.3 registry...", stageId: "stage-3" },
  { id: "log-8", timestamp: "11:28:41.920", level: "DIFF", message: "[Diff Engine] Detected +1 new route: POST /v2/refunds (operationId: createRefundV2)", stageId: "stage-3" },
  { id: "log-9", timestamp: "11:28:42.140", level: "DIFF", message: "[Diff Engine] Detected ~1 modified schema: components.schemas.RefundRequest (added header 'X-Idempotency-Key')", stageId: "stage-3" },
  { id: "log-10", timestamp: "11:28:42.450", level: "CHECK", message: "[Validator] Running Spectral OpenAPI 3.1 verification ruleset...", stageId: "stage-4" },
  { id: "log-11", timestamp: "11:28:42.890", level: "CHECK", message: "[Validator] Checking RFC 7231 status responses: 201 Created, 400 Bad Request, 409 Conflict - OK", stageId: "stage-4" },
  { id: "log-12", timestamp: "11:28:43.110", level: "CHECK", message: "[Validator] 0 schema violations detected. Spec compliance rating: 100%", stageId: "stage-4" },
  { id: "log-13", timestamp: "11:28:43.340", level: "INFO", message: "[Publisher] Compiling bundle to Swagger UI and Redoc distribution endpoints...", stageId: "stage-5" },
  { id: "log-14", timestamp: "11:28:43.720", level: "SUCCESS", message: "[Publisher] Deployed OpenAPI 3.1.0 specification bundle successfully (duration: 3.8s total)", stageId: "stage-5" },
  { id: "log-15", timestamp: "11:28:43.990", level: "SUCCESS", message: "[GitHub Check] Updated commit check c4a89f2 status to 'success' with spec link", stageId: "stage-5" },
];

export const MOCK_DIFFS: EndpointDiff[] = [
  {
    id: "diff-1",
    method: "POST",
    path: "/v2/refunds",
    status: "added",
    tag: "Payments",
    summary: "Process Multi-Currency Refund",
    description: "Initiates a partial or full refund for a settled charge with automatic currency conversion and idempotency protection.",
    breaking: false,
    changesSummary: [
      "New endpoint added in Express router (POST /v2/refunds)",
      "Added RequestBody schema with mandatory 'idempotencyKey'",
      "Added response schemas for 201 (Created) and 409 (Idempotency Conflict)",
    ],
    beforeSnippet: `# Endpoint did not exist in baseline spec
# Route added in commit c4a89f2`,
    afterSnippet: `/v2/refunds:
  post:
    tags:
      - Payments
    summary: Process Multi-Currency Refund
    operationId: createRefundV2
    parameters:
      - name: X-Idempotency-Key
        in: header
        required: true
        schema:
          type: string
          format: uuid
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/RefundRequest'
    responses:
      '201':
        description: Refund successfully processed
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RefundResponse'
      '400':
        description: Invalid refund payload
      '409':
        description: Idempotent transaction already in progress`,
    afterSchema: {
      type: "object",
      required: ["paymentId", "amount", "currency"],
      properties: {
        paymentId: { type: "string", format: "uuid", example: "pay_9f82c401" },
        amount: { type: "integer", description: "Amount in smallest currency unit (cents)", example: 4500 },
        currency: { type: "string", enum: ["USD", "EUR", "GBP", "CAD", "JPY"], example: "USD" },
        reason: { type: "string", enum: ["fraudulent", "duplicate", "customer_request"], example: "customer_request" },
        idempotencyKey: { type: "string", format: "uuid" },
      },
    },
  },
  {
    id: "diff-2",
    method: "POST",
    path: "/v1/auth/login",
    status: "modified",
    tag: "Authentication",
    summary: "Authenticate User & Issue JWT",
    description: "Exchanges user credentials for scoped session JWT. Schema updated to require email identifier instead of legacy username.",
    breaking: true,
    changesSummary: [
      "Schema modification in LoginRequest DTO",
      "Property 'username' REMOVED (-)",
      "Property 'email' ADDED (+) with format 'email'",
    ],
    beforeSnippet: `components:
  schemas:
    LoginRequest:
      type: object
      required:
        - username
        - password
      properties:
        username:
          type: string
          description: Unique user account handle
          example: alex_morgan
        password:
          type: string
          format: password`,
    afterSnippet: `components:
  schemas:
    LoginRequest:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
          description: Primary verified user email address
          example: alex.morgan@fintech.io
        password:
          type: string
          format: password`,
    beforeSchema: {
      type: "object",
      required: ["username", "password"],
      properties: {
        username: { type: "string", example: "alex_morgan" },
        password: { type: "string", format: "password" },
      },
    },
    afterSchema: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", format: "email", example: "alex.morgan@fintech.io" },
        password: { type: "string", format: "password" },
      },
    },
  },
  {
    id: "diff-3",
    method: "GET",
    path: "/v1/users/search",
    status: "deprecated",
    tag: "Users",
    summary: "Search User Directory (Legacy)",
    description: "Searches users by text query. Marked as deprecated in favor of GET /v2/users/filter with cursor pagination.",
    breaking: false,
    changesSummary: [
      "Marked operation as 'deprecated: true'",
      "Added header recommendation for /v2/users/filter",
      "Scheduled sunset date: 2026-12-31",
    ],
    beforeSnippet: `/v1/users/search:
  get:
    tags:
      - Users
    summary: Search User Directory
    parameters:
      - name: query
        in: query
        schema:
          type: string`,
    afterSnippet: `/v1/users/search:
  get:
    tags:
      - Users
    summary: Search User Directory (Legacy)
    deprecated: true
    description: DEPRECATED: Please migrate to GET /v2/users/filter
    parameters:
      - name: query
        in: query
        schema:
          type: string`,
    afterSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        limit: { type: "integer", default: 20 },
      },
    },
  },
];

export const MOCK_OPENAPI_SPEC = {
  openapi: "3.1.0",
  info: {
    title: "Payment Gateway Service API",
    version: "3.1.0",
    description:
      "Autonomous OpenAPI 3.1 specification generated continuously by DocPulse Agent from Express & TypeScript controllers.",
    contact: {
      name: "API Engineering Platform",
      email: "api-platform@fintech-core.io",
    },
  },
  servers: [
    {
      url: "https://api.gateway.fintech-core.io",
      description: "Production Gateway (Live)",
    },
    {
      url: "https://staging-api.fintech-core.io",
      description: "Staging Sandbox",
    },
  ],
  paths: {
    "/v2/refunds": {
      post: {
        tags: ["Payments"],
        summary: "Process Multi-Currency Refund",
        operationId: "createRefundV2",
        parameters: [
          {
            name: "X-Idempotency-Key",
            in: "header",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "Unique request identifier preventing duplicate refund operations",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RefundRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Refund successfully processed and queued for settlement",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RefundResponse",
                },
              },
            },
          },
          "400": {
            description: "Validation error in refund request payload",
          },
          "409": {
            description: "Idempotency conflict detected; original operation still pending",
          },
        },
      },
    },
    "/v1/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Authenticate User & Issue JWT",
        operationId: "loginUser",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Authentication successful; returns signed bearer JWT",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse",
                },
              },
            },
          },
          "401": {
            description: "Invalid credentials supplied",
          },
        },
      },
    },
    "/v1/users/search": {
      get: {
        tags: ["Users"],
        summary: "Search User Directory (Legacy)",
        deprecated: true,
        operationId: "searchUsersLegacy",
        parameters: [
          {
            name: "query",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Search keyword matching user name or organization",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
          },
        ],
        responses: {
          "200": {
            description: "Array of matched user profiles",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/UserProfile" },
                },
              },
            },
          },
        },
      },
    },
    "/webhooks/stripe": {
      post: {
        tags: ["Webhooks"],
        summary: "Ingest Stripe Webhook Event",
        operationId: "stripeWebhookHandler",
        parameters: [
          {
            name: "stripe-signature",
            in: "header",
            required: true,
            schema: { type: "string" },
            description: "HMAC-SHA256 signature generated by Stripe to verify webhook integrity",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: { type: "string" },
                  created: { type: "integer" },
                  data: { type: "object" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Event acknowledged and queued",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      RefundRequest: {
        type: "object",
        required: ["paymentId", "amount", "currency"],
        properties: {
          paymentId: { type: "string", format: "uuid", example: "pay_09a473fa" },
          amount: { type: "integer", description: "Amount in minor units (cents)", example: 4500 },
          currency: { type: "string", enum: ["USD", "EUR", "GBP", "JPY"], example: "USD" },
          reason: { type: "string", enum: ["duplicate", "fraudulent", "customer_request"], example: "customer_request" },
          metadata: { type: "object", additionalProperties: true },
        },
      },
      RefundResponse: {
        type: "object",
        properties: {
          refundId: { type: "string", format: "uuid", example: "ref_550e8400" },
          status: { type: "string", enum: ["succeeded", "pending", "failed"], example: "succeeded" },
          amountRefunded: { type: "integer", example: 4500 },
          currency: { type: "string", example: "USD" },
          createdAt: { type: "string", format: "date-time", example: "2026-09-15T11:28:43Z" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "alex.morgan@fintech.io" },
          password: { type: "string", format: "password", example: "••••••••••••" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          tokenType: { type: "string", example: "Bearer" },
          expiresIn: { type: "integer", example: 3600 },
        },
      },
      UserProfile: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          name: { type: "string" },
          role: { type: "string" },
        },
      },
    },
  },
};
