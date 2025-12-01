import { db } from './firebase';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { AnalysisResult, HistoryItem } from '../types';

const COLLECTION_NAME = 'analyses';

export const saveAnalysis = async (data: AnalysisResult) => {
  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      timestamp: Date.now() // Simple numeric timestamp
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const fetchHistory = async (userId: string): Promise<HistoryItem[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const history: HistoryItem[] = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() } as HistoryItem);
    });
    return history;
  } catch (e) {
    console.error("Error fetching history: ", e);
    return [];
  }
};
