import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  IconButton,
  Flex,
  Divider,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Icon,
} from '@chakra-ui/react';
import { FaTrash, FaEdit, FaPlus, FaMinus, FaDatabase, FaQuestionCircle } from 'react-icons/fa';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

function Admin() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('teal.500', 'teal.300');

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Получение списка вопросов из базы данных
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'questions'));
      const questionsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setQuestions(questionsList);
    } catch (error) {
      toast({
        title: 'Ошибка при загрузке вопросов',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Очистка статистики тестирования
  const handleClearStatistics = async () => {
    try {
      const resultsRef = collection(db, 'results');
      const snapshot = await getDocs(resultsRef);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      toast({
        title: 'Статистика очищена',
        description: 'Все результаты тестирования были успешно удалены',
        status: 'success',
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: 'Ошибка при очистке статистики',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  // Создание нового вопроса
  const handleAddQuestion = () => {
    setCurrentQuestion({
      text: '',
      answers: [
        { text: '', type: '' },
        { text: '', type: '' }
      ]
    });
    onOpen();
  };

  // Редактирование существующего вопроса
  const handleEditQuestion = (question) => {
    setCurrentQuestion(question);
    onOpen();
  };

  // Удаление вопроса
  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteDoc(doc(db, 'questions', questionId));
      setQuestions(questions.filter(q => q.id !== questionId));
      toast({
        title: 'Вопрос удален',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Ошибка при удалении вопроса',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  // Сохранение вопроса (создание нового или обновление существующего)
  const handleSaveQuestion = async () => {
    try {
      if (!currentQuestion.text || currentQuestion.answers.some(a => !a.text || !a.type)) {
        throw new Error('Заполните все поля вопроса и ответов');
      }

      if (currentQuestion.id) {
        // Обновление существующего вопроса
        await updateDoc(doc(db, 'questions', currentQuestion.id), {
          text: currentQuestion.text,
          answers: currentQuestion.answers
        });
        setQuestions(questions.map(q => 
          q.id === currentQuestion.id ? currentQuestion : q
        ));
      } else {
        // Создание нового вопроса
        const docRef = await addDoc(collection(db, 'questions'), {
          text: currentQuestion.text,
          answers: currentQuestion.answers,
          createdAt: new Date().toISOString()
        });
        setQuestions([...questions, { ...currentQuestion, id: docRef.id }]);
      }

      onClose();
      toast({
        title: `Вопрос ${currentQuestion.id ? 'обновлен' : 'создан'}`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Ошибка при сохранении вопроса',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" mb={2} bgGradient="linear(to-r, teal.400, green.400)" bgClip="text">
            Панель администратора
          </Heading>
          <Text color="gray.500">
            Управление вопросами теста и статистикой
          </Text>
        </Box>

        {/* Секция управления статистикой */}
        <Card bg={bgColor} borderWidth={1} borderColor={borderColor}>
          <CardHeader>
            <Flex align="center" gap={2}>
              <Icon as={FaDatabase} color={accentColor} />
              <Heading size="md">Управление статистикой</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <Text mb={4}>
              Очистка всех результатов тестирования из базы данных. Это действие нельзя отменить.
            </Text>
            <Button
              colorScheme="red"
              leftIcon={<FaTrash />}
              onClick={handleClearStatistics}
            >
              Очистить статистику
            </Button>
          </CardBody>
        </Card>

        {/* Секция управления вопросами */}
        <Card bg={bgColor} borderWidth={1} borderColor={borderColor}>
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Flex align="center" gap={2}>
                <Icon as={FaQuestionCircle} color={accentColor} />
                <Heading size="md">Управление вопросами</Heading>
              </Flex>
              <Button
                colorScheme="teal"
                leftIcon={<FaPlus />}
                onClick={handleAddQuestion}
              >
                Добавить вопрос
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {questions.map((question, index) => (
                <Box
                  key={question.id}
                  p={4}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderRadius="lg"
                  borderWidth={1}
                  borderColor={borderColor}
                >
                  <Flex justify="space-between" align="start" mb={2}>
                    <Badge colorScheme="teal" mb={2}>Вопрос {index + 1}</Badge>
                    <Flex gap={2}>
                      <Tooltip label="Редактировать вопрос">
                        <IconButton
                          size="sm"
                          icon={<FaEdit />}
                          onClick={() => handleEditQuestion(question)}
                          colorScheme="blue"
                          variant="ghost"
                        />
                      </Tooltip>
                      <Tooltip label="Удалить вопрос">
                        <IconButton
                          size="sm"
                          icon={<FaTrash />}
                          onClick={() => handleDeleteQuestion(question.id)}
                          colorScheme="red"
                          variant="ghost"
                        />
                      </Tooltip>
                    </Flex>
                  </Flex>
                  <Text fontWeight="medium" mb={2}>{question.text}</Text>
                  <VStack align="stretch" spacing={2}>
                    {question.answers.map((answer, idx) => (
                      <Box
                        key={idx}
                        p={2}
                        bg={useColorModeValue('white', 'gray.800')}
                        borderRadius="md"
                        borderWidth={1}
                        borderColor={borderColor}
                      >
                        <Flex justify="space-between">
                          <Text>{answer.text}</Text>
                          <Badge colorScheme="purple">{answer.type}</Badge>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Модальное окно редактирования/создания вопроса */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {currentQuestion?.id ? 'Редактирование вопроса' : 'Новый вопрос'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Текст вопроса</FormLabel>
                  <Textarea
                    value={currentQuestion?.text || ''}
                    onChange={(e) => setCurrentQuestion({
                      ...currentQuestion,
                      text: e.target.value
                    })}
                    placeholder="Введите текст вопроса"
                  />
                </FormControl>
                
                <Divider />
                
                <Heading size="sm">Варианты ответов</Heading>
                {currentQuestion?.answers.map((answer, index) => (
                  <Box key={index} w="100%">
                    <Flex gap={4}>
                      <FormControl isRequired>
                        <FormLabel>Текст ответа {index + 1}</FormLabel>
                        <Input
                          value={answer.text}
                          onChange={(e) => {
                            const newAnswers = [...currentQuestion.answers];
                            newAnswers[index].text = e.target.value;
                            setCurrentQuestion({
                              ...currentQuestion,
                              answers: newAnswers
                            });
                          }}
                          placeholder="Введите текст ответа"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Тип личности</FormLabel>
                        <Input
                          value={answer.type}
                          onChange={(e) => {
                            const newAnswers = [...currentQuestion.answers];
                            newAnswers[index].type = e.target.value.toUpperCase();
                            setCurrentQuestion({
                              ...currentQuestion,
                              answers: newAnswers
                            });
                          }}
                          placeholder="E/I, S/N, T/F, J/P"
                          maxLength={1}
                        />
                      </FormControl>
                    </Flex>
                  </Box>
                ))}
                
                <Flex gap={2}>
                  <Button
                    leftIcon={<FaPlus />}
                    onClick={() => setCurrentQuestion({
                      ...currentQuestion,
                      answers: [...currentQuestion.answers, { text: '', type: '' }]
                    })}
                    isDisabled={currentQuestion?.answers.length >= 4}
                  >
                    Добавить ответ
                  </Button>
                  <Button
                    leftIcon={<FaMinus />}
                    onClick={() => setCurrentQuestion({
                      ...currentQuestion,
                      answers: currentQuestion.answers.slice(0, -1)
                    })}
                    isDisabled={currentQuestion?.answers.length <= 2}
                  >
                    Удалить ответ
                  </Button>
                </Flex>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Отмена
              </Button>
              <Button colorScheme="teal" onClick={handleSaveQuestion}>
                Сохранить
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
}

export default Admin; 