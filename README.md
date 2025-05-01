# URL Shortener

A modern URL shortening service built with Next.js and NestJS.

## Features

- Shorten long URLs to compact, shareable links
- View list of all shortened URLs with statistics
- Search functionality for finding previously shortened URLs
- RESTful API for programmatic integration
- Real-time statistics tracking

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Query
- Zod for validation

### Backend

- NestJS
- TypeScript
- Jest for testing
- MongoDB for persistence

## Project Structure

```bash
url-shortener/
├── apps/
│   ├── web/           # Next.js frontend
│   └── api/           # NestJS backend
├── packages/
│   └── shared/        # Shared types and utilities
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm package manager
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd url-shortener
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   cp apps/api/.env.example apps/api/.env
   ```

4. Start the development servers:

   ```bash
   # Start both frontend and backend
   pnpm dev

   # Or start them separately
   pnpm web:dev
   pnpm api:dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## API Documentation

### Endpoints

1. `POST /api/encode`

   - Encodes a long URL to a shortened URL
   - Request body: `{ "url": "https://example.com" }`
   - Response: `{ "shortUrl": "http://short.est/abc123" }`

2. `GET /api/decode/:code`

   - Decodes a shortened URL to its original URL
   - Response: `{ "originalUrl": "https://example.com" }`

3. `GET /api/statistic/:code`

   - Returns statistics for a shortened URL
   - Response: `{ "visits": 42, "lastVisited": "2024-03-15T..." }`

4. `GET /api/list`

   - Lists all shortened URLs
   - Response: `{ "urls": [...] }`

5. `GET /:code`
   - Redirects to the original URL

## Testing

```bash
# Run all tests
pnpm test

# Run frontend tests
pnpm web:test

# Run backend tests
pnpm api:test
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Write or update tests
4. Submit a pull request

## License

MIT
