import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Progress,
  SimpleGrid,
  useColorModeValue,
  Button,
  Badge,
  Flex,
  Icon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FaBook, FaCheck, FaLock, FaPlay, FaTrophy } from 'react-icons/fa';
import { MdCheckCircle, MdLock } from 'react-icons/md';

// Определяем уроки
const lessons = [
  {
    id: 1,
    title: 'Введение в MBTI',
    description: 'Узнайте основы типологии личности MBTI и её историю.',
    content: [
      'MBTI (Myers-Briggs Type Indicator) - это система типирования личности, разработанная Изабель Майерс и Кэтрин Бриггс.',
      'В основе MBTI лежит теория психологических типов Карла Юнга.',
      'MBTI выделяет 16 типов личности, основанных на четырех дихотомиях:',
      '- Экстраверсия (E) / Интроверсия (I)',
      '- Сенсорика (S) / Интуиция (N)',
      '- Мышление (T) / Чувство (F)',
      '- Суждение (J) / Восприятие (P)',
    ],
    xp: 100,
  },
  {
    id: 2,
    title: 'Экстраверсия и Интроверсия',
    description: 'Изучите первую дихотомию MBTI: E vs I.',
    content: [
      'Экстраверсия (E) и Интроверсия (I) описывают, как человек получает энергию.',
      'Экстраверты (E):',
      '- Получают энергию от общения с людьми',
      '- Предпочитают активную деятельность',
      '- Думают вслух',
      'Интроверты (I):',
      '- Восстанавливают энергию в одиночестве',
      '- Предпочитают спокойную обстановку',
      '- Обдумывают всё внутри себя',
    ],
    xp: 150,
  },
  {
    id: 3,
    title: 'Сенсорика и Интуиция',
    description: 'Разберитесь во второй дихотомии MBTI: S vs N.',
    content: [
      'Сенсорика (S) и Интуиция (N) описывают, как человек собирает информацию.',
      'Сенсорики (S):',
      '- Фокусируются на конкретных фактах',
      '- Доверяют опыту',
      '- Живут "здесь и сейчас"',
      'Интуиты (N):',
      '- Ищут скрытый смысл',
      '- Доверяют интуиции',
      '- Думают о будущем',
    ],
    xp: 150,
  },
  {
    id: 4,
    title: 'Мышление и Чувство',
    description: 'Познакомьтесь с третьей дихотомией MBTI: T vs F.',
    content: [
      'Мышление (T) и Чувство (F) описывают, как человек принимает решения.',
      'Логики (T):',
      '- Принимают решения на основе логики',
      '- Стремятся к объективности',
      '- Ценят справедливость',
      'Этики (F):',
      '- Принимают решения на основе ценностей',
      '- Учитывают чувства других',
      '- Ценят гармонию',
    ],
    xp: 150,
  },
  {
    id: 5,
    title: 'Суждение и Восприятие',
    description: 'Изучите четвертую дихотомию MBTI: J vs P.',
    content: [
      'Суждение (J) и Восприятие (P) описывают, как человек организует свою жизнь.',
      'Рационалы (J):',
      '- Любят планировать',
      '- Стремятся к порядку',
      '- Предпочитают завершенность',
      'Иррационалы (P):',
      '- Предпочитают гибкость',
      '- Легко адаптируются',
      '- Открыты новому',
    ],
    xp: 150,
  },
  {
    id: 6,
    title: 'Когнитивные функции',
    description: 'Углубитесь в понимание когнитивных функций MBTI.',
    content: [
      'Когнитивные функции - это основа типологии MBTI.',
      'Существует 8 когнитивных функций:',
      '- Se (Экстравертная сенсорика)',
      '- Si (Интровертная сенсорика)',
      '- Ne (Экстравертная интуиция)',
      '- Ni (Интровертная интуиция)',
      '- Te (Экстравертное мышление)',
      '- Ti (Интровертное мышление)',
      '- Fe (Экстравертное чувство)',
      '- Fi (Интровертное чувство)',
      'Каждый тип личности использует 4 из этих функций в определенном порядке.',
    ],
    xp: 200,
  },
];

