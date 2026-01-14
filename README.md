# Portfolio v3

Персональный сайт-портфолио с админкой для редактирования контента.

## Стек

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

**Backend:**
- Go (chi router)
- PostgreSQL (pgx)

**Инфраструктура:**
- Docker

## Запуск

### 1. База данных

```bash
docker-compose up -d
```

Применить миграции:
```bash
psql -h localhost -U user -d dbname -f server/migrations/001_init.sql
```

### 2. Backend

```bash
cd server
go run cmd/api/main.go
```

API: http://localhost:8080

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Сайт: http://localhost:3000

## Переменные окружения

**client/.env.local:**
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
ADMIN_PASSWORD=your_password
```

**server/.env:**
```
SERVER_PORT=8080
DB_URL=postgres://user:pass@localhost:5432/dbname?sslmode=disable
ADMIN_PASSWORD=your_password
```

## Структура

```
client/           # Next.js (FSD)
server/           # Go API
  migrations/     # SQL миграции
```

## Лицензия

MIT
