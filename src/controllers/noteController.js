import Note from "../models/Note.js";

export const getNotesByEntity = async (req, res, next) => {
  try {
    const { entityId, entityType } = req.query;

    if (!entityId || !entityType) {
      res.status(400);
      throw new Error("entityId and entityType are required");
    }

    const notes = await Note.find({ entityId, entityType }).sort({
      createdAt: -1,
    });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const { content, entityId, entityType, createdBy } = req.body;

    if (!content || !entityId || !entityType) {
      res.status(400);
      throw new Error("content, entityId, and entityType are required");
    }

    const newNote = await Note.create({
      content,
      entityId,
      entityType,
      createdBy: createdBy || "User",
    });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};
