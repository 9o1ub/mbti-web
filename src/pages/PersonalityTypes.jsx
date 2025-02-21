import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaBrain, FaHeart, FaShieldAlt, FaCompass } from 'react-icons/fa';
import { personalityTypes } from '../data/questions';

const groupIcons = {
  analysts: FaBrain,
  diplomats: FaHeart,
  sentinels: FaShieldAlt,
  explorers: FaCompass,
};

const groupNames = {
  analysts: 'Аналитики',
  diplomats: 'Дипломаты',
  sentinels: 'Стражи',
  explorers: 'Исследователи',
};

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

function PersonalityTypes() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={12}>
        {Object.entries(typeColors).map(([group, data]) => (
          <Box key={group} w="full">
            <Box
              mb={6}
              p={4}
              borderRadius="xl"
              bgGradient={useColorModeValue(data.light, data.dark)}
              color="white"
            >
              <Flex align="center">
                <Icon as={groupIcons[group]} w={8} h={8} mr={4} />
                <Heading size="xl">{groupNames[group]}</Heading>
              </Flex>
            </Box>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6}>
              {data.types.map(type => {
                const personality = personalityTypes[type];
                return (
                  <Box
                    key={type}
                    as={RouterLink}
                    to={`/personality/${type}`}
                    bg={bgColor}
                    p={6}
                    borderRadius="xl"
                    borderWidth={1}
                    borderColor={borderColor}
                    boxShadow="md"
                    transition="all 0.3s"
                    _hover={{
                      transform: 'translateY(-4px)',
                      boxShadow: 'lg',
                      borderColor: useColorModeValue(data.light.split(', ')[1].slice(0, -1), data.dark.split(', ')[1].slice(0, -1))
                    }}
                  >
                    <Heading
                      size="lg"
                      mb={2}
                      bgGradient={useColorModeValue(data.light, data.dark)}
                      bgClip="text"
                      fontWeight="bold"
                    >
                      {type} - {personality.name}
                    </Heading>
                    <Text fontSize="md" noOfLines={3} color={useColorModeValue('gray.600', 'gray.300')}>
                      {personality.description}
                    </Text>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
        ))}
      </VStack>
    </Container>
  );
}

export default PersonalityTypes; 