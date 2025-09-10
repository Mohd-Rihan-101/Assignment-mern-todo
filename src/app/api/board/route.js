import { NextResponse } from 'next/server';

// This would typically be in a database, but we'll keep it in-memory for the example.
let board = {
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        { id: '1', title: 'Setup project', assignedTo: null },
        { id: '2', title: 'Design wireframes', assignedTo: null },
      ],
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      tasks: [{ id: '3', title: 'Develop homepage', assignedTo: null }],
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [],
    },
  ],
  users: [
    { id: 'u1', name: 'Alice' },
    { id: 'u2', name: 'Bob' },
  ],
};

// Handles GET requests to /api/board
export async function GET(request) {
  return NextResponse.json(board);
}

// Handles POST requests to /api/board
export async function POST(request) {
  try {
    const { columnId, task } = await request.json();
    const column = board.columns.find((col) => col.id === columnId);

    if (column) {
      column.tasks.push({ ...task, id: Date.now().toString() });
      return NextResponse.json(board);
    } else {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Handles PUT requests to /api/board
export async function PUT(request) {
  try {
    const updatedBoard = await request.json();
    board = updatedBoard; // Replace the in-memory board state
    return NextResponse.json(board);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
