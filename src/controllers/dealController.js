import Deal from "../models/Deal.js";
import Lead from "../models/Lead.js";
import Ticket from "../models/Ticket.js";

export const getDeals = async (req, res, next) => {
  try {
    const deals = await Deal.find()
      .populate("associatedLeadId", "name company email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: deals });
  } catch (error) {
    next(error);
  }
};

export const getDealById = async (req, res, next) => {
  try {
    const deal = await Deal.findById(req.params.id).populate(
      "associatedLeadId",
      "name company email",
    );
    if (!deal) {
      res.status(404);
      throw new Error("Deal not found");
    }
    res.status(200).json({ success: true, data: deal });
  } catch (error) {
    next(error);
  }
};

export const createDeal = async (req, res, next) => {
  try {
    const dealData = { ...req.body };
    if (dealData.associatedLeadId) {
      const lead = await Lead.findById(dealData.associatedLeadId);
      if (lead) dealData.email = lead.email;
    }
    const deal = await Deal.create(dealData);
    res.status(201).json({ success: true, data: deal });
  } catch (error) {
    next(error);
  }
};

export const bulkCreateDeals = async (req, res, next) => {
  try {
    const dealsData = req.body;
    for (const dealData of dealsData) {
      if (dealData.associatedLeadId) {
        const lead = await Lead.findById(dealData.associatedLeadId);
        if (lead) dealData.email = lead.email;
      }
    }
    const deals = await Deal.insertMany(dealsData);
    res.status(201).json({ success: true, count: deals.length, data: deals });
  } catch (error) {
    next(error);
  }
};

export const updateDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      res.status(404);
      throw new Error("Deal not found");
    }

    const dealData = { ...req.body };
    const oldEmail = deal.email;

    if (dealData.associatedLeadId) {
      const lead = await Lead.findById(dealData.associatedLeadId);
      if (lead) dealData.email = lead.email;
    }

    const updatedDeal = await Deal.findByIdAndUpdate(req.params.id, dealData, {
      new: true,
      runValidators: true,
    });

    // Propagate email change to tickets
    if (updatedDeal.email !== oldEmail) {
      await Ticket.updateMany(
        { associatedDealId: updatedDeal._id },
        { email: updatedDeal.email }
      );
    }

    res.status(200).json({ success: true, data: updatedDeal });
  } catch (error) {
    next(error);
  }
};

export const deleteDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      res.status(404);
      throw new Error("Deal not found");
    }

    await deal.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteDeals = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of IDs",
      });
    }

    await Deal.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${ids.length} deals deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= SYNC EMAILS (Backfill) ================= */
export const syncDealEmails = async (req, res, next) => {
  try {
    const deals = await Deal.find({ associatedLeadId: { $ne: null } });
    let updated = 0;

    for (const deal of deals) {
      const lead = await Lead.findById(deal.associatedLeadId);
      if (lead && lead.email && deal.email !== lead.email) {
        await Deal.findByIdAndUpdate(deal._id, { email: lead.email });
        updated++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Synced emails for ${updated} deals out of ${deals.length} that have an associated lead.`,
    });
  } catch (error) {
    next(error);
  }
};
