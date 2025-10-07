// src/components/TodoList.jsx
import React, { useState } from 'react';
import useTodos from '../hooks/useTodos';
import TodoItem from './TodoItem';

export default function TodoList() {
  const { todos, isLoading, error, addTodo, toggleTodo, deleteTodo, fetchTodos } = useTodos();
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    addTodo(text);
    setText('');
  };

  return (
    <div className="todo-app" style={{maxWidth:700, margin:'0 auto', padding:'20px'}}>
      <h1>Todo List</h1>

      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add new todo..."
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          style={{flex:1, padding:'8px'}}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <div style={{marginBottom:12}}>
        <button onClick={fetchTodos}>Refresh</button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{color:'crimson'}}>Error: {error.message ?? JSON.stringify(error)}</p>}

      <ul style={{listStyle:'none', padding:0}}>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </ul>
    </div>
  );
}
