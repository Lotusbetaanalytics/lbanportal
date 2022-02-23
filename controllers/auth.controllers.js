const Staff = require("../models/Staff");
const cloudinary = require("cloudinary").v2;
const cloudinarySetup = require("../config/cloudinarysetup");
const fs = require("fs");
const axios = require("axios");
const generateToken = require("../helpers/generateToken");
const dotenv = require("dotenv").config();
const { strToBase64 } = require("../utils/generic");
const open = require("open");

//Register new users and send a token
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
    const { data } = await axios(config); //get user data from active directory

    const checkEmail = data.mail.split("@"); //split the email address
    if (
      checkEmail[1] !== "lotusbetaanalytics.com" ||
      !checkEmail.includes("lotusbetaanalytics.com") //check if the email address has lotusbetaanalytics.com domain
    ) {
      return res.status(400).json({ success: false, msg: "Invalid email" });
    }
    const { mail, displayName } = data;

    const checkStaff = await Staff.findOne({ email: mail }); //check if there is a staff with the email in the db
    if (checkStaff) {
      const token = generateToken({ staff: checkStaff }); //generate token
      return res.status(201).cookie("token", token).json({
        success: true,
        token,
      });
    }
    const newStaff = new Staff({ email: mail, fullname: displayName });
    await newStaff.save(); //add new user to the db
    const token = generateToken({ staff: newStaff }); //generate token
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

//Upadate a user's details
const updateUser = async (req, res) => {
  try {
    const { user, body } = req;

    if (!body) {
      return res
        .status(400)
        .json({ success: false, msg: "No data was provided!" });
    }
    const staff = await Staff.findByIdAndUpdate(user, body, {
      new: true,
      runValidators: true,
    });

    if (!staff) {
      return res.status(400).json({
        success: false,
        msg: "Staff not found",
      });
    }

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

// upload profile picture
const uploadDp = async (req, res) => {
  try {
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

    //convert the image to base64
    const base64Image = strToBase64(uploadedImage.eager[0].url);

    await Staff.findByIdAndUpdate(
      user,
      {
        photo: base64Image,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({
      success: true,
      photo: base64Image,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

const getUserDP = async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    return res
      .status(400)
      .json({ success: false, msg: "No access token provided" });
  }
  const config = {
    method: "get",
    url: "https://graph.microsoft.com/v1.0/me/photo/$value",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const { data } = await axios(config);
    return res.status(200).json({
      photo: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// upload documents
const uploadDocuments = async (req, res) => {
  try {
    const { files, user } = req;

    if (!files || files.size <= 0) {
      return res.status(400).json({
        success: false,
        msg: "No file was provided",
      });
    }

    const findUser = await Staff.findByIdAndUpdate(
      user,
      { files: files },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: files });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get all user details
const getAllStaff = async (req, res) => {
  try {
    const allStaff = await Staff.find().lean().populate("role");

    return res.status(200).json({
      success: true,
      data: allStaff,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const { params } = req;

    const foundStaff = await Staff.findByIdAndDelete(params.id);

    if (!foundStaff) {
      return res.status(404).json({
        success: false,
        msg: "Staff member not found",
      });
    }

    const allStaff = await Staff.find().lean().populate("role");

    return res.status(200).json({
      success: true,
      msg: "Staff deleted",
      data: allStaff,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

module.exports = {
  postUserDetails,
  updateUser,
  uploadDocuments,
  uploadDp,
  getAllStaff,
  deleteStaff,
  getUserDP,
};
