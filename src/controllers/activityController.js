import Note from "../models/Note.js";
import Call from "../models/Call.js";
import Task from "../models/Task.js";
import Meeting from "../models/Meeting.js";
import Email from "../models/Email.js";

export const getActivitiesByEntity = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.params;

    if (!entityId || !entityType) {
      res.status(400);
      throw new Error("entityId and entityType are required");
    }

    const [notes, calls, tasks, meetings, emails] = await Promise.all([
      Note.find({ entityId, entityType }),
      Call.find({ entityId, entityType }),
      Task.find({ entityId, entityType }),
      Meeting.find({ entityId, entityType }),
      Email.find({ entityId, entityType }),
    ]);

    // Format them for the frontend
    const allActivities = [
      ...notes.map((n) => ({
        ...n._doc,
        id: n._id,
        type: "Note",
        title: `Note by ${n.createdBy || "User"}`,
        time: new Date(n.createdAt).toLocaleString(),
        group: "Recent",
      })),
      ...calls.map((c) => ({
        ...c._doc,
        id: c._id,
        type: "Call",
        title: "Call logged",
        time: `${c.date} at ${c.time}`,
        group: "Recent",
      })),
      ...tasks.map((t) => ({
        ...t._doc,
        id: t._id,
        type: "Task",
        title: t.name,
        time: `${t.date} at ${t.time}`,
        group: t.completed ? "Recent" : "Upcoming",
      })),
      ...meetings.map((m) => ({
        ...m._doc,
        id: m._id,
        type: "Meeting",
        title: m.title,
        time: `${m.date} at ${m.startTime}`,
        group: "Upcoming",
      })),
      ...emails.map((e) => ({
        ...e._doc,
        id: e._id,
        type: "Email",
        title: e.subject,
        time: `${e.date} at ${e.time}`,
        group: "Recent",
      })),
    ];

    // Sort by creation date or date field? 
    // Usually activity feed is sorted by time.
    allActivities.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

    res.status(200).json({ success: true, data: allActivities });
  } catch (error) {
    next(error);
  }
};

export const createActivity = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.params;
    const activityData = req.body;

    let result;
    const commonData = { ...activityData, entityId, entityType };

    switch (activityData.type) {
      case "Note":
        result = await Note.create({ ...commonData, content: activityData.content || activityData.note });
        break;
      case "Call":
        result = await Call.create(commonData);
        break;
      case "Task":
        result = await Task.create({ ...commonData, name: activityData.title || activityData.name });
        break;
      case "Meeting":
        result = await Meeting.create(commonData);
        break;
      case "Email":
        result = await Email.create(commonData);
        break;
      default:
        res.status(400);
        throw new Error("Invalid activity type");
    }

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const updateActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, ...updates } = req.body;

    let result;
    switch (type) {
      case "Note":
        result = await Note.findByIdAndUpdate(id, updates, { new: true });
        break;
      case "Call":
        result = await Call.findByIdAndUpdate(id, updates, { new: true });
        break;
      case "Task":
        result = await Task.findByIdAndUpdate(id, updates, { new: true });
        break;
      case "Meeting":
        result = await Meeting.findByIdAndUpdate(id, updates, { new: true });
        break;
      case "Email":
        result = await Email.findByIdAndUpdate(id, updates, { new: true });
        break;
      default:
        res.status(400);
        throw new Error("Invalid activity type");
    }

    if (!result) {
      res.status(404);
      throw new Error("Activity not found");
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
