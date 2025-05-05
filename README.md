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



#### See how the real-time search functionality works

https://github.com/user-attachments/assets/02746e06-ed23-4151-b1f6-90fea3835b1e




#### See the safe deletion process with confirmation

https://github.com/user-attachments/assets/01181c7a-f854-4e78-98be-15409385f669



#### Explore the detailed statistics and analytics features
https://github.com/user-attachments/assets/568d17b1-475a-4082-a256-debb13505fdb

  
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

3. Start the development servers:

   ```bash
   # Start both frontend and backend
   pnpm dev

   # Or start them separately
   pnpm dev:web    # Frontend only
   pnpm dev:api    # Backend only
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

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

### Endpoints

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
