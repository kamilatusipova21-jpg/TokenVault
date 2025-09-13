# 📤 Инструкция по загрузке Sol-Canvas в GitHub

## 🎯 Репозиторий: https://github.com/kamilatusipova21-jpg/TokenVault

## 📁 Структура для загрузки

Загрузите всю папку `hackathon/` со следующей структурой:

```
TokenVault/
├── README.md                           # Главное описание проекта
├── .gitignore                         # Игнорируемые файлы
├── standalone-demo.html               # Демо-версия (главная)
├── demo.html                          # Альтернативная демо
├── test-backend.js                    # Тест бэкенда
├── BACKEND_DEMO_RESULTS.md           # Результаты тестирования
├── DEMO_INSTRUCTIONS.md              # Инструкции для демо
├── sol_canvas_backend/               # Смарт-контракт
│   ├── Anchor.toml
│   ├── Cargo.toml
│   ├── programs/
│   │   └── sol_canvas_backend/
│   │       ├── Cargo.toml
│   │       └── src/
│   │           └── lib.rs
│   └── migrations/
└── sol-canvas-frontend/              # Next.js приложение
    ├── package.json
    ├── next.config.js
    ├── pages/
    │   ├── _app.js
    │   ├── index.js
    │   └── simple.js
    ├── styles/
    │   └── globals.css
    ├── idl.json
    └── public/
```

## 🚀 Команды для загрузки

### Вариант 1: Через веб-интерфейс GitHub
1. Перейдите на https://github.com/kamilatusipova21-jpg/TokenVault
2. Нажмите "Add file" → "Upload files"
3. Перетащите всю папку `hackathon/` в окно браузера
4. Добавьте commit message: "Add Sol-Canvas: NFT Art Tokenization Platform"
5. Нажмите "Commit changes"

### Вариант 2: Через Git CLI
```bash
# Перейдите в папку hackathon
cd /workspaces/Token_Vault/hackathon

# Инициализируйте git (если нужно)
git init

# Добавьте remote origin
git remote add origin https://github.com/kamilatusipova21-jpg/TokenVault.git

# Добавьте все файлы
git add .

# Создайте commit
git commit -m "Add Sol-Canvas: NFT Art Tokenization Platform

- Smart contract deployed on Solana Devnet
- Next.js frontend with wallet integration  
- Interactive demo with dynamic balance updates
- Complete tokenization platform for art assets"

# Загрузите в GitHub
git push -u origin main
```

### Вариант 3: Через GitHub Desktop
1. Откройте GitHub Desktop
2. File → Clone repository → URL
3. Введите: https://github.com/kamilatusipova21-jpg/TokenVault.git
4. Скопируйте файлы из `hackathon/` в клонированную папку
5. Commit → Push

## 📝 Рекомендуемый Commit Message

```
Add Sol-Canvas: NFT Art Tokenization Platform

🎨 Features:
- Fractional ownership of expensive artworks
- Solana smart contract with Anchor framework
- Next.js frontend with wallet integration
- Dynamic balance and asset tracking
- Interactive demo with real blockchain data

🚀 Technical Stack:
- Smart Contract: Rust + Anchor
- Frontend: Next.js + React + Tailwind CSS
- Blockchain: Solana Devnet
- Wallet: Phantom integration

📊 Deployed Contract:
- Program ID: ALuf64RcUJFPdsXdxi2p4rYoQBe13UX9RW27sfDWnDaa
- Network: Solana Devnet
- Status: Active and tested

🎯 Demo: Open standalone-demo.html in browser
```

## 🎬 Файлы для демонстрации

**Главные файлы для жюри:**
1. **`README.md`** - Полное описание проекта
2. **`standalone-demo.html`** - Интерактивная демо (откройте в браузере)
3. **`BACKEND_DEMO_RESULTS.md`** - Доказательство работы бэкенда
4. **`sol_canvas_backend/programs/sol_canvas_backend/src/lib.rs`** - Смарт-контракт

## ✅ Чек-лист перед загрузкой

- [ ] Все файлы из папки `hackathon/` готовы
- [ ] `standalone-demo.html` открывается в браузере
- [ ] README.md содержит полное описание
- [ ] Смарт-контракт Program ID указан везде правильно
- [ ] .gitignore исключает node_modules и target
- [ ] Commit message описательный

## 🎯 После загрузки

1. **Проверьте репозиторий** - все файлы загружены
2. **Обновите README** - добавьте ссылку на демо
3. **Создайте Release** - отметьте версию для хакатона
4. **Добавьте Topics** - solana, nft, defi, hackathon, blockchain

## 📞 Поддержка

Если возникнут проблемы с загрузкой:
1. Проверьте размер файлов (GitHub лимит 100MB)
2. Убедитесь, что node_modules исключены
3. Используйте .gitignore для больших файлов

**🚀 Удачи с загрузкой проекта!**