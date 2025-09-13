#!/bin/bash

# Скрипт для загрузки Sol-Canvas в GitHub
# Репозиторий: https://github.com/kamilatusipova21-jpg/TokenVault

echo "🚀 Загрузка Sol-Canvas в GitHub..."
echo "=================================="

# Проверяем, что мы в правильной папке
if [ ! -f "standalone-demo.html" ]; then
    echo "❌ Ошибка: Запустите скрипт из папки hackathon/"
    exit 1
fi

# Инициализируем git если нужно
if [ ! -d ".git" ]; then
    echo "📁 Инициализация git репозитория..."
    git init
fi

# Добавляем remote origin
echo "🔗 Добавление remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/kamilatusipova21-jpg/TokenVault.git

# Добавляем все файлы
echo "📝 Добавление файлов..."
git add .

# Проверяем статус
echo "📊 Статус файлов:"
git status --short

# Создаем commit
echo "💾 Создание commit..."
git commit -m "Add Sol-Canvas: NFT Art Tokenization Platform

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
🏆 Solana Hackathon 2024 Submission"

# Загружаем в GitHub
echo "⬆️  Загрузка в GitHub..."
git push -u origin main

echo ""
echo "✅ Проект успешно загружен!"
echo "🔗 Репозиторий: https://github.com/kamilatusipova21-jpg/TokenVault"
echo "🎬 Демо: https://github.com/kamilatusipova21-jpg/TokenVault/blob/main/standalone-demo.html"
echo ""
echo "📋 Следующие шаги:"
echo "1. Проверьте репозиторий в браузере"
echo "2. Добавьте topics: solana, nft, defi, hackathon"
echo "3. Создайте Release для хакатона"
echo "4. Поделитесь ссылкой с жюри"