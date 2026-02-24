import Deal from "../models/Deal.js";

export const getDeals = async (req, res, next) => {
  try {
    const deals = await Deal.find()
      .populate("associatedLeadId", "name company")
      .sort({ createdAt: -1 });
    res.status(200).json(deals);
  } catch (error) {
    next(error);
  }
};

export const getDealById = async (req, res, next) => {
  try {
    const deal = await Deal.findById(req.params.id).populate(
      "associatedLeadId",
      "name company",
    );
    if (!deal) {
      res.status(404);
      throw new Error("Deal not found");
    }
    res.status(200).json(deal);
  } catch (error) {
    next(error);
  }
};

export const createDeal = async (req, res, next) => {
  try {
    const deal = await Deal.create(req.body);
    res.status(201).json(deal);
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

    const updatedDeal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedDeal);
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
