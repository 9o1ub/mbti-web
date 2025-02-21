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
  FormErrorMessage,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const validateForm = () => {
    const newErrors = {};

    if (!username) {
      newErrors.username = 'Логин обязателен';
    } else if (username.length < 3) {
      newErrors.username = 'Логин должен быть не менее 3 символов';
    }

    if (!displayName) {
      newErrors.displayName = 'Имя пользователя обязательно';
    }

    if (!password) {
      newErrors.password = 'Пароль обязателен';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await signup(username, password, displayName);
      
      toast({
        title: 'Успешно!',
        description: 'Аккаунт создан.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      navigate('/profile');
    } catch (error) {
      toast({
        title: 'Ошибка!',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
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
            Регистрация
          </Heading>

          <VStack as="form" spacing={6} w="100%" onSubmit={handleSubmit}>
            <FormControl isRequired isInvalid={errors.username}>
              <FormLabel>Логин</FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите логин"
                size="lg"
              />
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.displayName}>
              <FormLabel>Имя пользователя</FormLabel>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Введите имя пользователя"
                size="lg"
              />
              <FormErrorMessage>{errors.displayName}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.password}>
              <FormLabel>Пароль</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                size="lg"
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.confirmPassword}>
              <FormLabel>Подтверждение пароля</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                size="lg"
              />
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              w="100%"
              isLoading={loading}
              loadingText="Регистрация..."
            >
              Зарегистрироваться
            </Button>
          </VStack>

          <Text>
            Уже есть аккаунт?{' '}
            <Link
              as={RouterLink}
              to="/login"
              color="teal.500"
              fontWeight="medium"
            >
              Войти
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
}

export default Register; 