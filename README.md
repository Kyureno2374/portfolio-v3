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
- JSON file storage

**Инфраструктура:**
- Docker (PostgreSQL)
- GitHub Actions

## Запуск

### Frontend

```bash
cd client
npm install
npm run dev
```

Открыть http://localhost:3000

### Backend

```bash
cd server
go run cmd/api/main.go
```

API доступен на http://localhost:8080

### База данных (опционально)

```bash
docker-compose up -d
```

## Переменные окружения

**client/.env.local:**
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
ADMIN_PASSWORD=your_password
```

**server/.env:**
```
SERVER_PORT=8080
ADMIN_PASSWORD=your_password
```

## Структура

```
client/           # Next.js приложение (FSD архитектура)
  src/
    app/          # Страницы
    widgets/      # Виджеты (Header, Footer)
    features/     # Фичи (ThemeToggle, MusicPlayer)
    entities/     # Сущности (Navigation)
    shared/       # Общий код (UI, API, lib)

server/           # Go API
  cmd/api/        # Точка входа
  internal/       # Внутренняя логика
  data/           # JSON хранилище
```

## Лицензия

MIT
