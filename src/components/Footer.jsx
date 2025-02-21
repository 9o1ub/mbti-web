import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
  Icon,
  Divider,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { FaGithub, FaTelegram, FaVk } from 'react-icons/fa';

function Footer() {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Box
      bg={bg}
      borderTop={1}
      borderStyle="solid"
      borderColor={borderColor}
    >
      <Container maxW="6xl" py={10}>
        <VStack spacing={8}>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={8} justify="space-between" w="full">
            <VStack align={{ base: 'center', md: 'start' }} spacing={4}>
              <Text fontSize="lg" fontWeight="bold">О проекте</Text>
              <Text color="gray.500" textAlign={{ base: 'center', md: 'left' }}>
                MBTI тест с искусственным интеллектом поможет вам лучше понять себя и свой тип личности.
                Задавайте вопросы нашему ИИ-консультанту и получайте экспертные ответы в режиме реального времени.
              </Text>
            </VStack>

            <VStack align={{ base: 'center', md: 'start' }} spacing={4}>
              <Text fontSize="lg" fontWeight="bold">Контакты</Text>
              <HStack spacing={4}>
                <Link href="https://github.com/901ubb" isExternal>
                  <Icon as={FaGithub} w={6} h={6} />
                </Link>
                <Link href="https://t.me/mbtiaitest" isExternal>
                  <Icon as={FaTelegram} w={6} h={6} />
                </Link>
                <Link href="https://vk.com/ignavus0" isExternal>
                  <Icon as={FaVk} w={6} h={6} />
                </Link>
              </HStack>
            </VStack>
          </Stack>

          <Divider />

          <Text color="gray.500" fontSize="sm">
            © {new Date().getFullYear()} MBTI Test. Все права защищены.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default Footer; 