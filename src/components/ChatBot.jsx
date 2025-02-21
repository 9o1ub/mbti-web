import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  useColorModeValue,
  Container,
  Flex,
  Avatar,
  Divider,
  IconButton,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';
import { personalityTypes } from '../data/questions';

// Функция для поиска информации о типе личности
const findPersonalityInfo = (text) => {
  const type = text.toUpperCase().match(/[IE][NS][TF][JP]/)?.[0];
  return type ? personalityTypes[type] : null;
};

// Функция для определения темы вопроса
const getTopicFromQuestion = (text) => {
  const topics = {
    'когнитивные функции': [
      'функци', 'когнитив', 'се', 'си', 'не', 'ни', 'те', 'ти', 'фе', 'фи',
      'как думают', 'как принимают решения', 'как воспринимают', 'как обрабатывают'
    ],
    'дихотомии': [
      'экстраверт', 'интроверт', 'сенсорик', 'интуит', 'логик', 'этик', 'рационал', 'иррационал',
      'дихотоми', 'шкал', 'противоположност', 'различи', 'отличи', 'разниц',
      'ei', 'sn', 'tf', 'jp', 'характеристик'
    ],
    'совместимость': [
      'совместим', 'отношени', 'пар', 'дуал', 'конфликт', 'заказ', 'ревизи',
      'подход', 'вместе', 'общени', 'уживают', 'ладят', 'дружб', 'брак', 'семь'
    ],
    'карьера': [
      'карьер', 'профес', 'работ', 'специальност', 'занят', 'дел', 'бизнес',
      'подходит', 'куда пойти', 'где работать', 'кем быть'
    ],
    'развитие': [
      'развити', 'рост', 'улучшени', 'совершенствовани', 'сильные сторон', 'слабые сторон',
      'как стать лучше', 'как развить', 'самопознани', 'самореализац'
    ]
  };

  const loweredText = text.toLowerCase();
  for (const [topic, keywords] of Object.entries(topics)) {
    if (keywords.some(keyword => loweredText.includes(keyword))) {
      return topic;
    }
  }
  return null;
};

// База знаний для ответов
const knowledgeBase = {
  'когнитивные функции': {
    description: 'Когнитивные функции - это способы обработки информации и принятия решений. Всего существует 8 функций:',
    details: [
      'Se (Экстравертная сенсорика) - восприятие текущего момента',
      'Si (Интровертная сенсорика) - опыт и традиции',
      'Ne (Экстравертная интуиция) - возможности и идеи',
      'Ni (Интровертная интуиция) - предвидение и символизм',
      'Te (Экстравертное мышление) - логика и организация',
      'Ti (Интровертное мышление) - анализ и систематизация',
      'Fe (Экстравертное чувство) - гармония и эмпатия',
      'Fi (Интровертное чувство) - ценности и убеждения'
    ]
  },
  'дихотомии': {
    description: 'В MBTI существует 4 основные дихотомии (пары противоположностей):',
    details: [
      'E/I - Экстраверсия/Интроверсия (источник энергии)',
      'S/N - Сенсорика/Интуиция (сбор информации)',
      'T/F - Мышление/Чувство (принятие решений)',
      'J/P - Суждение/Восприятие (образ жизни)'
    ]
  },
  'совместимость': {
    description: 'Совместимость типов MBTI основана на нескольких факторах:',
    details: [
      'Схожие когнитивные функции часто создают взаимопонимание',
      'Противоположные предпочтения могут дополнять друг друга',
      'Важно учитывать индивидуальное развитие каждого человека',
      'Нет "идеальных" или "невозможных" комбинаций'
    ]
  },
  'карьера': {
    description: 'При выборе карьеры важно учитывать:',
    details: [
      'Природные склонности вашего типа',
      'Личные интересы и ценности',
      'Возможности для развития',
      'Рабочую среду и атмосферу'
    ]
  },
  'развитие': {
    description: 'Развитие личности в MBTI включает:',
    details: [
      'Осознание своих сильных сторон',
      'Работу над слабыми функциями',
      'Баланс между разными аспектами личности',
      'Принятие своих особенностей'
    ]
  }
};

// Добавим больше базовых вопросов и их вариаций
const basicQuestions = {
  'что такое mbti': 'MBTI (Myers-Briggs Type Indicator) - это система определения типа личности, разработанная Изабель Майерс и Кэтрин Бриггс на основе теории Карла Юнга. Она помогает лучше понять себя и других, определяя 16 различных типов личности на основе 4 пар противоположных предпочтений.',
  'mbti это': 'MBTI - это популярный инструмент для определения типа личности. Он выделяет 16 типов личности, основываясь на том, как человек воспринимает информацию, принимает решения и взаимодействует с миром. Это помогает лучше понять свои сильные стороны и особенности.',
  'для чего нужен mbti': 'MBTI помогает:\n• Лучше понять себя и свои природные склонности\n• Выбрать подходящую профессию\n• Улучшить отношения с другими людьми\n• Развить свои сильные стороны\n• Эффективнее работать в команде',
  'как работает mbti': 'MBTI определяет ваш тип личности через 4 пары предпочтений:\n• Экстраверсия (E) или Интроверсия (I) - как вы получаете энергию\n• Сенсорика (S) или Интуиция (N) - как вы собираете информацию\n• Мышление (T) или Чувство (F) - как вы принимаете решения\n• Суждение (J) или Восприятие (P) - как вы организуете свою жизнь\n\nКомбинация этих букв (например, INTJ или ENFP) определяет ваш тип личности.',
  'зачем нужен': 'MBTI помогает лучше понять себя и других людей. Это полезно для:\n• Выбора профессии и карьерного пути\n• Улучшения отношений с окружающими\n• Развития сильных сторон личности\n• Эффективной работы в команде\n• Личностного роста и самопознания',
  'сколько типов': 'В MBTI существует 16 типов личности. Каждый тип формируется комбинацией 4 букв:\n• Первая буква: E или I (экстраверсия или интроверсия)\n• Вторая буква: S или N (сенсорика или интуиция)\n• Третья буква: T или F (мышление или чувство)\n• Четвертая буква: J или P (суждение или восприятие)',
  'типы личности': 'MBTI включает 16 типов личности, каждый со своими уникальными характеристиками:\n• Аналитики: INTJ, INTP, ENTJ, ENTP\n• Дипломаты: INFJ, INFP, ENFJ, ENFP\n• Стражи: ISTJ, ISFJ, ESTJ, ESFJ\n• Исследователи: ISTP, ISFP, ESTP, ESFP\n\nКаждый тип имеет свои сильные стороны и области для развития.'
};

