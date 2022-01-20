const Staff = require("../models/Staff");
const cloudinary = require("cloudinary").v2;
const cloudinarySetup = require("../config/cloudinarysetup");
const fs = require("fs");
const axios = require("axios");
const { sign } = require("jsonwebtoken");
const generateToken = require("../helpers/generateToken");
const dotenv = require("dotenv").config();

const postUserDetails = async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    return res
      .status(400)
      .json({ success: false, msg: "No access token provided" });
  }
  const config = {
    method: "get",
    url: "https://graph.microsoft.com/v1.0/me",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const { data } = await axios(config);

    let checkEmail = data.mail.split("@");
    if (
      checkEmail[1] !== "lotusbetaanalytics.com" ||
      !checkEmail.includes("lotusbetaanalytics.com")
    ) {
      return res.status(400).json({ success: false, msg: "Invalid email" });
    }
    const { mail, displayName } = data;

    const checkStaff = await Staff.findOne({ email: mail });
    if (checkStaff) {
      return res.status(400).json({
        success: false,
        msg: "Staff already exists. Register with a different account.",
      });
    }

    const newStaff = new Staff({ email: mail, fullname: displayName });
    await newStaff.save();
    const token = generateToken({ staff: newStaff });
    return res.status(200).cookie("token", token).json({
      success: true,
      msg: "Staff successfuly added",
      token,
      data: newStaff,
    });
  } catch (err) {
    if (err.response.status === 401) {
      return res.status(401).json({ success: false, msg: err.response.data });
    }
    return res.status(500).json({ success: false, msg: err.message });
  }
};

const updateUser = async (req, res) => {
  const { user, body } = req;
  if (!body) {
    return res
      .status(400)
      .json({ success: false, msg: "No data was provided!" });
  }
  const staff = await Staff.findByIdAndUpdate(user._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: staff,
  });
};

const uploadDp = async (req, res) => {
  const { file, user } = req;

  const imageSizeLimit = 5 * 1024 * 1024; // 5Mb

  if (!file || file.size <= 0) {
    return res.status(400).json({
      success: false,
      msg: "Avatar field is required",
    });
  }

  if (file.size >= imageSizeLimit) {
    return res.status(400).json({
      success: false,
      msg: `Uploaded image size limit is ${imageSizeLimit / 1024 / 1024}Mb`,
    });
  }

  //check if the file is an image
  if (!file.mimetype.startsWith("image")) {
    fs.unlinkSync(file.path); //delete the file from memory if it's not an image

    return res.status(400).json({
      success: false,
      msg: "Uploaded file is not an image",
    });
  }

  // upload file to cloud storage
  await cloudinarySetup();
  const uploadedImage = await cloudinary.uploader.upload(file.path, {
    eager: [
      { height: 100, width: 100, crop: "fill" },
      { height: 150, width: 150, crop: "fill" },
    ],
  });

  if (!uploadedImage) {
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }

  await Staff.findByIdAndUpdate(user._id, {
    photo: uploadedImage.eager[0].secure_url,
  });
  res.status(200).json({
    success: true,
    photo: uploadedImage.eager[0].secure_url,
  });
};

module.exports = { postUserDetails, updateUser, uploadDp };
