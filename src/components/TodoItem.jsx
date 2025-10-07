import React, { useState } from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.todo);

  const handleSave = () => {
    if (!editText.trim()) return;
    onEdit(editText);
    setIsEditing(false);
  };

  return (
    <li
      className="todo-item"
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}
    >
      <input type="checkbox" checked={!!todo.completed} onChange={onToggle} />

      {isEditing ? (
        <input
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          style={{ flex: 1, padding: '4px' }}
        />
      ) : (
        <span
          style={{
            flex: 1,
            wordBreak: 'break-word',
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? '#888' : 'inherit',
            opacity: todo.completed ? 0.8 : 1
          }}
        >
          {todo.todo}
        </span>
      )}

      {isEditing ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      )}

      <button onClick={onDelete}>Delete</button>
    </li>
  );
}
