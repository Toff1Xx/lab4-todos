import { useState, useEffect } from "react";

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Завантаження todos при монтуванні
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("https://dummyjson.com/todos?limit=10");
        const data = await res.json();
        setTodos(data.todos); // data.todos – масив обʼєктів
      } catch (err) {
        setError(err.message || "Error fetching todos");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // Додавання нового todo (клієнтська частина)
  const addTodo = (title) => {
    const newTodo = {
      id: Date.now(),
      todo: title,
      completed: false
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  // Toggle completed
  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const updatedTodo = { ...todo, completed: !todo.completed };
    setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));

    // PUT-запит для імітації backend
    try {
      await fetch(`https://dummyjson.com/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: updatedTodo.completed })
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Видалення todo
  const deleteTodo = async (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      await fetch(`https://dummyjson.com/todos/${id}`, { method: "DELETE" });
    } catch (err) {
      setError(err.message);
    }
  };

  return { todos, isLoading, error, addTodo, toggleTodo, deleteTodo };
};
