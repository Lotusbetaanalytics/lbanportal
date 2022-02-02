const UserInitiative = require("../models/Initiative");

const addInitiative = async (req, res) => {
  try {
    const { body } = req;

    const initiative = new UserInitiative({
      ...body,
    });

    await initiative.save();

    return res.status(200).json({
      success: true,
      msg: "Initiative added",
      data: initiative,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};
const removeInitiative = async (req, res) => {};

module.exports = {
  addInitiative,
  removeInitiative,
};
