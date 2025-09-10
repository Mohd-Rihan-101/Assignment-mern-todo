'use client';

import Task from './Task';
import { useState } from 'react';

export default function Column({ column, setBoard, board }) {
  const [newTask, setNewTask] = useState('');

  const handleAdd = async () => {
    const title = newTask.trim();
    if (!title) return;

    // optimistic UI: show a temp task immediately
    const tempId = `temp-${Date.now()}`;
    const tempTask = { id: tempId, title, assignedTo: null };

    const prevBoard = board;
    const optimisticBoard = {
      ...board,
      columns: board.columns.map((c) =>
        c.id === column.id ? { ...c, tasks: [...c.tasks, tempTask] } : c
      ),
    };
    setBoard(optimisticBoard);
    setNewTask('');

    try {
      const res = await fetch('http://localhost:5000/api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          columnId: column.id,
          task: { title, assignedTo: null },
        }),
      });

      if (!res.ok) throw new Error('Add failed');

      const data = await res.json();
      // backend (taskController.addTask) returns { task, board } — prefer server board
      if (data.board) {
        setBoard(data.board);
      } else {
        // fallback: re-fetch full board
        const r = await fetch('http://localhost:5000/api/get');
        if (r.ok) {
          const boardData = await r.json();
          setBoard(boardData);
        }
      }
    } catch (err) {
      console.error('Add task error:', err);
      // rollback optimistic UI
      setBoard(prevBoard);
      alert('Could not add task. Please try again.');
    }
  };

  return (
    <div
      style={{
        minWidth: 250,
        border: '1px solid #aaa',
        borderRadius: 8,
        padding: 8,
      }}
    >
      <h2>{column.title}</h2>
      <div>
        {column.tasks.map((task) => (
          <Task key={task._id || task.id} task={task} />
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
          style={{ width: '70%', padding: 6 }}
        />
        <button onClick={handleAdd} style={{ marginLeft: 8, padding: '6px 10px' }}>
          Add
        </button>
      </div>
    </div>
  );
}
