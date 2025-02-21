import React from 'react';
import {
  Box,
  VStack,
  Card,
  CardBody,
  Heading,
  Text,
  SimpleGrid,
  Progress,
  List,
  ListItem,
  ListIcon,
  Link,
  Badge,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import {
  FaBriefcase,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBook,
  FaGraduationCap,
  FaArrowRight,
  FaLink,
  FaStar,
} from 'react-icons/fa';
import { recommendations } from '../data/recommendations';

function Recommendations({ personalityType }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const data = recommendations[personalityType];

  if (!data) {
    return (
      <Box p={4} bg={bgColor} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
        <Text>Рекомендации для данного типа личности пока не доступны.</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Карьерные рекомендации */}
      <Card>
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <Heading size="md" display="flex" alignItems="center">
              <Icon as={FaBriefcase} mr={2} color="blue.500" />
              Карьерные рекомендации
            </Heading>
            <SimpleGrid 
              columns={{ base: 1, sm: 2, lg: 3 }} 
              spacing={{ base: 2, md: 4 }}
              mx={{ base: -2, md: 0 }}
            >
              {data.careers.map((career, index) => (
                <Box
                  key={index}
                  p={4}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderRadius="lg"
                  borderWidth={1}
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  _hover={{
                    transform: 'translateY(-2px)',
                    shadow: 'lg',
                    borderColor: useColorModeValue('teal.500', 'teal.300'),
                  }}
                  transition="all 0.2s"
                >
                  <VStack align="stretch" spacing={2}>
                    <Heading size="sm" color={useColorModeValue('gray.700', 'white')}>{career.title}</Heading>
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>{career.description}</Text>
                    <Progress
                      value={career.matchScore}
                      colorScheme={useColorModeValue('teal', 'cyan')}
                      size="sm"
                      borderRadius="full"
                    />
                    <Text fontSize="xs" textAlign="right" color={useColorModeValue('gray.600', 'gray.400')}>
                      Соответствие: {career.matchScore}%
                    </Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </CardBody>
      </Card>

      {/* Развитие */}
      <Card>
        <CardBody>
          <VStack align="stretch" spacing={6}>
            <Heading size="md" display="flex" alignItems="center">
              <Icon as={FaStar} mr={2} color="yellow.500" />
              Рекомендации по развитию
            </Heading>

            {/* Сильные стороны */}
            <Box>
              <Heading size="sm" mb={4} color="green.500">
                Сильные стороны
              </Heading>
              <SimpleGrid 
                columns={{ base: 1, sm: 2 }} 
                spacing={{ base: 2, md: 4 }}
                mx={{ base: -2, md: 0 }}
              >
                {data.development.strengths.map((strength, index) => (
                  <Box
                    key={index}
                    p={4}
                    bg={useColorModeValue('green.50', 'rgba(74, 222, 128, 0.1)')}
                    borderRadius="lg"
                    _hover={{
                      bg: useColorModeValue('green.100', 'rgba(74, 222, 128, 0.2)'),
                      transform: 'translateY(-2px)',
                      shadow: 'lg'
                    }}
                    transition="all 0.2s"
                  >
                    <Heading size="sm" mb={2}>{strength.area}</Heading>
                    <List spacing={2}>
                      {strength.tips.map((tip, tipIndex) => (
                        <ListItem key={tipIndex} display="flex">
                          <ListIcon as={FaCheckCircle} color="green.500" mt={1} />
                          <Text>{tip}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            {/* Слабые стороны */}
            <Box>
              <Heading size="sm" mb={4} color="orange.500">
                Области для развития
              </Heading>
              <SimpleGrid 
                columns={{ base: 1, sm: 2 }} 
                spacing={{ base: 2, md: 4 }}
                mx={{ base: -2, md: 0 }}
              >
                {data.development.weaknesses.map((weakness, index) => (
                  <Box
                    key={index}
                    p={4}
                    bg={useColorModeValue('orange.50', 'rgba(251, 146, 60, 0.1)')}
                    borderRadius="lg"
                    _hover={{
                      bg: useColorModeValue('orange.100', 'rgba(251, 146, 60, 0.2)'),
                      transform: 'translateY(-2px)',
                      shadow: 'lg'
                    }}
                    transition="all 0.2s"
                  >
                    <Heading size="sm" mb={2}>{weakness.area}</Heading>
                    <List spacing={2}>
                      {weakness.tips.map((tip, tipIndex) => (
                        <ListItem key={tipIndex} display="flex">
                          <ListIcon as={FaArrowRight} color="orange.500" mt={1} />
                          <Text>{tip}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Ресурсы */}
      <Card>
        <CardBody>
          <VStack align="stretch" spacing={6}>
            <Heading size="md" display="flex" alignItems="center">
              <Icon as={FaBook} mr={2} color="purple.500" />
              Рекомендуемые ресурсы
            </Heading>

            {/* Книги */}
            <Box>
              <Heading size="sm" mb={4} color="purple.500">
                Книги
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {data.resources.books.map((book, index) => (
                  <Link
                    key={index}
                    href={book.link}
                    isExternal
                    _hover={{ textDecoration: 'none' }}
                  >
                    <Box
                      p={4}
                      bg={useColorModeValue('purple.50', 'rgba(167, 139, 250, 0.1)')}
                      borderRadius="lg"
                      transition="all 0.2s"
                      _hover={{
                        bg: useColorModeValue('purple.100', 'rgba(167, 139, 250, 0.2)'),
                        transform: 'translateY(-2px)',
                        shadow: 'lg'
                      }}
                    >
                      <Heading size="sm" mb={2}>{book.title}</Heading>
                      <Text fontSize="sm" color="gray.500">
                        Автор: {book.author}
                      </Text>
                      <Icon as={FaLink} mt={2} color="purple.500" />
                    </Box>
                  </Link>
                ))}
              </SimpleGrid>
            </Box>

            {/* Курсы */}
            <Box>
              <Heading size="sm" mb={4} color="blue.500">
                <Icon as={FaGraduationCap} mr={2} />
                Онлайн-курсы
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {data.resources.courses.map((course, index) => (
                  <Link
                    key={index}
                    href={course.link}
                    isExternal
                    _hover={{ textDecoration: 'none' }}
                  >
                    <Box
                      p={4}
                      bg={useColorModeValue('blue.50', 'rgba(96, 165, 250, 0.1)')}
                      borderRadius="lg"
                      transition="all 0.2s"
                      _hover={{
                        bg: useColorModeValue('blue.100', 'rgba(96, 165, 250, 0.2)'),
                        transform: 'translateY(-2px)',
                        shadow: 'lg'
                      }}
                    >
                      <Heading size="sm" mb={2}>{course.title}</Heading>
                      <Badge colorScheme="blue">{course.platform}</Badge>
                      <Icon as={FaLink} mt={2} color="blue.500" />
                    </Box>
                  </Link>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}

export default Recommendations; 