import Meeting from "../models/Meeting.js";

export const getMeetingsByEntity = async (req, res, next) => {
  try {
    const { entityId, entityType } = req.query;

    if (!entityId || !entityType) {
      res.status(400);
      throw new Error("entityId and entityType are required");
    }

    const meetings = await Meeting.find({ entityId, entityType }).sort({
      createdAt: -1,
    });
    res.status(200).json(meetings);
  } catch (error) {
    next(error);
  }
};

export const createMeeting = async (req, res, next) => {
  try {
    const {
      title,
      date,
      startTime,
      endTime,
      note,
      duration,
      attendees,
      location,
      reminder,
      entityId,
      entityType,
      createdBy,
    } = req.body;

    if (!title || !date || !startTime || !endTime || !entityId || !entityType) {
      res.status(400);
      throw new Error(
        "title, date, startTime, endTime, entityId, and entityType are required",
      );
    }

    const newMeeting = await Meeting.create({
      title,
      date,
      startTime,
      endTime,
      note,
      duration: duration || "N/A",
      attendees: attendees || [],
      location: location || "N/A",
      reminder: reminder || "N/A",
      entityId,
      entityType,
      createdBy: createdBy || "User",
    });

    res.status(201).json(newMeeting);
  } catch (error) {
    next(error);
  }
};
