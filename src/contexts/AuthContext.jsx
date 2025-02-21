import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  // Функция для обработки ошибок Firebase
  const handleFirebaseError = (error) => {
    console.error('Firebase error:', error);
    let message = 'Произошла ошибка. Попробуйте позже.';

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Этот логин уже используется.';
        break;
      case 'auth/invalid-email':
        message = 'Некорректный формат логина.';
        break;
      case 'auth/operation-not-allowed':
        message = 'Этот метод входа отключен. Обратитесь к администратору.';
        break;
      case 'auth/weak-password':
        message = 'Слишком слабый пароль. Минимум 6 символов.';
        break;
      case 'auth/configuration-not-found':
        message = 'Ошибка конфигурации Firebase. Обратитесь к администратору.';
        break;
      case 'auth/invalid-credential':
        message = 'Неверный логин или пароль.';
        break;
      case 'auth/user-disabled':
        message = 'Аккаунт отключен.';
        break;
      case 'auth/user-not-found':
        message = 'Пользователь не найден.';
        break;
      case 'auth/wrong-password':
        message = 'Неверный пароль.';
        break;
      default:
        message = error.message;
    }

    setError(message);
    throw new Error(message);
  };

  async function signup(username, password, displayName) {
    try {
      setError('');
      if (!username || !password) {
        throw new Error('Логин и пароль обязательны');
      }

      // Создаем email из username для Firebase Auth
      const email = `${username}@mbti-test.com`;
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        .catch(handleFirebaseError);
      
      // Создаем документ пользователя в Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username,
        displayName,
        role: 'user',
        createdAt: new Date().toISOString()
      });

      return userCredential;
    } catch (error) {
      handleFirebaseError(error);
    }
  }

  async function login(username, password) {
    try {
      setError('');
      if (!username || !password) {
        throw new Error('Логин и пароль обязательны');
      }

      // Проверяем, является ли это попыткой входа админа
      if (username === 'ADMIN' && password === 'Abobus') {
        const email = `${username}@mbti-test.com`;
        try {
          // Пробуем войти
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            username,
            displayName: 'Administrator',
            role: 'admin',
            updatedAt: new Date().toISOString()
          }, { merge: true });
          setIsAdmin(true);
          return userCredential;
        } catch (error) {
          // Если пользователь не существует, создаем его
          if (error.code === 'auth/user-not-found') {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', userCredential.user.uid), {
              username,
              displayName: 'Administrator',
              role: 'admin',
              createdAt: new Date().toISOString()
            });
            setIsAdmin(true);
            return userCredential;
          }
          throw error;
        }
      }

      // Для обычных пользователей
      const email = `${username}@mbti-test.com`;
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
        .catch(handleFirebaseError);
      
      return userCredential;
    } catch (error) {
      handleFirebaseError(error);
    }
  }

  function logout() {
    setIsAdmin(false);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Проверяем роль пользователя
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        }
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    signup,
    login,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 