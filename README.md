# Портфолио

Full-stack портфолио на Next.js + Go + PostgreSQL

## Requirements

- Node.js 18+
- Go 1.21+
- Docker

## Quick Start

### 1. Start Database

```bash
docker-compose up -d
```

### 2. Run Client

```bash
cd client
npm install
npm run dev
```

Client runs at http://localhost:3000

### 3. Run Server

```bash
cd server
go run cmd/api/main.go
```

Server runs at http://localhost:8080

### Health Check

```bash
curl http://localhost:8080/api/health
```

## Project Structure

```
├── client/          # Next.js 15 (FSD architecture)
├── server/          # Go API
├── docker-compose.yml
└── README.md
```

## License

MIT License. See LICENSE file.
