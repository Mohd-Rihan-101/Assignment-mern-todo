export default function Task({ task }) {
  // NOTE: No user assignment, no drag-and-drop, no delete, no accessibility.
  return (
    <div
      style={{
        background: '#eee',
        margin: '4px 0',
        padding: 4,
        borderRadius: 4,
      }}
    >
      {task.title}
      {task.assignedTo && (
        <span style={{ marginLeft: 8 }}>({task.assignedTo})</span>
      )}
    </div>
  );
}
