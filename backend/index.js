
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.set('io', io);
const Task = require('./models/Task');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Board = require("./models/Board");
const Notification = require("./models/Notification");
const Activity = require("./models/Activity");
const auth = require("./middleware/auth");


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

function hasBoardAccess(board, userId) {
  if (!board || !userId) return false;
  if (board.ownerId?.toString() === userId.toString()) return true;
  return (board.members || []).some((member) => {
    if (!member) return false;
    const maybeId = member._id || member.userId || member;
    return maybeId.toString() === userId.toString();
  });
}

async function logActivity(boardId, userId, action, details) {
  try {
    const activity = await Activity.create({ boardId, userId, action, details });
    const populated = await activity.populate('userId', 'name email');
    io.to(boardId.toString()).emit('new-activity', populated);
  } catch (err) {
    console.error("Activity logging failed", err);
  }
}

app.get('/health', (req, res) => {
  res.send("Backend running");
});

// Board Routes
app.get("/boards", auth, async (req, res) => {
  const boards = await Board.find({
    $or: [{ ownerId: req.userId }, { members: req.userId }],
  });
  res.json(boards);
});

app.post("/boards", auth, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const board = await Board.create({
    name,
    ownerId: req.userId,
  });

  res.json(board);
});

app.patch("/boards/:id", auth, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const board = await Board.findOne({ _id: req.params.id });
  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  if (!hasBoardAccess(board, req.userId)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  board.name = name;
  await board.save();

  res.json(board);
});

app.post("/boards/:id/invite", auth, async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const board = await Board.findOne({ _id: req.params.id });
  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  if (!hasBoardAccess(board, req.userId)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const userToInvite = await User.findOne({ email });
  if (!userToInvite) {
    return res.status(404).json({ message: "User not found" });
  }

  const alreadyMember = board.members.some(
    (memberId) => memberId.toString() === userToInvite._id.toString()
  );

  if (alreadyMember) {
    return res.status(400).json({ message: "User is already a member" });
  }

  if (board.ownerId.toString() === userToInvite._id.toString()) {
    return res.status(400).json({ message: "User is the owner" });
  }

  board.members.push(userToInvite._id);
  await board.save();

  // Create notification
  await Notification.create({
    userId: userToInvite._id,
    message: `You have been invited to join the board "${board.name}"`,
    type: 'invite',
    relatedId: board._id
  });

  res.json(board);
});

app.get("/boards/:id/members", auth, async (req, res) => {
  const board = await Board.findById(req.params.id)
    .populate("ownerId", "name email")
    .populate("members", "name email");

  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  if (!hasBoardAccess(board, req.userId)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  res.json({
    owner: board.ownerId,
    members: board.members,
  });
});

app.delete("/boards/:id", auth, async (req, res) => {
  const board = await Board.findOne({ _id: req.params.id });

  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  if (!hasBoardAccess(board, req.userId)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await Board.deleteOne({ _id: req.params.id });

  // Delete all tasks associated with this board
  await Task.deleteMany({ boardId: req.params.id });

  res.json({ message: "Board deleted successfully" });
});

app.get("/boards/:id/activity", auth, async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }
  if (!hasBoardAccess(board, req.userId)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const activities = await Activity.find({ boardId: req.params.id })
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(activities);
});

app.get("/boards/:id/analytics", auth, async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }
  if (!hasBoardAccess(board, req.userId)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const tasks = await Task.find({ boardId: req.params.id });
  
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    pending: tasks.filter(t => t.status !== 'done').length,
    byStatus: [
      { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length },
      { name: 'Doing', value: tasks.filter(t => t.status === 'doing').length },
      { name: 'Done', value: tasks.filter(t => t.status === 'done').length },
    ]
  };
  
  res.json(stats);
});

