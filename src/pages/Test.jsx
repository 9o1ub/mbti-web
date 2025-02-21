import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  Radio,
  RadioGroup,
  Progress,
  useToast,
  Container,
  chakra,
  shouldForwardProp,
  Flex,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { motion, isValidMotionProp } from 'framer-motion';
import { questions } from '../data/questions';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

function Test() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser } = useAuth();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const progressBg = useColorModeValue('gray.100', 'gray.700');

  const calculateType = () => {
    let types = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    
    Object.values(answers).forEach(answer => {
      types[answer]++;
    });

    return [
      types.E > types.I ? 'E' : 'I',
      types.S > types.N ? 'S' : 'N',
      types.T > types.F ? 'T' : 'F',
      types.J > types.P ? 'J' : 'P'
    ].join('');
  };

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);
    
    if (currentQuestion === questions.length - 1) {
      handleSubmit(newAnswers);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async (finalAnswers) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setLoading(true);

    const personalityType = calculateType();

    try {
      // Сохраняем результаты в Firestore с привязкой к пользователю
      await addDoc(collection(db, 'results'), {
        type: personalityType,
        answers: finalAnswers,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName,
        timestamp: new Date().toISOString()
      });

      // Переходим на страницу результатов
      navigate('/results', { 
        state: { 
          type: personalityType,
          answers: finalAnswers
        }
      });
    } catch (error) {
      console.error('Ошибка при сохранении результатов:', error);
      toast({
        title: 'Предупреждение',
        description: 'Не удалось сохранить результаты, но вы можете продолжить просмотр.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      
      // Даже при ошибке сохранения переходим к результатам
      navigate('/results', { 
        state: { 
          type: personalityType,
          answers: finalAnswers
        }
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Box minH="100vh" py={12} bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="4xl">
        <VStack spacing={8}>
          <ChakraBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading
              size="xl"
              textAlign="center"
              mb={2}
              bgGradient="linear(to-r, teal.400, green.400)"
              bgClip="text"
            >
              Тест MBTI
            </Heading>
            <Text fontSize="lg" color="gray.500" textAlign="center">
              Узнайте свой тип личности
            </Text>
          </ChakraBox>

          <Box w="100%" bg={progressBg} borderRadius="full" h="4px">
            <Box
              w={`${progress}%`}
              h="100%"
              bgGradient="linear(to-r, teal.400, green.400)"
              borderRadius="full"
              transition="width 0.3s ease-in-out"
            />
          </Box>

          <Flex justify="space-between" w="100%" color="gray.500">
            <Text>Вопрос {currentQuestion + 1} из {questions.length}</Text>
            <Text>Прогресс: {Math.round(progress)}%</Text>
          </Flex>

          <ChakraBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            key={currentQuestion}
            w="100%"
          >
            <Box
              p={8}
              bg={bgColor}
              borderRadius="xl"
              borderWidth={1}
              borderColor={borderColor}
              boxShadow="xl"
              w="100%"
            >
              <Text fontSize="xl" fontWeight="bold" mb={6}>
                {questions[currentQuestion].text}
              </Text>
              <RadioGroup
                onChange={handleAnswer}
                value={answers[currentQuestion] || ''}
              >
                <VStack spacing={4} align="stretch">
                  {questions[currentQuestion].answers.map((answer, index) => (
                    <Box
                      key={index}
                      p={4}
                      borderWidth={1}
                      borderColor={borderColor}
                      borderRadius="lg"
                      cursor="pointer"
                      _hover={{
                        bg: useColorModeValue('gray.50', 'gray.700'),
                      }}
                      onClick={() => handleAnswer(answer.type)}
                    >
                      <Radio value={answer.type} size="lg">
                        {answer.text}
                      </Radio>
                    </Box>
                  ))}
                </VStack>
              </RadioGroup>
              
              <HStack spacing={4} mt={6} justify="space-between">
                <Button
                  colorScheme="gray"
                  onClick={handlePrevious}
                  isDisabled={currentQuestion === 0}
                  size="lg"
                >
                  Назад
                </Button>
              </HStack>
            </Box>
          </ChakraBox>
        </VStack>
      </Container>
    </Box>
  );
}

export default Test; 