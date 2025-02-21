import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  useColorModeValue,
  Avatar,
  Flex,
  Button,
  Badge,
  useToast,
  Link,
  Spinner,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { currentUser, logout } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    async function fetchTestResults() {
      try {
        const resultsRef = collection(db, 'results');
        const q = query(
          resultsRef,
          where('userId', '==', currentUser.uid),
          orderBy('timestamp', 'desc')
        );

        try {
          const snapshot = await getDocs(q);
          const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: new Date(doc.data().timestamp).toLocaleString()
          }));
          setTestResults(results);
        } catch (error) {
          if (error.message.includes('requires an index')) {
            const indexUrl = error.message.split('here: ')[1];
            toast({
              title: 'Требуется индекс',
              description: (
                <Text>
                  Пожалуйста, создайте индекс в Firebase Console.{' '}
                  <Link color="teal.500" href={indexUrl} isExternal>
                    Нажмите здесь
                  </Link>
                </Text>
              ),
              status: 'warning',
              duration: 10000,
              isClosable: true,
            });
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке результатов:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить результаты тестов. Попробуйте позже.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchTestResults();
    }
  }, [currentUser, toast]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выйти из аккаунта',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Профиль пользователя */}
        <Box
          p={8}
          bg={bgColor}
          borderRadius="xl"
          borderWidth={1}
          borderColor={borderColor}
          boxShadow="xl"
        >
          <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
            <Flex align="center">
              <Avatar
                size="xl"
                name={currentUser.displayName || currentUser.email}
                mr={6}
              />
              <VStack align="start" spacing={2}>
                <Heading size="lg">
                  {currentUser.displayName || 'Пользователь'}
                </Heading>
                <Text color="gray.500">{currentUser.email}</Text>
                <Badge colorScheme="green">Активный аккаунт</Badge>
              </VStack>
            </Flex>
            <Button
              mt={{ base: 4, md: 0 }}
              colorScheme="red"
              variant="outline"
              onClick={handleLogout}
            >
              Выйти из аккаунта
            </Button>
          </Flex>
        </Box>

        {/* История тестов */}
        <Box>
          <Heading size="lg" mb={6}>История тестов</Heading>
          {loading ? (
            <Flex justify="center" p={8}>
              <Spinner size="xl" color="teal.500" />
            </Flex>
          ) : testResults.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {testResults.map((result) => (
                <Box
                  key={result.id}
                  p={6}
                  bg={bgColor}
                  borderRadius="lg"
                  borderWidth={1}
                  borderColor={borderColor}
                  boxShadow="md"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  <Flex justify="space-between" align="center" mb={4}>
                    <Badge
                      colorScheme="teal"
                      fontSize="lg"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {result.type}
                    </Badge>
                    <Text fontSize="sm" color="gray.500">
                      {result.timestamp}
                    </Text>
                  </Flex>
                  <Button
                    w="full"
                    colorScheme="teal"
                    onClick={() => navigate('/results', { state: { type: result.type, answers: result.answers } })}
                  >
                    Посмотреть результат
                  </Button>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box
              p={8}
              bg={bgColor}
              borderRadius="lg"
              borderWidth={1}
              borderColor={borderColor}
              textAlign="center"
            >
              <Text mb={4}>У вас пока нет результатов тестирования</Text>
              <Button
                colorScheme="teal"
                onClick={() => navigate('/test')}
              >
                Пройти тест
              </Button>
            </Box>
          )}
        </Box>
      </VStack>
    </Container>
  );
}

export default Profile; 