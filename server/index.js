const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const app = express();
const port = 3000;

// Проверка наличия API ключа
if (!process.env.HUGGINGFACE_API_KEY) {
  console.error('Ошибка: API ключ не найден. Пожалуйста, добавьте HUGGINGFACE_API_KEY в файл .env');
  process.exit(1);
}

console.log('API ключ найден:', process.env.HUGGINGFACE_API_KEY.substring(0, 8) + '...');

// Функция для отправки запроса к API
async function queryHuggingFace(messages) {
  try {
    const response = await fetch(process.env.HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: messages,
        parameters: {
          max_new_tokens: 400,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result[0].generated_text;
  } catch (error) {
    console.error('Ошибка при запросе к API:', error);
    throw error;
  }
}

// Настройка CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'https://mbti-b2846.web.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// Парсинг JSON
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Чат эндпоинт
app.post('/chat', async (req, res) => {
  try {
    console.log('Получен запрос к /chat');
    
    if (!req.body.messages || !Array.isArray(req.body.messages)) {
      console.log('Ошибка валидации:', req.body);
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Отсутствует поле messages или оно не является массивом'
      });
    }

    const lastMessage = req.body.messages[req.body.messages.length - 1];
    console.log('Последнее сообщение:', lastMessage);
    
    const isRussian = /[а-яА-ЯёЁ]/.test(lastMessage.content);
    
    try {
      const prompt = `<s>[INST] You are an MBTI expert. ${isRussian ? 'Отвечайте на русском языке. Используйте только русский язык в ответе.' : 'Answer in russian only.'}. Keep your response concise, 2-3 sentences maximum.

Question: ${lastMessage.content}

Important: Reply ONLY in Russian language.
Answer: [/INST]`;

      console.log('Отправляем запрос к API...');
      let aiResponse = await queryHuggingFace(prompt);
      aiResponse = aiResponse.trim();
      
      // Проверяем язык ответа
      const responseIsRussian = /[а-яА-ЯёЁ]/.test(aiResponse);
      if (!responseIsRussian) {
        console.log('Ответ не на русском языке, повторяем запрос');
        const retryPrompt = prompt + '\n\nВАЖНО: Отвечайте ТОЛЬКО на русском языке!';
        aiResponse = await queryHuggingFace(retryPrompt);
        aiResponse = aiResponse.trim();
      }

      // Очистка и форматирование ответа
      if (aiResponse.endsWith('В результате') || 
          aiResponse.endsWith('...') || 
          aiResponse.endsWith(',')) {
        aiResponse = aiResponse.replace(/(В результате|\.\.\.|\,$)/, '.');
      }

      aiResponse = aiResponse
        .replace(/\s+/g, ' ')
        .replace(/([.!?])\s*\1+/g, '$1')
        .replace(/\s+([.,!?])/g, '$1');

      return res.json({
        role: 'assistant',
        content: aiResponse
      });
    } catch (error) {
      console.error('Ошибка при обработке запроса:', error);
      
      if (error.message.includes('503')) {
        return res.status(503).json({
          error: 'Service Unavailable',
          message: 'Модель загружается, попробуйте через несколько секунд'
        });
      }
      
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error.message || 'Произошла ошибка при обработке запроса'
      });
    }
  } catch (error) {
    console.error('Ошибка в обработчике /chat:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Произошла ошибка при обработке запроса'
    });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`[${new Date().toISOString()}] Сервер запущен на http://localhost:${port}`);
}); 