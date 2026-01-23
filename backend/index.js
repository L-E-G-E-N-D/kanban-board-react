
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
const Task = require('./models/Task');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Board = require("./models/Board");
const auth = require("./middleware/auth");


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/health', (req, res) => {
  res.send("Backend running");
});

// Board Routes
app.get("/boards", auth, async (req, res) => {
  const boards = await Board.find({ userId: req.userId });
  res.json(boards);
});

app.post("/boards", auth, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const board = await Board.create({
    name,
    userId: req.userId,
  });

  res.json(board);
});

app.patch("/boards/:id", auth, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const board = await Board.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { name },
    { new: true }
  );

  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  res.json(board);
});

app.delete("/boards/:id", auth, async (req, res) => {
  const board = await Board.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  // Delete all tasks associated with this board
  await Task.deleteMany({ boardId: req.params.id });

  res.json({ message: "Board deleted successfully" });
});

app.get("/tasks", auth, async (req, res) => {
  const { boardId } = req.query;
  if (!boardId) {
    return res.status(400).json({ message: "Board ID is required" });
  }
  const tasks = await Task.find({ userId: req.userId, boardId });
  res.json(tasks);
});



app.post("/tasks", auth, async (req, res) => {
  const { title, description, status, boardId } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (!boardId) {
    return res.status(400).json({ message: "Board ID is required" });
  }

  const newTask = await Task.create({
    title,
    description: description || "",
    status: status || "todo",
    boardId,
    userId: req.userId
  });

  res.json(newTask);
});


app.patch("/tasks/:id", auth, async (req, res) => {
  const { status, title, description } = req.body;

  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ message: "Title cannot be empty" });
  }

  const updates = {};
  if (status !== undefined) updates.status = status;
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    updates,
    { new: true }
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
});


app.delete("/tasks/:id", auth, async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task deleted successfully" });
});



app.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing Fields" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword
  });

  res.status(201).json({ message: "User created successfully" });
})


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

  res.json({ token });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
