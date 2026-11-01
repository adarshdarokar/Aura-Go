
const {
  getAllMuscleTutorials,
  getMuscleTutorialByName,
} = require("../services/muscleTutorialService");

const getAllMuscleTutorialsController = async (req, res, next) => {
  try {
    const tutorials = await getAllMuscleTutorials();

    return res.status(200).json({
      success: true,
      data: {
        tutorials,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMuscleTutorialByNameController = async (req, res, next) => {
  try {
    const tutorial = await getMuscleTutorialByName(req.params.muscle);

    return res.status(200).json({
      success: true,
      data: {
        tutorial,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMuscleTutorialsController,
  getMuscleTutorialByNameController,
};
