// 'use client';

// import React, { createContext, useContext } from 'react';
// import useBoard from '../hooks/useBoard';

// const BoardContext = createContext();

// export function BoardProvider({ children }) {
//   const api = useBoard(); // returns { board, fetchBoard, addTask, ... }

//   return (
//     <BoardContext.Provider value={api}>
//       {children}
//     </BoardContext.Provider>
//   );
// }

// export function useBoardContext() {
//   return useContext(BoardContext);
// }
