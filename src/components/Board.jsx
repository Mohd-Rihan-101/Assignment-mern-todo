import Column from './Column';

export default function Board({ board, setBoard }) {
  // NOTE: No context, prop drilling, no drag-and-drop, no real-time, no filtering.
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {board.columns.map((col) => (
        <Column key={col.id} column={col} setBoard={setBoard} board={board} />
      ))}
    </div>
  );
}
