// server/controllers/taskController.js
const Task = require('../models/Task');

async function buildBoard() {
  const tasks = await Task.find().sort({ index: 1, createdAt: 1 }).lean();
  const columns = [
    { id: 'todo', title: 'To Do', tasks: tasks.filter(t => t.status === 'todo') },
    { id: 'inprogress', title: 'In Progress', tasks: tasks.filter(t => t.status === 'inprogress') },
    { id: 'done', title: 'Done', tasks: tasks.filter(t => t.status === 'done') }
  ];
  // users can be derived or kept simple for now
  const users = Array.from(new Set(tasks.map(t => t.assignedTo).filter(Boolean))).map((name, i) => ({ id: `u${i+1}`, name }));
  return { columns, users };
}

async function getBoard(req, res) {
  try {
    const board = await buildBoard();
    return res.json(board);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getTask(req, res) {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).lean();
    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function addTask(req, res) {
  try {
    const { columnId, task } = req.body;
    // set index to end of column
    const count = await Task.countDocuments({ status: columnId });
    const created = await Task.create({
      title: task.title,
      status: columnId,
      assignedTo: task.assignedTo || null,
      index: count
    });
    const board = await buildBoard();
    // emit via socket if available
    const io = require('../socket').getIO();
    if (io) io.emit('board_updated', board);
    return res.json({ task: created, board });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateTask(req, res) {
  try {
    const { taskId, updates } = req.body;
    const updated = await Task.findByIdAndUpdate(taskId, updates, { new: true });
    const board = await buildBoard();
    const io = require('../socket').getIO();
    if (io) io.emit('board_updated', board);
    return res.json({ task: updated, board });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteTask(req, res) {
  try {
    const { taskId } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    // adjust indexes of tasks in same column after deletion
    await Task.updateMany({ status: task.status, index: { $gt: task.index } }, { $inc: { index: -1 } });
    await Task.findByIdAndDelete(taskId);
    const board = await buildBoard();
    const io = require('../socket').getIO();
    if (io) io.emit('board_updated', board);
    return res.json({ board });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getByStatus(req, res) {
  try {
    const { status } = req.query;
    const list = await Task.find({ status }).sort({ index: 1 }).lean();
    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateStatus(req, res) {
  try {
    const { taskId, fromColumnId, toColumnId, toIndex } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // remove from old column: shift indexes down for items after the removed one
    await Task.updateMany({ status: fromColumnId, index: { $gt: task.index } }, { $inc: { index: -1 } });

    // shift indexes in destination to make room
    await Task.updateMany({ status: toColumnId, index: { $gte: toIndex } }, { $inc: { index: 1 } });

    // update task
    task.status = toColumnId;
    task.index = toIndex;
    await task.save();

    const board = await buildBoard();
    const io = require('../socket').getIO();
    if (io) io.emit('board_updated', board);
    return res.json({ task, board });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getBoard,
  getTask,
  addTask,
  updateTask,
  deleteTask,
  getByStatus,
  updateStatus
};
