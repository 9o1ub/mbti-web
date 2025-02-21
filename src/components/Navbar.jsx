import {
  Box,
  Flex,
  Button,
  Link as ChakraLink,
  useColorModeValue,
  Container,
  IconButton,
  useDisclosure,
  VStack,
  HStack,
  CloseButton,
  useColorMode,
  Image,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FaSun, FaMoon } from 'react-icons/fa';

function NavLink({ to, children }) {
  return (
    <ChakraLink
      as={RouterLink}
      to={to}
      px={4}
      py={2}
      rounded="md"
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.100', 'gray.700'),
      }}
      color={useColorModeValue('gray.700', 'white')}
      fontWeight="medium"
    >
      {children}
    </ChakraLink>
  );
}

function Navbar() {
  const { currentUser, logout, isAdmin } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const links = [
    { name: 'Главная', path: '/' },
    { name: 'Типы личности', path: '/personalities' },
    { name: 'Тест', path: '/test' },
    { name: 'Обучение', path: '/learning' },
    { name: 'Статистика', path: '/statistics' },
    { name: 'Чат с ИИ', path: '/chat' },
  ];

  return (
    <Box
      bg={bg}
      px={4}
      position="sticky"
      top={0}
      zIndex={100}
      borderBottom={1}
      borderStyle="solid"
      borderColor={borderColor}
      shadow="sm"
    >
      <Container maxW="6xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={<HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={onOpen}
          />

          <HStack spacing={8} alignItems="center">
            <HStack>
              <Image src="/lel.png" alt="Logo" boxSize="40px" />
              <ChakraLink
                as={RouterLink}
                to="/"
                fontSize="xl"
                fontWeight="bold"
                bgGradient={useColorModeValue(
                  "linear(to-r, teal.500, green.500)",
                  "linear(to-r, teal.200, green.200)"
                )}
                bgClip="text"
                _hover={{
                  textDecoration: 'none',
                  bgGradient: useColorModeValue(
                    "linear(to-r, teal.600, green.600)",
                    "linear(to-r, teal.300, green.300)"
                  ),
                }}
              >
                MBTI Test
              </ChakraLink>
            </HStack>
            <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
              {links.map((link) => (
                <NavLink key={link.path} to={link.path}>
                  {link.name}
                </NavLink>
              ))}
              {isAdmin && <NavLink to="/admin">Админ панель</NavLink>}
            </HStack>
          </HStack>

          <Flex alignItems="center">
            <IconButton
              mr={4}
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              variant="ghost"
              colorScheme={colorMode === 'light' ? 'purple' : 'yellow'}
              aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
              _hover={{
                bg: useColorModeValue('purple.100', 'yellow.100'),
                color: useColorModeValue('purple.500', 'yellow.500'),
              }}
            />
            <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
              {currentUser ? (
                <>
                  <NavLink to="/profile">Профиль</NavLink>
                  <Button
                    variant="ghost"
                    colorScheme="teal"
                    size="sm"
                    onClick={logout}
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    to="/login"
                    variant="ghost"
                    colorScheme="teal"
                    size="sm"
                  >
                    Войти
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/register"
                    colorScheme="teal"
                    size="sm"
                  >
                    Регистрация
                  </Button>
                </>
              )}
            </HStack>
          </Flex>
        </Flex>

        {/* Мобильное меню */}
        {isOpen && (
          <Box
            pb={4}
            display={{ md: 'none' }}
            position="fixed"
            top={0}
            left={0}
            right={0}
            bg={bg}
            p={4}
            shadow="lg"
            zIndex={200}
          >
            <Flex justify="space-between" align="center" mb={4}>
              <HStack>
                <Image src="/lel.png" alt="Logo" boxSize="30px" />
                <ChakraLink
                  as={RouterLink}
                  to="/"
                  fontSize="xl"
                  fontWeight="bold"
                  bgGradient={useColorModeValue(
                    "linear(to-r, teal.500, green.500)",
                    "linear(to-r, teal.200, green.200)"
                  )}
                  bgClip="text"
                >
                  MBTI Test
                </ChakraLink>
              </HStack>
              <HStack>
                <IconButton
                  icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                  onClick={toggleColorMode}
                  variant="ghost"
                  colorScheme={colorMode === 'light' ? 'purple' : 'yellow'}
                  aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
                  mr={2}
                />
                <CloseButton onClick={onClose} />
              </HStack>
            </Flex>
            <VStack spacing={4}>
              {links.map((link) => (
                <NavLink key={link.path} to={link.path} onClick={onClose}>
                  {link.name}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink to="/admin" onClick={onClose}>
                  Админ панель
                </NavLink>
              )}
              {currentUser ? (
                <>
                  <NavLink to="/profile" onClick={onClose}>
                    Профиль
                  </NavLink>
                  <Button
                    w="full"
                    variant="ghost"
                    colorScheme="teal"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    w="full"
                    as={RouterLink}
                    to="/login"
                    variant="ghost"
                    colorScheme="teal"
                    onClick={onClose}
                  >
                    Войти
                  </Button>
                  <Button
                    w="full"
                    as={RouterLink}
                    to="/register"
                    colorScheme="teal"
                    onClick={onClose}
                  >
                    Регистрация
                  </Button>
                </>
              )}
            </VStack>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Navbar; 