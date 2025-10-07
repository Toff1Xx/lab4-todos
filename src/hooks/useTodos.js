import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'https://dummyjson.com';

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [totalTodos, setTotalTodos] = useState(0);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const skip = (currentPage - 1) * limitPerPage;
      const res = await axios.get(`${API_BASE}/todos?limit=${limitPerPage}&skip=${skip}`);
      const payload = res.data.todos ?? [];
      setTodos(payload);
      setTotalTodos(res.data.total ?? payload.length);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limitPerPage]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const toggleTodo = useCallback(async (id) => {
    const current = todos.find(t => t.id === id);
    if (!current) return;
    const updated = { ...current, completed: !current.completed };
    setTodos(prev => prev.map(t => t.id === id ? updated : t));
    try {
      await axios.put(`${API_BASE}/todos/${id}`, { completed: updated.completed });
    } catch (err) {
      setError(err);
      fetchTodos();
    }
  }, [todos, fetchTodos]);

  const deleteTodo = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE}/todos/${id}`);
      setTodos(prev => prev.filter(t => t.id !== id));
      setTotalTodos(prev => prev - 1);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTodo = useCallback((text) => {
    if (!text.trim()) return;
    const newTodo = {
      id: Date.now(),
      todo: text.trim(),
      completed: false,
      userId: 1
    };
    setTodos(prev => [newTodo, ...prev]);
    setTotalTodos(prev => prev + 1);
  }, []);

  const editTodoTitle = useCallback(async (id, newTitle) => {
    if (!newTitle.trim()) return;
    setTodos(prev => prev.map(t => t.id === id ? { ...t, todo: newTitle } : t));
    try {
      await axios.put(`${API_BASE}/todos/${id}`, { todo: newTitle });
    } catch (err) {
      setError(err);
      fetchTodos();
    }
  }, [fetchTodos]);

  const goToNextPage = () => {
    if (currentPage * limitPerPage >= totalTodos) return;
    setCurrentPage(prev => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage === 1) return;
    setCurrentPage(prev => prev - 1);
  };

  return {
    todos: todos.filter(t => t.todo.toLowerCase().includes(searchTerm.toLowerCase())),
    isLoading,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodoTitle,
    currentPage,
    limitPerPage,
    totalTodos,
    setSearchTerm,
    setLimitPerPage,
    goToNextPage,
    goToPrevPage,
  };
}

export default useTodos;
