import Company from "../models/Company.js";

/**
 * @desc    Create Company
 * @route   POST /api/companies
 */
export const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

/**
 * @desc    Bulk Create Companies
 * @route   POST /api/companies/bulk-create
 */
export const bulkCreateCompanies = async (req, res) => {
  try {
    const companies = await Company.insertMany(req.body);

    res.status(201).json({
      success: true,
      message: `${companies.length} companies created successfully`,
      data: companies,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

/**
 * @desc    Get All Companies (Search + Filter + Pagination)
 * @route   GET /api/companies
 */
export const getCompanies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      industry,
      city,
      country,
      from,
      to,
    } = req.query;

    const query = {};

    //  Search (name, phone, city)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    //  Filters
    if (industry) query.industry = industry;
    if (city) query.city = city;
    if (country) query.country = country;
    // if (leadStatus) query.leadStatus = leadStatus;

    //  Date Range Filter
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const companies = await Company.find(query)
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(Number(limit));

    const total = await Company.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: companies,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

/**
 * @desc    Get Single Company
 * @route   GET /api/companies/:id
 */
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

/**
 * @desc    Update Company
 * @route   PUT /api/companies/:id
 */
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Company updated successfully",
      data: updatedCompany,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

/**
 * @desc    Delete Company
 * @route   DELETE /api/companies/:id
 */
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    await company.deleteOne();

    res.json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

/**
 * @desc    Bulk Delete Companies
 * @route   POST /api/companies/bulk-delete
 */
export const bulkDeleteCompanies = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of IDs",
      });
    }

    await Company.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${ids.length} companies deleted successfully`,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};