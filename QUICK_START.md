# SquadVoice - Quick Start Guide

## 🚀 Запуск за 5 минут

### 1. Установка зависимостей

```bash
# Установить все зависимости для всех проектов
npm install
npm run install:all
```

### 2. Настройка базы данных

```bash
# Создать базу данных PostgreSQL
psql -U postgres -c "CREATE DATABASE squadvoice;"

# Применить схему
cd signal-server
psql -U postgres -d squadvoice -f src/database/schema.sql
```

### 3. Настройка переменных окружения

```bash
# Signal Server
cd signal-server
cp .env.example .env
# Отредактируйте .env:
# - DATABASE_URL=postgresql://postgres:password@localhost:5432/squadvoice
# - JWT_SECRET=your-random-secret-key

# Telegram Bot (опционально)
cd ../telegram-bot
cp .env.example .env
# Добавьте TELEGRAM_BOT_TOKEN от @BotFather
```

### 4. Запуск Signal Server

```bash
cd signal-server
npm run dev
```

Сервер запустится на:
- HTTP API: http://localhost:8080
- WebSocket: ws://localhost:8081

### 5. Запуск Desktop Client

```bash
# В новом терминале
cd desktop-client
npm run dev
```

Это запустит:
- Vite dev server на http://localhost:3000
- Electron app автоматически откроется

### 6. Запуск Telegram Bot (опционально)

```bash
# В новом терминале
cd telegram-bot
npm run dev
```

## 🎮 Первое использование

1. **Регистрация**
   - Откроется окно регистрации
   - Введите никнейм (проверка доступности)
   - Создайте пароль
   - (Опционально) Привяжите Telegram
   - Выберите имя и аватарку

2. **Главный экран**
   - Слева: список серверов
   - В центре: список каналов
   - Справа: основной контент

## 🔧 Разработка

### Структура команд

```bash
# Запустить все в dev режиме
npm run dev:client   # Desktop client
npm run dev:server   # Signal server
npm run dev:bot      # Telegram bot

# Build для production
npm run build:client
npm run build:server

# Запустить production build
npm run start        # Signal server
```

### Полезные команды

```bash
# Проверить типы TypeScript
cd desktop-client && npx tsc --noEmit
cd signal-server && npx tsc --noEmit

# Форматирование кода (если настроен prettier)
npm run format

# Линтинг (если настроен eslint)
npm run lint
```

## 🐛 Troubleshooting

### Проблема: "Cannot connect to database"
```bash
# Проверьте что PostgreSQL запущен
sudo systemctl status postgresql  # Linux
brew services list                # macOS

# Проверьте DATABASE_URL в .env
```

### Проблема: "WebSocket connection failed"
```bash
# Убедитесь что signal-server запущен
curl http://localhost:8080/health

# Проверьте что порт 8081 свободен
lsof -i :8081  # Linux/macOS
netstat -ano | findstr :8081  # Windows
```

### Проблема: "Electron не запускается"
```bash
# Пересоберите main process
cd desktop-client
npm run build:main

# Очистите кеш
rm -rf node_modules/.cache
```

## 📝 Следующие шаги

После успешного запуска:

1. Изучите [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) для понимания архитектуры
2. Прочитайте [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) для плана разработки
3. Начните с реализации Voice Engine (Priority 1)

## 🆘 Помощь

- GitHub Issues: [создать issue](https://github.com/your-org/squadvoice/issues)
- Документация: [docs/](docs/)
- Telegram: @squadvoice_support

---

Готово! Теперь у вас запущен SquadVoice в dev режиме 🎉
