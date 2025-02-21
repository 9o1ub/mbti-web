import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setLoading(true);
      await login(username, password);
      
      // Проверяем, является ли пользователь админом
      if (username === 'ADMIN' && password === 'Abobus') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      toast({
        title: 'Ошибка!',
        description: 'Неверный логин или пароль.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  }

  return (
    <Container maxW="lg" py={12}>
      <Box
        p={8}
        bg={bgColor}
        borderRadius="xl"
        borderWidth={1}
        borderColor={borderColor}
        boxShadow="xl"
      >
        <VStack spacing={8}>
          <Heading
            size="xl"
            bgGradient="linear(to-r, teal.400, green.400)"
            bgClip="text"
          >
            Вход в аккаунт
          </Heading>

          <VStack as="form" spacing={6} w="100%" onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Логин</FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите логин"
                size="lg"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Пароль</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                size="lg"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              w="100%"
              isLoading={loading}
              loadingText="Вход..."
            >
              Войти
            </Button>
          </VStack>

          <Text>
            Нет аккаунта?{' '}
            <Link
              as={RouterLink}
              to="/register"
              color="teal.500"
              fontWeight="medium"
            >
              Зарегистрироваться
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
}

export default Login; 