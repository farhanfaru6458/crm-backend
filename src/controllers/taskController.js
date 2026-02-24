import Task from "../models/Task.js";

export const getTasksByEntity = async (req, res, next) => {
  try {
    const { entityId, entityType } = req.query;

    if (!entityId || !entityType) {
      res.status(400);
      throw new Error("entityId and entityType are required");
    }

    const tasks = await Task.find({ entityId, entityType }).sort({
      createdAt: -1,
    });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const {
      name,
      date,
      time,
      note,
      priority,
      taskType,
      entityId,
      entityType,
      createdBy,
    } = req.body;

    if (!name || !date || !time || !entityId || !entityType) {
      res.status(400);
      throw new Error(
        "name, date, time, entityId, and entityType are required",
      );
    }

    const newTask = await Task.create({
      name,
      date,
      time,
      note,
      priority: priority || "Medium",
      taskType: taskType || "To-Do",
      entityId,
      entityType,
      createdBy: createdBy || "User",
    });

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const toggleTaskCompletion = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    task.completed = !task.completed;
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};
