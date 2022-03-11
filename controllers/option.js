const Option = require("../models/Option")
const {ErrorResponseJSON} = require("../utils/errorResponse")

// Create a option
const createOption = async (req, res) => {
  try {
    let { body } = req;

    const existingOptionTitle = await Option.find({title: body.title});
    const existingOptionValue = await Option.find({value: body.value});
    const allOptions = await Option.find();
    let totalValue = 0

    if (existingOptionTitle.length > 0 || existingOptionValue.length > 0) {
      return new ErrorResponseJSON(res, "This option already exists, update it instead!", 400)
    };

    for (const [key, option] of Object.entries(allOptions)) {
      totalValue += option.value
    }
    totalValue += body.value

    if (totalValue > 15) {
      return new ErrorResponseJSON(res, "Total value for all options exceeeds 15!", 400)
    }

    const option = await Option.create(body);

    res.status(200).json({
      success: true,
      data: option,
    });

  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get all options
const getAllOptions = async (req, res) => {
  try {
    const option = await Option.find();

    if (!option || option.length < 1) {
      return new ErrorResponseJSON(res, "Options not found!", 404)
    }
    res.status(200).json({
      success: true,
      data: option,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get a option's details
const getOption = async (req, res) => {
  try {
    const option = await Option.findById(req.params.id);
    if (!option) {
      return new ErrorResponseJSON(res, "Option not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: option,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Upadate a option's details
const updateOption = async (req, res) => {
  try {
    const { body } = req;

    const allOptions = await Option.find();
    const currentOption = await Option.findById(req.params.id)
    let totalValue = 0
    
    for (const [key, option] of Object.entries(allOptions)) {
      console.log(`\nkey: ${key}\n\noption: ${option}\n`)
      if (option.title != currentOption.title) {
        totalValue += option.value
      }
    }
    totalValue += body.value

    if (totalValue > 15) {
      return new ErrorResponseJSON(res, "Total value for all options exceeeds 15!", 400)
    }

    const option = await Option.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: option,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Delete a option
const deleteOption = async (req, res) => {
  try {
    const option = await Option.findByIdAndDelete(req.params.id);
    if (!option) {
      return new ErrorResponseJSON(res, "Option not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: option,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

module.exports = {
  createOption,
  getAllOptions,
  getOption,
  updateOption,
  deleteOption
}