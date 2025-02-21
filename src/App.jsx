import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Test from './pages/Test';
import Results from './pages/Results';
import Profile from './pages/Profile';
import PersonalityTypes from './pages/PersonalityTypes';
import PersonalityType from './pages/PersonalityType';
import Login from './pages/Login';
import Register from './pages/Register';
import Statistics from './components/Statistics';
import LearningProgress from './components/LearningProgress';
import Admin from './pages/Admin';
import ChatBot from './components/ChatBot';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import theme from './theme';
import StrengthsPage from './pages/StrengthsPage';

// Импорт шрифтов
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';

// Компонент для защищенных маршрутов
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

// Компонент для маршрутов админа
function AdminRoute({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/" />;
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Box minH="100vh">
            <Navbar />
            <Routes>
              {/* Публичные маршруты */}
              <Route path="/" element={<Home />} />
              <Route path="/personalities" element={<PersonalityTypes />} />
              <Route path="/personality/:type" element={<PersonalityType />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/chat" element={<ChatBot />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/strengths/:type" element={<StrengthsPage />} />
              
              {/* Защищенные маршруты */}
              <Route path="/test" element={
                <PrivateRoute>
                  <Test />
                </PrivateRoute>
              } />
              <Route path="/results" element={
                <PrivateRoute>
                  <Results />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/learning" element={
                <PrivateRoute>
                  <LearningProgress />
                </PrivateRoute>
              } />

              {/* Маршрут админа */}
              <Route path="/admin" element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              } />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App; 