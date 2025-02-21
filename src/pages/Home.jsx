import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Flex,
  chakra,
  shouldForwardProp,
  HStack,
} from '@chakra-ui/react';
import { motion, isValidMotionProp } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaClipboardList, FaChartPie, FaUsers, FaRobot, FaBrain, FaLightbulb, FaComments } from 'react-icons/fa';
import MBTIChat from '../components/MBTIChat';
import Footer from '../components/Footer';
import { useState } from 'react';

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

function FeatureCard({ icon, title, description, index }) {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <ChakraBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Box
        p={8}
        bg={bg}
        borderWidth={1}
        borderColor={borderColor}
        borderRadius="2xl"
        boxShadow="xl"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: '2xl',
        }}
        transition="all 0.3s ease-in-out"
      >
        <Flex
          w={16}
          h={16}
          align="center"
          justify="center"
          color="white"
          rounded="full"
          bg="linear-gradient(135deg, #38B2AC 0%, #234E52 100%)"
          mb={4}
        >
          <Icon as={icon} w={8} h={8} />
        </Flex>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          {title}
        </Text>
        <Text color="gray.500" fontSize="md">
          {description}
        </Text>
      </Box>
    </ChakraBox>
  );
}

function Home() {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const bgGradient = useColorModeValue(
    'linear(to-r, teal.500, green.500)',
    'linear(to-r, teal.200, green.200)'
  );

  const features = [
    {
      icon: FaRobot,
      title: 'ИИ-консультант',
      description: 'Получите мгновенные ответы на вопросы о типах личности от нашего ИИ-ассистента'
    },
    {
      icon: FaClipboardList,
      title: 'Подробный тест',
      description: 'Ответьте на вопросы, чтобы определить свой тип личности MBTI'
    },
    {
      icon: FaChartPie,
      title: 'Детальный анализ',
      description: 'Получите подробное описание вашего типа личности и его характеристик'
    },
    {
      icon: FaUsers,
      title: '16 типов личности',
      description: 'Изучите все 16 типов личности MBTI и их особенности'
    }
  ];

  return (
    <Box>
      {/* Hero section */}
      <Box
        bgGradient={bgGradient}
        color="white"
        py={32}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)"
        />
        <Container maxW="6xl" position="relative">
          <ChakraBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={8} align="center" textAlign="center">
              <Heading
                size="3xl"
                bgGradient="linear(to-r, white, gray.300)"
                bgClip="text"
                letterSpacing="tight"
              >
                Раскройте свою истинную личность
              </Heading>
              <Text fontSize="2xl" maxW="2xl" color="white">
                Пройдите тест MBTI, чтобы лучше понять себя, свои сильные стороны и потенциальные области для роста. Задавайте вопросы нашему ИИ-консультанту в любое время!
              </Text>
              <Button
                size="lg"
                variant="solid"
                bg="white"
                color="teal.500"
                _hover={{ bg: 'gray.100' }}
                px={8}
                h={14}
                fontSize="lg"
                onClick={() => navigate('/test')}
                shadow="lg"
              >
                Пройти тест
              </Button>
            </VStack>
          </ChakraBox>
        </Container>
      </Box>

      {/* Features section */}
      <Container maxW="6xl" py={20}>
        <VStack spacing={16}>
          <ChakraBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box textAlign="center" maxW="3xl" mx="auto">
              <Heading
                mb={4}
                size="xl"
                bgGradient="linear(to-r, teal.500, green.500)"
                bgClip="text"
              >
                Возможности платформы
              </Heading>
              <Text fontSize="xl" color="gray.500">
                Исследуйте себя с помощью научно обоснованного подхода к типологии личности
              </Text>
            </Box>
          </ChakraBox>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} width="100%">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* AI Assistant Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={20}>
        <Container maxW="6xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <ChakraBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <VStack align="start" spacing={6}>
                <Heading
                  size="xl"
                  bgGradient="linear(to-r, teal.500, green.500)"
                  bgClip="text"
                >
                  ИИ-консультант MBTI
                </Heading>
                <Text fontSize="lg" color="gray.500">
                  Наш искусственный интеллект готов ответить на любые вопросы о типах личности MBTI.
                  Получите мгновенные, точные и информативные ответы в любое время.
                </Text>
                <SimpleGrid columns={2} spacing={4} w="full">
                  <Feature icon={FaBrain} title="Экспертные знания" />
                  <Feature icon={FaLightbulb} title="Точные ответы" />
                  <Feature icon={FaComments} title="24/7 доступность" />
                  <Feature icon={FaUsers} title="Персональный подход" />
                </SimpleGrid>
              </VStack>
            </ChakraBox>
            <ChakraBox
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={8}
                borderRadius="2xl"
                boxShadow="xl"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  h="4px"
                  bgGradient="linear(to-r, teal.400, green.400)"
                />
                <VStack spacing={4} align="start">
                  <Heading size="md">Примеры вопросов:</Heading>
                  <Text>• Что такое MBTI?</Text>
                  <Text>• Чем отличается интроверт от экстраверта?</Text>
                  <Text>• Какие сильные стороны у INTJ?</Text>
                  <Text>• Как развить свои слабые стороны?</Text>
                  <Button
                    colorScheme="teal"
                    size="lg"
                    w="full"
                    onClick={() => setIsChatOpen(true)}
                    bgGradient="linear(to-r, teal.400, green.400)"
                    _hover={{
                      bgGradient: 'linear(to-r, teal.500, green.500)',
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                  >
                    Спросить ИИ
                  </Button>
                </VStack>
              </Box>
            </ChakraBox>
          </SimpleGrid>
        </Container>
      </Box>

      <MBTIChat 
        isOpen={isChatOpen} 
        onClose={(value) => setIsChatOpen(value === undefined ? false : value)} 
      />
      <Footer />
    </Box>
  );
}

function Feature({ icon, title }) {
  return (
    <HStack spacing={4}>
      <Icon as={icon} w={5} h={5} color="teal.500" />
      <Text fontSize="md">{title}</Text>
    </HStack>
  );
}

export default Home; 