function LearningProgress() {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState({});
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    async function fetchProgress() {
      if (!currentUser) return;

      const progressRef = doc(db, 'learning_progress', currentUser.uid);
      const progressDoc = await getDoc(progressRef);

      if (progressDoc.exists()) {
        setProgress(progressDoc.data().completedLessons || {});
        setTotalXP(progressDoc.data().totalXP || 0);
        setLevel(Math.floor((progressDoc.data().totalXP || 0) / 500) + 1);
      } else {
        // Создаем документ с прогрессом для нового пользователя
        await setDoc(progressRef, {
          completedLessons: {},
          totalXP: 0,
        });
      }
    }

    fetchProgress();
  }, [currentUser]);

  const handleLessonClick = (lesson) => {
    // Проверяем, доступен ли урок
    const previousLesson = lesson.id > 1 ? progress[lesson.id - 1] : true;
    if (!previousLesson) {
      toast({
        title: 'Урок заблокирован',
        description: 'Сначала завершите предыдущий урок',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSelectedLesson(lesson);
    onOpen();
  };

  const completeLesson = async (lessonId) => {
    if (progress[lessonId]) {
      toast({
        title: 'Урок уже пройден',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const lesson = lessons.find(l => l.id === lessonId);
    const newXP = totalXP + lesson.xp;
    const newLevel = Math.floor(newXP / 500) + 1;

    const progressRef = doc(db, 'learning_progress', currentUser.uid);
    await updateDoc(progressRef, {
      [`completedLessons.${lessonId}`]: true,
      totalXP: newXP,
    });

    setProgress({ ...progress, [lessonId]: true });
    setTotalXP(newXP);
    setLevel(newLevel);

    toast({
      title: 'Урок пройден!',
      description: `Получено ${lesson.xp} XP${newLevel > level ? '. Новый уровень!' : ''}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    onClose();
  };

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading
            size="xl"
            mb={4}
            bgGradient="linear(to-r, teal.400, green.400)"
            bgClip="text"
          >
            Обучение MBTI
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Изучите основы типологии личности MBTI
          </Text>
        </Box>

        {/* Прогресс пользователя */}
        <Box
          w="full"
          p={6}
          bg={bgColor}
          borderRadius="xl"
          borderWidth={1}
          borderColor={borderColor}
          boxShadow="xl"
        >
          <Flex justify="space-between" align="center" mb={4}>
            <VStack align="start" spacing={1}>
              <Heading size="md">Уровень {level}</Heading>
              <Text color="gray.500">
                {totalXP} XP / {level * 500} XP до следующего уровня
              </Text>
            </VStack>
            <Badge
              colorScheme="teal"
              p={2}
              borderRadius="full"
              fontSize="md"
            >
              {Object.keys(progress).length} / {lessons.length} уроков пройдено
            </Badge>
          </Flex>
          <Progress
            value={(totalXP % 500) / 5}
            size="lg"
            colorScheme="teal"
            borderRadius="full"
          />
        </Box>

        {/* Список уроков */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
          {lessons.map((lesson) => {
            const isCompleted = progress[lesson.id];
            const isLocked = lesson.id > 1 && !progress[lesson.id - 1];

            return (
              <Box
                key={lesson.id}
                p={6}
                bg={bgColor}
                borderRadius="lg"
                borderWidth={1}
                borderColor={borderColor}
                boxShadow="md"
                position="relative"
                opacity={isLocked ? 0.7 : 1}
                _hover={!isLocked && {
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="center" mb={4}>
                  <Icon
                    as={isCompleted ? FaCheck : isLocked ? FaLock : FaBook}
                    w={6}
                    h={6}
                    color={isCompleted ? 'green.500' : isLocked ? 'gray.500' : 'teal.500'}
                  />
                  <Badge colorScheme="teal">{lesson.xp} XP</Badge>
                </Flex>
                <Heading size="md" mb={2}>
                  {lesson.title}
                </Heading>
                <Text color="gray.500" mb={4}>
                  {lesson.description}
                </Text>
                <Button
                  w="full"
                  colorScheme={isCompleted ? 'green' : 'teal'}
                  onClick={() => handleLessonClick(lesson)}
                  isDisabled={isLocked}
                  leftIcon={isCompleted ? <FaCheck /> : <FaPlay />}
                >
                  {isCompleted ? 'Пройдено' : isLocked ? 'Заблокировано' : 'Начать урок'}
                </Button>
              </Box>
            );
          })}
        </SimpleGrid>

        {/* Модальное окно урока */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex justify="space-between" align="center">
                <Text>{selectedLesson?.title}</Text>
                <Badge colorScheme="teal">{selectedLesson?.xp} XP</Badge>
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack align="stretch" spacing={4}>
                {selectedLesson?.content.map((paragraph, index) => (
                  <Text key={index}>{paragraph}</Text>
                ))}
                <Button
                  colorScheme="teal"
                  onClick={() => completeLesson(selectedLesson?.id)}
                  isDisabled={progress[selectedLesson?.id]}
                  mt={4}
                >
                  Завершить урок
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
}

export default LearningProgress; 