# Portfolio

Персональный сайт-портфолио разработчика.

## Стек

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- Backend: Go (chi router)
- База данных: PostgreSQL 16

## Требования

- Node.js 18+
- Go 1.21+
- Docker

## Запуск

### 1. База данных

```bash
docker-compose up -d
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Клиент: http://localhost:3000

### 3. Backend

```bash
cd server
go run cmd/api/main.go
```

Сервер: http://localhost:8080

## Структура клиента (FSD)

```
client/src/
├── app/           # Next.js App Router
├── widgets/       # Композиционные блоки (Header)
├── features/      # Фичи (ThemeToggle, LanguageSwitcher)
├── entities/      # Сущности (Navigation)
└── shared/        # Переиспользуемый код (UI, lib, config)
```

## Дизайн и анимации

### Liquid Glass (Apple macOS Tahoe)

Реализован стиль "жидкое стекло" по гайдлайнам Apple:

- Динамическая прозрачность с `backdrop-filter: blur() saturate(180%)`
- Градиентное преломление света, реагирующее на позицию курсора
- Внутренние и внешние тени для эффекта глубины и парения
- Интерактивное свечение при наведении (radial-gradient)
- GPU-ускорение через `transform: translateZ(0)` и `will-change`

### Параметры LiquidGlass компонента

- `displacementScale` (0-5): интенсивность искажения
- `blurAmount` (0-3): сила размытия фона
- `elasticity` (0-1): плавность анимаций
- `cornerRadius`: радиус скругления
- `isInteractive`: включение hover-эффектов

### Анимации

- Переключение темы: иконки вращаются на 180° с плавным fade
- Навигация: активная вкладка с spring-анимацией и стеклянным фоном
- Hover-эффекты: scale(1.02-1.05) с динамическим свечением
- Мобильное меню: каскадная анимация элементов
- Выпадающий список: появление с scale + fade

### Доступность

- Поддержка `prefers-reduced-motion` для пользователей с чувствительностью к движению
- ARIA-атрибуты для интерактивных элементов
- Семантическая разметка

## Настройка

Добавьте файл `client/public/logo.png` с вашим логотипом (рекомендуемый размер: 80x80px).

## Лицензия

MIT
