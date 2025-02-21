import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  useColorModeValue,
  Icon,
  List,
  ListItem,
  ListIcon,
  Flex,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import {
  FaStar,
  FaArrowLeft,
  FaSeedling,
  FaLightbulb,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTools,
} from 'react-icons/fa';
import { strengthsDescriptions, strengthsCategories } from '../data/strengthsDescriptions';

function StrengthsPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const typeData = strengthsDescriptions[type];

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('gray.700', 'white');

  if (!typeData) {
    return (
      <Container maxW="4xl" py={8}>
        <Text>Информация для данного типа личности не найдена.</Text>
        <Button onClick={() => navigate(-1)} mt={4}>Назад</Button>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <Button
        leftIcon={<FaArrowLeft />}
        onClick={() => navigate(-1)}
        mb={8}
        variant="ghost"
      >
        Назад
      </Button>

      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" mb={4} color={headingColor}>
            {type} - Сильные и слабые стороны
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Подробный анализ ваших природных талантов и областей для роста
          </Text>
        </Box>

        {/* Сильные стороны */}
        <Box>
          <Flex align="center" mb={6}>
            <Icon as={FaStar} color="yellow.400" w={6} h={6} mr={3} />
            <Heading size="lg" color={headingColor}>
              Сильные стороны
            </Heading>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 1 }} spacing={6}>
            {typeData.strengths.map((strength, index) => (
              <Box
                key={index}
                p={6}
                bg={bgColor}
                borderRadius="lg"
                borderWidth={1}
                borderColor={borderColor}
                boxShadow="md"
              >
                <Flex align="center" mb={4}>
                  <Icon as={FaLightbulb} color="teal.400" w={5} h={5} mr={3} />
                  <Heading size="md" color={headingColor}>
                    {strength.title}
                  </Heading>
                </Flex>

                <VStack align="stretch" spacing={4}>
                  <Text>{strength.description}</Text>
                  
                  <Box>
                    <Badge colorScheme="teal" mb={2}>Преимущества</Badge>
                    <Text>{strength.benefits}</Text>
                  </Box>

                  <Box>
                    <Badge colorScheme="purple" mb={2}>Как развивать</Badge>
                    <Text>{strength.development}</Text>
                  </Box>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Слабые стороны */}
        <Box>
          <Flex align="center" mb={6}>
            <Icon as={FaSeedling} color="purple.400" w={6} h={6} mr={3} />
            <Heading size="lg" color={headingColor}>
              Области для роста
            </Heading>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 1 }} spacing={6}>
            {typeData.weaknesses.map((weakness, index) => (
              <Box
                key={index}
                p={6}
                bg={bgColor}
                borderRadius="lg"
                borderWidth={1}
                borderColor={borderColor}
                boxShadow="md"
              >
                <Flex align="center" mb={4}>
                  <Icon as={FaExclamationTriangle} color="orange.400" w={5} h={5} mr={3} />
                  <Heading size="md" color={headingColor}>
                    {weakness.title}
                  </Heading>
                </Flex>

                <VStack align="stretch" spacing={4}>
                  <Text>{weakness.description}</Text>

                  <Box>
                    <Badge colorScheme="orange" mb={2}>Возможные последствия</Badge>
                    <Text>{weakness.impact}</Text>
                  </Box>

                  <Box>
                    <Badge colorScheme="green" mb={2}>Пути решения</Badge>
                    <List spacing={2}>
                      {weakness.solutions.map((solution, idx) => (
                        <ListItem key={idx}>
                          <ListIcon as={FaCheckCircle} color="green.500" />
                          {solution}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Box textAlign="center" mt={8}>
          <Button
            leftIcon={<FaTools />}
            colorScheme="teal"
            size="lg"
            onClick={() => navigate(`/personality/${type}`)}
          >
            Вернуться к описанию типа
          </Button>
        </Box>
      </VStack>
    </Container>
  );
}

export default StrengthsPage; 