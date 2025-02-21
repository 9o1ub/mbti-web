import { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  Input,
  IconButton,
  Text,
  useColorModeValue,
  Flex,
  Collapse,
  Button,
  Avatar,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa';

function MBTIChat({ isOpen: externalIsOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Здравствуйте! Я - MBTI консультант. Задайте мне любой вопрос о типах личности, и я постараюсь помочь.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();
  
  const chatBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bubbleBgUser = useColorModeValue('teal.500', 'teal.400');
  const bubbleBgAssistant = useColorModeValue('gray.100', 'gray.700');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    let retries = 3;
    let attempt = 0;

    while (attempt < retries) {
      try {
        const response = await fetch('http://localhost:3000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin
          },
          credentials: 'include',
          body: JSON.stringify({
            messages: [...messages, { role: 'user', content: userMessage }]
          })
        });

        if (response.status === 503) {
          attempt++;
          if (attempt === 1) {
            toast({
              title: 'Модель загружается',
              description: 'Пожалуйста, подождите. Автоматически повторяем запрос...',
              status: 'info',
              duration: 3000,
              isClosable: true,
            });
          }
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Произошла ошибка при обработке запроса');
        }

        const data = await response.json();
        setMessages(prev => [...prev, data]);
        break;
      } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
        
        if (attempt === retries - 1) {
          const errorMessage = 'Извините, сервер временно недоступен. Пожалуйста, попробуйте через минуту.';
          
          toast({
            title: 'Ошибка',
            description: errorMessage,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });

          setMessages(prev => [...prev, {
            role: 'assistant',
            content: errorMessage
          }]);
        } else {
          await new Promise(resolve => setTimeout(resolve, 5000));
          attempt++;
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <IconButton
        icon={<FaRobot />}
        position="fixed"
        bottom="4"
        right="4"
        colorScheme="teal"
        size="lg"
        isRound
        onClick={() => onClose(!externalIsOpen)}
        zIndex={1000}
        transition="all 0.3s ease-in-out"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: '2xl',
          bg: 'teal.400'
        }}
        cursor="pointer"
      />

      <Collapse in={externalIsOpen}>
        <Box
          position="fixed"
          bottom="20"
          right="4"
          width={['90vw', '400px']}
          height="600px"
          bg={chatBg}
          borderRadius="lg"
          boxShadow="xl"
          zIndex={1000}
          borderWidth={1}
          borderColor={borderColor}
        >
          <Flex
            p={4}
            borderBottomWidth={1}
            borderColor={borderColor}
            justify="space-between"
            align="center"
          >
            <Flex align="center">
              <FaRobot size="20px" color="teal" />
              <Text ml={2} fontWeight="bold">MBTI Консультант</Text>
            </Flex>
            <IconButton
              icon={<FaTimes />}
              variant="ghost"
              size="sm"
              onClick={() => onClose(false)}
            />
          </Flex>

          <VStack
            height="calc(100% - 140px)"
            overflowY="auto"
            p={4}
            spacing={4}
            align="stretch"
          >
            {messages.map((message, index) => (
              <Flex
                key={index}
                justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
              >
                {message.role === 'assistant' && (
                  <Avatar
                    size="sm"
                    icon={<FaRobot />}
                    bg="teal.500"
                    color="white"
                    mr={2}
                  />
                )}
                <Box
                  maxW="80%"
                  bg={message.role === 'user' ? bubbleBgUser : bubbleBgAssistant}
                  color={message.role === 'user' ? 'white' : 'inherit'}
                  p={3}
                  borderRadius="lg"
                >
                  <Text>{message.content}</Text>
                </Box>
              </Flex>
            ))}
            {isLoading && (
              <Flex justify="flex-start">
                <Box bg={bubbleBgAssistant} p={3} borderRadius="lg">
                  <Spinner size="sm" />
                </Box>
              </Flex>
            )}
            <div ref={messagesEndRef} />
          </VStack>

          <Box p={4} borderTopWidth={1} borderColor={borderColor}>
            <form onSubmit={handleSubmit}>
              <Flex>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Задайте вопрос о MBTI..."
                  mr={2}
                />
                <IconButton
                  type="submit"
                  icon={<FaPaperPlane />}
                  colorScheme="teal"
                  isDisabled={!input.trim() || isLoading}
                />
              </Flex>
            </form>
          </Box>
        </Box>
      </Collapse>
    </>
  );
}

export default MBTIChat; 