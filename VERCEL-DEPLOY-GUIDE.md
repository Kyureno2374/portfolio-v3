# 🚀 Гайд по деплою на Vercel и подключению домена

## 📋 Содержание
1. [Подготовка проекта](#подготовка-проекта)
2. [Деплой на Vercel](#деплой-на-vercel)
3. [Настройка переменных окружения](#настройка-переменных-окружения)
4. [Подключение своего домена](#подключение-своего-домена)
5. [Настройка DNS](#настройка-dns)
6. [Проверка и тестирование](#проверка-и-тестирование)

---

## 1. Подготовка проекта

### ✅ Что уже сделано:
- ✅ Код запушен на GitHub: https://github.com/Kyureno2374/portfolio-v3
- ✅ Next.js проект настроен в папке `client/`
- ✅ Все зависимости установлены

### 📝 Что нужно проверить:

1. **Убедись, что проект собирается локально:**
```bash
cd client
npm run build
```

Если есть ошибки - исправь их перед деплоем.

2. **Проверь файл `client/package.json`:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

---

## 2. Деплой на Vercel

### Шаг 1: Создай аккаунт на Vercel

1. Перейди на https://vercel.com
2. Нажми **"Sign Up"**
3. Выбери **"Continue with GitHub"**
4. Авторизуй Vercel доступ к твоему GitHub

### Шаг 2: Импортируй проект

1. На главной странице Vercel нажми **"Add New..."** → **"Project"**
2. Найди репозиторий **"portfolio-v3"** в списке
3. Нажми **"Import"**

### Шаг 3: Настрой проект

На странице настройки проекта:

**Framework Preset:** Next.js (должно определиться автоматически)

**Root Directory:** 
- Нажми **"Edit"**
- Выбери папку **"client"** (важно!)
- Нажми **"Continue"**

**Build and Output Settings:**
- Build Command: `npm run build` (по умолчанию)
- Output Directory: `.next` (по умолчанию)
- Install Command: `npm install` (по умолчанию)

**Environment Variables:** (настроим позже)

### Шаг 4: Деплой

1. Нажми **"Deploy"**
2. Подожди 2-3 минуты пока Vercel соберет и задеплоит проект
3. После успешного деплоя увидишь экран с конфетти 🎉

Твой сайт будет доступен по адресу типа:
```
https://portfolio-v3-xxx.vercel.app
```

---

## 3. Настройка переменных окружения

### Шаг 1: Открой настройки проекта

1. На странице проекта нажми **"Settings"** (вверху)
2. В левом меню выбери **"Environment Variables"**

### Шаг 2: Добавь переменные

Добавь следующие переменные:

#### Для фронтенда:

**NEXT_PUBLIC_API_URL**
- Value: `https://твой-бэкенд-домен.com/api` (или IP сервера)
- Environment: Production, Preview, Development
- Нажми **"Save"**

**ADMIN_PASSWORD**
- Value: `твой_секретный_пароль_для_админки`
- Environment: Production
- Нажми **"Save"**

### Шаг 3: Редеплой

После добавления переменных:
1. Перейди на вкладку **"Deployments"**
2. Найди последний деплой
3. Нажми три точки **"..."** → **"Redeploy"**
4. Подтверди **"Redeploy"**

---

## 4. Подключение своего домена

### Шаг 1: Открой настройки домена

1. На странице проекта нажми **"Settings"**
2. В левом меню выбери **"Domains"**

### Шаг 2: Добавь домен

1. В поле **"Enter domain"** введи свой домен:
   - Например: `kyureno.dev`
   - Или поддомен: `portfolio.kyureno.dev`

2. Нажми **"Add"**

### Шаг 3: Выбери тип настройки

Vercel предложит два варианта:

**Вариант A: Рекомендуемый (Nameservers)**
- Vercel управляет всеми DNS записями
- Проще настроить
- Автоматический SSL

**Вариант B: Кастомный (A/CNAME Records)**
- Ты управляешь DNS записями у своего регистратора
- Больше контроля
- Нужно настроить вручную

Рекомендую **Вариант A** для простоты.

---

## 5. Настройка DNS

### Вариант A: Nameservers (Рекомендуется)

#### Шаг 1: Получи nameservers от Vercel

После добавления домена Vercel покажет nameservers:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

#### Шаг 2: Измени nameservers у регистратора

**Если домен куплен на:**

**REG.RU:**
1. Войди в личный кабинет REG.RU
2. Перейди в **"Домены"** → выбери свой домен
3. Нажми **"Управление доменом"**
4. Найди раздел **"DNS-серверы и зона"**
5. Выбери **"Использовать другие DNS-серверы"**
6. Введи nameservers от Vercel:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
7. Нажми **"Сохранить"**

**Cloudflare:**
1. Войди в Cloudflare Dashboard
2. Выбери свой домен
3. Перейди в **"DNS"** → **"Records"**
4. Измени nameservers на Vercel (в настройках домена)

**Namecheap:**
1. Войди в Namecheap Dashboard
2. Найди свой домен → **"Manage"**
3. В разделе **"Nameservers"** выбери **"Custom DNS"**
4. Введи nameservers от Vercel
5. Нажми **"Save"**

**GoDaddy:**
1. Войди в GoDaddy
2. Перейди в **"My Products"** → **"Domains"**
3. Нажми на свой домен
4. Прокрути до **"Nameservers"** → **"Change"**
5. Выбери **"Enter my own nameservers"**
6. Введи nameservers от Vercel
7. Нажми **"Save"**

#### Шаг 3: Подожди распространения DNS

- Обычно занимает **5-30 минут**
- Может занять до **24-48 часов** (редко)
- Vercel покажет статус: **"Pending"** → **"Valid"**

---

### Вариант B: A/CNAME Records (Кастомный)

Если хочешь оставить DNS у своего регистратора:

#### Для корневого домена (example.com):

Добавь **A Record**:
```
Type: A
Name: @ (или пусто)
Value: 76.76.21.21
TTL: 3600
```

#### Для поддомена (www.example.com):

Добавь **CNAME Record**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### Для поддомена (portfolio.example.com):

Добавь **CNAME Record**:
```
Type: CNAME
Name: portfolio
Value: cname.vercel-dns.com
TTL: 3600
```

---

## 6. Проверка и тестирование

### ✅ Чек-лист после деплоя:

1. **Проверь основной домен:**
   - Открой `https://твой-домен.com`
   - Должен открыться сайт с SSL (🔒)

2. **Проверь редирект www:**
   - Открой `https://www.твой-домен.com`
   - Должен редиректить на основной домен

3. **Проверь все страницы:**
   - `/` - главная
   - `/projects` - проекты
   - `/skills` - скиллы
   - `/contact` - контакты
   - `/admin` - админка (если есть)

4. **Проверь темную тему:**
   - Переключи тему в header
   - Должна сохраняться при перезагрузке

5. **Проверь переключение языка:**
   - Переключи язык RU/EN
   - Проверь все страницы

6. **Проверь мобильную версию:**
   - Открой на телефоне
   - Проверь адаптивность

### 🔧 Если что-то не работает:

**Проблема: Сайт не открывается**
- Проверь статус DNS: https://dnschecker.org/
- Подожди еще немного (до 48 часов)
- Проверь nameservers у регистратора

**Проблема: Ошибка 404**
- Проверь Root Directory в настройках Vercel (должно быть `client`)
- Редеплой проект

**Проблема: Ошибка сборки**
- Проверь логи в Vercel Dashboard
- Убедись что проект собирается локально: `npm run build`
- Проверь переменные окружения

**Проблема: API не работает**
- Проверь переменную `NEXT_PUBLIC_API_URL`
- Убедись что бэкенд запущен и доступен
- Проверь CORS настройки на бэкенде

---

## 🎯 Дополнительные настройки

### Автоматический деплой при пуше

Vercel автоматически деплоит при каждом пуше в `main`:
```bash
git add .
git commit -m "update"
git push origin main
```

Vercel автоматически:
1. Обнаружит изменения
2. Соберет проект
3. Задеплоит на production

### Preview деплои

При создании Pull Request Vercel создаст preview деплой:
- Уникальный URL для тестирования
- Не влияет на production
- Автоматически удаляется после мержа

### Настройка редиректов

Создай файл `client/vercel.json`:
```json
{
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}
```

### Настройка headers

В `client/next.config.ts`:
```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};
```

---

## 📊 Мониторинг

### Vercel Analytics

1. Перейди в **"Analytics"** в проекте
2. Включи **"Enable Analytics"**
3. Смотри статистику посещений

### Vercel Speed Insights

1. Установи пакет:
```bash
npm install @vercel/speed-insights
```

2. Добавь в `client/src/app/layout.tsx`:
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## 🎉 Готово!

Твой сайт теперь:
- ✅ Задеплоен на Vercel
- ✅ Доступен по твоему домену
- ✅ Имеет SSL сертификат
- ✅ Автоматически обновляется при пуше

**Полезные ссылки:**
- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- DNS Checker: https://dnschecker.org/

**Нужна помощь?**
- Vercel Support: https://vercel.com/support
- Vercel Discord: https://vercel.com/discord
