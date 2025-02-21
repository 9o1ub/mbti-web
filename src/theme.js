import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  colors: {
    darkBg: {
      100: '#1A202C',
      200: '#2D3748',
      300: '#4A5568',
    },
    darkAccent: {
      100: '#319795',
      200: '#38B2AC',
      300: '#4FD1C5',
    },
  },
  components: {
    Card: {
      baseStyle: (props) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
        }
      })
    },
    Button: {
      variants: {
        solid: (props) => ({
          bg: props.colorMode === 'dark' ? 'teal.500' : 'teal.500',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'teal.600' : 'teal.600',
          }
        }),
        ghost: (props) => ({
          _hover: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.100',
          }
        })
      }
    },
    Link: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'teal.200' : 'teal.500',
        _hover: {
          color: props.colorMode === 'dark' ? 'teal.100' : 'teal.600',
        }
      })
    },
    Heading: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      })
    },
    Text: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      })
    }
  }
});

export default theme; 