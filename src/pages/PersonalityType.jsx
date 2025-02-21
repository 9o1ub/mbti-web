import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  SimpleGrid,
  Tag,
  Image,
  Flex,
  Icon,
  List,
  ListItem,
  ListIcon,
  Container,
  Link,
  HStack,
} from '@chakra-ui/react';
import { FaStar, FaBriefcase, FaUsers, FaArrowLeft, FaBalanceScale, FaBookReader } from 'react-icons/fa';
import { personalityTypes } from '../data/questions';
import { celebrityImages, celebrityWikiLinks } from '../data/celebrities';
import { personalityDescriptions } from '../data/personalityDescriptions';

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

function PersonalityType() {
  const { type } = useParams();
  const navigate = useNavigate();
  const personality = personalityTypes[type];
  const description = personalityDescriptions[type]?.fullDescription || '';

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const { gradient } = getTypeColorScheme(type);

  if (!personality) {
    navigate('/personalities');
    return null;
  }

  return (
    <Container maxW="6xl" py={8}>
      <Button
        leftIcon={<FaArrowLeft />}
        mb={8}
        onClick={() => navigate('/personalities')}
        variant="ghost"
      >
        Назад к типам личности
      </Button>

      <VStack spacing={8} align="stretch">
        <Box 
          textAlign="center" 
          p={8} 
          borderRadius="xl" 
          bgGradient={gradient}
          color="white"
          boxShadow="xl"
        >
          <Heading size="2xl" mb={4}>{type}</Heading>
          <Heading size="xl" mb={6}>{personality.name}</Heading>
          <Button
            leftIcon={<FaBalanceScale />}
            size="lg"
            onClick={() => navigate(`/strengths/${type}`)}
            colorScheme="whiteAlpha"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
          >
            Сильные и слабые стороны
          </Button>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {/* Сильные стороны */}
          {personality.strengths && personality.strengths.length > 0 && (
          <Box bg={bgColor} p={6} borderRadius="xl" borderWidth={1} borderColor={borderColor} boxShadow="md">
            <Flex align="center" mb={6}>
              <Icon as={FaStar} color="yellow.400" mr={3} w={6} h={6} />
              <Heading size="lg" bgGradient={gradient} bgClip="text">Сильные стороны</Heading>
            </Flex>
            <SimpleGrid columns={1} spacing={4}>
              {personality.strengths.map((strength, index) => (
                <Tag
                  key={index}
                  size="lg"
                  variant="subtle"
                  bgGradient={gradient}
                  color="white"
                  borderRadius="full"
                  px={6}
                  py={3}
                  fontSize="lg"
                  whiteSpace="normal"
                  textAlign="center"
                  minH="40px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {strength}
                </Tag>
              ))}
            </SimpleGrid>
          </Box>
          )}

          {/* Карьера */}
          {personality.careers && personality.careers.length > 0 && (
          <Box bg={bgColor} p={6} borderRadius="xl" borderWidth={1} borderColor={borderColor} boxShadow="md">
            <Flex align="center" mb={6}>
              <Icon as={FaBriefcase} color="blue.400" mr={3} w={6} h={6} />
              <Heading size="lg" bgGradient={gradient} bgClip="text">Карьерные возможности</Heading>
            </Flex>
            <List spacing={4}>
              {personality.careers.map((career, index) => (
                <ListItem key={index} fontSize="lg">
                  <ListIcon as={FaBriefcase} bgGradient={gradient} bgClip="text" w={5} h={5} />
                  {career}
                </ListItem>
              ))}
            </List>
          </Box>
          )}
        </SimpleGrid>

        {/* Знаменитости */}
        {personality.celebrities && personality.celebrities.length > 0 && (
        <Box bg={bgColor} p={8} borderRadius="xl" borderWidth={1} borderColor={borderColor} boxShadow="md">
          <Flex align="center" mb={8}>
            <Icon as={FaUsers} color="purple.400" mr={3} w={6} h={6} />
            <Heading size="lg" bgGradient={gradient} bgClip="text">Известные представители типа</Heading>
          </Flex>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
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
        <Box bg={bgColor} p={8} borderRadius="xl" borderWidth={1} borderColor={borderColor} boxShadow="xl">
          <Flex align="center" mb={6}>
            <Icon as={FaBookReader} w={6} h={6} color="teal.500" mr={3} />
            <Heading size="lg" bgGradient={gradient} bgClip="text">
              Подробное описание
            </Heading>
          </Flex>
          {description.split('\n\n').map((paragraph, index) => (
            <Text 
              key={index} 
              fontSize="lg" 
              lineHeight="tall" 
              mb={4}
              color={useColorModeValue('gray.700', 'gray.300')}
            >
              {paragraph}
            </Text>
          ))}
        </Box>
      </VStack>
    </Container>
  );
}

export default PersonalityType; 