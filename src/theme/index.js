import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  colors: {
    brand: {
      50: '#f0fff4',
      100: '#c6f6d5',
      200: '#9ae6b4',
      300: '#68d391',
      400: '#48bb78',
      500: '#38a169',
      600: '#2f855a',
      700: '#276749',
      800: '#22543d',
      900: '#1c4532',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #38B2AC 0%, #234E52 100%)',
      secondary: 'linear-gradient(135deg, #4FD1C5 0%, #319795 100%)',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'lg',
      },
      variants: {
        gradient: {
          bgGradient: 'linear(to-r, teal.500, green.500)',
          color: 'white',
          _hover: {
            bgGradient: 'linear(to-r, teal.600, green.600)',
          },
        },
        outline: {
          borderWidth: '2px',
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          overflow: 'hidden',
          boxShadow: 'xl',
          transition: 'all 0.3s ease-in-out',
          _hover: {
            transform: 'translateY(-5px)',
            boxShadow: '2xl',
          },
        },
      },
    },
  },
  fonts: {
    heading: '"Montserrat", sans-serif',
    body: '"Inter", sans-serif',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme; 