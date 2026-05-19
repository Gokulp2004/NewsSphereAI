const openapi = {
    openapi: "3.0.3",
    info: {
        title: "NewsSphere AI API",
        version: "1.0.0",
        description: "REST API for NewsSphere AI - Multi-Source News Digest Platform"
    },
    servers: [{ url: "/" }],
    components: {
        securitySchemes: {
            ApiKeyAuth: {
                type: "apiKey",
                in: "header",
                name: "x-api-key"
            }
        },
        schemas: {
            ApiResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { type: "object" },
                    meta: { type: "object" }
                }
            },
            ErrorResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    errors: { type: "array", items: { type: "object" } }
                }
            },
            Article: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    content: { type: "string" },
                    source: { type: "string" },
                    url: { type: "string" },
                    image: { type: "string" },
                    publishedAt: { type: "string" },
                    author: { type: "string" },
                    topic: { type: "string" },
                    sentiment: { type: "string" },
                    summary: { type: "string" },
                    clusterId: { type: "string" }
                }
            },
            Cluster: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    clusterTitle: { type: "string" },
                    keywords: { type: "array", items: { type: "string" } },
                    sentiment: { type: "string" },
                    articleCount: { type: "number" },
                    articles: { type: "array", items: { $ref: "#/components/schemas/Article" } }
                }
            },
            Subscription: {
                type: "object",
                properties: {
                    email: { type: "string" },
                    topics: { type: "array", items: { type: "string" } }
                }
            }
        }
    },
    security: [{ ApiKeyAuth: [] }],
    paths: {
        "/api/health": {
            get: {
                summary: "Health check",
                security: [],
                responses: {
                    "200": { description: "Healthy", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } } }
                }
            }
        },
        "/api/digest": {
            get: {
                summary: "Get clustered news digest",
                parameters: [
                    { name: "page", in: "query", schema: { type: "number" } },
                    { name: "limit", in: "query", schema: { type: "number" } },
                    { name: "q", in: "query", schema: { type: "string" } },
                    { name: "topic", in: "query", schema: { type: "string" } },
                    { name: "sentiment", in: "query", schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Digest clusters", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } } }
                }
            }
        },
        "/api/topic/{name}": {
            get: {
                summary: "Get news by topic",
                parameters: [
                    { name: "name", in: "path", required: true, schema: { type: "string" } },
                    { name: "page", in: "query", schema: { type: "number" } },
                    { name: "limit", in: "query", schema: { type: "number" } },
                    { name: "q", in: "query", schema: { type: "string" } }
                ],
                responses: {
                    "200": { description: "Topic articles", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } } }
                }
            }
        },
        "/api/article/{id}": {
            get: {
                summary: "Get single article",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                responses: {
                    "200": { description: "Article", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } } }
                }
            }
        },
        "/api/trending": {
            get: {
                summary: "Get trending clusters",
                responses: {
                    "200": { description: "Trending clusters", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } } }
                }
            }
        },
        "/api/subscribe": {
            post: {
                summary: "Subscribe to topics",
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/Subscription" } } }
                },
                responses: {
                    "201": { description: "Subscription saved", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiResponse" } } } }
                }
            }
        }
    }
};

module.exports = openapi;
