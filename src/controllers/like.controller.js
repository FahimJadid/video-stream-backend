import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video
  const { videoId } = req.params;
  const { userId } = req.user;

  // Check if the videoId is a valid ObjectId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  // Check if the user has already liked the video
  const existingLike = await Like.findOneAndDelete({
    video: videoId,
    user: userId,
  });

  if (existingLike) {
    // User has already liked the video, so unlike it
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video unliked successfully"));
  } else {
    // User has not liked the video, so like it
    const newLike = await Like.create({ video: videoId, user: userId });
    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Video liked successfully"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on comment
  const { commentId } = req.params;
  const { userId } = req.user;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }

  const existingLike = await Like.findOneAndDelete({
    comment: commentId,
    user: userId,
  });

  if (existingLike) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment unliked successfully"));
  } else {
    const newLike = await Like.create({ comment: commentId, user: userId });
    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Comment liked successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on tweet
  const { tweetId } = req.params;
  const { userId } = req.user;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }

  const existingLike = await Like.findOneAndDelete({
    tweet: tweetId,
    user: userId,
  });

  if (existingLike) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet unliked successfully"));
  } else {
    const newLike = await Like.create({ tweet: tweetId, user: userId });
    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Tweet liked successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const { userId } = req.user;

  // Find all likes by the user
  const likes = await Like.find({ user: userId }).populate("video");

  return res
    .status(200)
    .json(new ApiResponse(200, likes, "Liked videos fetched successfully"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