function generateResponse(question) {
  const loweredQuestion = question.toLowerCase().trim();

  // Проверяем на приветствие
  if (loweredQuestion.match(/^(привет|здравствуй|добрый|доброе|доброго)/)) {
    return 'Здравствуйте! Я - MBTI консультант. Задайте мне вопрос о типах личности, и я постараюсь помочь. Например, вы можете спросить:\n• Что такое MBTI?\n• Как работает типирование?\n• Расскажи про конкретный тип личности';
  }

  // Проверяем базовые вопросы
  for (const [key, value] of Object.entries(basicQuestions)) {
    if (loweredQuestion.includes(key) || 
        loweredQuestion.includes(key.replace(/\s+/g, '')) || 
        key.split(' ').every(word => loweredQuestion.includes(word))) {
      return value;
    }
  }

  // Ищем упоминание типа личности
  const personalityInfo = findPersonalityInfo(question);
  if (personalityInfo) {
    return `${personalityInfo.name} (${personalityInfo.type}): ${personalityInfo.description}\n\nСильные стороны этого типа:\n${personalityInfo.strengths.map(s => '• ' + s).join('\n')}\n\nПодходящие профессии:\n${personalityInfo.careers.map(c => '• ' + c).join('\n')}`;
  }

  // Определяем тему вопроса
  const topic = getTopicFromQuestion(question);
  if (topic && knowledgeBase[topic]) {
    const info = knowledgeBase[topic];
    return `${info.description}\n\n${info.details.map(d => '• ' + d).join('\n')}`;
  }

  // Если не удалось определить тему
  return 'Извините, я не совсем понял ваш вопрос. Попробуйте спросить:\n• Что такое MBTI?\n• Как работает типирование?\n• Сколько существует типов личности?\n• Расскажи про конкретный тип (например, "INTJ")\n• О когнитивных функциях\n• О совместимости типов';
}

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: 'Здравствуйте! Я - MBTI консультант. Задайте мне вопрос о типах личности, и я постараюсь помочь. Например, вы можете спросить о конкретном типе, когнитивных функциях или совместимости типов.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Добавляем сообщение пользователя
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Генерируем ответ
      const response = generateResponse(input);
      
      // Имитируем задержку для более естественного общения
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Добавляем ответ бота
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось получить ответ',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8}>
        <Heading
          size="xl"
          bgGradient="linear(to-r, teal.400, green.400)"
          bgClip="text"
        >
          ИИ-консультант MBTI
        </Heading>

        <Box
          w="full"
          h="600px"
          bg={bgColor}
          borderRadius="xl"
          borderWidth={1}
          borderColor={borderColor}
          boxShadow="xl"
          overflow="hidden"
          display="flex"
          flexDirection="column"
        >
          {/* Чат */}
          <VStack
            flex={1}
            p={4}
            overflowY="auto"
            spacing={4}
            align="stretch"
          >
            {messages.map((message, index) => (
              <Flex
                key={index}
                justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
              >
                <Flex
                  maxW="80%"
                  bg={message.role === 'user' ? 'teal.500' : bgColor}
                  color={message.role === 'user' ? 'white' : 'inherit'}
                  borderRadius="lg"
                  p={4}
                  borderWidth={message.role === 'bot' ? 1 : 0}
                  borderColor={borderColor}
                  boxShadow="md"
                >
                  {message.role === 'bot' && (
                    <Avatar
                      icon={<FaRobot />}
                      bg="teal.500"
                      color="white"
                      size="sm"
                      mr={3}
                    />
                  )}
                  <Text whiteSpace="pre-wrap">{message.content}</Text>
                </Flex>
              </Flex>
            ))}
            {isTyping && (
              <Flex>
                <Box
                  bg={bgColor}
                  borderRadius="lg"
                  p={4}
                  borderWidth={1}
                  borderColor={borderColor}
                >
                  <Text>Печатает...</Text>
                </Box>
              </Flex>
            )}
          </VStack>

          <Divider />

          {/* Форма ввода */}
          <Box p={4}>
            <form onSubmit={handleSubmit}>
              <Flex gap={2}>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Задайте вопрос..."
                  size="lg"
                />
                <IconButton
                  type="submit"
                  icon={<FaPaperPlane />}
                  colorScheme="teal"
                  size="lg"
                  isDisabled={!input.trim() || isTyping}
                />
              </Flex>
            </form>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
}

export default ChatBot; 