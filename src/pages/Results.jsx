import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  Text,
  Divider,
  Button,
  useColorModeValue,
  SimpleGrid,
  Tag,
  Avatar,
  Flex,
  Icon,
  List,
  ListItem,
  ListIcon,
  Image,
  Container,
  Link,
} from '@chakra-ui/react';
import { personalityTypes } from '../data/questions';
import { 
  FaStar, 
  FaBriefcase, 
  FaUsers, 
  FaRedo, 
  FaBookReader,
  FaLightbulb, 
  FaTrophy 
} from 'react-icons/fa';
import { 
  MdPerson, 
  MdWork, 
  MdPeople, 
  MdPsychology,
} from 'react-icons/md';
import PersonalityTypeDetails from '../components/PersonalityTypeDetails';
import { celebrityImages, celebrityWikiLinks } from '../data/celebrities';
import Recommendations from '../components/Recommendations';

// Определяем цвета для каждой группы типов
const typeColors = {
  analysts: {
    light: 'linear(to-r, purple.400, purple.600)',
    dark: 'linear(to-r, purple.300, purple.500)',
    types: ['INTJ', 'INTP', 'ENTJ', 'ENTP']
  },
  diplomats: {
    light: 'linear(to-r, green.400, green.600)',
    dark: 'linear(to-r, green.300, green.500)',
    types: ['INFJ', 'INFP', 'ENFJ', 'ENFP']
  },
  sentinels: {
    light: 'linear(to-r, blue.400, blue.600)',
    dark: 'linear(to-r, blue.300, blue.500)',
    types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ']
  },
  explorers: {
    light: 'linear(to-r, orange.400, orange.600)',
    dark: 'linear(to-r, orange.300, orange.500)',
    types: ['ISTP', 'ISFP', 'ESTP', 'ESFP']
  }
};

// Функция для определения цветовой схемы типа
const getTypeColorScheme = (type) => {
  for (const [group, data] of Object.entries(typeColors)) {
    if (data.types.includes(type)) {
      return {
        gradient: useColorModeValue(data.light, data.dark),
        group
      };
    }
  }
  return {
    gradient: useColorModeValue('linear(to-r, gray.400, gray.600)', 'linear(to-r, gray.300, gray.500)'),
    group: 'unknown'
  };
};

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (!location.state?.type) {
    return <Navigate to="/test" replace />;
  }

  const { type } = location.state;
  const personality = personalityTypes[type];
  const { gradient } = getTypeColorScheme(type);

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box 
          textAlign="center" 
          p={8} 
          borderRadius="xl" 
          bgGradient={gradient}
          color="white"
          boxShadow="xl"
        >
          <Icon as={MdPsychology} w={12} h={12} mb={4} />
          <Heading size="2xl" mb={4}>{type}</Heading>
          <Heading size="xl">{personality.name}</Heading>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {/* Описание */}
          <Box bg={bgColor} p={6} borderRadius="lg" borderWidth={1} borderColor={borderColor} boxShadow="md" _hover={{ boxShadow: "lg" }}>
            <Flex align="center" mb={4}>
              <Icon as={MdPerson} bgGradient={gradient} bgClip="text" mr={2} w={6} h={6} />
              <Heading size="md" bgGradient={gradient} bgClip="text">Описание</Heading>
            </Flex>
            <Text fontSize="lg">{personality.description}</Text>
          </Box>

          {/* Сильные стороны */}
          <Box bg={bgColor} p={6} borderRadius="lg" borderWidth={1} borderColor={borderColor} boxShadow="md" _hover={{ boxShadow: "lg" }}>
            <Flex align="center" mb={4}>
              <Icon as={FaStar} bgGradient={gradient} bgClip="text" mr={2} w={6} h={6} />
              <Heading size="md" bgGradient={gradient} bgClip="text">Сильные стороны</Heading>
            </Flex>
            <SimpleGrid columns={1} spacing={2}>
              {personality.strengths.map((strength, index) => (
                <Tag
                  key={index}
                  size="lg"
                  variant="subtle"
                  bgGradient={gradient}
                  color="white"
                  borderRadius="full"
                  px={6}
                  py={2}
                  fontSize="md"
                  whiteSpace="normal"
                  textAlign="center"
                  minH="32px"
                >
                  {strength}
                </Tag>
              ))}
            </SimpleGrid>
          </Box>

          {/* Карьерные возможности */}
          <Box bg={bgColor} p={6} borderRadius="lg" borderWidth={1} borderColor={borderColor} boxShadow="md" _hover={{ boxShadow: "lg" }}>
            <Flex align="center" mb={4}>
              <Icon as={FaBriefcase} bgGradient={gradient} bgClip="text" mr={2} w={6} h={6} />
              <Heading size="md" bgGradient={gradient} bgClip="text">Карьерные возможности</Heading>
            </Flex>
            <List spacing={2}>
              {personality.careers?.map((career, index) => (
                <ListItem key={index}>
                  <Flex align="center">
                    <ListIcon as={FaBriefcase} bgGradient={gradient} bgClip="text" />
                    <Text fontSize="md">{career}</Text>
                  </Flex>
                </ListItem>
              ))}
            </List>
          </Box>
        </SimpleGrid>

        {/* Знаменитости */}
        {personality && personality.celebrities && personality.celebrities.length > 0 && (
        <Box bg={bgColor} p={6} borderRadius="lg" borderWidth={1} borderColor={borderColor} boxShadow="md">
          <Flex align="center" mb={6}>
              <Icon as={FaUsers} bgGradient={gradient} bgClip="text" mr={2} w={6} h={6} />
              <Heading size="md" bgGradient={gradient} bgClip="text">Знаменитости с таким типом личности</Heading>
          </Flex>
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={6}>
            {personality.celebrities.map((celebrity, index) => (
                <VStack key={index} spacing={3}>
                  <Box
                    position="relative"
                    w="full"
                    h="150px"
                    overflow="hidden"
                    borderRadius="lg"
                    boxShadow="md"
                  >
                    <Link
                      href={celebrityWikiLinks[celebrity]}
                      isExternal
                      _hover={{ textDecoration: 'none' }}
                    >
                      <Image
                        src={celebrityImages[celebrity]}
                        alt={celebrity}
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        transition="transform 0.3s ease"
                        _hover={{ transform: 'scale(1.05)' }}
                      />
                    </Link>
                  </Box>
                  <Tag
                    size="md"
                    variant="subtle"
                    bgGradient={gradient}
                    color="white"
                    borderRadius="full"
                    px={4}
                    py={1}
                    fontSize="sm"
                    textAlign="center"
                  >
                    {celebrity}
                  </Tag>
                </VStack>
            ))}
          </SimpleGrid>
        </Box>
        )}

        {/* Подробное описание */}
        <PersonalityTypeDetails personalityType={type} />

        {/* Рекомендации */}
        <Box
          bg={bgColor}
          p={8}
          borderRadius="lg"
          borderWidth={1}
          borderColor={borderColor}
          boxShadow="xl"
        >
          <Heading
            size="lg"
            mb={6}
            bgGradient={gradient}
            bgClip="text"
          >
            Персональные рекомендации
          </Heading>
          <Recommendations personalityType={type} />
        </Box>

        <Box textAlign="center" mt={8}>
          <Button
            onClick={() => navigate('/test')}
            size="lg"
            bgGradient={gradient}
            color="white"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            leftIcon={<FaRedo />}
            boxShadow="md"
            transition="all 0.2s"
          >
            Пройти тест снова
          </Button>
        </Box>
      </VStack>
    </Container>
  );
}

export default Results; 