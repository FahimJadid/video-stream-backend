import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination

  let filter = {};
  if (userId && isValidObjectId(userId)) {
    filter.user = userId;
  }

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  const videos = await Video.find(filter)
    .sort({
      [sortBy]: sortType === "desc" ? -1 : 1,
    })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const totalVideos = await Video.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        totalVideos,
        totalPages: Math.ceil(totalVideos / limit),
        currentPage: Number(page),
      },
      "Videos fetched successfully"
    )
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  console.log(req.files);
  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  // upload video to cloudinary
  const video = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  console.log(video);
  console.log(thumbnail);

  if (!video.url) {
    throw new ApiError(500, "Failed to upload video");
  }

  if (!thumbnail.url) {
    throw new ApiError(500, "Failed to upload thumbnail");
  }

  const newVideo = await Video.create({
    title,
    description,
    videoFile: video.url,
    duration: video.duration,
    thumbnail: thumbnail.url,
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newVideo, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  console.log(videoId);

  // Check if the videoId is a valid ObjectId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  // Find the video by its id
  const video = await Video.findById(videoId);

  // Check if the video exists
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video retrieved successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.path;

  // Check if the videoId is a valid ObjectId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  if (!title && !description && !thumbnailLocalPath) {
    throw new ApiError(400, "At least one field is required");
  }

  const video = await Video.findById(videoId);

  let thumbnailUrl = video.thumbnail;

  if (thumbnailLocalPath) {
    const oldVideoPublicId = video.thumbnail?.split("/").pop().split(".")[0];

    if (oldVideoPublicId) {
      await deleteFromCloudinary(oldVideoPublicId);
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail || !thumbnail.url) {
      throw new ApiError(400, "Failed to upload Thumbnail");
    }

    thumbnailUrl = thumbnail.url;
  }

  // Find the video by its id
  const updateVideoDetails = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnailUrl,
      },
    },
    { new: true }
  ).exec();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateVideoDetails, "Video updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
