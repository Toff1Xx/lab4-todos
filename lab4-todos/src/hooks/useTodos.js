// src/hooks/useTodos.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'https://dummyjson.com'; // або інший fake api

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/todos`); // DummyJSON повертає { todos: [...] }
      const payload = res.data.todos ?? res.data;
      setTodos(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const toggleTodo = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    const current = todos.find(t => t.id === id);
    if (!current) { setIsLoading(false); return; }
    const updated = { ...current, completed: !current.completed };

    // Оптимістичне оновлення UI:
    setTodos(prev => prev.map(t => t.id === id ? updated : t));

    try {
      await axios.put(`${API_BASE}/todos/${id}`, { completed: updated.completed });
      // Якщо API повертає оновлений об'єкт, можна оновити ще раз:
      // const res = await axios.put(...); setTodos(prev => prev.map(t => t.id === id ? res.data : t));
    } catch (err) {
      // при помилці – відкотити (або перезапросити)
      setError(err);
      await fetchTodos();
    } finally {
      setIsLoading(false);
    }
  }, [todos, fetchTodos]);

  const deleteTodo = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE}/todos/${id}`);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Додавання локально (щоб задовольнити acceptance criteria)
  const addTodo = useCallback((text) => {
    if (!text || !text.trim()) return;
    const newTodo = {
      id: Date.now(),      // локальний id
      todo: text.trim(),
      completed: false,
      userId: 1
    };
    setTodos(prev => [newTodo, ...prev]);
  }, []);

  return {
    todos,
    isLoading,
    error,
    fetchTodos,   // корисно для manual refresh
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}

export default useTodos;
