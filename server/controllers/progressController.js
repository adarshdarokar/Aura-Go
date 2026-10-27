const Progress = require("../models/Progress");

const createProgress = async (req, res, next) => {
  try {
    const {
      date,
      weight,
      bodyMeasurements,
      notes,
    } = req.body;

    const hasWeight =
      weight !== undefined && weight !== null && weight !== "";

    const hasMeasurements =
      bodyMeasurements &&
      Object.values(bodyMeasurements).some(
        (value) => value !== "" && value !== null && value !== undefined
      );

    if (!hasWeight && !hasMeasurements) {
      return res.status(400).json({
        success: false,
        message: "Enter weight or at least one body measurement.",
      });
    }

    const progress = await Progress.create({
      user: req.user.id,
      date: date ? new Date(date) : new Date(),
      weight: hasWeight ? Number(weight) : null,
      bodyMeasurements,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Progress recorded successfully.",
      data: { progress },
    });
  } catch (error) {
    next(error);
  }
};

const getProgressHistory = async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 30, page = 1 } = req.query;

    const filter = { user: req.user.id };

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);

      if (
        (startDate && Number.isNaN(filter.date.$gte.getTime())) ||
        (endDate && Number.isNaN(filter.date.$lte.getTime()))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid date filter.",
        });
      }
    }

    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 30));

    const [progress, total] = await Promise.all([
      Progress.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean(),
      Progress.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        progress,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages: Math.ceil(total / safeLimit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress entry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Progress entry deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProgress,
  getProgressHistory,
  deleteProgress,
};