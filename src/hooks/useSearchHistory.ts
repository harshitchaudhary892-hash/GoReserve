import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchHistoryItem } from '../types';

const SEARCH_HISTORY_KEY = '@goreserve_search_history';
const MAX_HISTORY = 10;

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const saveHistory = async (items: SearchHistoryItem[]) => {
    try {
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const addToHistory = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      const newItem: SearchHistoryItem = {
        id: Date.now().toString(),
        query: trimmed,
        timestamp: Date.now(),
      };

      const filtered = history.filter((item) => item.query !== trimmed);
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
      setHistory(updated);
      saveHistory(updated);
    },
    [history]
  );

  const removeFromHistory = useCallback(
    (id: string) => {
      const updated = history.filter((item) => item.id !== id);
      setHistory(updated);
      saveHistory(updated);
    },
    [history]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
};
