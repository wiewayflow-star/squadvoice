# Contributing to SquadVoice

Спасибо за интерес к SquadVoice! Мы приветствуем любой вклад в проект.

## 🚀 Как начать

1. **Fork репозиторий**
2. **Clone ваш fork**
   ```bash
   git clone https://github.com/your-username/squadvoice.git
   cd squadvoice
   ```
3. **Установите зависимости**
   ```bash
   npm install
   npm run install:all
   ```
4. **Создайте ветку для вашей фичи**
   ```bash
   git checkout -b feature/amazing-feature
   ```

## 📝 Процесс разработки

### 1. Выберите задачу

- Посмотрите [Issues](https://github.com/your-org/squadvoice/issues)
- Выберите задачу с меткой `good first issue` для начала
- Или создайте новый Issue для обсуждения вашей идеи

### 2. Разработка

- Следуйте существующему стилю кода
- Пишите понятные commit messages
- Добавляйте комментарии для сложной логики
- Обновляйте документацию при необходимости

### 3. Тестирование

```bash
# Запустите тесты (когда будут добавлены)
npm test

# Проверьте типы TypeScript
cd desktop-client && npx tsc --noEmit
cd signal-server && npx tsc --noEmit
```

### 4. Commit

Используйте понятные commit messages:

```
feat: Add voice activity detection
fix: Fix WebRTC connection timeout
docs: Update API documentation
refactor: Simplify peer connection logic
test: Add tests for crypto functions
```

### 5. Push и Pull Request

```bash
git push origin feature/amazing-feature
```

Создайте Pull Request с описанием:
- Что изменено
- Почему это нужно
- Как это тестировалось

## 🎯 Приоритетные области

### High Priority
- Voice Engine (WebRTC, audio processing)
- P2P mesh networking
- E2E encryption (Signal Protocol)
- UI/UX improvements

### Medium Priority
- Peer-hosted SFU
- Sub-mesh topology
- Roles & permissions
- Performance optimization

### Low Priority
- Screen sharing
- File transfers
- Mobile clients
- Additional features

## 📐 Code Style

### TypeScript
- Используйте строгую типизацию
- Избегайте `any` где возможно
- Предпочитайте `interface` над `type` для объектов
- Используйте `const` по умолчанию

### React
- Функциональные компоненты с hooks
- Props типизированы через interface
- Используйте `React.FC` для компонентов
- Деструктурируйте props

### Naming
- camelCase для переменных и функций
- PascalCase для компонентов и классов
- UPPER_CASE для констант
- Понятные, описательные имена

### Примеры

```typescript
// Good
interface UserProfile {
  id: string;
  nickname: string;
  displayName: string;
}

const getUserProfile = async (userId: string): Promise<UserProfile> => {
  // ...
};

// Bad
interface user {
  id: any;
  name: string;
}

function get(id) {
  // ...
}
```

## 🔒 Security Guidelines

- **Никогда** не коммитьте приватные ключи или токены
- **Всегда** валидируйте пользовательский ввод
- **Используйте** prepared statements для SQL
- **Шифруйте** чувствительные данные
- **Следуйте** принципу least privilege

## 📚 Документация

При добавлении новых фич:
- Обновите README.md
- Добавьте JSDoc комментарии
- Обновите API.md для новых endpoints
- Добавьте примеры использования

## 🐛 Reporting Bugs

При создании bug report включите:
- Описание проблемы
- Шаги для воспроизведения
- Ожидаемое поведение
- Фактическое поведение
- Скриншоты (если применимо)
- Версия ОС и приложения
- Логи (если есть)

## 💡 Feature Requests

При предложении новой фичи опишите:
- Проблему, которую решает фича
- Предлагаемое решение
- Альтернативные варианты
- Влияние на существующий функционал

## 🔍 Code Review Process

1. Maintainer проверит ваш PR
2. Могут быть запрошены изменения
3. После одобрения PR будет смержен
4. Ваш вклад появится в следующем релизе

## 📜 License

Отправляя PR, вы соглашаетесь с тем, что ваш код будет лицензирован под MIT License.

## 🙏 Благодарности

Спасибо всем контрибьюторам за вклад в SquadVoice!

## 📞 Контакты

- GitHub Issues: [создать issue](https://github.com/your-org/squadvoice/issues)
- Telegram: @squadvoice_dev
- Email: dev@squadvoice.io

---

Happy coding! 🚀
