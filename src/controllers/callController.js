import Call from "../models/Call.js";

export const getCallsByEntity = async (req, res, next) => {
  try {
    const { entityId, entityType } = req.query;

    if (!entityId || !entityType) {
      res.status(400);
      throw new Error("entityId and entityType are required");
    }

    const calls = await Call.find({ entityId, entityType }).sort({
      createdAt: -1,
    });
    res.status(200).json(calls);
  } catch (error) {
    next(error);
  }
};

export const createCall = async (req, res, next) => {
  try {
    const {
      outcome,
      duration,
      date,
      time,
      note,
      entityId,
      entityType,
      createdBy,
    } = req.body;

    if (!outcome || !date || !time || !entityId || !entityType) {
      res.status(400);
      throw new Error(
        "outcome, date, time, entityId, and entityType are required",
      );
    }

    const newCall = await Call.create({
      outcome,
      duration: duration || "N/A",
      date,
      time,
      note,
      entityId,
      entityType,
      createdBy: createdBy || "User",
    });

    res.status(201).json(newCall);
  } catch (error) {
    next(error);
  }
};
