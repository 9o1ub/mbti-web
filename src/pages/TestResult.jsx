import { Box, VStack, Heading } from '@chakra-ui/react';
import Statistics from '../components/Statistics';
import Recommendations from '../components/Recommendations';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

function TestResult() {
  const { user } = useContext(UserContext);
  const personalityType = user?.personalityType || 'INTJ'; // Используем тип из контекста или INTJ как значение по умолчанию

  return (
    <VStack spacing={8} w="full" p={4}>
      <Box w="full">
        <Heading mb={6}>Распределение типов личности</Heading>
        <Statistics />
      </Box>
      
      <Box w="full">
        <Heading mb={6}>Персональные рекомендации</Heading>
        <Recommendations personalityType={personalityType} />
      </Box>
    </VStack>
  );
}

export default TestResult; 