app.get("/tasks", auth, async (req, res) => {
  const { boardId } = req.query;
  if (!boardId) {
    return res.status(400).json({ message: "Board ID is required" });
  }

  const board = await Board.findOne({ _id: boardId });
  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  if (!hasBoardAccess(board, req.userId)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const tasks = await Task.find({ boardId });
  res.json(tasks);
});



app.post("/tasks", auth, async (req, res) => {
  const { title, description, status, priority, dueDate, boardId } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (!boardId) {
    return res.status(400).json({ message: "Board ID is required" });
  }

  const board = await Board.findOne({ _id: boardId });
  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  if (!hasBoardAccess(board, req.userId)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const newTask = await Task.create({
    title,
    description: description || "",
    status: status || "todo",
    priority: priority || "medium",
    dueDate: dueDate || null,
    boardId,
    userId: req.userId
  });

  io.to(boardId).emit('task-created', newTask);
  logActivity(boardId, req.userId, "created a task", newTask.title);

  res.json(newTask);
});


app.patch("/tasks/:id", auth, async (req, res) => {
  const { status, title, description, priority, dueDate } = req.body;

  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ message: "Title cannot be empty" });
  }

  const task = await Task.findOne({ _id: req.params.id });
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const board = await Board.findOne({ _id: task.boardId });
  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  if (!hasBoardAccess(board, req.userId)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const oldStatus = task.status;

  if (status !== undefined) task.status = status;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;

  await task.save();

  io.to(task.boardId.toString()).emit('task-updated', task);
  if (status !== undefined && oldStatus !== status) {
    io.to(task.boardId.toString()).emit('task-moved', {
      taskId: task._id,
      boardId: task.boardId,
      from: oldStatus,
      to: status,
      task,
    });
  }
  logActivity(task.boardId, req.userId, "updated task", task.title);

  res.json(task);
});


app.delete("/tasks/:id", auth, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id });
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const board = await Board.findOne({ _id: task.boardId });
  if (!board) {
    // If board is missing, maybe we should allow delete? Or not? Safe to block.
    return res.status(404).json({ message: "Board not found" });
  }

  if (!hasBoardAccess(board, req.userId)) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const boardId = task.boardId;
  await Task.deleteOne({ _id: req.params.id });
  
  io.to(boardId.toString()).emit('task-deleted', req.params.id);
  logActivity(boardId, req.userId, "deleted a task", "ID: " + req.params.id);

  res.json({ message: "Task deleted successfully" });
});



app.get("/notifications", auth, async (req, res) => {
  const notifications = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(notifications);
});

app.patch("/notifications/:id/read", auth, async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, userId: req.userId });
  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  notification.isRead = true;
  await notification.save();

  res.json(notification);
});

app.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing Fields" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name || "",
    email,
    password: hashedPassword
  });

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(201).json({
    message: "User created successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

app.get("/auth/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

const activeUsers = new Map();

function emitBoardPresence(boardId) {
  const uniqueUsers = new Map();

  Array.from(activeUsers.values())
    .filter((entry) => entry.boardId === boardId)
    .forEach((entry) => {
      if (!uniqueUsers.has(entry.user.id)) {
        uniqueUsers.set(entry.user.id, entry.user);
      }
    });

  io.to(boardId).emit('presence-update', Array.from(uniqueUsers.values()));
}

io.on('connection', (socket) => {
  socket.on('request-board-sync', async (boardId) => {
    if (!boardId) return;
    const board = await Board.findById(boardId);
    if (!board || !hasBoardAccess(board, socket.userId)) return;
    const tasks = await Task.find({ boardId });
    socket.emit('board-snapshot', tasks);
  });

  socket.on('join-board', async ({ boardId, user }) => {
    if (!boardId) return;
    const board = await Board.findById(boardId);
    if (!board || !hasBoardAccess(board, socket.userId)) {
      socket.emit("socket-error", { message: "Not authorized for this board" });
      return;
    }

    socket.join(boardId);

    const member = user || { id: socket.userId, name: "Member", email: "" };
    activeUsers.set(socket.id, { boardId, user: member });
    emitBoardPresence(boardId);
  });

  socket.on('leave-board', (boardId) => {
    socket.leave(boardId);
    activeUsers.delete(socket.id);
    if (boardId) {
      emitBoardPresence(boardId);
    }
  });

  socket.on('disconnect', () => {
    const entry = activeUsers.get(socket.id);
    activeUsers.delete(socket.id);
    if (entry?.boardId) {
      emitBoardPresence(entry.boardId);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
