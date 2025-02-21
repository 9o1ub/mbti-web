import { collection, addDoc, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from './config';

const initialTestResults = [
  { type: 'INTJ', count: 15 },
  { type: 'INTP', count: 12 },
  { type: 'ENTJ', count: 8 },
  { type: 'ENTP', count: 10 },
  { type: 'INFJ', count: 20 },
  { type: 'INFP', count: 25 },
  { type: 'ENFJ', count: 15 },
  { type: 'ENFP', count: 18 },
  { type: 'ISTJ', count: 22 },
  { type: 'ISFJ', count: 20 },
  { type: 'ESTJ', count: 12 },
  { type: 'ESFJ', count: 14 },
  { type: 'ISTP', count: 10 },
  { type: 'ISFP', count: 15 },
  { type: 'ESTP', count: 8 },
  { type: 'ESFP', count: 12 }
];

export async function initializeTestData() {
  try {
    // Проверяем, есть ли уже данные в коллекции
    const resultsRef = collection(db, 'results');
    const snapshot = await getDocs(resultsRef);
    
    if (snapshot.empty) {
      console.log('Инициализация тестовых данных...');
      
      const batch = writeBatch(db);
      let batchCount = 0;
      let currentBatch = writeBatch(db);
      
      // Добавляем тестовые результаты
      for (const result of initialTestResults) {
        for (let i = 0; i < result.count; i++) {
          const newDocRef = doc(collection(db, 'results'));
          currentBatch.set(newDocRef, {
            type: result.type,
            timestamp: new Date().toISOString(),
            isTestData: true
          });
          
          batchCount++;
          
          // Firebase ограничивает размер пакета до 500 операций
          if (batchCount === 499) {
            await currentBatch.commit();
            currentBatch = writeBatch(db);
            batchCount = 0;
          }
        }
      }
      
      // Записываем оставшиеся документы
      if (batchCount > 0) {
        await currentBatch.commit();
      }
      
      console.log('Тестовые данные успешно добавлены');
      return true;
    } else {
      console.log('База данных уже содержит записи');
      return false;
    }
  } catch (error) {
    console.error('Ошибка при инициализации данных:', error);
    throw error;
  }
} 