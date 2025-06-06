# URL Shortener

A modern URL shortening service built with NestJS and Next.js, featuring a clean UI and comprehensive API.

## Features

- Create short URLs from long URLs
- View all shortened URLs with statistics
- Search through URLs
- Copy shortened URLs to clipboard
- Delete URLs
- View detailed statistics for each URL
- Responsive design
- API endpoints for programmatic access

## Video Demos

### Core Features

#### Watch how to create shortened URLs

https://github.com/user-attachments/assets/72dc8d06-d3b6-4ceb-9145-3443d2e8ce5b

#### See the one-click copy functionality in action and real-time updates on link visits

https://github.com/user-attachments/assets/2d0880ed-7b2c-4d73-aaae-e5c84df97365

#### Explore the detailed statistics and analytics features

https://github.com/user-attachments/assets/f8d3d887-5941-42c3-a394-8d949134c8e9

#### See how the real-time search functionality works

https://github.com/user-attachments/assets/02746e06-ed23-4151-b1f6-90fea3835b1e

#### See the safe deletion process with confirmation

https://github.com/user-attachments/assets/01181c7a-f854-4e78-98be-15409385f669

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript
- **Testing**: Jest, React Testing Library

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)

## Project Structure

```
url-shortener/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── src/
│   │   │   ├── url/        # URL module
│   │   │   └── main.ts     # Application entry point
│   │   └── test/           # Backend tests
│   └── web/                # Next.js frontend
│       ├── src/
│       │   ├── app/        # Next.js app directory
│       │   └── components/ # React components
│       └── test/           # Frontend tests
└── package.json
```

## Setup Instructions

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
   # Backend (NestJS)
   cd apps/api
   cp .env.example .env
   # Edit .env with your configuration

   # Frontend (Next.js)
   cd ../web
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Start the development servers:

   ```bash
   # Start both frontend and backend
   pnpm dev

   # Or start them separately
   pnpm dev:web    # Frontend only
   pnpm dev:api    # Backend only
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3000/api/docs

## Running Tests

```bash
# Run all tests
pnpm test

# Run frontend tests only
pnpm test:web

# Run backend tests only
pnpm test:api
```

## API Documentation

### Interactive API Documentation (Swagger UI)

For a more user-friendly and interactive API documentation, you can access the Swagger UI at:

deployed url:
```
https://url-shortener-dxks.onrender.com/api/docs
```

dev url:
```
http://localhost:3000/api/docs
```

The Swagger UI provides:

- Interactive API testing interface
- Detailed request/response schemas
- Example requests
- Authentication requirements (if any)
- Try-it-out functionality for all endpoints

### API Endpoints Reference

#### Create Short URL

- **POST** `/api/encode`
- **Body**: `{ "url": "https://example.com" }`
- **Response**: `{ "shortUrl": "http://localhost:3000/abc123" }`

#### Get Original URL

- **GET** `/api/decode/:code`
- **Response**: `{ "originalUrl": "https://example.com" }`

#### Get URL Statistics

- **GET** `/api/statistic/:code`
- **Response**:
  ```json
  {
    "visits": 10,
    "createdAt": "2024-03-01T00:00:00.000Z",
    "lastVisited": "2024-03-03T00:00:00.000Z",
    "visitsByDay": [...],
    "visitsByCountry": [...],
    "visitsByDevice": [...]
  }
  ```

#### List All URLs

- **GET** `/api/list`
- **Response**: Array of URL objects

#### Search URLs

- **GET** `/api/search?q=example`
- **Response**: Array of matching URL objects

#### Redirect to Original URL

- **GET** `/:code`
- **Response**: Redirects to original URL

#### Delete URL

- **DELETE** `/:code`
- **Response**: Boolean indicating success

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint and Prettier for code formatting
- Follows NestJS and Next.js best practices

### Testing

- Unit tests for both frontend and backend
- Integration tests for API endpoints
- Component tests for React components

### Error Handling

- Comprehensive error handling on both frontend and backend
- User-friendly error messages
- Proper HTTP status codes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

### API Usage

- [API Integration](https://example.com/demos/api-integration.mp4) - Learn how to integrate with the URL shortener API
- [Bulk Operations](https://example.com/demos/bulk-operations.mp4) - See how to perform bulk URL operations

> Note: Replace the example.com URLs with actual video demo links when available.

## Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following settings:

   - Name: url-shortener-api
   - Environment: Node
   - Build Command: `cd apps/api && pnpm install --no-frozen-lockfile && pnpm build`
   - Start Command: `cd apps/api && pnpm start:prod`
   - Environment Variables:
     ```
     PORT=10000
     FRONTEND_URL=your-frontend-url
     ```

4. Deploy!

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure the following settings in Vercel:

   - Framework Preset: Next.js
   - Build Command: `cd ../.. && pnpm install --no-frozen-lockfile && pnpm build:web`
   - Output Directory: `apps/web/.next`
   - Install Command: `pnpm install --no-frozen-lockfile`
   - Environment Variables:
     ```
     NEXT_PUBLIC_API_URL=your-api-url
     ```

4. Deploy!

Note: Make sure to set up your backend API separately and update the `NEXT_PUBLIC_API_URL` environment variable in Vercel to point to your deployed API.
