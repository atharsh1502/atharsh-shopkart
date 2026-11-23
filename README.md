# ShopKart — Full-Stack AI Shopping Agent

ShopKart is a learning project based on the [Full-Stack AI Agent Architecture course](https://resources.criodo.com/courses/fullstack-ai-agents-ecommerce/architecture/). It brings together a Spring Boot API, a React storefront, and a Spring AI agent that can search products, check stock, and place orders.

## What is in this repository?

```text
backend/       Spring Boot 3, Java 17+, Spring AI, JPA, H2
frontend/      React 18 and Vite storefront
```

### Implemented

- Product catalog API with category, free-text, and rupee price filters
- Persistent H2 database, sample ShopKart inventory, and a demo customer
- Validated order API with stock checks and exact `BigDecimal` totals
- Chat API and storefront chat panel
- Spring AI/OpenAI agent tools for product search, stock checks, and order placement
- Local demo chat mode so the storefront works before an API key is configured
- Chat response streaming over Server-Sent Events

## Prerequisites

- Java 17 or newer
- Maven 3.9+
- Node.js 20.19+ or 22.12+ (Node 24 also works)
- npm
- An OpenAI API key only if you want to enable LLM-powered chat

## Run locally

1. Start the backend:

   ```powershell
   cd backend
   mvn spring-boot:run
   ```

   The API listens on `http://localhost:8080`. The demo catalog is seeded automatically. H2 data is stored under `backend/data/`.

2. In a second terminal, start the storefront:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   Open `http://localhost:5173`.

3. Optional — enable the real Spring AI agent. Set the key in the backend process environment (never in React or a committed file), then restart the backend:

   ```powershell
   $env:OPENAI_API_KEY = "your-key"
   $env:SHOPKART_AI_ENABLED = "true"
   cd backend
   mvn spring-boot:run
   ```

   The key stays on the server. With AI disabled, the chat uses a small local demo assistant and no external API is called.

## API quick reference

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/products` | List products; optional `q`, `category`, and `maxPrice` filters |
| `GET` | `/api/products/{id}` | Product details |
| `GET` | `/api/orders/{id}` | Order details |
| `POST` | `/api/orders` | Place an order |
| `POST` | `/api/chat` | Send a message and receive a JSON reply |
| `POST` | `/api/chat/stream` | Stream a reply as `text/event-stream` |
| `GET` | `/actuator/health` | Application health |

Example:

```powershell
Invoke-RestMethod "http://localhost:8080/api/products?q=earbuds&maxPrice=3000"
```

The demo customer has ID `1`. For the order endpoint, send JSON such as:

```json
{
  "customerId": 1,
  "items": [{ "productId": 1, "quantity": 1 }]
}
```

## GitHub progress

This project is structured for incremental, reviewable progress. The GitHub Actions workflow builds and tests the backend and frontend on every push and pull request. After creating the empty `atharsh-shopkart` repository on GitHub, connect and publish this local repository:

```powershell
git remote add origin https://github.com/<your-github-username>/atharsh-shopkart.git
git push -u origin main
```

Use commits that describe each milestone (for example, `feat: add product catalog API` and `feat: build React storefront`). Never commit API keys.

## Suggested learning milestones

1. Project foundation, domain model, catalog seed data
2. Product and order REST APIs with validation and tests
3. React product storefront and chat interface
4. Spring AI connection and server-side tool calling
5. Agent actions, stock safety, and order placement
6. Streaming chat responses
7. Persistence, configuration, and API documentation
8. CI, GitHub progress, and a polished project demo

## Build and test

```powershell
cd backend
mvn test
cd ..\frontend
npm ci
npm run build
```

## License

This repository is a personal learning project.
