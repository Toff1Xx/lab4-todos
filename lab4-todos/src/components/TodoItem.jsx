// src/components/TodoItem.jsx
import React from 'react';

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`} style={{display:'flex', alignItems:'center', gap: '8px', padding:'6px 0'}}>
      <input
        type="checkbox"
        checked={!!todo.completed}
        onChange={onToggle}
        aria-label={`Toggle todo ${todo.id}`}
      />
      <span style={{flex:1, wordBreak:'break-word'}}>
        {todo.todo}
      </span>
      <button onClick={onDelete} aria-label={`Delete todo ${todo.id}`}>Delete</button>
    </li>
  );
}
