import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  Select,
} from '@chakra-ui/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Определяем цвета для каждой группы типов
const typeColors = {
  analysts: {
    light: '#9F7AEA', // purple.400
    dark: '#805AD5', // purple.500
    types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
    label: 'Аналитики'
  },
  diplomats: {
    light: '#48BB78', // green.400
    dark: '#38A169', // green.500
    types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
    label: 'Дипломаты'
  },
  sentinels: {
    light: '#4299E1', // blue.400
    dark: '#3182CE', // blue.500
    types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
    label: 'Стражи'
  },
  explorers: {
    light: '#ED8936', // orange.400
    dark: '#DD6B20', // orange.500
    types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
    label: 'Исследователи'
  }
};

const getTypeColor = (type) => {
  for (const [group, data] of Object.entries(typeColors)) {
    if (data.types.includes(type)) {
      return useColorModeValue(data.light, data.dark);
    }
  }
  return useColorModeValue('gray.400', 'gray.500');
};

const getTypeLabel = (type) => {
  for (const [group, data] of Object.entries(typeColors)) {
    if (data.types.includes(type)) {
      return data.label;
    }
  }
  return 'Неизвестный тип';
};

function Statistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('bar');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchStatistics();
  }, []);

  async function fetchStatistics() {
    try {
      const resultsRef = collection(db, 'results');
      const snapshot = await getDocs(resultsRef);
      const results = snapshot.docs.map(doc => doc.data());
      
      console.log('Полученные результаты:', results); // Отладочная информация
      
      // Обработка результатов
      const stats = processSnapshot(results);
      console.log('Обработанная статистика:', stats); // Отладочная информация
      
      setStatistics(stats);
    } catch (error) {
      console.error('Ошибка при загрузке статистики:', error);
      setError('Не удалось загрузить статистику. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  }

  function processSnapshot(results) {
    const typeCount = {};
    const totalTests = results.length;
    const uniqueUsers = new Set(results.map(result => result.userId)).size;

    // Подсчет количества каждого типа
    results.forEach(result => {
      typeCount[result.type] = (typeCount[result.type] || 0) + 1;
    });

    // Преобразование в проценты и подготовка данных для графиков
    const typePercentages = {};
    const chartData = [];
    Object.entries(typeCount).forEach(([type, count]) => {
      const percentage = ((count / totalTests) * 100).toFixed(1);
      typePercentages[type] = percentage;
      chartData.push({
        type,
        count,
        percentage
      });
    });

    return {
      totalTests,
      uniqueUsers,
      typePercentages,
      chartData: chartData.sort((a, b) => b.count - a.count)
    };
  }

  if (loading) {
    return (
      <Container maxW="6xl" py={12}>
        <Flex justify="center" align="center" minH="400px">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="6xl" py={12}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  if (!statistics || !statistics.chartData || statistics.chartData.length === 0) {
    return (
      <Container maxW="6xl" py={12}>
        <Alert status="info">
          <AlertIcon />
          Нет данных для отображения статистики. Пройдите тест, чтобы увидеть результаты.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={12}>
      <VStack spacing={8}>
        <Box
          bg={bgColor}
          p={8}
          borderRadius="lg"
          borderWidth={1}
          borderColor={borderColor}
          boxShadow="xl"
          w="full"
        >
          <Flex justify="space-between" align="center" mb={6}>
            <Heading 
              size="lg"
              bgGradient="linear(to-r, teal.400, green.400)"
              bgClip="text"
            >
              Распределение типов личности
            </Heading>
            <Select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              maxW="200px"
            >
              <option value="bar">Столбчатая диаграмма</option>
              <option value="pie">Круговая диаграмма</option>
            </Select>
          </Flex>

          <Box height="500px">
            <ResponsiveContainer width="100%" height="100%">
              {viewType === 'bar' ? (
                <BarChart data={statistics.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <Box
                            bg={bgColor}
                            p={3}
                            borderRadius="md"
                            borderWidth={1}
                            borderColor={borderColor}
                          >
                            <Text fontWeight="bold">{data.type}</Text>
                            <Text>Количество: {data.count}</Text>
                            <Text>Процент: {data.percentage}%</Text>
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="count"
                    name="Количество"
                    radius={[4, 4, 0, 0]}
                  >
                    {statistics.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getTypeColor(entry.type)} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={statistics.chartData}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={200}
                    label={({ type, percentage }) => `${type} (${percentage}%) - ${getTypeLabel(type)}`}
                  >
                    {statistics.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getTypeColor(entry.type)} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <Box
                            bg={bgColor}
                            p={3}
                            borderRadius="md"
                            borderWidth={1}
                            borderColor={borderColor}
                          >
                            <Text fontWeight="bold">{data.type}</Text>
                            <Text color={getTypeColor(data.type)}>{getTypeLabel(data.type)}</Text>
                            <Text>Количество: {data.count}</Text>
                            <Text>Процент: {data.percentage}%</Text>
                          </Box>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box
          bg={bgColor}
          p={8}
          borderRadius="lg"
          borderWidth={1}
          borderColor={borderColor}
          boxShadow="xl"
          w="full"
        >
          <Heading
            size="lg"
            mb={6}
            bgGradient="linear(to-r, teal.400, green.400)"
            bgClip="text"
          >
            Детальное распределение
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {Object.entries(statistics.typePercentages)
              .sort((a, b) => b[1] - a[1])
              .map(([type, percentage]) => {
                const color = getTypeColor(type);
                return (
                  <Box
                    key={type}
                    p={4}
                    borderRadius="lg"
                    borderWidth={1}
                    borderColor={borderColor}
                    position="relative"
                    overflow="hidden"
                    _after={{
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: `${percentage}%`,
                      height: '4px',
                      bg: color,
                      transition: 'width 0.3s ease-in-out',
                    }}
                  >
                    <Text fontSize="xl" fontWeight="bold">
                      {type}
                    </Text>
                    <Text fontSize="md" color={color} mb={2}>
                      {getTypeLabel(type)}
                    </Text>
                    <Text fontSize="2xl" color={color}>
                      {percentage}%
                    </Text>
                  </Box>
                );
              })}
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
}

export default Statistics; 