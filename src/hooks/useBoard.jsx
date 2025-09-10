// 'use client';

// import { useState, useRef, useCallback } from 'react';
// import io from 'socket.io-client';

// const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
// const SOCKET = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

// export default function useBoard() {
//   const [board, setBoard] = useState({ columns: [], users: [] });
//   const socketRef = useRef(null);

//   const fetchBoard = useCallback(async () => {
//     try {
//       const res = await fetch(`${BASE}/get`);
//       if (!res.ok) throw new Error('Fetch failed');
//       const data = await res.json();
//       setBoard(data);
//     } catch (err) {
//       console.error('fetchBoard error', err);
//     }
//   }, []);

//   const connectSocket = useCallback(() => {
//     if (socketRef.current) return;
//     socketRef.current = io(SOCKET);
//     socketRef.current.on('connect', () => console.log('Socket connected', socketRef.current.id));
//     socketRef.current.on('board_updated', (updatedBoard) => {
//       // simple replace — safe for now
//       setBoard(updatedBoard);
//     });
//   }, []);

//   const addTask = async (columnId, title) => {
//     // optimistic: create temp id handled in column component
//     try {
//       const res = await fetch(`${BASE}/add`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ columnId, task: { title, assignedTo: null } })
//       });
//       if (!res.ok) throw new Error('Add failed');
//       const data = await res.json();
//       // server broadcasts board updated via socket — but also return data
//       // we will set board from server response (data.board) if present
//       if (data.board) setBoard(data.board);
//       return data.task;
//     } catch (err) {
//       console.error('addTask error', err);
//       throw err;
//     }
//   };

//   const deleteTask = async (taskId) => {
//     try {
//       const res = await fetch(`${BASE}/delete`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ taskId })
//       });
//       if (!res.ok) throw new Error('Delete failed');
//       const data = await res.json();
//       if (data.board) setBoard(data.board);
//     } catch (err) {
//       console.error('deleteTask error', err);
//       throw err;
//     }
//   };

//   const updateTask = async (taskId, updates) => {
//     try {
//       const res = await fetch(`${BASE}/update`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ taskId, updates })
//       });
//       if (!res.ok) throw new Error('Update failed');
//       const data = await res.json();
//       if (data.board) setBoard(data.board);
//       return data.task;
//     } catch (err) {
//       console.error('updateTask error', err);
//       throw err;
//     }
//   };

//   const updateStatus = async ({ taskId, fromColumnId, toColumnId, toIndex }) => {
//     try {
//       const res = await fetch(`${BASE}/update-status`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ taskId, fromColumnId, toColumnId, toIndex })
//       });
//       if (!res.ok) throw new Error('update status failed');
//       const data = await res.json();
//       if (data.board) setBoard(data.board);
//       return data;
//     } catch (err) {
//       console.error('updateStatus error', err);
//       throw err;
//     }
//   };

//   return {
//     board,
//     setBoard,
//     fetchBoard,
//     connectSocket,
//     addTask,
//     deleteTask,
//     updateTask,
//     updateStatus
//   };
// }
