import React from 'react';
import { 
  Box, 
  Text, 
  Button, 
  VStack, 
  useColorModeValue, 
  Icon, 
  Heading,
  Flex,
  Divider
} from '@chakra-ui/react';
import { personalityDescriptions } from '../data/personalityDescriptions';
import { useNavigate } from 'react-router-dom';
import { FaBookReader, FaBalanceScale } from 'react-icons/fa';

const PersonalityTypeDetails = ({ personalityType }) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const description = personalityDescriptions[personalityType]?.fullDescription || '';

  const handleStrengthsClick = () => {
    navigate(`/strengths/${personalityType}`);
  };

  return (
    <VStack spacing={6} align="stretch" w="full">
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        borderRadius="xl"
        borderWidth={1}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        boxShadow={useColorModeValue('lg', 'dark-lg')}
        overflow="hidden"
        transition="all 0.3s"
        _hover={{
          borderColor: useColorModeValue('teal.500', 'teal.300'),
          transform: 'translateY(-2px)',
        }}
      >
        <Box
          bg={useColorModeValue('teal.50', 'rgba(49, 151, 149, 0.1)')}
          p={4}
          borderBottom="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <Flex align="center">
            <Icon 
              as={FaBookReader} 
              w={6} 
              h={6} 
              color={useColorModeValue('teal.500', 'teal.200')} 
              mr={3} 
            />
            <Heading 
              size="md" 
              color={useColorModeValue('teal.600', 'teal.200')}
            >
              Подробное описание
            </Heading>
          </Flex>
        </Box>

        <Box p={6}>
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
      </Box>
      
      <Button
        leftIcon={<FaBalanceScale />}
        colorScheme="teal"
        size="lg"
        onClick={handleStrengthsClick}
        w="full"
        boxShadow={useColorModeValue('md', 'dark-lg')}
        bg={useColorModeValue('teal.500', 'teal.400')}
        color="white"
        _hover={{
          bg: useColorModeValue('teal.600', 'teal.500'),
          transform: 'translateY(-2px)',
          boxShadow: 'xl',
        }}
        transition="all 0.2s"
      >
        Узнать сильные и слабые стороны
      </Button>
    </VStack>
  );
};

export default PersonalityTypeDetails; 